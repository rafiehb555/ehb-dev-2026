"use client";

import { useState } from "react";
import Link from "next/link";
import {
  VerificationChip,
  VerificationDrawer,
  VerificationRowGrid,
  VerificationStatCard,
  SectionHeader,
} from "@/components/dmo/verification/VerificationUI";

interface CompletedRefillRow {
  id: string;
  entityName: string;
  stlLevel: number;
  refillType: "ANNUAL" | "UPGRADE" | "EMERGENCY";
  completedAt: string;
  turnaroundDays: number;
  outcome: "RENEWED" | "UPGRADED" | "MAINTAINED";
}

const DEMO_DATA: CompletedRefillRow[] = [
  {
    id: "cmp-001",
    entityName: "MediCare Lab Solutions",
    stlLevel: 6,
    refillType: "ANNUAL",
    completedAt: "2026-04-08",
    turnaroundDays: 4,
    outcome: "RENEWED",
  },
  {
    id: "cmp-002",
    entityName: "Tech Academy Pro",
    stlLevel: 6,
    refillType: "UPGRADE",
    completedAt: "2026-04-07",
    turnaroundDays: 7,
    outcome: "UPGRADED",
  },
  {
    id: "cmp-003",
    entityName: "GoSellr Commerce Hub",
    stlLevel: 4,
    refillType: "ANNUAL",
    completedAt: "2026-04-06",
    turnaroundDays: 5,
    outcome: "RENEWED",
  },
  {
    id: "cmp-004",
    entityName: "LegalDocs Express",
    stlLevel: 7,
    refillType: "ANNUAL",
    completedAt: "2026-04-04",
    turnaroundDays: 3,
    outcome: "RENEWED",
  },
  {
    id: "cmp-005",
    entityName: "Wellness Clinic Network",
    stlLevel: 6,
    refillType: "UPGRADE",
    completedAt: "2026-03-31",
    turnaroundDays: 6,
    outcome: "UPGRADED",
  },
  {
    id: "cmp-006",
    entityName: "EduConnect Platform",
    stlLevel: 6,
    refillType: "ANNUAL",
    completedAt: "2026-03-28",
    turnaroundDays: 4,
    outcome: "RENEWED",
  },
  {
    id: "cmp-007",
    entityName: "TravelGlobal Booking",
    stlLevel: 5,
    refillType: "UPGRADE",
    completedAt: "2026-03-25",
    turnaroundDays: 8,
    outcome: "UPGRADED",
  },
  {
    id: "cmp-008",
    entityName: "JobMatch Recruitment",
    stlLevel: 5,
    refillType: "ANNUAL",
    completedAt: "2026-03-20",
    turnaroundDays: 5,
    outcome: "RENEWED",
  },
];

export default function CompletedRefillsPage() {
  const [selectedRow, setSelectedRow] = useState<CompletedRefillRow | null>(null);

  const outcomeColor = (outcome: string) => {
    switch (outcome) {
      case "UPGRADED":
        return "teal";
      case "RENEWED":
        return "green";
      case "MAINTAINED":
        return "purple";
      default:
        return "purple";
    }
  };

  const refillTypeColor = (type: string) => {
    switch (type) {
      case "ANNUAL":
        return "purple";
      case "UPGRADE":
        return "teal";
      case "EMERGENCY":
        return "red";
      default:
        return "purple";
    }
  };

  const sortedData = [...DEMO_DATA].sort(
    (a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
  );

  return (
    <div className="min-h-screen bg-[#0C0E1A] p-8">
      {/* Hero Section */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-sm font-medium text-gray-400">DMO</span>
          <span className="text-gray-600">/</span>
          <span className="text-sm font-medium text-gray-400">Refill Management</span>
          <span className="text-gray-600">/</span>
          <span className="text-sm font-medium text-white">Completed</span>
        </div>
        <h1 className="text-4xl font-bold text-white mb-2">Completed Refills</h1>
        <p className="text-gray-400">
          Successfully completed STL re-verification processes with outcomes and metrics
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <VerificationStatCard
          tone="green"
          label="Completed"
          value={18}
          sub="this month"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
        />
        <VerificationStatCard
          tone="cyan"
          label="Avg Turnaround"
          value="4.8 days"
          sub="average duration"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          }
        />
        <VerificationStatCard
          tone="teal"
          label="Upgrades"
          value={5}
          sub="level improvements"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3v-7"
              />
            </svg>
          }
        />
        <VerificationStatCard
          tone="purple"
          label="Renewals"
          value={13}
          sub="level maintenance"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          }
        />
      </div>

      {/* Section Header */}
      <SectionHeader title="Refill Completion Records" hint="sorted by completion date" />

      {/* Data Grid */}
      <VerificationRowGrid<CompletedRefillRow>
        rows={sortedData}
        columns={[
          {
            key: "entityName",
            header: "Entity",
            width: "minmax(0,2fr)",
            render: (row) => (
              <div className="flex flex-col gap-1">
                <span className="font-medium text-white">{row.entityName}</span>
                <span className="text-xs text-gray-500">STL {row.stlLevel}</span>
              </div>
            ),
          },
          {
            key: "refillType",
            header: "Type",
            width: "minmax(0,1fr)",
            render: (row) => (
              <VerificationChip tone={refillTypeColor(row.refillType)}>
                {row.refillType}
              </VerificationChip>
            ),
          },
          {
            key: "outcome",
            header: "Outcome",
            width: "minmax(0,1.2fr)",
            render: (row) => (
              <VerificationChip tone={outcomeColor(row.outcome)}>
                {row.outcome}
              </VerificationChip>
            ),
          },
          {
            key: "turnaroundDays",
            header: "Turnaround",
            width: "minmax(0,1fr)",
            render: (row) => (
              <span className="text-sm font-medium text-green-400">{row.turnaroundDays}d</span>
            ),
          },
          {
            key: "completedAt",
            header: "Completed",
            width: "minmax(0,1.2fr)",
            render: (row) => (
              <span className="text-sm text-gray-400">{row.completedAt}</span>
            ),
          },
        ]}
        onRowClick={(row) => setSelectedRow(row)}
      />

      {/* Detail Drawer */}
      {selectedRow && (
        <VerificationDrawer
          open={!!selectedRow}
          title={selectedRow.entityName}
          subtitle={`STL L${selectedRow.stlLevel} • ${selectedRow.outcome}`}
          severity="info"
          onClose={() => setSelectedRow(null)}
        >
          <div className="space-y-6">
            {/* Refill Summary */}
            <div>
              <h3 className="text-sm font-semibold text-white mb-4">Refill Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-800">
                  <span className="text-gray-400">Refill Type</span>
                  <VerificationChip tone={refillTypeColor(selectedRow.refillType)}>
                    {selectedRow.refillType}
                  </VerificationChip>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-800">
                  <span className="text-gray-400">STL Level</span>
                  <span className="text-sm font-semibold text-purple-400">
                    L{selectedRow.stlLevel}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-800">
                  <span className="text-gray-400">Outcome</span>
                  <VerificationChip tone={outcomeColor(selectedRow.outcome)}>
                    {selectedRow.outcome}
                  </VerificationChip>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-400">Completion Date</span>
                  <span className="text-sm text-gray-300">{selectedRow.completedAt}</span>
                </div>
              </div>
            </div>

            {/* Performance Metrics */}
            <div>
              <h3 className="text-sm font-semibold text-white mb-4">Performance Metrics</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#1A1D33] border border-gray-800 rounded-lg p-4">
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">
                    Turnaround Time
                  </p>
                  <p className="text-2xl font-bold text-green-400">
                    {selectedRow.turnaroundDays} days
                  </p>
                </div>
                <div className="bg-[#1A1D33] border border-gray-800 rounded-lg p-4">
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">
                    Status
                  </p>
                  <p className="text-sm font-semibold text-green-400">Successfully Completed</p>
                </div>
              </div>
            </div>

            {/* Completion Checklist */}
            <div>
              <h3 className="text-sm font-semibold text-white mb-4">Verification Completed</h3>
              <div className="space-y-2">
                {[
                  { step: "Identity Verification", completed: true },
                  { step: "Document Review", completed: true },
                  { step: "Compliance Check", completed: true },
                  { step: "Final Approval", completed: true },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded border bg-green-400/20 border-green-400">
                      <svg className="w-3 h-3 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <span className="text-sm text-gray-300">{item.step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Outcome Details */}
            <div className="bg-[#1A1D33] border border-gray-800 rounded-lg p-4">
              <div className="mb-3">
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">
                  Refill Outcome
                </p>
                <p className="text-base font-semibold text-white">
                  {selectedRow.outcome === "UPGRADED"
                    ? "Service Level Upgraded"
                    : selectedRow.outcome === "RENEWED"
                      ? "Service Renewed"
                      : "Service Maintained"}
                </p>
              </div>
              <p className="text-sm text-gray-400">
                {selectedRow.outcome === "UPGRADED"
                  ? "Entity successfully completed upgrade verification and achieved higher service tier status."
                  : selectedRow.outcome === "RENEWED"
                    ? "Entity successfully completed annual renewal and maintained service level eligibility."
                    : "Entity successfully completed verification and maintained current service level status."}
              </p>
            </div>

            {/* Next Steps */}
            <div>
              <h3 className="text-sm font-semibold text-white mb-3">Next Steps</h3>
              <div className="space-y-2">
                <div className="bg-[#1A1D33] border border-gray-800 rounded-lg p-3">
                  <p className="text-sm font-medium text-gray-200">Schedule Next Review</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {selectedRow.refillType === "ANNUAL"
                      ? "Annual review due in 12 months"
                      : "Maintain current status and monitor for upgrade readiness"}
                  </p>
                </div>
                <div className="bg-[#1A1D33] border border-gray-800 rounded-lg p-3">
                  <p className="text-sm font-medium text-gray-200">Update Service Certificates</p>
                  <p className="text-xs text-gray-500 mt-1">Certificate and credentials updated in CRB</p>
                </div>
              </div>
            </div>
          </div>
        </VerificationDrawer>
      )}
    </div>
  );
}
