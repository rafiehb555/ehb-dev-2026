import Link from "next/link";
import { notFound } from "next/navigation";
import { getIndustryBySlug, getAllSlugs } from "@/lib/industries";
import { getIndustryServices } from "@/lib/industryServices";
import { IndustryIcon } from "@/components/IndustryIcon";
import { SectionReveal } from "@/components/SectionReveal";

interface PageProps {
  params: Promise<{ industry: string }>;
}

export async function generateStaticParams() {
  return getAllSlugs().map((industry) => ({ industry }));
}

export default async function IndustryHomePage({ params }: PageProps) {
  const { industry: industrySlug } = await params;
  const industry = getIndustryBySlug(industrySlug);
  if (!industry) notFound();

  const accent = industry.accentColor;
  const servicesConfig = getIndustryServices(industry.slug);
  const categories = servicesConfig?.categories ?? [];
  const flatServices = servicesConfig?.categories.flatMap((c) => c.services) ?? [];

  const popularLabels =
    industry.popularServices ??
    (flatServices.length >= 4 ? flatServices.slice(0, 4).map((s) => s.name) : industry.services.slice(0, 4));

  const hasProducts = ["retail", "health", "it", "education"].includes(industry.slug);

  return (
    <main className="min-h-screen text-slate-100">
      <div className="container-ehb py-8 md:py-10 space-y-10">
        {/* 1. Industry Header */}
        <SectionReveal as="div">
          <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400 mb-1">
                {industry.name} · Industry Home
              </p>
              <div className="flex items-center gap-3 mb-2">
                <div className="h-8 w-8 rounded-full flex items-center justify-center bg-white/5 border border-white/15">
                  <IndustryIcon name={industry.icon} accentColor={accent} size={16} />
                </div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold leading-tight text-white">
                  {industry.heroTitle}
                </h1>
              </div>
              <p className="text-slate-400 text-sm mt-1 max-w-xl">
                Live marketplace for services, jobs, products, and providers in {industry.name}.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                href={`/landing/${industry.slug}`}
                className="px-3 py-1.5 rounded-full glass-panel text-slate-200 hover:text-white hover:shadow-neon-blue transition-all duration-200 text-xs"
              >
                {industry.name} Landing
              </Link>
              <Link
                href="/dashboard"
                className="px-3 py-1.5 rounded-full text-xs font-semibold text-white transition-all duration-300 hover:opacity-95 hover:scale-[1.02]"
                style={{
                  background: `linear-gradient(135deg, ${accent}, ${accent}dd)`,
                  boxShadow: `0 0 20px ${accent}33`,
                }}
              >
                Go to Dashboard
              </Link>
            </div>
          </section>
        </SectionReveal>

        {/* 2. Search + Filters */}
        <SectionReveal as="div">
          <section className="rounded-2xl glass-card p-4 md:p-5 border border-white/10">
            <div className="flex flex-col md:flex-row md:items-center gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2 text-xs md:text-sm text-slate-300">
                  <span aria-hidden>🔍</span>
                  <input
                    className="bg-transparent outline-none flex-1 placeholder:text-slate-500"
                    placeholder="Search services, providers, jobs..."
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-2 text-[11px] md:text-xs">
                {["Service type", "Location", "Price range", "Rating", "Availability"].map((f) => (
                  <button
                    key={f}
                    className="rounded-full px-3 py-1 border border-white/15 bg-white/5 hover:bg-white/10 transition-colors"
                    style={{ boxShadow: `0 0 0 1px transparent` }}
                    type="button"
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </section>
        </SectionReveal>

        {/* 3. Trending Services */}
        <SectionReveal as="div">
          <section>
            <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500 mb-2">Trending</p>
            <h2 className="text-lg md:text-xl font-semibold text-white mb-4">Trending Services</h2>
            <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {(flatServices.length > 0 ? flatServices.map((s) => s.name) : industry.services).slice(0, 12).map(
                (name) => (
                  <div
                    key={name}
                    className="rounded-2xl glass-card card-hover p-4 flex flex-col gap-2 border transition-all duration-300"
                    style={{ borderColor: `${accent}30` }}
                  >
                    <p className="text-xs font-medium text-white line-clamp-2">{name}</p>
                    <span className="text-[10px] text-slate-400">View details →</span>
                  </div>
                )
              )}
            </div>
          </section>
        </SectionReveal>

        {/* 4. Top Providers (placeholder cards) */}
        <SectionReveal as="div">
          <section>
            <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500 mb-2">Top Providers</p>
            <h2 className="text-lg md:text-xl font-semibold text-white mb-4">Top Providers</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="rounded-2xl glass-panel card-hover p-5 border border-white/10 flex flex-col gap-2"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="h-9 w-9 rounded-full flex items-center justify-center text-[11px] font-semibold text-white"
                      style={{ backgroundColor: `${accent}33` }}
                    >
                      P{i}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">Provider {i}</p>
                      <p className="text-[11px] text-slate-400">Specialist in {industry.name}</p>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-2">
                    Rating: 4.{9 - i} · Location: — · Verified badge will appear here.
                  </p>
                </div>
              ))}
            </div>
          </section>
        </SectionReveal>

        {/* 5. Jobs Section (placeholder) */}
        <SectionReveal as="div">
          <section>
            <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500 mb-2">Jobs</p>
            <h2 className="text-lg md:text-xl font-semibold text-white mb-4">Latest Jobs & Opportunities</h2>
            <div className="rounded-2xl glass-panel p-5 border border-white/10">
              <p className="text-slate-400 text-sm mb-4">
                Jobs and gigs in {industry.name} will appear here. Same UI for all industries – data from JPS and
                marketplace.
              </p>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 text-[11px]">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="rounded-xl bg-white/5 px-3 py-2">
                    <p className="font-semibold text-slate-100">Role {i} · {industry.shortName}</p>
                    <p className="text-slate-400 mt-0.5">Salary: — · Location: Remote / On-site</p>
                  </div>
                ))}
              </div>
              <Link
                href="/dashboard"
                className="mt-4 inline-flex rounded-full border px-4 py-2 text-[11px] font-medium text-cyan-200 hover:bg-[#00eaff]/10 transition-colors"
                style={{ borderColor: `${accent}60` }}
              >
                Go to Dashboard
              </Link>
            </div>
          </section>
        </SectionReveal>

        {/* 6. Products (GoSellr-style) */}
        {hasProducts && (
          <SectionReveal as="div">
            <section>
              <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500 mb-2">Products</p>
              <h2 className="text-lg md:text-xl font-semibold text-white mb-4">Featured Products</h2>
              <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
                {["Laptop", "Medical Equipment", "Books", "Local Store"].map((p) => (
                  <div
                    key={p}
                    className="rounded-2xl glass-card card-hover p-4 border border-white/10 flex flex-col gap-1"
                    style={{ borderColor: `${accent}25` }}
                  >
                    <p className="text-sm font-semibold text-white">{p}</p>
                    <p className="text-[11px] text-slate-400">GoSellr · Demo product</p>
                  </div>
                ))}
              </div>
            </section>
          </SectionReveal>
        )}

        {/* 7. AI Recommendations */}
        <SectionReveal as="div">
          <section>
            <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500 mb-2">AI Layer</p>
            <h2 className="text-lg md:text-xl font-semibold text-white mb-4">AI Recommendations</h2>
            <div className="rounded-2xl glass-card p-6 border" style={{ borderColor: `${accent}40` }}>
              <p className="text-slate-300 text-sm">
                AI Insight: Demand for {industry.name} services is tracked by EHB. AI suggests which services to
                activate, which locations have demand, and which opportunities fit your profile.
              </p>
            </div>
          </section>
        </SectionReveal>

        {/* 8. Nearby Services */}
        <SectionReveal as="div">
          <section className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl glass-panel card-hover p-5 border border-white/10">
              <h2 className="text-sm font-semibold text-white mb-3">Nearby Services</h2>
              <p className="text-slate-400 text-xs mb-4">
                Verified {industry.name} services near your location. Demo – location-based data will connect in
                production.
              </p>
              <div className="space-y-2">
                {(flatServices.length > 0 ? flatServices.slice(0, 3) : industry.services.slice(0, 3)).map((s, i) => {
                  const label = typeof s === "string" ? s : s.name;
                  return (
                    <div
                      key={label}
                      className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2 text-[11px]"
                    >
                      <span className="text-slate-200">{label}</span>
                      <span className="text-slate-500">Distance: —</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="rounded-2xl glass-panel card-hover p-5 border border-white/10">
              <h2 className="text-sm font-semibold text-white mb-3">Top Companies</h2>
              <p className="text-slate-400 text-xs mb-4">
                Leading {industry.name} organizations on EHB. Demo – real companies will appear here.
              </p>
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2 text-[11px] text-slate-300"
                  >
                    Company {i} · {industry.name}
                  </div>
                ))}
              </div>
            </div>
          </section>
        </SectionReveal>

        {/* 9. Quick Actions */}
        <SectionReveal as="div">
          <section>
            <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500 mb-2">Actions</p>
            <h2 className="text-lg md:text-xl font-semibold text-white mb-4">Quick Actions</h2>
            <div className="flex flex-wrap gap-3 text-[11px] md:text-xs">
              {[
                { label: "Add Service", href: "/dashboard" },
                { label: "Find Work", href: "/home" },
                { label: "Hire Provider", href: "/ai-marketplace" },
                { label: "Start Selling", href: "/services" },
              ].map((a) => (
                <Link
                  key={a.label}
                  href={a.href}
                  className="min-h-touch inline-flex items-center justify-center rounded-full px-4 py-2 font-medium text-slate-100 transition-all duration-300 hover:scale-[1.02]"
                  style={{ background: `linear-gradient(135deg, ${accent}, ${accent}dd)` }}
                >
                  {a.label}
                </Link>
              ))}
            </div>
          </section>
        </SectionReveal>

        {/* Footer links */}
        <section className="flex flex-wrap gap-3 pt-4 text-xs">
          <Link href="/ai-marketplace" className="text-slate-400 hover:text-[#00eaff] transition-colors">
            AI Marketplace →
          </Link>
          <Link href="/" className="text-slate-400 hover:text-[#00eaff] transition-colors">
            EHB Home →
          </Link>
        </section>
      </div>
    </main>
  );
}
