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

type ActivityRecord = {
  id: string;
  actor: string;
  action: string;
  target: string;
  timestamp: string;
  module: "STL" | "CRB" | "PSS" | "WALLET" | "JPS" | "FRANCHISE" | "DMO" | "AI";
  severity: "critical" | "high" | "warning" | "info";
};

const DEMO_ACTIVITY: ActivityRecord[] = [
  {
    id: "act-342-01",
    actor: "user_pkg_089",
    action: "VERIFY_IDENTITY",
    target: "KYC#doc_5678",
    timestamp: "2026-04-12T22:15:33Z",
    module: "PSS",
    severity: "info",
  },
  {
    id: "act-342-02",
    actor: "crb_system",
    action: "ISSUE_CERTIFICATE",
    target: "CRB#cert_1234",
    timestamp: "2026-04-12T21:47:22Z",
    module: "CRB",
    severity: "info",
  },
  {
    id: "act-342-03",
    actor: "user_stl_045",
    action: "REQUEST_UPGRADE",
    target: "STL#level_request_892",
    timestamp: "2026-04-12T21:12:18Z",
    module: "STL",
    severity: "warning",
  },
  {
    id: "act-342-04",
    actor: "wallet_system",
    action: "PROCESS_ESCROW",
    target: "Wallet#escrow_9821",
    timestamp: "2026-04-12T20:34:55Z",
    module: "WALLET",
    severity: "high",
  },
  {
    id: "act-342-05",
    actor: "dmo_admin",
    action: "UPDATE_POLICY",
    target: "DMO#policy_456",
    timestamp: "2026-04-12T20:01:44Z",
    module: "DMO",
    severity: "critical",
  },
  {
    id: "act-342-06",
    actor: "jps_matcher",
    action: "MATCH_SKILLS",
    target: "JPS#match_7821",
    timestamp: "2026-04-12T19:28:12Z",
    module: "JPS",
    severity: "info",
  },
  {
    id: "act-342-07",
    actor: "user_franchise_033",
    action: "RENEW_FRANCHISE",
    target: "Franchise#sub_2847",
    timestamp: "2026-04-12T18:55:40Z",
    module: "FRANCHISE",
    severity: "warning",
  },
  {
    id: "act-342-08",
    actor: "ai_recommendation",
    action: "GENERATE_SUGGESTION",
    target: "AI#suggest_5621",
    timestamp: "2026-04-12T18:22:18Z",
    module: "AI",
    severity: "info",
  },
  {
    id: "act-342-09",
    actor: "user_pkg_156",
    action: "SUBMIT_DISPUTE",
    target: "PSS#dispute_3421",
    timestamp: "2026-04-12T17:48:55Z",
    module: "PSS",
    severity: "high",
  },
  {
    id: "act-342-10",
    actor: "stl_auditor",
    action: "AUDIT_LEVEL",
    target: "STL#audit_7234",
    timestamp: "2026-04-12T17:15:33Z",
    module: "STL",
    severity: "info",
  },
];

function InfoCell({
  label,
  value,
  mono,
}: {
  label: string;
  value: React.ReactNode;
  mono?: boolean;
}) {
  return (
    <div className="rounded-xl border border-white/8 bg-white/[0.03] p-3">
      <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/45">
        {label}
      </p>
      <p className={`mt-1 text-sm text-white/90 ${mono ? "font-mono" : ""}`}>
        {value}
      </p>
    </div>
  );
}

export default function Last24hPage() {
  const [selectedRecord, setSelectedRecord] = useState<ActivityRecord | null>(
    null
  );
  const [moduleFilter, setModuleFilter] = useState<string>("ALL");

  const visibleRecords = useMemo(() => {
    if (moduleFilter === "ALL") return DEMO_ACTIVITY;
    return DEMO_ACTIVITY.filter((rec) => rec.module === moduleFilter);
  }, [moduleFilter]);

  const moduleOptions = [
    { value: "ALL", label: "All Modules" },
    { value: "STL", label: "STL" },
    { value: "CRB", label: "CRB" },
    { value: "PSS", label: "PSS" },
    { value: "WALLET", label: "Wallet" },
    { value: "JPS", label: "JPS" },
    { value: "FRANCHISE", label: "Franchise" },
    { value: "DMO", label: "DMO" },
    { value: "AI", label: "AI" },
  ];

  const getSeverityTone = (severity: string): VerificationTone => {
    switch (severity) {
      case "critical":
        return "red";
      case "high":
        return "amber";
      case "warning":
        return "cyan";
      default:
        return "green";
    }
  };

  const columns: RowColumn<ActivityRecord>[] = [
    {
      key: "timestamp",
      header: "Timestamp",
      width: "minmax(0, 1.2fr)",
      render: (rec) => {
        const dt = new Date(rec.timestamp);
        return (
          <div className="text-xs">
            <div>{dt.toLocaleDateString()}</div>
            <div className="text-white/50">
              {dt.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: true,
              })}
            </div>
          </div>
        );
      },
    },
    {
      key: "actor",
      header: "Actor",
      width: "minmax(0, 1.1fr)",
      render: (rec) => <span className="text-xs">{rec.actor}</span>,
    },
    {
      key: "action",
      header: "Action",
      width: "minmax(0, 1.2fr)",
      render: (rec) => (
        <span className="text-white/85 text-xs">{rec.action}</span>
      ),
    },
    {
      key: "target",
      header: "Target",
      width: "minmax(0, 1.1fr)",
      render: (rec) => (
        <span className="font-mono text-xs text-[#A098F8]">{rec.target}</span>
      ),
    },
    {
      key: "module",
      header: "Module",
      width: "minmax(0, 0.8fr)",
      render: (rec) => (
        <VerificationChip tone="purple">{rec.module}</VerificationChip>
      ),
    },
    {
      key: "severity",
      header: "Severity",
      width: "minmax(0, 0.9fr)",
      render: (rec) => (
        <VerificationChip tone={getSeverityTone(rec.severity)}>
          {rec.severity.toUpperCase()}
        </VerificationChip>
      ),
    },
  ];

  return (
    <div className="space-y-6 bg-[#0C0E1A] min-h-screen p-8">
      <div className="relative overflow-hidden rounded-2xl border border-[#A098F8]/30 bg-gradient-to-br from-[#13162A] via-[#1A1D33] to-[#13162A] p-6 pt-[22px]">
        <div className="absolute top-0 left-0 h-px bg-gradient-to-r from-[#7B6EF6] to-transparent w-1/3" />
        <div className="absolute top-3 left-4 text-[#7B6EF6] text-lg">⌈</div>
        <div className="absolute bottom-3 right-4 text-[#7B6EF6] text-lg">⌋</div>
        <div className="absolute inset-0 bg-gradient-to-br from-[#A098F8]/5 via-transparent to-transparent blur-2xl pointer-events-none" />

        <div className="relative">
          <p className="text-xs font-semibold tracking-widest text-white/50 mb-2">
            DMO / ACTIVITY ENGINE
          </p>
          <h1 className="text-3xl font-bold text-white mb-2">Last 24h Activity</h1>
          <p className="text-sm text-white/60">
            Real-time platform activity across all modules
          </p>
        </div>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <VerificationStatCard
          tone="purple"
          label="Events"
          value="342"
          sub="Last 24 hours"
          icon={
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
          }
        />

        <VerificationStatCard
          tone="teal"
          label="Unique Users"
          value="89"
          sub="Active users"
          icon={
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          }
        />

        <VerificationStatCard
          tone="amber"
          label="Peak Time"
          value="2pm"
          sub="Highest activity"
          icon={
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          }
        />

        <VerificationStatCard
          tone="red"
          label="Alerts"
          value="7"
          sub="Requires attention"
          icon={
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3.05h16.94a2 2 0 0 0 1.71-3.05L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          }
        />
      </section>

      <section className="rounded-2xl border border-white/10 bg-[#13162A]/70 p-5">
        <div className="mb-4">
          <SectionHeader
            title="Filter by Module"
            hint="Select module to refine activity results"
          />
        </div>
        <FilterChipRow<string>
          value={moduleFilter}
          options={moduleOptions}
          onChange={setModuleFilter}
        />
      </section>

      <section className="rounded-2xl border border-white/10 bg-[#13162A]/70 p-5">
        <SectionHeader
          title={`Activity Records (${visibleRecords.length} of 10)`}
          hint="Click a row to view activity details"
        />
        <VerificationRowGrid<ActivityRecord>
          rows={visibleRecords}
          columns={columns}
          onRowClick={setSelectedRecord}
          emptyTitle="No activities found"
          emptyHint="Try adjusting your filter"
        />
      </section>

      {selectedRecord && (
        <VerificationDrawer
          open={!!selectedRecord}
          onClose={() => setSelectedRecord(null)}
          title={selectedRecord.action}
          subtitle={new Date(selectedRecord.timestamp).toLocaleString()}
          severity={selectedRecord.severity}
        >
          <div className="space-y-4">
            <InfoCell label="Actor" value={selectedRecord.actor} />
            <InfoCell label="Action" value={selectedRecord.action} />
            <InfoCell label="Target" value={selectedRecord.target} mono />
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/45 mb-2">
                Module
              </p>
              <VerificationChip tone="purple">
                {selectedRecord.module}
              </VerificationChip>
            </div>
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/45 mb-2">
                Severity
              </p>
              <VerificationChip tone={getSeverityTone(selectedRecord.severity)}>
                {selectedRecord.severity.toUpperCase()}
              </VerificationChip>
            </div>
            <InfoCell
              label="Timestamp"
              value={selectedRecord.timestamp}
              mono
            />
          </div>
        </VerificationDrawer>
      )}
    </div>
  );
}
