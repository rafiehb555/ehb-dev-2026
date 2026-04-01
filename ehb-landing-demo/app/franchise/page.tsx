"use client";

import { useState } from "react";
import Link from "next/link";

const AREAS = [
  { id: "dubai", flag: "🇦🇪", city: "Dubai", country: "UAE" },
  { id: "lahore", flag: "🇵🇰", city: "Lahore", country: "Pakistan" },
  { id: "karachi", flag: "🇵🇰", city: "Karachi", country: "Pakistan" },
  { id: "islamabad", flag: "🇵🇰", city: "Islamabad", country: "Pakistan" },
  { id: "rawalpindi", flag: "🇵🇰", city: "Rawalpindi", country: "Pakistan" },
];

const STEPS = [
  { num: "1", icon: "📋", title: "Choose Your Level", desc: "Pick a franchise plan that fits your budget — starting from just $1,000" },
  { num: "2", icon: "📍", title: "Select Your City", desc: "Choose the city or area where you want to operate your franchise" },
  { num: "3", icon: "📝", title: "Fill Application", desc: "Simple online form — takes only 10 minutes to complete" },
  { num: "4", icon: "✅", title: "Get Approved", desc: "Our team reviews and approves within 24–48 hours" },
  { num: "5", icon: "🚀", title: "Start Earning", desc: "Launch your franchise and begin earning passive income immediately" },
];

const SUB_PLANS = [
  { level: 1, usd: 1000,  pkr: "3,10,000",  daily: 10,  monthly: 500,   income: "$150–$300",   color: "from-slate-600 to-slate-700",   badge: "" },
  { level: 2, usd: 2000,  pkr: "6,20,000",  daily: 16,  monthly: 800,   income: "$250–$500",   color: "from-blue-700 to-blue-800",     badge: "" },
  { level: 3, usd: 3000,  pkr: "9,30,000",  daily: 24,  monthly: 1200,  income: "$400–$750",   color: "from-blue-600 to-indigo-700",   badge: "" },
  { level: 4, usd: 4000,  pkr: "12,40,000", daily: 30,  monthly: 1500,  income: "$550–$950",   color: "from-indigo-600 to-violet-700", badge: "" },
  { level: 5, usd: 5000,  pkr: "15,50,000", daily: 36,  monthly: 1800,  income: "$700–$1,200", color: "from-violet-600 to-purple-700", badge: "⭐ POPULAR" },
  { level: 6, usd: 6000,  pkr: "18,60,000", daily: 44,  monthly: 2200,  income: "$900–$1,500", color: "from-purple-600 to-fuchsia-700", badge: "" },
  { level: 7, usd: 7000,  pkr: "21,70,000", daily: 50,  monthly: 2500,  income: "$1,100–$1,800", color: "from-fuchsia-600 to-pink-700", badge: "" },
  { level: 8, usd: 8000,  pkr: "24,80,000", daily: 56,  monthly: 2800,  income: "$1,400–$2,200", color: "from-pink-600 to-rose-700",   badge: "" },
  { level: 9, usd: 9000,  pkr: "27,90,000", daily: 62,  monthly: 3100,  income: "$1,700–$2,600", color: "from-rose-600 to-orange-700", badge: "" },
  { level: 10, usd: 10000, pkr: "31,00,000", daily: 70, monthly: 3500, income: "$2,000–$3,500",  color: "from-orange-500 to-amber-600", badge: "👑 ELITE" },
];
const HIERARCHY = [
  {
    tier: "Master", icon: "🏙️", tagline: "Control your city",
    invest: "$3,000 – $8,000", investPkr: "PKR 9–25 Lakh",
    income: "$1,000 – $3,000/mo", breakeven: "4–8 months", revenueShare: "8–12%", territory: "2–5 city zones",
    color: "border-emerald-500/50 bg-emerald-950/30", iconBg: "bg-emerald-500/20",
    badge: "bg-emerald-500/30 text-emerald-300", btn: "bg-emerald-600 hover:bg-emerald-500",
    perks: ["Manage sub-franchisees", "EHB logistics access", "Dedicated manager", "24/7 support"],
  },
  {
    tier: "Corporate", icon: "🏢", tagline: "Own your district",
    invest: "$10,000 – $25,000", investPkr: "PKR 31–77 Lakh",
    income: "$2,000 – $8,000/mo", breakeven: "6–12 months", revenueShare: "12–18%", territory: "Full city / sector",
    color: "border-blue-400/70 bg-blue-950/40 shadow-blue-500/20 shadow-lg", iconBg: "bg-blue-500/20",
    badge: "bg-blue-500/30 text-blue-200", btn: "bg-blue-600 hover:bg-blue-500",
    perks: ["Manage 5–20 Masters", "Priority on all modules", "Corporate dashboard", "Weekly strategy calls"],
    highlight: true,
  },
  {
    tier: "Country", icon: "🌍", tagline: "Own your nation",
    invest: "$50,000+", investPkr: "PKR 1.5 Crore+",
    income: "$5,000 – $15,000/mo", breakeven: "10–18 months", revenueShare: "18–25%", territory: "Entire country",
    color: "border-purple-500/50 bg-purple-950/30", iconBg: "bg-purple-500/20",
    badge: "bg-purple-500/30 text-purple-300", btn: "bg-purple-600 hover:bg-purple-500",
    perks: ["Exclusive national rights", "Unlimited Corporate sub-franchises", "Co-branding rights", "Direct EHB global team"],
  },
];

const ROI_DATA = [
  { label: "Level 1–3",  invest: "$1K–$3K",   m3: "$300",   m6: "$700",   m12: "$1,500",  breakeven: "3–5 mo",  bar: 25 },
  { label: "Level 4–7",  invest: "$4K–$7K",   m3: "$600",   m6: "$1,400", m12: "$3,200",  breakeven: "4–6 mo",  bar: 55 },
  { label: "Level 8–10", invest: "$8K–$10K",  m3: "$1,000", m6: "$2,400", m12: "$6,000",  breakeven: "5–7 mo",  bar: 80 },
  { label: "Master",     invest: "$3K–$8K",   m3: "$700",   m6: "$1,800", m12: "$4,500",  breakeven: "4–8 mo",  bar: 65 },
  { label: "Corporate",  invest: "$10K–$25K", m3: "$1,500", m6: "$4,000", m12: "$10,000", breakeven: "6–12 mo", bar: 100 },
];

const FAQS = [
  { q: "Kya main ghar se franchise chala sakta hun?", a: "Haan! EHB franchise 100% digital hai. Aapko office ki zaroorat nahi. Sirf phone aur internet chahiye." },
  { q: "Paise kab milenge? (When do I get paid?)", a: "Har mahine automatic payment hoti hai. Aapke wallet mein seedha transfer hota hai." },
  { q: "Kya main beginner hun to bhi kar sakta hun?", a: "Bilkul! EHB Academy mein full training milti hai. Step by step guide — koi experience zaruri nahi." },
  { q: "Is it safe? Mera paisa secure hai?", a: "Yes. EHB blockchain-verified system use karta hai. Aapka paisa aur data 100% secure hai." },
  { q: "Kitne aadmi ki team chahiye?", a: "Level 1–5 ke liye sirf aap akele kafi hain. Bade levels ke liye 2–5 log ka team helpful hota hai." },
];
export default function FranchisePage() {
  const [selectedArea, setSelectedArea] = useState(AREAS[0]);
  const [activeTab, setActiveTab] = useState("plans");
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <main className="min-h-screen bg-[#05050f] text-white overflow-x-hidden">

      <section className="relative py-16 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/10 to-[#05050f]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-600/10 rounded-full blur-3xl" />
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/15 border border-green-400/30 text-green-300 text-sm font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            EHB Franchise Network — Open in {selectedArea.city} {selectedArea.flag}
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-4 leading-tight">
            <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-purple-400 bg-clip-text text-transparent">Apna Business</span>
            <br /><span className="text-white">Sirf $1,000 Mein</span>
          </h1>
          <p className="text-xl text-white/60 max-w-2xl mx-auto mb-8">
            EHB ka AI-powered franchise lo — 32 industries, global network, aur guaranteed passive income.
            <br /><span className="text-white/40 text-base">No experience needed. Full training included.</span>
          </p>
          <div className="flex flex-wrap justify-center gap-8 mb-10">
            {[
              { icon: "💼", val: "32", label: "Industries" },
              { icon: "🌍", val: "50+", label: "Countries" },
              { icon: "👥", val: "10K+", label: "Franchisees" },
              { icon: "💰", val: "$1K", label: "Min. Investment" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-3xl mb-1">{s.icon}</div>
                <div className="text-2xl font-black text-white">{s.val}</div>
                <div className="text-xs text-white/40 uppercase tracking-wider">{s.label}</div>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            {AREAS.map((area) => (
              <button key={area.id} onClick={() => setSelectedArea(area)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                  selectedArea.id === area.id ? "bg-blue-600/40 border-blue-400 text-white scale-105" : "bg-white/5 border-white/10 text-white/50 hover:text-white"
                }`}>
                {area.flag} {area.city}
              </button>
            ))}
          </div>
        </div>
      </section>
      <section className="py-12 px-4 bg-white/[0.02]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-white mb-2">🗺️ Franchise Kaise Shuru Karein?</h2>
            <p className="text-white/50">5 simple steps — koi bhi kar sakta hai</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
            {STEPS.map((step, i) => (
              <div key={i} className="relative flex flex-col items-center text-center">
                {i < STEPS.length - 1 && <div className="hidden sm:block absolute top-8 left-[60%] w-full h-0.5 bg-gradient-to-r from-blue-500/50 to-transparent z-0" />}
                <div className="relative z-10 w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-2xl mb-3 shadow-lg shadow-blue-500/20">{step.icon}</div>
                <div className="text-xs font-bold text-blue-400 mb-1">STEP {step.num}</div>
                <div className="text-sm font-bold text-white mb-1">{step.title}</div>
                <div className="text-xs text-white/40">{step.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-6 px-4 sticky top-0 z-30 bg-[#05050f]/90 backdrop-blur-md border-b border-white/5">
        <div className="max-w-5xl mx-auto flex gap-2 flex-wrap justify-center">
          {[
            { key: "plans", icon: "💼", label: "Franchise Plans" },
            { key: "hierarchy", icon: "🌐", label: "Tier System" },
            { key: "roi", icon: "📈", label: "ROI & Income" },
            { key: "training", icon: "🎓", label: "Training" },
          ].map((tab) => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold border transition-all ${
                activeTab === tab.key ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/30" : "bg-white/5 border-white/10 text-white/60 hover:text-white"
              }`}>
              <span>{tab.icon}</span> {tab.label}
            </button>
          ))}
        </div>
      </section>
      {activeTab === "plans" && (
        <section className="py-10 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-black text-white mb-2">💼 Apna Plan Chunein</h2>
              <p className="text-white/50">Sab plans mein: AI system + delivery network + passive income included</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {SUB_PLANS.map((plan) => (
                <div key={plan.level} className="relative rounded-2xl border border-white/10 overflow-hidden hover:scale-[1.03] transition-all">
                  <div className={`bg-gradient-to-br ${plan.color} p-4 text-center relative`}>
                    {plan.badge && <div className="absolute -top-1 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-white text-[10px] font-black text-gray-900 rounded-full">{plan.badge}</div>}
                    <div className="text-xs text-white/60 uppercase tracking-widest mb-1">Level {plan.level}</div>
                    <div className="text-3xl font-black text-white">${plan.usd.toLocaleString()}</div>
                    <div className="text-xs text-white/50 mt-0.5">PKR {plan.pkr}</div>
                  </div>
                  <div className="bg-white/[0.04] p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-white/40">Daily Orders</span>
                      <span className="text-sm font-bold text-cyan-400">{plan.daily} 📦</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-white/40">Monthly Orders</span>
                      <span className="text-sm font-bold text-blue-400">{plan.monthly.toLocaleString()}</span>
                    </div>
                    <div className="pt-2 border-t border-white/5">
                      <div className="text-xs text-white/40 mb-1">Monthly Income</div>
                      <div className="text-base font-black text-green-400">{plan.income} 💰</div>
                    </div>
                    <button className="w-full py-2 rounded-lg bg-white/10 hover:bg-white/20 text-xs text-white font-semibold transition-all">Apply Now →</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 text-center">
              <p className="text-white/30 text-sm">✅ Sab levels mein: Passive income · AI order matching · 24/7 support · EHB Academy access</p>
            </div>
          </div>
        </section>
      )}
      {activeTab === "hierarchy" && (
        <section className="py-10 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-black text-white mb-2">🌐 Franchise Tier System</h2>
              <p className="text-white/50">Choti city se puri country tak — har level mein opportunities hain</p>
            </div>
            <div className="flex justify-center mb-10">
              <div className="flex flex-col items-center gap-1 text-center">
                <div className="px-6 py-2 bg-purple-600/30 border border-purple-500/50 rounded-xl text-purple-300 font-bold text-sm">🌍 Country Franchise</div>
                <div className="text-white/20 text-lg">▼</div>
                <div className="px-6 py-2 bg-blue-600/30 border border-blue-400/50 rounded-xl text-blue-300 font-bold text-sm">🏢 Corporate Franchise</div>
                <div className="text-white/20 text-lg">▼</div>
                <div className="px-6 py-2 bg-emerald-600/20 border border-emerald-500/40 rounded-xl text-emerald-300 font-bold text-sm">🏙️ Master Franchise</div>
                <div className="text-white/20 text-lg">▼</div>
                <div className="px-6 py-2 bg-white/5 border border-white/10 rounded-xl text-white/60 font-bold text-sm">💼 Sub-Franchise (Level 1–10)</div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {HIERARCHY.map((h) => (
                <div key={h.tier} className={`relative rounded-2xl border p-6 transition-all hover:scale-[1.02] ${h.color}`}>
                  {h.highlight && <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-blue-500 text-white text-xs font-black rounded-full">⭐ BEST VALUE</div>}
                  <div className={`w-14 h-14 rounded-2xl ${h.iconBg} flex items-center justify-center text-3xl mb-4`}>{h.icon}</div>
                  <h3 className="text-xl font-black text-white mb-1">{h.tier} Franchise</h3>
                  <p className="text-white/50 text-sm mb-5">{h.tagline}</p>
                  <div className="space-y-3 mb-5">
                    {[
                      { label: "💰 Investment", value: h.invest, sub: h.investPkr },
                      { label: "📈 Monthly Income", value: h.income, sub: `Break-even: ${h.breakeven}` },
                      { label: "🌐 Revenue Share", value: h.revenueShare, sub: "" },
                      { label: "📍 Territory", value: h.territory, sub: "" },
                    ].map((row) => (
                      <div key={row.label} className="bg-black/20 rounded-xl p-3">
                        <div className="text-xs text-white/40">{row.label}</div>
                        <div className="font-bold text-white">{row.value}</div>
                        {row.sub && <div className="text-xs text-white/30 mt-0.5">{row.sub}</div>}
                      </div>
                    ))}
                  </div>
                  <div className="space-y-1.5 mb-5">
                    {h.perks.map((p) => (
                      <div key={p} className="flex items-center gap-2 text-sm text-white/70"><span className="text-green-400 text-xs">✓</span> {p}</div>
                    ))}
                  </div>
                  <button className={`w-full py-3 rounded-xl ${h.btn} text-white font-bold text-sm transition-all`}>Apply for {h.tier} Franchise →</button>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
      {activeTab === "roi" && (
        <section className="py-10 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-black text-white mb-2">📈 Income & ROI Calculator</h2>
              <p className="text-white/50">Real numbers — kab aapka paisa wapas aayega</p>
            </div>
            <div className="space-y-4 mb-10">
              <div className="grid grid-cols-6 gap-2 text-xs text-white/30 uppercase tracking-wider px-4">
                <span>Plan</span><span>Investment</span><span>Month 3</span><span>Month 6</span><span>Month 12</span><span>Break-even</span>
              </div>
              {ROI_DATA.map((row) => (
                <div key={row.label} className="bg-white/5 border border-white/5 rounded-2xl p-4 hover:bg-white/8 transition-all">
                  <div className="grid grid-cols-6 gap-2 items-center">
                    <span className="font-bold text-white text-sm">{row.label}</span>
                    <span className="text-white/60 text-sm">{row.invest}</span>
                    <span className="text-yellow-400 font-bold text-sm">{row.m3}</span>
                    <span className="text-orange-400 font-bold text-sm">{row.m6}</span>
                    <span className="text-green-400 font-bold text-sm">{row.m12}</span>
                    <span className="text-cyan-400 text-sm">{row.breakeven}</span>
                  </div>
                  <div className="mt-3 bg-white/5 rounded-full h-2">
                    <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-green-400" style={{ width: `${row.bar}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-black text-white mb-6">📊 Growth Chart — Level 5 Franchise</h3>
              <div className="space-y-4">
                {[
                  { month: "Month 1", income: "$150", pct: 15 },
                  { month: "Month 2", income: "$300", pct: 30 },
                  { month: "Month 3", income: "$500", pct: 50 },
                  { month: "Month 6", income: "$800", pct: 80 },
                  { month: "Month 12", income: "$1,200+", pct: 100 },
                ].map((row) => (
                  <div key={row.month} className="flex items-center gap-4">
                    <div className="w-20 text-xs text-white/50">{row.month}</div>
                    <div className="flex-1 bg-white/5 rounded-full h-5 overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-blue-600 to-green-500" style={{ width: `${row.pct}%` }} />
                    </div>
                    <div className="w-24 text-right"><span className="text-green-400 font-bold text-sm">{row.income}</span></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
      {activeTab === "training" && (
        <section className="py-10 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-black text-white mb-2">🎓 EHB Academy — Free Training</h2>
              <p className="text-white/50">Koi experience nahi? Hum sikhayenge!</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gradient-to-br from-yellow-900/20 to-orange-900/10 border border-yellow-500/20 rounded-2xl p-6">
                <div className="text-4xl mb-3">🎓</div>
                <h3 className="text-xl font-black text-white mb-3">EHB Academy</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: "📱", title: "Mobile App", desc: "Koi bhi device pe" },
                    { icon: "🌐", title: "Urdu + English", desc: "Apni bhasha mein" },
                    { icon: "🎥", title: "Video Courses", desc: "Step by step" },
                    { icon: "📋", title: "SOPs Included", desc: "Complete guides" },
                  ].map((item) => (
                    <div key={item.title} className="bg-black/20 rounded-xl p-3 text-center">
                      <div className="text-xl mb-1">{item.icon}</div>
                      <div className="text-sm font-bold text-white">{item.title}</div>
                      <div className="text-xs text-white/40">{item.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <div className="text-4xl mb-3">📞</div>
                <h3 className="text-xl font-black text-white mb-4">Live Support</h3>
                <div className="space-y-3">
                  {[
                    { icon: "💬", title: "WhatsApp 24/7", desc: "Instant response", color: "text-green-400" },
                    { icon: "🗓️", title: "Weekly Live Calls", desc: "Mon, Wed, Fri", color: "text-blue-400" },
                    { icon: "👥", title: "Partner Community", desc: "Private network", color: "text-purple-400" },
                    { icon: "🎫", title: "Ticket System", desc: "24hr resolution", color: "text-orange-400" },
                  ].map((ch) => (
                    <div key={ch.title} className="flex items-center gap-3">
                      <span className={`text-xl ${ch.color}`}>{ch.icon}</span>
                      <div>
                        <div className="text-sm font-bold text-white">{ch.title}</div>
                        <div className="text-xs text-white/40">{ch.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-black text-white mb-4">📦 Kya Kya Milega?</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {["📘 Operations Manual","✅ Daily Checklists","📞 Customer Scripts","🎨 Marketing Templates","💰 Income Tracker","🔧 Admin Guide","📊 Pricing Guidelines","🛡️ Dispute SOP"].map((item) => (
                  <div key={item} className="bg-black/20 rounded-xl p-3 text-sm text-white/70">{item}</div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="py-12 px-4 bg-white/[0.02]">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-white mb-2">❓ Aksar Puchhe Jane Wale Sawalat</h2>
          </div>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between p-5 text-left hover:bg-white/5 transition-all">
                  <span className="font-semibold text-white pr-4">{faq.q}</span>
                  <span className={`text-blue-400 transition-transform ${openFaq === i ? "rotate-180" : ""}`}>▼</span>
                </button>
                {openFaq === i && <div className="px-5 pb-5 text-white/60 text-sm leading-relaxed border-t border-white/5 pt-4">{faq.a}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="bg-gradient-to-r from-blue-900/40 via-purple-900/30 to-cyan-900/40 border border-blue-400/20 rounded-3xl p-10">
            <div className="text-5xl mb-4">🚀</div>
            <h2 className="text-3xl font-black text-white mb-3">Aaj Hi Shuru Karein — {selectedArea.flag} {selectedArea.city}</h2>
            <p className="text-white/60 mb-8">24 ghante mein approval. Sirf $1,000 se apna digital business shuru karein.</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button className="px-8 py-4 bg-blue-600 hover:bg-blue-500 rounded-2xl text-white font-black text-lg shadow-xl shadow-blue-500/30 transition-all hover:scale-105">
                Apply Karein — {selectedArea.city} 🚀
              </button>
              <Link href="/home" className="px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl text-white font-semibold transition-all">
                EHB Platform Dekhein →
              </Link>
            </div>
            <p className="mt-6 text-white/30 text-sm">✅ No hidden fees · ✅ Cancel anytime · ✅ Full training included</p>
          </div>
        </div>
      </section>
    </main>
  );
              }
