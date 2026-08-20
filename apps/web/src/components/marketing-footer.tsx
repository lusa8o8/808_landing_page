import { ArrowRight } from "lucide-react";

import { siteConfig } from "@/content/site";

export function MarketingFooter() {
  return (
    <footer id="contact" className="bg-primary px-4 py-24 text-center text-white">
      <div className="mx-auto max-w-lg space-y-8">
        <h2 className="font-heading text-2xl font-medium leading-snug sm:text-[32px]">
          Ready to see whether the numbers work for your business?
        </h2>

        <a
          href={siteConfig.whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-8 py-3.5 text-sm font-medium text-primary transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white active:opacity-75"
        >
          Start on WhatsApp
          <ArrowRight aria-hidden="true" className="size-4" />
        </a>

        <div className="space-y-3 border-t border-white/10 pt-8">
          <p className="font-heading text-xs font-medium uppercase tracking-[0.2em] text-white/80">
            {siteConfig.shortName}
          </p>
          <p className="text-xs text-white/35">{siteConfig.location}</p>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs">
            <a
              href={`mailto:${siteConfig.email}`}
              className="text-white/45 transition-colors hover:text-white/75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              {siteConfig.email}
            </a>
            <span aria-hidden="true" className="text-white/20">
              ·
            </span>
            <a
              href={siteConfig.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/45 transition-colors hover:text-white/75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              {siteConfig.whatsappDisplay}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
