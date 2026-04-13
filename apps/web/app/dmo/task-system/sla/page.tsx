"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  VerificationStatCard,
  VerificationRowGrid,
  VerificationDrawer,
  VerificationChip,
  SectionHeader,
  SeverityMeter,
  FilterChipRow,
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

type SlaType = "RESPONSE" | "RESOLUTION" | "ESCALATION";
type SlaStatus = "ON_TRACK" | "AT_RISK" | "BREACHED";

type SlaRow = {
  id: string;
  taskId: string;
  slaType: SlaType;
  targetHrs: number;
  elapsedHrs: number;
  status: SlaStatus;
  module: string;
  assignee: string;
};

const DEMO_SLAS: SlaRow[] = [
  {
    id: "SLA001",
    taskId: "TASK-001",
    slaType: "RESPONSE",
    targetHrs: 2,
    elapsedHrs: 1.2,
    status: "ON_TRACK",
    module: "PSS",
    assignee: "Amina Khan",
  },
  {
    id: "SLA002",
    taskId: "TASK-002",
    slaType: "RESOLUTION",
    targetHrs: 24,
    elapsedHrs: 22.5,
    status: "AT_RISK",
    module: "CRB",
    assignee: "Hassan Ali",
  },
  {
    id: "SLA003",
    taskId: "TASK-003",
    slaType: "RESPONSE",
    targetHrs: 2,
    elapsedHrs: 2.8,
    status: "BREACHED",
    module: "STL",
    assignee: "Sara Ahmed",
  },
  {
    id: "SLA004",
    taskId: "TASK-004",
    slaType: "ESCALATION",
    targetHrs: 4,
    elapsedHrs: 3.1,
    status: "ON_TRACK",
    module: "COMPLAINTS",
    assignee: "Bilal Farooq",
  },
  {
    id: "SLA005",
    taskId: "TASK-005",
    slaType: "RESOLUTION",
    targetHrs: 24,
    elapsedHrs: 25.3,
    status: "BREACHED",
    module: "WALLET",
    assignee: "Fatima Malik",
  },
  {
    id: "SLA006",
    taskId: "TASK-006",
    slaType: "RESPONSE",
    targetHrs: 2,
    elapsedHrs: 0.8,
    status: "ON_TRACK",
    module: "FRANCHISE",
    assignee: "Omar Hassan",
  },
  {
    id: "SLA007",
    taskId: "TASK-007",
    slaType: "ESCALATION",
    targetHrs: 4,
    elapsedHrs: 3.8,
    status: "AT_RISK",
    module: "PSS",
    assignee: "Zara Noor",
  },
  {
    id: "SLA008",
    taskId: "TASK-008",
    slaType: "RESOLUTION",
    targetHrs: 24,
    elapsedHrs: 12.0,
    status: "ON_TRACK",
    module: "CRB",
    assignee: "Imran Aziz",
  },
];

function statusTone(status: SlaStatus): VerificationTone {
  if (status === "BREACHED") return "red";
  if (status === "AT_RISK") return "amber";
  return "green";
}

function slaTypeLabel(type: SlaType): string {
  const labels: Record<SlaType, string> = {
    RESPONSE: "Response",
    RESOLUTION: "Resolution",
    ESCALATION: "Escalation",
  };
  return labels[type];
}

export default function SlaTimersPage() {
  const [selectedSla, setSelectedSla] = useState<SlaRow | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("ALL");

  const filteredSlas = useMemo(() => {
    if (filterStatus === "ALL") return DEMO_SLAS;
    return DEMO_SLAS.filter((s) => s.status === filterStatus);
  }, [filterStatus]);

  const stats = useMemo(() => {
    return {
      active: 34,
      breached: 3,
      atRisk: 7,
      onTrack: 24,
    };
  }, []);

  const statusOptions = [
    { value: "ALL", label: "All Statuses" },
    { value: "ON_TRACK", label: "On Track" },
    { value: "AT_RISK", label: "At Risk" },
    { value: "BREACHED", label: "Breached" },
  ];

  const columns: RowColumn<SlaRow>[] = [
    {
      key: "taskId",
      header: "Task ID",
      width: "minmax(0, 1.2fr)",
      render: (rec) => (
        <span className="font-mono text-[12px] text-[#A098F8]">
          {rec.taskId}
        </span>
      ),
    },
    {
      key: "slaType",
      header: "SLA Type",
      width: "minmax(0, 1.2fr)",
      render: (rec) => (
        <VerificationChip tone="purple">
          {slaTypeLabel(rec.slaType)}
        </VerificationChip>
      ),
    },
    {
      key: "targetHrs",
      header: "Target (hrs)",
      width: "minmax(0, 1fr)",
      align: "right",
      render: (rec) => (
        <span className="text-[12px] text-white/80">
          {rec.targetHrs}h
        </span>
      ),
    },
    {
      key: "elapsedHrs",
      header: "Elapsed (hrs)",
      width: "minmax(0, 1fr)",
      align: "right",
      render: (rec) => (
        <span className="text-[12px] text-white/80">
          {rec.elapsedHrs}h
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      width: "minmax(0, 1.2fr)",
      render: (rec) => (
        <VerificationChip tone={statusTone(rec.status)}>
          {rec.status.replace(/_/g, " ")}
        </VerificationChip>
      ),
    },
    {
      key: "assignee",
      header: "Assignee",
      width: "minmax(0, 1.5fr)",
      render: (rec) => (
        <span className="text-[12px] text-white/50">
          {rec.assignee}
        </span>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[#0C0E1A] p-8">
      <div className="mb-8">
        <SectionHeader
          title="SLA Compliance Timers"
          hint="Monitor service level agreement compliance and breach escalation"
          eyebrow="DMO / Task System"
        />
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <VerificationStatCard
          tone="purple"
          label="Active SLAs"
          value="34"
          sub="Monitored tasks"
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
          tone="red"
          label="Breached"
          value="3"
          sub="SLA violations"
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

        <VerificationStatCard
          tone="amber"
          label="At Risk"
          value="7"
          sub="Near breach"
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

        <VerificationStatCard
          tone="green"
          label="On Track"
          value="24"
          sub="Healthy SLAs"
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
      </div>

      <div className="mb-6 rounded-2xl border border-white/10 bg-[#13162A]/70 p-5">
        <SectionHeader
          title="SLA Health Distribution"
          hint="Visual breakdown of SLA compliance status"
        />
        <SeverityMeter
          segments={[
            { label: "On Track", value: 24, tone: "green" },
            { label: "At Risk", value: 7, tone: "amber" },
            { label: "Breached", value: 3, tone: "red" },
          ]}
        />
      </div>

      <div className="mb-6 rounded-2xl border border-white/10 bg-[#13162A]/70 p-5">
        <div className="mb-4">
          <SectionHeader
            title="Filter by Status"
            hint="Select status to refine SLA list"
          />
        </div>
        <FilterChipRow<string>
          value={filterStatus}
          options={statusOptions}
          onChange={setFilterStatus}
        />
      </div>

      <div className="mb-6 rounded-2xl border border-white/10 bg-[#13162A]/70 p-5">
        <SectionHeader
          title={`SLA Records (${filteredSlas.length} of 8)`}
          hint="Click a row to view detailed SLA information"
        />
        <VerificationRowGrid<SlaRow>
          rows={filteredSlas}
          columns={columns}
          onRowClick={setSelectedSla}
          emptyTitle="No SLAs found"
          emptyHint="Try adjusting your filter"
        />
      </div>

      {selectedSla && (
        <VerificationDrawer
          open={!!selectedSla}
          onClose={() => setSelectedSla(null)}
          title={`SLA: ${selectedSla.taskId}`}
          subtitle={`${slaTypeLabel(selectedSla.slaType)} • ${selectedSla.elapsedHrs}h / ${selectedSla.targetHrs}h`}
          severity={
            selectedSla.status === "BREACHED"
              ? "critical"
              : selectedSla.status === "AT_RISK"
              ? "warning"
              : "info"
          }
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <InfoCell label="SLA Type" value={<VerificationChip tone="purple">{slaTypeLabel(selectedSla.slaType)}</VerificationChip>} />
              <InfoCell label="Module" value={selectedSla.module} />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <InfoCell label="Target (hrs)" value={<span className="text-lg font-bold">{selectedSla.targetHrs}h</span>} />
              <InfoCell label="Elapsed (hrs)" value={<span className="text-lg font-bold">{selectedSla.elapsedHrs}h</span>} />
              <InfoCell label="Status" value={<VerificationChip tone={statusTone(selectedSla.status)}>{selectedSla.status.replace(/_/g, " ")}</VerificationChip>} />
            </div>

            <InfoCell label="Assignee" value={selectedSla.assignee} />

            <div className="space-y-2">
              <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/45">Progress</p>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2 rounded-full bg-[#1A1D33] overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      selectedSla.status === "BREACHED"
                        ? "bg-gradient-to-r from-[#F05858] to-[#E84141]"
                        : selectedSla.status === "AT_RISK"
                        ? "bg-gradient-to-r from-[#F0A030] to-[#E8941F]"
                        : "bg-gradient-to-r from-[#38C878] to-[#2AB066]"
                    }`}
                    style={{
                      width: `${Math.min(
                        (selectedSla.elapsedHrs / selectedSla.targetHrs) * 100,
                        100
                      )}%`,
                    }}
                  />
                </div>
                <span className="text-[12px] text-white/50">
                  {Math.round(
                    (selectedSla.elapsedHrs / selectedSla.targetHrs) * 100
                  )}%
                </span>
              </div>
            </div>
          </div>
        </VerificationDrawer>
      )}
    </div>
  );
}
