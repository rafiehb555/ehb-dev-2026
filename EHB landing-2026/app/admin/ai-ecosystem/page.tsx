import Link from "next/link";
import { UniversalStructuredAdminBlocks } from "@/components/admin/UniversalStructuredAdminBlocks";

export default function AdminAiEcosystemPage() {
  return (
    <main className="min-h-screen text-white">
      <div className="container-ehb py-6 sm:py-8 space-y-5 sm:space-y-6 text-[10px] xs:text-[11px]">
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="space-y-1">
            <p className="text-[11px] uppercase tracking-[0.2em] text-ehb-textMuted">Admin Â· AI Ecosystem</p>
            <h1 className="text-lg sm:text-xl font-semibold leading-tight gradient-text">ML, Fraud & NLP Controls</h1>
            <p className="text-ehb-textBody max-w-2xl">
              Configure AI rules for verified outcomes. Keep fraud checks and compliance summaries consistent with STL trust layers.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/admin"
              className="min-h-touch inline-flex items-center justify-center rounded-full glass-panel px-3 py-1.5 font-semibold text-white hover:shadow-neon-blue transition-all duration-200"
            >
              â† Back to Super Admin
            </Link>
            <Link
              href="/ai-ecosystem"
              className="min-h-touch inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#33C3FF] to-[#6366f1] px-3 py-1.5 font-semibold text-slate-950 btn-glow"
            >
              Open AI Ecosystem
            </Link>
          </div>
        </header>

        <UniversalStructuredAdminBlocks />

        <section className="glass-panel card-hover p-4 space-y-3 border border-white/5">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <p className="text-[11px] uppercase tracking-[0.22em] text-ehb-textMuted">AI Admin Links</p>
              <h2 className="text-lg font-semibold text-white">Phases 81â€“85</h2>
              <p className="text-ehb-textBody text-[10px]">
                Fraud detection, analytics, location insights, automation and data pipeline. (UI links)
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { href: "/admin/fraud", title: "Phase 81", subtitle: "Fraud Detection" },
              { href: "/admin/ai-analytics", title: "Phase 82", subtitle: "Business Analytics" },
              { href: "/admin/location-insights", title: "Phase 83", subtitle: "Location Intelligence" },
              { href: "/admin/ai-automation", title: "Phase 84", subtitle: "AI Automation" },
              { href: "/admin/ai-data-pipeline", title: "Phase 85", subtitle: "Data Pipeline" },
            ].map((p) => (
              <Link
                key={p.href}
                href={p.href}
                className="rounded-2xl glass-card card-hover border px-3 py-3 flex flex-col min-h-[92px] justify-between"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-semibold text-white">{p.title}</span>
                  <span aria-hidden className="text-[13px]">
                    â†—
                  </span>
                </div>
                <div className="text-[10px] text-ehb-textMuted mt-2 leading-relaxed">{p.subtitle}</div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

