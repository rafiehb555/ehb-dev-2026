"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AlertTriangle,
  ArrowRight,
  Bot,
  Building2,
  Check,
  CheckCircle2,
  ChevronRight,
  Diamond,
  LayoutDashboard,
  Settings,
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

const NAV = [
  { href: "/dmo", label: "Dashboard", icon: LayoutDashboard, match: (p: string) => p === "/dmo" || p === "/dmo/" },
  { href: "/dmo/ehb-stl-level", label: "STL Level", icon: Sparkles, match: (p: string) => p.startsWith("/dmo/ehb-stl-level") },
  { href: "/dmo/pss", label: "PSS", icon: Shield, match: (p: string) => p.startsWith("/dmo/pss") },
  { href: "/dmo/crb", label: "CRB", icon: Building2, match: (p: string) => p.startsWith("/dmo/crb") },
  { href: "/dmo/refilling", label: "DMO", icon: Diamond, match: (p: string) => p.startsWith("/dmo/refilling") },
  { href: "/dmo/franchise", label: "Franchise", icon: Store, match: (p: string) => p.startsWith("/dmo/franchise") },
  { href: "/dmo/super-admin", label: "Settings", icon: Settings, match: (p: string) => p.startsWith("/dmo/super-admin") },
] as const;

function pct(a: number, b: number) {
  if (b <= 0) return 0;
  return Math.min(100, Math.round((a / b) * 100));
}

function NeonShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-cyan-500/20 bg-[#05080f]/80 shadow-[0_0_80px_rgba(8,145,178,0.12)] backdrop-blur-xl">
      {/* Night city / depth — pure CSS (no external asset) */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.45]"
        style={{
          backgroundImage: `
            radial-gradient(ellipse 120% 80% at 50% -20%, rgba(56,189,248,0.25), transparent 50%),
            radial-gradient(ellipse 90% 60% at 80% 100%, rgba(139,92,246,0.15), transparent 45%),
            radial-gradient(ellipse 70% 50% at 10% 90%, rgba(34,211,238,0.12), transparent 40%),
            linear-gradient(180deg, #020617 0%, #0a0f1a 35%, #020617 100%)
          `,
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2032%2032%22%20width%3D%2232%22%20height%3D%2232%22%3E%3Ccircle%20cx%3D%221%22%20cy%3D%221%22%20r%3D%221%22%20fill%3D%22rgba(255%2C255%2C255%2C0.03)%22%2F%3E%3C%2Fsvg%3E')] opacity-40" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
      {children}
    </div>
  );
}

function StlSidebarNav() {
  const pathname = usePathname() ?? "";
  return (
    <nav
      className="flex flex-col gap-1 border-r border-white/10 bg-black/20 p-3 backdrop-blur-md lg:w-[210px] lg:shrink-0"
      aria-label="STL dashboard navigation"
    >
      <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-400/80">Navigate</p>
      {NAV.map((item) => {
        const Icon = item.icon;
        const active = item.match(pathname);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={[
              "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
              active
                ? "border border-cyan-400/40 bg-cyan-500/15 text-cyan-50 shadow-[0_0_24px_rgba(34,211,238,0.25)]"
                : "border border-transparent text-ehb-textBody hover:border-white/10 hover:bg-white/[0.06] hover:text-white",
            ].join(" ")}
          >
            <Icon className={`h-4 w-4 shrink-0 ${active ? "text-cyan-300" : "text-ehb-textMuted group-hover:text-cyan-200/80"}`} aria-hidden />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function StlDashboardExperience({ data = STL_DASHBOARD_DEMO }: Props) {
  const d = data;
  const pathname = usePathname() ?? "";

  return (
    <NeonShell>
      <div className="relative z-10 flex flex-col lg:flex-row">
        <div className="hidden lg:block">
          <StlSidebarNav />
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-5 p-4 sm:p-6">
          <p className="text-[10px] uppercase tracking-[0.28em] text-cyan-300/90">EHB STL LEVEL · Service Trust Level</p>

          {/* Top: Hero + AI */}
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
            {/* Hero */}
            <section
              className="xl:col-span-2 space-y-5 rounded-2xl border border-white/10 bg-white/[0.04] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_0_40px_rgba(14,165,233,0.08)] backdrop-blur-md sm:p-6"
              aria-labelledby="stl-hero-title"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex gap-4">
                  <div className="relative shrink-0">
                    <div className="absolute -inset-0.5 rounded-full bg-gradient-to-br from-cyan-400 via-blue-500 to-violet-600 opacity-80 blur-[2px]" />
                    <div className="relative flex h-16 w-16 items-center justify-center rounded-full border border-white/20 bg-gradient-to-br from-slate-800 to-slate-950 text-lg font-bold text-white shadow-inner">
                      {d.displayName
                        .split(" ")
                        .map((p) => p[0])
                        .join("")
                        .slice(0, 2)}
                    </div>
                  </div>
                  <div>
                    <h2 id="stl-hero-title" className="text-xl font-semibold tracking-tight text-white">
                      {d.displayName}
                    </h2>
                    <p className="mt-0.5 text-xs text-ehb-textMuted">{d.roleLabel}</p>
                    <p className="mt-2 text-sm">
                      <span className="text-emerald-400 font-semibold">STL Level: {d.stlLevel} (HIGH)</span>
                      <span className="mx-2 text-white/25">·</span>
                      <span className="text-ehb-textBody">
                        Trust Score: <span className="font-mono text-white">{d.trustScore}%</span>
                      </span>
                    </p>
                  </div>
                </div>
                <Link
                  href="/dmo/stl"
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 via-rose-500 to-red-600 px-5 py-3 text-sm font-semibold text-white shadow-[0_0_28px_rgba(249,115,22,0.45)] transition hover:brightness-110 hover:shadow-[0_0_36px_rgba(249,115,22,0.55)]"
                >
                  Upgrade Now
                  <ChevronRight className="h-4 w-4" aria-hidden />
                </Link>
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
                  <div className="flex justify-between text-[11px] text-ehb-textMuted">
                    <span>Progress toward VIP</span>
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
                      className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-sky-300 to-white shadow-[0_0_16px_rgba(34,211,238,0.6)] transition-[width] duration-700 ease-out"
                      style={{ width: `${d.progressToNext}%` }}
                    />
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[11px] text-emerald-200/90">
                    <Check className="h-3 w-3" aria-hidden /> PSS Verified
                  </span>
                  <span className="rounded-lg border border-white/10 bg-white/[0.05] px-2.5 py-1 text-[11px] text-ehb-textBody">
                    CRB: {d.pending.crb.current}/{d.pending.crb.target}
                  </span>
                  <span className="rounded-lg border border-white/10 bg-white/[0.05] px-2.5 py-1 text-[11px] text-ehb-textBody">
                    Exams: {d.pending.exams.current}/{d.pending.exams.target}
                  </span>
                  <span className="rounded-lg border border-white/10 bg-white/[0.05] px-2.5 py-1 text-[11px] text-ehb-textBody">
                    DMO Refills: {d.pending.refills.current}/{d.pending.refills.target}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2 border-t border-white/10 pt-4 sm:grid-cols-3">
                <div className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-center text-[11px] text-ehb-textBody">
                  <span className="block text-ehb-textMuted">CRB Verifications</span>
                  <span className="font-mono text-sm text-white">
                    {d.pending.crb.current}/{d.pending.crb.target}
                  </span>
                </div>
                <div className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-center text-[11px] text-ehb-textBody">
                  <span className="block text-ehb-textMuted">Exams</span>
                  <span className="font-mono text-sm text-white">
                    {d.pending.exams.current}/{d.pending.exams.target}
                  </span>
                </div>
                <div className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-center text-[11px] text-ehb-textBody">
                  <span className="block text-ehb-textMuted">Refills</span>
                  <span className="font-mono text-sm text-white">
                    {d.pending.refills.current}/{d.pending.refills.target}
                  </span>
                </div>
              </div>
            </section>

            {/* AI Assistant */}
            <section
              className="flex flex-col rounded-2xl border border-emerald-400/25 bg-gradient-to-b from-emerald-500/[0.12] to-black/40 p-5 shadow-[0_0_40px_rgba(52,211,153,0.12)] backdrop-blur-md"
              aria-labelledby="ai-panel-title"
            >
              <div className="flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-400/30 bg-emerald-500/20">
                  <Bot className="h-5 w-5 text-emerald-300" aria-hidden />
                </span>
                <h2 id="ai-panel-title" className="text-sm font-semibold text-white">
                  AI Assistant
                </h2>
              </div>
              <p className="mt-4 text-lg font-semibold leading-snug text-amber-100/95">{d.ai.headline}</p>
              <ul className="mt-4 flex-1 space-y-2.5">
                {d.ai.bullets.map((b) => (
                  <li key={b} className="flex gap-2 text-sm text-ehb-textBody">
                    <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" aria-hidden />
                    {b}
                  </li>
                ))}
              </ul>
              <Link
                href="/dmo/stl"
                className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl border border-cyan-400/40 bg-cyan-500/15 py-3 text-sm font-semibold text-cyan-50 shadow-[0_0_24px_rgba(34,211,238,0.25)] transition hover:bg-cyan-500/25"
              >
                Start Now
                <ChevronRight className="h-4 w-4" aria-hidden />
              </Link>
            </section>
          </div>

          {/* Module cards */}
          <section aria-labelledby="stl-modules-title">
            <h2 id="stl-modules-title" className="sr-only">
              STL module signals
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* PSS */}
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

              {/* CRB */}
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

              {/* DMO */}
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

              {/* Franchise */}
              <article className="group rounded-2xl border border-violet-400/35 bg-violet-500/[0.07] p-5 shadow-[0_0_32px_rgba(139,92,246,0.12)] transition duration-200 hover:border-violet-400/55 hover:shadow-[0_0_40px_rgba(139,92,246,0.2)]">
                <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                  <Store className="h-5 w-5 text-violet-300" aria-hidden />
                  <h3 className="text-sm font-semibold text-white">Franchise</h3>
                </div>
                <ul className="mt-4 space-y-3 text-sm">
                  {d.franchise.verifications.map((v) => (
                    <li key={v.city} className="flex items-center justify-between border-b border-white/5 pb-2 last:border-0">
                      <span className="text-ehb-textBody">{v.city} Franchise</span>
                      {v.done ? (
                        <span className="text-emerald-300">Verified ✓</span>
                      ) : (
                        <span className="text-amber-200/90">Pending ⏳</span>
                      )}
                    </li>
                  ))}
                </ul>
                <p className="mt-2 text-xs text-ehb-textMuted">Total: {d.franchise.totalLabel}</p>
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

          {/* Public trust profile */}
          <section
            className="rounded-2xl border border-orange-400/25 bg-gradient-to-br from-orange-500/[0.08] via-black/30 to-transparent p-6 shadow-[0_0_48px_rgba(251,146,60,0.1)] backdrop-blur-md"
            aria-labelledby="public-profile-title"
          >
            <h2 id="public-profile-title" className="text-center text-xs font-bold uppercase tracking-[0.35em] text-orange-200/90">
              Public Trust Profile
            </h2>
            <div className="mx-auto mt-6 max-w-2xl space-y-3 text-center text-sm text-ehb-textBody">
              <p className="text-base font-semibold text-emerald-300">{d.publicProfile.stlLine}</p>
              {d.publicProfile.summaryLines.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
            <div className="relative mx-auto mt-8 flex justify-center">
              <div className="pointer-events-none absolute inset-0 flex justify-center">
                <div className="h-28 w-24 bg-orange-500/50 blur-3xl" />
              </div>
              <div
                className="relative flex h-[5.5rem] w-[4.75rem] items-center justify-center bg-gradient-to-br from-amber-500/40 to-orange-700/30 text-center text-[10px] font-bold uppercase leading-tight tracking-wide text-amber-50 shadow-[0_0_30px_rgba(251,146,60,0.6)]"
                style={{
                  clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                }}
              >
                <span className="px-1">{d.publicProfile.badge}</span>
              </div>
            </div>
            <div className="mt-4 flex justify-center">
              <EhbStlBadge level={d.stlLevel} score={d.trustScore} />
            </div>
          </section>

          <p className="text-center text-[11px] text-ehb-textMuted">
            Demo UI — connect to <code className="rounded bg-white/10 px-1">GET /api/stl/me</code> and workflow services for live counts.
          </p>

          {/* Mobile: bottom nav strip */}
          <div className="flex flex-wrap justify-center gap-2 border-t border-white/10 pt-4 lg:hidden">
            {NAV.slice(0, 5).map((item) => {
              const Icon = item.icon;
              const active = item.match(pathname);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[10px] ${
                    active ? "bg-cyan-500/20 text-cyan-100" : "text-ehb-textMuted"
                  }`}
                >
                  <Icon className="h-3 w-3" aria-hidden />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </NeonShell>
  );
}
