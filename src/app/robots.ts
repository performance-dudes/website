import { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/imprint", "/en/imprint", "/impressum"],
    },
    sitemap: "https://performance-dudes.de/sitemap.xml",
  };
}
