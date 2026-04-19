"use client";

/**
 * DMO — Affiliate / Sub-pages catch-all
 *   - Handles nested sub-page routing
 *   - Shows 404 or redirect for unknown sub-pages
 */

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AffiliateSub() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const lastSegment = segments[segments.length - 1];

  return (
    <div className="space-y-6">
      <header className="relative overflow-hidden rounded-2xl border border-[#38C878]/30 bg-gradient-to-br from-[#13162A] via-[#1A1D33] to-[#13162A] p-6 pt-[22px]">
        <div className="pointer-events-none absolute left-0 right-0 top-0 h-[3px]" style={{ background: "linear-gradient(90deg, transparent 0%, #38C878 25%, #7B6EF6 50%, #F0A030 75%, transparent 100%)" }} />
        <div className="pointer-events-none absolute left-3 top-3 h-6 w-6 border-l-[1.5px] border-t-[1.5px] border-[#38C878]/50" />
        <div className="pointer-events-none absolute bottom-3 right-3 h-6 w-6 border-b-[1.5px] border-r-[1.5px] border-[#7B6EF6]/45" />
        <div className="relative space-y-2">
          <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.22em]">
            <Link href="/dmo" className="text-white/40 hover:text-white/70 transition-colors">DMO</Link>
            <span className="text-white/25">/</span>
            <Link href="/dmo/affiliate" className="text-white/40 hover:text-white/70 transition-colors">Affiliate</Link>
            <span className="text-white/25">/</span>
            <span className="text-[#38C878]">{lastSegment}</span>
          </div>
          <h1 className="text-2xl font-bold text-white md:text-3xl">Page Not Found</h1>
          <p className="max-w-2xl text-sm text-white/65">
            The page you are looking for does not exist. Please return to the Affiliate Dashboard.
          </p>
        </div>
      </header>

      <section className="rounded-2xl border border-white/10 bg-[#13162A]/70 p-6">
        <div className="space-y-4 text-center">
          <div className="text-5xl font-bold text-white/20">404</div>
          <p className="text-white/50">No sub-page found for: <span className="font-mono text-white/70">/{lastSegment}</span></p>
          <Link
            href="/dmo/affiliate"
            className="inline-block rounded-xl border border-[#38C878]/50 bg-[#38C878]/15 px-4 py-2.5 text-sm font-semibold text-[#38C878] transition-colors hover:bg-[#38C878]/25 hover:text-white"
          >
            Return to Affiliate Dashboard
          </Link>
        </div>
      </section>
    </div>
  );
}
