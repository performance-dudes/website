import Link from "next/link";

/* ─── Types ─── */

type PitBoardItem = {
  readonly label: string;
  readonly value: string;
  readonly desc: string;
};

type Content = {
  readonly hero: {
    readonly title: string;
    readonly eyebrow: string;
    readonly tagline: string;
    readonly text: string;
  };
  readonly methodology: { readonly text: string };
  readonly racingCar: {
    readonly title: string;
    readonly sectionLabel: string;
    readonly p1: string;
    readonly p2: string;
    readonly pitBoard: readonly PitBoardItem[];
    readonly p3: string;
  };
  readonly beliefs: {
    readonly title: string;
    readonly sectionLabel: string;
    readonly items: readonly { readonly bold: string; readonly text: string }[];
  };
  readonly products: {
    readonly title: string;
    readonly sectionLabel: string;
    readonly items: readonly {
      readonly name: string;
      readonly text: string;
      readonly badge?: string;
    }[];
  };
  readonly howItWorks: {
    readonly title: string;
    readonly sectionLabel: string;
    readonly steps: readonly { readonly bold: string; readonly text: string }[];
  };
  readonly whoWeAre: {
    readonly title: string;
    readonly sectionLabel: string;
    readonly quote: string;
    readonly p1: string;
    readonly experience: string;
    readonly p2: string;
    readonly p3: string;
  };
  readonly cta: {
    readonly title: string;
    readonly text: string;
    readonly action: string;
    readonly email: string;
  };
  readonly footer: {
    readonly tagline: string;
    readonly switchLang: string;
    readonly switchLangHref: string;
    readonly imprint: string;
    readonly imprintHref: string;
    readonly shareLinkedIn: string;
  };
};

/* ─── Shared sub-components ─── */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="inline-flex items-center gap-2 text-[0.75rem] font-bold tracking-[0.14em] uppercase text-[#EA580C] mb-4"
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

function LinkedInIcon({ size = 16 }: { size?: number }) {
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

/* ─── Page component ─── */

export function HomePage({ t }: { t: Content }) {
  // Tagline is always "Build fast. Enable. Leave." — split to highlight "fast"
  const taglineParts = t.hero.tagline.split("fast");

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
            <a
              href="#hero"
              className="text-[#F1F5F9] font-bold text-base tracking-[0.04em] uppercase no-underline"
              aria-label="Performance Dudes home"
            >
              Performance<span className="text-[#EA580C]">Dudes</span>
            </a>
            <a
              href={`mailto:${t.cta.email}`}
              className="inline-flex items-center justify-center min-h-[48px] px-5 bg-[#EA580C] text-white font-semibold text-sm rounded tracking-wide transition-all duration-200 hover:bg-[#C94D0A] hover:-translate-y-px whitespace-nowrap"
            >
              {t.cta.email}
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
            paddingTop: "calc(64px + clamp(4rem, 10vw, 7rem))",
            paddingBottom: "clamp(4rem, 10vw, 7rem)",
          }}
          aria-labelledby="hero-title"
        >
          <div className="speed-lines" aria-hidden="true" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/hero-a.webp"
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            style={{ opacity: 0.25, mixBlendMode: "lighten", zIndex: 0 }}
          />
          <div className="container" style={{ position: "relative", zIndex: 1 }}>
            <div style={{ maxWidth: "780px" }}>
              {/* Eyebrow */}
              <div
                className="inline-flex items-center gap-2 text-[0.8rem] font-semibold tracking-[0.12em] uppercase text-[#C0C0C8] mb-6"
                aria-hidden="true"
              >
                <span className="w-7 h-0.5 bg-[#EA580C] shrink-0 block" />
                {t.hero.eyebrow}
              </div>

              {/* H1 */}
              <h1
                id="hero-title"
                className="font-extrabold leading-[1.05] tracking-[-0.03em] mb-2 text-[#F1F5F9]"
                style={{ fontSize: "clamp(2.5rem, 7vw, 5rem)" }}
              >
                {t.hero.title}
              </h1>

              {/* Tagline */}
              <p
                className="font-bold text-[#EA580C] tracking-[0.04em] mb-8"
                style={{ fontSize: "clamp(1.15rem, 2.5vw, 1.5rem)" }}
              >
                {taglineParts[0]}
                <span
                  className="underline decoration-[3px] underline-offset-[4px] decoration-[#EA580C]"
                >
                  fast
                </span>
                {taglineParts[1]}
              </p>

              {/* Lead */}
              <p
                className="text-[#CBD5E1] max-w-[640px] mb-6 leading-[1.7]"
                style={{ fontSize: "clamp(1rem, 2vw, 1.15rem)" }}
              >
                {t.hero.text}
              </p>

              {/* Method quote */}
              <blockquote className="text-[0.95rem] text-[#C0C0C8] border-l-[3px] border-[#EA580C] pl-4 mb-10 leading-[1.6] max-w-[580px]">
                {t.methodology.text}
              </blockquote>

              {/* CTA button */}
              <a
                href={`mailto:${t.cta.email}`}
                className="inline-flex items-center justify-center gap-2 min-h-[52px] px-8 bg-[#EA580C] text-white font-bold text-base rounded tracking-wide transition-all duration-200 hover:bg-[#C94D0A] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-orange-500/35"
              >
                <EnvelopeIcon size={18} />
                {t.cta.email}
              </a>
            </div>
          </div>
        </section>

        {/* ── CHECKERED DIVIDER ── */}
        <div className="checkered-divider" aria-hidden="true" />

        {/* ── RACING CAR ── */}
        <section
          className="section bg-[#FAFAFA]"
          aria-labelledby="racing-title"
        >
          <div className="container">
            <div className="fade-in">
              <SectionLabel>{t.racingCar.sectionLabel}</SectionLabel>
              <h2
                id="racing-title"
                className="font-extrabold leading-[1.1] tracking-[-0.025em] text-[#1A1A2E] mb-7"
                style={{ fontSize: "clamp(1.75rem, 4vw, 2.75rem)" }}
              >
                {t.racingCar.title}
              </h2>
              <p className="text-[#4B5563] text-[1.05rem] leading-[1.75] max-w-[680px] mb-5">
                {t.racingCar.p1}
              </p>
              <p className="text-[#4B5563] text-[1.05rem] leading-[1.75] max-w-[680px] mb-8">
                {t.racingCar.p2}
              </p>

              {/* Pit board */}
              <div
                className="bg-[#1A1A2E] text-[#F1F5F9] border-l-4 border-[#EA580C] rounded p-8 mb-8 grid grid-cols-2 sm:grid-cols-4 gap-5"
                role="list"
                aria-label="Racing car analogy diagram"
              >
                {t.racingCar.pitBoard.map((item) => (
                  <div key={item.label} className="flex flex-col gap-1" role="listitem">
                    <span className="text-xs font-bold tracking-widest uppercase text-[#C0C0C8]">
                      {item.label}
                    </span>
                    <span className="text-base font-semibold text-[#F1F5F9]">
                      {item.value}
                    </span>
                    <span className="text-xs leading-snug text-[#C0C0C8]/70">
                      {item.desc}
                    </span>
                  </div>
                ))}
              </div>

              <p className="text-[#4B5563] text-[1.05rem] leading-[1.75] max-w-[680px]">
                {t.racingCar.p3}
              </p>
            </div>
          </div>
        </section>

        {/* ── CHECKERED DIVIDER ── */}
        <div className="checkered-divider" aria-hidden="true" />

        {/* ── BELIEFS ── */}
        <section
          className="section"
          style={{ background: "#F0F0F4" }}
          aria-labelledby="beliefs-title"
        >
          <div className="container">
            <div className="fade-in">
              <SectionLabel>{t.beliefs.sectionLabel}</SectionLabel>
              <h2
                id="beliefs-title"
                className="font-extrabold leading-[1.1] tracking-[-0.025em] text-[#1A1A2E]"
                style={{ fontSize: "clamp(1.75rem, 4vw, 2.75rem)" }}
              >
                {t.beliefs.title}
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-10">
              {t.beliefs.items.map((item, i) => (
                <article
                  key={item.bold}
                  className="bg-white rounded p-7 border-t-[3px] border-[#1A1A2E] relative fade-in"
                >
                  <span
                    className="absolute top-5 right-5 text-5xl font-extrabold text-[#E5E7EB] leading-none pointer-events-none select-none"
                    aria-hidden="true"
                  >
                    {i + 1}
                  </span>
                  <h3 className="text-base font-bold text-[#1A1A2E] leading-snug mb-3">
                    {item.bold}
                  </h3>
                  <p className="text-[0.9375rem] text-[#4B5563] leading-relaxed">
                    {item.text}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── PRODUCTS ── */}
        <section
          className="section bg-[#FAFAFA]"
          aria-labelledby="products-title"
        >
          <div className="container">
            <div className="fade-in">
              <SectionLabel>{t.products.sectionLabel}</SectionLabel>
              <h2
                id="products-title"
                className="font-extrabold leading-[1.1] tracking-[-0.025em] text-[#1A1A2E]"
                style={{ fontSize: "clamp(1.75rem, 4vw, 2.75rem)" }}
              >
                {t.products.title}
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-10">
              {t.products.items.map((item) => (
                <article
                  key={item.name}
                  className="bg-white border border-[#E5E7EB] rounded p-7 flex flex-col gap-3 relative overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#1A1A2E]/10 fade-in group"
                >
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h3 className="text-lg font-bold text-[#1A1A2E]">
                      {item.name}
                    </h3>
                    {item.badge && (
                      <span className="inline-block bg-[#EA580C] text-white text-[0.65rem] font-bold tracking-widest uppercase px-2 py-0.5 rounded-sm">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-[0.9375rem] text-[#4B5563] leading-relaxed flex-1">
                    {item.text}
                  </p>
                  <span className="absolute bottom-0 left-7 right-7 h-0.5 bg-[#1A1A2E] rounded-t opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── CHECKERED DIVIDER ── */}
        <div className="checkered-divider" aria-hidden="true" />

        {/* ── HOW IT WORKS ── */}
        <section
          className="section"
          style={{ background: "#1A1A2E" }}
          aria-labelledby="how-title"
        >
          <div className="container">
            <div className="fade-in">
              <div
                className="inline-flex items-center gap-2 text-[0.75rem] font-bold tracking-[0.14em] uppercase text-[#C0C0C8] mb-4"
                aria-hidden="true"
              >
                <span className="w-5 h-0.5 bg-[#EA580C] shrink-0 block" />
                {t.howItWorks.sectionLabel}
              </div>
              <h2
                id="how-title"
                className="font-extrabold leading-[1.1] tracking-[-0.025em] text-[#F1F5F9]"
                style={{ fontSize: "clamp(1.75rem, 4vw, 2.75rem)" }}
              >
                {t.howItWorks.title}
              </h2>
            </div>
            <ol
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-10"
              aria-label="Our process steps"
            >
              {t.howItWorks.steps.map((step, i) => (
                <li key={step.bold} className="flex flex-col gap-2 fade-in">
                  <div
                    className="text-[4rem] font-extrabold text-[#EA580C] leading-none tracking-[-0.04em]"
                    aria-hidden="true"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div className="text-lg font-bold text-[#F1F5F9]">
                    {step.bold}
                  </div>
                  <p className="text-[0.9375rem] text-[#C0C0C8] leading-relaxed">
                    {step.text}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ── WHO WE ARE ── */}
        <section
          className="section bg-[#FAFAFA]"
          aria-labelledby="who-title"
        >
          <div className="container">
            <div className="fade-in">
              <SectionLabel>{t.whoWeAre.sectionLabel}</SectionLabel>
              <h2
                id="who-title"
                className="font-extrabold leading-[1.1] tracking-[-0.025em] text-[#1A1A2E] mb-10"
                style={{ fontSize: "clamp(1.75rem, 4vw, 2.75rem)" }}
              >
                {t.whoWeAre.title}
              </h2>
            </div>
            <div
              className="grid grid-cols-1 sm:grid-cols-2 items-start fade-in"
              style={{ gap: "clamp(2rem, 5vw, 4rem)" }}
            >
              <div>
                <blockquote
                  className="font-bold leading-[1.4] text-[#1A1A2E] border-l-4 border-[#1A1A2E] pl-5 mb-6"
                  style={{ fontSize: "clamp(1.1rem, 2.5vw, 1.3rem)" }}
                >
                  {t.whoWeAre.quote}
                </blockquote>
                <p className="text-base text-[#4B5563] leading-[1.75]">
                  {t.whoWeAre.p1}
                </p>
                <p className="text-base text-[#4B5563] leading-[1.75] mt-4 fade-in">
                  {t.whoWeAre.experience}
                </p>
              </div>
              <div>
                <p className="text-base text-[#4B5563] leading-[1.75] mb-4">
                  {t.whoWeAre.p2}
                </p>
                <p className="text-base font-semibold text-[#1A1A2E] italic">
                  {t.whoWeAre.p3}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section
          className="section text-center"
          style={{ background: "#1A1A2E" }}
          aria-labelledby="cta-title"
        >
          <div className="container">
            <div className="fade-in">
              <h2
                id="cta-title"
                className="font-extrabold leading-[1.1] tracking-[-0.025em] text-[#F1F5F9] mb-6"
                style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}
              >
                {t.cta.title}
              </h2>
              <p className="text-[1.1rem] text-[#CBD5E1] max-w-[560px] mx-auto mb-4 leading-[1.7]">
                {t.cta.text}
              </p>
              <p className="text-base text-[#C0C0C8] max-w-[480px] mx-auto mb-10 leading-[1.7]">
                {t.cta.action}
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
          <p className="text-[0.85rem] text-[#C0C0C8] mb-4">
            {t.footer.tagline}
          </p>
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
              href="https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2Fperformance-dudes.de"
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
