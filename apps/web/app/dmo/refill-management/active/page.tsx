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

interface ActiveRefillRow {
  id: string;
  entityName: string;
  stlLevel: number;
  refillType: "ANNUAL" | "UPGRADE" | "EMERGENCY" | "AUTO";
  startedAt: string;
  progress: number;
  assignedReviewer: string;
  status: "IN_PROGRESS" | "UNDER_REVIEW" | "DOCS_PENDING";
}

const DEMO_DATA: ActiveRefillRow[] = [
  {
    id: "ref-001",
    entityName: "MediCare Lab Solutions",
    stlLevel: 6,
    refillType: "ANNUAL",
    startedAt: "2026-03-15",
    progress: 75,
    assignedReviewer: "Dr. Aisha Khan",
    status: "UNDER_REVIEW",
  },
  {
    id: "ref-002",
    entityName: "Tech Academy Pro",
    stlLevel: 5,
    refillType: "UPGRADE",
    startedAt: "2026-03-20",
    progress: 45,
    assignedReviewer: "James Wilson",
    status: "IN_PROGRESS",
  },
  {
    id: "ref-003",
    entityName: "GoSellr Commerce Hub",
    stlLevel: 4,
    refillType: "EMERGENCY",
    startedAt: "2026-04-08",
    progress: 30,
    assignedReviewer: "Fatima Ali",
    status: "DOCS_PENDING",
  },
  {
    id: "ref-004",
    entityName: "LegalDocs Express",
    stlLevel: 7,
    refillType: "ANNUAL",
    startedAt: "2026-03-10",
    progress: 90,
    assignedReviewer: "Marcus Chen",
    status: "UNDER_REVIEW",
  },
  {
    id: "ref-005",
    entityName: "Wellness Clinic Network",
    stlLevel: 5,
    refillType: "AUTO",
    startedAt: "2026-04-02",
    progress: 55,
    assignedReviewer: "Dr. Aisha Khan",
    status: "IN_PROGRESS",
  },
  {
    id: "ref-006",
    entityName: "EduConnect Platform",
    stlLevel: 6,
    refillType: "UPGRADE",
    startedAt: "2026-03-25",
    progress: 65,
    assignedReviewer: "Priya Sharma",
    status: "UNDER_REVIEW",
  },
  {
    id: "ref-007",
    entityName: "TravelGlobal Booking",
    stlLevel: 4,
    refillType: "ANNUAL",
    startedAt: "2026-03-28",
    progress: 40,
    assignedReviewer: "Ahmed Hassan",
    status: "IN_PROGRESS",
  },
  {
    id: "ref-008",
    entityName: "JobMatch Recruitment",
    stlLevel: 5,
    refillType: "AUTO",
    startedAt: "2026-04-05",
    progress: 70,
    assignedReviewer: "Sarah Johnson",
    status: "UNDER_REVIEW",
  },
];

export default function ActiveRefillsPage() {
  const [selectedRow, setSelectedRow] = useState<ActiveRefillRow | null>(null);

  const refillTypeColor = (type: string) => {
    switch (type) {
      case "ANNUAL":
        return "purple";
      case "UPGRADE":
        return "teal";
      case "EMERGENCY":
        return "red";
      case "AUTO":
        return "green";
      default:
        return "purple";
    }
  };

  const statusColor = (status: string) => {
    switch (status) {
      case "IN_PROGRESS":
        return "amber";
      case "UNDER_REVIEW":
        return "cyan";
      case "DOCS_PENDING":
        return "red";
      default:
        return "purple";
    }
  };

  return (
    <div className="min-h-screen bg-[#0C0E1A] p-8">
      {/* Hero Section */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-sm font-medium text-gray-400">DMO</span>
          <span className="text-gray-600">/</span>
          <span className="text-sm font-medium text-gray-400">Refill Management</span>
          <span className="text-gray-600">/</span>
          <span className="text-sm font-medium text-white">Active</span>
        </div>
        <h1 className="text-4xl font-bold text-white mb-2">Active Refills</h1>
        <p className="text-gray-400">
          Monitor entities currently undergoing STL re-verification process
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <VerificationStatCard
          tone="purple"
          label="Active Refills"
          value={24}
          sub="in progress"
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
        <VerificationStatCard
          tone="cyan"
          label="In Review"
          value={8}
          sub="awaiting decision"
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
          tone="amber"
          label="Avg Completion"
          value="5.2 days"
          sub="average turnaround"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
        />
        <VerificationStatCard
          tone="green"
          label="Auto-Refills"
          value={6}
          sub="automated process"
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
      </div>

      {/* Section Header */}
      <SectionHeader title="Refill Queue" hint="8 active refills" />

      {/* Data Grid */}
      <VerificationRowGrid<ActiveRefillRow>
        rows={DEMO_DATA}
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
            key: "progress",
            header: "Progress",
            width: "minmax(0,1.5fr)",
            render: (row) => (
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-[#1A1D33] rounded-full h-2">
                  <div
                    className="bg-[#7B6EF6] h-2 rounded-full transition-all"
                    style={{ width: `${row.progress}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-300 w-10">{row.progress}%</span>
              </div>
            ),
          },
          {
            key: "status",
            header: "Status",
            width: "minmax(0,1.2fr)",
            render: (row) => (
              <VerificationChip tone={statusColor(row.status)}>
                {row.status.replace(/_/g, " ")}
              </VerificationChip>
            ),
          },
          {
            key: "assignedReviewer",
            header: "Reviewer",
            width: "minmax(0,1.2fr)",
            render: (row) => (
              <span className="text-sm text-gray-300">{row.assignedReviewer}</span>
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
          subtitle={`STL Level ${selectedRow.stlLevel} • ${selectedRow.refillType} Refill`}
          severity={
            selectedRow.status === "DOCS_PENDING"
              ? "high"
              : selectedRow.status === "UNDER_REVIEW"
                ? "warning"
                : "info"
          }
          onClose={() => setSelectedRow(null)}
        >
          <div className="space-y-6">
            {/* Timeline */}
            <div>
              <h3 className="text-sm font-semibold text-white mb-4">Refill Timeline</h3>
              <div className="space-y-3">
                <div className="flex gap-4">
                  <div className="w-2 h-2 rounded-full bg-[#7B6EF6] mt-2 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-white">Started</p>
                    <p className="text-xs text-gray-400">{selectedRow.startedAt}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-2 h-2 rounded-full bg-[#2BBFA0] mt-2 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-white">Current Progress</p>
                    <p className="text-xs text-gray-400">{selectedRow.progress}% complete</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Checklist */}
            <div>
              <h3 className="text-sm font-semibold text-white mb-4">Verification Steps</h3>
              <div className="space-y-2">
                {[
                  { step: "Identity Verification", completed: selectedRow.progress >= 25 },
                  { step: "Document Review", completed: selectedRow.progress >= 50 },
                  { step: "Compliance Check", completed: selectedRow.progress >= 75 },
                  { step: "Final Approval", completed: selectedRow.progress >= 100 },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div
                      className={`w-4 h-4 rounded border ${
                        item.completed
                          ? "bg-[#38C878] border-[#38C878]"
                          : "border-gray-600"
                      }`}
                    >
                      {item.completed && (
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <span className={`text-sm ${item.completed ? "text-gray-300" : "text-gray-400"}`}>
                      {item.step}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviewer Info */}
            <div className="bg-[#1A1D33] border border-gray-800 rounded-lg p-4">
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">Assigned Reviewer</p>
              <p className="text-base font-semibold text-white">{selectedRow.assignedReviewer}</p>
            </div>
          </div>
        </VerificationDrawer>
      )}
    </div>
  );
}
