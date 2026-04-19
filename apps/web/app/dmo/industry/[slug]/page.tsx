"use client";

/**
 * DMO — Industry Detail Page (Phase 8 Rebuild)
 *   - Single industry platform stats and performance metrics
 *   - STL distribution, active sellers/providers, top performers
 */

import Link from "next/link";
import { useState } from "react";
import {
  VerificationStatCard,
  VerificationChip,
  SectionHeader,
  VerificationDrawer,
} from "@/components/dmo/verification/VerificationUI";

const INDUSTRIES = {
  "ecommerce": {
    name: "GoSellr (E-commerce)",
    code: "GOSELLR",
    icon: "🛒",
    color: "#7B6EF6",
    description: "Multi-vendor marketplace with verified merchants",
    users: 3420,
    transactions: 24650,
    gmv: 4850000,
    avgStl: 6.8,
  },
  "legal": {
    name: "OLS (Legal)",
    code: "OLS",
    icon: "⚖️",
    color: "#A098F8",
    description: "Lawyer verification and case management platform",
    users: 1240,
    transactions: 8900,
    gmv: 2340000,
    avgStl: 7.2,
  },
  "medical": {
    name: "WMS (Medical)",
    code: "WMS",
    icon: "🏥",
    color: "#2BBFA0",
    description: "Healthcare provider verification and consultation",
    users: 2150,
    transactions: 18900,
    gmv: 3670000,
    avgStl: 7.5,
  },
  "education": {
    name: "HPS/OBS (Education)",
    code: "HPS",
    icon: "🎓",
    color: "#F0A030",
    description: "Tutor and educational institution verification",
    users: 4890,
    transactions: 32100,
    gmv: 5120000,
    avgStl: 6.5,
  },
  "jobs": {
    name: "JPS (Jobs)",
    code: "JPS",
    icon: "💼",
    color: "#38C878",
    description: "Job Profile and Skill matching engine",
    users: 8940,
    transactions: 15600,
    gmv: 2890000,
    avgStl: 6.9,
  },
  "travel": {
    name: "AGTS (Travel)",
    code: "AGTS",
    icon: "✈️",
    color: "#67E8F9",
    description: "Travel agency and booking verification",
    users: 980,
    transactions: 4200,
    gmv: 1230000,
    avgStl: 6.3,
  },
};

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function IndustryDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const industry = INDUSTRIES[slug as keyof typeof INDUSTRIES];

  if (!industry) {
    return (
      <div className="space-y-6">
        <header className="rounded-2xl border border-white/10 bg-[#13162A]/70 p-6">
          <h1 className="text-2xl font-bold text-white">Industry not found</h1>
          <p className="mt-2 text-sm text-white/65">The industry "{slug}" does not exist.</p>
          <Link href="/dmo/industry" className="mt-4 inline-block text-sm font-semibold text-[#7B6EF6] hover:text-[#A098F8]">
            Back to industry hub →
          </Link>
        </header>
      </div>
    );
  }

  return (
    <IndustryDetailContent slug={slug} industry={industry} />
  );
}

function IndustryDetailContent({ slug, industry }: { slug: string; industry: typeof INDUSTRIES["ecommerce"] }) {
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);

  const stlDistribution = [
    { level: "L8", count: 12, pct: 8 },
    { level: "L7", count: 45, pct: 28 },
    { level: "L6", count: 78, pct: 42 },
    { level: "L5", count: 38, pct: 18 },
    { level: "L4", count: 8, pct: 4 },
  ];

  const topPerformers = [
    { name: "Premium Merchant A", stl: 8, revenue: 450000, orders: 1240 },
    { name: "Elite Partner B", stl: 8, revenue: 380000, orders: 890 },
    { name: "Top Provider C", stl: 7, revenue: 320000, orders: 756 },
    { name: "Key Operator D", stl: 7, revenue: 290000, orders: 654 },
  ];

  return (
    <div className="space-y-6">
      <header className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#13162A] via-[#1A1D33] to-[#13162A] p-6 pt-[22px]">
        <div className="pointer-events-none absolute left-0 right-0 top-0 h-[3px]" style={{ background: `linear-gradient(90deg, transparent, ${industry.color}, transparent)` }} />
        <div className="pointer-events-none absolute left-3 top-3 h-6 w-6 border-l-[1.5px] border-t-[1.5px]" style={{ borderColor: `${industry.color}/50` }} />
        <div className="pointer-events-none absolute bottom-3 right-3 h-6 w-6 border-b-[1.5px] border-r-[1.5px]" style={{ borderColor: `${industry.color}/45` }} />

        <div className="relative space-y-2">
          <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.22em]">
            <Link href="/dmo" className="text-white/40 hover:text-white/70 transition-colors">DMO</Link>
            <span className="text-white/25">/</span>
            <Link href="/dmo/industry" className="text-white/40 hover:text-white/70 transition-colors">Industry</Link>
            <span className="text-white/25">/</span>
            <span style={{ color: industry.color }}>{industry.code}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-4xl">{industry.icon}</span>
            <div>
              <h1 className="text-2xl font-bold text-white">{industry.name}</h1>
              <p className="text-sm text-white/65">{industry.description}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Key metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <VerificationStatCard
          tone="purple"
          label="Active users"
          value={industry.users.toLocaleString()}
          sub="verified members"
          icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="1.6" /><circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.6" /><path d="M22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" strokeWidth="1.6" /></svg>}
        />
        <VerificationStatCard
          tone="teal"
          label="Transactions"
          value={industry.transactions.toLocaleString()}
          sub="month-to-date"
          icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>}
        />
        <VerificationStatCard
          tone="amber"
          label="GMV"
          value={`$${(industry.gmv / 1000000).toFixed(1)}M`}
          sub="gross merchandise value"
          icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M3 20h18M5 20V9l7-5 7 5v11M9 20v-6h6v6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>}
        />
        <VerificationStatCard
          tone="green"
          label="Avg STL"
          value={industry.avgStl.toFixed(1)}
          sub="platform-wide"
          icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M12 3l2.6 5.3 5.9.9-4.3 4.2 1 5.9L12 16.5l-5.3 2.8 1-5.9L3.5 9.2l5.9-.9L12 3z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" /></svg>}
        />
      </div>

      {/* STL Distribution */}
      <section className="rounded-2xl border border-white/10 bg-[#13162A]/70 p-5">
        <SectionHeader eyebrow="Service Trust Level" title="STL Distribution" hint="Provider verification breakdown" />
        <div className="mt-4 space-y-2">
          {stlDistribution.map((item) => (
            <div key={item.level} className="flex items-center gap-3">
              <span className="w-12 font-mono text-sm font-semibold text-white">{item.level}</span>
              <div className="flex-1">
                <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full transition-all"
                    style={{
                      width: `${item.pct}%`,
                      backgroundColor: industry.color,
                      opacity: 0.8,
                    }}
                  />
                </div>
              </div>
              <div className="w-20 text-right">
                <p className="text-sm font-semibold text-white">{item.count}</p>
                <p className="text-[9px] text-white/50">{item.pct}%</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Top performers */}
      <section className="rounded-2xl border border-white/10 bg-[#13162A]/70 p-5">
        <SectionHeader eyebrow="Leaderboard" title="Top performers" hint="By monthly revenue" />
        <div className="mt-4 space-y-2">
          {topPerformers.map((performer, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedMetric(performer.name)}
              className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-left transition-all hover:bg-white/[0.08] hover:border-white/20 group"
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-white group-hover:text-white/90">
                    {performer.name}
                  </p>
                  <p className="text-[10px] text-white/50 mt-0.5">
                    {performer.orders} orders
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <VerificationChip tone="green">
                    L{performer.stl}
                  </VerificationChip>
                  <span className="font-mono text-sm font-semibold text-white whitespace-nowrap">
                    ${(performer.revenue / 1000).toFixed(0)}K
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Recent activity */}
      <section className="rounded-2xl border border-white/10 bg-[#13162A]/70 p-5">
        <SectionHeader eyebrow="Activity" title="Recent events" hint="Last 30 days" />
        <div className="mt-4 space-y-2">
          {[
            { date: "2026-04-18", event: "12 new providers onboarded", tone: "green" },
            { date: "2026-04-17", event: "STL audit completed (98% pass rate)", tone: "green" },
            { date: "2026-04-16", event: "2 providers suspended (compliance)", tone: "red" },
            { date: "2026-04-15", event: "Monthly revenue target exceeded (+12%)", tone: "green" },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.tone === "green" ? "#38C878" : "#F05858" }} />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white/85">{item.event}</p>
                <p className="text-[9px] text-white/45">{item.date}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <VerificationDrawer
        open={Boolean(selectedMetric)}
        onClose={() => setSelectedMetric(null)}
        title={selectedMetric || "Performance detail"}
        severity="info"
      >
        {selectedMetric ? (
          <div className="space-y-4">
            <p className="text-sm text-white/70">
              Detailed performance metrics for this provider are available in the full analytics dashboard.
            </p>
            <div className="rounded-xl border border-white/8 bg-white/[0.03] p-3">
              <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/45">Next steps</p>
              <p className="mt-2 text-sm text-white/80">
                View full profile, transaction history, compliance records, and STL audit trail.
              </p>
            </div>
          </div>
        ) : null}
      </VerificationDrawer>
    </div>
  );
}
