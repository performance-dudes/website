import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { OrganizationJsonLd } from "./JsonLd";

export const metadata: Metadata = {
  metadataBase: new URL("https://performance-dudes.de"),
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icons/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/favicon-16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: { url: "/apple-touch-icon.png", sizes: "180x180" },
  },
  manifest: "/website/site.webmanifest",
  openGraph: {
    images: [{ url: "/og-image-text.jpg", width: 1200, height: 630, alt: "Performance Dudes — AI-Native Software Engineering" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Performance Dudes — Build fast. Enable. Leave.",
    description: "Senior engineers. Fixed price, delivered in weeks. AI-native software engineering.",
    images: ["/og-image-text.jpg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body className="antialiased">
        <OrganizationJsonLd />
        {children}
        <Script id="scroll-reveal" strategy="afterInteractive">{`
          (function () {
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
            var els = document.querySelectorAll('.fade-in');
            if (!('IntersectionObserver' in window)) {
              els.forEach(function (el) { el.classList.add('visible'); });
              return;
            }
            var observer = new IntersectionObserver(
              function (entries) {
                entries.forEach(function (entry) {
                  if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                  }
                });
              },
              { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
            );
            els.forEach(function (el) { observer.observe(el); });
          })();
        `}</Script>
      </body>
    </html>
  );
}
