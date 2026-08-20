"use client";

import { ArrowLeft, RotateCcw } from "lucide-react";
import Link from "next/link";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-overlay px-4 py-24 text-white">
      <div className="mx-auto max-w-xl text-center">
        <p className="mb-5 font-heading text-xs font-medium uppercase tracking-[0.24em] text-accent">
          Temporary issue
        </p>
        <h1 className="font-heading text-4xl font-medium tracking-tight sm:text-5xl">
          We could not load this page.
        </h1>
        <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-white/60">
          Your request was not completed. Try the page again, or return home and continue from
          there.
        </p>
        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-6 py-3 text-sm font-medium text-primary transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <RotateCcw aria-hidden="true" className="size-4" />
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/20 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <ArrowLeft aria-hidden="true" className="size-4" />
            Return home
          </Link>
        </div>
      </div>
    </main>
  );
}
