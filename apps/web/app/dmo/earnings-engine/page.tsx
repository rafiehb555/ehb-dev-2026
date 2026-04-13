"use client";

/**
 * Earnings Engine — Phase 3 Operations rebuild (2026-04-12).
 *
 * Design system compliance:
 *   - VerificationUI primitives everywhere (no local KpiCard)
 *   - No <table> (§10 forbidden)
 *   - STL tier earnings breakdown using STLBadge
 *   - 40/25/20/15 franchise split visualizer with SeverityMeter
 *   - Gradient accent bars + corner decorations (ehb-uiux-auto-designer skill)
 *   - Drill-in drawers on every stat + row
 *
 * Prototype-only (no backend wiring).
 */

import Link from "next/link";
import React, { useMemo, useState } from "react";
import {
  VerificationStatCard,
  VerificationRowGrid,
  VerificationDrawer,
  VerificationChip,
  SectionHeader,
  SeverityMeter,
  STLBadge,
  getStlMeta,
  type RowColumn,
  type VerificationTone,
} from "@/components/dmo/verification/VerificationUI";

/* ================================================================== */
/* Types + demo data                                                   */
/* ================================================================== */

type SplitKey = "platform" | "country" | "corporate" | "sub";
type RevenueBucket = {
  key: SplitKey;
  label: string;
  share: number;
  amountUsd: number;
  tone: VerificationTone;
  note: string;
  icon: React.ReactNode;
};

type TopEarner = {
  id: string;
  rank: number;
  name: string;
  industry: string;
  stl: number;
  amountUsd: number;
  deltaPct: number;
  city: string;
  lastPayout: string;
};

type StlEarningTier = {
  level: number;
  earnersCount: number;
  grossUsd: number;
  feeBps: number; // fee basis points (lower at higher STL)
  avgTakehomeUsd: number;
};

const REVENUE_BUCKETS: RevenueBucket[] = [
  { key: "platform",  label: "Platform (EHB HQ)",      share: 40, amountUsd: 482_400, tone: "purple", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/></svg>, note: "Global R&D, AI, blockchain, ops" },
  { key: "country",   label: "Country franchise",      share: 25, amountUsd: 301_500, tone: "teal",   icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>, note: "National licensee + compliance" },
  { key: "corporate", label: "Corporate franchise",    share: 20, amountUsd: 241_200, tone: "amber",  icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18"/><path d="M5 21V7l8-4v18"/><path d="M19 21V11l-6-4"/></svg>, note: "Regional business cluster" },
  { key: "sub",       label: "Sub franchise",          share: 15, amountUsd: 180_900, tone: "cyan",   icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18"/><path d="M9 8h1"/><path d="M9 12h1"/><path d="M9 16h1"/><rect x="5" y="4" width="14" height="17" rx="1"/></svg>, note: "City / branch frontline" },
];

const TOP_EARNERS: TopEarner[] = [
  { id: "E-001", rank: 1, name: "GoSellr Karachi HQ",     industry: "E-commerce", stl: 9, amountUsd: 142_300, deltaPct:  12.4, city: "Karachi, PK",  lastPayout: "2026-04-10" },
  { id: "E-002", rank: 2, name: "OLS Lahore Franchise",   industry: "Legal",      stl: 8, amountUsd:  98_110, deltaPct:   7.8, city: "Lahore, PK",   lastPayout: "2026-04-10" },
  { id: "E-003", rank: 3, name: "WMS Islamabad",          industry: "Medical",    stl: 7, amountUsd:  76_240, deltaPct:  -2.1, city: "Islamabad, PK",lastPayout: "2026-04-09" },
  { id: "E-004", rank: 4, name: "AGTS Dubai",             industry: "Travel",     stl: 8, amountUsd:  58_910, deltaPct:  19.3, city: "Dubai, AE",    lastPayout: "2026-04-09" },
  { id: "E-005", rank: 5, name: "HPS / OBS Riyadh",       industry: "Education",  stl: 6, amountUsd:  42_700, deltaPct:   4.6, city: "Riyadh, SA",   lastPayout: "2026-04-08" },
  { id: "E-006", rank: 6, name: "GoSellr Faisalabad",     industry: "E-commerce", stl: 5, amountUsd:  31_250, deltaPct:   2.0, city: "Faisalabad, PK", lastPayout: "2026-04-08" },
  { id: "E-007", rank: 7, name: "JPS Lahore",             industry: "Jobs",       stl: 7, amountUsd:  28_500, deltaPct:   8.9, city: "Lahore, PK",   lastPayout: "2026-04-07" },
];

const STL_EARNINGS: StlEarningTier[] = [
  { level: 2,  earnersCount: 1_842, grossUsd:  82_900,  feeBps: 800, avgTakehomeUsd:    41 },
  { level: 3,  earnersCount: 1_204, grossUsd: 108_360,  feeBps: 700, avgTakehomeUsd:    84 },
  { level: 4,  earnersCount:   802, grossUsd: 128_320,  feeBps: 600, avgTakehomeUsd:   150 },
  { level: 5,  earnersCount:   612, grossUsd: 147_000,  feeBps: 500, avgTakehomeUsd:   228 },
  { level: 6,  earnersCount:   310, grossUsd: 148_800,  feeBps: 400, avgTakehomeUsd:   461 },
  { level: 7,  earnersCount:   184, grossUsd: 147_200,  feeBps: 300, avgTakehomeUsd:   776 },
  { level: 8,  earnersCount:    88, grossUsd: 132_000,  feeBps: 200, avgTakehomeUsd: 1_470 },
  { level: 9,  earnersCount:    22, grossUsd:  88_000,  feeBps: 150, avgTakehomeUsd: 3_940 },
  { level: 10, earnersCount:     7, grossUsd:  70_000,  feeBps: 100, avgTakehomeUsd: 9_900 },
];

/* ================================================================== */
/* Helpers                                                             */
/* ================================================================== */

const usd = (n: number) =>
  new Intl.NumberFormat(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

function stlTone(level: number): VerificationTone {
  if (level >= 8) return "amber";
  if (level >= 6) return "purple";
  if (level >= 4) return "teal";
  return "cyan";
}

/* ================================================================== */
/* Page                                                                */
/* ================================================================== */

export default function EarningsEnginePage() {
  const [selectedEarner, setSelectedEarner] = useState<TopEarner | null>(null);
  const [selectedSplit, setSelectedSplit] = useState<RevenueBucket | null>(null);
  const [selectedTier, setSelectedTier] = useState<StlEarningTier | null>(null);
  const [statDrawer, setStatDrawer] = useState<
    null | "gross" | "runrate" | "pending" | "earners"
  >(null);

  const totals = useMemo(() => {
    const gross = REVENUE_BUCKETS.reduce((s, b) => s + b.amountUsd, 0);
    const payoutsPending = 84_500;
    const activeEarners = 4_812;
    const runRate = gross * 12;
    return { gross, payoutsPending, activeEarners, runRate };
  }, []);

  return (
    <div className="space-y-5">
      {/* Hero */}
      <section
        className="relative overflow-hidden rounded-2xl border p-6 border-[rgba(56,200,120,0.35)]"
        style={{
          background:
            "linear-gradient(135deg, rgba(56,200,120,0.12) 0%, rgba(19,22,42,0.92) 45%, rgba(123,110,246,0.10) 100%)",
        }}
      >
        <span
          aria-hidden
          className="pointer-events-none absolute left-0 right-0 top-0 h-[3px]"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, #38C878 30%, #7B6EF6 70%, transparent 100%)",
            boxShadow: "0 0 16px #38C878",
          }}
        />
        <span
          aria-hidden
          className="pointer-events-none absolute left-3 top-3 h-4 w-4 opacity-60"
          style={{ borderLeft: "1.5px solid #38C878", borderTop: "1.5px solid #38C878", borderTopLeftRadius: 4 }}
        />
        <span
          aria-hidden
          className="pointer-events-none absolute bottom-3 right-3 h-4 w-4 opacity-60"
          style={{ borderRight: "1.5px solid #7B6EF6", borderBottom: "1.5px solid #7B6EF6", borderBottomRightRadius: 4 }}
        />
        <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-gradient-to-br from-[#38C878]/22 via-[#2BBFA0]/15 to-transparent blur-3xl" />
        <div className="pointer-events-none absolute -left-16 -bottom-16 h-48 w-48 rounded-full bg-gradient-to-tr from-[#7B6EF6]/18 via-transparent to-transparent blur-3xl" />

        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 space-y-2">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#38C878]">
              Operations · Earnings Engine
            </p>
            <h1 className="text-2xl font-bold text-white md:text-3xl">Earnings Engine</h1>
            <p className="max-w-2xl text-sm text-white/65">
              40 / 25 / 20 / 15 revenue split — platform, country, corporate, sub franchise.
              Har transaction yahaan accurately distribute hoti hai aur payouts schedule pa
              release hotay hain. STL tier jitna high, platform fee utna low.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/dmo"
              className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-white/75 transition-colors hover:border-white/20 hover:bg-white/[0.07] hover:text-white"
            >
              ← Back to DMO
            </Link>
            <Link
              href="/dmo/wallet-control"
              className="rounded-xl border border-[#2BBFA0]/50 bg-[#2BBFA0]/15 px-3 py-1.5 text-xs font-semibold text-[#2BBFA0] transition-colors hover:border-[#2BBFA0]/80 hover:bg-[#2BBFA0]/25 hover:text-white"
            >
              Wallet Control
            </Link>
            <Link
              href="/dmo/franchise"
              className="rounded-xl border border-[#F0A030]/50 bg-[#F0A030]/15 px-3 py-1.5 text-xs font-semibold text-[#F0A030] transition-colors hover:border-[#F0A030]/80 hover:bg-[#F0A030]/25 hover:text-white"
            >
              Franchise
            </Link>
          </div>
        </div>
      </section>

      {/* KPI stats */}
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <VerificationStatCard
          tone="green"
          icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
          label="Gross revenue (MTD)"
          value={usd(totals.gross)}
          sub="Month-to-date"
          onClick={() => setStatDrawer("gross")}
        />
        <VerificationStatCard
          tone="purple"
          icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><polyline points="17 6 23 6 23 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
          label="Annualized run-rate"
          value={usd(totals.runRate)}
          sub="MTD × 12"
          onClick={() => setStatDrawer("runrate")}
        />
        <VerificationStatCard
          tone="amber"
          icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" /><polyline points="12 6 12 12 16 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>}
          label="Payouts pending"
          value={usd(totals.payoutsPending)}
          sub="Scheduled release"
          onClick={() => setStatDrawer("pending")}
        />
        <VerificationStatCard
          tone="cyan"
          icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="1.5" /><circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.5" /><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" strokeWidth="1.5" /></svg>}
          label="Active earners"
          value={totals.activeEarners.toLocaleString()}
          sub="Across 6 industries"
          onClick={() => setStatDrawer("earners")}
        />
      </section>

      {/* Revenue split — 40/25/20/15 visualizer */}
      <section
        className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#13162A]/70 p-5 backdrop-blur-sm"
      >
        <span
          aria-hidden
          className="pointer-events-none absolute left-0 right-0 top-0 h-[2px]"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, #7B6EF6 25%, #2BBFA0 50%, #F0A030 75%, #67E8F9 90%, transparent 100%)",
            boxShadow: "0 0 12px rgba(123,110,246,0.5)",
          }}
        />
        <SectionHeader
          eyebrow="Earnings · Revenue Split"
          title="40 / 25 / 20 / 15 franchise distribution"
          hint="Every transaction is auto-split across the four franchise tiers. STL-weighted — higher STL earners get better ratios."
          right={
            <span className="rounded-full border border-[#7B6EF6]/35 bg-[#7B6EF6]/12 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-[#A098F8]">
              Auto-split · STL-weighted
            </span>
          }
        />

        {/* Segmented 40/25/20/15 bar */}
        <div className="mt-3">
          <SeverityMeter
            segments={REVENUE_BUCKETS.map((b) => ({
              label: `${b.label} · ${b.share}%`,
              value: b.share,
              tone: b.tone,
            }))}
          />
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {REVENUE_BUCKETS.map((b) => (
            <button
              key={b.key}
              type="button"
              onClick={() => setSelectedSplit(b)}
              className="group relative overflow-hidden rounded-xl border bg-[#1A1D33]/75 p-4 text-left transition-all duration-300 hover:-translate-y-[2px]"
              style={{ borderColor: getStlTone(b.tone).border }}
              onMouseEnter={(e) => {
                const t = getStlTone(b.tone);
                (e.currentTarget as HTMLButtonElement).style.boxShadow = t.glow;
                (e.currentTarget as HTMLButtonElement).style.borderColor = t.fg;
              }}
              onMouseLeave={(e) => {
                const t = getStlTone(b.tone);
                (e.currentTarget as HTMLButtonElement).style.boxShadow = "";
                (e.currentTarget as HTMLButtonElement).style.borderColor = t.border;
              }}
            >
              {/* accent bar */}
              <span
                aria-hidden
                className="pointer-events-none absolute left-0 right-0 top-0 h-[2px]"
                style={{
                  background: getStlTone(b.tone).fg,
                  boxShadow: `0 0 10px ${getStlTone(b.tone).fg}`,
                }}
              />
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/55">
                    {b.label}
                  </p>
                  <p
                    className="mt-1 text-2xl font-black tabular-nums"
                    style={{ color: getStlTone(b.tone).fg, textShadow: `0 0 14px ${getStlTone(b.tone).fg}55` }}
                  >
                    {usd(b.amountUsd)}
                  </p>
                </div>
                <span className="text-2xl">{b.icon}</span>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <div className="flex-1 h-2 overflow-hidden rounded-full bg-white/[0.06]">
                  <div
                    className="h-full rounded-full transition-[width] duration-700 ease-out"
                    style={{
                      width: `${b.share * 2.5}%`,
                      background: getStlTone(b.tone).fg,
                      boxShadow: `0 0 10px ${getStlTone(b.tone).fg}`,
                    }}
                  />
                </div>
                <span
                  className="font-mono text-xs font-black tabular-nums"
                  style={{ color: getStlTone(b.tone).fg }}
                >
                  {b.share}%
                </span>
              </div>
              <p className="mt-2 text-[10px] text-white/55">{b.note}</p>
            </button>
          ))}
        </div>
      </section>

      {/* Earnings by STL tier */}
      <section>
        <SectionHeader
          eyebrow="Earnings · STL Tier Breakdown"
          title="Earnings per STL level"
          hint="Higher STL = lower platform fee + higher avg take-home. Click any tier to drill in."
          right={
            <span className="text-[10px] uppercase tracking-[0.18em] text-white/45">
              {STL_EARNINGS.reduce((s, t) => s + t.earnersCount, 0).toLocaleString()} earners
            </span>
          }
        />

        <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-3">
          {STL_EARNINGS.map((tier) => {
            const meta = getStlMeta(tier.level);
            return (
              <button
                key={tier.level}
                type="button"
                onClick={() => setSelectedTier(tier)}
                className="group relative overflow-hidden rounded-2xl border bg-[#13162A]/75 p-4 text-left transition-all duration-300 hover:-translate-y-[2px]"
                style={{ borderColor: `${meta.accent}44` }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 0 24px ${meta.glow}`;
                  (e.currentTarget as HTMLButtonElement).style.borderColor = meta.accent;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = "";
                  (e.currentTarget as HTMLButtonElement).style.borderColor = `${meta.accent}44`;
                }}
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute left-0 right-0 top-0 h-[2px]"
                  style={{ background: meta.accent, boxShadow: `0 0 10px ${meta.accent}` }}
                />
                <div className="flex items-start gap-3">
                  <STLBadge level={tier.level} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/50">
                      Gross MTD
                    </p>
                    <p
                      className="text-xl font-black tabular-nums"
                      style={{ color: meta.accent, textShadow: `0 0 12px ${meta.accent}55` }}
                    >
                      {usd(tier.grossUsd)}
                    </p>
                    <p className="text-[9px] text-white/45">
                      {tier.earnersCount.toLocaleString()} earners
                    </p>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 border-t border-white/8 pt-2 text-[10px]">
                  <div>
                    <p className="text-white/40 uppercase tracking-wider">Platform fee</p>
                    <p className="mt-0.5 font-mono text-sm font-bold text-white">
                      {(tier.feeBps / 100).toFixed(1)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-white/40 uppercase tracking-wider">Avg take-home</p>
                    <p
                      className="mt-0.5 font-mono text-sm font-bold"
                      style={{ color: meta.accent }}
                    >
                      {usd(tier.avgTakehomeUsd)}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Top earners row grid */}
      <section>
        <SectionHeader
          eyebrow="Earnings · Leaderboard"
          title="Top earners this month"
          hint="Click any row for MTD breakdown, city, last payout."
          right={
            <span className="text-[10px] uppercase tracking-[0.18em] text-white/45">
              {TOP_EARNERS.length} entries
            </span>
          }
        />
        <VerificationRowGrid<TopEarner>
          rows={TOP_EARNERS}
          columns={earnerColumns}
          onRowClick={(r) => setSelectedEarner(r)}
          getRowTone={(r) => (r.deltaPct >= 10 ? "green" : r.deltaPct < 0 ? "red" : undefined)}
          emptyIcon={<svg viewBox="0 0 24 24" fill="none" className="h-6 w-6"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" stroke="currentColor" strokeWidth="1.4" /></svg>}
          emptyTitle="No top earners yet"
        />
      </section>

      {/* Earner drill-in */}
      <VerificationDrawer
        open={!!selectedEarner}
        onClose={() => setSelectedEarner(null)}
        title={selectedEarner ? `${selectedEarner.name} · MTD` : ""}
        subtitle={selectedEarner ? `#${selectedEarner.rank} · ${selectedEarner.industry}` : undefined}
        severity={selectedEarner && selectedEarner.deltaPct < 0 ? "warning" : "info"}
      >
        {selectedEarner ? (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <STLBadge level={selectedEarner.stl} size="md" />
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/50">
                  Current STL
                </p>
                <p className="text-lg font-bold text-white">
                  L{selectedEarner.stl} · {getStlMeta(selectedEarner.stl).label}
                </p>
                <p className="text-[10px] text-white/45">
                  Platform fee: {((10 - selectedEarner.stl) * 100) / 10 + 1}%
                </p>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <InfoCell label="MTD gross" value={usd(selectedEarner.amountUsd)} tone="teal" />
              <InfoCell
                label="MoM delta"
                value={`${selectedEarner.deltaPct >= 0 ? "+" : ""}${selectedEarner.deltaPct.toFixed(1)}%`}
                tone={selectedEarner.deltaPct >= 0 ? "teal" : "red"}
              />
              <InfoCell label="City" value={selectedEarner.city} />
              <InfoCell label="Last payout" value={selectedEarner.lastPayout} />
            </div>
          </div>
        ) : null}
      </VerificationDrawer>

      {/* Split drill-in */}
      <VerificationDrawer
        open={!!selectedSplit}
        onClose={() => setSelectedSplit(null)}
        title={selectedSplit ? `${selectedSplit.label} · ${selectedSplit.share}%` : ""}
        subtitle={selectedSplit ? selectedSplit.note : undefined}
      >
        {selectedSplit ? (
          <div className="space-y-3 text-xs text-white/75">
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
              <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/50">
                MTD distribution
              </p>
              <p
                className="mt-1 text-2xl font-black tabular-nums"
                style={{ color: getStlTone(selectedSplit.tone).fg }}
              >
                {usd(selectedSplit.amountUsd)}
              </p>
              <p className="text-[10px] text-white/45">{selectedSplit.share}% of gross</p>
            </div>
            <p>
              {selectedSplit.key === "platform"
                ? "Funds EHB HQ — global AI, blockchain, R&D, platform ops, tooling."
                : selectedSplit.key === "country"
                ? "Country-level licensee. Covers national compliance, legal, taxation."
                : selectedSplit.key === "corporate"
                ? "Regional business cluster / corporate franchise. Operations + growth."
                : "City branch / sub-franchise. Frontline operations, local sales, support."}
            </p>
          </div>
        ) : null}
      </VerificationDrawer>

      {/* Tier drill-in */}
      <VerificationDrawer
        open={!!selectedTier}
        onClose={() => setSelectedTier(null)}
        title={selectedTier ? `L${selectedTier.level} · ${getStlMeta(selectedTier.level).label}` : ""}
        subtitle={selectedTier ? `${selectedTier.earnersCount.toLocaleString()} active earners` : undefined}
      >
        {selectedTier ? (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <STLBadge level={selectedTier.level} size="md" />
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/50">
                  Coin lock requirement
                </p>
                <p
                  className="text-xl font-bold tabular-nums"
                  style={{ color: getStlMeta(selectedTier.level).accent }}
                >
                  {getStlMeta(selectedTier.level).coinLock.toLocaleString()} EHBGC
                </p>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <InfoCell label="Gross MTD" value={usd(selectedTier.grossUsd)} tone="teal" />
              <InfoCell label="Platform fee" value={`${(selectedTier.feeBps / 100).toFixed(1)}%`} />
              <InfoCell label="Avg take-home" value={usd(selectedTier.avgTakehomeUsd)} tone="teal" />
              <InfoCell label="Earners" value={selectedTier.earnersCount.toLocaleString()} />
            </div>
          </div>
        ) : null}
      </VerificationDrawer>

      {/* Stat drill-in */}
      <VerificationDrawer
        open={!!statDrawer}
        onClose={() => setStatDrawer(null)}
        title={
          statDrawer === "gross"
            ? "Gross revenue (MTD) · breakdown"
            : statDrawer === "runrate"
            ? "Annualized run-rate"
            : statDrawer === "pending"
            ? "Pending payouts"
            : statDrawer === "earners"
            ? "Active earners"
            : ""
        }
      >
        {statDrawer === "gross" ? (
          <div className="space-y-3 text-xs text-white/75">
            <p>Month-to-date gross revenue before the 40/25/20/15 split.</p>
            <SeverityMeter
              segments={REVENUE_BUCKETS.map((b) => ({
                label: b.label,
                value: b.amountUsd,
                tone: b.tone,
              }))}
            />
          </div>
        ) : statDrawer === "runrate" ? (
          <p className="text-xs text-white/75">
            Simple annualized projection: MTD × 12. Current: {usd(totals.runRate)}. Final
            run-rate report will model seasonality and YoY growth once Phase 4 analytics
            lands.
          </p>
        ) : statDrawer === "pending" ? (
          <p className="text-xs text-white/75">
            {usd(totals.payoutsPending)} currently scheduled for release on the next
            payout window. Subject to Up-Guard fraud pass + CRB refill check.
          </p>
        ) : statDrawer === "earners" ? (
          <p className="text-xs text-white/75">
            {totals.activeEarners.toLocaleString()} active earners across GoSellr, OLS,
            WMS, JPS, AGTS, HPS/OBS. Distribution follows the STL ladder shown above.
          </p>
        ) : null}
      </VerificationDrawer>
    </div>
  );
}

/* ================================================================== */
/* Local helpers                                                       */
/* ================================================================== */

function InfoCell({
  label,
  value,
  mono,
  tone,
}: {
  label: string;
  value: string;
  mono?: boolean;
  tone?: "teal" | "red" | "amber";
}) {
  const fg =
    tone === "teal" ? "#2BBFA0" : tone === "red" ? "#F05858" : tone === "amber" ? "#F0A030" : "#ffffff";
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
      <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/50">
        {label}
      </p>
      <p
        className={`mt-1 text-sm font-semibold ${mono ? "font-mono" : ""}`}
        style={{ color: fg }}
      >
        {value}
      </p>
    </div>
  );
}

// Local mini tone helper — we want fg/border/glow without importing TONE map
function getStlTone(tone: VerificationTone) {
  const map: Record<VerificationTone, { fg: string; border: string; glow: string }> = {
    purple: { fg: "#A098F8", border: "rgba(123,110,246,0.35)", glow: "0 0 24px rgba(123,110,246,0.22)" },
    teal:   { fg: "#2BBFA0", border: "rgba(43,191,160,0.35)",  glow: "0 0 24px rgba(43,191,160,0.22)" },
    amber:  { fg: "#F0A030", border: "rgba(240,160,48,0.38)",  glow: "0 0 24px rgba(240,160,48,0.22)" },
    red:    { fg: "#F05858", border: "rgba(240,88,88,0.45)",   glow: "0 0 28px rgba(240,88,88,0.32)" },
    green:  { fg: "#38C878", border: "rgba(56,200,120,0.38)",  glow: "0 0 24px rgba(56,200,120,0.22)" },
    cyan:   { fg: "#67E8F9", border: "rgba(103,232,249,0.35)", glow: "0 0 24px rgba(103,232,249,0.20)" },
  };
  return map[tone];
}

/* ---------- Row columns ---------- */
const earnerColumns: RowColumn<TopEarner>[] = [
  {
    key: "rank",
    header: "Rank",
    width: "minmax(0,0.4fr)",
    render: (r) => (
      <span className="font-mono text-sm font-bold text-[#A098F8]">#{r.rank}</span>
    ),
  },
  {
    key: "name",
    header: "Franchise",
    width: "minmax(0,2fr)",
    render: (r) => (
      <div className="min-w-0">
        <div className="truncate font-semibold text-white">{r.name}</div>
        <div className="text-[10px] text-white/45">{r.city}</div>
      </div>
    ),
  },
  {
    key: "industry",
    header: "Industry",
    width: "minmax(0,0.9fr)",
    render: (r) => (
      <span className="text-xs text-white/70">{r.industry}</span>
    ),
  },
  {
    key: "stl",
    header: "STL",
    width: "minmax(0,0.55fr)",
    render: (r) => (
      <VerificationChip tone={stlTone(r.stl)} size="xs">
        L{r.stl}
      </VerificationChip>
    ),
  },
  {
    key: "mtd",
    header: "MTD",
    width: "minmax(0,1fr)",
    align: "right",
    render: (r) => (
      <span className="font-mono text-sm font-bold tabular-nums text-white">
        {usd(r.amountUsd)}
      </span>
    ),
  },
  {
    key: "delta",
    header: "MoM",
    width: "minmax(0,0.6fr)",
    align: "right",
    render: (r) => (
      <span
        className="font-mono text-xs font-bold tabular-nums"
        style={{ color: r.deltaPct >= 0 ? "#38C878" : "#F05858" }}
      >
        {r.deltaPct >= 0 ? "+" : ""}
        {r.deltaPct.toFixed(1)}%
      </span>
    ),
  },
];
