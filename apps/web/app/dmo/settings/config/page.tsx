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

type Config = {
  id: string;
  configKey: string;
  value: string;
  category: "GENERAL" | "SECURITY" | "PERFORMANCE" | "FEATURE_FLAG";
  lastModifiedAt: string;
  modifiedBy: string;
};

const DEMO_CONFIG: Config[] = [
  {
    id: "cfg-001",
    configKey: "MAX_LOGIN_ATTEMPTS",
    value: "5",
    category: "SECURITY",
    lastModifiedAt: "2026-03-15T10:22:30Z",
    modifiedBy: "rafi@ehb.tech",
  },
  {
    id: "cfg-002",
    configKey: "SESSION_TIMEOUT_MINUTES",
    value: "30",
    category: "SECURITY",
    lastModifiedAt: "2026-02-28T14:45:00Z",
    modifiedBy: "admin@ehb.tech",
  },
  {
    id: "cfg-003",
    configKey: "API_RATE_LIMIT",
    value: "10000",
    category: "PERFORMANCE",
    lastModifiedAt: "2026-04-10T09:15:22Z",
    modifiedBy: "rafi@ehb.tech",
  },
  {
    id: "cfg-004",
    configKey: "CACHE_TTL_SECONDS",
    value: "3600",
    category: "PERFORMANCE",
    lastModifiedAt: "2026-03-20T16:30:15Z",
    modifiedBy: "dev-team@ehb.tech",
  },
  {
    id: "cfg-005",
    configKey: "ENABLE_2FA",
    value: "true",
    category: "SECURITY",
    lastModifiedAt: "2026-04-12T08:45:33Z",
    modifiedBy: "rafi@ehb.tech",
  },
  {
    id: "cfg-006",
    configKey: "FEATURE_BLOCKCHAIN_SYNC",
    value: "true",
    category: "FEATURE_FLAG",
    lastModifiedAt: "2026-04-12T12:20:10Z",
    modifiedBy: "admin@ehb.tech",
  },
  {
    id: "cfg-007",
    configKey: "FEATURE_AI_RECOMMENDATIONS",
    value: "true",
    category: "FEATURE_FLAG",
    lastModifiedAt: "2026-04-08T11:30:45Z",
    modifiedBy: "rafi@ehb.tech",
  },
  {
    id: "cfg-008",
    configKey: "MAX_UPLOAD_SIZE_MB",
    value: "100",
    category: "GENERAL",
    lastModifiedAt: "2026-03-10T13:15:22Z",
    modifiedBy: "dev-team@ehb.tech",
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

export default function SystemConfigPage() {
  const [selectedConfig, setSelectedConfig] = useState<Config | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");

  const visibleConfigs = useMemo(() => {
    if (categoryFilter === "ALL") return DEMO_CONFIG;
    return DEMO_CONFIG.filter((c) => c.category === categoryFilter);
  }, [categoryFilter]);

  const stats = useMemo(() => {
    const total = DEMO_CONFIG.length;
    const modifiedToday = DEMO_CONFIG.filter((c) => {
      const dt = new Date(c.lastModifiedAt);
      const now = new Date();
      return (
        dt.getFullYear() === now.getFullYear() &&
        dt.getMonth() === now.getMonth() &&
        dt.getDate() === now.getDate()
      );
    }).length;
    const featureFlags = DEMO_CONFIG.filter((c) => c.category === "FEATURE_FLAG").length;
    const env = "PRODUCTION";

    return { total, modifiedToday, featureFlags, env };
  }, []);

  const categoryOptions = [
    { value: "ALL", label: "All Categories" },
    { value: "GENERAL", label: "General" },
    { value: "SECURITY", label: "Security" },
    { value: "PERFORMANCE", label: "Performance" },
    { value: "FEATURE_FLAG", label: "Feature Flags" },
  ];

  const getTone = (category: string): VerificationTone => {
    switch (category) {
      case "SECURITY":
        return "red";
      case "PERFORMANCE":
        return "cyan";
      case "FEATURE_FLAG":
        return "purple";
      case "GENERAL":
        return "teal";
      default:
        return "teal";
    }
  };

  const columns: RowColumn<Config>[] = [
    {
      key: "configKey",
      header: "Config Key",
      width: "minmax(0, 1.4fr)",
      render: (c) => (
        <span className="font-mono font-semibold text-white/80">
          {c.configKey}
        </span>
      ),
    },
    {
      key: "value",
      header: "Value",
      width: "minmax(0, 1fr)",
      render: (c) => {
        const isBool = c.value === "true" || c.value === "false";
        return (
          <span
            className={`font-mono text-[11px] font-semibold ${
              isBool ? (c.value === "true" ? "text-[#38C878]" : "text-[#F05858]") : "text-[#A098F8]"
            }`}
          >
            {c.value}
          </span>
        );
      },
    },
    {
      key: "category",
      header: "Category",
      width: "minmax(0, 1.1fr)",
      render: (c) => <VerificationChip tone={getTone(c.category)}>{c.category}</VerificationChip>,
    },
    {
      key: "modifiedBy",
      header: "Modified By",
      width: "minmax(0, 1.1fr)",
      render: (c) => (
        <span className="text-[11px] text-white/53">{c.modifiedBy}</span>
      ),
    },
    {
      key: "lastModifiedAt",
      header: "Last Modified",
      width: "minmax(0, 1.1fr)",
      align: "right",
      render: (c) => {
        const dt = new Date(c.lastModifiedAt);
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
        title="Settings / System Config"
        hint="Platform settings and feature toggles"
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <VerificationStatCard
          tone="purple"
          label="Config Keys"
          value={stats.total.toString()}
          sub="Total settings"
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="1" />
              <path d="M12 1v6M12 17v6M4.22 4.22l4.24 4.24M15.54 15.54l4.24 4.24M1 12h6M17 12h6M4.22 19.78l4.24-4.24M15.54 8.46l4.24-4.24" />
            </svg>
          }
        />
        <VerificationStatCard
          tone="amber"
          label="Modified Today"
          value={stats.modifiedToday.toString()}
          sub="Recent changes"
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          }
        />
        <VerificationStatCard
          tone="teal"
          label="Feature Flags"
          value={stats.featureFlags.toString()}
          sub="Active toggles"
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12h18M3 6h18M3 18h18" />
            </svg>
          }
        />
        <VerificationStatCard
          tone="green"
          label="Environment"
          value={stats.env}
          sub="Current env"
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
              <path d="M12 6v6l4 2" />
            </svg>
          }
        />
      </div>

      <div className="rounded-2xl border border-white/10 bg-[#13162A]/70 p-5">
        <div className="mb-4">
          <SectionHeader title="Filter by Category" hint="Refine configurations by type" />
        </div>
        <FilterChipRow<string>
          value={categoryFilter}
          options={categoryOptions}
          onChange={setCategoryFilter}
        />
      </div>

      <div className="rounded-2xl border border-white/10 bg-[#13162A]/70 p-5">
        <SectionHeader
          title="Configuration"
          hint={`Showing ${visibleConfigs.length} of ${DEMO_CONFIG.length} settings`}
        />
        <VerificationRowGrid<Config>
          rows={visibleConfigs}
          columns={columns}
          onRowClick={setSelectedConfig}
          getRowTone={(c) => getTone(c.category)}
        />
      </div>

      {selectedConfig && (
        <VerificationDrawer
          open={!!selectedConfig}
          onClose={() => setSelectedConfig(null)}
          title={selectedConfig.configKey}
          subtitle={`${selectedConfig.category} • Modified by ${selectedConfig.modifiedBy}`}
          severity="info"
          children={
            <div className="space-y-4">
              <div>
                <p className="mb-2 text-[9px] font-semibold uppercase tracking-[0.2em] text-white/45">Category</p>
                <VerificationChip tone={getTone(selectedConfig.category)}>
                  {selectedConfig.category}
                </VerificationChip>
              </div>
              <div className="rounded-xl border border-white/8 bg-white/[0.03] p-3">
                <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/45">Current Value</p>
                <p className={`mt-1 font-mono text-sm font-semibold ${
                  selectedConfig.value === "true" ? "text-[#38C878]" : selectedConfig.value === "false" ? "text-[#F05858]" : "text-[#A098F8]"
                }`}>
                  {selectedConfig.value}
                </p>
              </div>
              <InfoCell label="Last Modified" value={new Date(selectedConfig.lastModifiedAt).toLocaleString()} mono />
              <InfoCell label="Modified By" value={selectedConfig.modifiedBy} mono />
              <div className="border-t border-white/8 pt-3">
                <p className="mb-2 text-[9px] font-semibold uppercase tracking-[0.2em] text-white/45">Change History</p>
                <div className="space-y-1 text-[12px] text-white/75">
                  <div>2026-04-12 08:45 • Changed to "{selectedConfig.value}" by {selectedConfig.modifiedBy}</div>
                  <div>2026-04-10 14:22 • Changed to "previous_value" by admin@ehb.tech</div>
                </div>
              </div>
            </div>
          }
          footer={
            <div className="flex gap-2">
              <button className="flex-1 rounded-lg border border-[#A098F8]/30 bg-[#7B6EF6]/15 px-3 py-2 text-[11px] font-semibold text-[#A098F8] hover:bg-[#7B6EF6]/25 transition">
                Edit Value
              </button>
              <button className="flex-1 rounded-lg border border-[#2BBFA0]/30 bg-[#2BBFA0]/10 px-3 py-2 text-[11px] font-semibold text-[#2BBFA0] hover:bg-[#2BBFA0]/20 transition">
                Audit Trail
              </button>
            </div>
          }
        />
      )}
    </div>
  );
}
