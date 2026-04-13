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

type Permission = {
  id: string;
  permissionName: string;
  module: string;
  actions: string;
  assignedRoles: number;
  isSystem: boolean;
};

const DEMO_PERMISSIONS: Permission[] = [
  {
    id: "perm-001",
    permissionName: "User Create",
    module: "Users",
    actions: "WRITE",
    assignedRoles: 2,
    isSystem: true,
  },
  {
    id: "perm-002",
    permissionName: "User Read",
    module: "Users",
    actions: "READ",
    assignedRoles: 5,
    isSystem: true,
  },
  {
    id: "perm-003",
    permissionName: "User Delete",
    module: "Users",
    actions: "DELETE",
    assignedRoles: 1,
    isSystem: true,
  },
  {
    id: "perm-004",
    permissionName: "Audit Log Access",
    module: "Audit",
    actions: "READ",
    assignedRoles: 3,
    isSystem: true,
  },
  {
    id: "perm-005",
    permissionName: "STL Configuration",
    module: "STL",
    actions: "WRITE, ADMIN",
    assignedRoles: 2,
    isSystem: true,
  },
  {
    id: "perm-006",
    permissionName: "STL View",
    module: "STL",
    actions: "READ",
    assignedRoles: 4,
    isSystem: true,
  },
  {
    id: "perm-007",
    permissionName: "Fraud Detection Override",
    module: "Wallet",
    actions: "WRITE, ADMIN",
    assignedRoles: 1,
    isSystem: true,
  },
  {
    id: "perm-008",
    permissionName: "Finance Report Export",
    module: "Finance",
    actions: "READ",
    assignedRoles: 2,
    isSystem: false,
  },
  {
    id: "perm-009",
    permissionName: "Compliance Override",
    module: "Compliance",
    actions: "WRITE",
    assignedRoles: 1,
    isSystem: false,
  },
  {
    id: "perm-010",
    permissionName: "System Configuration",
    module: "System",
    actions: "WRITE, ADMIN",
    assignedRoles: 1,
    isSystem: true,
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

export default function PermissionsPage() {
  const [selectedPerm, setSelectedPerm] = useState<Permission | null>(null);
  const [moduleFilter, setModuleFilter] = useState<string>("ALL");

  const visiblePermissions = useMemo(() => {
    if (moduleFilter === "ALL") return DEMO_PERMISSIONS;
    return DEMO_PERMISSIONS.filter((p) => p.module === moduleFilter);
  }, [moduleFilter]);

  const stats = useMemo(() => {
    const total = DEMO_PERMISSIONS.length;
    const modules = new Set(DEMO_PERMISSIONS.map((p) => p.module)).size;
    const customOverrides = DEMO_PERMISSIONS.filter((p) => !p.isSystem).length;
    const auditEntries = 120;

    return { total, modules, customOverrides, auditEntries };
  }, []);

  const moduleOptions = [
    { value: "ALL", label: "All Modules" },
    { value: "Users", label: "Users" },
    { value: "Audit", label: "Audit" },
    { value: "STL", label: "STL" },
    { value: "Wallet", label: "Wallet" },
    { value: "Finance", label: "Finance" },
    { value: "Compliance", label: "Compliance" },
    { value: "System", label: "System" },
  ];

  const getTone = (module: string): VerificationTone => {
    const tones: Record<string, VerificationTone> = {
      Users: "purple",
      Audit: "teal",
      STL: "green",
      Wallet: "amber",
      Finance: "cyan",
      Compliance: "red",
      System: "purple",
    };
    return tones[module] || "purple";
  };

  const getActionTone = (actions: string): VerificationTone => {
    if (actions.includes("ADMIN")) return "red";
    if (actions.includes("WRITE")) return "amber";
    return "teal";
  };

  const columns: RowColumn<Permission>[] = [
    {
      key: "permissionName",
      header: "Permission",
      width: "minmax(0, 1.5fr)",
      render: (p) => (
        <span className="font-semibold text-white/80">
          {!p.isSystem && "-"} {p.permissionName}
        </span>
      ),
    },
    {
      key: "module",
      header: "Module",
      width: "minmax(0, 1.1fr)",
      render: (p) => <VerificationChip tone={getTone(p.module)}>{p.module}</VerificationChip>,
    },
    {
      key: "actions",
      header: "Actions",
      width: "minmax(0, 1.2fr)",
      render: (p) => (
        <VerificationChip tone={getActionTone(p.actions)}>{p.actions}</VerificationChip>
      ),
    },
    {
      key: "assignedRoles",
      header: "Assigned Roles",
      width: "minmax(0, 0.9fr)",
      align: "right",
      render: (p) => (
        <span className="font-mono font-semibold text-[#A098F8]">
          {p.assignedRoles}
        </span>
      ),
    },
  ];

  return (
    <div className="min-h-screen space-y-6 bg-[#0C0E1A] p-[clamp(16px,3vw,32px)]">
      <SectionHeader
        eyebrow="DMO"
        title="Settings / Permissions"
        hint="Granular permissions for modules and features"
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <VerificationStatCard
          tone="purple"
          label="Total Permissions"
          value={stats.total.toString()}
          sub="System + custom"
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
              <path d="M10 15l-3-3 1.4-1.4L10 12.2l5.6-5.6L17 8" />
            </svg>
          }
        />
        <VerificationStatCard
          tone="teal"
          label="Module Groups"
          value={stats.modules.toString()}
          sub="Modules covered"
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
            </svg>
          }
        />
        <VerificationStatCard
          tone="amber"
          label="Custom Overrides"
          value={stats.customOverrides.toString()}
          sub="Custom rules"
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
              <path d="M12 6v6l4 2" />
            </svg>
          }
        />
        <VerificationStatCard
          tone="cyan"
          label="Audit Entries"
          value={stats.auditEntries.toString()}
          sub="All-time changes"
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          }
        />
      </div>

      <div className="rounded-2xl border border-white/10 bg-[#13162A]/70 p-5">
        <div className="mb-4">
          <SectionHeader title="Filter by Module" hint="Refine permissions by module" />
        </div>
        <FilterChipRow<string>
          value={moduleFilter}
          options={moduleOptions}
          onChange={setModuleFilter}
        />
      </div>

      <div className="rounded-2xl border border-white/10 bg-[#13162A]/70 p-5">
        <SectionHeader
          title="Permission Matrix"
          hint={`Showing ${visiblePermissions.length} of ${DEMO_PERMISSIONS.length} permissions`}
        />
        <VerificationRowGrid<Permission>
          rows={visiblePermissions}
          columns={columns}
          onRowClick={setSelectedPerm}
          getRowTone={(p) => getTone(p.module)}
        />
      </div>

      {selectedPerm && (
        <VerificationDrawer
          open={!!selectedPerm}
          onClose={() => setSelectedPerm(null)}
          title={selectedPerm.permissionName}
          subtitle={`${selectedPerm.module} module • ${selectedPerm.actions}`}
          severity={selectedPerm.isSystem ? "info" : "warning"}
          children={
            <div className="space-y-4">
              <div>
                <p className="mb-2 text-[9px] font-semibold uppercase tracking-[0.2em] text-white/45">Type</p>
                <VerificationChip tone={selectedPerm.isSystem ? "teal" : "amber"}>
                  {selectedPerm.isSystem ? "SYSTEM" : "CUSTOM"}
                </VerificationChip>
              </div>
              <div>
                <p className="mb-2 text-[9px] font-semibold uppercase tracking-[0.2em] text-white/45">Module</p>
                <VerificationChip tone={getTone(selectedPerm.module)}>
                  {selectedPerm.module}
                </VerificationChip>
              </div>
              <div>
                <p className="mb-2 text-[9px] font-semibold uppercase tracking-[0.2em] text-white/45">Actions</p>
                <VerificationChip tone={getActionTone(selectedPerm.actions)}>
                  {selectedPerm.actions}
                </VerificationChip>
              </div>
              <div className="rounded-xl border border-white/8 bg-white/[0.03] p-3">
                <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/45">Assigned to {selectedPerm.assignedRoles} Role{selectedPerm.assignedRoles !== 1 ? "s" : ""}</p>
                <div className="mt-2 space-y-1 text-[12px] text-white/75">
                  <div>• Super Admin</div>
                  <div>• Admin{selectedPerm.assignedRoles > 1 ? "" : ""}</div>
                  {selectedPerm.assignedRoles > 1 && <div>• Moderator</div>}
                </div>
              </div>
              <div className="border-t border-white/8 pt-3">
                <p className="mb-2 text-[9px] font-semibold uppercase tracking-[0.2em] text-white/45">Override History</p>
                <div className="space-y-1 text-[12px] text-white/75">
                  <div>Last modified: 2026-04-05 by rafi@ehb.tech</div>
                  <div>Previous: READ only</div>
                </div>
              </div>
            </div>
          }
          footer={
            <div className="flex gap-2">
              <button className="flex-1 rounded-lg border border-[#A098F8]/30 bg-[#7B6EF6]/15 px-3 py-2 text-[11px] font-semibold text-[#A098F8] hover:bg-[#7B6EF6]/25 transition">
                Edit Permission
              </button>
              <button className="flex-1 rounded-lg border border-[#2BBFA0]/30 bg-[#2BBFA0]/10 px-3 py-2 text-[11px] font-semibold text-[#2BBFA0] hover:bg-[#2BBFA0]/20 transition">
                View Audit Log
              </button>
            </div>
          }
        />
      )}
    </div>
  );
}
