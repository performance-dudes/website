import type { Metadata } from "next";
import { getContent } from "@/content";
import { VibeEngineeringPage } from "../../VibeEngineeringPage";

export const metadata: Metadata = {
  title: "Vibe Engineering — Performance Dudes",
  description:
    "Vibe Engineering is the discipline of steering AI to produce exactly what you envision. Four moves, seven dimensions, one stance.",
  keywords: [
    "Vibe Engineering",
    "AI-Native Software Engineering",
    "AI software development",
    "prompt engineering",
    "vibe coding",
    "AI engineering discipline",
  ],
  openGraph: {
    title: "Vibe Engineering — Performance Dudes",
    description:
      "The discipline of steering AI to produce exactly what you envision. Not prompting. Orchestrating.",
    url: "https://performance-dudes.de/en/vibe-engineering",
    siteName: "Performance Dudes",
    locale: "en_US",
    alternateLocale: ["de_DE"],
    type: "article",
    images: [
      {
        url: "/og-image-text.jpg",
        width: 1200,
        height: 630,
        alt: "Performance Dudes — AI-Native Software Engineering",
      },
    ],
  },
  alternates: {
    canonical: "https://performance-dudes.de/en/vibe-engineering",
    languages: {
      de: "https://performance-dudes.de/vibe-engineering",
      en: "https://performance-dudes.de/en/vibe-engineering",
      "x-default": "https://performance-dudes.de/vibe-engineering",
    },
  },
  robots: { index: true, follow: true },
};

export default function VibeEngineeringEn() {
  const t = getContent("en").vibeEngineering;
  return <VibeEngineeringPage t={t} />;
}
