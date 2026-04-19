"use client";

import { useState } from "react";
import Link from "next/link";

export default function AiAssistantSubPage() {
  return (
    <div className="space-y-6">
      <header className="relative overflow-hidden rounded-2xl border border-[#A098F8]/30 bg-gradient-to-br from-[#13162A] via-[#1A1D33] to-[#13162A] p-6 pt-[22px]">
        <div className="pointer-events-none absolute left-0 right-0 top-0 h-[3px]" style={{ background: "linear-gradient(90deg, transparent 0%, #A098F8 25%, #7B6EF6 50%, #2BBFA0 75%, transparent 100%)" }} />
        <div className="pointer-events-none absolute left-3 top-3 h-6 w-6 border-l-[1.5px] border-t-[1.5px] border-[#A098F8]/50" />
        <div className="pointer-events-none absolute bottom-3 right-3 h-6 w-6 border-b-[1.5px] border-r-[1.5px] border-[#7B6EF6]/45" />
        <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-gradient-to-br from-[#A098F8]/20 via-[#7B6EF6]/15 to-transparent blur-3xl" />
        <div className="relative flex flex-col gap-4">
          <div className="min-w-0 space-y-2">
            <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.22em]">
              <Link href="/dmo" className="text-white/40 hover:text-white/70 transition-colors">DMO</Link>
              <span className="text-white/25">/</span>
              <span className="text-[#A098F8]">AI Assistant</span>
            </div>
            <h1 className="text-2xl font-bold text-white md:text-3xl">AI Assistant</h1>
            <p className="max-w-2xl text-sm text-white/65">
              Workspace-scoped chat and intelligence tools.
            </p>
          </div>
        </div>
      </header>

      <section className="rounded-2xl border border-white/10 bg-[#13162A]/70 p-12 text-center">
        <p className="text-white/65">This sub-section is not yet available. Return to main AI Assistant.</p>
        <Link href="/dmo/ai-assistant" className="mt-4 inline-block rounded-xl border border-[#7B6EF6]/40 bg-[#7B6EF6]/12 px-4 py-2 text-xs font-semibold text-[#A098F8] transition-colors hover:border-[#A098F8]/70 hover:bg-[#7B6EF6]/20">
          Back to AI Assistant
        </Link>
      </section>
    </div>
  );
}
