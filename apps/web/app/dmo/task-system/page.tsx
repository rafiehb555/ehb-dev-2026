"use client";

/**
 * Task System — DMO Inbox (2026-04-19)
 * Tasks assigned to current operator, priority sorted
 */

import React from "react";
import Link from "next/link";
import { SectionHeader, VerificationStatCard, VerificationChip } from "@/components/dmo/verification/VerificationUI";

interface Task {
  id: string;
  title: string;
  module: string;
  priority: "low" | "medium" | "high" | "urgent";
  dueAt: string;
  assignedAt: string;
}

const MOCK_TASKS: Task[] = [
  {
    id: "TSK-5001",
    title: "Review escalated complaint",
    module: "complaints",
    priority: "urgent",
    dueAt: "2026-04-18T16:00:00Z",
    assignedAt: "2026-04-18T14:00:00Z",
  },
  {
    id: "TSK-5000",
    title: "Assess fraud risk",
    module: "fraud",
    priority: "high",
    dueAt: "2026-04-19T12:00:00Z",
    assignedAt: "2026-04-18T10:00:00Z",
  },
  {
    id: "TSK-4999",
    title: "Moderate content flag",
    module: "moderation",
    priority: "medium",
    dueAt: "2026-04-19T18:00:00Z",
    assignedAt: "2026-04-18T09:00:00Z",
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

export default function TaskSystem() {
  const totalTasks = MOCK_TASKS.length;
  const overdueTasks = 1;

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0C0E1A" }}>
      <div className="p-8 space-y-8">
        <SectionHeader title="My Tasks" subtitle="Inbox of assigned tasks, priority sorted" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <VerificationStatCard icon="📥" label="Inbox" value={totalTasks.toString()} delta="Assigned tasks" tone="info" />
          <VerificationStatCard icon="⏰" label="Overdue" value={overdueTasks.toString()} delta="Requires action" tone="error" />
          <VerificationStatCard icon="✓" label="Completed" value="12" delta="This week" tone="success" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            href="/dmo/task-system/queues"
            className="p-4 rounded-lg border text-center hover:bg-white/5 transition-all"
            style={{ backgroundColor: "#13162A", borderColor: "rgba(255, 255, 255, 0.08)" }}
          >
            <div className="text-xl mb-2">📊</div>
            <div className="text-xs font-semibold text-white">Queue Status</div>
          </Link>
          <Link
            href="/dmo/task-system/sla"
            className="p-4 rounded-lg border text-center hover:bg-white/5 transition-all"
            style={{ backgroundColor: "#13162A", borderColor: "rgba(255, 255, 255, 0.08)" }}
          >
            <div className="text-xl mb-2">⏱</div>
            <div className="text-xs font-semibold text-white">SLA Monitor</div>
          </Link>
          <Link
            href="/dmo/task-system/routing"
            className="p-4 rounded-lg border text-center hover:bg-white/5 transition-all"
            style={{ backgroundColor: "#13162A", borderColor: "rgba(255, 255, 255, 0.08)" }}
          >
            <div className="text-xl mb-2">🔀</div>
            <div className="text-xs font-semibold text-white">Routing</div>
          </Link>
          <Link
            href="/dmo/task-system"
            className="p-4 rounded-lg border text-center hover:bg-white/5 transition-all"
            style={{ backgroundColor: "#13162A", borderColor: "rgba(255, 255, 255, 0.08)" }}
          >
            <div className="text-xl mb-2">⚙️</div>
            <div className="text-xs font-semibold text-white">Settings</div>
          </Link>
        </div>

        <div className="space-y-3">
          {MOCK_TASKS.sort((a, b) => {
            const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
            return priorityOrder[a.priority as keyof typeof priorityOrder] - priorityOrder[b.priority as keyof typeof priorityOrder];
          }).map((task) => (
            <div
              key={task.id}
              className="p-4 rounded-lg transition-all hover:bg-white/5 cursor-pointer"
              style={{ backgroundColor: "#13162A", borderColor: "rgba(255, 255, 255, 0.08)", border: "1px solid" }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex gap-2 items-center mb-1">
                    <span className="text-sm font-semibold text-white">{task.id}</span>
                    <VerificationChip label={task.priority.toUpperCase()} className={getPriorityColor(task.priority)} />
                    <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: "rgba(123, 110, 246, 0.2)", color: "#A098F8" }}>
                      {task.module}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300">{task.title}</p>
                </div>
                <div className="text-right text-xs text-gray-500">
                  <p>Due: {task.dueAt.split("T")[0]}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
