"use client";

/**
 * DMO — Activity Engine: Last 24h
 *   - Events grouped by hour with breakdown chart
 *   - Top events and busiest hours
 */

import Link from "next/link";
import { useMemo } from "react";
import {
  VerificationStatCard,
  VerificationChip,
  SectionHeader,
} from "@/components/dmo/verification/VerificationUI";

type HourlyEvent = {
  hour: number;
  count: number;
  topEvent: string;
};

const DEMO: HourlyEvent[] = [
  { hour: 10, count: 28, topEvent: "STL recalculations" },
  { hour: 9, count: 24, topEvent: "PSS verifications" },
  { hour: 11, count: 31, topEvent: "Wallet transactions" },
  { hour: 8, count: 19, topEvent: "CRB approvals" },
  { hour: 7, count: 12, topEvent: "System startup logs" },
  { hour: 12, count: 26, topEvent: "Complaints filed" },
];

export default function Last24hPage() {
  const stats = useMemo(
    () => ({
      totalEvents: DEMO.reduce((s, h) => s + h.count, 0),
      peakHour: DEMO.reduce((max, h) => h.count > max.count ? h : max),
      avgPerHour: Math.round(DEMO.reduce((s, h) => s + h.count, 0) / DEMO.length),
    }),
    []
  );

  return (
    <div className="space-y-6">
      <header className="relative overflow-hidden rounded-2xl border border-[#7B6EF6]/30 bg-gradient-to-br from-[#13162A] via-[#1A1D33] to-[#13162A] p-6 pt-[22px]">
        <div className="pointer-events-none absolute left-0 right-0 top-0 h-[3px]" style={{ background: "linear-gradient(90deg, transparent 0%, #7B6EF6 25%, #2BBFA0 50%, #F0A030 75%, transparent 100%)" }} />
        <div className="pointer-events-none absolute left-3 top-3 h-6 w-6 border-l-[1.5px] border-t-[1.5px] border-[#7B6EF6]/50" />
        <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-gradient-to-br from-[#7B6EF6]/20 via-[#2BBFA0]/15 to-transparent blur-3xl" />
        <div className="relative flex flex-col gap-4">
          <div className="min-w-0 space-y-2">
            <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.22em]">
              <Link href="/dmo" className="text-white/40 hover:text-white/70 transition-colors">DMO</Link>
              <span className="text-white/25">/</span>
              <span className="text-[#A098F8]">Activity Engine</span>
              <span className="text-white/25">/</span>
              <span className="text-[#A098F8]">Last 24h</span>
            </div>
            <h1 className="text-2xl font-bold text-white md:text-3xl">Activity Summary: Last 24 Hours</h1>
            <p className="max-w-2xl text-sm text-white/65">Hourly breakdown of platform events and trends.</p>
          </div>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <VerificationStatCard tone="purple" label="Total events" value={stats.totalEvents} sub="last 24h" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M12 2v20m-7-7h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>} />
        <VerificationStatCard tone="amber" label="Peak hour" value={`${stats.peakHour.hour}:00`} sub={`${stats.peakHour.count} events`} icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" /><path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>} />
        <VerificationStatCard tone="green" label="Avg per hour" value={stats.avgPerHour} sub="events" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M9 19v-6a2 2 0 012-2h2a2 2 0 012 2v6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>} />
        <VerificationStatCard tone="cyan" label="Trend" value="+12%" sub="vs yesterday" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M13 7l5 5m0 0l-5 5m5-5H6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>} />
      </section>

      <section className="rounded-2xl border border-white/10 bg-[#13162A]/70 p-5">
        <SectionHeader title="Events by hour" hint="Last 24 hours breakdown" />
        <div className="mt-4 space-y-2">
          {DEMO.map((h) => {
            const maxCount = Math.max(...DEMO.map(x => x.count));
            const width = (h.count / maxCount) * 100;
            return (
              <div key={h.hour} className="flex items-center gap-3">
                <span className="w-8 text-right font-mono text-sm text-white/55">{h.hour}:00</span>
                <div className="flex-1 h-8 rounded-lg bg-[#1A1D33]/60 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#7B6EF6] to-[#2BBFA0] transition-all" style={{ width: `${width}%` }} />
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-white">{h.count}</p>
                  <p className="text-[10px] text-white/50">{h.topEvent}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
