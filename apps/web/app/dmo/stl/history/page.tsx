"use client";

/**
 * STL — History / Audit Log
 * Full change log: every score change with reason, entity, delta, timestamp.
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
  getStlMeta,
  type RowColumn,
  type VerificationTone,
} from "@/components/dmo/verification/VerificationUI";

type ChangeReason = "KYC_VERIFIED" | "CRB_CERTIFICATION" | "COMPLAINT_FILED" | "FRAUD_DETECTED" | "REFILL_COMPLETED" | "SLA_BREACH" | "PENALTY_APPLIED" | "MANUAL_OVERRIDE";

type HistoryRow = {
  id: string;
  entityName: string;
  entityType: "USER" | "SERVICE" | "PRODUCT";
  reason: ChangeReason;
  delta: number;
  scoreBefore: number;
  scoreAfter: number;
  levelBefore: number;
  levelAfter: number;
  operator: string;
  createdAt: string;
};

const REASON_TONE: Record<ChangeReason, VerificationTone> = {
  KYC_VERIFIED: "green", CRB_CERTIFICATION: "teal", COMPLAINT_FILED: "amber",
  FRAUD_DETECTED: "red", REFILL_COMPLETED: "green", SLA_BREACH: "red",
  PENALTY_APPLIED: "red", MANUAL_OVERRIDE: "purple",
};

const DEMO: HistoryRow[] = [
  { id: "H-001", entityName: "Ali Raza", entityType: "USER", reason: "KYC_VERIFIED", delta: 5, scoreBefore: 77, scoreAfter: 82, levelBefore: 6, levelAfter: 7, operator: "system", createdAt: "2026-04-12T10:00:00Z" },
  { id: "H-002", entityName: "GoSellr ISB", entityType: "SERVICE", reason: "COMPLAINT_FILED", delta: -3, scoreBefore: 97, scoreAfter: 94, levelBefore: 8, levelAfter: 8, operator: "dmo.ayesha", createdAt: "2026-04-12T09:30:00Z" },
  { id: "H-003", entityName: "Sara Noor", entityType: "USER", reason: "CRB_CERTIFICATION", delta: 12, scoreBefore: 33, scoreAfter: 45, levelBefore: 2, levelAfter: 3, operator: "system", createdAt: "2026-04-11T14:00:00Z" },
  { id: "H-004", entityName: "OLS Legal", entityType: "PRODUCT", reason: "FRAUD_DETECTED", delta: -8, scoreBefore: 75, scoreAfter: 67, levelBefore: 6, levelAfter: 5, operator: "ai.fraud_engine", createdAt: "2026-04-11T11:00:00Z" },
  { id: "H-005", entityName: "Usman Khan", entityType: "USER", reason: "REFILL_COMPLETED", delta: 4, scoreBefore: 14, scoreAfter: 18, levelBefore: 1, levelAfter: 1, operator: "system", createdAt: "2026-04-11T08:00:00Z" },
  { id: "H-006", entityName: "AGTS Dubai", entityType: "SERVICE", reason: "SLA_BREACH", delta: -6, scoreBefore: 94, scoreAfter: 88, levelBefore: 8, levelAfter: 7, operator: "dmo.sara", createdAt: "2026-04-10T16:00:00Z" },
  { id: "H-007", entityName: "WMS Karachi", entityType: "SERVICE", reason: "MANUAL_OVERRIDE", delta: 8, scoreBefore: 65, scoreAfter: 73, levelBefore: 5, levelAfter: 6, operator: "admin.rafi", createdAt: "2026-04-10T12:00:00Z" },
  { id: "H-008", entityName: "Zara Boutique", entityType: "USER", reason: "PENALTY_APPLIED", delta: -15, scoreBefore: 71, scoreAfter: 56, levelBefore: 6, levelAfter: 4, operator: "dmo.hamza", createdAt: "2026-04-09T17:00:00Z" },
  { id: "H-009", entityName: "TechHub LHR", entityType: "SERVICE", reason: "KYC_VERIFIED", delta: 10, scoreBefore: 52, scoreAfter: 62, levelBefore: 4, levelAfter: 5, operator: "system", createdAt: "2026-04-09T09:00:00Z" },
  { id: "H-010", entityName: "Fatima HPS", entityType: "USER", reason: "COMPLAINT_FILED", delta: -4, scoreBefore: 60, scoreAfter: 56, levelBefore: 5, levelAfter: 4, operator: "dmo.sara", createdAt: "2026-04-08T14:30:00Z" },
];

function fmt(iso: string) { const d = new Date(iso); return Number.isNaN(d.getTime()) ? iso : d.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" }); }
function InfoCell({ label, value, mono }: { label: string; value: React.ReactNode; mono?: boolean }) {
  return <div className="rounded-xl border border-white/8 bg-white/[0.03] p-3"><p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/45">{label}</p><p className={`mt-1 text-sm text-white/90 ${mono ? "font-mono" : ""}`}>{value}</p></div>;
}

export default function StlHistoryPage() {
  const [rows] = useState(DEMO);
  const [filter, setFilter] = useState<"ALL" | "positive" | "negative">("ALL");
  const [active, setActive] = useState<HistoryRow | null>(null);

  const visible = filter === "ALL" ? rows : filter === "positive" ? rows.filter((r) => r.delta > 0) : rows.filter((r) => r.delta < 0);

  const stats = useMemo(() => ({
    total: rows.length,
    positive: rows.filter((r) => r.delta > 0).length,
    negative: rows.filter((r) => r.delta < 0).length,
    levelChanges: rows.filter((r) => r.levelBefore !== r.levelAfter).length,
  }), [rows]);

  const columns: RowColumn<HistoryRow>[] = [
    { key: "entity", header: "Entity", width: "minmax(0,1.5fr)", render: (r) => (
      <div className="min-w-0"><div className="truncate text-sm font-semibold text-white">{r.entityName}</div><div className="font-mono text-[10px] text-white/40">{r.id}</div></div>
    )},
    { key: "reason", header: "Reason", width: "minmax(0,1.2fr)", render: (r) => <VerificationChip tone={REASON_TONE[r.reason]}>{r.reason.replace(/_/g, " ")}</VerificationChip> },
    { key: "delta", header: "Delta", width: "minmax(0,0.6fr)", align: "right", render: (r) => (
      <span className={`font-mono text-sm font-semibold ${r.delta > 0 ? "text-[#38C878]" : "text-[#F05858]"}`}>{r.delta > 0 ? "+" : ""}{r.delta}</span>
    )},
    { key: "score", header: "Score", width: "minmax(0,0.8fr)", align: "right", render: (r) => (
      <span className="text-[11px] text-white/60">{r.scoreBefore} → <span className="font-semibold text-white/90">{r.scoreAfter}</span></span>
    )},
    { key: "level", header: "Level", width: "minmax(0,0.7fr)", render: (r) => {
      const changed = r.levelBefore !== r.levelAfter;
      return <span className={`text-[11px] ${changed ? "font-semibold text-[#F0A030]" : "text-white/55"}`}>L{r.levelBefore}{changed ? ` → L${r.levelAfter}` : ""}</span>;
    }},
    { key: "time", header: "When", width: "minmax(0,1fr)", align: "right", render: (r) => <span className="text-[10px] text-white/45">{fmt(r.createdAt)}</span> },
  ];

  return (
    <div className="space-y-6">
      <header className="relative overflow-hidden rounded-2xl border border-cyan-400/30 bg-gradient-to-br from-[#13162A] via-[#1A1D33] to-[#13162A] p-6 pt-[22px]">
        <div className="pointer-events-none absolute left-0 right-0 top-0 h-[3px]" style={{ background: "linear-gradient(90deg, transparent, #67E8F9 30%, #2BBFA0 60%, transparent)" }} />
        <div className="pointer-events-none absolute left-3 top-3 h-6 w-6 border-l-[1.5px] border-t-[1.5px] border-cyan-400/50" />
        <div className="pointer-events-none absolute bottom-3 right-3 h-6 w-6 border-b-[1.5px] border-r-[1.5px] border-[#2BBFA0]/45" />
        <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-gradient-to-br from-cyan-400/18 via-[#2BBFA0]/12 to-transparent blur-3xl" />
        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 space-y-2">
            <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.22em]">
              <Link href="/dmo" className="text-white/40 hover:text-white/70 transition-colors">DMO</Link>
              <span className="text-white/25">/</span>
              <Link href="/dmo/stl" className="text-white/40 hover:text-white/70 transition-colors">STL</Link>
              <span className="text-white/25">/</span>
              <span className="text-cyan-300">History</span>
            </div>
            <h1 className="text-2xl font-bold text-white md:text-3xl">STL Change History</h1>
            <p className="max-w-2xl text-sm text-white/65">
              Har score change ka audit trail — reason, delta, operator, level transitions.
              Immutable log, backend wiring ke baad real-time sync hoga.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/dmo/stl" className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-white/75 transition-colors hover:border-white/20 hover:bg-white/[0.07] hover:text-white">STL Overview</Link>
            <Link href="/dmo/stl/ranking" className="rounded-xl border border-[#2BBFA0]/50 bg-[#2BBFA0]/15 px-3 py-1.5 text-xs font-semibold text-[#2BBFA0] transition-colors hover:bg-[#2BBFA0]/25">Ranking</Link>
          </div>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <VerificationStatCard tone="cyan" label="Total changes" value={stats.total} sub="audit entries" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" stroke="currentColor" strokeWidth="1.6" /></svg>} />
        <VerificationStatCard tone="green" label="Positive" value={stats.positive} sub="score gains" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M23 6l-9.5 9.5-5-5L1 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>} />
        <VerificationStatCard tone="red" label="Negative" value={stats.negative} sub="score drops" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M23 18l-9.5-9.5-5 5L1 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>} />
        <VerificationStatCard tone="amber" label="Level changes" value={stats.levelChanges} sub="tier transitions" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" /></svg>} />
      </section>

      <section className="rounded-2xl border border-white/10 bg-[#13162A]/70 p-5">
        <SectionHeader title="Change distribution" />
        <SeverityMeter segments={[
          { label: "Positive", value: stats.positive, tone: "green" },
          { label: "Negative", value: stats.negative, tone: "red" },
        ]} />
      </section>

      <section className="rounded-2xl border border-white/10 bg-[#13162A]/70 p-5">
        <SectionHeader eyebrow="Audit log" title="Change entries" hint="Click row for detail" right={<span className="text-[10px] text-white/45">{visible.length} row(s)</span>} />
        <div className="mt-3">
          <FilterChipRow<"ALL" | "positive" | "negative"> options={[
            { value: "ALL", label: `All · ${rows.length}` },
            { value: "positive", label: `Gains · ${stats.positive}` },
            { value: "negative", label: `Drops · ${stats.negative}` },
          ]} value={filter} onChange={setFilter} />
        </div>
        <div className="mt-4">
          <VerificationRowGrid<HistoryRow> rows={visible} columns={columns} onRowClick={setActive} getRowTone={(r) => r.delta > 0 ? "green" : "red"} emptyTitle="No changes match" emptyHint="Adjust filter." />
        </div>
      </section>

      <VerificationDrawer open={Boolean(active)} onClose={() => setActive(null)} title={active?.entityName ?? "Change detail"} subtitle={active ? `${active.id} · ${fmt(active.createdAt)}` : undefined} severity={active && active.delta < -10 ? "critical" : active && active.delta < 0 ? "warning" : "info"}>
        {active ? (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <VerificationChip tone={REASON_TONE[active.reason]}>{active.reason.replace(/_/g, " ")}</VerificationChip>
              <VerificationChip tone={active.delta > 0 ? "green" : "red"}>{active.delta > 0 ? "+" : ""}{active.delta} pts</VerificationChip>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
              <div className="flex items-center justify-center gap-4">
                <div className="text-center">
                  <p className="text-[10px] text-white/40">Before</p>
                  <p className="text-xl font-bold text-white/60">{active.scoreBefore}</p>
                  <p className="text-[10px]" style={{ color: getStlMeta(active.levelBefore).accent }}>L{active.levelBefore}</p>
                </div>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-40"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                <div className="text-center">
                  <p className="text-[10px] text-white/40">After</p>
                  <p className="text-xl font-bold" style={{ color: getStlMeta(active.levelAfter).accent }}>{active.scoreAfter}</p>
                  <p className="text-[10px]" style={{ color: getStlMeta(active.levelAfter).accent }}>L{active.levelAfter}</p>
                </div>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <InfoCell label="Operator" value={active.operator} mono />
              <InfoCell label="Entity type" value={active.entityType} />
              <InfoCell label="Reason" value={active.reason.replace(/_/g, " ")} />
              <InfoCell label="Timestamp" value={fmt(active.createdAt)} />
            </div>
          </div>
        ) : null}
      </VerificationDrawer>
    </div>
  );
}
