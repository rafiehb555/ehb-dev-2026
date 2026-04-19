"use client";

/**
 * DMO STL Admin Overview — Phase 4 UI rebuild (2026-04-19)
 *
 * Real functionality:
 *   - KPI strip: Avg STL, L7+ count, Level upgrades, Downgrades
 *   - Level distribution bar chart (L1-L10)
 *   - Recent STL changes table
 *   - Navigate to sub-pages
 *
 * Structural changes:
 *   - Hero upgraded to glass design system
 *   - KPI cards use consistent styling
 *   - All links point to sub-pages for detail
 */

"use client";

import Link from "next/link";
import { useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress-bar";

// Mock KPI data
const mockKPIs = {
  averageSTL: 62.3,
  topTierCount: 1247, // L7+
  upgradesThisWeek: 342,
  downgradesThisWeek: 28,
  totalUsers: 52841,
};

// Mock level distribution
const levelDistribution = [
  { level: 1, count: 4200, pct: 7.9 },
  { level: 2, count: 6800, pct: 12.9 },
  { level: 3, count: 9200, pct: 17.4 },
  { level: 4, count: 8900, pct: 16.8 },
  { level: 5, count: 12400, pct: 23.5 },
  { level: 6, count: 5800, pct: 11.0 },
  { level: 7, count: 2400, pct: 4.5 },
  { level: 8, count: 1200, pct: 2.3 },
  { level: 9, count: 600, pct: 1.1 },
  { level: 10, count: 341, pct: 0.6 },
];

// Mock recent changes
const recentChanges = [
  {
    id: "LOG-2461",
    user: "Ali Hassan",
    type: "UPGRADE",
    from: 4,
    to: 5,
    reason: "KYC_VERIFIED",
    timestamp: "2026-04-19T14:32:00Z",
    entity: "Personal",
  },
  {
    id: "LOG-2460",
    user: "Fatima Khan",
    type: "UPGRADE",
    from: 9,
    to: 10,
    reason: "THRESHOLD_MET",
    timestamp: "2026-04-19T12:15:00Z",
    entity: "Personal",
  },
  {
    id: "LOG-2459",
    user: "GoSellr Platform",
    type: "DOWNGRADE",
    from: 8,
    to: 7,
    reason: "COMPLAINT_FILED",
    timestamp: "2026-04-19T10:45:00Z",
    entity: "Service",
  },
  {
    id: "LOG-2458",
    user: "OLS Legal",
    type: "UPGRADE",
    from: 5,
    to: 6,
    reason: "CRB_CERTIFICATION",
    timestamp: "2026-04-19T09:20:00Z",
    entity: "Product",
  },
  {
    id: "LOG-2457",
    user: "WMS Karachi",
    type: "UPGRADE",
    from: 6,
    to: 7,
    reason: "SERVICE_HOURS_MET",
    timestamp: "2026-04-18T16:50:00Z",
    entity: "Service",
  },
  {
    id: "LOG-2456",
    user: "Zainab Ali",
    type: "DOWNGRADE",
    from: 4,
    to: 3,
    reason: "FRAUD_ALERT",
    timestamp: "2026-04-18T14:12:00Z",
    entity: "Personal",
  },
];

function formatTime(iso: string): string {
  const date = new Date(iso);
  const now = new Date("2026-04-19T15:00:00Z");
  const diff = now.getTime() - date.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (hours === 0) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return date.toLocaleDateString();
}

function getChangeColor(
  type: string
): "bg-green-500/20" | "bg-red-500/20" | "bg-amber-500/20" {
  if (type === "UPGRADE") return "bg-green-500/20";
  if (type === "DOWNGRADE") return "bg-red-500/20";
  return "bg-amber-500/20";
}

function getReasonLabel(reason: string): string {
  const reasons: Record<string, string> = {
    KYC_VERIFIED: "KYC Verified",
    THRESHOLD_MET: "Threshold Met",
    COMPLAINT_FILED: "Complaint Filed",
    CRB_CERTIFICATION: "CRB Cert",
    SERVICE_HOURS_MET: "Service Hours",
    FRAUD_ALERT: "Fraud Alert",
  };
  return reasons[reason] || reason;
}

export default function DmoStlAdminPage() {
  const maxCount = Math.max(...levelDistribution.map((d) => d.count));

  return (
    <main className="min-h-screen bg-[#0C0E1A] px-4 py-8 md:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
            STL Admin Overview
          </h1>
          <p className="text-sm md:text-base text-[#8890B0]">
            Service Trust Level KPIs and platform statistics
          </p>
        </div>

        {/* KPI Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {/* Avg STL */}
          <GlassCard className="p-6">
            <div className="text-sm text-[#8890B0] uppercase tracking-wide mb-2">
              Avg STL
            </div>
            <div className="text-3xl font-bold text-[#7B6EF6] mb-2">
              {mockKPIs.averageSTL.toFixed(1)}
            </div>
            <div className="text-xs text-[#8890B0]">Out of 100 points</div>
          </GlassCard>

          {/* L7+ Count */}
          <GlassCard className="p-6">
            <div className="text-sm text-[#8890B0] uppercase tracking-wide mb-2">
              Top Tier (L7+)
            </div>
            <div className="text-3xl font-bold text-[#F0A030] mb-2">
              {mockKPIs.topTierCount.toLocaleString()}
            </div>
            <div className="text-xs text-[#8890B0]">
              {((mockKPIs.topTierCount / mockKPIs.totalUsers) * 100).toFixed(2)}%
              of platform
            </div>
          </GlassCard>

          {/* Upgrades */}
          <GlassCard className="p-6">
            <div className="text-sm text-[#8890B0] uppercase tracking-wide mb-2">
              Upgrades
            </div>
            <div className="text-3xl font-bold text-[#38C878] mb-2">
              +{mockKPIs.upgradesThisWeek}
            </div>
            <div className="text-xs text-[#8890B0]">This week</div>
          </GlassCard>

          {/* Downgrades */}
          <GlassCard className="p-6">
            <div className="text-sm text-[#8890B0] uppercase tracking-wide mb-2">
              Downgrades
            </div>
            <div className="text-3xl font-bold text-[#F05858] mb-2">
              -{mockKPIs.downgradesThisWeek}
            </div>
            <div className="text-xs text-[#8890B0]">This week</div>
          </GlassCard>
        </div>

        {/* Level Distribution */}
        <GlassCard className="mb-12 p-8">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-white">Level Distribution</h2>
            <p className="text-xs text-[#8890B0] mt-1">
              User count by STL level
            </p>
          </div>

          <div className="space-y-4">
            {levelDistribution.map((item) => (
              <div key={item.level}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="text-sm font-bold text-[#A098F8] w-8 text-center">
                      L{item.level}
                    </div>
                    <div className="text-xs text-[#8890B0]">
                      {item.count.toLocaleString()} users
                    </div>
                  </div>
                  <div className="text-xs text-[#C8CCDF] font-semibold">
                    {item.pct}%
                  </div>
                </div>
                <ProgressBar
                  value={(item.count / maxCount) * 100}
                  max={100}
                  color={
                    item.level >= 7
                      ? "#F0A030"
                      : item.level >= 5
                        ? "#7B6EF6"
                        : "#2BBFA0"
                  }
                  height="8px"
                />
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-[rgba(255,255,255,0.07)] text-xs text-[#8890B0]">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-white font-bold">
                  {mockKPIs.totalUsers.toLocaleString()}
                </div>
                <div>Total Users</div>
              </div>
              <div>
                <div className="text-white font-bold">L1-L3</div>
                <div>Growth Tier</div>
              </div>
              <div>
                <div className="text-white font-bold">L7-L10</div>
                <div>Elite Zone</div>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Recent Changes Table */}
        <GlassCard className="p-8 mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-white">Recent STL Changes</h2>
              <p className="text-xs text-[#8890B0] mt-1">
                Last 24 hours of level upgrades and downgrades
              </p>
            </div>
            <Link
              href="/dmo/stl/history"
              className="text-xs text-[#7B6EF6] hover:text-[#A098F8] transition-colors font-semibold"
            >
              View All →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[rgba(255,255,255,0.07)]">
                  <th className="text-left text-xs font-semibold text-[#8890B0] uppercase tracking-wide pb-3">
                    User
                  </th>
                  <th className="text-left text-xs font-semibold text-[#8890B0] uppercase tracking-wide pb-3">
                    Type
                  </th>
                  <th className="text-left text-xs font-semibold text-[#8890B0] uppercase tracking-wide pb-3">
                    From → To
                  </th>
                  <th className="text-left text-xs font-semibold text-[#8890B0] uppercase tracking-wide pb-3">
                    Reason
                  </th>
                  <th className="text-left text-xs font-semibold text-[#8890B0] uppercase tracking-wide pb-3">
                    Time
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentChanges.map((change) => (
                  <tr
                    key={change.id}
                    className="border-b border-[rgba(255,255,255,0.04)] hover:bg-[rgba(123,110,246,0.05)] transition-colors"
                  >
                    <td className="py-3">
                      <div className="text-[#C8CCDF] font-medium">
                        {change.user}
                      </div>
                      <div className="text-xs text-[#8890B0]">{change.entity}</div>
                    </td>
                    <td className="py-3">
                      <Badge
                        className={`text-xs font-semibold ${
                          change.type === "UPGRADE"
                            ? "bg-[#38C878]/30 text-[#38C878]"
                            : "bg-[#F05858]/30 text-[#F05858]"
                        }`}
                      >
                        {change.type === "UPGRADE" ? "↑" : "↓"} {change.type}
                      </Badge>
                    </td>
                    <td className="py-3">
                      <div className="text-[#C8CCDF] font-mono text-xs">
                        L{change.from} → L{change.to}
                      </div>
                    </td>
                    <td className="py-3">
                      <div className="text-xs text-[#8890B0]">
                        {getReasonLabel(change.reason)}
                      </div>
                    </td>
                    <td className="py-3 text-xs text-[#8890B0]">
                      {formatTime(change.timestamp)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>

        {/* Quick Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          <Link
            href="/dmo/stl/scores"
            className="group relative overflow-hidden rounded-lg p-6 bg-[#13162A] border border-[rgba(255,255,255,0.08)] hover:border-[#7B6EF6]/40 transition-all"
          >
            <div className="relative z-10">
              <div className="text-2xl mb-2">📊</div>
              <h3 className="font-bold text-white mb-1">All User Scores</h3>
              <p className="text-xs text-[#8890B0]">Filter and drill into any user STL</p>
            </div>
          </Link>

          <Link
            href="/dmo/stl/breakdown"
            className="group relative overflow-hidden rounded-lg p-6 bg-[#13162A] border border-[rgba(255,255,255,0.08)] hover:border-[#2BBFA0]/40 transition-all"
          >
            <div className="relative z-10">
              <div className="text-2xl mb-2">🔍</div>
              <h3 className="font-bold text-white mb-1">Breakdown Detail</h3>
              <p className="text-xs text-[#8890B0]">PSS × CRB × DMO formula</p>
            </div>
          </Link>

          <Link
            href="/dmo/stl/ranking"
            className="group relative overflow-hidden rounded-lg p-6 bg-[#13162A] border border-[rgba(255,255,255,0.08)] hover:border-[#F0A030]/40 transition-all"
          >
            <div className="relative z-10">
              <div className="text-2xl mb-2">🏆</div>
              <h3 className="font-bold text-white mb-1">Ranking Engine</h3>
              <p className="text-xs text-[#8890B0]">View top 50 by category</p>
            </div>
          </Link>

          <Link
            href="/dmo/stl/history"
            className="group relative overflow-hidden rounded-lg p-6 bg-[#13162A] border border-[rgba(255,255,255,0.08)] hover:border-[#38C878]/40 transition-all"
          >
            <div className="relative z-10">
              <div className="text-2xl mb-2">📈</div>
              <h3 className="font-bold text-white mb-1">Change History</h3>
              <p className="text-xs text-[#8890B0]">Timeline of all upgrades/downgrades</p>
            </div>
          </Link>

          <Link
            href="/dmo/ehb-stl-level"
            className="group relative overflow-hidden rounded-lg p-6 bg-[#13162A] border border-[rgba(255,255,255,0.08)] hover:border-[#A098F8]/40 transition-all"
          >
            <div className="relative z-10">
              <div className="text-2xl mb-2">📖</div>
              <h3 className="font-bold text-white mb-1">STL Reference</h3>
              <p className="text-xs text-[#8890B0]">10-level table & formulas</p>
            </div>
          </Link>

          <Link
            href="/dmo/dmo-stl"
            className="group relative overflow-hidden rounded-lg p-6 bg-[#13162A] border border-[rgba(255,255,255,0.08)] hover:border-[#7B6EF6]/40 transition-all"
          >
            <div className="relative z-10">
              <div className="text-2xl mb-2">⚙️</div>
              <h3 className="font-bold text-white mb-1">DMO STL View</h3>
              <p className="text-xs text-[#8890B0]">All data in one dashboard</p>
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
}
