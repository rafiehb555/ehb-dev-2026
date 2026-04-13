"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import PSSDrawer from "@/components/dmo/PSSDrawer";
import { PssCapabilitiesSection } from "@/components/dmo/PssCapabilitiesSection";
import { RiskBadge } from "@/components/dmo/RiskBadge";
import { getPssDemoCases } from "@/lib/pss/pssDemoCases";
import { PSS_CAPABILITIES, PSS_CAPABILITY_CATEGORIES, type PssCapability } from "@/lib/pss/pssCapabilities";
import {
  VerificationStatCard,
  VerificationRowGrid,
  VerificationDrawer,
  VerificationChip,
  SectionHeader,
  SeverityMeter,
  type RowColumn,
  type VerificationTone,
} from "@/components/dmo/verification/VerificationUI";

type PssCase = {
  id: string;
  user: { name: string; email?: string | null };
  status: string;
  risk: string;
  stage: string;
  updatedAt: string;
  riskScore?: number;
};

export default function PSSPage() {
  const [selectedCapability, setSelectedCapability] = useState<PssCapability>(PSS_CAPABILITIES[0]);
  const [capabilityStatus, setCapabilityStatus] = useState<
    Record<string, { enabled: boolean; mode: "live" | "pilot" | "planned"; lastRunAt?: string; incidents: number }>
  >(() =>
    Object.fromEntries(
      PSS_CAPABILITIES.map((c) => [
        c.id,
        {
          enabled: c.category !== "operations",
          mode: c.category === "risk_signals" ? "pilot" : c.category === "operations" ? "planned" : "live",
          incidents: 0,
        },
      ])
    )
  );
  const [cases] = useState<PssCase[]>(() =>
    getPssDemoCases().map((d) => ({
      id: d.id,
      user: { name: d.user.name, email: d.user.email },
      status: d.status,
      risk: d.risk,
      stage: d.stage,
      updatedAt: d.updatedAt,
      riskScore: d.riskScore,
    }))
  );
  const [selected, setSelected] = useState<PssCase | null>(null);
  const [statDrawer, setStatDrawer] = useState<
    null | "modules" | "live" | "alerts"
  >(null);
  const [riskFilter, setRiskFilter] = useState<
    "ALL" | "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"
  >("ALL");

  const enabledCount = Object.values(capabilityStatus).filter((x) => x.enabled).length;
  const liveCount = Object.values(capabilityStatus).filter((x) => x.mode === "live").length;
  const incidentCount = Object.values(capabilityStatus).reduce((sum, x) => sum + x.incidents, 0);

  const riskBreakdown = useMemo(() => {
    const by: Record<string, number> = { LOW: 0, MEDIUM: 0, HIGH: 0, CRITICAL: 0 };
    for (const c of cases) {
      const k = (c.risk || "").toUpperCase();
      if (k in by) by[k] += 1;
    }
    return by;
  }, [cases]);

  const visibleCases = useMemo(() => {
    if (riskFilter === "ALL") return cases;
    return cases.filter((c) => (c.risk || "").toUpperCase() === riskFilter);
  }, [cases, riskFilter]);

  const selectedState = capabilityStatus[selectedCapability.id];

  function toggleCapability(id: string) {
    setCapabilityStatus((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        enabled: !prev[id].enabled,
      },
    }));
    /* demo toggle — no persistent state */
  }

  function runCapabilityCheck(id: string) {
    setCapabilityStatus((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        lastRunAt: new Date().toISOString(),
        incidents: prev[id].incidents + (prev[id].enabled ? 1 : 0),
      },
    }));
    /* demo run — timestamp updated locally */
  }

  return (
    <div className="space-y-6">
      <header className="relative overflow-hidden rounded-2xl border border-[#2BBFA0]/25 bg-gradient-to-br from-[#13162A] via-[#1A1D33] to-[#13162A] p-6">
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-gradient-to-br from-[#2BBFA0]/22 via-cyan-500/12 to-transparent blur-3xl" />
        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 space-y-2">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#2BBFA0]">
              Verification · PSS Engine
            </p>
            <h1 className="text-2xl font-bold text-white md:text-3xl">Personal Security System</h1>
            <p className="max-w-xl text-sm text-white/65">
              KYC, liveness, AML, ongoing monitoring, and risk signals — capability catalog
              neeche hai; uske baad live verification queue (DMO operators).
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/local-demo"
              className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-white/75 transition-colors hover:border-white/20 hover:bg-white/[0.07] hover:text-white"
            >
              Local demo
            </Link>
            <Link
              href="/dmo/queue"
              className="rounded-xl border border-[#2BBFA0]/45 bg-[#2BBFA0]/15 px-3 py-1.5 text-xs font-semibold text-[#2BBFA0] transition-colors hover:border-[#2BBFA0]/80 hover:bg-[#2BBFA0]/25 hover:text-white"
            >
              Operations Queue
            </Link>
          </div>
        </div>
      </header>

      <section className="grid gap-3 sm:grid-cols-3">
        <VerificationStatCard
          tone="purple"
          icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="1.5" /><path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" strokeWidth="1.5" /></svg>}
          label="Modules enabled"
          value={`${enabledCount}/${PSS_CAPABILITIES.length}`}
          sub="KYC · liveness · AML · monitoring"
          onClick={() => setStatDrawer("modules")}
        />
        <VerificationStatCard
          tone="teal"
          icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>}
          label="Live integrations"
          value={liveCount}
          sub="Production-mode providers"
          onClick={() => setStatDrawer("live")}
        />
        <VerificationStatCard
          tone="amber"
          icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="currentColor" strokeWidth="1.5" /><path d="M12 9v4M12 17h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>}
          label="Alerts (demo)"
          value={incidentCount}
          sub="Last 24 hours"
          onClick={() => setStatDrawer("alerts")}
        />
      </section>

        <PssCapabilitiesSection
          selectedCapabilityId={selectedCapability.id}
          onSelectCapability={setSelectedCapability}
          getCapabilityStatus={(id) => {
            const s = capabilityStatus[id];
            return s ? { enabled: s.enabled, mode: s.mode } : { enabled: false, mode: "planned" };
          }}
        />

        <section className="rounded-2xl border border-cyan-400/20 bg-gradient-to-b from-[#06152b]/95 to-[#040b16]/95 p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-[11px] uppercase tracking-[0.22em] text-cyan-300">Capability details</p>
              <h3 className="mt-1 text-xl font-semibold text-white">{selectedCapability.title}</h3>
              <p className="mt-1 text-xs uppercase tracking-wide text-white/50">
                {PSS_CAPABILITY_CATEGORIES[selectedCapability.category].label}
              </p>
              <p className="mt-3 text-sm text-white/70">
                <span className="text-white/90 font-medium">Purpose: </span>
                {selectedCapability.purpose}
              </p>
              <p className="mt-2 text-sm text-white/70">
                <span className="text-cyan-100/90 font-medium">Use case: </span>
                {selectedCapability.useCase}
              </p>
            </div>
            <div className="w-full max-w-sm space-y-2 rounded-xl border border-white/10 bg-black/20 p-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-white/50">State</span>
                <span
                  className={`rounded-full border px-2 py-0.5 font-semibold ${
                    selectedState?.enabled
                      ? "border-emerald-400/35 bg-emerald-500/15 text-emerald-100"
                      : "border-rose-400/35 bg-rose-500/10 text-rose-100"
                  }`}
                >
                  {selectedState?.enabled ? "Enabled" : "Disabled"}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-white/50">Mode</span>
                <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 uppercase text-white/70">
                  {selectedState?.mode ?? "planned"}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-white/50">Last run</span>
                <span className="text-white/70">
                  {selectedState?.lastRunAt
                    ? new Date(selectedState.lastRunAt).toLocaleTimeString()
                    : "Not yet"}
                </span>
              </div>
              <div className="pt-2 flex flex-wrap gap-2">
                <button
                  type="button"
                  className="rounded-xl border border-white/15 bg-white/[0.06] px-3 py-1.5 text-xs font-semibold text-white/75 transition-colors hover:border-white/25 hover:bg-white/[0.1] hover:text-white"
                  onClick={() => toggleCapability(selectedCapability.id)}
                >
                  {selectedState?.enabled ? "Disable module" : "Enable module"}
                </button>
                <button
                  type="button"
                  className="rounded-xl border border-[#2BBFA0]/50 bg-[#2BBFA0]/15 px-3 py-1.5 text-xs font-semibold text-[#2BBFA0] transition-colors hover:bg-[#2BBFA0]/25 hover:text-white"
                  onClick={() => runCapabilityCheck(selectedCapability.id)}
                >
                  Run test check
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-4" aria-labelledby="pss-queue-title">
          <SectionHeader
            eyebrow="Verification · Queue"
            title="PSS Verification Queue"
            hint="Users · status · risk · stage · last update. Click any row to drill in."
            right={
              <span className="text-[10px] uppercase tracking-[0.2em] text-white/45">
                {visibleCases.length} row(s)
              </span>
            }
          />

          <div className="flex flex-wrap gap-1.5">
            {(["ALL", "LOW", "MEDIUM", "HIGH", "CRITICAL"] as const).map((r) => {
              const active = r === riskFilter;
              return (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRiskFilter(r)}
                  className={`rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-wider transition-all ${
                    active
                      ? "border-[#7B6EF6]/60 bg-[#7B6EF6]/22 text-white shadow-[0_0_16px_rgba(123,110,246,0.35)]"
                      : "border-white/12 bg-white/[0.04] text-white/55 hover:border-white/25 hover:text-white"
                  }`}
                >
                  {r}
                </button>
              );
            })}
          </div>

          <VerificationRowGrid<PssCase>
            rows={visibleCases}
            onRowClick={(row) => setSelected(row)}
            columns={pssColumns}
            getRowTone={(row) => pssRiskTone(row.risk)}
            emptyIcon={<svg viewBox="0 0 24 24" fill="none" className="h-6 w-6"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" strokeWidth="1.4" /><polyline points="14 2 14 8 20 8" stroke="currentColor" strokeWidth="1.4" /></svg>}
            emptyTitle="Queue empty"
            emptyHint="Seed the database or wait for new verification requests."
          />
        </section>

      {selected ? <PSSDrawer data={selected} onClose={() => setSelected(null)} /> : null}

      {/* Stat drill-in drawer */}
      <VerificationDrawer
        open={!!statDrawer}
        onClose={() => setStatDrawer(null)}
        title={
          statDrawer === "modules"
            ? "PSS Modules Enabled"
            : statDrawer === "live"
            ? "Live Integrations"
            : statDrawer === "alerts"
            ? "Alerts (24h)"
            : ""
        }
        severity={statDrawer === "alerts" ? "warning" : "info"}
      >
        {statDrawer === "modules" ? (
          <div className="space-y-4 text-xs text-white/75">
            <p>
              PSS ke kul {PSS_CAPABILITIES.length} modules hain — abhi {enabledCount}{" "}
              enabled hain.
            </p>
            <SeverityMeter
              segments={[
                { label: "Enabled", value: enabledCount, tone: "teal" },
                { label: "Disabled", value: PSS_CAPABILITIES.length - enabledCount, tone: "red" },
              ]}
            />
            <div className="grid gap-2 sm:grid-cols-2">
              {PSS_CAPABILITIES.map((c) => {
                const s = capabilityStatus[c.id];
                return (
                  <div
                    key={c.id}
                    className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2"
                  >
                    <div className="min-w-0">
                      <div className="truncate text-[11px] font-semibold text-white/85">
                        {c.title}
                      </div>
                      <div className="text-[9px] uppercase text-white/45">
                        {PSS_CAPABILITY_CATEGORIES[c.category].label}
                      </div>
                    </div>
                    <VerificationChip
                      tone={s?.enabled ? "teal" : "red"}
                      size="xs"
                    >
                      {s?.enabled ? "on" : "off"}
                    </VerificationChip>
                  </div>
                );
              })}
            </div>
          </div>
        ) : statDrawer === "live" ? (
          <div className="space-y-4 text-xs text-white/75">
            <p>
              {liveCount} modules production-mode per chal ray hain. Baqi pilot
              ya planned mode per hain.
            </p>
            <SeverityMeter
              segments={[
                { label: "Live", value: liveCount, tone: "teal" },
                {
                  label: "Pilot",
                  value: Object.values(capabilityStatus).filter((x) => x.mode === "pilot").length,
                  tone: "amber",
                },
                {
                  label: "Planned",
                  value: Object.values(capabilityStatus).filter((x) => x.mode === "planned").length,
                  tone: "purple",
                },
              ]}
            />
          </div>
        ) : statDrawer === "alerts" ? (
          <div className="space-y-3 text-xs text-white/75">
            <p>
              Pichle 24 ghantey mein {incidentCount} PSS alerts triggered
              hain (demo counter). Production mein ye Up-Guard anomaly feed
              se aayenge.
            </p>
            <p className="text-white/55">
              Risk distribution across verification queue:
            </p>
            <SeverityMeter
              segments={[
                { label: "Low", value: riskBreakdown.LOW, tone: "teal" },
                { label: "Med", value: riskBreakdown.MEDIUM, tone: "amber" },
                { label: "High", value: riskBreakdown.HIGH, tone: "red" },
                { label: "Crit", value: riskBreakdown.CRITICAL, tone: "red" },
              ]}
            />
          </div>
        ) : null}
      </VerificationDrawer>
    </div>
  );
}

/* ---------- PSS helpers ---------- */
function pssRiskTone(risk: string): VerificationTone | undefined {
  const r = (risk || "").toUpperCase();
  if (r === "CRITICAL") return "red";
  if (r === "HIGH") return "red";
  if (r === "MEDIUM") return "amber";
  if (r === "LOW") return "teal";
  return undefined;
}

const pssColumns: RowColumn<PssCase>[] = [
  {
    key: "user",
    header: "User",
    width: "minmax(0,1.8fr)",
    render: (c) => (
      <div className="min-w-0">
        <div className="truncate font-semibold text-white">{c.user.name}</div>
        <div className="text-[10px] text-white/45">{c.user.email ?? "—"}</div>
      </div>
    ),
  },
  {
    key: "status",
    header: "Status",
    width: "minmax(0,0.9fr)",
    render: (c) => (
      <span className="text-[11px] font-medium uppercase tracking-wide text-white/75">
        {c.status}
      </span>
    ),
  },
  {
    key: "riskScore",
    header: "Score",
    width: "minmax(0,0.6fr)",
    render: (c) => (
      <span className="font-mono tabular-nums text-white/80">
        {c.riskScore !== undefined ? c.riskScore : "—"}
      </span>
    ),
  },
  {
    key: "risk",
    header: "Risk",
    width: "minmax(0,0.7fr)",
    render: (c) => <RiskBadge risk={c.risk} />,
  },
  {
    key: "stage",
    header: "Stage",
    width: "minmax(0,0.9fr)",
    render: (c) => <span className="text-[11px] text-white/75">{c.stage}</span>,
  },
  {
    key: "updated",
    header: "Updated",
    width: "minmax(0,1.1fr)",
    align: "right",
    render: (c) => (
      <span className="text-[10px] text-white/45">
        {new Date(c.updatedAt).toLocaleString(undefined, {
          dateStyle: "medium",
          timeStyle: "short",
        })}
      </span>
    ),
  },
];
