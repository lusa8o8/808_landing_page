import Image from "next/image";
import { Calendar, List, MapPin, type LucideIcon } from "lucide-react";

import { LtvChat } from "@/components/ltv-chat";
import { audienceLabels, marketingServices, processSteps } from "@/content/marketing";

const mosaic = [
  {
    id: "1616391182219-e080b4d1043a",
    alt: "Dental clinic treatment chair interior",
    columns: 2,
    rows: 2,
  },
  {
    id: "1719749938395-0fa460e8d3f7",
    alt: "Boutique guesthouse bedroom with four-poster bed",
    columns: 1,
    rows: 1,
  },
  {
    id: "1521590832167-7bcbfaa6381f",
    alt: "Hair salon interior",
    columns: 1,
    rows: 2,
  },
  {
    id: "1632215861513-130b66fe97f4",
    alt: "School teacher with students in Africa",
    columns: 1,
    rows: 1,
  },
  {
    id: "1767938072127-d66be4b9d74d",
    alt: "Small business storefront at sunset",
    columns: 2,
    rows: 1,
  },
  {
    id: "1499750310107-5fef28a66643",
    alt: "Professional law firm office workspace",
    columns: 2,
    rows: 1,
  },
] as const;

const serviceIcons: Record<string, LucideIcon> = {
  "booking-systems": Calendar,
  "local-search-and-maps": MapPin,
  "service-and-pricing-pages": List,
};

function SectionLabel({ children, accent = false }: { children: string; accent?: boolean }) {
  return (
    <p
      className={`text-[10px] font-medium uppercase tracking-[0.2em] ${accent ? "text-accent" : "text-primary"}`}
    >
      {children}
    </p>
  );
}

function HeroSection() {
  return (
    <section
      id="calculator"
      className="hero relative flex min-h-screen scroll-mt-16 flex-col items-center justify-center overflow-hidden px-4 py-24"
    >
      <div
        className="absolute inset-0 grid grid-flow-dense grid-cols-4 grid-rows-3 gap-0.5"
        aria-hidden="true"
      >
        {mosaic.map((tile) => (
          <div
            key={tile.id}
            className="relative overflow-hidden bg-gray-900"
            style={{
              gridColumn: `span ${tile.columns}`,
              gridRow: `span ${tile.rows}`,
            }}
          >
            <Image
              src={`https://images.unsplash.com/photo-${tile.id}?w=1200&h=900&fit=crop&auto=format`}
              alt=""
              fill
              loading="eager"
              sizes="(max-width: 640px) 50vw, 50vw"
              className="object-cover saturate-[0.45] brightness-80"
            />
          </div>
        ))}
      </div>

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
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-30" aria-hidden="true">
        <div className="scroll-cue mx-auto h-10 w-px bg-white" />
      </div>
    </section>
  );
}

function BuiltToBeFoundSection() {
  return (
    <section className="bg-background px-4 py-24 text-center">
      <div className="mx-auto max-w-2xl space-y-6">
        <h2 className="font-heading text-3xl font-medium leading-[1.1] tracking-tight text-foreground sm:text-[44px]">
          Built to be found.
          <br />
          Built to be booked.
        </h2>
        <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
          We build booking systems that pay for themselves in your first few clients. No flash.
          Just infrastructure that works.
        </p>
      </div>
    </section>
  );
}

function ProblemSection() {
  return (
    <section className="bg-overlay px-4 py-24 text-center">
      <div className="mx-auto max-w-xl space-y-5">
        <SectionLabel accent>The problem</SectionLabel>
        <h2 className="font-heading text-2xl font-medium leading-snug text-white sm:text-[32px]">
          Right now, someone is searching for a business like yours.
        </h2>
        <p className="text-base leading-relaxed text-white/50">
          If they land on a Facebook page with no reply, they book your competitor instead.
        </p>
      </div>
    </section>
  );
}

function ServicesSection() {
  return (
    <section id="services" className="scroll-mt-16 bg-background px-4 py-24">
      <div className="mx-auto max-w-4xl">
        <div className="mb-12 text-center">
          <SectionLabel>What we build</SectionLabel>
        </div>
        <div className="grid overflow-hidden rounded-xl border border-black/8 sm:grid-cols-3">
          {marketingServices.map(({ slug, label, description }) => {
            const Icon = serviceIcons[slug];

            return (
              <article
                key={slug}
                className="border-b border-black/8 bg-background p-8 last:border-b-0 sm:border-r sm:border-b-0 sm:last:border-r-0"
              >
                <div className="mb-6 flex size-9 items-center justify-center rounded-lg bg-primary text-white">
                  <Icon aria-hidden="true" className="size-5" />
                </div>
                <h3 className="mb-2 font-heading text-[15px] font-medium text-foreground">
                  {label}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ProofSection() {
  return (
    <section className="bg-background px-4 py-4">
      <div className="mx-auto max-w-2xl border-y border-black/8 py-16 text-center">
        <p className="mb-3 font-heading text-5xl font-medium text-accent sm:text-6xl">
          Your numbers
        </p>
        <p className="text-base text-muted-foreground">
          should show whether a new system makes commercial sense for your business
        </p>
      </div>
    </section>
  );
}

function AudienceSection() {
  return (
    <section className="bg-background px-4 py-20">
      <div className="mx-auto max-w-3xl text-center">
        <div className="mb-8">
          <SectionLabel>Who we work with</SectionLabel>
        </div>
        <ul className="flex list-none flex-wrap justify-center gap-3 p-0">
          {audienceLabels.map((audience) => (
            <li
              key={audience}
              className="rounded-full border border-primary/22 bg-primary/4 px-5 py-2 text-sm font-medium text-primary"
            >
              {audience}
            </li>
          ))}
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
      <BuiltToBeFoundSection />
      <ProblemSection />
      <ServicesSection />
      <ProofSection />
      <AudienceSection />
      <ProcessSection />
    </main>
  );
}
