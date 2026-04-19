"use client";

import React from "react";
import { SectionHeader, VerificationChip } from "@/components/dmo/verification/VerificationUI";

interface Incident {
  id: string;
  title: string;
  severity: "low" | "medium" | "high" | "critical";
  status: "open" | "resolved" | "investigating";
  startedAt: string;
  affectedSystems: string;
}

const MOCK_INCIDENTS: Incident[] = [
  {
    id: "INC-1001",
    title: "Database Performance Degradation",
    severity: "high",
    status: "investigating",
    startedAt: "2026-04-18T12:00:00Z",
    affectedSystems: "API, Database",
  },
  {
    id: "INC-1000",
    title: "Payment Gateway Timeout",
    severity: "critical",
    status: "open",
    startedAt: "2026-04-18T08:30:00Z",
    affectedSystems: "Wallet, Payment",
  },
  {
    id: "INC-0999",
    title: "Email Service Outage",
    severity: "medium",
    status: "resolved",
    startedAt: "2026-04-17T14:15:00Z",
    affectedSystems: "Notifications",
  },
];

const getSeverityColor = (s: string) => {
  switch (s) {
    case "critical":
      return "bg-red-900/40 border-red-500/40 text-red-300";
    case "high":
      return "bg-orange-900/40 border-orange-500/40 text-orange-300";
    case "medium":
      return "bg-amber-900/40 border-amber-500/40 text-amber-300";
    case "low":
      return "bg-blue-900/40 border-blue-500/40 text-blue-300";
    default:
      return "bg-gray-900/40 border-gray-500/40 text-gray-300";
  }
};

const getStatusColor = (s: string) => {
  switch (s) {
    case "open":
      return "bg-red-900/40 border-red-500/40 text-red-300";
    case "investigating":
      return "bg-purple-900/40 border-purple-500/40 text-purple-300";
    case "resolved":
      return "bg-emerald-900/40 border-emerald-500/40 text-emerald-300";
    default:
      return "bg-gray-900/40 border-gray-500/40 text-gray-300";
  }
};

export default function Incidents() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0C0E1A" }}>
      <div className="p-8 space-y-8">
        <SectionHeader title="Incidents" subtitle="System incident log with status tracking" />

        <div className="space-y-3">
          {MOCK_INCIDENTS.map((incident) => (
            <div
              key={incident.id}
              className="p-4 rounded-lg transition-all hover:bg-white/5"
              style={{ backgroundColor: "#13162A", borderColor: "rgba(255, 255, 255, 0.08)", border: "1px solid" }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex gap-2 items-center mb-1">
                    <span className="text-sm font-semibold text-white">{incident.id}</span>
                    <VerificationChip label={incident.severity.toUpperCase()} className={getSeverityColor(incident.severity)} />
                    <VerificationChip label={incident.status.toUpperCase()} className={getStatusColor(incident.status)} />
                  </div>
                  <p className="text-sm text-gray-300">{incident.title}</p>
                  <p className="text-xs text-gray-500 mt-1">Systems: {incident.affectedSystems}</p>
                </div>
                <div className="text-right text-xs text-gray-500">{incident.startedAt.split("T")[0]}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
