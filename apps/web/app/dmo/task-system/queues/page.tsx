"use client";

import React from "react";
import { SectionHeader, VerificationStatCard } from "@/components/dmo/verification/VerificationUI";

interface QueueDepth {
  module: string;
  depth: number;
  avgWaitTime: string;
  icon: string;
}

const QUEUE_DEPTHS: QueueDepth[] = [
  { module: "Complaints", depth: 24, avgWaitTime: "2.3h", icon: "📋" },
  { module: "Fraud", depth: 8, avgWaitTime: "1.5h", icon: "🚨" },
  { module: "Moderation", depth: 15, avgWaitTime: "3.1h", icon: "🔍" },
  { module: "Appeals", depth: 5, avgWaitTime: "4.2h", icon: "⚖️" },
];

export default function QueueManagement() {
  const totalDepth = QUEUE_DEPTHS.reduce((s, q) => s + q.depth, 0);
  const avgWaitAll = "2.8h";

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0C0E1A" }}>
      <div className="p-8 space-y-8">
        <SectionHeader title="Queue Management" subtitle="Queue depth and wait time by module" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <VerificationStatCard icon="📊" label="Total Queued" value={totalDepth.toString()} delta="All modules" tone="info" />
          <VerificationStatCard icon="⏱" label="Avg Wait Time" value={avgWaitAll} delta="All queues" tone="warning" />
          <VerificationStatCard icon="👥" label="Operators Available" value="8" delta="Ready to work" tone="success" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {QUEUE_DEPTHS.map((queue) => (
            <div
              key={queue.module}
              className="p-4 rounded-lg border"
              style={{ backgroundColor: "#13162A", borderColor: "rgba(255, 255, 255, 0.08)" }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{queue.icon}</span>
                  <div>
                    <h3 className="text-sm font-semibold text-white">{queue.module}</h3>
                    <p className="text-xs text-gray-500">Depth: {queue.depth}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-purple-400">{queue.depth}</p>
                  <p className="text-xs text-gray-500">{queue.avgWaitTime} avg</p>
                </div>
              </div>
              <div
                className="h-2 bg-white/5 rounded-full overflow-hidden"
              >
                <div
                  className="h-full bg-purple-500 rounded-full"
                  style={{ width: `${(queue.depth / 30) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
