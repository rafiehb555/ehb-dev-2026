"use client";

import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  Bot,
  Building2,
  CheckCircle2,
  Globe2,
  LayoutDashboard,
  Shield,
  Sparkles,
  Store,
  XCircle,
} from "lucide-react";
import { EhbStlBadge } from "@/components/ui/EhbStlBadge";
import type { StlDashboardDemo } from "@/lib/dmo/stlDashboardDemo";
import { STL_DASHBOARD_DEMO } from "@/lib/dmo/stlDashboardDemo";

type Props = {
  data?: StlDashboardDemo;
};

function pct(a: number, b: number) {
  if (b <= 0) return 0;
  return Math.min(100, Math.round((a / b) * 100));
}

export function StlDashboardExperience({ data = STL_DASHBOARD_DEMO }: Props) {
  const d = data;

  return (
    <div className="space-y-6" aria-label="STL live dashboard">
      <p className="text-[11px] uppercase tracking-[0.22em] text-cyan-300/90">STL engine · Live view (demo data)</p>

      {/* 1. Hero */}
      <section
        className="relative overflow-hidden rounded-2xl border border-cyan-400/25 bg-gradient-to-br from-[#061a2e]/95 via-[#031222]/95 to-[#020b18]/95 p-6 shadow-[0_0_48px_rgba(34,211,238,0.12)]"
        aria-labelledby="stl-hero-title"
      >
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-12 -left-10 h-40 w-40 rounded-full bg-violet-500/10 blur-3xl" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-4 max-w-xl">
            <div className="flex flex-wrap items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/15 bg-white/[0.06] text-lg font-semibold text-white shadow-inner">
                {d.displayName
                  .split(" ")
                  .map((p) => p[0])
                  .join("")
                  .slice(0, 2)}
              </span>
              <div>
                <p id="stl-hero-title" className="text-lg font-semibold text-white">
                  {d.displayName}
                </p>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <EhbStlBadge level={d.stlLevel} score={d.trustScore} />
                  <span className="text-sm text-ehb-textMuted">
                    Trust score <span className="font-mono text-cyan-200/90">{d.trustScore}%</span>
                  </span>
                </div>
              </div>
            </div>

            <div>
              <p className="text-xs font-medium text-ehb-textBody">Next level</p>
              <p className="mt-0.5 text-base font-semibold text-white">
                {d.nextLevelLabel}{" "}
                <span className="text-ehb-textMuted font-normal">({d.nextLevelShort})</span>
              </p>
              <div className="mt-3 space-y-1.5">
                <div className="flex justify-between text-[11px] text-ehb-textMuted">
                  <span>Progress</span>
                  <span className="font-mono text-cyan-200/80">{d.progressToNext}%</span>
                </div>
                <div
                  className="h-2.5 w-full overflow-hidden rounded-full bg-white/10 ring-1 ring-white/10"
                  role="progressbar"
                  aria-valuenow={d.progressToNext}
                  aria-valuemin={0}
                  aria-valuemax={100}
                >
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-sky-500 to-violet-500 shadow-[0_0_12px_rgba(34,211,238,0.45)] transition-[width] duration-500"
                    style={{ width: `${d.progressToNext}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-amber-500/25 bg-amber-500/[0.07] px-3 py-2.5">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-amber-200/90">Pending tasks</p>
              <ul className="mt-2 space-y-1.5 text-sm text-ehb-textBody">
                <li className="flex justify-between gap-2">
                  <span>CRB verifications</span>
                  <span className="font-mono text-white">
                    {d.pending.crb.current}/{d.pending.crb.target}
                  </span>
                </li>
                <li className="flex justify-between gap-2">
                  <span>Exams</span>
                  <span className="font-mono text-white">
                    {d.pending.exams.current}/{d.pending.exams.target}
                  </span>
                </li>
                <li className="flex justify-between gap-2">
                  <span>Refills</span>
                  <span className="font-mono text-white">
                    {d.pending.refills.current}/{d.pending.refills.target}
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex w-full flex-col gap-2 sm:w-auto sm:min-w-[200px]">
            <Link href="/dmo/stl" className="ehb-btn-primary ehb-press inline-flex items-center justify-center gap-2">
              <LayoutDashboard className="h-4 w-4" aria-hidden />
              Upgrade path
              <ArrowRight className="h-4 w-4 opacity-80" aria-hidden />
            </Link>
            <Link href="/dmo/crb" className="ehb-btn-secondary ehb-press text-center text-sm">
              Open CRB workspace
            </Link>
            <p className="text-[11px] text-ehb-textMuted leading-relaxed">
              Demo snapshot — production will pull PSS, CRB, DMO, and franchise signals from live workflows.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Smart cards */}
      <section aria-labelledby="stl-engine-title">
        <h2 id="stl-engine-title" className="mb-3 text-sm font-semibold text-white">
          STL engine — signals
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <article className="group rounded-2xl border border-sky-400/20 bg-gradient-to-b from-sky-500/[0.08] to-transparent p-4 shadow-[0_0_28px_rgba(56,189,248,0.08)] transition-colors hover:border-sky-400/35">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-sky-300" aria-hidden />
                <h3 className="text-sm font-semibold text-white">PSS (virtual trust)</h3>
              </div>
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[10px] uppercase tracking-wide text-ehb-textMuted">
                AI + virtual
              </span>
            </div>
            <dl className="mt-4 space-y-2 text-sm text-ehb-textBody">
              <div className="flex justify-between gap-2">
                <dt>KYC</dt>
                <dd className="text-emerald-300/90">{d.pss.kycDone ? "Completed" : "Pending"}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt>Level</dt>
                <dd className="text-white">{d.pss.phaseLabel}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt>Complaints</dt>
                <dd>
                  <span className="font-mono text-amber-200/90">
                    {d.pss.complaintsOpen} / {d.pss.complaintsMax}
                  </span>
                </dd>
              </div>
            </dl>
            {d.pss.warning ? (
              <p className="mt-3 flex gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-2.5 py-2 text-[11px] text-amber-100/90">
                <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
                {d.pss.warning}
              </p>
            ) : null}
          </article>

          <article className="group rounded-2xl border border-emerald-400/20 bg-gradient-to-b from-emerald-500/[0.07] to-transparent p-4 shadow-[0_0_28px_rgba(52,211,153,0.07)] transition-colors hover:border-emerald-400/35">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-emerald-300" aria-hidden />
                <h3 className="text-sm font-semibold text-white">CRB (physical + exams)</h3>
              </div>
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[10px] uppercase tracking-wide text-ehb-textMuted">
                On-site
              </span>
            </div>
            <dl className="mt-4 space-y-2 text-sm text-ehb-textBody">
              <div className="flex justify-between gap-2">
                <dt>Verifications</dt>
                <dd className="font-mono text-white">
                  {d.crb.verifications.current}/{d.crb.verifications.target}
                </dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt>Exams passed</dt>
                <dd className="font-mono text-white">
                  {d.crb.examsPassed.current}/{d.crb.examsPassed.target}
                </dd>
              </div>
            </dl>
            <p className="mt-3 text-[11px] font-medium uppercase tracking-wide text-ehb-textMuted">History</p>
            <ul className="mt-1.5 space-y-1 text-sm">
              {d.crb.history.map((h) => (
                <li key={h.label} className="flex items-center gap-2 text-ehb-textBody">
                  {h.ok ? (
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" aria-hidden />
                  ) : (
                    <XCircle className="h-4 w-4 shrink-0 text-rose-400" aria-hidden />
                  )}
                  {h.label}
                </li>
              ))}
            </ul>
          </article>

          <article className="group rounded-2xl border border-amber-400/20 bg-gradient-to-b from-amber-500/[0.07] to-transparent p-4 shadow-[0_0_28px_rgba(245,158,11,0.08)] transition-colors hover:border-amber-400/35">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-amber-300" aria-hidden />
                <h3 className="text-sm font-semibold text-white">DMO (refilling)</h3>
              </div>
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[10px] uppercase tracking-wide text-ehb-textMuted">
                Wallet rhythm
              </span>
            </div>
            <dl className="mt-4 space-y-2 text-sm text-ehb-textBody">
              <div className="flex justify-between gap-2">
                <dt>Refills</dt>
                <dd className="font-mono text-amber-200/90">
                  {d.dmo.refills.current}/{d.dmo.refills.target}{" "}
                  <span className="text-ehb-textMuted">({pct(d.dmo.refills.current, d.dmo.refills.target)}%)</span>
                </dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt>Status</dt>
                <dd className="text-white">{d.dmo.statusLabel}</dd>
              </div>
            </dl>
            <p className="mt-3 border-l-2 border-amber-400/50 pl-3 text-sm text-ehb-textBody leading-snug">
              <span className="text-amber-200/90">Next:</span> {d.dmo.nextRequirement}
            </p>
          </article>

          <article className="group rounded-2xl border border-violet-400/20 bg-gradient-to-b from-violet-500/[0.08] to-transparent p-4 shadow-[0_0_28px_rgba(139,92,246,0.08)] transition-colors hover:border-violet-400/35">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <Store className="h-5 w-5 text-violet-300" aria-hidden />
                <h3 className="text-sm font-semibold text-white">Franchise</h3>
              </div>
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[10px] uppercase tracking-wide text-ehb-textMuted">
                Regions
              </span>
            </div>
            <p className="mt-3 text-[11px] font-medium uppercase tracking-wide text-ehb-textMuted">Verified by</p>
            <ul className="mt-2 space-y-2">
              {d.franchise.verifications.map((v) => (
                <li key={v.city} className="flex items-center justify-between text-sm text-ehb-textBody">
                  <span>{v.city}</span>
                  {v.done ? (
                    <span className="inline-flex items-center gap-1 text-emerald-300/90">
                      <CheckCircle2 className="h-4 w-4" aria-hidden /> Done
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-amber-300/90">
                      <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-amber-400" aria-hidden />
                      Pending
                    </span>
                  )}
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-ehb-textMuted">Total: {d.franchise.totalLabel}</p>
          </article>
        </div>
      </section>

      {/* 3. Public profile + AI */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <section
          className="rounded-2xl border border-white/12 bg-gradient-to-br from-[#0d1628]/90 to-[#050a12]/90 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
          aria-labelledby="public-profile-title"
        >
          <div className="flex items-center gap-2">
            <Globe2 className="h-5 w-5 text-cyan-300" aria-hidden />
            <h2 id="public-profile-title" className="text-sm font-semibold text-white">
              Public trust preview
            </h2>
          </div>
          <p className="mt-1 text-[11px] text-ehb-textMuted">
            How buyers may see you on GoSellr, JPS, and marketplace surfaces (badge copy is illustrative).
          </p>
          <div className="mt-4 rounded-xl border border-cyan-500/25 bg-cyan-500/[0.06] px-4 py-3">
            <div className="flex flex-wrap items-center gap-2">
              <EhbStlBadge level={d.stlLevel} />
              <span className="rounded-md border border-white/15 bg-black/30 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-cyan-100/90">
                {d.publicProfile.badge}
              </span>
            </div>
            <ul className="mt-3 space-y-1 text-sm text-ehb-textBody">
              {d.publicProfile.summaryLines.map((line) => (
                <li key={line} className="flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-cyan-400/80" aria-hidden />
                  {line}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section
          className="rounded-2xl border border-fuchsia-500/20 bg-gradient-to-br from-fuchsia-500/[0.09] via-[#0a0612]/80 to-transparent p-5 shadow-[0_0_32px_rgba(192,38,211,0.12)]"
          aria-labelledby="ai-panel-title"
        >
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-fuchsia-300" aria-hidden />
            <h2 id="ai-panel-title" className="text-sm font-semibold text-white">
              AI assistant
            </h2>
          </div>
          <p className="mt-3 text-sm font-medium text-fuchsia-100/90 leading-snug">{d.ai.headline}</p>
          <ul className="mt-3 space-y-2">
            {d.ai.bullets.map((b) => (
              <li key={b} className="flex gap-2 text-sm text-ehb-textBody">
                <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-fuchsia-400/80" aria-hidden />
                {b}
              </li>
            ))}
          </ul>
          <Link
            href="/dmo/stl"
            className="mt-4 inline-flex items-center gap-2 rounded-xl border border-fuchsia-400/35 bg-fuchsia-500/10 px-4 py-2.5 text-sm font-medium text-fuchsia-100 transition-colors hover:bg-fuchsia-500/20"
          >
            Start now
            <Sparkles className="h-4 w-4" aria-hidden />
          </Link>
        </section>
      </div>

      {/* 4. DMO control (demo) */}
      <section
        className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
        aria-labelledby="dmo-control-title"
      >
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 id="dmo-control-title" className="text-sm font-semibold text-white">
            DMO control panel
          </h2>
          <span className="text-[11px] text-ehb-textMuted">Demo UI — senior DMO actions stay audited in production</span>
        </div>
        <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end">
          <label className="flex flex-1 flex-col gap-1.5 text-[11px] font-medium uppercase tracking-wide text-ehb-textMuted">
            Search user
            <input
              type="search"
              placeholder="e.g. Rafi"
              className="rounded-xl border border-white/15 bg-black/40 px-3 py-2.5 text-sm text-white placeholder:text-ehb-textMuted focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/30"
              readOnly
              aria-readonly
            />
          </label>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-sm text-ehb-textBody">
              STL: <span className="font-mono text-white">{d.dmoControl.stlLevel}</span>
            </span>
            <button
              type="button"
              className="rounded-xl border border-emerald-500/35 bg-emerald-500/10 px-3 py-2 text-xs font-medium text-emerald-200/90 opacity-60"
              disabled
              title="Wire to DMO governance API"
            >
              Upgrade
            </button>
            <button
              type="button"
              className="rounded-xl border border-amber-500/35 bg-amber-500/10 px-3 py-2 text-xs font-medium text-amber-200/90 opacity-60"
              disabled
              title="Wire to DMO governance API"
            >
              Downgrade
            </button>
            <button
              type="button"
              className="rounded-xl border border-rose-500/35 bg-rose-500/10 px-3 py-2 text-xs font-medium text-rose-200/90 opacity-60"
              disabled
              title="Wire to DMO governance API"
            >
              Freeze
            </button>
          </div>
        </div>
        <div className="mt-4">
          <p className="text-[11px] font-medium uppercase tracking-wide text-ehb-textMuted">Complaints (sample)</p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {d.dmoControl.complaints.map((c) => (
              <li
                key={c}
                className="rounded-lg border border-white/10 bg-black/30 px-2.5 py-1 text-xs text-ehb-textBody"
              >
                {c}
              </li>
            ))}
          </ul>
          <button
            type="button"
            className="mt-3 rounded-xl border border-cyan-400/35 bg-cyan-500/10 px-4 py-2 text-xs font-medium text-cyan-100/90 opacity-60"
            disabled
            title="Wire to case management"
          >
            Take action
          </button>
        </div>
      </section>
    </div>
  );
}
