"use client";

import React, { useState } from "react";
import { SectionHeader } from "@/components/dmo/verification/VerificationUI";

interface RoutingRule {
  id: string;
  name: string;
  condition: string;
  assignTo: string;
  enabled: boolean;
}

const MOCK_ROUTING: RoutingRule[] = [
  {
    id: "ROUTE-1001",
    name: "Urgent Complaints",
    condition: "Priority = Urgent + Module = Complaints",
    assignTo: "Senior Operator",
    enabled: true,
  },
  {
    id: "ROUTE-1000",
    name: "Fraud Cases",
    condition: "Module = Fraud",
    assignTo: "Fraud Team",
    enabled: true,
  },
  {
    id: "ROUTE-0999",
    name: "Moderation Queue",
    condition: "Module = Moderation",
    assignTo: "Round-robin Pool",
    enabled: true,
  },
  {
    id: "ROUTE-0998",
    name: "Load Balancing",
    condition: "Queue Depth > Threshold",
    assignTo: "Available Operator",
    enabled: false,
  },
];

export default function RoutingRules() {
  const [rules, setRules] = useState(MOCK_ROUTING);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0C0E1A" }}>
      <div className="p-8 space-y-8">
        <SectionHeader title="Routing Rules" subtitle="Auto-assignment and load balancing configuration" />

        <div className="space-y-3">
          {rules.map((rule) => (
            <div
              key={rule.id}
              className="p-4 rounded-lg transition-all hover:bg-white/5"
              style={{ backgroundColor: "#13162A", borderColor: "rgba(255, 255, 255, 0.08)", border: "1px solid" }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex gap-2 items-center mb-1">
                    <span className="text-sm font-semibold text-white">{rule.name}</span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        rule.enabled ? "bg-emerald-500/30 text-emerald-300" : "bg-gray-700/30 text-gray-400"
                      }`}
                    >
                      {rule.enabled ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Condition: {rule.condition}</p>
                  <p className="text-xs text-purple-300 mt-1">→ {rule.assignTo}</p>
                </div>
                <button
                  onClick={() => setRules(rules.map((r) => (r.id === rule.id ? { ...r, enabled: !r.enabled } : r)))}
                  className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-700/40 text-gray-300 hover:bg-gray-600/40"
                >
                  Toggle
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
