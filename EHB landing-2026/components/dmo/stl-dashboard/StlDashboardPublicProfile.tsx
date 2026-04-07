"use client";

import { EhbStlBadge } from "@/components/ui/EhbStlBadge";
import type { StlDashboardDemo } from "@/lib/dmo/stlDashboardDemo";

export function StlDashboardPublicProfile({ data: d }: { data: StlDashboardDemo }) {
  return (
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
