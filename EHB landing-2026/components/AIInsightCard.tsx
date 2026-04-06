"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface InsightCard {
  id:       string;
  icon:     string;
  message:  string;
  cta:      string;
  ctaUrl:   string;
  industry: string;
  score:    number;
}

interface AIInsightCardProps {
  industry?: string;
  limit?:    number;
  compact?:  boolean;
}

export default function AIInsightCard({ industry, limit = 3, compact = false }: AIInsightCardProps) {
  const [cards, setCards]     = useState<InsightCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const url = industry
      ? `/api/ai/insights?industry=${industry}&limit=${limit}`
      : `/api/ai/insights?limit=${limit}`;

    fetch(url)
      .then((r) => r.json())
      .then((json) => {
        if (json.success) setCards(json.data.cards);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [industry, limit]);

  function trackClick(cardId: string) {
    fetch("/api/events/track", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ eventType: "RECOMMENDATION_CLICK", entityId: cardId, entityType: "ai_insight", metadata: { industry } }),
    }).catch(() => {});
  }

  function sendFeedback(cardId: string, helpful: boolean) {
    setFeedback((prev) => ({ ...prev, [cardId]: helpful }));
    fetch("/api/ai/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cardId, helpful, industry }),
    }).catch(() => {});
  }

  if (loading) {
    return (
      <div className={`space-y-2 ${compact ? "" : "py-4"}`}>
        {Array.from({ length: compact ? 2 : limit }).map((_, i) => (
          <div key={i} className="h-14 bg-white/5 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (cards.length === 0) return null;

  if (compact) {
    return (
      <div className="space-y-2">
        {cards.map((card) => (
          <Link
            key={card.id}
            href={card.ctaUrl}
            onClick={() => trackClick(card.id)}
            className="flex items-center gap-3 p-3 rounded-xl bg-blue-950/20 border border-blue-500/20 hover:bg-blue-950/40 transition-all group"
          >
            <span className="text-xl flex-shrink-0">{card.icon}</span>
            <span className="text-sm text-white/70 group-hover:text-white flex-1 line-clamp-1">{card.message}</span>
            <span className="text-xs text-blue-400 font-semibold flex-shrink-0">{card.cta} →</span>
          </Link>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg">🤖</span>
        <h3 className="text-sm font-black text-white/50 uppercase tracking-wider">AI Insights</h3>
        <span className="text-xs px-2 py-0.5 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-full">Live</span>
      </div>

      {cards.map((card) => (
        <div
          key={card.id}
          className="rounded-2xl border border-blue-500/20 bg-gradient-to-r from-blue-950/30 to-purple-950/20 p-4 hover:border-blue-400/40 transition-all"
        >
          <div className="flex items-start gap-3">
            <div className="text-3xl flex-shrink-0">{card.icon}</div>
            <div className="flex-1">
              <p className="text-white/80 text-sm leading-relaxed mb-3">{card.message}</p>
              <div className="flex items-center gap-3">
                <Link
                  href={card.ctaUrl}
                  onClick={() => trackClick(card.id)}
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 rounded-lg text-white text-xs font-semibold transition-all hover:scale-105"
                >
                  {card.cta} →
                </Link>
                {card.score >= 80 && (
                  <span className="text-xs text-yellow-400 flex items-center gap-1">
                    🔥 High demand
                  </span>
                )}
              </div>
              <div className="mt-3 flex items-center gap-2 text-xs">
                <span className="text-white/40">Was this helpful?</span>
                <button
                  type="button"
                  onClick={() => sendFeedback(card.id, true)}
                  className={`rounded-full border px-2 py-1 ${feedback[card.id] === true ? "border-green-400/50 text-green-300" : "border-white/10 text-white/50"}`}
                >
                  👍
                </button>
                <button
                  type="button"
                  onClick={() => sendFeedback(card.id, false)}
                  className={`rounded-full border px-2 py-1 ${feedback[card.id] === false ? "border-rose-400/50 text-rose-300" : "border-white/10 text-white/50"}`}
                >
                  👎
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
