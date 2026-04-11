"use client";

import Link from "next/link";
import { useState } from "react";

const MOCK_INSIGHTS = [
  {
    id: "1",
    title: "IT services demand +22% in Rawalpindi this week",
    body: "Trending from anonymized search and order signals — surface to matching providers.",
    cta: { label: "View IT industry", href: "/industry/it" },
    tone: "border-cyan-400/25 bg-cyan-500/10",
  },
  {
    id: "2",
    title: "3 new jobs match your saved skills",
    body: "JPS + behavior signals — wire to GET /api/ai/recommendations when live.",
    cta: { label: "Open jobs", href: "/search" },
    tone: "border-violet-400/25 bg-violet-500/10",
  },
  {
    id: "3",
    title: "Your delivery service has 12 new leads",
    body: "Buyer intent near your franchise zones — optional push via notifications.",
    cta: { label: "Franchise ops", href: "/dmo/franchise" },
    tone: "border-amber-400/25 bg-amber-500/10",
  },
];

const TRENDING = [
  { industry: "Health", metric: "+18% bookings", tag: "WMS" },
  { industry: "Legal", metric: "+9% consults", tag: "OLS" },
  { industry: "IT", metric: "+14% projects", tag: "SOT" },
];

export default function DmoAiRecommendationsPage() {
  const [feedback, setFeedback] = useState<Record<string, "up" | "down" | null>>({});

  return (
    <main className="min-h-screen text-white">
      <div className="container-ehb py-8 space-y-8">
        <header className="rounded-3xl border border-fuchsia-400/20 bg-gradient-to-b from-fuchsia-500/10 to-[#020b18]/95 p-5 md:p-7">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-fuchsia-200">Phases 16–22</p>
              <h1 className="mt-1 text-2xl md:text-3xl font-semibold text-white">AI recommendations & insights</h1>
              <p className="mt-2 max-w-3xl text-sm text-ehb-textBody">
                Operator reference for the same cards users will see on Home, Dashboard, and industry pages. Content is
                illustrative until event tracking and GET /api/ai/recommendations are connected.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link href="/dmo/roadmap" className="ehb-btn-secondary ehb-press text-sm">
                Roadmap
              </Link>
              <Link href="/dmo/automation" className="ehb-btn-primary ehb-press text-sm">
                Automation
              </Link>
            </div>
          </div>
        </header>

        <section className="space-y-3">
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-ehb-textMuted">Dashboard-style cards</p>
              <h2 className="text-xl font-semibold text-white">AI insight cards</h2>
            </div>
            <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] text-ehb-textMuted">
              Component target: AIInsightCard
            </span>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {MOCK_INSIGHTS.map((card) => (
              <article
                key={card.id}
                className={`flex flex-col rounded-2xl border p-4 ${card.tone}`}
              >
                <h3 className="text-sm font-semibold text-white leading-snug">{card.title}</h3>
                <p className="mt-2 flex-1 text-xs text-ehb-textBody">{card.body}</p>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <Link
                    href={card.cta.href}
                    className="inline-flex rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/15"
                  >
                    {card.cta.label}
                  </Link>
                  <div className="flex items-center gap-1 rounded-full border border-white/10 bg-black/20 p-0.5">
                    <button
                      type="button"
                      aria-label="Helpful"
                      onClick={() => setFeedback((f) => ({ ...f, [card.id]: "up" }))}
                      className={`rounded-full px-2 py-1 text-xs ${
                        feedback[card.id] === "up" ? "bg-emerald-500/30 text-emerald-100" : "text-ehb-textMuted hover:bg-white/10"
                      }`}
                    >
                      👍
                    </button>
                    <button
                      type="button"
                      aria-label="Not helpful"
                      onClick={() => setFeedback((f) => ({ ...f, [card.id]: "down" }))}
                      className={`rounded-full px-2 py-1 text-xs ${
                        feedback[card.id] === "down" ? "bg-rose-500/30 text-rose-100" : "text-ehb-textMuted hover:bg-white/10"
                      }`}
                    >
                      👎
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 md:p-6">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-ehb-textMuted">Phase 19 · Trending</p>
              <h2 className="text-lg font-semibold text-white">Industry momentum (demo)</h2>
            </div>
            <span className="text-[11px] text-ehb-textMuted">Refresh every 6h when cron is live</span>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {TRENDING.map((t) => (
              <div
                key={t.industry}
                className="rounded-2xl border border-white/10 bg-[#0B0F14]/80 px-4 py-3"
              >
                <div className="text-[11px] text-cyan-300/90">{t.tag}</div>
                <div className="mt-1 text-sm font-semibold text-white">{t.industry}</div>
                <div className="mt-1 text-xs text-emerald-300/90">{t.metric}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <h3 className="text-sm font-semibold text-white">Smart search (Phase 20)</h3>
            <p className="mt-1 text-xs text-ehb-textBody">
              Autocomplete + “people also searched” — UI pattern: reuse search page with suggestion chips below input.
            </p>
            <Link href="/search" className="mt-3 inline-flex text-sm font-semibold text-cyan-200 hover:text-cyan-100">
              Open search →
            </Link>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <h3 className="text-sm font-semibold text-white">Provider matching (Phase 21)</h3>
            <p className="mt-1 text-xs text-ehb-textBody">
              POST /api/ai/match — show top 5 cards with CRB + STL + response time when backend returns ranks.
            </p>
            <Link href="/dmo/queue" className="mt-3 inline-flex text-sm font-semibold text-cyan-200 hover:text-cyan-100">
              Queue handoffs →
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
