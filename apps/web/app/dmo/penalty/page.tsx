"use client";

/**
 * Penalty Management — DMO (2026-04-19)
 */

import React from "react";
import { SectionHeader, VerificationStatCard, VerificationChip } from "@/components/dmo/verification/VerificationUI";

interface Penalty {
  id: string;
  user: string;
  type: "warning" | "stl_drop" | "suspension";
  severity: number;
  issuedAt: string;
  expiresAt: string;
  reason: string;
}

const MOCK_PENALTIES: Penalty[] = [
  {
    id: "PEN-5501",
    user: "vendor@example.pk",
    type: "stl_drop",
    severity: 2,
    issuedAt: "2026-04-15",
    expiresAt: "2026-07-15",
    reason: "3 complaints in 3 weeks",
  },
  {
    id: "PEN-5500",
    user: "seller@example.com",
    type: "warning",
    severity: 1,
    issuedAt: "2026-04-10",
    expiresAt: "2026-07-10",
    reason: "Quality complaint",
  },
  {
    id: "PEN-5499",
    user: "merchant@example.pk",
    type: "suspension",
    severity: 3,
    issuedAt: "2026-04-05",
    expiresAt: "2026-05-05",
    reason: "Fraud attempt",
  },
];

const getTypeColor = (t: string) => {
  switch (t) {
    case "warning":
      return "bg-amber-900/40 border-amber-500/40 text-amber-300";
    case "stl_drop":
      return "bg-orange-900/40 border-orange-500/40 text-orange-300";
    case "suspension":
      return "bg-red-900/40 border-red-500/40 text-red-300";
    default:
      return "bg-gray-900/40 border-gray-500/40 text-gray-300";
  }
};

export default function PenaltyManagement() {
  const activePenalties = MOCK_PENALTIES.length;
  const expiringIn7Days = MOCK_PENALTIES.filter((p) => {
    const expiry = new Date(p.expiresAt);
    const now = new Date();
    const days = (expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    return days <= 7 && days > 0;
  }).length;

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0C0E1A" }}>
      <div className="p-8 space-y-8">
        <SectionHeader title="Penalty Management" subtitle="Track active and expiring penalties" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <VerificationStatCard icon="⚠️" label="Active Penalties" value={activePenalties.toString()} delta="Currently enforced" tone="warning" />
          <VerificationStatCard icon="⏰" label="Expiring Soon" value={expiringIn7Days.toString()} delta="Next 7 days" tone="warning" />
          <VerificationStatCard icon="📋" label="Under Warning" value="24" delta="Monitoring" tone="info" />
        </div>

        <div className="space-y-3">
          {MOCK_PENALTIES.map((penalty) => {
            const expiry = new Date(penalty.expiresAt);
            const now = new Date();
            const daysLeft = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

            return (
              <div
                key={penalty.id}
                className="p-4 rounded-lg transition-all hover:bg-white/5"
                style={{ backgroundColor: "#13162A", borderColor: "rgba(255, 255, 255, 0.08)", border: "1px solid" }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex gap-2 items-center mb-1">
                      <span className="text-sm font-semibold text-white">{penalty.id}</span>
                      <VerificationChip label={penalty.type.toUpperCase()} className={getTypeColor(penalty.type)} />
                    </div>
                    <p className="text-sm text-gray-300">{penalty.user}</p>
                    <p className="text-xs text-gray-500 mt-1">{penalty.reason}</p>
                  </div>
                  <div className="text-right">
                    <div className={`text-xs font-bold ${daysLeft < 7 ? "text-red-400" : "text-emerald-400"}`}>
                      {daysLeft}d left
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Exp: {penalty.expiresAt}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
