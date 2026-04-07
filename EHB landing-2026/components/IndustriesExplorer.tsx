"use client";

import { useMemo, useState } from "react";
import { INDUSTRIES } from "@/lib/industry/config";
import { IndustryCard } from "@/components/IndustryCard";

type FilterKey = "all" | "beginner" | "business" | "tech" | "local";

const FILTER_LABELS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All industries" },
  { key: "beginner", label: "Good for beginners" },
  { key: "business", label: "Business & money" },
  { key: "tech", label: "Tech, AI & IT" },
  { key: "local", label: "Local services" },
];

const BEGINNER_SLUGS = new Set([
  "education",
  "freelancing",
  "beauty",
  "fitness",
  "retail",
  "delivery",
]);

const BUSINESS_SLUGS = new Set([
  "finance",
  "consulting",
  "marketing",
  "real-estate",
  "manufacturing",
  "ngo",
]);

const TECH_SLUGS = new Set(["it", "ai", "blockchain", "security", "telecom", "research"]);

const LOCAL_SLUGS = new Set([
  "health",
  "delivery",
  "hospitality",
  "construction",
  "automotive",
  "energy",
  "environment",
]);

export function IndustriesExplorer() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterKey>("all");

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();

    return INDUSTRIES.filter((ind) => {
      // filter by query
      const matchesQuery =
        !q ||
        ind.name.toLowerCase().includes(q) ||
        ind.shortName.toLowerCase().includes(q) ||
        ind.overview.toLowerCase().includes(q);

      if (!matchesQuery) return false;

      // filter by simple buckets
      if (filter === "all") return true;
      if (filter === "beginner") return BEGINNER_SLUGS.has(ind.slug);
      if (filter === "business") return BUSINESS_SLUGS.has(ind.slug);
      if (filter === "tech") return TECH_SLUGS.has(ind.slug);
      if (filter === "local") return LOCAL_SLUGS.has(ind.slug);
      return true;
    });
  }, [query, filter]);

  const helperText =
    filter === "beginner"
      ? "Best for people who are just starting online – simple, easy-to-understand work."
      : filter === "business"
      ? "Industries focused on money, growth, and company services."
      : filter === "tech"
      ? "IT, AI, security, and research focused industries."
      : filter === "local"
      ? "Services that people often need in their own city."
      : "Use search or filters to find the right area for you.";

  return (
    <section id="industries" className="container-ultra section-pad-ultra">
      <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500 mb-2">
        32 Industries · One Profile
      </p>
      <h2 className="text-2xl md:text-3xl font-semibold text-white mb-3">
        Work in the Area That Fits You
      </h2>
      <p className="text-ehb-textMuted max-w-2xl mb-4 text-sm md:text-base">
        EHB is not only for programmers. It covers daily life and business: education, health, IT,
        delivery, shops, finance, real estate, and more.
      </p>
      <p className="text-[11px] text-ehb-textMuted mb-6">{helperText}</p>

      {/* Search + filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
        <div className="max-w-md w-full">
          <div className="flex items-center gap-2 rounded-xl glass-panel px-3 py-2 text-xs md:text-sm text-ehb-textBody">
            <span aria-hidden>🔍</span>
            <input
              className="bg-transparent outline-none flex-1 placeholder:text-ehb-textMuted"
              placeholder="Search industries (e.g. Health, IT, Delivery)…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-2 text-[11px] sm:text-xs">
          {FILTER_LABELS.map((f) => {
            const active = f.key === filter;
            return (
              <button
                key={f.key}
                type="button"
                onClick={() => setFilter(f.key)}
                className={`rounded-full px-3 py-1 border transition-all ${
                  active
                    ? "bg-gradient-to-r from-[#00eaff] to-[#22c55e] text-slate-950 border-transparent shadow-[0_0_18px_rgba(34,197,94,0.5)]"
                    : "bg-white/5 border-white/15 text-ehb-textBody hover:text-white hover:bg-white/10"
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 card-gap-ultra">
        {filtered.map((ind) => (
          <IndustryCard key={ind.slug} industry={ind} />
        ))}
      </div>

      <div className="mt-8 text-center">
        <span className="text-[11px] text-slate-500">
          This is example filtering. The live AI system will personalize industries based on your
          profile.
        </span>
      </div>
    </section>
  );
}

