"use client";

import type { BenefitAtTime } from "../lib/types";
import { COMPOUNDING_PAIRS } from "../lib/benefits-config";

interface CompoundingLinesProps {
  benefits: readonly BenefitAtTime[];
}

function ArrowRight() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="var(--orange)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="shrink-0 mx-2"
    >
      <path d="M5 12h14M13 5l7 7-7 7" />
    </svg>
  );
}

export function CompoundingLines({ benefits }: CompoundingLinesProps) {
  const activePairs = COMPOUNDING_PAIRS.filter((pair) => {
    const fromState = benefits.find((b) => b.benefit.id === pair.from);
    const toState = benefits.find((b) => b.benefit.id === pair.to);
    return fromState?.status === "aktiv" && toState?.status === "aktiv";
  });

  if (activePairs.length === 0) return null;

  return (
    <div className="mt-4">
      <p className="text-xs font-semibold text-[var(--text-mid)] uppercase tracking-widest mb-3">
        Zinseszins-Effekt
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {activePairs.map((pair) => {
          const fromBenefit = benefits.find((b) => b.benefit.id === pair.from);
          const toBenefit = benefits.find((b) => b.benefit.id === pair.to);
          if (!fromBenefit || !toBenefit) return null;

          return (
            <div
              key={`${pair.from}-${pair.to}`}
              className="bg-white border border-[var(--border)] border-l-4 border-l-[var(--orange)] rounded p-4"
            >
              <div className="flex items-center">
                <span className="text-sm font-semibold text-[var(--text)] leading-snug">
                  {fromBenefit.benefit.titel}
                </span>
                <ArrowRight />
                <span className="text-sm font-semibold text-[var(--text)] leading-snug">
                  {toBenefit.benefit.titel}
                </span>
              </div>
              <p className="text-xs text-[var(--text-mid)] mt-2 italic">
                {pair.label}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
