"use client";

import { useEffect, useState } from "react";
import AIInsightCard from "@/components/AIInsightCard";

type TrendingData = {
  topServices: { title: string; count: number }[];
  trendingKeywords: string[];
  demandChange: number;
};

export function IndustryAiPanel({ industry }: { industry: string }) {
  const [trending, setTrending] = useState<TrendingData | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/ai/trending?industry=${industry}`, { cache: "no-store" })
      .then((res) => res.json())
      .then((json) => {
        if (!cancelled && json.success) setTrending(json.data);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [industry]);

  return (
    <section className="rounded-2xl glass-card p-6 border border-white/10 space-y-5">
      <div>
        <p className="text-[11px] uppercase tracking-[0.22em] text-ehb-textMuted mb-2">AI Layer</p>
        <h2 className="text-lg md:text-xl font-semibold text-white">AI Recommendations</h2>
      </div>

      <AIInsightCard industry={industry} limit={3} />

      {trending && (
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs text-ehb-textMuted uppercase tracking-wider mb-1">Demand Change</p>
            <p className="text-2xl font-black text-white">+{trending.demandChange}%</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 md:col-span-2">
            <p className="text-xs text-ehb-textMuted uppercase tracking-wider mb-2">People Also Search</p>
            <div className="flex flex-wrap gap-2">
              {trending.trendingKeywords.map((keyword) => (
                <span key={keyword} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
