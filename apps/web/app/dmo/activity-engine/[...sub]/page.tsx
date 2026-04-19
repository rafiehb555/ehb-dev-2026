"use client";

import { useState } from "react";
import Link from "next/link";

export default function ActivityEngineSubPage() {
  return (
    <div className="space-y-6">
      <header className="relative overflow-hidden rounded-2xl border border-[#7B6EF6]/30 bg-gradient-to-br from-[#13162A] via-[#1A1D33] to-[#13162A] p-6 pt-[22px]">
        <div className="pointer-events-none absolute left-0 right-0 top-0 h-[3px]" style={{ background: "linear-gradient(90deg, transparent 0%, #7B6EF6 25%, #2BBFA0 50%, #F0A030 75%, transparent 100%)" }} />
        <div className="relative flex flex-col gap-4">
          <div className="min-w-0 space-y-2">
            <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.22em]">
              <Link href="/dmo" className="text-white/40 hover:text-white/70 transition-colors">DMO</Link>
              <span className="text-white/25">/</span>
              <span className="text-[#A098F8]">Activity Engine</span>
            </div>
            <h1 className="text-2xl font-bold text-white md:text-3xl">Activity Engine</h1>
            <p className="max-w-2xl text-sm text-white/65">Real-time event stream and audit logs.</p>
          </div>
        </div>
      </header>

      <section className="rounded-2xl border border-white/10 bg-[#13162A]/70 p-12 text-center">
        <p className="text-white/65">This sub-section is not yet available. Return to Activity Engine.</p>
        <Link href="/dmo/activity-engine" className="mt-4 inline-block rounded-xl border border-[#7B6EF6]/40 bg-[#7B6EF6]/12 px-4 py-2 text-xs font-semibold text-[#A098F8] transition-colors hover:border-[#A098F8]/70 hover:bg-[#7B6EF6]/20">
          Back to Activity Engine
        </Link>
      </section>
    </div>
  );
}
