import type { Metadata, MetadataRoute } from "next";

export const publicRoutePaths = [
  "/",
  "/calculator",
  "/services",
  "/services/service-and-pricing-pages",
  "/services/booking-systems",
  "/services/local-search-and-maps",
] as const;

type OrganizationFacts = {
  email: string;
  location: string;
  name: string;
  siteUrl: string;
  telephone: string;
};

function canonicalOrigin(siteUrl: string): string {
  return siteUrl.replace(/\/$/, "");
}

export function isIndexingEnabled(value = process.env.SITE_INDEXING_ENABLED): boolean {
  return value === "true";
}

export function buildRobotsMetadata(enabled: boolean): NonNullable<Metadata["robots"]> {
  if (!enabled) {
    return {
      index: false,
      follow: false,
      googleBot: {
        index: false,
        follow: false,
      },
    };
  }

  return {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  };
}

export function buildRobotsFile(
  siteUrl: string,
  enabled: boolean,
): MetadataRoute.Robots {
  const origin = canonicalOrigin(siteUrl);

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    ...(enabled
      ? {
          host: origin,
          sitemap: `${origin}/sitemap.xml`,
        }
      : {}),
  };
}

export function buildSitemap(siteUrl: string, enabled: boolean): MetadataRoute.Sitemap {
  if (!enabled) {
    return [];
  }

  const origin = canonicalOrigin(siteUrl);

  return publicRoutePaths.map((path) => ({
    url: `${origin}${path === "/" ? "" : path}`,
  }));
}

export function buildOrganizationJsonLd(facts: OrganizationFacts) {
  const origin = canonicalOrigin(facts.siteUrl);
  const city = facts.location.split(",")[0]?.trim() || facts.location;

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${origin}/#organization`,
    name: facts.name,
    url: origin,
    email: facts.email,
    telephone: facts.telephone,
    areaServed: {
      "@type": "City",
      name: city,
    },
  };
}

export function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
