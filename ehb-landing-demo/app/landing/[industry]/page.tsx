import Link from "next/link";
import { notFound } from "next/navigation";
import { getIndustryBySlug, getAllSlugs } from "@/lib/industries";
import { getIndustryServices } from "@/lib/industryServices";
import { KpiCard } from "@/components/ui/KpiCard";
import { IndustryIcon } from "@/components/IndustryIcon";
import { SectionReveal } from "@/components/SectionReveal";

interface PageProps {
  params: Promise<{ industry: string }>;
}

export async function generateStaticParams() {
  return getAllSlugs().map((industry) => ({ industry }));
}

export default async function IndustryLandingPage({ params }: PageProps) {
  const { industry: industrySlug } = await params;
  const industry = getIndustryBySlug(industrySlug);
  if (!industry) notFound();

  const serviceConfig = getIndustryServices(industry.slug);
  const categories = serviceConfig?.categories ?? [];
  const exampleServices = categories.flatMap((c) => c.services).slice(0, 4);

  const accent = industry.accentColor;

  return (
    <main className="min-h-screen text-slate-100">
      {/* Hero — industry accent, icon, trust line */}
      <section className="relative min-h-[50vh] flex flex-col justify-center overflow-hidden border-b border-white/5 hero-bg-ecosystem">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div className="container-ultra py-12 md:py-16 relative z-10">
          <div
            className="inline-flex items-center gap-2 rounded-full border glass-panel px-3 py-1.5 text-[11px] text-slate-200 mb-6"
            style={{ borderColor: `${accent}50`, boxShadow: `0 0 20px ${accent}20` }}
          >
            <IndustryIcon name={industry.icon} accentColor={accent} size={14} />
            <span>{industry.name} · Verified by EHB</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight max-w-2xl mb-4 text-white">
            {industry.heroTitle}
          </h1>
          <p className="text-slate-300 text-sm md:text-base max-w-2xl mb-8">
            {industry.heroSubtitle ?? industry.overview}
          </p>
          <div className="flex flex-wrap gap-3 mb-6">
            <Link
              href={`/industry/${industry.slug}`}
              className="min-h-touch inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:opacity-95 hover:scale-[1.02]"
              style={{
                background: `linear-gradient(135deg, ${accent}, ${accent}dd)`,
                boxShadow: `0 0 24px ${accent}40`,
              }}
            >
              {industry.heroPrimaryButton ?? `Explore ${industry.name}`}
              <span className="text-xs">→</span>
            </Link>
            <Link
              href="/dashboard"
              className="min-h-touch inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/5 backdrop-blur-sm px-5 py-2.5 text-sm font-medium text-slate-200 hover:bg-white/10 transition-all duration-300"
              style={{ borderColor: `${accent}40` }}
            >
              {industry.heroSecondaryButton ?? "Join as Provider"}
            </Link>
          </div>
          <p className="text-slate-500 text-xs font-medium">
            {categories.length > 0 ? `${categories.length}+ categories` : "Multiple services"} · Verified providers · AI powered
          </p>
        </div>
      </section>

      {/* Industry Overview */}
      <SectionReveal as="div">
        <section className="container-ultra section-pad-ultra">
          <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500 mb-2">Overview</p>
          <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4">Industry Overview</h2>
          <p className="text-slate-400 max-w-2xl">
            {industry.overview} Start earning, hiring, or growing your business in this industry today.
          </p>
        </section>
      </SectionReveal>

      {/* Key Services — categories from industryServices */}
      <SectionReveal as="div">
        <section className="container-ultra section-pad-ultra">
          <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500 mb-2">Services</p>
          <h2 className="text-2xl md:text-3xl font-semibold text-white mb-6">Key Services</h2>

          {categories.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((cat) => (
                <div
                  key={cat.slug}
                  className="rounded-2xl glass-card card-hover p-6 border transition-all duration-300"
                  style={{ borderColor: `${accent}30` }}
                >
                  <h3 className="text-lg font-semibold text-white mb-3">{cat.name}</h3>
                  <ul className="space-y-1.5">
                    {cat.services.slice(0, 5).map((s) => (
                      <li key={s.slug} className="text-sm text-slate-400 flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full shrink-0" style={{ backgroundColor: accent }} />
                        {s.name}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-5">
              {industry.services.map((service) => (
                <div
                  key={service}
                  className="rounded-xl glass-panel card-hover p-4 text-center border transition-colors"
                  style={{ borderColor: `${accent}30` }}
                >
                  <p className="text-sm font-medium text-white">{service}</p>
                </div>
              ))}
            </div>
          )}

          <div className="grid gap-4 grid-cols-1 sm:grid-cols-3 mt-10">
            <KpiCard label="Verified Providers" value="—" detail="EHB PSS & STL verified." />
            <KpiCard label="Active Services" value={categories.length > 0 ? `${categories.flatMap((c) => c.services).length}+` : `${industry.services.length}+`} detail="In this industry." />
            <KpiCard label="Franchise Cities" value="—" detail="Expand with EHB franchise." />
          </div>
        </section>
      </SectionReveal>

      {/* Popular Services */}
      <SectionReveal as="div">
        <section className="container-ultra section-pad-ultra">
          <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500 mb-2">Trending</p>
          <h2 className="text-2xl md:text-3xl font-semibold text-white mb-8">Popular Services</h2>
          <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
            {(industry.popularServices ?? (exampleServices.length >= 4 ? exampleServices.map((s) => s.name) : industry.services.slice(0, 4))).map((label) => (
              <Link
                key={label}
                href={`/industry/${industry.slug}`}
                className="block rounded-2xl glass-card card-hover p-6 border transition-all duration-300"
                style={{ borderColor: `${accent}30` }}
              >
                <p className="font-semibold text-white">{label}</p>
                <p className="text-xs text-slate-400 mt-1">{industry.name} · Verified</p>
              </Link>
            ))}
          </div>
        </section>
      </SectionReveal>

      {/* Why This Industry on EHB */}
      <SectionReveal as="div">
        <section className="container-ultra section-pad-ultra">
          <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500 mb-2">Why EHB</p>
          <h2 className="text-2xl md:text-3xl font-semibold text-white mb-8">Why {industry.name} on EHB</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: "Verified", desc: "Providers verified via EHB PSS, CRB and STL for trust." },
              { title: "Discover", desc: "Find services and providers by location, rating and need." },
              { title: "Pay & Book", desc: "One wallet, secure payments, and easy scheduling." },
              { title: "Grow", desc: "Providers get visibility; users get the right services." },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl glass-panel p-6 border border-white/10 hover:border-white/20 transition-colors">
                <div className="w-8 h-8 rounded-lg mb-3 flex items-center justify-center" style={{ backgroundColor: `${accent}25` }}>
                  <IndustryIcon name={industry.icon} accentColor={accent} size={18} />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </SectionReveal>

      {/* AI Insights */}
      <SectionReveal as="div">
        <section className="container-ultra section-pad-ultra">
          <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500 mb-2">AI Layer</p>
          <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4">AI Insights</h2>
          <div className="rounded-2xl glass-card p-8 border" style={{ borderColor: `${accent}30` }}>
            <p className="text-slate-300 max-w-2xl">
              AI will recommend demand, opportunities and suggested services for {industry.name} based on location and market trends. Providers get insights; users get better matches.
            </p>
          </div>
        </section>
      </SectionReveal>

      {/* Marketplace Preview */}
      <SectionReveal as="div">
        <section className="container-ultra section-pad-ultra">
          <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500 mb-2">Live</p>
          <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4">Marketplace Preview</h2>
          <p className="text-slate-400 max-w-2xl mb-8">Trending {industry.name.toLowerCase()} services on EHB.</p>
          <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
            {(exampleServices.length >= 4 ? exampleServices : industry.services.slice(0, 4)).map((s) => (
              <Link
                key={typeof s === "string" ? s : s.name}
                href={`/industry/${industry.slug}`}
                className="block rounded-2xl glass-card card-hover p-6 border transition-all duration-300"
                style={{ borderColor: `${accent}25` }}
              >
                <p className="font-semibold text-white">{typeof s === "string" ? s : s.name}</p>
                <p className="text-xs text-slate-400 mt-1">{industry.name} · Verified</p>
              </Link>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Link href={`/industry/${industry.slug}`} className="text-sm font-medium hover:underline" style={{ color: accent }}>
              Explore full {industry.name} marketplace →
            </Link>
          </div>
        </section>
      </SectionReveal>

      {/* Franchise */}
      <SectionReveal as="div">
        <section className="container-ultra section-pad-ultra">
          <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500 mb-2">Expand</p>
          <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4">Franchise Opportunities</h2>
          <div className="rounded-2xl glass-panel card-hover p-8 border" style={{ borderColor: `${accent}30` }}>
            <p className="text-slate-300 mb-6 max-w-2xl">
              Run {industry.name} operations in your city with EHB franchise. Revenue share, support and trust backbone included.
            </p>
            <Link
              href="/franchise"
              className="inline-flex rounded-full px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:opacity-95"
              style={{ background: `linear-gradient(135deg, ${accent}, ${accent}dd)` }}
            >
              Learn about Franchise
            </Link>
          </div>
        </section>
      </SectionReveal>

      {/* Join CTA */}
      <SectionReveal as="div">
        <section className="container-ultra section-pad-ultra">
          <div className="rounded-2xl glass-card p-10 text-center border" style={{ borderColor: `${accent}25` }}>
            <h2 className="text-2xl font-semibold text-white mb-2">Join {industry.name} on EHB</h2>
            <p className="text-slate-400 max-w-md mx-auto mb-6">
              Register as a provider or explore services. One platform for trust, payments and growth.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href={`/industry/${industry.slug}`}
                className="min-h-touch inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold text-white transition-all duration-300"
                style={{ background: `linear-gradient(135deg, ${accent}, ${accent}dd)` }}
              >
                Open {industry.name} Home
              </Link>
              <Link
                href="/"
                className="min-h-touch inline-flex items-center justify-center rounded-full glass-panel border border-white/20 px-5 py-2.5 text-sm font-medium text-slate-200 hover:bg-white/10 transition-colors"
              >
                Back to EHB Home
              </Link>
            </div>
          </div>
        </section>
      </SectionReveal>

      {/* Footer */}
      <section className="border-t border-white/5 py-8">
        <div className="container-ultra flex flex-wrap justify-center gap-6 text-sm">
          <Link href="/" className="text-slate-400 hover:text-white transition-colors">EHB Home</Link>
          <Link href="/#industries" className="text-slate-400 hover:text-white transition-colors">All Industries</Link>
          <Link href="/ai-marketplace" className="text-slate-400 hover:text-white transition-colors">Marketplace</Link>
        </div>
      </section>
    </main>
  );
}
