"use client";

/**
 * Content Moderation — DMO (2026-04-19)
 */

import React from "react";
import { SectionHeader, VerificationStatCard, VerificationChip } from "@/components/dmo/verification/VerificationUI";

interface FlaggedContent {
  id: string;
  reportedBy: string;
  content: string;
  reason: "spam" | "abuse" | "illegal" | "explicit" | "misleading";
  status: "pending" | "reviewed" | "approved" | "removed";
  flaggedAt: string;
}

const MOCK_CONTENT: FlaggedContent[] = [
  {
    id: "MOD-8801",
    reportedBy: "user@example.com",
    content: "Product review on KarachiKart",
    reason: "abuse",
    status: "pending",
    flaggedAt: "2026-04-18",
  },
  {
    id: "MOD-8800",
    reportedBy: "admin@example.pk",
    content: "Profile comment on OLS Lahore",
    reason: "spam",
    status: "reviewed",
    flaggedAt: "2026-04-17",
  },
  {
    id: "MOD-8799",
    reportedBy: "user@example.pk",
    content: "Travel itinerary description",
    reason: "misleading",
    status: "approved",
    flaggedAt: "2026-04-16",
  },
  {
    id: "MOD-8798",
    reportedBy: "moderator@example.com",
    content: "Course description on HPS",
    reason: "illegal",
    status: "removed",
    flaggedAt: "2026-04-15",
  },
];

const getReasonColor = (r: string) => {
  switch (r) {
    case "abuse":
      return "bg-red-900/40 border-red-500/40 text-red-300";
    case "spam":
      return "bg-orange-900/40 border-orange-500/40 text-orange-300";
    case "illegal":
      return "bg-purple-900/40 border-purple-500/40 text-purple-300";
    case "explicit":
      return "bg-red-900/40 border-red-500/40 text-red-300";
    case "misleading":
      return "bg-amber-900/40 border-amber-500/40 text-amber-300";
    default:
      return "bg-gray-900/40 border-gray-500/40 text-gray-300";
  }
};

const getStatusColor = (s: string) => {
  switch (s) {
    case "pending":
      return "bg-blue-900/40 border-blue-500/40 text-blue-300";
    case "reviewed":
      return "bg-purple-900/40 border-purple-500/40 text-purple-300";
    case "approved":
      return "bg-emerald-900/40 border-emerald-500/40 text-emerald-300";
    case "removed":
      return "bg-red-900/40 border-red-500/40 text-red-300";
    default:
      return "bg-gray-900/40 border-gray-500/40 text-gray-300";
  }
};

export default function ContentModeration() {
  const pendingReview = MOCK_CONTENT.filter((c) => c.status === "pending").length;
  const totalReviewed = MOCK_CONTENT.filter((c) => c.status !== "pending").length;

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0C0E1A" }}>
      <div className="p-8 space-y-8">
        <SectionHeader title="Content Moderation" subtitle="Review and moderate user-generated content" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <VerificationStatCard icon="📋" label="Pending Review" value={pendingReview.toString()} delta="Requires action" tone="warning" />
          <VerificationStatCard icon="✓" label="Reviewed" value={totalReviewed.toString()} delta="All processed" tone="success" />
          <VerificationStatCard icon="🚫" label="Removed" value="1" delta="Policy violations" tone="error" />
        </div>

        <div className="space-y-3">
          {MOCK_CONTENT.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-lg transition-all hover:bg-white/5"
              style={{ backgroundColor: "#13162A", borderColor: "rgba(255, 255, 255, 0.08)", border: "1px solid" }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex gap-2 items-center mb-1">
                    <span className="text-sm font-semibold text-white">{item.id}</span>
                    <VerificationChip label={item.reason.toUpperCase()} className={getReasonColor(item.reason)} />
                    <VerificationChip label={item.status.toUpperCase()} className={getStatusColor(item.status)} />
                  </div>
                  <p className="text-sm text-gray-300">{item.content}</p>
                  <p className="text-xs text-gray-500 mt-1">Reported by {item.reportedBy}</p>
                </div>
                <div className="text-right text-xs text-gray-500">{item.flaggedAt}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
