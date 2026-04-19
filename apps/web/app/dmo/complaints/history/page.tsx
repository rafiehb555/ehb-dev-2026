"use client";

/**
 * Resolved Complaints History — DMO (2026-04-19)
 */

import React, { useState } from "react";
import { SectionHeader, VerificationChip } from "@/components/dmo/verification/VerificationUI";

interface ResolvedComplaint {
  id: string;
  user: string;
  against: string;
  type: string;
  outcome: "dismissed" | "refund" | "penalty" | "resolved";
  resolvedAt: string;
  resolutionDays: number;
}

const MOCK_HISTORY: ResolvedComplaint[] = [
  {
    id: "CX-9650",
    user: "fatima.khan@example.com",
    against: "GoSellr Vendor",
    type: "Non-delivery",
    outcome: "refund",
    resolvedAt: "2026-04-15",
    resolutionDays: 5,
  },
  {
    id: "CX-9640",
    user: "ali.hassan@example.pk",
    against: "OLS Legal",
    type: "Breach",
    outcome: "penalty",
    resolvedAt: "2026-04-14",
    resolutionDays: 3,
  },
  {
    id: "CX-9630",
    user: "zara.malik@example.com",
    against: "AGTS Travel",
    type: "Service",
    outcome: "resolved",
    resolvedAt: "2026-04-13",
    resolutionDays: 2,
  },
  {
    id: "CX-9620",
    user: "hassan.khan@example.com",
    against: "WMS Clinic",
    type: "Quality",
    outcome: "resolved",
    resolvedAt: "2026-04-12",
    resolutionDays: 4,
  },
];

const getOutcomeColor = (o: string) => {
  switch (o) {
    case "refund":
      return "bg-emerald-900/40 border-emerald-500/40 text-emerald-300";
    case "penalty":
      return "bg-red-900/40 border-red-500/40 text-red-300";
    case "resolved":
      return "bg-purple-900/40 border-purple-500/40 text-purple-300";
    default:
      return "bg-gray-900/40 border-gray-500/40 text-gray-300";
  }
};

export default function ComplaintsHistory() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0C0E1A" }}>
      <div className="p-8 space-y-8">
        <SectionHeader title="Complaints History" subtitle="Resolved cases with outcomes" />

        <div className="space-y-3">
          {MOCK_HISTORY.map((complaint) => (
            <div
              key={complaint.id}
              className="p-4 rounded-lg transition-all hover:bg-white/5"
              style={{ backgroundColor: "#13162A", borderColor: "rgba(255, 255, 255, 0.08)", border: "1px solid" }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex gap-2 items-center mb-1">
                    <span className="text-sm font-semibold text-white">{complaint.id}</span>
                    <VerificationChip label={complaint.outcome.toUpperCase()} className={getOutcomeColor(complaint.outcome)} />
                  </div>
                  <p className="text-sm text-gray-300">{complaint.type}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {complaint.user} vs {complaint.against}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-emerald-400">{complaint.resolutionDays}d to resolve</div>
                  <p className="text-xs text-gray-500 mt-1">{complaint.resolvedAt}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
