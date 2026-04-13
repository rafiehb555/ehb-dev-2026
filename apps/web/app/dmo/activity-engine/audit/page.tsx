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

type AuditRecord = {
  id: string;
  timestamp: string;
  actor: string;
  actorType: "USER" | "SYSTEM" | "AI" | "CRON";
  action: string;
  resource: string;
  ipAddress: string;
  result: "SUCCESS" | "FAILURE" | "BLOCKED";
};

const DEMO_AUDIT_RECORDS: AuditRecord[] = [
  {
    id: "audit-12480",
    timestamp: "2026-04-12T18:52:14Z",
    actor: "user_pkg_002",
    actorType: "USER",
    action: "UPDATE_PROFILE",
    resource: "User#user_pkg_002",
    ipAddress: "192.168.1.45",
    result: "SUCCESS",
  },
  {
    id: "audit-12479",
    timestamp: "2026-04-12T18:45:33Z",
    actor: "sys_audit",
    actorType: "SYSTEM",
    action: "BULK_VERIFY",
    resource: "STL#bulk_verify_3021",
    ipAddress: "127.0.0.1",
    result: "SUCCESS",
  },
  {
    id: "audit-12478",
    timestamp: "2026-04-12T18:32:15Z",
    actor: "ai_fraud_detect",
    actorType: "AI",
    action: "FLAG_TRANSACTION",
    resource: "Transaction#TXN-8547",
    ipAddress: "10.0.0.88",
    result: "SUCCESS",
  },
  {
    id: "audit-12477",
    timestamp: "2026-04-12T18:19:48Z",
    actor: "user_crb_001",
    actorType: "USER",
    action: "SUBMIT_DOCUMENT",
    resource: "CRB#doc_2847",
    ipAddress: "203.45.67.89",
    result: "SUCCESS",
  },
  {
    id: "audit-12476",
    timestamp: "2026-04-12T18:01:22Z",
    actor: "wallet_system",
    actorType: "SYSTEM",
    action: "PROCESS_PAYMENT",
    resource: "Wallet#escrow_5621",
    ipAddress: "127.0.0.1",
    result: "SUCCESS",
  },
  {
    id: "audit-12475",
    timestamp: "2026-04-12T17:44:10Z",
    actor: "dmo_approver",
    actorType: "USER",
    action: "APPROVE_UPGRADE",
    resource: "Franchise#PKG-4521",
    ipAddress: "198.76.54.23",
    result: "SUCCESS",
  },
  {
    id: "audit-12474",
    timestamp: "2026-04-12T17:22:56Z",
    actor: "support_team",
    actorType: "USER",
    action: "ESCALATE_COMPLAINT",
    resource: "Support#SUP-9284",
    ipAddress: "172.16.0.45",
    result: "BLOCKED",
  },
  {
    id: "audit-12473",
    timestamp: "2026-04-12T16:58:40Z",
    actor: "user_wallet_089",
    actorType: "USER",
    action: "TOPUP_BALANCE",
    resource: "Wallet#wallet_089",
    ipAddress: "210.98.76.34",
    result: "SUCCESS",
  },
  {
    id: "audit-12472",
    timestamp: "2026-04-12T16:31:05Z",
    actor: "cron_stl_audit",
    actorType: "CRON",
    action: "SCHEDULED_AUDIT",
    resource: "STL#schedule_3021",
    ipAddress: "127.0.0.1",
    result: "SUCCESS",
  },
  {
    id: "audit-12471",
    timestamp: "2026-04-12T15:47:33Z",
    actor: "crb_officer",
    actorType: "USER",
    action: "CERTIFY_BATCH",
    resource: "CRB#batch_2848",
    ipAddress: "185.23.45.67",
    result: "FAILURE",
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

export default function AuditLogPage() {
  const [selectedRecord, setSelectedRecord] = useState<AuditRecord | null>(null);
  const [actorTypeFilter, setActorTypeFilter] = useState<string>("ALL");

  const visibleRecords = useMemo(() => {
    if (actorTypeFilter === "ALL") return DEMO_AUDIT_RECORDS;
    return DEMO_AUDIT_RECORDS.filter((rec) => rec.actorType === actorTypeFilter);
  }, [actorTypeFilter]);

  const stats = useMemo(() => {
    return {
      total: 12480,
      system: 4200,
      user: 8280,
      flagged: 45,
    };
  }, []);

  const actorTypeOptions = [
    { value: "ALL", label: "All Actors" },
    { value: "USER", label: "Users" },
    { value: "SYSTEM", label: "System" },
    { value: "AI", label: "AI" },
    { value: "CRON", label: "Scheduled" },
  ];

  const getTone = (result: string): VerificationTone => {
    switch (result) {
      case "BLOCKED":
        return "red";
      case "FAILURE":
        return "amber";
      case "SUCCESS":
        return "green";
      default:
        return "teal";
    }
  };

  const columns: RowColumn<AuditRecord>[] = [
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
      render: (rec) => <span>{rec.actor}</span>,
    },
    {
      key: "actorType",
      header: "Type",
      width: "minmax(0, 0.8fr)",
      render: (rec) => (
        <VerificationChip tone="purple">{rec.actorType}</VerificationChip>
      ),
    },
    {
      key: "action",
      header: "Action",
      width: "minmax(0, 1.3fr)",
      render: (rec) => (
        <span className="text-white/85 text-xs">{rec.action}</span>
      ),
    },
    {
      key: "resource",
      header: "Resource",
      width: "minmax(0, 1.2fr)",
      render: (rec) => (
        <span className="font-mono text-xs text-[#A098F8]">{rec.resource}</span>
      ),
    },
    {
      key: "result",
      header: "Result",
      width: "minmax(0, 0.9fr)",
      render: (rec) => (
        <VerificationChip tone={getTone(rec.result)}>
          {rec.result}
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
          <h1 className="text-3xl font-bold text-white mb-2">Audit Log</h1>
          <p className="text-sm text-white/60">
            Complete audit trail for compliance and forensics
          </p>
        </div>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <VerificationStatCard
          tone="purple"
          label="Total Records"
          value="12480"
          sub="All-time audit entries"
          icon={
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="12" y1="19" x2="12" y2="11" />
              <line x1="9" y1="14" x2="15" y2="14" />
            </svg>
          }
        />

        <VerificationStatCard
          tone="teal"
          label="System Actions"
          value="4200"
          sub="Automated + scheduled"
          icon={
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="1" />
              <path d="M12 1v6M12 17v6M4.22 4.22l4.24 4.24M15.54 15.54l4.24 4.24M1 12h6M17 12h6M4.22 19.78l4.24-4.24M15.54 8.46l4.24-4.24" />
            </svg>
          }
        />

        <VerificationStatCard
          tone="amber"
          label="User Actions"
          value="8280"
          sub="Manual operations"
          icon={
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          }
        />

        <VerificationStatCard
          tone="red"
          label="Flagged"
          value="45"
          sub="Blocked or failed"
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
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          }
        />
      </section>

      <section className="rounded-2xl border border-white/10 bg-[#13162A]/70 p-5">
        <div className="mb-4">
          <SectionHeader
            title="Filter by Actor Type"
            hint="Select actor type to refine audit results"
          />
        </div>
        <FilterChipRow<string>
          value={actorTypeFilter}
          options={actorTypeOptions}
          onChange={setActorTypeFilter}
        />
      </section>

      <section className="rounded-2xl border border-white/10 bg-[#13162A]/70 p-5">
        <SectionHeader
          title={`Audit Records (${visibleRecords.length} of 10)`}
          hint="Click a row to view complete audit details"
        />
        <VerificationRowGrid<AuditRecord>
          rows={visibleRecords}
          columns={columns}
          onRowClick={setSelectedRecord}
          emptyTitle="No records found"
          emptyHint="Try adjusting your filter"
        />
      </section>

      {selectedRecord && (
        <VerificationDrawer
          open={!!selectedRecord}
          onClose={() => setSelectedRecord(null)}
          title={`Audit Record #${selectedRecord.id}`}
          subtitle={new Date(selectedRecord.timestamp).toLocaleString()}
          severity={
            selectedRecord.result === "BLOCKED"
              ? "critical"
              : selectedRecord.result === "FAILURE"
              ? "warning"
              : "info"
          }
        >
          <div className="space-y-4">
            <InfoCell label="Timestamp" value={selectedRecord.timestamp} mono />
            <InfoCell label="Actor" value={selectedRecord.actor} />
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/45 mb-2">
                Actor Type
              </p>
              <VerificationChip tone="purple">
                {selectedRecord.actorType}
              </VerificationChip>
            </div>
            <InfoCell label="Action" value={selectedRecord.action} />
            <InfoCell
              label="Resource"
              value={selectedRecord.resource}
              mono
            />
            <InfoCell label="IP Address" value={selectedRecord.ipAddress} mono />
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/45 mb-2">
                Result
              </p>
              <VerificationChip tone={getTone(selectedRecord.result)}>
                {selectedRecord.result}
              </VerificationChip>
            </div>
          </div>
        </VerificationDrawer>
      )}
    </div>
  );
}
