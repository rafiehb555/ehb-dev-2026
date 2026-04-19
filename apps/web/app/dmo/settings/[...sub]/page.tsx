"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

export default function SettingsSubPage() {
  const params = useParams();
  const path = (params.sub as string[])?.join("/") || "unknown";

  return (
    <div className="space-y-6">
      <header className="relative overflow-hidden rounded-2xl border border-[#A098F8]/30 bg-gradient-to-br from-[#13162A] via-[#1A1D33] to-[#13162A] p-6 pt-[22px]">
        <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-gradient-to-br from-[#A098F8]/20 via-[#2BBFA0]/15 to-transparent blur-3xl" />
        <div className="relative space-y-2">
          <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.22em]">
            <Link href="/dmo" className="text-white/40 hover:text-white/70 transition-colors">DMO</Link>
            <span className="text-white/25">/</span>
            <Link href="/dmo/settings" className="text-white/40 hover:text-white/70 transition-colors">Settings</Link>
            <span className="text-white/25">/</span>
            <span className="text-[#A098F8] truncate">{path}</span>
          </div>
          <h1 className="text-2xl font-bold text-white md:text-3xl">Settings — {path.replace(/-/g, " ")}</h1>
          <p className="max-w-2xl text-sm text-white/65">
            This section is under construction.
          </p>
        </div>
      </header>

      <section className="rounded-2xl border border-white/10 bg-[#13162A]/70 p-8 text-center">
        <div className="mx-auto max-w-sm space-y-4">
          <div className="flex justify-center">
            <div className="rounded-full bg-white/5 border border-white/10 p-4">
              <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8 text-white/50">
                <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" stroke="currentColor" strokeWidth="1.6" />
              </svg>
            </div>
          </div>
          <p className="text-white/75">Section under construction</p>
          <Link
            href="/dmo/settings"
            className="inline-block rounded-xl border border-[#7B6EF6]/40 bg-[#7B6EF6]/12 px-4 py-2 text-[11px] font-semibold text-[#7B6EF6] transition-colors hover:border-[#7B6EF6]/70 hover:bg-[#7B6EF6]/20"
          >
            Back to Settings
          </Link>
        </div>
      </section>
    </div>
  );
}
