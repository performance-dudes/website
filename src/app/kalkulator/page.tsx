import type { Metadata } from "next";
import { getContent } from "@/content";
import { Calculator } from "./Calculator";
import { Nav } from "../components/Nav";
import { Footer } from "../components/Footer";

export const metadata: Metadata = {
  title: "Kalkulator — Performance Dudes",
  description:
    "Was bringt euch AI-Native Software Engineering? Interaktiver Kalkulator: Pain Points waehlen, Budget einstellen, Ergebnis sehen.",
  keywords: [
    "Software-Kalkulator",
    "AI-Native Engineering",
    "Team-Output",
    "Entwicklerproduktivitaet",
    "Performance Dudes",
  ],
  openGraph: {
    title: "Team-Output-Kalkulator | Performance Dudes",
    description:
      "Pain Points waehlen, Budget einstellen und sofort sehen: wie viel Output euer Team nach 12 Monaten liefert.",
    url: "https://performance-dudes.de/kalkulator",
    siteName: "Performance Dudes",
    locale: "de_DE",
    alternateLocale: ["en_US"],
    type: "website",
    images: [
      {
        url: "/og-image-text.jpg",
        width: 1200,
        height: 630,
        alt: "Performance Dudes Team-Output-Kalkulator",
      },
    ],
  },
  alternates: {
    canonical: "https://performance-dudes.de/kalkulator",
    languages: {
      de: "https://performance-dudes.de/kalkulator",
      en: "https://performance-dudes.de/en/kalkulator",
    },
  },
  robots: { index: true, follow: true },
};

export default function KalkulatorPage() {
  const t = getContent("de");
  return (
    <>
      <Nav />
      <main style={{ paddingTop: "64px" }}>
        <Calculator t={t.kalkulator} />
      </main>
      <Footer locale="de" />
    </>
  );
}
