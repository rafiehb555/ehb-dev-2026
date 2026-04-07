"use client";

import Link from "next/link";
import {
  AlertTriangle,
  Check,
  CheckCircle2,
  ChevronRight,
  Diamond,
  Shield,
  Store,
  XCircle,
} from "lucide-react";
import type { StlDashboardDemo } from "@/lib/dmo/stlDashboardDemo";

function pct(a: number, b: number) {
  if (b <= 0) return 0;
  return Math.min(100, Math.round((a / b) * 100));
}

export function StlDashboardModuleGrid({ data: d }: { data: StlDashboardDemo }) {
  return (
    <section aria-labelledby="stl-modules-title">
      <h2 id="stl-modules-title" className="sr-only">
        STL module signals
      </h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <article className="group rounded-2xl border border-sky-400/35 bg-sky-500/[0.06] p-5 shadow-[0_0_32px_rgba(14,165,233,0.12)] transition duration-200 hover:border-sky-400/55 hover:shadow-[0_0_40px_rgba(14,165,233,0.2)]">
          <div className="flex items-center gap-2 border-b border-white/10 pb-3">
            <Shield className="h-5 w-5 text-sky-300" aria-hidden />
            <h3 className="text-sm font-semibold text-white">PSS (Virtual Trust)</h3>
          </div>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between border-b border-white/5 py-1">
              <dt className="text-ehb-textMuted">KYC</dt>
              <dd className="flex items-center gap-1 text-emerald-300">
                Completed <Check className="h-3.5 w-3.5" aria-hidden />
              </dd>
            </div>
            <div className="flex justify-between border-b border-white/5 py-1">
              <dt className="text-ehb-textMuted">Level</dt>
              <dd className="text-white">{d.pss.phaseLabel}</dd>
            </div>
            <div className="flex justify-between py-1">
              <dt className="text-ehb-textMuted">Complaints</dt>
              <dd className="font-mono text-amber-200">
                {d.pss.complaintsOpen} / {d.pss.complaintsMax}
              </dd>
            </div>
          </dl>
          {d.pss.warning ? (
            <p className="mt-4 flex gap-2 rounded-lg border border-amber-500/35 bg-amber-500/10 px-3 py-2 text-xs text-amber-100">
              <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
              {d.pss.warning}
            </p>
          ) : null}
        </article>

        <article className="group rounded-2xl border border-emerald-400/35 bg-emerald-500/[0.06] p-5 shadow-[0_0_32px_rgba(52,211,153,0.1)] transition duration-200 hover:border-emerald-400/55 hover:shadow-[0_0_40px_rgba(52,211,153,0.18)]">
          <div className="flex items-center gap-2 border-b border-white/10 pb-3">
            <CheckCircle2 className="h-5 w-5 text-emerald-300" aria-hidden />
            <h3 className="text-sm font-semibold text-white">CRB (Physical + Exams)</h3>
          </div>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-ehb-textMuted">Verifications</dt>
              <dd className="font-mono text-white">
                {d.crb.verifications.current}/{d.crb.verifications.target}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ehb-textMuted">Exams passed</dt>
              <dd className="font-mono text-white">
                {d.crb.examsPassed.current}/{d.crb.examsPassed.target}
              </dd>
            </div>
          </dl>
          <p className="mt-4 text-[11px] font-semibold uppercase tracking-wide text-emerald-400/80">History</p>
          <ul className="mt-2 space-y-1.5 text-sm">
            {d.crb.history.map((h) => (
              <li key={h.label} className="flex items-center gap-2">
                {h.ok ? (
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" aria-hidden />
                ) : (
                  <XCircle className="h-4 w-4 shrink-0 text-red-400" aria-hidden />
                )}
                <span className={h.ok ? "text-ehb-textBody" : "text-red-300/90"}>{h.label}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-end">
            <Link
              href="/dmo/crb"
              className="inline-flex items-center gap-1 rounded-lg border border-emerald-400/40 px-3 py-1.5 text-xs font-medium text-emerald-200 transition hover:bg-emerald-500/15"
            >
              View History
              <ChevronRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
          </div>
        </article>

        <article className="group rounded-2xl border border-amber-400/40 bg-amber-500/[0.07] p-5 shadow-[0_0_32px_rgba(245,158,11,0.12)] transition duration-200 hover:border-amber-400/60 hover:shadow-[0_0_40px_rgba(245,158,11,0.2)]">
          <div className="flex items-center gap-2 border-b border-white/10 pb-3">
            <Diamond className="h-5 w-5 text-amber-300" aria-hidden />
            <h3 className="text-sm font-semibold text-white">DMO</h3>
          </div>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-ehb-textMuted">Refills</dt>
              <dd className="font-mono text-amber-100">
                {d.dmo.refills.current}/{d.dmo.refills.target}{" "}
                <span className="text-ehb-textMuted">({pct(d.dmo.refills.current, d.dmo.refills.target)}%)</span>
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ehb-textMuted">Last refill</dt>
              <dd className="text-white">{d.dmo.lastRefillAmount}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ehb-textMuted">Status</dt>
              <dd className="capitalize text-white">{d.dmo.statusLabel}</dd>
            </div>
          </dl>
          <p className="mt-4 flex items-start gap-2 text-sm text-amber-100/90">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" aria-hidden />
            {d.dmo.nextRequirement}
          </p>
          <Link
            href="/dmo/refilling"
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 py-3 text-sm font-semibold text-white shadow-[0_0_24px_rgba(245,158,11,0.35)] transition hover:brightness-110"
          >
            Refill Now
            <ChevronRight className="h-4 w-4" aria-hidden />
          </Link>
        </article>

        <article className="group rounded-2xl border border-violet-400/35 bg-violet-500/[0.07] p-5 shadow-[0_0_32px_rgba(139,92,246,0.12)] transition duration-200 hover:border-violet-400/55 hover:shadow-[0_0_40px_rgba(139,92,246,0.2)]">
          <div className="flex items-center gap-2 border-b border-white/10 pb-3">
            <Store className="h-5 w-5 text-violet-300" aria-hidden />
            <h3 className="text-sm font-semibold text-white">Franchise</h3>
          </div>
          <ul className="mt-4 space-y-3 text-sm">
            {d.franchise.verifications.map((v) => (
              <li key={v.city} className="flex items-center justify-between border-b border-white/5 pb-2 last:border-0">
                <span className="text-ehb-textBody">{v.city}</span>
                {v.done ? (
                  <span className="text-emerald-300">Verified ✓</span>
                ) : (
                  <span className="text-amber-200/90">Pending ⏳</span>
                )}
              </li>
            ))}
          </ul>
          <p className="mt-2 text-xs text-ehb-textMuted">Total verifications: {d.franchise.totalLabel}</p>
          <Link
            href="/dmo/franchise"
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-violet-400/40 bg-violet-500/15 py-2.5 text-sm font-medium text-violet-100 transition hover:bg-violet-500/25"
          >
            Pending Approval
            <ChevronRight className="h-4 w-4" aria-hidden />
          </Link>
        </article>
      </div>
    </section>
  );
}
