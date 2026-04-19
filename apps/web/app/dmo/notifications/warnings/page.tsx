"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  VerificationStatCard,
  VerificationChip,
  SectionHeader,
} from "@/components/dmo/verification/VerificationUI";

type WarningNotif = {
  id: string;
  title: string;
  message: string;
  time: string;
};

const DEMO: WarningNotif[] = [
  { id: "N-9010", title: "CRB inspection SLA approaching", message: "2 Karachi inspections within 72h SLA — re-route to standby inspector.", time: "2026-04-11T09:58:00Z" },
  { id: "N-9009", title: "Refill expiry · 3 sellers", message: "WMS, OLS, AGTS refills expiring in < 48h — send reminders.", time: "2026-04-11T09:20:00Z" },
];

function fmtTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function WarningsPage() {
  const [notifs] = useState<WarningNotif[]>(DEMO);

  const stats = useMemo(
    () => ({ total: notifs.length }),
    [notifs]
  );

  return (
    <div className="space-y-6">
      <header className="relative overflow-hidden rounded-2xl border border-[#F0A030]/30 bg-gradient-to-br from-[#13162A] via-[#1A1D33] to-[#13162A] p-6 pt-[22px]">
        <div className="pointer-events-none absolute left-0 right-0 top-0 h-[3px]" style={{ background: "linear-gradient(90deg, transparent 0%, #F0A030 25%, #F05858 50%, #38C878 75%, transparent 100%)" }} />
        <div className="relative flex flex-col gap-4">
          <div className="min-w-0 space-y-2">
            <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.22em]">
              <Link href="/dmo" className="text-white/40 hover:text-white/70 transition-colors">DMO</Link>
              <span className="text-white/25">/</span>
              <span className="text-[#F0A030]">Notifications</span>
              <span className="text-white/25">/</span>
              <span className="text-[#F0A030]">Warnings</span>
            </div>
            <h1 className="text-2xl font-bold text-white md:text-3xl">Warnings</h1>
            <p className="max-w-2xl text-sm text-white/65">Issues requiring attention — approaching thresholds and expiries.</p>
          </div>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <VerificationStatCard tone="amber" label="Warnings" value={stats.total} sub="needs attention" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" /><path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>} />
        <VerificationStatCard tone="orange" label="SLA alerts" value="1" sub="incoming" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M13 10V3L4 14h7v7l9-11h-7z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>} />
        <VerificationStatCard tone="purple" label="Expiry alerts" value="1" sub="upcoming" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" /><path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>} />
        <VerificationStatCard tone="green" label="Critical ratio" value="0%" sub="no critical in warnings" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M5 12l4 4L19 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>} />
      </section>

      <section className="rounded-2xl border border-white/10 bg-[#13162A]/70 p-5">
        <SectionHeader title="Warning notifications" hint={`${notifs.length} warning(s)`} />
        <div className="mt-4 space-y-3">
          {notifs.map((notif) => (
            <div key={notif.id} className="rounded-xl border border-[#F0A030]/30 bg-[#F0A030]/[0.08] p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <VerificationChip tone="amber">WARNING</VerificationChip>
                  <p className="mt-2 text-sm font-semibold text-white">{notif.title}</p>
                  <p className="mt-1 text-[13px] text-white/70">{notif.message}</p>
                  <p className="mt-2 text-[10px] text-white/45">{notif.id} · {fmtTime(notif.time)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
