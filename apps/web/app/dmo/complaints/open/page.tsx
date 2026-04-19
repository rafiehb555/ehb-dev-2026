"use client";

/**
 * Open Complaints Table — DMO (2026-04-19)
 */

import React, { useState } from "react";
import { SectionHeader, VerificationChip } from "@/components/dmo/verification/VerificationUI";

interface OpenComplaint {
  id: string;
  user: string;
  against: string;
  type: string;
  priority: "low" | "medium" | "high" | "urgent";
  created: string;
  slaHours: number;
  slaRemaining: number;
}

const MOCK_OPEN: OpenComplaint[] = [
  {
    id: "CX-9801",
    user: "sara.khan@example.pk",
    against: "KarachiKart Merchants",
    type: "Counterfeit Product",
    priority: "urgent",
    created: "2026-04-18",
    slaHours: 48,
    slaRemaining: 8,
  },
  {
    id: "CX-9800",
    user: "hassan.ali@example.com",
    against: "OLS Lahore Legal",
    type: "Missed Deadline",
    priority: "high",
    created: "2026-04-18",
    slaHours: 72,
    slaRemaining: 42,
  },
  {
    id: "CX-9799",
    user: "zainab.travel@example.com",
    against: "AGTS Skyline",
    type: "Service Change",
    priority: "medium",
    created: "2026-04-18",
    slaHours: 96,
    slaRemaining: 78,
  },
  {
    id: "CX-9798",
    user: "dr.ahmed@clinic.pk",
    against: "WMS Health Plus",
    type: "Quality Issue",
    priority: "high",
    created: "2026-04-17",
    slaHours: 72,
    slaRemaining: 38,
  },
];

const getPriorityColor = (p: string) => {
  switch (p) {
    case "urgent":
      return "bg-red-900/40 border-red-500/40 text-red-300";
    case "high":
      return "bg-orange-900/40 border-orange-500/40 text-orange-300";
    case "medium":
      return "bg-amber-900/40 border-amber-500/40 text-amber-300";
    default:
      return "bg-blue-900/40 border-blue-500/40 text-blue-300";
  }
};

export default function OpenComplaints() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0C0E1A" }}>
      <div className="p-8 space-y-8">
        <SectionHeader title="Open Complaints" subtitle="Active cases requiring immediate attention" />

        <div className="space-y-3">
          {MOCK_OPEN.map((complaint) => (
            <div
              key={complaint.id}
              onClick={() => setSelectedId(complaint.id)}
              className="p-4 rounded-lg cursor-pointer transition-all hover:bg-white/5"
              style={{ backgroundColor: "#13162A", borderColor: "rgba(255, 255, 255, 0.08)", border: "1px solid" }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex gap-2 items-center mb-1">
                    <span className="text-sm font-semibold text-white">{complaint.id}</span>
                    <VerificationChip label={complaint.priority.toUpperCase()} className={getPriorityColor(complaint.priority)} />
                  </div>
                  <p className="text-sm text-gray-300">{complaint.type}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {complaint.user} vs {complaint.against}
                  </p>
                </div>
                <div className="text-right">
                  <div
                    className={`text-xs font-bold ${
                      complaint.slaRemaining < 12
                        ? "text-red-400"
                        : complaint.slaRemaining < 24
                          ? "text-amber-400"
                          : "text-emerald-400"
                    }`}
                  >
                    {complaint.slaRemaining}h left
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{complaint.created}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
