import type { ReactNode } from "react";

export function MarketingPageHero({
  eyebrow,
  title,
  children,
}: {
  children: ReactNode;
  eyebrow: string;
  title: string;
}) {
  return (
    <section className="bg-overlay px-4 pb-20 pt-32 text-white sm:pb-24 sm:pt-36">
      <div className="mx-auto max-w-4xl">
        <p className="mb-5 font-heading text-xs font-medium uppercase tracking-[0.22em] text-accent">
          {eyebrow}
        </p>
        <h1 className="max-w-3xl font-heading text-4xl font-medium leading-[1.08] tracking-tight sm:text-6xl">
          {title}
        </h1>
        <div className="mt-6 max-w-2xl text-base leading-relaxed text-white/60 sm:text-lg">
          {children}
        </div>
      </div>
    </section>
  );
}
