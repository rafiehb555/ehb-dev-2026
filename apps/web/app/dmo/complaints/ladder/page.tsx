"use client";

/**
 * Penalty Ladder Visualization — DMO (2026-04-19)
 * 
 * Ladder: Warning 1 → Warning 2 → Warning 3 → -1 STL Level → -2 STL Levels → Suspension → Ban
 */

import React from "react";
import { SectionHeader } from "@/components/dmo/verification/VerificationUI";

interface LadderStage {
  step: number;
  name: string;
  description: string;
  usersAtStage: number;
  color: string;
  icon: string;
}

const LADDER_STAGES: LadderStage[] = [
  {
    step: 1,
    name: "Warning 1",
    description: "First offense - formal notice issued",
    usersAtStage: 45,
    color: "#F0A030",
    icon: "⚠️",
  },
  {
    step: 2,
    name: "Warning 2",
    description: "Second offense - escalated warning",
    usersAtStage: 28,
    color: "#FF8C42",
    icon: "⚠️⚠️",
  },
  {
    step: 3,
    name: "Warning 3",
    description: "Third offense - final warning before penalty",
    usersAtStage: 12,
    color: "#F05858",
    icon: "⚠️⚠️⚠️",
  },
  {
    step: 4,
    name: "-1 STL Level",
    description: "Penalty applied - STL dropped by 1 level",
    usersAtStage: 8,
    color: "#E04040",
    icon: "📉",
  },
  {
    step: 5,
    name: "-2 STL Levels",
    description: "Severe penalty - STL dropped by 2 levels",
    usersAtStage: 3,
    color: "#D02828",
    icon: "📉📉",
  },
  {
    step: 6,
    name: "Suspension",
    description: "Account suspended for 30 days",
    usersAtStage: 2,
    color: "#C01010",
    icon: "🔒",
  },
  {
    step: 7,
    name: "Ban",
    description: "Permanent account termination",
    usersAtStage: 1,
    color: "#900000",
    icon: "🚫",
  },
];

export default function PenaltyLadder() {
  const maxUsers = Math.max(...LADDER_STAGES.map((s) => s.usersAtStage));

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0C0E1A" }}>
      <div className="p-8 space-y-8">
        <SectionHeader title="Penalty Ladder" subtitle="Progressive enforcement scale - 3 complaints in 3 weeks = -2 STL levels" />

        <div className="space-y-6">
          {LADDER_STAGES.map((stage) => (
            <div key={stage.step}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{stage.icon}</span>
                  <div>
                    <h3 className="text-sm font-semibold text-white">{stage.name}</h3>
                    <p className="text-xs text-gray-500">{stage.description}</p>
                  </div>
                </div>
                <span className="text-sm font-bold" style={{ color: stage.color }}>
                  {stage.usersAtStage} users
                </span>
              </div>
              <div
                className="h-8 rounded-full overflow-hidden relative"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                }}
              >
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${(stage.usersAtStage / maxUsers) * 100}%`,
                    backgroundColor: stage.color + "40",
                    borderRight: `2px solid ${stage.color}`,
                  }}
                />
                <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-white pointer-events-none">
                  {stage.usersAtStage} / {maxUsers}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div
          className="p-6 rounded-lg border"
          style={{
            backgroundColor: "#13162A",
            borderColor: "rgba(255, 255, 255, 0.08)",
          }}
        >
          <h3 className="text-sm font-semibold text-white mb-4">Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div>
              <p className="text-gray-400">Total at risk</p>
              <p className="text-lg font-bold text-amber-400">{LADDER_STAGES.reduce((s, l) => s + l.usersAtStage, 0)}</p>
            </div>
            <div>
              <p className="text-gray-400">Pending suspension</p>
              <p className="text-lg font-bold text-red-400">2</p>
            </div>
            <div>
              <p className="text-gray-400">Banned users</p>
              <p className="text-lg font-bold text-red-600">1</p>
            </div>
            <div>
              <p className="text-gray-400">Warnings issued</p>
              <p className="text-lg font-bold text-orange-400">85</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
