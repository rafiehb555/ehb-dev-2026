"use client";

/**
 * DMO — System Hub (Home)
 *   - VerificationUI primitives (no framer-motion, no emojis, no local Card)
 *   - In-file demo data (prototype only, no fetch)
 */

import Link from "next/link";
import {
  VerificationStatCard,
  VerificationChip,
  SectionHeader,
  SeverityMeter,
  type VerificationTone,
} from "@/components/dmo/verification/VerificationUI";

type DeptCard = {
  title: string;
  desc: string;
  href: string;
  cta: string;
  accent: string;
  tone: VerificationTone;
};

const CORE_DEPARTMENTS: DeptCard[] = [
  { title: "PSS — Proof & Security System", desc: "KYC/KYB identity verification, AML, and fraud risk analysis.", href: "/dmo/pss", cta: "Open PSS Control", accent: "#67E8F9", tone: "cyan" },
  { title: "CRB — Certification Board", desc: "Certification lifecycle, inspection workflows, and compliance decisions.", href: "/dmo/crb", cta: "Open CRB", accent: "#A098F8", tone: "purple" },
  { title: "STL · Trust Engine", desc: "Service Trust Level — score intelligence, ranking, and impact visibility.", href: "/dmo/ehb-stl-level", cta: "Open STL view", accent: "#2BBFA0", tone: "teal" },
  { title: "Franchise System", desc: "Ground inspections, escalation control, and regional operations.", href: "/franchise/inspections", cta: "Open Franchise Ops", accent: "#F0A030", tone: "amber" },
  { title: "Industry Engine", desc: "32-sector verification mapping and multi-industry trust controls.", href: "/dmo/industry", cta: "Open Industry Engine", accent: "#F05858", tone: "red" },
  { title: "AI Marketplace", desc: "Smart search, ranked matching, and trust-powered discovery.", href: "/marketplace", cta: "Open AI Marketplace", accent: "#7B6EF6", tone: "purple" },
];

const SUPPORT_SYSTEMS = [
  { title: "Wallet System", desc: "Escrow, payouts, financial traceability.", href: "/dashboard", tone: "amber" as VerificationTone },
  { title: "Registry System", desc: "Verified records and governance outputs.", href: "/dmo", tone: "teal" as VerificationTone },
  { title: "Notifications", desc: "Decision alerts, SLA warnings, risk notifications.", href: "/dmo/notifications", tone: "red" as VerificationTone },
  { title: "Settings", desc: "Role rules, defaults, operational preferences.", href: "/admin", tone: "purple" as VerificationTone },
  { title: "Reports", desc: "Operational analytics and trust summaries.", href: "/development", tone: "cyan" as VerificationTone },
];

const QUICK_ACTIONS = [
  { label: "New Application", href: "/dmo/crb", tone: "teal" as VerificationTone },
  { label: "Open DMO Dashboard", href: "/dmo", tone: "purple" as VerificationTone },
  { label: "View High Risk", href: "/dmo/fraud", tone: "red" as VerificationTone },
  { label: "Check Refilling", href: "/dmo/refilling", tone: "amber" as VerificationTone },
];

export default function DmoHomePage() {
  return (
    <div className="space-y-6">
      {/* Hero header */}
      <header className="relative overflow-hidden rounded-2xl border border-cyan-400/30 bg-gradient-to-br from-[#13162A] via-[#1A1D33] to-[#13162A] p-6 pt-[22px]">
        <div className="pointer-events-none absolute left-0 right-0 top-0 h-[3px]" style={{ background: "linear-gradient(90deg, transparent 0%, #67E8F9 20%, #7B6EF6 40%, #2BBFA0 60%, #F0A030 80%, transparent 100%)" }} />
        <div className="pointer-events-none absolute left-3 top-3 h-6 w-6 border-l-[1.5px] border-t-[1.5px] border-cyan-400/50" />
        <div className="pointer-events-none absolute bottom-3 right-3 h-6 w-6 border-b-[1.5px] border-r-[1.5px] border-[#7B6EF6]/45" />
        <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-gradient-to-br from-cyan-400/18 via-[#7B6EF6]/12 to-transparent blur-3xl" />
        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 space-y-2">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-cyan-300">DMO Entry Layer</p>
            <h1 className="text-2xl font-bold text-white md:text-3xl">DMO System Hub</h1>
            <p className="max-w-2xl text-sm text-white/65">
              Manage verification, certification, trust, and global operations from one place.
              Core departments aur support systems — sab yahaan linked hain.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/dmo" className="rounded-xl border border-[#7B6EF6]/50 bg-[#7B6EF6]/15 px-3 py-1.5 text-xs font-semibold text-[#A098F8] transition-colors hover:bg-[#7B6EF6]/25">Open Dashboard</Link>
            <Link href="/dmo/roadmap" className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-white/75 transition-colors hover:border-white/20 hover:bg-white/[0.07] hover:text-white">Pending work</Link>
            <Link href="/home" className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-white/75 transition-colors hover:border-white/20 hover:bg-white/[0.07] hover:text-white">Back to EHB Home</Link>
          </div>
        </div>
      </header>

      {/* Live system status */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <VerificationStatCard tone="cyan" label="Active verifications" value={128} sub="today" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" /></svg>} />
        <VerificationStatCard tone="amber" label="Pending approvals" value={34} sub="in queue" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" /><path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>} />
        <VerificationStatCard tone="green" label="System health" value="Healthy" sub="all services" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M5 12l4 4L19 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>} />
        <VerificationStatCard tone="red" label="Alerts" value="2 Critical" sub="needs attention" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M12 8v4m0 4h.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="currentColor" strokeWidth="1.4" /></svg>} />
      </section>

      {/* Core departments */}
      <section className="rounded-2xl border border-white/10 bg-[#13162A]/70 p-5">
        <SectionHeader eyebrow="Core departments" title="Main DMO operational systems" />
        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {CORE_DEPARTMENTS.map((d) => (
            <Link key={d.title} href={d.href} className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#1A1D33]/80 p-4 pt-[22px] transition-all duration-200 hover:-translate-y-[2px] hover:border-white/20">
              <div className="pointer-events-none absolute left-0 right-0 top-0 h-[2px]" style={{ background: `linear-gradient(90deg, transparent, ${d.accent}, transparent)` }} />
              <VerificationChip tone={d.tone}>{d.title.split("—")[0].trim()}</VerificationChip>
              <h3 className="mt-2 text-sm font-semibold text-white">{d.title}</h3>
              <p className="mt-1 text-[11px] text-white/50">{d.desc}</p>
              <p className="mt-3 text-[11px] font-semibold text-[#A098F8] transition-colors group-hover:text-white">{d.cta} →</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Support systems */}
      <section className="rounded-2xl border border-white/10 bg-[#13162A]/70 p-5">
        <SectionHeader eyebrow="Support systems" title="Operational backbone modules" />
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {SUPPORT_SYSTEMS.map((s) => (
            <Link key={s.title} href={s.href} className="group relative overflow-hidden rounded-xl border border-white/10 bg-[#1A1D33]/80 p-3 pt-[18px] transition-all duration-200 hover:-translate-y-[2px] hover:border-white/20">
              <div className="pointer-events-none absolute left-0 right-0 top-0 h-[2px]" style={{ background: `linear-gradient(90deg, transparent, ${s.tone === "amber" ? "#F0A030" : s.tone === "teal" ? "#2BBFA0" : s.tone === "red" ? "#F05858" : s.tone === "purple" ? "#A098F8" : "#67E8F9"}, transparent)` }} />
              <h3 className="text-sm font-semibold text-white">{s.title}</h3>
              <p className="mt-1 text-[10px] text-white/50">{s.desc}</p>
              <p className="mt-2 text-[11px] font-semibold text-[#A098F8] transition-colors group-hover:text-white">Open →</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Bottom row: Quick actions + AI insights + Distribution */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Quick actions */}
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#13162A]/70 p-5 pt-[22px]">
          <div className="pointer-events-none absolute left-0 right-0 top-0 h-[3px]" style={{ background: "linear-gradient(90deg, transparent, #7B6EF6, transparent)" }} />
          <SectionHeader title="Quick actions" />
          <div className="mt-3 grid gap-2">
            {QUICK_ACTIONS.map((a) => (
              <Link key={a.label} href={a.href} className={`rounded-xl border px-4 py-2.5 text-center text-[11px] font-semibold transition-colors ${a.tone === "red" ? "border-[#F05858]/40 bg-[#F05858]/12 text-[#F05858] hover:bg-[#F05858]/20" : a.tone === "teal" ? "border-[#2BBFA0]/40 bg-[#2BBFA0]/12 text-[#2BBFA0] hover:bg-[#2BBFA0]/20" : a.tone === "purple" ? "border-[#7B6EF6]/40 bg-[#7B6EF6]/12 text-[#A098F8] hover:bg-[#7B6EF6]/20" : "border-[#F0A030]/40 bg-[#F0A030]/12 text-[#F0A030] hover:bg-[#F0A030]/20"}`}>
                {a.label}
              </Link>
            ))}
          </div>
        </div>

        {/* AI insights */}
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#13162A]/70 p-5 pt-[22px]">
          <div className="pointer-events-none absolute left-0 right-0 top-0 h-[3px]" style={{ background: "linear-gradient(90deg, transparent, #2BBFA0, transparent)" }} />
          <SectionHeader title="AI insights" />
          <div className="mt-3 space-y-2">
            {[
              { text: "5 approvals pending in core queue", tone: "cyan" as VerificationTone },
              { text: "2 high-risk users need immediate review", tone: "red" as VerificationTone },
              { text: "Refilling due today for 9 verifications", tone: "amber" as VerificationTone },
              { text: "Industry verification queue rising in Health + Logistics", tone: "purple" as VerificationTone },
            ].map((insight) => (
              <div key={insight.text} className="rounded-xl border border-white/8 bg-white/[0.03] p-3 text-[11px] text-white/70">
                <VerificationChip tone={insight.tone} size="xs">{insight.tone.toUpperCase()}</VerificationChip>
                <span className="ml-2">{insight.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* System distribution */}
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#13162A]/70 p-5 pt-[22px]">
          <div className="pointer-events-none absolute left-0 right-0 top-0 h-[3px]" style={{ background: "linear-gradient(90deg, transparent, #67E8F9, transparent)" }} />
          <SectionHeader title="System load" />
          <div className="mt-3">
            <SeverityMeter segments={[
              { label: "Verifications", value: 128, tone: "cyan" },
              { label: "Approvals", value: 34, tone: "amber" },
              { label: "Fraud queue", value: 12, tone: "red" },
              { label: "Complaints", value: 23, tone: "purple" },
            ]} />
          </div>
        </div>
      </div>
    </div>
  );
}
