"use client";

import { useState } from "react";
import Link from "next/link";
import AIInsightCard from "@/components/AIInsightCard";
import { INDUSTRIES } from "@/lib/industry/config";

// ═══════════════════════════════════════════════════════
//  EHB HOME PAGE — Central Hub
//  World-Class UI/UX — Simple for Everyone
// ═══════════════════════════════════════════════════════

const QUICK_TILES = [
  {
    icon: "🏪",
    label: "Franchise",
    sub: "Open a business",
    href: "/franchise",
    color: "from-orange-500 to-amber-600",
    border: "border-orange-500/30",
  },
  {
    icon: "⚙️",
    label: "DMO",
    sub: "Platform engine",
    href: "/dmo",
    color: "from-blue-500 to-blue-700",
    border: "border-blue-500/30",
  },
  {
    icon: "🤖",
    label: "AI Tools",
    sub: "Smart help",
    href: "/ai-marketplace",
    color: "from-purple-500 to-violet-700",
    border: "border-purple-500/30",
  },
  {
    icon: "💼",
    label: "Jobs",
    sub: "Find jobs",
    href: "/agts",
    color: "from-green-500 to-emerald-600",
    border: "border-green-500/30",
  },
  {
    icon: "🏥",
    label: "Health",
    sub: "Health services",
    href: "/industries",
    color: "from-red-500 to-rose-600",
    border: "border-red-500/30",
  },
  {
    icon: "🛒",
    label: "GoSellr",
    sub: "Online store",
    href: "/gosellr",
    color: "from-cyan-500 to-teal-600",
    border: "border-cyan-500/30",
  },
  {
    icon: "📊",
    label: "Dashboard",
    sub: "Your account",
    href: "/dashboard",
    color: "from-indigo-500 to-indigo-700",
    border: "border-indigo-500/30",
  },
  {
    icon: "🌍",
    label: "Global",
    sub: "Worldwide reach",
    href: "/global",
    color: "from-teal-500 to-cyan-700",
    border: "border-teal-500/30",
  },
];

const STATS = [
  { icon: "🏭", val: "32", label: "Industries" },
  { icon: "🌍", val: "50+", label: "Countries" },
  { icon: "👥", val: "1M+", label: "Target Users" },
  { icon: "🤖", val: "100+", label: "AI Modules" },
  { icon: "💰", val: "$500M+", label: "Economy Goal" },
  { icon: "⚡", val: "24/7", label: "Live Support" },
];

const HOW_IT_WORKS = [
  {
    step: "1",
    icon: "📝",
    title: "Create an Account",
    desc: "Create a free account using your phone number or email in about 2 minutes.",
    color: "from-blue-600 to-blue-800",
  },
  {
    step: "2",
    icon: "✅",
    title: "Verify Identity",
    desc: "Complete ID verification to receive your JPS score and reputation badge.",
    color: "from-purple-600 to-purple-800",
  },
  {
    step: "3",
    icon: "🚀",
    title: "Start Growing",
    desc: "Choose a franchise, job, or service path and begin growing right away.",
    color: "from-green-600 to-emerald-700",
  },
];

/** Featured row — matches common marketing labels; links to `/landing/:slug` industry landings. */
const HOME_INDUSTRY_CHIPS: { emoji: string; slug: string }[] = [
  { emoji: "🏥", slug: "health" },
  { emoji: "🎓", slug: "education" },
  { emoji: "💼", slug: "consulting" },
  { emoji: "🏗️", slug: "construction" },
  { emoji: "🌾", slug: "agriculture" },
  { emoji: "🚗", slug: "automotive" },
  { emoji: "✈️", slug: "travel" },
  { emoji: "🍔", slug: "hospitality" },
  { emoji: "🏦", slug: "finance" },
  { emoji: "⚖️", slug: "law" },
  { emoji: "🏡", slug: "real-estate" },
  { emoji: "🎭", slug: "entertainment" },
];

export default function HomePage() {
  const [showAll, setShowAll] = useState(false);

  return (
    <main className="min-h-screen bg-[#05050f] text-white overflow-x-hidden">

      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="relative py-16 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/60 via-purple-900/20 to-[#05050f]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-purple-600/10 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-5xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/15 border border-purple-400/30 text-purple-300 text-sm font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            EHB Platform — Live & Growing 🌱
          </div>

          <h1 className="text-4xl md:text-6xl font-black mb-4 leading-tight">
            <span className="bg-gradient-to-r from-purple-400 via-pink-300 to-orange-400 bg-clip-text text-transparent">
              Education • Health • Business
            </span>
            <br />
            <span className="text-white text-3xl md:text-4xl">one platform for the full ecosystem</span>
          </h1>

          <p className="text-xl text-white/60 max-w-2xl mx-auto mb-8">
            EHB is a connected platform where you can work, learn, and build,
            <br />
            <span className="text-white/40 text-base">while managing your business from one place.</span>
          </p>

          {/* Main CTAs */}
          <div className="flex flex-wrap gap-4 justify-center mb-10">
            <Link href="/franchise" className="px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 rounded-2xl text-white font-black text-lg transition-all hover:scale-105 shadow-lg shadow-orange-500/30">
              🏪 Explore Franchise
            </Link>
            <Link href="/agts" className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 rounded-2xl text-white font-black text-lg transition-all hover:scale-105 shadow-lg shadow-green-500/30">
              💼 Find Jobs
            </Link>
            <Link href="/dashboard" className="px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl text-white font-semibold text-lg transition-all">
              📊 Dashboard →
            </Link>
          </div>

          {/* Stats bar */}
          <div className="flex flex-wrap justify-center gap-6">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-2xl mb-0.5">{s.icon}</div>
                <div className="text-xl font-black text-white">{s.val}</div>
                <div className="text-xs text-white/40 uppercase tracking-wider">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── QUICK NAVIGATION ─────────────────────────────── */}
      <section className="py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-black text-white mb-1">🧭 Where Do You Want to Go?</h2>
            <p className="text-white/50 text-sm">Choose your destination, tap once, and get started</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {QUICK_TILES.map((tile) => (
              <Link
                key={tile.href}
                href={tile.href}
                className={`group rounded-2xl border ${tile.border} overflow-hidden hover:scale-[1.03] transition-all`}
              >
                <div className={`bg-gradient-to-br ${tile.color} p-4 text-center`}>
                  <div className="text-4xl mb-1">{tile.icon}</div>
                </div>
                <div className="bg-white/[0.04] p-3 text-center">
                  <div className="font-black text-white text-sm">{tile.label}</div>
                  <div className="text-xs text-white/50">{tile.sub}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-br from-blue-950/30 to-purple-950/20 border border-blue-500/20 rounded-3xl p-6">
            <div className="mb-4">
              <h2 className="text-2xl font-black text-white">Live AI Insights</h2>
              <p className="text-white/50 text-sm">Personalized jobs, services, and marketplace suggestions</p>
            </div>
            <AIInsightCard limit={3} />
          </div>
        </div>
      </section>

      {/* ── WHAT IS EHB ─────────────────────────────────── */}
      <section className="py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-3xl p-8 md:p-10">
            <div className="text-center mb-8">
              <div className="text-5xl mb-3">🌐</div>
              <h2 className="text-3xl font-black text-white mb-2">What Is EHB?</h2>
              <p className="text-white/50">A simple explanation, without the complexity</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: "🎓",
                  title: "Education",
                  desc: "Courses, certificates, and training programs for every field, accessible from your phone.",
                  color: "border-blue-500/30 bg-blue-950/20",
                },
                {
                  icon: "🏥",
                  title: "Health",
                  desc: "Access doctors, medicines, and health tracking online without waiting in line.",
                  color: "border-red-500/30 bg-red-950/20",
                },
                {
                  icon: "💼",
                  title: "Business",
                  desc: "Run a franchise, launch an online store, or find work across 32 industries in one place.",
                  color: "border-green-500/30 bg-green-950/20",
                },
              ].map((item) => (
                <div key={item.title} className={`rounded-2xl border p-5 ${item.color}`}>
                  <div className="text-4xl mb-3">{item.icon}</div>
                  <h3 className="font-black text-white text-lg mb-2">{item.title}</h3>
                  <p className="text-white/60 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────── */}
      <section className="py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-white mb-2">🚀 Getting Started Is Easy</h2>
            <p className="text-white/50">Just 3 simple steps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {HOW_IT_WORKS.map((step) => (
              <div key={step.step} className="relative">
                <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                  <div className={`bg-gradient-to-br ${step.color} p-5`}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-lg font-black text-white">
                        {step.step}
                      </div>
                      <div className="text-4xl">{step.icon}</div>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-black text-white text-lg mb-2">{step.title}</h3>
                    <p className="text-white/60 text-sm leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 32 INDUSTRIES ─────────────────────────────────── */}
      <section className="py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-black text-white mb-2">🏭 32 Industries Covered</h2>
            <p className="text-white/50 text-sm">Every major field can connect through EHB</p>
          </div>

          <div className="flex flex-wrap gap-3 justify-center">
            {(showAll ? HOME_INDUSTRY_CHIPS.concat(
              INDUSTRIES.filter((i) => !HOME_INDUSTRY_CHIPS.some((c) => c.slug === i.slug)).map((i) => ({
                emoji: "🏭",
                slug: i.slug,
              })),
            ) : HOME_INDUSTRY_CHIPS.slice(0, 8)).map((chip) => {
              const meta = INDUSTRIES.find((i) => i.slug === chip.slug);
              const label = meta ? `${chip.emoji} ${meta.shortName}` : chip.slug;
              return (
                <Link
                  key={chip.slug}
                  href={`/landing/${chip.slug}`}
                  className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-white/70 hover:bg-white/10 hover:text-white hover:border-[#33C3FF]/40 transition-all"
                >
                  {label}
                </Link>
              );
            })}
            {!showAll && (
              <button
                type="button"
                onClick={() => setShowAll(true)}
                className="px-4 py-2 rounded-full bg-purple-500/20 border border-purple-400/30 text-sm text-purple-300 hover:bg-purple-500/30 transition-all"
              >
                +20 more →
              </button>
            )}
          </div>
          <p className="text-center mt-4">
            <Link href="/industries" className="text-xs text-[#33C3FF] hover:underline font-medium">
              Open full industries directory →
            </Link>
          </p>
        </div>
      </section>

      {/* ── PLATFORM STATUS ──────────────────────────────── */}
      <section className="py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-green-950/30 to-emerald-950/20 border border-green-500/20 rounded-3xl p-6 md:p-8">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl font-black text-white mb-1">📡 Platform Status</h2>
                <p className="text-white/50 text-sm">Review the current system status</p>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/20 border border-green-400/30">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-green-300 font-semibold text-sm">All Systems Live</span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: "🪪", name: "Identity", status: "Live", ok: true },
                { icon: "🛡️", name: "Security", status: "Live", ok: true },
                { icon: "💳", name: "Wallet", status: "Live", ok: true },
                { icon: "📦", name: "Logistics", status: "Live", ok: true },
                { icon: "⛓️", name: "Blockchain", status: "Active", ok: true },
                { icon: "🤖", name: "AI Engine", status: "Beta", ok: true },
                { icon: "🌍", name: "Global Ops", status: "Phase 2", ok: false },
                { icon: "🏭", name: "32 Industries", status: "Phase 3", ok: false },
              ].map((sys) => (
                <div key={sys.name} className="bg-black/20 rounded-xl p-3 flex items-center gap-3">
                  <div className="text-2xl">{sys.icon}</div>
                  <div>
                    <div className="text-white text-xs font-bold">{sys.name}</div>
                    <div className={`text-xs ${sys.ok ? "text-green-400" : "text-yellow-400"}`}>
                      {sys.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ─────────────────────────────────────── */}
      <section className="py-16 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="bg-gradient-to-r from-purple-900/30 via-pink-900/20 to-orange-900/30 border border-purple-400/20 rounded-3xl p-10">
            <div className="text-6xl mb-4">🌟</div>
            <h2 className="text-3xl font-black text-white mb-3">Join Today</h2>
            <p className="text-white/60 mb-8 text-lg">
              Millions of people are building with EHB. Start your journey today.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/franchise" className="px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 rounded-2xl text-white font-black text-lg transition-all hover:scale-105">
                🏪 Apply for Franchise
              </Link>
              <Link href="/dmo" className="px-6 py-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl text-white font-semibold transition-all">
                ⚙️ Explore the Platform
              </Link>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
