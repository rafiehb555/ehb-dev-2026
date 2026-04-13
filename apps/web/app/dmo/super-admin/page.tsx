"use client";

import Link from "next/link";
import { DmoTopNav } from "@/components/dmo/DmoTopNav";
import { DmoSuperAdminPanel } from "@/components/dmo/DmoSuperAdminPanel";
import { UniversalStructuredAdminBlocks } from "@/components/admin/UniversalStructuredAdminBlocks";

export default function DmoSuperAdminPage() {
  return (
    <main className="min-h-screen text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-5 sm:space-y-6 text-[10px] xs:text-[11px]">
        <header className="space-y-1">
          <p className="text-[11px] uppercase tracking-[0.2em] text-white/50">DMO · Super Admin</p>
          <h1 className="text-lg sm:text-xl font-semibold leading-tight text-white">Global DMO Operations</h1>
          <p className="text-white/70 max-w-2xl">
            EHB head office controls queue routing, STL policy, approval consistency, and cross-region governance operations.
          </p>
        </header>

        <DmoTopNav />

        <DmoSuperAdminPanel />

        <section className="pt-6">
          <UniversalStructuredAdminBlocks />
        </section>

        <div className="pt-6 flex flex-wrap gap-2">
          <Link
            href="/dmo/applications"
            className="rounded-xl border border-[#7B6EF6]/50 bg-[#7B6EF6]/15 px-4 py-2 text-[11px] font-semibold text-[#A098F8] transition-colors hover:bg-[#7B6EF6]/25 hover:text-white"
          >
            Open Applications Board
          </Link>
        </div>
      </div>
    </main>
  );
}

