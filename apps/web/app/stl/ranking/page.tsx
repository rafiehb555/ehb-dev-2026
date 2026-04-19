"use client";

/**
 * STL My Ranking Page — Phase 4 UI rebuild
 *
 * Displays:
 * - Overall ranking position
 * - Category ranking (industry-specific)
 * - Ranking factors breakdown
 * - Top performers nearby
 * - L7+ Top Ranking zone indicator
 *
 * Design: Gradient ranking cards, leaderboard tables, glassmorphism
 */

import { useState } from "react";
import Link from "next/link";
import { GlassCard } from "@/components/ui/glass-card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Badge } from "@/components/ui/badge";

const RANKING_FACTORS = [
  { name: "STL Level", weight: 35, value: 75, icon: "🏅" },
  { name: "Rating", weight: 25, value: 4.8, icon: "⭐" },
  { name: "Complaints", weight: 15, value: 2, icon: "⚠️" },
  { name: "Orders", weight: 10, value: 145, icon: "📦" },
  { name: "Delivery", weight: 8, value: 98, icon: "🚚" },
  { name: "Response Time", weight: 4, value: 2, icon: "⚡" },
  { name: "Location Freshness", weight: 3, value: 100, icon: "📍" },
];

const TOP_PERFORMERS = [
  {
    rank: 1,
    name: "Fatima Khan",
    category: "E-commerce",
    stlLevel: 10,
    rating: 4.95,
    verified: true,
    topRanking: true,
  },
  {
    rank: 2,
    name: "Ahmed Hassan",
    category: "Legal Services",
    stlLevel: 9,
    rating: 4.9,
    verified: true,
    topRanking: true,
  },
  {
    rank: 3,
    name: "You",
    category: "E-commerce",
    stlLevel: 5,
    rating: 4.8,
    verified: true,
    topRanking: false,
    isYou: true,
  },
  {
    rank: 4,
    name: "Zainab Ali",
    category: "Medical",
    stlLevel: 8,
    rating: 4.85,
    verified: true,
    topRanking: true,
  },
  {
    rank: 5,
    name: "Omar Malik",
    category: "Education",
    stlLevel: 7,
    rating: 4.82,
    verified: true,
    topRanking: true,
  },
];

const CATEGORY_LEADERS = [
  {
    category: "E-commerce",
    yourRank: 3,
    totalInCategory: 842,
    topUser: "Fatima Khan",
    yourScore: 82.5,
  },
  {
    category: "Legal Services",
    yourRank: 18,
    totalInCategory: 156,
    topUser: "Ahmed Hassan",
    yourScore: 78.2,
  },
  {
    category: "Education",
    yourRank: 42,
    totalInCategory: 289,
    topUser: "Dr. Saeed Ahmed",
    yourScore: 72.1,
  },
];

export default function RankingPage() {
  const [selectedFactor, setSelectedFactor] = useState<string | null>(null);

  return (
    <main className="min-h-screen bg-[#0C0E1A] px-4 py-8 md:px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <Link
            href="/stl"
            className="inline-flex items-center gap-2 text-[#8890B0] hover:text-[#A098F8] transition-colors text-sm mb-4"
          >
            ← Back to Dashboard
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
            My Ranking
          </h1>
          <p className="text-sm md:text-base text-[#8890B0]">
            Your position on the EHB global ranking engine
          </p>
        </div>

        {/* Overall Position */}
        <GlassCard className="mb-12 p-8 md:p-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Rank Display */}
            <div>
              <div className="text-sm text-[#8890B0] uppercase tracking-wide mb-2">
                Overall Rank
              </div>
              <div className="mb-6">
                <div className="flex items-baseline gap-3 mb-2">
                  <div className="text-5xl md:text-6xl font-bold text-[#7B6EF6]">
                    #3
                  </div>
                  <div className="text-lg text-[#8890B0]">out of 52,841</div>
                </div>
                <div className="text-sm text-[#2BBFA0]">
                  ↑ 127 positions this month
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#8890B0]">Percentile</span>
                  <span className="text-white font-semibold">Top 0.006%</span>
                </div>
                <ProgressBar value={99.994} max={100} color="#7B6EF6" />
              </div>
            </div>

            {/* Top Ranking Zone */}
            <div className="bg-gradient-to-br from-[#A098F8]/10 to-[#2BBFA0]/10 border border-[#A098F8]/30 rounded-lg p-6">
              <div className="text-center">
                <div className="text-3xl mb-2">🌟</div>
                <div className="text-sm font-bold text-[#A098F8] uppercase tracking-wide mb-2">
                  Top Ranking Zone
                </div>
                <div className="text-xs text-[#C8CCDF] mb-4">
                  L7+ is eligible for premium ranking features
                </div>

                <div className="bg-[#1A1D33] rounded-lg p-4 mb-4">
                  <div className="text-2xl font-bold text-[#2BBFA0] mb-1">
                    L5
                  </div>
                  <div className="text-xs text-[#8890B0]">
                    You're 2 levels away from Top Ranking eligibility
                  </div>
                </div>

                <div className="text-xs text-[#8890B0]">
                  At L7+: Premium badge, featured listings, priority support
                </div>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Ranking Factors */}
        <div className="mb-12">
          <h2 className="text-lg font-bold text-white mb-6">
            Ranking Factors Breakdown
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {RANKING_FACTORS.map((factor) => (
              <GlassCard
                key={factor.name}
                className="p-5 cursor-pointer transition-all hover:border-[rgba(255,255,255,0.12)]"
                onClick={() =>
                  setSelectedFactor(
                    selectedFactor === factor.name ? null : factor.name
                  )
                }
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{factor.icon}</div>
                    <div>
                      <div className="text-sm font-semibold text-[#C8CCDF]">
                        {factor.name}
                      </div>
                      <div className="text-xs text-[#8890B0]">
                        Weight: {factor.weight}%
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-[#7B6EF6]">
                      {factor.value}
                    </div>
                  </div>
                </div>

                <ProgressBar
                  value={(factor.weight * 100) / 100}
                  max={100}
                  color="#2BBFA0"
                  height="5px"
                />

                {selectedFactor === factor.name && (
                  <div className="mt-3 pt-3 border-t border-[rgba(255,255,255,0.07)] text-xs text-[#8890B0]">
                    {factor.name === "STL Level" &&
                      "Your Service Trust Level determines baseline ranking. Higher STL = higher baseline position."}
                    {factor.name === "Rating" &&
                      "Average customer rating from verified reviews. Maintained above 4.5 for top rankings."}
                    {factor.name === "Complaints" &&
                      "Verified complaints logged against you. Lower is better. Used for anti-fraud detection."}
                    {factor.name === "Orders" &&
                      "Total verified transactions completed. More orders = more trust signals."}
                    {factor.name === "Delivery" &&
                      "On-time delivery percentage for service-based roles. 95%+ required for L6+."}
                    {factor.name === "Response Time" &&
                      "Average hours to respond to inquiries. Faster responses boost ranking."}
                    {factor.name === "Location Freshness" &&
                      "How recently you've updated your location/availability. Stale profiles rank lower."}
                  </div>
                )}
              </GlassCard>
            ))}
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="mb-12">
          <h2 className="text-lg font-bold text-white mb-6">
            Category Rankings
          </h2>

          <div className="space-y-4">
            {CATEGORY_LEADERS.map((cat) => (
              <GlassCard key={cat.category} className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-center">
                  <div>
                    <div className="text-sm font-semibold text-[#C8CCDF]">
                      {cat.category}
                    </div>
                    <div className="text-xs text-[#8890B0] mt-1">
                      Leader: {cat.topUser}
                    </div>
                  </div>

                  <div className="text-center sm:text-left">
                    <div className="text-2xl font-bold text-[#7B6EF6]">
                      #{cat.yourRank}
                    </div>
                    <div className="text-xs text-[#8890B0]">
                      of {cat.totalInCategory.toLocaleString()}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-[#8890B0] mb-1">Score</div>
                    <div className="text-lg font-bold text-[#2BBFA0]">
                      {cat.yourScore}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs text-[#8890B0] mb-1">Percentile</div>
                    <ProgressBar
                      value={
                        ((cat.totalInCategory - cat.yourRank) /
                          cat.totalInCategory) *
                        100
                      }
                      max={100}
                      color="#A098F8"
                      height="4px"
                    />
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>

        {/* Leaderboard Nearby */}
        <div className="mb-12">
          <h2 className="text-lg font-bold text-white mb-6">
            Top Performers Nearby
          </h2>

          <div className="space-y-3">
            {TOP_PERFORMERS.map((user) => (
              <GlassCard
                key={user.rank}
                className={`p-5 ${user.isYou ? "border-[#7B6EF6]/40" : ""}`}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="text-2xl font-bold text-[#A098F8] w-8 text-center">
                      #{user.rank}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold text-[#C8CCDF]">
                          {user.name}
                        </span>
                        {user.isYou && (
                          <Badge className="text-xs bg-[#7B6EF6]/30 text-[#A098F8]">
                            You
                          </Badge>
                        )}
                        {user.verified && (
                          <span className="text-[#2BBFA0] text-xs">✓</span>
                        )}
                        {user.topRanking && (
                          <span className="text-[#F0A030] text-xs">★</span>
                        )}
                      </div>
                      <div className="text-xs text-[#8890B0]">
                        {user.category}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="text-xs text-[#8890B0] mb-1">Level</div>
                      <div className="text-lg font-bold text-[#7B6EF6]">
                        L{user.stlLevel}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-[#8890B0] mb-1">Rating</div>
                      <div className="text-lg font-bold text-[#2BBFA0]">
                        {user.rating}⭐
                      </div>
                    </div>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/stl"
            className="px-4 py-2 rounded-lg bg-[#13162A] border border-[rgba(255,255,255,0.08)] text-[#C8CCDF] text-sm font-medium hover:border-[rgba(255,255,255,0.12)] transition-colors"
          >
            ← Back to Dashboard
          </Link>
          <Link
            href="/stl/journey"
            className="px-4 py-2 rounded-lg bg-[#13162A] border border-[rgba(255,255,255,0.08)] text-[#C8CCDF] text-sm font-medium hover:border-[rgba(255,255,255,0.12)] transition-colors"
          >
            View Journey
          </Link>
        </div>
      </div>
    </main>
  );
}
