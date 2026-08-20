"use client";

import {
  ArrowLeft,
  CalendarDays,
  Check,
  ChevronRight,
  Clock3,
  MapPin,
  RefreshCw,
  Scissors,
  Sparkles,
} from "lucide-react";
import { type CSSProperties, useState } from "react";

type DemoScreen = "services" | "times" | "review" | "confirmed" | "returning" | "reschedule";

type DemoService = {
  id: string;
  name: string;
  duration: string;
  price: number;
  note: string;
};

type DemoSlot = {
  id: string;
  day: string;
  time: string;
};

type DemoStyle = CSSProperties & {
  "--snap-accent": string;
  "--snap-signal": string;
  "--snap-surface": string;
};

const demoBusiness = {
  name: "Studio 808",
  location: "Illustrative Lusaka salon",
  provider: "Maya",
  theme: {
    "--snap-accent": "#1f4e5f",
    "--snap-signal": "#d9622b",
    "--snap-surface": "#faf7f2",
  } as DemoStyle,
  services: [
    {
      id: "cut-finish",
      name: "Cut and finish",
      duration: "45 min",
      price: 180,
      note: "A complete cut and finish appointment",
    },
    {
      id: "shape-up",
      name: "Shape-up",
      duration: "20 min",
      price: 90,
      note: "A short maintenance appointment",
    },
    {
      id: "colour-consult",
      name: "Colour consultation",
      duration: "60 min",
      price: 250,
      note: "Consultation and service planning",
    },
  ] satisfies DemoService[],
  slots: [
    { id: "today-1430", day: "Today", time: "2:30 pm" },
    { id: "tomorrow-1000", day: "Tomorrow", time: "10:00 am" },
    { id: "thursday-1400", day: "Thursday", time: "2:00 pm" },
  ] satisfies DemoSlot[],
  moveSlots: [
    { id: "move-today-1700", day: "Today", time: "5:00 pm" },
    { id: "move-tomorrow-1400", day: "Tomorrow", time: "2:00 pm" },
    { id: "move-friday-1100", day: "Friday", time: "11:00 am" },
  ] satisfies DemoSlot[],
} as const;

const screenLabels: Record<DemoScreen, string> = {
  services: "Choose a service",
  times: "Choose a time",
  review: "Review",
  confirmed: "Demo complete",
  returning: "Returning customer",
  reschedule: "Move an appointment",
};

function formatKwacha(value: number) {
  return `K ${value.toLocaleString("en-ZM")}`;
}

function BackButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 text-xs font-medium text-foreground/55 transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--snap-accent)]"
    >
      <ArrowLeft aria-hidden="true" className="size-4" />
      {label}
    </button>
  );
}

function PrimaryButton({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--snap-signal)] px-5 py-3.5 text-sm font-medium text-white transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--snap-signal)] active:opacity-75"
    >
      {children}
    </button>
  );
}

export function SnapbookDemo() {
  const [screen, setScreen] = useState<DemoScreen>("services");
  const [service, setService] = useState<DemoService>(demoBusiness.services[0]);
  const [slot, setSlot] = useState<DemoSlot>(demoBusiness.slots[0]);
  const [moveSlot, setMoveSlot] = useState<DemoSlot>(demoBusiness.moveSlots[0]);
  const [upcomingSlot, setUpcomingSlot] = useState<DemoSlot>(demoBusiness.slots[1]);
  const [statusMessage, setStatusMessage] = useState("");

  function resetDemo() {
    setService(demoBusiness.services[0]);
    setSlot(demoBusiness.slots[0]);
    setMoveSlot(demoBusiness.moveSlots[0]);
    setUpcomingSlot(demoBusiness.slots[1]);
    setStatusMessage("");
    setScreen("services");
  }

  function confirmMove() {
    setUpcomingSlot(moveSlot);
    setStatusMessage(`Demo appointment moved to ${moveSlot.day} at ${moveSlot.time}.`);
    setScreen("returning");
  }

  function bookUsual() {
    setService(demoBusiness.services[0]);
    setSlot(demoBusiness.slots[2]);
    setStatusMessage("");
    setScreen("confirmed");
  }

  return (
    <section id="booking-demo" className="border-t border-black/8 bg-background px-4 py-24">
      <div className="mx-auto grid max-w-5xl items-center gap-14 lg:grid-cols-[minmax(0,1fr)_420px]">
        <div className="max-w-xl space-y-7">
          <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-primary">
            Product preview
          </p>
          <h2 className="font-heading text-3xl font-medium leading-[1.12] tracking-tight text-foreground sm:text-[44px]">
            See the path from interest to appointment.
          </h2>
          <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
            Walk through a fictional salon example, then preview the repeat-booking and rescheduling
            experience. Nothing is submitted, stored, or booked.
          </p>
          <ul className="space-y-4 text-sm text-foreground/75">
            <li className="flex gap-3">
              <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-accent" />
              One clear service and time-selection path
            </li>
            <li className="flex gap-3">
              <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-accent" />
              A reusable return experience for repeat customers
            </li>
            <li className="flex gap-3">
              <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-accent" />
              Client branding without redesigning the workflow
            </li>
          </ul>
        </div>

        <article
          aria-label="Interactive SnapBook booking demonstration"
          className="mx-auto w-full max-w-[420px] overflow-hidden rounded-[28px] border border-black/10 bg-white shadow-[0_24px_70px_rgba(31,78,95,0.16)]"
          style={demoBusiness.theme}
        >
          <header className="flex items-center justify-between border-b border-black/7 bg-[var(--snap-surface)] px-5 py-4">
            <div>
              <p className="font-heading text-sm font-medium text-foreground">{demoBusiness.name}</p>
              <p className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground">
                <MapPin aria-hidden="true" className="size-3" />
                {demoBusiness.location}
              </p>
            </div>
            <span className="rounded-full bg-[var(--snap-accent)]/8 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.12em] text-[var(--snap-accent)]">
              Demo
            </span>
          </header>

          <div className="flex min-h-[590px] flex-col bg-[var(--snap-surface)] p-5 sm:p-6">
            <div className="mb-6 flex items-center justify-between gap-4">
              <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                {screenLabels[screen]}
              </p>
              <button
                type="button"
                onClick={resetDemo}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--snap-accent)] hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[var(--snap-accent)]"
              >
                <RefreshCw aria-hidden="true" className="size-3.5" />
                Reset
              </button>
            </div>

            {screen === "services" ? (
              <div className="flex flex-1 flex-col">
                <div className="mb-6">
                  <p className="text-sm text-muted-foreground">Book an appointment</p>
                  <h3 className="mt-2 font-heading text-3xl font-medium leading-tight text-foreground">
                    What do you need?
                  </h3>
                </div>
                <div className="space-y-3">
                  {demoBusiness.services.map((candidate) => (
                    <button
                      key={candidate.id}
                      type="button"
                      onClick={() => {
                        setService(candidate);
                        setScreen("times");
                      }}
                      className="group flex w-full items-center gap-3 rounded-xl border border-black/8 bg-white p-4 text-left transition-colors hover:border-[var(--snap-accent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--snap-accent)]"
                    >
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[var(--snap-accent)]/8 text-[var(--snap-accent)]">
                        <Scissors aria-hidden="true" className="size-5" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-medium text-foreground">{candidate.name}</span>
                        <span className="mt-1 block text-xs text-muted-foreground">
                          {candidate.duration} · {formatKwacha(candidate.price)}
                        </span>
                      </span>
                      <ChevronRight
                        aria-hidden="true"
                        className="size-4 text-foreground/25 transition-transform group-hover:translate-x-0.5"
                      />
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            {screen === "times" ? (
              <div className="flex flex-1 flex-col">
                <BackButton label="Services" onClick={() => setScreen("services")} />
                <div className="mt-7">
                  <h3 className="font-heading text-3xl font-medium text-foreground">Choose a demo time</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Fictional options for {service.name.toLowerCase()}
                  </p>
                </div>
                <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {demoBusiness.slots.map((candidate) => {
                    const selected = candidate.id === slot.id;
                    return (
                      <button
                        key={candidate.id}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => setSlot(candidate)}
                        className={`rounded-xl border p-4 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--snap-accent)] ${
                          selected
                            ? "border-[var(--snap-accent)] bg-[var(--snap-accent)] text-white"
                            : "border-black/8 bg-white text-foreground hover:border-[var(--snap-accent)]"
                        }`}
                      >
                        <span className={`block text-[11px] ${selected ? "text-white/65" : "text-muted-foreground"}`}>
                          {candidate.day}
                        </span>
                        <span className="mt-2 block text-sm font-medium">{candidate.time}</span>
                      </button>
                    );
                  })}
                </div>
                <div className="mt-5 flex items-center gap-3 rounded-xl border border-black/8 bg-white p-4">
                  <span className="flex size-9 items-center justify-center rounded-full bg-[var(--snap-accent)] text-xs font-medium text-white">
                    M
                  </span>
                  <span>
                    <span className="block text-sm font-medium text-foreground">{demoBusiness.provider}</span>
                    <span className="mt-0.5 block text-xs text-muted-foreground">Demo provider</span>
                  </span>
                </div>
                <div className="mt-auto pt-8">
                  <PrimaryButton onClick={() => setScreen("review")}>Continue</PrimaryButton>
                </div>
              </div>
            ) : null}

            {screen === "review" ? (
              <div className="flex flex-1 flex-col">
                <BackButton label="Times" onClick={() => setScreen("times")} />
                <div className="mt-7">
                  <h3 className="font-heading text-3xl font-medium text-foreground">Review the flow</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    A live setup would request only the client-approved contact details needed to
                    confirm this service. This demo skips them entirely.
                  </p>
                </div>
                <div className="mt-7 overflow-hidden rounded-2xl border border-black/8 bg-white">
                  <div className="flex items-center gap-4 p-5">
                    <span className="flex size-11 items-center justify-center rounded-xl bg-[var(--snap-accent)] text-white">
                      <Sparkles aria-hidden="true" className="size-5" />
                    </span>
                    <div>
                      <p className="text-sm font-medium text-foreground">{service.name}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {slot.day}, {slot.time} · {service.duration}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">with {demoBusiness.provider}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between border-t border-black/7 px-5 py-4 text-sm">
                    <span className="text-muted-foreground">Illustrative price</span>
                    <span className="font-medium text-foreground">{formatKwacha(service.price)}</span>
                  </div>
                </div>
                <div className="mt-auto pt-8">
                  <PrimaryButton onClick={() => setScreen("confirmed")}>Preview confirmation</PrimaryButton>
                </div>
              </div>
            ) : null}

            {screen === "confirmed" ? (
              <div className="flex flex-1 flex-col text-center" role="status">
                <div className="mx-auto mt-5 flex size-16 items-center justify-center rounded-full bg-[var(--snap-accent)] text-white">
                  <Check aria-hidden="true" className="size-7" strokeWidth={2.5} />
                </div>
                <h3 className="mt-5 font-heading text-3xl font-medium text-foreground">Preview complete.</h3>
                <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
                  No appointment was created and no reminder will be sent.
                </p>
                <div className="mt-7 rounded-2xl bg-[var(--snap-accent)] p-5 text-left text-white">
                  <p className="text-xs uppercase tracking-[0.14em] text-white/55">Demo summary</p>
                  <p className="mt-4 font-heading text-xl font-medium">{service.name}</p>
                  <div className="mt-4 flex items-center gap-2 text-sm text-white/70">
                    <CalendarDays aria-hidden="true" className="size-4" />
                    {slot.day}, {slot.time}
                  </div>
                  <div className="mt-2 flex items-center gap-2 text-sm text-white/70">
                    <Clock3 aria-hidden="true" className="size-4" />
                    {service.duration} with {demoBusiness.provider}
                  </div>
                </div>
                <div className="mt-auto space-y-3 pt-8">
                  <PrimaryButton onClick={() => setScreen("returning")}>
                    Preview a return visit
                    <ChevronRight aria-hidden="true" className="size-4" />
                  </PrimaryButton>
                  <button
                    type="button"
                    onClick={resetDemo}
                    className="w-full rounded-xl px-5 py-3 text-sm font-medium text-[var(--snap-accent)] hover:bg-black/4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--snap-accent)]"
                  >
                    Start again
                  </button>
                </div>
              </div>
            ) : null}

            {screen === "returning" ? (
              <div className="flex flex-1 flex-col">
                <div>
                  <p className="text-sm text-muted-foreground">Welcome back</p>
                  <h3 className="mt-2 font-heading text-3xl font-medium text-foreground">Your next visit</h3>
                </div>
                <p className="sr-only" aria-live="polite">
                  {statusMessage}
                </p>
                {statusMessage ? (
                  <p className="mt-5 rounded-xl border border-[var(--snap-accent)]/15 bg-[var(--snap-accent)]/7 p-3 text-sm text-[var(--snap-accent)]">
                    {statusMessage}
                  </p>
                ) : null}
                <div className="mt-6 rounded-2xl bg-[var(--snap-accent)] p-5 text-white">
                  <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-white/55">Your usual</p>
                  <p className="mt-4 font-heading text-xl font-medium">Cut and finish</p>
                  <p className="mt-2 text-sm text-white/65">Thursday, 2:00 pm · with Maya</p>
                  <button
                    type="button"
                    onClick={bookUsual}
                    className="mt-5 w-full rounded-xl bg-[var(--snap-signal)] px-4 py-3 text-sm font-medium text-white hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  >
                    Preview book again
                  </button>
                </div>
                <div className="mt-5 rounded-2xl border border-black/8 bg-white p-5">
                  <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">Upcoming demo</p>
                  <div className="mt-4 flex items-center gap-3">
                    <span className="flex size-10 items-center justify-center rounded-xl bg-[var(--snap-accent)]/8 text-[var(--snap-accent)]">
                      <CalendarDays aria-hidden="true" className="size-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-foreground">Shape-up</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {upcomingSlot.day}, {upcomingSlot.time}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setStatusMessage("");
                        setScreen("reschedule");
                      }}
                      className="text-xs font-medium text-[var(--snap-accent)] hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[var(--snap-accent)]"
                    >
                      Move
                    </button>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setScreen("services")}
                  className="mt-auto flex w-full items-center justify-center gap-2 pt-8 text-sm font-medium text-[var(--snap-accent)] hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[var(--snap-accent)]"
                >
                  Choose something else
                  <ChevronRight aria-hidden="true" className="size-4" />
                </button>
              </div>
            ) : null}

            {screen === "reschedule" ? (
              <div className="flex flex-1 flex-col">
                <BackButton label="Upcoming" onClick={() => setScreen("returning")} />
                <div className="mt-7">
                  <h3 className="font-heading text-3xl font-medium text-foreground">Move the demo</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Current fixture: {upcomingSlot.day}, {upcomingSlot.time}
                  </p>
                </div>
                <div className="mt-6 space-y-3">
                  {demoBusiness.moveSlots.map((candidate) => {
                    const selected = candidate.id === moveSlot.id;
                    return (
                      <button
                        key={candidate.id}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => setMoveSlot(candidate)}
                        className={`flex w-full items-center justify-between rounded-xl border p-4 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--snap-accent)] ${
                          selected
                            ? "border-[var(--snap-accent)] bg-[var(--snap-accent)] text-white"
                            : "border-black/8 bg-white text-foreground hover:border-[var(--snap-accent)]"
                        }`}
                      >
                        <span>
                          <span className="block text-sm font-medium">{candidate.day}</span>
                          <span className={`mt-1 block text-xs ${selected ? "text-white/65" : "text-muted-foreground"}`}>
                            {candidate.time} · demo option
                          </span>
                        </span>
                        {selected ? <Check aria-hidden="true" className="size-4" /> : null}
                      </button>
                    );
                  })}
                </div>
                <div className="mt-auto space-y-3 pt-8">
                  <PrimaryButton onClick={confirmMove}>Preview move</PrimaryButton>
                  <button
                    type="button"
                    onClick={() => setScreen("returning")}
                    className="w-full rounded-xl px-5 py-3 text-sm font-medium text-foreground/55 hover:bg-black/4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--snap-accent)]"
                  >
                    Keep original
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </article>
      </div>
    </section>
  );
}
