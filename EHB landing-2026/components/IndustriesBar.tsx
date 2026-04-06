"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { INDUSTRIES } from "@/lib/industry/config";
import { INDUSTRY_SERVICES } from "@/lib/industry/services";
import { IndustryIcon } from "@/components/IndustryIcon";

type SearchResult = {
  slug: string;
  label: string;
  subtitle?: string;
  accentColor: string;
};

function buildSearchResults(query: string): SearchResult[] {
  const q = query.trim().toLowerCase();
  const results: SearchResult[] = [];

  INDUSTRIES.forEach((ind) => {
    results.push({
      slug: ind.slug,
      label: ind.name,
      subtitle: ind.overview,
      accentColor: ind.accentColor,
    });
  });

  INDUSTRY_SERVICES.forEach((cfg) => {
    const industry = INDUSTRIES.find((i) => i.slug === cfg.industrySlug);
    if (!industry) return;
    cfg.categories.forEach((cat) => {
      cat.services.forEach((svc) => {
        results.push({
          slug: cfg.industrySlug,
          label: svc.name,
          subtitle: `${cat.name} · ${industry.name}`,
          accentColor: cfg.accentColor,
        });
      });
    });
  });

  if (!q) {
    return results.slice(0, 40);
  }

  return results
    .filter(
      (r) =>
        r.label.toLowerCase().includes(q) ||
        (r.subtitle && r.subtitle.toLowerCase().includes(q))
    )
    .slice(0, 60);
}

export function IndustriesBar() {
  const pathname = usePathname();
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [query, setQuery] = useState("");
  const resultsRef = useRef<HTMLDivElement | null>(null);

  const scroll = (direction: "left" | "right") => {
    const container = scrollRef.current;
    if (!container) return;
    const delta = direction === "left" ? -260 : 260;
    container.scrollBy({ left: delta, behavior: "smooth" });
  };

  // Gentle auto-scroll when page first loads (for visual discovery)
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    let direction: "left" | "right" = "right";
    const id = window.setInterval(() => {
      const el = scrollRef.current;
      if (!el) return;
      const maxScroll = el.scrollWidth - el.clientWidth;

      if (direction === "right" && el.scrollLeft >= maxScroll - 4) {
        direction = "left";
      } else if (direction === "left" && el.scrollLeft <= 4) {
        direction = "right";
      }

      const delta = direction === "right" ? 60 : -60;
      el.scrollBy({ left: delta, behavior: "smooth" });
    }, 1800);

    return () => window.clearInterval(id);
  }, []);

  const searchResults = buildSearchResults(query);

  return (
    <div className="border-b border-white/5 bg-[#020c1b]/80 backdrop-blur-sm sticky top-[64px] sm:top-[70px] z-40">
      <div className="container-ehb flex items-center gap-2">
        {/* Primary landing pill */}
        <Link
          href="/"
          className={`shrink-0 min-h-touch inline-flex items-center justify-center rounded-full px-3 py-1.5 text-[11px] font-medium transition-all duration-200 whitespace-nowrap border ${
            pathname === "/" || pathname.startsWith("/landing/")
              ? "bg-[#00eaff]/20 text-[#00eaff] border-[#00eaff]/60 shadow-neon-blue"
              : "text-slate-300 hover:text-white hover:bg-white/5 border-transparent"
          }`}
        >
          EHB Landing
        </Link>

        {/* All industries picker button */}
        <button
          type="button"
          onClick={() => setIsPickerOpen(true)}
          className="shrink-0 min-h-touch inline-flex items-center justify-center rounded-full px-3 py-1.5 text-[11px] font-medium text-slate-200 border border-white/20 bg-white/5 hover:bg-white/10 transition-colors gap-1.5"
        >
          <span aria-hidden>☰</span>
          <span>All industries</span>
        </button>

        {/* Left arrow */}
        <button
          type="button"
          onClick={() => scroll("left")}
          className="hidden sm:inline-flex items-center justify-center h-8 w-8 rounded-full border border-white/15 text-slate-300 hover:text-white hover:bg-white/10 transition-colors ml-1"
          aria-label="Scroll industries left"
        >
          ‹
        </button>

        {/* Scrollable industries chips */}
        <div
          id="ehb-industries-scroll"
          ref={scrollRef}
          className="flex items-center gap-1 overflow-x-auto py-2 scrollbar-hide min-h-[44px] flex-1"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {INDUSTRIES.map((ind) => {
            const landingPath = `/landing/${ind.slug}`;
            const industryHomePath = `/industry/${ind.slug}`;
            const isLanding = pathname === landingPath;
            const isIndustryHome = pathname === industryHomePath;
            const isActive = isLanding || isIndustryHome;

            const baseColor = ind.accentColor;

            return (
              <Link
                key={ind.slug}
                data-industry-slug={ind.slug}
                href={landingPath}
                className={[
                  "shrink-0 min-h-touch inline-flex items-center justify-center rounded-full px-3 py-1.5 text-[11px] font-medium transition-all duration-200 whitespace-nowrap border gap-1.5",
                  isActive
                    ? "text-slate-950 shadow-[0_0_18px_rgba(0,234,255,0.55)]"
                    : "text-slate-200 hover:text-white hover:bg-white/5 border-transparent",
                ].join(" ")}
                style={
                  isActive
                    ? {
                        background: `linear-gradient(135deg, ${baseColor}, ${baseColor}dd)`,
                        borderColor: `${baseColor}aa`,
                      }
                    : {
                        background: `${baseColor}19`,
                        borderColor: `${baseColor}33`,
                        boxShadow: `inset 0 -2px 0 0 ${baseColor}44`,
                      }
                }
              >
                <IndustryIcon
                  name={ind.icon}
                  accentColor={isActive ? "#0f172a" : baseColor}
                  size={14}
                  className="opacity-90"
                />
                {ind.shortName}
              </Link>
            );
          })}
        </div>

        {/* Right arrow */}
        <button
          type="button"
          onClick={() => scroll("right")}
          className="hidden sm:inline-flex items-center justify-center h-8 w-8 rounded-full border border-white/15 text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Scroll industries right"
        >
          ›
        </button>
      </div>

      {/* All industries picker dropdown (under bar) */}
      {isPickerOpen && (
        <div className="relative">
          <div className="absolute left-0 right-0 mt-2 z-[70] px-3 sm:px-0">
            <div className="w-full max-w-xl rounded-2xl bg-[#020617] border border-white/10 shadow-2xl p-4 sm:p-5 mx-auto">
              <div className="flex items-center justify-between gap-3 mb-3">
                <div>
                  <p className="text-sm font-semibold text-white">
                    Find industries, services & products
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Type anything – we&apos;ll highlight the most relevant industry.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPickerOpen(false)}
                  className="h-8 w-8 rounded-full border border-white/20 text-slate-300 hover:text-white hover:bg-white/10 flex items-center justify-center text-sm"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>

              {/* Search bar */}
              <div className="mb-3">
                <div className="flex items-center gap-2 rounded-xl glass-panel border border-white/15 px-3 py-1.5 text-[11px] sm:text-sm text-slate-200">
                  <span aria-hidden>🔍</span>
                  <input
                    autoFocus
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search industries, services or products..."
                    className="bg-transparent outline-none border-0 flex-1 text-[11px] sm:text-sm placeholder:text-slate-500"
                  />
                </div>
              </div>

              {/* Results with vertical scroll controls */}
              <div className="relative">
                <div
                  ref={resultsRef}
                  className="max-h-80 overflow-y-auto space-y-1.5 pr-1"
                >
                  {searchResults.map((r, idx) => (
                    <button
                      key={`${r.slug}-${idx}-${r.label.slice(0, 48)}`}
                      type="button"
                      onClick={() => {
                        setIsPickerOpen(false);
                        setQuery("");
                        router.push(`/landing/${r.slug}`);
                      }}
                      className="w-full text-left rounded-lg px-3 py-2 hover:bg-white/5 flex items-center gap-2 text-[11px] sm:text-sm"
                    >
                      <span className="h-7 w-7 rounded-full flex items-center justify-center bg-slate-900/60 border border-white/10 flex-shrink-0">
                        <IndustryIcon
                          name={INDUSTRIES.find((i) => i.slug === r.slug)?.icon ?? "Building"}
                          accentColor={r.accentColor}
                          size={14}
                        />
                      </span>
                      <div className="min-w-0">
                        <p className="text-slate-100 truncate">{r.label}</p>
                        {r.subtitle && (
                          <p className="text-[10px] text-slate-400 truncate">{r.subtitle}</p>
                        )}
                      </div>
                    </button>
                  ))}
                  {searchResults.length === 0 && (
                    <p className="text-[11px] text-slate-500 py-4 text-center">
                      No results. Try different keywords like &quot;doctor&quot;, &quot;NFT&quot; or
                      &quot;web development&quot;.
                    </p>
                  )}
                </div>

                {/* Up / Down scroll buttons */}
                <div className="hidden sm:flex flex-col gap-1 absolute right-0 top-2 bottom-2 justify-between pointer-events-none">
                  <button
                    type="button"
                    onClick={() => {
                      const el = resultsRef.current;
                      if (!el) return;
                      el.scrollBy({ top: -120, behavior: "smooth" });
                    }}
                    className="pointer-events-auto h-6 w-6 rounded-full border border-white/20 bg-black/40 text-slate-200 hover:bg-white/10 flex items-center justify-center text-xs"
                    aria-label="Scroll up"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const el = resultsRef.current;
                      if (!el) return;
                      el.scrollBy({ top: 120, behavior: "smooth" });
                    }}
                    className="pointer-events-auto h-6 w-6 rounded-full border border-white/20 bg-black/40 text-slate-200 hover:bg-white/10 flex items-center justify-center text-xs"
                    aria-label="Scroll down"
                  >
                    ↓
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
