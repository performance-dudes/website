"use client";

import { useState, useMemo } from "react";
import { ResponsiveContainer, LineChart, Line, YAxis } from "recharts";
import type { TimeSlice, CalculatorInputs } from "../lib/types";
import { KPI_DEFINITIONS, PHASES } from "../lib/constants";
import { BENEFITS } from "../lib/benefits-config";
import {
  kpiValue,
  combinedBenefitProgress,
  featureAnteil,
  phaseCalendarWeeks,
  pdPersonsEngaged,
} from "../lib/formulas";

interface KpiDashboardProps {
  t: {
    heading: string;
    clusters: {
      effizienz: string;
      qualitaet: string;
      team: string;
      geschaeft: string;
    };
    todayLabel: string;
    targetLabel: string;
  };
  timeline: readonly TimeSlice[];
  inputs: CalculatorInputs;
  currentSlice: TimeSlice | null;
}

type ClusterId = "effizienz" | "qualitaet" | "team" | "geschaeft";

function formatValue(value: number, unit: string): string {
  if (unit === "%") return `${Math.round(value * 10) / 10}%`;
  if (unit === "x") return `${Math.round(value * 100) / 100}x`;
  if (unit === "h" || unit === "h/Wo" || unit === "h/Q")
    return `${Math.round(value * 10) / 10}\u00a0${unit}`;
  if (unit === "Tage" || unit === "Personen")
    return `${Math.round(value)}\u00a0${unit}`;
  return `${Math.round(value * 10) / 10}\u00a0${unit}`;
}

interface SparklineData {
  v: number;
}

function KpiCard({
  label,
  unit,
  startDefault: rawStartDefault,
  plateauValue,
  sparklineData,
  todayLabel,
  targetLabel,
  todayValue,
}: {
  label: string;
  unit: string;
  startDefault: number;
  plateauValue: number;
  sparklineData: SparklineData[];
  todayLabel: string;
  targetLabel: string;
  todayValue: number;
}) {
  // Determine whether the KPI is ascending or descending towards plateau
  const isDescending = plateauValue < rawStartDefault;

  // Domain for the sparkline Y axis
  const yMin = isDescending ? plateauValue : rawStartDefault;
  const yMax = isDescending ? rawStartDefault : plateauValue;

  return (
    <div className="bg-white border border-[var(--border)] rounded p-4 border-t-2 border-t-[var(--orange)] hover:-translate-y-1 hover:shadow-lg transition-all duration-200">
      <p className="text-xs font-semibold text-[var(--text-mid)] uppercase tracking-widest mb-2">
        {label}
      </p>

      <div className="flex items-end justify-between gap-4 mb-2">
        <div>
          <p className="text-[0.65rem] text-[var(--text-mid)] uppercase tracking-widest">
            {todayLabel}
          </p>
          <p className="text-lg font-extrabold text-[var(--text)] tabular-nums leading-tight">
            {formatValue(todayValue, unit)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[0.65rem] text-[var(--text-mid)] uppercase tracking-widest">
            {targetLabel}
          </p>
          <p className="text-base font-bold text-[var(--orange)] tabular-nums leading-tight">
            {formatValue(plateauValue, unit)}
          </p>
        </div>
      </div>

      {/* Sparkline: 120x40px */}
      <div style={{ width: "100%", height: 40 }}>
        <ResponsiveContainer width="100%" height={40}>
          <LineChart
            data={sparklineData}
            margin={{ top: 2, right: 2, bottom: 2, left: 2 }}
          >
            <YAxis domain={[yMin, yMax]} hide />
            <Line
              type="monotone"
              dataKey="v"
              stroke="var(--orange)"
              strokeWidth={1.5}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

const CLUSTER_ORDER: ClusterId[] = [
  "effizienz",
  "qualitaet",
  "team",
  "geschaeft",
];

export function KpiDashboard({
  t,
  timeline,
  inputs,
}: KpiDashboardProps) {
  // Default: effizienz expanded, others collapsed
  const [openClusters, setOpenClusters] = useState<Set<ClusterId>>(
    new Set(["effizienz"]),
  );

  function toggleCluster(id: ClusterId) {
    setOpenClusters((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  const phaseWeeks = useMemo(
    () => phaseCalendarWeeks(PHASES, pdPersonsEngaged(inputs.budgetMonthly)),
    [inputs.budgetMonthly],
  );

  const enablementStartIter = useMemo(() => {
    if (!inputs.enablement) return Infinity;
    return phaseWeeks[2] ?? Infinity;
  }, [inputs.enablement, phaseWeeks]);

  // Build sparkline data per KPI using the timeline
  const kpiSparklines = useMemo(() => {
    // Downsample timeline to at most 60 points for the sparkline
    const step = Math.max(1, Math.floor(timeline.length / 60));
    const sampled = timeline.filter((_, i) => i % step === 0);

    return KPI_DEFINITIONS.map((kpi) => {
      const data: SparklineData[] = sampled.map((slice) => {
        let v: number;

        if (kpi.id === "feature_anteil") {
          v = slice.featureAnteil * 100;
        } else {
          const startDefault =
            kpi.id === "bus_faktor"
              ? Math.ceil(inputs.devCount / 3)
              : kpi.startDefault;

          const progress = combinedBenefitProgress(
            slice.iteration,
            kpi.id,
            BENEFITS,
            PHASES,
            phaseWeeks,
            inputs.enablement,
            enablementStartIter,
          );
          v = kpiValue(startDefault, kpi.plateauValue, progress);
        }

        return { v };
      });

      return { id: kpi.id, data };
    });
  }, [timeline, inputs, enablementStartIter, phaseWeeks]);

  // Compute today's value at the current slice (iteration 0 / start)
  const todayValues = useMemo(() => {
    return KPI_DEFINITIONS.map((kpi) => {
      if (kpi.id === "feature_anteil") {
        const pdPersonsVal = pdPersonsEngaged(inputs.budgetMonthly);
        const v = featureAnteil(
          0,
          inputs.featurePercent,
          pdPersonsVal,
          inputs.devCount,
          0,
        );
        return { id: kpi.id, value: v * 100 };
      }

      if (kpi.id === "bus_faktor") {
        return { id: kpi.id, value: Math.ceil(inputs.devCount / 3) };
      }

      return { id: kpi.id, value: kpi.startDefault };
    });
  }, [inputs]);

  const clusterLabels: Record<ClusterId, string> = {
    effizienz: t.clusters.effizienz,
    qualitaet: t.clusters.qualitaet,
    team: t.clusters.team,
    geschaeft: t.clusters.geschaeft,
  };

  return (
    <div>
      <h3 className="text-xl font-extrabold text-[var(--text)] tracking-[-0.015em] mb-5">
        {t.heading}
      </h3>

      <div className="space-y-3">
        {CLUSTER_ORDER.map((clusterId) => {
          const clusterKpis = KPI_DEFINITIONS.filter(
            (kpi) => kpi.cluster === clusterId,
          );
          const isOpen = openClusters.has(clusterId);

          return (
            <div
              key={clusterId}
              className="border border-[var(--border)] rounded overflow-hidden"
            >
              <button
                type="button"
                onClick={() => toggleCluster(clusterId)}
                aria-expanded={isOpen}
                className="w-full flex items-center justify-between px-5 py-4 text-left bg-[var(--surface-alt)] hover:bg-[var(--border)]/30 transition-colors min-h-[48px]"
              >
                <span className="font-bold text-[var(--text)]">
                  {clusterLabels[clusterId]}
                </span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  className={`shrink-0 text-[var(--orange)] transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>

              {isOpen && (
                <div className="p-4 bg-white grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {clusterKpis.map((kpi) => {
                    const sparklineEntry = kpiSparklines.find(
                      (s) => s.id === kpi.id,
                    );
                    const todayEntry = todayValues.find(
                      (tv) => tv.id === kpi.id,
                    );

                    const startDefault =
                      kpi.id === "bus_faktor"
                        ? Math.ceil(inputs.devCount / 3)
                        : kpi.startDefault;

                    return (
                      <KpiCard
                        key={kpi.id}
                        label={kpi.label}
                        unit={kpi.unit}
                        startDefault={startDefault}
                        plateauValue={kpi.plateauValue}
                        sparklineData={sparklineEntry?.data ?? []}
                        todayLabel={t.todayLabel}
                        targetLabel={t.targetLabel}
                        todayValue={todayEntry?.value ?? startDefault}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
