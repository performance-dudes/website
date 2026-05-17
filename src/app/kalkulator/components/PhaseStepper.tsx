"use client";

import type { TimeSlice } from "../lib/types";
import { PHASES } from "../lib/constants";

interface PhaseStepperProps {
  t: {
    heading: string;
    reachable: string;
    notReachable: string;
  };
  timeline: readonly TimeSlice[];
  currentSlice: TimeSlice | null;
}

type PhaseStatus = "reached" | "reachable" | "unreachable";

export function PhaseStepper({ t, timeline, currentSlice }: PhaseStepperProps) {
  const currentPhase = currentSlice?.phase ?? 0;

  // Highest phase reached anywhere in the timeline (end of horizon)
  const maxReachablePhase: number =
    timeline.length > 0
      ? Math.max(...timeline.map((s) => s.phase))
      : currentPhase;

  function getStatus(phaseId: number): PhaseStatus {
    if (phaseId <= currentPhase) return "reached";
    if (phaseId <= maxReachablePhase) return "reachable";
    return "unreachable";
  }

  return (
    <div aria-label={t.heading}>
      <h2 className="text-[clamp(1.5rem,3vw,2.25rem)] font-extrabold text-[var(--text-dark)] tracking-[-0.025em] leading-[1.1] mb-10">
        {t.heading}
      </h2>

      {/* Desktop: horizontal row; Mobile: vertical column */}
      <div className="flex flex-col lg:flex-row lg:items-start gap-0">
        {PHASES.map((phase, index) => {
          const status = getStatus(phase.id);
          const isLast = index === PHASES.length - 1;

          const circleColor =
            status === "reached"
              ? "bg-[var(--orange)] border-[var(--orange)] text-white"
              : status === "reachable"
              ? "bg-transparent border-[#C0C0C8] text-[#C0C0C8]"
              : "bg-transparent border-white/20 text-white/30";

          const labelColor =
            status === "reached"
              ? "text-[var(--text-dark)]"
              : status === "reachable"
              ? "text-[#C0C0C8]"
              : "text-white/30";

          const lineColor =
            status === "reached"
              ? "bg-[var(--orange)]"
              : "bg-[#C0C0C8]/30";

          const lineStyle =
            status === "reached" ? "solid" : "dashed";

          return (
            <div
              key={phase.id}
              className={[
                "flex lg:flex-col items-start lg:items-center",
                "flex-1 min-w-0",
                status === "unreachable" ? "opacity-40" : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {/* Step content: circle + connector + label */}
              <div className="flex flex-col lg:flex-row lg:items-center w-full lg:w-auto">
                {/* Circle */}
                <div className="flex-shrink-0 relative z-10">
                  <div
                    className={[
                      "w-8 h-8 rounded-full border-2 flex items-center justify-center",
                      "font-bold text-sm transition-colors duration-200",
                      circleColor,
                    ].join(" ")}
                    title={`Phase ${phase.id}: ${phase.name}`}
                  >
                    {phase.id}
                  </div>
                </div>

                {/* Connector line (between this step and the next) */}
                {!isLast && (
                  <>
                    {/* Mobile: vertical line below circle */}
                    <div
                      className={[
                        "lg:hidden w-0.5 h-8 ml-[15px] mt-0",
                        lineColor,
                      ].join(" ")}
                      style={
                        lineStyle === "dashed"
                          ? {
                              background: "none",
                              borderLeft: "2px dashed #C0C0C8",
                              opacity: 0.4,
                              width: "2px",
                            }
                          : {}
                      }
                      aria-hidden="true"
                    />
                    {/* Desktop: horizontal line to right of circle */}
                    <div
                      className="hidden lg:block h-0.5 flex-1 mx-1"
                      style={
                        lineStyle === "dashed"
                          ? {
                              background: "none",
                              borderTop: "2px dashed #C0C0C8",
                              opacity: 0.4,
                              height: "2px",
                            }
                          : { backgroundColor: "var(--orange)", height: "2px" }
                      }
                      aria-hidden="true"
                    />
                  </>
                )}
              </div>

              {/* Label block: pushed to the right on mobile (aligns with circle) */}
              <div className="ml-3 lg:ml-0 lg:mt-3 lg:text-center flex-1 lg:flex-none pb-6 lg:pb-0">
                <span
                  className={[
                    "block text-sm font-semibold leading-tight",
                    labelColor,
                  ].join(" ")}
                >
                  {phase.name}
                </span>
                <span
                  className={[
                    "block text-xs mt-0.5",
                    status === "unreachable"
                      ? "text-white/20"
                      : "text-[var(--text-muted-dark)]",
                  ].join(" ")}
                >
                  {status === "unreachable" ? t.notReachable : t.reachable}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
