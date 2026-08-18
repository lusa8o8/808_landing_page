import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { MarketingPageHero } from "@/components/marketing-page-hero";
import { getPublishedService, publishedServices } from "@/content/marketing";

type ServicePageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return publishedServices.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = getPublishedService(slug);

  if (!service) {
    return {};
  }

  return {
    title: service.label,
    description: service.description,
    alternates: {
      canonical: `/services/${service.slug}`,
    },
  };
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = getPublishedService(slug);

  if (!service) {
    notFound();
  }

  return (
    <main>
      <MarketingPageHero eyebrow="What we build" title={service.label}>
        {service.intro}
      </MarketingPageHero>

      <section className="bg-background px-4 py-20 sm:py-24">
        <div className="mx-auto max-w-5xl">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
          >
            <ArrowLeft aria-hidden="true" className="size-4" />
            All services
          </Link>

          <div className="mt-10 rounded-xl border border-primary/12 bg-primary/5 p-6 sm:p-8">
            <p className="font-heading text-xs font-medium uppercase tracking-[0.18em] text-primary">
              Best suited to
            </p>
            <p className="mt-3 max-w-3xl text-base leading-relaxed text-foreground">
              {service.bestFor}
            </p>
          </div>

          <div className="mt-16 grid gap-12 lg:grid-cols-2 lg:gap-16">
            <section aria-labelledby="outcomes-heading">
              <p className="font-heading text-xs font-medium uppercase tracking-[0.18em] text-accent">
                Customer outcomes
              </p>
              <h2 id="outcomes-heading" className="mt-3 font-heading text-3xl font-medium">
                What should become clearer
              </h2>
              <ul className="mt-7 space-y-4">
                {service.outcomes.map((outcome) => (
                  <li key={outcome} className="flex gap-3 text-sm leading-relaxed text-foreground">
                    <Check aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-accent" />
                    {outcome}
                  </li>
                ))}
              </ul>
            </section>

            <section aria-labelledby="scope-heading">
              <p className="font-heading text-xs font-medium uppercase tracking-[0.18em] text-accent">
                Typical scope
              </p>
              <h2 id="scope-heading" className="mt-3 font-heading text-3xl font-medium">
                What the build can include
              </h2>
              <ul className="mt-7 space-y-4">
                {service.deliverables.map((deliverable) => (
                  <li
                    key={deliverable}
                    className="flex gap-3 text-sm leading-relaxed text-foreground"
                  >
                    <Check aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-primary" />
                    {deliverable}
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </section>

      <section className="bg-overlay px-4 py-20 text-white sm:py-24">
        <div className="mx-auto grid max-w-5xl gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <p className="font-heading text-xs font-medium uppercase tracking-[0.18em] text-accent">
              Clear boundaries
            </p>
            <h2 className="mt-3 font-heading text-3xl font-medium">Scope without surprises</h2>
            <p className="mt-5 text-sm leading-relaxed text-white/55">
              The right system depends on your workflow. These boundaries keep the public promise
              accurate before a detailed scope is agreed.
            </p>
          </div>
          <ul className="space-y-4">
            {service.boundaries.map((boundary) => (
              <li
                key={boundary}
                className="rounded-lg border border-white/10 bg-white/5 p-5 text-sm leading-relaxed text-white/75"
              >
                {boundary}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-background px-4 py-20 sm:py-24">
        <div className="mx-auto max-w-3xl">
          <p className="text-center font-heading text-xs font-medium uppercase tracking-[0.18em] text-primary">
            Common questions
          </p>
          <h2 className="mt-3 text-center font-heading text-3xl font-medium">
            Before we define the scope
          </h2>
          <div className="mt-9 divide-y divide-black/8 border-y border-black/8">
            {service.faqs.map((faq) => (
              <details key={faq.question} className="group py-5">
                <summary className="cursor-pointer list-none pr-8 font-heading text-base font-medium marker:hidden [&::-webkit-details-marker]:hidden">
                  {faq.question}
                </summary>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/calculator"
              className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              Run your numbers
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
