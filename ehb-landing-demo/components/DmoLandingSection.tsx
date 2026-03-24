"use client";

import Link from "next/link";

const coreSystems = [
  {
    icon: "🧠",
    title: "PSS – Proof & Security",
    lines: ["Identity verification", "AML and risk detection"],
    tone: "from-cyan-500/20 to-sky-500/10 border-cyan-400/30",
  },
  {
    icon: "🏛",
    title: "CRB – Certification Board",
    lines: ["Skill and business certification", "Inspection and compliance workflow"],
    tone: "from-violet-500/20 to-indigo-500/10 border-violet-400/30",
  },
  {
    icon: "📊",
    title: "STL – Trust Engine",
    lines: ["AI-driven trust scoring", "Marketplace ranking intelligence"],
    tone: "from-emerald-500/20 to-teal-500/10 border-emerald-400/30",
  },
  {
    icon: "🏢",
    title: "Franchise Network",
    lines: ["Physical inspections", "Ground-level verification"],
    tone: "from-amber-500/20 to-orange-500/10 border-amber-400/30",
  },
  {
    icon: "🌐",
    title: "Industry Verification",
    lines: ["Multi-industry trust mapping", "32-sector verification model"],
    tone: "from-rose-500/20 to-pink-500/10 border-rose-400/30",
  },
];

const flow = [
  "User or company registers",
  "PSS verifies identity and compliance",
  "CRB certifies service or product quality",
  "Franchise performs physical inspection",
  "DMO reviews and records final decision",
  "STL assigns live trust score",
];

export function DmoLandingSection() {
  return (
    <section className="container-ultra section-pad-ultra space-y-8">
      <div className="rounded-3xl border border-cyan-400/20 bg-gradient-to-b from-[#031222]/95 to-[#020b18]/95 p-6 md:p-10">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7 space-y-4">
            <p className="text-[11px] uppercase tracking-[0.22em] text-cyan-300">DMO Governance Layer</p>
            <h2 className="text-2xl md:text-4xl font-semibold leading-tight text-white">
              DMO – Decentralized Management Office
            </h2>
            <p className="text-slate-300 text-sm md:text-base">
              Core operating system powering verification, trust, governance, and global control.
            </p>
            <p className="text-slate-400 text-sm">
              DMO connects PSS, CRB, STL, Franchise Network, and Industry Verification into one intelligent command layer.
            </p>
            <div className="flex flex-wrap gap-3 pt-1">
              <Link
                href="/dmo/home"
                className="inline-flex items-center rounded-full bg-gradient-to-r from-[#00eaff] to-[#3b82f6] px-5 py-2.5 text-sm font-semibold text-slate-950 btn-glow"
              >
                Explore DMO
              </Link>
              <Link
                href="/dmo"
                className="inline-flex items-center rounded-full border border-white/20 bg-white/5 px-5 py-2.5 text-sm font-semibold text-slate-100 hover:bg-white/10 transition-colors"
              >
                View Dashboard
              </Link>
            </div>
          </div>
          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 md:p-5">
              <p className="text-xs text-slate-300 mb-3">Live Governance Signals</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-emerald-400/30 bg-emerald-500/10 p-3">
                  <div className="text-[11px] text-emerald-100">System</div>
                  <div className="text-sm font-semibold text-white">Healthy</div>
                </div>
                <div className="rounded-xl border border-cyan-400/30 bg-cyan-500/10 p-3">
                  <div className="text-[11px] text-cyan-100">Trust Model</div>
                  <div className="text-sm font-semibold text-white">Active</div>
                </div>
                <div className="rounded-xl border border-violet-400/30 bg-violet-500/10 p-3">
                  <div className="text-[11px] text-violet-100">Verification</div>
                  <div className="text-sm font-semibold text-white">Continuous</div>
                </div>
                <div className="rounded-xl border border-amber-400/30 bg-amber-500/10 p-3">
                  <div className="text-[11px] text-amber-100">Governance</div>
                  <div className="text-sm font-semibold text-white">Global-ready</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">Core Systems</p>
        <h3 className="text-2xl md:text-3xl font-semibold text-white">The trust stack that powers DMO</h3>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {coreSystems.map((c) => (
            <div key={c.title} className={`rounded-2xl border bg-gradient-to-b p-4 ${c.tone}`}>
              <div className="text-lg">{c.icon}</div>
              <h4 className="text-sm font-semibold text-white mt-2">{c.title}</h4>
              <ul className="mt-2 space-y-1 text-xs text-slate-300">
                {c.lines.map((l) => (
                  <li key={l}>• {l}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/5 p-5 md:p-7">
        <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">How DMO Works</p>
        <h3 className="text-xl md:text-2xl font-semibold text-white mt-1">End-to-end trust decision flow</h3>
        <div className="mt-5 grid gap-3 md:grid-cols-6">
          {flow.map((step, idx) => (
            <div key={step} className="rounded-xl border border-white/10 bg-[#020c1b]/70 p-3">
              <div className="text-[11px] font-semibold text-cyan-300">Step {idx + 1}</div>
              <div className="text-xs text-slate-300 mt-1">{step}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-emerald-400/30 bg-emerald-500/10 p-5">
          <p className="text-[11px] uppercase tracking-[0.2em] text-emerald-100">Trust System</p>
          <h4 className="text-lg font-semibold text-white mt-1">Verified everything model</h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-100">
            <li>✔ Verified Identity</li>
            <li>✔ Verified Business</li>
            <li>✔ Verified Product</li>
            <li>✔ Verified Performance</li>
          </ul>
          <div className="mt-4 rounded-xl border border-emerald-300/30 bg-[#021713]/60 p-3 text-xs text-emerald-100">
            STL trust score updates instantly as approvals, inspections, and refill events happen.
          </div>
        </div>

        <div className="rounded-2xl border border-amber-400/30 bg-amber-500/10 p-5">
          <p className="text-[11px] uppercase tracking-[0.2em] text-amber-100">Continuous Verification</p>
          <h4 className="text-lg font-semibold text-white mt-1">Refilling system keeps trust fresh</h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-100">
            <li>⏳ Six-month verification cycle</li>
            <li>🔄 Mandatory renewal workflow</li>
            <li>⚠ Expiry triggers trust downgrade</li>
          </ul>
          <div className="mt-4 rounded-xl border border-amber-300/30 bg-[#1a1303]/60 p-3 text-xs text-amber-100">
            DMO automatically flags renewals and routes them to review queues before trust expiration.
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-violet-400/25 bg-gradient-to-b from-violet-500/10 to-[#020b18]/90 p-6 md:p-8">
        <p className="text-[11px] uppercase tracking-[0.22em] text-violet-200">Global Control Vision</p>
        <h3 className="text-xl md:text-2xl font-semibold text-white mt-1">
          DMO is not just a dashboard — it is a global governance system
        </h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-slate-200">Multi-country support</div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-slate-200">Franchise-driven physical verification</div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-slate-200">Blockchain-ready trust infrastructure</div>
        </div>
      </div>

      <div className="rounded-2xl border border-cyan-400/20 bg-[#020c1b]/80 p-6 text-center">
        <h3 className="text-xl md:text-2xl font-semibold text-white">Enter the EHB Trust Operating System</h3>
        <p className="text-slate-300 text-sm mt-2 max-w-2xl mx-auto">
          Join the ecosystem where digital verification, physical inspection, and AI governance work together in one platform.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <Link
            href="/dashboard"
            className="inline-flex items-center rounded-full bg-gradient-to-r from-[#00eaff] to-[#3b82f6] px-5 py-2.5 text-sm font-semibold text-slate-950 btn-glow"
          >
            Join EHB System
          </Link>
          <Link
            href="/dmo"
            className="inline-flex items-center rounded-full border border-white/20 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
          >
            Open DMO
          </Link>
        </div>
      </div>
    </section>
  );
}

