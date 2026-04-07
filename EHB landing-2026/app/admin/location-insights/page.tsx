import Link from "next/link";
import { UniversalStructuredAdminBlocks } from "@/components/admin/UniversalStructuredAdminBlocks";
import { LocationIntelligenceAdminPanel } from "@/components/ai/LocationIntelligenceAdminPanel";

export default function AdminLocationInsightsPage() {
  return (
    <main className="min-h-screen text-white">
      <div className="container-ehb py-6 sm:py-8 space-y-5 sm:space-y-6 text-[10px] xs:text-[11px]">
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="space-y-1">
            <p className="text-[11px] uppercase tracking-[0.2em] text-ehb-textMuted">Admin Â· Phase 83</p>
            <h1 className="text-lg sm:text-xl font-semibold leading-tight gradient-text">Location Intelligence AI</h1>
            <p className="text-ehb-textBody max-w-2xl">
              City/region demand insights and trust-adjusted gaps. (UI mock)
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/admin"
              className="min-h-touch inline-flex items-center justify-center rounded-full glass-panel px-3 py-1.5 font-semibold text-white hover:shadow-neon-blue transition-all duration-200"
            >
              â† Back to Super Admin
            </Link>
          </div>
        </header>

        <LocationIntelligenceAdminPanel />

        <div className="pt-6">
          <UniversalStructuredAdminBlocks />
        </div>
      </div>
    </main>
  );
}

