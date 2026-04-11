"use client";

import { Check, Lock, Rocket, Target } from "lucide-react";

const LEVELS = [
  { n: 1, label: "L1", short: "FREE" },
  { n: 2, label: "L2", short: "BASIC" },
  { n: 3, label: "L3", short: "NORMAL" },
  { n: 4, label: "L4", short: "STANDARD" },
  { n: 5, label: "L5", short: "ADVANCED" },
  { n: 6, label: "L6", short: "HIGH" },
  { n: 7, label: "L7", short: "VIP" },
  { n: 8, label: "L8", short: "SUPREME" },
] as const;

type Props = {
  currentLevel: number;
};

export function StlLevelJourneyTimeline({ currentLevel }: Props) {
  return (
    <section
      className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-transparent p-4 backdrop-blur-md sm:p-5"
      aria-label="STL level journey"
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Rocket className="h-5 w-5 text-cyan-400" aria-hidden />
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-300/90">Progress timeline</p>
            <p className="text-sm text-ehb-textBody">Completed · current · locked — path to VIP</p>
          </div>
        </div>
      </div>

      <div className="relative mt-8 px-1 sm:px-4">
        <div
          className="absolute left-[10%] right-[10%] top-[22px] hidden h-[3px] rounded-full bg-gradient-to-r from-emerald-500/30 via-white/15 to-white/10 sm:block"
          aria-hidden
        />
        <ol className="relative flex flex-col gap-6 sm:flex-row sm:justify-between sm:gap-2">
          {LEVELS.map((lv) => {
            const done = currentLevel > lv.n;
            const current = currentLevel === lv.n;
            const locked = currentLevel < lv.n;
            return (
              <li key={lv.n} className="flex flex-1 flex-col items-center text-center">
                <div
                  className={[
                    "relative z-[1] flex h-11 w-11 items-center justify-center rounded-2xl border text-sm font-bold transition duration-300",
                    done
                      ? "border-emerald-400/50 bg-[#0a1628] text-emerald-300 shadow-[0_0_22px_rgba(52,211,153,0.35)]"
                      : current
                        ? "stl-journey-current border-amber-400/60 bg-[#0a1628] text-amber-100 shadow-[0_0_26px_rgba(251,191,36,0.45)]"
                        : "border-white/12 bg-[#0a1628] text-white/35",
                  ].join(" ")}
                >
                  {done ? <Check className="h-5 w-5" aria-hidden /> : locked ? <Lock className="h-4 w-4" aria-hidden /> : <Target className="h-5 w-5 text-amber-200" aria-hidden />}
                </div>
                <p className="mt-2 text-xs font-semibold text-white">{lv.label}</p>
                <p className="mt-0.5 text-[10px] text-ehb-textMuted">{lv.short}</p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
