"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, Gem, Shield } from "lucide-react";
import type { StlTierCardDef } from "@/lib/dmo/stlDashboardDemo";
import { STL_TIER_CARDS } from "@/lib/dmo/stlDashboardDemo";

const ACCENT_RING: Record<StlTierCardDef["accent"], string> = {
  slate: "border-white/15 bg-gradient-to-b from-white/[0.06] to-transparent",
  zinc: "border-slate-400/25 bg-gradient-to-b from-slate-400/10 to-transparent",
  amber: "border-amber-400/45 bg-gradient-to-b from-amber-500/15 to-transparent shadow-[0_0_28px_rgba(251,191,36,0.2)]",
  sky: "border-sky-400/40 bg-gradient-to-b from-sky-500/12 to-transparent",
  violet: "border-violet-400/45 bg-gradient-to-b from-violet-500/12 to-transparent",
  emerald: "border-emerald-400/45 bg-gradient-to-b from-emerald-500/12 to-transparent",
};

type Props = {
  stlLevel: number;
  tiers?: StlTierCardDef[];
};

export function StlTierSelector({ stlLevel, tiers = STL_TIER_CARDS }: Props) {
  const initialId = useMemo(() => {
    const n = Math.min(8, Math.max(1, stlLevel));
    return `stl${n}`;
  }, [stlLevel]);
  const [selectedId, setSelectedId] = useState(initialId);

  useEffect(() => {
    setSelectedId(`stl${Math.min(8, Math.max(1, stlLevel))}`);
  }, [stlLevel]);

  return (
    <section className="space-y-2" aria-label="Service trust level tiers">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-300/90">Choose tier</p>
          <p className="text-sm text-ehb-textBody">Membership style selector — mirrors franchise & upgrade flows.</p>
        </div>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1 pt-0.5 [scrollbar-width:thin]">
        {tiers.map((tier) => {
          const tierLevel = Number(tier.id.replace("stl", ""));
          const isSelected = selectedId === tier.id;
          const locked = Number.isFinite(tierLevel) && tierLevel > stlLevel;
          return (
            <div
              key={tier.id}
              className={[
                "flex min-w-[132px] max-w-[164px] flex-1 flex-col rounded-xl border p-2.5 backdrop-blur-md transition duration-200 sm:min-w-[146px]",
                ACCENT_RING[tier.accent],
                isSelected ? "ring-2 ring-cyan-400/50 ring-offset-2 ring-offset-[#05080f]" : "hover:border-white/25",
                locked ? "opacity-60" : "",
              ].join(" ")}
            >
              <div className="mb-1.5 flex items-center justify-between gap-2">
                <span className="rounded-lg border border-white/10 bg-black/30 p-1.5 text-white/90">
                  {tier.accent === "amber" ? (
                    <Gem className="h-4 w-4 text-amber-300" aria-hidden />
                  ) : (
                    <Shield className="h-4 w-4 text-cyan-200/90" aria-hidden />
                  )}
                </span>
                {isSelected ? (
                  <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
                    Selected
                  </span>
                ) : null}
              </div>
              <p className="text-[13px] font-semibold text-white">{tier.name}</p>
              <p className="mt-1 line-clamp-2 text-[11px] leading-snug text-ehb-textMuted">{tier.subtitle}</p>
              <button
                type="button"
                onClick={() => {
                  if (!locked) setSelectedId(tier.id);
                }}
                disabled={locked}
                className={[
                  "mt-2 w-full rounded-lg border py-1.5 text-center text-[11px] font-semibold transition",
                  isSelected
                    ? "border-emerald-500/50 bg-emerald-500/15 text-emerald-200"
                    : "border-white/15 bg-white/[0.04] text-ehb-textBody hover:border-cyan-400/35 hover:text-white",
                  locked ? "cursor-not-allowed border-white/10 text-white/40 hover:border-white/10 hover:text-white/40" : "",
                ].join(" ")}
              >
                {isSelected ? (
                  <span className="inline-flex items-center justify-center gap-1">
                    <Check className="h-3.5 w-3.5" aria-hidden />
                    Selected
                  </span>
                ) : (
                  locked ? "Locked" : "Select"
                )}
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
