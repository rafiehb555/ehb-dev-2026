"use client";

/**
 * DMO — Franchise Control Dashboard (Phase 8 Rebuild)
 *   - 4-tier franchise system visualization
 *   - Tier distribution, regional mapping, quick stats
 *   - Clean, premium UI with glassmorphism and design system colors
 */

import Link from "next/link";
import { useState } from "react";
import {
  VerificationStatCard,
  VerificationChip,
  SectionHeader,
  VerificationDrawer,
} from "@/components/dmo/verification/VerificationUI";

type FranchiseTier = {
  key: "country" | "corporate" | "master" | "sub";
  title: string;
  href: string;
  count: number;
  revenue: number;
  tone: "purple" | "teal" | "amber" | "cyan";
};

const TIERS: FranchiseTier[] = [
  {
    key: "country",
    title: "Country",
    href: "/dmo/franchise/country",
    count: 14,
    revenue: 890000,
    tone: "purple",
  },
  {
    key: "corporate",
    title: "Corporate",
    href: "/dmo/franchise/corporate",
    count: 42,
    revenue: 340000,
    tone: "teal",
  },
  {
    key: "master",
    title: "Master",
    href: "/dmo/franchise/master",
    count: 86,
    revenue: 210000,
    tone: "amber",
  },
  {
    key: "sub",
    title: "Sub",
    href: "/dmo/franchise/sub",
    count: 318,
    revenue: 520000,
    tone: "cyan",
  },
];

const TIER_COLORS: Record<string, string> = {
  purple: "#A098F8",
  teal: "#2BBFA0",
  amber: "#F0A030",
  cyan: "#67E8F9",
};

export default function FranchiseDashboardPage() {
  const [selectedTier, setSelectedTier] = useState<FranchiseTier | null>(null);

  const totalFranchises = TIERS.reduce((s, t) => s + t.count, 0);
  const totalRevenue = TIERS.reduce((s, t) => s + t.revenue, 0);

  return (
    <div className="space-y-6">
      <header className="relative overflow-hidden rounded-2xl border border-[#7B6EF6]/30 bg-gradient-to-br from-[#13162A] via-[#1A1D33] to-[#13162A] p-6 pt-[22px]">
        <div className="pointer-events-none absolute left-0 right-0 top-0 h-[3px]" style={{ background: "linear-gradient(90deg, transparent 0%, #7B6EF6 25%, #2BBFA0 50%, #F0A030 75%, transparent 100%)" }} />
        <div className="pointer-events-none absolute left-3 top-3 h-6 w-6 border-l-[1.5px] border-t-[1.5px] border-[#7B6EF6]/50" />
        <div className="pointer-events-none absolute bottom-3 right-3 h-6 w-6 border-b-[1.5px] border-r-[1.5px] border-[#2BBFA0]/45" />
        <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-gradient-to-br from-[#7B6EF6]/20 via-[#2BBFA0]/15 to-transparent blur-3xl" />

        <div className="relative space-y-2">
          <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.22em]">
            <Link href="/dmo" className="text-white/40 hover:text-white/70 transition-colors">DMO</Link>
            <span className="text-white/25">/</span>
            <span className="text-[#A098F8]">Franchise Control</span>
          </div>
          <h1 className="text-2xl font-bold text-white md:text-3xl">Franchise Dashboard</h1>
          <p className="max-w-2xl text-sm text-white/65">
            4-tier franchise hierarchy (Country → Corporate → Master → Sub).
            Track revenue, applications, STL compliance, and operational health.
          </p>
        </div>
      </header>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <VerificationStatCard
          tone="purple"
          label="Total franchises"
          value={totalFranchises}
          sub="all tiers"
          icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M3 20h18M5 20V9l7-5 7 5v11M9 20v-6h6v6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>}
        />
        <VerificationStatCard
          tone="teal"
          label="Total revenue"
          value={`$${(totalRevenue / 1000).toFixed(0)}K`}
          sub="month-to-date"
          icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>}
        />
        <VerificationStatCard
          tone="amber"
          label="Pending activations"
          value="12"
          sub="awaiting PSS L5"
          icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M12 5v14m-7-7h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>}
        />
        <VerificationStatCard
          tone="green"
          label="Avg STL level"
          value="6.2"
          sub="platform-wide"
          icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M12 3l2.6 5.3 5.9.9-4.3 4.2 1 5.9L12 16.5l-5.3 2.8 1-5.9L3.5 9.2l5.9-.9L12 3z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" /></svg>}
        />
      </div>

      {/* Tier cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {TIERS.map((t) => {
          const hex = TIER_COLORS[t.tone];
          return (
            <button
              key={t.key}
              onClick={() => setSelectedTier(t)}
              className="group relative flex flex-col overflow-hidden rounded-2xl border bg-[#13162A]/85 p-5 pt-[18px] text-left transition-all duration-300 hover:-translate-y-[2px] backdrop-blur-xl"
              style={{ borderColor: `${hex}55` }}
            >
              <span aria-hidden className="pointer-events-none absolute left-0 right-0 top-0 h-[3px]" style={{ background: `linear-gradient(90deg, transparent, ${hex}, transparent)`, boxShadow: `0 0 12px ${hex}` }} />
              <span aria-hidden className="pointer-events-none absolute left-2 top-2 h-2 w-2 opacity-50" style={{ borderLeft: `1.5px solid ${hex}`, borderTop: `1.5px solid ${hex}` }} />
              <span aria-hidden className="pointer-events-none absolute bottom-2 right-2 h-2 w-2 opacity-50" style={{ borderRight: `1.5px solid ${hex}`, borderBottom: `1.5px solid ${hex}` }} />

              <div className="relative space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-white/50">{t.key}</span>
                  <VerificationChip tone={t.tone}>Active</VerificationChip>
                </div>
                <h3 className="text-lg font-bold text-white">{t.title}</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black" style={{ color: hex }}>{t.count}</span>
                  <span className="text-[10px] text-white/50">franchises</span>
                </div>
                <div className="text-[10px] text-white/55">
                  <span style={{ color: hex }}>
                    ${(t.revenue / 1000).toFixed(0)}K
                  </span>
                  {" revenue"}
                </div>
              </div>

              <Link href={t.href} className="absolute inset-0" />
            </button>
          );
        })}
      </div>

      {/* Quick links */}
      <section className="rounded-2xl border border-white/10 bg-[#13162A]/70 p-5">
        <SectionHeader eyebrow="Navigation" title="Franchise management" hint="Quick access" />
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {[
            { href: "/dmo/franchise/tasks", label: "Tasks", icon: "✓" },
            { href: "/dmo/franchise/in-progress", label: "Applications", icon: "📋" },
            { href: "/dmo/franchise/reports", label: "Reports", icon: "📊" },
            { href: "/dmo/franchise/escalations", label: "Escalations", icon: "⚠" },
          ].map(({ href, label }) => (
            <Link key={href} href={href} className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-[11px] font-semibold text-white transition-all hover:bg-white/[0.08] hover:border-white/20">
              {label}
            </Link>
          ))}
        </div>
      </section>

      <VerificationDrawer open={Boolean(selectedTier)} onClose={() => setSelectedTier(null)} title={selectedTier?.title} subtitle={selectedTier ? `${selectedTier.count} franchises · $${(selectedTier.revenue / 1000).toFixed(0)}K revenue` : undefined} severity="info">
        {selectedTier ? (
          <div className="space-y-4">
            <p className="text-sm text-white/70">
              {selectedTier.key === "country" && "National licensee with full compliance responsibility. Revenue split: 25% to franchisee."}
              {selectedTier.key === "corporate" && "Regional business clusters managing multi-city operations. Revenue split: 20% to franchisee."}
              {selectedTier.key === "master" && "Specialized operators for industry verticals. Revenue split: 15% to franchisee."}
              {selectedTier.key === "sub" && "City/branch frontline handling direct seller onboarding. Revenue split: 3-15% based on performance."}
            </p>
            <div className="rounded-xl border border-white/8 bg-white/[0.03] p-3">
              <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/45">View full details</p>
              <Link href={selectedTier.href} className="mt-2 inline-block text-sm font-semibold text-[#A098F8] hover:text-[#7B6EF6] transition-colors">
                Go to {selectedTier.title} Dashboard →
              </Link>
            </div>
          </div>
        ) : null}
      </VerificationDrawer>
    </div>
  );
}
