"use client";

import { useState } from "react";
import {
  DollarSign,
  Save,
  RotateCcw,
  AlertCircle,
  TrendingUp,
  Eye,
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";

interface CommissionRate {
  tier: string;
  seller: number;
  subCommission: number;
  master: number;
  corporate: number;
  country: number;
  hq: number;
  platform: number;
}

interface STLBonusRate {
  level: number;
  bonus: number;
  description: string;
}

interface CategoryRate {
  category: string;
  affiliateRate: number;
}

const initialRates: CommissionRate[] = [
  {
    tier: "Online",
    seller: 85,
    subCommission: 10,
    master: 5,
    corporate: 0,
    country: 0,
    hq: 0,
    platform: 0,
  },
  {
    tier: "Sub Franchise",
    seller: 80,
    subCommission: 8,
    master: 4,
    corporate: 5,
    country: 0,
    hq: 3,
    platform: 0,
  },
  {
    tier: "Master",
    seller: 75,
    subCommission: 5,
    master: 3,
    corporate: 8,
    country: 5,
    hq: 4,
    platform: 0,
  },
  {
    tier: "Corporate",
    seller: 70,
    subCommission: 3,
    master: 2,
    corporate: 10,
    country: 8,
    hq: 5,
    platform: 2,
  },
];

const stlBonuses: STLBonusRate[] = [
  { level: 1, bonus: 0, description: "No bonus" },
  { level: 2, bonus: 2, description: "2% bonus" },
  { level: 3, bonus: 5, description: "5% bonus" },
  { level: 4, bonus: 8, description: "8% bonus" },
  { level: 5, bonus: 12, description: "12% bonus" },
  { level: 6, bonus: 15, description: "15% bonus" },
  { level: 7, bonus: 20, description: "20% bonus" },
  { level: 8, bonus: 25, description: "SUPREME: 25% bonus" },
];

const categoryAffiliateRates: CategoryRate[] = [
  { category: "E-commerce (GoSellr)", affiliateRate: 5 },
  { category: "Legal (OLS)", affiliateRate: 8 },
  { category: "Medical (WMS)", affiliateRate: 7 },
  { category: "Education (HPS)", affiliateRate: 6 },
  { category: "Jobs (JPS)", affiliateRate: 4 },
  { category: "Travel (AGTS)", affiliateRate: 5 },
];

function CommissionTable({ rates }: { rates: CommissionRate[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-white/10">
            <th className="text-left py-3 px-4 text-white/80 font-semibold">
              Tier
            </th>
            <th className="text-right py-3 px-4 text-white/80 font-semibold">
              Seller
            </th>
            <th className="text-right py-3 px-4 text-white/80 font-semibold">
              Sub
            </th>
            <th className="text-right py-3 px-4 text-white/80 font-semibold">
              Master
            </th>
            <th className="text-right py-3 px-4 text-white/80 font-semibold">
              Corporate
            </th>
            <th className="text-right py-3 px-4 text-white/80 font-semibold">
              Country
            </th>
            <th className="text-right py-3 px-4 text-white/80 font-semibold">
              HQ
            </th>
            <th className="text-right py-3 px-4 text-white/80 font-semibold">
              Platform
            </th>
          </tr>
        </thead>
        <tbody>
          {rates.map((rate, idx) => (
            <tr key={idx} className="border-b border-white/5 hover:bg-white/5">
              <td className="py-3 px-4 font-semibold text-white">{rate.tier}</td>
              <td className="text-right py-3 px-4">
                <span className="text-emerald-300 font-semibold">
                  {rate.seller}%
                </span>
              </td>
              <td className="text-right py-3 px-4">
                <span className="text-blue-300 font-semibold">
                  {rate.subCommission}%
                </span>
              </td>
              <td className="text-right py-3 px-4">
                <span className="text-purple-300 font-semibold">
                  {rate.master}%
                </span>
              </td>
              <td className="text-right py-3 px-4">
                <span className="text-yellow-300 font-semibold">
                  {rate.corporate}%
                </span>
              </td>
              <td className="text-right py-3 px-4">
                <span className="text-orange-300 font-semibold">
                  {rate.country}%
                </span>
              </td>
              <td className="text-right py-3 px-4">
                <span className="text-teal-300 font-semibold">{rate.hq}%</span>
              </td>
              <td className="text-right py-3 px-4">
                <span className="text-red-300 font-semibold">
                  {rate.platform}%
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function STLBonusTable({ bonuses }: { bonuses: STLBonusRate[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
      {bonuses.map((bonus, idx) => (
        <div
          key={idx}
          className={`p-4 rounded-lg border ${
            bonus.level === 8
              ? "bg-emerald-500/20 border-emerald-500/40"
              : "bg-white/5 border-white/10"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-bold text-white">STL L{bonus.level}</p>
            <Badge className="bg-purple-500/30 text-purple-300">
              +{bonus.bonus}%
            </Badge>
          </div>
          <p
            className={`text-xs ${bonus.level === 8 ? "text-emerald-300" : "text-white/60"}`}
          >
            {bonus.description}
          </p>
        </div>
      ))}
    </div>
  );
}

export default function CommissionConfiguration() {
  const [rates, setRates] = useState(initialRates);
  const [hasChanges, setHasChanges] = useState(false);
  const [viewMode, setViewMode] = useState<"rates" | "stl" | "category" | "calculator">(
    "rates"
  );
  const [calculatorInput, setCalculatorInput] = useState<string>("100000");

  const handleRateChange = (tierIdx: number, field: keyof CommissionRate, value: number) => {
    const newRates = [...rates];
    if (field !== "tier") {
      (newRates[tierIdx] as any)[field] = value;
      setRates(newRates);
      setHasChanges(true);
    }
  };

  const calculateCommission = (baseAmount: number) => {
    const tier1 = baseAmount * 0.85;
    const sub = baseAmount * 0.1;
    const master = baseAmount * 0.05;

    return { tier1, sub, master };
  };

  const calc = calculateCommission(parseFloat(calculatorInput) || 0);

  return (
    <main className="min-h-screen bg-[#0C0E1A] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="space-y-2 mb-8">
          <p className="text-xs uppercase tracking-widest text-white/60">
            Financial Configuration
          </p>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <DollarSign className="w-8 h-8 text-teal-400" />
            <span className="bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">
              Commission Configuration
            </span>
          </h1>
          <p className="text-sm text-white/70">
            Configure revenue split rates, STL bonuses, and affiliate commissions.
            Changes apply to NEW orders only.
          </p>
        </div>

        {/* Warning Banner */}
        <GlassCard className="p-4 mb-6 border-l-4 border-l-amber-500">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-300">
                Important: Non-Retroactive Changes
              </p>
              <p className="text-xs text-amber-200 mt-1">
                All configuration changes apply ONLY to new orders placed after
                activation. Existing orders use historical rates.
              </p>
            </div>
          </div>
        </GlassCard>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-white/10 pb-4">
          {["rates", "stl", "category", "calculator"].map((tab) => (
            <button
              key={tab}
              onClick={() => setViewMode(tab as any)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                viewMode === tab
                  ? "bg-purple-500/30 text-purple-300 border border-purple-500/50"
                  : "text-white/60 hover:text-white/80"
              }`}
            >
              {tab === "rates"
                ? "Rate Configuration"
                : tab === "stl"
                  ? "STL Bonuses"
                  : tab === "category"
                    ? "Affiliate Rates"
                    : "Calculator"}
            </button>
          ))}
        </div>

        {/* Rate Configuration */}
        {viewMode === "rates" && (
          <div className="space-y-6">
            <GlassCard className="p-6">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-400" />
                Commission Split by Franchise Tier
              </h2>
              <CommissionTable rates={rates} />
            </GlassCard>

            {/* Edit Section */}
            <GlassCard className="p-6 space-y-4">
              <h3 className="text-sm font-semibold text-white">Edit Rates</h3>
              <div className="space-y-4">
                {rates.map((rate, tierIdx) => (
                  <div
                    key={tierIdx}
                    className="p-4 bg-white/5 rounded-lg border border-white/10"
                  >
                    <p className="text-sm font-semibold text-white mb-3">
                      {rate.tier}
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {[
                        { label: "Seller", field: "seller" },
                        { label: "Sub", field: "subCommission" },
                        { label: "Master", field: "master" },
                        { label: "Corporate", field: "corporate" },
                        { label: "Country", field: "country" },
                        { label: "HQ", field: "hq" },
                        { label: "Platform", field: "platform" },
                      ].map((item) => (
                        <div key={item.field}>
                          <label className="text-xs text-white/60">
                            {item.label}
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              value={(rate as any)[item.field] || 0}
                              onChange={(e) =>
                                handleRateChange(
                                  tierIdx,
                                  item.field as keyof CommissionRate,
                                  parseFloat(e.target.value)
                                )
                              }
                              min="0"
                              max="100"
                              className="flex-1 px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                            <span className="text-white/60 text-xs">%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 p-2 bg-white/5 rounded text-xs text-white/70">
                      Total: {(rate.seller + rate.subCommission + rate.master + rate.corporate + rate.country + rate.hq + rate.platform).toFixed(0)}%
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                disabled={!hasChanges}
                className={`flex-1 px-4 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all ${
                  hasChanges
                    ? "bg-emerald-500/30 border border-emerald-500/50 text-emerald-300 hover:bg-emerald-500/40"
                    : "bg-white/10 border border-white/20 text-white/50 cursor-not-allowed"
                }`}
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
              <button
                onClick={() => {
                  setRates(initialRates);
                  setHasChanges(false);
                }}
                className="flex-1 px-4 py-3 rounded-lg font-semibold border border-white/20 text-white/70 hover:bg-white/5 transition-all flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </button>
            </div>
          </div>
        )}

        {/* STL Bonus Configuration */}
        {viewMode === "stl" && (
          <GlassCard className="p-6">
            <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              STL Level Bonus Rates
            </h2>
            <STLBonusTable bonuses={stlBonuses} />
            <p className="text-xs text-white/60 mt-6">
              These bonuses are applied to seller earnings based on their Service
              Trust Level. Users with higher STL levels earn more per transaction.
            </p>
          </GlassCard>
        )}

        {/* Affiliate Rates */}
        {viewMode === "category" && (
          <GlassCard className="p-6 space-y-4">
            <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-400" />
              Category-Specific Affiliate Rates
            </h2>
            <div className="space-y-3">
              {categoryAffiliateRates.map((cat, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10"
                >
                  <p className="text-sm font-medium text-white">{cat.category}</p>
                  <div className="flex items-center gap-3">
                    <Badge className="bg-blue-500/30 text-blue-300">
                      {cat.affiliateRate}% commission
                    </Badge>
                    <input
                      type="number"
                      value={cat.affiliateRate}
                      className="w-16 px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <span className="text-white/60 text-sm">%</span>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        )}

        {/* Calculator */}
        {viewMode === "calculator" && (
          <GlassCard className="p-6">
            <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <Eye className="w-5 h-5 text-cyan-400" />
              Commission Preview Calculator
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Order Amount (PKR)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-white/60">₨</span>
                  <input
                    type="number"
                    value={calculatorInput}
                    onChange={(e) => setCalculatorInput(e.target.value)}
                    className="w-full pl-8 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                  <p className="text-xs text-emerald-300/80 mb-1">Seller Earns (85%)</p>
                  <p className="text-2xl font-bold text-emerald-300">
                    ₨{calc.tier1.toLocaleString()}
                  </p>
                </div>
                <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                  <p className="text-xs text-blue-300/80 mb-1">Sub Commission (10%)</p>
                  <p className="text-2xl font-bold text-blue-300">
                    ₨{calc.sub.toLocaleString()}
                  </p>
                </div>
                <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                  <p className="text-xs text-purple-300/80 mb-1">Master Fee (5%)</p>
                  <p className="text-2xl font-bold text-purple-300">
                    ₨{calc.master.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
                <p className="text-xs text-white/60 mb-2">Distribution Breakdown</p>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <div className="flex-1 h-6 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full mr-3" />
                    <span className="text-xs text-white/80">Sellers: 85%</span>
                  </div>
                  <div className="flex items-center">
                    <div className="flex-1 h-6 bg-blue-500 rounded-full mr-3" />
                    <span className="text-xs text-white/80">Sub: 10%</span>
                  </div>
                  <div className="flex items-center">
                    <div className="flex-1 h-6 bg-purple-500 rounded-full mr-3" />
                    <span className="text-xs text-white/80">Master: 5%</span>
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>
        )}
      </div>
    </main>
  );
}
