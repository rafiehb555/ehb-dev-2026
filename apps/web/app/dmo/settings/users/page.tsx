"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  VerificationStatCard,
  VerificationRowGrid,
  VerificationDrawer,
  VerificationChip,
  SectionHeader,
  FilterChipRow,
  type RowColumn,
  type VerificationTone,
} from "@/components/dmo/verification/VerificationUI";

type User = {
  id: string;
  name: string;
  email: string;
  role: "SUPER_ADMIN" | "ADMIN" | "MODERATOR" | "VIEWER";
  department: string;
  lastLoginAt: string;
  status: "ACTIVE" | "SUSPENDED" | "PENDING";
};

const DEMO_USERS: User[] = [
  {
    id: "user-001",
    name: "Rafi Khan",
    email: "rafi@ehb.tech",
    role: "SUPER_ADMIN",
    department: "Engineering",
    lastLoginAt: "2026-04-12T18:52:14Z",
    status: "ACTIVE",
  },
  {
    id: "user-002",
    name: "Sarah Ahmed",
    email: "sarah@ehb.tech",
    role: "ADMIN",
    department: "Finance",
    lastLoginAt: "2026-04-12T17:44:10Z",
    status: "ACTIVE",
  },
  {
    id: "user-003",
    name: "Marcus Johnson",
    email: "marcus@ehb.tech",
    role: "ADMIN",
    department: "Operations",
    lastLoginAt: "2026-04-12T16:32:15Z",
    status: "ACTIVE",
  },
  {
    id: "user-004",
    name: "Priya Patel",
    email: "priya@ehb.tech",
    role: "MODERATOR",
    department: "Compliance",
    lastLoginAt: "2026-04-12T15:20:45Z",
    status: "ACTIVE",
  },
  {
    id: "user-005",
    name: "James Wilson",
    email: "james@ehb.tech",
    role: "MODERATOR",
    department: "Support",
    lastLoginAt: "2026-04-11T14:15:30Z",
    status: "ACTIVE",
  },
  {
    id: "user-006",
    name: "Emma Davis",
    email: "emma@ehb.tech",
    role: "VIEWER",
    department: "Analytics",
    lastLoginAt: "2026-04-10T09:45:22Z",
    status: "SUSPENDED",
  },
  {
    id: "user-007",
    name: "Alex Chen",
    email: "alex@ehb.tech",
    role: "MODERATOR",
    department: "Engineering",
    lastLoginAt: "2026-04-12T18:15:50Z",
    status: "ACTIVE",
  },
  {
    id: "user-008",
    name: "Lisa Martinez",
    email: "lisa@pending.ehb.tech",
    role: "VIEWER",
    department: "Marketing",
    lastLoginAt: "",
    status: "PENDING",
  },
];

function InfoCell({ label, value, mono }: { label: string; value: React.ReactNode; mono?: boolean }) {
  return (
    <div className="rounded-xl border border-white/8 bg-white/[0.03] p-3">
      <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/45">{label}</p>
      <p className={`mt-1 text-sm text-white/90 ${mono ? "font-mono" : ""}`}>{value}</p>
    </div>
  );
}

export default function UsersPage() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [roleFilter, setRoleFilter] = useState<string>("ALL");

  const visibleUsers = useMemo(() => {
    if (roleFilter === "ALL") return DEMO_USERS;
    return DEMO_USERS.filter((u) => u.role === roleFilter);
  }, [roleFilter]);

  const stats = useMemo(() => {
    const total = DEMO_USERS.length;
    const active = DEMO_USERS.filter((u) => u.status === "ACTIVE").length;
    const suspended = DEMO_USERS.filter((u) => u.status === "SUSPENDED").length;
    const pending = DEMO_USERS.filter((u) => u.status === "PENDING").length;

    return { total, active, suspended, pending };
  }, []);

  const roleOptions = [
    { value: "ALL", label: "All Roles" },
    { value: "SUPER_ADMIN", label: "Super Admin" },
    { value: "ADMIN", label: "Admin" },
    { value: "MODERATOR", label: "Moderator" },
    { value: "VIEWER", label: "Viewer" },
  ];

  const getTone = (role: string): VerificationTone => {
    switch (role) {
      case "SUPER_ADMIN":
        return "red";
      case "ADMIN":
        return "purple";
      case "MODERATOR":
        return "amber";
      case "VIEWER":
        return "cyan";
      default:
        return "teal";
    }
  };

  const getRoleIcon = (role: string): string => {
    switch (role) {
      case "SUPER_ADMIN":
        return "-";
      case "ADMIN":
        return "-";
      case "MODERATOR":
        return "-";
      case "VIEWER":
        return "--";
      default:
        return "•";
    }
  };

  const getStatusColor = (status: string): VerificationTone => {
    switch (status) {
      case "ACTIVE":
        return "green";
      case "SUSPENDED":
        return "red";
      case "PENDING":
        return "amber";
      default:
        return "cyan";
    }
  };

  const columns: RowColumn<User>[] = [
    {
      key: "name",
      header: "Name",
      width: "minmax(0, 1.2fr)",
      render: (u) => <span className="font-semibold text-white/80">{u.name}</span>,
    },
    {
      key: "email",
      header: "Email",
      width: "minmax(0, 1.5fr)",
      render: (u) => (
        <span className="font-mono text-[11px] text-white/53">
          {u.email}
        </span>
      ),
    },
    {
      key: "role",
      header: "Role",
      width: "minmax(0, 1.1fr)",
      render: (u) => (
        <span className="mr-1.5">
          {getRoleIcon(u.role)} <VerificationChip tone={getTone(u.role)}>{u.role}</VerificationChip>
        </span>
      ),
    },
    {
      key: "department",
      header: "Department",
      width: "minmax(0, 1fr)",
      render: (u) => <span className="text-[12px] text-[#A098F8]">{u.department}</span>,
    },
    {
      key: "status",
      header: "Status",
      width: "minmax(0, 0.95fr)",
      render: (u) => <VerificationChip tone={getStatusColor(u.status)}>{u.status}</VerificationChip>,
    },
    {
      key: "lastLoginAt",
      header: "Last Login",
      width: "minmax(0, 1.1fr)",
      align: "right",
      render: (u) => {
        if (!u.lastLoginAt) return <span className="text-[11px] text-white/48">Never</span>;
        const dt = new Date(u.lastLoginAt);
        return (
          <span className="text-[11px] text-white/48">
            {dt.toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })}
          </span>
        );
      },
    },
  ];

  return (
    <div className="min-h-screen space-y-6 bg-[#0C0E1A] p-[clamp(16px,3vw,32px)]">
      <SectionHeader
        eyebrow="DMO"
        title="Settings / Users"
        hint="Manage DMO platform user accounts"
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <VerificationStatCard
          tone="purple"
          label="Total Users"
          value={stats.total.toString()}
          sub="All accounts"
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          }
        />
        <VerificationStatCard
          tone="teal"
          label="Active"
          value={stats.active.toString()}
          sub="Logged in users"
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
          }
        />
        <VerificationStatCard
          tone="red"
          label="Suspended"
          value={stats.suspended.toString()}
          sub="Deactivated"
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
            </svg>
          }
        />
        <VerificationStatCard
          tone="amber"
          label="Pending Invite"
          value={stats.pending.toString()}
          sub="Awaiting signup"
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          }
        />
      </div>

      <div className="rounded-2xl border border-white/10 bg-[#13162A]/70 p-5">
        <div className="mb-4">
          <SectionHeader title="Filter by Role" hint="Refine users by role" />
        </div>
        <FilterChipRow<string>
          value={roleFilter}
          options={roleOptions}
          onChange={setRoleFilter}
        />
      </div>

      <div className="rounded-2xl border border-white/10 bg-[#13162A]/70 p-5">
        <SectionHeader
          title="User Accounts"
          hint={`Showing ${visibleUsers.length} of ${DEMO_USERS.length} users`}
        />
        <VerificationRowGrid<User>
          rows={visibleUsers}
          columns={columns}
          onRowClick={setSelectedUser}
          getRowTone={(u) => {
            if (u.status === "SUSPENDED") return "red";
            if (u.status === "PENDING") return "amber";
            return "teal";
          }}
        />
      </div>

      {selectedUser && (
        <VerificationDrawer
          open={!!selectedUser}
          onClose={() => setSelectedUser(null)}
          title={selectedUser.name}
          subtitle={`${selectedUser.role} • ${selectedUser.email}`}
          severity={selectedUser.status === "SUSPENDED" ? "high" : "info"}
          children={
            <div className="space-y-4">
              <InfoCell label="Email" value={selectedUser.email} mono />
              <div>
                <p className="mb-2 text-[9px] font-semibold uppercase tracking-[0.2em] text-white/45">Role</p>
                <VerificationChip tone={getTone(selectedUser.role)}>
                  {selectedUser.role}
                </VerificationChip>
              </div>
              <InfoCell label="Department" value={selectedUser.department} />
              <div>
                <p className="mb-2 text-[9px] font-semibold uppercase tracking-[0.2em] text-white/45">Account Status</p>
                <VerificationChip tone={getStatusColor(selectedUser.status)}>
                  {selectedUser.status}
                </VerificationChip>
              </div>
              <InfoCell label="Last Login" value={selectedUser.lastLoginAt ? new Date(selectedUser.lastLoginAt).toLocaleString() : "Never"} mono />
              <div className="rounded-xl border border-white/8 bg-white/[0.03] p-3">
                <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/45">Permissions</p>
                <div className="mt-2 space-y-1 text-[12px] text-white/75">
                  <div>• Read: All modules</div>
                  <div>• Write: {selectedUser.role !== "VIEWER" ? "Assigned modules" : "None"}</div>
                  <div>• Admin: {["SUPER_ADMIN", "ADMIN"].includes(selectedUser.role) ? "Yes" : "No"}</div>
                </div>
              </div>
            </div>
          }
          footer={
            <div className="flex gap-2">
              <button className="flex-1 rounded-lg border border-[#A098F8]/30 bg-[#7B6EF6]/15 px-3 py-2 text-[11px] font-semibold text-[#A098F8] hover:bg-[#7B6EF6]/25 transition">
                Edit User
              </button>
              <button className="flex-1 rounded-lg border border-[#F05858]/30 bg-[#F05858]/10 px-3 py-2 text-[11px] font-semibold text-[#F05858] hover:bg-[#F05858]/20 transition">
                {selectedUser.status === "SUSPENDED" ? "Reactivate" : "Suspend"}
              </button>
            </div>
          }
        />
      )}
    </div>
  );
}
