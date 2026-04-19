"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  VerificationStatCard,
  VerificationChip,
  SectionHeader,
} from "@/components/dmo/verification/VerificationUI";

type CriticalNotif = {
  id: string;
  title: string;
  message: string;
  severity: "CRITICAL";
  time: string;
};

const DEMO: CriticalNotif[] = [
  { id: "N-9012", title: "STL gold-master regression alert", message: "Seller L7 recalculation job detected 3 dimension drifts on OLS Karachi.", severity: "CRITICAL", time: "2026-04-11T10:42:00Z" },
  { id: "N-9011", title: "PSS liveness false-positive spike", message: "AGTS onboarding flow — raise threshold to 0.82 for 24h.", severity: "CRITICAL", time: "2026-04-11T10:15:00Z" },
];

function fmtTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function CriticalPage() {
  const [notifs] = useState<CriticalNotif[]>(DEMO);

  const stats = useMemo(
    () => ({ total: notifs.length, acknowledged: 0 }),
    [notifs]
  );

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
              <span className="text-[#F05858]">Critical</span>
            </div>
            <h1 className="text-2xl font-bold text-white md:text-3xl">Critical Alerts</h1>
            <p className="max-w-2xl text-sm text-white/65">Immediate action required — system critical issues.</p>
          </div>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <VerificationStatCard tone="red" label="Critical" value={stats.total} sub="immediate action" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M12 8v4m0 4h.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>} />
        <VerificationStatCard tone="amber" label="Unacked" value={stats.total} sub="awaiting ack" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" /><path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>} />
        <VerificationStatCard tone="green" label="Acked" value={stats.acknowledged} sub="acknowledged" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M5 12l4 4L19 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>} />
        <VerificationStatCard tone="purple" label="Escalations" value="0" sub="escalated to ops" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M13 10V3L4 14h7v7l9-11h-7z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>} />
      </section>

      <section className="rounded-2xl border border-white/10 bg-[#13162A]/70 p-5">
        <SectionHeader title="Critical alerts" hint={`${notifs.length} alert(s) — act now`} />
        <div className="mt-4 space-y-3">
          {notifs.map((notif) => (
            <div key={notif.id} className="rounded-xl border border-[#F05858]/30 bg-[#F05858]/[0.08] p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <VerificationChip tone="red">CRITICAL</VerificationChip>
                  <p className="mt-2 text-sm font-bold text-white">{notif.title}</p>
                  <p className="mt-1 text-[13px] text-white/70">{notif.message}</p>
                  <p className="mt-2 text-[10px] text-white/45">{notif.id} · {fmtTime(notif.time)}</p>
                </div>
                <button type="button" className="rounded-xl border border-[#F05858]/40 bg-[#F05858]/12 px-3 py-1.5 text-xs font-semibold text-[#F05858] transition-colors hover:border-[#F05858]/70 hover:bg-[#F05858]/20 whitespace-nowrap">
                  Acknowledge
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
