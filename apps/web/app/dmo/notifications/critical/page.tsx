"use client";

/**
 * DMO — Notifications / Critical
 * Urgent alerts requiring immediate attention.
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

type CritSource = "STL_BREACH" | "FRAUD_ALERT" | "SLA_BREACH" | "SYSTEM_FAILURE";

type CriticalNotification = {
  id: string;
  title: string;
  source: CritSource;
  impactLevel: "HIGH" | "CRITICAL";
  acknowledgedAt: string | null;
  createdAt: string;
};

const DEMO: CriticalNotification[] = [
  { id: "crit-001", title: "STL Level Downgrade Triggered", source: "STL_BREACH", impactLevel: "CRITICAL", acknowledgedAt: null, createdAt: "2026-04-12T18:52:14Z" },
  { id: "crit-002", title: "Multi-Account Fraud Pattern Detected", source: "FRAUD_ALERT", impactLevel: "CRITICAL", acknowledgedAt: "2026-04-12T18:35:22Z", createdAt: "2026-04-12T18:32:15Z" },
  { id: "crit-003", title: "API SLA Breach: 45% Uptime", source: "SLA_BREACH", impactLevel: "HIGH", acknowledgedAt: null, createdAt: "2026-04-12T18:19:48Z" },
  { id: "crit-004", title: "Database Connection Pool Exhausted", source: "SYSTEM_FAILURE", impactLevel: "CRITICAL", acknowledgedAt: "2026-04-12T18:05:10Z", createdAt: "2026-04-12T18:01:22Z" },
  { id: "crit-005", title: "Unauthorized Access Attempt", source: "FRAUD_ALERT", impactLevel: "HIGH", acknowledgedAt: null, createdAt: "2026-04-12T17:44:10Z" },
  { id: "crit-006", title: "Blockchain Sync Failure", source: "SYSTEM_FAILURE", impactLevel: "CRITICAL", acknowledgedAt: "2026-04-12T17:15:45Z", createdAt: "2026-04-12T17:10:30Z" },
];

const SOURCE_TONE: Record<CritSource, VerificationTone> = {
  STL_BREACH: "amber",
  FRAUD_ALERT: "red",
  SLA_BREACH: "amber",
  SYSTEM_FAILURE: "red",
};

function fmt(iso: string) {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
}

function InfoCell({ label, value, mono }: { label: string; value: React.ReactNode; mono?: boolean }) {
  return (
    <div className="rounded-xl border border-white/8 bg-white/[0.03] p-3">
      <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/45">{label}</p>
      <p className={`mt-1 text-sm text-white/90 ${mono ? "font-mono" : ""}`}>{value}</p>
    </div>
  );
}

export default function CriticalNotificationsPage() {
  const [selected, setSelected] = useState<CriticalNotification | null>(null);
  const [sourceFilter, setSourceFilter] = useState<CritSource | "ALL">("ALL");

  const visible = useMemo(() => {
    if (sourceFilter === "ALL") return DEMO;
    return DEMO.filter((n) => n.source === sourceFilter);
  }, [sourceFilter]);

  const stats = useMemo(() => {
    const active = DEMO.filter((n) => !n.acknowledgedAt).length;
    const acknowledged = DEMO.filter((n) => n.acknowledgedAt).length;
    const avgResponseMs = DEMO.filter((n) => n.acknowledgedAt).reduce((sum, n) => {
      return sum + (new Date(n.acknowledgedAt!).getTime() - new Date(n.createdAt).getTime());
    }, 0);
    const avgResponseMin = Math.round(avgResponseMs / 1000 / 60 / Math.max(1, acknowledged));
    const escalated = DEMO.filter((n) => n.impactLevel === "CRITICAL").length;
    return { active, acknowledged, avgResponseMin, escalated };
  }, []);

  const columns: RowColumn<CriticalNotification>[] = [
    {
      key: "title",
      header: "Alert",
      width: "minmax(0,2fr)",
      render: (n) => (
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-[#F05858]">{n.title}</div>
          <div className="font-mono text-[10px] text-white/40">{n.id}</div>
        </div>
      ),
    },
    { key: "source", header: "Source", width: "minmax(0,1.1fr)", render: (n) => <VerificationChip tone={SOURCE_TONE[n.source]}>{n.source.replace(/_/g, " ")}</VerificationChip> },
    { key: "impact", header: "Impact", width: "minmax(0,0.9fr)", render: (n) => <VerificationChip tone={n.impactLevel === "CRITICAL" ? "red" : "amber"}>{n.impactLevel}</VerificationChip> },
    { key: "status", header: "Status", width: "minmax(0,1fr)", render: (n) => <VerificationChip tone={n.acknowledgedAt ? "teal" : "red"}>{n.acknowledgedAt ? "ACKNOWLEDGED" : "ACTIVE"}</VerificationChip> },
    { key: "time", header: "Detected", width: "minmax(0,1.1fr)", align: "right", render: (n) => <span className="text-[11px] text-white/45">{fmt(n.createdAt)}</span> },
  ];

  return (
    <div className="space-y-6">
      <header className="relative overflow-hidden rounded-2xl border border-[#F05858]/30 bg-gradient-to-br from-[#13162A] via-[#1A1D33] to-[#13162A] p-6 pt-[22px]">
        <div className="pointer-events-none absolute left-0 right-0 top-0 h-[3px]" style={{ background: "linear-gradient(90deg, transparent, #F05858 30%, #F0A030 60%, transparent)" }} />
        <div className="pointer-events-none absolute left-3 top-3 h-6 w-6 border-l-[1.5px] border-t-[1.5px] border-[#F05858]/50" />
        <div className="pointer-events-none absolute bottom-3 right-3 h-6 w-6 border-b-[1.5px] border-r-[1.5px] border-[#F0A030]/45" />
        <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-gradient-to-br from-[#F05858]/18 via-[#F0A030]/12 to-transparent blur-3xl" />
        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 space-y-2">
            <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.22em]">
              <Link href="/dmo" className="text-white/40 hover:text-white/70 transition-colors">DMO</Link>
              <span className="text-white/25">/</span>
              <Link href="/dmo/notifications" className="text-white/40 hover:text-white/70 transition-colors">Notifications</Link>
              <span className="text-white/25">/</span>
              <span className="text-[#F05858]">Critical</span>
            </div>
            <h1 className="text-2xl font-bold text-white md:text-3xl">Critical Alerts</h1>
            <p className="max-w-2xl text-sm text-white/65">
              Urgent alerts jo immediate attention chahiye — STL breaches, fraud, SLA failures, system outages.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/dmo/notifications/all" className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-white/75 transition-colors hover:border-white/20 hover:bg-white/[0.07] hover:text-white">All</Link>
            <Link href="/dmo/notifications/warnings" className="rounded-xl border border-[#F0A030]/50 bg-[#F0A030]/15 px-3 py-1.5 text-xs font-semibold text-[#F0A030] transition-colors hover:bg-[#F0A030]/25">Warnings</Link>
          </div>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <VerificationStatCard tone="red" label="Active critical" value={stats.active} sub="unacknowledged" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="currentColor" strokeWidth="1.4" /><line x1="12" y1="9" x2="12" y2="13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /><line x1="12" y1="17" x2="12.01" y2="17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>} />
        <VerificationStatCard tone="amber" label="Acknowledged" value={stats.acknowledged} sub="being addressed" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><polyline points="20 6 9 17 4 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>} />
        <VerificationStatCard tone="teal" label="Avg response" value={`${stats.avgResponseMin}m`} sub="time to acknowledge" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" /><polyline points="12 7 12 12 16 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>} />
        <VerificationStatCard tone="purple" label="Escalated" value={stats.escalated} sub="critical level" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M12 2l7 12H5l7-12z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /></svg>} />
      </section>

      <section className="rounded-2xl border border-white/10 bg-[#13162A]/70 p-5">
        <SectionHeader eyebrow="Filter" title="Alert source" hint="Refine by source" right={<span className="text-[10px] text-white/45">{visible.length} row(s)</span>} />
        <div className="mt-3">
          <FilterChipRow<CritSource | "ALL">
            options={[
              { value: "ALL", label: `All · ${DEMO.length}` },
              { value: "STL_BREACH", label: "STL Breach" },
              { value: "FRAUD_ALERT", label: "Fraud Alert" },
              { value: "SLA_BREACH", label: "SLA Breach" },
              { value: "SYSTEM_FAILURE", label: "System Failure" },
            ]}
            value={sourceFilter}
            onChange={setSourceFilter}
          />
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-[#13162A]/70 p-5">
        <SectionHeader eyebrow="Alerts" title="Critical alerts" hint={`Showing ${visible.length} of ${DEMO.length}`} right={<span className="text-[10px] text-white/45">{visible.length} row(s)</span>} />
        <div className="mt-4">
          <VerificationRowGrid<CriticalNotification>
            rows={visible}
            columns={columns}
            onRowClick={setSelected}
            getRowTone={(n) => (n.acknowledgedAt ? "amber" : "red")}
            emptyTitle="No critical alerts match"
            emptyHint="Adjust filter."
          />
        </div>
      </section>

      <VerificationDrawer
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        title={selected?.title ?? "Critical alert detail"}
        subtitle={selected ? `${selected.source.replace(/_/g, " ")} · ${new Date(selected.createdAt).toLocaleString()}` : undefined}
        severity="critical"
      >
        {selected ? (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <VerificationChip tone={SOURCE_TONE[selected.source]}>{selected.source.replace(/_/g, " ")}</VerificationChip>
              <VerificationChip tone={selected.impactLevel === "CRITICAL" ? "red" : "amber"}>{selected.impactLevel}</VerificationChip>
              <VerificationChip tone={selected.acknowledgedAt ? "teal" : "red"}>{selected.acknowledgedAt ? "ACKNOWLEDGED" : "ACTIVE"}</VerificationChip>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <InfoCell label="Alert ID" value={selected.id} mono />
              <InfoCell label="Detected" value={new Date(selected.createdAt).toLocaleString()} />
              {selected.acknowledgedAt && <InfoCell label="Acknowledged at" value={new Date(selected.acknowledgedAt).toLocaleString()} mono />}
              <InfoCell label="Impact" value={selected.impactLevel === "CRITICAL" ? "Multiple core systems affected" : "Service availability impacted"} />
            </div>
            {!selected.acknowledgedAt && (
              <button type="button" className="w-full rounded-xl border border-[#2BBFA0]/40 bg-[#2BBFA0]/12 px-3 py-2.5 text-[12px] font-semibold text-[#2BBFA0] transition-colors hover:border-[#2BBFA0]/70 hover:bg-[#2BBFA0]/20">
                Mark as Acknowledged
              </button>
            )}
          </div>
        ) : null}
      </VerificationDrawer>
    </div>
  );
}
