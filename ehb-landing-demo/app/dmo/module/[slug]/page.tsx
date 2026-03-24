"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

const moduleMap: Record<string, { title: string; targetPath: string; description: string }> = {
  crb: {
    title: "CRB Module",
    targetPath: "/certification",
    description: "Certification and registry workflows inside persistent DMO shell.",
  },
  industry: {
    title: "Industry Module",
    targetPath: "/dmo/industry",
    description: "Industry verification engine in persistent DMO navigation.",
  },
  franchise: {
    title: "Franchise Module",
    targetPath: "/franchise",
    description: "Franchise operations and task views inside DMO shell.",
  },
  inspections: {
    title: "Inspections Module",
    targetPath: "/franchise/inspections",
    description: "Ground inspection tasks and reports with persistent sidebar.",
  },
  stl: {
    title: "STL Engine",
    targetPath: "/dmo/stl",
    description: "Trust score engine view embedded under DMO shell.",
  },
  insights: {
    title: "AI Insights",
    targetPath: "/dmo/automation",
    description: "AI automation and decision control workspace under DMO shell.",
  },
  registry: {
    title: "Registry",
    targetPath: "/dmo/home",
    description: "Registry and governance entry point under DMO shell.",
  },
  wallet: {
    title: "Wallet",
    targetPath: "/dashboard",
    description: "Wallet and earnings dashboard under DMO shell.",
  },
  notifications: {
    title: "Notifications",
    targetPath: "/dmo/notifications",
    description: "System notifications panel under DMO shell.",
  },
  settings: {
    title: "Settings",
    targetPath: "/admin",
    description: "Admin settings panel under DMO shell.",
  },
  jps: {
    title: "JPS Module",
    targetPath: "/dashboard",
    description: "Job Profile & Skill workspace under DMO shell.",
  },
  refilling: {
    title: "Refilling Module",
    targetPath: "/dmo/refilling",
    description: "Verification renewal operations under DMO shell.",
  },
  affiliate: {
    title: "Affiliate Module",
    targetPath: "/dmo/affiliate",
    description: "Referral growth and earnings module under DMO shell.",
  },
  penalty: {
    title: "Penalty Module",
    targetPath: "/dmo/penalty",
    description: "Compliance penalties and appeals module under DMO shell.",
  },
  automation: {
    title: "AI Automation Panel",
    targetPath: "/dmo/automation",
    description: "System brain for automation rules, triggers, and auto decisions.",
  },
};

export default function DmoModulePage() {
  const params = useParams<{ slug: string }>();
  const slug = String(params?.slug ?? "");
  const moduleDef = moduleMap[slug];

  return (
    <main className="min-h-screen text-slate-100">
      <div className="container-ehb py-6">
        <div className="space-y-4">
          <section className="space-y-4">
            {!moduleDef ? (
              <div className="ehb-card-elevated">
                <div className="text-sm font-semibold text-rose-200">Module not found</div>
                <div className="text-xs text-slate-400 mt-1">The selected module is not configured in DMO shell.</div>
              </div>
            ) : (
              <>
                <section className="rounded-2xl border border-cyan-400/20 bg-gradient-to-b from-[#031222]/95 to-[#020b18]/95 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <div className="text-[11px] uppercase tracking-[0.18em] text-cyan-300">DMO Module View</div>
                      <h1 className="text-lg font-semibold text-white">{moduleDef.title}</h1>
                      <p className="text-xs text-slate-300 mt-1">{moduleDef.description}</p>
                    </div>
                    <Link href={moduleDef.targetPath} className="ehb-btn-secondary ehb-press">
                      Open Full Page
                    </Link>
                  </div>
                </section>

                <div className="rounded-2xl overflow-hidden border border-white/10 bg-[#020c1b]/90">
                  <iframe
                    src={moduleDef.targetPath}
                    className="w-full min-h-[calc(100vh-220px)] bg-transparent"
                    title={`${moduleDef.title} frame`}
                  />
                </div>
              </>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

