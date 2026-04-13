"use client";

/**
 * DMO — Refilling System (legacy route, separate from refill-management)
 *   - VerificationUI primitives only (no <table>, no local Card)
 *   - In-file demo data (prototype only, no fetch)
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

type RefillStatus = "ACTIVE" | "WARNING" | "EXPIRED" | "COMPLETED";
type RefillType = "PSS" | "INDUSTRY";

type RefillItem = {
  id: string;
  userName: string;
  type: RefillType;
  dueDate: string;
  status: RefillStatus;
  stlImpact: string;
  stlLevel: number;
};

const DEMO: RefillItem[] = [
  { id: "RF-101", userName: "GoSellr PK", type: "PSS", dueDate: "2026-04-25", status: "ACTIVE", stlImpact: "none", stlLevel: 7 },
  { id: "RF-102", userName: "OLS Lahore", type: "INDUSTRY", dueDate: "2026-04-18", status: "WARNING", stlImpact: "-5 pts if missed", stlLevel: 6 },
  { id: "RF-103", userName: "WMS Islamabad", type: "PSS", dueDate: "2026-04-08", status: "EXPIRED", stlImpact: "-10 pts applied", stlLevel: 5 },
  { id: "RF-104", userName: "AGTS Multan", type: "INDUSTRY", dueDate: "2026-04-14", status: "WARNING", stlImpact: "-5 pts if missed", stlLevel: 4 },
  { id: "RF-105", userName: "HPS Karachi", type: "PSS", dueDate: "2026-04-01", status: "COMPLETED", stlImpact: "none (renewed)", stlLevel: 8 },
  { id: "RF-106", userName: "JPS Matching", type: "INDUSTRY", dueDate: "2026-04-30", status: "ACTIVE", stlImpact: "none", stlLevel: 5 },
];

const STATUS_TONE: Record<RefillStatus, VerificationTone> = {
  ACTIVE: "green",
  WARNING: "amber",
  EXPIRED: "red",
  COMPLETED: "purple",
};

const TYPE_TONE: Record<RefillType, VerificationTone> = {
  PSS: "teal",
  INDUSTRY: "cyan",
};

function dueCountdown(dueDate: string) {
  const due = new Date(dueDate).getTime();
  const now = Date.now();
  const diff = due - now;
  const days = Math.ceil(Math.abs(diff) / (1000 * 60 * 60 * 24));
  return diff >= 0 ? `${days}d left` : `${days}d overdue`;
}

function InfoCell({ label, value, mono }: { label: string; value: React.ReactNode; mono?: boolean }) {
  return (
    <div className="rounded-xl border border-white/8 bg-white/[0.03] p-3">
      <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/45">{label}</p>
      <p className={`mt-1 text-sm text-white/90 ${mono ? "font-mono" : ""}`}>{value}</p>
    </div>
  );
}

export default function RefillingPage() {
  const [rows] = useState<RefillItem[]>(DEMO);
  const [statusFilter, setStatusFilter] = useState<"ALL" | RefillStatus>("ALL");
  const [active, setActive] = useState<RefillItem | null>(null);

  const stats = useMemo(() => ({
    active: rows.filter((x) => x.status === "ACTIVE").length,
    warning: rows.filter((x) => x.status === "WARNING").length,
    expired: rows.filter((x) => x.status === "EXPIRED").length,
    completed: rows.filter((x) => x.status === "COMPLETED").length,
  }), [rows]);

  const visible = statusFilter === "ALL" ? rows : rows.filter((r) => r.status === statusFilter);

  const columns: RowColumn<RefillItem>[] = [
    {
      key: "user",
      header: "User",
      width: "minmax(0,1.8fr)",
      render: (r) => (
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-white">{r.userName}</div>
          <div className="text-[10px] text-white/50">{r.id}</div>
        </div>
      ),
    },
    { key: "type", header: "Type", width: "minmax(0,0.8fr)", render: (r) => <VerificationChip tone={TYPE_TONE[r.type]}>{r.type}</VerificationChip> },
    { key: "due", header: "Due", width: "minmax(0,0.9fr)", render: (r) => <span className="font-mono text-[11px] text-white/75">{r.dueDate}</span> },
    { key: "countdown", header: "Countdown", width: "minmax(0,0.9fr)", render: (r) => {
      const cd = dueCountdown(r.dueDate);
      const isOver = cd.includes("overdue");
      return <VerificationChip tone={isOver ? "red" : "green"} size="xs">{cd}</VerificationChip>;
    }},
    { key: "status", header: "Status", width: "minmax(0,0.9fr)", render: (r) => <VerificationChip tone={STATUS_TONE[r.status]}>{r.status}</VerificationChip> },
    { key: "impact", header: "STL impact", width: "minmax(0,1fr)", align: "right", render: (r) => <span className="text-[10px] text-white/60">{r.stlImpact}</span> },
  ];

  return (
    <div className="space-y-6">
      <header className="relative overflow-hidden rounded-2xl border border-[#F0A030]/30 bg-gradient-to-br from-[#13162A] via-[#1A1D33] to-[#13162A] p-6 pt-[22px]">
        <div className="pointer-events-none absolute left-0 right-0 top-0 h-[3px]" style={{ background: "linear-gradient(90deg, transparent 0%, #F0A030 25%, #38C878 50%, #F05858 75%, transparent 100%)" }} />
        <div className="pointer-events-none absolute left-3 top-3 h-6 w-6 border-l-[1.5px] border-t-[1.5px] border-[#F0A030]/50" />
        <div className="pointer-events-none absolute bottom-3 right-3 h-6 w-6 border-b-[1.5px] border-r-[1.5px] border-[#38C878]/45" />
        <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-gradient-to-br from-[#F0A030]/18 via-[#38C878]/12 to-transparent blur-3xl" />
        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 space-y-2">
            <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.22em]">
              <Link href="/dmo" className="text-white/40 hover:text-white/70 transition-colors">DMO</Link>
              <span className="text-white/25">/</span>
              <span className="text-[#F0A030]">Refilling</span>
            </div>
            <h1 className="text-2xl font-bold text-white md:text-3xl">Refilling System</h1>
            <p className="max-w-2xl text-sm text-white/65">
              PSS aur Industry verification renewal cycles. Due dates, warnings, aur STL impact
              tracking — sab yahaan monitor hota hai.
            </p>
          </div>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <VerificationStatCard tone="green" label="Active" value={stats.active} sub="on track" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M5 12l4 4L19 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>} />
        <VerificationStatCard tone="amber" label="Expiring soon" value={stats.warning} sub="needs attention" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" /><path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>} />
        <VerificationStatCard tone="red" label="Expired" value={stats.expired} sub="STL impact applied" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>} />
        <VerificationStatCard tone="purple" label="Completed" value={stats.completed} sub="renewed successfully" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>} />
      </section>

      <section className="rounded-2xl border border-white/10 bg-[#13162A]/70 p-5">
        <SectionHeader title="Health distribution" />
        <SeverityMeter segments={[
          { label: "Active", value: stats.active, tone: "green" },
          { label: "Warning", value: stats.warning, tone: "amber" },
          { label: "Expired", value: stats.expired, tone: "red" },
          { label: "Completed", value: stats.completed, tone: "purple" },
        ]} />
      </section>

      <section className="rounded-2xl border border-white/10 bg-[#13162A]/70 p-5">
        <SectionHeader eyebrow="Cycle tracking" title="Refill queue" hint="Click row for detail" right={<span className="text-[10px] text-white/45">{visible.length} row(s)</span>} />
        <div className="mt-3">
          <FilterChipRow<"ALL" | RefillStatus> options={[
            { value: "ALL" as const, label: `All · ${rows.length}` },
            { value: "ACTIVE" as const, label: `Active · ${stats.active}` },
            { value: "WARNING" as const, label: `Warning · ${stats.warning}` },
            { value: "EXPIRED" as const, label: `Expired · ${stats.expired}` },
          ]} value={statusFilter} onChange={setStatusFilter} />
        </div>
        <div className="mt-4">
          <VerificationRowGrid<RefillItem> rows={visible} columns={columns} onRowClick={(r) => setActive(r)} getRowTone={(r) => STATUS_TONE[r.status]} emptyTitle="No refills in this filter" emptyHint="Adjust filter to see records." />
        </div>
      </section>

      <VerificationDrawer open={Boolean(active)} onClose={() => setActive(null)} title={active ? active.userName : "Refill detail"} subtitle={active ? `${active.id} · ${active.type} refill` : undefined} severity={active?.status === "EXPIRED" ? "high" : active?.status === "WARNING" ? "warning" : "info"}>
        {active ? (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <VerificationChip tone={TYPE_TONE[active.type]}>{active.type}</VerificationChip>
              <VerificationChip tone={STATUS_TONE[active.status]}>{active.status}</VerificationChip>
            </div>

            <div className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/[0.04] p-4">
              <STLBadge level={active.stlLevel as any} size="md" />
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/45">Seller STL</p>
                <p className="text-lg font-bold" style={{ color: getStlMeta(active.stlLevel).accent }}>L{active.stlLevel}</p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <InfoCell label="Refill ID" value={active.id} mono />
              <InfoCell label="Type" value={active.type} />
              <InfoCell label="Due date" value={active.dueDate} mono />
              <InfoCell label="Countdown" value={dueCountdown(active.dueDate)} />
              <InfoCell label="STL impact" value={active.stlImpact} />
              <InfoCell label="Status" value={active.status} />
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button type="button" className="rounded-xl border border-[#38C878]/40 bg-[#38C878]/12 px-3 py-2 text-[11px] font-semibold text-[#38C878] transition-colors hover:border-[#38C878]/70 hover:bg-[#38C878]/20">Mark renewed</button>
              <button type="button" className="rounded-xl border border-[#F0A030]/40 bg-[#F0A030]/12 px-3 py-2 text-[11px] font-semibold text-[#F0A030] transition-colors hover:border-[#F0A030]/70 hover:bg-[#F0A030]/20">Send reminder</button>
            </div>
          </div>
        ) : null}
      </VerificationDrawer>
    </div>
  );
}
