"use client";

/**
 * DMO — Industry Sub-pages Catch-all
 *   - Routes like /dmo/industry/[slug]/analytics, /compliance, etc.
 *   - Shows section title and module availability
 */

import Link from "next/link";

interface PageProps {
  params: Promise<{ sub: string[] }>;
}

export default async function IndustrySubPage({ params }: PageProps) {
  const { sub } = await params;
  const pathSegments = sub.join(" / ");

  return (
    <div className="space-y-6">
      <header className="relative overflow-hidden rounded-2xl border border-[#7B6EF6]/25 bg-gradient-to-br from-[#13162A] via-[#1A1D33] to-[#13162A] p-6 pt-[22px]">
        <div className="pointer-events-none absolute left-0 right-0 top-0 h-[3px]" style={{ background: "linear-gradient(90deg, transparent 0%, #7B6EF6 50%, transparent 100%)" }} />
        <div className="relative space-y-2">
          <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.22em]">
            <Link href="/dmo" className="text-white/40 hover:text-white/70 transition-colors">DMO</Link>
            <span className="text-white/25">/</span>
            <Link href="/dmo/industry" className="text-white/40 hover:text-white/70 transition-colors">Industry</Link>
            <span className="text-white/25">/</span>
            <span className="text-[#A098F8]">{pathSegments}</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Industry Module</h1>
          <p className="max-w-2xl text-sm text-white/65">
            This section is not yet available or is under development.
          </p>
        </div>
      </header>

      <div className="rounded-2xl border border-white/10 bg-[#13162A]/70 p-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/[0.08] border border-white/10 mb-4">
          <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8 text-white/40">
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h2 className="text-lg font-bold text-white mb-2">Coming Soon</h2>
        <p className="text-sm text-white/65 mb-6">
          {pathSegments} is coming in a future phase.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/dmo/industry"
            className="rounded-xl border border-[#7B6EF6]/40 bg-[#7B6EF6]/15 px-4 py-2 text-sm font-semibold text-[#A098F8] transition-all hover:bg-[#7B6EF6]/25"
          >
            Back to Industry Hub
          </Link>
          <Link
            href="/dmo"
            className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-white/[0.08]"
          >
            DMO Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
