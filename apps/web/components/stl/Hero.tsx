"use client";

import useSTL from "@/hooks/useSTL";
import AnimatedCard from "@/components/ui/AnimatedCard";
import Button from "@/components/ui/Button";
import CountUp from "@/components/ui/CountUp";

export default function Hero() {
  const { data, error } = useSTL();

  /*
   * `data` is never null on first render now: useSTL seeds the initial state
   * with the client-safe demo snapshot, then silently refreshes in the
   * background. This kills the "blank skeleton → flash → real data" delay
   * that Rafi reported when clicking into the EHB-STL-LEVEL card.
   *
   * Only show the error surface if the initial demo fallback also failed to
   * materialise (should be impossible — left in as a defensive rail).
   */
  if (!data) {
    return (
      <AnimatedCard>
        <p className="text-sm text-red-300">{error ?? "Failed to load STL data"}</p>
      </AnimatedCard>
    );
  }

  const aiInsight = data.ai?.guide || "You're progressing toward next level";
  const pct = Math.min(100, Math.max(0, data.trustScore));
  const size = 170;
  const stroke = 14;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (pct / 100) * c;

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <AnimatedCard className="group flex flex-col items-center justify-center rounded-2xl border-white/10 bg-white/[0.04] p-7 backdrop-blur-xl hover:shadow-emerald-500/20">
        <h2 className="text-xs uppercase tracking-[0.16em] text-gray-400">EHB STL Score</h2>
        <div className="relative mt-4">
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-emerald-500/25 via-cyan-500/20 to-amber-400/20 blur-2xl" />
          <svg width={size} height={size} className="relative -rotate-90">
            <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.10)" strokeWidth={stroke} />
            <circle
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke="url(#stlScoreDial)"
              strokeWidth={stroke}
              strokeLinecap="round"
              strokeDasharray={c}
              strokeDashoffset={offset}
              className="transition-[stroke-dashoffset] duration-1000 ease-out"
            />
            <defs>
              <linearGradient id="stlScoreDial" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="45%" stopColor="#22d3ee" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
            </defs>
          </svg>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
            <div className="text-6xl font-black leading-none text-white">
              <CountUp value={pct} />
            </div>
            <p className="mt-1 text-xs font-semibold text-cyan-100/90">/ 100</p>
          </div>
        </div>
        <div className="mt-3 text-sm text-gray-400">
          Level {data.stlLevel} - {data.levelName}
        </div>
      </AnimatedCard>

      <AnimatedCard className="rounded-2xl border-cyan-500/20 bg-gradient-to-r from-emerald-500/20 via-cyan-500/15 to-blue-500/20 p-7 backdrop-blur-xl hover:shadow-cyan-500/25">
        <p className="inline-flex rounded-full border border-cyan-400/30 bg-cyan-500/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-cyan-200">
          AI Insight
        </p>
        <p className="mt-3 text-xl font-semibold leading-snug text-white">{aiInsight}</p>
        <p className="mt-1 text-xs text-gray-300">Optimized recommendation based on current STL behavior.</p>
        <div className="mt-4 animate-[stl-cta-pulse_2.5s_ease-in-out_infinite]">
          <Button className="mt-0">Upgrade Now</Button>
        </div>
      </AnimatedCard>
    </div>
  );
}

