"use client";

/**
 * PSS Fraud Detection Dashboard
 * DMO / PSS / Fraud module
 *
 * Displays active fraud alerts, blocked accounts, risk scores,
 * and AI detection accuracy. Filterable grid with drill-in drawer.
 *
 * Uses VerificationUI primitives (§7.1–7.7 EHB-UIUX-SYSTEM.md).
 */

import { useState } from "react";
import Link from "next/link";
import {
  VerificationStatCard,
  VerificationChip,
  VerificationRowGrid,
  VerificationDrawer,
  SectionHeader,
  SeverityMeter,
  FilterChipRow,
  type RowColumn,
  type VerificationTone,
} from "@/components/dmo/verification/VerificationUI";

/* ─────────────────────────────────────────────────────────────────── */
/* Types & Demo Data                                                    */
/* ─────────────────────────────────────────────────────────────────── */

type FraudAlert = {
  id: string;
  entityName: string;
  alertType:
    | "TRANSACTION_ANOMALY"
    | "IDENTITY_FRAUD"
    | "MULTI_ACCOUNT"
    | "BOT_ACTIVITY"
    | "PAYMENT_FRAUD";
  severity: "critical" | "high" | "medium" | "low";
  riskScore: number;
  status: "ACTIVE" | "INVESTIGATING" | "RESOLVED" | "FALSE_POSITIVE";
  detectedAt: string;
  region: string;
};

type FilterStatus = "ACTIVE" | "INVESTIGATING" | "RESOLVED" | "FALSE_POSITIVE" | "ALL";

const DEMO_ALERTS: FraudAlert[] = [
  {
    id: "alert-001",
    entityName: "User #84521",
    alertType: "TRANSACTION_ANOMALY",
    severity: "critical",
    riskScore: 94,
    status: "ACTIVE",
    detectedAt: "2026-04-12T14:32:00Z",
    region: "PK",
  },
  {
    id: "alert-002",
    entityName: "Merchant #2847",
    alertType: "MULTI_ACCOUNT",
    severity: "high",
    riskScore: 87,
    status: "ACTIVE",
    detectedAt: "2026-04-12T13:15:00Z",
    region: "IN",
  },
  {
    id: "alert-003",
    entityName: "User #51293",
    alertType: "IDENTITY_FRAUD",
    severity: "critical",
    riskScore: 91,
    status: "INVESTIGATING",
    detectedAt: "2026-04-12T11:48:00Z",
    region: "PK",
  },
  {
    id: "alert-004",
    entityName: "Bot Network #44",
    alertType: "BOT_ACTIVITY",
    severity: "high",
    riskScore: 85,
    status: "ACTIVE",
    detectedAt: "2026-04-12T10:22:00Z",
    region: "Global",
  },
  {
    id: "alert-005",
    entityName: "User #67891",
    alertType: "PAYMENT_FRAUD",
    severity: "medium",
    riskScore: 62,
    status: "RESOLVED",
    detectedAt: "2026-04-11T23:55:00Z",
    region: "US",
  },
  {
    id: "alert-006",
    entityName: "Vendor #5503",
    alertType: "TRANSACTION_ANOMALY",
    severity: "high",
    riskScore: 78,
    status: "INVESTIGATING",
    detectedAt: "2026-04-11T22:10:00Z",
    region: "AE",
  },
  {
    id: "alert-007",
    entityName: "User #92847",
    alertType: "MULTI_ACCOUNT",
    severity: "low",
    riskScore: 41,
    status: "FALSE_POSITIVE",
    detectedAt: "2026-04-11T20:35:00Z",
    region: "PK",
  },
  {
    id: "alert-008",
    entityName: "Service #7723",
    alertType: "IDENTITY_FRAUD",
    severity: "high",
    riskScore: 84,
    status: "ACTIVE",
    detectedAt: "2026-04-11T19:15:00Z",
    region: "IN",
  },
  {
    id: "alert-009",
    entityName: "User #51847",
    alertType: "BOT_ACTIVITY",
    severity: "medium",
    riskScore: 58,
    status: "RESOLVED",
    detectedAt: "2026-04-11T17:40:00Z",
    region: "PK",
  },
  {
    id: "alert-010",
    entityName: "Account #9847",
    alertType: "PAYMENT_FRAUD",
    severity: "critical",
    riskScore: 93,
    status: "INVESTIGATING",
    detectedAt: "2026-04-11T16:25:00Z",
    region: "Global",
  },
];

function getAlertTone(alert: FraudAlert): VerificationTone {
  if (alert.severity === "critical") return "red";
  if (alert.severity === "high") return "amber";
  if (alert.severity === "medium") return "cyan";
  return "teal";
}

function getStatusTone(status: FraudAlert["status"]): VerificationTone {
  if (status === "ACTIVE") return "red";
  if (status === "INVESTIGATING") return "amber";
  if (status === "RESOLVED") return "green";
  return "cyan";
}

function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const alertTypeLabels: Record<FraudAlert["alertType"], string> = {
  TRANSACTION_ANOMALY: "Transaction Anomaly",
  IDENTITY_FRAUD: "Identity Fraud",
  MULTI_ACCOUNT: "Multi-Account",
  BOT_ACTIVITY: "Bot Activity",
  PAYMENT_FRAUD: "Payment Fraud",
};

/* ─────────────────────────────────────────────────────────────────── */
/* Main Component                                                       */
/* ─────────────────────────────────────────────────────────────────── */

export default function FraudDetectionPage() {
  const [selectedAlert, setSelectedAlert] = useState<FraudAlert | null>(null);
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("ACTIVE");

  const filteredAlerts =
    statusFilter === "ALL"
      ? DEMO_ALERTS
      : DEMO_ALERTS.filter((a) => a.status === statusFilter);

  const activeCount = DEMO_ALERTS.filter((a) => a.status === "ACTIVE").length;
  const blockedCount = DEMO_ALERTS.filter((a) => a.severity === "critical").length;
  const fraudRate = (activeCount / DEMO_ALERTS.length * 100).toFixed(1);
  const aiAccuracy = 97.8;

  const columns: RowColumn<FraudAlert>[] = [
    {
      key: "entity",
      header: "Entity",
      width: "minmax(0, 1.8fr)",
      render: (row) => <span className="font-medium">{row.entityName}</span>,
    },
    {
      key: "type",
      header: "Alert Type",
      width: "minmax(0, 1.6fr)",
      render: (row) => (
        <div className="text-xs text-white/60">{alertTypeLabels[row.alertType]}</div>
      ),
    },
    {
      key: "risk",
      header: "Risk Score",
      width: "minmax(0, 1.2fr)",
      align: "center",
      render: (row) => (
        <span
          className="font-mono font-semibold"
          style={{ color: getAlertTone(row) }}
        >
          {row.riskScore}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      width: "minmax(0, 1.4fr)",
      render: (row) => (
        <VerificationChip tone={getStatusTone(row.status)} size="xs">
          {row.status}
        </VerificationChip>
      ),
    },
    {
      key: "region",
      header: "Region",
      width: "minmax(0, 0.9fr)",
      align: "center",
      render: (row) => <span className="text-xs text-white/60">{row.region}</span>,
    },
  ];

  return (
    <div className="min-h-screen bg-[#0C0E1A]">
      {/* ─ Hero header with gradient top bar ─ */}
      <div className="relative border-b border-white/8 bg-gradient-to-b from-[#13162A] via-[#0C0E1A] to-[#0C0E1A] px-4 py-6 sm:px-6 sm:py-8 md:px-8">
        <span
          className="pointer-events-none absolute top-0 left-0 right-0 h-[1px]"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(123,110,246,0.5) 50%, transparent 100%)",
          }}
        />

        {/* Breadcrumb */}
        <div className="mb-4 flex items-center gap-2 text-xs text-white/50">
          <Link href="/dmo" className="hover:text-white/80 transition-colors">
            DMO
          </Link>
          <span>/</span>
          <Link href="/dmo/pss" className="hover:text-white/80 transition-colors">
            PSS
          </Link>
          <span>/</span>
          <span className="text-white/75">Fraud Detection</span>
        </div>

        {/* Title */}
        <div className="mb-2 max-w-2xl">
          <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight">
            Fraud Detection
          </h1>
          <p className="mt-1 text-sm text-white/60">
            Monitor and manage fraud alerts in real-time. AI-powered detection with
            97.8% accuracy.
          </p>
        </div>

        {/* Corner brackets (top-left + bottom-right) */}
        <span
          className="pointer-events-none absolute top-4 left-4 h-3 w-3 opacity-40"
          style={{
            borderLeft: "1.5px solid #A098F8",
            borderTop: "1.5px solid #A098F8",
            borderTopLeftRadius: "3px",
          }}
        />
        <span
          className="pointer-events-none absolute bottom-4 right-4 h-3 w-3 opacity-40"
          style={{
            borderRight: "1.5px solid #A098F8",
            borderBottom: "1.5px solid #A098F8",
            borderBottomRightRadius: "3px",
          }}
        />

        {/* Ambient glow orb */}
        <span
          className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full opacity-[0.08] blur-3xl"
          style={{ background: "#7B6EF6" }}
        />
      </div>

      {/* ─ Stat cards ─ */}
      <div className="px-4 sm:px-6 md:px-8 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <VerificationStatCard
            icon={
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-5 w-5"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M12 2v20M7 7h10M7 12h10M7 17h10" />
              </svg>
            }
            label="Active Alerts"
            value={activeCount}
            sub="Requiring attention"
            tone="red"
          />
          <VerificationStatCard
            icon={
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-5 w-5"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <circle cx="12" cy="12" r="9" />
                <path d="M9 12l2 2 4-4" />
              </svg>
            }
            label="Blocked Accounts"
            value={blockedCount}
            sub="Critical severity"
            tone="amber"
          />
          <VerificationStatCard
            icon={
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-5 w-5"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
                <polyline points="13 2 13 9 20 9" />
              </svg>
            }
            label="Fraud Rate"
            value={`${fraudRate}%`}
            sub="Last 24 hours"
            tone="cyan"
          />
          <VerificationStatCard
            icon={
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-5 w-5"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
            }
            label="AI Accuracy"
            value={`${aiAccuracy}%`}
            sub="Detection confidence"
            tone="green"
          />
        </div>
      </div>

      {/* ─ Severity distribution meter ─ */}
      <div className="px-4 sm:px-6 md:px-8 py-6 border-t border-white/8">
        <SectionHeader
          title="Alert Distribution"
          hint="Breakdown by severity level"
        />
        <div className="rounded-2xl border border-white/10 bg-[#13162A]/50 backdrop-blur-sm p-4">
          <SeverityMeter
            segments={[
              {
                label: "Critical",
                value: DEMO_ALERTS.filter((a) => a.severity === "critical").length,
                tone: "red",
              },
              {
                label: "High",
                value: DEMO_ALERTS.filter((a) => a.severity === "high").length,
                tone: "amber",
              },
              {
                label: "Medium",
                value: DEMO_ALERTS.filter((a) => a.severity === "medium").length,
                tone: "cyan",
              },
              {
                label: "Low",
                value: DEMO_ALERTS.filter((a) => a.severity === "low").length,
                tone: "teal",
              },
            ]}
          />
        </div>
      </div>

      {/* ─ Alerts grid with filter ─ */}
      <div className="px-4 sm:px-6 md:px-8 py-6 border-t border-white/8">
        <SectionHeader
          title="Fraud Alerts"
          hint={`${filteredAlerts.length} alert${filteredAlerts.length !== 1 ? "s" : ""}`}
        />

        {/* Filter chips */}
        <div className="mb-4">
          <FilterChipRow<FilterStatus>
            value={statusFilter}
            options={[
              { value: "ALL", label: "All" },
              { value: "ACTIVE", label: "Active" },
              { value: "INVESTIGATING", label: "Investigating" },
              { value: "RESOLVED", label: "Resolved" },
              { value: "FALSE_POSITIVE", label: "False Positive" },
            ]}
            onChange={(v) => setStatusFilter(v)}
          />
        </div>

        {/* Row grid */}
        <VerificationRowGrid<FraudAlert>
          columns={columns}
          rows={filteredAlerts}
          getRowTone={getAlertTone}
          onRowClick={setSelectedAlert}
          emptyTitle="No fraud alerts found"
          emptyHint="All clear! No alerts match the current filter."
          emptyIcon={
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="h-6 w-6"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
          }
        />
      </div>

      {/* ─ Drawer: Alert details ─ */}
      <VerificationDrawer
        open={selectedAlert !== null}
        onClose={() => setSelectedAlert(null)}
        title={selectedAlert?.entityName ?? "Alert Details"}
        subtitle={selectedAlert ? alertTypeLabels[selectedAlert.alertType] : undefined}
        severity={selectedAlert?.severity === "critical" ? "critical" : selectedAlert?.severity === "high" ? "high" : "warning"}
      >
        {selectedAlert && (
          <div className="space-y-5">
            {/* Risk score card */}
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-white/50 mb-2">
                Risk Score
              </div>
              <div className="flex items-end gap-3">
                <span
                  className="text-4xl font-black tabular-nums"
                  style={{
                    color:
                      selectedAlert.severity === "critical"
                        ? "#F05858"
                        : "#F0A030",
                  }}
                >
                  {selectedAlert.riskScore}
                </span>
                <span className="text-xs text-white/50 mb-1">
                  {selectedAlert.riskScore > 80
                    ? "Critical Risk"
                    : selectedAlert.riskScore > 60
                    ? "High Risk"
                    : "Medium Risk"}
                </span>
              </div>
            </div>

            {/* Entity info */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-white">Entity Details</h3>
              <div className="text-xs space-y-1.5 text-white/60">
                <div className="flex justify-between">
                  <span>Name:</span>
                  <span className="text-white/80">{selectedAlert.entityName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Region:</span>
                  <span className="text-white/80">{selectedAlert.region}</span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <VerificationChip
                    tone={getStatusTone(selectedAlert.status)}
                    size="xs"
                  >
                    {selectedAlert.status}
                  </VerificationChip>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-white">Timeline</h3>
              <div className="text-xs space-y-2 text-white/60">
                <div className="flex gap-3">
                  <div className="h-2 w-2 rounded-full bg-red-500/60 mt-1 shrink-0" />
                  <div>
                    <div className="font-medium text-white/80">Alert Detected</div>
                    <div className="text-[10px] text-white/50">
                      {formatDate(selectedAlert.detectedAt)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recommended actions */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-white">
                Recommended Actions
              </h3>
              <ul className="text-xs text-white/60 space-y-1.5 list-disc list-inside">
                <li>Review transaction history</li>
                <li>Verify identity documents</li>
                <li>Contact entity for confirmation</li>
                <li>Place temporary hold if critical</li>
                <li>File incident report</li>
              </ul>
            </div>
          </div>
        )}
      </VerificationDrawer>
    </div>
  );
}
