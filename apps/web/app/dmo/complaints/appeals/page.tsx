"use client";

/**
 * Appeals — DMO (2026-04-19)
 */

import React from "react";
import { SectionHeader, VerificationChip } from "@/components/dmo/verification/VerificationUI";

interface Appeal {
  id: string;
  originalComplaint: string;
  appealedBy: string;
  reason: string;
  status: "pending" | "approved" | "rejected";
  filedAt: string;
  decision?: string;
}

const MOCK_APPEALS: Appeal[] = [
  {
    id: "AP-2801",
    originalComplaint: "CX-9500",
    appealedBy: "vendor@example.pk",
    reason: "Incorrect penalty assessment",
    status: "pending",
    filedAt: "2026-04-17",
  },
  {
    id: "AP-2800",
    originalComplaint: "CX-9490",
    appealedBy: "customer@example.com",
    reason: "Insufficient resolution",
    status: "approved",
    filedAt: "2026-04-15",
    decision: "Appeal upheld - Refund increased by 25%",
  },
  {
    id: "AP-2799",
    originalComplaint: "CX-9480",
    appealedBy: "seller@example.pk",
    reason: "False allegations",
    status: "rejected",
    filedAt: "2026-04-14",
    decision: "Evidence confirms original finding",
  },
];

const getStatusColor = (s: string) => {
  switch (s) {
    case "pending":
      return "bg-blue-900/40 border-blue-500/40 text-blue-300";
    case "approved":
      return "bg-emerald-900/40 border-emerald-500/40 text-emerald-300";
    case "rejected":
      return "bg-red-900/40 border-red-500/40 text-red-300";
    default:
      return "bg-gray-900/40 border-gray-500/40 text-gray-300";
  }
};

export default function Appeals() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0C0E1A" }}>
      <div className="p-8 space-y-8">
        <SectionHeader title="Appeals" subtitle="User appeals against penalties and decisions" />

        <div className="space-y-3">
          {MOCK_APPEALS.map((appeal) => (
            <div
              key={appeal.id}
              className="p-4 rounded-lg transition-all hover:bg-white/5"
              style={{ backgroundColor: "#13162A", borderColor: "rgba(255, 255, 255, 0.08)", border: "1px solid" }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex gap-2 items-center mb-1">
                    <span className="text-sm font-semibold text-white">{appeal.id}</span>
                    <VerificationChip label={appeal.status.toUpperCase()} className={getStatusColor(appeal.status)} />
                  </div>
                  <p className="text-sm text-gray-300">Original: {appeal.originalComplaint}</p>
                  <p className="text-xs text-gray-500 mt-1">{appeal.reason}</p>
                  {appeal.decision && (
                    <p className="text-xs text-purple-300 mt-2">Decision: {appeal.decision}</p>
                  )}
                </div>
                <div className="text-right text-xs text-gray-500">{appeal.filedAt}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
