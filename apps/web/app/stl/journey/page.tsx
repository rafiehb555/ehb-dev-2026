"use client";

/**
 * STL Level Journey Timeline — Phase 4 UI rebuild
 *
 * Displays:
 * - Visual timeline from L0 → L10
 * - User's progression with dates
 * - Current position highlighted
 * - Milestone unlocks per level
 * - Estimated time to next level
 *
 * Design: Gradient timeline, milestone cards, glassmorphism
 */

import { useState } from "react";
import Link from "next/link";
import { GlassCard } from "@/components/ui/glass-card";

const MILESTONE_DATA = [
  {
    level: 1,
    name: "FREE",
    achievedDate: "2026-02-15",
    daysToAchieve: 0,
    unlocks: [
      "Browse all services",
      "Create basic profile",
      "View public ratings",
      "Join community",
    ],
  },
  {
    level: 2,
    name: "BASIC",
    achievedDate: "2026-02-28",
    daysToAchieve: 13,
    unlocks: [
      "Post reviews",
      "Message sellers",
      "Create service listings",
      "Lock 50 EHBGC",
    ],
  },
  {
    level: 3,
    name: "NORMAL",
    achievedDate: "2026-03-15",
    daysToAchieve: 15,
    unlocks: [
      "Verified badge",
      "Priority support",
      "Unlock 100 EHBGC",
      "Limited dispute coverage",
    ],
  },
  {
    level: 4,
    name: "STANDARD",
    achievedDate: "2026-03-28",
    daysToAchieve: 13,
    unlocks: [
      "Advanced analytics",
      "Bulk operations",
      "Lock 250 EHBGC",
      "40% EHB coverage",
    ],
  },
  {
    level: 5,
    name: "ADVANCED",
    achievedDate: "2026-04-11",
    daysToAchieve: 14,
    unlocks: [
      "Featured listing",
      "Direct API access",
      "Lock 500 EHBGC",
      "70% EHB coverage",
    ],
  },
];

const UPCOMING_MILESTONES = [
  {
    level: 6,
    name: "HIGH",
    estimatedDate: "2026-05-09",
    daysEstimated: 20,
    requirements: [
      "PSS Level 5+",
      "CRB Level 5+",
      "DMO Level 5+",
      "Lock 1,000 EHBGC",
    ],
    unlocks: [
      "Elite merchant status",
      "Custom domain",
      "Advanced fraud detection",
      "80% EHB coverage",
    ],
  },
  {
    level: 7,
    name: "PRO",
    estimatedDate: "2026-06-15",
    daysEstimated: 37,
    requirements: [
      "PSS Level 6+",
      "CRB Level 6+",
      "DMO Level 6+",
      "Lock 2,500 EHBGC",
    ],
    unlocks: [
      "Top Ranking zone",
      "Premium support 24/7",
      "Custom integrations",
      "90% EHB coverage",
    ],
  },
  {
    level: 8,
    name: "VIP",
    estimatedDate: null,
    daysEstimated: null,
    requirements: [
      "PSS Level 7+",
      "CRB Level 7+",
      "DMO Level 7+",
      "Lock 5,000 EHBGC",
    ],
    unlocks: [
      "VIP concierge",
      "White-label options",
      "Priority ranking",
      "95% EHB coverage",
    ],
  },
];

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function daysSince(dateStr: string): number {
  const date = new Date(dateStr);
  const now = new Date("2026-04-19"); // Mock current date
  return Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
}

export default function JourneyPage() {
  const [expandedLevel, setExpandedLevel] = useState<number | null>(5);

  const allMilestones = [
    ...MILESTONE_DATA,
    ...UPCOMING_MILESTONES,
  ];

  return (
    <main className="min-h-screen bg-[#0C0E1A] px-4 py-8 md:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <Link
            href="/stl"
            className="inline-flex items-center gap-2 text-[#8890B0] hover:text-[#A098F8] transition-colors text-sm mb-4"
          >
            ← Back to Dashboard
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Level Journey
          </h1>
          <p className="text-sm md:text-base text-[#8890B0]">
            Your progression timeline from L1 to L8 and beyond
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-[#7B6EF6] via-[#2BBFA0] to-[#A098F8]" />

          <div className="space-y-6">
            {allMilestones.map((milestone, idx) => {
              const isAchieved = milestone.achievedDate !== undefined;
              const isCurrent = milestone.level === 5;

              return (
                <div
                  key={milestone.level}
                  className="relative ml-20 cursor-pointer"
                  onClick={() =>
                    setExpandedLevel(
                      expandedLevel === milestone.level ? null : milestone.level
                    )
                  }
                >
                  {/* Timeline dot */}
                  <div
                    className={`absolute -left-14 top-2 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                      isCurrent
                        ? "bg-[#7B6EF6] border-[#A098F8] shadow-lg shadow-[#7B6EF6]/50"
                        : isAchieved
                          ? "bg-[#2BBFA0] border-[#2BBFA0]"
                          : "bg-[#1A1D33] border-[#555A78]"
                    }`}
                  >
                    {isCurrent && (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </div>

                  {/* Card */}
                  <GlassCard
                    className={`p-5 transition-all ${
                      expandedLevel === milestone.level
                        ? "ring-2 ring-[#7B6EF6]"
                        : ""
                    } ${isCurrent ? "border-[#7B6EF6]/40" : ""}`}
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="text-sm font-bold text-[#A098F8]">
                          Level {milestone.level}
                        </div>
                        <div className="text-lg font-bold text-white">
                          {milestone.name}
                        </div>
                      </div>
                      <div className="text-right text-xs">
                        {isAchieved ? (
                          <>
                            <div className="text-[#2BBFA0] font-semibold">
                              ✓ Achieved
                            </div>
                            <div className="text-[#8890B0]">
                              {formatDate(milestone.achievedDate)}
                            </div>
                            {isCurrent && (
                              <div className="text-[#7B6EF6] font-semibold mt-1">
                                Current
                              </div>
                            )}
                          </>
                        ) : (
                          <>
                            <div className="text-[#F0A030] font-semibold">
                              ⏳ Upcoming
                            </div>
                            <div className="text-[#8890B0]">
                              Est.{" "}
                              {milestone.estimatedDate
                                ? formatDate(milestone.estimatedDate)
                                : "TBD"}
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Time info */}
                    {isAchieved && (
                      <div className="text-xs text-[#8890B0] mb-3">
                        {milestone.daysToAchieve && (
                          <>
                            Took{" "}
                            <span className="font-semibold text-white">
                              {milestone.daysToAchieve} days
                            </span>{" "}
                            to achieve
                          </>
                        )}
                      </div>
                    )}

                    {!isAchieved && (
                      <div className="text-xs text-[#8890B0] mb-3">
                        {milestone.daysEstimated && (
                          <>
                            Estimated{" "}
                            <span className="font-semibold text-white">
                              {milestone.daysEstimated} days
                            </span>{" "}
                            from now
                          </>
                        )}
                      </div>
                    )}

                    {/* Expanded content */}
                    {expandedLevel === milestone.level && (
                      <div className="mt-4 pt-4 border-t border-[rgba(255,255,255,0.07)] space-y-4">
                        {!isAchieved && (
                          <div>
                            <div className="text-xs font-semibold text-[#C8CCDF] uppercase tracking-wide mb-2">
                              Requirements
                            </div>
                            <div className="space-y-2">
                              {(milestone as any).requirements?.map(
                                (req: string, i: number) => (
                                  <div
                                    key={i}
                                    className="text-xs text-[#8890B0] flex items-center gap-2"
                                  >
                                    <div className="w-1 h-1 rounded-full bg-[#8890B0]" />
                                    {req}
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        )}

                        <div>
                          <div className="text-xs font-semibold text-[#C8CCDF] uppercase tracking-wide mb-2">
                            {isAchieved ? "Unlocked" : "Unlock"}
                          </div>
                          <div className="space-y-2">
                            {(milestone as any).unlocks?.map(
                              (unlock: string, i: number) => (
                                <div
                                  key={i}
                                  className="text-xs text-[#2BBFA0] flex items-center gap-2"
                                >
                                  <div className="w-1 h-1 rounded-full bg-[#2BBFA0]" />
                                  {unlock}
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </GlassCard>
                </div>
              );
            })}
          </div>
        </div>

        {/* Stats Footer */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <GlassCard className="p-4 text-center">
            <div className="text-3xl font-bold text-[#7B6EF6]">5</div>
            <div className="text-xs text-[#8890B0] mt-1">Levels Achieved</div>
          </GlassCard>
          <GlassCard className="p-4 text-center">
            <div className="text-3xl font-bold text-[#F0A030]">64</div>
            <div className="text-xs text-[#8890B0] mt-1">Days since L1</div>
          </GlassCard>
          <GlassCard className="p-4 text-center">
            <div className="text-3xl font-bold text-[#2BBFA0]">3</div>
            <div className="text-xs text-[#8890B0] mt-1">Levels to SUPREME</div>
          </GlassCard>
        </div>

        {/* Navigation */}
        <div className="mt-12 flex justify-center gap-3">
          <Link
            href="/stl"
            className="px-4 py-2 rounded-lg bg-[#13162A] border border-[rgba(255,255,255,0.08)] text-[#C8CCDF] text-sm font-medium hover:border-[rgba(255,255,255,0.12)] transition-colors"
          >
            ← Back to Dashboard
          </Link>
          <Link
            href="/stl/ranking"
            className="px-4 py-2 rounded-lg bg-[#7B6EF6]/20 border border-[#7B6EF6]/40 text-[#A098F8] text-sm font-medium hover:bg-[#7B6EF6]/30 transition-colors"
          >
            View Ranking →
          </Link>
        </div>
      </div>
    </main>
  );
}
