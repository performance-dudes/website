// types.ts

export type PainPointId =
  | "shipping-zu-langsam"
  | "bug-last"
  | "releases-stress"
  | "bus-faktor"
  | "compliance-audits"
  | "onboarding-langsam"
  | "sales-bruecke";

export type KachelTyp = "operativ" | "strategisch" | "risiko";
export type Kategorie = "tempo" | "qualitaet" | "wissen" | "produkt" | "strategisch";
export type KurvenForm = "sigmoid" | "linear_ramp" | "treppen";
export type PhaseId = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export interface BenefitBase {
  readonly id: string;
  readonly titel: string;
  readonly kachelTyp: KachelTyp;
  readonly kategorie: Kategorie;
  readonly defaultPrio: 1 | 2 | 3 | 4 | 5;
  readonly anlaufzeitIterationen: number;
  readonly kurvenForm: KurvenForm;
  readonly phaseVoraussetzung: PhaseId;
  readonly painPoints: readonly PainPointId[];
  readonly erfahrungsBasis: string;
  readonly treppenStufen?: readonly number[]; // only for treppen
}

export interface BenefitOperativ extends BenefitBase {
  readonly kachelTyp: "operativ";
  readonly effektGroesse: number; // 0-1
  readonly kpiBetroffen: readonly string[];
  readonly plateauLabel: string;
}

export interface BenefitStrategisch extends BenefitBase {
  readonly kachelTyp: "strategisch";
  readonly proxyVorher: string;
  readonly proxyNachher: string;
}

export interface BenefitRisiko extends BenefitBase {
  readonly kachelTyp: "risiko";
  readonly vorher: string;
  readonly nachher: string;
}

export type Benefit = BenefitOperativ | BenefitStrategisch | BenefitRisiko;

export interface CalculatorInputs {
  readonly painPoints: readonly PainPointId[];
  readonly devCount: number;        // 0-50
  readonly costPerDev: number;      // 60000-200000
  readonly featurePercent: number;  // 0-80
  readonly budgetMonthly: number;   // slider value in EUR
  readonly horizonMonths: number;   // 3-36
  readonly enablement: boolean;
}

export interface PhaseInfo {
  readonly id: PhaseId;
  readonly name: string;
  readonly doneCriterion: string;
  readonly pdPersonWeeks: number;   // cumulative PD-person-weeks to reach this phase (at 1 PD = calendar weeks)
  readonly durationWeeks: number;   // duration of this phase (at 1 PD for PD-scaled; fixed for team-bound)
  readonly teamBound: boolean;      // if true, fixed calendar time regardless of PD count
}

export type BenefitStatus = "aktiv" | "im-aufbau" | "wartend";

export interface BenefitAtTime {
  readonly benefit: Benefit;
  readonly status: BenefitStatus;
  readonly progress: number; // 0-1
  readonly reachableIteration: number | null;
}

// 1 iteration = 1 calendar week (budget-independent).
// X-axis = real calendar time in weeks.
// Budget affects PD output per week AND phase speed (for PD-scaled phases).
// Team-bound phases take fixed calendar time regardless of budget.
export interface TimeSlice {
  readonly iteration: number; // calendar week number
  readonly phase: PhaseId;
  readonly faktor: number;
  readonly pdOutput: number;
  readonly teamBaseline: number;
  readonly gesamtOutput: number;
  readonly featureAnteil: number;
  readonly pdDevEq: number;           // PD dev-equivalents (persons x faktor, capped)
  readonly pdPersonsEngaged: number;  // min(budget/PD_UNIT_COST, PD_CAPACITY)
  readonly teamEffective: number;     // devCount x enablementBaseline (no featureMultiplier to avoid double-counting)
  readonly featureMultiplier: number; // featureAnteil(t) / featureAnteilStart
  readonly benefits: readonly BenefitAtTime[];
}
