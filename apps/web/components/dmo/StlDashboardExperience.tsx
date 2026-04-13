"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { NeonShell } from "@/components/dmo/stl-dashboard/NeonShell";
import { StlDashboardAiPanel } from "@/components/dmo/stl-dashboard/StlDashboardAiPanel";
import { StlDashboardAnalytics } from "@/components/dmo/stl-dashboard/StlDashboardAnalytics";
import { StlDashboardHero } from "@/components/dmo/stl-dashboard/StlDashboardHero";
import { StlDashboardInsightBanner } from "@/components/dmo/stl-dashboard/StlDashboardInsightBanner";
import { StlDashboardKpiStrip } from "@/components/dmo/stl-dashboard/StlDashboardKpiStrip";
import { StlDashboardModuleGrid } from "@/components/dmo/stl-dashboard/StlDashboardModuleGrid";
import { StlDashboardPublicProfile } from "@/components/dmo/stl-dashboard/StlDashboardPublicProfile";
import { StlLevelJourneyTimeline } from "@/components/dmo/stl-dashboard/StlLevelJourneyTimeline";
import { StlTierSelector } from "@/components/dmo/stl-dashboard/StlTierSelector";
import { StlVerificationStepper } from "@/components/dmo/stl-dashboard/StlVerificationStepper";
import { STL_DASHBOARD_NAV } from "@/lib/dmo/stlDashboardNav";
import { StlLiveDataBadge } from "@/components/features/stl/StlLiveDataBadge";
import type { StlDashboardDemo } from "@/lib/dmo/stlDashboardDemo";
import { STL_DASHBOARD_DEMO } from "@/lib/dmo/stlDashboardDemo";
import { calculateSTL, canUpgradeStl, stlDashboardDemoToEngine } from "@/lib/dmo/stlDemoEngine";
import type { StlFullSnapshot } from "@/lib/stl/fullSnapshot";
import { mapSnapshotToDashboardDemo } from "@/lib/stl/mapSnapshotToDashboard";
import { kpisFromSnapshot } from "@/lib/stl/stlKpi";
import {
  clampUserStlLevel,
  liveTierCardsFromLevels,
  verificationStepsFromFullSnapshot,
} from "@/lib/stl/stlDashboardExperienceDerived";

type Props = {
  /** Optional fallback for offline Storybook — prefer live API */
  data?: StlDashboardDemo;
};

export function StlDashboardExperience({ data }: Props) {
  const pathname = usePathname() ?? "";
  const [snapshot, setSnapshot] = useState<StlFullSnapshot | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const isLive = snapshot?.dataSource === "live";
  const view = useMemo(() => {
    if (snapshot) return mapSnapshotToDashboardDemo(snapshot);
    if (data) return data;
    return STL_DASHBOARD_DEMO;
  }, [snapshot, data]);

  const engineShape = stlDashboardDemoToEngine(view);
  const modelScore = calculateSTL(engineShape);
  const upgradeBlocked = !canUpgradeStl(engineShape);
  const currentLevel = clampUserStlLevel(view.stlLevel);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setLoadError(null);
      try {
        const res = await fetch("/api/stl/full-snapshot", { cache: "no-store" });
        const json = await res.json();
        if (!alive) return;
        if (!res.ok || json?.success === false) {
          setLoadError(json?.error?.message ?? "Trust snapshot unavailable");
          setSnapshot(null);
          return;
        }
        setSnapshot(json.data as StlFullSnapshot);
      } catch {
        if (!alive) return;
        setLoadError("Could not load trust snapshot");
        setSnapshot(null);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const kpiItems = snapshot ? kpisFromSnapshot(snapshot) : undefined;
  const supremePending = snapshot?.supreme.pendingApproval ?? false;
  const complaintNearLimit = snapshot?.complaints.nearLimit ?? false;
  const liveTiers = snapshot ? liveTierCardsFromLevels(snapshot.levels) : undefined;
  const dynamicSteps = snapshot ? verificationStepsFromFullSnapshot(snapshot) : undefined;
  const pssPct = Math.round(((view.pss.complaintsMax - view.pss.complaintsOpen) / Math.max(1, view.pss.complaintsMax)) * 100);
  const crbPct = Math.round(
    ((view.crb.verifications.current + view.crb.examsPassed.current) /
      Math.max(1, view.crb.verifications.target + view.crb.examsPassed.target)) *
      100,
  );
  const dmoPct = Math.round((view.dmo.refills.current / Math.max(1, view.dmo.refills.target)) * 100);
  const franchiseDone = view.franchise.verifications.filter((item) => item.done).length;
  const franchisePct = Math.round((franchiseDone / Math.max(1, view.franchise.verifications.length)) * 100);
  const penalties = view.pss.complaintsOpen > 0 ? Math.min(10, view.pss.complaintsOpen * 2) : 0;
  const factorRows = [
    { label: "PSS", value: pssPct, tone: "from-cyan-500 to-blue-500" },
    { label: "CRB", value: crbPct, tone: "from-emerald-500 to-green-500" },
    { label: "DMO", value: dmoPct, tone: "from-amber-500 to-orange-500" },
    { label: "Franchise", value: franchisePct, tone: "from-violet-500 to-fuchsia-500" },
    { label: "Penalty", value: penalties, tone: "from-rose-500 to-red-500", negative: true },
  ];
  const nextActions = [
    `Complete ${Math.max(0, view.pending.crb.target - view.pending.crb.current)} CRB verifications`,
    `Pass ${Math.max(0, view.pending.exams.target - view.pending.exams.current)} exam(s)`,
    `Add ${Math.max(0, view.pending.refills.target - view.pending.refills.current)} refill(s)`,
  ].filter((item) => !item.includes(" 0 "));

  return (
    <NeonShell>
      <div className="relative z-10 flex flex-col">
        <div className="flex min-w-0 flex-1 flex-col gap-3 p-3 sm:gap-4 sm:p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-[10px] uppercase tracking-[0.28em] text-cyan-300/90">EHB STL LEVEL · Service Trust Level</p>
            <div className="flex items-center gap-2">
              {loading ? (
                <span className="text-[10px] text-white/50">Loading trust data…</span>
              ) : (
                <StlLiveDataBadge mode={isLive ? "live" : "demo"} />
              )}
            </div>
          </div>
          {loadError ? (
            <p className="rounded-xl border border-amber-400/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-100">{loadError}</p>
          ) : null}

          <StlDashboardInsightBanner data={view} upgradeBlocked={upgradeBlocked} modelScore={modelScore} supremePending={supremePending} complaintNearLimit={complaintNearLimit} />
          <StlDashboardKpiStrip items={kpiItems} />

          <div className="grid grid-cols-1 gap-3 xl:grid-cols-12">
            <div className="xl:col-span-8">
              <StlDashboardHero data={view} modelScore={modelScore} upgradeBlocked={upgradeBlocked} />
            </div>
            <div className="xl:col-span-4">
              <section className="h-full rounded-2xl border border-cyan-400/20 bg-gradient-to-b from-cyan-500/[0.08] to-black/40 p-4 shadow-[0_0_30px_rgba(34,211,238,0.14)]">
                <p className="text-[11px] uppercase tracking-[0.18em] text-cyan-200/90">Action center</p>
                <h3 className="mt-1 text-base font-semibold text-white">What to do next</h3>
                <ul className="mt-3 space-y-2 text-sm text-white/70">
                  {nextActions.length > 0 ? (
                    nextActions.map((step) => (
                      <li key={step} className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2">
                        {step}
                      </li>
                    ))
                  ) : (
                    <li className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-emerald-100">
                      All requirements complete - upgrade lane open
                    </li>
                  )}
                </ul>
                <Link href="/dmo/stl" className="active:scale-[0.97] transition-all mt-4 inline-flex w-full items-center justify-center rounded-lg bg-gradient-to-r from-orange-500 to-rose-500 px-3 py-2 text-sm font-semibold text-white">
                  Start now
                </Link>
              </section>
            </div>
          </div>

          <section className="grid grid-cols-2 gap-2 md:grid-cols-4" aria-label="Mini STL snapshot">
            {[
              { label: "PSS", value: pssPct, tone: "text-cyan-200" },
              { label: "CRB", value: crbPct, tone: "text-emerald-200" },
              { label: "DMO", value: dmoPct, tone: "text-amber-200" },
              { label: "Franchise", value: franchisePct, tone: "text-violet-200" },
            ].map((card) => (
              <article key={card.label} className="rounded-xl border border-white/12 bg-white/[0.03] px-3 py-2 transition hover:border-cyan-400/40 hover:bg-white/[0.06]">
                <p className="text-[10px] uppercase tracking-[0.16em] text-white/50">{card.label}</p>
                <p className={`mt-1 text-lg font-semibold ${card.tone}`}>{card.value}%</p>
              </article>
            ))}
          </section>

          <StlTierSelector stlLevel={currentLevel} tiers={liveTiers} />
          <StlLevelJourneyTimeline currentLevel={currentLevel} />
          <StlVerificationStepper steps={dynamicSteps} />

          <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <div className="mb-3 flex items-center justify-between gap-2">
              <h3 className="text-sm font-semibold text-white">Score factors (why up/down)</h3>
              <span className="text-[10px] uppercase tracking-[0.18em] text-white/50">Live influence</span>
            </div>
            <div className="space-y-2.5">
              {factorRows.map((row) => (
                <div key={row.label}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="text-white/70">{row.label}</span>
                    <span className={row.negative ? "text-rose-200" : "text-white"}>{row.negative ? `-${row.value}%` : `${row.value}%`}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-black/35 ring-1 ring-white/10">
                    <div className={`h-full rounded-full bg-gradient-to-r ${row.tone}`} style={{ width: `${Math.min(100, row.value)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
            <article className="rounded-xl border border-cyan-400/20 bg-cyan-500/[0.06] p-3">
              <p className="text-[10px] uppercase tracking-[0.16em] text-cyan-200/90">Verification system</p>
              <p className="mt-1 text-sm text-white">PSS + CRB</p>
            </article>
            <article className="rounded-xl border border-amber-400/20 bg-amber-500/[0.06] p-3">
              <p className="text-[10px] uppercase tracking-[0.16em] text-amber-200/90">Growth system</p>
              <p className="mt-1 text-sm text-white">Franchise + Refilling</p>
            </article>
            <article className="rounded-xl border border-violet-400/20 bg-violet-500/[0.06] p-3">
              <p className="text-[10px] uppercase tracking-[0.16em] text-violet-200/90">Behavior system</p>
              <p className="mt-1 text-sm text-white">DMO + Penalty</p>
            </article>
          </div>

          <StlDashboardModuleGrid data={view} snapshot={snapshot} />
          <StlDashboardAiPanel data={view} />

          <details className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
            <summary className="cursor-pointer text-sm font-semibold text-white">Advanced data (tables, logs, rules)</summary>
            <div className="mt-4 space-y-3">
              <StlDashboardAnalytics snapshot={snapshot} />
              <StlDashboardPublicProfile data={view} snapshot={snapshot} />
            </div>
          </details>

          <p className="text-center text-[11px] text-white/50">
            Unified Trust Engine · <code className="rounded bg-white/10 px-1">GET /api/stl/full-snapshot</code> ·{" "}
            <code className="rounded bg-white/10 px-1">GET /api/stl/me</code>
          </p>

          <div className="flex flex-wrap justify-center gap-2 border-t border-white/10 pt-3 lg:hidden">
            {STL_DASHBOARD_NAV.slice(0, 5).map((item) => {
              const Icon = item.icon;
              const active = item.match(pathname);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[10px] ${
                    active ? "bg-cyan-500/20 text-cyan-100" : "text-white/50"
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
