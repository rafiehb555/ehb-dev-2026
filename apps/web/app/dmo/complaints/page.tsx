"use client";

/**
 * Complaints Overview — DMO Phase 6 (2026-04-19)
 */

import React, { useMemo, useState } from "react";
import Link from "next/link";
import {
  VerificationStatCard,
  VerificationChip,
  SectionHeader,
} from "@/components/dmo/verification/VerificationUI";

type ComplaintSeverity = "low" | "medium" | "high" | "critical";
type ComplaintStatus = "open" | "investigating" | "resolved" | "escalated";

interface Complaint {
  id: string;
  filedBy: string;
  againstSeller: string;
  type: string;
  severity: ComplaintSeverity;
  status: ComplaintStatus;
  priority: "low" | "medium" | "high" | "urgent";
  createdAt: string;
  slaHours: number;
  slaRemaining: number;
}

const MOCK_COMPLAINTS: Complaint[] = [
  {
    id: "CX-9801",
    filedBy: "sara.khan@example.pk",
    againstSeller: "KarachiKart Merchants",
    type: "Counterfeit Product",
    severity: "critical",
    status: "escalated",
    priority: "urgent",
    createdAt: "2026-04-18T14:32:00Z",
    slaHours: 48,
    slaRemaining: 8,
  },
  {
    id: "CX-9800",
    filedBy: "hassan.ali@example.com",
    againstSeller: "OLS Lahore Legal",
    type: "Missed Deadline",
    severity: "high",
    status: "investigating",
    priority: "high",
    createdAt: "2026-04-18T10:15:00Z",
    slaHours: 72,
    slaRemaining: 42,
  },
  {
    id: "CX-9799",
    filedBy: "zainab.travel@example.com",
    againstSeller: "AGTS Skyline",
    type: "Service Change",
    severity: "medium",
    status: "open",
    priority: "medium",
    createdAt: "2026-04-18T09:20:00Z",
    slaHours: 96,
    slaRemaining: 78,
  },
];

export default function ComplaintsOverview() {
  const [filterSeverity, setFilterSeverity] = useState<ComplaintSeverity | "all">("all");

  const openCount = 12;
  const resolvedCount = 247;
  const escalatedCount = 3;
  const avgResolutionTime = "3.2 days";

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0C0E1A" }}>
      <div className="p-8 space-y-8">
        <SectionHeader title="Complaints Center" subtitle="Manage and resolve customer complaints" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <VerificationStatCard icon="📋" label="Open" value="12" delta="+2 this week" tone="warning" />
          <VerificationStatCard icon="✓" label="Resolved" value="247" delta="94% satisfaction" tone="success" />
          <VerificationStatCard icon="⏱" label="Avg Resolution" value="3.2d" delta="Target: 3 days" tone="info" />
          <VerificationStatCard icon="🚨" label="Escalated" value="3" delta="Urgent cases" tone="error" />
          <VerificationStatCard icon="⚡" label="SLA Breaches" value="3" delta="Overdue cases" tone="error" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            href="/dmo/complaints/open"
            className="p-4 rounded-lg border text-center hover:bg-white/5 transition-all"
            style={{ backgroundColor: "#13162A", borderColor: "rgba(255, 255, 255, 0.08)" }}
          >
            <div className="text-xl mb-2">📂</div>
            <div className="text-xs font-semibold text-white">Open Queue</div>
          </Link>
          <Link
            href="/dmo/complaints/history"
            className="p-4 rounded-lg border text-center hover:bg-white/5 transition-all"
            style={{ backgroundColor: "#13162A", borderColor: "rgba(255, 255, 255, 0.08)" }}
          >
            <div className="text-xl mb-2">📜</div>
            <div className="text-xs font-semibold text-white">History</div>
          </Link>
          <Link
            href="/dmo/complaints/appeals"
            className="p-4 rounded-lg border text-center hover:bg-white/5 transition-all"
            style={{ backgroundColor: "#13162A", borderColor: "rgba(255, 255, 255, 0.08)" }}
          >
            <div className="text-xl mb-2">⚖️</div>
            <div className="text-xs font-semibold text-white">Appeals</div>
          </Link>
          <Link
            href="/dmo/complaints/ladder"
            className="p-4 rounded-lg border text-center hover:bg-white/5 transition-all"
            style={{ backgroundColor: "#13162A", borderColor: "rgba(255, 255, 255, 0.08)" }}
          >
            <div className="text-xl mb-2">📊</div>
            <div className="text-xs font-semibold text-white">Penalty Ladder</div>
          </Link>
        </div>
      </div>
    </div>
  );
}
