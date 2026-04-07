import Link from "next/link";
import { FraudDetectionAdminPanel } from "@/components/ai/FraudDetectionAdminPanel";
import { UniversalStructuredAdminBlocks } from "@/components/admin/UniversalStructuredAdminBlocks";

export default function AdminFraudPage() {
  return (
    <main className="min-h-screen text-white">
      <div className="container-ehb py-6 sm:py-8 space-y-5 sm:space-y-6 text-[10px] xs:text-[11px]">
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="space-y-1">
            <p className="text-[11px] uppercase tracking-[0.2em] text-ehb-textMuted">Admin Â· Phase 81</p>
            <h1 className="text-lg sm:text-xl font-semibold leading-tight gradient-text">Fraud Detection AI</h1>
            <p className="text-ehb-textBody max-w-2xl">
              Fake providers/orders/listings detect + admin fraud flags (UI mock). Risk scores align with STL trust layers.
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

        <FraudDetectionAdminPanel />

        <div className="pt-6">
          <UniversalStructuredAdminBlocks />
        </div>
      </div>
    </main>
  );
}

