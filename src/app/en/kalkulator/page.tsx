import type { Metadata } from "next";
import { getContent } from "@/content";
import { Calculator } from "@/app/kalkulator/Calculator";
import { Nav } from "@/app/components/Nav";
import { Footer } from "@/app/components/Footer";

export const metadata: Metadata = {
  title: "Calculator — Performance Dudes",
  description:
    "What does AI-Native Software Engineering get you? Interactive calculator: choose your pain points, set your budget, see the results.",
  keywords: [
    "software calculator",
    "AI-native engineering",
    "team output",
    "developer productivity",
    "Performance Dudes",
  ],
  openGraph: {
    title: "Team Output Calculator | Performance Dudes",
    description:
      "Choose pain points, set your budget and instantly see: how much output your team delivers after 12 months.",
    url: "https://performance-dudes.de/en/kalkulator",
    siteName: "Performance Dudes",
    locale: "en_US",
    alternateLocale: ["de_DE"],
    type: "website",
    images: [
      {
        url: "/og-image-text.jpg",
        width: 1200,
        height: 630,
        alt: "Performance Dudes Team Output Calculator",
      },
    ],
  },
  alternates: {
    canonical: "https://performance-dudes.de/en/kalkulator",
    languages: {
      de: "https://performance-dudes.de/kalkulator",
      en: "https://performance-dudes.de/en/kalkulator",
    },
  },
  robots: { index: true, follow: true },
};

export default function KalkulatorPageEn() {
  const t = getContent("en");
  return (
    <>
      <Nav />
      <main style={{ paddingTop: "64px" }}>
        <Calculator t={t.kalkulator} />
      </main>
      <Footer locale="en" />
    </>
  );
}
