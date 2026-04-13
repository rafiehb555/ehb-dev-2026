"use client";

/**
 * Placeholder module shell used by Phase 1 stub pages for canonical DMO
 * modules that aren't fully built yet. Keeps sidebar + topbar working while
 * giving the user a clear "Coming in Phase N" marker instead of a 404.
 */

import Link from "next/link";
import type { ReactNode } from "react";
import AnimatedCard from "@/components/ui/AnimatedCard";

export type DmoModuleStubProps = {
  icon: string;
  title: string;
  tagline: string;
  phase: 2 | 3 | 4 | 5;
  bullets?: string[];
  children?: ReactNode;
};

const PHASE_META: Record<
  DmoModuleStubProps["phase"],
  { label: string; tint: string; ring: string }
> = {
  2: {
    label: "Phase 2 — Core Verification",
    tint: "text-[#2BBFA0]",
    ring: "border-[#2BBFA0]/35 bg-[#2BBFA0]/8",
  },
  3: {
    label: "Phase 3 — Financial & Operations",
    tint: "text-[#F0A030]",
    ring: "border-[#F0A030]/35 bg-[#F0A030]/8",
  },
  4: {
    label: "Phase 4 — Network & Intelligence",
    tint: "text-[#A098F8]",
    ring: "border-[#7B6EF6]/35 bg-[#7B6EF6]/8",
  },
  5: {
    label: "Phase 5 — Admin & Polish",
    tint: "text-cyan-300",
    ring: "border-cyan-500/35 bg-cyan-500/8",
  },
};

export default function DmoModuleStub({ icon, title, tagline, phase, bullets, children }: DmoModuleStubProps) {
  const meta = PHASE_META[phase];
  return (
    <div className="space-y-5">
      <AnimatedCard className="relative overflow-hidden rounded-2xl border-white/10 bg-gradient-to-br from-[#13162A] via-[#1A1D33] to-[#13162A] p-6">
        <div className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full bg-gradient-to-br from-[#7B6EF6]/20 via-[#A098F8]/10 to-transparent blur-3xl" />
        <div className="relative flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-3xl">
              {icon}
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/45">
                DMO Module
              </p>
              <h1 className="mt-1 text-2xl font-bold text-white">{title}</h1>
              <p className="mt-1 max-w-xl text-sm text-white/65">{tagline}</p>
            </div>
          </div>
          <span
            className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-semibold ${meta.ring} ${meta.tint}`}
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-current" />
            </span>
            {meta.label}
          </span>
        </div>
      </AnimatedCard>

      {bullets && bullets.length > 0 ? (
        <AnimatedCard className="rounded-2xl border-white/10 bg-[#13162A]/80 p-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/55">
            What&apos;s coming
          </p>
          <ul className="mt-3 space-y-2 text-sm text-white/75">
            {bullets.map((b, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-[#A098F8]" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </AnimatedCard>
      ) : null}

      {children}

      <div className="flex flex-wrap gap-2">
        <Link
          href="/dmo"
          className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-white/75 transition-colors hover:border-white/20 hover:bg-white/[0.07] hover:text-white"
        >
          ← Back to DMO Dashboard
        </Link>
      </div>
    </div>
  );
}
