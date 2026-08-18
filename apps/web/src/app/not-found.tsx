import { ArrowLeft, MessageCircle } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { siteConfig } from "@/content/site";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-overlay px-4 py-24 text-white">
      <div className="mx-auto max-w-xl text-center">
        <p className="mb-5 font-heading text-xs font-medium uppercase tracking-[0.24em] text-accent">
          404 · Page not found
        </p>
        <h1 className="font-heading text-4xl font-medium tracking-tight sm:text-5xl">
          This route does not exist yet.
        </h1>
        <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-white/60">
          The page may have moved, or the address may be incomplete. Return to the calculator or
          contact {siteConfig.shortName} directly.
        </p>
        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <ArrowLeft aria-hidden="true" className="size-4" />
            Back to the calculator
          </Link>
          <a
            href={siteConfig.whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/20 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <MessageCircle aria-hidden="true" className="size-4" />
            Contact us
          </a>
        </div>
      </div>
    </main>
  );
}
