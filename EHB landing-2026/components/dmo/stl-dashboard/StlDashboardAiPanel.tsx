"use client";

import Link from "next/link";
import { ArrowRight, Bot, ChevronRight } from "lucide-react";
import type { StlDashboardDemo } from "@/lib/dmo/stlDashboardDemo";

export function StlDashboardAiPanel({ data: d }: { data: StlDashboardDemo }) {
  return (
    <section
      className="flex flex-col rounded-2xl border border-emerald-400/25 bg-gradient-to-b from-emerald-500/[0.12] to-black/40 p-5 shadow-[0_0_40px_rgba(52,211,153,0.12)] backdrop-blur-md transition hover:border-emerald-400/40"
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
  );
}
