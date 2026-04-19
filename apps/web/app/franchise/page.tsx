"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchJson } from "@/lib/fetchJson";

type FranchiseHubData = {
  stats: {
    activeFranchises: number;
    totalRevenue: number;
    networkSize: number;
    avgSTLLevel: number;
  };
};

const fallbackData: FranchiseHubData = {
  stats: {
    activeFranchises: 1247,
    totalRevenue: 2850000,
    networkSize: 4589,
    avgSTLLevel: 6.2,
  },
};

const franchiseTiers = [
  {
    id: "online",
    name: "Online Franchise",
    priceRange: "$100 - $1,500",
    ehbgcHold: "500 - 7,500 EHBGC",
    color: "from-blue-500/30 to-blue-600/10",
    borderColor: "border-blue-400/30",
    lightColor: "text-blue-300",
    icon: "🌐",
    benefits: ["Digital storefront", "EHB app listing", "Basic analytics", "Customer support"],
    requirements: ["18+ years old", "Bank account", "Valid ID", "Email address"],
    stlMin: "L0",
    revenueShare: "5%",
  },
  {
    id: "sub",
    name: "Sub Franchise",
    priceRange: "$5,000 - $20,000",
    ehbgcHold: "25,000 - 100,000 EHBGC",
    color: "from-green-500/30 to-green-600/10",
    borderColor: "border-green-400/30",
    lightColor: "text-green-300",
    icon: "📍",
    benefits: ["Dedicated territory", "Recruit agents", "Revenue commission", "Training provided", "Marketing support"],
    requirements: ["Franchise fee payment", "STL L3+ verification", "Business license", "Market survey"],
    stlMin: "L3",
    revenueShare: "5%",
  },
  {
    id: "master",
    name: "Master Franchise",
    priceRange: "$20,000 - $50,000",
    ehbgcHold: "100,000 - 250,000 EHBGC",
    color: "from-purple-500/30 to-purple-600/10",
    borderColor: "border-purple-400/30",
    lightColor: "text-purple-300",
    icon: "👑",
    benefits: ["Multi-regional control", "Sub-franchise rights", "Custom branding", "Advanced analytics", "Dedicated account manager"],
    requirements: ["Proven track record", "STL L5+ verification", "Multi-unit operations", "Legal entity"],
    stlMin: "L5",
    revenueShare: "2%",
  },
  {
    id: "corporate",
    name: "Corporate Franchise",
    priceRange: "$50,000 - $200,000",
    ehbgcHold: "250,000 - 1,000,000 EHBGC",
    color: "from-amber-500/30 to-amber-600/10",
    borderColor: "border-amber-400/30",
    lightColor: "text-amber-300",
    icon: "🏢",
    benefits: ["National operations", "Co-marketing rights", "White-label options", "Governance seat", "Premium support"],
    requirements: ["Institutional investor", "STL L7+ verification", "Significant capital", "Board approval"],
    stlMin: "L7",
    revenueShare: "1.5%",
  },
  {
    id: "country",
    name: "Country Franchise",
    priceRange: "$200,000+",
    ehbgcHold: "1,000,000+ EHBGC",
    color: "from-teal-500/30 to-cyan-600/10",
    borderColor: "border-teal-400/30",
    lightColor: "text-teal-300",
    icon: "🌍",
    benefits: ["Entire country control", "Sub-national territories", "All 32 industries", "Board-level status", "Revenue optimization"],
    requirements: ["L8 SUPREME verification", "Institutional backing", "Complex due diligence", "Legal contracts"],
    stlMin: "L8",
    revenueShare: "1%",
  },
];

export default function FranchiseHubPage() {
  const [data, setData] = useState<FranchiseHubData>(fallbackData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void fetchJson<FranchiseHubData>("/api/franchise/hub-stats", fallbackData)
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="min-h-screen text-white">
      <div className="container-ehb py-8 space-y-8">
        {/* Hero Section */}
        <section
          className="relative overflow-hidden rounded-3xl border border-blue-400/20 p-8 md:p-12"
          style={{
            background: "linear-gradient(135deg, rgba(30,58,138,0.4) 0%, rgba(13,40,100,0.3) 50%, rgba(12,50,140,0.25) 100%)",
            backdropFilter: "blur(12px)",
          }}
        >
          <div className="relative z-10">
            <p className="text-xs md:text-sm uppercase tracking-[0.3em] text-blue-300 font-semibold">
              Build Your Territory
            </p>
            <h1 className="mt-3 text-3xl md:text-5xl font-bold leading-tight max-w-3xl">
              Own Your <span style={{ background: "linear-gradient(135deg, #33c3ff 0%, #29abe2 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>EHB Territory</span>
            </h1>
            <p className="mt-4 text-sm md:text-base text-white/80 max-w-2xl leading-relaxed">
              Join the global EHB network across 32 industries. From online sellers to country franchisees, build sustainable revenue and grow your team.
            </p>
            <div className="flex flex-wrap gap-3 mt-6">
              <Link
                href="/franchise/apply"
                className="px-6 py-3 rounded-lg font-semibold text-sm bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all duration-200 transform hover:scale-105 active:scale-95"
              >
                Apply Now
              </Link>
              <Link
                href="/franchise/dashboard"
                className="px-6 py-3 rounded-lg font-semibold text-sm border border-blue-400/50 text-blue-200 hover:bg-blue-500/10 transition-all duration-200"
              >
                View Dashboard
              </Link>
            </div>
          </div>
          {/* Decorative accent */}
          <div
            className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none"
            style={{ background: "radial-gradient(circle, #29abe2 0%, transparent 70%)" }}
          />
        </section>

        {/* Stats Section */}
        <section className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          <div
            className="rounded-xl border border-white/10 p-4 md:p-6"
            style={{ background: "rgba(19,22,42,0.6)", backdropFilter: "blur(12px)" }}
          >
            <p className="text-xs text-white/60 uppercase tracking-wider">Active Franchises</p>
            <p className="mt-2 text-2xl md:text-3xl font-bold text-cyan-300">{loading ? "—" : data.stats.activeFranchises.toLocaleString()}</p>
          </div>
          <div
            className="rounded-xl border border-white/10 p-4 md:p-6"
            style={{ background: "rgba(19,22,42,0.6)", backdropFilter: "blur(12px)" }}
          >
            <p className="text-xs text-white/60 uppercase tracking-wider">Total Revenue</p>
            <p className="mt-2 text-2xl md:text-3xl font-bold text-green-300">${loading ? "—" : (data.stats.totalRevenue / 1000000).toFixed(1)}M</p>
          </div>
          <div
            className="rounded-xl border border-white/10 p-4 md:p-6"
            style={{ background: "rgba(19,22,42,0.6)", backdropFilter: "blur(12px)" }}
          >
            <p className="text-xs text-white/60 uppercase tracking-wider">Network Size</p>
            <p className="mt-2 text-2xl md:text-3xl font-bold text-amber-300">{loading ? "—" : data.stats.networkSize.toLocaleString()}</p>
          </div>
          <div
            className="rounded-xl border border-white/10 p-4 md:p-6"
            style={{ background: "rgba(19,22,42,0.6)", backdropFilter: "blur(12px)" }}
          >
            <p className="text-xs text-white/60 uppercase tracking-wider">Avg STL Level</p>
            <p className="mt-2 text-2xl md:text-3xl font-bold text-purple-300">L{loading ? "—" : data.stats.avgSTLLevel.toFixed(1)}</p>
          </div>
        </section>

        {/* Franchise Tiers Section */}
        <section className="space-y-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">Franchise Hierarchy</h2>
            <p className="text-sm text-white/60 mt-2">5 Levels · From Digital to Country Control</p>
          </div>
          <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-5">
            {franchiseTiers.map((tier) => (
              <div
                key={tier.id}
                className={`group rounded-2xl border ${tier.borderColor} p-6 transition-all duration-300 hover:border-opacity-60 transform hover:scale-105 hover:shadow-2xl cursor-pointer`}
                style={{
                  background: `linear-gradient(135deg, ${tier.color})`,
                  backdropFilter: "blur(12px)",
                }}
              >
                {/* Tier Icon */}
                <div className="text-4xl mb-3">{tier.icon}</div>

                {/* Tier Name & Price */}
                <h3 className="font-bold text-lg text-white">{tier.name}</h3>
                <div className="mt-3 space-y-1">
                  <p className="text-sm font-semibold text-white">{tier.priceRange} USD</p>
                  <p className="text-xs text-white/70">{tier.ehbgcHold} Hold</p>
                </div>

                {/* STL Requirement */}
                <div className="mt-4 flex items-center gap-2">
                  <span className="text-xs uppercase font-semibold text-white/60">Min STL:</span>
                  <span className={`text-sm font-bold ${tier.lightColor}`}>{tier.stlMin}</span>
                </div>

                {/* Revenue Share */}
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-xs uppercase font-semibold text-white/60">Revenue:</span>
                  <span className="text-sm font-bold text-green-300">{tier.revenueShare}</span>
                </div>

                {/* Divider */}
                <div className="my-4 h-px bg-white/10" />

                {/* Benefits */}
                <div className="space-y-2 mb-4">
                  <p className="text-xs uppercase font-semibold text-white/60">Benefits</p>
                  <ul className="space-y-1">
                    {tier.benefits.slice(0, 3).map((benefit, idx) => (
                      <li key={idx} className="text-xs text-white/80 flex items-start gap-2">
                        <span className="text-teal-300 mt-0.5">✓</span>
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Requirements */}
                <div className="space-y-2 mb-5">
                  <p className="text-xs uppercase font-semibold text-white/60">Requirements</p>
                  <ul className="space-y-1">
                    {tier.requirements.slice(0, 2).map((req, idx) => (
                      <li key={idx} className="text-xs text-white/70 flex items-start gap-2">
                        <span className="text-amber-300 mt-0.5">•</span>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Apply Button */}
                <Link
                  href={`/franchise/apply?tier=${tier.id}`}
                  className="block w-full py-2 px-4 rounded-lg font-semibold text-sm text-center bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all duration-200"
                >
                  Apply
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Revenue Share Visualization */}
        <section
          className="rounded-2xl border border-white/10 p-6 md:p-8"
          style={{ background: "rgba(19,22,42,0.7)", backdropFilter: "blur(12px)" }}
        >
          <h2 className="text-2xl font-bold mb-6">Revenue Share Model</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold">Sub Franchise (5%)</span>
                <span className="text-xs text-white/60">$5K-$20K entry</span>
              </div>
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-green-500 to-green-600" style={{ width: "50%" }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold">Master Franchise (2%)</span>
                <span className="text-xs text-white/60">$20K-$50K entry</span>
              </div>
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-purple-500 to-purple-600" style={{ width: "20%" }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold">Corporate (1.5%)</span>
                <span className="text-xs text-white/60">$50K-$200K entry</span>
              </div>
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-amber-500 to-amber-600" style={{ width: "15%" }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold">Country (1%)</span>
                <span className="text-xs text-white/60">$200K+ entry</span>
              </div>
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-teal-500 to-cyan-600" style={{ width: "10%" }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold">HQ Extra Fee (0.5%)</span>
                <span className="text-xs text-white/60">Network support</span>
              </div>
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-500 to-blue-600" style={{ width: "5%" }} />
              </div>
            </div>
          </div>
          <p className="text-xs text-white/60 mt-6 border-t border-white/10 pt-6">
            Revenue shares shown are commissions on network activity. Each tier includes benefits scaled to territory size and capital investment.
          </p>
        </section>

        {/* Territory Map Placeholder */}
        <section
          className="rounded-2xl border border-white/10 p-8 overflow-hidden"
          style={{ background: "rgba(19,22,42,0.7)", backdropFilter: "blur(12px)" }}
        >
          <h2 className="text-2xl font-bold mb-6">Global Territory Map</h2>
          <div
            className="relative w-full h-64 md:h-96 rounded-xl bg-gradient-to-b from-blue-900/20 to-purple-900/20 border border-white/10 flex items-center justify-center overflow-hidden"
          >
            {/* Decorative regions */}
            <div className="absolute inset-0 opacity-30">
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <rect x="5" y="10" width="20" height="25" fill="rgba(34,211,238,0.3)" />
                <rect x="30" y="15" width="18" height="20" fill="rgba(139,92,246,0.3)" />
                <rect x="55" y="20" width="22" height="22" fill="rgba(34,177,76,0.3)" />
                <rect x="10" y="45" width="25" height="20" fill="rgba(245,158,11,0.3)" />
                <rect x="40" y="50" width="20" height="18" fill="rgba(59,130,246,0.3)" />
                <rect x="65" y="55" width="20" height="22" fill="rgba(168,85,247,0.3)" />
              </svg>
            </div>
            <div className="relative z-10 text-center space-y-2">
              <p className="text-lg font-bold text-white">Live Territory Distribution</p>
              <p className="text-sm text-white/70">Explore regional franchise opportunities across all markets</p>
            </div>
          </div>
        </section>

        {/* Success Stories / Stats */}
        <section className="space-y-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">Success Stories</h2>
            <p className="text-sm text-white/60 mt-2">Real franchisees building their territories</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                name: "Amana Khan",
                territory: "Master, Karachi",
                revenue: "$245,000",
                stl: "L6",
                team: "23 agents",
              },
              {
                name: "Hassan Ali",
                territory: "Sub, Lahore",
                revenue: "$87,500",
                stl: "L4",
                team: "8 agents",
              },
              {
                name: "Fatima Mohammed",
                territory: "Corporate, Pakistan",
                revenue: "$1.2M",
                stl: "L7",
                team: "156 agents",
              },
              {
                name: "Khalid Sheikh",
                territory: "Online, Multiple Cities",
                revenue: "$12,400",
                stl: "L2",
                team: "Self",
              },
              {
                name: "Ayesha Malik",
                territory: "Sub, Islamabad",
                revenue: "$102,300",
                stl: "L5",
                team: "12 agents",
              },
              {
                name: "Omar Hassan",
                territory: "Master, Sindh",
                revenue: "$456,700",
                stl: "L6",
                team: "34 agents",
              },
            ].map((story, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-white/10 p-4 md:p-6 group cursor-pointer hover:border-white/30 transition-all duration-300"
                style={{ background: "rgba(19,22,42,0.5)", backdropFilter: "blur(8px)" }}
              >
                <p className="text-sm font-semibold text-white">{story.name}</p>
                <p className="text-xs text-white/60 mt-1">{story.territory}</p>
                <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-white/10">
                  <div>
                    <p className="text-xs uppercase text-white/50 font-semibold">Revenue</p>
                    <p className="text-sm font-bold text-green-300 mt-1">{story.revenue}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase text-white/50 font-semibold">STL</p>
                    <p className="text-sm font-bold text-purple-300 mt-1">{story.stl}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase text-white/50 font-semibold">Team</p>
                    <p className="text-sm font-bold text-blue-300 mt-1">{story.team}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section
          className="rounded-2xl border border-green-400/30 p-8 md:p-12 text-center"
          style={{
            background: "linear-gradient(135deg, rgba(34,177,76,0.2) 0%, rgba(34,211,238,0.1) 100%)",
            backdropFilter: "blur(12px)",
          }}
        >
          <h2 className="text-3xl md:text-4xl font-bold">Ready to Build Your Territory?</h2>
          <p className="text-white/80 mt-3 max-w-2xl mx-auto">
            Join thousands of successful franchisees earning sustainable revenue through the EHB network.
          </p>
          <Link
            href="/franchise/apply"
            className="inline-block mt-6 px-8 py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 transition-all duration-200 transform hover:scale-105 active:scale-95"
          >
            Start Your Application
          </Link>
        </section>
      </div>
    </main>
  );
}
