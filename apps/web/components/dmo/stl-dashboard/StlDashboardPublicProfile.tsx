"use client";

import { User } from "lucide-react";
import { EhbStlBadge } from "@/components/ui/EhbStlBadge";
import type { StlDashboardDemo } from "@/lib/dmo/stlDashboardDemo";
import type { StlFullSnapshot } from "@/lib/stl/fullSnapshot";

export function StlDashboardPublicProfile({
  data: d,
  snapshot,
}: {
  data: StlDashboardDemo;
  snapshot?: StlFullSnapshot | null;
}) {
  const bars = snapshot
    ? [
        Math.max(0, snapshot.trustScore - 16),
        Math.max(0, snapshot.trustScore - 12),
        Math.max(0, snapshot.trustScore - 9),
        Math.max(0, snapshot.trustScore - 6),
        Math.max(0, snapshot.trustScore - 3),
        snapshot.trustScore,
      ]
    : [52, 58, 55, 62, 68, 72, 70, 78];
  const max = Math.max(...bars, 1);

  return (
    <section
      className="rounded-2xl border border-orange-400/25 bg-gradient-to-br from-orange-500/[0.08] via-black/30 to-transparent p-6 shadow-[0_0_48px_rgba(251,146,60,0.1)] backdrop-blur-md"
      aria-labelledby="public-profile-title"
    >
      <div className="flex flex-col items-center gap-2 sm:flex-row sm:justify-between">
        <div className="flex items-center gap-2">
          <User className="h-5 w-5 text-orange-300" aria-hidden />
          <h2 id="public-profile-title" className="text-xs font-bold uppercase tracking-[0.35em] text-orange-200/90">
            Public Trust Profile
          </h2>
        </div>
        <span className="text-[10px] text-white/50">Marketplace preview</span>
      </div>
      <div className="mx-auto mt-6 max-w-2xl space-y-3 text-center text-sm text-white/70">
        <p className="text-base font-semibold text-emerald-300">{d.publicProfile.stlLine}</p>
        {d.publicProfile.summaryLines.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>

      <div className="mx-auto mt-6 max-w-md rounded-xl border border-white/10 bg-black/30 p-4">
        <p className="text-center text-[10px] font-semibold uppercase tracking-wider text-white/50">Trust score trend</p>
        <div className="mt-3 flex h-24 items-end justify-between gap-1">
          {bars.map((h, i) => (
            <div
              key={i}
              className="w-full rounded-t-sm bg-gradient-to-t from-cyan-600/40 to-cyan-400/90 transition hover:opacity-90"
              style={{ height: `${(h / max) * 100}%`, minHeight: "8px" }}
              title={`${h}%`}
            />
          ))}
        </div>
      </div>

      <div className="relative mx-auto mt-8 flex justify-center">
        <div className="pointer-events-none absolute inset-0 flex justify-center">
          <div className="h-28 w-24 bg-orange-500/50 blur-3xl" />
        </div>
        <div
          className="relative flex h-[5.5rem] w-[4.75rem] items-center justify-center bg-gradient-to-br from-amber-500/40 to-orange-700/30 text-center text-[10px] font-bold uppercase leading-tight tracking-wide text-amber-50 shadow-[0_0_30px_rgba(251,146,60,0.6)] transition hover:scale-[1.03]"
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
  );
}
