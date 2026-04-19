"use client";

/**
 * DMO — Refilling Sub-pages Catch-all
 *   - Routes like /dmo/refilling/batch, /dmo/refilling/audit, etc.
 *   - Shows section title and coming soon message
 */

import Link from "next/link";

interface PageProps {
  params: Promise<{ sub: string[] }>;
}

export default async function RefillingSubPage({ params }: PageProps) {
  const { sub } = await params;
  const pathSegments = sub.join(" / ");

  return (
    <div className="space-y-6">
      <header className="relative overflow-hidden rounded-2xl border border-[#2BBFA0]/25 bg-gradient-to-br from-[#13162A] via-[#1A1D33] to-[#13162A] p-6 pt-[22px]">
        <div className="pointer-events-none absolute left-0 right-0 top-0 h-[3px]" style={{ background: "linear-gradient(90deg, transparent 0%, #2BBFA0 50%, transparent 100%)" }} />
        <div className="relative space-y-2">
          <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.22em]">
            <Link href="/dmo" className="text-white/40 hover:text-white/70 transition-colors">DMO</Link>
            <span className="text-white/25">/</span>
            <Link href="/dmo/refilling" className="text-white/40 hover:text-white/70 transition-colors">Refilling</Link>
            <span className="text-white/25">/</span>
            <span className="text-[#2BBFA0]">{pathSegments}</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Refilling Module</h1>
          <p className="max-w-2xl text-sm text-white/65">
            PSS/CRB certification renewal management.
          </p>
        </div>
      </header>

      <div className="rounded-2xl border border-white/10 bg-[#13162A]/70 p-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/[0.08] border border-white/10 mb-4">
          <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8 text-white/40">
            <path d="M4 12a8 8 0 0 0 15.3 5M4 12a8 8 0 0 1 15.3-5M12 2v10M12 2l-3 2M12 2l3 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h2 className="text-lg font-bold text-white mb-2">Coming Soon</h2>
        <p className="text-sm text-white/65 mb-6">
          The {pathSegments} section is under development.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/dmo/refilling"
            className="rounded-xl border border-[#2BBFA0]/40 bg-[#2BBFA0]/15 px-4 py-2 text-sm font-semibold text-[#2BBFA0] transition-all hover:bg-[#2BBFA0]/25"
          >
            Back to Refilling
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
