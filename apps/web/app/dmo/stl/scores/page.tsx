"use client";

/**
 * STL — Scores Explorer
 * Full seller/user score grid with live filters, drill-in drawer.
 * DESIGN-ONLY — in-file demo data, no fetch.
 */

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  VerificationStatCard,
  VerificationRowGrid,
  VerificationDrawer,
  VerificationChip,
  SectionHeader,
  FilterChipRow,
  SeverityMeter,
  STLBadge,
  getStlMeta,
  type RowColumn,
  type VerificationTone,
} from "@/components/dmo/verification/VerificationUI";

type EntityType = "USER" | "SERVICE" | "PRODUCT";

type ScoreRow = {
  id: string;
  name: string;
  entityType: EntityType;
  score: number;
  level: number;
  dimensions: { quality: number; speed: number; trust: number; compliance: number };
  trend: "up" | "down" | "stable";
  lastUpdated: string;
};

const DEMO: ScoreRow[] = [
  { id: "STL-S01", name: "Ali Raza (GoSellr)", entityType: "USER", score: 82, level: 7, dimensions: { quality: 88, speed: 79, trust: 85, compliance: 76 }, trend: "up", lastUpdated: "2026-04-12T10:00:00Z" },
  { id: "STL-S02", name: "GoSellr Islamabad", entityType: "SERVICE", score: 94, level: 8, dimensions: { quality: 96, speed: 92, trust: 95, compliance: 93 }, trend: "stable", lastUpdated: "2026-04-12T09:30:00Z" },
  { id: "STL-S03", name: "Sara Noor (OLS)", entityType: "USER", score: 45, level: 3, dimensions: { quality: 50, speed: 42, trust: 48, compliance: 40 }, trend: "down", lastUpdated: "2026-04-11T14:00:00Z" },
  { id: "STL-S04", name: "OLS Legal Consult", entityType: "PRODUCT", score: 67, level: 5, dimensions: { quality: 72, speed: 65, trust: 68, compliance: 63 }, trend: "up", lastUpdated: "2026-04-11T11:00:00Z" },
  { id: "STL-S05", name: "Usman Khan (New)", entityType: "USER", score: 18, level: 1, dimensions: { quality: 20, speed: 15, trust: 22, compliance: 15 }, trend: "stable", lastUpdated: "2026-04-12T08:00:00Z" },
  { id: "STL-S06", name: "WMS Karachi", entityType: "SERVICE", score: 73, level: 6, dimensions: { quality: 78, speed: 70, trust: 75, compliance: 69 }, trend: "up", lastUpdated: "2026-04-10T16:00:00Z" },
  { id: "STL-S07", name: "AGTS Dubai Travel", entityType: "SERVICE", score: 88, level: 7, dimensions: { quality: 90, speed: 85, trust: 92, compliance: 85 }, trend: "up", lastUpdated: "2026-04-12T07:00:00Z" },
  { id: "STL-S08", name: "Fatima Ahmed (HPS)", entityType: "USER", score: 56, level: 4, dimensions: { quality: 60, speed: 55, trust: 58, compliance: 51 }, trend: "down", lastUpdated: "2026-04-09T13:00:00Z" },
];

const TYPE_TONE: Record<EntityType, VerificationTone> = { USER: "purple", SERVICE: "teal", PRODUCT: "cyan" };
const TREND_TONE: Record<ScoreRow["trend"], VerificationTone> = { up: "green", down: "red", stable: "amber" };

function fmt(iso: string) {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
}

function InfoCell({ label, value, mono }: { label: string; value: React.ReactNode; mono?: boolean }) {
  return (
    <div className="rounded-xl border border-white/8 bg-white/[0.03] p-3">
      <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/45">{label}</p>
      <p className={`mt-1 text-sm text-white/90 ${mono ? "font-mono" : ""}`}>{value}</p>
    </div>
  );
}

function DimensionBar({ label, value, accent }: { label: string; value: number; accent: string }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-white/55">{label}</span>
        <span className="font-mono text-[11px] text-white/80">{value}</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${value}%`, background: accent }} />
      </div>
    </div>
  );
}

export default function StlScoresPage() {
  const [rows] = useState(DEMO);
  const [typeFilter, setTypeFilter] = useState<"ALL" | EntityType>("ALL");
  const [active, setActive] = useState<ScoreRow | null>(null);

  const visible = typeFilter === "ALL" ? rows : rows.filter((r) => r.entityType === typeFilter);

  const stats = useMemo(() => ({
    total: rows.length,
    avgScore: Math.round(rows.reduce((s, r) => s + r.score, 0) / rows.length),
    elite: rows.filter((r) => r.level >= 7).length,
    atRisk: rows.filter((r) => r.level <= 3).length,
  }), [rows]);

  const columns: RowColumn<ScoreRow>[] = [
    {
      key: "entity", header: "Entity", width: "minmax(0,2fr)",
      render: (r) => (
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-white">{r.name}</div>
          <div className="font-mono text-[10px] text-white/40">{r.id}</div>
        </div>
      ),
    },
    { key: "type", header: "Type", width: "minmax(0,0.8fr)", render: (r) => <VerificationChip tone={TYPE_TONE[r.entityType]}>{r.entityType}</VerificationChip> },
    {
      key: "score", header: "Score", width: "minmax(0,0.7fr)", align: "right",
      render: (r) => <span className="font-mono text-sm font-semibold" style={{ color: getStlMeta(r.level).accent }}>{r.score}</span>,
    },
    { key: "level", header: "Level", width: "minmax(0,0.7fr)", render: (r) => <STLBadge level={r.level as any} size="sm" /> },
    { key: "trend", header: "Trend", width: "minmax(0,0.7fr)", render: (r) => (
      <span className="inline-flex items-center gap-1">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {r.trend === "up" ? <path d="M23 6l-9.5 9.5-5-5L1 18" /> : r.trend === "down" ? <path d="M23 18l-9.5-9.5-5 5L1 6" /> : <path d="M5 12h14" />}
        </svg>
        <VerificationChip tone={TREND_TONE[r.trend]} size="xs">{r.trend}</VerificationChip>
      </span>
    )},
    { key: "updated", header: "Updated", width: "minmax(0,1fr)", align: "right", render: (r) => <span className="text-[10px] text-white/45">{fmt(r.lastUpdated)}</span> },
  ];

  return (
    <div className="space-y-6">
      {/* Hero */}
      <header className="relative overflow-hidden rounded-2xl border border-[#2BBFA0]/30 bg-gradient-to-br from-[#13162A] via-[#1A1D33] to-[#13162A] p-6 pt-[22px]">
        <div className="pointer-events-none absolute left-0 right-0 top-0 h-[3px]" style={{ background: "linear-gradient(90deg, transparent 0%, #2BBFA0 25%, #7B6EF6 50%, #67E8F9 75%, transparent 100%)" }} />
        <div className="pointer-events-none absolute left-3 top-3 h-6 w-6 border-l-[1.5px] border-t-[1.5px] border-[#2BBFA0]/50" />
        <div className="pointer-events-none absolute bottom-3 right-3 h-6 w-6 border-b-[1.5px] border-r-[1.5px] border-[#7B6EF6]/45" />
        <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-gradient-to-br from-[#2BBFA0]/20 via-[#7B6EF6]/12 to-transparent blur-3xl" />
        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 space-y-2">
            <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.22em]">
              <Link href="/dmo" className="text-white/40 hover:text-white/70 transition-colors">DMO</Link>
              <span className="text-white/25">/</span>
              <Link href="/dmo/stl" className="text-white/40 hover:text-white/70 transition-colors">STL</Link>
              <span className="text-white/25">/</span>
              <span className="text-[#2BBFA0]">Scores</span>
            </div>
            <h1 className="text-2xl font-bold text-white md:text-3xl">STL Score Explorer</h1>
            <p className="max-w-2xl text-sm text-white/65">
              Har entity ka real-time trust score — dimensions (quality, speed, trust, compliance)
              ke saath. MIN rule: koi bhi dimension 40 se kam ho to floor trigger.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/dmo/stl" className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-white/75 transition-colors hover:border-white/20 hover:bg-white/[0.07] hover:text-white">STL Overview</Link>
            <Link href="/dmo/stl/breakdown" className="rounded-xl border border-[#7B6EF6]/50 bg-[#7B6EF6]/15 px-3 py-1.5 text-xs font-semibold text-[#A098F8] transition-colors hover:bg-[#7B6EF6]/25">Breakdown</Link>
          </div>
        </div>
      </header>

      {/* Stats */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <VerificationStatCard tone="teal" label="Total entities" value={stats.total} sub="tracked" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="1.6" /><circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.6" /><path d="M22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" strokeWidth="1.6" /></svg>} />
        <VerificationStatCard tone="purple" label="Avg score" value={stats.avgScore} sub="platform-wide" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M12 3l2.6 5.3 5.9.9-4.3 4.2 1 5.9L12 16.5l-5.3 2.8 1-5.9L3.5 9.2l5.9-.9L12 3z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" /></svg>} />
        <VerificationStatCard tone="green" label="Elite (L7+)" value={stats.elite} sub="high trust" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="1.6" /></svg>} />
        <VerificationStatCard tone="red" label="At risk (L1–L3)" value={stats.atRisk} sub="needs attention" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M12 8v4m0 4h.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="currentColor" strokeWidth="1.4" /></svg>} />
      </section>

      {/* Distribution */}
      <section className="rounded-2xl border border-white/10 bg-[#13162A]/70 p-5">
        <SectionHeader title="Level distribution" hint="Across all entity types" />
        <SeverityMeter segments={[
          { label: "L1–L3", value: stats.atRisk, tone: "red" },
          { label: "L4–L5", value: rows.filter((r) => r.level >= 4 && r.level <= 5).length, tone: "amber" },
          { label: "L6", value: rows.filter((r) => r.level === 6).length, tone: "teal" },
          { label: "L7–L8", value: stats.elite, tone: "green" },
        ]} />
      </section>

      {/* Score grid */}
      <section className="rounded-2xl border border-white/10 bg-[#13162A]/70 p-5">
        <SectionHeader eyebrow="Trust scores" title="All entities" hint="Click row for dimension breakdown" right={<span className="text-[10px] text-white/45">{visible.length} row(s)</span>} />
        <div className="mt-3">
          <FilterChipRow<"ALL" | EntityType> options={[
            { value: "ALL", label: `All · ${rows.length}` },
            { value: "USER", label: `Users · ${rows.filter((r) => r.entityType === "USER").length}` },
            { value: "SERVICE", label: `Services · ${rows.filter((r) => r.entityType === "SERVICE").length}` },
            { value: "PRODUCT", label: `Products · ${rows.filter((r) => r.entityType === "PRODUCT").length}` },
          ]} value={typeFilter} onChange={setTypeFilter} />
        </div>
        <div className="mt-4">
          <VerificationRowGrid<ScoreRow> rows={visible} columns={columns} onRowClick={setActive} getRowTone={(r) => r.level >= 7 ? "green" : r.level <= 3 ? "red" : "amber"} emptyTitle="No scores match" emptyHint="Adjust filter." />
        </div>
      </section>

      {/* Drawer */}
      <VerificationDrawer open={Boolean(active)} onClose={() => setActive(null)} title={active?.name ?? "Score detail"} subtitle={active ? `${active.id} · Updated ${fmt(active.lastUpdated)}` : undefined} severity={active && active.level <= 3 ? "high" : "info"}>
        {active ? (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <STLBadge level={active.level as any} size="lg" />
              <div>
                <p className="text-2xl font-bold" style={{ color: getStlMeta(active.level).accent }}>{active.score}</p>
                <p className="text-[11px] text-white/55">L{active.level} · {getStlMeta(active.level).label}</p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <InfoCell label="Entity type" value={<VerificationChip tone={TYPE_TONE[active.entityType]}>{active.entityType}</VerificationChip>} />
              <InfoCell label="Trend" value={<VerificationChip tone={TREND_TONE[active.trend]}>{active.trend}</VerificationChip>} />
            </div>

            <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/45 mb-3">Dimension breakdown</p>
              <div className="space-y-3">
                <DimensionBar label="Quality" value={active.dimensions.quality} accent="#7B6EF6" />
                <DimensionBar label="Speed" value={active.dimensions.speed} accent="#2BBFA0" />
                <DimensionBar label="Trust" value={active.dimensions.trust} accent="#67E8F9" />
                <DimensionBar label="Compliance" value={active.dimensions.compliance} accent="#F0A030" />
              </div>
              {Object.values(active.dimensions).some((v) => v < 40) && (
                <div className="mt-3 rounded-lg border border-[#F05858]/30 bg-[#F05858]/10 p-2 text-[11px] text-[#F05858]">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="mr-1 inline-block"><path d="M12 8v4m0 4h.01" /><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /></svg>
                  MIN rule triggered — dimension below 40 sets score floor.
                </div>
              )}
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <InfoCell label="Score ID" value={active.id} mono />
              <InfoCell label="Last updated" value={fmt(active.lastUpdated)} />
            </div>
          </div>
        ) : null}
      </VerificationDrawer>
    </div>
  );
}
