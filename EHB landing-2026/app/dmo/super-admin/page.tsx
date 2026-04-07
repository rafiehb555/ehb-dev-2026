import Link from "next/link";
import { DmoTopNav } from "@/components/dmo/DmoTopNav";
import { DmoSuperAdminPanel } from "@/components/dmo/DmoSuperAdminPanel";
import { UniversalStructuredAdminBlocks } from "@/components/admin/UniversalStructuredAdminBlocks";

export default function DmoSuperAdminPage() {
  return (
    <main className="min-h-screen text-white">
      <div className="container-ehb py-6 sm:py-8 space-y-5 sm:space-y-6 text-[10px] xs:text-[11px]">
        <header className="space-y-1">
          <p className="text-[11px] uppercase tracking-[0.2em] text-ehb-textMuted">DMO · Super Admin</p>
          <h1 className="text-lg sm:text-xl font-semibold leading-tight gradient-text">Global DMO Operations</h1>
          <p className="text-ehb-textBody max-w-2xl">
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
            className="min-h-touch inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#00eaff] to-[#3b82f6] px-4 py-2 text-[11px] font-semibold text-slate-950 btn-glow hover:opacity-95 transition-all"
          >
            Open Applications Board
          </Link>
        </div>
      </div>
    </main>
  );
}

