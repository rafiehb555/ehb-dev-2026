import Link from "next/link";
import { UniversalStructuredAdminBlocks } from "@/components/admin/UniversalStructuredAdminBlocks";

export default function AdminCoreSystemsPage({
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
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="space-y-1">
            <p className="text-[11px] uppercase tracking-[0.2em] text-ehb-textMuted">Admin · Core Systems</p>
            <h1 className="text-lg sm:text-xl font-semibold leading-tight gradient-text">Core Layers Control</h1>
            <p className="text-ehb-textBody max-w-2xl">
              PSS, CRB, STL, Wallet and governance monitoring — structured trust for every verified workflow.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/admin"
              className="min-h-touch inline-flex items-center justify-center rounded-full glass-panel px-3 py-1.5 font-semibold text-white hover:shadow-neon-blue transition-all duration-200"
            >
              ← Back to Super Admin
            </Link>
          </div>
        </header>

        <section className="glass-panel card-hover p-4 space-y-3 border border-white/5">
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-ehb-textMuted">Phase 4 — Service Platforms</p>
            <h2 className="text-sm font-semibold text-white mt-2">Connected operating modules</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {[
              { href: "/wms", code: "WMS", name: "Medical & Health", accent: "#00AEEF" },
              { href: "/agts", code: "AGTS", name: "Travel & Tourism", accent: "#0EA5E9" },
              { href: "/ols", code: "OLS", name: "Legal Services", accent: "#6B7280" },
              { href: "/sot", code: "SOT", name: "Operations & Training", accent: "#22C55E" },
              { href: "/hps", code: "HPS", name: "Education & Learning", accent: "#E53935" },
            ].map((p) => (
              <Link
                key={p.href}
                href={p.href}
                className="rounded-2xl glass-card card-hover border px-3 py-3 flex flex-col justify-between min-h-[92px] transition-all duration-300"
                style={{ borderColor: `${p.accent}30`, boxShadow: `0 0 26px ${p.accent}12` }}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-semibold text-white">{p.code}</span>
                  <span aria-hidden className="text-[13px]">
                    ↗
                  </span>
                </div>
                <div className="text-[10px] text-ehb-textMuted mt-2 leading-relaxed">{p.name}</div>
              </Link>
            ))}
          </div>
        </section>

        <section className="glass-panel card-hover p-4 space-y-3 border border-white/5">
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-ehb-textMuted">Phase 5 — Digital Governance</p>
            <h2 className="text-sm font-semibold text-white mt-2">Applications and licenses control</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { href: "/governance", code: "Gov", name: "Applications & Licenses", accent: "#00EAFF" },
              { href: "/admin/development", code: "DMO", name: "Workflow engine (demo)", accent: "#3B82F6" },
              { href: "/ai-marketplace", code: "AI", name: "Governance matching", accent: "#8B5CF6" },
            ].map((p) => (
              <Link
                key={p.href}
                href={p.href}
                className="rounded-2xl glass-card card-hover border px-3 py-3 flex flex-col justify-between min-h-[92px] transition-all duration-300"
                style={{ borderColor: `${p.accent}30`, boxShadow: `0 0 26px ${p.accent}12` }}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-semibold text-white">{p.code}</span>
                  <span aria-hidden className="text-[13px]">
                    ↗
                  </span>
                </div>
                <div className="text-[10px] text-ehb-textMuted mt-2 leading-relaxed">{p.name}</div>
              </Link>
            ))}
          </div>
        </section>

        <section className="glass-panel card-hover p-4 space-y-3 border border-white/5">
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-ehb-textMuted">Phase 6 — Global Expansion</p>
            <h2 className="text-sm font-semibold text-white mt-2">Multi-country franchise control</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { href: "/global", code: "🌍", name: "Country readiness & onboarding", accent: "#00EAFF" },
              { href: "/admin/global", code: "🛡️", name: "Super admin governance", accent: "#3B82F6" },
              { href: "/franchise", code: "🏢", name: "Book areas in batches", accent: "#F59E0B" },
            ].map((p) => (
              <Link
                key={p.href}
                href={p.href}
                className="rounded-2xl glass-card card-hover border px-3 py-3 flex flex-col justify-between min-h-[92px] transition-all duration-300"
                style={{ borderColor: `${p.accent}30`, boxShadow: `0 0 26px ${p.accent}12` }}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-semibold text-white">{p.code}</span>
                  <span aria-hidden className="text-[13px]">
                    ↗
                  </span>
                </div>
                <div className="text-[10px] text-ehb-textMuted mt-2 leading-relaxed">{p.name}</div>
              </Link>
            ))}
          </div>
        </section>

        <section className="glass-panel card-hover p-4 space-y-3 border border-white/5">
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-ehb-textMuted">Phase 7 — AI Ecosystem</p>
            <h2 className="text-sm font-semibold text-white mt-2">ML + Fraud + NLP controls</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { href: "/ai-ecosystem", code: "AI", name: "Opportunity scoring + trust checks", accent: "rgba(0,174,239,0.35)" },
              { href: "/admin/ai-ecosystem", code: "CTRL", name: "Super admin monitoring rules", accent: "rgba(139,92,246,0.35)" },
              { href: "/ai-marketplace", code: "MATCH", name: "AI-connected marketplace matching", accent: "rgba(34,197,94,0.35)" },
            ].map((p) => (
              <Link
                key={p.href}
                href={p.href}
                className="rounded-2xl glass-card card-hover border px-3 py-3 flex flex-col justify-between min-h-[92px] transition-all duration-300"
                style={{ borderColor: `${p.accent}`, boxShadow: `0 0 26px ${p.accent}` }}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-semibold text-white">{p.code}</span>
                  <span aria-hidden className="text-[13px]">
                    ↗
                  </span>
                </div>
                <div className="text-[10px] text-ehb-textMuted mt-2 leading-relaxed">{p.name}</div>
              </Link>
            ))}
          </div>
        </section>

        <section className="glass-panel card-hover p-4 space-y-3 border border-white/5">
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-ehb-textMuted">Phase 8 — Blockchain Governance</p>
            <h2 className="text-sm font-semibold text-white mt-2">Trust anchors + smart contracts</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { href: "/blockchain-governance", code: "⛓️", name: "Trust network anchors (demo)", accent: "rgba(0,174,239,0.35)" },
              { href: "/admin/blockchain-governance", code: "CTRL", name: "Smart contract monitoring", accent: "rgba(139,92,246,0.35)" },
              { href: "/admin/blockchain", code: "NET", name: "Network status snapshot", accent: "rgba(245,158,11,0.35)" },
            ].map((p) => (
              <Link
                key={p.href}
                href={p.href}
                className="rounded-2xl glass-card card-hover border px-3 py-3 flex flex-col justify-between min-h-[92px] transition-all duration-300"
                style={{ borderColor: `${p.accent}`, boxShadow: `0 0 26px ${p.accent}` }}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-semibold text-white">{p.code}</span>
                  <span aria-hidden className="text-[13px]">
                    ↗
                  </span>
                </div>
                <div className="text-[10px] text-ehb-textMuted mt-2 leading-relaxed">{p.name}</div>
              </Link>
            ))}
          </div>
        </section>

        <section className="glass-panel card-hover p-4 space-y-3 border border-white/5">
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-ehb-textMuted">Phase 9 — JPS Profile System</p>
            <h2 className="text-sm font-semibold text-white mt-2">Job Profile & Skill controls</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { href: "/profile/rafi", code: "@", name: "Sample profile (demo)", accent: "rgba(34,197,94,0.35)" },
              { href: "/admin/jps-profiles", code: "CTRL", name: "JPS trust + skills controls", accent: "rgba(0,174,239,0.35)" },
              { href: "/dashboard", code: "AI", name: "Dashboard matching usage", accent: "rgba(245,158,11,0.35)" },
            ].map((p) => (
              <Link
                key={p.href}
                href={p.href}
                className="rounded-2xl glass-card card-hover border px-3 py-3 flex flex-col justify-between min-h-[92px] transition-all duration-300"
                style={{ borderColor: `${p.accent}`, boxShadow: `0 0 26px ${p.accent}` }}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-semibold text-white">{p.code}</span>
                  <span aria-hidden className="text-[13px]">
                    ↗
                  </span>
                </div>
                <div className="text-[10px] text-ehb-textMuted mt-2 leading-relaxed">{p.name}</div>
              </Link>
            ))}
          </div>
        </section>

        <section className="glass-panel card-hover p-4 space-y-3 border border-white/5">
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-ehb-textMuted">Phase 10 — Service Creation</p>
            <h2 className="text-sm font-semibold text-white mt-2">Guided listing onboarding</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { href: "/dashboard/services/new", code: "CREATE", name: "Provider service creation flow (demo)", accent: "rgba(0,174,239,0.35)" },
              { href: "/dashboard/my-services/create", code: "MINE", name: "My services route (demo)", accent: "rgba(34,197,94,0.35)" },
              { href: "/admin/service-creation", code: "ADMIN", name: "Onboarding + workflow rules (demo)", accent: "rgba(139,92,246,0.35)" },
            ].map((p) => (
              <Link
                key={p.href}
                href={p.href}
                className="rounded-2xl glass-card card-hover border px-3 py-3 flex flex-col justify-between min-h-[92px] transition-all duration-300"
                style={{ borderColor: `${p.accent}`, boxShadow: `0 0 26px ${p.accent}` }}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-semibold text-white">{p.code}</span>
                  <span aria-hidden className="text-[13px]">↗</span>
                </div>
                <div className="text-[10px] text-ehb-textMuted mt-2 leading-relaxed">{p.name}</div>
              </Link>
            ))}
          </div>
        </section>

        <section className="glass-panel card-hover p-4 space-y-3 border border-white/5">
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-ehb-textMuted">Phase 11 — GoSellr Marketplace</p>
            <h2 className="text-sm font-semibold text-white mt-2">Products + cart + orders</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { href: `/gosellr${locationQs}`, code: "PROD", name: "Verified product list", accent: "rgba(0,174,239,0.35)" },
              { href: `/cart${locationQs}`, code: "CART", name: "Checkout (demo)", accent: "rgba(34,197,94,0.35)" },
              { href: `/orders${locationQs}`, code: "ORD", name: "Orders + settlement (demo)", accent: "rgba(139,92,246,0.35)" },
            ].map((p) => (
              <Link
                key={p.href}
                href={p.href}
                className="rounded-2xl glass-card card-hover border px-3 py-3 flex flex-col justify-between min-h-[92px] transition-all duration-300"
                style={{ borderColor: `${p.accent}`, boxShadow: `0 0 26px ${p.accent}` }}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-semibold text-white">{p.code}</span>
                  <span aria-hidden className="text-[13px]">
                    ↗
                  </span>
                </div>
                <div className="text-[10px] text-ehb-textMuted mt-2 leading-relaxed">{p.name}</div>
              </Link>
            ))}
          </div>
        </section>

        <section className="glass-panel card-hover p-4 space-y-3 border border-white/5">
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-ehb-textMuted">Phase 72 — Location-Based System</p>
            <h2 className="text-sm font-semibold text-white mt-2">Country → State → City controls</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { href: "/locations", code: "UI", name: "Location filters demo", accent: "rgba(0,174,239,0.35)" },
              { href: "/admin/locations", code: "CTRL", name: "Hierarchy configuration (demo)", accent: "rgba(139,92,246,0.35)" },
              { href: "/dashboard/services/new", code: "USE", name: "Service creation uses city context", accent: "rgba(34,197,94,0.35)" },
            ].map((p) => (
              <Link
                key={p.href}
                href={p.href}
                className="rounded-2xl glass-card card-hover border px-3 py-3 flex flex-col justify-between min-h-[92px] transition-all duration-300"
                style={{ borderColor: `${p.accent}`, boxShadow: `0 0 26px ${p.accent}` }}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-semibold text-white">{p.code}</span>
                  <span aria-hidden className="text-[13px]">↗</span>
                </div>
                <div className="text-[10px] text-ehb-textMuted mt-2 leading-relaxed">{p.name}</div>
              </Link>
            ))}
          </div>
        </section>

        <section className="glass-panel card-hover p-4 space-y-3 border border-white/5">
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-ehb-textMuted">Phase 73 — Location Context Propagation</p>
            <h2 className="text-sm font-semibold text-white mt-2">Marketplace + industry keep context</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { href: "/ai-marketplace?country=PK&state=punjab&city=rawalpindi", code: "AI", name: "Location-aware tool links (demo)", accent: "rgba(0,174,239,0.35)" },
              { href: "/industry/it?country=PK&state=punjab&city=rawalpindi", code: "IND", name: "Near you pill + nearby text (demo)", accent: "rgba(34,197,94,0.35)" },
              { href: "/locations", code: "PICK", name: "Pick hierarchy (demo)", accent: "rgba(139,92,246,0.35)" },
            ].map((p) => (
              <Link
                key={p.href}
                href={p.href}
                className="rounded-2xl glass-card card-hover border px-3 py-3 flex flex-col justify-between min-h-[92px] transition-all duration-300"
                style={{ borderColor: `${p.accent}`, boxShadow: `0 0 26px ${p.accent}` }}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-semibold text-white">{p.code}</span>
                  <span aria-hidden className="text-[13px]">↗</span>
                </div>
                <div className="text-[10px] text-ehb-textMuted mt-2 leading-relaxed">{p.name}</div>
              </Link>
            ))}
          </div>
        </section>

        <section className="glass-panel card-hover p-4 space-y-3 border border-white/5">
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-ehb-textMuted">Phase 75 — Franchise Location Context</p>
            <h2 className="text-sm font-semibold text-white mt-2">Auto-pick area + preserve links</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { href: "/franchise?country=PK&state=punjab&city=rawalpindi", code: "PICK", name: "Auto-pick Rawalpindi area", accent: "rgba(0,174,239,0.35)" },
              { href: "/global?country=PK&state=punjab&city=rawalpindi", code: "GLBL", name: "Global dashboard context", accent: "rgba(34,197,94,0.35)" },
              { href: "/admin/locations", code: "CTRL", name: "Admin location hierarchy control", accent: "rgba(139,92,246,0.35)" },
            ].map((p) => (
              <Link
                key={p.href}
                href={p.href}
                className="rounded-2xl glass-card card-hover border px-3 py-3 flex flex-col justify-between min-h-[92px] transition-all duration-300"
                style={{ borderColor: `${p.accent}`, boxShadow: `0 0 26px ${p.accent}` }}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-semibold text-white">{p.code}</span>
                  <span aria-hidden className="text-[13px]">↗</span>
                </div>
                <div className="text-[10px] text-ehb-textMuted mt-2 leading-relaxed">{p.name}</div>
              </Link>
            ))}
          </div>
        </section>

        <section className="glass-panel card-hover p-4 space-y-3 border border-white/5">
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-ehb-textMuted">Phase 76 — Global + Blockchain Context</p>
            <h2 className="text-sm font-semibold text-white mt-2">Keep your country/state/city across pages</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { href: "/global?country=PK&state=punjab&city=rawalpindi", code: "GLBL", name: "Near you pill on global expansion (demo)", accent: "rgba(0,174,239,0.35)" },
              { href: "/blockchain-governance?country=PK&state=punjab&city=rawalpindi", code: "⛓️", name: "Near you pill on blockchain governance (demo)", accent: "rgba(139,92,246,0.35)" },
              { href: "/ai-marketplace?country=PK&state=punjab&city=rawalpindi", code: "AI", name: "AI links preserve context (demo)", accent: "rgba(34,197,94,0.35)" },
            ].map((p) => (
              <Link
                key={p.href}
                href={p.href}
                className="rounded-2xl glass-card card-hover border px-3 py-3 flex flex-col justify-between min-h-[92px] transition-all duration-300"
                style={{ borderColor: `${p.accent}`, boxShadow: `0 0 26px ${p.accent}` }}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-semibold text-white">{p.code}</span>
                  <span aria-hidden className="text-[13px]">↗</span>
                </div>
                <div className="text-[10px] text-ehb-textMuted mt-2 leading-relaxed">{p.name}</div>
              </Link>
            ))}
          </div>
        </section>

        <section className="glass-panel card-hover p-4 space-y-3 border border-white/5">
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-ehb-textMuted">Phase 77 — GoSellr Location Context</p>
            <h2 className="text-sm font-semibold text-white mt-2">Preserve location across ecommerce flow</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { href: "/gosellr?country=PK&state=punjab&city=rawalpindi", code: "PROD", name: "Near you + view links keep context", accent: "rgba(0,174,239,0.35)" },
              { href: "/gosellr/product/cleanmaster-ai?country=PK&state=punjab&city=rawalpindi", code: "VIEW", name: "Product page preserves location", accent: "rgba(34,197,94,0.35)" },
              { href: "/orders?country=PK&state=punjab&city=rawalpindi", code: "ORDS", name: "Orders links keep location (demo)", accent: "rgba(139,92,246,0.35)" },
            ].map((p) => (
              <Link
                key={p.href}
                href={p.href}
                className="rounded-2xl glass-card card-hover border px-3 py-3 flex flex-col justify-between min-h-[92px] transition-all duration-300"
                style={{ borderColor: `${p.accent}`, boxShadow: `0 0 26px ${p.accent}` }}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-semibold text-white">{p.code}</span>
                  <span aria-hidden className="text-[13px]">↗</span>
                </div>
                <div className="text-[10px] text-ehb-textMuted mt-2 leading-relaxed">{p.name}</div>
              </Link>
            ))}
          </div>
        </section>

        <section className="glass-panel card-hover p-4 space-y-3 border border-white/5">
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-ehb-textMuted">Phase 79 — Location-Aware Navigation</p>
            <h2 className="text-sm font-semibold text-white mt-2">Industry + platforms preserve context</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { href: "/industry/it?country=PK&state=punjab&city=rawalpindi", code: "IND", name: "CTA buttons preserve location (demo)", accent: "rgba(0,174,239,0.35)" },
              { href: "/wms?country=PK&state=punjab&city=rawalpindi", code: "WMS", name: "Service platform preserves context (demo)", accent: "rgba(34,197,94,0.35)" },
              { href: "/dmo?country=PK&state=punjab&city=rawalpindi", code: "DMO", name: "DMO monitoring keeps context (demo)", accent: "rgba(139,92,246,0.35)" },
            ].map((p) => (
              <Link
                key={p.href}
                href={p.href}
                className="rounded-2xl glass-card card-hover border px-3 py-3 flex flex-col justify-between min-h-[92px] transition-all duration-300"
                style={{ borderColor: `${p.accent}`, boxShadow: `0 0 26px ${p.accent}` }}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-semibold text-white">{p.code}</span>
                  <span aria-hidden className="text-[13px]">↗</span>
                </div>
                <div className="text-[10px] text-ehb-textMuted mt-2 leading-relaxed">{p.name}</div>
              </Link>
            ))}
          </div>
        </section>

        <UniversalStructuredAdminBlocks />
      </div>
    </main>
  );
}

