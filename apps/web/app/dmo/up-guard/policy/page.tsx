"use client";

import React, { useState } from "react";
import { SectionHeader } from "@/components/dmo/verification/VerificationUI";

interface PolicyRule {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  category: string;
}

const MOCK_POLICIES: PolicyRule[] = [
  {
    id: "POL-7001",
    name: "Max Login Attempts",
    description: "Limit failed login attempts to 5 per hour",
    enabled: true,
    category: "Access Control",
  },
  {
    id: "POL-7000",
    name: "Data Encryption",
    description: "Enforce TLS 1.3 for all data in transit",
    enabled: true,
    category: "Data Protection",
  },
  {
    id: "POL-6999",
    name: "Session Timeout",
    description: "Automatically logout inactive users after 30 minutes",
    enabled: true,
    category: "Access Control",
  },
  {
    id: "POL-6998",
    name: "Rate Limiting",
    description: "Limit API requests to 1000 per minute per user",
    enabled: false,
    category: "Performance",
  },
];

export default function PolicyRules() {
  const [policies, setPolicies] = useState(MOCK_POLICIES);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0C0E1A" }}>
      <div className="p-8 space-y-8">
        <SectionHeader title="Policy Rules" subtitle="Security policy configuration and compliance" />

        <div className="space-y-3">
          {policies.map((policy) => (
            <div
              key={policy.id}
              className="p-4 rounded-lg transition-all hover:bg-white/5 flex items-start justify-between"
              style={{ backgroundColor: "#13162A", borderColor: "rgba(255, 255, 255, 0.08)", border: "1px solid" }}
            >
              <div className="flex-1">
                <div className="flex gap-2 items-center mb-1">
                  <span className="text-sm font-semibold text-white">{policy.name}</span>
                  <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: "rgba(123, 110, 246, 0.2)", color: "#A098F8" }}>
                    {policy.category}
                  </span>
                </div>
                <p className="text-xs text-gray-500">{policy.description}</p>
              </div>
              <div className="ml-4">
                <button
                  onClick={() => setPolicies(policies.map((p) => (p.id === policy.id ? { ...p, enabled: !p.enabled } : p)))}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                    policy.enabled ? "bg-emerald-500/30 text-emerald-300" : "bg-gray-700/30 text-gray-400"
                  }`}
                >
                  {policy.enabled ? "Enabled" : "Disabled"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
