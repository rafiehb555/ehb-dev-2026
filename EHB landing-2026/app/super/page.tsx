"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { SuperSidebar } from "@/components/superapp/SuperSidebar";
import { SuperTopbar } from "@/components/superapp/SuperTopbar";

const quickCards = [
  { title: "DMO", desc: "Control approvals, risk and governance.", href: "/dmo", icon: "🧠" },
  { title: "Marketplace", desc: "Smart trust-based search and ranking.", href: "/marketplace", icon: "🛒" },
  { title: "Wallet", desc: "Track payouts, balances and earnings.", href: "/wallet", icon: "💰" },
  { title: "Verification", desc: "Manage identity and compliance state.", href: "/verification", icon: "🔐" },
  { title: "Certification", desc: "CRB applications and decisions.", href: "/certification", icon: "🏛" },
];

const activity = [
  "DMO approval recorded for CRB application",
  "STL score updated after inspection event",
  "Industry verification request added",
  "Franchise report submitted and queued",
  "AI marketplace ranking recalculated",
];

export default function SuperAppPage() {
  return (
    <main className="min-h-screen text-slate-100">
      <div className="container-ehb py-6 space-y-4">
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.26, ease: "easeInOut" }}
          className="rounded-3xl border border-cyan-400/20 bg-gradient-to-b from-[#031222]/95 to-[#020b18]/95 p-5"
        >
          <p className="text-[11px] uppercase tracking-[0.2em] text-cyan-300">EHB Super App</p>
          <h1 className="mt-1 text-2xl md:text-3xl font-semibold gradient-text">All-in-one trust economy dashboard</h1>
          <p className="mt-2 text-sm text-ehb-textBody max-w-3xl">
            One unified interface connecting DMO, Marketplace, Verification, Certification, STL, Franchise,
            Industries, Wallet and AI guidance.
          </p>
        </motion.section>

        <div className="grid gap-4 lg:grid-cols-12 items-start">
          <div className="lg:col-span-3 xl:col-span-2 lg:sticky lg:top-24 h-[calc(100vh-8rem)]">
            <SuperSidebar />
          </div>

          <section className="lg:col-span-9 xl:col-span-10 space-y-4">
            <SuperTopbar />

            <div className="grid gap-4 lg:grid-cols-12">
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.24 }}
                className="lg:col-span-7 rounded-2xl border border-violet-400/20 bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-500/10 p-4 sm:p-5 ehb-hover-lift"
              >
                <div className="text-xs uppercase tracking-[0.18em] ehb-text-muted">User Overview</div>
                <div className="mt-3 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-xl border border-violet-400/30 bg-violet-500/10 p-3">
                    <div className="text-[11px] text-violet-100">STL Score</div>
                    <div className="text-2xl font-semibold text-white">84</div>
                  </div>
                  <div className="rounded-xl border border-emerald-400/30 bg-emerald-500/10 p-3">
                    <div className="text-[11px] text-emerald-100">Earnings</div>
                    <div className="text-2xl font-semibold text-white">$4,921</div>
                  </div>
                  <div className="rounded-xl border border-cyan-400/30 bg-cyan-500/10 p-3">
                    <div className="text-[11px] text-cyan-100">Verification</div>
                    <div className="text-2xl font-semibold text-white">Active</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.24, delay: 0.04 }}
                className="lg:col-span-5 rounded-2xl border border-cyan-400/20 bg-gradient-to-br from-cyan-500/10 via-transparent to-emerald-500/10 p-4 sm:p-5 ehb-hover-lift"
              >
                <div className="text-xs uppercase tracking-[0.18em] ehb-text-muted">Live System Status</div>
                <div className="mt-3 space-y-2 text-xs">
                  <div className="rounded-xl border border-amber-400/30 bg-amber-500/10 p-2.5 text-amber-100">Pending approvals: 34</div>
                  <div className="rounded-xl border border-rose-400/30 bg-rose-500/10 p-2.5 text-rose-100">High risk queue: 7</div>
                  <div className="rounded-xl border border-cyan-400/30 bg-cyan-500/10 p-2.5 text-cyan-100">Refilling alerts: 9 due today</div>
                  <div className="rounded-xl border border-emerald-400/30 bg-emerald-500/10 p-2.5 text-emerald-100">System health: healthy</div>
                </div>
              </motion.div>
            </div>

            <motion.section
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.24 }}
              className="rounded-2xl border border-white/10 bg-[#041124]/80 p-4 sm:p-5"
            >
              <div className="text-xs uppercase tracking-[0.18em] ehb-text-muted">Quick Access</div>
              <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
                {quickCards.map((c) => (
                  <Link key={c.title} href={c.href} className="rounded-xl border border-white/10 bg-white/5 p-3 ehb-hover-lift hover:border-cyan-400/40">
                    <div className="text-base">{c.icon}</div>
                    <div className="text-sm font-semibold text-white mt-1">{c.title}</div>
                    <div className="text-xs text-ehb-textBody mt-1">{c.desc}</div>
                    <div className="text-[11px] text-cyan-200 mt-2">Open →</div>
                  </Link>
                ))}
              </div>
            </motion.section>

            <div className="grid gap-4 lg:grid-cols-12">
              <motion.section
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.24 }}
                className="lg:col-span-6 rounded-2xl border border-white/10 bg-[#041124]/80 p-4 sm:p-5"
              >
                <div className="text-xs uppercase tracking-[0.18em] ehb-text-muted">AI Recommendations</div>
                <div className="mt-3 space-y-2 text-xs">
                  <div className="rounded-xl border border-cyan-400/25 bg-cyan-500/10 p-2.5 text-cyan-100">Complete KYC to increase trust score by up to +12 points.</div>
                  <div className="rounded-xl border border-violet-400/25 bg-violet-500/10 p-2.5 text-violet-100">Apply for CRB certification to unlock higher marketplace ranking.</div>
                  <div className="rounded-xl border border-amber-400/25 bg-amber-500/10 p-2.5 text-amber-100">Two refilling checks are due this week. Schedule now.</div>
                </div>
              </motion.section>

              <motion.section
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.24, delay: 0.04 }}
                className="lg:col-span-6 rounded-2xl border border-white/10 bg-[#041124]/80 p-4 sm:p-5"
              >
                <div className="text-xs uppercase tracking-[0.18em] ehb-text-muted">Activity Feed</div>
                <div className="mt-3 space-y-2">
                  {activity.map((a) => (
                    <div key={a} className="rounded-xl border border-white/10 bg-white/5 p-2.5 text-xs text-slate-200">
                      • {a}
                    </div>
                  ))}
                </div>
              </motion.section>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

