"use client";

import React from "react";
import { SectionHeader, VerificationChip } from "@/components/dmo/verification/VerificationUI";

interface SLATask {
  id: string;
  title: string;
  slaHours: number;
  timeInQueue: number;
  status: "safe" | "warning" | "breached";
}

const MOCK_SLA_TASKS: SLATask[] = [
  {
    id: "TSK-6001",
    title: "Critical complaint review",
    slaHours: 4,
    timeInQueue: 3.5,
    status: "warning",
  },
  {
    id: "TSK-6000",
    title: "Fraud risk assessment",
    slaHours: 8,
    timeInQueue: 6,
    status: "safe",
  },
  {
    id: "TSK-5999",
    title: "Appeal decision overdue",
    slaHours: 48,
    timeInQueue: 52,
    status: "breached",
  },
  {
    id: "TSK-5998",
    title: "Content moderation",
    slaHours: 24,
    timeInQueue: 18,
    status: "safe",
  },
];

const getStatusColor = (s: string) => {
  switch (s) {
    case "safe":
      return "bg-emerald-900/40 border-emerald-500/40 text-emerald-300";
    case "warning":
      return "bg-amber-900/40 border-amber-500/40 text-amber-300";
    case "breached":
      return "bg-red-900/40 border-red-500/40 text-red-300";
    default:
      return "bg-gray-900/40 border-gray-500/40 text-gray-300";
  }
};

export default function SLAMonitor() {
  const safeCount = MOCK_SLA_TASKS.filter((t) => t.status === "safe").length;
  const warningCount = MOCK_SLA_TASKS.filter((t) => t.status === "warning").length;
  const breachedCount = MOCK_SLA_TASKS.filter((t) => t.status === "breached").length;

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0C0E1A" }}>
      <div className="p-8 space-y-8">
        <SectionHeader title="SLA Monitor" subtitle="Track task SLA timers and approaching breaches" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            className="p-4 rounded-lg border"
            style={{ backgroundColor: "#13162A", borderColor: "rgba(255, 255, 255, 0.08)" }}
          >
            <p className="text-xs text-gray-400 mb-1">Safe</p>
            <p className="text-2xl font-bold text-emerald-400">{safeCount}</p>
          </div>
          <div
            className="p-4 rounded-lg border"
            style={{ backgroundColor: "#13162A", borderColor: "rgba(255, 255, 255, 0.08)" }}
          >
            <p className="text-xs text-gray-400 mb-1">At Risk</p>
            <p className="text-2xl font-bold text-amber-400">{warningCount}</p>
          </div>
          <div
            className="p-4 rounded-lg border"
            style={{ backgroundColor: "#13162A", borderColor: "rgba(255, 255, 255, 0.08)" }}
          >
            <p className="text-xs text-gray-400 mb-1">Breached</p>
            <p className="text-2xl font-bold text-red-400">{breachedCount}</p>
          </div>
        </div>

        <div className="space-y-3">
          {MOCK_SLA_TASKS.map((task) => (
            <div
              key={task.id}
              className="p-4 rounded-lg transition-all hover:bg-white/5"
              style={{ backgroundColor: "#13162A", borderColor: "rgba(255, 255, 255, 0.08)", border: "1px solid" }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex gap-2 items-center mb-1">
                    <span className="text-sm font-semibold text-white">{task.id}</span>
                    <VerificationChip label={task.status.toUpperCase()} className={getStatusColor(task.status)} />
                  </div>
                  <p className="text-sm text-gray-300">{task.title}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-300">{task.timeInQueue}h / {task.slaHours}h</p>
                  <p className="text-xs text-gray-500 mt-1">{Math.round((task.timeInQueue / task.slaHours) * 100)}%</p>
                </div>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden mt-3">
                <div
                  className={`h-full ${task.status === "breached" ? "bg-red-500" : task.status === "warning" ? "bg-amber-500" : "bg-emerald-500"}`}
                  style={{ width: `${Math.min((task.timeInQueue / task.slaHours) * 100, 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
