import React from "react";

type TrustBadge = {
  emoji: string;
  title: string;
  meaning: string;
  accent: string;
};

const BADGES: TrustBadge[] = [
  {
    emoji: "🛡️",
    title: "PSS Verified",
    meaning: "Identity & document verified",
    accent: "#22c55e",
  },
  {
    emoji: "🏛️",
    title: "CRB Certified",
    meaning: "Business/company verified",
    accent: "#3b82f6",
  },
  {
    emoji: "⭐",
    title: "STL Level",
    meaning: "Trust score level",
    accent: "#f59e0b",
  },
  {
    emoji: "🌐",
    title: "DMO Registered",
    meaning: "Marketplace officially registered",
    accent: "#8b5cf6",
  },
  {
    emoji: "🏢",
    title: "Franchise Verified",
    meaning: "Verified through EHB franchise",
    accent: "#f97316",
  },
  {
    emoji: "🔁",
    title: "Refilling Count",
    meaning: "Number of verification renewals",
    accent: "#94a3b8",
  },
  {
    emoji: "⚠️",
    title: "Complaints",
    meaning: "Complaint history indicator",
    accent: "#ef4444",
  },
];

function BadgeCard({ badge }: { badge: TrustBadge }) {
  return (
    <div
      className="rounded-2xl glass-card border p-4 card-hover transition-all duration-300"
      style={{ borderColor: `${badge.accent}40`, boxShadow: `0 0 26px ${badge.accent}18` }}
    >
      <div className="flex items-start gap-3">
        <div
          className="h-10 w-10 rounded-2xl flex items-center justify-center text-lg border"
          style={{
            backgroundColor: `${badge.accent}18`,
            borderColor: `${badge.accent}33`,
            boxShadow: `0 0 18px ${badge.accent}25`,
          }}
          aria-hidden
        >
          {badge.emoji}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-white leading-tight">
            {badge.emoji} {badge.title}
          </p>
          <p className="text-[11px] text-ehb-textBody mt-1 leading-relaxed">→ {badge.meaning}</p>
        </div>
      </div>
    </div>
  );
}

export function TrustBadgeLegend() {
  return (
    <section className="container-ultra section-pad-ultra pt-4">
      <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500 mb-2">Trust badges</p>
      <h2 className="text-2xl md:text-3xl font-semibold text-white mb-3">Instant verification meaning</h2>
      <p className="text-ehb-textMuted max-w-2xl mb-6 text-sm md:text-base">
        These badges explain how verification and trust work in the EHB marketplace.
      </p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {BADGES.map((b) => (
          <BadgeCard key={b.title} badge={b} />
        ))}
      </div>
    </section>
  );
}

