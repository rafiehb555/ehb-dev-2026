"use client";

/**
 * Task Queue — DMO (2026-04-19)
 * SLA-based priority routing and operator assignment
 */

import React from "react";
import { SectionHeader, VerificationStatCard, VerificationChip } from "@/components/dmo/verification/VerificationUI";

interface QueuedTask {
  id: string;
  module: string;
  type: string;
  priority: "low" | "medium" | "high" | "urgent";
  createdAt: string;
  assignedTo?: string;
  slaHours: number;
  timeInQueue: number;
}

const MOCK_QUEUE: QueuedTask[] = [
  {
    id: "TSK-3201",
    module: "complaints",
    type: "Escalation Review",
    priority: "urgent",
    createdAt: "2026-04-18T14:00:00Z",
    assignedTo: "operator@example.com",
    slaHours: 4,
    timeInQueue: 2,
  },
  {
    id: "TSK-3200",
    module: "fraud",
    type: "Risk Assessment",
    priority: "high",
    createdAt: "2026-04-18T12:00:00Z",
    assignedTo: "fraud.team@example.pk",
    slaHours: 8,
    timeInQueue: 4,
  },
  {
    id: "TSK-3199",
    module: "moderation",
    type: "Content Review",
    priority: "medium",
    createdAt: "2026-04-18T10:00:00Z",
    slaHours: 24,
    timeInQueue: 6,
  },
  {
    id: "TSK-3198",
    module: "appeals",
    type: "Appeal Decision",
    priority: "high",
    createdAt: "2026-04-17T16:00:00Z",
    slaHours: 48,
    timeInQueue: 22,
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
    case "low":
      return "bg-blue-900/40 border-blue-500/40 text-blue-300";
    default:
      return "bg-gray-900/40 border-gray-500/40 text-gray-300";
  }
};

export default function TaskQueue() {
  const totalInQueue = MOCK_QUEUE.length;
  const urgentTasks = MOCK_QUEUE.filter((t) => t.priority === "urgent").length;
  const avgWaitTime = "4.5h";

  const queueByModule = {
    complaints: MOCK_QUEUE.filter((t) => t.module === "complaints").length,
    fraud: MOCK_QUEUE.filter((t) => t.module === "fraud").length,
    moderation: MOCK_QUEUE.filter((t) => t.module === "moderation").length,
    appeals: MOCK_QUEUE.filter((t) => t.module === "appeals").length,
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0C0E1A" }}>
      <div className="p-8 space-y-8">
        <SectionHeader title="Task Queue" subtitle="SLA-based priority routing and assignments" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <VerificationStatCard icon="📋" label="Total in Queue" value={totalInQueue.toString()} delta="Pending tasks" tone="info" />
          <VerificationStatCard icon="🚨" label="Urgent" value={urgentTasks.toString()} delta="High priority" tone="error" />
          <VerificationStatCard icon="⏱" label="Avg Wait" value={avgWaitTime} delta="Time in queue" tone="warning" />
          <VerificationStatCard icon="👤" label="Operators" value="8" delta="Available" tone="success" />
        </div>

        <div
          className="p-6 rounded-lg border"
          style={{
            backgroundColor: "#13162A",
            borderColor: "rgba(255, 255, 255, 0.08)",
          }}
        >
          <h3 className="text-sm font-semibold text-white mb-4">Queue Depth by Module</h3>
          <div className="grid grid-cols-4 gap-4">
            {Object.entries(queueByModule).map(([module, count]) => (
              <div key={module} className="text-center">
                <div className="text-2xl font-bold text-purple-400">{count}</div>
                <p className="text-xs text-gray-400 mt-1 capitalize">{module}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {MOCK_QUEUE.map((task) => {
            const percentSLA = (task.timeInQueue / task.slaHours) * 100;
            return (
              <div
                key={task.id}
                className="p-4 rounded-lg transition-all hover:bg-white/5"
                style={{ backgroundColor: "#13162A", borderColor: "rgba(255, 255, 255, 0.08)", border: "1px solid" }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex gap-2 items-center mb-1">
                      <span className="text-sm font-semibold text-white">{task.id}</span>
                      <VerificationChip label={task.priority.toUpperCase()} className={getPriorityColor(task.priority)} />
                    </div>
                    <p className="text-sm text-gray-300">{task.type}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {task.module.toUpperCase()} {task.assignedTo ? `→ ${task.assignedTo}` : "→ Unassigned"}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className={`text-xs font-bold ${percentSLA > 75 ? "text-red-400" : percentSLA > 50 ? "text-amber-400" : "text-emerald-400"}`}>
                      {task.timeInQueue}h / {task.slaHours}h
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{Math.round(percentSLA)}% SLA</p>
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
