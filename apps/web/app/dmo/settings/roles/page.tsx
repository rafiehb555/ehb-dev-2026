"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  VerificationStatCard,
  VerificationRowGrid,
  VerificationDrawer,
  VerificationChip,
  SectionHeader,
  type RowColumn,
  type VerificationTone,
} from "@/components/dmo/verification/VerificationUI";

type Role = {
  id: string;
  roleName: string;
  description: string;
  userCount: number;
  permissionCount: number;
  isCustom: boolean;
  createdAt: string;
};

const DEMO_ROLES: Role[] = [
  {
    id: "role-001",
    roleName: "Super Admin",
    description: "Full access to all DMO features and configurations",
    userCount: 1,
    permissionCount: 48,
    isCustom: false,
    createdAt: "2025-01-15T08:30:00Z",
  },
  {
    id: "role-002",
    roleName: "Admin",
    description: "Administrative access with some restrictions",
    userCount: 2,
    permissionCount: 42,
    isCustom: false,
    createdAt: "2025-01-15T08:30:00Z",
  },
  {
    id: "role-003",
    roleName: "Moderator",
    description: "Content and user moderation capabilities",
    userCount: 3,
    permissionCount: 18,
    isCustom: false,
    createdAt: "2025-01-15T08:30:00Z",
  },
  {
    id: "role-004",
    roleName: "Viewer",
    description: "Read-only access to dashboards and reports",
    userCount: 2,
    permissionCount: 8,
    isCustom: false,
    createdAt: "2025-01-15T08:30:00Z",
  },
  {
    id: "role-005",
    roleName: "Finance Manager",
    description: "Custom role for financial operations team",
    userCount: 1,
    permissionCount: 12,
    isCustom: true,
    createdAt: "2026-02-20T10:15:30Z",
  },
  {
    id: "role-006",
    roleName: "Compliance Officer",
    description: "Custom role for compliance and audit functions",
    userCount: 1,
    permissionCount: 16,
    isCustom: true,
    createdAt: "2026-03-05T14:45:22Z",
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

export default function RolesPage() {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  const stats = useMemo(() => {
    const total = DEMO_ROLES.length;
    const custom = DEMO_ROLES.filter((r) => r.isCustom).length;
    const avgUsers = Math.round(
      DEMO_ROLES.reduce((sum, r) => sum + r.userCount, 0) / DEMO_ROLES.length
    );
    const totalPermissions = DEMO_ROLES.reduce((sum, r) => sum + r.permissionCount, 0);

    return { total, custom, avgUsers, totalPermissions };
  }, []);

  const getTone = (isCustom: boolean): VerificationTone => {
    return isCustom ? "purple" : "teal";
  };

  const columns: RowColumn<Role>[] = [
    {
      key: "roleName",
      header: "Role Name",
      width: "minmax(0, 1.3fr)",
      render: (r) => (
        <span className="font-semibold text-white/80">
          {r.isCustom && "⭐"} {r.roleName}
        </span>
      ),
    },
    {
      key: "description",
      header: "Description",
      width: "minmax(0, 2fr)",
      render: (r) => (
        <span className="text-[11px] text-white/53">{r.description}</span>
      ),
    },
    {
      key: "userCount",
      header: "Users",
      width: "minmax(0, 0.7fr)",
      align: "right",
      render: (r) => (
        <span className="font-mono font-semibold text-[#A098F8]">
          {r.userCount}
        </span>
      ),
    },
    {
      key: "permissionCount",
      header: "Permissions",
      width: "minmax(0, 1fr)",
      align: "right",
      render: (r) => (
        <span className="font-mono font-semibold text-[#2BBFA0]">
          {r.permissionCount}
        </span>
      ),
    },
  ];

  return (
    <div className="min-h-screen space-y-6 bg-[#0C0E1A] p-[clamp(16px,3vw,32px)]">
      <SectionHeader
        eyebrow="DMO"
        title="Settings / Roles"
        hint="Define and manage user roles"
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <VerificationStatCard
          tone="purple"
          label="Total Roles"
          value={stats.total.toString()}
          sub="System + custom"
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
              <path d="M12 6v6l4 2" />
            </svg>
          }
        />
        <VerificationStatCard
          tone="teal"
          label="Custom Roles"
          value={stats.custom.toString()}
          sub="Organization-specific"
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          }
        />
        <VerificationStatCard
          tone="amber"
          label="Users Per Role"
          value={stats.avgUsers.toString()}
          sub="Average"
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
          tone="green"
          label="Permissions"
          value={stats.totalPermissions.toString()}
          sub="Total across roles"
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
              <path d="M10 15l-3-3 1.4-1.4L10 12.2l5.6-5.6L17 8" />
            </svg>
          }
        />
      </div>

      <div className="rounded-2xl border border-white/10 bg-[#13162A]/70 p-5">
        <SectionHeader
          title="Role Management"
          hint={`${DEMO_ROLES.length} roles configured`}
        />
        <VerificationRowGrid<Role>
          rows={DEMO_ROLES}
          columns={columns}
          onRowClick={setSelectedRole}
          getRowTone={(r) => getTone(r.isCustom)}
        />
      </div>

      {selectedRole && (
        <VerificationDrawer
          open={!!selectedRole}
          onClose={() => setSelectedRole(null)}
          title={selectedRole.roleName}
          subtitle={`${selectedRole.isCustom ? "Custom role" : "System role"} • ${selectedRole.userCount} users`}
          severity="info"
          children={
            <div className="space-y-4">
              <div>
                <p className="mb-2 text-[9px] font-semibold uppercase tracking-[0.2em] text-white/45">Type</p>
                <VerificationChip tone={getTone(selectedRole.isCustom)}>
                  {selectedRole.isCustom ? "CUSTOM" : "SYSTEM"}
                </VerificationChip>
              </div>
              <InfoCell label="Description" value={selectedRole.description} />
              <InfoCell label="Assigned Users" value={`${selectedRole.userCount} user${selectedRole.userCount !== 1 ? "s" : ""}`} />
              <InfoCell label="Permissions" value={`${selectedRole.permissionCount} permissions assigned`} mono />
              <InfoCell label="Created" value={new Date(selectedRole.createdAt).toLocaleString()} mono />
              <div className="border-t border-white/8 pt-3">
                <p className="mb-2 text-[9px] font-semibold uppercase tracking-[0.2em] text-white/45">Sample Permissions</p>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded bg-[#2BBFA0]/15 px-2 py-1 text-[11px] text-white/75 border border-[#2BBFA0]/30">READ_USERS</span>
                  <span className="rounded bg-[#2BBFA0]/15 px-2 py-1 text-[11px] text-white/75 border border-[#2BBFA0]/30">WRITE_USERS</span>
                  <span className="rounded bg-[#2BBFA0]/15 px-2 py-1 text-[11px] text-white/75 border border-[#2BBFA0]/30">READ_AUDIT</span>
                  <span className="rounded bg-[#2BBFA0]/15 px-2 py-1 text-[11px] text-white/75 border border-[#2BBFA0]/30">ADMIN_CONSOLE</span>
                </div>
              </div>
            </div>
          }
          footer={
            <div className="flex gap-2">
              <button className="flex-1 rounded-lg border border-[#A098F8]/30 bg-[#7B6EF6]/15 px-3 py-2 text-[11px] font-semibold text-[#A098F8] hover:bg-[#7B6EF6]/25 transition">
                Edit Permissions
              </button>
              {selectedRole.isCustom && (
                <button className="flex-1 rounded-lg border border-[#F05858]/30 bg-[#F05858]/10 px-3 py-2 text-[11px] font-semibold text-[#F05858] hover:bg-[#F05858]/20 transition">
                  Delete Role
                </button>
              )}
            </div>
          }
        />
      )}
    </div>
  );
}
