"use client";

import { useState } from "react";
import Link from "next/link";

const DMO_MODULES = [
  {
    id: "identity", icon: "🪪", name: "Identity & JPS Profile", shortName: "Identity",
    color: "from-blue-600 to-blue-800", borderColor: "border-blue-500/40",
    tagline: "Aapki digital pehchaan — verified aur secure",
    description: "EHB ka digital identity system. Har user ko ek unique verified profile milta hai — Job Placement Score (JPS) ke saath. Ye score dikhata hai ke aap platform par kitne trustworthy aur active hain.",
    features: ["🪪 Verified digital ID card", "⭐ JPS Score (0–1000) — trust indicator", "📊 Activity history aur performance", "🔐 Blockchain-secured identity", "🌍 Works in all 50+ countries"],
    status: "Live", statusColor: "bg-green-500/20 text-green-300 border-green-500/30",
    useCases: ["Job seekers ke liye", "Franchise partners ke liye", "Service providers ke liye"],
  },
  {
    id: "pss", icon: "🛡️", name: "PSS — Platform Security System", shortName: "Security",
    color: "from-red-600 to-red-800", borderColor: "border-red-500/40",
    tagline: "Aapka data aur paisa 100% safe",
    description: "Platform Security System (PSS) EHB ka security core hai. Ye system fraud detection, data encryption, aur unauthorized access prevention karta hai. Har transaction aur action verify hoti hai.",
    features: ["🔒 End-to-end encryption", "🤖 AI-powered fraud detection", "📱 2-Factor Authentication (2FA)", "🚨 Real-time threat alerts", "🗂️ Audit logs for all actions"],
    status: "Live", statusColor: "bg-green-500/20 text-green-300 border-green-500/30",
    useCases: ["Transaction security", "Account protection", "Data privacy"],
  },
  {
    id: "crb", icon: "⭐", name: "CRB — Credit & Reputation Badge", shortName: "Reputation",
    color: "from-yellow-600 to-amber-700", borderColor: "border-yellow-500/40",
    tagline: "Aapki market value — dikhne wali badge",
    description: "Credit & Reputation Badge (CRB) ek visual score system hai. Jitna zyada kaam, utni badi badge — aur zyada business opportunities. Bronze se Platinum tak 4 levels hain.",
    features: ["🏅 Visual badge (Bronze → Silver → Gold → Platinum)", "📈 Score auto-update hota hai", "🤝 High badge = zyada clients", "💼 Job aur franchise ke liye advantage", "📣 Public profile par display"],
    status: "Live", statusColor: "bg-green-500/20 text-green-300 border-green-500/30",
    useCases: ["Freelancers ke liye", "Businesses ke liye", "Franchise applicants ke liye"],
  },
  {
    id: "stl", icon: "📦", name: "STL — Smart Tracking & Logistics", shortName: "Logistics",
    color: "from-cyan-600 to-teal-700", borderColor: "border-cyan-500/40",
    tagline: "Har parcel ka real-time location",
    description: "Smart Tracking & Logistics (STL) EHB ka delivery network hai. AI automatically orders assign karta hai nearest delivery partner ko. Customer ko real-time tracking milti hai — exact location, estimated time.",
    features: ["📍 Live GPS tracking on map", "🤖 AI-powered route optimization", "🔔 Automatic status notifications", "⚡ Same-day delivery support", "📊 Delivery analytics dashboard"],
    status: "Live", statusColor: "bg-green-500/20 text-green-300 border-green-500/30",
    useCases: ["Customers ke liye", "Delivery partners ke liye", "Franchise owners ke liye"],
  },  {
    id: "wallet", icon: "💳", name: "EHB Wallet", shortName: "Wallet",
    color: "from-green-600 to-emerald-700", borderColor: "border-green-500/40",
    tagline: "Aapka digital bank — instant payments",
    description: "EHB Wallet ek secure digital wallet hai. Earn, store, aur transfer karein. Franchise income, service payments, aur referral bonuses — sab ek jagah. Bank transfer bhi supported hai.",
    features: ["💰 Instant income deposits", "🏦 Bank withdrawal (24–48 hrs)", "💸 P2P transfers free", "📊 Full transaction history", "🌐 Multi-currency (USD, PKR, AED)"],
    status: "Live", statusColor: "bg-green-500/20 text-green-300 border-green-500/30",
    useCases: ["Income receive karna", "Bills pay karna", "Family ko send karna"],
  },
  {
    id: "applications", icon: "📝", name: "Applications & Approvals", shortName: "Applications",
    color: "from-violet-600 to-purple-700", borderColor: "border-violet-500/40",
    tagline: "Koi bhi application — online, paperless",
    description: "EHB ka digital application system. Franchise ke liye apply karo, service registration karo, job post karo — sab kuch online. Koi physical form nahi, koi queue nahi. Approval status real-time track hoti hai.",
    features: ["📋 Digital application forms", "⏱️ Real-time approval status", "🔔 Email/SMS notifications", "📁 Document upload support", "✅ Digital signature system"],
    status: "Live", statusColor: "bg-green-500/20 text-green-300 border-green-500/30",
    useCases: ["Franchise apply karna", "Job post karna", "Service register karna"],
  },
  {
    id: "certificates", icon: "🏆", name: "Certificates & Registry", shortName: "Certificates",
    color: "from-orange-600 to-amber-700", borderColor: "border-orange-500/40",
    tagline: "Digital certificates — blockchain verified",
    description: "EHB ka digital certificate system. Training complete karo — certificate milta hai. Franchise approve — license milta hai. Sab certificates blockchain par registered hain, koi fake nahi ho sakta.",
    features: ["🎓 Training completion certificates", "📜 Franchise license (digital)", "🔗 Blockchain verification", "🖨️ PDF download & print", "🌐 Shareable online (LinkedIn etc.)"],
    status: "Live", statusColor: "bg-green-500/20 text-green-300 border-green-500/30",
    useCases: ["Training ke baad", "Franchise registration", "Professional profile"],
  },
  {
    id: "notifications", icon: "🔔", name: "Notifications & Compliance", shortName: "Notifications",
    color: "from-pink-600 to-rose-700", borderColor: "border-pink-500/40",
    tagline: "Sab updates ek jagah — koi miss nahi",
    description: "EHB ka smart notification system. Order updates, payment alerts, compliance reminders, aur important announcements — sab kuch ek inbox mein. Push, SMS, aur email — aap choose karo.",
    features: ["📱 Push notifications (mobile)", "📧 Email alerts", "💬 SMS notifications", "⚠️ Compliance deadline reminders", "📢 Platform announcements"],
    status: "Live", statusColor: "bg-green-500/20 text-green-300 border-green-500/30",
    useCases: ["Order updates", "Payment alerts", "Rule changes"],
  },
  {
    id: "blockchain", icon: "⛓️", name: "Blockchain Anchoring", shortName: "Blockchain",
    color: "from-slate-600 to-slate-800", borderColor: "border-slate-400/40",
    tagline: "Har record tamper-proof — forever",
    description: "EHB ka blockchain layer sab important records ko permanently anchor karta hai. Koi bhi transaction, certificate, ya identity change — blockchain par record hoti hai. Koi bhi data change nahi kar sakta.",
    features: ["🔗 Immutable transaction records", "📋 Smart contract automation", "🔍 Public verification available", "⚡ Fast (no mining delays)", "🌐 Cross-chain compatibility"],
    status: "Active", statusColor: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    useCases: ["Identity verification", "Contract execution", "Audit trails"],
  },
];

const PHASES = [
  { phase: "Phase 1–3",   range: "Setup",      desc: "Platform infrastructure aur core systems", done: true  },
  { phase: "Phase 4–10",  range: "Foundation",  desc: "Identity, security, wallet, logistics live", done: true  },
  { phase: "Phase 11–30", range: "Growth",      desc: "AI modules, marketplace expansion", done: false },
  { phase: "Phase 31–50", range: "Scale",       desc: "Global rollout, 32 industries live", done: false },
  { phase: "Phase 51–80", range: "Global",      desc: "Full ecosystem — 50+ countries live", done: false },
];
export default function DmoPage() {
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("modules");
  const selectedModule = DMO_MODULES.find((m) => m.id === activeModule);

  return (
    <main className="min-h-screen bg-[#05050f] text-white overflow-x-hidden">

      <section className="relative py-16 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/50 via-blue-900/20 to-[#05050f]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-blue-600/8 rounded-full blur-3xl" />
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/15 border border-blue-400/30 text-blue-300 text-sm font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            DMO — Digital Management & Operations
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-4 leading-tight">
            <span className="bg-gradient-to-r from-cyan-400 via-blue-300 to-purple-400 bg-clip-text text-transparent">EHB ka Engine</span>
            <br /><span className="text-white">Platform ke Peeche</span>
          </h1>
          <p className="text-xl text-white/60 max-w-2xl mx-auto mb-8">
            9 powerful modules jo EHB platform ko chalate hain — identity se lekar blockchain tak.
            <br /><span className="text-white/30 text-base">Sab kuch automated, secure, aur transparent.</span>
          </p>
          <div className="flex flex-wrap justify-center gap-8">
            {[
              { icon: "⚙️", val: "9", label: "Core Modules" },
              { icon: "🔒", val: "100%", label: "Secured" },
              { icon: "⛓️", val: "Blockchain", label: "Verified" },
              { icon: "🌍", val: "50+", label: "Countries" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-3xl mb-1">{s.icon}</div>
                <div className="text-2xl font-black text-white">{s.val}</div>
                <div className="text-xs text-white/40 uppercase tracking-wider">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-4 px-4 sticky top-0 z-30 bg-[#05050f]/90 backdrop-blur-md border-b border-white/5">
        <div className="max-w-5xl mx-auto flex gap-2 flex-wrap justify-center">
          {[
            { key: "modules", icon: "⚙️", label: "9 Core Modules" },
            { key: "phases",  icon: "🗺️", label: "Dev Phases" },
            { key: "governance", icon: "🏛️", label: "Governance" },
          ].map((tab) => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold border transition-all ${
                activeTab === tab.key ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/30" : "bg-white/5 border-white/10 text-white/60 hover:text-white"
              }`}>
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </section>      {/* ââ 9 MODULES TAB âââââââââââââââââââââââââââââââ */}
      {activeTab === "modules" && (
        <section className="py-10 px-4">
          <div className="max-w-6xl mx-auto">

            {/* Module Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
              {DMO_MODULES.map((mod) => (
                <button
                  key={mod.id}
                  onClick={() => setActiveModule(activeModule === mod.id ? null : mod.id)}
                  className={`text-left rounded-2xl border overflow-hidden transition-all hover:scale-[1.02] ${mod.borderColor} ${
                    activeModule === mod.id ? "ring-2 ring-white/20 scale-[1.02]" : ""
                  }`}
                >
                  {/* Card header gradient */}
                  <div className={`bg-gradient-to-br ${mod.color} p-4 flex items-start justify-between`}>
                    <div className="text-4xl">{mod.icon}</div>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full border ${mod.statusColor}`}>
                      {mod.status}
                    </span>
                  </div>

                  {/* Card body */}
                  <div className="bg-white/[0.04] p-4">
                    <h3 className="font-black text-white text-base mb-1">{mod.shortName}</h3>
                    <p className="text-xs text-white/50 mb-3">{mod.tagline}</p>
                    <p className="text-xs text-white/40 leading-relaxed line-clamp-2">{mod.description}</p>
                    <div className="mt-3 flex items-center gap-1 text-xs text-blue-400 font-semibold">
                      {activeModule === mod.id ? "Hide details â²" : "See details â¼"}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Expanded module detail */}
            {selectedModule && (
              <div className={`rounded-3xl border ${selectedModule.borderColor} overflow-hidden animate-in fade-in`}>
                <div className={`bg-gradient-to-br ${selectedModule.color} p-6 md:p-8`}>
                  <div className="flex items-center gap-4">
                    <div className="text-6xl">{selectedModule.icon}</div>
                    <div>
                      <div className="text-sm text-white/60 mb-1">Module Detail</div>
                      <h2 className="text-2xl font-black text-white">{selectedModule.name}</h2>
                      <p className="text-white/70 mt-1">{selectedModule.tagline}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/[0.04] p-6 md:p-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Description */}
                    <div className="md:col-span-2">
                      <h3 className="text-sm font-black text-white/50 uppercase tracking-wider mb-3">Kya Karta Hai?</h3>
                      <p className="text-white/80 text-base leading-relaxed mb-6">{selectedModule.description}</p>

                      <h3 className="text-sm font-black text-white/50 uppercase tracking-wider mb-3">Features</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {selectedModule.features.map((f) => (
                          <div key={f} className="flex items-start gap-2 bg-black/20 rounded-xl p-3 text-sm text-white/70">
                            {f}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Use cases + action */}
                    <div>
                      <h3 className="text-sm font-black text-white/50 uppercase tracking-wider mb-3">Kiske Liye?</h3>
                      <div className="space-y-2 mb-6">
                        {selectedModule.useCases.map((uc) => (
                          <div key={uc} className="bg-black/20 rounded-xl p-3 text-sm text-white/70 flex items-center gap-2">
                            <span className="text-green-400">â</span> {uc}
                          </div>
                        ))}
                      </div>

                      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-bold mb-4 ${selectedModule.statusColor}`}>
                        <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
                        Status: {selectedModule.status}
                      </div>

                      <button
                        onClick={() => setActiveModule(null)}
                        className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-semibold transition-all"
                      >
                        Close â
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ââ DEV PHASES TAB âââââââââââââââââââââââââââââââ */}
      {activeTab === "phases" && (
        <section className="py-10 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-black text-white mb-2">ðºï¸ Development Roadmap</h2>
              <p className="text-white/50">Phase 1 se Phase 80 tak â EHB ka safar</p>
            </div>

            <div className="space-y-4">
              {PHASES.map((p, i) => (
                <div
                  key={i}
                  className={`rounded-2xl border p-5 flex items-center gap-5 ${
                    p.done
                      ? "bg-green-950/20 border-green-500/30"
                      : "bg-white/5 border-white/10"
                  }`}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl flex-shrink-0 ${
                    p.done ? "bg-green-500/20 text-green-400" : "bg-white/10 text-white/30"
                  }`}>
                    {p.done ? "â" : "â³"}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span className="font-black text-white">{p.phase}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${p.done ? "bg-green-500/20 text-green-300" : "bg-white/10 text-white/40"}`}>
                        {p.range}
                      </span>
                    </div>
                    <p className="text-sm text-white/50 mt-1">{p.desc}</p>
                  </div>
                  <div className={`text-sm font-bold ${p.done ? "text-green-400" : "text-white/20"}`}>
                    {p.done ? "Complete" : "Upcoming"}
                  </div>
                </div>
              ))}
            </div>

            {/* Overall progress */}
            <div className="mt-8 bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="flex justify-between items-center mb-3">
                <span className="text-white font-bold">Overall Progress</span>
                <span className="text-green-400 font-black">Phase 10 / 80</span>
              </div>
              <div className="bg-white/5 rounded-full h-4 overflow-hidden">
                <div className="h-full w-[12.5%] bg-gradient-to-r from-green-500 to-emerald-400 rounded-full" />
              </div>
              <p className="text-xs text-white/30 mt-2">12.5% complete â Foundation aur core systems live hain</p>
            </div>
          </div>
        </section>
      )}

      {/* ââ GOVERNANCE TAB âââââââââââââââââââââââââââââââ */}
      {activeTab === "governance" && (
        <section className="py-10 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-black text-white mb-2">ðï¸ Digital Governance System</h2>
              <p className="text-white/50">EHB ka fair, transparent, aur automated governance</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  icon: "âï¸",
                  title: "Fair Rules",
                  desc: "Platform ke rules sab ke liye equal hain. Koi special treatment nahi â AI ensure karta hai ke har faisla fair ho.",
                  color: "border-blue-500/30 bg-blue-950/20",
                },
                {
                  icon: "ð",
                  title: "Full Transparency",
                  desc: "Har action, transaction, aur change publicly verifiable hai. Blockchain par permanent record â koi chhupa nahi sakta.",
                  color: "border-cyan-500/30 bg-cyan-950/20",
                },
                {
                  icon: "ð¤",
                  title: "AI Decision Making",
                  desc: "Disputes, approvals, aur flagging â AI handle karta hai. Biasness zero. Speed maximum. 24/7 available.",
                  color: "border-purple-500/30 bg-purple-950/20",
                },
                {
                  icon: "ð³ï¸",
                  title: "Community Voting",
                  desc: "Bade platform changes mein franchisees aur partners vote karte hain. Democracy-based decisions for major updates.",
                  color: "border-green-500/30 bg-green-950/20",
                },
                {
                  icon: "ð",
                  title: "Compliance Tracking",
                  desc: "Har franchisee aur partner ka compliance automatically track hota hai. Reminders milte hain â koi deadline miss nahi hoti.",
                  color: "border-yellow-500/30 bg-yellow-950/20",
                },
                {
                  icon: "ð¨",
                  title: "Dispute Resolution",
                  desc: "Agar koi masla ho â 3-step resolution: AI review â Human review â Final decision. 72 ghante mein hal.",
                  color: "border-red-500/30 bg-red-950/20",
                },
              ].map((item) => (
                <div key={item.title} className={`rounded-2xl border p-6 ${item.color}`}>
                  <div className="text-4xl mb-3">{item.icon}</div>
                  <h3 className="text-lg font-black text-white mb-2">{item.title}</h3>
                  <p className="text-white/60 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ââ CTA âââââââââââââââââââââââââââââââââââââââââââ */}
      <section className="py-16 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="bg-gradient-to-r from-blue-900/30 via-purple-900/20 to-cyan-900/30 border border-blue-400/20 rounded-3xl p-10">
            <div className="text-5xl mb-4">âï¸</div>
            <h2 className="text-2xl font-black text-white mb-3">EHB Platform Explore Karein</h2>
            <p className="text-white/60 mb-8">Poora ecosystem dekhein â franchise se lekar AI marketplace tak</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/franchise" className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl text-white font-bold transition-all hover:scale-105">
                Franchise Apply Karein ð
              </Link>
              <Link href="/home" className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white font-semibold transition-all">
                Home Platform â
              </Link>
              <Link href="/development" className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white font-semibold transition-all">
                Dev Roadmap â
              </Link>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
