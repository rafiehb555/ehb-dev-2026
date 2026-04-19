"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";

// Mock data
const mockAffiliateData = {
  overview: {
    totalReferrals: 127,
    activeReferrals: 94,
    totalEarnings: 45230.50,
    monthlyEarnings: 8750.25,
    referralLink: "https://ehb.app/ref/AFF-2024-DEMO-7K9",
  },
  downlineTree: {
    level1: [
      {
        id: "ref-001",
        name: "Ahmed Ali",
        commission: 5,
        earnings: 12450,
        stlLevel: "L4",
        referrals: 18,
        avatar: "AA",
        level2: [
          { id: "ref-101", name: "Fatima Khan", commission: 3, earnings: 3200, stlLevel: "L3", referrals: 8, avatar: "FK" },
          { id: "ref-102", name: "Hassan Malik", commission: 3, earnings: 2890, stlLevel: "L2", referrals: 6, avatar: "HM" },
          { id: "ref-103", name: "Sara Ahmed", commission: 3, earnings: 1950, stlLevel: "L2", referrals: 4, avatar: "SA" },
        ],
      },
      {
        id: "ref-002",
        name: "Zainab Hassan",
        commission: 5,
        earnings: 9870,
        stlLevel: "L4",
        referrals: 14,
        avatar: "ZH",
        level2: [
          { id: "ref-104", name: "Ali Raza", commission: 3, earnings: 2450, stlLevel: "L3", referrals: 6, avatar: "AR" },
          { id: "ref-105", name: "Mariam Said", commission: 3, earnings: 1680, stlLevel: "L2", referrals: 3, avatar: "MS" },
        ],
      },
      {
        id: "ref-003",
        name: "Muhammad Rashid",
        commission: 5,
        earnings: 8320,
        stlLevel: "L3",
        referrals: 12,
        avatar: "MR",
        level2: [
          { id: "ref-106", name: "Noor Hassan", commission: 3, earnings: 1990, stlLevel: "L2", referrals: 5, avatar: "NH" },
        ],
      },
    ],
  },
  commissionRates: {
    electronics: { min: 3, max: 5 },
    fashion: { min: 8, max: 12 },
    health: { min: 6, max: 10 },
    education: { min: 5, max: 8 },
    travel: { min: 4, max: 7 },
    legal: { min: 5, max: 9 },
  },
  earningsHistory: [
    { date: "2026-04-19", source: "Order Commission", amount: 125.50, level: "L1", category: "Electronics", status: "Completed" },
    { date: "2026-04-18", source: "Franchise Sale", amount: 450.00, level: "L2", category: "Legal", status: "Completed" },
    { date: "2026-04-17", source: "Order Commission", amount: 89.30, level: "L1", category: "Fashion", status: "Completed" },
    { date: "2026-04-16", source: "Product Affiliate", amount: 34.75, level: "L3", category: "Electronics", status: "Pending" },
    { date: "2026-04-15", source: "Order Commission", amount: 210.00, level: "L1", category: "Health", status: "Completed" },
  ],
  performance: {
    monthlyGrowth: [
      { month: "Jan", value: 28 },
      { month: "Feb", value: 35 },
      { month: "Mar", value: 52 },
      { month: "Apr", value: 94 },
    ],
    conversionRate: 7.2,
    avgOrderValue: 1240,
  },
  achievements: [
    { badge: "🚀", title: "First 10 Referrals", unlocked: true },
    { badge: "⭐", title: "50 Referrals", unlocked: true },
    { badge: "💎", title: "100 Referrals", unlocked: true },
    { badge: "🏆", title: "$1,000 Earned", unlocked: true },
    { badge: "👑", title: "Super Affiliate", unlocked: false },
    { badge: "🌟", title: "Network Leader", unlocked: false },
  ],
};

export default function AffiliatePage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [referralCopied, setReferralCopied] = useState(false);
  const [calcAmount, setCalcAmount] = useState(1000);

  const tabs = [
    { id: "overview", label: "Overview", icon: "📊" },
    { id: "referral-link", label: "Referral Link", icon: "🔗" },
    { id: "downline", label: "Downline Tree", icon: "🌳" },
    { id: "calculator", label: "Commission Calculator", icon: "🧮" },
    { id: "sources", label: "3 Commission Sources", icon: "💰" },
    { id: "history", label: "Earnings History", icon: "📜" },
    { id: "performance", label: "Performance", icon: "📈" },
    { id: "growth", label: "Network Growth", icon: "📱" },
    { id: "achievements", label: "Achievements", icon: "🎯" },
    { id: "settings", label: "Settings", icon: "⚙️" },
    { id: "help", label: "Help & FAQ", icon: "❓" },
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setReferralCopied(true);
    setTimeout(() => setReferralCopied(false), 2000);
  };

  const calculateCommission = (amount: number, category: string) => {
    const rates = mockAffiliateData.commissionRates[category as keyof typeof mockAffiliateData.commissionRates];
    if (!rates) return 0;
    const rate = (rates.min + rates.max) / 2 / 100;
    return (amount * rate).toFixed(2);
  };

  return (
    <main className="min-h-screen text-white">
      <div className="container-ehb py-8 space-y-6">
        {/* Header */}
        <section className="rounded-2xl border border-emerald-400/20 bg-gradient-to-b from-[#031222]/95 to-[#020b18]/95 p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-emerald-300">Earn Passive Income</p>
              <h1 className="mt-1 text-2xl font-semibold gradient-text">Affiliate Dashboard</h1>
              <p className="mt-1 text-sm text-ehb-textBody">
                Grow your network, earn commissions from 3 engines, and reach affiliate milestones.
              </p>
            </div>
            <Link href="/affiliate/join" className="ehb-btn-primary ehb-press whitespace-nowrap">
              Invite Someone
            </Link>
          </div>
        </section>

        {/* Tab Navigation */}
        <div className="overflow-x-auto pb-2">
          <div className="flex gap-2 min-w-max px-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30"
                    : "bg-white/5 text-ehb-textBody hover:bg-white/10"
                }`}
              >
                <span className="mr-1">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="min-h-[500px]">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="ehb-card-elevated">
                  <div className="text-xs ehb-text-muted">Total Referrals</div>
                  <div className="mt-3 text-3xl font-bold text-emerald-300">{mockAffiliateData.overview.totalReferrals}</div>
                </div>
                <div className="ehb-card-elevated">
                  <div className="text-xs ehb-text-muted">Active Referrals</div>
                  <div className="mt-3 text-3xl font-bold text-teal-300">{mockAffiliateData.overview.activeReferrals}</div>
                </div>
                <div className="ehb-card-elevated">
                  <div className="text-xs ehb-text-muted">Total Earnings</div>
                  <div className="mt-3 text-3xl font-bold text-amber-300">
                    ${mockAffiliateData.overview.totalEarnings.toLocaleString("en-US", { maximumFractionDigits: 2 })}
                  </div>
                </div>
                <div className="ehb-card-elevated">
                  <div className="text-xs ehb-text-muted">Monthly Earnings</div>
                  <div className="mt-3 text-3xl font-bold text-cyan-300">
                    ${mockAffiliateData.overview.monthlyEarnings.toLocaleString("en-US", { maximumFractionDigits: 2 })}
                  </div>
                </div>
              </div>

              <div className="ehb-card-elevated p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Referral Link</h3>
                <div className="flex gap-3 flex-col sm:flex-row">
                  <div className="flex-1 bg-white/5 rounded-lg p-3 border border-white/10 font-mono text-sm text-cyan-300 break-all">
                    {mockAffiliateData.overview.referralLink}
                  </div>
                  <button
                    onClick={() => copyToClipboard(mockAffiliateData.overview.referralLink)}
                    className="ehb-btn-secondary px-4 whitespace-nowrap"
                  >
                    {referralCopied ? "✓ Copied" : "Copy Link"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Referral Link Tab */}
          {activeTab === "referral-link" && (
            <div className="space-y-6">
              <div className="ehb-card-elevated p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Your Unique Referral Link</h3>
                <div className="bg-white/5 rounded-lg p-4 border border-white/10 mb-4">
                  <div className="font-mono text-sm text-cyan-300 break-all mb-4">{mockAffiliateData.overview.referralLink}</div>
                  <button
                    onClick={() => copyToClipboard(mockAffiliateData.overview.referralLink)}
                    className="ehb-btn-primary px-4 py-2"
                  >
                    {referralCopied ? "✓ Copied to Clipboard" : "Copy Link"}
                  </button>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <a
                  href={`https://wa.me/?text=Join%20EHB%20with%20my%20referral%20link%3A%20${encodeURIComponent(mockAffiliateData.overview.referralLink)}`}
                  className="ehb-card-elevated p-4 text-center hover:ring-2 ring-emerald-500/50 transition-all cursor-pointer block"
                >
                  <span className="text-3xl mb-2 block">💬</span>
                  <p className="font-semibold text-white">Share on WhatsApp</p>
                  <p className="text-xs text-ehb-textMuted mt-1">Send to friends and family</p>
                </a>
                <a
                  href={`mailto:?subject=Join EHB Affiliate Program&body=Check out my referral link: ${mockAffiliateData.overview.referralLink}`}
                  className="ehb-card-elevated p-4 text-center hover:ring-2 ring-emerald-500/50 transition-all cursor-pointer block"
                >
                  <span className="text-3xl mb-2 block">📧</span>
                  <p className="font-semibold text-white">Share via Email</p>
                  <p className="text-xs text-ehb-textMuted mt-1">Send email invitation</p>
                </a>
              </div>

              <div className="ehb-card-elevated p-6">
                <h3 className="text-lg font-semibold text-white mb-4">QR Code</h3>
                <div className="bg-white/10 rounded-lg p-8 flex items-center justify-center min-h-[240px]">
                  <div className="text-center">
                    <div className="w-32 h-32 bg-white rounded-lg flex items-center justify-center mx-auto mb-4">
                      <svg className="w-20 h-20 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M3 3h4v4H3V3zm2 2v2h2V5H5zm0 3h4v4H5V8zm2 2v2h2v-2H7zm6-7h4v4h-4V3zm2 2v2h2V5h-2zM3 13h4v4H3v-4zm2 2v2h2v-2H5zm6-2h4v4h-4v-4zm2 2v2h2v-2h-2zm4 2h2v2h-2v-2zm-4-6h2v2h-2v-2zm4 4h2v2h-2v-2zm0-4h2v2h-2v-2zm2 6h2v2h-2v-2z" />
                      </svg>
                    </div>
                    <p className="text-sm text-ehb-textMuted">Scan this QR code to visit your referral link</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Downline Tree Tab */}
          {activeTab === "downline" && (
            <div className="space-y-6">
              <div className="ehb-card-elevated p-6">
                <h3 className="text-lg font-semibold text-white mb-6">3-Level Downline Network</h3>
                <div className="space-y-8">
                  {mockAffiliateData.downlineTree.level1.map((level1) => (
                    <div key={level1.id} className="border-l-2 border-emerald-500/50 pl-6 ml-4">
                      {/* Level 1 */}
                      <div className="ehb-card-elevated p-4 mb-6 ring-2 ring-emerald-500/30">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-xs font-bold">
                            {level1.avatar}
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-white">{level1.name}</p>
                            <p className="text-xs text-ehb-textMuted">L1 (5% commission) · STL: {level1.stlLevel}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-emerald-300">${level1.earnings.toLocaleString()}</p>
                            <p className="text-xs text-ehb-textMuted">{level1.referrals} referrals</p>
                          </div>
                        </div>
                      </div>

                      {/* Level 2 */}
                      {level1.level2 && (
                        <div className="ml-6 space-y-4 border-l-2 border-teal-500/30 pl-6">
                          {level1.level2.map((level2) => (
                            <div key={level2.id} className="ehb-card-elevated p-3 ring-1 ring-teal-500/20">
                              <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center text-[10px] font-bold">
                                  {level2.avatar}
                                </div>
                                <div className="flex-1">
                                  <p className="font-semibold text-white text-sm">{level2.name}</p>
                                  <p className="text-xs text-ehb-textMuted">L2 (3% commission) · STL: {level2.stlLevel}</p>
                                </div>
                                <div className="text-right">
                                  <p className="font-semibold text-teal-300 text-sm">${level2.earnings.toLocaleString()}</p>
                                  <p className="text-xs text-ehb-textMuted">{level2.referrals} refs</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Commission Calculator Tab */}
          {activeTab === "calculator" && (
            <div className="space-y-6">
              <div className="ehb-card-elevated p-6">
                <h3 className="text-lg font-semibold text-white mb-6">Interactive Commission Calculator</h3>

                <div className="mb-6">
                  <label className="text-sm font-medium text-white mb-2 block">Order Amount</label>
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <span className="absolute left-3 top-3 text-emerald-300">$</span>
                      <input
                        type="number"
                        value={calcAmount}
                        onChange={(e) => setCalcAmount(Number(e.target.value))}
                        className="w-full bg-white/5 border border-white/20 rounded-lg pl-8 pr-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <input
                      type="range"
                      min="100"
                      max="50000"
                      step="100"
                      value={calcAmount}
                      onChange={(e) => setCalcAmount(Number(e.target.value))}
                      className="flex-1 cursor-pointer"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {Object.entries(mockAffiliateData.commissionRates).map(([category, rates]) => {
                    const commission = parseFloat(calculateCommission(calcAmount, category));
                    const l1 = commission * 0.5;
                    const l2 = commission * 0.3;
                    const l3 = commission * 0.2;

                    return (
                      <div key={category} className="ehb-card-elevated p-4">
                        <p className="font-semibold text-white capitalize mb-3">{category}</p>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-ehb-textMuted">Rate:</span>
                            <span className="text-cyan-300">{rates.min}% - {rates.max}%</span>
                          </div>
                          <div className="border-t border-white/10 pt-2 mt-2">
                            <div className="flex justify-between text-emerald-300 font-medium mb-1">
                              <span>Your Commission:</span>
                              <span>${commission.toFixed(2)}</span>
                            </div>
                            <div className="text-xs text-ehb-textMuted space-y-1">
                              <div className="flex justify-between">
                                <span>L1 (50%):</span>
                                <span className="text-emerald-400">${l1.toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>L2 (30%):</span>
                                <span className="text-teal-400">${l2.toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>L3 (20%):</span>
                                <span className="text-cyan-400">${l3.toFixed(2)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Commission Sources Tab */}
          {activeTab === "sources" && (
            <div className="space-y-6">
              <div className="grid gap-4 lg:grid-cols-3">
                {/* Source 1 */}
                <div className="ehb-card-elevated p-6 ring-2 ring-emerald-500/30">
                  <span className="text-3xl mb-3 block">📦</span>
                  <h4 className="font-semibold text-white mb-2">Order Commission</h4>
                  <p className="text-sm text-ehb-textMuted mb-4">Earn commission from every referral purchase</p>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between p-2 bg-white/5 rounded">
                      <span>Electronics</span>
                      <span className="text-emerald-300">3-5%</span>
                    </div>
                    <div className="flex justify-between p-2 bg-white/5 rounded">
                      <span>Fashion</span>
                      <span className="text-emerald-300">8-12%</span>
                    </div>
                    <div className="flex justify-between p-2 bg-white/5 rounded">
                      <span>Health</span>
                      <span className="text-emerald-300">6-10%</span>
                    </div>
                  </div>
                </div>

                {/* Source 2 */}
                <div className="ehb-card-elevated p-6 ring-2 ring-teal-500/30">
                  <span className="text-3xl mb-3 block">🏢</span>
                  <h4 className="font-semibold text-white mb-2">Franchise Sale Commission</h4>
                  <p className="text-sm text-ehb-textMuted mb-4">Earn 30% from each franchise sale</p>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between p-2 bg-white/5 rounded">
                      <span>L1 Direct Bonus</span>
                      <span className="text-teal-300">5%</span>
                    </div>
                    <div className="flex justify-between p-2 bg-white/5 rounded">
                      <span>L2 Bonus</span>
                      <span className="text-teal-300">3%</span>
                    </div>
                    <div className="flex justify-between p-2 bg-white/5 rounded">
                      <span>L3 Bonus</span>
                      <span className="text-teal-300">2%</span>
                    </div>
                  </div>
                </div>

                {/* Source 3 */}
                <div className="ehb-card-elevated p-6 ring-2 ring-cyan-500/30">
                  <span className="text-3xl mb-3 block">🛍️</span>
                  <h4 className="font-semibold text-white mb-2">Product Affiliate</h4>
                  <p className="text-sm text-ehb-textMuted mb-4">Amazon-style category-based rates</p>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between p-2 bg-white/5 rounded">
                      <span>Standard Rate</span>
                      <span className="text-cyan-300">4-8%</span>
                    </div>
                    <div className="flex justify-between p-2 bg-white/5 rounded">
                      <span>Premium Products</span>
                      <span className="text-cyan-300">10-15%</span>
                    </div>
                    <div className="flex justify-between p-2 bg-white/5 rounded">
                      <span>Performance Bonus</span>
                      <span className="text-cyan-300">+2-5%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="ehb-card-elevated p-6">
                <h3 className="font-semibold text-white mb-4">Commission Structure Overview</h3>
                <div className="space-y-3 text-sm">
                  <p className="text-ehb-textMuted">
                    Earn from <strong>3 distinct commission engines</strong>. Your network can grow infinitely, with bonuses cascading through 3 levels.
                  </p>
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <p className="font-medium text-white mb-2">Example: $1,000 Order Commission</p>
                    <p className="text-ehb-textMuted text-xs">
                      On a $1,000 purchase in Fashion (8-12%): You earn ~$100, Your L1 referrals share in cascade, L2 and L3 earn downstream bonuses.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Earnings History Tab */}
          {activeTab === "history" && (
            <div className="space-y-6">
              <div className="ehb-card-elevated p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Transaction Log</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/10 text-ehb-textMuted text-xs font-semibold uppercase">
                        <th className="text-left py-3 px-4">Date</th>
                        <th className="text-left py-3 px-4">Source</th>
                        <th className="text-left py-3 px-4">Category</th>
                        <th className="text-left py-3 px-4">Level</th>
                        <th className="text-right py-3 px-4">Amount</th>
                        <th className="text-center py-3 px-4">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockAffiliateData.earningsHistory.map((tx, idx) => (
                        <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                          <td className="py-3 px-4 text-ehb-textBody">{tx.date}</td>
                          <td className="py-3 px-4 text-white font-medium">{tx.source}</td>
                          <td className="py-3 px-4 text-ehb-textMuted capitalize">{tx.category}</td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-1 rounded text-xs font-medium bg-white/10 text-cyan-300">{tx.level}</span>
                          </td>
                          <td className="py-3 px-4 text-right font-semibold text-emerald-300">+${tx.amount.toFixed(2)}</td>
                          <td className="py-3 px-4 text-center">
                            <span className={`text-xs font-semibold ${tx.status === "Completed" ? "text-emerald-400" : "text-amber-400"}`}>
                              {tx.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Performance Tab */}
          {activeTab === "performance" && (
            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="ehb-card-elevated p-6">
                  <p className="text-xs text-ehb-textMuted mb-2">Conversion Rate</p>
                  <p className="text-3xl font-bold text-emerald-300 mb-2">{mockAffiliateData.performance.conversionRate}%</p>
                  <p className="text-xs text-ehb-textMuted">Referrals who made a purchase</p>
                </div>
                <div className="ehb-card-elevated p-6">
                  <p className="text-xs text-ehb-textMuted mb-2">Avg Order Value</p>
                  <p className="text-3xl font-bold text-cyan-300 mb-2">${mockAffiliateData.performance.avgOrderValue.toLocaleString()}</p>
                  <p className="text-xs text-ehb-textMuted">Average referral purchase amount</p>
                </div>
              </div>

              <div className="ehb-card-elevated p-6">
                <h3 className="font-semibold text-white mb-6">Monthly Growth Trend</h3>
                <div className="flex items-end gap-3 h-48">
                  {mockAffiliateData.performance.monthlyGrowth.map((item) => {
                    const maxValue = 100;
                    const height = (item.value / maxValue) * 100;
                    return (
                      <div key={item.month} className="flex-1 flex flex-col items-center gap-2">
                        <div className="w-full bg-white/10 rounded-t-lg relative" style={{ height: `${height}%` }}>
                          <div className="absolute inset-0 bg-gradient-to-t from-emerald-500 to-teal-500 rounded-t-lg opacity-70"></div>
                          <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-semibold text-white">{item.value}</span>
                        </div>
                        <span className="text-xs text-ehb-textMuted font-medium">{item.month}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Network Growth Tab */}
          {activeTab === "growth" && (
            <div className="space-y-6">
              <div className="ehb-card-elevated p-6">
                <h3 className="text-lg font-semibold text-white mb-6">Network Growth Timeline</h3>
                <div className="space-y-4">
                  {[
                    { week: "Week 1", signups: 2, growth: "+200%", status: "Launched" },
                    { week: "Week 2", signups: 5, growth: "+150%", status: "Growing" },
                    { week: "Week 3", signups: 12, growth: "+140%", status: "Accelerating" },
                    { week: "Week 4", signups: 28, growth: "+133%", status: "Viral" },
                  ].map((item) => (
                    <div key={item.week} className="flex items-center gap-4 p-4 bg-white/5 rounded-lg border border-white/10">
                      <div className="flex-1">
                        <p className="font-semibold text-white">{item.week}</p>
                        <p className="text-sm text-ehb-textMuted">{item.signups} new signups</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-emerald-300">{item.growth}</p>
                        <p className="text-xs text-ehb-textMuted">{item.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Achievements Tab */}
          {activeTab === "achievements" && (
            <div className="space-y-6">
              <div className="ehb-card-elevated p-6">
                <h3 className="text-lg font-semibold text-white mb-6">Milestones & Badges</h3>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {mockAffiliateData.achievements.map((achievement) => (
                    <div
                      key={achievement.title}
                      className={`p-6 rounded-xl border-2 text-center transition-all ${
                        achievement.unlocked
                          ? "bg-white/10 border-emerald-500/50 ring-2 ring-emerald-500/20"
                          : "bg-white/5 border-white/20 opacity-60"
                      }`}
                    >
                      <span className="text-4xl mb-3 block">{achievement.badge}</span>
                      <p className="font-semibold text-white mb-2">{achievement.title}</p>
                      {achievement.unlocked ? (
                        <span className="text-xs text-emerald-300 font-medium">✓ Unlocked</span>
                      ) : (
                        <span className="text-xs text-ehb-textMuted">🔒 Locked</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <div className="space-y-6">
              <div className="ehb-card-elevated p-6">
                <h3 className="text-lg font-semibold text-white mb-6">Payout Preferences</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-white block mb-2">Bank Account</label>
                    <input
                      type="text"
                      placeholder="Your bank account details"
                      className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-ehb-textMuted focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-white block mb-2">Minimum Payout Threshold</label>
                    <select className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500">
                      <option>$100</option>
                      <option>$250</option>
                      <option>$500</option>
                      <option>$1,000</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="ehb-card-elevated p-6">
                <h3 className="text-lg font-semibold text-white mb-6">Notification Settings</h3>
                <div className="space-y-3">
                  {[
                    { label: "Email on new referral", checked: true },
                    { label: "Weekly earnings summary", checked: true },
                    { label: "Milestone achievements", checked: false },
                  ].map((item) => (
                    <label key={item.label} className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" defaultChecked={item.checked} className="w-4 h-4" />
                      <span className="text-sm text-white">{item.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Help Tab */}
          {activeTab === "help" && (
            <div className="space-y-6">
              <div className="ehb-card-elevated p-6">
                <h3 className="text-lg font-semibold text-white mb-6">Frequently Asked Questions</h3>
                <div className="space-y-4">
                  {[
                    {
                      q: "How long does it take for referrals to show up?",
                      a: "Referrals appear within 24 hours of signup. Earnings are credited when they make their first purchase.",
                    },
                    {
                      q: "When do I get paid?",
                      a: "Payouts are processed weekly once you reach your minimum threshold. Standard processing time is 3-5 business days.",
                    },
                    {
                      q: "Can I have multiple referral links?",
                      a: "Each account has one primary referral link, but you can create custom tracking links from your dashboard.",
                    },
                    {
                      q: "What if a referral makes a return?",
                      a: "Commission is reversed if a purchase is returned within 30 days. Service commissions are non-refundable.",
                    },
                    {
                      q: "How are L2 and L3 commissions calculated?",
                      a: "L2 earnings are based on purchases made by referrals of your direct referrals. L3 follows the same pattern one level deeper.",
                    },
                  ].map((item, idx) => (
                    <div key={idx} className="p-4 bg-white/5 rounded-lg border border-white/10">
                      <p className="font-semibold text-white mb-2">{item.q}</p>
                      <p className="text-sm text-ehb-textMuted">{item.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
