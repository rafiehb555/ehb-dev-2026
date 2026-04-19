"use client";

import Link from "next/link";
import { useState } from "react";
import {
  VerificationStatCard,
  VerificationChip,
  SectionHeader,
} from "@/components/dmo/verification/VerificationUI";

type FeatureFlag = {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  rollout: number;
  lastUpdated: string;
};

const FEATURE_FLAGS: FeatureFlag[] = [
  { id: "FF-001", name: "STL Auto-Recalc", description: "Automatic nightly STL recalculation for all sellers", enabled: true, rollout: 100, lastUpdated: "2026-04-11T14:30:00Z" },
  { id: "FF-002", name: "AI Fraud Detection v2", description: "Enhanced machine learning fraud scoring", enabled: true, rollout: 85, lastUpdated: "2026-04-10T09:15:00Z" },
  { id: "FF-003", name: "CRB Document OCR", description: "Automated document scanning and verification", enabled: false, rollout: 45, lastUpdated: "2026-04-09T16:20:00Z" },
  { id: "FF-004", name: "Multi-currency Wallet", description: "Support for USD, EUR, GBP, PKR transactions", enabled: true, rollout: 100, lastUpdated: "2026-04-08T11:00:00Z" },
  { id: "FF-005", name: "PSS Biometric Liveness", description: "3D face liveness detection with spoofing prevention", enabled: true, rollout: 92, lastUpdated: "2026-04-07T13:45:00Z" },
  { id: "FF-006", name: "Webhook Signing v3", description: "Ed25519 cryptographic signature verification", enabled: false, rollout: 20, lastUpdated: "2026-04-06T10:30:00Z" },
];

const ANNOUNCEMENTS = [
  { id: "GA-001", title: "Maintenance Window Scheduled", message: "Platform maintenance on 2026-04-20 22:00-02:00 UTC. All services will be offline.", severity: "warning", createdAt: "2026-04-12T09:00:00Z", active: true },
  { id: "GA-002", title: "STL Formula Update", message: "STL calculation now weights recent activity 30% more heavily. Review impact in analytics.", severity: "info", createdAt: "2026-04-11T14:30:00Z", active: true },
  { id: "GA-003", title: "Critical Security Patch", message: "All DMO operators must re-authenticate within 2 hours. New session security protocol active.", severity: "critical", createdAt: "2026-04-10T08:15:00Z", active: true },
];

const DEPLOYMENT_INFO = {
  version: "v4.2.1-prod",
  uptime: "18d 4h 23m",
  replicas: 8,
};

function fmtTime(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

function StatBox({ label, value, unit, status }: { label: string; value: string | number; unit?: string; status: "healthy" | "warning" | "critical" }) {
  const statusColor = status === "healthy" ? "text-[#38C878]" : status === "warning" ? "text-[#F0A030]" : "text-[#F05858]";
  return (
    <div className="rounded-xl border border-white/8 bg-white/[0.03] p-3">
      <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/45">{label}</p>
      <p className={`mt-1 text-lg font-bold ${statusColor}`}>
        {value}
        {unit && <span className="ml-1 text-[11px] font-normal text-white/60">{unit}</span>}
      </p>
    </div>
  );
}

export default function SuperAdminPage() {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="space-y-6">
      <header className="relative overflow-hidden rounded-2xl border border-[#F05858]/30 bg-gradient-to-br from-[#13162A] via-[#1A1D33] to-[#13162A] p-6 pt-[22px]">
        <div className="pointer-events-none absolute left-0 right-0 top-0 h-[3px]" style={{ background: "linear-gradient(90deg, transparent 0%, #F05858 25%, #F0A030 50%, #7B6EF6 75%, transparent 100%)" }} />
        <div className="pointer-events-none absolute left-3 top-3 h-6 w-6 border-l-[1.5px] border-t-[1.5px] border-[#F05858]/50" />
        <div className="pointer-events-none absolute bottom-3 right-3 h-6 w-6 border-b-[1.5px] border-r-[1.5px] border-[#7B6EF6]/45" />
        <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-gradient-to-br from-[#F05858]/20 via-[#F0A030]/15 to-transparent blur-3xl" />
        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 space-y-2">
            <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.22em]">
              <Link href="/dmo" className="text-white/40 hover:text-white/70 transition-colors">DMO</Link>
              <span className="text-white/25">/</span>
              <span className="text-[#F05858]">Super Admin</span>
            </div>
            <h1 className="text-2xl font-bold text-white md:text-3xl">Super Admin Panel</h1>
            <p className="max-w-2xl text-sm text-white/65">
              Platform-wide controls — maintenance mode, feature flags, global announcements, database health, deployment info. L10 SUPREME access only.
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5">
              <p className="text-[9px] font-mono text-[#F05858]">PRODUCTION</p>
            </div>
          </div>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <VerificationStatCard tone="purple" label="Version" value={DEPLOYMENT_INFO.version} sub="current build" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M12 2v20m-9-9h18" stroke="currentColor" strokeWidth="1.6" /></svg>} />
        <VerificationStatCard tone="teal" label="Uptime" value={DEPLOYMENT_INFO.uptime} sub="since last restart" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" /><path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>} />
        <VerificationStatCard tone="green" label="Replicas" value={DEPLOYMENT_INFO.replicas} sub="active backend pods" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><rect x="3" y="3" width="7" height="7" stroke="currentColor" strokeWidth="1.6" /><rect x="14" y="3" width="7" height="7" stroke="currentColor" strokeWidth="1.6" /><rect x="3" y="14" width="7" height="7" stroke="currentColor" strokeWidth="1.6" /></svg>} />
      </section>

      <section className="rounded-2xl border border-[#F05858]/20 bg-[#13162A]/70 p-5">
        <SectionHeader eyebrow="Platform" title="Critical Controls" hint="System-wide toggles requiring L10 approval" />
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between rounded-xl border border-white/8 bg-white/[0.03] p-4">
            <div>
              <p className="font-semibold text-white">Maintenance Mode</p>
              <p className="text-[12px] text-white/50">Disable all user traffic — show maintenance banner</p>
            </div>
            <button
              onClick={() => setMaintenanceMode(!maintenanceMode)}
              className={`relative h-6 w-11 rounded-full transition-colors ${maintenanceMode ? "bg-[#F05858]" : "border border-white/15 bg-white/5"}`}
            >
              <div className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-transform ${maintenanceMode ? "translate-x-5" : "translate-x-1"}`} />
            </button>
          </div>
          <div className="flex items-center justify-between rounded-xl border border-white/8 bg-white/[0.03] p-4">
            <div>
              <p className="font-semibold text-white">Read-Only Mode</p>
              <p className="text-[12px] text-white/50">Block all writes — data inspection only</p>
            </div>
            <button className="relative h-6 w-11 rounded-full border border-white/15 bg-white/5">
              <div className="absolute top-1 left-1 h-4 w-4 rounded-full bg-white" />
            </button>
          </div>
          <div className="flex items-center justify-between rounded-xl border border-white/8 bg-white/[0.03] p-4">
            <div>
              <p className="font-semibold text-white">Rate Limit Override</p>
              <p className="text-[12px] text-white/50">Temporarily disable rate limiting for all endpoints</p>
            </div>
            <button className="relative h-6 w-11 rounded-full border border-white/15 bg-white/5">
              <div className="absolute top-1 left-1 h-4 w-4 rounded-full bg-white" />
            </button>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-[#13162A]/70 p-5">
        <SectionHeader title="Global Announcements" hint="Broadcast to all users" right={<button className="text-[11px] font-semibold text-[#7B6EF6] hover:text-[#A098F8]">+ New</button>} />
        <div className="mt-4 space-y-3">
          {ANNOUNCEMENTS.map((ann) => {
            const severityColor = ann.severity === "critical" ? "border-[#F05858] bg-[#F05858]/8" : ann.severity === "warning" ? "border-[#F0A030] bg-[#F0A030]/8" : "border-[#2BBFA0] bg-[#2BBFA0]/8";
            const severityTone = ann.severity === "critical" ? "red" : ann.severity === "warning" ? "amber" : "teal";
            return (
              <div key={ann.id} className={`rounded-xl border ${severityColor} p-4`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-white">{ann.title}</p>
                    <p className="mt-1 text-[12px] text-white/70">{ann.message}</p>
                    <p className="mt-2 text-[10px] text-white/45">{fmtTime(ann.createdAt)}</p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-2">
                    <VerificationChip tone={severityTone as any}>{ann.severity}</VerificationChip>
                    <button className="text-[10px] text-white/50 hover:text-white/90">Edit</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-[#13162A]/70 p-5">
        <SectionHeader title="Database Health" hint="MongoDB cluster metrics" />
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <StatBox label="Total Records" value="2.4M" status="healthy" />
          <StatBox label="Storage Used" value="145" unit="GB" status="healthy" />
          <StatBox label="Avg Query Time" value="28" unit="ms" status="healthy" />
          <StatBox label="Connection Pool" value="87%" status="warning" />
          <StatBox label="Replication Lag" value="340" unit="ms" status="warning" />
          <StatBox label="Failed Backups (7d)" value="2" status="critical" />
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-[#13162A]/70 p-5">
        <SectionHeader title="Feature Flags" hint="Gradual rollout and A/B testing" right={<button className="text-[11px] font-semibold text-[#7B6EF6] hover:text-[#A098F8]">+ Create</button>} />
        <div className="mt-4 space-y-2">
          {FEATURE_FLAGS.map((flag) => (
            <div key={flag.id} className="rounded-xl border border-white/8 bg-white/[0.03] p-4 transition-colors hover:border-[#7B6EF6]/30 hover:bg-white/[0.05] cursor-pointer">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-white">{flag.name}</p>
                  <p className="text-[12px] text-white/60">{flag.description}</p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-2">
                  <div className="h-2 w-20 rounded-full border border-white/15 bg-white/5 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#7B6EF6] to-[#2BBFA0]" style={{ width: `${flag.rollout}%` }} />
                  </div>
                  <span className="text-[10px] text-white/50">{flag.rollout}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-[#13162A]/70 p-5">
        <SectionHeader title="User Impersonation" hint="Debug user sessions and issues" />
        <div className="mt-4 space-y-3">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by email, user ID, or franchise code..."
            className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/40 transition-colors focus:border-[#7B6EF6]/50 focus:outline-none"
          />
          {searchQuery && (
            <div className="space-y-2">
              {["user@example.com", "franchise.lead@ehb.com", "seller+verification@service.com"].map((email, i) => (
                <div key={i} className="flex items-center justify-between rounded-xl border border-white/8 bg-white/[0.03] p-3">
                  <div>
                    <p className="text-sm text-white">{email}</p>
                    <p className="text-[10px] text-white/45">ID: USR-{Math.random().toString(36).substring(7).toUpperCase()}</p>
                  </div>
                  <button className="rounded-lg border border-[#7B6EF6]/40 bg-[#7B6EF6]/12 px-2 py-1 text-[10px] font-semibold text-[#7B6EF6] transition-colors hover:border-[#7B6EF6]/70 hover:bg-[#7B6EF6]/20">
                    Impersonate
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

