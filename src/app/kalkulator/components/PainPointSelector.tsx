"use client";

import type { PainPointId } from "../lib/types";

interface PainPointSelectorProps {
  t: {
    heading: string;
    items: readonly { id: string; label: string; description: string }[];
  };
  selected: readonly PainPointId[];
  onToggle: (id: PainPointId) => void;
}

export function PainPointSelector({
  t,
  selected,
  onToggle,
}: PainPointSelectorProps) {
  return (
    <div>
      <h2 className="text-[clamp(1.75rem,4vw,2.75rem)] font-extrabold text-[var(--text-dark)] tracking-[-0.025em] leading-[1.1] mb-8">
        {t.heading}
      </h2>
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
        role="group"
        aria-label={t.heading}
      >
        {t.items.map((item) => {
          const isSelected = selected.includes(item.id as PainPointId);
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onToggle(item.id as PainPointId)}
              aria-pressed={isSelected}
              className={[
                "text-left p-5 rounded border-2 transition-all duration-200 min-h-[72px]",
                "focus-visible:outline-[3px] focus-visible:outline-[var(--orange)] focus-visible:outline-offset-[3px]",
                isSelected
                  ? "bg-[var(--orange)] border-[var(--orange)] text-white"
                  : "bg-white/5 border-[var(--silver)]/20 text-[var(--text-dark)] hover:border-[var(--orange)]/50",
              ].join(" ")}
            >
              <span className="block font-bold text-base">{item.label}</span>
              <span
                className={`block text-sm mt-1 ${
                  isSelected
                    ? "text-white/80"
                    : "text-[var(--text-muted-dark)]"
                }`}
              >
                {item.description}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
