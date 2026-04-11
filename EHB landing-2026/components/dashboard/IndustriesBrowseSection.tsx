"use client";

import Link from "next/link";
import { INDUSTRIES } from "@/lib/industry/config";
import { IndustryCard } from "@/components/IndustryCard";

const PREVIEW = 8;

export function IndustriesBrowseSection() {
  const slice = INDUSTRIES.slice(0, PREVIEW);

  return (
    <div className="glass-panel border border-white/15 rounded-2xl p-5 md:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-ehb-textMuted mb-1">Industries</p>
          <h2 className="text-lg md:text-xl font-semibold text-white">Browse all sectors</h2>
          <p className="text-xs text-ehb-textMuted mt-1">
            Same trust layer across {INDUSTRIES.length} industries — open a landing or industry home.
          </p>
        </div>
        <Link
          href="/#industries"
          className="inline-flex items-center justify-center rounded-full border border-cyan-400/50 bg-cyan-500/10 px-4 py-2 text-[11px] font-semibold text-cyan-100 hover:bg-cyan-500/20 transition-colors shrink-0"
        >
          View all on home
        </Link>
      </div>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {slice.map((ind) => (
          <IndustryCard key={ind.slug} industry={ind} />
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-2 justify-center text-[11px]">
        <Link href="/dashboard" className="text-ehb-textMuted hover:text-ehb-textBody">
          Dashboard
        </Link>
        <span className="text-ehb-textMuted">·</span>
        <Link href="/ai-marketplace" className="text-ehb-textMuted hover:text-ehb-textBody">
          AI marketplace
        </Link>
        <span className="text-ehb-textMuted">·</span>
        <span className="text-ehb-textMuted">Showing {PREVIEW} of {INDUSTRIES.length}</span>
      </div>
    </div>
  );
}
