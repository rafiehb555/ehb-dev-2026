"use client";

import Link from "next/link";
import { DmoApplicationsBoard } from "@/components/dmo/DmoApplicationsBoard";
import { UniversalStructuredAdminBlocks } from "@/components/admin/UniversalStructuredAdminBlocks";

export default function DmoApplicationsPage({
  searchParams,
}: {
  searchParams?: { country?: string; state?: string; city?: string; industry?: string; createdId?: string };
}) {
  return (
    <div className="space-y-6">
      <header className="relative overflow-hidden rounded-2xl border border-[#2BBFA0]/25 bg-gradient-to-br from-[#13162A] via-[#1A1D33] to-[#13162A] p-6 pt-[22px]">
        <div
          className="pointer-events-none absolute left-0 right-0 top-0 h-[3px]"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, #2BBFA0 20%, #7B6EF6 50%, #F0A030 80%, transparent 100%)",
          }}
        />
        <div className="pointer-events-none absolute left-3 top-3 h-6 w-6 border-l-[1.5px] border-t-[1.5px] border-[#2BBFA0]/50" />
        <div className="pointer-events-none absolute bottom-3 right-3 h-6 w-6 border-b-[1.5px] border-r-[1.5px] border-[#7B6EF6]/45" />
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-gradient-to-br from-[#2BBFA0]/22 via-[#7B6EF6]/12 to-transparent blur-3xl" />
        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 space-y-2">
            <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.22em]">
              <Link href="/dmo" className="text-white/40 hover:text-white/70 transition-colors">DMO</Link>
              <span className="text-white/25">/</span>
              <span className="text-[#2BBFA0]">Applications</span>
            </div>
            <h1 className="text-2xl font-bold text-white md:text-3xl">Applications & Approvals</h1>
            <p className="max-w-2xl text-sm text-white/65">
              Unified workflow engine: <span className="text-white/90">New → In Review → Inspection → Approved / Rejected</span>.
              Location query (country / state / city / industry) se &ldquo;near you&rdquo; view mil jata hai.
            </p>
          </div>
          <Link
            href="/dmo/crb"
            className="rounded-xl border border-cyan-400/50 bg-cyan-400/15 px-3 py-1.5 text-xs font-semibold text-cyan-100 transition-colors hover:border-cyan-300/80 hover:bg-cyan-400/25 hover:text-white"
          >
            CRB view
          </Link>
        </div>
      </header>

      <DmoApplicationsBoard
        initialCountryCode={searchParams?.country}
        initialStateCode={searchParams?.state}
        initialCityCode={searchParams?.city}
        initialIndustrySlug={searchParams?.industry}
        createdId={searchParams?.createdId}
      />

      <div className="pt-2">
        <UniversalStructuredAdminBlocks />
      </div>
    </div>
  );
}

