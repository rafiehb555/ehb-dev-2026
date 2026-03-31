"use client";
import Link from "next/link";
import { useState } from "react";

const INDUSTRY_PLATFORMS = [
  { name: "GoSellr", tag: "GSM", desc: "Global commerce & marketplace", icon: "🛒", color: "#3b82f6", href: "/gosellr" },
  { name: "WMS", tag: "Healthcare", desc: "Doctors, hospitals, telemedicine", icon: "🏥", color: "#10b981", href: "/wms" },
  { name: "HPS", tag: "Education", desc: "Schools, universities, skill learning", icon: "🎓", color: "#f59e0b", href: "/hps" },
  { name: "OLS", tag: "Legal", desc: "Lawyers, legal consulting, docs", icon: "⚖️", color: "#8b5cf6", href: "/ols" },
  { name: "AGTS", tag: "Travel", desc: "Flights, hotels, tour packages", icon: "✈️", color: "#06b6d4", href: "/agts" },
  { name: "SOT", tag: "Technology", desc: "Software, IT consulting, AI dev", icon: "💻", color: "#00eaff", href: "/sot" },
  { name: "HMS", tag: "Machinery", desc: "Equipment sales & maintenance", icon: "⚙️", color: "#f97316", href: "/gosellr" },
  { name: "OBS", tag: "Books", desc: "Digital books, academic content", icon: "📚", color: "#a78bfa", href: "/gosellr" },
  { name: "EHB Tube", tag: "Media", desc: "Video, audio, content publishing", icon: "🎥", color: "#ec4899", href: "/gosellr" },
];

const CORE_SYSTEMS = [
  { name: "PSS", full: "Proof & Security System", desc: "KYC, biometric, fraud detection", status: "Active", icon: "🛡️", color: "#10b981" },
  { name: "CRB", full: "Certification & Registry Board", desc: "Skill certification, licenses", status: "Active", icon: "🏛️", color: "#3b82f6" },
  { name: "STL", full: "Service Trust Level", desc: "AI trust scoring (0-100)", status: "Active", icon: "⭐", color: "#f59e0b" },
  { name: "DMO", full: "Decentralized Management Office", desc: "Platform governance & control", status: "Active", icon: "🌐", color: "#8b5cf6" },
  { name: "JPS", full: "Job Profile & Skill", desc: "Professional identity system", status: "Active", icon: "👤", color: "#06b6d4" },
  { name: "AI Engine", full: "AI Matching & Discovery", desc: "Smart routing & recommendations", status: "Active", icon: "🤖", color: "#00eaff" },
  { name: "Blockchain", full: "Polkadot Ecosystem", desc: "Immutable records, EHBGC token", status: "Live", icon: "⛓️", color: "#f97316" },
  { name: "Wallet", full: "EHB Wallet & Finance", desc: "Payments, escrow, affiliate", status: "Active", icon: "💰", color: "#22c55e" },
];

const PLATFORM_STATS = [
  { label: "Industries", value: "32", sub: "Active platforms", color: "#00eaff" },
  { label: "Services", value: "700+", sub: "Across all sectors", color: "#22c55e" },
  { label: "User Types", value: "6", sub: "Individual to Corporate", color: "#f59e0b" },
  { label: "Franchise Levels", value: "3", sub: "Sub → Master → Corporate", color: "#8b5cf6" },
  { label: "Core Systems", value: "8", sub: "AI, Blockchain, Finance...", color: "#3b82f6" },
  { label: "Countries", value: "Global", sub: "Multi-region expansion", color: "#10b981" },
];

const ROADMAP_PHASES = [
  { phase: "Phase 1", title: "Foundation", items: ["DMO", "PSS", "CRB", "STL", "Wallet"], done: true },
  { phase: "Phase 2", title: "Marketplace", items: ["GoSellr", "Products", "Services"], done: true },
  { phase: "Phase 3", title: "Professional Network", items: ["JPS", "Jobs", "Freelance"], done: false },
  { phase: "Phase 4", title: "Service Platforms", items: ["WMS", "AGTS", "OLS", "SOT", "HPS"], done: false },
  { phase: "Phase 5", title: "Digital Governance", items: ["Applications", "Licenses"], done: false },
  { phase: "Phase 6", title: "Global Expansion", items: ["Multi-country", "Localization"], done: false },
  { phase: "Phase 7", title: "AI Ecosystem", items: ["ML", "Fraud Detection", "NLP"], done: false },
  { phase: "Phase 8", title: "Blockchain Governance", items: ["Trust Network", "Smart Contracts"], done: false },
];

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<"platforms" | "systems" | "roadmap">("platforms");

  return (
    <main className="min-h-screen text-slate-100">
      <div className="container-ehb py-8 space-y-8">

        {/* Header */}
        <div className="relative rounded-3xl overflow-hidden glass-card border border-[#00eaff]/20 p-8 md:p-10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(0,234,255,0.12),transparent_60%)]" />
          <div className="relative">
            <p className="text-[11px] uppercase tracking-[0.28em] text-[#00eaff] mb-3">EHB Global Platform Hub</p>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold gradient-text mb-3">
              EHB – One Platform. 32 Industries. Global Scale.
            </h1>
            <p className="text-slate-300 text-sm md:text-base max-w-3xl mb-6">
              EHB (Education · Health · Business) is a global AI-powered super ecosystem. It connects users, service providers, businesses, and franchise partners across 32 industries — verified, trusted, and governed by AI and blockchain.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/dashboard" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#00AEEF] to-[#22C55E] px-6 py-2.5 text-sm font-semibold text-white btn-glow">
                My Dashboard
              </Link>
              <Link href="/ai-marketplace" className="inline-flex items-center gap-2 rounded-full border border-[#00eaff]/40 bg-[#00eaff]/10 px-6 py-2.5 text-sm font-semibold text-[#00eaff] hover:bg-[#00eaff]/20 transition-all">
                AI Marketplace
              </Link>
              <Link href="/admin" className="inline-flex items-center gap-2 rounded-full border border-violet-400/40 bg-violet-500/10 px-6 py-2.5 text-sm font-semibold text-violet-200 hover:bg-violet-500/20 transition-all">
                Admin Panel
              </Link>
              <Link href="/development" className="inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-500/10 px-6 py-2.5 text-sm font-semibold text-amber-200 hover:bg-amber-500/20 transition-all">
                Development Map
              </Link>
            </div>
          </div>
        </div>

        {/* Platform Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {PLATFORM_STATS.map((s) => (
            <div key={s.label} className="glass-panel border border-white/10 rounded-2xl p-4 text-center">
              <p className="text-xl md:text-2xl font-bold mb-1" style={{ color: s.color }}>{s.value}</p>
              <p className="text-xs font-semibold text-white mb-0.5">{s.label}</p>
              <p className="text-[11px] text-slate-400">{s.sub}</p>
            </div>
          ))}
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 flex-wrap">
          {(["platforms", "systems", "roadmap"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-full text-xs font-semibold transition-all ${
                activeTab === tab
                  ? "bg-gradient-to-r from-[#00AEEF] to-[#22C55E] text-white shadow-lg"
                  : "glass-panel border border-white/15 text-slate-300 hover:text-white hover:border-[#00eaff]/40"
              }`}
            >
              {tab === "platforms" ? "🌐 Industry Platforms" : tab === "systems" ? "⚙️ Core Systems" : "🗺️ Roadmap"}
            </button>
          ))}
        </div>

        {/* Industry Platforms Tab */}
        {activeTab === "platforms" && (
          <div>
            <div className="mb-4">
              <h2 className="text-lg md:text-xl font-semibold text-white mb-1">9 Industry Platforms</h2>
              <p className="text-xs text-slate-400">Each platform is a full ecosystem — AI-matched, verified, franchise-powered.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {INDUSTRY_PLATFORMS.map((p) => (
                <Link key={p.name} href={p.href} className="group glass-card border border-white/10 rounded-2xl p-5 hover:border-opacity-60 transition-all duration-300 card-hover" style={{ borderColor: p.color + "30" }}>
                  <div className="flex items-start gap-3 mb-3">
                    <span className="text-2xl">{p.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-sm font-bold text-white">{p.name}</p>
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ background: p.color + "25", color: p.color }}>{p.tag}</span>
                      </div>
                      <p className="text-xs text-slate-400">{p.desc}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">AI-powered · Verified</span>
                    <span className="font-semibold transition-colors" style={{ color: p.color }}>Explore →</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Core Systems Tab */}
        {activeTab === "systems" && (
          <div>
            <div className="mb-4">
              <h2 className="text-lg md:text-xl font-semibold text-white mb-1">8 Core Systems</h2>
              <p className="text-xs text-slate-400">Every EHB transaction passes through these systems — verified, trusted, recorded.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {CORE_SYSTEMS.map((s) => (
                <div key={s.name} className="glass-card rounded-2xl p-5 border" style={{ borderColor: s.color + "35" }}>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xl">{s.icon}</span>
                    <div>
                      <p className="text-sm font-bold text-white">{s.name}</p>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ background: s.color + "25", color: s.color }}>
                        {s.status}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs font-semibold text-slate-200 mb-1">{s.full}</p>
                  <p className="text-xs text-slate-400">{s.desc}</p>
                </div>
              ))}
            </div>

            {/* User Flow */}
            <div className="mt-8 glass-panel border border-white/10 rounded-2xl p-6">
              <h3 className="text-sm font-semibold text-white mb-4">Platform Flow — From Signup to Earning</h3>
              <div className="flex flex-wrap items-center gap-2 text-xs">
                {["Register", "JPS Profile", "STL Level", "PSS Verify", "CRB Certify", "DMO Approve", "Service Active", "Earn 💰"].map((step, i, arr) => (
                  <div key={step} className="flex items-center gap-2">
                    <div className="px-3 py-1.5 rounded-full font-semibold" style={{
                      background: i < 3 ? "rgba(0,234,255,0.15)" : i < 6 ? "rgba(139,92,246,0.15)" : "rgba(34,197,94,0.2)",
                      color: i < 3 ? "#00eaff" : i < 6 ? "#a78bfa" : "#22c55e",
                      border: "1px solid " + (i < 3 ? "rgba(0,234,255,0.3)" : i < 6 ? "rgba(139,92,246,0.3)" : "rgba(34,197,94,0.3)")
                    }}>
                      {step}
                    </div>
                    {i < arr.length - 1 && <span className="text-slate-600">→</span>}
                  </div>
                ))}
              </div>
            </div>

            {/* Trust Badge Reference */}
            <div className="mt-4 glass-panel border border-white/10 rounded-2xl p-6">
              <h3 className="text-sm font-semibold text-white mb-4">Trust Badge System</h3>
              <div className="flex flex-wrap gap-3 text-xs">
                {[
                  { icon: "🛡️", label: "PSS Verified", color: "#10b981" },
                  { icon: "🏛️", label: "CRB Certified", color: "#3b82f6" },
                  { icon: "⭐", label: "STL Level", color: "#f59e0b" },
                  { icon: "🌐", label: "DMO Registered", color: "#8b5cf6" },
                  { icon: "🏢", label: "Franchise Verified", color: "#f97316" },
                ].map((b) => (
                  <div key={b.label} className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ background: b.color + "20", border: "1px solid " + b.color + "40" }}>
                    <span>{b.icon}</span>
                    <span className="font-medium" style={{ color: b.color }}>{b.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Roadmap Tab */}
        {activeTab === "roadmap" && (
          <div>
            <div className="mb-4">
              <h2 className="text-lg md:text-xl font-semibold text-white mb-1">8-Phase Development Roadmap</h2>
              <p className="text-xs text-slate-400">From foundation systems to global blockchain governance.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {ROADMAP_PHASES.map((rp, i) => (
                <div key={rp.phase} className={`glass-card rounded-2xl p-5 border ${rp.done ? "border-emerald-400/40" : "border-white/10"}`}>
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${rp.done ? "bg-emerald-400/20 text-emerald-300" : "bg-slate-700/60 text-slate-400"}`}>
                      {rp.phase}
                    </span>
                    {rp.done && <span className="text-emerald-400 text-xs">✓ Done</span>}
                  </div>
                  <p className="text-sm font-semibold text-white mb-2">{rp.title}</p>
                  <div className="flex flex-wrap gap-1">
                    {rp.items.map((item) => (
                      <span key={item} className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800/60 text-slate-300">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Franchise Levels */}
            <div className="mt-8 glass-panel border border-white/10 rounded-2xl p-6">
              <h3 className="text-sm font-semibold text-white mb-4">Franchise Network Structure</h3>
              <div className="grid sm:grid-cols-3 gap-4">
                {[
                  { level: "Sub Franchise", desc: "City-level. Onboard local providers & earn from every order in your zone.", color: "#3b82f6", earn: "$500–$2000/mo" },
                  { level: "Master Franchise", desc: "Regional. Manage multiple cities with higher scope and earning potential.", color: "#f59e0b", earn: "$2000–$8000/mo" },
                  { level: "Corporate Franchise", desc: "National/country level. Maximum influence and ecosystem revenue.", color: "#f97316", earn: "$8000+/mo" },
                ].map((fl) => (
                  <div key={fl.level} className="rounded-2xl p-4 border" style={{ background: fl.color + "10", borderColor: fl.color + "40" }}>
                    <p className="text-sm font-bold mb-1" style={{ color: fl.color }}>{fl.level}</p>
                    <p className="text-xs text-slate-300 mb-2">{fl.desc}</p>
                    <p className="text-xs font-semibold text-emerald-300">{fl.earn}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Quick Navigation Footer */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Dashboard", href: "/dashboard", icon: "📊", color: "#00eaff" },
            { label: "AI Marketplace", href: "/ai-marketplace", icon: "🤖", color: "#8b5cf6" },
            { label: "Franchise", href: "/franchise", icon: "🏢", color: "#22c55e" },
            { label: "DMO Admin", href: "/dmo", icon: "🌐", color: "#f59e0b" },
            { label: "Development", href: "/development", icon: "🛠️", color: "#f97316" },
            { label: "GoSellr", href: "/gosellr", icon: "🛒", color: "#3b82f6" },
            { label: "Healthcare", href: "/wms", icon: "🏥", color: "#10b981" },
            { label: "Education", href: "/hps", icon: "🎓", color: "#a78bfa" },
          ].map((n) => (
            <Link key={n.label} href={n.href} className="glass-panel card-hover border border-white/10 rounded-xl p-4 flex items-center gap-3 hover:border-opacity-60 transition-all" style={{ borderColor: n.color + "30" }}>
              <span className="text-xl">{n.icon}</span>
              <span className="text-xs font-semibold text-slate-200">{n.label}</span>
            </Link>
          ))}
        </div>

      </div>
    </main>
  );
}
