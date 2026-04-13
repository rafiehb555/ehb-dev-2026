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

interface ExpiringRefillRow {
  id: string;
  entityName: string;
  stlLevel: number;
  expiresAt: string;
  daysLeft: number;
  lastNotifiedAt: string;
  autoRenew: boolean;
}

const DEMO_DATA: ExpiringRefillRow[] = [
  {
    id: "exp-001",
    entityName: "MediCare Lab Solutions",
    stlLevel: 6,
    expiresAt: "2026-04-15",
    daysLeft: 3,
    lastNotifiedAt: "2026-04-10",
    autoRenew: true,
  },
  {
    id: "exp-002",
    entityName: "Tech Academy Pro",
    stlLevel: 5,
    expiresAt: "2026-04-18",
    daysLeft: 6,
    lastNotifiedAt: "2026-04-05",
    autoRenew: false,
  },
  {
    id: "exp-003",
    entityName: "GoSellr Commerce Hub",
    stlLevel: 4,
    expiresAt: "2026-04-16",
    daysLeft: 4,
    lastNotifiedAt: "2026-04-11",
    autoRenew: true,
  },
  {
    id: "exp-004",
    entityName: "LegalDocs Express",
    stlLevel: 7,
    expiresAt: "2026-04-20",
    daysLeft: 8,
    lastNotifiedAt: "2026-04-08",
    autoRenew: true,
  },
  {
    id: "exp-005",
    entityName: "Wellness Clinic Network",
    stlLevel: 5,
    expiresAt: "2026-05-10",
    daysLeft: 28,
    lastNotifiedAt: "2026-03-28",
    autoRenew: false,
  },
  {
    id: "exp-006",
    entityName: "EduConnect Platform",
    stlLevel: 6,
    expiresAt: "2026-04-22",
    daysLeft: 10,
    lastNotifiedAt: "2026-04-07",
    autoRenew: true,
  },
  {
    id: "exp-007",
    entityName: "TravelGlobal Booking",
    stlLevel: 4,
    expiresAt: "2026-05-08",
    daysLeft: 26,
    lastNotifiedAt: "2026-03-15",
    autoRenew: false,
  },
  {
    id: "exp-008",
    entityName: "JobMatch Recruitment",
    stlLevel: 5,
    expiresAt: "2026-04-17",
    daysLeft: 5,
    lastNotifiedAt: "2026-04-09",
    autoRenew: true,
  },
];

export default function ExpiringRefillsPage() {
  const [selectedRow, setSelectedRow] = useState<ExpiringRefillRow | null>(null);

  const urgencyColor = (daysLeft: number) => {
    if (daysLeft <= 3) return "red";
    if (daysLeft <= 7) return "amber";
    return "amber";
  };

  const sortedData = [...DEMO_DATA].sort((a, b) => a.daysLeft - b.daysLeft);

  return (
    <div className="min-h-screen bg-[#0C0E1A] p-8">
      {/* Hero Section */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-sm font-medium text-gray-400">DMO</span>
          <span className="text-gray-600">/</span>
          <span className="text-sm font-medium text-gray-400">Refill Management</span>
          <span className="text-gray-600">/</span>
          <span className="text-sm font-medium text-white">Expiring Soon</span>
        </div>
        <h1 className="text-4xl font-bold text-white mb-2">Expiring Soon</h1>
        <p className="text-gray-400">
          Entities whose STL refill deadline is approaching — take action to prevent service suspension
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <VerificationStatCard
          tone="red"
          label="Expiring"
          value={12}
          sub="approaching deadline"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4v2m0 4v2M5.707 5.707a1 1 0 010 1.414L4.414 8l1.293 1.293a1 1 0 11-1.414 1.414L3 9.414V8l1.293-1.293a1 1 0 011.414 0zM19 3h-4a2 2 0 00-2 2v4a2 2 0 002 2h4a2 2 0 002-2V5a2 2 0 00-2-2zm0 14h-4a2 2 0 00-2 2v4a2 2 0 002 2h4a2 2 0 002-2v-4a2 2 0 00-2-2z"
              />
            </svg>
          }
        />
        <VerificationStatCard
          tone="red"
          label="Within 7 Days"
          value={4}
          sub="critical urgency"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4v2m6-6a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
        />
        <VerificationStatCard
          tone="amber"
          label="Within 30 Days"
          value={8}
          sub="high priority"
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
          tone="green"
          label="Notified"
          value={10}
          sub="reminders sent"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
          }
        />
      </div>

      {/* Section Header */}
      <SectionHeader title="Expiring Refills" hint="sorted by urgency" />

      {/* Data Grid */}
      <VerificationRowGrid<ExpiringRefillRow>
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
            key: "daysLeft",
            header: "Urgency",
            width: "minmax(0,1fr)",
            render: (row) => (
              <VerificationChip tone={urgencyColor(row.daysLeft)}>
                {row.daysLeft} days left
              </VerificationChip>
            ),
          },
          {
            key: "expiresAt",
            header: "Expires",
            width: "minmax(0,1.2fr)",
            render: (row) => (
              <span className="text-sm text-gray-300">{row.expiresAt}</span>
            ),
          },
          {
            key: "autoRenew",
            header: "Auto-Renew",
            width: "minmax(0,1fr)",
            render: (row) => (
              <VerificationChip tone={row.autoRenew ? "green" : "cyan"}>
                {row.autoRenew ? "Enabled" : "Manual"}
              </VerificationChip>
            ),
          },
          {
            key: "lastNotifiedAt",
            header: "Last Notified",
            width: "minmax(0,1.2fr)",
            render: (row) => (
              <span className="text-sm text-gray-400">{row.lastNotifiedAt}</span>
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
          subtitle={`STL Level ${selectedRow.stlLevel} • Expires ${selectedRow.expiresAt}`}
          severity={selectedRow.daysLeft <= 3 ? "critical" : "high"}
          onClose={() => setSelectedRow(null)}
        >
          <div className="space-y-6">
            {/* Expiry Timeline */}
            <div>
              <h3 className="text-sm font-semibold text-white mb-4">Timeline to Expiry</h3>
              <div className="space-y-3">
                <div className="flex gap-4">
                  <div className="w-2 h-2 rounded-full bg-[#2BBFA0] mt-2 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-white">Days Remaining</p>
                    <p className="text-xs text-gray-400">{selectedRow.daysLeft} days</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-2 h-2 rounded-full bg-[#F0A030] mt-2 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-white">Expiration Date</p>
                    <p className="text-xs text-gray-400">{selectedRow.expiresAt}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-2 h-2 rounded-full bg-[#7B6EF6] mt-2 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-white">Last Notification</p>
                    <p className="text-xs text-gray-400">{selectedRow.lastNotifiedAt}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Notification History */}
            <div>
              <h3 className="text-sm font-semibold text-white mb-4">Notification History</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center py-2 border-b border-gray-800">
                  <span className="text-gray-400">30-day notice</span>
                  <span className="text-gray-500 text-xs">sent</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-800">
                  <span className="text-gray-400">14-day reminder</span>
                  <span className="text-gray-500 text-xs">pending</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-400">7-day final notice</span>
                  <span className="text-gray-500 text-xs">pending</span>
                </div>
              </div>
            </div>

            {/* Auto-Renew Status */}
            <div className="bg-[#1A1D33] border border-gray-800 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
                    Auto-Renewal Status
                  </p>
                  <p className="text-base font-semibold text-white">
                    {selectedRow.autoRenew ? "Enabled" : "Manual Refill Required"}
                  </p>
                </div>
                <div className={`w-3 h-3 rounded-full ${selectedRow.autoRenew ? "bg-[#38C878]" : "bg-[#F0A030]"}`} />
              </div>
            </div>

            {/* Recommended Actions */}
            <div>
              <h3 className="text-sm font-semibold text-white mb-3">Recommended Actions</h3>
              <div className="space-y-2">
                {[
                  {
                    action: "Initiate Refill Process",
                    description: "Begin re-verification if auto-renewal is off",
                  },
                  {
                    action: "Verify Auto-Renewal Settings",
                    description: "Confirm settings match entity preferences",
                  },
                  {
                    action: "Schedule Review Meeting",
                    description: "Proactive engagement to prevent suspension",
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
