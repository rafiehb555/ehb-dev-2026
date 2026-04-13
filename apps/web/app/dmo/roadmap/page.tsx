"use client";

import Link from "next/link";
import { PendingWorkRoadmap } from "@/components/dmo/PendingWorkRoadmap";
import { PENDING_WORK_PHASE_GROUPS, aggregateRoadmapStats } from "@/lib/dmo/pendingWorkPhases";

export default function DmoRoadmapPage() {
  const stats = aggregateRoadmapStats();

  return (
    <main className="min-h-screen text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        <header className="rounded-3xl border border-cyan-400/20 bg-gradient-to-b from-[#031222]/95 to-[#020b18]/95 p-5 md:p-7">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-cyan-300">DMO · Growth plan UI</p>
              <h1 className="mt-1 text-2xl md:text-3xl font-semibold text-white">Pending work - phases 11-30</h1>
              <p className="mt-2 max-w-3xl text-sm text-white/70">
                End-to-end operator surfaces for fraud, recommendations, marketplace, and unified queue. Backend items
                remain where the checklist shows "o"; connect APIs without changing these layouts.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link href="/dmo/home" className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-1.5 font-semibold text-white/75 transition-colors hover:border-white/20 hover:bg-white/[0.07] hover:text-white text-sm">
                DMO hub
              </Link>
              <Link href="/dmo" className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-1.5 font-semibold text-white/75 transition-colors hover:border-white/20 hover:bg-white/[0.07] hover:text-white text-sm">
                Dashboard
              </Link>
            </div>
          </div>
          <dl className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <dt className="text-[11px] text-white/50">Tracks</dt>
              <dd className="text-xl font-semibold text-white">{stats.phaseCount}</dd>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <dt className="text-[11px] text-white/50">Avg UI coverage</dt>
              <dd className="text-xl font-semibold text-cyan-200">{stats.uiAveragePercent}%</dd>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <dt className="text-[11px] text-white/50">Checklist (UI complete)</dt>
              <dd className="text-xl font-semibold text-white">
                {stats.checklistUiDone} / {stats.checklistTotal}
              </dd>
            </div>
          </dl>
        </header>

        <PendingWorkRoadmap />

        <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 md:p-6">
          <h2 className="text-lg font-semibold text-white">All checklist items (flat)</h2>
          <p className="mt-1 text-sm text-white/70">Use this list when closing backend tasks in sprints.</p>
          <div className="mt-4 grid gap-6 md:grid-cols-2">
            {PENDING_WORK_PHASE_GROUPS.map((g) => (
              <div key={g.id}>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-cyan-300/90">{g.rangeLabel}</p>
                <ul className="mt-2 space-y-2">
                  {g.checklist.map((c) => (
                    <li
                      key={c.label}
                      className="flex items-start gap-2 rounded-lg border border-white/5 bg-[#0B0F14]/60 px-3 py-2 text-xs text-white/70"
                    >
                      <span className={`shrink-0 ${c.uiDone ? "text-emerald-400" : "text-white/30"}`}>{c.uiDone ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5L20 7" /></svg> : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="12" r="8" /></svg>}</span>
                      <span>{c.label}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
