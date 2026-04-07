"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { TrustBadgeLegend } from "@/components/TrustBadgeLegend";
import { STLLevelsAndSecurity } from "@/components/STLLevelsAndSecurity";
import { AIToolsSection } from "@/components/AIToolsSection";

type ModelKey = "ml" | "fraud" | "nlp";

export function AIEcosystemLanding() {
  const [active, setActive] = useState<ModelKey>("ml");

  const activeCopy = useMemo(() => {
    const map: Record<ModelKey, { title: string; headline: string; detail: string; bullets: string[]; accent: string }> = {
      ml: {
        title: "ML Opportunity Engine",
        headline: "Find best opportunities fast",
        detail:
          "Machine learning helps EHB predict demand patterns and prioritize verified services for each user profile.",
        bullets: [
          "Auto-learns from verified outcomes",
          "Ranks services by fit + safety signals",
          "Reduces confusion for beginners",
        ],
        accent: "rgba(0,234,239,0.35)",
      },
      fraud: {
        title: "Fraud Detection Shield",
        headline: "Stop risky flows early",
        detail:
          "Fraud models check identity patterns, transaction anomalies, and verification integrity before bookings complete.",
        bullets: [
          "Detects suspicious provider behavior",
          "Flags inconsistent documents & histories",
          "Keeps payments inside trusted flows",
        ],
        accent: "rgba(245,158,11,0.35)",
      },
      nlp: {
        title: "NLP Compliance Analyzer",
        headline: "Explain what trust really means",
        detail:
          "Natural language processing turns documents, requests and reviews into clear compliance summaries mapped to EHB trust layers.",
        bullets: [
          "Summarizes documents for officers",
          "Connects issues to PSS / CRB / STL badges",
          "Creates readable decision notes",
        ],
        accent: "rgba(139,92,246,0.35)",
      },
    };

    return map[active];
  }, [active]);

  return (
    <main className="min-h-screen text-white">
      <div className="container-ehb py-8 space-y-6">
        <section className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full border glass-panel px-3 py-1.5 text-[11px] text-ehb-textBody border-white/10">
            <span aria-hidden>🤖</span>
            <span className="text-ehb-textMuted">Phase 7</span>
            <span className="text-white font-semibold">AI Ecosystem</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-semibold leading-tight gradient-text">ML, Fraud Detection & NLP (demo)</h1>
          <p className="text-ehb-textMuted max-w-2xl">
            AI runs behind the scenes to keep opportunities accurate, decisions understandable, and trust verifications consistent.
          </p>
        </section>

        <section className="rounded-3xl glass-panel border border-white/10 p-5 md:p-6 overflow-hidden relative">
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.06]"
            aria-hidden
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.9) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.9) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />

          <div className="relative grid gap-6 lg:grid-cols-12 items-start">
            <div className="lg:col-span-7 space-y-4">
              <div className="flex flex-wrap gap-2">
                {([
                  { key: "ml" as const, label: "ML Engine", icon: "🧠" },
                  { key: "fraud" as const, label: "Fraud Shield", icon: "🛡️" },
                  { key: "nlp" as const, label: "NLP Analyzer", icon: "🧾" },
                ] as const).map((t) => {
                  const isActive = active === t.key;
                  return (
                    <button
                      key={t.key}
                      type="button"
                      onClick={() => setActive(t.key)}
                      className="min-h-touch inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[11px] font-semibold transition-all duration-200"
                      style={{
                        borderColor: isActive ? "rgba(0,174,239,0.65)" : "rgba(255,255,255,0.12)",
                        background: isActive ? "rgba(0,174,239,0.10)" : "rgba(255,255,255,0.03)",
                        boxShadow: isActive ? "0 0 26px rgba(0,174,239,0.18)" : "none",
                        color: isActive ? "rgba(226,232,240,0.98)" : "rgba(226,232,240,0.85)",
                      }}
                      aria-pressed={isActive}
                    >
                      <span aria-hidden>{t.icon}</span>
                      <span>{t.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="glass-card rounded-2xl border p-5" style={{ borderColor: `${activeCopy.accent}`, boxShadow: `0 0 30px ${activeCopy.accent}` }}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.22em] text-ehb-textMuted">{activeCopy.title}</p>
                    <h2 className="text-xl font-semibold text-white mt-2">{activeCopy.headline}</h2>
                  </div>
                  <span className="text-[13px] text-ehb-textBody" aria-hidden>
                    →
                  </span>
                </div>
                <p className="text-ehb-textBody mt-3 leading-relaxed">{activeCopy.detail}</p>
                <ul className="mt-4 space-y-2 text-ehb-textBody">
                  {activeCopy.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2">
                      <span aria-hidden className="mt-[2px]">
                        ✅
                      </span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-5 flex flex-wrap gap-3">
                  <Link
                    href="/ai-marketplace"
                    className="min-h-touch inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#00eaff] to-[#6366f1] px-5 py-2.5 text-sm font-semibold text-slate-950 btn-glow hover:opacity-95 transition-all"
                  >
                    Use AI tools
                    <span className="text-xs ml-2" aria-hidden>
                      →
                    </span>
                  </Link>
                  <Link href="/dashboard" className="min-h-touch inline-flex items-center justify-center rounded-full border border-white/25 bg-white/5 px-5 py-2.5 text-sm font-semibold text-ehb-textBody hover:bg-white/10 transition-all">
                    See progress
                  </Link>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-4">
              <div className="glass-card rounded-2xl border p-4">
                <p className="text-[11px] uppercase tracking-[0.22em] text-ehb-textMuted mb-2">Trusted AI flow</p>
                <div className="space-y-2 text-ehb-textBody text-[12px]">
                  <div className="flex items-start gap-2">
                    <span aria-hidden>1.</span>
                    <span>Verified signals enter the system (PSS + CRB + STL).</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span aria-hidden>2.</span>
                    <span>AI models evaluate risk + opportunity with consistent rules.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span aria-hidden>3.</span>
                    <span>Outputs become safe actions: book, hire, buy, and record.</span>
                  </div>
                </div>
              </div>

              <div className="glass-card rounded-2xl border p-4" style={{ borderColor: "rgba(34,197,94,0.25)" }}>
                <p className="text-[11px] uppercase tracking-[0.22em] text-ehb-textMuted mb-2">AI status (demo)</p>
                <p className="text-ehb-textBody text-[12px] leading-relaxed">
                  AI is analyzing opportunities for you... Best match found... Optimizing your growth... (simulated)
                </p>
              </div>
            </div>
          </div>
        </section>

        <TrustBadgeLegend />
        <STLLevelsAndSecurity />
        <AIToolsSection />
      </div>
    </main>
  );
}

