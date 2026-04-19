"use client";

/**
 * Fraud Dashboard — DMO (2026-04-19)
 */

import React, { useState } from "react";
import { SectionHeader, VerificationStatCard, VerificationChip } from "@/components/dmo/verification/VerificationUI";

interface FlaggedAccount {
  id: string;
  email: string;
  fraudType: string;
  riskScore: number;
  flaggedAt: string;
  action: "investigating" | "blocked" | "watching";
}

const MOCK_FLAGS: FlaggedAccount[] = [
  {
    id: "USR-7841",
    email: "suspect1@example.com",
    fraudType: "Chargeback Abuse",
    riskScore: 94,
    flaggedAt: "2026-04-18",
    action: "blocked",
  },
  {
    id: "USR-7842",
    email: "suspect2@example.pk",
    fraudType: "Payment Manipulation",
    riskScore: 87,
    flaggedAt: "2026-04-17",
    action: "investigating",
  },
  {
    id: "USR-7843",
    email: "suspect3@example.com",
    fraudType: "Refund Fraud",
    riskScore: 72,
    flaggedAt: "2026-04-16",
    action: "watching",
  },
  {
    id: "USR-7844",
    email: "suspect4@example.pk",
    fraudType: "Identity Theft",
    riskScore: 88,
    flaggedAt: "2026-04-15",
    action: "blocked",
  },
];

const getRiskColor = (score: number) => {
  if (score >= 80) return "text-red-400";
  if (score >= 60) return "text-orange-400";
  if (score >= 40) return "text-amber-400";
  return "text-yellow-400";
};

const getActionColor = (action: string) => {
  switch (action) {
    case "blocked":
      return "bg-red-900/40 border-red-500/40 text-red-300";
    case "investigating":
      return "bg-orange-900/40 border-orange-500/40 text-orange-300";
    case "watching":
      return "bg-blue-900/40 border-blue-500/40 text-blue-300";
    default:
      return "bg-gray-900/40 border-gray-500/40 text-gray-300";
  }
};

export default function FraudDashboard() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0C0E1A" }}>
      <div className="p-8 space-y-8">
        <SectionHeader title="Fraud Detection" subtitle="Monitor flagged accounts and fraud patterns" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <VerificationStatCard icon="🚨" label="Flagged Accounts" value="4" delta="This month" tone="error" />
          <VerificationStatCard icon="🔒" label="Blocked" value="2" delta="Active blocks" tone="error" />
          <VerificationStatCard icon="🔍" label="Investigating" value="1" delta="Under review" tone="warning" />
          <VerificationStatCard icon="👁️" label="Watching" value="1" delta="Monitored" tone="warning" />
        </div>

        <div
          className="p-6 rounded-lg border"
          style={{
            backgroundColor: "#13162A",
            borderColor: "rgba(255, 255, 255, 0.08)",
          }}
        >
          <h3 className="text-sm font-semibold text-white mb-4">Risk Score Distribution</h3>
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-400">94</div>
              <p className="text-xs text-gray-400 mt-1">Highest Risk</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-400">87</div>
              <p className="text-xs text-gray-400 mt-1">High Risk</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-amber-400">72</div>
              <p className="text-xs text-gray-400 mt-1">Medium Risk</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">88</div>
              <p className="text-xs text-gray-400 mt-1">High Risk</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {MOCK_FLAGS.map((flag) => (
            <div
              key={flag.id}
              className="p-4 rounded-lg transition-all hover:bg-white/5"
              style={{ backgroundColor: "#13162A", borderColor: "rgba(255, 255, 255, 0.08)", border: "1px solid" }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex gap-2 items-center mb-1">
                    <span className="text-sm font-semibold text-white">{flag.id}</span>
                    <VerificationChip label={flag.action.toUpperCase()} className={getActionColor(flag.action)} />
                  </div>
                  <p className="text-sm text-gray-300">{flag.fraudType}</p>
                  <p className="text-xs text-gray-500 mt-1">{flag.email}</p>
                </div>
                <div className="text-right">
                  <div className={`text-lg font-bold ${getRiskColor(flag.riskScore)}`}>{flag.riskScore}</div>
                  <p className="text-xs text-gray-500 mt-1">Risk Score</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
