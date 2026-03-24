import { KpiCard } from "@/components/ui/KpiCard";
import { DmoCard } from "@/components/ui/DmoCard";
import { UniversalStructuredAdminBlocks } from "@/components/admin/UniversalStructuredAdminBlocks";
import { MarketplaceSection } from "@/components/marketplace/MarketplaceSection";
import { DmoTopNav } from "@/components/dmo/DmoTopNav";

const dmoModules = [
  "Identity & JPS Profiles",
  "PSS – Proof & Security System",
  "CRB – Certification & Registry Board",
  "STL – Trust Level Engine",
  "Wallet & Finance",
  "Applications & Approvals",
  "Certificates & Registry",
  "Notifications & Compliance",
  "Blockchain Anchoring"
];

export default function DmoPage({
  searchParams,
}: {
  searchParams?: { country?: string; state?: string; city?: string };
}) {
  const locationQs = (() => {
    const countryCode = searchParams?.country?.trim() || "";
    const stateCode = searchParams?.state?.trim() || "";
    const cityCode = searchParams?.city?.trim() || "";
    const sp = new URLSearchParams();
    if (countryCode) sp.set("country", countryCode);
    if (stateCode) sp.set("state", stateCode);
    if (cityCode) sp.set("city", cityCode);
    const qs = sp.toString();
    return qs ? `?${qs}` : "";
  })();

  return (
    <main className="min-h-screen text-slate-100">
      <div className="container-ehb py-6 sm:py-8 space-y-5 sm:space-y-6 text-[10px] xs:text-[11px]">
        <section className="space-y-1.5">
          <p className="inline-flex items-center gap-2 rounded-full glass-panel border border-[#00eaff]/40 px-3 py-1.5 text-[10px] xs:text-[11px] font-medium text-[#00eaff]">
            DMO · Decentralized Management Office
          </p>
          <h1 className="text-lg sm:text-xl md:text-2xl font-semibold leading-tight gradient-text">
            Core operating layer connecting verification, trust, wallet and governance.
          </h1>
          <p className="text-slate-300 max-w-2xl">
            Ye page sirf demo UI hai – real development mein isi dashboard ko DMO microservices ke
            saath connect kiya jayega (PSS, CRB, STL, Wallet, Applications & Approvals, Blockchain).
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            <a href="/home" className="min-h-touch inline-flex items-center justify-center rounded-full glass-panel px-3 py-1.5 font-semibold text-white hover:shadow-neon-blue transition-all duration-200">← Back to EHB Home</a>
            <a href="/admin" className="min-h-touch inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#00eaff] to-[#3b82f6] px-3 py-1.5 font-semibold text-slate-950 btn-glow">Open Super Admin Panel</a>
          </div>
        </section>

        <DmoTopNav />

        <section className="grid gap-3 grid-cols-1 sm:grid-cols-3">
          <KpiCard label="Core Modules" value={dmoModules.length} detail="Identity, PSS, CRB, STL, Wallet, Workflow, Registry, Notifications, Blockchain." />
          <KpiCard label="Primary Data Domains" value="4" detail="Identity · Verification · Trust & Finance · Workflow & System." />
          <KpiCard label="Connected Apps" value="4+" detail="GoSellr, WMS, OLS, AGTS – and future EHB modules." />
        </section>

        <section>
          <DmoCard />
        </section>

        <section className="space-y-3">
          <h2 className="text-xs font-semibold text-slate-100">Phase 4 — Service Platforms</h2>
          <p className="text-[10px] xs:text-[11px] text-slate-300">
            WMS, AGTS, OLS, SOT, HPS are connected modules that extend the verified ecosystem beyond core DMO flows.
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {[
              { href: "/wms", label: "WMS", name: "Medical & Health", accent: "#00AEEF" },
              { href: "/agts", label: "AGTS", name: "Travel & Tourism", accent: "#0EA5E9" },
              { href: "/ols", label: "OLS", name: "Legal Services", accent: "#6B7280" },
              { href: "/sot", label: "SOT", name: "Operations & Training", accent: "#22C55E" },
              { href: "/hps", label: "HPS", name: "Education & Learning", accent: "#E53935" },
            ].map((p) => (
              <a
                key={p.href}
                href={p.href}
                className="glass-card card-hover rounded-2xl border px-3 py-3 flex flex-col justify-between min-h-[92px]"
                style={{ borderColor: `${p.accent}30`, boxShadow: `0 0 26px ${p.accent}12` }}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-semibold text-white">{p.label}</span>
                  <span aria-hidden className="text-[13px]">↗</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-2 leading-relaxed">{p.name}</div>
              </a>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-xs font-semibold text-slate-100">Phase 5 — Digital Governance</h2>
          <p className="text-[10px] xs:text-[11px] text-slate-300">
            Applications, approvals, licenses registry and compliance notifications — with trust stack meaning always visible.
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { href: "/governance", title: "Governance Hub", name: "Applications & Licenses", accent: "rgba(0,234,255,0.35)" },
              { href: "/admin/development", title: "Approvals Board", name: "Workflow engine (demo)", accent: "rgba(59,130,246,0.35)" },
              { href: "/ai-marketplace", title: "AI Compliance", name: "Governance AI tools", accent: "rgba(139,92,246,0.35)" },
            ].map((p) => (
              <a
                key={p.href}
                href={p.href}
                className="glass-card card-hover rounded-2xl border px-3 py-3 flex flex-col justify-between min-h-[92px]"
                style={{ borderColor: `${p.accent}`, boxShadow: `0 0 26px ${p.accent}` }}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-semibold text-white">{p.title}</span>
                  <span aria-hidden className="text-[13px]">
                    ↗
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 mt-2 leading-relaxed">{p.name}</div>
              </a>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-xs font-semibold text-slate-100">Phase 6 — Global Expansion</h2>
          <p className="text-[10px] xs:text-[11px] text-slate-300">
            Multi-country onboarding with unified trust. Franchise cities expand while DMO keeps approvals consistent.
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { href: "/global", title: "Global Coverage", name: "Country readiness dashboard", accent: "rgba(0,234,255,0.35)" },
              { href: "/admin/global", title: "Super Admin Control", name: "Country onboarding governance", accent: "rgba(59,130,246,0.35)" },
              { href: "/franchise", title: "Franchise Expansion", name: "Book your area in batches", accent: "rgba(245,158,11,0.35)" },
            ].map((p) => (
              <a
                key={p.href}
                href={p.href}
                className="glass-card card-hover rounded-2xl border px-3 py-3 flex flex-col justify-between min-h-[92px]"
                style={{ borderColor: `${p.accent}`, boxShadow: `0 0 26px ${p.accent}` }}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-semibold text-white">{p.title}</span>
                  <span aria-hidden className="text-[13px]">
                    ↗
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 mt-2 leading-relaxed">{p.name}</div>
              </a>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-xs font-semibold text-slate-100">Phase 7 — AI Ecosystem</h2>
          <p className="text-[10px] xs:text-[11px] text-slate-300">
            ML opportunity scoring, fraud detection shields, and NLP compliance summaries — all mapped to EHB trust layers.
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { href: "/ai-ecosystem", title: "AI Ecosystem", name: "ML + Fraud + NLP engine (demo)", accent: "rgba(0,174,239,0.35)" },
              { href: "/admin/ai-ecosystem", title: "Super Admin Controls", name: "Rules + monitoring configuration", accent: "rgba(139,92,246,0.35)" },
              { href: "/ai-marketplace", title: "Marketplace Match", name: "Trusted tools connected via AI", accent: "rgba(34,197,94,0.35)" },
            ].map((p) => (
              <a
                key={p.href}
                href={p.href}
                className="glass-card card-hover rounded-2xl border px-3 py-3 flex flex-col justify-between min-h-[92px]"
                style={{ borderColor: `${p.accent}`, boxShadow: `0 0 26px ${p.accent}` }}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-semibold text-white">{p.title}</span>
                  <span aria-hidden className="text-[13px]">
                    ↗
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 mt-2 leading-relaxed">{p.name}</div>
              </a>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-xs font-semibold text-slate-100">Phase 8 — Blockchain Governance</h2>
          <p className="text-[10px] xs:text-[11px] text-slate-300">
            Trust anchors + smart contract settlement integrity. Keep verification tamper-aware and investor-ready.
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                href: "/blockchain-governance",
                title: "Blockchain Governance",
                name: "Trust network + anchors (demo)",
                accent: "rgba(0,174,239,0.35)",
              },
              {
                href: "/admin/blockchain-governance",
                title: "Super Admin Control",
                name: "Validator + contract monitoring",
                accent: "rgba(139,92,246,0.35)",
              },
              {
                href: "/admin/blockchain",
                title: "Blockchain Monitoring",
                name: "Network status & smart contract snapshots",
                accent: "rgba(245,158,11,0.35)",
              },
            ].map((p) => (
              <a
                key={p.href}
                href={p.href}
                className="glass-card card-hover rounded-2xl border px-3 py-3 flex flex-col justify-between min-h-[92px]"
                style={{ borderColor: `${p.accent}`, boxShadow: `0 0 26px ${p.accent}` }}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-semibold text-white">{p.title}</span>
                  <span aria-hidden className="text-[13px]">
                    ↗
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 mt-2 leading-relaxed">{p.name}</div>
              </a>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-xs font-semibold text-slate-100">Phase 9 — JPS Profiles</h2>
          <p className="text-[10px] xs:text-[11px] text-slate-300">
            Job Profile & Skill signals power AI matching and verified service recommendations.
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { href: "/profile/rafi", title: "Sample JPS Profile", name: "Skills + SQL level + trust meaning", accent: "rgba(34,197,94,0.35)" },
              { href: "/admin/jps-profiles", title: "Super Admin JPS Controls", name: "Manage fields + trust signals (demo)", accent: "rgba(0,174,239,0.35)" },
              { href: "/dashboard", title: "Matching Usage", name: "Used in AI recommendations", accent: "rgba(245,158,11,0.35)" },
            ].map((p) => (
              <a
                key={p.href}
                href={p.href}
                className="glass-card card-hover rounded-2xl border px-3 py-3 flex flex-col justify-between min-h-[92px]"
                style={{ borderColor: `${p.accent}`, boxShadow: `0 0 26px ${p.accent}` }}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-semibold text-white">{p.title}</span>
                  <span aria-hidden className="text-[13px]">
                    ↗
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 mt-2 leading-relaxed">{p.name}</div>
              </a>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-xs font-semibold text-slate-100">Phase 10 — Service Creation System</h2>
          <p className="text-[10px] xs:text-[11px] text-slate-300">
            Providers create listings via a guided flow. DMO then applies workflow approvals and trust badge meaning.
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { href: "/dashboard/services/new", title: "Create service", name: "Industry → category → details (demo)", accent: "rgba(0,174,239,0.35)" },
              { href: "/dashboard/my-services/create", title: "My services", name: "Provider convenience route (demo)", accent: "rgba(34,197,94,0.35)" },
              { href: "/admin/service-creation", title: "Admin controls", name: "Service creation rules & onboarding (demo)", accent: "rgba(139,92,246,0.35)" },
            ].map((p) => (
              <a
                key={p.href}
                href={p.href}
                className="glass-card card-hover rounded-2xl border px-3 py-3 flex flex-col justify-between min-h-[92px]"
                style={{ borderColor: `${p.accent}`, boxShadow: `0 0 26px ${p.accent}` }}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-semibold text-white">{p.title}</span>
                  <span aria-hidden className="text-[13px]">
                    ↗
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 mt-2 leading-relaxed">{p.name}</div>
              </a>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-xs font-semibold text-slate-100">Phase 11 — GoSellr Marketplace</h2>
          <p className="text-[10px] xs:text-[11px] text-slate-300">
            Verified products listings with cart + checkout + mock order settlement flows (demo).
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { href: `/gosellr${locationQs}`, title: "GoSellr Products", name: "Verified product catalog (demo)", accent: "rgba(0,234,239,0.35)" },
              { href: `/cart${locationQs}`, title: "Cart & Checkout", name: "Demo cart with EHB‑STL settlement note", accent: "rgba(34,197,94,0.35)" },
              { href: `/orders${locationQs}`, title: "Orders", name: "Mock order history & settlement records", accent: "rgba(139,92,246,0.35)" },
            ].map((p) => (
              <a
                key={p.href}
                href={p.href}
                className="glass-card card-hover rounded-2xl border px-3 py-3 flex flex-col justify-between min-h-[92px]"
                style={{ borderColor: `${p.accent}`, boxShadow: `0 0 26px ${p.accent}` }}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-semibold text-white">{p.title}</span>
                  <span aria-hidden className="text-[13px]">
                    ↗
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 mt-2 leading-relaxed">{p.name}</div>
              </a>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-xs font-semibold text-slate-100">Phase 72 — Location-Based System</h2>
          <p className="text-[10px] xs:text-[11px] text-slate-300">
            Country → State → City hierarchy to power provider discovery, franchise operations and verified bookings.
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { href: "/locations", title: "Locations UI", name: "Country / State / City filters (demo)", accent: "rgba(0,234,239,0.35)" },
              { href: "/admin/locations", title: "Super Admin", name: "Location hierarchy control (demo)", accent: "rgba(139,92,246,0.35)" },
              { href: "/dashboard/services/new", title: "Service Creation", name: "Create with location context (demo)", accent: "rgba(34,197,94,0.35)" },
            ].map((p) => (
              <a
                key={p.href}
                href={p.href}
                className="glass-card card-hover rounded-2xl border px-3 py-3 flex flex-col justify-between min-h-[92px]"
                style={{ borderColor: `${p.accent}`, boxShadow: `0 0 26px ${p.accent}` }}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-semibold text-white">{p.title}</span>
                  <span aria-hidden className="text-[13px]">
                    ↗
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 mt-2 leading-relaxed">{p.name}</div>
              </a>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-xs font-semibold text-slate-100">Phase 73 — Location Context Propagation</h2>
          <p className="text-[10px] xs:text-[11px] text-slate-300">
            AI tools and industry browsing carry your country/state/city context through the marketplace (demo).
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { href: "/ai-marketplace?country=PK&state=punjab&city=rawalpindi", title: "AI Marketplace (near you)", name: "Location-aware AI tool links (demo)", accent: "rgba(0,174,239,0.35)" },
              { href: "/industry/it?country=PK&state=punjab&city=rawalpindi", title: "Industry browsing (near you)", name: "Location pill + nearby services text (demo)", accent: "rgba(34,197,94,0.35)" },
              { href: "/locations", title: "Locations filters", name: "Pick country → state → city (demo)", accent: "rgba(139,92,246,0.35)" },
            ].map((p) => (
              <a
                key={p.href}
                href={p.href}
                className="glass-card card-hover rounded-2xl border px-3 py-3 flex flex-col justify-between min-h-[92px]"
                style={{ borderColor: `${p.accent}`, boxShadow: `0 0 26px ${p.accent}` }}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-semibold text-white">{p.title}</span>
                  <span aria-hidden className="text-[13px]">↗</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-2 leading-relaxed">{p.name}</div>
              </a>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-xs font-semibold text-slate-100">Phase 75 — Franchise Location Context</h2>
          <p className="text-[10px] xs:text-[11px] text-slate-300">
            Franchise page auto-selects area from country/state/city and keeps context in key links (demo).
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { href: "/franchise?country=PK&state=punjab&city=rawalpindi", title: "Franchise (near you)", name: "Auto-pick Rawalpindi area (demo)", accent: "rgba(0,174,239,0.35)" },
              { href: "/global?country=PK&state=punjab&city=rawalpindi", title: "Global dashboard (near you)", name: "Preserved query context (demo)", accent: "rgba(34,197,94,0.35)" },
              { href: "/blockchain-governance?country=PK&state=punjab&city=rawalpindi", title: "Blockchain (near you)", name: "Kept location context (demo)", accent: "rgba(139,92,246,0.35)" },
            ].map((p) => (
              <a
                key={p.href}
                href={p.href}
                className="glass-card card-hover rounded-2xl border px-3 py-3 flex flex-col justify-between min-h-[92px]"
                style={{ borderColor: `${p.accent}`, boxShadow: `0 0 26px ${p.accent}` }}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-semibold text-white">{p.title}</span>
                  <span aria-hidden className="text-[13px]">↗</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-2 leading-relaxed">{p.name}</div>
              </a>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-xs font-semibold text-slate-100">Phase 76 — Global + Blockchain Context</h2>
          <p className="text-[10px] xs:text-[11px] text-slate-300">
            Global Expansion and Blockchain Governance pages keep your country/state/city context and pass it into AI tool links (demo).
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { href: "/global?country=PK&state=punjab&city=rawalpindi", title: "Global expansion (near you)", name: "Near you pill + location-aware AI links (demo)", accent: "rgba(0,174,239,0.35)" },
              { href: "/blockchain-governance?country=PK&state=punjab&city=rawalpindi", title: "Blockchain governance (near you)", name: "Near you pill + preserved links (demo)", accent: "rgba(139,92,246,0.35)" },
              { href: "/ai-marketplace?country=PK&state=punjab&city=rawalpindi", title: "AI Marketplace (context)", name: "Context is shared across the whole flow (demo)", accent: "rgba(34,197,94,0.35)" },
            ].map((p) => (
              <a
                key={p.href}
                href={p.href}
                className="glass-card card-hover rounded-2xl border px-3 py-3 flex flex-col justify-between min-h-[92px]"
                style={{ borderColor: `${p.accent}`, boxShadow: `0 0 26px ${p.accent}` }}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-semibold text-white">{p.title}</span>
                  <span aria-hidden className="text-[13px]">↗</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-2 leading-relaxed">{p.name}</div>
              </a>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-xs font-semibold text-slate-100">Phase 77 — GoSellr Location Context</h2>
          <p className="text-[10px] xs:text-[11px] text-slate-300">
            GoSellr marketplace, product details, cart and orders keep your location query (demo).
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { href: "/gosellr?country=PK&state=punjab&city=rawalpindi", title: "GoSellr products", name: "Near you pill + view links keep context", accent: "rgba(0,174,239,0.35)" },
              { href: "/gosellr/product/cleanmaster-ai?country=PK&state=punjab&city=rawalpindi", title: "Product (near you)", name: "Back links + cart preserve location", accent: "rgba(34,197,94,0.35)" },
              { href: "/cart?country=PK&state=punjab&city=rawalpindi", title: "Cart context", name: "Checkout routes to location-aware orders (demo)", accent: "rgba(139,92,246,0.35)" },
            ].map((p) => (
              <a
                key={p.href}
                href={p.href}
                className="glass-card card-hover rounded-2xl border px-3 py-3 flex flex-col justify-between min-h-[92px]"
                style={{ borderColor: `${p.accent}`, boxShadow: `0 0 26px ${p.accent}` }}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-semibold text-white">{p.title}</span>
                  <span aria-hidden className="text-[13px]">↗</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-2 leading-relaxed">{p.name}</div>
              </a>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-xs font-semibold text-slate-100">Phase 79 — Location-Aware Navigation</h2>
          <p className="text-[10px] xs:text-[11px] text-slate-300">
            Industry CTA buttons, platform pages (WMS/AGTS/OLS/SOT/HPS) and tool links preserve your country/state/city context.
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { href: "/industry/it?country=PK&state=punjab&city=rawalpindi", title: "Industry (near you)", name: "CTA + footer AI Marketplace keeps context (demo)", accent: "rgba(0,174,239,0.35)" },
              { href: "/wms?country=PK&state=punjab&city=rawalpindi", title: "WMS (near you)", name: "Service platform preserves location (demo)", accent: "rgba(34,197,94,0.35)" },
              { href: "/ai-marketplace?country=PK&state=punjab&city=rawalpindi", title: "AI Marketplace (near you)", name: "All tool links keep context (demo)", accent: "rgba(139,92,246,0.35)" },
            ].map((p) => (
              <a
                key={p.href}
                href={p.href}
                className="glass-card card-hover rounded-2xl border px-3 py-3 flex flex-col justify-between min-h-[92px]"
                style={{ borderColor: `${p.accent}`, boxShadow: `0 0 26px ${p.accent}` }}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-semibold text-white">{p.title}</span>
                  <span aria-hidden className="text-[13px]">↗</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-2 leading-relaxed">{p.name}</div>
              </a>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-xs font-semibold text-slate-100">Phase 80 — Unified Marketplace (Services + Products)</h2>
          <p className="text-[10px] xs:text-[11px] text-slate-300">
            Single section with tabs for verified services (industry → category → service) and GoSellr products; links preserve location context.
          </p>
          <MarketplaceSection locationQs={locationQs} />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 pt-2">
            {[
              { href: `/ai-marketplace${locationQs}`, title: "AI Marketplace", name: "All AI tools with location context (demo)", accent: "rgba(0,174,239,0.35)" },
              { href: `/gosellr${locationQs}`, title: "GoSellr", name: "Verified products catalog (demo)", accent: "rgba(34,197,94,0.35)" },
              { href: `/industry/it${locationQs}`, title: "Industry browse", name: "Services by industry (demo)", accent: "rgba(139,92,246,0.35)" },
            ].map((p) => (
              <a
                key={p.href}
                href={p.href}
                className="glass-card card-hover rounded-2xl border px-3 py-3 flex flex-col justify-between min-h-[92px]"
                style={{ borderColor: `${p.accent}`, boxShadow: `0 0 26px ${p.accent}` }}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-semibold text-white">{p.title}</span>
                  <span aria-hidden className="text-[13px]">↗</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-2 leading-relaxed">{p.name}</div>
              </a>
            ))}
          </div>
        </section>

        <section>
          <UniversalStructuredAdminBlocks />
        </section>

        <section className="grid gap-3 grid-cols-1 lg:grid-cols-3 items-start">
          <div className="space-y-2 glass-panel card-hover p-3 lg:col-span-2">
            <h2 className="text-xs font-semibold text-slate-100">DMO Modules & Responsibilities</h2>
            <p className="text-slate-300">
              Neeche har module ke liye sirf UI level demo copy hai; real backend later microservices se implement hoga.
            </p>
            <div className="grid gap-2 grid-cols-1 sm:grid-cols-2">
              {dmoModules.map((m) => (
                <div key={m} className="glass-panel rounded-lg p-2 space-y-0.5">
                  <div className="text-[10px] xs:text-[11px] font-semibold text-slate-100">{m}</div>
                  <p className="text-[10px] xs:text-[11px] text-slate-300">
                    Demo: config only – future state mein yahan se filters, queues aur detailed dashboards open honge.
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2 glass-panel card-hover border border-[#00eaff]/40 p-3">
            <h2 className="text-xs font-semibold text-[#00eaff]">Applications & Approvals (Workflow Engine)</h2>
            <p className="text-slate-200">
              Ye module license, certification, franchise aur government services ki applications ko
              officer workflows ke through route karta hai.
            </p>
            <ul className="space-y-1 text-slate-300">
              <li>• Demo queues: New, In Review, Inspection, Approved, Rejected.</li>
              <li>• Entity types: Provider license, Clinic approval, Franchise application, etc.</li>
              <li>• Future: Direct integration with CRB inspections & blockchain hashes.</li>
            </ul>
            <div className="pt-1 flex flex-wrap gap-1.5">
              <a
                href={`/dmo/applications${locationQs}`}
                className="min-h-touch inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#00eaff] to-[#8b5cf6] px-3 py-1.5 text-[10px] xs:text-[11px] font-semibold text-slate-950 btn-glow"
              >
                Open Applications Board (demo)
              </a>
              <span className="inline-flex items-center rounded-full glass-panel px-2 py-0.5 text-[9px] xs:text-[10px] text-slate-200">
                Operated directly from DMO home
              </span>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
