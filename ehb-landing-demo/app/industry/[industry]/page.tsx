import Link from "next/link";
import { notFound } from "next/navigation";
import { getIndustryBySlug, getAllSlugs } from "@/lib/industries";

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

  return (
    <main className="min-h-screen text-slate-100">
      <div className="container-ehb py-8 md:py-10 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400 mb-1">
              {industry.name} · Industry Home
            </p>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold leading-tight gradient-text">
              {industry.heroTitle}
            </h1>
            <p className="text-slate-400 text-sm mt-2 max-w-xl">
              Trending services, nearby providers, top companies and AI suggestions for {industry.name}.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href={`/landing/${industry.slug}`} className="px-3 py-1.5 rounded-full glass-panel text-slate-200 hover:text-white hover:shadow-neon-blue transition-all duration-200 text-xs">
              {industry.name} Landing
            </Link>
            <Link href="/dashboard" className="px-3 py-1.5 rounded-full bg-gradient-to-r from-[#00eaff] to-[#3b82f6] text-slate-950 font-semibold btn-glow text-xs">
              Dashboard
            </Link>
          </div>
        </div>

        {/* Trending Services */}
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500 mb-2">Marketplace</p>
          <h2 className="text-lg md:text-xl font-semibold text-white mb-4">Trending Services</h2>
          <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {industry.services.map((service) => (
              <div key={service} className="rounded-2xl glass-card card-hover p-4 flex flex-col gap-2">
                <p className="text-xs font-medium text-white line-clamp-2">{service}</p>
                <span className="text-[10px] text-slate-400">Explore →</span>
              </div>
            ))}
          </div>
        </div>

        {/* Nearby Providers + Top Companies (placeholder blocks) */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl glass-panel card-hover p-5">
            <h2 className="text-sm font-semibold text-white mb-3">Nearby Providers</h2>
            <p className="text-slate-400 text-xs mb-4">
              Verified {industry.name} providers in your area. Demo – location-based data will connect in production.
            </p>
            <div className="space-y-2">
              {industry.services.slice(0, 3).map((s) => (
                <div key={s} className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2 text-[11px]">
                  <span className="text-slate-200">{s}</span>
                  <span className="text-slate-500">—</span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl glass-panel card-hover p-5">
            <h2 className="text-sm font-semibold text-white mb-3">Top Companies</h2>
            <p className="text-slate-400 text-xs mb-4">
              Leading {industry.name} organizations on EHB. Demo – real companies will appear here.
            </p>
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2 text-[11px] text-slate-300">
                  Company {i} · {industry.name}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI Suggestions */}
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500 mb-2">AI Layer</p>
          <h2 className="text-lg md:text-xl font-semibold text-white mb-4">AI Suggestions</h2>
          <div className="rounded-2xl glass-card p-6 border border-[#00eaff]/20">
            <p className="text-slate-300 text-sm">
              AI Insight: Demand for {industry.name} services is tracked by EHB. Activate your profile to get personalized opportunities and location-based recommendations.
            </p>
          </div>
        </div>

        {/* Latest Jobs / Opportunities */}
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500 mb-2">Opportunities</p>
          <h2 className="text-lg md:text-xl font-semibold text-white mb-4">Latest Jobs & Opportunities</h2>
          <div className="rounded-2xl glass-panel p-5">
            <p className="text-slate-400 text-sm">
              Jobs and gigs in {industry.name} will appear here. Same UI for all industries – data from JPS and marketplace.
            </p>
            <Link href="/dashboard" className="mt-3 inline-flex rounded-full border border-[#00eaff]/40 px-4 py-2 text-xs font-medium text-cyan-200 hover:bg-[#00eaff]/10 transition-colors">
              Go to Dashboard
            </Link>
          </div>
        </div>

        {/* Marketplace link */}
        <div className="flex flex-wrap gap-3 pt-4">
          <Link href="/ai-marketplace" className="text-xs text-slate-400 hover:text-[#00eaff] transition-colors">
            AI Marketplace →
          </Link>
          <Link href="/" className="text-xs text-slate-400 hover:text-[#00eaff] transition-colors">
            EHB Home →
          </Link>
        </div>
      </div>
    </main>
  );
}
