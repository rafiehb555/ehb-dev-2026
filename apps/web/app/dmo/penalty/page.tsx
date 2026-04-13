"use client";

/**
 * DMO — Penalty System
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

type PenaltyStatus = "ACTIVE" | "RESOLVED" | "APPEAL";
type PenaltyType = "SLA_DELAY" | "REFILL_MISS" | "FRAUD" | "QUALITY";

type PenaltyRow = {
  id: string;
  userName: string;
  type: PenaltyType;
  amount: number;
  reason: string;
  status: PenaltyStatus;
  createdAt: string;
  stlImpact: number;
  sellerStl: number;
};

const DEMO: PenaltyRow[] = [
  { id: "PEN-501", userName: "Zara Boutique", type: "FRAUD", amount: 800, reason: "Counterfeit product flagged by CRB panel", status: "ACTIVE", createdAt: "2026-04-12T09:00:00Z", stlImpact: -25, sellerStl: 4 },
  { id: "PEN-500", userName: "MediCare Plus", type: "SLA_DELAY", amount: 200, reason: "Shipment SLA exceeded by 72h (3rd occurrence)", status: "ACTIVE", createdAt: "2026-04-11T14:30:00Z", stlImpact: -10, sellerStl: 6 },
  { id: "PEN-499", userName: "TechHub Lahore", type: "QUALITY", amount: 350, reason: "Product quality below industry standard — 3 buyer complaints", status: "APPEAL", createdAt: "2026-04-10T11:15:00Z", stlImpact: -15, sellerStl: 5 },
  { id: "PEN-498", userName: "SafeTravel PK", type: "REFILL_MISS", amount: 150, reason: "Refill cycle missed — CRB certificate expired without renewal", status: "RESOLVED", createdAt: "2026-04-09T08:00:00Z", stlImpact: -8, sellerStl: 7 },
  { id: "PEN-497", userName: "Karachi Mart", type: "FRAUD", amount: 1200, reason: "Fake reviews detected by AI fraud engine — 14 flagged", status: "ACTIVE", createdAt: "2026-04-08T17:20:00Z", stlImpact: -30, sellerStl: 3 },
  { id: "PEN-496", userName: "LegalEase OLS", type: "SLA_DELAY", amount: 100, reason: "Case response delayed beyond 48h SLA", status: "RESOLVED", createdAt: "2026-04-07T10:00:00Z", stlImpact: -5, sellerStl: 8 },
];

const STATUS_TONE: Record<PenaltyStatus, VerificationTone> = { ACTIVE: "red", RESOLVED: "green", APPEAL: "amber" };
const TYPE_TONE: Record<PenaltyType, VerificationTone> = { SLA_DELAY: "amber", REFILL_MISS: "teal", FRAUD: "red", QUALITY: "purple" };

function fmtTime(iso: string) {
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

export default function PenaltyPage() {
  const [rows] = useState<PenaltyRow[]>(DEMO);
  const [statusFilter, setStatusFilter] = useState<"ALL" | PenaltyStatus>("ALL");
  const [active, setActive] = useState<PenaltyRow | null>(null);

  const stats = useMemo(() => ({
    total: rows.length,
    activePenalties: rows.filter((p) => p.status === "ACTIVE").length,
    highRisk: rows.filter((p) => p.type === "FRAUD" || p.stlImpact <= -15).length,
    resolved: rows.filter((p) => p.status === "RESOLVED").length,
  }), [rows]);

  const visible = statusFilter === "ALL" ? rows : rows.filter((r) => r.status === statusFilter);

  const columns: RowColumn<PenaltyRow>[] = [
    {
      key: "penalty",
      header: "Penalty",
      width: "minmax(0,2fr)",
      render: (r) => (
        <div className="min-w-0">
          <div className="font-mono text-[10px] text-white/45">{r.id}</div>
          <div className="truncate text-sm font-semibold text-white">{r.userName}</div>
          <div className="truncate text-[10px] text-white/50">{r.reason}</div>
        </div>
      ),
    },
    { key: "type", header: "Type", width: "minmax(0,0.9fr)", render: (r) => <VerificationChip tone={TYPE_TONE[r.type]}>{r.type.replace("_", " ")}</VerificationChip> },
    { key: "amount", header: "Fine", width: "minmax(0,0.7fr)", align: "right", render: (r) => <span className="font-mono text-sm text-[#F05858]">${r.amount}</span> },
    { key: "stl", header: "STL hit", width: "minmax(0,0.7fr)", align: "right", render: (r) => <span className="font-mono text-sm text-[#F05858]">{r.stlImpact}</span> },
    { key: "status", header: "Status", width: "minmax(0,0.9fr)", render: (r) => <VerificationChip tone={STATUS_TONE[r.status]}>{r.status}</VerificationChip> },
    { key: "date", header: "Filed", width: "minmax(0,0.9fr)", align: "right", render: (r) => <span className="text-[10px] text-white/45">{fmtTime(r.createdAt)}</span> },
  ];

  return (
    <div className="space-y-6">
      <header className="relative overflow-hidden rounded-2xl border border-[#F05858]/30 bg-gradient-to-br from-[#13162A] via-[#1A1D33] to-[#13162A] p-6 pt-[22px]">
        <div className="pointer-events-none absolute left-0 right-0 top-0 h-[3px]" style={{ background: "linear-gradient(90deg, transparent 0%, #F05858 25%, #F0A030 50%, #7B6EF6 75%, transparent 100%)" }} />
        <div className="pointer-events-none absolute left-3 top-3 h-6 w-6 border-l-[1.5px] border-t-[1.5px] border-[#F05858]/50" />
        <div className="pointer-events-none absolute bottom-3 right-3 h-6 w-6 border-b-[1.5px] border-r-[1.5px] border-[#F0A030]/45" />
        <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-gradient-to-br from-[#F05858]/18 via-[#F0A030]/12 to-transparent blur-3xl" />
        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 space-y-2">
            <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.22em]">
              <Link href="/dmo" className="text-white/40 hover:text-white/70 transition-colors">DMO</Link>
              <span className="text-white/25">/</span>
              <span className="text-[#F05858]">Penalty</span>
            </div>
            <h1 className="text-2xl font-bold text-white md:text-3xl">Penalty System</h1>
            <p className="max-w-2xl text-sm text-white/65">
              Seller violations, fines, aur STL impact tracker. Fraud, SLA delays, refill misses,
              quality issues — sab ka record with appeal flow.
            </p>
          </div>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <VerificationStatCard tone="red" label="Total penalties" value={stats.total} sub="all-time" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M12 8v4m0 4h.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="currentColor" strokeWidth="1.4" /></svg>} />
        <VerificationStatCard tone="amber" label="Active" value={stats.activePenalties} sub="enforcement live" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" /><path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>} />
        <VerificationStatCard tone="purple" label="High risk" value={stats.highRisk} sub="fraud or stl ≤ -15" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M12 3l2.6 5.3 5.9.9-4.3 4.2 1 5.9L12 16.5l-5.3 2.8 1-5.9L3.5 9.2l5.9-.9L12 3z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" /></svg>} />
        <VerificationStatCard tone="green" label="Resolved" value={stats.resolved} sub="closed cases" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M5 12l4 4L19 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>} />
      </section>

      <section className="rounded-2xl border border-white/10 bg-[#13162A]/70 p-5">
        <SectionHeader title="Penalty distribution" hint="Active vs appeal vs resolved" />
        <SeverityMeter segments={[
          { label: "Active", value: stats.activePenalties, tone: "red" },
          { label: "Appeal", value: rows.filter((r) => r.status === "APPEAL").length, tone: "amber" },
          { label: "Resolved", value: stats.resolved, tone: "green" },
        ]} />
      </section>

      <section className="rounded-2xl border border-white/10 bg-[#13162A]/70 p-5">
        <SectionHeader eyebrow="Enforcement" title="Penalty queue" hint="Click row for detail + appeal" right={<span className="text-[10px] text-white/45">{visible.length} row(s)</span>} />
        <div className="mt-3">
          <FilterChipRow<"ALL" | PenaltyStatus> options={[
            { value: "ALL", label: `All · ${rows.length}` },
            { value: "ACTIVE", label: `Active · ${stats.activePenalties}` },
            { value: "APPEAL", label: "Appeal" },
            { value: "RESOLVED", label: `Resolved · ${stats.resolved}` },
          ]} value={statusFilter} onChange={setStatusFilter} />
        </div>
        <div className="mt-4">
          <VerificationRowGrid<PenaltyRow> rows={visible} columns={columns} onRowClick={(r) => setActive(r)} getRowTone={(r) => STATUS_TONE[r.status]} emptyTitle="No penalties in this filter" emptyHint="Adjust filter to see penalties." />
        </div>
      </section>

      <VerificationDrawer open={Boolean(active)} onClose={() => setActive(null)} title={active ? `${active.userName} — ${active.type.replace("_", " ")}` : "Penalty detail"} subtitle={active ? `${active.id} · Filed ${fmtTime(active.createdAt)}` : undefined} severity={active?.type === "FRAUD" ? "critical" : (active?.stlImpact ?? 0) <= -15 ? "high" : "warning"}>
        {active ? (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <VerificationChip tone={TYPE_TONE[active.type]}>{active.type.replace("_", " ")}</VerificationChip>
              <VerificationChip tone={STATUS_TONE[active.status]}>{active.status}</VerificationChip>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4 text-[13px] leading-relaxed text-white/75">{active.reason}</div>

            <div className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/[0.04] p-4">
              <STLBadge level={active.sellerStl as any} size="md" />
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/45">Seller STL</p>
                <p className="text-lg font-bold" style={{ color: getStlMeta(active.sellerStl).accent }}>L{active.sellerStl}</p>
                <p className="font-mono text-sm text-[#F05858]">Impact: {active.stlImpact} pts</p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <InfoCell label="Penalty ID" value={active.id} mono />
              <InfoCell label="Fine" value={`$${active.amount}`} mono />
              <InfoCell label="STL impact" value={`${active.stlImpact} points`} />
              <InfoCell label="Filed" value={fmtTime(active.createdAt)} />
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2">
              <button type="button" className="rounded-xl border border-[#38C878]/40 bg-[#38C878]/12 px-3 py-2 text-[11px] font-semibold text-[#38C878] transition-colors hover:border-[#38C878]/70 hover:bg-[#38C878]/20">Resolve</button>
              <button type="button" className="rounded-xl border border-[#F0A030]/40 bg-[#F0A030]/12 px-3 py-2 text-[11px] font-semibold text-[#F0A030] transition-colors hover:border-[#F0A030]/70 hover:bg-[#F0A030]/20">Open appeal</button>
              <button type="button" className="rounded-xl border border-[#F05858]/40 bg-[#F05858]/12 px-3 py-2 text-[11px] font-semibold text-[#F05858] transition-colors hover:border-[#F05858]/70 hover:bg-[#F05858]/20">Escalate</button>
            </div>
          </div>
        ) : null}
      </VerificationDrawer>
    </div>
  );
}
