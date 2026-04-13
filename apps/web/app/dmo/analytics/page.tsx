"use client";

/**
 * DMO — Marketplace Analytics
 *   - VerificationUI primitives only (no local KpiCard)
 *   - In-file demo data (prototype only, no fetch)
 *   - 7-day fraud signal histogram + CSV export preserved
 */

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  VerificationStatCard,
  VerificationRowGrid,
  VerificationDrawer,
  VerificationChip,
  SectionHeader,
  SeverityMeter,
  type RowColumn,
  type VerificationTone,
} from "@/components/dmo/verification/VerificationUI";

type FraudSignal = {
  id: string;
  day: string;
  count: number;
  peakSource: string;
  status: "resolved" | "active" | "false_positive";
};

const DEMO_SIGNALS: FraudSignal[] = [
  { id: "FS-01", day: "Mon", count: 4, peakSource: "AI fraud engine", status: "resolved" },
  { id: "FS-02", day: "Tue", count: 6, peakSource: "CRB mismatch", status: "active" },
  { id: "FS-03", day: "Wed", count: 3, peakSource: "PSS liveness", status: "resolved" },
  { id: "FS-04", day: "Thu", count: 7, peakSource: "Fake reviews", status: "active" },
  { id: "FS-05", day: "Fri", count: 5, peakSource: "AI fraud engine", status: "resolved" },
  { id: "FS-06", day: "Sat", count: 2, peakSource: "Wallet anomaly", status: "false_positive" },
  { id: "FS-07", day: "Sun", count: 1, peakSource: "Manual report", status: "resolved" },
];

const STATUS_TONE: Record<FraudSignal["status"], VerificationTone> = {
  resolved: "green",
  active: "red",
  false_positive: "amber",
};

const STATS = {
  fraudAlerts: 12,
  complaints: 23,
  orderReviews: 9,
  falsePositives: 5,
  penaltiesIssued: 34,
};

function InfoCell({ label, value, mono }: { label: string; value: React.ReactNode; mono?: boolean }) {
  return (
    <div className="rounded-xl border border-white/8 bg-white/[0.03] p-3">
      <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/45">{label}</p>
      <p className={`mt-1 text-sm text-white/90 ${mono ? "font-mono" : ""}`}>{value}</p>
    </div>
  );
}

function exportDemoCsv() {
  const rows = [
    ["metric", "value"],
    ["fraud_unresolved", String(STATS.fraudAlerts)],
    ["fraud_false_positives", String(STATS.falsePositives)],
    ["fraud_penalties", String(STATS.penaltiesIssued)],
    ["complaints_pending", String(STATS.complaints)],
    ["order_reviews", String(STATS.orderReviews)],
  ];
  const csv = rows.map((r) => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "dmo-marketplace-analytics.csv";
  a.click();
  URL.revokeObjectURL(url);
}

export default function DmoAnalyticsPage() {
  const [signals] = useState<FraudSignal[]>(DEMO_SIGNALS);
  const [active, setActive] = useState<FraudSignal | null>(null);

  const maxSignal = useMemo(() => Math.max(1, ...signals.map((s) => s.count)), [signals]);

  const columns: RowColumn<FraudSignal>[] = [
    {
      key: "day",
      header: "Day",
      width: "minmax(0,0.6fr)",
      render: (r) => <span className="font-mono text-sm text-white/80">{r.day}</span>,
    },
    {
      key: "bar",
      header: "Signals",
      width: "minmax(0,2.5fr)",
      render: (r) => (
        <div className="flex items-center gap-3">
          <div className="flex-1 h-3 overflow-hidden rounded-full bg-white/[0.06]">
            <div className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-[#7B6EF6] to-[#2BBFA0]" style={{ width: `${(r.count / maxSignal) * 100}%` }} />
          </div>
          <span className="w-6 text-right font-mono text-xs text-white/80">{r.count}</span>
        </div>
      ),
    },
    {
      key: "source",
      header: "Peak source",
      width: "minmax(0,1.2fr)",
      render: (r) => <span className="text-[11px] text-white/60">{r.peakSource}</span>,
    },
    {
      key: "status",
      header: "Status",
      width: "minmax(0,0.9fr)",
      render: (r) => <VerificationChip tone={STATUS_TONE[r.status]}>{r.status.replace("_", " ").toUpperCase()}</VerificationChip>,
    },
  ];

  return (
    <div className="space-y-6">
      <header className="relative overflow-hidden rounded-2xl border border-cyan-400/30 bg-gradient-to-br from-[#13162A] via-[#1A1D33] to-[#13162A] p-6 pt-[22px]">
        <div className="pointer-events-none absolute left-0 right-0 top-0 h-[3px]" style={{ background: "linear-gradient(90deg, transparent 0%, #67E8F9 25%, #7B6EF6 50%, #2BBFA0 75%, transparent 100%)" }} />
        <div className="pointer-events-none absolute left-3 top-3 h-6 w-6 border-l-[1.5px] border-t-[1.5px] border-cyan-400/50" />
        <div className="pointer-events-none absolute bottom-3 right-3 h-6 w-6 border-b-[1.5px] border-r-[1.5px] border-[#7B6EF6]/45" />
        <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-gradient-to-br from-cyan-400/20 via-[#7B6EF6]/15 to-transparent blur-3xl" />
        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 space-y-2">
            <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.22em]">
              <Link href="/dmo" className="text-white/40 hover:text-white/70 transition-colors">DMO</Link>
              <span className="text-white/25">/</span>
              <span className="text-cyan-300">Analytics</span>
            </div>
            <h1 className="text-2xl font-bold text-white md:text-3xl">DMO Marketplace Analytics</h1>
            <p className="max-w-2xl text-sm text-white/65">
              Orders, complaints, fraud alerts, pending reviews — sab ek hi surface pa. 7-day
              signal histogram + CSV export for offline reporting.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/dmo/roadmap" className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-white/75 transition-colors hover:border-white/20 hover:bg-white/[0.07] hover:text-white">Growth roadmap</Link>
            <button type="button" onClick={exportDemoCsv} className="rounded-xl border border-cyan-400/50 bg-cyan-400/15 px-3 py-1.5 text-xs font-semibold text-cyan-100 transition-colors hover:border-cyan-300/80 hover:bg-cyan-400/25 hover:text-white">Export CSV</button>
          </div>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <VerificationStatCard tone="red" label="Fraud alerts" value={STATS.fraudAlerts} sub="unresolved" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M12 8v4m0 4h.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="currentColor" strokeWidth="1.4" /></svg>} />
        <VerificationStatCard tone="amber" label="Complaints" value={STATS.complaints} sub="pending resolution" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" /><path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>} />
        <VerificationStatCard tone="purple" label="Order reviews" value={STATS.orderReviews} sub="awaiting decision" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" /></svg>} />
        <VerificationStatCard tone="cyan" label="False positives" value={STATS.falsePositives} sub="flagged incorrectly" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>} />
      </section>

      <section className="rounded-2xl border border-white/10 bg-[#13162A]/70 p-5">
        <SectionHeader title="Alert distribution" hint="Fraud vs complaints vs reviews" />
        <SeverityMeter segments={[
          { label: "Fraud", value: STATS.fraudAlerts, tone: "red" },
          { label: "Complaints", value: STATS.complaints, tone: "amber" },
          { label: "Reviews", value: STATS.orderReviews, tone: "purple" },
          { label: "False positive", value: STATS.falsePositives, tone: "cyan" },
        ]} />
      </section>

      <section className="rounded-2xl border border-white/10 bg-[#13162A]/70 p-5">
        <SectionHeader eyebrow="Fraud engine" title="7-day signal histogram" hint="Click row for detail" right={<span className="text-[10px] text-white/45">{signals.length} day(s)</span>} />
        <div className="mt-4">
          <VerificationRowGrid<FraudSignal>
            rows={signals}
            columns={columns}
            onRowClick={(r) => setActive(r)}
            getRowTone={(r) => STATUS_TONE[r.status]}
            emptyTitle="No signals"
            emptyHint="Fraud engine offline."
          />
        </div>
      </section>

      {/* Penalties issued card */}
      <section className="relative overflow-hidden rounded-2xl border border-[#F05858]/25 bg-[#13162A]/70 p-5 pt-[22px]">
        <div className="pointer-events-none absolute left-0 right-0 top-0 h-[3px]" style={{ background: "linear-gradient(90deg, transparent, #F05858, transparent)" }} />
        <SectionHeader title="Enforcement stats" hint="All-time totals" />
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <InfoCell label="Penalties issued" value={STATS.penaltiesIssued} mono />
          <InfoCell label="Fraud alerts (active)" value={STATS.fraudAlerts} mono />
          <InfoCell label="False positive rate" value={`${Math.round((STATS.falsePositives / (STATS.fraudAlerts + STATS.falsePositives)) * 100)}%`} />
        </div>
      </section>

      <VerificationDrawer
        open={Boolean(active)}
        onClose={() => setActive(null)}
        title={active ? `${active.day} — ${active.count} signals` : "Signal detail"}
        subtitle={active ? `${active.id} · Peak: ${active.peakSource}` : undefined}
        severity={active?.status === "active" ? "high" : "info"}
      >
        {active ? (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <VerificationChip tone={STATUS_TONE[active.status]}>{active.status.replace("_", " ").toUpperCase()}</VerificationChip>
              <VerificationChip tone="cyan">{active.peakSource}</VerificationChip>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <InfoCell label="Day" value={active.day} />
              <InfoCell label="Signals" value={active.count} mono />
              <InfoCell label="Peak source" value={active.peakSource} />
              <InfoCell label="Status" value={active.status.replace("_", " ")} />
            </div>
          </div>
        ) : null}
      </VerificationDrawer>
    </div>
  );
}
