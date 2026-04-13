"use client";

/**
 * DMO — Notifications Center
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

type NotificationType = "CRITICAL" | "WARNING" | "INFO";

type NotificationItem = {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  time: string;
  nextAction?: string;
};

const DEMO: NotificationItem[] = [
  { id: "N-9012", title: "STL gold-master regression alert", message: "Seller L7 recalculation job detected 3 dimension drifts on OLS Karachi.", type: "CRITICAL", time: "2026-04-11T10:42:00Z", nextAction: "Open STL Trust Calculator" },
  { id: "N-9011", title: "PSS liveness false-positive spike", message: "AGTS onboarding flow — raise threshold to 0.82 for 24h.", type: "CRITICAL", time: "2026-04-11T10:15:00Z", nextAction: "Open PSS engine" },
  { id: "N-9010", title: "CRB inspection SLA approaching", message: "2 Karachi inspections within 72h SLA — re-route to standby inspector.", type: "WARNING", time: "2026-04-11T09:58:00Z", nextAction: "Open CRB queue" },
  { id: "N-9009", title: "Refill expiry · 3 sellers", message: "WMS, OLS, AGTS refills expiring in < 48h — send reminders.", type: "WARNING", time: "2026-04-11T09:20:00Z", nextAction: "Open Refill Management" },
  { id: "N-9008", title: "AGTS Dubai revenue +19.3% MoM", message: "Consider Phase-2 franchise tier promotion.", type: "INFO", time: "2026-04-11T09:02:00Z" },
  { id: "N-9007", title: "Weekly STL audit complete", message: "4,812 sellers recalculated — 247 sellers at L7+.", type: "INFO", time: "2026-04-11T08:30:00Z" },
];

const TYPE_TONE: Record<NotificationType, VerificationTone> = {
  CRITICAL: "red",
  WARNING: "amber",
  INFO: "green",
};

function fmtTime(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

function InfoCell({ label, value, mono }: { label: string; value: React.ReactNode; mono?: boolean }) {
  return (
    <div className="rounded-xl border border-white/8 bg-white/[0.03] p-3">
      <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/45">{label}</p>
      <p className={`mt-1 text-sm text-white/90 ${mono ? "font-mono" : ""}`}>{value}</p>
    </div>
  );
}

export default function NotificationsPage() {
  const [rows] = useState<NotificationItem[]>(DEMO);
  const [filter, setFilter] = useState<"ALL" | NotificationType>("ALL");
  const [active, setActive] = useState<NotificationItem | null>(null);

  const stats = useMemo(() => ({
    total: rows.length,
    critical: rows.filter((n) => n.type === "CRITICAL").length,
    warning: rows.filter((n) => n.type === "WARNING").length,
    info: rows.filter((n) => n.type === "INFO").length,
  }), [rows]);

  const visible = filter === "ALL" ? rows : rows.filter((n) => n.type === filter);

  const columns: RowColumn<NotificationItem>[] = [
    {
      key: "severity",
      header: "Type",
      width: "minmax(0,0.7fr)",
      render: (r) => <VerificationChip tone={TYPE_TONE[r.type]}>{r.type}</VerificationChip>,
    },
    {
      key: "notification",
      header: "Notification",
      width: "minmax(0,2.5fr)",
      render: (r) => (
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-white">{r.title}</div>
          <div className="truncate text-[10px] text-white/50">{r.message}</div>
        </div>
      ),
    },
    {
      key: "action",
      header: "Next action",
      width: "minmax(0,1.2fr)",
      render: (r) => r.nextAction
        ? <span className="text-[11px] text-[#A098F8]">→ {r.nextAction}</span>
        : <span className="text-[10px] text-white/35">—</span>,
    },
    {
      key: "time",
      header: "Time",
      width: "minmax(0,0.9fr)",
      align: "right",
      render: (r) => <span className="text-[10px] text-white/45">{fmtTime(r.time)}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <header className="relative overflow-hidden rounded-2xl border border-[#F05858]/30 bg-gradient-to-br from-[#13162A] via-[#1A1D33] to-[#13162A] p-6 pt-[22px]">
        <div className="pointer-events-none absolute left-0 right-0 top-0 h-[3px]" style={{ background: "linear-gradient(90deg, transparent 0%, #F05858 25%, #F0A030 50%, #38C878 75%, transparent 100%)" }} />
        <div className="pointer-events-none absolute left-3 top-3 h-6 w-6 border-l-[1.5px] border-t-[1.5px] border-[#F05858]/50" />
        <div className="pointer-events-none absolute bottom-3 right-3 h-6 w-6 border-b-[1.5px] border-r-[1.5px] border-[#F0A030]/45" />
        <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-gradient-to-br from-[#F05858]/20 via-[#F0A030]/15 to-transparent blur-3xl" />
        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 space-y-2">
            <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.22em]">
              <Link href="/dmo" className="text-white/40 hover:text-white/70 transition-colors">DMO</Link>
              <span className="text-white/25">/</span>
              <span className="text-[#F05858]">Notifications</span>
            </div>
            <h1 className="text-2xl font-bold text-white md:text-3xl">Notifications</h1>
            <p className="max-w-2xl text-sm text-white/65">
              Real-time alerts from STL, PSS, CRB, Wallet, Complaints, aur Refill — critical
              wale sab se upar rehtay hain. Click kar ke next action pa jaayen.
            </p>
          </div>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <VerificationStatCard tone="purple" label="Total" value={stats.total} sub="all notifications" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /><path d="M13.73 21a2 2 0 01-3.46 0" stroke="currentColor" strokeWidth="1.6" /></svg>} />
        <VerificationStatCard tone="red" label="Critical" value={stats.critical} sub="immediate action" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M12 8v4m0 4h.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="currentColor" strokeWidth="1.4" /></svg>} />
        <VerificationStatCard tone="amber" label="Warning" value={stats.warning} sub="needs attention" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" /><path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>} />
        <VerificationStatCard tone="green" label="Info" value={stats.info} sub="informational" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M5 12l4 4L19 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>} />
      </section>

      <section className="rounded-2xl border border-white/10 bg-[#13162A]/70 p-5">
        <SectionHeader title="Severity distribution" />
        <SeverityMeter segments={[
          { label: "Critical", value: stats.critical, tone: "red" },
          { label: "Warning", value: stats.warning, tone: "amber" },
          { label: "Info", value: stats.info, tone: "green" },
        ]} />
      </section>

      <section className="rounded-2xl border border-white/10 bg-[#13162A]/70 p-5">
        <SectionHeader eyebrow="Alert feed" title="Notification queue" hint="Click row for detail + action" right={<span className="text-[10px] text-white/45">{visible.length} alert(s)</span>} />
        <div className="mt-3">
          <FilterChipRow<"ALL" | NotificationType>
            options={[
              { value: "ALL" as const, label: `All · ${rows.length}` },
              { value: "CRITICAL" as const, label: `Critical · ${stats.critical}` },
              { value: "WARNING" as const, label: `Warning · ${stats.warning}` },
              { value: "INFO" as const, label: `Info · ${stats.info}` },
            ]}
            value={filter}
            onChange={setFilter}
          />
        </div>
        <div className="mt-4">
          <VerificationRowGrid<NotificationItem>
            rows={visible}
            columns={columns}
            onRowClick={(r) => setActive(r)}
            getRowTone={(r) => TYPE_TONE[r.type]}
            emptyTitle="No notifications in this filter"
            emptyHint="Adjust filter to see alerts."
          />
        </div>
      </section>

      <VerificationDrawer
        open={Boolean(active)}
        onClose={() => setActive(null)}
        title={active ? active.title : "Notification detail"}
        subtitle={active ? `${active.id} · ${fmtTime(active.time)}` : undefined}
        severity={active?.type === "CRITICAL" ? "critical" : active?.type === "WARNING" ? "warning" : "info"}
      >
        {active ? (
          <div className="space-y-4">
            <VerificationChip tone={TYPE_TONE[active.type]}>{active.type}</VerificationChip>

            <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4 text-[13px] leading-relaxed text-white/75">
              {active.message}
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <InfoCell label="Notification ID" value={active.id} mono />
              <InfoCell label="Severity" value={active.type} />
              <InfoCell label="Time" value={fmtTime(active.time)} />
              <InfoCell label="Next action" value={active.nextAction ?? "—"} />
            </div>

            {active.nextAction ? (
              <div className="pt-2">
                <button type="button" className="w-full rounded-xl border border-[#7B6EF6]/40 bg-[#7B6EF6]/12 px-3 py-2.5 text-[12px] font-semibold text-[#A098F8] transition-colors hover:border-[#A098F8]/70 hover:bg-[#7B6EF6]/20">
                  {active.nextAction}
                </button>
              </div>
            ) : null}

            <div className="grid grid-cols-2 gap-2">
              <button type="button" className="rounded-xl border border-[#38C878]/40 bg-[#38C878]/12 px-3 py-2 text-[11px] font-semibold text-[#38C878] transition-colors hover:border-[#38C878]/70 hover:bg-[#38C878]/20">Dismiss</button>
              <button type="button" className="rounded-xl border border-[#F0A030]/40 bg-[#F0A030]/12 px-3 py-2 text-[11px] font-semibold text-[#F0A030] transition-colors hover:border-[#F0A030]/70 hover:bg-[#F0A030]/20">Snooze</button>
            </div>
          </div>
        ) : null}
      </VerificationDrawer>
    </div>
  );
}
