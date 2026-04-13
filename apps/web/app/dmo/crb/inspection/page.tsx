"use client";

/**
 * CRB — Inspection Management
 * Physical verification & compliance monitoring across franchises.
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

/* ── types ── */
type InspectionStatus = "SCHEDULED" | "IN_PROGRESS" | "COMPLETED" | "FAILED";

type ChecklistItem = { name: string; passed: boolean };

type InspectionRow = {
  id: string;
  businessName: string;
  region: string;
  inspectorName: string;
  inspectorId: string;
  scheduledDate: string;
  status: InspectionStatus;
  score?: number;
  businessAddress: string;
  businessPhone: string;
  businessEmail: string;
  regNo: string;
  inspectorPhone: string;
  inspectorEmail: string;
  checklist: ChecklistItem[];
  photosCount: number;
  notes: string;
  failureReason?: string;
};

type Inspector = {
  id: string;
  name: string;
  region: string;
  activeTasks: number;
  avgTime: string;
  status: "available" | "busy" | "overloaded";
};

/* ── demo data ── */
const INSPECTORS: Inspector[] = [
  { id: "INS001", name: "Muhammad Hassan", region: "Karachi", activeTasks: 3, avgTime: "2.5 hrs", status: "busy" },
  { id: "INS002", name: "Ayesha Khan", region: "Lahore", activeTasks: 1, avgTime: "2.1 hrs", status: "available" },
  { id: "INS003", name: "Ali Raza", region: "Islamabad", activeTasks: 4, avgTime: "3.0 hrs", status: "overloaded" },
  { id: "INS004", name: "Fatima Ahmed", region: "Peshawar", activeTasks: 2, avgTime: "2.3 hrs", status: "available" },
];

const CL_FULL: ChecklistItem[] = [
  { name: "Premises Inspection", passed: true }, { name: "Document Verification", passed: true },
  { name: "Operations Review", passed: true }, { name: "Safety Compliance", passed: true }, { name: "Legal Compliance", passed: true },
];
const CL_PARTIAL: ChecklistItem[] = [
  { name: "Premises Inspection", passed: true }, { name: "Document Verification", passed: true },
  { name: "Operations Review", passed: false }, { name: "Safety Compliance", passed: false }, { name: "Legal Compliance", passed: false },
];
const CL_EMPTY: ChecklistItem[] = [
  { name: "Premises Inspection", passed: false }, { name: "Document Verification", passed: false },
  { name: "Operations Review", passed: false }, { name: "Safety Compliance", passed: false }, { name: "Legal Compliance", passed: false },
];

const DEMO: InspectionRow[] = [
  { id: "INP-001", businessName: "Al-Noor Trading Co.", region: "Karachi", inspectorName: "Muhammad Hassan", inspectorId: "INS001", scheduledDate: "2026-04-15", status: "SCHEDULED", businessAddress: "Plot 123, Industrial Zone, Karachi", businessPhone: "+92-21-5678900", businessEmail: "contact@alnoor.pk", regNo: "REG-PKI-2024-001", inspectorPhone: "+92-300-1234567", inspectorEmail: "hassan@ehb.pk", checklist: CL_EMPTY, photosCount: 0, notes: "Pending scheduled inspection." },
  { id: "INP-002", businessName: "Lahore Digital Services", region: "Lahore", inspectorName: "Ayesha Khan", inspectorId: "INS002", scheduledDate: "2026-04-12", status: "IN_PROGRESS", businessAddress: "Suite 456, Tech Park, Lahore", businessPhone: "+92-42-1111111", businessEmail: "info@lahoredigital.pk", regNo: "REG-PKI-2024-002", inspectorPhone: "+92-300-2234567", inspectorEmail: "ayesha@ehb.pk", checklist: CL_PARTIAL, photosCount: 12, notes: "Currently on-site. Premises and documents verified." },
  { id: "INP-003", businessName: "Rawalpindi Mfg Ltd.", region: "Rawalpindi", inspectorName: "Ali Raza", inspectorId: "INS003", scheduledDate: "2026-04-10", status: "COMPLETED", score: 87, businessAddress: "Lot 789, Industrial Estate, Rawalpindi", businessPhone: "+92-51-2222222", businessEmail: "ops@rawalpindi-mfg.pk", regNo: "REG-PKI-2024-003", inspectorPhone: "+92-300-3234567", inspectorEmail: "ali@ehb.pk", checklist: [...CL_FULL.slice(0, 4), { name: "Legal Compliance", passed: false }], photosCount: 24, notes: "Inspection completed. Minor compliance issue with licensing renewal." },
  { id: "INP-004", businessName: "Faisalabad Export Hub", region: "Faisalabad", inspectorName: "Fatima Ahmed", inspectorId: "INS004", scheduledDate: "2026-04-08", status: "COMPLETED", score: 94, businessAddress: "Block C, Export Zone, Faisalabad", businessPhone: "+92-41-3333333", businessEmail: "export@faisalabad-hub.pk", regNo: "REG-PKI-2024-004", inspectorPhone: "+92-300-4234567", inspectorEmail: "fatima@ehb.pk", checklist: CL_FULL, photosCount: 18, notes: "Excellent compliance. All standards met. Recommended for premium tier." },
  { id: "INP-005", businessName: "Peshawar Logistics Net", region: "Peshawar", inspectorName: "Muhammad Hassan", inspectorId: "INS001", scheduledDate: "2026-04-13", status: "SCHEDULED", businessAddress: "Hangu Road, Peshawar", businessPhone: "+92-91-4444444", businessEmail: "logistics@peshawar-net.pk", regNo: "REG-PKI-2024-005", inspectorPhone: "+92-300-1234567", inspectorEmail: "hassan@ehb.pk", checklist: CL_EMPTY, photosCount: 0, notes: "Awaiting inspector assignment confirmation." },
  { id: "INP-006", businessName: "Karachi Retail Solutions", region: "Karachi", inspectorName: "Ayesha Khan", inspectorId: "INS002", scheduledDate: "2026-04-09", status: "FAILED", businessAddress: "Clifton Centre, Karachi", businessPhone: "+92-21-5555555", businessEmail: "admin@kretail.pk", regNo: "REG-PKI-2024-006", inspectorPhone: "+92-300-2234567", inspectorEmail: "ayesha@ehb.pk", checklist: [{ name: "Premises Inspection", passed: true }, { name: "Document Verification", passed: false }, { name: "Operations Review", passed: false }, { name: "Safety Compliance", passed: true }, { name: "Legal Compliance", passed: false }], photosCount: 8, notes: "Critical compliance failures. Reinspection scheduled after remediation.", failureReason: "Missing required business licenses and safety certifications" },
  { id: "INP-007", businessName: "Islamabad Tech Ventures", region: "Islamabad", inspectorName: "Ali Raza", inspectorId: "INS003", scheduledDate: "2026-04-11", status: "IN_PROGRESS", businessAddress: "F-7 Markaz, Islamabad", businessPhone: "+92-51-6666666", businessEmail: "contact@itvpk.pk", regNo: "REG-PKI-2024-007", inspectorPhone: "+92-300-3234567", inspectorEmail: "ali@ehb.pk", checklist: [...CL_FULL.slice(0, 3), { name: "Safety Compliance", passed: false }, { name: "Legal Compliance", passed: false }], photosCount: 14, notes: "On-site verification in progress. Two items require clarification." },
  { id: "INP-008", businessName: "Multan Trade Center", region: "Multan", inspectorName: "Fatima Ahmed", inspectorId: "INS004", scheduledDate: "2026-04-07", status: "COMPLETED", score: 76, businessAddress: "Chowk Bazaar, Multan", businessPhone: "+92-61-7777777", businessEmail: "info@multan-trade.pk", regNo: "REG-PKI-2024-008", inspectorPhone: "+92-300-4234567", inspectorEmail: "fatima@ehb.pk", checklist: [{ name: "Premises Inspection", passed: true }, { name: "Document Verification", passed: true }, { name: "Operations Review", passed: false }, { name: "Safety Compliance", passed: true }, { name: "Legal Compliance", passed: true }], photosCount: 20, notes: "Operations documentation incomplete. Follow-up in 30 days." },
];

const STATUS_TONE: Record<InspectionStatus, VerificationTone> = {
  SCHEDULED: "cyan", IN_PROGRESS: "amber", COMPLETED: "green", FAILED: "red",
};
const INSP_STATUS_COLOR: Record<string, string> = { available: "#38C878", busy: "#F0A030", overloaded: "#F05858" };

function fmt(iso: string) { const d = new Date(iso); return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }); }

function InfoCell({ label, value, mono }: { label: string; value: React.ReactNode; mono?: boolean }) {
  return <div className="rounded-xl border border-white/8 bg-white/[0.03] p-3"><p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/45">{label}</p><p className={`mt-1 text-sm text-white/90 ${mono ? "font-mono" : ""}`}>{value}</p></div>;
}

export default function CrbInspectionPage() {
  const [filter, setFilter] = useState<string>("ALL");
  const [active, setActive] = useState<InspectionRow | null>(null);

  const stats = useMemo(() => ({
    total: DEMO.length,
    scheduled: DEMO.filter((i) => i.status === "SCHEDULED").length,
    inProgress: DEMO.filter((i) => i.status === "IN_PROGRESS").length,
    completed: DEMO.filter((i) => i.status === "COMPLETED").length,
    failed: DEMO.filter((i) => i.status === "FAILED").length,
  }), []);

  const visible = filter === "ALL" ? DEMO : DEMO.filter((i) => i.status === filter);

  const inspectorLoad = useMemo(() => INSPECTORS.map((ins) => ({
    ...ins,
    assigned: DEMO.filter((i) => i.inspectorId === ins.id).length,
  })), []);

  const columns: RowColumn<InspectionRow>[] = [
    { key: "business", header: "Business", width: "minmax(0,2fr)", render: (r) => (
      <div className="min-w-0">
        <div className="truncate text-sm font-semibold text-white">{r.businessName}</div>
        <div className="text-[10px] text-white/40">{r.region} · {r.regNo}</div>
      </div>
    )},
    { key: "inspector", header: "Inspector", width: "minmax(0,1.2fr)", render: (r) => <span className="text-xs text-white/70">{r.inspectorName}</span> },
    { key: "date", header: "Date", width: "minmax(0,1fr)", render: (r) => <span className="text-[11px] text-white/55">{fmt(r.scheduledDate)}</span> },
    { key: "status", header: "Status", width: "minmax(0,1fr)", render: (r) => <VerificationChip tone={STATUS_TONE[r.status]}>{r.status.replace(/_/g, " ")}</VerificationChip> },
    { key: "score", header: "Score", width: "minmax(0,0.6fr)", align: "right", render: (r) => (
      r.score != null
        ? <span className="font-mono text-sm font-semibold text-[#38C878]">{r.score}</span>
        : <span className="text-[11px] text-white/30">--</span>
    )},
    { key: "photos", header: "Photos", width: "minmax(0,0.5fr)", align: "right", render: (r) => <span className="font-mono text-[11px] text-white/50">{r.photosCount}</span> },
  ];

  return (
    <div className="space-y-6">
      {/* Hero */}
      <header className="relative overflow-hidden rounded-2xl border border-[#2BBFA0]/30 bg-gradient-to-br from-[#13162A] via-[#1A1D33] to-[#13162A] p-6 pt-[22px]">
        <div className="pointer-events-none absolute left-0 right-0 top-0 h-[3px]" style={{ background: "linear-gradient(90deg, transparent, #2BBFA0 30%, #7B6EF6 60%, transparent)" }} />
        <div className="pointer-events-none absolute left-3 top-3 h-6 w-6 border-l-[1.5px] border-t-[1.5px] border-[#2BBFA0]/50" />
        <div className="pointer-events-none absolute bottom-3 right-3 h-6 w-6 border-b-[1.5px] border-r-[1.5px] border-[#7B6EF6]/45" />
        <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-gradient-to-br from-[#2BBFA0]/18 via-[#7B6EF6]/12 to-transparent blur-3xl" />
        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 space-y-2">
            <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.22em]">
              <Link href="/dmo" className="text-white/40 hover:text-white/70 transition-colors">DMO</Link>
              <span className="text-white/25">/</span>
              <Link href="/dmo/crb" className="text-white/40 hover:text-white/70 transition-colors">CRB</Link>
              <span className="text-white/25">/</span>
              <span className="text-[#2BBFA0]">Inspection</span>
            </div>
            <h1 className="text-2xl font-bold text-white md:text-3xl">Inspection Management</h1>
            <p className="max-w-2xl text-sm text-white/65">
              Physical verification & compliance monitoring — inspector workload, checklist progress, aur on-site audit trail.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/dmo/crb" className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-white/75 transition-colors hover:border-white/20 hover:bg-white/[0.07] hover:text-white">CRB Overview</Link>
            <Link href="/dmo/crb/applications" className="rounded-xl border border-[#7B6EF6]/50 bg-[#7B6EF6]/15 px-3 py-1.5 text-xs font-semibold text-[#A098F8] transition-colors hover:bg-[#7B6EF6]/25">Applications</Link>
          </div>
        </div>
      </header>

      {/* Stat cards */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <VerificationStatCard tone="teal" label="Total inspections" value={stats.total} sub="across regions" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>} />
        <VerificationStatCard tone="cyan" label="Scheduled" value={stats.scheduled} sub="upcoming" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.4" /><path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>} />
        <VerificationStatCard tone="amber" label="In progress" value={stats.inProgress} sub="on-site now" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.4" /><path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>} />
        <VerificationStatCard tone="green" label="Completed" value={stats.completed} sub="this week" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /><path d="M22 4L12 14.01l-3-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>} />
      </section>

      {/* Distribution */}
      <section className="rounded-2xl border border-white/10 bg-[#13162A]/70 p-5">
        <SectionHeader title="Status distribution" />
        <SeverityMeter segments={[
          { label: "Scheduled", value: stats.scheduled, tone: "cyan" },
          { label: "In Progress", value: stats.inProgress, tone: "amber" },
          { label: "Completed", value: stats.completed, tone: "green" },
          { label: "Failed", value: stats.failed, tone: "red" },
        ]} />
      </section>

      {/* Inspector workload */}
      <section className="rounded-2xl border border-white/10 bg-[#13162A]/70 p-5">
        <SectionHeader eyebrow="Team" title="Inspector workload" hint="Capacity & assignment overview" />
        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {inspectorLoad.map((ins) => (
            <div key={ins.id} className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#1A1D33]/80 p-5 pt-[22px] transition-all duration-200 hover:-translate-y-[1px] hover:border-white/20">
              <div className="pointer-events-none absolute left-0 right-0 top-0 h-[2px]" style={{ background: `linear-gradient(90deg, transparent, ${INSP_STATUS_COLOR[ins.status]}, transparent)` }} />
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full" style={{ background: INSP_STATUS_COLOR[ins.status] }} />
                <span className="text-[10px] font-semibold uppercase tracking-wider text-white/50">{ins.status}</span>
              </div>
              <h3 className="mt-2 text-sm font-semibold text-white">{ins.name}</h3>
              <p className="text-[11px] text-white/40">{ins.region}</p>
              <div className="mt-3 grid grid-cols-3 gap-2">
                <div className="rounded-lg bg-white/[0.04] p-2 text-center">
                  <p className="font-mono text-lg font-bold text-white/90">{ins.activeTasks}</p>
                  <p className="text-[8px] text-white/40">Active</p>
                </div>
                <div className="rounded-lg bg-white/[0.04] p-2 text-center">
                  <p className="font-mono text-lg font-bold text-white/90">{ins.assigned}</p>
                  <p className="text-[8px] text-white/40">Total</p>
                </div>
                <div className="rounded-lg bg-white/[0.04] p-2 text-center">
                  <p className="text-xs font-semibold text-white/80">{ins.avgTime}</p>
                  <p className="text-[8px] text-white/40">Avg</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Inspections grid */}
      <section className="rounded-2xl border border-white/10 bg-[#13162A]/70 p-5">
        <SectionHeader eyebrow="Inspections" title="All inspections" hint="Click row for full detail" right={<span className="text-[10px] text-white/45">{visible.length} item(s)</span>} />
        <div className="mt-3">
          <FilterChipRow<string> options={[
            { value: "ALL", label: `All · ${stats.total}` },
            { value: "SCHEDULED", label: `Scheduled · ${stats.scheduled}` },
            { value: "IN_PROGRESS", label: `In Progress · ${stats.inProgress}` },
            { value: "COMPLETED", label: `Completed · ${stats.completed}` },
            { value: "FAILED", label: `Failed · ${stats.failed}` },
          ]} value={filter} onChange={setFilter} />
        </div>
        <div className="mt-4">
          <VerificationRowGrid<InspectionRow> rows={visible} columns={columns} onRowClick={setActive} getRowTone={(r) => r.status === "COMPLETED" ? "green" : r.status === "FAILED" ? "red" : r.status === "IN_PROGRESS" ? "amber" : "cyan"} emptyTitle="No inspections match" emptyHint="Adjust filter." />
        </div>
      </section>

      {/* Drawer */}
      <VerificationDrawer open={Boolean(active)} onClose={() => setActive(null)} title={active?.businessName ?? "Inspection detail"} subtitle={active ? `${active.id} · ${fmt(active.scheduledDate)}` : undefined} severity={active?.status === "FAILED" ? "critical" : active?.status === "IN_PROGRESS" ? "warning" : "info"}>
        {active ? (
          <div className="space-y-4">
            {/* Status + score chips */}
            <div className="flex flex-wrap gap-2">
              <VerificationChip tone={STATUS_TONE[active.status]}>{active.status.replace(/_/g, " ")}</VerificationChip>
              {active.score != null && <VerificationChip tone="green">{active.score}/100</VerificationChip>}
            </div>

            {/* Business info */}
            <div className="grid gap-3 sm:grid-cols-2">
              <InfoCell label="Business" value={active.businessName} />
              <InfoCell label="Region" value={active.region} />
              <InfoCell label="Address" value={active.businessAddress} />
              <InfoCell label="Registration" value={active.regNo} mono />
              <InfoCell label="Phone" value={active.businessPhone} mono />
              <InfoCell label="Email" value={active.businessEmail} mono />
            </div>

            {/* Inspector info */}
            <div className="grid gap-3 sm:grid-cols-2">
              <InfoCell label="Inspector" value={active.inspectorName} />
              <InfoCell label="Inspector phone" value={active.inspectorPhone} mono />
            </div>

            {/* Checklist */}
            <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/50">Checklist</p>
              <div className="space-y-2">
                {active.checklist.map((item, i) => (
                  <div key={i} className="flex items-center justify-between rounded-lg bg-white/[0.03] p-2.5">
                    <span className="text-xs text-white/80">{item.name}</span>
                    {item.passed ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#38C878]">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
                        Pass
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#F0A030]">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="9" /><path d="M12 8v4M12 16h.01" /></svg>
                        Pending
                      </span>
                    )}
                  </div>
                ))}
              </div>
              <p className="mt-2 text-right text-[10px] text-white/40">
                {active.checklist.filter((c) => c.passed).length}/{active.checklist.length} passed
              </p>
            </div>

            {/* Failure reason */}
            {active.failureReason && (
              <div className="rounded-xl border border-[#F05858]/30 bg-[#F05858]/10 p-4">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[#F05858]/70">Failure reason</p>
                <p className="mt-1 text-sm text-[#F05858]">{active.failureReason}</p>
              </div>
            )}

            {/* Notes */}
            <InfoCell label="Inspector notes" value={active.notes} />

            {/* Photos */}
            <div className="flex items-center gap-2 text-[11px] text-white/50">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" /></svg>
              {active.photosCount} photos captured
            </div>
          </div>
        ) : null}
      </VerificationDrawer>
    </div>
  );
}
