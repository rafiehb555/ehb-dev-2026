"use client";

import React from "react";
import { SectionHeader, VerificationChip } from "@/components/dmo/verification/VerificationUI";

interface SecuritySignal {
  id: string;
  type: string;
  severity: "info" | "warning" | "critical";
  description: string;
  detectedAt: string;
  status: "active" | "resolved";
}

const MOCK_SIGNALS: SecuritySignal[] = [
  {
    id: "SIG-4201",
    type: "Unusual Login Pattern",
    severity: "warning",
    description: "Multiple login attempts from different geolocations",
    detectedAt: "2026-04-18T14:20:00Z",
    status: "active",
  },
  {
    id: "SIG-4200",
    type: "DDoS Detection",
    severity: "critical",
    description: "Spike in traffic from single IP address",
    detectedAt: "2026-04-18T10:15:00Z",
    status: "active",
  },
  {
    id: "SIG-4199",
    type: "Data Access Anomaly",
    severity: "warning",
    description: "Unusual database query patterns detected",
    detectedAt: "2026-04-17T16:45:00Z",
    status: "resolved",
  },
];

const getSeverityColor = (s: string) => {
  switch (s) {
    case "critical":
      return "bg-red-900/40 border-red-500/40 text-red-300";
    case "warning":
      return "bg-amber-900/40 border-amber-500/40 text-amber-300";
    case "info":
      return "bg-blue-900/40 border-blue-500/40 text-blue-300";
    default:
      return "bg-gray-900/40 border-gray-500/40 text-gray-300";
  }
};

const getStatusColor = (s: string) => {
  switch (s) {
    case "active":
      return "bg-orange-900/40 border-orange-500/40 text-orange-300";
    case "resolved":
      return "bg-emerald-900/40 border-emerald-500/40 text-emerald-300";
    default:
      return "bg-gray-900/40 border-gray-500/40 text-gray-300";
  }
};

export default function SecuritySignals() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0C0E1A" }}>
      <div className="p-8 space-y-8">
        <SectionHeader title="Security Signals" subtitle="Real-time threat detection feed" />

        <div className="space-y-3">
          {MOCK_SIGNALS.map((signal) => (
            <div
              key={signal.id}
              className="p-4 rounded-lg transition-all hover:bg-white/5"
              style={{ backgroundColor: "#13162A", borderColor: "rgba(255, 255, 255, 0.08)", border: "1px solid" }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex gap-2 items-center mb-1">
                    <span className="text-sm font-semibold text-white">{signal.id}</span>
                    <VerificationChip label={signal.severity.toUpperCase()} className={getSeverityColor(signal.severity)} />
                    <VerificationChip label={signal.status.toUpperCase()} className={getStatusColor(signal.status)} />
                  </div>
                  <p className="text-sm text-gray-300">{signal.type}</p>
                  <p className="text-xs text-gray-500 mt-1">{signal.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
