import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Landing Page for 808 Digital Systems",
  description:
    "Designed for Lusaka businesses, this app creates practical booking and discovery systems that enhance visibility and streamline client engagement.",
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
