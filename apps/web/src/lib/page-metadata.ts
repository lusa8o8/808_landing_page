import type { Metadata } from "next";

import { siteConfig } from "@/content/site";

type PageMetadataInput = {
  description: string;
  path: string;
  title: string;
};

export function createPageMetadata({
  description,
  path,
  title,
}: PageMetadataInput): Metadata {
  return {
    title,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title,
      description,
      url: path,
      siteName: siteConfig.shortName,
      locale: siteConfig.locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
