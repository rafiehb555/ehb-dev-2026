"use client";

import { useState } from "react";
import {
  Users,
  Search,
  Shield,
  Ban,
  Eye,
  MoreVertical,
  Filter,
  ChevronDown,
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { DrawerPanel } from "@/components/ui/drawer-panel";
import { Button } from "@/components/ui/Button";

interface User {
  id: string;
  name: string;
  email: string;
  role: "Buyer" | "Seller" | "Rider" | "Admin";
  stlLevel: number;
  status: "active" | "suspended" | "banned";
  joinedDate: string;
  orders?: number;
}

const mockUsers: User[] = [
  {
    id: "U001",
    name: "Ahmed Hassan",
    email: "ahmed.hassan@email.com",
    role: "Buyer",
    stlLevel: 5,
    status: "active",
    joinedDate: "2024-02-15",
    orders: 24,
  },
  {
    id: "U002",
    name: "Fatima Malik",
    email: "fatima.malik@email.com",
    role: "Seller",
    stlLevel: 7,
    status: "active",
    joinedDate: "2024-01-20",
    orders: 156,
  },
  {
    id: "U003",
    name: "Hassan Khan",
    email: "hassan.khan@email.com",
    role: "Rider",
    stlLevel: 6,
    status: "active",
    joinedDate: "2024-03-10",
    orders: 89,
  },
  {
    id: "U004",
    name: "Sara Ahmed",
    email: "sara.ahmed@email.com",
    role: "Seller",
    stlLevel: 4,
    status: "suspended",
    joinedDate: "2024-01-05",
    orders: 12,
  },
  {
    id: "U005",
    name: "Ali Raza",
    email: "ali.raza@email.com",
    role: "Buyer",
    stlLevel: 3,
    status: "banned",
    joinedDate: "2023-12-25",
    orders: 3,
  },
  {
    id: "U006",
    name: "Zainab Khan",
    email: "zainab.khan@email.com",
    role: "Seller",
    stlLevel: 8,
    status: "active",
    joinedDate: "2024-02-01",
    orders: 234,
  },
];

const userStats = [
  { label: "Total Users", value: "24,582", change: "+12.5%" },
  { label: "Active", value: "22,145", change: "+8.2%" },
  { label: "New This Week", value: "342", change: "+24.3%" },
  { label: "Suspended/Banned", value: "95", change: "+1.2%" },
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

function StatusBadge({ status }: { status: string }) {
  const colors = {
    active: "bg-emerald-500/20 text-emerald-300",
    suspended: "bg-amber-500/20 text-amber-300",
    banned: "bg-red-500/20 text-red-300",
  };

  return (
    <Badge className={colors[status as keyof typeof colors]}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}

function UserRow({ user, onViewDetail }: { user: User; onViewDetail: (user: User) => void }) {
  return (
    <div className="p-4 border border-white/5 rounded-lg hover:bg-white/5 transition-colors flex items-center justify-between">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white">{user.name}</p>
        <p className="text-xs text-white/60">{user.email}</p>
        <div className="flex gap-2 mt-2">
          <Badge variant="outline" className="text-[10px]">
            {user.role}
          </Badge>
          <STLLevelBadge level={user.stlLevel} />
          <StatusBadge status={user.status} />
        </div>
      </div>
      <div className="flex items-center gap-2 ml-4">
        <button
          onClick={() => onViewDetail(user)}
          className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white/60 hover:text-white"
        >
          <Eye className="w-4 h-4" />
        </button>
        <button className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white/60 hover:text-white">
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function UserDetailDrawer({
  user,
  isOpen,
  onClose,
}: {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!user) return null;

  return (
    <DrawerPanel title="User Details" isOpen={isOpen} onClose={onClose}>
      <div className="space-y-4">
        <div className="p-4 bg-white/5 rounded-lg space-y-3">
          <div>
            <p className="text-xs text-white/60">Name</p>
            <p className="text-sm font-semibold text-white">{user.name}</p>
          </div>
          <div>
            <p className="text-xs text-white/60">Email</p>
            <p className="text-sm font-semibold text-white">{user.email}</p>
          </div>
          <div>
            <p className="text-xs text-white/60">Role</p>
            <p className="text-sm font-semibold text-white">{user.role}</p>
          </div>
          <div>
            <p className="text-xs text-white/60">STL Level</p>
            <STLLevelBadge level={user.stlLevel} />
          </div>
          <div>
            <p className="text-xs text-white/60">Status</p>
            <StatusBadge status={user.status} />
          </div>
          <div>
            <p className="text-xs text-white/60">Joined</p>
            <p className="text-sm font-semibold text-white">{user.joinedDate}</p>
          </div>
          {user.orders && (
            <div>
              <p className="text-xs text-white/60">Total Orders</p>
              <p className="text-sm font-semibold text-white">{user.orders}</p>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <p className="text-xs font-semibold text-white/80">Actions</p>
          <button className="w-full px-4 py-2 rounded-lg bg-blue-500/20 border border-blue-500/30 text-blue-300 hover:bg-blue-500/30 transition-colors text-sm font-medium">
            View Full Profile
          </button>
          <button className="w-full px-4 py-2 rounded-lg bg-amber-500/20 border border-amber-500/30 text-amber-300 hover:bg-amber-500/30 transition-colors text-sm font-medium">
            Adjust STL Level
          </button>
          <button className="w-full px-4 py-2 rounded-lg bg-orange-500/20 border border-orange-500/30 text-orange-300 hover:bg-orange-500/30 transition-colors text-sm font-medium">
            {user.status === "suspended" ? "Unsuspend" : "Suspend"}
          </button>
          <button className="w-full px-4 py-2 rounded-lg bg-red-500/20 border border-red-500/30 text-red-300 hover:bg-red-500/30 transition-colors text-sm font-medium">
            Ban User
          </button>
        </div>
      </div>
    </DrawerPanel>
  );
}

export default function UserManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("All");
  const [stlFilter, setStlFilter] = useState<string>("All");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const filteredUsers = mockUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "All" || user.role === roleFilter;
    const matchesSTL =
      stlFilter === "All" || user.stlLevel.toString() === stlFilter;

    return matchesSearch && matchesRole && matchesSTL;
  });

  return (
    <main className="min-h-screen bg-[#0C0E1A] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="space-y-2 mb-8">
          <p className="text-xs uppercase tracking-widest text-white/60">
            User Management
          </p>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Users className="w-8 h-8 text-purple-400" />
            <span className="bg-gradient-to-r from-purple-400 to-teal-400 bg-clip-text text-transparent">
              User Directory
            </span>
          </h1>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {userStats.map((stat, idx) => (
            <GlassCard key={idx} className="p-4">
              <p className="text-xs text-white/60">{stat.label}</p>
              <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
              <p className="text-xs text-emerald-400 mt-2">{stat.change}</p>
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
                placeholder="Search users by name or email..."
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
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option>All Roles</option>
                <option>Buyer</option>
                <option>Seller</option>
                <option>Rider</option>
                <option>Admin</option>
              </select>

              <select
                value={stlFilter}
                onChange={(e) => setStlFilter(e.target.value)}
                className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option>All STL Levels</option>
                <option value="1">L1</option>
                <option value="2">L2</option>
                <option value="3">L3</option>
                <option value="4">L4</option>
                <option value="5">L5</option>
                <option value="6">L6</option>
                <option value="7">L7</option>
                <option value="8">L8</option>
              </select>
            </div>
          </div>
        </GlassCard>

        {/* Users List */}
        <GlassCard className="p-4">
          <div className="space-y-2">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <UserRow
                  key={user.id}
                  user={user}
                  onViewDetail={(u) => {
                    setSelectedUser(u);
                    setIsDetailOpen(true);
                  }}
                />
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-white/60">No users found matching your filters.</p>
              </div>
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
            <p className="text-xs text-white/60">
              Showing {filteredUsers.length} of {mockUsers.length} users
            </p>
            <div className="flex gap-2">
              <button className="px-3 py-1 rounded-lg border border-white/10 text-xs text-white/60 hover:bg-white/5 transition-colors">
                Previous
              </button>
              <button className="px-3 py-1 rounded-lg border border-white/10 text-xs text-white/60 hover:bg-white/5 transition-colors">
                Next
              </button>
            </div>
          </div>
        </GlassCard>

        {/* Detail Drawer */}
        <UserDetailDrawer
          user={selectedUser}
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
        />
      </div>
    </main>
  );
}
