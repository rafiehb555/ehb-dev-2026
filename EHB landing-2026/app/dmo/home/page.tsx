"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const coreDepartments = [
  {
    icon: "🧠",
    title: "PSS – Proof & Security System",
    desc: "KYC/KYB identity verification, AML, and fraud risk analysis.",
    href: "/dmo/pss",
    cta: "Open PSS Control",
    tone: "from-cyan-500/20 to-sky-500/10 border-cyan-400/30",
  },
  {
    icon: "🏛",
    title: "CRB – Certification Board",
    desc: "Certification lifecycle, inspection workflows, and compliance decisions.",
    href: "/dmo/crb",
    cta: "Open CRB",
    tone: "from-violet-500/20 to-indigo-500/10 border-violet-400/30",
  },
  {
    icon: "📊",
    title: "STL – Trust Engine",
    desc: "Trust score intelligence, ranking logic, and score-impact visibility.",
    href: "/dmo/stl",
    cta: "Open STL View",
    tone: "from-emerald-500/20 to-teal-500/10 border-emerald-400/30",
  },
  {
    icon: "🏢",
    title: "Franchise System",
    desc: "Ground inspections, escalation control, and regional operations.",
    href: "/franchise/inspections",
    cta: "Open Franchise Ops",
    tone: "from-amber-500/20 to-orange-500/10 border-amber-400/30",
  },
  {
    icon: "🌐",
    title: "Industry Engine",
    desc: "32-sector verification mapping and multi-industry trust controls.",
    href: "/dmo/industry",
    cta: "Open Industry Engine",
    tone: "from-rose-500/20 to-pink-500/10 border-rose-400/30",
  },
  {
    icon: "🤖",
    title: "AI Marketplace",
    desc: "Smart search, ranked matching, and trust-powered discovery.",
    href: "/marketplace",
    cta: "Open AI Marketplace",
    tone: "from-fuchsia-500/20 to-cyan-500/10 border-fuchsia-400/30",
  },
];

const supportSystems = [
  { icon: "💰", title: "Wallet System", desc: "Escrow, payouts, and financial traceability.", href: "/dashboard" },
  { icon: "📂", title: "Registry System", desc: "Verified records and governance registry outputs.", href: "/dmo" },
  { icon: "📢", title: "Notifications", desc: "Decision alerts, SLA warnings, and risk notifications.", href: "/dashboard" },
  { icon: "⚙️", title: "Settings", desc: "Control role rules, defaults, and operational preferences.", href: "/admin" },
  { icon: "📊", title: "Reports", desc: "Operational analytics and trust-performance summaries.", href: "/development" },
];

const quickActions = [
  { label: "New Application", href: "/dmo/crb", tone: "primary" as const },
  { label: "Open DMO Dashboard", href: "/dmo", tone: "secondary" as const },
  { label: "View High Risk", href: "/dmo", tone: "danger" as const },
  { label: "Check Refilling", href: "/dashboard", tone: "secondary" as const },
];

function Card({
  children,
  tone,
}: {
  children: React.ReactNode;
  tone?: string;
}) {
  return <div className={`rounded-2xl border bg-gradient-to-b p-4 ${tone ?? "border-white/10 from-white/5 to-[#020c1b]/80"}`}>{children}</div>;
}

export default function DmoHomePage() {
  return (
    <main className="min-h-screen text-white">
      <div className="container-ehb py-8 space-y-6">
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="rounded-3xl border border-cyan-400/20 bg-gradient-to-b from-[#031222]/95 to-[#020b18]/95 p-5 md:p-7"
        >
          <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-cyan-300">DMO Entry Layer</p>
              <h1 className="text-2xl md:text-3xl font-semibold leading-tight gradient-text mt-1">DMO System Hub</h1>
              <p className="text-ehb-textBody text-sm mt-2 max-w-2xl">
                Manage verification, certification, trust, and global operations from one place.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link href="/dmo" className="rounded-full bg-gradient-to-r from-[#00eaff] to-[#3b82f6] px-4 py-2 text-xs font-semibold text-slate-950 btn-glow">
                Open Dashboard
              </Link>
              <Link href="/home" className="rounded-full glass-panel border border-white/15 px-4 py-2 text-xs font-semibold text-ehb-textBody hover:bg-white/5">
                Back to EHB Home
              </Link>
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
            <div className="flex items-center gap-2 text-sm text-ehb-textMuted">
              <span aria-hidden>🔎</span>
              <span>Search systems, departments, actions...</span>
            </div>
          </div>
        </motion.section>

        <section className="space-y-3">
          <p className="text-[11px] uppercase tracking-[0.22em] text-ehb-textMuted">Core Departments</p>
          <h2 className="text-xl md:text-2xl font-semibold text-white">Main DMO operational systems</h2>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {coreDepartments.map((d, idx) => (
              <motion.div
                key={d.title}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.2, delay: idx * 0.03 }}
              >
                <Card tone={d.tone}>
                  <div className="text-lg">{d.icon}</div>
                  <h3 className="text-sm font-semibold text-white mt-2">{d.title}</h3>
                  <p className="text-xs text-ehb-textBody mt-1">{d.desc}</p>
                  <Link
                    href={d.href}
                    className="mt-3 inline-flex items-center rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/10 transition-colors"
                  >
                    {d.cta}
                  </Link>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <p className="text-[11px] uppercase tracking-[0.22em] text-ehb-textMuted">Support Systems</p>
          <h2 className="text-xl md:text-2xl font-semibold text-white">Operational backbone modules</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {supportSystems.map((s) => (
              <Card key={s.title}>
                <div className="text-lg">{s.icon}</div>
                <h3 className="text-sm font-semibold text-white mt-2">{s.title}</h3>
                <p className="text-xs text-ehb-textBody mt-1">{s.desc}</p>
                <Link href={s.href} className="mt-3 inline-flex text-xs font-semibold text-cyan-200 hover:text-cyan-100">
                  Open →
                </Link>
              </Card>
            ))}
          </div>
        </section>

        <div className="grid gap-4 lg:grid-cols-3">
          <Card>
            <p className="text-[11px] uppercase tracking-[0.2em] text-ehb-textMuted">Live System Status</p>
            <div className="mt-3 space-y-2">
              <div className="rounded-xl border border-cyan-400/30 bg-cyan-500/10 p-3">
                <div className="text-[11px] text-cyan-100">Active Verifications</div>
                <div className="text-xl font-semibold text-white">128</div>
              </div>
              <div className="rounded-xl border border-amber-400/30 bg-amber-500/10 p-3">
                <div className="text-[11px] text-amber-100">Pending Approvals</div>
                <div className="text-xl font-semibold text-white">34</div>
              </div>
              <div className="rounded-xl border border-emerald-400/30 bg-emerald-500/10 p-3">
                <div className="text-[11px] text-emerald-100">System Health</div>
                <div className="text-xl font-semibold text-white">Healthy</div>
              </div>
              <div className="rounded-xl border border-rose-400/30 bg-rose-500/10 p-3">
                <div className="text-[11px] text-rose-100">Alerts</div>
                <div className="text-xl font-semibold text-white">2 Critical</div>
              </div>
            </div>
          </Card>

          <Card>
            <p className="text-[11px] uppercase tracking-[0.2em] text-ehb-textMuted">Quick Actions</p>
            <div className="mt-3 grid gap-2">
              {quickActions.map((a) => (
                <Link
                  key={a.label}
                  href={a.href}
                  className={[
                    "rounded-full px-4 py-2 text-xs font-semibold text-center transition-all",
                    a.tone === "primary"
                      ? "bg-gradient-to-r from-[#00eaff] to-[#3b82f6] text-slate-950 btn-glow"
                      : a.tone === "danger"
                        ? "bg-gradient-to-r from-rose-400 to-rose-500 text-slate-950"
                        : "glass-panel border border-white/15 text-ehb-textBody hover:bg-white/5",
                  ].join(" ")}
                >
                  {a.label}
                </Link>
              ))}
            </div>
          </Card>

          <Card>
            <p className="text-[11px] uppercase tracking-[0.2em] text-ehb-textMuted">AI Insights</p>
            <div className="mt-3 space-y-2">
              <div className="rounded-xl border border-cyan-400/25 bg-cyan-500/10 p-3 text-xs text-cyan-100">
                • 5 approvals pending in core queue
              </div>
              <div className="rounded-xl border border-rose-400/25 bg-rose-500/10 p-3 text-xs text-rose-100">
                • 2 high-risk users need immediate review
              </div>
              <div className="rounded-xl border border-amber-400/25 bg-amber-500/10 p-3 text-xs text-amber-100">
                • Refilling due today for 9 verifications
              </div>
              <div className="rounded-xl border border-violet-400/25 bg-violet-500/10 p-3 text-xs text-violet-100">
                • Industry verification queue is rising in Health + Logistics
              </div>
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}

