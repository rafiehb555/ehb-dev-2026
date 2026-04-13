"use client";

/**
 * STL — Ranking Leaderboard
 * Top sellers/services ranked by STL score with level badges and trend indicators.
 * DESIGN-ONLY — in-file demo data, no fetch.
 */

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  VerificationStatCard,
  VerificationRowGrid,
  VerificationChip,
  SectionHeader,
  FilterChipRow,
  STLBadge,
  getStlMeta,
  type RowColumn,
  type VerificationTone,
} from "@/components/dmo/verification/VerificationUI";

type RankRow = {
  id: string;
  rank: number;
  name: string;
  entityType: "USER" | "SERVICE" | "PRODUCT";
  industry: string;
  score: number;
  level: number;
  trend: "up" | "down" | "stable";
  weekDelta: number;
  region: string;
};

const DEMO: RankRow[] = [
  { id: "R-01", rank: 1, name: "GoSellr Islamabad", entityType: "SERVICE", industry: "E-commerce", score: 94, level: 8, trend: "stable", weekDelta: 0, region: "Islamabad" },
  { id: "R-02", rank: 2, name: "AGTS Dubai Travel", entityType: "SERVICE", industry: "Travel", score: 88, level: 7, trend: "up", weekDelta: 3, region: "Dubai" },
  { id: "R-03", rank: 3, name: "Ali Raza", entityType: "USER", industry: "E-commerce", score: 82, level: 7, trend: "up", weekDelta: 5, region: "Lahore" },
  { id: "R-04", rank: 4, name: "WMS Karachi", entityType: "SERVICE", industry: "Medical", score: 73, level: 6, trend: "up", weekDelta: 8, region: "Karachi" },
  { id: "R-05", rank: 5, name: "OLS Legal Consult", entityType: "PRODUCT", industry: "Legal", score: 67, level: 5, trend: "up", weekDelta: 2, region: "Rawalpindi" },
  { id: "R-06", rank: 6, name: "TechHub Lahore", entityType: "SERVICE", industry: "IT", score: 62, level: 5, trend: "up", weekDelta: 10, region: "Lahore" },
  { id: "R-07", rank: 7, name: "Fatima Ahmed", entityType: "USER", industry: "Education", score: 56, level: 4, trend: "down", weekDelta: -4, region: "Faisalabad" },
  { id: "R-08", rank: 8, name: "Zara Boutique", entityType: "USER", industry: "Fashion", score: 56, level: 4, trend: "down", weekDelta: -15, region: "Karachi" },
  { id: "R-09", rank: 9, name: "Sara Noor", entityType: "USER", industry: "Legal", score: 45, level: 3, trend: "down", weekDelta: -2, region: "Islamabad" },
  { id: "R-10", rank: 10, name: "Usman Khan", entityType: "USER", industry: "E-commerce", score: 18, level: 1, trend: "stable", weekDelta: 4, region: "Peshawar" },
];

const TYPE_TONE: Record<string, VerificationTone> = { USER: "purple", SERVICE: "teal", PRODUCT: "cyan" };

function RankBadge({ rank }: { rank: number }) {
  const colors = rank === 1 ? { bg: "#F0A030", text: "#0C0E1A" } : rank === 2 ? { bg: "#C0C0C0", text: "#0C0E1A" } : rank === 3 ? { bg: "#CD7F32", text: "#0C0E1A" } : { bg: "rgba(255,255,255,0.08)", text: "rgba(255,255,255,0.6)" };
  return (
    <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-[11px] font-bold" style={{ background: colors.bg, color: colors.text }}>
      {rank}
    </span>
  );
}

export default function StlRankingPage() {
  const [rows] = useState(DEMO);
  const [industryFilter, setIndustryFilter] = useState<string>("ALL");

  const industries = useMemo(() => [...new Set(rows.map((r) => r.industry))], [rows]);
  const visible = industryFilter === "ALL" ? rows : rows.filter((r) => r.industry === industryFilter);

  const columns: RowColumn<RankRow>[] = [
    { key: "rank", header: "#", width: "minmax(0,0.4fr)", render: (r) => <RankBadge rank={r.rank} /> },
    { key: "name", header: "Entity", width: "minmax(0,2fr)", render: (r) => (
      <div className="min-w-0">
        <div className="truncate text-sm font-semibold text-white">{r.name}</div>
        <div className="text-[10px] text-white/40">{r.industry} · {r.region}</div>
      </div>
    )},
    { key: "type", header: "Type", width: "minmax(0,0.8fr)", render: (r) => <VerificationChip tone={TYPE_TONE[r.entityType]}>{r.entityType}</VerificationChip> },
    { key: "score", header: "Score", width: "minmax(0,0.7fr)", align: "right", render: (r) => <span className="font-mono text-sm font-semibold" style={{ color: getStlMeta(r.level).accent }}>{r.score}</span> },
    { key: "level", header: "Level", width: "minmax(0,0.6fr)", render: (r) => <STLBadge level={r.level as any} size="sm" /> },
    { key: "trend", header: "7d", width: "minmax(0,0.7fr)", align: "right", render: (r) => (
      <span className={`inline-flex items-center gap-1 font-mono text-[11px] font-semibold ${r.weekDelta > 0 ? "text-[#38C878]" : r.weekDelta < 0 ? "text-[#F05858]" : "text-white/40"}`}>
        {r.weekDelta > 0 ? (
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M23 6l-9.5 9.5-5-5L1 18" /></svg>
        ) : r.weekDelta < 0 ? (
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M23 18l-9.5-9.5-5 5L1 6" /></svg>
        ) : null}
        {r.weekDelta > 0 ? "+" : ""}{r.weekDelta}
      </span>
    )},
  ];

  return (
    <div className="space-y-6">
      <header className="relative overflow-hidden rounded-2xl border border-[#F0A030]/30 bg-gradient-to-br from-[#13162A] via-[#1A1D33] to-[#13162A] p-6 pt-[22px]">
        <div className="pointer-events-none absolute left-0 right-0 top-0 h-[3px]" style={{ background: "linear-gradient(90deg, transparent, #F0A030 25%, #7B6EF6 50%, #2BBFA0 75%, transparent)" }} />
        <div className="pointer-events-none absolute left-3 top-3 h-6 w-6 border-l-[1.5px] border-t-[1.5px] border-[#F0A030]/50" />
        <div className="pointer-events-none absolute bottom-3 right-3 h-6 w-6 border-b-[1.5px] border-r-[1.5px] border-[#7B6EF6]/45" />
        <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-gradient-to-br from-[#F0A030]/18 via-[#7B6EF6]/12 to-transparent blur-3xl" />
        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 space-y-2">
            <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.22em]">
              <Link href="/dmo" className="text-white/40 hover:text-white/70 transition-colors">DMO</Link>
              <span className="text-white/25">/</span>
              <Link href="/dmo/stl" className="text-white/40 hover:text-white/70 transition-colors">STL</Link>
              <span className="text-white/25">/</span>
              <span className="text-[#F0A030]">Ranking</span>
            </div>
            <h1 className="text-2xl font-bold text-white md:text-3xl">STL Leaderboard</h1>
            <p className="max-w-2xl text-sm text-white/65">
              Platform-wide trust ranking — top entities by STL score. 7-day delta tracking,
              industry filtering, aur regional breakdown.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/dmo/stl" className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-white/75 transition-colors hover:border-white/20 hover:bg-white/[0.07] hover:text-white">STL Overview</Link>
            <Link href="/dmo/stl/history" className="rounded-xl border border-cyan-400/50 bg-cyan-400/15 px-3 py-1.5 text-xs font-semibold text-cyan-200 transition-colors hover:bg-cyan-400/25">History</Link>
          </div>
        </div>
      </header>

      {/* Top 3 podium */}
      <section className="grid gap-4 md:grid-cols-3">
        {DEMO.slice(0, 3).map((r) => {
          const meta = getStlMeta(r.level);
          const medalColor = r.rank === 1 ? "#F0A030" : r.rank === 2 ? "#C0C0C0" : "#CD7F32";
          return (
            <div key={r.rank} className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#1A1D33]/80 p-5 pt-[22px] transition-all duration-200 hover:-translate-y-[1px] hover:border-white/20">
              <div className="pointer-events-none absolute left-0 right-0 top-0 h-[2px]" style={{ background: `linear-gradient(90deg, transparent, ${medalColor}, transparent)` }} />
              <div className="flex items-center gap-3">
                <RankBadge rank={r.rank} />
                <STLBadge level={r.level as any} size="md" />
              </div>
              <h3 className="mt-3 text-base font-semibold text-white">{r.name}</h3>
              <p className="mt-1 text-[11px] text-white/50">{r.industry} · {r.region}</p>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="font-mono text-2xl font-bold" style={{ color: meta.accent }}>{r.score}</span>
                <span className={`font-mono text-[11px] font-semibold ${r.weekDelta > 0 ? "text-[#38C878]" : r.weekDelta < 0 ? "text-[#F05858]" : "text-white/40"}`}>
                  {r.weekDelta > 0 ? "+" : ""}{r.weekDelta} (7d)
                </span>
              </div>
              <VerificationChip tone={TYPE_TONE[r.entityType]}>{r.entityType}</VerificationChip>
            </div>
          );
        })}
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <VerificationStatCard tone="amber" label="Ranked entities" value={rows.length} sub="platform-wide" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M12 3l2.6 5.3 5.9.9-4.3 4.2 1 5.9L12 16.5l-5.3 2.8 1-5.9L3.5 9.2l5.9-.9L12 3z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" /></svg>} />
        <VerificationStatCard tone="green" label="Biggest gainer" value="+10" sub="TechHub LHR" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M23 6l-9.5 9.5-5-5L1 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>} />
        <VerificationStatCard tone="red" label="Biggest drop" value="-15" sub="Zara Boutique" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M23 18l-9.5-9.5-5 5L1 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>} />
        <VerificationStatCard tone="purple" label="Industries" value={industries.length} sub="represented" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>} />
      </section>

      <section className="rounded-2xl border border-white/10 bg-[#13162A]/70 p-5">
        <SectionHeader eyebrow="Leaderboard" title="Full ranking" hint="Click industry chip to filter" right={<span className="text-[10px] text-white/45">{visible.length} entities</span>} />
        <div className="mt-3">
          <FilterChipRow<string> options={[
            { value: "ALL", label: `All · ${rows.length}` },
            ...industries.map((i) => ({ value: i, label: `${i} · ${rows.filter((r) => r.industry === i).length}` })),
          ]} value={industryFilter} onChange={setIndustryFilter} />
        </div>
        <div className="mt-4">
          <VerificationRowGrid<RankRow> rows={visible} columns={columns} getRowTone={(r) => r.rank <= 3 ? "green" : r.level <= 3 ? "red" : "amber"} emptyTitle="No entities match" emptyHint="Adjust filter." />
        </div>
      </section>
    </div>
  );
}
