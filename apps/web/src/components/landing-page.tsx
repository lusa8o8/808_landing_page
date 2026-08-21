import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { LtvChat } from "@/components/ltv-chat";
import { ServiceIcon } from "@/components/service-icon";
import { SnapbookDemo } from "@/components/snapbook-demo";
import { marketingServices, processSteps } from "@/content/marketing";

const customerPath = [
  {
    number: "01",
    heading: "Be found",
    body: "Show the right services, hours, location and contact details when nearby customers search.",
  },
  {
    number: "02",
    heading: "Be understood",
    body: "Put your services, prices or quote process, and location in one easy place.",
  },
  {
    number: "03",
    heading: "Be contacted or booked",
    body: "Let customers book, call or message you without hunting through old posts.",
  },
] as const;

const homepageServiceOrder = [
  "service-and-pricing-pages",
  "booking-systems",
  "local-search-and-maps",
] as const;

const homepageServices = homepageServiceOrder.map((slug) => {
  const service = marketingServices.find((candidate) => candidate.slug === slug);

  if (!service) {
    throw new Error(`Missing homepage service: ${slug}`);
  }

  return service;
});

function SectionLabel({ children }: { children: string }) {
  return (
    <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-primary">
      {children}
    </p>
  );
}

function HeroSection() {
  return (
    <section
      id="calculator"
      className="hero relative flex min-h-screen scroll-mt-16 flex-col items-center justify-center overflow-hidden bg-overlay px-4 py-24"
    >
      <div className="hero-grid absolute inset-0" aria-hidden="true" />
      <div className="hero-scrim absolute inset-0" aria-hidden="true" />

      <div className="relative z-10 mx-auto flex w-full max-w-2xl flex-col items-center gap-8 sm:gap-10">
        <p className="font-heading text-xs font-medium uppercase tracking-[0.25em] text-white/60">
          808 Digital Systems · Lusaka
        </p>

        <div className="mb-2 space-y-4 text-center">
          <h1 className="font-heading text-4xl font-medium leading-[1.1] tracking-tight text-white sm:text-[52px]">
            What is one client really worth to you?
          </h1>
          <p className="mx-auto max-w-sm text-base leading-relaxed text-white/60 sm:text-lg">
            Describe your business in plain language. We’ll do the math.
          </p>
        </div>

        <div className="mx-auto w-full max-w-2xl">
          <LtvChat />
          <p className="mt-4 text-center text-xs leading-relaxed text-white/45">
            Answer three short questions to estimate what one returning client is worth each year.
          </p>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-30" aria-hidden="true">
        <div className="scroll-cue mx-auto h-10 w-px bg-white" />
      </div>
    </section>
  );
}

function CustomerPathSection() {
  return (
    <section className="bg-background px-4 py-24">
      <div className="mx-auto max-w-4xl">
        <div className="mx-auto mb-14 max-w-2xl space-y-5 text-center">
          <SectionLabel>How customers reach you</SectionLabel>
          <h2 className="font-heading text-3xl font-medium leading-[1.12] tracking-tight text-foreground sm:text-[44px]">
            Make it easy for customers to find you, understand your services and get in touch.
          </h2>
          <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
            Your website should answer the questions customers ask before they call, message or
            book.
          </p>
        </div>

        <ol className="grid list-none overflow-hidden rounded-xl border border-black/8 p-0 sm:grid-cols-3">
          {customerPath.map((step) => (
            <li
              key={step.number}
              className="border-b border-black/8 p-7 last:border-b-0 sm:border-r sm:border-b-0 sm:last:border-r-0"
            >
              <p className="mb-8 font-heading text-xs font-medium tracking-[0.16em] text-accent-strong">
                {step.number}
              </p>
              <h3 className="mb-3 font-heading text-lg font-medium text-foreground">
                {step.heading}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function ServicesSection() {
  return (
    <section id="services" className="scroll-mt-16 bg-background px-4 py-24">
      <div className="mx-auto max-w-4xl">
        <div className="mx-auto mb-12 max-w-2xl space-y-4 text-center">
          <SectionLabel>The 808 website</SectionLabel>
          <h2 className="font-heading text-3xl font-medium leading-tight tracking-tight text-foreground sm:text-4xl">
            One website that shows customers what you offer and what to do next.
          </h2>
          <p className="text-base leading-relaxed text-muted-foreground">
            Website projects start at K12,000. Every 808 website includes SnapBook, hosting and
            routine maintenance for the first 365 days at no additional cost.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {homepageServices.map(({ slug, label, description }, index) => (
            <article
              key={slug}
              className={`flex flex-col rounded-xl border border-black/8 p-8 ${
                index === 0
                  ? "bg-primary text-white sm:col-span-2 sm:grid sm:grid-cols-[1fr_auto] sm:items-end sm:gap-10"
                  : "bg-background"
              }`}
            >
              <div>
                <div
                  className={`mb-6 flex size-9 items-center justify-center rounded-lg ${
                    index === 0 ? "bg-white/10 text-white" : "bg-primary text-white"
                  }`}
                >
                  <ServiceIcon slug={slug} className="size-5" />
                </div>
                {index === 0 ? (
                  <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.18em] text-white/55">
                    Core offer
                  </p>
                ) : null}
                <h3
                  className={`mb-2 font-heading font-medium ${
                    index === 0 ? "text-xl text-white" : "text-[15px] text-foreground"
                  }`}
                >
                  {label}
                </h3>
                <p
                  className={`max-w-xl text-sm leading-relaxed ${
                    index === 0 ? "text-white/65" : "text-muted-foreground"
                  }`}
                >
                  {description}
                </p>
              </div>
              <Link
                href={`/services/${slug}`}
                className={`mt-5 inline-flex items-center gap-2 self-start text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 ${
                  index === 0
                    ? "text-white hover:text-white/75 focus-visible:outline-white"
                    : "text-primary hover:text-accent-strong focus-visible:outline-primary"
                }`}
              >
                Learn more
                <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function GroundingSection() {
  return (
    <section className="bg-overlay px-4 py-16 text-white">
      <div className="mx-auto max-w-4xl">
        <ul className="grid list-none gap-8 p-0 text-center sm:grid-cols-3 sm:gap-0">
          <li className="sm:border-r sm:border-white/10 sm:px-6">
            <p className="font-heading text-base font-medium">Based in Lusaka</p>
            <p className="mt-2 text-sm text-white/45">Built with local service businesses in mind.</p>
          </li>
          <li className="sm:border-r sm:border-white/10 sm:px-6">
            <p className="font-heading text-base font-medium">Numbers in Kwacha</p>
            <p className="mt-2 text-sm text-white/45">Prices and estimates in Kwacha.</p>
          </li>
          <li className="sm:px-6">
            <p className="font-heading text-base font-medium">Direct on WhatsApp</p>
            <p className="mt-2 text-sm text-white/45">Message us directly when you are ready.</p>
          </li>
        </ul>
      </div>
    </section>
  );
}

function ProcessSection() {
  return (
    <section className="bg-background px-4 py-24">
      <div className="mx-auto max-w-4xl">
        <div className="mb-16 text-center">
          <SectionLabel>How it works</SectionLabel>
        </div>
        <ol className="grid list-none gap-10 p-0 sm:grid-cols-3 sm:gap-8">
          {processSteps.map((step) => (
            <li key={step.number} className="space-y-4">
              <p className="font-heading text-5xl font-medium leading-none text-primary/12">
                {step.number}
              </p>
              <h3 className="font-heading text-[15px] font-medium text-foreground">{step.heading}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function LandingPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <HeroSection />
      <CustomerPathSection />
      <ServicesSection />
      <SnapbookDemo />
      <GroundingSection />
      <ProcessSection />
    </main>
  );
}
