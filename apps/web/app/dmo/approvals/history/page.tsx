"use client";

/**
 * DMO — Approvals / History
 * Complete audit log of all approval decisions: approved, rejected, expired, auto-approved.
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
  type RowColumn,
  type VerificationTone,
} from "@/components/dmo/verification/VerificationUI";

type RequestType = "STL_UPGRADE" | "CRB_CERT" | "FRANCHISE_APP" | "REFILL" | "ACCOUNT_UNLOCK";

type DecisionType = "APPROVED" | "REJECTED" | "EXPIRED" | "AUTO_APPROVED";

type HistoryRow = {
  id: string;
  entityName: string;
  requestType: RequestType;
  decision: DecisionType;
  decidedBy: string;
  decidedAt: string;
  turnaroundHrs: number;
};

const REQUEST_TONE: Record<RequestType, VerificationTone> = {
  STL_UPGRADE: "purple",
  CRB_CERT: "teal",
  FRANCHISE_APP: "cyan",
  REFILL: "green",
  ACCOUNT_UNLOCK: "amber",
};

const DECISION_TONE: Record<DecisionType, VerificationTone> = {
  APPROVED: "green",
  REJECTED: "red",
  EXPIRED: "amber",
  AUTO_APPROVED: "cyan",
};

const DEMO: HistoryRow[] = [
  { id: "HST-001", entityName: "Ali Raza", requestType: "STL_UPGRADE", decision: "APPROVED", decidedBy: "dmo.ayesha", decidedAt: "2026-04-12T14:30:00Z", turnaroundHrs: 2.5 },
  { id: "HST-002", entityName: "GoSellr ISB", requestType: "CRB_CERT", decision: "APPROVED", decidedBy: "dmo.sara", decidedAt: "2026-04-12T13:15:00Z", turnaroundHrs: 4.2 },
  { id: "HST-003", entityName: "Sara Noor", requestType: "REFILL", decision: "AUTO_APPROVED", decidedBy: "system", decidedAt: "2026-04-12T11:00:00Z", turnaroundHrs: 0.5 },
  { id: "HST-004", entityName: "OLS Legal", requestType: "FRANCHISE_APP", decision: "APPROVED", decidedBy: "dmo.hamza", decidedAt: "2026-04-12T09:45:00Z", turnaroundHrs: 6.8 },
  { id: "HST-005", entityName: "Khalid Ahmed", requestType: "CRB_CERT", decision: "REJECTED", decidedBy: "dmo.ayesha", decidedAt: "2026-04-12T12:00:00Z", turnaroundHrs: 3.5 },
  { id: "HST-006", entityName: "Usman Khan", requestType: "ACCOUNT_UNLOCK", decision: "APPROVED", decidedBy: "dmo.ravi", decidedAt: "2026-04-11T16:20:00Z", turnaroundHrs: 1.3 },
  { id: "HST-007", entityName: "AGTS Dubai", requestType: "STL_UPGRADE", decision: "AUTO_APPROVED", decidedBy: "system", decidedAt: "2026-04-11T14:00:00Z", turnaroundHrs: 0.8 },
  { id: "HST-008", entityName: "TechVentures", requestType: "FRANCHISE_APP", decision: "REJECTED", decidedBy: "dmo.hamza", decidedAt: "2026-04-11T16:45:00Z", turnaroundHrs: 5.2 },
  { id: "HST-009", entityName: "WMS Karachi", requestType: "CRB_CERT", decision: "APPROVED", decidedBy: "dmo.yasmin", decidedAt: "2026-04-11T10:30:00Z", turnaroundHrs: 8.5 },
  { id: "HST-010", entityName: "Zara Boutique", requestType: "REFILL", decision: "EXPIRED", decidedBy: "system", decidedAt: "2026-04-10T20:15:00Z", turnaroundHrs: 24.0 },
];

function fmt(iso: string) { const d = new Date(iso); return Number.isNaN(d.getTime()) ? iso : d.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" }); }
function InfoCell({ label, value, mono }: { label: string; value: React.ReactNode; mono?: boolean }) {
  return <div className="rounded-xl border border-white/8 bg-white/[0.03] p-3"><p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/45">{label}</p><p className={`mt-1 text-sm text-white/90 ${mono ? "font-mono" : ""}`}>{value}</p></div>;
}

export default function ApprovalsHistoryPage() {
  const [rows] = useState(DEMO);
  const [filter, setFilter] = useState<DecisionType | "ALL">("ALL");
  const [active, setActive] = useState<HistoryRow | null>(null);

  const visible = filter === "ALL" ? rows : rows.filter((r) => r.decision === filter);

  const stats = useMemo(() => ({
    total: rows.length,
    approved: rows.filter((r) => r.decision === "APPROVED").length,
    rejected: rows.filter((r) => r.decision === "REJECTED").length,
    expired: rows.filter((r) => r.decision === "EXPIRED").length,
    autoApproved: rows.filter((r) => r.decision === "AUTO_APPROVED").length,
  }), [rows]);

  const columns: RowColumn<HistoryRow>[] = [
    { key: "entity", header: "Entity", width: "minmax(0,1.5fr)", render: (r) => (
      <div className="min-w-0"><div className="truncate text-sm font-semibold text-white">{r.entityName}</div><div className="font-mono text-[10px] text-white/40">{r.id}</div></div>
    )},
    { key: "type", header: "Request type", width: "minmax(0,1.1fr)", render: (r) => <VerificationChip tone={REQUEST_TONE[r.requestType]}>{r.requestType.replace(/_/g, " ")}</VerificationChip> },
    { key: "decision", header: "Decision", width: "minmax(0,1.1fr)", render: (r) => <VerificationChip tone={DECISION_TONE[r.decision]}>{r.decision.replace(/_/g, " ")}</VerificationChip> },
    { key: "turnaround", header: "Hours", width: "minmax(0,0.7fr)", align: "right", render: (r) => (
      <span className="font-mono text-sm text-white/70">{r.turnaroundHrs.toFixed(1)}h</span>
    )},
    { key: "time", header: "When", width: "minmax(0,1.2fr)", align: "right", render: (r) => <span className="text-[10px] text-white/45">{fmt(r.decidedAt)}</span> },
  ];

  return (
    <div className="space-y-6">
      <header className="relative overflow-hidden rounded-2xl border border-purple-400/30 bg-gradient-to-br from-[#13162A] via-[#1A1D33] to-[#13162A] p-6 pt-[22px]">
        <div className="pointer-events-none absolute left-0 right-0 top-0 h-[3px]" style={{ background: "linear-gradient(90deg, transparent, #7B6EF6 30%, #A098F8 60%, transparent)" }} />
        <div className="pointer-events-none absolute left-3 top-3 h-6 w-6 border-l-[1.5px] border-t-[1.5px] border-purple-400/50" />
        <div className="pointer-events-none absolute bottom-3 right-3 h-6 w-6 border-b-[1.5px] border-r-[1.5px] border-[#A098F8]/45" />
        <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-gradient-to-br from-purple-400/18 via-[#7B6EF6]/12 to-transparent blur-3xl" />
        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 space-y-2">
            <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.22em]">
              <Link href="/dmo" className="text-white/40 hover:text-white/70 transition-colors">DMO</Link>
              <span className="text-white/25">/</span>
              <Link href="/dmo/approvals" className="text-white/40 hover:text-white/70 transition-colors">Approvals</Link>
              <span className="text-white/25">/</span>
              <span className="text-purple-300">History</span>
            </div>
            <h1 className="text-2xl font-bold text-white md:text-3xl">Approval history</h1>
            <p className="max-w-2xl text-sm text-white/65">
              Tamam decisions ka complete audit log: approved, rejected, expired, aur auto-approved items. Turnaround times aur decision patterns dekhain.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/dmo/approvals" className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-white/75 transition-colors hover:border-white/20 hover:bg-white/[0.07] hover:text-white">Pending</Link>
            <Link href="/dmo/approvals/approved" className="rounded-xl border border-[#38C878]/50 bg-[#38C878]/15 px-3 py-1.5 text-xs font-semibold text-[#38C878] transition-colors hover:bg-[#38C878]/25">Approved</Link>
          </div>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <VerificationStatCard tone="purple" label="Total decisions" value={stats.total} sub="audit entries" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" stroke="currentColor" strokeWidth="1.6" /></svg>} />
        <VerificationStatCard tone="green" label="Approved" value={stats.approved} sub="accepted" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><polyline points="20 6 9 17 4 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>} />
        <VerificationStatCard tone="red" label="Rejected" value={stats.rejected} sub="denied" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" /><line x1="8" y1="16" x2="16" y2="8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>} />
        <VerificationStatCard tone="cyan" label="Auto-approved" value={stats.autoApproved} sub="system" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="currentColor" /></svg>} />
      </section>

      <section className="rounded-2xl border border-white/10 bg-[#13162A]/70 p-5">
        <SectionHeader title="Decision distribution" hint="Visual breakdown by status" />
        <SeverityMeter segments={[
          { label: "Approved", value: stats.approved, tone: "green" },
          { label: "Rejected", value: stats.rejected, tone: "red" },
          { label: "Expired", value: stats.expired, tone: "amber" },
          { label: "Auto", value: stats.autoApproved, tone: "cyan" },
        ]} />
      </section>

      <section className="rounded-2xl border border-white/10 bg-[#13162A]/70 p-5">
        <SectionHeader eyebrow="Filter" title="Decision type" hint="Narrow by status" right={<span className="text-[10px] text-white/45">{visible.length} row(s)</span>} />
        <div className="mt-3">
          <FilterChipRow<DecisionType | "ALL"> options={[
            { value: "ALL", label: `All · ${rows.length}` },
            { value: "APPROVED", label: `Approved · ${stats.approved}` },
            { value: "REJECTED", label: `Rejected · ${stats.rejected}` },
            { value: "EXPIRED", label: `Expired · ${stats.expired}` },
            { value: "AUTO_APPROVED", label: `Auto · ${stats.autoApproved}` },
          ]} value={filter} onChange={setFilter} />
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-[#13162A]/70 p-5">
        <SectionHeader eyebrow="Audit log" title="All decisions" hint="Click row for detail" right={<span className="text-[10px] text-white/45">{visible.length} row(s)</span>} />
        <div className="mt-4">
          <VerificationRowGrid<HistoryRow> rows={visible} columns={columns} onRowClick={setActive} getRowTone={(r) => DECISION_TONE[r.decision]} emptyTitle="No decisions match" emptyHint="Adjust filter." />
        </div>
      </section>

      <VerificationDrawer open={Boolean(active)} onClose={() => setActive(null)} title={active?.entityName ?? "Decision detail"} subtitle={active ? `${active.id} · ${fmt(active.decidedAt)}` : undefined} severity={active?.decision === "REJECTED" ? "warning" : active?.decision === "EXPIRED" ? "critical" : "info"}>
        {active ? (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <VerificationChip tone={REQUEST_TONE[active.requestType]}>{active.requestType.replace(/_/g, " ")}</VerificationChip>
              <VerificationChip tone={DECISION_TONE[active.decision]}>{active.decision.replace(/_/g, " ")}</VerificationChip>
            </div>
            <InfoCell label="Request ID" value={active.id} mono />
            <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
              <p className="text-[10px] text-white/40 mb-2">Processing time</p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-white/80">{active.turnaroundHrs.toFixed(1)}</span>
                <span className="text-sm text-white/60">hours</span>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <InfoCell label="Decided by" value={active.decidedBy === "system" ? "Automated" : active.decidedBy} mono />
              <InfoCell label="Decided at" value={fmt(active.decidedAt)} />
            </div>
            <div className="rounded-xl border border-white/8 bg-white/[0.02] p-3">
              <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/45 mb-2">Decision summary</p>
              <p className="text-sm text-white/80">Request processed in {active.turnaroundHrs.toFixed(1)} hours. Decision made by {active.decidedBy === "system" ? "automated system" : "DMO staff"}. Status: {active.decision.toLowerCase()}.</p>
            </div>
          </div>
        ) : null}
      </VerificationDrawer>
    </div>
  );
}
