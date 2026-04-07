import Link from "next/link";
import { TrustBadgeLegend } from "@/components/TrustBadgeLegend";
import { STLLevelsAndSecurity } from "@/components/STLLevelsAndSecurity";
import { AIToolsSection } from "@/components/AIToolsSection";

export function DigitalGovernanceLanding() {
  return (
    <main className="min-h-screen text-slate-100">
      <div className="container-ehb py-8 space-y-6">
        <section className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full border glass-panel px-3 py-1.5 text-[11px] text-slate-200 border-white/10">
            <span aria-hidden>🏛️</span>
            <span className="text-ehb-textMuted">Phase 5</span>
            <span className="text-white font-semibold">Digital Governance</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-semibold leading-tight gradient-text">
            Applications, Licenses & Compliance
          </h1>
          <p className="text-ehb-textMuted max-w-2xl">
            Structured governance for verification approvals, licenses registry and compliance notifications — with
            trust meanings always visible.
          </p>
        </section>

        <section
          className="rounded-3xl glass-panel border border-white/10 p-5 md:p-6 overflow-hidden relative"
          style={{ boxShadow: "0 0 30px rgba(0,234,255,0.10)" }}
        >
          <div className="absolute inset-0 pointer-events-none opacity-[0.06]" aria-hidden
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.9) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.9) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />

          <div className="relative grid gap-6 lg:grid-cols-12 items-start">
            <div className="lg:col-span-7 space-y-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.22em] text-ehb-textMuted mb-2">
                  Applications & approvals (Workflow Engine)
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    { title: "New", accent: "rgba(0,234,255,0.35)", desc: "Submitted documents and requests." },
                    { title: "In Review", accent: "rgba(59,130,246,0.35)", desc: "Officer checks and verification tasks." },
                    { title: "Inspection", accent: "rgba(245,158,11,0.35)", desc: "On-site / CRB inspection steps." },
                    { title: "Approved", accent: "rgba(34,197,94,0.35)", desc: "License issued + registry updated." },
                    { title: "Rejected", accent: "rgba(239,68,68,0.35)", desc: "Feedback + re-application guidance." },
                  ].map((col) => (
                    <div
                      key={col.title}
                      className="rounded-2xl glass-card border p-4 card-hover"
                      style={{ borderColor: `${col.accent}`, boxShadow: `0 0 26px ${col.accent}` }}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <p className="text-sm font-semibold text-white">{col.title}</p>
                        <span className="text-[10px] text-ehb-textMuted">demo</span>
                      </div>
                      <p className="text-[12px] text-ehb-textBody mt-2 leading-relaxed">{col.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-[11px] uppercase tracking-[0.22em] text-ehb-textMuted mb-2">
                  License registry (Certificates & Registry)
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    "Provider license issuance",
                    "Franchise license tracking",
                    "Certificate registry & renewals",
                    "Compliance status audit trail",
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-2 text-ehb-textBody">
                      <span aria-hidden className="mt-[2px]">
                        ✅
                      </span>
                      <span className="text-sm leading-relaxed">{item}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-3 pt-3">
                  <Link
                    href="/admin/development"
                    className="min-h-touch inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#00eaff] to-[#3b82f6] px-5 py-2.5 text-sm font-semibold text-slate-950 btn-glow hover:opacity-95 transition-all"
                  >
                    Open approvals board
                    <span className="text-xs ml-2" aria-hidden>
                      →
                    </span>
                  </Link>
                  <Link
                    href="/ai-marketplace"
                    className="min-h-touch inline-flex items-center justify-center rounded-full border border-white/25 bg-white/5 px-5 py-2.5 text-sm font-semibold text-slate-200 hover:bg-white/10 transition-all"
                  >
                    Use AI for compliance
                  </Link>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-4">
              <div className="glass-card rounded-2xl border p-4" style={{ borderColor: "rgba(0,174,239,0.35)" }}>
                <p className="text-[11px] uppercase tracking-[0.22em] text-ehb-textMuted mb-2">
                  Trust stack meaning (always visible)
                </p>
                <div className="space-y-2">
                  {[
                    "🛡️ PSS Verified → Identity & document verified",
                    "🏛️ CRB Certified → Business/company verified",
                    "⭐ STL Level → Trust score level",
                    "🌐 DMO Registered → Marketplace officially registered",
                  ].map((t) => (
                    <p key={t} className="text-[12px] text-ehb-textBody leading-relaxed">
                      {t}
                    </p>
                  ))}
                </div>
              </div>

              <div className="glass-card rounded-2xl border p-4" style={{ borderColor: "rgba(34,197,94,0.25)" }}>
                <p className="text-[11px] uppercase tracking-[0.22em] text-ehb-textMuted mb-2">
                  Compliance notifications (demo)
                </p>
                <div className="space-y-2">
                  {[
                    "• New document uploaded — verification queued.",
                    "• STL score updated — secure record stored.",
                    "• License registry entry renewed — refilling count increments.",
                  ].map((n) => (
                    <p key={n} className="text-[12px] text-ehb-textBody leading-relaxed">
                      {n}
                    </p>
                  ))}
                </div>
              </div>

              <div className="glass-card rounded-2xl border p-4" style={{ borderColor: "rgba(139,92,246,0.25)" }}>
                <p className="text-[11px] uppercase tracking-[0.22em] text-ehb-textMuted mb-2">
                  AI tools for governance
                </p>
                <p className="text-[12px] text-ehb-textBody leading-relaxed">
                  Use AI to reduce mistakes in documents, detect inconsistencies, and match the right compliance workflow.
                </p>
              </div>
            </div>
          </div>
        </section>

        <TrustBadgeLegend />
        <STLLevelsAndSecurity />
        <AIToolsSection />
      </div>
    </main>
  );
}

