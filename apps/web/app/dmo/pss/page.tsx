"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import PSSDrawer from "@/components/dmo/PSSDrawer";
import { PssCapabilitiesSection } from "@/components/dmo/PssCapabilitiesSection";
import { RiskBadge } from "@/components/dmo/RiskBadge";
import { getPssDemoCases } from "@/lib/pss/pssDemoCases";
import { PSS_CAPABILITIES, PSS_CAPABILITY_CATEGORIES, type PssCapability } from "@/lib/pss/pssCapabilities";

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
  const [cases, setCases] = useState<PssCase[]>([]);
  const [selected, setSelected] = useState<PssCase | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const loadCases = useCallback(async () => {
    setLoading(true);
    setError(null);
    setInfo(null);
    try {
      const res = await fetch("/api/pss/cases", { cache: "no-store", credentials: "include" });
      const json = (await res.json()) as {
        success?: boolean;
        data?: { cases?: PssCase[] };
        error?: { message?: string };
      };

      if (json.success && json.data?.cases && Array.isArray(json.data.cases)) {
        const rows = json.data.cases.map((c) => ({
          id: c.id,
          user: c.user,
          status: c.status,
          risk: c.risk,
          stage: c.stage,
          updatedAt: typeof c.updatedAt === "string" ? c.updatedAt : String(c.updatedAt),
          riskScore: typeof c.riskScore === "number" ? c.riskScore : undefined,
        }));
        setCases(rows);
        if (rows.length === 0) {
          setInfo("Queue empty — seed the database or complete demo onboarding.");
        }
        return;
      }

      const msg = json.error?.message ?? (res.ok ? "Unexpected response" : `HTTP ${res.status}`);
      setCases(
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
      setInfo(
        res.ok
          ? "Showing demo queue — API returned no case list."
          : `Demo queue (live API unavailable): ${msg}`
      );
    } catch {
      setCases(
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
      setInfo("Demo queue — network error; check API and session.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadCases();
  }, [loadCases]);

  const enabledCount = Object.values(capabilityStatus).filter((x) => x.enabled).length;
  const liveCount = Object.values(capabilityStatus).filter((x) => x.mode === "live").length;
  const incidentCount = Object.values(capabilityStatus).reduce((sum, x) => sum + x.incidents, 0);

  const selectedState = capabilityStatus[selectedCapability.id];

  function toggleCapability(id: string) {
    setCapabilityStatus((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        enabled: !prev[id].enabled,
      },
    }));
    setInfo("Capability status updated locally (demo control mode).");
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
    setInfo("Capability test run completed (demo).");
  }

  return (
    <main className="min-h-screen text-white">
      <div className="container-ehb py-6 space-y-10">
        <header className="rounded-3xl border border-cyan-400/20 bg-gradient-to-b from-[#031222]/95 to-[#020b18]/95 p-5 md:p-7">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-cyan-300">EHB PSS · Proof & Security System</p>
              <h1 className="mt-1 text-2xl font-semibold text-white md:text-3xl">PSS Verification</h1>
              <p className="mt-2 max-w-3xl text-sm text-ehb-textBody">
                Identity, liveness, AML, ongoing monitoring, and risk signals — neeche capability catalog hai; uske baad
                live verification queue (DMO operators).
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link href="/local-demo" className="ehb-btn-secondary ehb-press text-sm">
                Local demo
              </Link>
              <button
                type="button"
                onClick={() => void loadCases()}
                className="ehb-btn-primary ehb-press text-sm"
              >
                Refresh queue
              </button>
            </div>
          </div>
        </header>

        <section className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
            <p className="text-[11px] uppercase tracking-[0.18em] text-ehb-textMuted">Modules enabled</p>
            <p className="mt-1 text-2xl font-semibold text-white">
              {enabledCount} <span className="text-sm text-ehb-textMuted">/ {PSS_CAPABILITIES.length}</span>
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
            <p className="text-[11px] uppercase tracking-[0.18em] text-ehb-textMuted">Live integrations</p>
            <p className="mt-1 text-2xl font-semibold text-cyan-100">{liveCount}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
            <p className="text-[11px] uppercase tracking-[0.18em] text-ehb-textMuted">Alerts (demo)</p>
            <p className="mt-1 text-2xl font-semibold text-amber-100">{incidentCount}</p>
          </div>
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
              <p className="mt-1 text-xs uppercase tracking-wide text-ehb-textMuted">
                {PSS_CAPABILITY_CATEGORIES[selectedCapability.category].label}
              </p>
              <p className="mt-3 text-sm text-ehb-textBody">
                <span className="text-white/90 font-medium">Purpose: </span>
                {selectedCapability.purpose}
              </p>
              <p className="mt-2 text-sm text-ehb-textBody">
                <span className="text-cyan-100/90 font-medium">Use case: </span>
                {selectedCapability.useCase}
              </p>
            </div>
            <div className="w-full max-w-sm space-y-2 rounded-xl border border-white/10 bg-black/20 p-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-ehb-textMuted">State</span>
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
                <span className="text-ehb-textMuted">Mode</span>
                <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 uppercase text-ehb-textBody">
                  {selectedState?.mode ?? "planned"}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-ehb-textMuted">Last run</span>
                <span className="text-ehb-textBody">
                  {selectedState?.lastRunAt
                    ? new Date(selectedState.lastRunAt).toLocaleTimeString()
                    : "Not yet"}
                </span>
              </div>
              <div className="pt-2 flex flex-wrap gap-2">
                <button
                  type="button"
                  className="ehb-btn-secondary ehb-press text-xs"
                  onClick={() => toggleCapability(selectedCapability.id)}
                >
                  {selectedState?.enabled ? "Disable module" : "Enable module"}
                </button>
                <button
                  type="button"
                  className="ehb-btn-primary ehb-press text-xs"
                  onClick={() => runCapabilityCheck(selectedCapability.id)}
                >
                  Run test check
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-4" aria-labelledby="pss-queue-title">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 id="pss-queue-title" className="text-lg font-semibold text-white">
                Verification queue
              </h2>
              <p className="text-xs text-ehb-textMuted">Users · status · risk · stage · last update</p>
            </div>
            <span className="text-[11px] text-ehb-textMuted">{cases.length} row(s)</span>
          </div>

          {error ? (
            <div className="rounded-2xl border border-rose-400/40 bg-rose-500/10 p-4 text-sm text-rose-100">{error}</div>
          ) : null}

          {info ? (
            <div className="rounded-2xl border border-amber-400/35 bg-amber-500/10 p-4 text-sm text-amber-100">
              {info}{" "}
              <span className="text-amber-200/80">
                DB seed: <code className="rounded bg-black/30 px-1">npx prisma db seed</code> · MongoDB replica set zaroori ho
                sakta hai.
              </span>
            </div>
          ) : null}

          <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-sm">
                <thead className="border-b border-white/10 text-left text-ehb-textMuted">
                  <tr>
                    <th className="p-3 font-medium">User</th>
                    <th className="p-3 font-medium">Status</th>
                    <th className="p-3 font-medium">Risk score</th>
                    <th className="p-3 font-medium">Risk</th>
                    <th className="p-3 font-medium">Stage</th>
                    <th className="p-3 font-medium">Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td className="p-4 text-ehb-textBody" colSpan={6}>
                        Loading cases…
                      </td>
                    </tr>
                  ) : null}

                  {!loading && cases.length === 0 ? (
                    <tr>
                      <td className="p-4 text-ehb-textBody" colSpan={6}>
                        No cases found.
                      </td>
                    </tr>
                  ) : null}

                  {!loading &&
                    cases.map((c) => (
                      <tr
                        key={c.id}
                        onClick={() => setSelected(c)}
                        className="cursor-pointer border-t border-white/5 transition hover:bg-white/[0.06]"
                      >
                        <td className="p-3">
                          <div className="font-medium text-white">{c.user.name}</div>
                          <div className="text-[11px] text-ehb-textMuted">{c.user.email ?? "—"}</div>
                        </td>
                        <td className="p-3 text-ehb-textBody">{c.status}</td>
                        <td className="p-3 font-mono text-xs text-cyan-100/90">
                          {c.riskScore !== undefined ? c.riskScore : "—"}
                        </td>
                        <td className="p-3">
                          <RiskBadge risk={c.risk} />
                        </td>
                        <td className="p-3 text-ehb-textBody">{c.stage}</td>
                        <td className="p-3 text-ehb-textMuted">
                          {new Date(c.updatedAt).toLocaleString(undefined, {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {selected ? <PSSDrawer data={selected} onClose={() => setSelected(null)} /> : null}
      </div>
    </main>
  );
}
