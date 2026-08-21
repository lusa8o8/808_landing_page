import type { MetadataRoute } from "next";

import { siteConfig } from "@/content/site";
import { buildSitemap, isIndexingEnabled } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  return buildSitemap(siteConfig.siteUrl, isIndexingEnabled());
}
