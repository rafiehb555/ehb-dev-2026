"use client";

/**
 * DMO — Notifications / All
 * Complete notification feed across all modules.
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

type NotifType = "ALERT" | "INFO" | "ACTION" | "SYSTEM";

type Notification = {
  id: string;
  title: string;
  message: string;
  type: NotifType;
  module: string;
  isRead: boolean;
  createdAt: string;
};

const DEMO: Notification[] = [
  { id: "notif-001", title: "STL Verification Complete", message: "Service provider PKG-5421 has been verified to STL Level 6", type: "INFO", module: "STL", isRead: true, createdAt: "2026-04-12T18:52:14Z" },
  { id: "notif-002", title: "Fraud Alert Triggered", message: "Suspicious transaction pattern detected in wallet #wallet_089", type: "ALERT", module: "Wallet", isRead: false, createdAt: "2026-04-12T18:45:33Z" },
  { id: "notif-003", title: "Action Required: Document Review", message: "CRB document batch #batch_2848 requires immediate approval", type: "ACTION", module: "CRB", isRead: false, createdAt: "2026-04-12T18:32:15Z" },
  { id: "notif-004", title: "System Health Check", message: "Database replication lag detected: 2.3 seconds (threshold: 1s)", type: "ALERT", module: "Infrastructure", isRead: false, createdAt: "2026-04-12T18:19:48Z" },
  { id: "notif-005", title: "Franchise Upgrade Approved", message: "Your franchise upgrade to Level 3 has been approved", type: "INFO", module: "Franchise", isRead: true, createdAt: "2026-04-12T18:01:22Z" },
  { id: "notif-006", title: "Payment Processing Failed", message: "Escrow payment ESP-5621 failed to process. Retry in 5 minutes.", type: "ACTION", module: "Wallet", isRead: false, createdAt: "2026-04-12T17:44:10Z" },
  { id: "notif-007", title: "Compliance Warning", message: "KYC verification expiring in 14 days for account user_pkg_002", type: "ALERT", module: "PSS", isRead: true, createdAt: "2026-04-12T17:22:56Z" },
  { id: "notif-008", title: "Job Matching Update", message: "3 new job matches found for your profile in JPS system", type: "INFO", module: "JPS", isRead: true, createdAt: "2026-04-12T16:58:40Z" },
  { id: "notif-009", title: "Blockchain Sync Complete", message: "CRB certificate batch #batch_2849 synced to Polkadot", type: "SYSTEM", module: "Blockchain", isRead: true, createdAt: "2026-04-12T16:31:05Z" },
  { id: "notif-010", title: "Referral Bonus Earned", message: "You earned 250 EHBGC from referral ref_1234", type: "INFO", module: "Affiliate", isRead: false, createdAt: "2026-04-12T15:47:33Z" },
];

const TYPE_TONE: Record<NotifType, VerificationTone> = {
  ALERT: "red",
  ACTION: "amber",
  INFO: "teal",
  SYSTEM: "purple",
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

export default function AllNotificationsPage() {
  const [selected, setSelected] = useState<Notification | null>(null);
  const [typeFilter, setTypeFilter] = useState<NotifType | "ALL">("ALL");

  const visible = useMemo(() => {
    if (typeFilter === "ALL") return DEMO;
    return DEMO.filter((n) => n.type === typeFilter);
  }, [typeFilter]);

  const stats = useMemo(() => {
    const total = DEMO.length;
    const unread = DEMO.filter((n) => !n.isRead).length;
    const today = DEMO.filter((n) => {
      const dt = new Date(n.createdAt);
      const now = new Date();
      return dt.getFullYear() === now.getFullYear() && dt.getMonth() === now.getMonth() && dt.getDate() === now.getDate();
    }).length;
    const actionRequired = DEMO.filter((n) => n.type === "ACTION" && !n.isRead).length;
    return { total, unread, today, actionRequired };
  }, []);

  const columns: RowColumn<Notification>[] = [
    {
      key: "title",
      header: "Title",
      width: "minmax(0,1.8fr)",
      render: (n) => (
        <div className="min-w-0">
          <div className={`truncate text-sm ${n.isRead ? "font-normal text-white/80" : "font-semibold text-white"}`}>{n.title}</div>
        </div>
      ),
    },
    {
      key: "message",
      header: "Message",
      width: "minmax(0,2.2fr)",
      render: (n) => <span className="text-[11px] text-white/50">{n.message}</span>,
    },
    {
      key: "type",
      header: "Type",
      width: "minmax(0,1fr)",
      render: (n) => <VerificationChip tone={TYPE_TONE[n.type]}>{n.type}</VerificationChip>,
    },
    {
      key: "module",
      header: "Module",
      width: "minmax(0,0.9fr)",
      render: (n) => <span className="font-mono text-[11px] text-[#A098F8]">{n.module}</span>,
    },
    {
      key: "time",
      header: "Time",
      width: "minmax(0,1.1fr)",
      align: "right",
      render: (n) => <span className="text-[11px] text-white/45">{fmt(n.createdAt)}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <header className="relative overflow-hidden rounded-2xl border border-[#A098F8]/30 bg-gradient-to-br from-[#13162A] via-[#1A1D33] to-[#13162A] p-6 pt-[22px]">
        <div className="pointer-events-none absolute left-0 right-0 top-0 h-[3px]" style={{ background: "linear-gradient(90deg, transparent, #A098F8 30%, #67E8F9 60%, transparent)" }} />
        <div className="pointer-events-none absolute left-3 top-3 h-6 w-6 border-l-[1.5px] border-t-[1.5px] border-[#A098F8]/50" />
        <div className="pointer-events-none absolute bottom-3 right-3 h-6 w-6 border-b-[1.5px] border-r-[1.5px] border-cyan-400/45" />
        <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-gradient-to-br from-[#A098F8]/18 via-cyan-400/12 to-transparent blur-3xl" />
        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 space-y-2">
            <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.22em]">
              <Link href="/dmo" className="text-white/40 hover:text-white/70 transition-colors">DMO</Link>
              <span className="text-white/25">/</span>
              <Link href="/dmo/notifications" className="text-white/40 hover:text-white/70 transition-colors">Notifications</Link>
              <span className="text-white/25">/</span>
              <span className="text-[#A098F8]">All</span>
            </div>
            <h1 className="text-2xl font-bold text-white md:text-3xl">All Notifications</h1>
            <p className="max-w-2xl text-sm text-white/65">
              Complete notification feed across all modules — alerts, actions, info, aur system events.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/dmo/notifications/critical" className="rounded-xl border border-[#F05858]/50 bg-[#F05858]/15 px-3 py-1.5 text-xs font-semibold text-[#F05858] transition-colors hover:bg-[#F05858]/25">Critical</Link>
            <Link href="/dmo/notifications/warnings" className="rounded-xl border border-[#F0A030]/50 bg-[#F0A030]/15 px-3 py-1.5 text-xs font-semibold text-[#F0A030] transition-colors hover:bg-[#F0A030]/25">Warnings</Link>
            <Link href="/dmo/notifications/system" className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-white/75 transition-colors hover:border-white/20 hover:bg-white/[0.07] hover:text-white">System</Link>
          </div>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <VerificationStatCard tone="purple" label="Total" value={stats.total} sub="all notifications" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" strokeWidth="1.5" /><path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="1.5" /></svg>} />
        <VerificationStatCard tone="teal" label="Unread" value={stats.unread} sub="awaiting review" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="1.5" /></svg>} />
        <VerificationStatCard tone="amber" label="Today" value={stats.today} sub="new since midnight" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" /><polyline points="12 7 12 12 16 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>} />
        <VerificationStatCard tone="red" label="Action required" value={stats.actionRequired} sub="needs attention" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" /><line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /><line x1="12" y1="16" x2="12.01" y2="16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>} />
      </section>

      <section className="rounded-2xl border border-white/10 bg-[#13162A]/70 p-5">
        <SectionHeader eyebrow="Filter" title="Notification type" hint="Refine by category" right={<span className="text-[10px] text-white/45">{visible.length} row(s)</span>} />
        <div className="mt-3">
          <FilterChipRow<NotifType | "ALL">
            options={[
              { value: "ALL", label: `All · ${DEMO.length}` },
              { value: "ALERT", label: `Alerts · ${DEMO.filter((n) => n.type === "ALERT").length}` },
              { value: "INFO", label: `Info · ${DEMO.filter((n) => n.type === "INFO").length}` },
              { value: "ACTION", label: `Action · ${DEMO.filter((n) => n.type === "ACTION").length}` },
              { value: "SYSTEM", label: `System · ${DEMO.filter((n) => n.type === "SYSTEM").length}` },
            ]}
            value={typeFilter}
            onChange={setTypeFilter}
          />
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-[#13162A]/70 p-5">
        <SectionHeader eyebrow="Feed" title="Notification feed" hint={`Showing ${visible.length} of ${DEMO.length} notifications`} right={<span className="text-[10px] text-white/45">{visible.length} row(s)</span>} />
        <div className="mt-4">
          <VerificationRowGrid<Notification>
            rows={visible}
            columns={columns}
            onRowClick={setSelected}
            getRowTone={(n) => TYPE_TONE[n.type]}
            emptyTitle="No notifications match"
            emptyHint="Adjust filter."
          />
        </div>
      </section>

      <VerificationDrawer
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        title={selected?.title ?? "Notification detail"}
        subtitle={selected ? `${selected.module} · ${new Date(selected.createdAt).toLocaleString()}` : undefined}
        severity={selected?.type === "ALERT" ? "warning" : selected?.type === "ACTION" ? "high" : "info"}
      >
        {selected ? (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <VerificationChip tone={TYPE_TONE[selected.type]}>{selected.type}</VerificationChip>
              <VerificationChip tone={selected.isRead ? "teal" : "amber"}>{selected.isRead ? "READ" : "UNREAD"}</VerificationChip>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <InfoCell label="Module" value={selected.module} />
              <InfoCell label="Time" value={new Date(selected.createdAt).toLocaleString()} />
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/45 mb-2">Message</p>
              <p className="text-sm text-white/80 leading-relaxed">{selected.message}</p>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button type="button" className="rounded-xl border border-[#7B6EF6]/40 bg-[#7B6EF6]/12 px-3 py-2 text-[11px] font-semibold text-[#A098F8] transition-colors hover:border-[#A098F8]/70 hover:bg-[#7B6EF6]/20">Mark as Read</button>
              <button type="button" className="rounded-xl border border-[#F05858]/40 bg-[#F05858]/12 px-3 py-2 text-[11px] font-semibold text-[#F05858] transition-colors hover:border-[#F05858]/70 hover:bg-[#F05858]/20">Dismiss</button>
            </div>
          </div>
        ) : null}
      </VerificationDrawer>
    </div>
  );
}
