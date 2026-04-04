import { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://performance-dudes.de";
  const lastModified = new Date("2026-03-08");
  return [
    {
      url: base,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
      alternates: { languages: { en: `${base}/en` } },
    },
    {
      url: `${base}/en`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
      alternates: { languages: { de: base } },
    },
    {
      url: `${base}/imprint`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.1,
    },
    {
      url: `${base}/en/imprint`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.1,
    },
  ];
}
