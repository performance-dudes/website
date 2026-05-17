import type {
  PainPointId,
  PhaseId,
  PhaseInfo,
  CalculatorInputs,
} from "./types";

export const PAIN_POINTS: readonly PainPointId[] = [
  "shipping-zu-langsam",
  "bug-last",
  "releases-stress",
  "bus-faktor",
  "compliance-audits",
  "onboarding-langsam",
  "sales-bruecke",
];

export const FAKTOR_BY_PHASE: Record<PhaseId, number> = {
  0: 1.5,
  1: 1.8,
  2: 2.2,
  3: 2.5,
  4: 2.8,
  5: 3.0,
  6: 3.0,
  7: 3.0,
  8: 3.0,
};

export const KOMPOUNDING_RATE = 0.1;

// Engagement capacity and pricing model constants
export const PD_CAPACITY = 2;
export const PD_UNIT_COST = 20_000;
export const PD_UNIT_COST_MAX = 25_000;
export const PD_BURST_FACTOR = 4 / 3;
export const REFERENCE_DEV_MONTHLY = 8_000;
export const ENABLEMENT_FULL_UPLIFT = 3.0;
export const ENABLEMENT_PARTIAL_UPLIFT = 1.5;

export const PHASES: readonly PhaseInfo[] = [
  {
    id: 0,
    name: "Sichtung",
    doneCriterion: "Codebasis verstanden, Risiken kartiert",
    pdPersonWeeks: 0.5,
    durationWeeks: 0.5,
    teamBound: false,
  },
  {
    id: 1,
    name: "Quality-Gate aktiv",
    doneCriterion: "CI grün, Linter, Type-Check, Basis-Tests",
    pdPersonWeeks: 1.0,
    durationWeeks: 0.5,
    teamBound: false,
  },
  {
    id: 2,
    name: "Substrat steht",
    doneCriterion: "CLAUDE.md, AGENTS.md, Test-Coverage-Gerüst, ADR-Format",
    pdPersonWeeks: 2.0,
    durationWeeks: 1.0,
    teamBound: false,
  },
  {
    id: 3,
    name: "Memory-as-Code aktiv",
    doneCriterion: "Specs als Quellgrund, Spec-Driven-Workflow läuft",
    pdPersonWeeks: 3.0,
    durationWeeks: 1.0,
    teamBound: false,
  },
  {
    id: 4,
    name: "Bugfix-Agent läuft",
    doneCriterion:
      "Agent reproduziert, lokalisiert, schlägt Fix mit Test vor",
    pdPersonWeeks: 4.0,
    durationWeeks: 1.0,
    teamBound: false,
  },
  {
    id: 5,
    name: "AI-Reviewer auf jedem PR",
    doneCriterion: "AI prüft Diffs vor menschlichem Reviewer",
    pdPersonWeeks: 5.0,
    durationWeeks: 1.0,
    teamBound: false,
  },
  {
    id: 6,
    name: "Team-AI-Skill etabliert",
    doneCriterion: "Team nutzt Tools selbstständig, Pairing endet",
    pdPersonWeeks: 9.0,
    durationWeeks: 4.0,
    teamBound: true,
  },
  {
    id: 7,
    name: "Bus-Faktor verteilt",
    doneCriterion:
      "Plattform-Pflege ohne PD möglich, Wissen ist Repo-Wissen",
    pdPersonWeeks: 13.0,
    durationWeeks: 4.0,
    teamBound: true,
  },
  {
    id: 8,
    name: "Plattform investierbar",
    doneCriterion:
      "Architektur dokumentiert, Metriken gemessen, Pitch-Deck-fähig",
    pdPersonWeeks: 15.0,
    durationWeeks: 2.0,
    teamBound: false,
  },
];

// Default calculator inputs
export const DEFAULT_INPUTS: CalculatorInputs = {
  painPoints: [],
  devCount: 5,
  costPerDev: 96_000,
  featurePercent: 20,
  budgetMonthly: 20_000, // 1 PD voll ausgelastet (Empfehlung)
  horizonMonths: 12,
  enablement: false,
};

export interface KpiDefinition {
  readonly id: string;
  readonly cluster: "effizienz" | "qualitaet" | "team" | "geschaeft";
  readonly label: string;
  readonly unit: string;
  readonly startDefault: number;
  readonly plateauValue: number;
  readonly drivingBenefitIds: readonly string[];
}

// KPI definitions: 13 KPIs across 4 clusters
export const KPI_DEFINITIONS: readonly KpiDefinition[] = [
  {
    id: "feature_anteil",
    cluster: "effizienz",
    label: "Feature-Anteil",
    unit: "%",
    startDefault: 20,
    plateauValue: 80,
    drivingBenefitIds: [], // special case: uses global asymptote formula
  },
  {
    id: "kosten_pro_feature",
    cluster: "effizienz",
    label: "Kosten pro Feature",
    unit: "x",
    startDefault: 1.0,
    plateauValue: 0.33,
    drivingBenefitIds: ["liefer-umfang", "kosten-pro-feature"],
  },
  {
    id: "lead_time",
    cluster: "effizienz",
    label: "Lead Time",
    unit: "Tage",
    startDefault: 14,
    plateauValue: 6,
    drivingBenefitIds: ["ai-reviewer-pr", "feedback-schneller"],
  },
  {
    id: "bug_h_pro_bug",
    cluster: "qualitaet",
    label: "Bug-Aufwand pro Bug",
    unit: "h",
    startDefault: 6,
    plateauValue: 1.7,
    drivingBenefitIds: ["bug-pre-trial"],
  },
  {
    id: "test_coverage",
    cluster: "qualitaet",
    label: "Test Coverage",
    unit: "%",
    startDefault: 20,
    plateauValue: 60,
    drivingBenefitIds: ["tests-sicherheitsnetz"],
  },
  {
    id: "production_incidents",
    cluster: "qualitaet",
    label: "Production Incidents",
    unit: "%",
    startDefault: 100,
    plateauValue: 30,
    drivingBenefitIds: [
      "tests-sicherheitsnetz",
      "performance-messbar",
      "notfall-bereitschaft",
    ],
  },
  {
    id: "compliance_aufwand",
    cluster: "qualitaet",
    label: "Compliance-Aufwand",
    unit: "h/Q",
    startDefault: 40,
    plateauValue: 8,
    drivingBenefitIds: ["compliance-ohne-sonderaktion", "sicherheit-substrat"],
  },
  {
    id: "bus_faktor",
    cluster: "team",
    label: "Bus-Faktor",
    unit: "Personen",
    startDefault: 0, // computed as ceil(devs/3) at runtime
    plateauValue: 0,
    drivingBenefitIds: [
      "bus-faktor-aufloesung",
      "architektur-dokumentiert",
      "domain-wissen",
    ],
  },
  {
    id: "onboarding_tage",
    cluster: "team",
    label: "Onboarding-Dauer",
    unit: "Tage",
    startDefault: 30,
    plateauValue: 12,
    drivingBenefitIds: ["onboarding-reibungsarm"],
  },
  {
    id: "review_h_pro_pr",
    cluster: "team",
    label: "Review-Aufwand pro PR",
    unit: "h",
    startDefault: 2,
    plateauValue: 1.4,
    drivingBenefitIds: ["ai-reviewer-pr"],
  },
  {
    id: "roadmap_treffquote",
    cluster: "geschaeft",
    label: "Roadmap-Treffquote",
    unit: "%",
    startDefault: 50,
    plateauValue: 80,
    drivingBenefitIds: ["roadmap-planbar", "spec-driven-rework"],
  },
  {
    id: "sales_bruecke",
    cluster: "geschaeft",
    label: "Sales-Entlastung",
    unit: "h/Wo",
    startDefault: 0,
    plateauValue: 8,
    drivingBenefitIds: ["sales-bruecke-entlastet"],
  },
  {
    id: "investierbarkeit",
    cluster: "geschaeft",
    label: "Investierbarkeit",
    unit: "%",
    startDefault: 0,
    plateauValue: 100,
    drivingBenefitIds: ["investorengeschichte", "plattform-selbstwartend"],
  },
];
