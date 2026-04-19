"use client";

import { useState } from "react";
import {
  BarChart3,
  TrendingUp,
  Users,
  ShoppingCart,
  DollarSign,
  Zap,
  ActivitySquare,
  AlertCircle,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/Button";

interface StatCard {
  label: string;
  value: string | number;
  change?: string;
  icon: React.ReactNode;
  trend?: "up" | "down" | "neutral";
}

interface ActivityEvent {
  id: string;
  type: "user" | "order" | "complaint" | "verification";
  description: string;
  timestamp: string;
  status: "completed" | "pending" | "alert";
}

interface HealthItem {
  service: string;
  status: "healthy" | "degraded" | "critical";
  uptime: string;
  latency: string;
}

const platformStats: StatCard[] = [
  {
    label: "Total Users",
    value: "24,582",
    change: "+12.5%",
    trend: "up",
    icon: <Users className="w-5 h-5" />,
  },
  {
    label: "Active Orders",
    value: "1,847",
    change: "+8.2%",
    trend: "up",
    icon: <ShoppingCart className="w-5 h-5" />,
  },
  {
    label: "Revenue Today",
    value: "$45,230",
    change: "+24.3%",
    trend: "up",
    icon: <DollarSign className="w-5 h-5" />,
  },
  {
    label: "Active Sellers",
    value: "3,421",
    change: "+5.1%",
    trend: "up",
    icon: <Zap className="w-5 h-5" />,
  },
];

const revenueStreams = [
  { label: "Service Fee (40%)", value: 18092, color: "#7B6EF6" },
  { label: "Affiliate (25%)", value: 11307.5, color: "#A098F8" },
  { label: "Franchise Sales (20%)", value: 9046, color: "#2BBFA0" },
  { label: "DMO Subscription (10%)", value: 4523, color: "#F0A030" },
  { label: "Token Fees (5%)", value: 2261.5, color: "#F05858" },
];

const activityFeed: ActivityEvent[] = [
  {
    id: "1",
    type: "user",
    description: "New seller registered: TechPro Solutions",
    timestamp: "2 minutes ago",
    status: "completed",
  },
  {
    id: "2",
    type: "order",
    description: "High-value order (₨250,000) - Waiting verification",
    timestamp: "5 minutes ago",
    status: "pending",
  },
  {
    id: "3",
    type: "verification",
    description: "CRB verification approved for 12 users",
    timestamp: "8 minutes ago",
    status: "completed",
  },
  {
    id: "4",
    type: "complaint",
    description: "Fraud alert: Duplicate listing patterns detected",
    timestamp: "15 minutes ago",
    status: "alert",
  },
  {
    id: "5",
    type: "order",
    description: "Dispute raised on Order #5847 - Escrow locked",
    timestamp: "22 minutes ago",
    status: "alert",
  },
];

const healthMonitor: HealthItem[] = [
  {
    service: "API Server",
    status: "healthy",
    uptime: "99.98%",
    latency: "45ms",
  },
  {
    service: "Database (MongoDB)",
    status: "healthy",
    uptime: "99.95%",
    latency: "12ms",
  },
  {
    service: "Blockchain (Polkadot)",
    status: "healthy",
    uptime: "99.99%",
    latency: "250ms",
  },
  {
    service: "AI Services (OpenAI)",
    status: "degraded",
    uptime: "98.5%",
    latency: "1200ms",
  },
];

function StatCardComponent(props: StatCard) {
  return (
    <GlassCard className="p-4 space-y-2">
      <div className="flex items-start justify-between">
        <div className="space-y-1 flex-1">
          <p className="text-xs text-white/60">{props.label}</p>
          <p className="text-2xl font-bold text-white">{props.value}</p>
        </div>
        <div className="text-purple-400">{props.icon}</div>
      </div>
      {props.change && (
        <div
          className={`text-xs font-semibold ${
            props.trend === "up"
              ? "text-emerald-400"
              : props.trend === "down"
                ? "text-red-400"
                : "text-amber-400"
          }`}
        >
          {props.change}
        </div>
      )}
    </GlassCard>
  );
}

function RevenueChart() {
  const total = revenueStreams.reduce((sum, item) => sum + item.value, 0);

  return (
    <GlassCard className="p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-white flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-purple-400" />
          Revenue Breakdown (Today: ${total.toLocaleString()})
        </h2>
      </div>

      <div className="space-y-3">
        {revenueStreams.map((stream, idx) => (
          <div key={idx} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-white/80">{stream.label}</span>
              <span className="text-white font-semibold">
                ${stream.value.toLocaleString()}
              </span>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${(stream.value / total) * 100}%`,
                  backgroundColor: stream.color,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}

function QuickActions() {
  const actions = [
    { label: "Approve Sellers", icon: "✓", color: "emerald" },
    { label: "Review Complaints", icon: "⚠", color: "amber" },
    { label: "Manage Franchises", icon: "🏢", color: "blue" },
    { label: "System Settings", icon: "⚙", color: "slate" },
  ];

  return (
    <GlassCard className="p-5 space-y-4">
      <h2 className="text-sm font-semibold text-white flex items-center gap-2">
        <Zap className="w-4 h-4 text-amber-400" />
        Quick Actions
      </h2>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action, idx) => (
          <button
            key={idx}
            className="p-3 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors text-sm font-medium text-white/80 hover:text-white flex flex-col items-center gap-2"
          >
            <span className="text-xl">{action.icon}</span>
            <span className="text-xs text-center">{action.label}</span>
          </button>
        ))}
      </div>
    </GlassCard>
  );
}

function ActivityFeedComponent() {
  const statusConfig = {
    completed: { icon: CheckCircle2, color: "text-emerald-400" },
    pending: { icon: Clock, color: "text-amber-400" },
    alert: { icon: AlertCircle, color: "text-red-400" },
  };

  return (
    <GlassCard className="p-5 space-y-4">
      <h2 className="text-sm font-semibold text-white flex items-center gap-2">
        <ActivitySquare className="w-4 h-4 text-cyan-400" />
        Recent Activity Feed
      </h2>
      <div className="space-y-2">
        {activityFeed.map((event) => {
          const config = statusConfig[event.status];
          const IconComponent = config.icon;

          return (
            <div
              key={event.id}
              className="flex gap-3 p-3 rounded-lg border border-white/5 bg-white/5 hover:bg-white/10 transition-colors"
            >
              <IconComponent className={`w-4 h-4 flex-shrink-0 mt-0.5 ${config.color}`} />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-white/90">{event.description}</p>
                <p className="text-[10px] text-white/50 mt-1">{event.timestamp}</p>
              </div>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
}

function HealthMonitor() {
  const statusConfig = {
    healthy: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    degraded: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    critical: "bg-red-500/20 text-red-300 border-red-500/30",
  };

  return (
    <GlassCard className="p-5 space-y-4">
      <h2 className="text-sm font-semibold text-white flex items-center gap-2">
        <ActivitySquare className="w-4 h-4 text-green-400" />
        System Health Monitor
      </h2>
      <div className="space-y-2">
        {healthMonitor.map((item, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-lg border ${statusConfig[item.status]}`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold">{item.service}</p>
                <p className="text-[10px] opacity-75 mt-1">
                  Uptime: {item.uptime} • Latency: {item.latency}
                </p>
              </div>
              <Badge variant="outline" className="text-[10px]">
                {item.status === "healthy"
                  ? "Live"
                  : item.status === "degraded"
                    ? "Slow"
                    : "Down"}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}

export default function AdminDashboard() {
  const [activeTab] = useState("overview");

  return (
    <main className="min-h-screen bg-[#0C0E1A] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="space-y-2 mb-8">
          <p className="text-xs uppercase tracking-widest text-white/60">
            Admin Control Panel
          </p>
          <h1 className="text-3xl font-bold">
            <span className="bg-gradient-to-r from-purple-400 via-teal-400 to-emerald-400 bg-clip-text text-transparent">
              Platform Dashboard
            </span>
          </h1>
          <p className="text-sm text-white/70">
            Real-time monitoring and management of the EHB Global super-app
          </p>
        </div>

        {/* Quick Navigation */}
        <div className="flex flex-wrap gap-2 mb-8">
          <a
            href="/admin/users"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-300 hover:bg-purple-500/20 transition-all text-sm font-medium"
          >
            <Users className="w-4 h-4" />
            Users
          </a>
          <a
            href="/admin/sellers"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-300 hover:bg-purple-500/20 transition-all text-sm font-medium"
          >
            <Zap className="w-4 h-4" />
            Sellers
          </a>
          <a
            href="/admin/orders"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-300 hover:bg-purple-500/20 transition-all text-sm font-medium"
          >
            <ShoppingCart className="w-4 h-4" />
            Orders
          </a>
          <a
            href="/admin/commission"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-300 hover:bg-purple-500/20 transition-all text-sm font-medium"
          >
            <DollarSign className="w-4 h-4" />
            Commission
          </a>
          <a
            href="/admin/franchise"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-300 hover:bg-purple-500/20 transition-all text-sm font-medium"
          >
            <TrendingUp className="w-4 h-4" />
            Franchises
          </a>
        </div>

        {/* Platform Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {platformStats.map((stat, idx) => (
            <StatCardComponent key={idx} {...stat} />
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Revenue Chart - spans 2 columns */}
          <div className="lg:col-span-2">
            <RevenueChart />
          </div>

          {/* Quick Actions */}
          <QuickActions />
        </div>

        {/* Activity and Health */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ActivityFeedComponent />
          <HealthMonitor />
        </div>
      </div>
    </main>
  );
}
