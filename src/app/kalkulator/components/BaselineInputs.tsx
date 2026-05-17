"use client";

import { useState, useEffect } from "react";

interface BaselineInputsProps {
  t: {
    heading: string;
    devCount: { label: string; hint: string };
    costPerDev: { label: string; hint: string; unit: string };
    featurePercent: { label: string; hint: string };
    greenFieldNote: string;
  };
  devCount: number;
  costPerDev: number;
  featurePercent: number;
  onDevCountChange: (v: number) => void;
  onCostPerDevChange: (v: number) => void;
  onFeaturePercentChange: (v: number) => void;
  isGreenField: boolean;
}

const INPUT_BASE =
  "w-full px-3 py-2 rounded border border-[var(--border)] bg-white text-[var(--text)] text-base" +
  " focus-visible:outline-[3px] focus-visible:outline-[var(--orange)] focus-visible:outline-offset-[3px]" +
  " placeholder:text-[var(--text-mid)]";

const LABEL_BASE = "block text-sm font-semibold text-[var(--text)] mb-1";
const HINT_BASE = "block text-xs text-[var(--text-mid)] mt-1";

export function BaselineInputs({
  t,
  devCount,
  costPerDev,
  featurePercent,
  onDevCountChange,
  onCostPerDevChange,
  onFeaturePercentChange,
  isGreenField,
}: BaselineInputsProps) {
  // Local string state so the user can freely type, clear, and edit.
  // Numeric value is committed to parent on blur only.
  const [devCountStr, setDevCountStr] = useState(String(devCount));
  const [costStr, setCostStr] = useState(String(costPerDev));

  // Sync local state when parent value changes (e.g. permalink restore)
  useEffect(() => { setDevCountStr(String(devCount)); }, [devCount]);
  useEffect(() => { setCostStr(String(costPerDev)); }, [costPerDev]);

  function commitDevCount(raw: string) {
    const v = parseInt(raw, 10);
    const clamped = isNaN(v) ? 0 : Math.max(0, Math.min(50, Math.round(v)));
    onDevCountChange(clamped);
    setDevCountStr(String(clamped));
  }

  function commitCostPerDev(raw: string) {
    const v = parseInt(raw, 10);
    const clamped = isNaN(v) ? 96_000 : Math.max(60_000, Math.min(200_000, Math.round(v)));
    onCostPerDevChange(clamped);
    setCostStr(String(clamped));
  }

  return (
    <div className="bg-[var(--surface-alt)] rounded p-6 md:p-8">
      <h2 className="text-xl font-extrabold text-[var(--text)] tracking-[-0.015em] mb-6">
        {t.heading}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6">
        {/* Dev Count */}
        <div>
          <label htmlFor="dev-count" className={LABEL_BASE}>
            {t.devCount.label}
          </label>
          <input
            id="dev-count"
            type="text"
            inputMode="numeric"
            value={devCountStr}
            onChange={(e) => setDevCountStr(e.target.value)}
            onBlur={(e) => commitDevCount(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") commitDevCount(e.currentTarget.value); }}
            className={INPUT_BASE}
            aria-describedby="dev-count-hint"
            style={{ minHeight: "48px" }}
          />
          <span id="dev-count-hint" className={HINT_BASE}>
            {t.devCount.hint}
          </span>
          {isGreenField && (
            <p
              role="status"
              className="mt-2 text-xs font-medium text-[var(--orange)] bg-[var(--orange)]/10 rounded px-3 py-2"
            >
              {t.greenFieldNote}
            </p>
          )}
        </div>

        {/* Cost per Dev */}
        <div>
          <label htmlFor="cost-per-dev" className={LABEL_BASE}>
            {t.costPerDev.label}
            <span className="ml-1 font-normal text-[var(--text-mid)]">
              ({t.costPerDev.unit})
            </span>
          </label>
          <input
            id="cost-per-dev"
            type="text"
            inputMode="numeric"
            value={costStr}
            onChange={(e) => setCostStr(e.target.value)}
            onBlur={(e) => commitCostPerDev(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") commitCostPerDev(e.currentTarget.value); }}
            className={INPUT_BASE}
            aria-describedby="cost-per-dev-hint"
            style={{ minHeight: "48px" }}
          />
          <span id="cost-per-dev-hint" className={HINT_BASE}>
            {t.costPerDev.hint}
          </span>
        </div>

        {/* Feature Percent slider */}
        <div className="sm:col-span-2">
          <div className="flex items-center justify-between mb-1">
            <label htmlFor="feature-percent" className={LABEL_BASE}>
              {t.featurePercent.label}
            </label>
            <span
              className="text-base font-bold text-[var(--orange)] tabular-nums"
              aria-live="polite"
              aria-atomic="true"
            >
              {featurePercent}%
            </span>
          </div>
          <div className="relative">
            {/* Visual track */}
            <div className="h-2 rounded bg-[var(--border)]" aria-hidden="true">
              <div
                className="h-2 rounded bg-[var(--orange)] transition-all duration-75"
                style={{ width: `${Math.round((featurePercent / 80) * 100)}%` }}
              />
            </div>
            {/* Native range overlaid */}
            <input
              id="feature-percent"
              type="range"
              min={0}
              max={80}
              step={1}
              value={featurePercent}
              onChange={(e) =>
                onFeaturePercentChange(parseInt(e.target.value, 10))
              }
              onBlur={(e) => {
                const v = parseInt(e.target.value, 10);
                onFeaturePercentChange(isNaN(v) ? 20 : Math.max(0, Math.min(80, v)));
              }}
              className={[
                "absolute inset-0 w-full cursor-pointer",
                "[&::-webkit-slider-runnable-track]:bg-transparent",
                "[&::-webkit-slider-runnable-track]:h-2",
                "[&::-moz-range-track]:bg-transparent",
                "[&::-moz-range-track]:h-2",
                "accent-[var(--orange)]",
              ].join(" ")}
              aria-describedby="feature-percent-hint"
              aria-valuemin={0}
              aria-valuemax={80}
              aria-valuenow={featurePercent}
              aria-valuetext={`${featurePercent}%`}
              style={{ minHeight: "28px", height: "28px", marginTop: "-13px" }}
            />
          </div>
          <span id="feature-percent-hint" className={HINT_BASE}>
            {t.featurePercent.hint}
          </span>
        </div>
      </div>
    </div>
  );
}
