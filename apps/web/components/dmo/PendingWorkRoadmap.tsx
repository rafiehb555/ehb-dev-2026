"use client";

import Link from "next/link";
import {
  PENDING_WORK_PHASE_GROUPS,
  aggregateRoadmapStats,
  type PendingWorkPhase,
} from "@/lib/dmo/pendingWorkPhases";

function statusLabel(s: PendingWorkPhase["status"]) {
  if (s === "ui_ready") return { text: "UI ready", className: "border-emerald-400/40 bg-emerald-500/15 text-emerald-100" };
  if (s === "ui_partial") return { text: "UI in progress", className: "border-amber-400/40 bg-amber-500/15 text-amber-100" };
  return { text: "Planned", className: "border-white/20 bg-white/5 text-white/50" };
}

type Props = {
  /** When true, show compact hero (e.g. embedded on DMO home) */
  compact?: boolean;
};

export function PendingWorkRoadmap({ compact = false }: Props) {
  const stats = aggregateRoadmapStats();

  return (
    <section className={compact ? "space-y-4" : "space-y-6"}>
      {!compact ? (
        <div className="rounded-3xl border border-violet-400/20 bg-gradient-to-b from-violet-500/10 to-[#020b18]/90 p-5 md:p-7">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-violet-200">Phase 11–30 · Pending work</p>
              <h2 className="mt-1 text-xl md:text-2xl font-semibold text-white">Growth plan — UI coverage</h2>
              <p className="mt-2 max-w-2xl text-sm text-white/70">
                Four tracks mirror the roadmap: fraud & risk, AI recommendations, GoSellr + DMO, and the unified queue.
                Screens are wired for operators; APIs marked in checklists may still use demo data.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-center min-w-[120px]">
                <div className="text-[11px] text-white/50">Avg UI</div>
                <div className="text-2xl font-bold text-white">{stats.uiAveragePercent}%</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-center min-w-[120px]">
                <div className="text-[11px] text-white/50">Checklist (UI done)</div>
                <div className="text-2xl font-bold text-cyan-200">
                  {stats.checklistUiDone}/{stats.checklistTotal}
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href="/dmo/roadmap"
              className="inline-flex items-center rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 px-5 py-2 text-sm font-semibold text-slate-950"
            >
              Open full roadmap
            </Link>
            <Link
              href="/dmo/queue"
              className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-5 py-2 text-sm font-semibold text-white/70 hover:bg-white/10"
            >
              Unified queue
            </Link>
          </div>
        </div>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-2">
        {PENDING_WORK_PHASE_GROUPS.map((phase) => {
          const st = statusLabel(phase.status);
          return (
            <article
              key={phase.id}
              className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.04] p-4 md:p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-wider text-cyan-300/90">{phase.rangeLabel}</p>
                  <h3 className="mt-1 text-lg font-semibold text-white">{phase.title}</h3>
                  <p className="mt-1 text-sm text-white/70">{phase.summary}</p>
                </div>
                <span className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-semibold ${st.className}`}>
                  {st.text}
                </span>
              </div>

              <div className="mt-3">
                <div className="mb-1 flex items-center justify-between text-[11px] text-white/50">
                  <span>UI polish & screens</span>
                  <span className="text-cyan-200">{phase.uiPercent}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-violet-500 transition-all"
                    style={{ width: `${phase.uiPercent}%` }}
                  />
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <p className="text-[11px] uppercase tracking-wider text-white/50">Primary routes</p>
                <ul className="space-y-2">
                  {phase.routes.map((r) => (
                    <li key={r.href + r.label}>
                      <Link
                        href={r.href}
                        className="group flex flex-col rounded-xl border border-white/10 bg-[#0B0F14]/80 px-3 py-2 transition-colors hover:border-cyan-400/30 hover:bg-white/5"
                      >
                        <span className="text-sm font-medium text-white group-hover:text-cyan-100">{r.label}</span>
                        <span className="text-[11px] text-white/50">{r.note}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {!compact ? (
                <div className="mt-4 border-t border-white/10 pt-3">
                  <p className="text-[11px] uppercase tracking-wider text-white/50">Checklist</p>
                  <ul className="mt-2 space-y-1.5">
                    {phase.checklist.map((c) => (
                      <li key={c.label} className="flex items-start gap-2 text-xs text-white/70">
                        <span className={c.uiDone ? "text-emerald-400" : "text-white/35"} aria-hidden>
                          {c.uiDone ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5L20 7" /></svg> : <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="12" r="8" /></svg>}
                        </span>
                        <span>
                          {c.label}
                          {c.backendDone ? <span className="ml-1 text-[10px] text-cyan-400/90">· live</span> : null}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </article>
          );
        })}
      </div>
    </section>
  );
}
