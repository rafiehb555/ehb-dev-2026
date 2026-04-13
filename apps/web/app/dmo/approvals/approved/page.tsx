"use client";

/**
 * DMO — Approvals / Approved
 * Complete list of approved requests: STL upgrades, CRB certs, franchise apps, etc.
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
  type RowColumn,
  type VerificationTone,
} from "@/components/dmo/verification/VerificationUI";

type RequestType = "STL_UPGRADE" | "CRB_CERT" | "FRANCHISE_APP" | "REFILL" | "ACCOUNT_UNLOCK";

type ApprovedRow = {
  id: string;
  entityName: string;
  requestType: RequestType;
  approvedBy: string;
  approvedAt: string;
  turnaroundHrs: number;
  notes: string;
};

const REQUEST_TONE: Record<RequestType, VerificationTone> = {
  STL_UPGRADE: "purple",
  CRB_CERT: "teal",
  FRANCHISE_APP: "cyan",
  REFILL: "green",
  ACCOUNT_UNLOCK: "amber",
};

const DEMO: ApprovedRow[] = [
  { id: "APR-001", entityName: "Ali Raza", requestType: "STL_UPGRADE", approvedBy: "dmo.ayesha", approvedAt: "2026-04-12T14:30:00Z", turnaroundHrs: 2.5, notes: "KYC verification complete, all docs valid" },
  { id: "APR-002", entityName: "GoSellr ISB", requestType: "CRB_CERT", approvedBy: "dmo.sara", approvedAt: "2026-04-12T13:15:00Z", turnaroundHrs: 4.2, notes: "Legal review passed, certificate issued" },
  { id: "APR-003", entityName: "Sara Noor", requestType: "REFILL", approvedBy: "system", approvedAt: "2026-04-12T11:00:00Z", turnaroundHrs: 0.5, notes: "Auto-approved: refill quota met, no holds" },
  { id: "APR-004", entityName: "OLS Legal", requestType: "FRANCHISE_APP", approvedBy: "dmo.hamza", approvedAt: "2026-04-12T09:45:00Z", turnaroundHrs: 6.8, notes: "Corporate review passed, franchise tier L7" },
  { id: "APR-005", entityName: "Usman Khan", requestType: "ACCOUNT_UNLOCK", approvedBy: "dmo.ravi", approvedAt: "2026-04-11T16:20:00Z", turnaroundHrs: 1.3, notes: "Security freeze lifted after 2FA verification" },
  { id: "APR-006", entityName: "AGTS Dubai", requestType: "STL_UPGRADE", approvedBy: "system", approvedAt: "2026-04-11T14:00:00Z", turnaroundHrs: 0.8, notes: "Auto-approved: complaint resolved, SLA restored" },
  { id: "APR-007", entityName: "WMS Karachi", requestType: "CRB_CERT", approvedBy: "dmo.yasmin", approvedAt: "2026-04-11T10:30:00Z", turnaroundHrs: 8.5, notes: "Enhanced verification complete, tier L6 cert" },
  { id: "APR-008", entityName: "Zara Boutique", requestType: "REFILL", approvedBy: "system", approvedAt: "2026-04-10T20:15:00Z", turnaroundHrs: 0.3, notes: "Auto-approved: refill request, service active" },
];

function fmt(iso: string) { const d = new Date(iso); return Number.isNaN(d.getTime()) ? iso : d.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" }); }
function InfoCell({ label, value, mono }: { label: string; value: React.ReactNode; mono?: boolean }) {
  return <div className="rounded-xl border border-white/8 bg-white/[0.03] p-3"><p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/45">{label}</p><p className={`mt-1 text-sm text-white/90 ${mono ? "font-mono" : ""}`}>{value}</p></div>;
}

export default function ApprovalsApprovedPage() {
  const [rows] = useState(DEMO);
  const [filter, setFilter] = useState<RequestType | "ALL">("ALL");
  const [active, setActive] = useState<ApprovedRow | null>(null);

  const visible = filter === "ALL" ? rows : rows.filter((r) => r.requestType === filter);

  const stats = useMemo(() => ({
    total: rows.length,
    thisWeek: rows.filter((r) => {
      const d = new Date(r.approvedAt);
      const now = new Date("2026-04-12T15:00:00Z");
      const diff = (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24);
      return diff <= 7;
    }).length,
    avgTurnaround: (rows.reduce((sum, r) => sum + r.turnaroundHrs, 0) / rows.length).toFixed(1),
    autoApproved: rows.filter((r) => r.approvedBy === "system").length,
  }), [rows]);

  const columns: RowColumn<ApprovedRow>[] = [
    { key: "entity", header: "Entity", width: "minmax(0,1.5fr)", render: (r) => (
      <div className="min-w-0"><div className="truncate text-sm font-semibold text-white">{r.entityName}</div><div className="font-mono text-[10px] text-white/40">{r.id}</div></div>
    )},
    { key: "type", header: "Request type", width: "minmax(0,1.2fr)", render: (r) => <VerificationChip tone={REQUEST_TONE[r.requestType]}>{r.requestType.replace(/_/g, " ")}</VerificationChip> },
    { key: "turnaround", header: "Turnaround", width: "minmax(0,0.8fr)", align: "right", render: (r) => <span className="font-mono text-sm text-[#2BBFA0]">{r.turnaroundHrs.toFixed(1)}h</span> },
    { key: "approver", header: "Approved by", width: "minmax(0,1fr)", render: (r) => (
      <span className="text-[11px] text-white/60">{r.approvedBy === "system" ? "Auto" : r.approvedBy.split(".")[1] || r.approvedBy}</span>
    )},
    { key: "time", header: "When", width: "minmax(0,1.2fr)", align: "right", render: (r) => <span className="text-[10px] text-white/45">{fmt(r.approvedAt)}</span> },
  ];

  return (
    <div className="space-y-6">
      <header className="relative overflow-hidden rounded-2xl border border-green-400/30 bg-gradient-to-br from-[#13162A] via-[#1A1D33] to-[#13162A] p-6 pt-[22px]">
        <div className="pointer-events-none absolute left-0 right-0 top-0 h-[3px]" style={{ background: "linear-gradient(90deg, transparent, #38C878 30%, #2BBFA0 60%, transparent)" }} />
        <div className="pointer-events-none absolute left-3 top-3 h-6 w-6 border-l-[1.5px] border-t-[1.5px] border-green-400/50" />
        <div className="pointer-events-none absolute bottom-3 right-3 h-6 w-6 border-b-[1.5px] border-r-[1.5px] border-[#2BBFA0]/45" />
        <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-gradient-to-br from-green-400/18 via-[#2BBFA0]/12 to-transparent blur-3xl" />
        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 space-y-2">
            <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.22em]">
              <Link href="/dmo" className="text-white/40 hover:text-white/70 transition-colors">DMO</Link>
              <span className="text-white/25">/</span>
              <Link href="/dmo/approvals" className="text-white/40 hover:text-white/70 transition-colors">Approvals</Link>
              <span className="text-white/25">/</span>
              <span className="text-green-300">Approved</span>
            </div>
            <h1 className="text-2xl font-bold text-white md:text-3xl">Approved requests</h1>
            <p className="max-w-2xl text-sm text-white/65">
              Tamam approved requests: STL upgrades, CRB certifications, franchises, refills. Fast turnaround aur auto-approvals shaamil.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/dmo/approvals" className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-white/75 transition-colors hover:border-white/20 hover:bg-white/[0.07] hover:text-white">Pending</Link>
            <Link href="/dmo/approvals/rejected" className="rounded-xl border border-[#F05858]/50 bg-[#F05858]/15 px-3 py-1.5 text-xs font-semibold text-[#F05858] transition-colors hover:bg-[#F05858]/25">Rejected</Link>
          </div>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <VerificationStatCard tone="green" label="Total approved" value={stats.total} sub="completed" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><polyline points="20 6 9 17 4 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>} />
        <VerificationStatCard tone="cyan" label="This week" value={stats.thisWeek} sub="approvals" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" /><polyline points="16 2 16 6 8 6 8 2" stroke="currentColor" strokeWidth="1.5" /><line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="1.5" /></svg>} />
        <VerificationStatCard tone="amber" label="Avg turnaround" value={parseFloat(stats.avgTurnaround as string)} sub="hours" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" /><polyline points="12 7 12 12 16 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>} />
        <VerificationStatCard tone="purple" label="Auto-approved" value={stats.autoApproved} sub="system" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="currentColor" /></svg>} />
      </section>

      <section className="rounded-2xl border border-white/10 bg-[#13162A]/70 p-5">
        <SectionHeader eyebrow="Filter" title="Request types" hint="Narrow by category" right={<span className="text-[10px] text-white/45">{visible.length} row(s)</span>} />
        <div className="mt-3">
          <FilterChipRow<RequestType | "ALL"> options={[
            { value: "ALL", label: `All · ${rows.length}` },
            { value: "STL_UPGRADE", label: `STL · ${rows.filter((r) => r.requestType === "STL_UPGRADE").length}` },
            { value: "CRB_CERT", label: `CRB · ${rows.filter((r) => r.requestType === "CRB_CERT").length}` },
            { value: "FRANCHISE_APP", label: `Franchise · ${rows.filter((r) => r.requestType === "FRANCHISE_APP").length}` },
            { value: "REFILL", label: `Refill · ${rows.filter((r) => r.requestType === "REFILL").length}` },
            { value: "ACCOUNT_UNLOCK", label: `Unlock · ${rows.filter((r) => r.requestType === "ACCOUNT_UNLOCK").length}` },
          ]} value={filter} onChange={setFilter} />
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-[#13162A]/70 p-5">
        <SectionHeader eyebrow="Details" title="Approved items" hint="Click row for detail" right={<span className="text-[10px] text-white/45">{visible.length} row(s)</span>} />
        <div className="mt-4">
          <VerificationRowGrid<ApprovedRow> rows={visible} columns={columns} onRowClick={setActive} getRowTone={() => "green"} emptyTitle="No approvals match" emptyHint="Adjust filter." />
        </div>
      </section>

      <VerificationDrawer open={Boolean(active)} onClose={() => setActive(null)} title={active?.entityName ?? "Approval detail"} subtitle={active ? `${active.id} · ${fmt(active.approvedAt)}` : undefined} severity="info">
        {active ? (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <VerificationChip tone={REQUEST_TONE[active.requestType]}>{active.requestType.replace(/_/g, " ")}</VerificationChip>
              <VerificationChip tone="green">Approved</VerificationChip>
            </div>
            <InfoCell label="Request ID" value={active.id} mono />
            <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
              <p className="text-[10px] text-white/40 mb-2">Turnaround time</p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-[#2BBFA0]">{active.turnaroundHrs.toFixed(1)}</span>
                <span className="text-sm text-white/60">hours</span>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <InfoCell label="Approved by" value={active.approvedBy === "system" ? "Automated system" : active.approvedBy} mono />
              <InfoCell label="Approved at" value={fmt(active.approvedAt)} />
            </div>
            <div className="rounded-xl border border-white/8 bg-white/[0.02] p-3">
              <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/45 mb-2">Notes</p>
              <p className="text-sm text-white/80 leading-relaxed">{active.notes}</p>
            </div>
          </div>
        ) : null}
      </VerificationDrawer>
    </div>
  );
}
