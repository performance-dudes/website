"use client";

import { useState, useCallback } from "react";
import type { CalculatorInputs } from "../lib/types";
import { encodeState } from "../lib/permalink";
import { generateTimeline } from "../lib/formulas";
import { PHASES } from "../lib/constants";
import { BENEFITS } from "../lib/benefits-config";

interface CtaSectionProps {
  t: {
    heading: string;
    subtext: string;
    copyLink: string;
    copied: string;
    emailSubject: string;
    emailLabel: string;
    emailBodyTemplate: string;
  };
  inputs: CalculatorInputs;
}

function EnvelopeIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M2 7l10 7 10-7" />
    </svg>
  );
}

const EUR = new Intl.NumberFormat("de-DE", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

function buildEmailBody(template: string, inputs: CalculatorInputs, permalink: string): string {
  const timeline = generateTimeline(inputs, PHASES, BENEFITS);
  const lastSlice = timeline[timeline.length - 1];
  const factor = lastSlice?.gesamtOutput.toFixed(1) ?? "?";

  return template
    .replace("{link}", permalink)
    .replace("{devCount}", String(inputs.devCount))
    .replace("{costPerDev}", EUR.format(inputs.costPerDev))
    .replace("{featurePercent}", String(inputs.featurePercent))
    .replace("{budget}", EUR.format(inputs.budgetMonthly))
    .replace("{horizon}", String(inputs.horizonMonths))
    .replace("{factor}", factor);
}

export function CtaSection({ t, inputs }: CtaSectionProps) {
  const [copied, setCopied] = useState(false);

  const getPermalink = useCallback(() => {
    const encoded = encodeState(inputs);
    const origin = typeof window !== "undefined" ? window.location.origin : "https://performance-dudes.de";
    return `${origin}/kalkulator?s=${encoded}`;
  }, [inputs]);

  const handleCopy = useCallback(async () => {
    const permalink = getPermalink();
    try {
      await navigator.clipboard.writeText(permalink);
    } catch {
      const el = document.createElement("textarea");
      el.value = permalink;
      el.style.position = "fixed";
      el.style.opacity = "0";
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [getPermalink]);

  const emailHref = useCallback(() => {
    const permalink = getPermalink();
    const body = buildEmailBody(t.emailBodyTemplate, inputs, permalink);
    return `mailto:hello@performance-dudes.de?subject=${encodeURIComponent(t.emailSubject)}&body=${encodeURIComponent(body)}`;
  }, [inputs, t.emailSubject, t.emailBodyTemplate, getPermalink]);

  return (
    <div className="py-4">
      <div className="max-w-[600px] mx-auto text-center">
        <h2 className="text-[clamp(1.75rem,4vw,2.75rem)] font-extrabold text-[var(--text-dark)] tracking-[-0.025em] leading-[1.1] mb-4">
          {t.heading}
        </h2>
        <p className="text-[var(--text-muted-dark)] text-lg mb-10">
          {t.subtext}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {/* Copy permalink button */}
          <button
            type="button"
            onClick={handleCopy}
            className={[
              "min-h-[52px] px-8 rounded font-bold transition-all duration-200",
              "border border-white/20 text-[var(--text-dark)]",
              "bg-white/5 hover:bg-white/10 active:scale-[0.98]",
              "focus-visible:outline-[3px] focus-visible:outline-[var(--orange)] focus-visible:outline-offset-[3px]",
              copied ? "border-[var(--orange)]/60" : "",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {copied ? t.copied : t.copyLink}
          </button>

          {/* Email CTA button */}
          <a
            href={emailHref()}
            className={[
              "inline-flex items-center justify-center gap-2",
              "min-h-[52px] px-8 rounded font-bold transition-all duration-200",
              "bg-[var(--orange)] hover:bg-[#C94D0A] text-white",
              "hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]",
              "focus-visible:outline-[3px] focus-visible:outline-white focus-visible:outline-offset-[3px]",
            ].join(" ")}
          >
            <EnvelopeIcon />
            {t.emailLabel}
          </a>
        </div>
      </div>
    </div>
  );
}
