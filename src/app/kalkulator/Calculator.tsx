"use client";

import { useCalculatorState } from "./hooks/useCalculatorState";
import { PainPointSelector } from "./components/PainPointSelector";
import { BaselineInputs } from "./components/BaselineInputs";
import { BudgetSlider } from "./components/BudgetSlider";
import { HeroCharts } from "./components/HeroCharts";
import { BenefitTiles } from "./components/BenefitTiles";
import { KpiDashboard } from "./components/KpiDashboard";
import { PhaseStepper } from "./components/PhaseStepper";
import { CtaSection } from "./components/CtaSection";
import type { getContent } from "@/content";

type KalkulatorContent = ReturnType<typeof getContent>["kalkulator"];

export function Calculator({ t }: { t: KalkulatorContent }) {
  const state = useCalculatorState();
  const hasPainPoints = state.inputs.painPoints.length > 0;

  return (
    <div className="min-h-screen">
      {/* Step 1: Pain Points */}
      <section className="section bg-[var(--asphalt)]">
        <div className="container">
          <PainPointSelector
            t={t.painPoints}
            selected={state.inputs.painPoints}
            onToggle={state.togglePainPoint}
          />
        </div>
      </section>

      {/* Steps 2-6 only show after pain point selection */}
      {hasPainPoints && (
        <>
          <div className="checkered-divider" aria-hidden="true" />

          {/* Step 2: Baseline */}
          <section className="section">
            <div className="container">
              <BaselineInputs
                t={t.baseline}
                devCount={state.inputs.devCount}
                costPerDev={state.inputs.costPerDev}
                featurePercent={state.inputs.featurePercent}
                onDevCountChange={state.setDevCount}
                onCostPerDevChange={state.setCostPerDev}
                onFeaturePercentChange={state.setFeaturePercent}
                isGreenField={state.isGreenField}
              />
            </div>
          </section>

          {/* Step 3: Budget */}
          <section className="section bg-[var(--surface-alt)]">
            <div className="container">
              <BudgetSlider
                t={{
                  ...t.budget,
                  budgetContext: t.explanations.budgetContext,
                  enablementContext: t.explanations.enablementContext,
                }}
                budget={state.inputs.budgetMonthly}
                maxBudget={state.maxBudget}
                isGreenField={state.isGreenField}
                horizonMonths={state.inputs.horizonMonths}
                enablement={state.inputs.enablement}
                onBudgetChange={state.setBudgetMonthly}
                onHorizonChange={state.setHorizonMonths}
                onEnablementChange={state.setEnablement}
              />
            </div>
          </section>

          {/* Step 4a: Hero Charts — enough padding for headline, close to budget slider */}
          <section className="pt-12 pb-[clamp(3.5rem,8vw,6rem)] bg-[var(--asphalt)]">
            <div className="container">
              <HeroCharts
                t={t.charts}
                timeline={state.timeline}
                isGreenField={state.isGreenField}
                enablement={state.inputs.enablement}
                devCount={state.inputs.devCount}
                hoveredIteration={state.hoveredIteration}
                onHover={state.setHoveredIteration}
                currentSlice={state.currentSlice}
                hoverT={t.hover}
                horizonMonths={state.inputs.horizonMonths}
                featureNote={
                  t.explanations.featureContext
                    .replace("{start}", String(state.inputs.featurePercent))
                    .replace("{target}", "80")
                }
                postDepartureNote={t.explanations.postDepartureContext}
                enablementNote={t.explanations.enablementContext}
              />
            </div>
          </section>

          {/* Step 4c: Benefit Tiles */}
          <section className="section">
            <div className="container">
              <BenefitTiles
                t={t.benefits}
                currentSlice={state.currentSlice}
                painPoints={state.inputs.painPoints}
              />
            </div>
          </section>

          <div className="checkered-divider" aria-hidden="true" />

          {/* Step 4d: KPI Dashboard */}
          <section className="section bg-[var(--surface-alt)]">
            <div className="container">
              <KpiDashboard
                t={t.kpiDashboard}
                timeline={state.timeline}
                inputs={state.inputs}
                currentSlice={state.currentSlice}
              />
            </div>
          </section>

          {/* Step 5: Phase Stepper */}
          <section className="section bg-[var(--asphalt)]">
            <div className="container">
              <PhaseStepper
                t={t.phases}
                timeline={state.timeline}
                currentSlice={state.currentSlice}
              />
            </div>
          </section>

          <div className="checkered-divider" aria-hidden="true" />

          {/* Step 6: CTA */}
          <section className="section bg-[var(--asphalt)]">
            <div className="container">
              <CtaSection t={t.cta} inputs={state.inputs} />
            </div>
          </section>
        </>
      )}

      {/* Disclaimer */}
      <div className="text-center py-6 text-sm text-[var(--text-mid)]">
        {t.disclaimer}
      </div>
    </div>
  );
}
