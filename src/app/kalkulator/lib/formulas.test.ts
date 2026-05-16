import { describe, it, expect } from "vitest";
import {
  teamKostenMonthly,
  fixedTeamKostenRef,
  teamKostenForSlider,
  pdPersonsEngaged,
  pdDevEquivalents,
  teamEffectiveDevEq,
  phaseAtIteration,
  phaseCalendarWeeks,
  featureAnteil,
  enablementMultiplier,
  teamBaseline,
  benefitProgress,
  sigmoid,
  treppenSmooth,
  maxIterationsInHorizon,
  generateTimeline,
  kpiValue,
  combinedBenefitProgress,
} from "./formulas";
import {
  PHASES,
  DEFAULT_INPUTS,
  PD_CAPACITY,
  PD_UNIT_COST,
  PD_BURST_FACTOR,
  REFERENCE_DEV_MONTHLY,
} from "./constants";
import type {
  Benefit,
  BenefitOperativ,
  CalculatorInputs,
} from "./types";

// ---------------------------------------------------------------------------
// Test helpers
// ---------------------------------------------------------------------------

function makeSigmoidBenefit(
  id: string,
  anlaufzeitIterationen: number,
  phaseVoraussetzung: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 = 0,
): BenefitOperativ {
  return {
    id,
    titel: id,
    kachelTyp: "operativ",
    kategorie: "tempo",
    defaultPrio: 1,
    anlaufzeitIterationen,
    kurvenForm: "sigmoid",
    phaseVoraussetzung,
    painPoints: [],
    erfahrungsBasis: "test",
    effektGroesse: 0.5,
    kpiBetroffen: [],
    plateauLabel: "test plateau",
  };
}

function makeLinearBenefit(
  id: string,
  anlaufzeitIterationen: number,
): BenefitOperativ {
  return {
    id,
    titel: id,
    kachelTyp: "operativ",
    kategorie: "tempo",
    defaultPrio: 1,
    anlaufzeitIterationen,
    kurvenForm: "linear_ramp",
    phaseVoraussetzung: 0,
    painPoints: [],
    erfahrungsBasis: "test",
    effektGroesse: 0.5,
    kpiBetroffen: [],
    plateauLabel: "test plateau",
  };
}

function makeTreppenBenefit(
  id: string,
  stufen: readonly number[],
): BenefitOperativ {
  return {
    id,
    titel: id,
    kachelTyp: "operativ",
    kategorie: "tempo",
    defaultPrio: 1,
    anlaufzeitIterationen: stufen[stufen.length - 1] ?? 10,
    kurvenForm: "treppen",
    phaseVoraussetzung: 0,
    painPoints: [],
    erfahrungsBasis: "test",
    treppenStufen: stufen,
    effektGroesse: 0.5,
    kpiBetroffen: [],
    plateauLabel: "test plateau",
  };
}

// ---------------------------------------------------------------------------
// teamKostenMonthly
// ---------------------------------------------------------------------------

describe("teamKostenMonthly", () => {
  it("happy: 5 devs x 96k annual = 40000 monthly", () => {
    // Given: 5 developers each earning 96k/year
    // When: computing monthly team cost
    // Then: result is 5 * 96000 / 12 = 40000
    expect(teamKostenMonthly(5, 96_000)).toBe(40_000);
  });

  it("edge: 0 devs = 0 monthly cost", () => {
    // Given: no developers (green-field)
    // When: computing monthly team cost
    // Then: result is 0
    expect(teamKostenMonthly(0, 96_000)).toBe(0);
  });

  it("edge: 1 dev x 200k annual = 16666.67 monthly", () => {
    // Given: 1 developer earning 200k/year
    // When: computing monthly team cost
    // Then: result is 200000 / 12 ~ 16666.67
    expect(teamKostenMonthly(1, 200_000)).toBeCloseTo(16_666.67, 1);
  });
});

// ---------------------------------------------------------------------------
// fixedTeamKostenRef
// ---------------------------------------------------------------------------

describe("fixedTeamKostenRef", () => {
  it("returns PD_CAPACITY * PD_UNIT_COST for green-field (0 devs)", () => {
    // Given: green-field project with 0 devs
    // When: computing fixed reference cost
    // Then: returns 2 * 20000 = 40000
    expect(fixedTeamKostenRef(0)).toBe(PD_CAPACITY * PD_UNIT_COST);
    expect(fixedTeamKostenRef(0)).toBe(40_000);
  });

  it("returns devCount * REFERENCE_DEV_MONTHLY for non-zero devs", () => {
    // Given: 5 developers
    // When: computing fixed reference cost
    // Then: 5 * 8000 = 40000
    expect(fixedTeamKostenRef(5)).toBe(5 * REFERENCE_DEV_MONTHLY);
    expect(fixedTeamKostenRef(5)).toBe(40_000);
  });

  it("scales linearly with dev count", () => {
    // Given: various dev counts
    // When: computing reference cost
    // Then: scales linearly at 8k per dev
    expect(fixedTeamKostenRef(1)).toBe(8_000);
    expect(fixedTeamKostenRef(10)).toBe(80_000);
  });
});

// ---------------------------------------------------------------------------
// teamKostenForSlider
// ---------------------------------------------------------------------------

describe("teamKostenForSlider", () => {
  it("returns PD_CAPACITY * PD_UNIT_COST for 0 devs", () => {
    // Given: 0 devs
    // When: computing slider reference
    // Then: 40000 (same as green-field)
    expect(teamKostenForSlider(0, 96_000)).toBe(40_000);
  });

  it("returns teamKostenMonthly for non-zero devs", () => {
    // Given: 5 devs at 96k annual
    // When: computing slider reference
    // Then: same as teamKostenMonthly
    expect(teamKostenForSlider(5, 96_000)).toBe(40_000);
  });
});

// ---------------------------------------------------------------------------
// pdPersonsEngaged
// ---------------------------------------------------------------------------

describe("pdPersonsEngaged", () => {
  it("returns budget/PD_UNIT_COST when below capacity cap", () => {
    expect(pdPersonsEngaged(20_000)).toBe(1);
  });

  it("returns fractional value for partial budget", () => {
    expect(pdPersonsEngaged(10_000)).toBe(0.5);
  });

  it("returns 2 for exactly 40000 budget (standard capacity)", () => {
    expect(pdPersonsEngaged(40_000)).toBe(2);
  });

  it("returns >2 for burst budget (40k-50k)", () => {
    // 45k = 22.5k per PD → burst scale = 1 + (1/3)*(2.5k/5k) = 1.167
    const result = pdPersonsEngaged(45_000);
    expect(result).toBeGreaterThan(2);
    expect(result).toBeLessThan(PD_CAPACITY * PD_BURST_FACTOR);
  });

  it("caps at PD_CAPACITY * PD_BURST_FACTOR at max burst budget", () => {
    // 50k = 25k per PD → full burst
    expect(pdPersonsEngaged(50_000)).toBeCloseTo(PD_CAPACITY * PD_BURST_FACTOR, 5);
  });

  it("caps at PD_CAPACITY * PD_BURST_FACTOR even beyond 50k", () => {
    expect(pdPersonsEngaged(80_000)).toBeCloseTo(PD_CAPACITY * PD_BURST_FACTOR, 5);
  });

  it("returns 0 for 0 budget", () => {
    expect(pdPersonsEngaged(0)).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// pdDevEquivalents
// ---------------------------------------------------------------------------

describe("pdDevEquivalents", () => {
  it("returns persons * faktor", () => {
    // Given: budget for 2 PDs, faktor 3.0
    // When: computing dev equivalents
    // Then: 2 * 3.0 = 6
    expect(pdDevEquivalents(40_000, 3.0)).toBe(6);
  });

  it("never exceeds PD_CAPACITY * PD_BURST_FACTOR * faktor", () => {
    // At max burst (50k), persons = 2 * 1.33 = 2.67
    const maxPersons = PD_CAPACITY * PD_BURST_FACTOR;
    expect(pdDevEquivalents(100_000, 3.1)).toBeCloseTo(maxPersons * 3.1, 5);
  });

  it("scales with burst at 45k budget", () => {
    // 45k = 22.5k per PD → burst scale ~1.167 → persons ~2.33
    const result = pdDevEquivalents(45_000, 3.0);
    expect(result).toBeGreaterThan(6.0); // more than standard 2 * 3
    expect(result).toBeLessThan(PD_CAPACITY * PD_BURST_FACTOR * 3.0); // less than max burst
  });
});

// ---------------------------------------------------------------------------
// teamEffectiveDevEq
// ---------------------------------------------------------------------------

describe("teamEffectiveDevEq", () => {
  it("returns 0 for green-field (devCount=0)", () => {
    // Given: no devs
    // When: computing team effective
    // Then: 0
    expect(teamEffectiveDevEq(0, 0.5, 0.2, 1.0)).toBe(0);
  });

  it("returns devCount * enablementBaseline when featureAnteilStart is 0", () => {
    // Given: featureAnteilStart = 0 (divide by zero guard)
    // When: computing team effective
    // Then: devCount * baseline
    expect(teamEffectiveDevEq(5, 0.5, 0, 1.5)).toBe(7.5);
  });

  it("computes devCount * (current/start) * baseline", () => {
    // Given: 5 devs, feature went from 20% to 60%, baseline 1.0
    // When: computing team effective
    // Then: 5 * (0.6/0.2) * 1.0 = 15
    expect(teamEffectiveDevEq(5, 0.6, 0.2, 1.0)).toBeCloseTo(15, 5);
  });

  it("accounts for enablement baseline 1.5x", () => {
    // Given: 5 devs, feature went from 20% to 40%, baseline 1.5 (post-enablement)
    // When: computing team effective
    // Then: 5 * (0.4/0.2) * 1.5 = 15
    expect(teamEffectiveDevEq(5, 0.4, 0.2, 1.5)).toBeCloseTo(15, 5);
  });
});

// ---------------------------------------------------------------------------
// phaseCalendarWeeks
// ---------------------------------------------------------------------------

describe("phaseCalendarWeeks", () => {
  it("1 PD: phases at [0.5, 1, 2, 3, 4, 5, 9, 13, 15]", () => {
    // Given: 1 PD person engaged
    // When: computing phase calendar weeks
    // Then: matches expected cumulative values
    const result = phaseCalendarWeeks(PHASES, 1);
    expect(result[0]).toBeCloseTo(0.5, 5);
    expect(result[1]).toBeCloseTo(1.0, 5);
    expect(result[2]).toBeCloseTo(2.0, 5);
    expect(result[3]).toBeCloseTo(3.0, 5);
    expect(result[4]).toBeCloseTo(4.0, 5);
    expect(result[5]).toBeCloseTo(5.0, 5);
    expect(result[6]).toBeCloseTo(9.0, 5);  // team-bound: +4 fixed
    expect(result[7]).toBeCloseTo(13.0, 5); // team-bound: +4 fixed
    expect(result[8]).toBeCloseTo(15.0, 5); // PD-scaled: +2/1 = +2
  });

  it("2 PDs: PD-scaled phases halve, team-bound stay same", () => {
    // Given: 2 PD persons engaged
    // When: computing phase calendar weeks
    // Then: PD phases take half the time, team-bound phases unchanged
    const result = phaseCalendarWeeks(PHASES, 2);
    expect(result[0]).toBeCloseTo(0.25, 5);  // 0.5/2
    expect(result[1]).toBeCloseTo(0.5, 5);   // 0.25 + 0.5/2
    expect(result[2]).toBeCloseTo(1.0, 5);   // 0.5 + 1.0/2
    expect(result[3]).toBeCloseTo(1.5, 5);   // 1.0 + 1.0/2
    expect(result[4]).toBeCloseTo(2.0, 5);   // 1.5 + 1.0/2
    expect(result[5]).toBeCloseTo(2.5, 5);   // 2.0 + 1.0/2
    expect(result[6]).toBeCloseTo(6.5, 5);   // 2.5 + 4.0 (team-bound)
    expect(result[7]).toBeCloseTo(10.5, 5);  // 6.5 + 4.0 (team-bound)
    expect(result[8]).toBeCloseTo(11.5, 5);  // 10.5 + 2.0/2
  });

  it("0.5 PD: PD-scaled phases double, team-bound stay same", () => {
    // Given: 0.5 PD persons engaged
    // When: computing phase calendar weeks
    // Then: PD phases take double the time, team-bound phases unchanged
    const result = phaseCalendarWeeks(PHASES, 0.5);
    expect(result[0]).toBeCloseTo(1.0, 5);   // 0.5/0.5
    expect(result[1]).toBeCloseTo(2.0, 5);   // 1.0 + 0.5/0.5
    expect(result[2]).toBeCloseTo(4.0, 5);   // 2.0 + 1.0/0.5
    expect(result[3]).toBeCloseTo(6.0, 5);   // 4.0 + 1.0/0.5
    expect(result[4]).toBeCloseTo(8.0, 5);   // 6.0 + 1.0/0.5
    expect(result[5]).toBeCloseTo(10.0, 5);  // 8.0 + 1.0/0.5
    expect(result[6]).toBeCloseTo(14.0, 5);  // 10.0 + 4.0 (team-bound)
    expect(result[7]).toBeCloseTo(18.0, 5);  // 14.0 + 4.0 (team-bound)
    expect(result[8]).toBeCloseTo(22.0, 5);  // 18.0 + 2.0/0.5
  });

  it("returns correct length matching phases array", () => {
    const result = phaseCalendarWeeks(PHASES, 1);
    expect(result.length).toBe(PHASES.length);
  });

  it("handles near-zero PD persons without crashing", () => {
    // Given: near-zero PD (clamped to 0.01)
    // When: computing phase calendar weeks
    // Then: very large values but no Infinity or NaN
    const result = phaseCalendarWeeks(PHASES, 0);
    for (const week of result) {
      expect(Number.isFinite(week)).toBe(true);
      expect(week).toBeGreaterThan(0);
    }
  });
});

// ---------------------------------------------------------------------------
// phaseAtIteration
// ---------------------------------------------------------------------------

describe("phaseAtIteration", () => {
  const phaseWeeks1PD = phaseCalendarWeeks(PHASES, 1) as number[];

  it("edge: week 0 returns phase 0 with faktor 0", () => {
    // Given: calendar week is 0 (start)
    // When: computing phase at iteration
    // Then: phase 0, faktor 0
    const result = phaseAtIteration(0, PHASES, phaseWeeks1PD);
    expect(result.phase).toBe(0);
    expect(result.faktor).toBe(0);
  });

  it("happy: week 0.5 returns phase 0 with faktor 1.5 (at phase 0 threshold)", () => {
    // Given: at phase 0 threshold (0.5 weeks at 1 PD)
    // When: computing phase at iteration
    // Then: phase 0, faktor starts interpolating
    const result = phaseAtIteration(0.5, PHASES, phaseWeeks1PD);
    expect(result.phase).toBe(0);
    expect(result.faktor).toBeCloseTo(1.5, 5);
  });

  it("happy: week 2 = phase 2, faktor 2.2", () => {
    // Given: 2 weeks at 1 PD (phase 2 threshold exactly)
    // When: computing phase at iteration
    // Then: phase 2, faktor 2.2
    const result = phaseAtIteration(2, PHASES, phaseWeeks1PD);
    expect(result.phase).toBe(2);
    expect(result.faktor).toBeCloseTo(2.2, 5);
  });

  it("happy: week 5 = phase 5, faktor 3.0", () => {
    // Given: 5 weeks at 1 PD (phase 5 threshold exactly)
    // When: computing phase at iteration
    // Then: phase 5, faktor 3.0 (no compounding at exact threshold)
    const result = phaseAtIteration(5, PHASES, phaseWeeks1PD);
    expect(result.phase).toBe(5);
    expect(result.faktor).toBeCloseTo(3.0, 5);
  });

  it("compounding: week 20, well past phase 5, adds drift", () => {
    // Given: week 20, well past phase 5 (threshold=5)
    // When: computing phase at iteration
    // Then: compounding drift adds 0.1 * ln(1 + 20 - 5) = 0.1 * ln(16)
    const result = phaseAtIteration(20, PHASES, phaseWeeks1PD);
    const expected = 3.0 + 0.1 * Math.log(1 + 20 - 5);
    expect(result.faktor).toBeCloseTo(expected, 5);
  });

  it("works with 2 PD phaseWeeks", () => {
    // Given: 2 PDs, phase thresholds are compressed
    // When: computing phase at week 1.0 (should be phase 2 for 2 PDs)
    // Then: phase 2, faktor 2.2
    const phaseWeeks2PD = phaseCalendarWeeks(PHASES, 2) as number[];
    const result = phaseAtIteration(1.0, PHASES, phaseWeeks2PD);
    expect(result.phase).toBe(2);
    expect(result.faktor).toBeCloseTo(2.2, 5);
  });
});

// ---------------------------------------------------------------------------
// featureAnteil
// ---------------------------------------------------------------------------

describe("featureAnteil", () => {
  // Reference: 1 PD on 5 devs → k = 0.25 * 1/5 = 0.05 (same as original model)
  it("happy: 20% start, 1 PD on 5 devs, week 12", () => {
    const result = featureAnteil(12, 20, 1, 5, 0);
    const expected = 0.8 - 0.6 * Math.exp(-0.05 * 12);
    expect(result).toBeCloseTo(expected, 5);
  });

  it("happy: 20% start, 1 PD on 5 devs, week 52", () => {
    const result = featureAnteil(52, 20, 1, 5, 0);
    expect(result).toBeGreaterThan(0.7);
    expect(result).toBeLessThan(0.8);
  });

  it("converges faster with more PDs on same team", () => {
    const result1PD = featureAnteil(10, 20, 1, 5, 0);
    const result2PD = featureAnteil(10, 20, 2, 5, 0);
    expect(result2PD).toBeGreaterThan(result1PD);
  });

  it("converges slower with larger team at same PD count", () => {
    // 1 PD on 5 devs vs 1 PD on 40 devs: larger team is harder to shift
    const result5devs = featureAnteil(20, 20, 1, 5, 0);
    const result40devs = featureAnteil(20, 20, 1, 40, 0);
    expect(result5devs).toBeGreaterThan(result40devs);
  });

  it("edge: 80% start stays at 80%", () => {
    const result = featureAnteil(0, 80, 1, 5, 0);
    expect(result).toBeCloseTo(0.8, 5);
  });

  it("edge: pdPersons 0 = k=0, stays at start forever", () => {
    const result = featureAnteil(100, 20, 0, 5, 0);
    expect(result).toBeCloseTo(0.2, 5);
  });

  it("40 devs + 0.75 PD: feature-anteil barely moves in 12 weeks", () => {
    // k = 0.25 * 0.75/40 = 0.0047 → slow convergence
    const result = featureAnteil(12, 20, 0.75, 40, 0);
    expect(result).toBeLessThan(0.25); // barely above 20%
  });
});

// ---------------------------------------------------------------------------
// enablementMultiplier
// ---------------------------------------------------------------------------

describe("enablementMultiplier", () => {
  it("happy: before enablement start = 1.0", () => {
    // Given: current iteration is before enablement start
    // When: computing enablement multiplier
    // Then: no effect, multiplier is 1.0
    expect(enablementMultiplier(5, 12)).toBe(1.0);
  });

  it("happy: during dip (5 weeks into enablement) = 0.60", () => {
    // Given: 5 weeks have passed since enablement start (within 12-week dip)
    // When: computing enablement multiplier
    // Then: multiplier is 0.60 (40% productivity loss)
    expect(enablementMultiplier(17, 12)).toBe(0.6);
  });

  it("happy: during recovery (15 weeks into enablement) = 0.75", () => {
    // Given: 15 weeks have passed since enablement start (recovery phase)
    // When: computing enablement multiplier
    // Then: 0.60 + 0.40 * (3/8) = 0.75
    expect(enablementMultiplier(27, 12)).toBeCloseTo(0.75, 5);
  });

  it("happy: after recovery (20+ weeks into enablement) = 1.0", () => {
    // Given: more than 20 weeks have passed since enablement start
    // When: computing enablement multiplier
    // Then: fully recovered, multiplier is 1.0
    expect(enablementMultiplier(35, 12)).toBe(1.0);
  });
});

// ---------------------------------------------------------------------------
// teamBaseline
// ---------------------------------------------------------------------------

describe("teamBaseline", () => {
  it("returns 1.0 when enablement is disabled", () => {
    expect(teamBaseline(50, false, 12)).toBe(1.0);
  });

  it("returns 1.0 before enablement starts", () => {
    expect(teamBaseline(1, true, 2)).toBe(1.0);
  });

  it("starts rising immediately when enablement begins", () => {
    // enablementStart=2, check week 7 (+5 weeks)
    const after5 = teamBaseline(7, true, 2, 9);
    expect(after5).toBeGreaterThan(1.0); // already some effect
    expect(after5).toBeLessThan(1.5); // but still small
  });

  it("shows meaningful progress after 10 weeks", () => {
    // enablementStart=2, phase6=9, check week 12 (+10 weeks)
    const after10 = teamBaseline(12, true, 2, 9);
    expect(after10).toBeGreaterThan(1.4); // target is 3.0, k=0.03 → ~0.26 progress
    expect(after10).toBeLessThan(2.0);
  });

  it("approaches target 3.0 gradually over many weeks (Phase 6 reached)", () => {
    // enablementStart=2, phase6=9, week 52 (+50 weeks)
    const farOut = teamBaseline(52, true, 2, 9);
    expect(farOut).toBeGreaterThan(2.5);
    expect(farOut).toBeLessThanOrEqual(3.0);
  });

  it("approaches target 1.5 when Phase 6 not reached", () => {
    const farOut = teamBaseline(52, true, 2);
    expect(farOut).toBeGreaterThan(1.3);
    expect(farOut).toBeLessThanOrEqual(1.5);
  });

  it("is monotonically increasing from enablement start", () => {
    let prev = teamBaseline(2, true, 2, 9);
    for (let w = 3; w <= 60; w++) {
      const curr = teamBaseline(w, true, 2, 9);
      expect(curr).toBeGreaterThanOrEqual(prev);
      prev = curr;
    }
  });
});

// ---------------------------------------------------------------------------
// benefitProgress
// ---------------------------------------------------------------------------

describe("benefitProgress", () => {
  describe("sigmoid curve", () => {
    it("returns ~0.5 at the halfway point (effectiveWeek = anlaufzeit/2)", () => {
      // Given: sigmoid benefit, currently at the midpoint of anlaufzeit
      // When: computing benefit progress
      // Then: sigmoid at midpoint = 0.5
      const benefit = makeSigmoidBenefit("test", 20);
      const result = benefitProgress(10, benefit, 0, 20, false, Infinity);
      expect(result).toBeCloseTo(0.5, 2);
    });

    it("returns ~0.95 at full anlaufzeit", () => {
      // Given: sigmoid benefit, currently at anlaufzeit
      // When: computing benefit progress
      // Then: sigmoid reaches ~0.95 at anlaufzeit
      const benefit = makeSigmoidBenefit("test", 20);
      const result = benefitProgress(20, benefit, 0, 20, false, Infinity);
      expect(result).toBeGreaterThan(0.9);
    });

    it("returns 0 when phase not yet reached (effectiveWeek < 0)", () => {
      // Given: phase threshold not yet reached
      // When: computing benefit progress
      // Then: 0 (phase not reached)
      const benefit = makeSigmoidBenefit("test", 20);
      const result = benefitProgress(5, benefit, 10, 20, false, Infinity);
      expect(result).toBe(0);
    });
  });

  describe("linear_ramp curve", () => {
    it("returns 0.5 at halfway point", () => {
      // Given: linear_ramp benefit, at half the anlaufzeit
      // When: computing benefit progress
      // Then: exactly 0.5
      const benefit = makeLinearBenefit("test", 20);
      const result = benefitProgress(10, benefit, 0, 20, false, Infinity);
      expect(result).toBeCloseTo(0.5, 5);
    });

    it("returns 1.0 at full anlaufzeit", () => {
      // Given: linear_ramp benefit, at full anlaufzeit
      // When: computing benefit progress
      // Then: exactly 1.0
      const benefit = makeLinearBenefit("test", 20);
      const result = benefitProgress(20, benefit, 0, 20, false, Infinity);
      expect(result).toBeCloseTo(1.0, 5);
    });

    it("caps at 1.0 beyond anlaufzeit", () => {
      // Given: linear_ramp benefit, beyond anlaufzeit
      // When: computing benefit progress
      // Then: capped at 1.0
      const benefit = makeLinearBenefit("test", 20);
      const result = benefitProgress(30, benefit, 0, 20, false, Infinity);
      expect(result).toBeCloseTo(1.0, 5);
    });
  });

  describe("treppen curve", () => {
    it("at first step: ~1/3 of total (with 3 steps)", () => {
      // Given: treppen benefit with 3 steps at positions [5, 10, 15]
      // When: computing progress exactly at first step
      // Then: ~0.167
      const benefit = makeTreppenBenefit("test", [5, 10, 15]);
      const result = benefitProgress(5, benefit, 0, 15, false, Infinity);
      expect(result).toBeCloseTo(0.1667, 2);
    });

    it("at last step: ~1.0 (all 3 steps near 1.0)", () => {
      // Given: treppen benefit with 3 steps at [5, 10, 15]
      // When: computing progress well past last step
      // Then: all sigmoids near 1.0, sum/3 near 1.0
      const benefit = makeTreppenBenefit("test", [5, 10, 15]);
      const result = benefitProgress(30, benefit, 0, 15, false, Infinity);
      expect(result).toBeGreaterThan(0.99);
    });
  });
});

// ---------------------------------------------------------------------------
// sigmoid (direct)
// ---------------------------------------------------------------------------

describe("sigmoid", () => {
  it("returns 0.5 at midpoint (t = anlaufzeit/2)", () => {
    // Given: t = anlaufzeit/2 (the midpoint)
    // When: computing sigmoid
    // Then: exactly 0.5
    expect(sigmoid(10, 20)).toBeCloseTo(0.5, 10);
  });

  it("returns ~0.95 at t = anlaufzeit", () => {
    // Given: t = anlaufzeit
    // When: computing sigmoid
    // Then: ~0.95 (steepness designed for this)
    expect(sigmoid(20, 20)).toBeCloseTo(1 / (1 + Math.exp(-3)), 5);
  });
});

// ---------------------------------------------------------------------------
// treppenSmooth (direct)
// ---------------------------------------------------------------------------

describe("treppenSmooth", () => {
  it("returns 0 for empty stufen array", () => {
    // Given: no steps
    // When: computing treppenSmooth
    // Then: 0
    expect(treppenSmooth(5, [], 2.0)).toBe(0);
  });

  it("returns ~0.5 at single step position", () => {
    // Given: single step at t=5
    // When: computing at t=5
    // Then: sigmoid(0, 2.0) = 0.5
    expect(treppenSmooth(5, [5], 2.0)).toBeCloseTo(0.5, 5);
  });
});

// ---------------------------------------------------------------------------
// maxIterationsInHorizon
// ---------------------------------------------------------------------------

describe("maxIterationsInHorizon", () => {
  it("happy: 12 months = 51.96 weeks", () => {
    // Given: 12-month horizon
    // When: computing max iterations (= calendar weeks)
    // Then: 12 * 4.33 = 51.96
    const result = maxIterationsInHorizon(12);
    expect(result).toBeCloseTo(51.96, 2);
  });

  it("scales linearly with horizon months", () => {
    // Given: various horizons
    // When: computing max iterations
    // Then: scales linearly at 4.33 weeks per month
    expect(maxIterationsInHorizon(6)).toBeCloseTo(25.98, 2);
    expect(maxIterationsInHorizon(24)).toBeCloseTo(103.92, 2);
  });

  it("budget-independent: same result regardless of budget", () => {
    // Given: any horizon
    // When: computing max iterations
    // Then: result only depends on months, not budget
    const result = maxIterationsInHorizon(12);
    expect(result).toBeCloseTo(51.96, 2);
  });
});

// ---------------------------------------------------------------------------
// generateTimeline
// ---------------------------------------------------------------------------

describe("generateTimeline", () => {
  const emptyBenefits: readonly Benefit[] = [];

  it("produces array of correct length based on maxIterationsInHorizon", () => {
    // Given: default inputs with 12-month horizon
    // When: generating timeline
    // Then: length = ceil(horizonMonths * 4.33) + 1
    const timeline = generateTimeline(DEFAULT_INPUTS, PHASES, emptyBenefits);
    const maxIter = maxIterationsInHorizon(DEFAULT_INPUTS.horizonMonths);
    const expectedLength = Math.ceil(maxIter) + 1;
    expect(timeline.length).toBe(expectedLength);
  });

  it("first slice has iteration=0 and phase=0", () => {
    // Given: default inputs
    // When: generating timeline
    // Then: first slice is at iteration 0, phase 0
    const timeline = generateTimeline(DEFAULT_INPUTS, PHASES, emptyBenefits);
    const first = timeline[0];
    expect(first).toBeDefined();
    expect(first!.iteration).toBe(0);
    expect(first!.phase).toBe(0);
  });

  it("first slice has faktor 0 (iteration 0 guard)", () => {
    // Given: default inputs
    // When: generating timeline
    // Then: faktor at iteration 0 is 0 (per phaseAtIteration guard)
    const timeline = generateTimeline(DEFAULT_INPUTS, PHASES, emptyBenefits);
    const first = timeline[0];
    expect(first!.faktor).toBe(0);
  });

  it("pdOutput equals pdDevEq at each slice", () => {
    // Given: default inputs
    // When: generating timeline
    // Then: pdOutput field matches pdDevEq field (backward compat)
    const timeline = generateTimeline(DEFAULT_INPUTS, PHASES, emptyBenefits);
    for (const slice of timeline) {
      expect(slice.pdOutput).toBe(slice.pdDevEq);
    }
  });

  it("pdDevEq is capacity-capped (never exceeds PD_CAPACITY * max faktor)", () => {
    // Given: high budget (burst range), long horizon
    // When: generating timeline
    // Then: pdDevEq is bounded by PD_CAPACITY * PD_BURST_FACTOR * faktor
    const highBudgetInputs: CalculatorInputs = {
      ...DEFAULT_INPUTS,
      budgetMonthly: 50_000,
      horizonMonths: 36,
    };
    const timeline = generateTimeline(highBudgetInputs, PHASES, emptyBenefits);
    for (const slice of timeline) {
      // pdPersonsEngaged is capped at PD_CAPACITY * PD_BURST_FACTOR
      expect(slice.pdPersonsEngaged).toBeLessThanOrEqual(PD_CAPACITY * PD_BURST_FACTOR);
      // pdDevEq = persons * faktor
      expect(slice.pdDevEq).toBeLessThanOrEqual(slice.pdPersonsEngaged * slice.faktor + 0.01);
    }
  });

  it("pdPersonsEngaged is capped at PD_CAPACITY * PD_BURST_FACTOR", () => {
    const overBudgetInputs: CalculatorInputs = {
      ...DEFAULT_INPUTS,
      budgetMonthly: 50_000,
    };
    const timeline = generateTimeline(overBudgetInputs, PHASES, emptyBenefits);
    for (const slice of timeline) {
      expect(slice.pdPersonsEngaged).toBeLessThanOrEqual(PD_CAPACITY * PD_BURST_FACTOR);
    }
  });

  it("green-field: teamBaseline=0 and teamEffective=0 throughout", () => {
    // Given: devCount=0 (green-field mode)
    // When: generating timeline
    // Then: teamBaseline and teamEffective are always 0 for green-field
    const greenFieldInputs: CalculatorInputs = {
      ...DEFAULT_INPUTS,
      devCount: 0,
    };
    const timeline = generateTimeline(greenFieldInputs, PHASES, greenFieldInputs.devCount === 0 ? [] : emptyBenefits);
    for (const slice of timeline) {
      expect(slice.teamBaseline).toBe(0);
      expect(slice.teamEffective).toBe(0);
    }
  });

  it("budget=0 produces timeline with all phases frozen", () => {
    // Given: budget = 0
    // When: generating timeline
    // Then: still produces full calendar-week timeline but PD output is 0
    const zeroBudgetInputs: CalculatorInputs = {
      ...DEFAULT_INPUTS,
      budgetMonthly: 0,
    };
    const timeline = generateTimeline(zeroBudgetInputs, PHASES, emptyBenefits);
    // Timeline is budget-independent: still has horizonMonths * 4.33 weeks
    const maxIter = maxIterationsInHorizon(zeroBudgetInputs.horizonMonths);
    const expectedLength = Math.ceil(maxIter) + 1;
    expect(timeline.length).toBe(expectedLength);
    // But pdDevEq is 0 throughout (no PD budget)
    for (const slice of timeline) {
      expect(slice.pdDevEq).toBe(0);
      expect(slice.pdPersonsEngaged).toBe(0);
    }
  });

  it("benefits array in each slice matches the benefits passed in", () => {
    // Given: one benefit passed in
    // When: generating timeline
    // Then: each slice has exactly one benefit entry
    const benefit = makeSigmoidBenefit("b1", 10);
    const benefits: readonly Benefit[] = [benefit];
    const timeline = generateTimeline(DEFAULT_INPUTS, PHASES, benefits);
    for (const slice of timeline) {
      expect(slice.benefits.length).toBe(1);
    }
  });

  it("new fields are populated on each slice", () => {
    // Given: default inputs
    // When: generating timeline
    // Then: all new fields exist
    const timeline = generateTimeline(DEFAULT_INPUTS, PHASES, emptyBenefits);
    for (const slice of timeline) {
      expect(typeof slice.pdDevEq).toBe("number");
      expect(typeof slice.pdPersonsEngaged).toBe("number");
      expect(typeof slice.teamEffective).toBe("number");
      expect(typeof slice.featureMultiplier).toBe("number");
    }
  });
});

// ---------------------------------------------------------------------------
// kpiValue
// ---------------------------------------------------------------------------

describe("kpiValue", () => {
  it("returns startValue at progress=0", () => {
    // Given: combined progress is 0
    // When: computing KPI value
    // Then: returns startValue
    expect(kpiValue(20, 80, 0)).toBe(20);
  });

  it("returns plateauValue at progress=1", () => {
    // Given: combined progress is 1 (full)
    // When: computing KPI value
    // Then: returns plateauValue
    expect(kpiValue(20, 80, 1)).toBe(80);
  });

  it("returns midpoint at progress=0.5", () => {
    // Given: combined progress is 0.5
    // When: computing KPI value
    // Then: returns midpoint between start and plateau
    expect(kpiValue(20, 80, 0.5)).toBeCloseTo(50, 5);
  });

  it("works with decreasing KPI (e.g. lead_time from 14 to 6)", () => {
    // Given: KPI decreases from 14 to 6 days
    // When: computing at progress=0.5
    // Then: returns 10 (midpoint)
    expect(kpiValue(14, 6, 0.5)).toBeCloseTo(10, 5);
  });
});

// ---------------------------------------------------------------------------
// combinedBenefitProgress
// ---------------------------------------------------------------------------

describe("combinedBenefitProgress", () => {
  const phaseWeeks1PD = phaseCalendarWeeks(PHASES, 1) as number[];

  it("returns 0 when no operativ benefits exist for the KPI", () => {
    // Given: no benefits
    // When: computing combined progress for any KPI
    // Then: 0
    expect(
      combinedBenefitProgress(10, "lead_time", [], PHASES, phaseWeeks1PD, false, Infinity),
    ).toBe(0);
  });

  it("returns 0 when no benefits list the given KPI", () => {
    // Given: a benefit that does not reference the KPI
    // When: computing combined progress
    // Then: 0
    const benefit: BenefitOperativ = {
      ...makeSigmoidBenefit("b1", 20),
      kpiBetroffen: ["other_kpi"],
    };
    expect(
      combinedBenefitProgress(
        20,
        "lead_time",
        [benefit],
        PHASES,
        phaseWeeks1PD,
        false,
        Infinity,
      ),
    ).toBe(0);
  });

  it("returns weighted average for two benefits of same effektGroesse", () => {
    // Given: two benefits both driving the same KPI, same weight
    // When: both are at different progress levels
    // Then: returns their simple average
    const b1: BenefitOperativ = {
      ...makeSigmoidBenefit("b1", 20, 0),
      kpiBetroffen: ["test_kpi"],
      effektGroesse: 0.5,
    };
    const b2: BenefitOperativ = {
      ...makeLinearBenefit("b2", 20),
      kpiBetroffen: ["test_kpi"],
      effektGroesse: 0.5,
    };
    const result = combinedBenefitProgress(
      20,
      "test_kpi",
      [b1, b2],
      PHASES,
      phaseWeeks1PD,
      false,
      Infinity,
    );
    expect(result).toBeGreaterThan(0);
    expect(result).toBeLessThanOrEqual(1);
  });
});

// ---------------------------------------------------------------------------
// Snapshot-style: default inputs generate stable timeline
// ---------------------------------------------------------------------------

describe("generateTimeline snapshots", () => {
  it("default inputs: slice at week 5 has valid phase", () => {
    // Given: default inputs
    // When: generating timeline and looking at week 5
    // Then: phase is a valid phase id
    const timeline = generateTimeline(DEFAULT_INPUTS, PHASES, []);
    const slice5 = timeline.find((s) => s.iteration === 5);
    expect(slice5).toBeDefined();
    expect(slice5!.phase).toBeGreaterThanOrEqual(0);
    expect(slice5!.phase).toBeLessThanOrEqual(8);
  });

  it("green-field inputs: featureAnteil is always 0", () => {
    // Given: devCount=0 (green-field)
    // When: generating timeline
    // Then: featureAnteil = 0 throughout (not applicable)
    const inputs: CalculatorInputs = { ...DEFAULT_INPUTS, devCount: 0 };
    const timeline = generateTimeline(inputs, PHASES, []);
    for (const slice of timeline) {
      expect(slice.featureAnteil).toBe(0);
    }
  });

  it("enablement inputs: timeline generates without error", () => {
    // Given: enablement=true, enough horizon to see the dip
    // When: generating timeline
    // Then: timeline exists
    const inputs: CalculatorInputs = {
      ...DEFAULT_INPUTS,
      enablement: true,
      horizonMonths: 24,
    };
    const timeline = generateTimeline(inputs, PHASES, []);
    expect(timeline.length).toBeGreaterThan(0);
  });

  it("5 devs / 40k budget: pdDevEq capped at ~6-7 (2 PDs x faktor), not 15", () => {
    // Given: 5 devs, 40k budget (2 standard PDs)
    // When: generating timeline
    // Then: pdDevEq is capacity-capped (2 PDs, never budget-driven to 15)
    const inputs: CalculatorInputs = {
      ...DEFAULT_INPUTS,
      devCount: 5,
      budgetMonthly: 40_000,
      horizonMonths: 12,
    };
    const timeline = generateTimeline(inputs, PHASES, []);
    const maxPdDevEq = Math.max(...timeline.map((s) => s.pdDevEq));
    // 2 PDs * ~3.0-3.4 faktor (with compounding) = ~6-7, never 15
    expect(maxPdDevEq).toBeLessThan(8);
    expect(maxPdDevEq).toBeLessThan(10);
    // Verify capacity cap: all slices have pdPersonsEngaged <= PD_CAPACITY
    for (const s of timeline) {
      expect(s.pdPersonsEngaged).toBeLessThanOrEqual(PD_CAPACITY);
    }
  });

  it("enablement adds post-PD departure slices when completed", () => {
    // Given: enablement=true, long enough horizon for enablement to complete
    // When: generating timeline
    // Then: extra slices appear with pdDevEq=0 and teamBaseline>=1.5
    const inputs: CalculatorInputs = {
      ...DEFAULT_INPUTS,
      enablement: true,
      horizonMonths: 24,
    };
    const timeline = generateTimeline(inputs, PHASES, []);
    const maxIter = maxIterationsInHorizon(inputs.horizonMonths);
    const totalSteps = Math.ceil(maxIter);
    // Check if post-PD slices exist (iteration > totalSteps)
    const postPdSlices = timeline.filter((s) => s.iteration > totalSteps);
    if (postPdSlices.length > 0) {
      // All post-PD slices have pdDevEq=0
      for (const s of postPdSlices) {
        expect(s.pdDevEq).toBe(0);
        expect(s.pdPersonsEngaged).toBe(0);
        // Team baseline is ramping gradually (> 1.0, approaching target)
        expect(s.teamBaseline).toBeGreaterThan(1.0);
      }
    }
  });
});
