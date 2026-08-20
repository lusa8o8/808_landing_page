import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { MarketingPageHero } from "@/components/marketing-page-hero";
import { ServiceIcon } from "@/components/service-icon";
import { publishedServices } from "@/content/marketing";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Booking, local discovery, and service information systems for service businesses in Lusaka.",
  alternates: {
    canonical: "/services",
  },
};

export default function ServicesPage() {
  return (
    <main>
      <MarketingPageHero eyebrow="Services" title="Practical systems for the customer journey.">
        We focus on the points where a customer needs to find you, understand the offer, and take
        the next step without unnecessary friction.
      </MarketingPageHero>

      <section className="bg-background px-4 py-20 sm:py-24">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-5 md:grid-cols-3">
            {publishedServices.map((service) => (
              <article
                key={service.slug}
                className="flex flex-col rounded-xl border border-black/8 bg-white/55 p-7"
              >
                <div className="mb-6 flex size-10 items-center justify-center rounded-lg bg-primary text-white">
                  <ServiceIcon slug={service.slug} className="size-5" />
                </div>
                <h2 className="font-heading text-xl font-medium text-foreground">
                  {service.label}
                </h2>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {service.description}
                </p>
                <Link
                  href={`/services/${service.slug}`}
                  className="mt-7 inline-flex items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-accent-strong focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
                >
                  Explore this service
                  <ArrowRight aria-hidden="true" className="size-4" />
                </Link>
              </article>
            ))}
          </div>

          <div className="mt-16 rounded-xl bg-primary px-6 py-10 text-center text-white sm:px-10">
            <h2 className="font-heading text-2xl font-medium sm:text-3xl">
              Start with the economics, not a feature list.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-white/60 sm:text-base">
              Use the calculator to estimate what one returning customer is worth before deciding
              which system deserves attention first.
            </p>
            <Link
              href="/calculator"
              className="mt-7 inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 text-sm font-medium text-primary transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Calculate annual client value
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
