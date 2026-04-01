import Link from "next/link";
import Image from "next/image";
import { getIndustryBySlug } from "@/lib/industries";
import { getCityByCode, getCountryByCode, getStateByCode } from "@/lib/locations";

type AiTool = {
  title: string;
  arrowLine: string;
  accent: string;
  emoji: string;
};

const TOOL_INFO: AiTool[] = [
  { title: "AI Lawyer", arrowLine: "→ Legal advice, compliance, contracts", accent: "#6B7280", emoji: "⚖️" },
  { title: "AI Doctor", arrowLine: "→ Medical guidance & health support", accent: "#00AEEF", emoji: "🩺" },
  { title: "AI Resume Builder", arrowLine: "→ Professional CV generation", accent: "#22C55E", emoji: "💼" },
  { title: "AI Contract Generator", arrowLine: "→ Automated legal agreements", accent: "#8B5CF6", emoji: "🧾" },
  { title: "AI Travel Planner", arrowLine: "→ Smart trip planning", accent: "#0EA5E9", emoji: "✈️" },
];

const trendingProducts = [
  { name: "CleanMaster AI", price: "$0.99", badge: "VIC", tier: "VIP", stars: 5, image: "/images/ai-market/cleanmaster-ai.png" },
  { name: "SpeakEase Pro", price: "$5.59", badge: "COM", tier: "PRO", stars: 5, image: "/images/ai-market/speakease-pro.png" },
  { name: "eGuard Home Security", price: "$5.99", badge: "HOME", tier: "Secure", stars: 4, image: "/images/ai-market/eguard-home-security.png" },
  { name: "SmartFit Tracker HR", price: "$199", badge: "HEALTH", tier: "Wearable", stars: 5, image: "/images/ai-market/smartfit-tracker-hr.png" },
  { name: "QuantumForge Laptop", price: "$899", badge: "VIE", tier: "Creator", stars: 5, image: "/images/ai-market/quantumforge-laptop.png" },
  { name: "BrightSync Smart Light", price: "Free", badge: "IOT", tier: "Starter", stars: 4, image: "/images/ai-market/brightsync-smart-light.png" },
];

const freeTools = [
  { name: "AIChatBot Pro", tag: "Support", stars: 5, image: "/images/ai-market/aichatbot-pro.png" },
  { name: "QuickNote AI", tag: "Workspace", stars: 5, image: "/images/ai-market/quicknote-ai.png" },
  { name: "SecureTrans VPN", tag: "Security", stars: 4, image: "/images/ai-market/securetrans-vpn.png" },
  { name: "DocVerify AI", tag: "Verification", stars: 5, image: "/images/ai-market/docverify-ai.png" },
];

export default function AIMarketplacePage({
  searchParams,
}: {
  searchParams?: { tool?: string; industry?: string; country?: string; state?: string; city?: string };
}) {
  const selectedToolTitle = searchParams?.tool?.trim() || "";
  const selectedTool = TOOL_INFO.find((t) => t.title === selectedToolTitle) || null;
  const selectedIndustrySlug = searchParams?.industry?.trim() || "";
  const selectedIndustry = selectedIndustrySlug ? getIndustryBySlug(selectedIndustrySlug) : undefined;

  const selectedCountryCode = searchParams?.country?.trim() || "";
  const selectedStateCode = searchParams?.state?.trim() || "";
  const selectedCityCode = searchParams?.city?.trim() || "";

  const selectedCountry = selectedCountryCode ? getCountryByCode(selectedCountryCode) : undefined;
  const selectedState =
    selectedCountryCode && selectedStateCode ? getStateByCode(selectedCountryCode, selectedStateCode) : undefined;
  const selectedCity =
    selectedCountryCode && selectedStateCode && selectedCityCode
      ? getCityByCode(selectedCountryCode, selectedStateCode, selectedCityCode)
      : undefined;

  const locationAccent = selectedCountry?.accent ?? "#00AEEF";
  const locationLabel = selectedCity?.name || selectedState?.name || selectedCountry?.name || "";

  const makeHref = (toolTitle: string) => {
    const params = new URLSearchParams();
    params.set("tool", toolTitle);
    if (selectedIndustrySlug) params.set("industry", selectedIndustrySlug);
    if (selectedCountryCode) params.set("country", selectedCountryCode);
    if (selectedStateCode) params.set("state", selectedStateCode);
    if (selectedCityCode) params.set("city", selectedCityCode);
    return `/ai-marketplace?${params.toString()}`;
  };

  const allListingsHref = (() => {
    const params = new URLSearchParams();
    if (selectedToolTitle) params.set("tool", selectedToolTitle);
    if (selectedIndustrySlug) params.set("industry", selectedIndustrySlug);
    if (selectedCountryCode) params.set("country", selectedCountryCode);
    if (selectedStateCode) params.set("state", selectedStateCode);
    if (selectedCityCode) params.set("city", selectedCityCode);
    const qs = params.toString();
    return qs ? `/ai-marketplace?${qs}#all` : `/ai-marketplace#all`;
  })();

  return (
    <main className="flex-1 overflow-auto">
      {/* Hero – full-width, premium */}
      <section className="relative border-b border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(0,234,255,0.12),transparent_55%),radial-gradient(circle_at_90%_10%,rgba(59,130,246,0.12),transparent_60%)] pointer-events-none" />
        <div className="container-ehb py-10 md:py-14 lg:py-16 relative flex flex-col lg:flex-row gap-10 lg:gap-14 items-start">
          <div className="max-w-xl space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#00eaff]/40 glass-panel px-3 py-1 text-[11px] text-cyan-200 shadow-neon-blue">
              <span className="h-1.5 w-1.5 rounded-full bg-[#00eaff]" />
              AI Marketplace · Verified by EHB
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400 mb-2">
                Trusted Global AI & Products Exchange
              </p>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight gradient-text">
                Explore Top AI Verified
                <br />
                Tools & Products
              </h1>
            </div>
            <p className="text-slate-300 text-sm md:text-base max-w-lg">
              Every item is protected by{" "}
              <span className="font-semibold text-cyan-300">EHB Trusty Wallet</span> and{" "}
              <span className="font-semibold text-[#8b5cf6]">Franchise Monitoring System</span> so your
              AI, hardware and daily services are always safe and compliant.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/ai-marketplace#products"
                className="min-h-touch inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#00eaff] to-[#3b82f6] px-6 py-2.5 text-sm font-semibold text-slate-950 btn-glow"
              >
                Shop Now
                <span className="text-xs">→</span>
              </Link>
              <button
                type="button"
                className="min-h-touch inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs md:text-sm text-slate-200 hover:bg-white/10 transition-colors"
              >
                View Trusty Wallet rules
              </button>
            </div>
            <div className="flex flex-wrap gap-4 text-[11px] text-slate-400">
              <div className="flex items-center gap-1.5">
                <span className="text-emerald-400">●</span> 100% Verified Sellers
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-amber-300">★</span> Live franchise monitoring
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-sky-300">◆</span> STL settlement in minutes
              </div>
            </div>
          </div>

          {/* Right side – laptop + floating tiles (simple version of your reference) */}
          <div className="relative w-full max-w-md lg:max-w-lg mx-auto">
            <div className="relative rounded-3xl glass-card card-interactive overflow-hidden p-5 md:p-6">
              <div className="card-shine-inner" />
              <div className="flex items-center justify-between mb-4 text-xs text-slate-300">
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Live AI Products
                </span>
                <span className="text-slate-400">EHB SQL & STL Engine</span>
              </div>
              <div className="relative h-40 md:h-44 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900/40 to-slate-800 border border-white/10 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_0%,rgba(34,211,238,0.25),transparent_55%),radial-gradient(circle_at_85%_100%,rgba(139,92,246,0.28),transparent_60%)] opacity-80" />
                <div className="relative z-10 text-center space-y-1">
                  <div className="text-[11px] tracking-[0.32em] text-slate-300 uppercase">
                    EHB · AI MARKET
                  </div>
                  <div className="text-lg md:text-xl font-semibold text-white">
                    QuantumForge Laptop
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Optimized for AI terminals, EHB SQL, and STL dashboards.
                  </p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3 text-[11px]">
                <div className="rounded-xl bg-[#020c1b]/80 border border-cyan-400/25 px-3 py-2 flex flex-col gap-0.5">
                  <span className="text-slate-400">Avg. Rating</span>
                  <span className="font-semibold text-cyan-300">4.9 / 5.0</span>
                </div>
                <div className="rounded-xl bg-[#020c1b]/80 border border-emerald-400/25 px-3 py-2 flex flex-col gap-0.5">
                  <span className="text-slate-400">Verified Trades</span>
                  <span className="font-semibold text-emerald-300">28.4K</span>
                </div>
                <div className="rounded-xl bg-[#020c1b]/80 border border-violet-400/25 px-3 py-2 flex flex-col gap-0.5">
                  <span className="text-slate-400">Trust Score</span>
                  <span className="font-semibold text-violet-200">99.2%</span>
                </div>
              </div>
            </div>
            {/* floating tiles */}
            <div className="pointer-events-none">
              <div className="absolute -top-4 -right-2 w-24 h-16 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 blur-[1px]" />
              <div className="absolute -bottom-6 -left-4 w-28 h-20 rounded-2xl bg-violet-500/20 border border-violet-400/40 blur-[1px]" />
            </div>
          </div>
        </div>
      </section>

      {/* Main content sections */}
      <section className="container-ehb py-8 md:py-10 space-y-10">
        {/* Universal AI tools (structured data from EHB) */}
        <section className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">AI Tools · Verified</p>
              <h2 className="text-lg md:text-xl font-semibold text-white">
                {selectedTool ? selectedTool.title : "Top Trusted AI Services"}
              </h2>
              <p className="text-[12px] text-slate-400">
                {selectedTool
                  ? selectedTool.arrowLine
                  : "AI tools that plug into EHB verified trust flows across industries."}
              </p>
              {selectedIndustry ? (
                <div
                  className="mt-3 inline-flex items-center gap-2 rounded-full glass-panel px-3 py-1 text-[11px] text-slate-200 border"
                  style={{ borderColor: `${selectedIndustry.accentColor}55`, boxShadow: `0 0 28px ${selectedIndustry.accentColor}22` }}
                >
                  <span aria-hidden>🌐</span>
                  <span>
                    Industry context: <span className="text-white font-semibold">{selectedIndustry.name}</span>
                  </span>
                </div>
              ) : null}

              {locationLabel ? (
                <div
                  className="mt-2 inline-flex items-center gap-2 rounded-full glass-panel px-3 py-1 text-[11px] text-slate-200 border"
                  style={{ borderColor: `${locationAccent}55`, boxShadow: `0 0 28px ${locationAccent}22` }}
                >
                  <span aria-hidden>📍</span>
                  <span>
                    Near you: <span className="text-white font-semibold">{locationLabel}</span>
                  </span>
                </div>
              ) : null}
            </div>
          </div>

          <div id="tools" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {TOOL_INFO.map((t) => {
              const isActive = t.title === selectedToolTitle;
              return (
                <div
                  key={t.title}
                  className="rounded-2xl glass-card border p-5 card-hover transition-all duration-300"
                  style={{
                    borderColor: isActive ? `${t.accent}88` : `${t.accent}40`,
                    boxShadow: isActive ? `0 0 32px ${t.accent}22` : `0 0 22px ${t.accent}12`,
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="h-11 w-11 rounded-2xl flex items-center justify-center text-lg border"
                      style={{
                        backgroundColor: `${t.accent}18`,
                        borderColor: `${t.accent}33`,
                        boxShadow: `0 0 18px ${t.accent}22`,
                      }}
                      aria-hidden
                    >
                      {t.emoji}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white">{t.title}</p>
                      <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">{t.arrowLine}</p>
                      <div className="mt-3">
                        <Link
                          href={makeHref(t.title)}
                          className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[11px] text-slate-200 hover:bg-white/10 transition-colors w-full"
                        >
                          Open tool
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Trending AI Verified Products */}
        <div id="products" className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">
                Marketplace · Realtime Demand
              </p>
              <h2 className="text-lg md:text-xl font-semibold text-white">Trending AI Verified Products</h2>
              <p className="text-[12px] text-slate-400">
                Cross‑industry AI, devices and smart services curated by EHB franchise network.
              </p>
            </div>
            <Link
              href={allListingsHref}
              className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-1.5 text-[11px] text-slate-200 hover:bg-white/5"
            >
              See all listings
              <span className="text-xs">↗</span>
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {trendingProducts.map((p) => (
              <div
                key={p.name}
                className="group relative rounded-2xl glass-card card-interactive p-3.5 flex flex-col gap-2"
              >
                <div className="relative aspect-square rounded-xl bg-[#020c1b]/80 border border-white/10 flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(34,211,238,0.36),transparent_55%),radial-gradient(circle_at_100%_100%,rgba(139,92,246,0.36),transparent_60%)] opacity-70 group-hover:opacity-90 transition-opacity" />
                  <div className="relative z-10 w-full h-full flex items-center justify-center p-3">
                    <Image src={p.image} alt={p.name} width={120} height={120} className="object-contain w-full h-full" />
                  </div>
                  <div className="absolute top-1.5 left-1.5 inline-flex items-center gap-1 rounded-full bg-[#020c1b]/90 border border-white/25 px-1.5 py-0.5 text-[9px] text-slate-100">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    {p.tier}
                  </div>
                  <div className="absolute top-1.5 right-1.5 rounded-full bg-[#00eaff] text-[9px] font-semibold px-1.5 py-0.5 text-slate-950 shadow-neon-blue">
                    {p.badge}
                  </div>
                </div>
                <div className="flex-1 flex flex-col gap-1">
                  <p className="card-title text-xs font-medium text-white leading-snug line-clamp-2">
                    {p.name}
                  </p>
                  <p className="card-body text-[10px] text-slate-400 flex items-center justify-between">
                    <span className="text-amber-300">{"★".repeat(p.stars)}</span>
                    <span className="text-cyan-300 font-semibold">{p.price}</span>
                  </p>
                </div>
                <button
                  type="button"
                  className="mt-1 inline-flex items-center justify-center w-full rounded-xl bg-cyan-500/80 text-slate-950 text-[11px] font-semibold py-1.5 hover:bg-cyan-400 transition-colors"
                >
                  Add to EHB Cart
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Top Trusted Free Tools */}
        <div id="free" className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">
                EHB Verified · Free Tier
              </p>
              <h2 className="text-lg md:text-xl font-semibold text-white">Top Trusted Free Tools</h2>
              <p className="text-[12px] text-slate-400">
                Launch‑ready AI utilities that plug directly into EHB Home, SQL verification and STL flows.
              </p>
            </div>
            <Link
              href="/ai-marketplace#tools"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-emerald-400/40 bg-emerald-500/10 px-3 py-1.5 text-[11px] text-emerald-200 hover:bg-emerald-500/20"
            >
              View all free tools
              <span className="text-xs">↗</span>
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {freeTools.map((p) => (
              <div
                key={p.name}
                className="group relative rounded-2xl glass-card card-interactive p-3.5 flex flex-col gap-2"
              >
                <div className="relative aspect-square rounded-xl bg-[#020c1b]/80 border border-emerald-400/30 flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(16,185,129,0.3),transparent_55%),radial-gradient(circle_at_100%_100%,rgba(45,212,191,0.28),transparent_60%)] opacity-80 group-hover:opacity-95 transition-opacity" />
                  <div className="relative z-10 w-full h-full flex items-center justify-center p-3">
                    <Image src={p.image} alt={p.name} width={120} height={120} className="object-contain w-full h-full" />
                  </div>
                  <div className="absolute top-1.5 left-1.5 rounded-full bg-[#020c1b]/90 border border-white/25 px-1.5 py-0.5 text-[9px] text-emerald-100">
                    {p.tag}
                  </div>
                  <div className="absolute top-1.5 right-1.5 rounded-full bg-emerald-500 text-[9px] font-semibold px-1.5 py-0.5 text-slate-950">
                    FREE
                  </div>
                </div>
                <div className="flex-1 flex flex-col gap-1">
                  <p className="card-title text-xs font-medium text-white leading-snug line-clamp-2">
                    {p.name}
                  </p>
                  <p className="card-body text-[10px] text-slate-400 flex items-center justify-between">
                    <span className="text-emerald-300">{"★".repeat(p.stars)}</span>
                    <span className="text-emerald-300 font-semibold">EHB Verified</span>
                  </p>
                </div>
                <button
                  type="button"
                  className="mt-1 inline-flex items-center justify-center w-full rounded-xl bg-emerald-500/80 text-slate-950 text-[11px] font-semibold py-1.5 hover:bg-emerald-400 transition-colors"
                >
                  Add to Workspace
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Essential Marketplace Items */}
        <div className="space-y-4 pb-6 md:pb-10">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">
                Everyday Ecosystem · 32+ Industries
              </p>
              <h2 className="text-lg md:text-xl font-semibold text-white">Essential Marketplace Items</h2>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
            {["Daily Goods", "Electronics", "VR & Gaming", "Food & Beverage", "Health", "Education"].map(
              (name) => (
                <div
                  key={name}
                  className="group rounded-2xl glass-card card-interactive p-3.5 flex flex-col gap-2"
                >
                  <div className="relative aspect-square rounded-xl bg-[#020c1b]/80 border border-white/12 flex items-center justify-center text-xl overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(56,189,248,0.28),transparent_55%),radial-gradient(circle_at_100%_100%,rgba(59,130,246,0.3),transparent_60%)] opacity-70 group-hover:opacity-90 transition-opacity" />
                    <span className="relative z-10">📦</span>
                  </div>
                  <p className="text-xs font-medium text-white truncate">{name}</p>
                  <button
                    type="button"
                    className="mt-1 inline-flex items-center justify-center rounded-xl border border-cyan-400/40 bg-cyan-500/10 text-cyan-200 text-[10px] font-medium py-1.5 hover:bg-cyan-500/20 transition-colors"
                  >
                    Browse category
                  </button>
                </div>
              )
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
