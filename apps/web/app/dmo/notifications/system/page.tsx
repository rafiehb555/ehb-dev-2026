"use client";

/**
 * DMO — Notifications / System
 * Infrastructure and system health alerts.
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

type SysService = "API" | "DATABASE" | "AI_ENGINE" | "BLOCKCHAIN" | "CDN" | "AUTH";
type SysStatus = "ACTIVE" | "RESOLVED" | "MONITORING";

type SystemAlert = {
  id: string;
  title: string;
  service: SysService;
  status: SysStatus;
  startedAt: string;
  resolvedAt: string | null;
};

const DEMO: SystemAlert[] = [
  { id: "sys-001", title: "API Gateway Response Lag", service: "API", status: "ACTIVE", startedAt: "2026-04-12T18:32:15Z", resolvedAt: null },
  { id: "sys-002", title: "Database Backup Failed", service: "DATABASE", status: "RESOLVED", startedAt: "2026-04-12T17:44:10Z", resolvedAt: "2026-04-12T17:52:30Z" },
  { id: "sys-003", title: "AI Engine Model Load Time Spike", service: "AI_ENGINE", status: "MONITORING", startedAt: "2026-04-12T16:58:40Z", resolvedAt: "2026-04-12T17:15:22Z" },
  { id: "sys-004", title: "Blockchain Node Sync Delayed", service: "BLOCKCHAIN", status: "ACTIVE", startedAt: "2026-04-12T18:19:48Z", resolvedAt: null },
  { id: "sys-005", title: "CDN Cache Invalidation", service: "CDN", status: "RESOLVED", startedAt: "2026-04-12T15:30:10Z", resolvedAt: "2026-04-12T15:45:33Z" },
  { id: "sys-006", title: "Auth Service Rate Limit Exceeded", service: "AUTH", status: "RESOLVED", startedAt: "2026-04-12T14:22:15Z", resolvedAt: "2026-04-12T14:35:42Z" },
  { id: "sys-007", title: "Database Connection Pool Strain", service: "DATABASE", status: "MONITORING", startedAt: "2026-04-12T12:15:30Z", resolvedAt: "2026-04-12T13:22:10Z" },
  { id: "sys-008", title: "API Health Check Failures", service: "API", status: "RESOLVED", startedAt: "2026-04-12T10:45:22Z", resolvedAt: "2026-04-12T11:02:15Z" },
];

const SERVICE_TONE: Record<SysService, VerificationTone> = {
  API: "purple",
  DATABASE: "teal",
  AI_ENGINE: "cyan",
  BLOCKCHAIN: "green",
  CDN: "amber",
  AUTH: "red",
};

const STATUS_TONE: Record<SysStatus, VerificationTone> = {
  ACTIVE: "red",
  RESOLVED: "teal",
  MONITORING: "amber",
};

function InfoCell({ label, value, mono }: { label: string; value: React.ReactNode; mono?: boolean }) {
  return (
    <div className="rounded-xl border border-white/8 bg-white/[0.03] p-3">
      <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/45">{label}</p>
      <p className={`mt-1 text-sm text-white/90 ${mono ? "font-mono" : ""}`}>{value}</p>
    </div>
  );
}

export default function SystemAlertsPage() {
  const [selected, setSelected] = useState<SystemAlert | null>(null);
  const [serviceFilter, setServiceFilter] = useState<SysService | "ALL">("ALL");

  const visible = useMemo(() => {
    if (serviceFilter === "ALL") return DEMO;
    return DEMO.filter((a) => a.service === serviceFilter);
  }, [serviceFilter]);

  const stats = useMemo(() => {
    const active = DEMO.filter((a) => a.status === "ACTIVE").length;
    const resolvedToday = DEMO.filter((a) => a.resolvedAt).length;
    const uptime = "99.97";
    const resolvedAlerts = DEMO.filter((a) => a.resolvedAt);
    const avgResMin = resolvedAlerts.length > 0
      ? Math.round(resolvedAlerts.reduce((sum, a) => sum + (new Date(a.resolvedAt!).getTime() - new Date(a.startedAt).getTime()), 0) / 1000 / 60 / resolvedAlerts.length)
      : 0;
    return { active, resolvedToday, uptime, avgResMin };
  }, []);

  const columns: RowColumn<SystemAlert>[] = [
    {
      key: "alert",
      header: "Service alert",
      width: "minmax(0,2fr)",
      render: (a) => (
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-white/85">{a.title}</div>
          <div className="font-mono text-[10px] text-white/40">{a.id}</div>
        </div>
      ),
    },
    { key: "service", header: "Service", width: "minmax(0,1.1fr)", render: (a) => <VerificationChip tone={SERVICE_TONE[a.service]}>{a.service.replace(/_/g, " ")}</VerificationChip> },
    { key: "status", header: "Status", width: "minmax(0,1fr)", render: (a) => <VerificationChip tone={STATUS_TONE[a.status]}>{a.status}</VerificationChip> },
    {
      key: "duration",
      header: "Duration",
      width: "minmax(0,1fr)",
      align: "right",
      render: (a) => {
        const started = new Date(a.startedAt).getTime();
        const ended = a.resolvedAt ? new Date(a.resolvedAt).getTime() : Date.now();
        const minutes = Math.round((ended - started) / 1000 / 60);
        return <span className="font-mono text-[11px] text-[#A098F8]">{minutes}m</span>;
      },
    },
  ];

  return (
    <div className="space-y-6">
      <header className="relative overflow-hidden rounded-2xl border border-cyan-400/30 bg-gradient-to-br from-[#13162A] via-[#1A1D33] to-[#13162A] p-6 pt-[22px]">
        <div className="pointer-events-none absolute left-0 right-0 top-0 h-[3px]" style={{ background: "linear-gradient(90deg, transparent, #67E8F9 30%, #7B6EF6 60%, transparent)" }} />
        <div className="pointer-events-none absolute left-3 top-3 h-6 w-6 border-l-[1.5px] border-t-[1.5px] border-cyan-400/50" />
        <div className="pointer-events-none absolute bottom-3 right-3 h-6 w-6 border-b-[1.5px] border-r-[1.5px] border-[#7B6EF6]/45" />
        <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-gradient-to-br from-cyan-400/18 via-[#7B6EF6]/12 to-transparent blur-3xl" />
        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 space-y-2">
            <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.22em]">
              <Link href="/dmo" className="text-white/40 hover:text-white/70 transition-colors">DMO</Link>
              <span className="text-white/25">/</span>
              <Link href="/dmo/notifications" className="text-white/40 hover:text-white/70 transition-colors">Notifications</Link>
              <span className="text-white/25">/</span>
              <span className="text-cyan-300">System</span>
            </div>
            <h1 className="text-2xl font-bold text-white md:text-3xl">System Alerts</h1>
            <p className="max-w-2xl text-sm text-white/65">
              Infrastructure aur system health — API, Database, AI Engine, Blockchain, CDN, Auth service status.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/dmo/notifications/all" className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-white/75 transition-colors hover:border-white/20 hover:bg-white/[0.07] hover:text-white">All</Link>
            <Link href="/dmo/notifications/critical" className="rounded-xl border border-[#F05858]/50 bg-[#F05858]/15 px-3 py-1.5 text-xs font-semibold text-[#F05858] transition-colors hover:bg-[#F05858]/25">Critical</Link>
          </div>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <VerificationStatCard tone="red" label="Active" value={stats.active} sub="current incidents" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" /><path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>} />
        <VerificationStatCard tone="green" label="Resolved today" value={stats.resolvedToday} sub="cleared incidents" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><polyline points="20 6 9 17 4 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>} />
        <VerificationStatCard tone="teal" label="Uptime" value={`${stats.uptime}%`} sub="this month" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" /></svg>} />
        <VerificationStatCard tone="cyan" label="Avg resolution" value={`${stats.avgResMin}m`} sub="time to fix" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" /><polyline points="12 7 12 12 16 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>} />
      </section>

      <section className="rounded-2xl border border-white/10 bg-[#13162A]/70 p-5">
        <SectionHeader eyebrow="Filter" title="Service" hint="Refine by affected service" right={<span className="text-[10px] text-white/45">{visible.length} row(s)</span>} />
        <div className="mt-3">
          <FilterChipRow<SysService | "ALL">
            options={[
              { value: "ALL", label: `All · ${DEMO.length}` },
              { value: "API", label: "API" },
              { value: "DATABASE", label: "Database" },
              { value: "AI_ENGINE", label: "AI Engine" },
              { value: "BLOCKCHAIN", label: "Blockchain" },
              { value: "CDN", label: "CDN" },
              { value: "AUTH", label: "Auth" },
            ]}
            value={serviceFilter}
            onChange={setServiceFilter}
          />
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-[#13162A]/70 p-5">
        <SectionHeader eyebrow="Status" title="System alerts" hint={`Showing ${visible.length} of ${DEMO.length}`} right={<span className="text-[10px] text-white/45">{visible.length} row(s)</span>} />
        <div className="mt-4">
          <VerificationRowGrid<SystemAlert>
            rows={visible}
            columns={columns}
            onRowClick={setSelected}
            getRowTone={(a) => STATUS_TONE[a.status]}
            emptyTitle="No system alerts match"
            emptyHint="Adjust filter."
          />
        </div>
      </section>

      <VerificationDrawer
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        title={selected?.title ?? "System alert detail"}
        subtitle={selected ? `${selected.service.replace(/_/g, " ")} · Started ${new Date(selected.startedAt).toLocaleString()}` : undefined}
        severity={selected?.status === "ACTIVE" ? "high" : selected?.status === "MONITORING" ? "warning" : "info"}
      >
        {selected ? (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <VerificationChip tone={SERVICE_TONE[selected.service]}>{selected.service.replace(/_/g, " ")}</VerificationChip>
              <VerificationChip tone={STATUS_TONE[selected.status]}>{selected.status}</VerificationChip>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <InfoCell label="Alert ID" value={selected.id} mono />
              <InfoCell label="Started at" value={new Date(selected.startedAt).toLocaleString()} mono />
              {selected.resolvedAt && <InfoCell label="Resolved at" value={new Date(selected.resolvedAt).toLocaleString()} mono />}
              <InfoCell label="Duration" value={`${Math.round(((selected.resolvedAt ? new Date(selected.resolvedAt).getTime() : Date.now()) - new Date(selected.startedAt).getTime()) / 1000 / 60)} minutes`} />
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/45 mb-2">Resolution steps</p>
              <p className="text-sm text-white/80 leading-relaxed">1. Check service health dashboard. 2. Review recent deployments. 3. Monitor resource usage. 4. Execute fallback procedures if needed.</p>
            </div>
            <button type="button" className="w-full rounded-xl border border-[#2BBFA0]/40 bg-[#2BBFA0]/12 px-3 py-2.5 text-[12px] font-semibold text-[#2BBFA0] transition-colors hover:border-[#2BBFA0]/70 hover:bg-[#2BBFA0]/20">
              View Detailed Logs
            </button>
          </div>
        ) : null}
      </VerificationDrawer>
    </div>
  );
}
