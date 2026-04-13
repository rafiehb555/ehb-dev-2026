"use client";

/**
 * DMO — Activity Engine
 *   - VerificationUI primitives only (no local Kpi, no manual filter buttons)
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
  type RowColumn,
  type VerificationTone,
} from "@/components/dmo/verification/VerificationUI";

type ActivitySource = "STL" | "PSS" | "CRB" | "Wallet" | "Complaints" | "Task" | "AI";
type ImpactLevel = "info" | "warn" | "critical";

type ActivityEvent = {
  id: string;
  when: string;
  source: ActivitySource;
  actor: string;
  action: string;
  impactLevel: ImpactLevel;
};

const DEMO: ActivityEvent[] = [
  { id: "AE-1021", when: "2026-04-11T10:42:00Z", source: "STL", actor: "dmo.sara", action: "Recalculated L7 tier for 42 sellers", impactLevel: "info" },
  { id: "AE-1020", when: "2026-04-11T10:33:00Z", source: "Complaints", actor: "dmo.hamza", action: "Issued fine USD 120 · CX-7740", impactLevel: "warn" },
  { id: "AE-1019", when: "2026-04-11T10:15:00Z", source: "PSS", actor: "pss.engine", action: "Liveness false-positive spike (AGTS)", impactLevel: "critical" },
  { id: "AE-1018", when: "2026-04-11T09:58:00Z", source: "CRB", actor: "dmo.ayesha", action: "Approved OLS Lahore certificate renewal", impactLevel: "info" },
  { id: "AE-1017", when: "2026-04-11T09:40:00Z", source: "Wallet", actor: "wallet.svc", action: "Escrow held USD 8,600 · APP-77281", impactLevel: "info" },
  { id: "AE-1016", when: "2026-04-11T09:15:00Z", source: "Task", actor: "task.router", action: "Routed 12 SLA-expiring tasks", impactLevel: "warn" },
  { id: "AE-1015", when: "2026-04-11T09:02:00Z", source: "AI", actor: "ai.guide", action: "Suggested 3 stale L3 sellers for refill", impactLevel: "info" },
  { id: "AE-1014", when: "2026-04-11T08:30:00Z", source: "STL", actor: "stl.cron", action: "Nightly recalculation job completed — 4,812 sellers", impactLevel: "info" },
];

const SOURCE_TONE: Record<ActivitySource, VerificationTone> = {
  STL: "purple",
  PSS: "teal",
  CRB: "cyan",
  Wallet: "amber",
  Complaints: "red",
  Task: "purple",
  AI: "green",
};

const IMPACT_TONE: Record<ImpactLevel, VerificationTone> = {
  info: "green",
  warn: "amber",
  critical: "red",
};

function fmtTime(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
}

function InfoCell({ label, value, mono }: { label: string; value: React.ReactNode; mono?: boolean }) {
  return (
    <div className="rounded-xl border border-white/8 bg-white/[0.03] p-3">
      <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/45">{label}</p>
      <p className={`mt-1 text-sm text-white/90 ${mono ? "font-mono" : ""}`}>{value}</p>
    </div>
  );
}

export default function ActivityEnginePage() {
  const [rows] = useState<ActivityEvent[]>(DEMO);
  const [filter, setFilter] = useState<"ALL" | ActivitySource>("ALL");
  const [active, setActive] = useState<ActivityEvent | null>(null);

  const visible = useMemo(
    () => (filter === "ALL" ? rows : rows.filter((e) => e.source === filter)),
    [rows, filter],
  );

  const stats = useMemo(
    () => ({
      events24h: rows.length,
      critical: rows.filter((e) => e.impactLevel === "critical").length,
      operators: new Set(rows.map((e) => e.actor)).size,
      aiAssists: rows.filter((e) => e.source === "AI").length,
    }),
    [rows],
  );

  const columns: RowColumn<ActivityEvent>[] = [
    {
      key: "time",
      header: "Time",
      width: "minmax(0,0.5fr)",
      render: (r) => <span className="font-mono text-[11px] text-white/55">{fmtTime(r.when)}</span>,
    },
    {
      key: "source",
      header: "Source",
      width: "minmax(0,0.7fr)",
      render: (r) => <VerificationChip tone={SOURCE_TONE[r.source]}>{r.source}</VerificationChip>,
    },
    {
      key: "action",
      header: "Action",
      width: "minmax(0,2.5fr)",
      render: (r) => (
        <div className="min-w-0">
          <div className="truncate text-sm text-white">{r.action}</div>
          <div className="text-[10px] text-white/50">{r.id} · {r.actor}</div>
        </div>
      ),
    },
    {
      key: "impact",
      header: "Impact",
      width: "minmax(0,0.7fr)",
      align: "right",
      render: (r) => <VerificationChip tone={IMPACT_TONE[r.impactLevel]} size="xs">{r.impactLevel.toUpperCase()}</VerificationChip>,
    },
  ];

  return (
    <div className="space-y-6">
      <header className="relative overflow-hidden rounded-2xl border border-[#7B6EF6]/30 bg-gradient-to-br from-[#13162A] via-[#1A1D33] to-[#13162A] p-6 pt-[22px]">
        <div className="pointer-events-none absolute left-0 right-0 top-0 h-[3px]" style={{ background: "linear-gradient(90deg, transparent 0%, #7B6EF6 25%, #2BBFA0 50%, #F0A030 75%, transparent 100%)" }} />
        <div className="pointer-events-none absolute left-3 top-3 h-6 w-6 border-l-[1.5px] border-t-[1.5px] border-[#7B6EF6]/50" />
        <div className="pointer-events-none absolute bottom-3 right-3 h-6 w-6 border-b-[1.5px] border-r-[1.5px] border-[#2BBFA0]/45" />
        <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-gradient-to-br from-[#7B6EF6]/20 via-[#2BBFA0]/15 to-transparent blur-3xl" />
        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 space-y-2">
            <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.22em]">
              <Link href="/dmo" className="text-white/40 hover:text-white/70 transition-colors">DMO</Link>
              <span className="text-white/25">/</span>
              <span className="text-[#A098F8]">Activity Engine</span>
            </div>
            <h1 className="text-2xl font-bold text-white md:text-3xl">Activity Engine</h1>
            <p className="max-w-2xl text-sm text-white/65">
              DMO ki every move — operators, services, aur AI ke actions ek unified timeline
              pa. Audit trail aur compliance ke liye immutable append-only log.
            </p>
          </div>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <VerificationStatCard tone="purple" label="Events (24h)" value={stats.events24h} sub="total logged" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" /></svg>} />
        <VerificationStatCard tone="red" label="Critical" value={stats.critical} sub="needs attention" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M12 8v4m0 4h.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="currentColor" strokeWidth="1.4" /></svg>} />
        <VerificationStatCard tone="teal" label="Operators" value={stats.operators} sub="active actors" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="1.6" /><circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.6" /></svg>} />
        <VerificationStatCard tone="green" label="AI assists" value={stats.aiAssists} sub="guide suggestions" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M12 3l2.6 5.3 5.9.9-4.3 4.2 1 5.9L12 16.5l-5.3 2.8 1-5.9L3.5 9.2l5.9-.9L12 3z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" /></svg>} />
      </section>

      <section className="rounded-2xl border border-white/10 bg-[#13162A]/70 p-5">
        <SectionHeader title="Impact distribution" hint="Critical vs warn vs info" />
        <SeverityMeter segments={[
          { label: "Critical", value: stats.critical, tone: "red" },
          { label: "Warning", value: rows.filter((e) => e.impactLevel === "warn").length, tone: "amber" },
          { label: "Info", value: rows.filter((e) => e.impactLevel === "info").length, tone: "green" },
        ]} />
      </section>

      <section className="rounded-2xl border border-white/10 bg-[#13162A]/70 p-5">
        <SectionHeader eyebrow="Audit trail" title="Event timeline" hint="Click row for detail" right={<span className="text-[10px] text-white/45">{visible.length} event(s)</span>} />
        <div className="mt-3">
          <FilterChipRow<"ALL" | ActivitySource>
            options={[
              { value: "ALL" as const, label: `All · ${rows.length}` },
              { value: "STL" as const, label: "STL" },
              { value: "PSS" as const, label: "PSS" },
              { value: "CRB" as const, label: "CRB" },
              { value: "Wallet" as const, label: "Wallet" },
              { value: "Complaints" as const, label: "Complaints" },
              { value: "Task" as const, label: "Task" },
              { value: "AI" as const, label: "AI" },
            ]}
            value={filter}
            onChange={setFilter}
          />
        </div>
        <div className="mt-4">
          <VerificationRowGrid<ActivityEvent>
            rows={visible}
            columns={columns}
            onRowClick={(r) => setActive(r)}
            getRowTone={(r) => IMPACT_TONE[r.impactLevel]}
            emptyTitle="No events in this filter"
            emptyHint="Adjust filter to see activity."
          />
        </div>
      </section>

      <VerificationDrawer
        open={Boolean(active)}
        onClose={() => setActive(null)}
        title={active ? active.action : "Event detail"}
        subtitle={active ? `${active.id} · ${active.actor}` : undefined}
        severity={active?.impactLevel === "critical" ? "critical" : active?.impactLevel === "warn" ? "warning" : "info"}
      >
        {active ? (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <VerificationChip tone={SOURCE_TONE[active.source]}>{active.source}</VerificationChip>
              <VerificationChip tone={IMPACT_TONE[active.impactLevel]}>{active.impactLevel.toUpperCase()}</VerificationChip>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4 text-[13px] leading-relaxed text-white/75">
              {active.action}
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <InfoCell label="Event ID" value={active.id} mono />
              <InfoCell label="Source" value={active.source} />
              <InfoCell label="Actor" value={active.actor} mono />
              <InfoCell label="Time" value={fmtTime(active.when)} />
              <InfoCell label="Impact" value={active.impactLevel.toUpperCase()} />
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button type="button" className="rounded-xl border border-[#38C878]/40 bg-[#38C878]/12 px-3 py-2 text-[11px] font-semibold text-[#38C878] transition-colors hover:border-[#38C878]/70 hover:bg-[#38C878]/20">Acknowledge</button>
              <button type="button" className="rounded-xl border border-[#F0A030]/40 bg-[#F0A030]/12 px-3 py-2 text-[11px] font-semibold text-[#F0A030] transition-colors hover:border-[#F0A030]/70 hover:bg-[#F0A030]/20">Escalate</button>
            </div>
          </div>
        ) : null}
      </VerificationDrawer>
    </div>
  );
}
