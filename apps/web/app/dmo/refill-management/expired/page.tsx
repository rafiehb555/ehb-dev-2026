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

interface ExpiredRefillRow {
  id: string;
  entityName: string;
  previousLevel: number;
  currentLevel: number;
  expiredAt: string;
  daysSinceExpiry: number;
  action: "DOWNGRADED" | "GRACE_PERIOD" | "SUSPENDED";
}

const DEMO_DATA: ExpiredRefillRow[] = [
  {
    id: "expd-001",
    entityName: "QuickShop E-Commerce",
    previousLevel: 5,
    currentLevel: 3,
    expiredAt: "2026-04-05",
    daysSinceExpiry: 7,
    action: "DOWNGRADED",
  },
  {
    id: "expd-002",
    entityName: "Wellness Pro Clinic",
    previousLevel: 4,
    currentLevel: 2,
    expiredAt: "2026-03-28",
    daysSinceExpiry: 15,
    action: "DOWNGRADED",
  },
  {
    id: "expd-003",
    entityName: "LawPoint Legal Services",
    previousLevel: 6,
    currentLevel: 6,
    expiredAt: "2026-04-08",
    daysSinceExpiry: 4,
    action: "GRACE_PERIOD",
  },
  {
    id: "expd-004",
    entityName: "TechHub Academy",
    previousLevel: 5,
    currentLevel: 0,
    expiredAt: "2026-03-15",
    daysSinceExpiry: 28,
    action: "SUSPENDED",
  },
  {
    id: "expd-005",
    entityName: "CarePro Medical",
    previousLevel: 7,
    currentLevel: 5,
    expiredAt: "2026-04-02",
    daysSinceExpiry: 10,
    action: "DOWNGRADED",
  },
  {
    id: "expd-006",
    entityName: "JobLink Recruitment",
    previousLevel: 4,
    currentLevel: 4,
    expiredAt: "2026-04-09",
    daysSinceExpiry: 3,
    action: "GRACE_PERIOD",
  },
  {
    id: "expd-007",
    entityName: "EduSmart Online",
    previousLevel: 5,
    currentLevel: 0,
    expiredAt: "2026-03-20",
    daysSinceExpiry: 23,
    action: "SUSPENDED",
  },
  {
    id: "expd-008",
    entityName: "TravelTrust Bookings",
    previousLevel: 4,
    currentLevel: 4,
    expiredAt: "2026-04-10",
    daysSinceExpiry: 2,
    action: "GRACE_PERIOD",
  },
];

export default function ExpiredRefillsPage() {
  const [selectedRow, setSelectedRow] = useState<ExpiredRefillRow | null>(null);

  const actionColor = (action: string) => {
    switch (action) {
      case "DOWNGRADED":
        return "amber";
      case "GRACE_PERIOD":
        return "cyan";
      case "SUSPENDED":
        return "red";
      default:
        return "purple";
    }
  };

  const actionLabel = (action: string) => {
    switch (action) {
      case "DOWNGRADED":
        return "Service Downgraded";
      case "GRACE_PERIOD":
        return "Grace Period Active";
      case "SUSPENDED":
        return "Service Suspended";
      default:
        return action;
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
          <span className="text-sm font-medium text-white">Expired</span>
        </div>
        <h1 className="text-4xl font-bold text-white mb-2">Expired Refills</h1>
        <p className="text-gray-400">
          Entities that failed to complete refill in time — take action to restore service
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <VerificationStatCard
          tone="red"
          label="Expired"
          value={9}
          sub="missed deadline"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4v2m0 4v2M8 6h8a2 2 0 012 2v12a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2z"
              />
            </svg>
          }
        />
        <VerificationStatCard
          tone="amber"
          label="Downgraded"
          value={5}
          sub="reduced STL level"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 13h3v3H13v-3zm0-8h3v3h-3V5zm0 4h3v3h-3V9zM9 9h3v3H9V9zm0-4h3v3H9V5zm0 4h3v3H9V9zm0 4h3v3H9v-3zm-4-4h3v3H5V9zm0-4h3v3H5V5zm0 4h3v3H5V9zm0 4h3v3H5v-3z"
              />
            </svg>
          }
        />
        <VerificationStatCard
          tone="cyan"
          label="Grace Period"
          value={3}
          sub="active negotiation"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          }
        />
        <VerificationStatCard
          tone="red"
          label="Suspended"
          value={1}
          sub="no service access"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          }
        />
      </div>

      {/* Section Header */}
      <SectionHeader title="Expired Refill Records" hint="sorted by impact" />

      {/* Data Grid */}
      <VerificationRowGrid<ExpiredRefillRow>
        rows={DEMO_DATA}
        columns={[
          {
            key: "entityName",
            header: "Entity",
            width: "minmax(0,2fr)",
            render: (row) => (
              <div className="flex flex-col gap-1">
                <span className="font-medium text-white">{row.entityName}</span>
                <span className="text-xs text-gray-500">
                  L{row.previousLevel} → L{row.currentLevel}
                </span>
              </div>
            ),
          },
          {
            key: "action",
            header: "Status",
            width: "minmax(0,1.3fr)",
            render: (row) => (
              <VerificationChip tone={actionColor(row.action)}>
                {actionLabel(row.action)}
              </VerificationChip>
            ),
          },
          {
            key: "daysSinceExpiry",
            header: "Days Expired",
            width: "minmax(0,1fr)",
            render: (row) => (
              <span className="text-sm font-medium text-amber-400">{row.daysSinceExpiry}d</span>
            ),
          },
          {
            key: "expiredAt",
            header: "Expiration Date",
            width: "minmax(0,1.2fr)",
            render: (row) => (
              <span className="text-sm text-gray-400">{row.expiredAt}</span>
            ),
          },
          {
            key: "currentLevel",
            header: "Current Level",
            width: "minmax(0,1fr)",
            render: (row) => (
              <span
                className={`text-sm font-semibold ${
                  row.currentLevel === 0 ? "text-red-400" : "text-amber-400"
                }`}
              >
                {row.currentLevel === 0 ? "Suspended" : `L${row.currentLevel}`}
              </span>
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
          subtitle={`${actionLabel(selectedRow.action)} • L${selectedRow.previousLevel} → L${selectedRow.currentLevel}`}
          severity={
            selectedRow.action === "SUSPENDED"
              ? "critical"
              : selectedRow.action === "DOWNGRADED"
                ? "high"
                : "warning"
          }
          onClose={() => setSelectedRow(null)}
        >
          <div className="space-y-6">
            {/* Level Change Summary */}
            <div>
              <h3 className="text-sm font-semibold text-white mb-4">Service Level Impact</h3>
              <div className="flex items-center gap-4">
                <div className="flex-1 bg-[#1A1D33] border border-gray-800 rounded-lg p-4">
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
                    Previous Level
                  </p>
                  <p className="text-2xl font-bold text-amber-400">L{selectedRow.previousLevel}</p>
                </div>
                <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
                <div className="flex-1 bg-[#1A1D33] border border-gray-800 rounded-lg p-4">
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Current Level</p>
                  <p
                    className={`text-2xl font-bold ${
                      selectedRow.currentLevel === 0 ? "text-red-400" : "text-amber-400"
                    }`}
                  >
                    {selectedRow.currentLevel === 0 ? "Suspended" : `L${selectedRow.currentLevel}`}
                  </p>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div>
              <h3 className="text-sm font-semibold text-white mb-4">Expiration Timeline</h3>
              <div className="space-y-3">
                <div className="flex gap-4">
                  <div className="w-2 h-2 rounded-full bg-red-400 mt-2 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-white">Expired Date</p>
                    <p className="text-xs text-gray-400">{selectedRow.expiredAt}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-2 h-2 rounded-full bg-amber-400 mt-2 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-white">Days Since Expiry</p>
                    <p className="text-xs text-gray-400">{selectedRow.daysSinceExpiry} days</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Current Status Info */}
            <div className="bg-[#1A1D33] border border-gray-800 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">Current Status</p>
                  <p className="text-base font-semibold text-white">{actionLabel(selectedRow.action)}</p>
                </div>
                <VerificationChip tone={actionColor(selectedRow.action)}>
                  {selectedRow.action}
                </VerificationChip>
              </div>
            </div>

            {/* Reinstatement Options */}
            <div>
              <h3 className="text-sm font-semibold text-white mb-3">
                {selectedRow.action === "SUSPENDED"
                  ? "Reinstatement Required"
                  : "Recovery Actions"}
              </h3>
              <div className="space-y-2">
                {selectedRow.action === "SUSPENDED" && [
                  {
                    step: "1",
                    action: "Contact Entity",
                    description: "Initiate formal reinstatement discussion",
                  },
                  {
                    step: "2",
                    action: "Full Revalidation",
                    description: "Complete L0 through current level verification",
                  },
                  {
                    step: "3",
                    action: "Compliance Review",
                    description: "Address any compliance gaps that led to suspension",
                  },
                  {
                    step: "4",
                    action: "L-Grade Decision",
                    description: "Approve reinstatement at appropriate level",
                  },
                ].map((item, idx) => (
                  <div key={idx} className="bg-[#1A1D33] border border-gray-800 rounded-lg p-3">
                    <div className="flex items-start gap-3">
                      <span className="text-xs font-bold bg-red-400/20 text-red-300 px-2 py-1 rounded">
                        {item.step}
                      </span>
                      <div>
                        <p className="text-sm font-medium text-gray-200">{item.action}</p>
                        <p className="text-xs text-gray-500 mt-1">{item.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
                {selectedRow.action === "DOWNGRADED" && [
                  {
                    action: "Initiate Refill",
                    description: "Begin re-verification to restore previous level",
                  },
                  {
                    action: "Review Downgrade Reason",
                    description: "Address compliance gap that triggered downgrade",
                  },
                  {
                    action: "Upgrade Path Planning",
                    description: "Create roadmap to return to L{previousLevel}",
                  },
                ].map((item, idx) => (
                  <div key={idx} className="bg-[#1A1D33] border border-gray-800 rounded-lg p-3">
                    <p className="text-sm font-medium text-gray-200">{item.action}</p>
                    <p className="text-xs text-gray-500 mt-1">{item.description}</p>
                  </div>
                ))}
                {selectedRow.action === "GRACE_PERIOD" && [
                  {
                    action: "Finalize Refill",
                    description: "Complete remaining verification steps",
                  },
                  {
                    action: "Submit Final Documentation",
                    description: "Provide any outstanding compliance documents",
                  },
                  {
                    action: "Level Restoration",
                    description: "Approve renewal to return service access",
                  },
                ].map((item, idx) => (
                  <div key={idx} className="bg-[#1A1D33] border border-gray-800 rounded-lg p-3">
                    <p className="text-sm font-medium text-gray-200">{item.action}</p>
                    <p className="text-xs text-gray-500 mt-1">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </VerificationDrawer>
      )}
    </div>
  );
}
