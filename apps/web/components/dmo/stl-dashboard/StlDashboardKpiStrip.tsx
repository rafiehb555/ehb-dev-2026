"use client";

import { TrendingUp } from "lucide-react";
import type { StlKpiItem } from "@/lib/stl/stlKpi";
import { STL_KPI_STRIP } from "@/lib/dmo/stlDashboardDemo";

const ACCENT: Record<StlKpiItem["accent"], string> = {
  blue: "border-sky-500/35 bg-sky-500/[0.08] shadow-[0_0_24px_rgba(14,165,233,0.12)]",
  rose: "border-rose-500/35 bg-rose-500/[0.08] shadow-[0_0_24px_rgba(244,63,94,0.1)]",
  emerald: "border-emerald-500/35 bg-emerald-500/[0.08] shadow-[0_0_24px_rgba(52,211,153,0.1)]",
  amber: "border-amber-500/35 bg-amber-500/[0.08] shadow-[0_0_24px_rgba(245,158,11,0.1)]",
  violet: "border-violet-500/35 bg-violet-500/[0.08] shadow-[0_0_24px_rgba(139,92,246,0.12)]",
};

const VALUE: Record<StlKpiItem["accent"], string> = {
  blue: "text-sky-200",
  rose: "text-rose-200",
  emerald: "text-emerald-200",
  amber: "text-amber-200",
  violet: "text-violet-200",
};

type Props = {
  /** From kpisFromSnapshot() — if omitted, legacy demo strip is shown */
  items?: StlKpiItem[];
};

export function StlDashboardKpiStrip({ items }: Props) {
  const strip = items ?? STL_KPI_STRIP;
  const live = Boolean(items);

  return (
    <section
      className="rounded-2xl border border-white/10 bg-white/[0.03] p-2.5 backdrop-blur-sm sm:p-3"
      aria-label="Trust overview KPIs"
    >
      <div className="mb-2 flex items-center justify-between gap-2 px-1">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ehb-textMuted">Trust snapshot</p>
        <span
          className={`inline-flex items-center gap-1 text-[10px] ${live ? "text-emerald-400/90" : "text-amber-400/90"}`}
        >
          <TrendingUp className="h-3 w-3" aria-hidden />
          {live ? "Live KPIs" : "Demo KPIs"}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3 lg:grid-cols-5">
        {strip.map((k) => (
          <div
            key={k.label}
            className={`rounded-lg border px-2.5 py-2 transition duration-200 hover:brightness-110 ${ACCENT[k.accent]}`}
          >
            <p className="text-[10px] font-medium uppercase tracking-wide text-ehb-textMuted">{k.label}</p>
            <p className={`mt-0.5 text-base font-bold tabular-nums sm:text-lg ${VALUE[k.accent]}`}>{k.value}</p>
            {k.hint ? <p className="mt-0.5 text-[10px] text-white/45">{k.hint}</p> : null}
          </div>
        ))}
      </div>
    </section>
  );
}
