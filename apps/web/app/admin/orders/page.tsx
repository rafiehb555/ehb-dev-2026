"use client";

import { useState } from "react";
import {
  ShoppingCart,
  Search,
  Eye,
  MoreVertical,
  Filter,
  AlertTriangle,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { DrawerPanel } from "@/components/ui/drawer-panel";

interface Order {
  id: string;
  orderNumber: string;
  buyer: string;
  seller: string;
  amount: number;
  status: "active" | "completed" | "disputed" | "refunded";
  items: number;
  date: string;
  delivery: string;
  commissionSplit: {
    seller: number;
    sub: number;
    master: number;
  };
}

const mockOrders: Order[] = [
  {
    id: "O001",
    orderNumber: "#ORD-2024-001",
    buyer: "Ahmed Hassan",
    seller: "TechPro Solutions",
    amount: 45000,
    status: "active",
    items: 3,
    date: "2024-04-19",
    delivery: "In Transit",
    commissionSplit: { seller: 85, sub: 10, master: 5 },
  },
  {
    id: "O002",
    orderNumber: "#ORD-2024-002",
    buyer: "Fatima Khan",
    seller: "Fashion Hub Pk",
    amount: 28500,
    status: "completed",
    items: 5,
    date: "2024-04-18",
    delivery: "Delivered",
    commissionSplit: { seller: 85, sub: 10, master: 5 },
  },
  {
    id: "O003",
    orderNumber: "#ORD-2024-003",
    buyer: "Hassan Ali",
    seller: "Quick Electronics",
    amount: 125000,
    status: "disputed",
    items: 1,
    date: "2024-04-17",
    delivery: "Pending",
    commissionSplit: { seller: 85, sub: 10, master: 5 },
  },
  {
    id: "O004",
    orderNumber: "#ORD-2024-004",
    buyer: "Sara Ahmed",
    seller: "Premium Goods Ltd",
    amount: 95500,
    status: "completed",
    items: 2,
    date: "2024-04-16",
    delivery: "Delivered",
    commissionSplit: { seller: 85, sub: 10, master: 5 },
  },
  {
    id: "O005",
    orderNumber: "#ORD-2024-005",
    buyer: "Ali Raza",
    seller: "Affordable Deals",
    amount: 12000,
    status: "refunded",
    items: 4,
    date: "2024-04-15",
    delivery: "Cancelled",
    commissionSplit: { seller: 85, sub: 10, master: 5 },
  },
];

const orderStats = [
  { label: "Total Orders (Today)", value: "847", change: "+12.5%" },
  { label: "Completed", value: "623", change: "+8.2%" },
  { label: "Disputed", value: "18", change: "+1.5%" },
  { label: "Refunded", value: "12", change: "-0.3%" },
];

function StatusBadge({ status }: { status: string }) {
  const colors = {
    active: "bg-blue-500/20 text-blue-300",
    completed: "bg-emerald-500/20 text-emerald-300",
    disputed: "bg-red-500/20 text-red-300",
    refunded: "bg-gray-500/20 text-gray-300",
  };

  const icons = {
    active: <Clock className="w-3 h-3" />,
    completed: <CheckCircle className="w-3 h-3" />,
    disputed: <AlertTriangle className="w-3 h-3" />,
    refunded: <XCircle className="w-3 h-3" />,
  };

  return (
    <Badge className={`${colors[status as keyof typeof colors]} flex items-center gap-1`}>
      {icons[status as keyof typeof icons]}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}

function OrderRow({
  order,
  onViewDetail,
}: {
  order: Order;
  onViewDetail: (order: Order) => void;
}) {
  return (
    <div className="p-4 border border-white/5 rounded-lg hover:bg-white/5 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-white">{order.orderNumber}</p>
            <StatusBadge status={order.status} />
          </div>
          <p className="text-xs text-white/60 mt-1">{order.date}</p>
        </div>
        <p className="text-lg font-bold text-teal-300">₨{order.amount.toLocaleString()}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
        <div>
          <p className="text-[10px] text-white/60">Buyer</p>
          <p className="text-xs font-semibold text-white">{order.buyer}</p>
        </div>
        <div>
          <p className="text-[10px] text-white/60">Seller</p>
          <p className="text-xs font-semibold text-white">{order.seller}</p>
        </div>
        <div>
          <p className="text-[10px] text-white/60">Items</p>
          <p className="text-xs font-semibold text-white">{order.items}</p>
        </div>
        <div>
          <p className="text-[10px] text-white/60">Delivery</p>
          <p className="text-xs font-semibold text-white">{order.delivery}</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-[10px] text-white/50">
          Commission: {order.commissionSplit.seller}% / {order.commissionSplit.sub}% / {order.commissionSplit.master}%
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onViewDetail(order)}
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

function OrderDetailDrawer({
  order,
  isOpen,
  onClose,
}: {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!order) return null;

  const commission = order.amount;

  return (
    <DrawerPanel title="Order Details" isOpen={isOpen} onClose={onClose}>
      <div className="space-y-4">
        <div className="p-4 bg-white/5 rounded-lg space-y-3">
          <div>
            <p className="text-xs text-white/60">Order Number</p>
            <p className="text-sm font-semibold text-white">{order.orderNumber}</p>
          </div>
          <div>
            <p className="text-xs text-white/60">Status</p>
            <StatusBadge status={order.status} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-white/60">Buyer</p>
              <p className="text-sm font-semibold text-white">{order.buyer}</p>
            </div>
            <div>
              <p className="text-xs text-white/60">Seller</p>
              <p className="text-sm font-semibold text-white">{order.seller}</p>
            </div>
            <div>
              <p className="text-xs text-white/60">Total Amount</p>
              <p className="text-sm font-semibold text-teal-300">₨{order.amount.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-white/60">Items</p>
              <p className="text-sm font-semibold text-white">{order.items}</p>
            </div>
          </div>
          <div>
            <p className="text-xs text-white/60">Order Date</p>
            <p className="text-sm font-semibold text-white">{order.date}</p>
          </div>
          <div>
            <p className="text-xs text-white/60">Delivery Status</p>
            <p className="text-sm font-semibold text-white">{order.delivery}</p>
          </div>
        </div>

        <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg space-y-2">
          <p className="text-xs font-semibold text-white">Commission Breakdown</p>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-white/80">Seller Share (85%)</span>
              <span className="text-white font-semibold">₨{(commission * 0.85).toLocaleString()}</span>
            </div>
            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-emerald-500"
                style={{ width: "85%" }}
              />
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-white/80">Sub-Commission (10%)</span>
              <span className="text-white font-semibold">₨{(commission * 0.1).toLocaleString()}</span>
            </div>
            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-blue-500"
                style={{ width: "10%" }}
              />
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-white/80">Master Fee (5%)</span>
              <span className="text-white font-semibold">₨{(commission * 0.05).toLocaleString()}</span>
            </div>
            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-purple-500"
                style={{ width: "5%" }}
              />
            </div>
          </div>
        </div>

        {order.status === "disputed" && (
          <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
            <p className="text-xs font-semibold text-red-300 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Dispute Resolution Pending
            </p>
            <p className="text-[10px] text-red-200 mt-2">
              Buyer has filed a dispute. Escrow is locked. Waiting for evidence review.
            </p>
          </div>
        )}

        <div className="space-y-2">
          <p className="text-xs font-semibold text-white/80">Actions</p>
          {order.status === "disputed" && (
            <>
              <button className="w-full px-4 py-2 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/30 transition-colors text-sm font-medium">
                Approve Seller
              </button>
              <button className="w-full px-4 py-2 rounded-lg bg-red-500/20 border border-red-500/30 text-red-300 hover:bg-red-500/30 transition-colors text-sm font-medium">
                Approve Buyer Refund
              </button>
            </>
          )}
          {order.status === "active" && (
            <>
              <button className="w-full px-4 py-2 rounded-lg bg-blue-500/20 border border-blue-500/30 text-blue-300 hover:bg-blue-500/30 transition-colors text-sm font-medium">
                View Tracking
              </button>
              <button className="w-full px-4 py-2 rounded-lg bg-amber-500/20 border border-amber-500/30 text-amber-300 hover:bg-amber-500/30 transition-colors text-sm font-medium">
                Contact Parties
              </button>
            </>
          )}
          {order.status === "refunded" && (
            <button className="w-full px-4 py-2 rounded-lg bg-gray-500/20 border border-gray-500/30 text-gray-300 hover:bg-gray-500/30 transition-colors text-sm font-medium" disabled>
              Refund Processed
            </button>
          )}
        </div>
      </div>
    </DrawerPanel>
  );
}

export default function OrderManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const filteredOrders = mockOrders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.buyer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.seller.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "All" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <main className="min-h-screen bg-[#0C0E1A] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="space-y-2 mb-8">
          <p className="text-xs uppercase tracking-widest text-white/60">
            Order Management
          </p>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <ShoppingCart className="w-8 h-8 text-blue-400" />
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Order Dashboard
            </span>
          </h1>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {orderStats.map((stat, idx) => (
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
                placeholder="Search by order number, buyer, or seller..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-white/60" />
                <span className="text-xs text-white/60">Status:</span>
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option>All Orders</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="disputed">Disputed</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>
          </div>
        </GlassCard>

        {/* Orders List */}
        <GlassCard className="p-4">
          <div className="space-y-3">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <OrderRow
                  key={order.id}
                  order={order}
                  onViewDetail={(o) => {
                    setSelectedOrder(o);
                    setIsDetailOpen(true);
                  }}
                />
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-white/60">No orders found matching your filters.</p>
              </div>
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
            <p className="text-xs text-white/60">
              Showing {filteredOrders.length} of {mockOrders.length} orders
            </p>
          </div>
        </GlassCard>

        {/* Detail Drawer */}
        <OrderDetailDrawer
          order={selectedOrder}
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
        />
      </div>
    </main>
  );
}
