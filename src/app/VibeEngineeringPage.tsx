import Link from "next/link";
import { Fragment } from "react";

type Move = {
  readonly title: string;
  readonly body: string;
};

type LoopNode = {
  readonly short: string;
  readonly full: string;
};

type DimensionRow = {
  readonly pillar: string;
  readonly dimension: string;
  readonly measures: string;
};

type DimensionGroup = {
  readonly label: string;
  readonly sublabel: string;
  readonly rows: readonly DimensionRow[];
};

type ComparisonRow = {
  readonly axis: string;
  readonly vibeCoding: string;
  readonly vibeEngineering: string;
};

export type VibeEngineeringContent = {
  readonly hero: {
    readonly eyebrow: string;
    readonly title: string;
    readonly tagline: string;
    readonly lead: string;
  };
  readonly moves: {
    readonly sectionLabel: string;
    readonly title: string;
    readonly intro: string;
    readonly items: readonly Move[];
  };
  readonly loop: {
    readonly sectionLabel: string;
    readonly title: string;
    readonly body: string;
    readonly srDescription: string;
    readonly nodes: readonly LoopNode[];
  };
  readonly dimensions: {
    readonly sectionLabel: string;
    readonly title: string;
    readonly intro: string;
    readonly columns: {
      readonly pillar: string;
      readonly dimension: string;
      readonly measures: string;
    };
    readonly groups: readonly DimensionGroup[];
  };
  readonly comparison: {
    readonly sectionLabel: string;
    readonly title: string;
    readonly intro: string;
    readonly columns: {
      readonly axis: string;
      readonly vibeCoding: string;
      readonly vibeEngineering: string;
    };
    readonly rows: readonly ComparisonRow[];
    readonly closing: string;
  };
  readonly cta: {
    readonly sectionLabel: string;
    readonly title: string;
    readonly lead: string;
    readonly text: string;
    readonly email: string;
  };
  readonly footer: {
    readonly tagline: string;
    readonly switchLang: string;
    readonly switchLangHref: string;
    readonly imprint: string;
    readonly imprintHref: string;
    readonly shareLinkedIn: string;
    readonly shareHref: string;
  };
};

function SectionLabel({
  children,
  tone = "light",
}: {
  children: React.ReactNode;
  tone?: "light" | "dark";
}) {
  const color = tone === "light" ? "text-[#EA580C]" : "text-[#C0C0C8]";
  return (
    <div
      className={`inline-flex items-center gap-2 text-[0.75rem] font-bold tracking-[0.14em] uppercase ${color} mb-4`}
      aria-hidden="true"
    >
      <span className="w-5 h-0.5 bg-[#EA580C] shrink-0 block" />
      {children}
    </div>
  );
}

function EnvelopeIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
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

function LinkedInIcon({ size = 14 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function LoopDiagram({
  nodes,
  srDescription,
}: {
  nodes: readonly LoopNode[];
  srDescription: string;
}) {
  const descId = "loop-desc";
  // Geometry: 4 nodes on a horizontal line, return arc above
  const width = 720;
  const height = 240;
  const cy = 150;
  const margin = 70;
  const step = (width - margin * 2) / (nodes.length - 1);

  return (
    <figure
      className="mx-auto max-w-full"
      role="img"
      aria-labelledby={descId}
    >
      <span id={descId} className="sr-only">
        {srDescription}
      </span>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <marker
            id="arrow-silver"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#C0C0C8" />
          </marker>
          <marker
            id="arrow-orange"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#EA580C" />
          </marker>
        </defs>

        {/* Forward arrows between sequential nodes */}
        {nodes.slice(0, -1).map((_, i) => {
          const x1 = margin + step * i + 32;
          const x2 = margin + step * (i + 1) - 32;
          return (
            <line
              key={`arr-${i}`}
              x1={x1}
              y1={cy}
              x2={x2}
              y2={cy}
              stroke="#C0C0C8"
              strokeWidth="2"
              markerEnd="url(#arrow-silver)"
            />
          );
        })}

        {/* Return arc from last node back to first */}
        <path
          d={`M ${margin + step * (nodes.length - 1)} ${cy - 28}
              C ${margin + step * (nodes.length - 1)} ${cy - 120},
                ${margin} ${cy - 120},
                ${margin} ${cy - 28}`}
          fill="none"
          stroke="#EA580C"
          strokeWidth="2"
          strokeDasharray="4 4"
          markerEnd="url(#arrow-orange)"
        />

        {/* Nodes */}
        {nodes.map((n, i) => {
          const cx = margin + step * i;
          return (
            <g key={n.short}>
              <circle
                cx={cx}
                cy={cy}
                r="26"
                fill="#FAFAFA"
                stroke="#1A1A2E"
                strokeWidth="2"
              />
              <text
                x={cx}
                y={cy + 5}
                textAnchor="middle"
                fontSize="18"
                fontWeight="700"
                fill="#1A1A2E"
                fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
              >
                {i + 1}
              </text>
              <text
                x={cx}
                y={cy + 52}
                textAnchor="middle"
                fontSize="13"
                fontWeight="600"
                fill="#1A1A2E"
                fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
              >
                {n.short}
              </text>
            </g>
          );
        })}
      </svg>
    </figure>
  );
}

export function VibeEngineeringPage({ t }: { t: VibeEngineeringContent }) {
  return (
    <>
      {/* ── NAV ── */}
      <header role="banner">
        <nav
          className="fixed top-0 left-0 right-0 z-[100] border-b border-[rgba(192,192,200,0.12)]"
          style={{
            background: "rgba(26,26,46,0.92)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
          }}
          aria-label="Site navigation"
        >
          <div className="container flex items-center justify-between min-h-[64px] gap-4">
            <Link
              href={t.footer.switchLangHref === "/en/vibe-engineering" ? "/" : "/en"}
              className="text-[#F1F5F9] font-bold text-base tracking-[0.04em] uppercase no-underline"
              aria-label="Performance Dudes home"
            >
              Performance<span className="text-[#EA580C]">Dudes</span>
            </Link>
            <a
              href="mailto:hello@performance-dudes.de"
              className="inline-flex items-center justify-center gap-2 min-h-[48px] px-5 bg-[#EA580C] text-white font-semibold text-sm rounded tracking-wide transition-all duration-200 hover:bg-[#C94D0A] hover:-translate-y-px whitespace-nowrap"
            >
              <EnvelopeIcon size={16} />
              <span className="hidden sm:inline">hello@performance-dudes.de</span>
            </a>
          </div>
        </nav>
      </header>

      <main>
        {/* ── HERO ── */}
        <section
          id="hero"
          className="relative overflow-hidden text-[#F1F5F9]"
          style={{
            background: "#1A1A2E",
            paddingTop: "calc(64px + clamp(3rem, 8vw, 5rem))",
            paddingBottom: "clamp(3rem, 8vw, 5rem)",
          }}
          aria-labelledby="ve-hero-title"
        >
          <div className="container">
            <div style={{ maxWidth: "780px" }}>
              <div
                className="inline-flex items-center gap-2 text-[0.8rem] font-semibold tracking-[0.12em] uppercase text-[#C0C0C8] mb-6"
                aria-hidden="true"
              >
                <span className="w-7 h-0.5 bg-[#EA580C] shrink-0 block" />
                {t.hero.eyebrow}
              </div>

              <h1
                id="ve-hero-title"
                className="font-extrabold leading-[1.05] tracking-[-0.03em] mb-3 text-[#F1F5F9]"
                style={{ fontSize: "clamp(2.5rem, 7vw, 5rem)" }}
              >
                {t.hero.title}
              </h1>

              <p
                className="font-bold text-[#EA580C] tracking-[0.04em] mb-8"
                style={{ fontSize: "clamp(1.15rem, 2.5vw, 1.5rem)" }}
              >
                {t.hero.tagline}
              </p>

              <p
                className="text-[#CBD5E1] max-w-[640px] leading-[1.7]"
                style={{ fontSize: "clamp(1rem, 2vw, 1.15rem)" }}
              >
                {t.hero.lead}
              </p>
            </div>
          </div>
        </section>

        {/* ── CHECKERED DIVIDER ── */}
        <div className="checkered-divider" aria-hidden="true" />

        {/* ── FOUR MOVES ── */}
        <section
          className="section bg-[#FAFAFA]"
          aria-labelledby="ve-moves-title"
        >
          <div className="container">
            <div className="fade-in">
              <SectionLabel>{t.moves.sectionLabel}</SectionLabel>
              <h2
                id="ve-moves-title"
                className="font-extrabold leading-[1.1] tracking-[-0.025em] text-[#1A1A2E] mb-5"
                style={{ fontSize: "clamp(1.75rem, 4vw, 2.75rem)" }}
              >
                {t.moves.title}
              </h2>
              <p className="text-[#4B5563] text-[1.05rem] leading-[1.75] max-w-[680px]">
                {t.moves.intro}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-10">
              {t.moves.items.map((item, i) => (
                <article
                  key={item.title}
                  className="bg-white rounded p-7 border-t-[3px] border-[#1A1A2E] relative fade-in"
                >
                  <span
                    className="absolute top-5 right-5 text-5xl font-extrabold text-[#E5E7EB] leading-none pointer-events-none select-none"
                    aria-hidden="true"
                  >
                    {i + 1}
                  </span>
                  <h3 className="text-base font-bold text-[#1A1A2E] leading-snug mb-3">
                    {item.title}
                  </h3>
                  <p className="text-[0.9375rem] text-[#4B5563] leading-relaxed">
                    {item.body}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── LOOP ── */}
        <section
          className="section"
          style={{ background: "#F0F0F4" }}
          aria-labelledby="ve-loop-title"
        >
          <div className="container">
            <div className="fade-in">
              <SectionLabel>{t.loop.sectionLabel}</SectionLabel>
              <h2
                id="ve-loop-title"
                className="font-extrabold leading-[1.1] tracking-[-0.025em] text-[#1A1A2E] mb-8"
                style={{ fontSize: "clamp(1.75rem, 4vw, 2.75rem)" }}
              >
                {t.loop.title}
              </h2>
            </div>
            <div className="fade-in">
              <LoopDiagram nodes={t.loop.nodes} srDescription={t.loop.srDescription} />
              <p className="text-[#4B5563] text-[1.05rem] leading-[1.75] max-w-[680px] mx-auto mt-8 text-center">
                {t.loop.body}
              </p>
            </div>
          </div>
        </section>

        {/* ── DIMENSIONS ── */}
        <section
          className="section bg-[#FAFAFA]"
          aria-labelledby="ve-dims-title"
        >
          <div className="container">
            <div className="fade-in">
              <SectionLabel>{t.dimensions.sectionLabel}</SectionLabel>
              <h2
                id="ve-dims-title"
                className="font-extrabold leading-[1.1] tracking-[-0.025em] text-[#1A1A2E] mb-5"
                style={{ fontSize: "clamp(1.75rem, 4vw, 2.75rem)" }}
              >
                {t.dimensions.title}
              </h2>
              <p className="text-[#4B5563] text-[1.05rem] leading-[1.75] max-w-[680px]">
                {t.dimensions.intro}
              </p>
            </div>
            <div className="mt-10 fade-in overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <caption className="sr-only">{t.dimensions.title}</caption>
                <thead>
                  <tr className="border-b-2 border-[#1A1A2E]">
                    <th
                      scope="col"
                      className="text-[0.7rem] font-bold tracking-[0.14em] uppercase text-[#4B5563] py-3 pr-4"
                    >
                      {t.dimensions.columns.pillar}
                    </th>
                    <th
                      scope="col"
                      className="text-[0.7rem] font-bold tracking-[0.14em] uppercase text-[#4B5563] py-3 pr-4"
                    >
                      {t.dimensions.columns.dimension}
                    </th>
                    <th
                      scope="col"
                      className="text-[0.7rem] font-bold tracking-[0.14em] uppercase text-[#4B5563] py-3"
                    >
                      {t.dimensions.columns.measures}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {t.dimensions.groups.map((group) => (
                    <Fragment key={group.label}>
                      <tr className="bg-[#F0F0F4]">
                        <td
                          colSpan={3}
                          className="py-3 px-4 border-t border-[#E5E7EB]"
                        >
                          <span className="text-[0.75rem] font-bold tracking-[0.14em] uppercase text-[#EA580C]">
                            {group.label}
                          </span>
                          <span className="text-[0.85rem] text-[#4B5563] ml-3">
                            {group.sublabel}
                          </span>
                        </td>
                      </tr>
                      {group.rows.map((row) => (
                        <tr
                          key={`${group.label}-${row.dimension}`}
                          className="border-t border-[#E5E7EB]"
                        >
                          <td className="py-3 pr-4 text-[0.9375rem] text-[#1A1A2E] font-semibold align-top">
                            {row.pillar}
                          </td>
                          <td className="py-3 pr-4 text-[0.9375rem] text-[#1A1A2E] font-semibold align-top">
                            {row.dimension}
                          </td>
                          <td className="py-3 text-[0.9375rem] text-[#4B5563] leading-relaxed align-top">
                            {row.measures}
                          </td>
                        </tr>
                      ))}
                    </Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ── CHECKERED DIVIDER ── */}
        <div className="checkered-divider" aria-hidden="true" />

        {/* ── COMPARISON ── */}
        <section
          className="section"
          style={{ background: "#1A1A2E" }}
          aria-labelledby="ve-cmp-title"
        >
          <div className="container">
            <div className="fade-in">
              <SectionLabel tone="dark">{t.comparison.sectionLabel}</SectionLabel>
              <h2
                id="ve-cmp-title"
                className="font-extrabold leading-[1.1] tracking-[-0.025em] text-[#F1F5F9] mb-5"
                style={{ fontSize: "clamp(1.75rem, 4vw, 2.75rem)" }}
              >
                {t.comparison.title}
              </h2>
              <p className="text-[#CBD5E1] text-[1.05rem] leading-[1.75] max-w-[680px]">
                {t.comparison.intro}
              </p>
            </div>
            <div className="mt-10 fade-in overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <caption className="sr-only">{t.comparison.title}</caption>
                <thead>
                  <tr>
                    <th
                      scope="col"
                      className="text-[0.7rem] font-bold tracking-[0.14em] uppercase text-[#C0C0C8] py-3 pr-4 border-b border-[rgba(192,192,200,0.2)]"
                    >
                      {t.comparison.columns.axis}
                    </th>
                    <th
                      scope="col"
                      className="text-[0.7rem] font-bold tracking-[0.14em] uppercase text-[#C0C0C8] py-3 pr-4 border-b border-[rgba(192,192,200,0.2)]"
                    >
                      {t.comparison.columns.vibeCoding}
                    </th>
                    <th
                      scope="col"
                      className="text-[0.7rem] font-bold tracking-[0.14em] uppercase text-[#F1F5F9] py-3 pr-4 border-b-2 border-[#EA580C]"
                    >
                      {t.comparison.columns.vibeEngineering}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {t.comparison.rows.map((row) => (
                    <tr
                      key={row.axis}
                      className="border-b border-[rgba(192,192,200,0.12)]"
                    >
                      <th
                        scope="row"
                        className="py-3 pr-4 text-[0.9375rem] text-[#C0C0C8] font-semibold align-top text-left"
                      >
                        {row.axis}
                      </th>
                      <td className="py-3 pr-4 text-[0.9375rem] text-[#CBD5E1] leading-relaxed align-top">
                        {row.vibeCoding}
                      </td>
                      <td className="py-3 pr-4 text-[0.9375rem] text-[#F1F5F9] leading-relaxed align-top font-semibold">
                        {row.vibeEngineering}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="text-[#C0C0C8] text-[0.95rem] leading-[1.7] max-w-[680px] mt-8 italic">
                {t.comparison.closing}
              </p>
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section
          className="section text-center"
          style={{ background: "#1A1A2E" }}
          aria-labelledby="ve-cta-title"
        >
          <div className="container">
            <div className="fade-in">
              <SectionLabel tone="dark">{t.cta.sectionLabel}</SectionLabel>
              <h2
                id="ve-cta-title"
                className="font-extrabold leading-[1.1] tracking-[-0.025em] text-[#F1F5F9] mb-6"
                style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}
              >
                {t.cta.title}
              </h2>
              <p className="text-[1.1rem] text-[#CBD5E1] max-w-[560px] mx-auto mb-4 leading-[1.7]">
                {t.cta.lead}
              </p>
              <p className="text-base text-[#C0C0C8] max-w-[520px] mx-auto mb-10 leading-[1.7]">
                {t.cta.text}
              </p>
              <a
                href={`mailto:${t.cta.email}`}
                className="inline-flex items-center justify-center gap-2 min-h-[56px] px-9 bg-[#EA580C] text-white font-bold text-[1.05rem] rounded tracking-wide transition-all duration-200 hover:bg-[#C94D0A] hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(234,88,12,0.4)]"
              >
                <EnvelopeIcon size={20} />
                {t.cta.email}
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* ── FOOTER ── */}
      <footer
        className="py-8 text-center"
        style={{ background: "#111120" }}
        role="contentinfo"
      >
        <div className="container">
          <p className="text-[0.95rem] font-semibold text-[#F1F5F9] mb-2">
            Performance Dudes
          </p>
          <p className="text-[0.85rem] text-[#C0C0C8] mb-4">{t.footer.tagline}</p>
          <div className="flex items-center justify-center gap-6 text-sm text-[#C0C0C8]">
            <Link
              href={t.footer.switchLangHref}
              className="hover:text-[#F1F5F9] transition-colors duration-200"
            >
              {t.footer.switchLang}
            </Link>
            <Link
              href={t.footer.imprintHref}
              className="hover:text-[#F1F5F9] transition-colors duration-200"
            >
              {t.footer.imprint}
            </Link>
            <a
              href={t.footer.shareHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 hover:text-[#F1F5F9] transition-colors duration-200"
            >
              <LinkedInIcon size={14} />
              {t.footer.shareLinkedIn}
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
