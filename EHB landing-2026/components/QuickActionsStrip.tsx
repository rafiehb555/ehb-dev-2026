"use client";

import Link from "next/link";

export function QuickActionsStrip() {
  return (
    <section className="container-ultra py-6">
      <div className="rounded-2xl glass-panel border border-white/10 px-4 py-4 md:px-6 md:py-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-[11px] sm:text-xs text-ehb-textBody">
          Ready to take action? Start with one of these quick steps.
        </p>
        <div className="flex flex-wrap gap-2 text-[11px] sm:text-xs">
          <Link
            href="/dashboard"
            className="min-h-touch inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#22c55e] to-[#16a34a] px-4 py-2 font-semibold text-slate-950 btn-glow"
          >
            Create Service
          </Link>
          <Link
            href="/home"
            className="min-h-touch inline-flex items-center justify-center rounded-full border border-white/25 bg-white/5 px-4 py-2 font-semibold text-white hover:bg-white/10 transition-all"
          >
            Apply for Jobs
          </Link>
          <Link
            href="/ai-marketplace"
            className="min-h-touch inline-flex items-center justify-center rounded-full border border-sky-400/60 bg-sky-500/10 px-4 py-2 font-semibold text-sky-100 hover:bg-sky-500/20 transition-all"
          >
            Add Product
          </Link>
        </div>
      </div>
    </section>
  );
}

