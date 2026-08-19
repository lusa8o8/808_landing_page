import { useState, useRef, useEffect } from "react";
import { Calendar, MapPin, List, ArrowRight, Send, Plus, ArrowUp } from "lucide-react";

// ── Brand constants ───────────────────────────────────────────────────────────
const P = "#1F4E5F";   // primary teal
const A = "#D9622B";   // accent orange (single CTA color — use sparingly)
const OV = "rgba(18, 25, 28, 0.78)"; // dark overlay for hero

// ── Mosaic imagery ────────────────────────────────────────────────────────────
// PLACEHOLDER: Replace all images with real client photography once available.
// Unsplash IDs below represent Lusaka business categories 808 Digital Systems serves.
const imgUrl = (id: string, w = 800, h = 600) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&auto=format`;

const MOSAIC = [
  { id: "1616391182219-e080b4d1043a", alt: "Dental clinic treatment chair interior", cs: 2, rs: 2 }, // PLACEHOLDER: dental/medical clinic
  { id: "1719749938395-0fa460e8d3f7", alt: "Boutique guesthouse bedroom with four-poster bed", cs: 1, rs: 1 }, // PLACEHOLDER: guesthouse/lodge
  { id: "1521590832167-7bcbfaa6381f", alt: "Hair salon interior", cs: 1, rs: 2 }, // PLACEHOLDER: salon
  { id: "1632215861513-130b66fe97f4", alt: "School teacher with students in Africa", cs: 1, rs: 1 }, // PLACEHOLDER: school
  { id: "1767938072127-d66be4b9d74d", alt: "Small business storefront at sunset", cs: 2, rs: 1 }, // PLACEHOLDER: general storefront
  { id: "1499750310107-5fef28a66643", alt: "Professional law firm office workspace", cs: 2, rs: 1 }, // PLACEHOLDER: law/professional office
];

// ── LTV calculator ────────────────────────────────────────────────────────────

interface ParsedLTV {
  businessType: string;
  avgValue: number;
  visitsPerYear: number;
  total: number;
  salesPitch?: string;
  isCalculation?: boolean;
}

async function fetchAnthropicLTV(message: string, history: Msg[]): Promise<ParsedLTV> {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_FUNCTION_URL || "http://localhost:54321/functions/v1/ltv-agent";
  
  const res = await fetch(supabaseUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, history })
  });

  if (!res.ok) {
    let errText = "Unknown Error";
    try {
      const errJson = await res.json();
      errText = errJson.error || await res.text();
    } catch (e) {
      errText = await res.text();
    }
    throw new Error(`API Error ${res.status}: ${errText}`);
  }

  return res.json();
}

function fmtK(n: number) {
  return "K " + n.toLocaleString("en-ZM");
}

// ── Chat types ────────────────────────────────────────────────────────────────

type Msg =
  | { kind: "bot"; text: string }
  | { kind: "user"; text: string }
  | { kind: "result"; data: ParsedLTV };

interface LTVChatProps {
  msgs: Msg[];
  setMsgs: React.Dispatch<React.SetStateAction<Msg[]>>;
}

function LTVChat({ msgs, setMsgs }: LTVChatProps) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [msgs, loading]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    setMsgs((prev) => [...prev, { kind: "user", text }]);
    setLoading(true);

    try {
      const data = await fetchAnthropicLTV(text, msgs);
      if (data.isCalculation === false) {
        setMsgs((prev) => [
          ...prev,
          { kind: "bot", text: data.salesPitch || "Hello! Tell me a bit about your business, how much you charge, and how often clients return, and I'll calculate their lifetime value." }
        ]);
      } else {
        if (data.salesPitch) {
          setMsgs((prev) => [
            ...prev, 
            { kind: "bot", text: data.salesPitch },
            { kind: "result", data }
          ]);
        } else {
          setMsgs((prev) => [...prev, { kind: "result", data }]);
        }
      }
    } catch (e: any) {
      console.error(e);
      setMsgs((prev) => [...prev, { kind: "bot", text: `I encountered an error: ${e.message}. Did you refresh the page after adding the key?` }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div
        ref={scrollRef}
        className="flex flex-col gap-3 overflow-y-auto max-h-80"
        style={{ scrollbarWidth: "none" }}
      >
        {msgs.map((m, i) => {
          if (m.kind === "bot") {
            return (
              <div key={i} className="flex gap-3 items-start">
                <div
                  className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-white"
                  style={{ background: P, fontSize: "8px", fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "0.02em" }}
                >
                  808
                </div>
                <p className="text-sm leading-relaxed text-white/90 pt-1">{m.text}</p>
              </div>
            );
          }

          if (m.kind === "user") {
            return (
              <div key={i} className="flex justify-end">
                <div
                  className="max-w-[85%] rounded-2xl rounded-tr-sm px-4 py-2.5 text-sm text-white leading-relaxed"
                  style={{ background: P }}
                >
                  {m.text}
                </div>
              </div>
            );
          }

          if (m.kind === "result") {
            const d = m.data;
            // TODO: replace +260977000000 with the real 808 Digital Systems WhatsApp number
            const waText = `Hi 808 Digital Systems — I run a ${d.businessType} and my estimated annual client value is ${fmtK(d.total)}. I'd love to talk about capturing this.`;
            const waLink = `https://wa.me/260977000000?text=${encodeURIComponent(waText)}`;

            return (
              <div
                key={i}
                className="rounded-xl border p-4 space-y-4 shadow-lg text-left"
                style={{ borderColor: "rgba(0, 0, 0, 0.08)", background: "rgba(255, 255, 255, 0.95)" }}
              >
                <p
                  className="text-xs font-semibold uppercase tracking-widest"
                  style={{ color: P }}
                >
                  {d.businessType}
                </p>

                <div className="grid grid-cols-2 gap-3 text-center">
                  {[
                    { label: "per visit", value: fmtK(d.avgValue) },
                    { label: "visits / yr", value: `×${d.visitsPerYear}` },
                  ].map((item) => (
                    <div key={item.label}>
                      <p
                        className="text-sm font-semibold"
                        style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#1F4E5F" }}
                      >
                        {item.value}
                      </p>
                      <p className="text-[10px] text-muted-foreground/80 font-medium uppercase tracking-wider mt-0.5">{item.label}</p>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-3 text-center" style={{ borderColor: "rgba(0,0,0,0.08)" }}>
                  <p className="text-[11px] text-muted-foreground mb-1">Annual client value</p>
                  <p
                    className="text-3xl font-medium"
                    style={{ fontFamily: "'Space Grotesk', sans-serif", color: A }}
                  >
                    {fmtK(d.total)}
                  </p>
                </div>

                <a
                  href="#contact"
                  className="flex items-center justify-center gap-2 w-full rounded-lg py-2.5 px-4 text-sm font-medium text-white transition-opacity hover:opacity-90 active:opacity-75"
                  style={{ background: A }}
                >
                  Talk to us about capturing this {fmtK(d.total)} / yr
                  <ArrowRight className="w-4 h-4 flex-shrink-0" />
                </a>

                <p className="text-center">
                  <a
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2 decoration-muted-foreground/40"
                  >
                    Not ready yet? Get this sent to your WhatsApp
                  </a>
                </p>
              </div>
            );
          }
          return null;
        })}

        {loading && (
          <div className="flex gap-3 items-center">
            <div
              className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-white"
              style={{ background: P, fontSize: "8px" }}
            >
              808
            </div>
            <div className="flex gap-1.5">
              {[0, 150, 300].map((delay) => (
                <span
                  key={delay}
                  className="w-2 h-2 rounded-full animate-bounce"
                  style={{ background: P, animationDelay: `${delay}ms` }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <form onSubmit={submit} className="w-full pt-2">
        <div
          className="flex items-center gap-3 border-b-2 pb-2.5 transition-colors focus-within:border-white/80"
          style={{ borderColor: P }}
        >
          <button
            type="button"
            className="p-1 text-white/50 hover:text-white transition-colors"
          >
            <Plus className="w-5 h-5" strokeWidth={1.5} />
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g. I run a dental clinic, patients pay K350 a visit..."
            className="w-full bg-transparent outline-none text-white text-sm sm:text-base placeholder:text-white/40 py-1"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                submit(e as any);
              }
            }}
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="flex items-center justify-center w-8 h-8 rounded-full text-white disabled:opacity-30 transition-all hover:scale-105 active:scale-95 flex-shrink-0"
            style={{ background: P }}
          >
            <ArrowUp className="w-4 h-4" strokeWidth={2} />
          </button>
        </div>
      </form>
    </div>
  );
}

// ── Hero Section ──────────────────────────────────────────────────────────────

function HeroSection() {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 py-24 overflow-hidden">
      {/* Full-bleed mosaic collage */}
      <div
        className="absolute inset-0"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gridTemplateRows: "repeat(3, 1fr)",
          gridAutoFlow: "dense",
          gap: "2px",
        }}
      >
        {MOSAIC.map((tile, i) => (
          <div
            key={i}
            className="overflow-hidden bg-gray-900"
            style={{ gridColumn: `span ${tile.cs}`, gridRow: `span ${tile.rs}` }}
          >
            <img
              src={imgUrl(tile.id)}
              alt={tile.alt}
              className="w-full h-full object-cover"
              style={{ filter: "saturate(0.45) brightness(0.8)" }}
            />
          </div>
        ))}
      </div>

      {/* Dark scrim with conditional transition blur */}
      <div 
        className="absolute inset-0 transition-all duration-700 ease-in-out" 
        style={{ 
          background: msgs.length > 0 ? "rgba(18, 25, 28, 0.82)" : "rgba(18, 25, 28, 0.48)",
          backdropFilter: msgs.length > 0 ? "blur(12px)" : "blur(0px)",
          WebkitBackdropFilter: msgs.length > 0 ? "blur(12px)" : "blur(0px)"
        }} 
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-2xl mx-auto flex flex-col items-center gap-8 sm:gap-10">
        {/* Wordmark */}
        <p
          className="text-white/60 text-xs tracking-[0.25em] uppercase"
          style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500 }}
        >
          808 Digital Systems · Lusaka
        </p>

        {/* Headline */}
        <div className="text-center space-y-4 mb-2">
          <h1
            className="text-4xl sm:text-[52px] text-white leading-[1.1] tracking-tight"
            style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500 }}
          >
            What is one client really worth to you?
          </h1>
          <p className="text-base sm:text-lg text-white/60 max-w-sm mx-auto leading-relaxed">
            Describe your business in plain language. We'll do the math.
          </p>
        </div>

        {/* Floating LTV card */}
        <div className="w-full max-w-2xl mx-auto">
          <LTVChat msgs={msgs} setMsgs={setMsgs} />
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-30">
        <div className="w-px h-10 bg-white mx-auto" style={{ animation: "pulse 2s ease-in-out infinite" }} />
      </div>
    </section>
  );
}

// ── Built to be found ─────────────────────────────────────────────────────────

function BuiltToBeFoundSection() {
  return (
    <section className="px-4 py-24 text-center bg-background">
      <div className="max-w-2xl mx-auto space-y-6">
        <h2
          className="text-3xl sm:text-[44px] text-foreground leading-[1.1] tracking-tight"
          style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500 }}
        >
          Built to be found.
          <br />
          Built to be booked.
        </h2>
        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
          We build booking systems that pay for themselves in your first few
          clients. No flash. Just infrastructure that works.
        </p>
      </div>
    </section>
  );
}

// ── Problem Section ───────────────────────────────────────────────────────────

function ProblemSection() {
  return (
    <section className="px-4 py-24 text-center" style={{ background: "#12191C" }}>
      <div className="max-w-xl mx-auto space-y-5">
        <p
          className="text-[10px] font-medium uppercase tracking-[0.2em]"
          style={{ color: A }}
        >
          The problem
        </p>
        <h2
          className="text-2xl sm:text-[32px] text-white leading-snug"
          style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500 }}
        >
          Right now, someone is searching for a business like yours.
        </h2>
        <p className="text-base text-white/50 leading-relaxed">
          If they land on a Facebook page with no reply, they book your
          competitor instead.
        </p>
      </div>
    </section>
  );
}

// ── What We Build ─────────────────────────────────────────────────────────────

function WhatWeBuildSection() {
  const items = [
    {
      icon: <Calendar className="w-5 h-5" />,
      label: "Booking system",
      desc: "Clients book directly — no DMs, no missed calls, no double-bookings.",
    },
    {
      icon: <MapPin className="w-5 h-5" />,
      label: "Maps & discovery",
      desc: "Your business shows up when people search locally on Google and Maps.",
    },
    {
      icon: <List className="w-5 h-5" />,
      label: "Clear services & pricing",
      desc: "What you offer, what it costs, and how to book. All in one place.",
    },
  ];

  return (
    <section className="px-4 py-24 bg-background">
      <div className="max-w-4xl mx-auto">
        <p
          className="text-[10px] font-medium uppercase tracking-[0.2em] text-center mb-12"
          style={{ color: P }}
        >
          What we build
        </p>
        <div className="grid sm:grid-cols-3 gap-px border rounded-xl overflow-hidden" style={{ borderColor: "rgba(0,0,0,0.08)" }}>
          {items.map((item, i) => (
            <div
              key={item.label}
              className="p-8 bg-background"
              style={{
                borderRight: i < items.length - 1 ? "1px solid rgba(0,0,0,0.08)" : undefined,
              }}
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center mb-6 text-white"
                style={{ background: P }}
              >
                {item.icon}
              </div>
              <h3
                className="text-[15px] mb-2 text-foreground"
                style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500 }}
              >
                {item.label}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Proof ─────────────────────────────────────────────────────────────────────

function ProofSection() {
  return (
    <section className="px-4 py-4 bg-background">
      {/* PLACEHOLDER: Replace stat with a real named client result once available.
          e.g. "Clinic X's average client is now worth 4× what it was, across 18 months." */}
      <div
        className="max-w-2xl mx-auto text-center py-16 border-y"
        style={{ borderColor: "rgba(0,0,0,0.08)" }}
      >
        <p
          className="text-6xl sm:text-7xl font-medium mb-3"
          style={{ fontFamily: "'Space Grotesk', sans-serif", color: A }}
        >
          1–5 clients
        </p>
        <p className="text-base text-muted-foreground">
          is usually all it takes to cover the project cost
        </p>
      </div>
    </section>
  );
}

// ── Who We Work With ──────────────────────────────────────────────────────────

function WhoWeWorkWithSection() {
  const cats = ["Clinics", "Law firms", "Guesthouses", "Salons", "Schools", "Franchises"];

  return (
    <section className="px-4 py-20 bg-background">
      <div className="max-w-3xl mx-auto text-center">
        <p
          className="text-[10px] font-medium uppercase tracking-[0.2em] mb-8"
          style={{ color: P }}
        >
          Who we work with
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          {cats.map((cat) => (
            <span
              key={cat}
              className="px-5 py-2 rounded-full text-sm font-medium border transition-colors"
              style={{
                borderColor: "rgba(31,78,95,0.22)",
                color: P,
                background: "rgba(31,78,95,0.04)",
              }}
            >
              {cat}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── How It Works ──────────────────────────────────────────────────────────────

function HowItWorksSection() {
  const steps = [
    {
      n: "01",
      heading: "We run the numbers with you",
      body: "You tell us about your business. We calculate whether building a system makes financial sense before anything else.",
    },
    {
      n: "02",
      heading: "We build your system",
      body: "A booking page, maps presence, and clear services listing — built for your specific business, not a template.",
    },
    {
      n: "03",
      heading: "You get bookable, findable, done",
      body: "We hand it over fully operational. No mystery, no ongoing maintenance fees you didn't agree to. You own it.",
    },
  ];

  return (
    <section className="px-4 py-24 bg-background">
      <div className="max-w-4xl mx-auto">
        <p
          className="text-[10px] font-medium uppercase tracking-[0.2em] text-center mb-16"
          style={{ color: P }}
        >
          How it works
        </p>
        <div className="grid sm:grid-cols-3 gap-10 sm:gap-8">
          {steps.map((step) => (
            <div key={step.n} className="space-y-4">
              <p
                className="text-5xl font-medium"
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  color: "rgba(31,78,95,0.12)",
                  lineHeight: 1,
                }}
              >
                {step.n}
              </p>
              <h3
                className="text-[15px] text-foreground"
                style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500 }}
              >
                {step.heading}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{step.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Footer / Final CTA ────────────────────────────────────────────────────────

function FooterCTA() {
  return (
    <section id="contact" className="px-4 py-24 text-center" style={{ background: P }}>
      <div className="max-w-lg mx-auto space-y-8">
        <h2
          className="text-2xl sm:text-[32px] text-white leading-snug"
          style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500 }}
        >
          Ready to see if the math works for you?
        </h2>

        {/* TODO: replace with real booking/calendar link once available */}
        <a
          href="https://wa.me/260977000000"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg px-8 py-3.5 text-sm font-medium text-white transition-opacity hover:opacity-90 active:opacity-75"
          style={{ background: A }}
        >
          Book a call
          <ArrowRight className="w-4 h-4" />
        </a>

        {/* Minimal footer */}
        <div
          className="pt-8 border-t space-y-3"
          style={{ borderColor: "rgba(255,255,255,0.1)" }}
        >
          <p
            className="text-white/80 text-xs tracking-[0.2em] uppercase"
            style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500 }}
          >
            808 Digital Systems
          </p>
          <p className="text-white/35 text-xs">Lusaka, Zambia</p>
          <div className="flex items-center justify-center gap-4 text-xs">
            {/* TODO: replace with real contact details */}
            <a
              href="mailto:hello@808digital.co.zm"
              className="text-white/40 hover:text-white/70 transition-colors"
            >
              hello@808digital.co.zm
            </a>
            <span className="text-white/20">·</span>
            <a
              href="https://wa.me/260977000000"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/40 hover:text-white/70 transition-colors"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── App ───────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <div
      className="min-h-screen bg-background text-foreground"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <HeroSection />
      <BuiltToBeFoundSection />
      <ProblemSection />
      <WhatWeBuildSection />
      <ProofSection />
      <WhoWeWorkWithSection />
      <HowItWorksSection />
      <FooterCTA />
    </div>
  );
}
