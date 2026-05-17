"use client";

import { useId } from "react";
import { PD_CAPACITY, PD_UNIT_COST, PD_UNIT_COST_MAX } from "../lib/constants";

interface BudgetSliderProps {
  t: {
    heading: string;
    sliderLabel: string;
    stops: { einstieg: string; empfehlung: string; vollerEffekt: string };
    horizonLabel: string;
    horizonUnit: string;
    enablementLabel: string;
    enablementHint: string;
    overCapText: string;
    zeroText: string;
    sweetSpotText: string;
    budgetContext?: string;
    enablementContext?: string;
  };
  budget: number;
  maxBudget: number;
  isGreenField: boolean;
  horizonMonths: number;
  enablement: boolean;
  onBudgetChange: (v: number) => void;
  onHorizonChange: (v: number) => void;
  onEnablementChange: (v: boolean) => void;
}

const EUR = new Intl.NumberFormat("de-DE", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

// Fixed stops based on PD capacity, not customer team costs
const STOP_EINSTIEG = Math.round(PD_UNIT_COST / 2);           // 10k — 0.5 PD
const STOP_EMPFEHLUNG = PD_UNIT_COST;                          // 20k — 1 PD full
const STOP_VOLLE_WIRKUNG = PD_CAPACITY * PD_UNIT_COST;        // 40k — 2 PDs
const SLIDER_MAX = PD_CAPACITY * PD_UNIT_COST_MAX;             // 50k — burst cap

function toPercent(value: number, max: number): number {
  if (max <= 0) return 0;
  return Math.round((value / max) * 100);
}

/** Magnetic snap: if within 3k of the 20k (1 PD) mark, snap to it */
function maybeSnap(value: number): number {
  if (Math.abs(value - STOP_EMPFEHLUNG) <= 3_000) return STOP_EMPFEHLUNG;
  return value;
}

const LABEL_BASE = "block text-sm font-semibold text-[var(--text)] mb-1";
const HINT_BASE = "block text-xs text-[var(--text-mid)] mt-1";

export function BudgetSlider({
  t,
  budget,
  maxBudget,
  isGreenField,
  horizonMonths,
  enablement,
  onBudgetChange,
  onHorizonChange,
  onEnablementChange,
}: BudgetSliderProps) {
  const budgetId = useId();
  const horizonId = useId();
  const enablementId = useId();

  const sliderMax = Math.min(SLIDER_MAX, maxBudget);
  const fillPercent = toPercent(Math.min(budget, sliderMax), sliderMax);

  // Stop positions as percentages
  const stops = [
    { value: STOP_EINSTIEG, pct: toPercent(STOP_EINSTIEG, sliderMax), label: t.stops.einstieg },
    { value: STOP_EMPFEHLUNG, pct: toPercent(STOP_EMPFEHLUNG, sliderMax), label: t.stops.empfehlung },
    { value: STOP_VOLLE_WIRKUNG, pct: toPercent(STOP_VOLLE_WIRKUNG, sliderMax), label: t.stops.vollerEffekt },
  ];

  function handleBudgetInput(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = parseInt(e.target.value, 10);
    if (isNaN(raw)) return;
    const value = maybeSnap(raw);
    onBudgetChange(Math.max(0, Math.min(sliderMax, Math.round(value))));
  }

  function handleHorizonInput(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = parseInt(e.target.value, 10);
    if (!isNaN(raw)) onHorizonChange(Math.max(3, Math.min(36, raw)));
  }

  const budgetLabel = `${budgetId}-label`;
  const horizonLabel = `${horizonId}-label`;

  return (
    <div className="bg-[var(--surface-alt)] rounded p-6 md:p-8">
      <h2 className="text-xl font-extrabold text-[var(--text)] tracking-[-0.015em] mb-2">
        {t.heading}
      </h2>
      {t.budgetContext && (
        <p className="text-sm text-[var(--text-mid)] mb-6 leading-relaxed">
          {t.budgetContext}
        </p>
      )}
      {!t.budgetContext && <div className="mb-4" />}

      {/* Budget Slider */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <label id={budgetLabel} htmlFor={budgetId} className={LABEL_BASE}>
            {t.sliderLabel}
          </label>
          <span
            className="text-lg font-bold text-[var(--orange)] tabular-nums"
            aria-live="polite"
            aria-atomic="true"
          >
            {EUR.format(budget)}
          </span>
        </div>

        {/* Track with fill and stop markers */}
        <div className="relative">
          <div className="relative" aria-hidden="true">
            <div className="relative h-2 rounded bg-[var(--border)]">
              <div
                className="absolute inset-y-0 left-0 rounded bg-[var(--orange)] transition-all duration-75"
                style={{ width: `${fillPercent}%` }}
              />
              {/* Stop markers */}
              {stops.map(({ pct, label }) => (
                <div
                  key={label}
                  className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full border-2 border-white bg-[var(--asphalt)]"
                  style={{ left: `calc(${pct}% - 4px)` }}
                  title={label}
                />
              ))}
            </div>

            {/* Native range input overlaid */}
            <input
              id={budgetId}
              type="range"
              min={0}
              max={sliderMax}
              step={1_000}
              value={Math.min(budget, sliderMax)}
              onChange={handleBudgetInput}
              className={[
                "absolute inset-0 w-full cursor-pointer opacity-100",
                "[&::-webkit-slider-runnable-track]:bg-transparent",
                "[&::-webkit-slider-runnable-track]:h-2",
                "[&::-moz-range-track]:bg-transparent",
                "[&::-moz-range-track]:h-2",
                "accent-[var(--orange)]",
              ].join(" ")}
              aria-labelledby={budgetLabel}
              aria-valuemin={0}
              aria-valuemax={sliderMax}
              aria-valuenow={budget}
              aria-valuetext={EUR.format(budget)}
              style={{ minHeight: "28px", height: "28px", marginTop: "-13px" }}
            />
          </div>

          {/* Stop labels: 45° angled below their dot positions */}
          <div className="relative h-10 mt-0.5" aria-hidden="true">
            {stops.map(({ pct, label }) => (
              <span
                key={label}
                className="absolute text-[10px] font-medium text-[var(--text-mid)] whitespace-nowrap origin-top-left"
                style={{ left: `${pct}%`, top: 0, transform: "rotate(45deg)" }}
              >
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* Contextual text below slider */}
        {budget <= 0 && (
          <p className="mt-2 text-sm text-[var(--text-mid)]">{t.zeroText}</p>
        )}
        {budget >= STOP_EMPFEHLUNG && budget < STOP_VOLLE_WIRKUNG && (
          <p className="mt-2 text-sm font-medium text-[var(--orange)]">
            {t.sweetSpotText}
          </p>
        )}
        {budget > STOP_VOLLE_WIRKUNG && (
          <p className="mt-2 text-sm font-medium text-[var(--orange)]">
            {t.overCapText}
          </p>
        )}
      </div>

      {/* Horizon Slider */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <label id={horizonLabel} htmlFor={horizonId} className={LABEL_BASE}>
            {t.horizonLabel}
          </label>
          <span
            className="text-base font-bold text-[var(--orange)] tabular-nums"
            aria-live="polite"
            aria-atomic="true"
          >
            {horizonMonths} {t.horizonUnit}
          </span>
        </div>

        <div className="relative" aria-hidden="true">
          <div className="h-2 rounded bg-[var(--border)]">
            <div
              className="h-2 rounded bg-[var(--orange)] transition-all duration-75"
              style={{
                width: `${Math.round(((horizonMonths - 3) / (36 - 3)) * 100)}%`,
              }}
            />
          </div>
          <input
            id={horizonId}
            type="range"
            min={3}
            max={36}
            step={1}
            value={horizonMonths}
            onChange={handleHorizonInput}
            className={[
              "absolute inset-0 w-full cursor-pointer opacity-100",
              "[&::-webkit-slider-runnable-track]:bg-transparent",
              "[&::-webkit-slider-runnable-track]:h-2",
              "[&::-moz-range-track]:bg-transparent",
              "[&::-moz-range-track]:h-2",
              "accent-[var(--orange)]",
            ].join(" ")}
            aria-labelledby={horizonLabel}
            aria-valuemin={3}
            aria-valuemax={36}
            aria-valuenow={horizonMonths}
            aria-valuetext={`${horizonMonths} ${t.horizonUnit}`}
            style={{ minHeight: "28px", height: "28px", marginTop: "-13px" }}
          />
        </div>
        <div
          className="flex justify-between text-[10px] text-[var(--text-mid)] mt-1"
          aria-hidden="true"
        >
          <span>3 {t.horizonUnit}</span>
          <span>36 {t.horizonUnit}</span>
        </div>
      </div>

      {/* Enablement checkbox (only when there is a team to enable) */}
      {!isGreenField && (
        <div className="border border-[var(--border)] rounded p-4 bg-white/50">
          <div className="flex items-start gap-3">
            <input
              id={enablementId}
              type="checkbox"
              checked={enablement}
              onChange={(e) => onEnablementChange(e.target.checked)}
              className="mt-0.5 h-5 w-5 shrink-0 rounded cursor-pointer accent-[var(--orange)]"
              aria-describedby={`${enablementId}-hint`}
            />
            <div>
              <label
                htmlFor={enablementId}
                className="block text-sm font-semibold text-[var(--text)] cursor-pointer select-none"
              >
                {t.enablementLabel}
              </label>
              <span
                id={`${enablementId}-hint`}
                className={HINT_BASE}
              >
                {t.enablementHint}
              </span>
            </div>
          </div>
          {enablement && t.enablementContext && (
            <p className="text-sm text-[var(--text-mid)] mt-3 ml-8 leading-relaxed">
              {t.enablementContext}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
