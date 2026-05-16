"use client";

import type { TimeSlice } from "../lib/types";
import { PHASES } from "../lib/constants";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ReferenceLine,
  Tooltip,
} from "recharts";

interface HeroChartsProps {
  t: {
    outputHeadline: string;
    outputHeadlineEnablement: string;
    outputYLabel: string;
    outputYLabelGreenField: string;
    featureHeadline: string;
    featureYLabel: string;
    xLabel: string;
    teamLabel: string;
    pdLabel: string;
    todayLabel: string;
    targetLabel: string;
  };
  timeline: readonly TimeSlice[];
  isGreenField: boolean;
  enablement: boolean;
  devCount: number;
  hoveredIteration: number | null;
  onHover: (iter: number | null) => void;
  currentSlice: TimeSlice | null;
  hoverT: {
    summary: string;
    active: string;
    building: string;
    waiting: string;
    compounding: string;
  };
  horizonMonths: number;
  featureNote?: string;
  postDepartureNote?: string;
  enablementNote?: string;
}

const ORANGE = "#EA580C";
const SILVER = "#C0C0C8";
const GRID_COLOR = "rgba(192,192,200,0.1)";
const AXIS_COLOR = "#CBD5E1";
const PHASE_LINE_COLOR = "rgba(192,192,200,0.15)";

interface OutputDatum {
  iter: number;
  team: number;
  pd: number;
}

interface FeatureDatum {
  iter: number;
  featureAnteil: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; name: string; color: string }>;
  label?: number;
  isGreenField: boolean;
  yLabel: string;
  teamLabel: string;
  pdLabel: string;
}

function OutputTooltip({
  active,
  payload,
  label,
  isGreenField,
  yLabel,
  teamLabel,
  pdLabel,
}: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;

  const teamVal = payload.find((p) => p.name === "team");
  const pdVal = payload.find((p) => p.name === "pd");
  const total =
    (teamVal?.value ?? 0) + (pdVal?.value ?? 0);

  return (
    <div
      className="rounded px-3 py-2 text-xs"
      style={{
        background: "rgba(26,26,46,0.95)",
        border: "1px solid rgba(192,192,200,0.2)",
        color: AXIS_COLOR,
      }}
    >
      <p className="font-semibold mb-1" style={{ color: "#F1F5F9" }}>
        Woche {label}
      </p>
      {!isGreenField && teamVal !== undefined && (
        <p>
          {teamLabel}:{" "}
          <span style={{ color: SILVER }}>{teamVal.value.toFixed(2)}x</span>
        </p>
      )}
      {pdVal !== undefined && (
        <p>
          {pdLabel}:{" "}
          <span style={{ color: ORANGE }}>
            {isGreenField
              ? `${pdVal.value.toFixed(1)} Dev-Eq`
              : `${pdVal.value.toFixed(2)}x`}
          </span>
        </p>
      )}
      <p className="mt-1 border-t border-[rgba(192,192,200,0.15)] pt-1">
        {yLabel}:{" "}
        <span style={{ color: "#F1F5F9", fontWeight: 600 }}>
          {isGreenField
            ? `${total.toFixed(1)} Dev-Eq`
            : `${total.toFixed(2)}x`}
        </span>
      </p>
    </div>
  );
}

interface FeatureTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; name: string }>;
  label?: number;
  featureYLabel: string;
}

function FeatureTooltip({
  active,
  payload,
  label,
  featureYLabel,
}: FeatureTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;

  const val = payload[0]?.value;

  return (
    <div
      className="rounded px-3 py-2 text-xs"
      style={{
        background: "rgba(26,26,46,0.95)",
        border: "1px solid rgba(192,192,200,0.2)",
        color: AXIS_COLOR,
      }}
    >
      <p className="font-semibold mb-1" style={{ color: "#F1F5F9" }}>
        Woche {label}
      </p>
      {val !== undefined && (
        <p>
          {featureYLabel}:{" "}
          <span style={{ color: ORANGE, fontWeight: 600 }}>
            {val.toFixed(1)}%
          </span>
        </p>
      )}
    </div>
  );
}

export function HeroCharts({
  t,
  timeline,
  isGreenField,
  enablement,
  devCount,
  hoveredIteration,
  onHover,
  horizonMonths,
  featureNote,
  postDepartureNote,
  enablementNote,
}: HeroChartsProps) {
  const data = [...timeline];

  // Chart shows per-dev contributions so that team + pd = gesamtOutput.
  // team = teamBaseline (enablement multiplier, 1.0 to 3.0)
  // pd = pdDevEq / devCount (PD contribution per original dev)
  const effectiveDevCount = devCount > 0 ? devCount : 1;
  const outputData: OutputDatum[] = data.map((s) => ({
    iter: s.iteration,
    team: s.teamBaseline,
    pd: isGreenField ? s.pdDevEq : s.pdDevEq / effectiveDevCount,
  }));

  const featureData: FeatureDatum[] = data.map((s) => ({
    iter: s.iteration,
    featureAnteil: s.featureAnteil * 100,
  }));

  // Find the last slice of the main engagement (before post-PD departure slices)
  const maxEngagementWeek = Math.ceil(horizonMonths * 4.33);
  const mainSlices = data.filter((s) => s.iteration <= maxEngagementWeek);
  const lastSlice = mainSlices[mainSlices.length - 1] ?? data[data.length - 1];
  const gesamtFactor = lastSlice?.gesamtOutput.toFixed(1) ?? "?";

  // Team-only factor (what the team achieves without PD — the enablement legacy)
  // After PD leaves, gesamtOutput without PD = teamBaseline (the enablement multiplier)
  const teamOnlyFactor = enablement && lastSlice && !isGreenField
    ? lastSlice.teamBaseline.toFixed(1)
    : null;

  const headline = enablement && teamOnlyFactor
    ? t.outputHeadlineEnablement
        .replace("{factor}", gesamtFactor)
        .replace("{teamFactor}", teamOnlyFactor)
        .replace("{months}", String(horizonMonths))
    : t.outputHeadline
        .replace("{factor}", gesamtFactor)
        .replace("{months}", String(horizonMonths));

  // Reachable phase transitions: find the week where each phase starts from the timeline data
  const maxIter = lastSlice?.iteration ?? 0;
  const phaseStartWeeks: { id: number; week: number }[] = [];
  for (const phase of PHASES) {
    if (phase.id === 0) continue;
    const firstSlice = data.find((s) => s.phase >= phase.id);
    if (firstSlice) {
      phaseStartWeeks.push({ id: phase.id, week: firstSlice.iteration });
    }
  }
  const reachablePhases = phaseStartWeeks.filter((p) => p.week <= maxIter);

  // Starting feature % for today reference line
  const startFeaturePct = (data[0]?.featureAnteil ?? 0) * 100;

  const handleMouseMove = (state: { activeLabel?: string | number }) => {
    if (state.activeLabel !== undefined) {
      onHover(Number(state.activeLabel));
    }
  };

  const handleMouseLeave = () => {
    onHover(null);
  };

  const outputYLabel = isGreenField ? t.outputYLabelGreenField : t.outputYLabel;

  return (
    <div>
      {/* Dynamic headline */}
      <p className="text-base text-[var(--text-muted-dark)] mb-6 text-center">
        {headline}
      </p>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left: Stacked AreaChart — output multiplier */}
        <div className="flex-[2] min-w-0">
          <p className="text-sm font-medium text-[var(--text-muted-dark)] mb-2 text-center">
            {outputYLabel}
          </p>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart
              data={outputData}
              syncId="calculator"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={GRID_COLOR}
                vertical={false}
              />
              <XAxis
                dataKey="iter"
                tick={{ fill: AXIS_COLOR, fontSize: 11 }}
                axisLine={{ stroke: GRID_COLOR }}
                tickLine={false}
                label={{
                  value: t.xLabel,
                  position: "insideBottom",
                  offset: -2,
                  fill: AXIS_COLOR,
                  fontSize: 11,
                }}
              />
              <YAxis
                tick={{ fill: AXIS_COLOR, fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={40}
              />
              <Tooltip
                content={(props) => (
                  <OutputTooltip
                    active={props.active}
                    payload={
                      (props.payload as unknown) as Array<{
                        value: number;
                        name: string;
                        color: string;
                      }>
                    }
                    label={props.label as number}
                    isGreenField={isGreenField}
                    yLabel={outputYLabel}
                    teamLabel={t.teamLabel}
                    pdLabel={t.pdLabel}
                  />
                )}
                cursor={{ stroke: SILVER, strokeWidth: 1, strokeDasharray: "3 3" }}
              />
              {/* Phase transition reference lines */}
              {reachablePhases.map((phase) => (
                <ReferenceLine
                  key={phase.id}
                  x={phase.week}
                  stroke={PHASE_LINE_COLOR}
                  strokeDasharray="4 4"
                />
              ))}
              {/* Hovered iteration crosshair */}
              {hoveredIteration !== null && (
                <ReferenceLine
                  x={hoveredIteration}
                  stroke={SILVER}
                  strokeWidth={1}
                  strokeDasharray="2 2"
                />
              )}
              {/* Team baseline area (bottom stack) */}
              {!isGreenField && (
                <Area
                  type="monotone"
                  dataKey="team"
                  stackId="output"
                  stroke={SILVER}
                  strokeWidth={1.5}
                  fill={SILVER}
                  fillOpacity={0.15}
                  name="team"
                />
              )}
              {/* PD output area (top stack) */}
              <Area
                type="monotone"
                dataKey="pd"
                stackId="output"
                stroke={ORANGE}
                strokeWidth={2}
                fill={ORANGE}
                fillOpacity={0.25}
                name="pd"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Right: LineChart — Feature-Anteil */}
        {!isGreenField && (
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[var(--text-muted-dark)] mb-2 text-center">
              {t.featureYLabel}
            </p>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart
                data={featureData}
                syncId="calculator"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={GRID_COLOR}
                  vertical={false}
                />
                <XAxis
                  dataKey="iter"
                  tick={{ fill: AXIS_COLOR, fontSize: 11 }}
                  axisLine={{ stroke: GRID_COLOR }}
                  tickLine={false}
                  label={{
                    value: t.xLabel,
                    position: "insideBottom",
                    offset: -2,
                    fill: AXIS_COLOR,
                    fontSize: 11,
                  }}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fill: AXIS_COLOR, fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  width={40}
                  tickFormatter={(v: number) => `${v}%`}
                />
                <Tooltip
                  content={(props) => (
                    <FeatureTooltip
                      active={props.active}
                      payload={
                        (props.payload as unknown) as Array<{
                          value: number;
                          name: string;
                        }>
                      }
                      label={props.label as number}
                      featureYLabel={t.featureYLabel}
                    />
                  )}
                  cursor={{
                    stroke: SILVER,
                    strokeWidth: 1,
                    strokeDasharray: "3 3",
                  }}
                />
                {/* Today reference line */}
                <ReferenceLine
                  y={startFeaturePct}
                  stroke={SILVER}
                  strokeDasharray="4 4"
                  strokeOpacity={0.5}
                  label={{
                    value: t.todayLabel,
                    position: "insideTopLeft",
                    fill: AXIS_COLOR,
                    fontSize: 10,
                  }}
                />
                {/* 80% target reference line */}
                <ReferenceLine
                  y={80}
                  stroke={ORANGE}
                  strokeDasharray="4 4"
                  strokeOpacity={0.5}
                  label={{
                    value: t.targetLabel,
                    position: "insideTopLeft",
                    fill: ORANGE,
                    fontSize: 10,
                  }}
                />
                {/* Hovered iteration crosshair */}
                {hoveredIteration !== null && (
                  <ReferenceLine
                    x={hoveredIteration}
                    stroke={SILVER}
                    strokeWidth={1}
                    strokeDasharray="2 2"
                  />
                )}
                <Line
                  type="monotone"
                  dataKey="featureAnteil"
                  stroke={ORANGE}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: ORANGE, stroke: "transparent" }}
                  name="featureAnteil"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Contextual explanations below charts (dark bg → light text) */}
      {featureNote && !isGreenField && (
        <div className="mt-6 rounded bg-white/5 border border-white/10 px-4 py-3">
          <p className="text-sm text-[var(--text-dark)] leading-relaxed">
            {featureNote}
          </p>
        </div>
      )}

      {enablement && enablementNote && !isGreenField && (
        <p className="text-sm text-[var(--text-muted-dark)] mt-3 leading-relaxed">
          {enablementNote}
        </p>
      )}

      {enablement && postDepartureNote && !isGreenField && (
        <p className="text-sm text-[var(--text-muted-dark)] mt-3 leading-relaxed">
          {postDepartureNote}
        </p>
      )}
    </div>
  );
}
