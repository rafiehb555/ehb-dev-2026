"use client";

import { useState, useMemo } from "react";
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

function InfoCell({ label, value, mono }: { label: string; value: React.ReactNode; mono?: boolean }) {
  return (
    <div className="rounded-xl border border-white/8 bg-white/[0.03] p-3">
      <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/45">{label}</p>
      <p className={`mt-1 text-sm text-white/90 ${mono ? "font-mono" : ""}`}>{value}</p>
    </div>
  );
}

type RoutingRule = {
  id: string;
  ruleName: string;
  triggerCondition: string;
  targetQueue: string;
  priority: "HIGH" | "NORMAL" | "LOW";
  isActive: boolean;
  lastTriggeredAt: string;
  hitCount: number;
};

const DEMO_RULES: RoutingRule[] = [
  {
    id: "R001",
    ruleName: "STL Critical Updates",
    triggerCondition: "level_change > 3 AND stl >= 7",
    targetQueue: "STL Escalations",
    priority: "HIGH",
    isActive: true,
    lastTriggeredAt: "2026-04-12T16:15:00Z",
    hitCount: 145,
  },
  {
    id: "R002",
    ruleName: "PSS Liveness Failures",
    triggerCondition: "liveness_check = FAILED AND retry_count < 3",
    targetQueue: "PSS Liveness Recheck",
    priority: "HIGH",
    isActive: true,
    lastTriggeredAt: "2026-04-12T15:45:00Z",
    hitCount: 87,
  },
  {
    id: "R003",
    ruleName: "CRB Exam Schedules",
    triggerCondition: "exam_type = CERTIFICATION AND status = PENDING",
    targetQueue: "CRB Certification Reviews",
    priority: "NORMAL",
    isActive: true,
    lastTriggeredAt: "2026-04-12T14:20:00Z",
    hitCount: 234,
  },
  {
    id: "R004",
    ruleName: "Wallet High Value Txn",
    triggerCondition: "amount > 50000 PKR AND status = PENDING",
    targetQueue: "Wallet Settlement",
    priority: "HIGH",
    isActive: true,
    lastTriggeredAt: "2026-04-12T16:00:00Z",
    hitCount: 56,
  },
  {
    id: "R005",
    ruleName: "Franchise Onboarding Auto",
    triggerCondition: "application_complete = TRUE AND payment_verified = TRUE",
    targetQueue: "Franchise Onboarding",
    priority: "NORMAL",
    isActive: false,
    lastTriggeredAt: "2026-04-11T10:30:00Z",
    hitCount: 12,
  },
  {
    id: "R006",
    ruleName: "Complaint Priority Route",
    triggerCondition: "complaint_category = FRAUD AND urgency = HIGH",
    targetQueue: "Complaint Resolution",
    priority: "HIGH",
    isActive: true,
    lastTriggeredAt: "2026-04-12T15:50:00Z",
    hitCount: 34,
  },
  {
    id: "R007",
    ruleName: "STL Score Degradation",
    triggerCondition: "score_change < -10 AND level_drop = TRUE",
    targetQueue: "STL Recalculation",
    priority: "NORMAL",
    isActive: true,
    lastTriggeredAt: "2026-04-12T16:10:00Z",
    hitCount: 23,
  },
  {
    id: "R008",
    ruleName: "PSS Document Rejection",
    triggerCondition: "document_status = REJECTED AND resubmit_count < 2",
    targetQueue: "PSS KYC Verification",
    priority: "NORMAL",
    isActive: true,
    lastTriggeredAt: "2026-04-12T14:55:00Z",
    hitCount: 67,
  },
];

function priorityTone(priority: "HIGH" | "NORMAL" | "LOW"): VerificationTone {
  if (priority === "HIGH") return "red";
  if (priority === "NORMAL") return "amber";
  return "green";
}

export default function RoutingRulesPage() {
  const [selectedRule, setSelectedRule] = useState<RoutingRule | null>(null);

  const stats = useMemo(() => {
    return {
      rules: 12,
      triggered: 45,
      success: 94,
      overrides: 3,
    };
  }, []);

  const columns: RowColumn<RoutingRule>[] = [
    {
      key: "ruleName",
      header: "Rule Name",
      width: "minmax(0, 2fr)",
      render: (rec) => (
        <span className="text-[12px] text-white/80">
          {rec.ruleName}
        </span>
      ),
    },
    {
      key: "triggerCondition",
      header: "Trigger Condition",
      width: "minmax(0, 2.5fr)",
      render: (rec) => (
        <span className="font-mono text-[11px] text-[#A098F8] truncate">
          {rec.triggerCondition}
        </span>
      ),
    },
    {
      key: "targetQueue",
      header: "Target Queue",
      width: "minmax(0, 1.8fr)",
      render: (rec) => (
        <span className="text-[12px] text-white/50">
          {rec.targetQueue}
        </span>
      ),
    },
    {
      key: "priority",
      header: "Priority",
      width: "minmax(0, 1fr)",
      render: (rec) => (
        <VerificationChip tone={priorityTone(rec.priority)}>
          {rec.priority}
        </VerificationChip>
      ),
    },
    {
      key: "isActive",
      header: "Status",
      width: "minmax(0, 1fr)",
      render: (rec) => (
        <VerificationChip tone={rec.isActive ? "green" : "red"}>
          {rec.isActive ? "ACTIVE" : "DISABLED"}
        </VerificationChip>
      ),
    },
    {
      key: "hitCount",
      header: "Hits",
      width: "minmax(0, 0.8fr)",
      align: "right",
      render: (rec) => (
        <span className="text-[12px] font-semibold text-white/80">
          {rec.hitCount}
        </span>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[#0C0E1A] p-8">
      <div className="mb-8">
        <SectionHeader
          title="Auto Task Routing Rules"
          hint="Automatic task assignment based on trigger conditions with execution tracking"
          eyebrow="DMO / Task System"
        />
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <VerificationStatCard
          tone="purple"
          label="Rules"
          value="12"
          sub="Active routing rules"
          icon={
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          }
        />

        <VerificationStatCard
          tone="teal"
          label="Triggered Today"
          value="45"
          sub="Rule executions"
          icon={
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 19l9-7a9 9 0 00-18 0l9 7z" />
            </svg>
          }
        />

        <VerificationStatCard
          tone="green"
          label="Success Rate"
          value="94%"
          sub="Routing accuracy"
          icon={
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />

        <VerificationStatCard
          tone="amber"
          label="Disabled"
          value="3"
          sub="Overrides in place"
          icon={
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          }
        />
      </div>

      <div className="mb-6 rounded-2xl border border-white/10 bg-[#13162A]/70 p-5">
        <SectionHeader
          title="Routing Rules"
          hint="Click a rule to view trigger conditions and execution history"
        />
        <VerificationRowGrid<RoutingRule>
          rows={DEMO_RULES}
          columns={columns}
          onRowClick={setSelectedRule}
          emptyTitle="No routing rules found"
          emptyHint="All rules are healthy"
        />
      </div>

      {selectedRule && (
        <VerificationDrawer
          open={!!selectedRule}
          onClose={() => setSelectedRule(null)}
          title={selectedRule.ruleName}
          subtitle={`Target: ${selectedRule.targetQueue} • Hits: ${selectedRule.hitCount}`}
          severity={
            selectedRule.priority === "HIGH"
              ? "critical"
              : selectedRule.priority === "NORMAL"
              ? "warning"
              : "info"
          }
        >
          <div className="space-y-4">
            <InfoCell label="Rule ID" value={selectedRule.id} mono />

            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/45 mb-2">Trigger Condition</p>
              <div className="rounded-lg border border-white/10 bg-[#1A1D33] p-2 font-mono text-[12px] text-[#A098F8] break-words">
                {selectedRule.triggerCondition}
              </div>
            </div>

            <InfoCell label="Target Queue" value={selectedRule.targetQueue} />

            <div className="grid grid-cols-3 gap-3">
              <InfoCell label="Priority" value={<VerificationChip tone={priorityTone(selectedRule.priority)}>{selectedRule.priority}</VerificationChip>} />
              <InfoCell label="Status" value={<VerificationChip tone={selectedRule.isActive ? "green" : "red"}>{selectedRule.isActive ? "ACTIVE" : "DISABLED"}</VerificationChip>} />
              <InfoCell label="Hit Count" value={<span className="text-lg font-bold">{selectedRule.hitCount}</span>} />
            </div>

            <InfoCell label="Last Triggered" value={new Date(selectedRule.lastTriggeredAt).toLocaleString()} />
          </div>
        </VerificationDrawer>
      )}
    </div>
  );
}
