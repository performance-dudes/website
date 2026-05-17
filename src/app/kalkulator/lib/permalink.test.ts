import { describe, it, expect } from "vitest";
import { encodeState, decodeState } from "./permalink";
import type { CalculatorInputs } from "./types";

const DEFAULTS: CalculatorInputs = {
  painPoints: ["shipping-zu-langsam", "bug-last"],
  devCount: 5,
  costPerDev: 96_000,
  featurePercent: 20,
  budgetMonthly: 28_000,
  horizonMonths: 12,
  enablement: false,
};

describe("permalink", () => {
  describe("roundtrip", () => {
    it("encode then decode returns same inputs", () => {
      const encoded = encodeState(DEFAULTS);
      const decoded = decodeState(encoded);
      expect(decoded).toEqual(DEFAULTS);
    });

    it("handles all pain points", () => {
      const all: CalculatorInputs = {
        ...DEFAULTS,
        painPoints: [
          "shipping-zu-langsam", "bug-last", "releases-stress",
          "bus-faktor", "compliance-audits", "onboarding-langsam", "sales-bruecke",
        ],
      };
      expect(decodeState(encodeState(all))).toEqual(all);
    });

    it("handles empty pain points", () => {
      const empty: CalculatorInputs = { ...DEFAULTS, painPoints: [] };
      expect(decodeState(encodeState(empty))).toEqual(empty);
    });

    it("handles enablement on", () => {
      const en: CalculatorInputs = { ...DEFAULTS, enablement: true };
      expect(decodeState(encodeState(en))).toEqual(en);
    });
  });

  describe("decodeState edge cases", () => {
    it("returns null for invalid base64", () => {
      expect(decodeState("!!!invalid!!!")).toBeNull();
    });

    it("returns null for valid base64 but missing fields", () => {
      expect(decodeState(btoa("{}"))).toBeNull();
    });

    it("clamps out-of-range values", () => {
      const extreme = btoa(JSON.stringify({
        p: [0], d: 100, c: 300, f: 95, b: -5, h: 0, e: 0,
      }));
      const result = decodeState(extreme);
      expect(result).not.toBeNull();
      expect(result!.devCount).toBe(50);
      expect(result!.costPerDev).toBe(200_000);
      expect(result!.featurePercent).toBe(80);
      expect(result!.budgetMonthly).toBe(0); // Max(0, -5000) clamped at 0
      expect(result!.horizonMonths).toBe(3);
    });

    it("ignores invalid pain point indices", () => {
      const bad = btoa(JSON.stringify({
        p: [0, 99, -1], d: 5, c: 96, f: 20, b: 28, h: 12, e: 0,
      }));
      const result = decodeState(bad);
      expect(result).not.toBeNull();
      expect(result!.painPoints).toEqual(["shipping-zu-langsam"]);
    });
  });
});
