import { Menu } from "lucide-react";
import Link from "next/link";

import { siteConfig } from "@/content/site";

export function MarketingHeader() {
  return (
    <header className="absolute inset-x-0 top-0 z-30 border-b border-white/10 bg-overlay/30 text-white backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="font-heading text-sm font-medium uppercase tracking-[0.16em] text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
        >
          808 Digital Systems
        </Link>

        <nav aria-label="Primary navigation" className="hidden items-center gap-7 sm:flex">
          {siteConfig.navigation.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-sm text-white/70 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <details className="group relative sm:hidden">
          <summary className="flex size-10 cursor-pointer list-none items-center justify-center rounded-md border border-white/20 text-white transition-colors marker:hidden hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white [&::-webkit-details-marker]:hidden">
            <Menu aria-hidden="true" className="size-5" />
            <span className="sr-only">Open navigation</span>
          </summary>
          <nav
            aria-label="Mobile navigation"
            className="absolute right-0 mt-3 flex min-w-52 flex-col overflow-hidden rounded-lg border border-black/10 bg-background p-2 text-foreground shadow-xl"
          >
            {siteConfig.navigation.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="rounded-md px-4 py-3 text-sm font-medium transition-colors hover:bg-primary/8 focus-visible:outline-2 focus-visible:outline-primary"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </details>
      </div>
    </header>
  );
}
