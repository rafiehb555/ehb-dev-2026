"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  VerificationStatCard,
  VerificationChip,
  SectionHeader,
} from "@/components/dmo/verification/VerificationUI";

type SystemNotif = {
  id: string;
  title: string;
  message: string;
  time: string;
  status: "completed" | "in_progress";
};

const DEMO: SystemNotif[] = [
  { id: "N-9008", title: "AGTS Dubai revenue +19.3% MoM", message: "Consider Phase-2 franchise tier promotion.", time: "2026-04-11T09:02:00Z", status: "completed" },
  { id: "N-9007", title: "Weekly STL audit complete", message: "4,812 sellers recalculated — 247 sellers at L7+.", time: "2026-04-11T08:30:00Z", status: "completed" },
];

function fmtTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function SystemPage() {
  const [notifs] = useState<SystemNotif[]>(DEMO);

  const stats = useMemo(
    () => ({
      total: notifs.length,
      completed: notifs.filter((n) => n.status === "completed").length,
      inProgress: notifs.filter((n) => n.status === "in_progress").length,
    }),
    [notifs]
  );

  return (
    <div className="space-y-6">
      <header className="relative overflow-hidden rounded-2xl border border-[#38C878]/30 bg-gradient-to-br from-[#13162A] via-[#1A1D33] to-[#13162A] p-6 pt-[22px]">
        <div className="pointer-events-none absolute left-0 right-0 top-0 h-[3px]" style={{ background: "linear-gradient(90deg, transparent 0%, #38C878 25%, #2BBFA0 50%, #F0A030 75%, transparent 100%)" }} />
        <div className="relative flex flex-col gap-4">
          <div className="min-w-0 space-y-2">
            <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.22em]">
              <Link href="/dmo" className="text-white/40 hover:text-white/70 transition-colors">DMO</Link>
              <span className="text-white/25">/</span>
              <span className="text-[#38C878]">Notifications</span>
              <span className="text-white/25">/</span>
              <span className="text-[#38C878]">System</span>
            </div>
            <h1 className="text-2xl font-bold text-white md:text-3xl">System Alerts</h1>
            <p className="max-w-2xl text-sm text-white/65">Deployments, maintenance windows, configuration changes, and system updates.</p>
          </div>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <VerificationStatCard tone="green" label="System alerts" value={stats.total} sub="notifications" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M12 2v20m-7-7h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>} />
        <VerificationStatCard tone="teal" label="Completed" value={stats.completed} sub="tasks done" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M5 12l4 4L19 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>} />
        <VerificationStatCard tone="amber" label="In progress" value={stats.inProgress} sub="ongoing" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" /><path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>} />
        <VerificationStatCard tone="purple" label="System health" value="Nominal" sub="all services up" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" /><circle cx="12" cy="12" r="3" fill="currentColor" /></svg>} />
      </section>

      <section className="rounded-2xl border border-white/10 bg-[#13162A]/70 p-5">
        <SectionHeader title="System notifications" hint={`${notifs.length} alert(s) · informational`} />
        <div className="mt-4 space-y-3">
          {notifs.map((notif) => (
            <div key={notif.id} className="rounded-xl border border-[#38C878]/30 bg-[#38C878]/[0.08] p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <VerificationChip tone={notif.status === "completed" ? "green" : "amber"}>
                    {notif.status === "completed" ? "COMPLETED" : "IN PROGRESS"}
                  </VerificationChip>
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
