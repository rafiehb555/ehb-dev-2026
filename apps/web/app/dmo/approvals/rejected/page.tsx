"use client";

/**
 * DMO — Approvals / Rejected
 * Denied requests with rejection reasons and appeal status.
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

type RejectionReason = "DOC_INCOMPLETE" | "FAILED_VERIFICATION" | "COMPLIANCE_BREACH" | "FRAUD_SUSPECTED" | "TIER_INELIGIBLE" | "SLA_VIOLATION";

type RejectedRow = {
  id: string;
  entityName: string;
  requestType: RequestType;
  rejectedBy: string;
  rejectedAt: string;
  reason: RejectionReason;
  canAppeal: boolean;
};

const REQUEST_TONE: Record<RequestType, VerificationTone> = {
  STL_UPGRADE: "purple",
  CRB_CERT: "teal",
  FRANCHISE_APP: "cyan",
  REFILL: "green",
  ACCOUNT_UNLOCK: "amber",
};

const REASON_TONE: Record<RejectionReason, VerificationTone> = {
  DOC_INCOMPLETE: "amber",
  FAILED_VERIFICATION: "red",
  COMPLIANCE_BREACH: "red",
  FRAUD_SUSPECTED: "red",
  TIER_INELIGIBLE: "amber",
  SLA_VIOLATION: "amber",
};

const DEMO: RejectedRow[] = [
  { id: "REJ-001", entityName: "Khalid Ahmed", requestType: "CRB_CERT", rejectedBy: "dmo.ayesha", rejectedAt: "2026-04-12T12:00:00Z", reason: "DOC_INCOMPLETE", canAppeal: true },
  { id: "REJ-002", entityName: "TechVentures", requestType: "FRANCHISE_APP", rejectedBy: "dmo.hamza", rejectedAt: "2026-04-11T16:45:00Z", reason: "FAILED_VERIFICATION", canAppeal: true },
  { id: "REJ-003", entityName: "Sophia Chen", requestType: "STL_UPGRADE", rejectedBy: "ai.fraud_engine", rejectedAt: "2026-04-11T14:20:00Z", reason: "FRAUD_SUSPECTED", canAppeal: true },
  { id: "REJ-004", entityName: "NullaBusiness", requestType: "ACCOUNT_UNLOCK", rejectedBy: "dmo.ravi", rejectedAt: "2026-04-10T10:30:00Z", reason: "COMPLIANCE_BREACH", canAppeal: false },
  { id: "REJ-005", entityName: "StartupXYZ", requestType: "FRANCHISE_APP", rejectedBy: "dmo.sara", rejectedAt: "2026-04-10T09:15:00Z", reason: "TIER_INELIGIBLE", canAppeal: false },
  { id: "REJ-006", entityName: "Amina Malik", requestType: "REFILL", rejectedBy: "system", rejectedAt: "2026-04-09T17:00:00Z", reason: "SLA_VIOLATION", canAppeal: true },
  { id: "REJ-007", entityName: "Commerce Hub", requestType: "CRB_CERT", rejectedBy: "dmo.yasmin", rejectedAt: "2026-04-09T13:30:00Z", reason: "DOC_INCOMPLETE", canAppeal: true },
  { id: "REJ-008", entityName: "Global Trade", requestType: "FRANCHISE_APP", rejectedBy: "dmo.hamza", rejectedAt: "2026-04-08T11:00:00Z", reason: "FAILED_VERIFICATION", canAppeal: true },
];

function fmt(iso: string) { const d = new Date(iso); return Number.isNaN(d.getTime()) ? iso : d.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" }); }
function InfoCell({ label, value, mono }: { label: string; value: React.ReactNode; mono?: boolean }) {
  return <div className="rounded-xl border border-white/8 bg-white/[0.03] p-3"><p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/45">{label}</p><p className={`mt-1 text-sm text-white/90 ${mono ? "font-mono" : ""}`}>{value}</p></div>;
}

export default function ApprovalsRejectedPage() {
  const [rows] = useState(DEMO);
  const [filter, setFilter] = useState<RequestType | "ALL">("ALL");
  const [active, setActive] = useState<RejectedRow | null>(null);

  const visible = filter === "ALL" ? rows : rows.filter((r) => r.requestType === filter);

  const stats = useMemo(() => ({
    total: rows.length,
    thisWeek: rows.filter((r) => {
      const d = new Date(r.rejectedAt);
      const now = new Date("2026-04-12T15:00:00Z");
      const diff = (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24);
      return diff <= 7;
    }).length,
    appealPending: rows.filter((r) => r.canAppeal).length,
    commonReason: "DOC_INCOMPLETE",
  }), [rows]);

  const columns: RowColumn<RejectedRow>[] = [
    { key: "entity", header: "Entity", width: "minmax(0,1.5fr)", render: (r) => (
      <div className="min-w-0"><div className="truncate text-sm font-semibold text-white">{r.entityName}</div><div className="font-mono text-[10px] text-white/40">{r.id}</div></div>
    )},
    { key: "type", header: "Request type", width: "minmax(0,1.2fr)", render: (r) => <VerificationChip tone={REQUEST_TONE[r.requestType]}>{r.requestType.replace(/_/g, " ")}</VerificationChip> },
    { key: "reason", header: "Reason", width: "minmax(0,1.2fr)", render: (r) => <VerificationChip tone={REASON_TONE[r.reason]}>{r.reason.replace(/_/g, " ")}</VerificationChip> },
    { key: "appeal", header: "Appeal", width: "minmax(0,0.7fr)", align: "center", render: (r) => (
      <span className={`text-xs font-semibold ${r.canAppeal ? "text-[#F0A030]" : "text-white/40"}`}>{r.canAppeal ? "Open" : "Closed"}</span>
    )},
    { key: "time", header: "When", width: "minmax(0,1.2fr)", align: "right", render: (r) => <span className="text-[10px] text-white/45">{fmt(r.rejectedAt)}</span> },
  ];

  return (
    <div className="space-y-6">
      <header className="relative overflow-hidden rounded-2xl border border-red-400/30 bg-gradient-to-br from-[#13162A] via-[#1A1D33] to-[#13162A] p-6 pt-[22px]">
        <div className="pointer-events-none absolute left-0 right-0 top-0 h-[3px]" style={{ background: "linear-gradient(90deg, transparent, #F05858 30%, #F0A030 60%, transparent)" }} />
        <div className="pointer-events-none absolute left-3 top-3 h-6 w-6 border-l-[1.5px] border-t-[1.5px] border-red-400/50" />
        <div className="pointer-events-none absolute bottom-3 right-3 h-6 w-6 border-b-[1.5px] border-r-[1.5px] border-[#F0A030]/45" />
        <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-gradient-to-br from-red-400/18 via-[#F0A030]/12 to-transparent blur-3xl" />
        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 space-y-2">
            <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.22em]">
              <Link href="/dmo" className="text-white/40 hover:text-white/70 transition-colors">DMO</Link>
              <span className="text-white/25">/</span>
              <Link href="/dmo/approvals" className="text-white/40 hover:text-white/70 transition-colors">Approvals</Link>
              <span className="text-white/25">/</span>
              <span className="text-red-300">Rejected</span>
            </div>
            <h1 className="text-2xl font-bold text-white md:text-3xl">Rejected requests</h1>
            <p className="max-w-2xl text-sm text-white/65">
              Denied applications with clear reasons aur appeal options. Documentation issues sab se common hain.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/dmo/approvals" className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-white/75 transition-colors hover:border-white/20 hover:bg-white/[0.07] hover:text-white">Pending</Link>
            <Link href="/dmo/approvals/approved" className="rounded-xl border border-[#38C878]/50 bg-[#38C878]/15 px-3 py-1.5 text-xs font-semibold text-[#38C878] transition-colors hover:bg-[#38C878]/25">Approved</Link>
          </div>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <VerificationStatCard tone="red" label="Total rejected" value={stats.total} sub="denials" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" /><line x1="8" y1="16" x2="16" y2="8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>} />
        <VerificationStatCard tone="amber" label="This week" value={stats.thisWeek} sub="rejections" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" /><polyline points="16 2 16 6 8 6 8 2" stroke="currentColor" strokeWidth="1.5" /><line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="1.5" /></svg>} />
        <VerificationStatCard tone="cyan" label="Appeal pending" value={stats.appealPending} sub="eligible" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><polyline points="23 4 13 14.01 13 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>} />
        <VerificationStatCard tone="purple" label="Common reason" value="Doc" sub="incomplete" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M9 12h6m-6 4h6m2-14H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>} />
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
        <SectionHeader eyebrow="Details" title="Rejected items" hint="Click row for detail" right={<span className="text-[10px] text-white/45">{visible.length} row(s)</span>} />
        <div className="mt-4">
          <VerificationRowGrid<RejectedRow> rows={visible} columns={columns} onRowClick={setActive} getRowTone={() => "red"} emptyTitle="No rejections match" emptyHint="Adjust filter." />
        </div>
      </section>

      <VerificationDrawer open={Boolean(active)} onClose={() => setActive(null)} title={active?.entityName ?? "Rejection detail"} subtitle={active ? `${active.id} · ${fmt(active.rejectedAt)}` : undefined} severity="warning">
        {active ? (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <VerificationChip tone={REQUEST_TONE[active.requestType]}>{active.requestType.replace(/_/g, " ")}</VerificationChip>
              <VerificationChip tone="red">Rejected</VerificationChip>
              {active.canAppeal && <VerificationChip tone="amber">Appeal eligible</VerificationChip>}
            </div>
            <InfoCell label="Request ID" value={active.id} mono />
            <div className="rounded-xl border border-[#F0A030]/30 bg-[#F0A030]/10 p-4">
              <p className="text-[10px] text-[#F0A030] font-semibold uppercase tracking-wider mb-2">Rejection reason</p>
              <p className="text-base font-semibold text-white">{active.reason.replace(/_/g, " ")}</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <InfoCell label="Rejected by" value={active.rejectedBy === "system" ? "System check" : active.rejectedBy} mono />
              <InfoCell label="Rejected at" value={fmt(active.rejectedAt)} />
            </div>
            {active.canAppeal && (
              <div className="rounded-xl border border-[#F0A030]/40 bg-[#F0A030]/5 p-3">
                <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#F0A030] mb-2">Appeal Status</p>
                <p className="text-sm text-white/80">This decision can be appealed. Submit additional documentation to reopen your case.</p>
              </div>
            )}
          </div>
        ) : null}
      </VerificationDrawer>
    </div>
  );
}
