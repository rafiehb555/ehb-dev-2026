"use client";

/**
 * DMO — Approvals / Pending Decisions
 * DESIGN-ONLY — VerificationUI primitives, in-file demo data, no fetch.
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

type RequestType = "STL_UPGRADE" | "CRB_CERT" | "FRANCHISE_APP" | "REFILL" | "ACCOUNT_UNLOCK";
type Priority = "critical" | "high" | "normal";

type PendingRow = {
  id: string;
  entityName: string;
  requestType: RequestType;
  priority: Priority;
  slaRemaining: string;
  slaHours: number;
  stlLevel: number;
  submittedAt: string;
  assignedTo: string;
  documents: number;
};

const TYPE_TONE: Record<RequestType, VerificationTone> = {
  STL_UPGRADE: "purple", CRB_CERT: "teal", FRANCHISE_APP: "amber", REFILL: "cyan", ACCOUNT_UNLOCK: "red",
};
const PRIO_TONE: Record<Priority, VerificationTone> = { critical: "red", high: "amber", normal: "green" };

const DEMO: PendingRow[] = [
  { id: "APR-901", entityName: "GoSellr Islamabad", requestType: "STL_UPGRADE", priority: "critical", slaRemaining: "2h 15m", slaHours: 2.25, stlLevel: 7, submittedAt: "2026-04-12T06:00:00Z", assignedTo: "dmo.ayesha", documents: 5 },
  { id: "APR-902", entityName: "Ali Raza", requestType: "CRB_CERT", priority: "critical", slaRemaining: "3h 40m", slaHours: 3.67, stlLevel: 6, submittedAt: "2026-04-12T05:30:00Z", assignedTo: "dmo.sara", documents: 8 },
  { id: "APR-903", entityName: "WMS Karachi", requestType: "FRANCHISE_APP", priority: "critical", slaRemaining: "1h 10m", slaHours: 1.17, stlLevel: 5, submittedAt: "2026-04-12T07:00:00Z", assignedTo: "dmo.hamza", documents: 12 },
  { id: "APR-904", entityName: "AGTS Dubai Travel", requestType: "STL_UPGRADE", priority: "high", slaRemaining: "8h 20m", slaHours: 8.33, stlLevel: 7, submittedAt: "2026-04-11T22:00:00Z", assignedTo: "dmo.ayesha", documents: 4 },
  { id: "APR-905", entityName: "Sara Noor", requestType: "REFILL", priority: "high", slaRemaining: "12h", slaHours: 12, stlLevel: 3, submittedAt: "2026-04-11T18:00:00Z", assignedTo: "dmo.sara", documents: 2 },
  { id: "APR-906", entityName: "TechHub Lahore", requestType: "CRB_CERT", priority: "high", slaRemaining: "6h 45m", slaHours: 6.75, stlLevel: 5, submittedAt: "2026-04-11T20:00:00Z", assignedTo: "unassigned", documents: 7 },
  { id: "APR-907", entityName: "Zara Boutique", requestType: "ACCOUNT_UNLOCK", priority: "high", slaRemaining: "10h", slaHours: 10, stlLevel: 4, submittedAt: "2026-04-11T16:00:00Z", assignedTo: "dmo.hamza", documents: 3 },
  { id: "APR-908", entityName: "Fatima HPS", requestType: "FRANCHISE_APP", priority: "high", slaRemaining: "14h", slaHours: 14, stlLevel: 4, submittedAt: "2026-04-11T12:00:00Z", assignedTo: "unassigned", documents: 9 },
  { id: "APR-909", entityName: "Usman Khan", requestType: "REFILL", priority: "normal", slaRemaining: "22h", slaHours: 22, stlLevel: 1, submittedAt: "2026-04-11T08:00:00Z", assignedTo: "dmo.sara", documents: 1 },
  { id: "APR-910", entityName: "Karachi Mart", requestType: "STL_UPGRADE", priority: "normal", slaRemaining: "36h", slaHours: 36, stlLevel: 3, submittedAt: "2026-04-10T22:00:00Z", assignedTo: "dmo.ayesha", documents: 4 },
];

function fmt(iso: string) { const d = new Date(iso); return Number.isNaN(d.getTime()) ? iso : d.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" }); }
function InfoCell({ label, value, mono }: { label: string; value: React.ReactNode; mono?: boolean }) {
  return <div className="rounded-xl border border-white/8 bg-white/[0.03] p-3"><p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/45">{label}</p><p className={`mt-1 text-sm text-white/90 ${mono ? "font-mono" : ""}`}>{value}</p></div>;
}

export default function PendingApprovalsPage() {
  const [rows] = useState(DEMO);
  const [typeFilter, setTypeFilter] = useState<"ALL" | RequestType>("ALL");
  const [active, setActive] = useState<PendingRow | null>(null);

  const visible = typeFilter === "ALL" ? rows : rows.filter((r) => r.requestType === typeFilter);

  const stats = useMemo(() => ({
    total: rows.length,
    critical: rows.filter((r) => r.slaHours < 4).length,
    normal: rows.filter((r) => r.priority === "normal").length,
    avgWait: Math.round(rows.reduce((s, r) => s + r.slaHours, 0) / rows.length),
  }), [rows]);

  const columns: RowColumn<PendingRow>[] = [
    { key: "entity", header: "Entity", width: "minmax(0,1.8fr)", render: (r) => (
      <div className="min-w-0"><div className="truncate text-sm font-semibold text-white">{r.entityName}</div><div className="font-mono text-[10px] text-white/40">{r.id}</div></div>
    )},
    { key: "type", header: "Request", width: "minmax(0,1fr)", render: (r) => <VerificationChip tone={TYPE_TONE[r.requestType]}>{r.requestType.replace(/_/g, " ")}</VerificationChip> },
    { key: "priority", header: "Priority", width: "minmax(0,0.7fr)", render: (r) => <VerificationChip tone={PRIO_TONE[r.priority]}>{r.priority}</VerificationChip> },
    { key: "sla", header: "SLA left", width: "minmax(0,0.8fr)", align: "right", render: (r) => (
      <span className={`font-mono text-sm font-semibold ${r.slaHours < 4 ? "text-[#F05858]" : r.slaHours < 12 ? "text-[#F0A030]" : "text-white/60"}`}>{r.slaRemaining}</span>
    )},
    { key: "assigned", header: "Assigned", width: "minmax(0,0.8fr)", render: (r) => (
      <span className={`text-[11px] ${r.assignedTo === "unassigned" ? "text-[#F0A030]" : "text-white/60"}`}>{r.assignedTo}</span>
    )},
    { key: "submitted", header: "Submitted", width: "minmax(0,1fr)", align: "right", render: (r) => <span className="text-[10px] text-white/45">{fmt(r.submittedAt)}</span> },
  ];

  return (
    <div className="space-y-6">
      <header className="relative overflow-hidden rounded-2xl border border-[#38C878]/30 bg-gradient-to-br from-[#13162A] via-[#1A1D33] to-[#13162A] p-6 pt-[22px]">
        <div className="pointer-events-none absolute left-0 right-0 top-0 h-[3px]" style={{ background: "linear-gradient(90deg, transparent, #38C878 25%, #7B6EF6 50%, #F0A030 75%, transparent)" }} />
        <div className="pointer-events-none absolute left-3 top-3 h-6 w-6 border-l-[1.5px] border-t-[1.5px] border-[#38C878]/50" />
        <div className="pointer-events-none absolute bottom-3 right-3 h-6 w-6 border-b-[1.5px] border-r-[1.5px] border-[#7B6EF6]/45" />
        <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-gradient-to-br from-[#38C878]/18 via-[#7B6EF6]/12 to-transparent blur-3xl" />
        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 space-y-2">
            <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.22em]">
              <Link href="/dmo" className="text-white/40 hover:text-white/70 transition-colors">DMO</Link>
              <span className="text-white/25">/</span>
              <Link href="/dmo/approvals" className="text-white/40 hover:text-white/70 transition-colors">Approvals</Link>
              <span className="text-white/25">/</span>
              <span className="text-[#38C878]">Pending</span>
            </div>
            <h1 className="text-2xl font-bold text-white md:text-3xl">Pending Decisions</h1>
            <p className="max-w-2xl text-sm text-white/65">
              SLA-tracked approval queue — STL upgrades, CRB certifications, franchise applications,
              refills, account unlocks. Critical items (&lt;4h) highlighted.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/dmo/approvals" className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-white/75 transition-colors hover:border-white/20 hover:bg-white/[0.07] hover:text-white">All Approvals</Link>
            <Link href="/dmo/approvals/approved" className="rounded-xl border border-[#38C878]/50 bg-[#38C878]/15 px-3 py-1.5 text-xs font-semibold text-[#38C878] transition-colors hover:bg-[#38C878]/25">Approved</Link>
          </div>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <VerificationStatCard tone="amber" label="Total pending" value={stats.total} sub="in queue" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" /><path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>} />
        <VerificationStatCard tone="red" label="Critical SLA" value={stats.critical} sub="< 4h remaining" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M12 8v4m0 4h.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="currentColor" strokeWidth="1.4" /></svg>} />
        <VerificationStatCard tone="green" label="Normal priority" value={stats.normal} sub="no urgency" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M5 12l4 4L19 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>} />
        <VerificationStatCard tone="cyan" label="Avg wait" value={`${stats.avgWait}h`} sub="queue average" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" stroke="currentColor" strokeWidth="1.6" /></svg>} />
      </section>

      <section className="rounded-2xl border border-white/10 bg-[#13162A]/70 p-5">
        <SectionHeader title="SLA urgency distribution" />
        <SeverityMeter segments={[
          { label: "Critical (<4h)", value: stats.critical, tone: "red" },
          { label: "Warning (4–12h)", value: rows.filter((r) => r.slaHours >= 4 && r.slaHours < 12).length, tone: "amber" },
          { label: "Normal (12h+)", value: rows.filter((r) => r.slaHours >= 12).length, tone: "green" },
        ]} />
      </section>

      <section className="rounded-2xl border border-white/10 bg-[#13162A]/70 p-5">
        <SectionHeader eyebrow="Queue" title="Pending approvals" hint="Click row for detail + actions" right={<span className="text-[10px] text-white/45">{visible.length} item(s)</span>} />
        <div className="mt-3">
          <FilterChipRow<"ALL" | RequestType> options={[
            { value: "ALL", label: `All · ${rows.length}` },
            { value: "STL_UPGRADE", label: `STL · ${rows.filter((r) => r.requestType === "STL_UPGRADE").length}` },
            { value: "CRB_CERT", label: `CRB · ${rows.filter((r) => r.requestType === "CRB_CERT").length}` },
            { value: "FRANCHISE_APP", label: `Franchise · ${rows.filter((r) => r.requestType === "FRANCHISE_APP").length}` },
            { value: "REFILL", label: `Refill · ${rows.filter((r) => r.requestType === "REFILL").length}` },
            { value: "ACCOUNT_UNLOCK", label: `Unlock · ${rows.filter((r) => r.requestType === "ACCOUNT_UNLOCK").length}` },
          ]} value={typeFilter} onChange={setTypeFilter} />
        </div>
        <div className="mt-4">
          <VerificationRowGrid<PendingRow> rows={visible} columns={columns} onRowClick={setActive} getRowTone={(r) => r.slaHours < 4 ? "red" : r.slaHours < 12 ? "amber" : "green"} emptyTitle="No pending items" emptyHint="All approvals processed." />
        </div>
      </section>

      <VerificationDrawer open={Boolean(active)} onClose={() => setActive(null)} title={active?.entityName ?? "Approval detail"} subtitle={active ? `${active.id} · Submitted ${fmt(active.submittedAt)}` : undefined} severity={active && active.slaHours < 4 ? "critical" : active && active.slaHours < 12 ? "warning" : "info"}>
        {active ? (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <VerificationChip tone={TYPE_TONE[active.requestType]}>{active.requestType.replace(/_/g, " ")}</VerificationChip>
              <VerificationChip tone={PRIO_TONE[active.priority]}>{active.priority}</VerificationChip>
              <VerificationChip tone={active.slaHours < 4 ? "red" : "amber"}>{active.slaRemaining} left</VerificationChip>
            </div>

            <div className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/[0.04] p-4">
              <STLBadge level={active.stlLevel as any} size="md" />
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/45">Entity STL</p>
                <p className="text-lg font-bold" style={{ color: getStlMeta(active.stlLevel).accent }}>L{active.stlLevel} · {getStlMeta(active.stlLevel).label}</p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <InfoCell label="Request ID" value={active.id} mono />
              <InfoCell label="Request type" value={active.requestType.replace(/_/g, " ")} />
              <InfoCell label="Assigned to" value={active.assignedTo} mono />
              <InfoCell label="Documents" value={`${active.documents} file(s)`} />
              <InfoCell label="SLA remaining" value={active.slaRemaining} />
              <InfoCell label="Submitted" value={fmt(active.submittedAt)} />
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 sm:grid-cols-4">
              <button type="button" className="rounded-xl border border-[#38C878]/40 bg-[#38C878]/12 px-3 py-2.5 text-[11px] font-semibold text-[#38C878] transition-colors hover:border-[#38C878]/70 hover:bg-[#38C878]/20">Approve</button>
              <button type="button" className="rounded-xl border border-[#F05858]/40 bg-[#F05858]/12 px-3 py-2.5 text-[11px] font-semibold text-[#F05858] transition-colors hover:border-[#F05858]/70 hover:bg-[#F05858]/20">Reject</button>
              <button type="button" className="rounded-xl border border-[#F0A030]/40 bg-[#F0A030]/12 px-3 py-2.5 text-[11px] font-semibold text-[#F0A030] transition-colors hover:border-[#F0A030]/70 hover:bg-[#F0A030]/20">Escalate</button>
              <button type="button" className="rounded-xl border border-[#7B6EF6]/40 bg-[#7B6EF6]/12 px-3 py-2.5 text-[11px] font-semibold text-[#A098F8] transition-colors hover:border-[#7B6EF6]/70 hover:bg-[#7B6EF6]/20">More info</button>
            </div>
          </div>
        ) : null}
      </VerificationDrawer>
    </div>
  );
}
