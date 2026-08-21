import type { Metadata } from "next";
import type { ReactNode } from "react";

import { siteConfig } from "@/content/site";
import { createPageMetadata } from "@/lib/page-metadata";
import { buildRobotsMetadata, isIndexingEnabled } from "@/lib/seo";

import "./globals.css";

const defaultTitle = "808 Digital Systems | Websites for Lusaka service businesses";
const rootMetadata = createPageMetadata({
  title: defaultTitle,
  description: siteConfig.description,
  path: "/",
});

export const metadata: Metadata = {
  ...rootMetadata,
  metadataBase: new URL(siteConfig.siteUrl),
  title: {
    default: defaultTitle,
    template: "%s | 808 Digital Systems",
  },
  robots: buildRobotsMetadata(isIndexingEnabled()),
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en-ZM">
      <body className="font-body">{children}</body>
    </html>
  );
}
