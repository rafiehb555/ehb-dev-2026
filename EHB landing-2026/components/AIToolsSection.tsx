import React from "react";
import Link from "next/link";

type AiToolTile = {
  emoji: string;
  title: string;
  arrowLine: string;
  accent: string;
};

const TILES: AiToolTile[] = [
  { emoji: "⚖️", title: "AI Lawyer", arrowLine: "→ Legal advice, compliance, contracts", accent: "#6B7280" },
  { emoji: "🩺", title: "AI Doctor", arrowLine: "→ Medical guidance & health support", accent: "#29ABE2" },
  { emoji: "💼", title: "AI Resume Builder", arrowLine: "→ Professional CV generation", accent: "#22B14C" },
  { emoji: "🧾", title: "AI Contract Generator", arrowLine: "→ Automated legal agreements", accent: "#8B5CF6" },
  { emoji: "✈️", title: "AI Travel Planner", arrowLine: "→ Smart trip planning", accent: "#0EA5E9" },
];

function Tile({ t, href }: { t: AiToolTile; href: string }) {
  return (
    <Link
      href={href}
      className="block rounded-2xl glass-card border p-5 card-hover transition-all duration-300"
      style={{ borderColor: `${t.accent}40`, boxShadow: `0 0 26px ${t.accent}16` }}
      aria-label={t.title}
    >
      <div className="flex items-start gap-3">
        <div
          className="h-11 w-11 rounded-2xl flex items-center justify-center text-lg border"
          style={{
            backgroundColor: `${t.accent}18`,
            borderColor: `${t.accent}33`,
            boxShadow: `0 0 18px ${t.accent}25`,
          }}
          aria-hidden
        >
          {t.emoji}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-white">{t.title}</p>
          <p className="text-[11px] text-ehb-textBody mt-1 leading-relaxed">{t.arrowLine}</p>
        </div>
      </div>
    </Link>
  );
}

export function AIToolsSection({
  industrySlug,
  locationQuery,
}: {
  industrySlug?: string;
  locationQuery?: { country?: string; state?: string; city?: string };
}) {
  const buildHref = (toolTitle: string) => {
    const params = new URLSearchParams();
    params.set("tool", toolTitle);
    if (industrySlug) params.set("industry", industrySlug);
    if (locationQuery?.country) params.set("country", locationQuery.country);
    if (locationQuery?.state) params.set("state", locationQuery.state);
    if (locationQuery?.city) params.set("city", locationQuery.city);
    return `/ai-marketplace?${params.toString()}`;
  };

  return (
    <section className="container-ultra section-pad-ultra pt-4">
      <p className="text-[11px] uppercase tracking-[0.22em] text-ehb-textMuted mb-2">Top Trusted AI Tools</p>
      <h2 className="text-2xl md:text-3xl font-semibold text-white mb-3">AI that helps you act safely</h2>
      <p className="text-ehb-textMuted max-w-2xl mb-6 text-sm md:text-base">
        These AI tools are designed for EHB’s verified ecosystem. They guide decisions, reduce confusion, and
        match you with trusted services.
      </p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TILES.map((t) => (
          <Tile key={t.title} t={t} href={buildHref(t.title)} />
        ))}
      </div>
    </section>
  );
}

