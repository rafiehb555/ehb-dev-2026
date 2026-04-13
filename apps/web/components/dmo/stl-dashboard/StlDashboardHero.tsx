"use client";

import Link from "next/link";
import { AlertTriangle, Check, ChevronRight, Zap } from "lucide-react";
import type { StlDashboardDemo } from "@/lib/dmo/stlDashboardDemo";
import { StlTrustScoreRing } from "@/components/dmo/stl-dashboard/StlTrustScoreRing";

type Props = {
  data: StlDashboardDemo;
  modelScore: number;
  upgradeBlocked: boolean;
};

export function StlDashboardHero({ data: d, modelScore, upgradeBlocked }: Props) {
  const crbLeft = Math.max(0, d.pending.crb.target - d.pending.crb.current);
  const examLeft = Math.max(0, d.pending.exams.target - d.pending.exams.current);

  return (
    <section
      className="xl:col-span-2 space-y-5 rounded-2xl border border-white/10 bg-white/[0.04] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_0_40px_rgba(14,165,233,0.08)] backdrop-blur-md sm:p-6"
      aria-labelledby="stl-hero-title"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex flex-wrap items-start gap-4">
          <div className="relative shrink-0">
            <div className="absolute -inset-0.5 rounded-full bg-gradient-to-br from-cyan-400 via-blue-500 to-violet-600 opacity-80 blur-[2px]" />
            <div className="relative flex h-16 w-16 items-center justify-center rounded-full border border-white/20 bg-gradient-to-br from-slate-800 to-slate-950 text-lg font-bold text-white shadow-inner ring-2 ring-cyan-400/20 transition-transform duration-300 hover:scale-[1.02]">
              {d.displayName
                .split(" ")
                .map((p) => p[0])
                .join("")
                .slice(0, 2)}
            </div>
          </div>
          <StlTrustScoreRing value={d.trustScore} size={76} className="stl-ring-glow" />
          <div>
            <h2 id="stl-hero-title" className="text-xl font-semibold tracking-tight text-white">
              {d.displayName}
            </h2>
            <p className="mt-0.5 text-xs text-white/50">{d.roleLabel}</p>
            <p className="mt-2 text-sm">
              <span className="font-semibold text-emerald-400">STL Level: {d.stlLevel} ({d.nextLevelShort === "SUPREME" ? "TOP" : "ACTIVE"})</span>
              <span className="mx-2 text-white/25">·</span>
              <span className="text-white/70">
                Trust Score: <span className="font-mono text-white">{d.trustScore}%</span>
              </span>
            </p>
            <p className="mt-1 text-[10px] text-white/50">
              Engine score signal: <span className="font-mono text-cyan-200/90">{modelScore}%</span>
            </p>
          </div>
        </div>
        <Link
          href="/dmo/stl"
          aria-disabled={upgradeBlocked}
          className={[
            "active:scale-[0.97] transition-all inline-flex shrink-0 items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white",
            upgradeBlocked
              ? "cursor-not-allowed border border-white/10 bg-white/5 text-white/40"
              : "stl-cta-pulse bg-gradient-to-r from-orange-500 via-rose-500 to-red-600 hover:brightness-110",
          ].join(" ")}
        >
          <Zap className="h-4 w-4 opacity-90" aria-hidden />
          Upgrade Now
          <ChevronRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>

      <div className="rounded-xl border border-amber-500/25 bg-gradient-to-r from-amber-500/[0.07] to-transparent p-4">
        <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-amber-200/90">
          <AlertTriangle className="h-4 w-4" aria-hidden />
          Blockers
        </p>
        <ul className="mt-2 space-y-1.5 text-sm text-white/70">
          <li>
            <span className="text-white/90">CRB:</span>{" "}
            {crbLeft === 0 ? (
              <span className="text-emerald-400 font-medium">clear</span>
            ) : (
              <span>
                <span className="font-mono text-amber-200">{crbLeft}</span> pending verification{crbLeft === 1 ? "" : "s"}
              </span>
            )}
          </li>
          <li>
            <span className="text-white/90">Exams:</span>{" "}
            {examLeft === 0 ? (
              <span className="text-emerald-400 font-medium">clear</span>
            ) : (
              <span>
                <span className="font-mono text-amber-200">{examLeft}</span> exam{examLeft === 1 ? "" : "s"} remaining
              </span>
            )}
          </li>
        </ul>
      </div>

      <div className="rounded-xl border border-cyan-500/20 bg-black/25 p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wide text-cyan-200/80">Next level</p>
            <p className="text-lg font-semibold text-white">{d.nextLevelLabel}</p>
          </div>
          <Link
            href="/dmo/stl"
            className="inline-flex items-center justify-center gap-1 rounded-lg border border-cyan-400/40 bg-cyan-500/15 px-4 py-2 text-xs font-semibold text-cyan-100 shadow-[0_0_20px_rgba(34,211,238,0.2)] transition hover:bg-cyan-500/25"
          >
            Complete Tasks
            <ChevronRight className="h-3.5 w-3.5" aria-hidden />
          </Link>
        </div>
        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-[11px] text-white/50">
            <span>Progress toward next level</span>
            <span className="font-mono text-cyan-200">{d.progressToNext}%</span>
          </div>
            <div
              className="h-3 w-full overflow-hidden rounded-full bg-slate-900 ring-1 ring-cyan-500/20"
              role="progressbar"
              aria-valuenow={d.progressToNext}
              aria-valuemin={0}
              aria-valuemax={100}
            >
            <div
              className="stl-progress-bar h-full rounded-full bg-gradient-to-r from-cyan-400 via-sky-300 to-white shadow-[0_0_16px_rgba(34,211,238,0.6)] transition-[width] duration-700 ease-out"
              style={{ width: `${d.progressToNext}%` }}
            />
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[11px] text-emerald-200/90">
            <Check className="h-3 w-3" aria-hidden /> PSS Verified
          </span>
          <span className="rounded-lg border border-white/10 bg-white/[0.05] px-2.5 py-1 text-[11px] text-white/70">
            CRB: {d.pending.crb.current}/{d.pending.crb.target}
          </span>
          <span className="rounded-lg border border-white/10 bg-white/[0.05] px-2.5 py-1 text-[11px] text-white/70">
            Exams: {d.pending.exams.current}/{d.pending.exams.target}
          </span>
          <span className="rounded-lg border border-white/10 bg-white/[0.05] px-2.5 py-1 text-[11px] text-white/70">
            Refills: {d.pending.refills.current}/{d.pending.refills.target}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2 border-t border-white/10 pt-4 sm:grid-cols-3">
        <div className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-center text-[11px] text-white/70 transition hover:border-cyan-400/20">
          <span className="block text-white/50">CRB Verifications</span>
          <span className="font-mono text-sm text-white">
            {d.pending.crb.current}/{d.pending.crb.target}
          </span>
        </div>
        <div className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-center text-[11px] text-white/70 transition hover:border-cyan-400/20">
          <span className="block text-white/50">Exams</span>
          <span className="font-mono text-sm text-white">
            {d.pending.exams.current}/{d.pending.exams.target}
          </span>
        </div>
        <div className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-center text-[11px] text-white/70 transition hover:border-cyan-400/20">
          <span className="block text-white/50">Refills</span>
          <span className="font-mono text-sm text-white">
            {d.pending.refills.current}/{d.pending.refills.target}
          </span>
        </div>
      </div>
    </section>
  );
}
