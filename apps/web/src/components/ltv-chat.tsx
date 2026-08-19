"use client";

import { ArrowRight, ArrowUp, Plus } from "lucide-react";
import Link from "next/link";
import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";

import { siteConfig } from "@/content/site";
import {
  isDuplicateResult,
  requestLtvEstimate,
  type LtvEstimate,
  type LtvMessage,
} from "@/lib/ltv-api";

const DEFAULT_REPLY =
  "Tell me about your business, what a customer spends, and how often they return, and I’ll calculate their annual value.";

function formatKwacha(value: number) {
  return `K ${value.toLocaleString("en-ZM")}`;
}

function ResultCard({ estimate }: { estimate: LtvEstimate }) {
  const whatsappText = `Hi 808 Digital Systems — I run a ${estimate.businessType} and my estimated annual client value is ${formatKwacha(estimate.total)}. I’d love to talk about capturing this.`;
  const whatsappLink = `${siteConfig.whatsappHref}?text=${encodeURIComponent(whatsappText)}`;

  return (
    <article className="space-y-4 rounded-xl border border-black/8 bg-white/95 p-4 text-left text-foreground shadow-lg">
      <p className="text-xs font-semibold uppercase tracking-widest text-primary">
        {estimate.businessType}
      </p>

      <dl className="grid grid-cols-2 gap-3 text-center">
        <div>
          <dd className="font-heading text-sm font-medium text-primary">
            {formatKwacha(estimate.avgValue)}
          </dd>
          <dt className="mt-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            per visit
          </dt>
        </div>
        <div>
          <dd className="font-heading text-sm font-medium text-primary">
            ×{estimate.visitsPerYear}
          </dd>
          <dt className="mt-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            visits / yr
          </dt>
        </div>
      </dl>

      <div className="border-t border-black/8 pt-3 text-center">
        <p className="mb-1 text-[11px] text-muted-foreground">Annual client value</p>
        <p className="font-heading text-3xl font-medium text-accent">
          {formatKwacha(estimate.total)}
        </p>
      </div>

      <Link
        href="/#contact"
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white active:opacity-75"
      >
        Talk to us about capturing this {formatKwacha(estimate.total)} / yr
        <ArrowRight aria-hidden="true" className="size-4 shrink-0" />
      </Link>

      <p className="text-center">
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-muted-foreground underline decoration-muted-foreground/40 underline-offset-2 transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          Not ready yet? Get this sent to your WhatsApp
        </a>
      </p>
    </article>
  );
}

export function LtvChat() {
  const [messages, setMessages] = useState<LtvMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollArea = scrollRef.current;
    if (scrollArea) scrollArea.scrollTop = scrollArea.scrollHeight;
  }, [messages, loading]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    const history = messages;
    setInput("");
    setMessages((current) => [...current, { kind: "user", text }]);
    setLoading(true);

    try {
      const estimate = await requestLtvEstimate(text, history, {
        endpoint: process.env.NEXT_PUBLIC_SUPABASE_FUNCTION_URL,
      });

      if (estimate.isCalculation === false || isDuplicateResult(estimate, history)) {
        setMessages((current) => [
          ...current,
          { kind: "bot", text: estimate.salesPitch || DEFAULT_REPLY },
        ]);
      } else {
        setMessages((current) => [
          ...current,
          ...(estimate.salesPitch
            ? ([{ kind: "bot", text: estimate.salesPitch }] satisfies LtvMessage[])
            : []),
          { kind: "result", data: estimate },
        ]);
      }
    } catch (error) {
      console.error(error);
      setMessages((current) => [
        ...current,
        {
          kind: "bot",
          text: "The calculator hit a temporary issue. Please try again in a moment.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  }

  return (
    <div
      className="ltv-chat flex flex-col gap-4"
      data-active={messages.length > 0 ? "true" : "false"}
    >
      <div
        ref={scrollRef}
        className="chat-scrollbar flex max-h-80 flex-col gap-3 overflow-y-auto"
        aria-live="polite"
        aria-relevant="additions"
      >
        {messages.map((message, index) => {
          const key = `${message.kind}-${index}`;

          if (message.kind === "bot") {
            return (
              <div key={key} className="flex items-start gap-3">
                <div
                  aria-hidden="true"
                  className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary font-heading text-[8px] tracking-[0.02em] text-white"
                >
                  808
                </div>
                <p className="pt-1 text-sm leading-relaxed text-white/90">{message.text}</p>
              </div>
            );
          }

          if (message.kind === "user") {
            return (
              <div key={key} className="flex justify-end">
                <p className="max-w-[85%] rounded-2xl rounded-tr-sm bg-primary px-4 py-2.5 text-sm leading-relaxed text-white">
                  {message.text}
                </p>
              </div>
            );
          }

          return <ResultCard key={key} estimate={message.data} />;
        })}

        {loading ? (
          <div className="flex items-center gap-3" role="status">
            <div
              aria-hidden="true"
              className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-[8px] text-white"
            >
              808
            </div>
            <span className="sr-only">Calculating your annual client value</span>
            <div aria-hidden="true" className="flex gap-1.5">
              {[0, 150, 300].map((delay) => (
                <span
                  key={delay}
                  className="size-2 animate-bounce rounded-full bg-primary"
                  style={{ animationDelay: `${delay}ms` }}
                />
              ))}
            </div>
          </div>
        ) : null}
      </div>

      <form onSubmit={submit} className="w-full pt-2">
        <div className="flex items-center gap-3 border-b-2 border-white/70 pb-2.5 transition-colors focus-within:border-white">
          <button
            type="button"
            disabled
            aria-label="Attachments are not available"
            title="Attachments are not available"
            className="p-1 text-white/50 hover:text-white transition-colors disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Plus aria-hidden="true" className="size-5" strokeWidth={1.5} />
          </button>
          <label htmlFor="ltv-prompt" className="sr-only">
            Describe your business, typical customer spend, and repeat visits
          </label>
          <input
            id="ltv-prompt"
            type="text"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                submit(e as any);
              }
            }}
            placeholder={messages.length > 0 ? "Type your response..." : "e.g. I run a dental clinic, patients pay K350 a visit..."}
            className="w-full bg-transparent outline-none text-white text-sm sm:text-base placeholder:text-white/40 py-1"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            aria-label="Calculate annual client value"
            className="flex size-8 items-center justify-center rounded-full bg-primary text-white transition-all hover:scale-105 active:scale-95 shrink-0 disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ArrowUp aria-hidden="true" className="size-4" strokeWidth={2} />
          </button>
        </div>
      </form>
    </div>
  );
}
