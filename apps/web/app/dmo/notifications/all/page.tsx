"use client";

/**
 * DMO — Notifications: All
 *   - Flat list of all notifications with pagination
 */

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  VerificationStatCard,
  VerificationChip,
  SectionHeader,
} from "@/components/dmo/verification/VerificationUI";

type NotificationItem = {
  id: string;
  title: string;
  message: string;
  type: "CRITICAL" | "WARNING" | "INFO";
  time: string;
  read: boolean;
};

const DEMO: NotificationItem[] = [
  { id: "N-9012", title: "STL recalculation alert", message: "Seller L7 dimension drifts detected.", type: "CRITICAL", time: "2026-04-11T10:42:00Z", read: false },
  { id: "N-9011", title: "PSS false-positive spike", message: "AGTS onboarding threshold adjustment recommended.", type: "CRITICAL", time: "2026-04-11T10:15:00Z", read: false },
  { id: "N-9010", title: "CRB SLA approaching", message: "2 Karachi inspections within 72h SLA.", type: "WARNING", time: "2026-04-11T09:58:00Z", read: true },
  { id: "N-9009", title: "Refill expiry · 3 sellers", message: "WMS, OLS, AGTS refills < 48h to expiry.", type: "WARNING", time: "2026-04-11T09:20:00Z", read: true },
  { id: "N-9008", title: "Revenue anomaly detected", message: "AGTS Dubai +19.3% MoM growth analysis.", type: "INFO", time: "2026-04-11T09:02:00Z", read: true },
  { id: "N-9007", title: "Weekly audit complete", message: "4,812 sellers recalculated — 247 at L7+.", type: "INFO", time: "2026-04-11T08:30:00Z", read: true },
];

const TYPE_TONE = {
  CRITICAL: "red",
  WARNING: "amber",
  INFO: "green",
} as const;

function fmtTime(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function AllNotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>(DEMO);
  const [page, setPage] = useState(1);

  const stats = useMemo(
    () => ({
      unread: notifications.filter((n) => !n.read).length,
      total: notifications.length,
    }),
    [notifications]
  );

  const itemsPerPage = 5;
  const totalPages = Math.ceil(notifications.length / itemsPerPage);
  const visible = notifications.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <div className="space-y-6">
      <header className="relative overflow-hidden rounded-2xl border border-[#F05858]/30 bg-gradient-to-br from-[#13162A] via-[#1A1D33] to-[#13162A] p-6 pt-[22px]">
        <div className="pointer-events-none absolute left-0 right-0 top-0 h-[3px]" style={{ background: "linear-gradient(90deg, transparent 0%, #F05858 25%, #F0A030 50%, #38C878 75%, transparent 100%)" }} />
        <div className="relative flex flex-col gap-4">
          <div className="min-w-0 space-y-2">
            <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.22em]">
              <Link href="/dmo" className="text-white/40 hover:text-white/70 transition-colors">DMO</Link>
              <span className="text-white/25">/</span>
              <span className="text-[#F05858]">Notifications</span>
              <span className="text-white/25">/</span>
              <span className="text-[#F05858]">All</span>
            </div>
            <h1 className="text-2xl font-bold text-white md:text-3xl">All Notifications</h1>
            <p className="max-w-2xl text-sm text-white/65">Complete notification history with pagination.</p>
          </div>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <VerificationStatCard tone="purple" label="Total" value={stats.total} sub="notifications" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>} />
        <VerificationStatCard tone="red" label="Unread" value={stats.unread} sub="awaiting review" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M12 8v4m0 4h.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>} />
        <VerificationStatCard tone="amber" label="Page" value={`${page}/${totalPages}`} sub="notifications" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>} />
        <VerificationStatCard tone="green" label="Read rate" value={`${Math.round((notifications.filter((n) => n.read).length / notifications.length) * 100)}%`} sub="reviewed" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M5 12l4 4L19 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>} />
      </section>

      <section className="rounded-2xl border border-white/10 bg-[#13162A]/70 p-5">
        <SectionHeader title="All notifications" hint={`Page ${page} of ${totalPages}`} />
        <div className="mt-4 space-y-2">
          {visible.map((notif) => (
            <div key={notif.id} className={`rounded-xl border p-3 transition-colors ${notif.read ? "border-white/10 bg-white/[0.04]" : "border-[#F05858]/20 bg-[#F05858]/[0.08]"}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <VerificationChip tone={TYPE_TONE[notif.type]}>{notif.type}</VerificationChip>
                    {!notif.read && <span className="inline-block w-2 h-2 rounded-full bg-[#F05858]" />}
                  </div>
                  <p className="mt-1 text-sm font-semibold text-white">{notif.title}</p>
                  <p className="mt-0.5 text-[12px] text-white/65">{notif.message}</p>
                  <p className="mt-1 text-[10px] text-white/45">{notif.id} · {fmtTime(notif.time)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="mt-4 flex items-center justify-between">
            <button
              type="button"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="rounded-xl border border-white/20 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/65 transition-colors hover:border-white/35 hover:bg-white/10 disabled:opacity-40"
            >
              Previous
            </button>
            <span className="text-[11px] text-white/55">{page} / {totalPages}</span>
            <button
              type="button"
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="rounded-xl border border-white/20 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/65 transition-colors hover:border-white/35 hover:bg-white/10 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
