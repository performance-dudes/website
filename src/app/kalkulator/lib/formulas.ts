import type {
  Benefit,
  BenefitAtTime,
  BenefitOperativ,
  CalculatorInputs,
  PhaseId,
  PhaseInfo,
  TimeSlice,
} from "./types";
import {
  FAKTOR_BY_PHASE,
  KOMPOUNDING_RATE,
  PD_CAPACITY,
  PD_UNIT_COST,
  PD_UNIT_COST_MAX,
  PD_BURST_FACTOR,
  REFERENCE_DEV_MONTHLY,
  ENABLEMENT_FULL_UPLIFT,
  ENABLEMENT_PARTIAL_UPLIFT,
} from "./constants";

// ---------------------------------------------------------------------------
// Basic cost helpers
// ---------------------------------------------------------------------------

export function teamKostenMonthly(devCount: number, costPerDev: number): number {
  return (devCount * costPerDev) / 12;
}

// Fixed reference for calculations (replaces costPerDev-based teamKostenReferenz)
export function fixedTeamKostenRef(devCount: number): number {
  if (devCount === 0) return PD_CAPACITY * PD_UNIT_COST; // 40k green-field
  return devCount * REFERENCE_DEV_MONTHLY;
}

// UX-only: team costs for slider stop positioning (uses costPerDev)
export function teamKostenForSlider(devCount: number, costPerDev: number): number {
  if (devCount === 0) return PD_CAPACITY * PD_UNIT_COST;
  return teamKostenMonthly(devCount, costPerDev);
}

// PD effective persons engaged (with burst scaling).
// Up to PD_UNIT_COST/person = standard capacity. Beyond that = burst capacity.
// Returns effective person-units (e.g. 1.33 for one PD at full burst).
export function pdPersonsEngaged(budget: number): number {
  if (budget <= 0) return 0;
  const maxStandard = PD_CAPACITY * PD_UNIT_COST; // 40k
  if (budget <= maxStandard) {
    // Standard range: linear scaling up to PD_CAPACITY
    return budget / PD_UNIT_COST;
  }
  // Burst range: beyond standard, each extra euro buys burst capacity
  // Max burst budget = PD_CAPACITY * PD_UNIT_COST_MAX = 50k
  const maxBurst = PD_CAPACITY * PD_UNIT_COST_MAX;
  const clampedBudget = Math.min(budget, maxBurst);
  const budgetPerPD = clampedBudget / PD_CAPACITY;
  // Scale from 1.0 to PD_BURST_FACTOR (1.33) as budgetPerPD goes from PD_UNIT_COST to PD_UNIT_COST_MAX
  const burstScale = 1 + (PD_BURST_FACTOR - 1)
    * Math.min(1, (budgetPerPD - PD_UNIT_COST) / (PD_UNIT_COST_MAX - PD_UNIT_COST));
  return PD_CAPACITY * burstScale;
}

// PD dev-equivalents (honest, capped with overtime)
export function pdDevEquivalents(budget: number, faktor: number): number {
  return pdPersonsEngaged(budget) * faktor;
}

// Team effective dev-equivalents (the hidden 3-4x from feature-anteil shift)
export function teamEffectiveDevEq(
  devCount: number,
  featureAnteilCurrent: number,
  featureAnteilStart: number,
  enablementBaseline: number,
): number {
  if (devCount === 0) return 0;
  if (featureAnteilStart <= 0) return devCount * enablementBaseline;
  const featureMult = featureAnteilCurrent / featureAnteilStart;
  return devCount * featureMult * enablementBaseline;
}

// ---------------------------------------------------------------------------
// Phase calendar weeks (dynamic phase thresholds based on PD count)
// ---------------------------------------------------------------------------

export function phaseCalendarWeeks(
  phases: readonly PhaseInfo[],
  pdPersons: number,
): readonly number[] {
  // Returns cumulative calendar weeks for each phase
  const result: number[] = [];
  let calendarWeek = 0;

  for (let i = 0; i < phases.length; i++) {
    const phase = phases[i]!;
    if (phase.teamBound) {
      // Fixed calendar time regardless of PD count
      calendarWeek += phase.durationWeeks;
    } else {
      // PD-work scales: more PDs = faster
      // durationWeeks is at 1 PD. With N PDs, takes durationWeeks/N calendar weeks.
      const effectivePDs = Math.max(pdPersons, 0.01); // avoid division by zero
      calendarWeek += phase.durationWeeks / effectivePDs;
    }
    result.push(calendarWeek);
  }

  return result;
}

// ---------------------------------------------------------------------------
// Phase + faktor at a given iteration
// ---------------------------------------------------------------------------

export function phaseAtIteration(
  calendarWeek: number,
  phases: readonly PhaseInfo[],
  phaseWeeks: readonly number[],
): { phase: PhaseId; faktor: number } {
  if (calendarWeek <= 0) return { phase: 0, faktor: 0 };

  let currentPhase: PhaseId = 0;
  let prevThreshold = 0;
  let nextThreshold = phaseWeeks[0] ?? 0;

  for (let i = 0; i < phases.length; i++) {
    const threshold = phaseWeeks[i]!;
    if (calendarWeek >= threshold) {
      currentPhase = phases[i]!.id;
      prevThreshold = threshold;
      nextThreshold = i + 1 < phases.length ? phaseWeeks[i + 1]! : threshold;
    } else {
      nextThreshold = threshold;
      break;
    }
  }

  // Linear interpolation between current and next phase faktor
  const currentFaktor = FAKTOR_BY_PHASE[currentPhase];
  const nextPhaseId = Math.min(currentPhase + 1, 8) as PhaseId;
  const nextFaktor = FAKTOR_BY_PHASE[nextPhaseId];

  let faktor: number;
  if (nextThreshold === prevThreshold || currentPhase >= 5) {
    faktor = currentFaktor;
  } else {
    const progress = (calendarWeek - prevThreshold) / (nextThreshold - prevThreshold);
    faktor = currentFaktor + progress * (nextFaktor - currentFaktor);
  }

  // Compounding drift after Phase 5
  const phase5Week = phaseWeeks[5] ?? Infinity;
  if (calendarWeek > phase5Week) {
    faktor += KOMPOUNDING_RATE * Math.log(1 + calendarWeek - phase5Week);
  }

  return { phase: currentPhase, faktor };
}

// ---------------------------------------------------------------------------
// Output calculations (legacy pdOutput/greenFieldDevEquivalents replaced by
// pdDevEquivalents above)
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Feature-Anteil
// ---------------------------------------------------------------------------

export function featureAnteil(
  week: number,
  startPercent: number,
  pdPersons: number,
  devCount: number,
  activeFeatureBenefitEffects: number, // sum of effekt_groesse of active feature-benefits
): number {
  const ziel = 0.8;
  const start = startPercent / 100;
  // k scales with PD-to-team ratio: 0.75 PDs on 40 devs is much less impact than on 5 devs
  // Reference: 1 PD on 5 devs → k=0.05 (same as original model)
  const effectiveDevs = Math.max(devCount, 1); // avoid /0, green-field handled separately
  const kBase = 0.25 * pdPersons / effectiveDevs;
  const kBoost = activeFeatureBenefitEffects * 0.01;
  const k = kBase + kBoost;
  return ziel - (ziel - start) * Math.exp(-k * week);
}

// ---------------------------------------------------------------------------
// Enablement
// ---------------------------------------------------------------------------

export function enablementMultiplier(
  week: number,
  enablementStartWeek: number,
): number {
  const weeksSinceStart = week - enablementStartWeek;
  if (weeksSinceStart < 0) return 1.0; // before enablement
  if (weeksSinceStart < 12) return 0.6; // 12-week dip (40% loss)
  if (weeksSinceStart < 20) {
    // 8-week linear recovery
    const recoveryProgress = (weeksSinceStart - 12) / 8;
    return 0.6 + 0.4 * recoveryProgress;
  }
  return 1.0; // fully recovered
}

// Team baseline multiplier during and after enablement.
// The team starts learning from the moment enablement begins (not after recovery).
// The ramp is gradual (exponential approach). PD's output dip is the cost paid
// simultaneously via enablementMultiplier — these are two separate effects.
// Target depends on phase: 1.5x before Phase 6, 3.0x after Phase 6.
export function teamBaseline(
  week: number,
  enablement: boolean,
  enablementStartWeek: number,
  phase6Threshold: number = Infinity,
): number {
  if (!enablement) return 1.0;
  const weeksSinceStart = week - enablementStartWeek;
  if (weeksSinceStart < 0) return 1.0; // enablement not started yet

  const target = week >= phase6Threshold
    ? ENABLEMENT_FULL_UPLIFT   // 3.0x — team is AI-native
    : ENABLEMENT_PARTIAL_UPLIFT; // 1.5x — learning but not yet independent

  // Exponential approach from the start of enablement.
  // k=0.03: slow early rise, ~50% at 23 weeks, ~80% at 50 weeks.
  // Visible after a few weeks, meaningful after ~10 weeks.
  const k = 0.03;
  const progress = 1 - Math.exp(-k * weeksSinceStart);
  return 1.0 + (target - 1.0) * progress;
}

// ---------------------------------------------------------------------------
// Benefit progress curves
// ---------------------------------------------------------------------------

export function sigmoid(t: number, anlaufzeit: number): number {
  if (anlaufzeit <= 0) return 1;
  const midpoint = anlaufzeit / 2;
  const steepness = 6 / anlaufzeit; // reaches ~95% at anlaufzeit
  return 1 / (1 + Math.exp(-steepness * (t - midpoint)));
}

export function treppenSmooth(
  t: number,
  stufen: readonly number[],
  k: number,
): number {
  const n = stufen.length;
  if (n === 0) return 0;
  let sum = 0;
  for (const stufe of stufen) {
    sum += 1 / (1 + Math.exp(-k * (t - stufe)));
  }
  return sum / n;
}

export function benefitProgress(
  week: number,
  benefit: Benefit,
  phaseReachedWeek: number,
  actualAnlaufzeit: number, // scaled by budget
  enablementActive: boolean,
  enablementStartWeek: number,
): number {
  const effectiveWeek = week - phaseReachedWeek;
  if (effectiveWeek < 0) return 0; // phase not reached

  // Stretch anlaufzeit by 40% during enablement dip
  let adjustedAnlaufzeit = actualAnlaufzeit;
  if (enablementActive) {
    const weeksSinceEnablement = week - enablementStartWeek;
    if (weeksSinceEnablement >= 0 && weeksSinceEnablement < 12) {
      adjustedAnlaufzeit = actualAnlaufzeit * 1.4;
    }
  }

  switch (benefit.kurvenForm) {
    case "sigmoid":
      return sigmoid(effectiveWeek, adjustedAnlaufzeit);
    case "linear_ramp":
      return Math.min(1, effectiveWeek / adjustedAnlaufzeit);
    case "treppen":
      return treppenSmooth(
        effectiveWeek,
        benefit.treppenStufen ?? [],
        2.0,
      );
  }
}

// ---------------------------------------------------------------------------
// Horizon
// ---------------------------------------------------------------------------

export function maxIterationsInHorizon(
  horizonMonths: number,
): number {
  return horizonMonths * 4.33;
}

// ---------------------------------------------------------------------------
// Timeline generation
// ---------------------------------------------------------------------------

export function generateTimeline(
  inputs: CalculatorInputs,
  phases: readonly PhaseInfo[],
  benefits: readonly Benefit[],
): readonly TimeSlice[] {
  const isGreenField = inputs.devCount === 0;
  const maxIter = maxIterationsInHorizon(inputs.horizonMonths);
  const totalSteps = Math.max(1, Math.ceil(maxIter));
  const slices: TimeSlice[] = [];

  // Precompute phase calendar-week thresholds
  const pdPersons = pdPersonsEngaged(inputs.budgetMonthly);
  const phaseWeeks = phaseCalendarWeeks(phases, pdPersons);

  // Find enablement start week (Phase 2 threshold)
  const enablementStartWeek = inputs.enablement ? (phaseWeeks[2] ?? Infinity) : Infinity;

  // Phase 6 threshold: team AI-skill established → full 3x enablement uplift
  const phase6Week = phaseWeeks[6] ?? Infinity;

  const featureAnteilStart = inputs.featurePercent / 100;

  for (let iter = 0; iter <= totalSteps; iter++) {
    // 1. Phase + Faktor (iter = calendar week)
    const { phase, faktor: rawFaktor } = phaseAtIteration(iter, phases, phaseWeeks);

    // 2. Enablement multiplier on PD output
    const enMult = inputs.enablement
      ? enablementMultiplier(iter, enablementStartWeek)
      : 1.0;
    const effectiveFaktor = rawFaktor * enMult;

    // 3. PD dev-equivalents (honest, capacity-capped)
    const pdDevEq = pdPersons * effectiveFaktor;

    // 4. Team baseline (1.0 / 1.5 partial / 3.0 full enablement)
    const teamBaselineVal = isGreenField
      ? 0
      : teamBaseline(iter, inputs.enablement, enablementStartWeek, phase6Week);

    // 5. Feature-Anteil (skip for Green-Field)
    const activeFeatureEffects = benefits
      .filter(
        (b): b is BenefitOperativ =>
          b.kachelTyp === "operativ" &&
          (b as BenefitOperativ).kpiBetroffen.includes("feature_anteil"),
      )
      .filter((b) => {
        const phaseIdx = phases.findIndex((p) => p.id === b.phaseVoraussetzung);
        if (phaseIdx < 0) return false;
        return iter >= (phaseWeeks[phaseIdx] ?? Infinity);
      })
      .reduce((sum, b) => sum + b.effektGroesse, 0);

    const featAnteil = isGreenField
      ? 0
      : featureAnteil(
          iter,
          inputs.featurePercent,
          pdPersons,
          inputs.devCount,
          activeFeatureEffects,
        );

    // 6. Feature multiplier and team effective
    // featureMult is tracked for the feature chart but NOT used in teamEff.
    // Enablement (teamBaseline up to 3x) already captures the productivity gain
    // that includes the feature-anteil shift. Multiplying both would double-count.
    const featureMult =
      featureAnteilStart > 0 ? featAnteil / featureAnteilStart : 1;
    const teamEff = isGreenField
      ? 0
      : inputs.devCount * teamBaselineVal;

    // 7. Gesamt-output (relative: how many dev-equivalents per original dev)
    const gesamtRel = isGreenField
      ? pdDevEq
      : (teamEff + pdDevEq) / inputs.devCount;

    // 8. Benefit statuses
    const benefitStates: BenefitAtTime[] = benefits.map((b) => {
      const phaseIdx = phases.findIndex((p) => p.id === b.phaseVoraussetzung);
      const phaseThreshold = phaseIdx >= 0 ? (phaseWeeks[phaseIdx] ?? Infinity) : Infinity;
      const phaseReached = iter >= phaseThreshold;

      if (!phaseReached) {
        return {
          benefit: b,
          status: "wartend" as const,
          progress: 0,
          reachableIteration:
            phaseThreshold <= maxIter ? phaseThreshold : null,
        };
      }

      const progress = benefitProgress(
        iter,
        b,
        phaseThreshold,
        b.anlaufzeitIterationen,
        inputs.enablement,
        enablementStartWeek,
      );
      const isActive = progress >= 0.95; // ~95% = practically at plateau

      return {
        benefit: b,
        status: isActive ? ("aktiv" as const) : ("im-aufbau" as const),
        progress,
        reachableIteration: phaseThreshold,
      };
    });

    slices.push({
      iteration: iter,
      phase,
      faktor: effectiveFaktor,
      pdOutput: pdDevEq,
      teamBaseline: teamBaselineVal,
      gesamtOutput: gesamtRel,
      featureAnteil: featAnteil,
      pdDevEq,
      pdPersonsEngaged: pdPersons,
      teamEffective: teamEff,
      featureMultiplier: featureMult,
      benefits: benefitStates,
    });
  }

  // Post-PD departure phase: after enablement completes, show 12 extra weeks
  // without PD to demonstrate substrate persistence
  if (
    inputs.enablement &&
    !isGreenField &&
    slices.length > 0 &&
    totalSteps >= enablementStartWeek + 20
  ) {
    const lastMainSlice = slices[slices.length - 1]!;
    const lastPhase = lastMainSlice.phase;
    const lastFeatureAnteil = lastMainSlice.featureAnteil; // floor: never drop below this

    for (let extra = 1; extra <= 12; extra++) {
      const iter = totalSteps + extra;

      // No PD contribution
      const pdPersonsPost = 0;
      const pdDevEqPost = 0;

      // Team baseline continues the gradual ramp (same function, just further along)
      const teamBaselinePost = teamBaseline(
        iter, true, enablementStartWeek, phase6Week,
      );

      // Feature-anteil continues converging with substrate-maintained k
      const activeFeatureEffectsPost = benefits
        .filter(
          (b): b is BenefitOperativ =>
            b.kachelTyp === "operativ" &&
            (b as BenefitOperativ).kpiBetroffen.includes("feature_anteil"),
        )
        .filter((b) => {
          const phaseIdx = phases.findIndex((p) => p.id === b.phaseVoraussetzung);
          if (phaseIdx < 0) return false;
          return iter >= (phaseWeeks[phaseIdx] ?? Infinity);
        })
        .reduce((sum, b) => sum + b.effektGroesse, 0);

      // Substrate keeps feature-anteil at least at the level PD achieved.
      // Slow continued convergence toward 80% via substrate alone.
      const kSubstrate = 0.02 + activeFeatureEffectsPost * 0.01;
      const weeksSinceDeparture = extra;
      const remainingGap = 0.8 - lastFeatureAnteil;
      const featAnteilPost = lastFeatureAnteil + remainingGap * (1 - Math.exp(-kSubstrate * weeksSinceDeparture));

      const featureMultPost =
        featureAnteilStart > 0 ? featAnteilPost / featureAnteilStart : 1;
      // Same fix as main loop: no featureMultPost in teamEffPost (avoids double-counting)
      const teamEffPost = inputs.devCount * teamBaselinePost;
      const gesamtRelPost = (teamEffPost + pdDevEqPost) / inputs.devCount;

      // Benefits that were "aktiv" stay "aktiv"
      const benefitStatesPost: BenefitAtTime[] = benefits.map((b) => {
        const phaseIdx = phases.findIndex((p) => p.id === b.phaseVoraussetzung);
        const phaseThreshold = phaseIdx >= 0 ? (phaseWeeks[phaseIdx] ?? Infinity) : Infinity;
        const phaseReached = iter >= phaseThreshold;

        if (!phaseReached) {
          return {
            benefit: b,
            status: "wartend" as const,
            progress: 0,
            reachableIteration: null,
          };
        }

        const progress = benefitProgress(
          iter,
          b,
          phaseThreshold,
          b.anlaufzeitIterationen,
          inputs.enablement,
          enablementStartWeek,
        );
        const isActive = progress >= 0.95;

        return {
          benefit: b,
          status: isActive ? ("aktiv" as const) : ("im-aufbau" as const),
          progress,
          reachableIteration: phaseThreshold,
        };
      });

      slices.push({
        iteration: iter,
        phase: lastPhase,
        faktor: 0,
        pdOutput: pdDevEqPost,
        teamBaseline: teamBaselinePost,
        gesamtOutput: gesamtRelPost,
        featureAnteil: featAnteilPost,
        pdDevEq: pdDevEqPost,
        pdPersonsEngaged: pdPersonsPost,
        teamEffective: teamEffPost,
        featureMultiplier: featureMultPost,
        benefits: benefitStatesPost,
      });
    }
  }

  return slices;
}

// ---------------------------------------------------------------------------
// KPI helpers
// ---------------------------------------------------------------------------

export function kpiValue(
  startValue: number,
  plateauValue: number,
  combinedProgress: number, // 0-1, from associated benefits
): number {
  return startValue + (plateauValue - startValue) * combinedProgress;
}

export function combinedBenefitProgress(
  iteration: number,
  kpiId: string,
  benefits: readonly Benefit[],
  phases: readonly PhaseInfo[],
  phaseWeeks: readonly number[],
  enablement: boolean,
  enablementStartIter: number,
): number {
  const relevant = benefits.filter(
    (b): b is BenefitOperativ =>
      b.kachelTyp === "operativ" &&
      (b as BenefitOperativ).kpiBetroffen.includes(kpiId),
  );
  if (relevant.length === 0) return 0;

  const totalWeight = relevant.reduce((s, b) => s + b.effektGroesse, 0);
  if (totalWeight === 0) return 0;

  const weightedSum = relevant.reduce((s, b) => {
    const phaseIdx = phases.findIndex((p) => p.id === b.phaseVoraussetzung);
    const phaseThreshold = phaseIdx >= 0 ? (phaseWeeks[phaseIdx] ?? Infinity) : Infinity;
    const progress = benefitProgress(
      iteration,
      b,
      phaseThreshold,
      b.anlaufzeitIterationen,
      enablement,
      enablementStartIter,
    );
    return s + progress * b.effektGroesse;
  }, 0);

  return weightedSum / totalWeight;
}
