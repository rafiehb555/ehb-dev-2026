"use client";

import { useState } from "react";
import {
  Zap,
  Search,
  TrendingUp,
  AlertTriangle,
  Eye,
  MoreVertical,
  Filter,
  CheckCircle,
  Clock,
  Shield,
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { DrawerPanel } from "@/components/ui/drawer-panel";

interface Seller {
  id: string;
  name: string;
  email: string;
  stlLevel: number;
  products: number;
  orders: number;
  revenue: number;
  verificationStatus: "verified" | "pending" | "rejected";
  avgRating: number;
  fraudRisk: boolean;
}

const mockSellers: Seller[] = [
  {
    id: "S001",
    name: "TechPro Solutions",
    email: "contact@techpro.com",
    stlLevel: 8,
    products: 45,
    orders: 2845,
    revenue: 850000,
    verificationStatus: "verified",
    avgRating: 4.8,
    fraudRisk: false,
  },
  {
    id: "S002",
    name: "Fashion Hub Pk",
    email: "hello@fashionhub.com",
    stlLevel: 6,
    products: 123,
    orders: 1234,
    revenue: 450000,
    verificationStatus: "verified",
    avgRating: 4.5,
    fraudRisk: false,
  },
  {
    id: "S003",
    name: "Quick Electronics",
    email: "sales@quickelec.com",
    stlLevel: 4,
    products: 78,
    orders: 345,
    revenue: 125000,
    verificationStatus: "pending",
    avgRating: 3.8,
    fraudRisk: true,
  },
  {
    id: "S004",
    name: "Premium Goods Ltd",
    email: "admin@premiumgoods.com",
    stlLevel: 7,
    products: 234,
    orders: 5234,
    revenue: 1250000,
    verificationStatus: "verified",
    avgRating: 4.9,
    fraudRisk: false,
  },
  {
    id: "S005",
    name: "Affordable Deals",
    email: "info@affordabledeals.com",
    stlLevel: 3,
    products: 12,
    orders: 89,
    revenue: 25000,
    verificationStatus: "pending",
    avgRating: 3.2,
    fraudRisk: true,
  },
];

const sellerStats = [
  { label: "Active Sellers", value: "3,421", change: "+5.1%" },
  { label: "Total Revenue", value: "₨2.7Cr", change: "+18.4%" },
  { label: "Pending Verification", value: "23", change: "+2.3%" },
  { label: "Fraud Alerts", value: "7", change: "-1.5%" },
];

function STLLevelBadge({ level }: { level: number }) {
  const colors = {
    1: "bg-red-500/20 text-red-300",
    2: "bg-red-500/20 text-red-300",
    3: "bg-orange-500/20 text-orange-300",
    4: "bg-amber-500/20 text-amber-300",
    5: "bg-yellow-500/20 text-yellow-300",
    6: "bg-blue-500/20 text-blue-300",
    7: "bg-purple-500/20 text-purple-300",
    8: "bg-emerald-500/20 text-emerald-300",
  };

  return (
    <Badge className={colors[level as keyof typeof colors]}>
      STL L{level}
    </Badge>
  );
}

function VerificationBadge({ status }: { status: string }) {
  const icons = {
    verified: <CheckCircle className="w-4 h-4" />,
    pending: <Clock className="w-4 h-4" />,
    rejected: <AlertTriangle className="w-4 h-4" />,
  };

  const colors = {
    verified: "bg-emerald-500/20 text-emerald-300",
    pending: "bg-amber-500/20 text-amber-300",
    rejected: "bg-red-500/20 text-red-300",
  };

  return (
    <Badge className={`${colors[status as keyof typeof colors]} flex items-center gap-1`}>
      {icons[status as keyof typeof icons]}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}

function SellerRow({
  seller,
  onViewDetail,
}: {
  seller: Seller;
  onViewDetail: (seller: Seller) => void;
}) {
  return (
    <div className="p-4 border border-white/5 rounded-lg hover:bg-white/5 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <p className="text-sm font-semibold text-white">{seller.name}</p>
          <p className="text-xs text-white/60">{seller.email}</p>
        </div>
        {seller.fraudRisk && (
          <div className="px-2 py-1 rounded-lg bg-red-500/20 border border-red-500/30 text-red-300 text-[10px] font-semibold flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            Risk Alert
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
        <div>
          <p className="text-[10px] text-white/60">Products</p>
          <p className="text-sm font-semibold text-white">{seller.products}</p>
        </div>
        <div>
          <p className="text-[10px] text-white/60">Orders</p>
          <p className="text-sm font-semibold text-white">{seller.orders}</p>
        </div>
        <div>
          <p className="text-[10px] text-white/60">Revenue</p>
          <p className="text-sm font-semibold text-teal-300">
            ₨{(seller.revenue / 100000).toFixed(1)}L
          </p>
        </div>
        <div>
          <p className="text-[10px] text-white/60">Rating</p>
          <p className="text-sm font-semibold text-yellow-300">
            {seller.avgRating.toFixed(1)} ⭐
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <STLLevelBadge level={seller.stlLevel} />
          <VerificationBadge status={seller.verificationStatus} />
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onViewDetail(seller)}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white/60 hover:text-white"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white/60 hover:text-white">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function SellerDetailDrawer({
  seller,
  isOpen,
  onClose,
}: {
  seller: Seller | null;
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!seller) return null;

  return (
    <DrawerPanel title="Seller Details" isOpen={isOpen} onClose={onClose}>
      <div className="space-y-4">
        <div className="p-4 bg-white/5 rounded-lg space-y-3">
          <div>
            <p className="text-xs text-white/60">Business Name</p>
            <p className="text-sm font-semibold text-white">{seller.name}</p>
          </div>
          <div>
            <p className="text-xs text-white/60">Email</p>
            <p className="text-sm font-semibold text-white">{seller.email}</p>
          </div>
          <div>
            <p className="text-xs text-white/60">STL Level</p>
            <STLLevelBadge level={seller.stlLevel} />
          </div>
          <div>
            <p className="text-xs text-white/60">Verification Status</p>
            <VerificationBadge status={seller.verificationStatus} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-white/60">Products</p>
              <p className="text-sm font-semibold text-white">{seller.products}</p>
            </div>
            <div>
              <p className="text-xs text-white/60">Orders</p>
              <p className="text-sm font-semibold text-white">{seller.orders}</p>
            </div>
            <div>
              <p className="text-xs text-white/60">Revenue</p>
              <p className="text-sm font-semibold text-teal-300">
                ₨{seller.revenue.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-xs text-white/60">Avg Rating</p>
              <p className="text-sm font-semibold text-yellow-300">
                {seller.avgRating.toFixed(1)} ⭐
              </p>
            </div>
          </div>
        </div>

        {seller.fraudRisk && (
          <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
            <p className="text-xs font-semibold text-red-300 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Fraud Detection Alert
            </p>
            <p className="text-[10px] text-red-200 mt-2">
              Multiple pattern mismatches detected. Review before renewal.
            </p>
          </div>
        )}

        <div className="space-y-2">
          <p className="text-xs font-semibold text-white/80">Actions</p>
          <button className="w-full px-4 py-2 rounded-lg bg-blue-500/20 border border-blue-500/30 text-blue-300 hover:bg-blue-500/30 transition-colors text-sm font-medium">
            View Products
          </button>
          <button className="w-full px-4 py-2 rounded-lg bg-green-500/20 border border-green-500/30 text-green-300 hover:bg-green-500/30 transition-colors text-sm font-medium">
            Approve Seller
          </button>
          <button className="w-full px-4 py-2 rounded-lg bg-purple-500/20 border border-purple-500/30 text-purple-300 hover:bg-purple-500/30 transition-colors text-sm font-medium">
            Adjust Commission (5%)
          </button>
          <button className="w-full px-4 py-2 rounded-lg bg-amber-500/20 border border-amber-500/30 text-amber-300 hover:bg-amber-500/30 transition-colors text-sm font-medium">
            Send Warning
          </button>
        </div>
      </div>
    </DrawerPanel>
  );
}

export default function SellerManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [stlFilter, setStlFilter] = useState<string>("All");
  const [verificationFilter, setVerificationFilter] = useState<string>("All");
  const [selectedSeller, setSelectedSeller] = useState<Seller | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const filteredSellers = mockSellers.filter((seller) => {
    const matchesSearch =
      seller.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      seller.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSTL =
      stlFilter === "All" || seller.stlLevel.toString() === stlFilter;
    const matchesVerification =
      verificationFilter === "All" ||
      seller.verificationStatus === verificationFilter;

    return matchesSearch && matchesSTL && matchesVerification;
  });

  return (
    <main className="min-h-screen bg-[#0C0E1A] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="space-y-2 mb-8">
          <p className="text-xs uppercase tracking-widest text-white/60">
            Seller Management
          </p>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Zap className="w-8 h-8 text-amber-400" />
            <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
              Seller Dashboard
            </span>
          </h1>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {sellerStats.map((stat, idx) => (
            <GlassCard key={idx} className="p-4">
              <p className="text-xs text-white/60">{stat.label}</p>
              <p className="text-xl font-bold text-white mt-1">{stat.value}</p>
              <p className={`text-xs mt-2 ${stat.change.includes("+") ? "text-emerald-400" : "text-red-400"}`}>
                {stat.change}
              </p>
            </GlassCard>
          ))}
        </div>

        {/* Search and Filters */}
        <GlassCard className="p-4 mb-6">
          <div className="flex flex-col gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-white/40" />
              <input
                type="text"
                placeholder="Search sellers by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-white/60" />
                <span className="text-xs text-white/60">Filters:</span>
              </div>

              <select
                value={stlFilter}
                onChange={(e) => setStlFilter(e.target.value)}
                className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option>All STL Levels</option>
                <option value="1">L1-2 (High Risk)</option>
                <option value="4">L3-4 (Medium)</option>
                <option value="6">L5-6 (Good)</option>
                <option value="8">L7-8 (Premium)</option>
              </select>

              <select
                value={verificationFilter}
                onChange={(e) => setVerificationFilter(e.target.value)}
                className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option>All Verification</option>
                <option value="verified">Verified</option>
                <option value="pending">Pending Review</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </GlassCard>

        {/* Fraud Detection Section */}
        <GlassCard className="p-4 mb-6 border-l-4 border-l-red-500">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-red-300">
                Active Fraud Alerts
              </p>
              <p className="text-xs text-red-200 mt-1">
                {mockSellers.filter((s) => s.fraudRisk).length} sellers flagged for suspicious patterns. Review
                immediately.
              </p>
            </div>
          </div>
        </GlassCard>

        {/* Sellers List */}
        <GlassCard className="p-4">
          <div className="space-y-3">
            {filteredSellers.length > 0 ? (
              filteredSellers.map((seller) => (
                <SellerRow
                  key={seller.id}
                  seller={seller}
                  onViewDetail={(s) => {
                    setSelectedSeller(s);
                    setIsDetailOpen(true);
                  }}
                />
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-white/60">
                  No sellers found matching your filters.
                </p>
              </div>
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
            <p className="text-xs text-white/60">
              Showing {filteredSellers.length} of {mockSellers.length} sellers
            </p>
          </div>
        </GlassCard>

        {/* Detail Drawer */}
        <SellerDetailDrawer
          seller={selectedSeller}
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
        />
      </div>
    </main>
  );
}
