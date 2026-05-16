import Link from "next/link";

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

export function Nav() {
  return (
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
            href="/"
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
  );
}
