import { Check } from "lucide-react";

export function SnapbookDemo() {
  return (
    <section id="booking-demo" className="border-t border-black/8 bg-background px-4 py-24">
      <div className="mx-auto grid max-w-5xl items-center gap-14 lg:grid-cols-[minmax(0,1fr)_470px]">
        <div className="max-w-xl space-y-7">
          <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-primary">
            SnapBook, included
          </p>
          <h2 className="font-heading text-3xl font-medium leading-[1.12] tracking-tight text-foreground sm:text-[44px]">
            Let customers move from interest to appointment.
          </h2>
          <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
            Stack a few services, choose a time, and preview repeat booking or rescheduling with a
            fictional Lusaka salon. Nothing is submitted, stored or booked.
          </p>
          <ul className="space-y-4 text-sm text-foreground/75">
            <li className="flex gap-3">
              <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-accent-strong" />
              Customers can combine services before choosing a time
            </li>
            <li className="flex gap-3">
              <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-accent-strong" />
              Repeat customers can book again with fewer steps
            </li>
            <li className="flex gap-3">
              <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-accent-strong" />
              Colours, services and provider choices can match the business
            </li>
          </ul>
        </div>

        <div className="mx-auto w-full max-w-[470px] overflow-hidden rounded-[22px] border border-black/10 bg-white shadow-[0_24px_70px_rgba(38,55,45,0.16)]">
          <iframe
            className="block h-[800px] w-full border-0"
            loading="lazy"
            src="/snapbook-preview/studio-808"
            title="Interactive SnapBook booking preview for a fictional Lusaka salon"
          />
        </div>
      </div>
    </section>
  );
}
