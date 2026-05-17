import Link from "next/link";

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

export function Footer({ locale }: { locale: "de" | "en" }) {
  const isDE = locale === "de";
  return (
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
          AI-Native Software Engineering
        </p>
        <div className="flex items-center justify-center gap-6 text-sm text-[#C0C0C8]">
          <Link
            href={isDE ? "/en" : "/"}
            className="hover:text-[#F1F5F9] transition-colors duration-200"
          >
            {isDE ? "English" : "Deutsch"}
          </Link>
          <Link
            href={isDE ? "/impressum" : "/en/imprint"}
            className="hover:text-[#F1F5F9] transition-colors duration-200"
          >
            {isDE ? "Impressum" : "Imprint"}
          </Link>
          <a
            href="https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2Fperformance-dudes.de"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 hover:text-[#F1F5F9] transition-colors duration-200"
          >
            <LinkedInIcon />
            {isDE ? "Auf LinkedIn teilen" : "Share on LinkedIn"}
          </a>
        </div>
      </div>
    </footer>
  );
}
