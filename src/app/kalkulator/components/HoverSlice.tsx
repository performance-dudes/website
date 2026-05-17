"use client";

import { useState } from "react";
import type { TimeSlice, BenefitAtTime, BenefitStatus } from "../lib/types";

interface HoverSliceProps {
  t: {
    summary: string;
    active: string;
    building: string;
    waiting: string;
    compounding: string;
  };
  slice: TimeSlice | null;
}

const MAX_VISIBLE = 6;

const STATUS_CONFIG: Record<
  BenefitStatus,
  { dot: string; label: keyof HoverSliceProps["t"] }
> = {
  aktiv: { dot: "#22C55E", label: "active" },
  "im-aufbau": { dot: "#F59E0B", label: "building" },
  wartend: { dot: "#6B7280", label: "waiting" },
};

interface BenefitGroupProps {
  items: readonly BenefitAtTime[];
  status: BenefitStatus;
  label: string;
  dotColor: string;
}

function BenefitGroup({ items, status, label, dotColor }: BenefitGroupProps) {
  const [expanded, setExpanded] = useState(false);

  if (items.length === 0) return null;

  const visible = expanded ? items : items.slice(0, MAX_VISIBLE);
  const hiddenCount = items.length - MAX_VISIBLE;

  return (
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-1.5 mb-2">
        <span
          className="inline-block w-2 h-2 rounded-full flex-shrink-0"
          style={{ background: dotColor }}
        />
        <span className="text-xs font-semibold text-[var(--text-muted-dark)] uppercase tracking-wider">
          {label} ({items.length})
        </span>
      </div>
      <ul className="space-y-1">
        {visible.map((item) => (
          <li key={item.benefit.id} className="text-xs">
            <div className="flex items-center gap-1.5">
              <span
                className="inline-block w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ background: dotColor, opacity: 0.7 }}
              />
              <span className="text-[var(--text-muted-dark)] truncate">
                {item.benefit.id}
              </span>
            </div>
            {status === "im-aufbau" && (
              <div className="mt-0.5 ml-3">
                <div
                  className="h-1 rounded-full overflow-hidden"
                  style={{ background: "rgba(192,192,200,0.15)" }}
                >
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.round(item.progress * 100)}%`,
                      background: "#F59E0B",
                    }}
                  />
                </div>
                <span
                  className="text-[10px] mt-0.5 block"
                  style={{ color: "#F59E0B" }}
                >
                  {Math.round(item.progress * 100)}%
                </span>
              </div>
            )}
          </li>
        ))}
      </ul>
      {!expanded && hiddenCount > 0 && (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="mt-2 text-xs text-[var(--text-muted-dark)] hover:text-[var(--text-dark)] transition-colors underline underline-offset-2"
        >
          +{hiddenCount} mehr
        </button>
      )}
      {expanded && hiddenCount > 0 && (
        <button
          type="button"
          onClick={() => setExpanded(false)}
          className="mt-2 text-xs text-[var(--text-muted-dark)] hover:text-[var(--text-dark)] transition-colors underline underline-offset-2"
        >
          Weniger anzeigen
        </button>
      )}
    </div>
  );
}

export function HoverSlice({ t, slice }: HoverSliceProps) {
  if (!slice) return null;

  const aktiv = slice.benefits.filter((b) => b.status === "aktiv");
  const imAufbau = slice.benefits.filter((b) => b.status === "im-aufbau");
  const wartend = slice.benefits.filter((b) => b.status === "wartend");

  const isCompounding = slice.phase >= 5;

  // Build summary by replacing placeholders in t.summary
  const summaryText = t.summary
    .replace("{iter}", String(slice.iteration))
    .replace("{aktiv}", String(aktiv.length))
    .replace("{aufbau}", String(imAufbau.length))
    .replace("{wartend}", String(wartend.length))
    .replace("{faktor}", slice.gesamtOutput.toFixed(1));

  const hasAnyBenefits =
    aktiv.length > 0 || imAufbau.length > 0 || wartend.length > 0;

  return (
    <div
      className="rounded mt-6 p-4"
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(192,192,200,0.12)",
      }}
    >
      {/* Summary line */}
      <p className="text-sm text-[var(--text-dark)] mb-4 leading-relaxed">
        {summaryText}
      </p>

      {/* Compounding note */}
      {isCompounding && (
        <p
          className="text-xs mb-4 px-3 py-2 rounded"
          style={{
            background: "rgba(234,88,12,0.1)",
            border: "1px solid rgba(234,88,12,0.2)",
            color: "#EA580C",
          }}
        >
          {t.compounding}
        </p>
      )}

      {/* Benefit groups */}
      {hasAnyBenefits && (
        <div className="flex flex-col sm:flex-row gap-4">
          <BenefitGroup
            items={aktiv}
            status="aktiv"
            label={t.active}
            dotColor={STATUS_CONFIG.aktiv.dot}
          />
          <BenefitGroup
            items={imAufbau}
            status="im-aufbau"
            label={t.building}
            dotColor={STATUS_CONFIG["im-aufbau"].dot}
          />
          <BenefitGroup
            items={wartend}
            status="wartend"
            label={t.waiting}
            dotColor={STATUS_CONFIG.wartend.dot}
          />
        </div>
      )}
    </div>
  );
}
