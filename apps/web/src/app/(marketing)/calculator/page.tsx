import type { Metadata } from "next";

import { LtvChat } from "@/components/ltv-chat";

export const metadata: Metadata = {
  title: "Annual client value calculator",
  description:
    "Estimate what one returning customer may be worth each year using average spend and repeat visits.",
  alternates: {
    canonical: "/calculator",
  },
};

export default function CalculatorPage() {
  return (
    <main>
      <section className="hero relative flex min-h-screen items-center overflow-hidden bg-overlay px-4 pb-20 pt-32 text-white">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(31,78,95,0.9),transparent_45%),radial-gradient(circle_at_85%_75%,rgba(217,98,43,0.3),transparent_40%)]"
        />
        <div className="hero-scrim absolute inset-0" aria-hidden="true" />

        <div className="relative z-10 mx-auto w-full max-w-2xl text-center">
          <p className="font-heading text-xs font-medium uppercase tracking-[0.22em] text-accent">
            Annual client value
          </p>
          <h1 className="mt-5 font-heading text-4xl font-medium leading-[1.08] tracking-tight sm:text-6xl">
            Start with one customer.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/60 sm:text-lg">
            Tell us what a customer usually spends and how often they return. The calculator will
            estimate what that customer may be worth in one year.
          </p>
          <div className="mt-9 text-left">
            <LtvChat />
          </div>
        </div>
      </section>

      <section className="bg-background px-4 py-20 sm:py-24">
        <div className="mx-auto max-w-4xl">
          <div className="grid gap-10 sm:grid-cols-3 sm:gap-8">
            <article>
              <p className="font-heading text-xs font-medium uppercase tracking-[0.18em] text-primary">
                01 · The inputs
              </p>
              <h2 className="mt-3 font-heading text-xl font-medium">Spend and repeat visits</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Use a realistic average amount per visit and the number of visits a typical customer
                makes in one year.
              </p>
            </article>
            <article>
              <p className="font-heading text-xs font-medium uppercase tracking-[0.18em] text-primary">
                02 · The calculation
              </p>
              <h2 className="mt-3 font-heading text-xl font-medium">
                Average spend × visits per year
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                The calculator multiplies the average amount spent on each visit by the number of
                visits in one year.
              </p>
            </article>
            <article>
              <p className="font-heading text-xs font-medium uppercase tracking-[0.18em] text-primary">
                03 · The decision
              </p>
              <h2 className="mt-3 font-heading text-xl font-medium">
                An estimate, not promised revenue
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Use the result to see what one returning customer may be worth. It does not tell you
                how many customers a website will bring.
              </p>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}
