"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchJson } from "@/lib/fetchJson";

type FranchiseDashboardData = {
  franchiseInfo: {
    id: string;
    name: string;
    tier: "ONLINE" | "SUB" | "MASTER" | "CORPORATE" | "COUNTRY";
    territory: string;
    stlLevel: number;
    verificationStatus: "PENDING" | "APPROVED" | "VERIFIED";
  };
  overview: {
    territoryStats: {
      active: number;
      pending: number;
      paused: number;
    };
    revenueThisMonth: number;
    downlineCount: number;
    activeDownline: number;
  };
  revenue: {
    thisMonth: number;
    lastMonth: number;
    ytd: number;
    breakdown: {
      orderCommissions: number;
      referralBonuses: number;
      networkShare: number;
      other: number;
    };
    monthlyChart: Array<{ month: string; amount: number }>;
  };
  downline: Array<{
    id: string;
    name: string;
    tier: string;
    stlLevel: number;
    territory: string;
    revenue: number;
    status: "ACTIVE" | "PAUSED" | "PENDING";
  }>;
  tasks: Array<{
    id: string;
    type: "APPROVAL" | "VERIFICATION" | "TERRITORY" | "REPORT";
    title: string;
    dueDate: string;
    priority: "HIGH" | "MEDIUM" | "LOW";
    status: "OPEN" | "IN_PROGRESS";
  }>;
};

const fallbackData: FranchiseDashboardData = {
  franchiseInfo: {
    id: "fr-master-001",
    name: "Lahore Metro Franchise",
    tier: "MASTER",
    territory: "Lahore & vicinity",
    stlLevel: 6,
    verificationStatus: "VERIFIED",
  },
  overview: {
    territoryStats: { active: 12, pending: 2, paused: 1 },
    revenueThisMonth: 45230,
    downlineCount: 15,
    activeDownline: 13,
  },
  revenue: {
    thisMonth: 45230,
    lastMonth: 41580,
    ytd: 298460,
    breakdown: {
      orderCommissions: 24100,
      referralBonuses: 12500,
      networkShare: 6850,
      other: 1780,
    },
    monthlyChart: [
      { month: "Jan", amount: 32100 },
      { month: "Feb", amount: 35800 },
      { month: "Mar", amount: 38200 },
      { month: "Apr", amount: 39900 },
      { month: "May", amount: 41580 },
      { month: "Jun", amount: 45230 },
    ],
  },
  downline: [
    {
      id: "sub-1",
      name: "Downtown Services",
      tier: "SUB",
      stlLevel: 4,
      territory: "Lahore Downtown",
      revenue: 18500,
      status: "ACTIVE",
    },
    {
      id: "sub-2",
      name: "DHA Enterprises",
      tier: "SUB",
      stlLevel: 5,
      territory: "Lahore DHA",
      revenue: 22100,
      status: "ACTIVE",
    },
    {
      id: "sub-3",
      name: "Township Sellers",
      tier: "ONLINE",
      stlLevel: 2,
      territory: "Online",
      revenue: 5200,
      status: "ACTIVE",
    },
    {
      id: "sub-4",
      name: "Emerging Markets",
      tier: "SUB",
      stlLevel: 3,
      territory: "Lahore Outskirts",
      revenue: 8900,
      status: "PENDING",
    },
  ],
  tasks: [
    {
      id: "task-1",
      type: "APPROVAL",
      title: "Approve new Sub-franchise application",
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      priority: "HIGH",
      status: "OPEN",
    },
    {
      id: "task-2",
      type: "VERIFICATION",
      title: "Submit quarterly STL verification",
      dueDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(),
      priority: "HIGH",
      status: "OPEN",
    },
    {
      id: "task-3",
      type: "TERRITORY",
      title: "Review and optimize territory coverage",
      dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
      priority: "MEDIUM",
      status: "IN_PROGRESS",
    },
    {
      id: "task-4",
      type: "REPORT",
      title: "Submit monthly performance report",
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      priority: "MEDIUM",
      status: "OPEN",
    },
  ],
};

const tierColors = {
  ONLINE: { text: "text-blue-300", bg: "bg-blue-500/20", border: "border-blue-400/30" },
  SUB: { text: "text-green-300", bg: "bg-green-500/20", border: "border-green-400/30" },
  MASTER: { text: "text-purple-300", bg: "bg-purple-500/20", border: "border-purple-400/30" },
  CORPORATE: { text: "text-amber-300", bg: "bg-amber-500/20", border: "border-amber-400/30" },
  COUNTRY: { text: "text-teal-300", bg: "bg-teal-500/20", border: "border-teal-400/30" },
};

export default function FranchiseDashboardPage() {
  const [data, setData] = useState<FranchiseDashboardData>(fallbackData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void fetchJson<FranchiseDashboardData>("/api/franchise/dashboard-data", fallbackData)
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  const tierColor = tierColors[data.franchiseInfo.tier];

  return (
    <main className="min-h-screen text-white">
      <div className="container-ehb py-8 space-y-8">
        {/* Header Section */}
        <section
          className="rounded-2xl border border-purple-400/30 p-6 md:p-8"
          style={{ background: "rgba(19,22,42,0.8)", backdropFilter: "blur(12px)" }}
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-wider text-purple-300 font-semibold">Franchise Dashboard</p>
              <h1 className="mt-2 text-3xl md:text-4xl font-bold">{data.franchiseInfo.name}</h1>
              <div className="flex flex-wrap gap-4 mt-3">
                <div>
                  <p className="text-xs text-white/60">Territory</p>
                  <p className="text-sm font-semibold text-white mt-1">{data.franchiseInfo.territory}</p>
                </div>
                <div>
                  <p className="text-xs text-white/60">Tier</p>
                  <p className={`text-sm font-semibold mt-1 ${tierColor.text}`}>{data.franchiseInfo.tier}</p>
                </div>
                <div>
                  <p className="text-xs text-white/60">STL Level</p>
                  <p className="text-sm font-semibold text-white mt-1">L{data.franchiseInfo.stlLevel}</p>
                </div>
                <div>
                  <p className="text-xs text-white/60">Status</p>
                  <p className={`text-sm font-semibold mt-1 ${data.franchiseInfo.verificationStatus === "VERIFIED" ? "text-green-300" : "text-amber-300"}`}>
                    {data.franchiseInfo.verificationStatus}
                  </p>
                </div>
              </div>
            </div>
            <Link
              href="/franchise"
              className="px-4 py-2 rounded-lg text-sm border border-white/20 text-white hover:bg-white/5 transition-all duration-200"
            >
              ← Back to Hub
            </Link>
          </div>
        </section>

        {/* Quick Stats */}
        <section className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          <div
            className="rounded-xl border border-white/10 p-4"
            style={{ background: "rgba(19,22,42,0.6)", backdropFilter: "blur(8px)" }}
          >
            <p className="text-xs text-white/60 uppercase tracking-wider">Territory Stats</p>
            <div className="mt-3 space-y-1">
              <p className="text-xs text-white/80">
                <span className="font-bold text-green-300">{data.overview.territoryStats.active}</span> active
              </p>
              <p className="text-xs text-white/80">
                <span className="font-bold text-amber-300">{data.overview.territoryStats.pending}</span> pending
              </p>
            </div>
          </div>
          <div
            className="rounded-xl border border-white/10 p-4"
            style={{ background: "rgba(19,22,42,0.6)", backdropFilter: "blur(8px)" }}
          >
            <p className="text-xs text-white/60 uppercase tracking-wider">This Month</p>
            <p className="mt-3 text-2xl font-bold text-green-300">${(data.overview.revenueThisMonth / 1000).toFixed(1)}K</p>
          </div>
          <div
            className="rounded-xl border border-white/10 p-4"
            style={{ background: "rgba(19,22,42,0.6)", backdropFilter: "blur(8px)" }}
          >
            <p className="text-xs text-white/60 uppercase tracking-wider">Downline</p>
            <p className="mt-3 text-2xl font-bold text-blue-300">{data.overview.activeDownline}/{data.overview.downlineCount}</p>
          </div>
          <div
            className="rounded-xl border border-white/10 p-4"
            style={{ background: "rgba(19,22,42,0.6)", backdropFilter: "blur(8px)" }}
          >
            <p className="text-xs text-white/60 uppercase tracking-wider">YTD Revenue</p>
            <p className="mt-3 text-2xl font-bold text-purple-300">${(data.revenue.ytd / 1000).toFixed(0)}K</p>
          </div>
        </section>

        {/* Revenue Section */}
        <section className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
          {/* Chart Area */}
          <div
            className="rounded-2xl border border-white/10 p-6 md:p-8"
            style={{ background: "rgba(19,22,42,0.7)", backdropFilter: "blur(12px)" }}
          >
            <div className="mb-6">
              <h2 className="text-xl font-bold text-white">Revenue Trend</h2>
              <p className="text-xs text-white/60 mt-1">Last 6 months performance</p>
            </div>
            <div className="space-y-4">
              {data.revenue.monthlyChart.map((item, idx) => {
                const maxAmount = Math.max(...data.revenue.monthlyChart.map((m) => m.amount));
                const percentage = (item.amount / maxAmount) * 100;
                return (
                  <div key={idx}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold text-white">{item.month}</span>
                      <span className="text-sm font-bold text-green-300">${(item.amount / 1000).toFixed(1)}K</span>
                    </div>
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-green-500 to-emerald-600 transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Revenue Breakdown */}
          <div
            className="rounded-2xl border border-white/10 p-6 md:p-8"
            style={{ background: "rgba(19,22,42,0.7)", backdropFilter: "blur(12px)" }}
          >
            <h2 className="text-xl font-bold text-white mb-6">This Month Breakdown</h2>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-white/80">Order Commissions</span>
                  <span className="font-bold text-white">${data.revenue.breakdown.orderCommissions.toLocaleString()}</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-cyan-500"
                    style={{
                      width: `${(data.revenue.breakdown.orderCommissions / data.overview.revenueThisMonth) * 100}%`,
                    }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-white/80">Referral Bonuses</span>
                  <span className="font-bold text-white">${data.revenue.breakdown.referralBonuses.toLocaleString()}</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-500"
                    style={{
                      width: `${(data.revenue.breakdown.referralBonuses / data.overview.revenueThisMonth) * 100}%`,
                    }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-white/80">Network Share</span>
                  <span className="font-bold text-white">${data.revenue.breakdown.networkShare.toLocaleString()}</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500"
                    style={{
                      width: `${(data.revenue.breakdown.networkShare / data.overview.revenueThisMonth) * 100}%`,
                    }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-white/80">Other</span>
                  <span className="font-bold text-white">${data.revenue.breakdown.other.toLocaleString()}</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500"
                    style={{
                      width: `${(data.revenue.breakdown.other / data.overview.revenueThisMonth) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Downline Section */}
        <section
          className="rounded-2xl border border-white/10 p-6 md:p-8"
          style={{ background: "rgba(19,22,42,0.7)", backdropFilter: "blur(12px)" }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white">Your Downline</h2>
              <p className="text-xs text-white/60 mt-1">{data.downline.length} franchises in your network</p>
            </div>
            <Link
              href="/franchise/apply?action=recruit"
              className="px-4 py-2 rounded-lg text-sm bg-green-600 hover:bg-green-700 text-white font-semibold transition-all duration-200"
            >
              + Recruit
            </Link>
          </div>
          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {data.downline.map((item) => {
              const itemColor = tierColors[item.tier as keyof typeof tierColors] || tierColors.ONLINE;
              return (
                <div
                  key={item.id}
                  className={`rounded-xl border ${itemColor.border} ${itemColor.bg} p-4 hover:border-opacity-60 transition-all duration-300 cursor-pointer`}
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-white">{item.name}</h3>
                      <p className="text-xs text-white/70 mt-1">{item.territory}</p>
                      <div className="flex flex-wrap gap-3 mt-2">
                        <span className={`text-xs font-semibold ${itemColor.text}`}>{item.tier}</span>
                        <span className="text-xs text-white/60">L{item.stlLevel}</span>
                        <span
                          className={`text-xs font-semibold ${item.status === "ACTIVE" ? "text-green-300" : item.status === "PENDING" ? "text-amber-300" : "text-red-300"}`}
                        >
                          {item.status}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-white/60">Monthly Revenue</p>
                      <p className="text-lg font-bold text-green-300 mt-1">${(item.revenue / 1000).toFixed(1)}K</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Verification & Tasks Section */}
        <section className="grid gap-4 lg:grid-cols-2">
          {/* Verification Status */}
          <div
            className="rounded-2xl border border-white/10 p-6 md:p-8"
            style={{ background: "rgba(19,22,42,0.7)", backdropFilter: "blur(12px)" }}
          >
            <h2 className="text-xl font-bold text-white mb-6">Verification Status</h2>
            <div className="space-y-4">
              <div className="p-4 rounded-lg border border-green-400/30 bg-green-500/10">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-400" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-white">Identity Verification</p>
                    <p className="text-xs text-white/60 mt-1">Verified on 2024-12-15</p>
                  </div>
                  <span className="text-xs font-bold text-green-300">✓</span>
                </div>
              </div>
              <div className="p-4 rounded-lg border border-green-400/30 bg-green-500/10">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-400" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-white">Business Registration</p>
                    <p className="text-xs text-white/60 mt-1">Verified on 2024-11-20</p>
                  </div>
                  <span className="text-xs font-bold text-green-300">✓</span>
                </div>
              </div>
              <div className="p-4 rounded-lg border border-amber-400/30 bg-amber-500/10">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-amber-400" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-white">STL Quarterly Review</p>
                    <p className="text-xs text-white/60 mt-1">Due on 2026-04-30</p>
                  </div>
                  <span className="text-xs font-bold text-amber-300">Pending</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tasks */}
          <div
            className="rounded-2xl border border-white/10 p-6 md:p-8"
            style={{ background: "rgba(19,22,42,0.7)", backdropFilter: "blur(12px)" }}
          >
            <h2 className="text-xl font-bold text-white mb-6">Pending Tasks</h2>
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {data.tasks.map((task) => {
                const bgColor = task.priority === "HIGH" ? "bg-red-500/10 border-red-400/30" : "bg-amber-500/10 border-amber-400/30";
                const textColor = task.priority === "HIGH" ? "text-red-300" : "text-amber-300";
                const dueDate = new Date(task.dueDate);
                const daysLeft = Math.ceil((dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                return (
                  <div key={task.id} className={`rounded-lg border p-4 ${bgColor}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-white">{task.title}</p>
                        <p className={`text-xs font-semibold mt-2 ${textColor}`}>{task.type}</p>
                        <p className="text-xs text-white/60 mt-1">
                          Due in {daysLeft} day{daysLeft !== 1 ? "s" : ""}
                        </p>
                      </div>
                      <button className="px-3 py-1 rounded text-xs font-semibold bg-white/10 text-white hover:bg-white/20 transition-all duration-200">
                        View
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Additional Actions */}
        <section className="grid gap-4 md:grid-cols-3">
          <Link
            href="/franchise/territory-map"
            className="rounded-xl border border-white/10 p-4 hover:border-white/30 transition-all duration-300 group"
            style={{ background: "rgba(19,22,42,0.6)" }}
          >
            <p className="text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors">Territory Management</p>
            <p className="text-xs text-white/60 mt-2">Expand coverage and optimize locations</p>
          </Link>
          <Link
            href="/franchise/performance"
            className="rounded-xl border border-white/10 p-4 hover:border-white/30 transition-all duration-300 group"
            style={{ background: "rgba(19,22,42,0.6)" }}
          >
            <p className="text-sm font-semibold text-white group-hover:text-green-300 transition-colors">Performance Analytics</p>
            <p className="text-xs text-white/60 mt-2">Deep dive into metrics and KPIs</p>
          </Link>
          <Link
            href="/franchise/settings"
            className="rounded-xl border border-white/10 p-4 hover:border-white/30 transition-all duration-300 group"
            style={{ background: "rgba(19,22,42,0.6)" }}
          >
            <p className="text-sm font-semibold text-white group-hover:text-purple-300 transition-colors">Settings & Profile</p>
            <p className="text-xs text-white/60 mt-2">Manage account and preferences</p>
          </Link>
        </section>
      </div>
    </main>
  );
}
