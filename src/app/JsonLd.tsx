export function OrganizationJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Performance Dudes",
    "url": "https://performance-dudes.de",
    "email": "hello@performance-dudes.de",
    "description": "AI-first software engineering collective. Fixed price, delivered in weeks.",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Josephsplatz 8",
      "addressLocality": "Nürnberg",
      "postalCode": "90403",
      "addressCountry": "DE"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Software Engineering Services",
      "itemListElement": [
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Performance Audit", "description": "Fixed-price codebase analysis." } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Build", "description": "Fixed-price AI-native software development with team enablement." } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Replace Your SaaS", "description": "Custom software replacing off-the-shelf tools, built for AI from day one." } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Team Upgrade", "description": "AI tooling, workflows, and practices to make your existing team faster." } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Autopilot for the chores", "description": "AI-automated updates, tests, documentation, and security patches." } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Race Strategy", "description": "Prioritization consulting to find and sequence highest-impact ideas." } }
      ]
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
