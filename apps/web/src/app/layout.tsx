import type { Metadata } from "next";
import type { ReactNode } from "react";

import { siteConfig } from "@/content/site";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: {
    default: "808 Digital Systems | Booking and discovery systems",
    template: "%s | 808 Digital Systems",
  },
  description: siteConfig.description,
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body className="font-body">{children}</body>
    </html>
  );
}
