import type { Metadata } from "next";
import { getContent } from "@/content";
import { HomePage } from "./HomePage";

export const metadata: Metadata = {
  title: "Performance Dudes — AI-Native Software Engineering",
  description: "Senior Engineers. Festpreis, geliefert in Wochen. Wir bauen, modernisieren und machen Software AI-ready. Wenn wir gehen, arbeitet euer Team eigenständig weiter.",
  keywords: ["Softwareentwicklung Festpreis", "AI Software Beratung", "AI-ready Software", "Software Modernisierung", "Senior Engineers Nürnberg", "Softwareberatung Deutschland"],
  openGraph: {
    title: "Performance Dudes — Build fast. Enable. Leave.",
    description: "Senior Engineers. Festpreis, geliefert in Wochen. Wir bauen, modernisieren und machen Software AI-ready.",
    url: "https://performance-dudes.de",
    siteName: "Performance Dudes",
    locale: "de_DE",
    alternateLocale: ["en_US"],
    type: "website",
    images: [{ url: "/og-image-text.jpg", width: 1200, height: 630, alt: "Performance Dudes — AI-Native Software Engineering" }],
  },
  alternates: {
    canonical: "https://performance-dudes.de",
    languages: {
      "de": "https://performance-dudes.de",
      "en": "https://performance-dudes.de/en",
    },
  },
  robots: { index: true, follow: true },
};

export default function Home() {
  return <HomePage t={getContent("de")} />;
}
