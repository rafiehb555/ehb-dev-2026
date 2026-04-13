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

type QueueModule =
  | "STL"
  | "PSS"
  | "CRB"
  | "WALLET"
  | "FRANCHISE"
  | "COMPLAINTS";
type QueuePriority = "HIGH" | "NORMAL" | "LOW";

type QueueRow = {
  id: string;
  queueName: string;
  module: QueueModule;
  itemCount: number;
  avgWaitMins: number;
  priority: QueuePriority;
  assignedTeam: string;
};

const DEMO_QUEUES: QueueRow[] = [
  {
    id: "Q001",
    queueName: "STL Recalculation",
    module: "STL",
    itemCount: 12,
    avgWaitMins: 45,
    priority: "HIGH",
    assignedTeam: "Verification Core",
  },
  {
    id: "Q002",
    queueName: "CRB Certification Reviews",
    module: "CRB",
    itemCount: 8,
    avgWaitMins: 120,
    priority: "HIGH",
    assignedTeam: "Certification Board",
  },
  {
    id: "Q003",
    queueName: "PSS KYC Verification",
    module: "PSS",
    itemCount: 23,
    avgWaitMins: 90,
    priority: "NORMAL",
    assignedTeam: "Security & Compliance",
  },
  {
    id: "Q004",
    queueName: "Wallet Settlement",
    module: "WALLET",
    itemCount: 5,
    avgWaitMins: 15,
    priority: "NORMAL",
    assignedTeam: "Finance",
  },
  {
    id: "Q005",
    queueName: "Franchise Onboarding",
    module: "FRANCHISE",
    itemCount: 3,
    avgWaitMins: 180,
    priority: "NORMAL",
    assignedTeam: "Franchise Ops",
  },
  {
    id: "Q006",
    queueName: "Complaint Resolution",
    module: "COMPLAINTS",
    itemCount: 16,
    avgWaitMins: 240,
    priority: "LOW",
    assignedTeam: "Customer Care",
  },
  {
    id: "Q007",
    queueName: "STL Escalations",
    module: "STL",
    itemCount: 2,
    avgWaitMins: 30,
    priority: "HIGH",
    assignedTeam: "Verification Core",
  },
  {
    id: "Q008",
    queueName: "PSS Liveness Recheck",
    module: "PSS",
    itemCount: 7,
    avgWaitMins: 60,
    priority: "NORMAL",
    assignedTeam: "Security & Compliance",
  },
];

function moduleTone(module: QueueModule): VerificationTone {
  const tones: Record<QueueModule, VerificationTone> = {
    STL: "purple",
    PSS: "teal",
    CRB: "amber",
    WALLET: "green",
    FRANCHISE: "cyan",
    COMPLAINTS: "red",
  };
  return tones[module];
}

function priorityTone(priority: QueuePriority): VerificationTone {
  if (priority === "HIGH") return "red";
  if (priority === "NORMAL") return "amber";
  return "green";
}

export default function TaskQueuesPage() {
  const [selectedQueue, setSelectedQueue] = useState<QueueRow | null>(null);

  const stats = useMemo(() => {
    return {
      queues: 8,
      items: 67,
      avgWait: 1.4,
      overdue: 5,
    };
  }, []);

  const columns: RowColumn<QueueRow>[] = [
    {
      key: "queueName",
      header: "Queue Name",
      width: "minmax(0, 2fr)",
      render: (rec) => (
        <span className="text-[12px] text-white/80">
          {rec.queueName}
        </span>
      ),
    },
    {
      key: "module",
      header: "Module",
      width: "minmax(0, 1fr)",
      render: (rec) => (
        <VerificationChip tone={moduleTone(rec.module)}>
          {rec.module}
        </VerificationChip>
      ),
    },
    {
      key: "itemCount",
      header: "Items",
      width: "minmax(0, 0.8fr)",
      align: "right",
      render: (rec) => (
        <span className="text-[12px] font-semibold text-white/80">
          {rec.itemCount}
        </span>
      ),
    },
    {
      key: "avgWaitMins",
      header: "Avg Wait (min)",
      width: "minmax(0, 1.2fr)",
      align: "right",
      render: (rec) => (
        <span className="text-[12px] text-white/80">
          {rec.avgWaitMins}m
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
      key: "assignedTeam",
      header: "Assigned Team",
      width: "minmax(0, 1.5fr)",
      render: (rec) => (
        <span className="text-[12px] text-white/50">
          {rec.assignedTeam}
        </span>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[#0C0E1A] p-8">
      <div className="mb-8">
        <SectionHeader
          title="Task Queues"
          hint="Monitor departmental task queues, workload distribution, and processing times"
          eyebrow="DMO / Task System"
        />
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <VerificationStatCard
          tone="purple"
          label="Queues"
          value="8"
          sub="Active task queues"
          icon={
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          }
        />

        <VerificationStatCard
          tone="teal"
          label="Items"
          value="67"
          sub="Pending processing"
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
          tone="amber"
          label="Avg Wait"
          value="1.4h"
          sub="Hours"
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
          label="Overdue"
          value="5"
          sub="Exceeding SLA"
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
      </div>

      <div className="mb-6 rounded-2xl border border-white/10 bg-[#13162A]/70 p-5">
        <SectionHeader
          title="Queue Details"
          hint="Click a queue to view detailed information and team assignment"
        />
        <VerificationRowGrid<QueueRow>
          rows={DEMO_QUEUES}
          columns={columns}
          onRowClick={setSelectedQueue}
          emptyTitle="No queues found"
          emptyHint="All queues are healthy"
        />
      </div>

      {selectedQueue && (
        <VerificationDrawer
          open={!!selectedQueue}
          onClose={() => setSelectedQueue(null)}
          title={selectedQueue.queueName}
          subtitle={`${selectedQueue.module} • Team: ${selectedQueue.assignedTeam}`}
          severity={
            selectedQueue.priority === "HIGH"
              ? "critical"
              : selectedQueue.priority === "NORMAL"
              ? "warning"
              : "info"
          }
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <InfoCell label="Queue ID" value={selectedQueue.id} mono />
              <InfoCell label="Items in Queue" value={<span className="text-lg font-bold">{selectedQueue.itemCount}</span>} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <InfoCell label="Average Wait Time" value={<span className="text-lg font-bold text-[#F0A030]">{selectedQueue.avgWaitMins}m</span>} />
              <InfoCell label="Priority" value={<VerificationChip tone={priorityTone(selectedQueue.priority)}>{selectedQueue.priority}</VerificationChip>} />
            </div>

            <InfoCell label="Module" value={<VerificationChip tone={moduleTone(selectedQueue.module)}>{selectedQueue.module}</VerificationChip>} />

            <InfoCell label="Assigned Team" value={selectedQueue.assignedTeam} />
          </div>
        </VerificationDrawer>
      )}
    </div>
  );
}
