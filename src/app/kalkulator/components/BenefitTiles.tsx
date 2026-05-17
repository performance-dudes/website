"use client";

import { useState } from "react";
import type {
  TimeSlice,
  PainPointId,
  BenefitAtTime,
  BenefitOperativ,
  BenefitStrategisch,
  BenefitRisiko,
} from "../lib/types";
import { CompoundingLines } from "./CompoundingLines";

interface BenefitTilesProps {
  t: {
    moreLabel: string; // "Und das kommt noch dazu: {count} weitere Effekte"
    phaseLabel: string; // "ab Phase {phase}"
  };
  currentSlice: TimeSlice | null;
  painPoints: readonly PainPointId[];
}

function matchCount(
  benefitState: BenefitAtTime,
  painPoints: readonly PainPointId[],
): number {
  return benefitState.benefit.painPoints.filter((pp) =>
    painPoints.includes(pp),
  ).length;
}

function sortedBenefits(
  benefits: readonly BenefitAtTime[],
  painPoints: readonly PainPointId[],
): BenefitAtTime[] {
  return [...benefits].sort((a, b) => {
    const matchDiff = matchCount(b, painPoints) - matchCount(a, painPoints);
    if (matchDiff !== 0) return matchDiff;
    const phaseDiff =
      a.benefit.phaseVoraussetzung - b.benefit.phaseVoraussetzung;
    if (phaseDiff !== 0) return phaseDiff;
    return a.benefit.defaultPrio - b.benefit.defaultPrio;
  });
}

// Tiny SVG sparkline placeholder showing sigmoid/linear/treppen curve shape
function SparklinePlaceholder({
  kurvenForm,
}: {
  kurvenForm: "sigmoid" | "linear_ramp" | "treppen";
}) {
  // 50x20 viewBox, path approximates the curve shape
  const paths: Record<string, string> = {
    sigmoid: "M0,18 C10,18 15,14 20,10 C25,6 30,2 50,2",
    linear_ramp: "M0,18 L50,2",
    treppen:
      "M0,18 L12,18 L12,12 L25,12 L25,7 L38,7 L38,2 L50,2",
  };
  const d = paths[kurvenForm] ?? paths["sigmoid"];

  return (
    <svg
      width={50}
      height={20}
      viewBox="0 0 50 20"
      fill="none"
      aria-hidden="true"
      className="shrink-0"
    >
      <path d={d} stroke="var(--orange)" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function PhaseBadge({
  phase,
  phaseLabel,
}: {
  phase: number;
  phaseLabel: string;
}) {
  const label = phaseLabel.replace("{phase}", String(phase));
  return (
    <span className="bg-[var(--orange)] text-white text-[0.65rem] font-bold tracking-widest uppercase px-2 py-0.5 rounded-sm">
      {label}
    </span>
  );
}

function StatusBorder({ status }: { status: BenefitAtTime["status"] }) {
  if (status === "aktiv") return "border-l-4 border-l-green-500";
  if (status === "im-aufbau") return "border-l-4 border-l-amber-400";
  return "border-l-4 border-l-[var(--border)] opacity-70";
}

function OperativTile({
  state,
  phaseLabel,
}: {
  state: BenefitAtTime;
  phaseLabel: string;
}) {
  const b = state.benefit as BenefitOperativ;
  return (
    <div
      className={`bg-white border border-[var(--border)] rounded p-4 flex flex-col gap-3 hover:-translate-y-1 hover:shadow-lg transition-all duration-200 ${StatusBorder({ status: state.status })}`}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-semibold text-[var(--text)] leading-snug">
          {b.titel}
        </p>
        <PhaseBadge phase={b.phaseVoraussetzung} phaseLabel={phaseLabel} />
      </div>
      <div className="flex items-center gap-3">
        <SparklinePlaceholder kurvenForm={b.kurvenForm} />
        <span className="text-xs text-[var(--text-mid)]">{b.plateauLabel}</span>
      </div>
      {state.status === "im-aufbau" && (
        <div className="w-full bg-[var(--border)] rounded-full h-1.5" role="progressbar" aria-valuenow={Math.round(state.progress * 100)} aria-valuemin={0} aria-valuemax={100}>
          <div
            className="h-1.5 rounded-full bg-amber-400"
            style={{ width: `${Math.round(state.progress * 100)}%` }}
          />
        </div>
      )}
    </div>
  );
}

function StrategischTile({
  state,
  phaseLabel,
}: {
  state: BenefitAtTime;
  phaseLabel: string;
}) {
  const b = state.benefit as BenefitStrategisch;
  return (
    <div
      className={`bg-white border border-[var(--border)] rounded p-4 flex flex-col gap-3 hover:-translate-y-1 hover:shadow-lg transition-all duration-200 ${StatusBorder({ status: state.status })}`}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-semibold text-[var(--text)] leading-snug">
          {b.titel}
        </p>
        <PhaseBadge phase={b.phaseVoraussetzung} phaseLabel={phaseLabel} />
      </div>
      <div className="flex flex-col gap-1 text-xs">
        <span className="text-[var(--text-mid)] line-through">{b.proxyVorher}</span>
        <span className="flex items-center gap-1">
          <span className="text-[var(--orange)] font-bold" aria-hidden="true">&rarr;</span>
          <span className="text-[var(--text)] font-medium">{b.proxyNachher}</span>
        </span>
      </div>
    </div>
  );
}

function RisikoTile({
  state,
  phaseLabel,
}: {
  state: BenefitAtTime;
  phaseLabel: string;
}) {
  const b = state.benefit as BenefitRisiko;
  return (
    <div
      className={`bg-white border border-[var(--border)] rounded p-4 flex flex-col gap-3 hover:-translate-y-1 hover:shadow-lg transition-all duration-200 ${StatusBorder({ status: state.status })}`}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-semibold text-[var(--text)] leading-snug">
          {b.titel}
        </p>
        <PhaseBadge phase={b.phaseVoraussetzung} phaseLabel={phaseLabel} />
      </div>
      <div className="flex flex-col gap-1 text-xs">
        <span className="text-red-500/80">{b.vorher}</span>
        <span className="flex items-center gap-1">
          <span className="text-[var(--orange)] font-bold" aria-hidden="true">&rarr;</span>
          <span className="text-green-600 font-medium">{b.nachher}</span>
        </span>
      </div>
    </div>
  );
}

function BenefitTile({
  state,
  phaseLabel,
}: {
  state: BenefitAtTime;
  phaseLabel: string;
}) {
  switch (state.benefit.kachelTyp) {
    case "operativ":
      return <OperativTile state={state} phaseLabel={phaseLabel} />;
    case "strategisch":
      return <StrategischTile state={state} phaseLabel={phaseLabel} />;
    case "risiko":
      return <RisikoTile state={state} phaseLabel={phaseLabel} />;
  }
}

const VISIBLE_COUNT = 8;

export function BenefitTiles({
  t,
  currentSlice,
  painPoints,
}: BenefitTilesProps) {
  const [expanded, setExpanded] = useState(false);

  if (!currentSlice) return null;

  const sorted = sortedBenefits(currentSlice.benefits, painPoints);
  const visible = sorted.slice(0, VISIBLE_COUNT);
  const hidden = sorted.slice(VISIBLE_COUNT);

  const showCompounding = currentSlice.phase >= 5;

  const moreLabel = t.moreLabel.replace("{count}", String(hidden.length));

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {visible.map((state) => (
          <BenefitTile
            key={state.benefit.id}
            state={state}
            phaseLabel={t.phaseLabel}
          />
        ))}

        {expanded &&
          hidden.map((state) => (
            <BenefitTile
              key={state.benefit.id}
              state={state}
              phaseLabel={t.phaseLabel}
            />
          ))}
      </div>

      {hidden.length > 0 && (
        <div className="mt-4 flex justify-center">
          <button
            type="button"
            onClick={() => setExpanded((prev) => !prev)}
            className="text-sm font-medium text-[var(--orange)] underline underline-offset-2 hover:text-[var(--orange)]/80 transition-colors min-h-[40px] px-4"
          >
            {expanded ? "Weniger anzeigen" : moreLabel}
          </button>
        </div>
      )}

      {showCompounding && (
        <CompoundingLines benefits={currentSlice.benefits} />
      )}
    </div>
  );
}
