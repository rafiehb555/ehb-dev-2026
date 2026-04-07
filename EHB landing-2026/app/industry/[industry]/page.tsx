import Link from "next/link";
import { notFound } from "next/navigation";
import { getIndustryBySlug, getAllSlugs } from "@/lib/industry/config";
import { getIndustryServices } from "@/lib/industry/services";
import { IndustryIcon } from "@/components/IndustryIcon";
import { SectionReveal } from "@/components/SectionReveal";
import { TrustBadgeLegend } from "@/components/TrustBadgeLegend";
import { STLLevelsAndSecurity } from "@/components/STLLevelsAndSecurity";
import { AIToolsSection } from "@/components/AIToolsSection";
import { RoadmapPhasesSection } from "@/components/RoadmapPhasesSection";
import { IndustryAiPanel } from "@/components/industry/IndustryAiPanel";
import { IndustryHomeBanner } from "@/components/industry/IndustryHomeBanner";
import { getCityByCode, getCountryByCode, getStateByCode } from "@/lib/locations";
import {
  lawIndustryHomeIntro,
  lawJobOpenings,
  lawTopProviders,
  lawTrendingServices,
} from "@/lib/industry/law/olsContent";

interface PageProps {
  params: Promise<{ industry: string }>;
  searchParams?: { country?: string; state?: string; city?: string };
}

export async function generateStaticParams() {
  return getAllSlugs().map((industry) => ({ industry }));
}

export default async function IndustryHomePage({ params, searchParams }: PageProps) {
  const { industry: industrySlug } = await params;
  const industry = getIndustryBySlug(industrySlug);
  if (!industry) notFound();

  const accent = industry.accentColor;
  const servicesConfig = getIndustryServices(industry.slug);
  const categories = servicesConfig?.categories ?? [];
  const flatServices = servicesConfig?.categories.flatMap((c) => c.services) ?? [];

  const countryCode = searchParams?.country?.trim() || "";
  const stateCode = searchParams?.state?.trim() || "";
  const cityCode = searchParams?.city?.trim() || "";

  const selectedCountry = countryCode ? getCountryByCode(countryCode) : undefined;
  const selectedState = countryCode && stateCode ? getStateByCode(countryCode, stateCode) : undefined;
  const selectedCity = countryCode && stateCode && cityCode ? getCityByCode(countryCode, stateCode, cityCode) : undefined;
  const locationLabel = selectedCity?.name || selectedState?.name || selectedCountry?.name || "";
  const locationQuery =
    locationLabel && (countryCode || stateCode || cityCode)
      ? { country: countryCode, state: stateCode, city: cityCode }
      : undefined;

  const locationQs = (() => {
    if (!locationQuery) return "";
    const sp = new URLSearchParams();
    if (locationQuery.country) sp.set("country", locationQuery.country);
    if (locationQuery.state) sp.set("state", locationQuery.state);
    if (locationQuery.city) sp.set("city", locationQuery.city);
    const qs = sp.toString();
    return qs ? `?${qs}` : "";
  })();

  const popularLabels =
    industry.popularServices ??
    (flatServices.length >= 4 ? flatServices.slice(0, 4).map((s) => s.name) : industry.services.slice(0, 4));

  const hasProducts = ["retail", "health", "it", "education"].includes(industry.slug);

  return (
    <div className="min-h-screen text-white">
      <div className="container-ehb py-8 md:py-10 space-y-10">
        {/* 1. Industry Header */}
        <SectionReveal as="div">
          <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-ehb-textMuted mb-1">
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
              <p className="text-ehb-textMuted text-sm mt-1 max-w-xl">
                {industry.slug === "law"
                  ? lawIndustryHomeIntro
                  : `Live marketplace for services, jobs, products, and providers in ${industry.name}.`}
              </p>

              {locationLabel ? (
                <div
                  className="mt-3 inline-flex items-center gap-2 rounded-full glass-panel px-3 py-1 text-[11px] text-ehb-textBody border"
                  style={{ borderColor: `${accent}55`, boxShadow: `0 0 28px ${accent}22` }}
                >
                  <span aria-hidden>📍</span>
                  <span>
                    Near you: <span className="text-white font-semibold">{locationLabel}</span>
                  </span>
                </div>
              ) : null}
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                href={`/landing/${industry.slug}`}
                className="px-3 py-1.5 rounded-full glass-panel text-ehb-textBody hover:text-white hover:shadow-neon-blue transition-all duration-200 text-xs"
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

        <SectionReveal as="div">
          <IndustryHomeBanner industry={industry} />
        </SectionReveal>

        {/* 2. Search + Filters */}
        <SectionReveal as="div">
          <section className="rounded-2xl glass-card p-4 md:p-5 border border-white/10">
            <div className="flex flex-col md:flex-row md:items-center gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2 text-xs md:text-sm text-ehb-textBody">
                  <span aria-hidden>🔍</span>
                  <input
                    className="bg-transparent outline-none flex-1 placeholder:text-ehb-textMuted"
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
            <p className="text-[11px] uppercase tracking-[0.22em] text-ehb-textMuted mb-2">Trending</p>
            <h2 className="text-lg md:text-xl font-semibold text-white mb-4">Trending Services</h2>
            <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {(industry.slug === "law"
                ? lawTrendingServices
                : (flatServices.length > 0 ? flatServices.map((s) => ({ name: s.name, blurb: "" })) : industry.services.map((n) => ({ name: n, blurb: "" }))).slice(0, 12)
              ).map((row) => (
                <div
                  key={row.name}
                  className="rounded-2xl glass-card card-hover p-4 flex flex-col gap-2 border transition-all duration-300"
                  style={{ borderColor: `${accent}30` }}
                >
                  <p className="text-xs font-medium text-white line-clamp-2">{row.name}</p>
                  {industry.slug === "law" && "blurb" in row && row.blurb ? (
                    <p className="text-[10px] text-ehb-textMuted line-clamp-3">{row.blurb}</p>
                  ) : null}
                  <span className="text-[10px] text-ehb-textMuted">View details →</span>
                </div>
              ))}
            </div>
          </section>
        </SectionReveal>

        {/* 4. Top Providers */}
        <SectionReveal as="div">
          <section>
            <p className="text-[11px] uppercase tracking-[0.22em] text-ehb-textMuted mb-2">Top Providers</p>
            <h2 className="text-lg md:text-xl font-semibold text-white mb-4">Top Providers</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {(industry.slug === "law" ? lawTopProviders : [1, 2, 3].map((i) => ({ i }))).map((item, idx) =>
                industry.slug === "law" && "headline" in item ? (
                  <div
                    key={item.initials}
                    className="rounded-2xl glass-panel card-hover p-5 border border-white/10 flex flex-col gap-2"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="h-9 w-9 rounded-full flex items-center justify-center text-[11px] font-semibold text-white shrink-0"
                        style={{ backgroundColor: `${accent}33` }}
                      >
                        {item.initials}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-white leading-snug">{item.headline}</p>
                        <p className="text-[11px] text-ehb-textMuted">{item.city}</p>
                      </div>
                    </div>
                    <p className="text-[11px] text-ehb-textBody mt-1">{item.focus}</p>
                    <p className="text-[11px] text-ehb-textMuted mt-2">
                      ★ {item.rating} · {item.reviews} · {item.badge}
                    </p>
                  </div>
                ) : (
                  <div
                    key={typeof item === "object" && "i" in item ? item.i : idx}
                    className="rounded-2xl glass-panel card-hover p-5 border border-white/10 flex flex-col gap-2"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="h-9 w-9 rounded-full flex items-center justify-center text-[11px] font-semibold text-white"
                        style={{ backgroundColor: `${accent}33` }}
                      >
                        P{"i" in item ? item.i : idx + 1}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">Provider {"i" in item ? item.i : idx + 1}</p>
                        <p className="text-[11px] text-ehb-textMuted">Specialist in {industry.name}</p>
                      </div>
                    </div>
                    <p className="text-[11px] text-ehb-textMuted mt-2">
                      Rating: 4.{9 - (typeof item === "object" && "i" in item ? item.i : idx + 1)} · Location: — · Demo
                      placeholder.
                    </p>
                  </div>
                )
              )}
            </div>
          </section>
        </SectionReveal>

        {/* 5. Jobs Section (placeholder) */}
        <SectionReveal as="div">
          <section>
            <p className="text-[11px] uppercase tracking-[0.22em] text-ehb-textMuted mb-2">Jobs</p>
            <h2 className="text-lg md:text-xl font-semibold text-white mb-4">Latest Jobs & Opportunities</h2>
            <div className="rounded-2xl glass-panel p-5 border border-white/10">
              <p className="text-ehb-textMuted text-sm mb-4">
                {industry.slug === "law"
                  ? "Sample legal roles aligned with OLS franchise + remote hiring (demo — live feed from JPS later)."
                  : `Jobs and gigs in ${industry.name} will appear here. Same UI for all industries – data from JPS and marketplace.`}
              </p>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 text-[11px]">
                {(industry.slug === "law" ? lawJobOpenings : [1, 2, 3].map((i) => ({ i }))).map((row) =>
                  "title" in row ? (
                    <div key={row.title} className="rounded-xl bg-white/5 px-3 py-2 border border-white/5">
                      <p className="font-semibold text-white leading-snug">{row.title}</p>
                      <p className="text-ehb-textMuted mt-1 leading-relaxed">{row.detail}</p>
                    </div>
                  ) : (
                    <div key={row.i} className="rounded-xl bg-white/5 px-3 py-2">
                      <p className="font-semibold text-white">
                        Role {row.i} · {industry.shortName}
                      </p>
                      <p className="text-ehb-textMuted mt-0.5">Salary: — · Location: Remote / On-site</p>
                    </div>
                  )
                )}
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
              <p className="text-[11px] uppercase tracking-[0.22em] text-ehb-textMuted mb-2">Products</p>
              <h2 className="text-lg md:text-xl font-semibold text-white mb-4">Featured Products</h2>
              <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
                {["Laptop", "Medical Equipment", "Books", "Local Store"].map((p) => (
                  <div
                    key={p}
                    className="rounded-2xl glass-card card-hover p-4 border border-white/10 flex flex-col gap-1"
                    style={{ borderColor: `${accent}25` }}
                  >
                    <p className="text-sm font-semibold text-white">{p}</p>
                    <p className="text-[11px] text-ehb-textMuted">GoSellr · Demo product</p>
                  </div>
                ))}
              </div>
            </section>
          </SectionReveal>
        )}

        {/* 7. AI Recommendations */}
        <SectionReveal as="div">
          <section>
            <p className="text-[11px] uppercase tracking-[0.22em] text-ehb-textMuted mb-2">AI Layer</p>
            <h2 className="text-lg md:text-xl font-semibold text-white mb-4">AI Recommendations</h2>
            <IndustryAiPanel industry={industry.slug} />
          </section>
        </SectionReveal>

        {/* 8. Trust Badges + STL + Security (universal) */}
        <SectionReveal as="div">
          <TrustBadgeLegend />
        </SectionReveal>
        <SectionReveal as="div">
          <STLLevelsAndSecurity />
        </SectionReveal>

        {/* 9. AI Tools (universal, linked to this industry) */}
        <SectionReveal as="div">
          <AIToolsSection industrySlug={industry.slug} locationQuery={locationQuery} />
        </SectionReveal>

        {/* 10. Roadmap (universal) */}
        <SectionReveal as="div">
          <RoadmapPhasesSection />
        </SectionReveal>

        {/* 11. Nearby Services */}
        <SectionReveal as="div">
          <section className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl glass-panel card-hover p-5 border border-white/10">
              <h2 className="text-sm font-semibold text-white mb-3">Nearby Services</h2>
              <p className="text-ehb-textMuted text-xs mb-4">
                Verified {industry.name} services near your location{locationLabel ? ` in ${locationLabel}` : ""}. Demo
                – location-based data will connect in production.
              </p>
              <div className="space-y-2">
                {(flatServices.length > 0 ? flatServices.slice(0, 3) : industry.services.slice(0, 3)).map((s, i) => {
                  const label = typeof s === "string" ? s : s.name;
                  return (
                    <div
                      key={label}
                      className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2 text-[11px]"
                    >
                      <span className="text-ehb-textBody">{label}</span>
                      <span className="text-ehb-textMuted">Distance: —</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="rounded-2xl glass-panel card-hover p-5 border border-white/10">
              <h2 className="text-sm font-semibold text-white mb-3">Top Companies</h2>
              <p className="text-ehb-textMuted text-xs mb-4">
                Leading {industry.name} organizations on EHB. Demo – real companies will appear here.
              </p>
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2 text-[11px] text-ehb-textBody"
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
            <p className="text-[11px] uppercase tracking-[0.22em] text-ehb-textMuted mb-2">Actions</p>
            <h2 className="text-lg md:text-xl font-semibold text-white mb-4">Quick Actions</h2>
            <div className="flex flex-wrap gap-3 text-[11px] md:text-xs">
              {[
                { label: "Add Service", href: "/dashboard" },
                { label: "Find Work", href: "/home" },
                { label: "Hire Provider", href: `/ai-marketplace${locationQs}` },
                { label: "Start Selling", href: "/services" },
              ].map((a) => (
                <Link
                  key={a.label}
                  href={a.href}
                  className="min-h-touch inline-flex items-center justify-center rounded-full px-4 py-2 font-medium text-white transition-all duration-300 hover:scale-[1.02]"
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
          <Link
            href={`/ai-marketplace${locationQs}`}
            className="text-ehb-textMuted hover:text-[#00eaff] transition-colors"
          >
            AI Marketplace →
          </Link>
          <Link href="/" className="text-ehb-textMuted hover:text-[#00eaff] transition-colors">
            EHB Home →
          </Link>
        </section>
      </div>
    </div>
  );
}
