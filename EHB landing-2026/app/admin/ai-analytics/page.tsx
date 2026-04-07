import Link from "next/link";
import { BusinessAnalyticsAdminPanel } from "@/components/ai/BusinessAnalyticsAdminPanel";
import { UniversalStructuredAdminBlocks } from "@/components/admin/UniversalStructuredAdminBlocks";

export default function AdminAiAnalyticsPage() {
  return (
    <main className="min-h-screen text-slate-100">
      <div className="container-ehb py-6 sm:py-8 space-y-5 sm:space-y-6 text-[10px] xs:text-[11px]">
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="space-y-1">
            <p className="text-[11px] uppercase tracking-[0.2em] text-ehb-textMuted">Admin · Phase 82</p>
            <h1 className="text-lg sm:text-xl font-semibold leading-tight gradient-text">AI Business Analytics</h1>
            <p className="text-ehb-textBody max-w-2xl">
              Auto-generated reports for franchise, providers and platform. (UI mock)
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/admin"
              className="min-h-touch inline-flex items-center justify-center rounded-full glass-panel px-3 py-1.5 font-semibold text-white hover:shadow-neon-blue transition-all duration-200"
            >
              ← Back to Super Admin
            </Link>
          </div>
        </header>

        <BusinessAnalyticsAdminPanel />

        <div className="pt-6">
          <UniversalStructuredAdminBlocks />
        </div>
      </div>
    </main>
  );
}

