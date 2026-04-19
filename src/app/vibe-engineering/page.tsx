import type { Metadata } from "next";
import { getContent } from "@/content";
import { VibeEngineeringPage } from "../VibeEngineeringPage";

export const metadata: Metadata = {
  title: "Vibe Engineering — Performance Dudes",
  description:
    "Vibe Engineering ist die Disziplin, AI so zu steuern, dass sie genau das produziert, was du vor Augen hast. Vier Bewegungen, sieben Dimensionen, eine Haltung.",
  keywords: [
    "Vibe Engineering",
    "AI-Native Software Engineering",
    "AI Software Entwicklung",
    "Prompt Engineering",
    "Vibe Coding",
    "AI Engineering Discipline",
  ],
  openGraph: {
    title: "Vibe Engineering — Performance Dudes",
    description:
      "Die Disziplin, AI so zu steuern, dass sie genau das produziert, was du vor Augen hast. Not prompting. Orchestrating.",
    url: "https://performance-dudes.de/vibe-engineering",
    siteName: "Performance Dudes",
    locale: "de_DE",
    alternateLocale: ["en_US"],
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
    canonical: "https://performance-dudes.de/vibe-engineering",
    languages: {
      de: "https://performance-dudes.de/vibe-engineering",
      en: "https://performance-dudes.de/en/vibe-engineering",
      "x-default": "https://performance-dudes.de/vibe-engineering",
    },
  },
  robots: { index: true, follow: true },
};

export default function VibeEngineering() {
  const t = getContent("de").vibeEngineering;
  return <VibeEngineeringPage t={t} />;
}
