"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import type { CalculatorInputs, PainPointId, TimeSlice } from "../lib/types";
import { DEFAULT_INPUTS, PHASES } from "../lib/constants";
import { BENEFITS } from "../lib/benefits-config";
import { generateTimeline, teamKostenForSlider } from "../lib/formulas";
import { readPermalink, pushPermalink } from "../lib/permalink";

export interface CalculatorState {
  inputs: CalculatorInputs;
  timeline: readonly TimeSlice[];
  teamKosten: number;
  isGreenField: boolean;
  maxBudget: number; // hard cap 45k/month

  // Actions
  setPainPoints: (points: readonly PainPointId[]) => void;
  togglePainPoint: (point: PainPointId) => void;
  setDevCount: (count: number) => void;
  setCostPerDev: (cost: number) => void;
  setFeaturePercent: (pct: number) => void;
  setBudgetMonthly: (budget: number) => void;
  setHorizonMonths: (months: number) => void;
  setEnablement: (enabled: boolean) => void;

  // Derived
  hoveredIteration: number | null;
  setHoveredIteration: (iter: number | null) => void;
  currentSlice: TimeSlice | null; // hovered or last slice
}

export function useCalculatorState(): CalculatorState {
  // Always start with defaults to avoid hydration mismatch.
  // Permalink state is applied client-side in useEffect.
  const [inputs, setInputs] = useState<CalculatorInputs>(DEFAULT_INPUTS);
  const [hoveredIteration, setHoveredIteration] = useState<number | null>(null);

  // Restore state from permalink on mount (client-only)
  useEffect(() => {
    const restored = readPermalink();
    if (restored) setInputs(restored);
  }, []);

  // Derived values
  // For UX slider stop positioning only (uses costPerDev)
  const teamKosten = useMemo(
    () => teamKostenForSlider(inputs.devCount, inputs.costPerDev),
    [inputs.devCount, inputs.costPerDev],
  );

  const isGreenField = inputs.devCount === 0;
  const maxBudget = 50_000; // PD_CAPACITY × PD_UNIT_COST_MAX

  const timeline = useMemo(
    () => generateTimeline(inputs, PHASES, BENEFITS),
    [inputs],
  );

  const currentSlice = useMemo(() => {
    if (hoveredIteration !== null) {
      return (
        timeline.find((s) => s.iteration === hoveredIteration) ??
        timeline[timeline.length - 1] ??
        null
      );
    }
    return timeline[timeline.length - 1] ?? null;
  }, [hoveredIteration, timeline]);

  // Push permalink on input change (debounced slightly)
  useEffect(() => {
    const timer = setTimeout(() => pushPermalink(inputs), 300);
    return () => clearTimeout(timer);
  }, [inputs]);

  // Input setters
  const update = useCallback((partial: Partial<CalculatorInputs>) => {
    setInputs((prev) => ({ ...prev, ...partial }));
  }, []);

  const setPainPoints = useCallback(
    (painPoints: readonly PainPointId[]) => update({ painPoints }),
    [update],
  );

  const togglePainPoint = useCallback((point: PainPointId) => {
    setInputs((prev) => {
      const has = prev.painPoints.includes(point);
      return {
        ...prev,
        painPoints: has
          ? prev.painPoints.filter((p) => p !== point)
          : [...prev.painPoints, point],
      };
    });
  }, []);

  const setDevCount = useCallback(
    (devCount: number) =>
      update({ devCount: Math.max(0, Math.min(50, devCount)) }),
    [update],
  );

  const setCostPerDev = useCallback(
    (costPerDev: number) =>
      update({ costPerDev: Math.max(60_000, Math.min(200_000, costPerDev)) }),
    [update],
  );

  const setFeaturePercent = useCallback(
    (featurePercent: number) =>
      update({ featurePercent: Math.max(0, Math.min(80, featurePercent)) }),
    [update],
  );

  const setBudgetMonthly = useCallback(
    (budgetMonthly: number) =>
      update({ budgetMonthly: Math.max(0, Math.min(50_000, budgetMonthly)) }),
    [update],
  );

  const setHorizonMonths = useCallback(
    (horizonMonths: number) =>
      update({ horizonMonths: Math.max(3, Math.min(36, horizonMonths)) }),
    [update],
  );

  const setEnablement = useCallback(
    (enablement: boolean) => update({ enablement }),
    [update],
  );

  return {
    inputs,
    timeline,
    teamKosten,
    isGreenField,
    maxBudget,
    setPainPoints,
    togglePainPoint,
    setDevCount,
    setCostPerDev,
    setFeaturePercent,
    setBudgetMonthly,
    setHorizonMonths,
    setEnablement,
    hoveredIteration,
    setHoveredIteration,
    currentSlice,
  };
}
