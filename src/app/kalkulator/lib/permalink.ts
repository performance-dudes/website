import type { CalculatorInputs, PainPointId } from "./types";

// Pain point IDs in fixed order for index-based encoding
const PAIN_POINT_ORDER: readonly PainPointId[] = [
  "shipping-zu-langsam",
  "bug-last",
  "releases-stress",
  "bus-faktor",
  "compliance-audits",
  "onboarding-langsam",
  "sales-bruecke",
];

interface PermalinkState {
  p: number[];   // pain point indices (0-6)
  d: number;     // dev count
  c: number;     // cost per dev (in k, e.g. 96)
  f: number;     // feature percent
  b: number;     // budget monthly (in k, e.g. 40)
  h: number;     // horizon months
  e: 0 | 1;     // enablement
}

export function encodeState(inputs: CalculatorInputs): string {
  const state: PermalinkState = {
    p: inputs.painPoints.map(pp => PAIN_POINT_ORDER.indexOf(pp)).filter(i => i >= 0),
    d: inputs.devCount,
    c: Math.round(inputs.costPerDev / 1000),
    f: inputs.featurePercent,
    b: Math.round(inputs.budgetMonthly / 1000),
    h: inputs.horizonMonths,
    e: inputs.enablement ? 1 : 0,
  };
  return btoa(JSON.stringify(state));
}

export function decodeState(encoded: string): CalculatorInputs | null {
  try {
    const state: PermalinkState = JSON.parse(atob(encoded));
    // Validate required fields
    if (!Array.isArray(state.p) || typeof state.d !== "number" || typeof state.c !== "number"
      || typeof state.f !== "number" || typeof state.b !== "number" || typeof state.h !== "number") {
      return null;
    }
    // Map and clamp
    return {
      painPoints: state.p
        .filter((i): i is number => typeof i === "number" && i >= 0 && i < PAIN_POINT_ORDER.length)
        .map(i => PAIN_POINT_ORDER[i] as PainPointId),
      devCount: clamp(state.d, 0, 50),
      costPerDev: clamp(state.c * 1000, 60_000, 200_000),
      featurePercent: clamp(state.f, 0, 80),
      budgetMonthly: clamp(state.b * 1000, 0, 50_000),
      horizonMonths: clamp(state.h, 3, 36),
      enablement: state.e === 1,
    };
  } catch {
    return null;
  }
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

// Update URL without page reload
export function pushPermalink(inputs: CalculatorInputs): void {
  const encoded = encodeState(inputs);
  const url = new URL(window.location.href);
  url.searchParams.set("s", encoded);
  window.history.pushState({}, "", url.toString());
}

// Read state from current URL
export function readPermalink(): CalculatorInputs | null {
  if (typeof window === "undefined") return null;
  const params = new URLSearchParams(window.location.search);
  const s = params.get("s");
  if (!s) return null;
  return decodeState(s);
}
