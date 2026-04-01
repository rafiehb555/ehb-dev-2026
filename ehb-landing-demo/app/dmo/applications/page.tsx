import Link from "next/link";
import { DmoApplicationsBoard } from "@/components/dmo/DmoApplicationsBoard";
import { DmoTopNav } from "@/components/dmo/DmoTopNav";
import { UniversalStructuredAdminBlocks } from "@/components/admin/UniversalStructuredAdminBlocks";

export default function DmoApplicationsPage({
  searchParams,
}: {
  searchParams?: { country?: string; state?: string; city?: string; industry?: string; createdId?: string };
}) {
  return (
    <main className="min-h-screen text-slate-100">
      <div className="container-ehb py-6 sm:py-8 space-y-5 sm:space-y-6 text-[10px] xs:text-[11px]">
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="space-y-1">
            <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">DMO · Applications</p>
            <h1 className="text-lg sm:text-xl font-semibold leading-tight gradient-text">
              Applications & Approvals (Workflow Engine)
            </h1>
            <p className="text-slate-300 max-w-2xl">
              Demo queue: New → In Review → Inspection → Approved/Rejected. Use location query for “near you” view.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/dmo"
              className="min-h-touch inline-flex items-center justify-center rounded-full glass-panel px-3 py-1.5 font-semibold text-white hover:shadow-neon-blue transition-all duration-200"
            >
              ← Back to DMO
            </Link>
          </div>
        </header>

        <DmoTopNav />

        <DmoApplicationsBoard
          initialCountryCode={searchParams?.country}
          initialStateCode={searchParams?.state}
          initialCityCode={searchParams?.city}
          initialIndustrySlug={searchParams?.industry}
          createdId={searchParams?.createdId}
        />

        <div className="pt-6">
          <UniversalStructuredAdminBlocks />
        </div>
      </div>
    </main>
  );
}

