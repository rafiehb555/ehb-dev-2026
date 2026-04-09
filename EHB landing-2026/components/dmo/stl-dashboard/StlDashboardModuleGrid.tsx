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
  TrendingUp,
  XCircle,
} from "lucide-react";
import type { StlDashboardDemo } from "@/lib/dmo/stlDashboardDemo";
import type { StlFullSnapshot } from "@/lib/stl/fullSnapshot";

function pct(a: number, b: number) {
  if (b <= 0) return 0;
  return Math.min(100, Math.round((a / b) * 100));
}

function pssRisk(open: number, max: number): { label: string; cls: string } {
  const ratio = max > 0 ? open / max : 0;
  if (ratio >= 0.75) return { label: "High", cls: "text-rose-300" };
  if (ratio >= 0.35) return { label: "Medium", cls: "text-amber-200" };
  return { label: "Low", cls: "text-emerald-300" };
}

function crbCombinedPct(d: StlDashboardDemo) {
  const v = pct(d.crb.verifications.current, d.crb.verifications.target);
  const e = pct(d.crb.examsPassed.current, d.crb.examsPassed.target);
  return Math.round((v + e) / 2);
}

function DmoSparkline({ pts }: { pts: number[] }) {
  const w = 120;
  const h = 36;
  const line = pts
    .map((v, i) => {
      const x = (i / (pts.length - 1)) * w;
      const y = h - (v / 100) * (h - 4) - 2;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-9 w-full text-amber-400/90" preserveAspectRatio="none">
      <polyline fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" points={line} />
    </svg>
  );
}

function MiniRing({ value }: { value: number }) {
  const size = 56;
  const stroke = 4;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  return (
    <div className="relative mx-auto" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgba(52,211,153,0.9)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          className="transition-[stroke-dashoffset] duration-700"
        />
      </svg>
      <span className="pointer-events-none absolute inset-0 flex items-center justify-center text-center text-[11px] font-bold text-white">
        {value}%
      </span>
    </div>
  );
}

export function StlDashboardModuleGrid({ data: d, snapshot }: { data: StlDashboardDemo; snapshot?: StlFullSnapshot | null }) {
  const sparkPoints = snapshot
    ? [
        Math.max(0, snapshot.trustScore - 14),
        Math.max(0, snapshot.trustScore - 11),
        Math.max(0, snapshot.trustScore - 8),
        Math.max(0, snapshot.trustScore - 6),
        Math.max(0, snapshot.trustScore - 3),
        Math.max(0, snapshot.trustScore - 1),
        snapshot.trustScore,
      ]
    : [40, 44, 42, 58, 55, 62, 72, 68];
  const risk = pssRisk(d.pss.complaintsOpen, d.pss.complaintsMax);
  const complaintPct = pct(d.pss.complaintsOpen, d.pss.complaintsMax);
  const remaining = Math.max(0, d.pss.complaintsMax - d.pss.complaintsOpen);
  const crbPct = crbCombinedPct(d);
  const franchiseVerified = d.franchise.verifications.filter((x) => x.done).length;
  const franchiseTotal = d.franchise.verifications.length;
  const coveragePct = franchiseTotal ? Math.round((franchiseVerified / franchiseTotal) * 100) : 0;

  return (
    <section aria-labelledby="stl-modules-title">
      <h2 id="stl-modules-title" className="sr-only">
        STL module signals
      </h2>
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-6">
        <article className="group rounded-2xl border border-sky-400/35 bg-sky-500/[0.06] p-4 shadow-[0_0_32px_rgba(14,165,233,0.12)] transition duration-200 hover:border-sky-400/55 hover:shadow-[0_0_40px_rgba(14,165,233,0.2)] lg:col-span-4">
          <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-sky-300" aria-hidden />
              <h3 className="text-sm font-semibold text-white">PSS (Virtual Trust)</h3>
            </div>
            <span className="rounded-full border border-emerald-500/35 bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-400">
              KYC ✓
            </span>
          </div>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between border-b border-white/5 py-1">
              <dt className="text-ehb-textMuted">Risk</dt>
              <dd className={`font-semibold ${risk.cls}`}>{risk.label}</dd>
            </div>
            <div className="flex justify-between border-b border-white/5 py-1">
              <dt className="text-ehb-textMuted">Level</dt>
              <dd className="text-white">{d.pss.phaseLabel}</dd>
            </div>
            <div>
              <div className="flex justify-between gap-2 py-1">
                <dt className="text-ehb-textMuted">Complaints</dt>
                <dd className="font-mono text-amber-200">
                  {d.pss.complaintsOpen} / {d.pss.complaintsMax}
                </dd>
              </div>
              <div className="mt-1 flex h-2 overflow-hidden rounded-full bg-black/40 ring-1 ring-white/10">
                <div
                  className="rounded-full bg-gradient-to-r from-amber-500 to-rose-500 transition-[width] duration-500"
                  style={{ width: `${complaintPct}%` }}
                />
              </div>
              <p className="mt-1 text-[10px] text-ehb-textMuted">
                {remaining} remaining before limit
              </p>
            </div>
          </dl>
          {d.pss.warning ? (
            <p className="mt-4 flex gap-2 rounded-lg border border-amber-500/35 bg-amber-500/10 px-3 py-2 text-xs text-amber-100">
              <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
              {d.pss.warning}
            </p>
          ) : null}
        </article>

        <article className="group rounded-2xl border border-emerald-400/35 bg-emerald-500/[0.06] p-4 shadow-[0_0_32px_rgba(52,211,153,0.1)] transition duration-200 hover:border-emerald-400/55 hover:shadow-[0_0_40px_rgba(52,211,153,0.18)] lg:col-span-2">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <MiniRing value={crbPct} />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-300" aria-hidden />
                <h3 className="text-sm font-semibold text-white">CRB (Physical + Exams)</h3>
              </div>
              <dl className="mt-4 space-y-2 text-sm">
                <div>
                  <div className="flex justify-between">
                    <dt className="text-ehb-textMuted">Verifications</dt>
                    <dd className="font-mono text-white">
                      {d.crb.verifications.current}/{d.crb.verifications.target}
                    </dd>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-black/40">
                    <div
                      className="h-full rounded-full bg-emerald-500/80"
                      style={{ width: `${pct(d.crb.verifications.current, d.crb.verifications.target)}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between">
                    <dt className="text-ehb-textMuted">Exams passed</dt>
                    <dd className="font-mono text-white">
                      {d.crb.examsPassed.current}/{d.crb.examsPassed.target}
                    </dd>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-black/40">
                    <div
                      className="h-full rounded-full bg-sky-500/80"
                      style={{ width: `${pct(d.crb.examsPassed.current, d.crb.examsPassed.target)}%` }}
                    />
                  </div>
                </div>
              </dl>
            </div>
          </div>
          <p className="mt-4 text-[11px] font-semibold uppercase tracking-wide text-emerald-400/80">Timeline</p>
          <ul className="relative mt-2 space-y-0 border-l border-emerald-500/25 pl-4">
            {d.crb.history.map((h) => (
              <li key={h.label} className="relative pb-4 last:pb-0">
                <span
                  className={`absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-[#0a1628] ${h.ok ? "bg-emerald-400" : "bg-rose-400"}`}
                  aria-hidden
                />
                <div className="flex items-center gap-2 text-sm">
                  {h.ok ? (
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" aria-hidden />
                  ) : (
                    <XCircle className="h-4 w-4 shrink-0 text-red-400" aria-hidden />
                  )}
                  <span className={h.ok ? "text-ehb-textBody" : "text-red-300/90"}>{h.label}</span>
                </div>
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

        <article className="group rounded-2xl border border-amber-400/40 bg-amber-500/[0.07] p-4 shadow-[0_0_32px_rgba(245,158,11,0.12)] transition duration-200 hover:border-amber-400/60 hover:shadow-[0_0_40px_rgba(245,158,11,0.2)] lg:col-span-3">
          <div className="flex items-center gap-2 border-b border-white/10 pb-3">
            <Diamond className="h-5 w-5 text-amber-300" aria-hidden />
            <h3 className="text-sm font-semibold text-white">DMO</h3>
            <span className="ml-auto inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
              <TrendingUp className="h-3 w-3" aria-hidden />
              Increasing
            </span>
          </div>
          <div className="mt-3 rounded-lg border border-white/10 bg-black/30 p-2">
            <DmoSparkline pts={sparkPoints} />
            <p className="text-center text-[10px] text-ehb-textMuted">Refill + trust activity</p>
          </div>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-ehb-textMuted">Refills</dt>
              <dd className="font-mono text-amber-100">
                {d.dmo.refills.current}/{d.dmo.refills.target}{" "}
                <span className="text-ehb-textMuted">({pct(d.dmo.refills.current, d.dmo.refills.target)}%)</span>
              </dd>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-black/40">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500"
                style={{ width: `${pct(d.dmo.refills.current, d.dmo.refills.target)}%` }}
              />
            </div>
            <div className="flex justify-between">
              <dt className="text-ehb-textMuted">Last amount</dt>
              <dd className="text-white">{d.dmo.lastRefillAmount}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ehb-textMuted">Status</dt>
              <dd className="capitalize text-white">{d.dmo.statusLabel}</dd>
            </div>
          </dl>
          <p className="mt-3 flex items-start gap-2 text-sm text-amber-100/90">
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

        <article className="group rounded-2xl border border-violet-400/35 bg-violet-500/[0.07] p-4 shadow-[0_0_32px_rgba(139,92,246,0.12)] transition duration-200 hover:border-violet-400/55 hover:shadow-[0_0_40px_rgba(139,92,246,0.2)] lg:col-span-3">
          <div className="flex items-center gap-2 border-b border-white/10 pb-3">
            <Store className="h-5 w-5 text-violet-300" aria-hidden />
            <h3 className="text-sm font-semibold text-white">Franchise</h3>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-[11px] text-ehb-textMuted">
              <span>Coverage</span>
              <span className="font-mono text-violet-200">{coveragePct}%</span>
            </div>
            <div className="mt-1 h-2 overflow-hidden rounded-full bg-black/40 ring-1 ring-violet-500/20">
              <div
                className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500"
                style={{ width: `${coveragePct}%` }}
              />
            </div>
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
