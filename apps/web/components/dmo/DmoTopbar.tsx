"use client";

/**
 * DMO topbar — Phase 1 rebuild (2026-04-11).
 *
 * Thin sticky bar above the module content. Shows:
 *   - Breadcrumb: Workspace → Group → Module
 *   - Live pulse indicator (server heartbeat surrogate)
 *   - Quick action buttons (Dashboard / Home / Landing / Admin)
 *
 * The per-module sub-nav (pills) is rendered separately by DmoTopSubNav.tsx
 * directly underneath this topbar.
 */

import Link from "next/link";
import type { DmoNavGroup, DmoNavSection } from "./navigation";

type DmoTopbarProps = {
  group: DmoNavGroup | null;
  section: DmoNavSection | null;
};

export function DmoTopbar({ group, section }: DmoTopbarProps) {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="min-w-0">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.22em] text-white/45"
        >
          <span className="text-[#7B6EF6]">EHB</span>
          <span aria-hidden>·</span>
          <span className="text-white/55">DMO</span>
          {group ? (
            <>
              <span aria-hidden>·</span>
              <span className={group.tint}>{group.label}</span>
            </>
          ) : null}
          {section ? (
            <>
              <span aria-hidden>·</span>
              <span className="text-white">{section.label}</span>
            </>
          ) : null}
        </nav>
        <div className="mt-1.5 flex items-center gap-2">
          <h1 className="truncate text-lg font-semibold text-white">
            {section?.label ?? "DMO Workspace"}
          </h1>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#38C878]/35 bg-[#38C878]/10 px-2 py-0.5 text-[10px] font-semibold text-[#38C878]">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#38C878] opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#38C878]" />
            </span>
            Live
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Link
          href="/dmo"
          className="rounded-xl border border-[#7B6EF6]/50 bg-[#7B6EF6]/15 px-3 py-1.5 text-xs font-semibold text-[#A098F8] transition-colors hover:border-[#7B6EF6]/80 hover:bg-[#7B6EF6]/25 hover:text-white"
        >
          DMO Dashboard
        </Link>
        <Link
          href="/home"
          className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-white/75 transition-colors hover:border-white/20 hover:bg-white/[0.07] hover:text-white"
        >
          EHB Home
        </Link>
        <Link
          href="/"
          className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-white/75 transition-colors hover:border-white/20 hover:bg-white/[0.07] hover:text-white"
        >
          Landing
        </Link>
        <Link
          href="/admin"
          className="rounded-xl border border-[#2BBFA0]/40 bg-[#2BBFA0]/12 px-3 py-1.5 text-xs font-semibold text-[#2BBFA0] transition-colors hover:border-[#2BBFA0]/70 hover:bg-[#2BBFA0]/20 hover:text-white"
        >
          Super Admin
        </Link>
      </div>
    </div>
  );
}
