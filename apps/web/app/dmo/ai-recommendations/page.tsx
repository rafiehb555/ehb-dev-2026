"use client";

/**
 * DMO — AI Recommendations & Insights
 *   - VerificationUI primitives (no emojis, no custom classes)
 *   - In-file demo data (prototype only, no fetch)
 */

import Link from "next/link";
import { useState } from "react";
import {
  VerificationStatCard,
  VerificationChip,
  SectionHeader,
  SeverityMeter,
  type VerificationTone,
} from "@/components/dmo/verification/VerificationUI";

type InsightTone = "cyan" | "purple" | "amber";

type InsightCard = {
  id: string;
  title: string;
  body: string;
  tone: InsightTone;
  cta: { label: string; href: string };
};

const INSIGHTS: InsightCard[] = [
  { id: "1", title: "IT services demand +22% in Rawalpindi", tone: "cyan", body: "Trending from anonymized search and order signals — surface to matching providers.", cta: { label: "View IT industry", href: "/industry/it" } },
  { id: "2", title: "3 new jobs match your saved skills", tone: "purple", body: "JPS + behavior signals — real-time matching based on STL profile + activity.", cta: { label: "Open jobs", href: "/search" } },
  { id: "3", title: "12 new leads for your delivery service", tone: "amber", body: "Buyer intent near your franchise zones — optional push via notifications.", cta: { label: "Franchise ops", href: "/dmo/franchise" } },
];

const INSIGHT_VTONE: Record<InsightTone, VerificationTone> = {
  cyan: "cyan",
  purple: "purple",
  amber: "amber",
};

const TRENDING = [
  { industry: "Health", metric: "+18% bookings", tag: "WMS" },
  { industry: "Legal", metric: "+9% consults", tag: "OLS" },
  { industry: "IT", metric: "+14% projects", tag: "SOT" },
];

function InfoCell({ label, value, mono }: { label: string; value: React.ReactNode; mono?: boolean }) {
  return (
    <div className="rounded-xl border border-white/8 bg-white/[0.03] p-3">
      <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/45">{label}</p>
      <p className={`mt-1 text-sm text-white/90 ${mono ? "font-mono" : ""}`}>{value}</p>
    </div>
  );
}

export default function DmoAiRecommendationsPage() {
  const [feedback, setFeedback] = useState<Record<string, "up" | "down" | null>>({});

  return (
    <div className="space-y-6">
      <header className="relative overflow-hidden rounded-2xl border border-[#7B6EF6]/30 bg-gradient-to-br from-[#13162A] via-[#1A1D33] to-[#13162A] p-6 pt-[22px]">
        <div className="pointer-events-none absolute left-0 right-0 top-0 h-[3px]" style={{ background: "linear-gradient(90deg, transparent 0%, #7B6EF6 25%, #67E8F9 50%, #F0A030 75%, transparent 100%)" }} />
        <div className="pointer-events-none absolute left-3 top-3 h-6 w-6 border-l-[1.5px] border-t-[1.5px] border-[#7B6EF6]/50" />
        <div className="pointer-events-none absolute bottom-3 right-3 h-6 w-6 border-b-[1.5px] border-r-[1.5px] border-[#67E8F9]/45" />
        <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-gradient-to-br from-[#7B6EF6]/20 via-[#67E8F9]/12 to-transparent blur-3xl" />
        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 space-y-2">
            <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.22em]">
              <Link href="/dmo" className="text-white/40 hover:text-white/70 transition-colors">DMO</Link>
              <span className="text-white/25">/</span>
              <span className="text-[#A098F8]">AI Recommendations</span>
            </div>
            <h1 className="text-2xl font-bold text-white md:text-3xl">AI Recommendations & Insights</h1>
            <p className="max-w-2xl text-sm text-white/65">
              Operator reference for the same cards users will see on Home, Dashboard, and
              industry pages. Content is illustrative until event tracking is connected.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/dmo/roadmap" className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-white/75 transition-colors hover:border-white/20 hover:bg-white/[0.07] hover:text-white">Roadmap</Link>
            <Link href="/dmo/automation" className="rounded-xl border border-[#7B6EF6]/50 bg-[#7B6EF6]/15 px-3 py-1.5 text-xs font-semibold text-[#A098F8] transition-colors hover:bg-[#7B6EF6]/25">Automation</Link>
          </div>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <VerificationStatCard tone="purple" label="Insights" value={INSIGHTS.length} sub="AI-generated cards" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M12 3l2.6 5.3 5.9.9-4.3 4.2 1 5.9L12 16.5l-5.3 2.8 1-5.9L3.5 9.2l5.9-.9L12 3z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" /></svg>} />
        <VerificationStatCard tone="teal" label="Trending" value={TRENDING.length} sub="industries rising" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M23 6l-9.5 9.5-5-5L1 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>} />
        <VerificationStatCard tone="cyan" label="Smart search" value="Phase 20" sub="autocomplete ready" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.6" /><path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>} />
        <VerificationStatCard tone="green" label="Provider match" value="Phase 21" sub="AI ranking" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="1.6" /><circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.6" /><path d="M22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" strokeWidth="1.6" /></svg>} />
      </section>

      {/* AI Insight cards */}
      <section className="rounded-2xl border border-white/10 bg-[#13162A]/70 p-5">
        <SectionHeader eyebrow="Dashboard-style cards" title="AI insight cards" />
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {INSIGHTS.map((card) => (
            <div key={card.id} className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#1A1D33]/80 p-4 pt-[22px] transition-all duration-200 hover:-translate-y-[2px] hover:border-white/20">
              <div className="pointer-events-none absolute left-0 right-0 top-0 h-[2px]" style={{ background: `linear-gradient(90deg, transparent, ${card.tone === "cyan" ? "#67E8F9" : card.tone === "purple" ? "#A098F8" : "#F0A030"}, transparent)` }} />
              <VerificationChip tone={INSIGHT_VTONE[card.tone]}>{card.tone.toUpperCase()}</VerificationChip>
              <h3 className="mt-2 text-sm font-semibold text-white leading-snug">{card.title}</h3>
              <p className="mt-1.5 flex-1 text-[11px] text-white/55">{card.body}</p>
              <div className="mt-3 flex items-center gap-2">
                <Link href={card.cta.href} className="rounded-xl border border-white/10 bg-white/[0.06] px-3 py-1.5 text-[11px] font-semibold text-white/80 transition-colors hover:bg-white/[0.12]">
                  {card.cta.label}
                </Link>
                <button type="button" onClick={() => setFeedback((f) => ({ ...f, [card.id]: "up" }))} className={`rounded-xl border px-2 py-1 text-[10px] transition-colors ${feedback[card.id] === "up" ? "border-[#38C878]/40 bg-[#38C878]/15 text-[#38C878]" : "border-white/10 bg-white/[0.04] text-white/40 hover:text-white/70"}`}>
                  Helpful
                </button>
                <button type="button" onClick={() => setFeedback((f) => ({ ...f, [card.id]: "down" }))} className={`rounded-xl border px-2 py-1 text-[10px] transition-colors ${feedback[card.id] === "down" ? "border-[#F05858]/40 bg-[#F05858]/15 text-[#F05858]" : "border-white/10 bg-white/[0.04] text-white/40 hover:text-white/70"}`}>
                  Not helpful
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trending industries */}
      <section className="relative overflow-hidden rounded-2xl border border-cyan-400/25 bg-[#13162A]/70 p-5 pt-[22px]">
        <div className="pointer-events-none absolute left-0 right-0 top-0 h-[3px]" style={{ background: "linear-gradient(90deg, transparent, #67E8F9, transparent)" }} />
        <SectionHeader eyebrow="Phase 19 · Trending" title="Industry momentum" hint="Refresh every 6h when cron is live" />
        <div className="mt-3">
          <SeverityMeter segments={TRENDING.map((t) => ({ label: t.industry, value: parseInt(t.metric) || 10, tone: "teal" as VerificationTone }))} />
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {TRENDING.map((t) => (
            <div key={t.industry} className="rounded-xl border border-white/10 bg-[#1A1D33]/80 px-4 py-3 transition-colors hover:border-cyan-400/30">
              <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-300/80">{t.tag}</div>
              <div className="mt-1 text-sm font-semibold text-white">{t.industry}</div>
              <div className="mt-1 text-[11px] font-semibold text-[#38C878]">{t.metric}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Phase reference cards */}
      <section className="grid gap-4 lg:grid-cols-2">
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#13162A]/70 p-5 pt-[22px] transition-all duration-200 hover:-translate-y-[2px] hover:border-white/20">
          <div className="pointer-events-none absolute left-0 right-0 top-0 h-[2px]" style={{ background: "linear-gradient(90deg, transparent, #67E8F9, transparent)" }} />
          <SectionHeader title="Smart search (Phase 20)" />
          <p className="mt-2 text-[12px] text-white/55">Autocomplete + "people also searched" — UI pattern: reuse search page with suggestion chips below input.</p>
          <Link href="/search" className="mt-3 inline-block text-[11px] font-semibold text-[#A098F8] hover:text-white">Open search →</Link>
        </div>
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#13162A]/70 p-5 pt-[22px] transition-all duration-200 hover:-translate-y-[2px] hover:border-white/20">
          <div className="pointer-events-none absolute left-0 right-0 top-0 h-[2px]" style={{ background: "linear-gradient(90deg, transparent, #A098F8, transparent)" }} />
          <SectionHeader title="Provider matching (Phase 21)" />
          <p className="mt-2 text-[12px] text-white/55">POST /api/ai/match — show top 5 cards with CRB + STL + response time when backend returns ranks.</p>
          <Link href="/dmo/queue" className="mt-3 inline-block text-[11px] font-semibold text-[#A098F8] hover:text-white">Queue handoffs →</Link>
        </div>
      </section>
    </div>
  );
}
