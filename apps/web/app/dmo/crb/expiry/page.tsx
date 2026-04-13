"use client";

import { useState } from "react";
import Link from "next/link";
import {
  SectionHeader,
  VerificationChip,
  FilterChipRow,
  VerificationRowGrid,
  VerificationDrawer,
  VerificationStatCard,
  SeverityMeter,
} from "@/components/dmo/verification/VerificationUI";

// Demo data
const demoRows = [
  {
    id: "cert-001",
    entityName: "TechStart Academy",
    certId: "EDU-2024-00147",
    expiresAt: "2026-05-15",
    daysLeft: 33,
    status: "EXPIRING_SOON" as const,
    lastNotifiedAt: "2026-04-10",
    autoRenewable: true,
  },
  {
    id: "cert-002",
    entityName: "HealthCare Solutions",
    certId: "MED-2023-00892",
    expiresAt: "2026-04-18",
    daysLeft: 6,
    status: "EXPIRING_SOON" as const,
    lastNotifiedAt: "2026-04-08",
    autoRenewable: true,
  },
  {
    id: "cert-003",
    entityName: "LegalPro Services",
    certId: "LEGAL-2024-01023",
    expiresAt: "2026-03-22",
    daysLeft: -21,
    status: "EXPIRED" as const,
    lastNotifiedAt: "2026-03-20",
    autoRenewable: false,
  },
  {
    id: "cert-004",
    entityName: "Finance Hub Ltd",
    certId: "FIN-2023-00456",
    expiresAt: "2026-04-05",
    daysLeft: -7,
    status: "EXPIRED" as const,
    lastNotifiedAt: "2026-04-02",
    autoRenewable: false,
  },
  {
    id: "cert-005",
    entityName: "GoSellr Commerce",
    certId: "ECOM-2024-00789",
    expiresAt: "2026-04-20",
    daysLeft: 8,
    status: "EXPIRING_SOON" as const,
    lastNotifiedAt: "2026-04-09",
    autoRenewable: true,
  },
  {
    id: "cert-006",
    entityName: "Travel Agency Pro",
    certId: "TRAVEL-2023-00634",
    expiresAt: "2026-04-12",
    daysLeft: 0,
    status: "RENEWAL_PENDING" as const,
    lastNotifiedAt: "2026-04-11",
    autoRenewable: true,
  },
  {
    id: "cert-007",
    entityName: "Job Matching Services",
    certId: "JPS-2024-00321",
    expiresAt: "2026-02-28",
    daysLeft: -43,
    status: "EXPIRED" as const,
    lastNotifiedAt: "2026-02-25",
    autoRenewable: false,
  },
  {
    id: "cert-008",
    entityName: "Elite Consulting Group",
    certId: "CONS-2024-00915",
    expiresAt: "2026-05-08",
    daysLeft: 26,
    status: "EXPIRING_SOON" as const,
    lastNotifiedAt: "2026-04-11",
    autoRenewable: true,
  },
];

type ExpiryStatus = "EXPIRING_SOON" | "EXPIRED" | "RENEWAL_PENDING";
type StatusFilter = "ALL" | ExpiryStatus;

export default function CRBExpiryPage() {
  const [selectedFilter, setSelectedFilter] = useState<StatusFilter>("ALL");
  const [selectedRow, setSelectedRow] = useState<(typeof demoRows)[0] | null>(null);

  // Filter rows
  const filtered =
    selectedFilter === "ALL"
      ? demoRows
      : demoRows.filter((r) => r.status === selectedFilter);

  // Sort by urgency (most urgent first)
  const sorted = [...filtered].sort((a, b) => {
    // Expired first, then by days left ascending
    if (a.daysLeft < 0 && b.daysLeft >= 0) return -1;
    if (a.daysLeft >= 0 && b.daysLeft < 0) return 1;
    return a.daysLeft - b.daysLeft;
  });

  // Stats
  const expiringCount = demoRows.filter((r) => r.status === "EXPIRING_SOON").length;
  const expiredCount = demoRows.filter((r) => r.status === "EXPIRED").length;
  const renewalPendingCount = demoRows.filter((r) => r.status === "RENEWAL_PENDING").length;
  const renewedCount = 12; /* auto-renewed historical count (not in current dataset) */

  const statusTone = (status: typeof demoRows[0]["status"]): "red" | "amber" | "teal" | "green" | "purple" => {
    if (status === "EXPIRED") return "red";
    if (status === "EXPIRING_SOON") return "amber";
    if (status === "RENEWAL_PENDING") return "teal";
    return "green";
  };

  return (
    <div className="min-h-screen bg-[#0C0E1A] p-4 md:p-8">
      {/* Hero */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Link href="/dmo" className="text-sm text-purple-400 hover:text-purple-300">
            DMO
          </Link>
          <span className="text-gray-600">/</span>
          <Link href="/dmo/crb" className="text-sm text-purple-400 hover:text-purple-300">
            CRB
          </Link>
          <span className="text-gray-600">/</span>
          <span className="text-sm text-gray-400">Expiry Tracker</span>
        </div>
        <h1 className="text-4xl font-bold text-white mb-2">CRB Expiry Tracker</h1>
        <p className="text-gray-400">
          Monitor certificates approaching expiration, already expired, and renewal pipeline.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <VerificationStatCard
          tone="amber"
          label="Expiring Soon"
          value={expiringCount}
          sub="within 30 days"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <VerificationStatCard
          tone="red"
          label="Already Expired"
          value={expiredCount}
          sub="require immediate action"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4v2m0 4v2M9 3h6a2 2 0 012 2v18a2 2 0 01-2 2H9a2 2 0 01-2-2V5a2 2 0 012-2z" />
            </svg>
          }
        />
        <VerificationStatCard
          tone="teal"
          label="Renewal Pending"
          value={renewalPendingCount}
          sub="in progress"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          }
        />
        <VerificationStatCard
          tone="green"
          label="Auto-Renewed"
          value={renewedCount}
          sub="valid + verified"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
      </div>

      {/* Severity Meter */}
      <div className="mb-8 p-6 bg-[#13162A] rounded-lg border border-[rgba(255,255,255,0.08)]">
        <SeverityMeter
          segments={[
            { label: "Expired", value: expiredCount, tone: "red" },
            { label: "Expiring Soon", value: expiringCount, tone: "amber" },
            { label: "Renewal Pending", value: renewalPendingCount, tone: "teal" },
            { label: "Valid", value: renewedCount, tone: "green" },
          ]}
        />
      </div>

      {/* Filter */}
      <div className="mb-6">
        <FilterChipRow
          value={selectedFilter}
          options={[
            { value: "ALL", label: `All (${demoRows.length})` },
            { value: "EXPIRING_SOON", label: `Expiring Soon (${expiringCount})` },
            { value: "EXPIRED", label: `Expired (${expiredCount})` },
            { value: "RENEWAL_PENDING", label: `Renewal Pending (${renewalPendingCount})` },
          ]}
          onChange={(value) => setSelectedFilter(value as StatusFilter)}
        />
      </div>

      {/* Row Grid */}
      <VerificationRowGrid
        rows={sorted}
        columns={[
          {
            key: "entityName",
            header: "Entity Name",
            width: "minmax(0,2fr)",
            render: (row) => (
              <button
                onClick={() => setSelectedRow(row)}
                className="text-white hover:text-[#7B6EF6] font-medium truncate"
              >
                {row.entityName}
              </button>
            ),
          },
          {
            key: "certId",
            header: "Certificate ID",
            width: "minmax(0,1.5fr)",
            render: (row) => <span className="text-gray-400 font-mono text-sm">{row.certId}</span>,
          },
          {
            key: "expiresAt",
            header: "Expires",
            width: "minmax(0,1.2fr)",
            render: (row) => <span className="text-gray-300">{row.expiresAt}</span>,
          },
          {
            key: "daysLeft",
            header: "Days Left",
            width: "minmax(0,1fr)",
            align: "center",
            render: (row) => (
              <span
                className={
                  row.daysLeft < 0
                    ? "text-[#F05858] font-semibold"
                    : row.daysLeft <= 7
                      ? "text-[#F0A030] font-semibold"
                      : "text-[#38C878]"
                }
              >
                {row.daysLeft < 0 ? `${row.daysLeft}` : `+${row.daysLeft}`}
              </span>
            ),
          },
          {
            key: "status",
            header: "Status",
            width: "minmax(0,1.5fr)",
            render: (row) => (
              <VerificationChip tone={statusTone(row.status)}>
                {row.status === "EXPIRED"
                  ? "Expired"
                  : row.status === "EXPIRING_SOON"
                    ? "Expiring Soon"
                    : row.status === "RENEWAL_PENDING"
                      ? "Renewal Pending"
                      : "Renewed"}
              </VerificationChip>
            ),
          },
        ]}
      />

      {/* Drawer */}
      {selectedRow && (
        <VerificationDrawer
          open={!!selectedRow}
          title={selectedRow.entityName}
          subtitle={selectedRow.certId}
          severity={selectedRow.status === "EXPIRED" ? "critical" : selectedRow.status === "EXPIRING_SOON" ? "warning" : "info"}
          children={
            <div className="space-y-6">
              {/* Certificate Detail */}
              <div>
                <h3 className="text-sm font-semibold text-gray-300 mb-3">Certificate Detail</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Expires</span>
                    <span className="text-white font-medium">{selectedRow.expiresAt}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Days Remaining</span>
                    <span
                      className={
                        selectedRow.daysLeft < 0
                          ? "text-[#F05858] font-semibold"
                          : selectedRow.daysLeft <= 7
                            ? "text-[#F0A030] font-semibold"
                            : "text-[#38C878]"
                      }
                    >
                      {selectedRow.daysLeft < 0 ? `${selectedRow.daysLeft} (overdue)` : `+${selectedRow.daysLeft}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Auto-Renewable</span>
                    <span className="text-white">{selectedRow.autoRenewable ? "Yes" : "No"}</span>
                  </div>
                </div>
              </div>

              {/* Renewal Timeline */}
              <div>
                <h3 className="text-sm font-semibold text-gray-300 mb-3">Renewal Timeline</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Last Notified</span>
                    <span className="text-white">{selectedRow.lastNotifiedAt}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Status</span>
                    <VerificationChip tone={statusTone(selectedRow.status)}>
                      {selectedRow.status === "EXPIRED"
                        ? "Expired"
                        : selectedRow.status === "EXPIRING_SOON"
                          ? "Expiring Soon"
                          : selectedRow.status === "RENEWAL_PENDING"
                            ? "Renewal Pending"
                            : "Renewed"}
                    </VerificationChip>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-[rgba(255,255,255,0.08)]">
                <p className="text-xs text-gray-500 mb-3">Recommended actions:</p>
                <ul className="text-xs text-gray-400 space-y-1">
                  {selectedRow.daysLeft < 0 && <li>• Initiate emergency renewal</li>}
                  {selectedRow.daysLeft <= 7 && selectedRow.daysLeft >= 0 && <li>• Schedule renewal immediately</li>}
                  {selectedRow.autoRenewable && <li>• Enable auto-renewal if not active</li>}
                  <li>• Verify latest documentation</li>
                </ul>
              </div>
            </div>
          }
          onClose={() => setSelectedRow(null)}
        />
      )}
    </div>
  );
}
