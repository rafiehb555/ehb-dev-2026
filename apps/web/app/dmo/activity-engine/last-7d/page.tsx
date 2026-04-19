"use client";

/**
 * DMO — Activity Engine: Last 7 Days
 *   - Daily breakdown with trend comparison
 *   - Weekly highlights and patterns
 */

import Link from "next/link";
import { useMemo } from "react";
import {
  VerificationStatCard,
  VerificationChip,
  SectionHeader,
} from "@/components/dmo/verification/VerificationUI";

type DailyEvent = {
  day: string;
  count: number;
  trend: number; // % change from previous
};

const DEMO: DailyEvent[] = [
  { day: "Apr 5", count: 142, trend: -8 },
  { day: "Apr 6", count: 168, trend: +18 },
  { day: "Apr 7", count: 195, trend: +16 },
  { day: "Apr 8", count: 187, trend: -4 },
  { day: "Apr 9", count: 214, trend: +14 },
  { day: "Apr 10", count: 201, trend: -6 },
  { day: "Apr 11", count: 168, trend: -16 },
];

export default function Last7dPage() {
  const stats = useMemo(
    () => ({
      totalEvents: DEMO.reduce((s, d) => s + d.count, 0),
      avgPerDay: Math.round(DEMO.reduce((s, d) => s + d.count, 0) / DEMO.length),
      peakDay: DEMO.reduce((max, d) => d.count > max.count ? d : max),
      avgTrend: Math.round(DEMO.reduce((s, d) => s + d.trend, 0) / (DEMO.length - 1)),
    }),
    []
  );

  return (
    <div className="space-y-6">
      <header className="relative overflow-hidden rounded-2xl border border-[#7B6EF6]/30 bg-gradient-to-br from-[#13162A] via-[#1A1D33] to-[#13162A] p-6 pt-[22px]">
        <div className="pointer-events-none absolute left-0 right-0 top-0 h-[3px]" style={{ background: "linear-gradient(90deg, transparent 0%, #7B6EF6 25%, #2BBFA0 50%, #F0A030 75%, transparent 100%)" }} />
        <div className="relative flex flex-col gap-4">
          <div className="min-w-0 space-y-2">
            <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.22em]">
              <Link href="/dmo" className="text-white/40 hover:text-white/70 transition-colors">DMO</Link>
              <span className="text-white/25">/</span>
              <span className="text-[#A098F8]">Activity Engine</span>
              <span className="text-white/25">/</span>
              <span className="text-[#A098F8]">Last 7 Days</span>
            </div>
            <h1 className="text-2xl font-bold text-white md:text-3xl">Activity Summary: Last 7 Days</h1>
            <p className="max-w-2xl text-sm text-white/65">Daily breakdown and weekly trend analysis.</p>
          </div>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <VerificationStatCard tone="purple" label="Total events" value={stats.totalEvents} sub="week" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M12 2v20m-7-7h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>} />
        <VerificationStatCard tone="amber" label="Avg per day" value={stats.avgPerDay} sub="events" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" /><path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>} />
        <VerificationStatCard tone="green" label="Peak day" value={stats.peakDay.day} sub={`${stats.peakDay.count} events`} icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M9 19v-6a2 2 0 012-2h2a2 2 0 012 2v6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>} />
        <VerificationStatCard tone={stats.avgTrend >= 0 ? "green" : "red"} label="Avg trend" value={`${stats.avgTrend > 0 ? '+' : ''}${stats.avgTrend}%`} sub="day-over-day" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M13 7l5 5m0 0l-5 5m5-5H6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>} />
      </section>

      <section className="rounded-2xl border border-white/10 bg-[#13162A]/70 p-5">
        <SectionHeader title="Daily breakdown" hint="Last 7 days with trend comparison" />
        <div className="mt-4 space-y-3">
          {DEMO.map((d, idx) => {
            const maxCount = Math.max(...DEMO.map(x => x.count));
            const width = (d.count / maxCount) * 100;
            const isTrendUp = d.trend >= 0;
            return (
              <div key={idx} className="flex items-center gap-4">
                <span className="w-12 text-sm font-semibold text-white/75">{d.day}</span>
                <div className="flex-1">
                  <div className="h-6 rounded-lg bg-[#1A1D33]/60 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#7B6EF6] to-[#2BBFA0]" style={{ width: `${width}%` }} />
                  </div>
                </div>
                <div className="text-right min-w-max">
                  <p className="text-sm font-semibold text-white">{d.count}</p>
                  <VerificationChip tone={isTrendUp ? "green" : "red"}>
                    {isTrendUp ? '+' : ''}{d.trend}%
                  </VerificationChip>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
