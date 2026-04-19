"use client";

/**
 * Up-Guard Security — DMO (2026-04-19)
 * Security signals, incident tracking, policy compliance
 */

import React from "react";
import Link from "next/link";
import { SectionHeader, VerificationStatCard } from "@/components/dmo/verification/VerificationUI";

export default function UpGuardOverview() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0C0E1A" }}>
      <div className="p-8 space-y-8">
        <SectionHeader title="Up-Guard Security" subtitle="Security monitoring and compliance management" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <VerificationStatCard icon="🔒" label="Security Score" value="94%" delta="Excellent" tone="success" />
          <VerificationStatCard icon="⚠️" label="Active Signals" value="7" delta="Monitored threats" tone="warning" />
          <VerificationStatCard icon="🚨" label="Incidents" value="2" delta="This month" tone="error" />
          <VerificationStatCard icon="📋" label="Compliance" value="98%" delta="Policy adherence" tone="success" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            href="/dmo/up-guard/signals"
            className="p-4 rounded-lg border text-center hover:bg-white/5 transition-all"
            style={{ backgroundColor: "#13162A", borderColor: "rgba(255, 255, 255, 0.08)" }}
          >
            <div className="text-xl mb-2">📡</div>
            <div className="text-xs font-semibold text-white">Security Signals</div>
          </Link>
          <Link
            href="/dmo/up-guard/incidents"
            className="p-4 rounded-lg border text-center hover:bg-white/5 transition-all"
            style={{ backgroundColor: "#13162A", borderColor: "rgba(255, 255, 255, 0.08)" }}
          >
            <div className="text-xl mb-2">🚨</div>
            <div className="text-xs font-semibold text-white">Incidents</div>
          </Link>
          <Link
            href="/dmo/up-guard/policy"
            className="p-4 rounded-lg border text-center hover:bg-white/5 transition-all"
            style={{ backgroundColor: "#13162A", borderColor: "rgba(255, 255, 255, 0.08)" }}
          >
            <div className="text-xl mb-2">📜</div>
            <div className="text-xs font-semibold text-white">Policy Rules</div>
          </Link>
          <Link
            href="/dmo/up-guard"
            className="p-4 rounded-lg border text-center hover:bg-white/5 transition-all"
            style={{ backgroundColor: "#13162A", borderColor: "rgba(255, 255, 255, 0.08)" }}
          >
            <div className="text-xl mb-2">⚙️</div>
            <div className="text-xs font-semibold text-white">Settings</div>
          </Link>
        </div>

        <div
          className="p-6 rounded-lg border"
          style={{
            backgroundColor: "#13162A",
            borderColor: "rgba(255, 255, 255, 0.08)",
          }}
        >
          <h3 className="text-sm font-semibold text-white mb-4">Security Health</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-xs text-gray-400">Data Protection</span>
                <span className="text-xs font-bold text-emerald-400">100%</span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full w-full bg-emerald-500 rounded-full" />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-xs text-gray-400">Access Control</span>
                <span className="text-xs font-bold text-emerald-400">96%</span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full w-96/100 bg-emerald-500 rounded-full" />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-xs text-gray-400">Threat Detection</span>
                <span className="text-xs font-bold text-amber-400">88%</span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full w-88/100 bg-amber-500 rounded-full" />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-xs text-gray-400">Incident Response</span>
                <span className="text-xs font-bold text-purple-400">92%</span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full w-92/100 bg-purple-500 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
