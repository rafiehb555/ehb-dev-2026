"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

export function EarningHookMoment() {
  const [topEarned, setTopEarned] = useState(500);

  useEffect(() => {
    const id = window.setInterval(() => {
      setTopEarned(480 + Math.floor(Math.random() * 90)); // 480..569
    }, 7200);
    return () => window.clearInterval(id);
  }, []);

  const moneyLabel = useMemo(() => {
    return topEarned === 1 ? "$1" : `$${topEarned}`;
  }, [topEarned]);

  return (
    <section className="container-ultra py-4">
      <div className="rounded-3xl glass-panel border border-white/10 px-4 md:px-6 py-4 md:py-5 overflow-hidden relative">
        <div className="absolute inset-0 pointer-events-none opacity-[0.55]">
          <div className="absolute -left-24 -top-24 h-64 w-64 rounded-full bg-sky-400/10 blur-2xl" />
          <div className="absolute -right-24 -bottom-24 h-64 w-64 rounded-full bg-violet-400/10 blur-2xl" />
        </div>

        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400 mb-2">
              You can start earning today
            </p>
            <h2 className="text-xl md:text-2xl font-semibold text-white">
              You can start earning today
            </h2>
            <p className="text-slate-400 text-sm md:text-base mt-2">
              Top users earned <span className="text-emerald-300 font-semibold">{moneyLabel}</span> this week.
            </p>

            <div className="flex flex-wrap gap-2 mt-4">
              <span className="rounded-full px-3 py-[5px] text-[11px] font-semibold border border-emerald-400/35 bg-emerald-500/10 text-emerald-200">
                ⭐ Verified outcomes
              </span>
              <span className="rounded-full px-3 py-[5px] text-[11px] font-semibold border border-sky-400/35 bg-sky-500/10 text-sky-200">
                AI matching active
              </span>
              <span className="rounded-full px-3 py-[5px] text-[11px] font-semibold border border-violet-400/35 bg-violet-500/10 text-violet-200">
                🔥 Multi-industry
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 md:flex-shrink-0">
            <Link
              href="/dashboard"
              className="min-h-touch inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#00AEEF] to-[#22C55E] px-6 py-2.5 text-sm font-semibold text-slate-950 btn-glow hover:opacity-95 transition-all"
            >
              Go to dashboard
            </Link>
            <Link
              href="#industries"
              className="min-h-touch inline-flex items-center justify-center rounded-full border border-white/25 bg-white/5 px-6 py-2.5 text-sm font-semibold text-slate-100 hover:bg-white/10 transition-all"
            >
              Explore industries
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

