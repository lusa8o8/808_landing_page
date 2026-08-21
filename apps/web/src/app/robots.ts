import type { MetadataRoute } from "next";

import { siteConfig } from "@/content/site";
import { buildRobotsFile, isIndexingEnabled } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return buildRobotsFile(siteConfig.siteUrl, isIndexingEnabled());
}
