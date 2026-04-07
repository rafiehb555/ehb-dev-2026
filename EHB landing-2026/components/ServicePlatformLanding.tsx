import Link from "next/link";
import type { ReactNode } from "react";
import { TrustBadgeLegend } from "@/components/TrustBadgeLegend";
import { STLLevelsAndSecurity } from "@/components/STLLevelsAndSecurity";
import { AIToolsSection } from "@/components/AIToolsSection";

type ServicePlatformLandingProps = {
  acronym: "WMS" | "AGTS" | "OLS" | "SOT" | "HPS";
  title: string;
  subtitle: string;
  industrySlugForAi?: string;
  accentColor: string;
  bullets: string[];
  locationQuery?: { country?: string; state?: string; city?: string };
};

export function ServicePlatformLanding({
  acronym,
  title,
  subtitle,
  industrySlugForAi,
  accentColor,
  bullets,
  locationQuery,
}: ServicePlatformLandingProps) {
  const locationQs = (() => {
    if (!locationQuery) return "";
    const sp = new URLSearchParams();
    if (locationQuery.country) sp.set("country", locationQuery.country);
    if (locationQuery.state) sp.set("state", locationQuery.state);
    if (locationQuery.city) sp.set("city", locationQuery.city);
    const qs = sp.toString();
    return qs ? `?${qs}` : "";
  })();

  return (
    <main className="min-h-screen text-slate-100">
      <div className="container-ehb py-8 space-y-6">
        <section className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full border glass-panel px-3 py-1.5 text-[11px] text-slate-200"
            style={{ borderColor: `${accentColor}55`, boxShadow: `0 0 22px ${accentColor}22` }}
          >
            <span aria-hidden>{acronym}</span>
            <span className="text-ehb-textMuted">Service Platform</span>
          </div>

          {locationQs ? (
            <div className="inline-flex items-center gap-2 rounded-full border glass-panel px-3 py-1.5 text-[11px] text-slate-200 border-white/10">
              <span aria-hidden>📍</span>
              <span className="text-ehb-textMuted">Location context enabled</span>
            </div>
          ) : null}

          <h1 className="text-2xl md:text-3xl font-semibold leading-tight gradient-text">{title}</h1>
          <p className="text-ehb-textMuted max-w-2xl">{subtitle}</p>
        </section>

        <section
          className="rounded-3xl glass-panel border border-white/10 p-5 md:p-6 overflow-hidden relative"
          style={{
            boxShadow: `0 0 30px ${accentColor}14`,
          }}
        >
          <div className="absolute inset-0 pointer-events-none opacity-[0.06]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.9) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.9) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
            aria-hidden
          />

          <div className="relative grid gap-6 lg:grid-cols-12 items-start">
            <div className="lg:col-span-7 space-y-3">
              <p className="text-[11px] uppercase tracking-[0.22em] text-ehb-textMuted mb-1">What this platform adds</p>
              <ul className="space-y-2">
                {bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2 text-ehb-textBody">
                    <span aria-hidden className="mt-[2px]">✅</span>
                    <span className="leading-relaxed">{b}</span>
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap gap-3 pt-2">
                <Link
                  href={`/ai-marketplace${locationQs}`}
                  className="min-h-touch inline-flex items-center justify-center rounded-full bg-gradient-to-r px-6 py-2.5 text-sm font-semibold text-slate-950 btn-glow"
                  style={{ backgroundImage: `linear-gradient(135deg, ${accentColor}, ${accentColor}dd)` }}
                >
                  Explore AI tools
                  <span className="text-xs ml-2">→</span>
                </Link>
                <Link
                  href={`/dmo${locationQs}`}
                  className="min-h-touch inline-flex items-center justify-center rounded-full border border-white/25 bg-white/5 backdrop-blur-sm px-6 py-2.5 text-sm font-semibold text-slate-200 hover:bg-white/10 transition-all"
                >
                  View DMO monitoring
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-3">
              <div className="glass-card card-hover rounded-2xl border p-4" style={{ borderColor: `${accentColor}35` }}>
                <p className="text-[11px] uppercase tracking-[0.22em] text-ehb-textMuted mb-2">Trust stack</p>
                <div className="space-y-2">
                  {[
                    { label: "PSS Verified", note: "identity & documents" },
                    { label: "CRB Certified", note: "business/company verification" },
                    { label: "STL Level", note: "trust score tier" },
                    { label: "EHB-STL Payments", note: "secure settlement" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-start justify-between gap-3">
                      <span className="text-slate-200 text-[11px] font-semibold">{item.label}</span>
                      <span className="text-slate-500 text-[10px]">{item.note}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-card rounded-2xl border p-4" style={{ borderColor: `${accentColor}25` }}>
                <p className="text-[11px] uppercase tracking-[0.22em] text-ehb-textMuted mb-2">Quick next step</p>
                <p className="text-sm text-ehb-textBody leading-relaxed">
                  Use AI tools to match verified providers, then book and complete with secure trust layers.
                </p>
                <div className="mt-3">
                  <Link
                    href={
                      (() => {
                        const sp = new URLSearchParams();
                        if (industrySlugForAi) sp.set("industry", industrySlugForAi);
                        if (locationQuery?.country) sp.set("country", locationQuery.country);
                        if (locationQuery?.state) sp.set("state", locationQuery.state);
                        if (locationQuery?.city) sp.set("city", locationQuery.city);
                        const qs = sp.toString();
                        return qs ? `/ai-marketplace?${qs}` : "/ai-marketplace";
                      })()
                    }
                    className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-4 py-2 text-[11px] text-slate-200 hover:bg-white/10 transition-colors w-full"
                  >
                    Open marketplace for this context
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <SectionRevealWrap>
          <TrustBadgeLegend />
        </SectionRevealWrap>
        <SectionRevealWrap>
          <STLLevelsAndSecurity />
        </SectionRevealWrap>
        <SectionRevealWrap>
          <AIToolsSection industrySlug={industrySlugForAi} locationQuery={locationQuery} />
        </SectionRevealWrap>
      </div>
    </main>
  );
}

function SectionRevealWrap({ children }: { children: React.ReactNode }) {
  // Avoid importing SectionReveal here to keep dependencies minimal across “platform” routes.
  return <div className="mt-6">{children}</div>;
}

