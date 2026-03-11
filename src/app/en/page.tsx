import type { Metadata } from "next";
import { getContent } from "@/content";
import { HomePage } from "../HomePage";

export const metadata: Metadata = {
  title: "Performance Dudes — AI-Native Software Engineering",
  description: "Senior engineers. Fixed price, delivered in weeks. We build, modernize, and make software AI-ready. When we leave, your team keeps shipping independently.",
  keywords: ["fixed price software development", "AI-first software engineering", "software modernization consulting Germany", "AI-ready codebase", "senior software engineers"],
  openGraph: {
    title: "Performance Dudes — Build fast. Enable. Leave.",
    description: "Senior engineers. Fixed price, delivered in weeks. We build, modernize, and make software AI-ready.",
    url: "https://performance-dudes.de/en",
    siteName: "Performance Dudes",
    locale: "en_US",
    alternateLocale: ["de_DE"],
    type: "website",
    images: [{ url: "/og-image-text.jpg", width: 1200, height: 630, alt: "Performance Dudes — AI-Native Software Engineering" }],
  },
  alternates: {
    canonical: "https://performance-dudes.de/en",
    languages: {
      "de": "https://performance-dudes.de",
      "en": "https://performance-dudes.de/en",
    },
  },
  robots: { index: true, follow: true },
};

export default function HomeEn() {
  return <HomePage t={getContent("en")} />;
}
