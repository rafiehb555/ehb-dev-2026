"use client";

import { useMemo, useState } from "react";
import { KpiCard } from "@/components/ui/KpiCard";

type FraudSeverity = "Low" | "Medium" | "High";

type FraudFlag = {
  id: string;
  entityType: "Provider" | "Order" | "Listing" | "Account";
  entityName: string;
  entityCode: string;
  signals: string[];
  locationMismatch: boolean;
  riskScore: number; // 0 - 100
  severity: FraudSeverity;
  createdAt: string; // display-friendly
};

const SEVERITY_COLORS: Record<FraudSeverity, { pill: string; border: string }> = {
  Low: { pill: "bg-emerald-500/15 text-emerald-200", border: "border-emerald-500/30" },
  Medium: { pill: "bg-amber-500/15 text-amber-200", border: "border-amber-500/30" },
  High: { pill: "bg-rose-500/15 text-rose-200", border: "border-rose-500/30" },
};

const MOCK_FLAGS: FraudFlag[] = [
  {
    id: "ff_1021",
    entityType: "Provider",
    entityName: "CleanMaster AI (Sub Provider)",
    entityCode: "prov_cleanmaster_ai",
    signals: ["Duplicate listing patterns", "Location mismatch vs onboarding"],
    locationMismatch: true,
    riskScore: 86,
    severity: "High",
    createdAt: "2026-03-19 12:20",
  },
  {
    id: "ff_1022",
    entityType: "Order",
    entityName: "Order #A-77193",
    entityCode: "order_A-77193",
    signals: ["Velocity spike", "Geo mismatch with shipping region"],
    locationMismatch: true,
    riskScore: 78,
    severity: "High",
    createdAt: "2026-03-19 11:05",
  },
  {
    id: "ff_1023",
    entityType: "Listing",
    entityName: "eGuard Home Security",
    entityCode: "lst_eguard_home_security",
    signals: ["Abnormal view-to-conversion ratio", "Edited media frequently"],
    locationMismatch: false,
    riskScore: 52,
    severity: "Medium",
    createdAt: "2026-03-19 10:40",
  },
  {
    id: "ff_1024",
    entityType: "Account",
    entityName: "User: ihsan_k",
    entityCode: "acct_ihsan_k",
    signals: ["New account + high volume", "Suspicious referral burst"],
    locationMismatch: false,
    riskScore: 64,
    severity: "Medium",
    createdAt: "2026-03-19 10:12",
  },
  {
    id: "ff_1025",
    entityType: "Provider",
    entityName: "SpeakEase Pro",
    entityCode: "prov_speakease_pro",
    signals: ["Minor duplicate keywords", "Location changed recently"],
    locationMismatch: true,
    riskScore: 38,
    severity: "Low",
    createdAt: "2026-03-19 09:55",
  },
  {
    id: "ff_1026",
    entityType: "Listing",
    entityName: "BrightSync Smart Light",
    entityCode: "lst_brightsync_smart_light",
    signals: ["Low trust signals", "Unusual posting cadence"],
    locationMismatch: false,
    riskScore: 29,
    severity: "Low",
    createdAt: "2026-03-19 09:10",
  },
];

function formatRisk(score: number) {
  if (score >= 80) return { label: "Critical", color: "text-rose-200" };
  if (score >= 60) return { label: "Elevated", color: "text-amber-200" };
  return { label: "Normal", color: "text-emerald-200" };
}

export function FraudDetectionAdminPanel() {
  const [severity, setSeverity] = useState<"All" | FraudSeverity>("All");
  const [query, setQuery] = useState("");
  const [lastAction, setLastAction] = useState<string>("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return MOCK_FLAGS.filter((f) => {
      const severityOk = severity === "All" ? true : f.severity === severity;
      const queryOk = !q
        ? true
        : [f.entityName, f.entityCode, f.entityType, f.signals.join(" ")].join(" ").toLowerCase().includes(q);
      return severityOk && queryOk;
    });
  }, [query, severity]);

  const kpis = useMemo(() => {
    const total = MOCK_FLAGS.length;
    const high = MOCK_FLAGS.filter((f) => f.severity === "High").length;
    const medium = MOCK_FLAGS.filter((f) => f.severity === "Medium").length;
    const avg = total ? Math.round(MOCK_FLAGS.reduce((s, f) => s + f.riskScore, 0) / total) : 0;
    return { total, high, medium, avg };
  }, []);

  return (
    <div className="space-y-6">
      <section className="space-y-3">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard label="Fraud Engine" value="Running" detail="Rules + anomaly scoring (mock)" />
          <KpiCard label="Flags Today" value={kpis.total} detail={`High: ${kpis.high} · Medium: ${kpis.medium}`} />
          <KpiCard label="Avg Risk Score" value={`${kpis.avg}/100`} detail="Normalized to STL + trust layers" />
          <KpiCard label="Escalation Threshold" value=">= 60" detail="Manual review required for High" />
        </div>
      </section>

      <section className="glass-panel card-hover p-4 space-y-3 border border-white/5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="space-y-1">
            <h2 className="text-sm font-semibold text-white">Fraud Flags (Admin)</h2>
            <p className="text-[10px] text-slate-400">
              Detect fake providers, duplicate listings, suspicious orders, and risky accounts. (UI mock; backend later)
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <label className="text-[10px] text-slate-400">Severity</label>
            <select
              value={severity}
              onChange={(e) => setSeverity(e.target.value as any)}
              className="h-9 rounded-xl glass-panel border border-white/10 px-3 text-[11px] text-slate-100 focus:outline-none"
            >
              <option value="All">All</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>

            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search entity, code, signals..."
              className="h-9 rounded-xl glass-panel border border-white/10 px-3 text-[11px] text-slate-100 placeholder:text-slate-500 focus:outline-none min-w-[240px]"
            />
          </div>
        </div>

        {lastAction ? (
          <div className="rounded-xl glass-panel border border-white/10 p-3 text-[10px] text-slate-300">
            <span className="text-slate-100 font-semibold">Last action:</span> {lastAction}
          </div>
        ) : null}

        <div className="overflow-x-auto">
          <div className="min-w-[760px] space-y-2">
            <div className="grid grid-cols-12 text-[10px] text-slate-400 px-2">
              <div className="col-span-2">Entity</div>
              <div className="col-span-3">Signals</div>
              <div className="col-span-1">Loc</div>
              <div className="col-span-2">Risk</div>
              <div className="col-span-1">Severity</div>
              <div className="col-span-3 text-right">Actions</div>
            </div>

            {filtered.map((f) => {
              const risk = formatRisk(f.riskScore);
              const sevStyle = SEVERITY_COLORS[f.severity];
              return (
                <div
                  key={f.id}
                  className="grid grid-cols-12 items-center rounded-2xl glass-card border p-3 card-hover"
                >
                  <div className="col-span-2 min-w-0">
                    <div className="text-[11px] font-semibold text-white truncate">{f.entityName}</div>
                    <div className="text-[10px] text-slate-500 truncate">{f.entityType}</div>
                  </div>

                  <div className="col-span-3 min-w-0">
                    <div className="text-[10px] text-slate-300 line-clamp-2">
                      {f.signals.join(" · ")}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5 truncate">{f.entityCode}</div>
                  </div>

                  <div className="col-span-1">
                    {f.locationMismatch ? (
                      <span className="inline-flex items-center rounded-full px-2 py-1 text-[10px] bg-rose-500/15 border border-rose-500/30 text-rose-200">
                        Yes
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full px-2 py-1 text-[10px] bg-emerald-500/15 border border-emerald-500/30 text-emerald-200">
                        No
                      </span>
                    )}
                  </div>

                  <div className="col-span-2">
                    <div className={`text-[12px] font-semibold ${risk.color}`}>{f.riskScore}/100</div>
                    <div className="text-[10px] text-slate-500">{risk.label}</div>
                  </div>

                  <div className="col-span-1">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-1 text-[10px] border ${sevStyle.border} ${sevStyle.pill}`}
                    >
                      {f.severity}
                    </span>
                  </div>

                  <div className="col-span-3 text-right flex items-center justify-end gap-2">
                    <button
                      type="button"
                      className="h-9 rounded-xl glass-panel border border-white/10 px-3 text-[11px] text-slate-100 hover:bg-white/5 transition-all"
                      onClick={() => setLastAction(`Review ${f.entityType} "${f.entityName}" (${f.id})`)}
                    >
                      Review
                    </button>
                    <button
                      type="button"
                      className="h-9 rounded-xl bg-rose-500/15 border border-rose-500/30 px-3 text-[11px] text-rose-200 hover:bg-rose-500/20 transition-all"
                      onClick={() => setLastAction(`Suspend risked account/listing: ${f.id}`)}
                    >
                      Suspend
                    </button>
                    <button
                      type="button"
                      className="h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 px-3 text-[11px] text-emerald-200 hover:bg-emerald-500/20 transition-all"
                      onClick={() => setLastAction(`Dismiss flag ${f.id} after verification`)}
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              );
            })}

            {filtered.length === 0 ? (
              <div className="rounded-2xl glass-card border p-4 text-[11px] text-slate-400 text-center">
                No flags match your filter.
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </div>
  );
}

