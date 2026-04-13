"use client";

/**
 * STL — Breakdown
 * Dimension-level analysis: quality, speed, trust, compliance across all entities.
 * DESIGN-ONLY — in-file demo data, no fetch.
 */

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  VerificationStatCard,
  VerificationChip,
  SectionHeader,
  SeverityMeter,
  STLBadge,
  getStlMeta,
  type VerificationTone,
} from "@/components/dmo/verification/VerificationUI";

type DimensionKey = "quality" | "speed" | "trust" | "compliance";

type DimensionData = {
  key: DimensionKey;
  label: string;
  accent: string;
  avg: number;
  min: number;
  max: number;
  belowThreshold: number;
  description: string;
};

const DIMENSIONS: DimensionData[] = [
  { key: "quality", label: "Quality", accent: "#7B6EF6", avg: 69, min: 20, max: 96, belowThreshold: 1, description: "Product/service delivery standards, buyer satisfaction, returns rate." },
  { key: "speed", label: "Speed", accent: "#2BBFA0", avg: 63, min: 15, max: 92, belowThreshold: 2, description: "Response time, delivery SLA adherence, refill processing speed." },
  { key: "trust", label: "Trust", accent: "#67E8F9", avg: 68, min: 22, max: 95, belowThreshold: 1, description: "Verification completeness, fraud absence, community reputation." },
  { key: "compliance", label: "Compliance", accent: "#F0A030", avg: 62, min: 15, max: 93, belowThreshold: 2, description: "KYC/AML adherence, CRB certification status, policy violations." },
];

type LevelBucket = { level: number; count: number; avgScore: number };

const LEVEL_DISTRIBUTION: LevelBucket[] = [
  { level: 1, count: 423, avgScore: 14 },
  { level: 2, count: 312, avgScore: 28 },
  { level: 3, count: 567, avgScore: 42 },
  { level: 4, count: 891, avgScore: 55 },
  { level: 5, count: 1203, avgScore: 65 },
  { level: 6, count: 834, avgScore: 74 },
  { level: 7, count: 412, avgScore: 84 },
  { level: 8, count: 170, avgScore: 95 },
];

const FORMULA_WEIGHTS = [
  { dim: "Quality", weight: "30%", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7B6EF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l2.6 5.3 5.9.9-4.3 4.2 1 5.9L12 16.5l-5.3 2.8 1-5.9L3.5 9.2l5.9-.9L12 3z" /></svg> },
  { dim: "Speed", weight: "25%", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2BBFA0" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg> },
  { dim: "Trust", weight: "25%", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#67E8F9" strokeWidth="2" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg> },
  { dim: "Compliance", weight: "20%", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F0A030" strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><path d="M14 2v6h6" /><path d="M9 15l2 2 4-4" /></svg> },
];

function DimensionCard({ d }: { d: DimensionData }) {
  const pct = d.avg;
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#1A1D33]/80 p-5 pt-[22px] transition-all duration-200 hover:-translate-y-[1px] hover:border-white/20">
      <div className="pointer-events-none absolute left-0 right-0 top-0 h-[2px]" style={{ background: `linear-gradient(90deg, transparent, ${d.accent}, transparent)` }} />
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white">{d.label}</h3>
        <span className="font-mono text-lg font-bold" style={{ color: d.accent }}>{d.avg}</span>
      </div>
      <p className="mt-1 text-[11px] text-white/50">{d.description}</p>
      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/[0.06]">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${d.accent}90, ${d.accent})` }} />
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2">
        <div className="rounded-lg border border-white/8 bg-white/[0.03] p-2 text-center">
          <p className="text-[9px] text-white/40">Min</p>
          <p className="font-mono text-sm text-white/80">{d.min}</p>
        </div>
        <div className="rounded-lg border border-white/8 bg-white/[0.03] p-2 text-center">
          <p className="text-[9px] text-white/40">Max</p>
          <p className="font-mono text-sm text-white/80">{d.max}</p>
        </div>
        <div className="rounded-lg border border-white/8 bg-white/[0.03] p-2 text-center">
          <p className="text-[9px] text-white/40">&lt;40</p>
          <p className="font-mono text-sm text-[#F05858]">{d.belowThreshold}</p>
        </div>
      </div>
    </div>
  );
}

export default function StlBreakdownPage() {
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const totalEntities = LEVEL_DISTRIBUTION.reduce((s, b) => s + b.count, 0);
  const platformAvg = Math.round(DIMENSIONS.reduce((s, d) => s + d.avg, 0) / DIMENSIONS.length);
  const minAlerts = DIMENSIONS.reduce((s, d) => s + d.belowThreshold, 0);

  return (
    <div className="space-y-6">
      {/* Hero */}
      <header className="relative overflow-hidden rounded-2xl border border-[#7B6EF6]/30 bg-gradient-to-br from-[#13162A] via-[#1A1D33] to-[#13162A] p-6 pt-[22px]">
        <div className="pointer-events-none absolute left-0 right-0 top-0 h-[3px]" style={{ background: "linear-gradient(90deg, transparent, #7B6EF6 30%, #2BBFA0 50%, #F0A030 70%, transparent)" }} />
        <div className="pointer-events-none absolute left-3 top-3 h-6 w-6 border-l-[1.5px] border-t-[1.5px] border-[#7B6EF6]/50" />
        <div className="pointer-events-none absolute bottom-3 right-3 h-6 w-6 border-b-[1.5px] border-r-[1.5px] border-[#2BBFA0]/45" />
        <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-gradient-to-br from-[#7B6EF6]/18 via-[#2BBFA0]/12 to-transparent blur-3xl" />
        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 space-y-2">
            <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.22em]">
              <Link href="/dmo" className="text-white/40 hover:text-white/70 transition-colors">DMO</Link>
              <span className="text-white/25">/</span>
              <Link href="/dmo/stl" className="text-white/40 hover:text-white/70 transition-colors">STL</Link>
              <span className="text-white/25">/</span>
              <span className="text-[#7B6EF6]">Breakdown</span>
            </div>
            <h1 className="text-2xl font-bold text-white md:text-3xl">STL Dimension Breakdown</h1>
            <p className="max-w-2xl text-sm text-white/65">
              4-dimension analysis: Quality (30%), Speed (25%), Trust (25%), Compliance (20%).
              MIN rule: kisi bhi dimension ka score 40 se neeche gira to weighted total floor par set hota hai.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/dmo/stl" className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-white/75 transition-colors hover:border-white/20 hover:bg-white/[0.07] hover:text-white">STL Overview</Link>
            <Link href="/dmo/stl/scores" className="rounded-xl border border-[#2BBFA0]/50 bg-[#2BBFA0]/15 px-3 py-1.5 text-xs font-semibold text-[#2BBFA0] transition-colors hover:bg-[#2BBFA0]/25">Scores</Link>
          </div>
        </div>
      </header>

      {/* Stats row */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <VerificationStatCard tone="purple" label="Platform avg" value={platformAvg} sub="across dimensions" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><line x1="18" y1="20" x2="18" y2="10" stroke="currentColor" strokeWidth="1.6" /><line x1="12" y1="20" x2="12" y2="4" stroke="currentColor" strokeWidth="1.6" /><line x1="6" y1="20" x2="6" y2="14" stroke="currentColor" strokeWidth="1.6" /></svg>} />
        <VerificationStatCard tone="teal" label="Total entities" value={totalEntities.toLocaleString()} sub="L1–L8" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="1.6" /><circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.6" /></svg>} />
        <VerificationStatCard tone="red" label="MIN alerts" value={minAlerts} sub="dimension < 40" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M12 8v4m0 4h.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="currentColor" strokeWidth="1.4" /></svg>} />
        <VerificationStatCard tone="cyan" label="Dimensions" value={4} sub="weighted formula" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" /></svg>} />
      </section>

      {/* 4 dimension cards */}
      <section className="grid gap-4 md:grid-cols-2">
        {DIMENSIONS.map((d) => <DimensionCard key={d.key} d={d} />)}
      </section>

      {/* Formula reference */}
      <section className="relative overflow-hidden rounded-2xl border border-[#A098F8]/25 bg-[#13162A]/70 p-5 pt-[22px]">
        <div className="pointer-events-none absolute left-0 right-0 top-0 h-[3px]" style={{ background: "linear-gradient(90deg, transparent, #A098F8, transparent)" }} />
        <SectionHeader eyebrow="Formula" title="STL weighted calculation" hint="Protected by 58 gold-master regression tests" />
        <div className="mt-4 rounded-xl border border-white/10 bg-[#0C0E1A]/80 p-4 font-mono text-sm text-white/80">
          <span className="text-[#A098F8]">STL</span> = (<span className="text-[#7B6EF6]">Q</span> × 0.30) + (<span className="text-[#2BBFA0]">S</span> × 0.25) + (<span className="text-[#67E8F9]">T</span> × 0.25) + (<span className="text-[#F0A030]">C</span> × 0.20)
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {FORMULA_WEIGHTS.map((w) => (
            <div key={w.dim} className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#1A1D33]/80 p-3">
              {w.icon}
              <div>
                <p className="text-sm font-semibold text-white">{w.dim}</p>
                <p className="text-[11px] text-white/50">Weight: {w.weight}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3 rounded-lg border border-[#F05858]/25 bg-[#F05858]/8 p-3 text-[11px] text-[#F05858]/90">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="mr-1 inline-block"><path d="M12 8v4m0 4h.01" /><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /></svg>
          MIN Rule: Agar kisi bhi dimension D &lt; 40, to STL = min(weighted_total, D). Formula ko modify karne se pehle 58 tests pass hone chahiye.
        </div>
      </section>

      {/* Level distribution */}
      <section className="rounded-2xl border border-white/10 bg-[#13162A]/70 p-5">
        <SectionHeader title="Level distribution" hint="Click level to highlight" />
        <div className="mt-3">
          <SeverityMeter segments={LEVEL_DISTRIBUTION.map((b) => ({
            label: `L${b.level}`,
            value: b.count,
            tone: (b.level <= 3 ? "red" : b.level <= 5 ? "amber" : b.level <= 6 ? "teal" : "green") as VerificationTone,
          }))} />
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {LEVEL_DISTRIBUTION.map((b) => {
            const meta = getStlMeta(b.level);
            const selected = selectedLevel === b.level;
            return (
              <button
                key={b.level}
                type="button"
                onClick={() => setSelectedLevel(selected ? null : b.level)}
                className={`group relative overflow-hidden rounded-xl border p-3 pt-[18px] text-left transition-all duration-200 ${selected ? "border-white/25 bg-white/[0.06] -translate-y-[1px]" : "border-white/10 bg-[#1A1D33]/80 hover:-translate-y-[1px] hover:border-white/20"}`}
              >
                {selected && <div className="pointer-events-none absolute left-0 right-0 top-0 h-[2px]" style={{ background: `linear-gradient(90deg, transparent, ${meta.accent}, transparent)` }} />}
                <div className="flex items-center justify-between">
                  <STLBadge level={b.level as any} size="sm" />
                  <span className="font-mono text-lg font-bold" style={{ color: meta.accent }}>{b.count}</span>
                </div>
                <p className="mt-1 text-[10px] text-white/50">{meta.label}</p>
                <p className="mt-1 text-[10px] text-white/40">Avg score: <span className="text-white/70">{b.avgScore}</span></p>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
