"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { INDUSTRIES } from "@/lib/industries";
import { INDUSTRY_SERVICES } from "@/lib/industryServices";

type SearchResult = {
  slug: string;
  label: string;
  score: number;
};

function buildAllResults(query: string): SearchResult[] {
  const q = query.trim().toLowerCase();
  const results: SearchResult[] = [];

  if (!q) return results;

  INDUSTRIES.forEach((ind) => {
    const name = ind.name.toLowerCase();
    const short = ind.shortName.toLowerCase();
    if (name.includes(q) || short.includes(q)) {
      results.push({ slug: ind.slug, label: ind.name, score: 3 });
    }
  });

  INDUSTRY_SERVICES.forEach((cfg) => {
    const industry = INDUSTRIES.find((i) => i.slug === cfg.industrySlug);
    if (!industry) return;
    cfg.categories.forEach((cat) => {
      const catName = cat.name.toLowerCase();
      if (catName.includes(q)) {
        results.push({
          slug: cfg.industrySlug,
          label: `${cat.name} · ${industry.name}`,
          score: 2,
        });
      }
      cat.services.forEach((svc) => {
        const sName = svc.name.toLowerCase();
        if (sName.includes(q)) {
          results.push({
            slug: cfg.industrySlug,
            label: `${svc.name} · ${industry.name}`,
            score: 4,
          });
        }
      });
    });
  });

  return results.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.label.length - b.label.length;
  });
}

export function HeaderSearch() {
  const [value, setValue] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();

  const suggestions = useMemo(
    () => buildAllResults(value).slice(0, 8),
    [value]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const all = buildAllResults(value);
    if (!all.length) return;
    const best = all[0];
    setIsSearching(true);
    router.push(`/landing/${best.slug}`);
  };

  return (
    <div className="relative flex-1 min-w-[180px] w-full order-3 sm:order-none max-w-xl mx-0 sm:mx-2">
      <form onSubmit={handleSubmit}>
        <div className="flex items-center gap-2 rounded-xl glass-panel px-3 sm:px-4 py-1.5 sm:py-2 w-full text-[11px] sm:text-sm text-slate-200 border border-white/10">
          <span aria-hidden>🔍</span>
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={
              isSearching
                ? "Opening best matching industry..."
                : "Search industries, services, products…"
            }
            className="bg-transparent outline-none border-0 flex-1 text-[11px] sm:text-sm placeholder:text-slate-500"
          />
        </div>
      </form>

      {/* Suggestions dropdown under the bar */}
      {value.trim().length > 0 && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 mt-1 z-50">
          <div className="rounded-2xl bg-[#020617] border border-white/10 shadow-xl py-1 max-h-72 overflow-y-auto">
            {suggestions.map((s) => (
              <button
                key={`${s.slug}-${s.label}`}
                type="button"
                onClick={() => {
                  setIsSearching(true);
                  setValue("");
                  router.push(`/landing/${s.slug}`);
                }}
                className="w-full text-left px-3 py-1.5 text-[11px] sm:text-sm text-slate-100 hover:bg-white/5"
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}


