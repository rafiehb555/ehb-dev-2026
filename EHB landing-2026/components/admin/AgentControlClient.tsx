"use client";

import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { KpiCard } from "@/components/ui/KpiCard";

type RuntimeSummary = {
  activeAgents: number;
  blockedAgents: number;
  waitingAgents: number;
  completedAgents: number;
  mockModeAgents: number;
  liveModeAgents: number;
  totalHistoryEvents: number;
  totalHandoffs: number;
  completedHandoffs: number;
};

type AgentGroupKey = "core" | "domain" | "advanced";
type AgentStatus =
  | "idle"
  | "reading-context"
  | "planning"
  | "waiting-for-input"
  | "working"
  | "verifying"
  | "blocked"
  | "failed"
  | "completed";

type AgentRuntimeStatus = {
  agentId: string;
  status: AgentStatus;
  queueSize: number;
  healthScore: number;
  lastTask: string;
  mode: "mock" | "live";
  lastUpdatedAt: string;
  lastUpdatedLabel: string;
};

type AgentHandoffRecord = {
  id: string;
  fromAgentId: string;
  toAgentId: string;
  requestSummary: string;
  reason: string;
  expectedOutput: string;
  priority: string;
  status: string;
  triggeredById: string | null;
  createdAt: string;
  updatedAt: string;
  createdAtLabel: string;
};

function Panel(props: { title: string; subtitle?: string; children: ReactNode }) {
  return (
    <section className="glass-panel card-hover p-4 space-y-3 border border-white/5">
      <div className="space-y-1">
        <h2 className="text-sm sm:text-base font-semibold text-slate-100">{props.title}</h2>
        {props.subtitle ? <p className="text-[11px] text-slate-400">{props.subtitle}</p> : null}
      </div>
      {props.children}
    </section>
  );
}

function getAgentGroupMeta(group: AgentGroupKey) {
  const meta = {
    core: {
      badgeLabel: "Core",
      badgeClassName: "border-cyan-400/20 bg-cyan-500/10 text-cyan-200",
      borderClassName: "hover:border-cyan-400/40",
    },
    domain: {
      badgeLabel: "Domain",
      badgeClassName: "border-violet-400/20 bg-violet-500/10 text-violet-200",
      borderClassName: "hover:border-violet-400/40",
    },
    advanced: {
      badgeLabel: "Advanced",
      badgeClassName: "border-amber-400/20 bg-amber-500/10 text-amber-200",
      borderClassName: "hover:border-amber-400/40",
    },
  } as const;

  return meta[group];
}

const RUNTIME_STATUS_OPTIONS: AgentStatus[] = [
  "idle",
  "reading-context",
  "planning",
  "waiting-for-input",
  "working",
  "verifying",
  "blocked",
  "failed",
  "completed",
];

async function postAgentRuntime(body: unknown) {
  const res = await fetch("/api/agents/runtime", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "same-origin",
    body: JSON.stringify(body),
  });
  const json = await res.json().catch(() => null);
  if (!res.ok) {
    const message = json?.error?.message ?? json?.message ?? `Request failed (${res.status})`;
    throw new Error(message);
  }
  return json;
}

function getAgentStatusMeta(status: AgentStatus) {
  const meta = {
    idle: { label: "Idle", className: "border-slate-400/20 bg-slate-500/10 text-slate-200" },
    "reading-context": { label: "Reading", className: "border-sky-400/20 bg-sky-500/10 text-sky-200" },
    planning: { label: "Planning", className: "border-violet-400/20 bg-violet-500/10 text-violet-200" },
    "waiting-for-input": { label: "Waiting", className: "border-amber-400/20 bg-amber-500/10 text-amber-200" },
    working: { label: "Working", className: "border-cyan-400/20 bg-cyan-500/10 text-cyan-200" },
    verifying: { label: "Verifying", className: "border-emerald-400/20 bg-emerald-500/10 text-emerald-200" },
    blocked: { label: "Blocked", className: "border-rose-400/20 bg-rose-500/10 text-rose-200" },
    failed: { label: "Failed", className: "border-red-400/20 bg-red-500/10 text-red-200" },
    completed: { label: "Completed", className: "border-lime-400/20 bg-lime-500/10 text-lime-200" },
  } as const;

  return meta[status];
}

function recommendAgentsForQuery(
  query: string,
  rules: ReadonlyArray<{ keywords: string[]; primaryAgentId: string; supportingAgentIds: string[]; reason: string }>,
  scenarios: ReadonlyArray<{ id: string; title: string; ownerNeed: string; reason: string }>,
) {
  const normalized = query.toLowerCase();
  const matchedScenarios = scenarios.filter((item) => {
    return (
      item.title.toLowerCase().includes(normalized) ||
      item.ownerNeed.toLowerCase().includes(normalized) ||
      item.reason.toLowerCase().includes(normalized)
    );
  });

  const keywordRule = rules
    .map((rule) => ({
      rule,
      score: rule.keywords.filter((keyword) => normalized.includes(keyword)).length,
    }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)[0]?.rule;

  if (keywordRule) {
    return {
      primaryAgentId: keywordRule.primaryAgentId,
      supportingAgentIds: keywordRule.supportingAgentIds,
      matchedScenarioIds: matchedScenarios.map((item) => item.id),
      reason: keywordRule.reason,
    };
  }

  return {
    primaryAgentId: "ceo-orchestrator-agent",
    supportingAgentIds: ["product-roadmap-agent", "user-flow-agent"],
    matchedScenarioIds: matchedScenarios.map((item) => item.id),
    reason: "When the owner request is unclear, start with the orchestrator and bring in planning and flow review.",
  };
}

export default function AgentControlClient(props: {
  chooserCategories: ReadonlyArray<{ id: string; label: string }>;
  chooserRecommendations: ReadonlyArray<{
    id: string;
    category: string;
    title: string;
    ownerNeed: string;
    primaryAgentId: string;
    supportingAgentIds: string[];
    reason: string;
  }>;
  dashboardPurpose: ReadonlyArray<string>;
  dashboardSummary: { totalAgents: number; coreAgents: number; domainAgents: number; advancedAgents: number; sharedStatuses: number };
  groups: ReadonlyArray<{ title: string; detail: string; agents: ReadonlyArray<{ id: string; group: AgentGroupKey; summary: string; owner: string }> }>;
  guidanceCards: ReadonlyArray<{ title: string; body: string }>;
  handoffOrder: ReadonlyArray<string>;
  ownershipHighlights: ReadonlyArray<string>;
  statuses: ReadonlyArray<{ name: string; meaning: string }>;
  workflowContract: { defaultStartingAgent: string; maxSpecialistsPerRequest: number; routeRiskThrough: string; routeMemoryThrough: string; releaseVerificationThrough: string };
}) {
  const [activeChooserCategory, setActiveChooserCategory] = useState(props.chooserCategories[0]?.id ?? "all");
  const [recommendationQuery, setRecommendationQuery] = useState("I want to build a new EHB feature");
  const [runtimeSummary, setRuntimeSummary] = useState<RuntimeSummary | null>(null);
  const [runtimeStatuses, setRuntimeStatuses] = useState<AgentRuntimeStatus[]>([]);
  const [runtimeHandoffs, setRuntimeHandoffs] = useState<AgentHandoffRecord[]>([]);
  const [runtimeError, setRuntimeError] = useState<string | null>(null);
  const [actionBusy, setActionBusy] = useState(false);
  const [actionNotice, setActionNotice] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const allAgentIds = useMemo(
    () => props.groups.flatMap((group) => group.agents.map((agent) => agent.id)),
    [props.groups],
  );

  const [quickAgentId, setQuickAgentId] = useState("");
  const [quickStatus, setQuickStatus] = useState<AgentStatus>("working");
  const [quickLastTask, setQuickLastTask] = useState("Coordinating development work");
  const [quickQueue, setQuickQueue] = useState(0);
  const [quickHealth, setQuickHealth] = useState(88);
  const [quickHistTitle, setQuickHistTitle] = useState("");
  const [quickHistDetail, setQuickHistDetail] = useState("");

  const recommendationRules = useMemo(
    () => [
      {
        keywords: ["build", "feature", "new", "plan", "roadmap", "start"],
        primaryAgentId: "ceo-orchestrator-agent",
        supportingAgentIds: ["product-roadmap-agent", "user-flow-agent", "data-architecture-agent"],
        reason: "Broad feature ideas should start with orchestration, planning, flow tracing, and source-of-truth review.",
      },
      {
        keywords: ["button", "card", "flow", "journey", "page", "route", "ui"],
        primaryAgentId: "user-flow-agent",
        supportingAgentIds: ["ui-design-system-agent", "data-architecture-agent"],
        reason: "Route and UI impact requests need flow tracing first, then design and data validation.",
      },
      {
        keywords: ["admin", "dmo", "panel", "management", "approval", "operations"],
        primaryAgentId: "admin-dmo-agent",
        supportingAgentIds: ["ceo-orchestrator-agent", "user-flow-agent"],
        reason: "Management requests should be placed in the correct admin or DMO workflow with route context.",
      },
      {
        keywords: ["franchise", "booking", "inspection", "operator"],
        primaryAgentId: "franchise-agent",
        supportingAgentIds: ["admin-dmo-agent", "trust-systems-agent"],
        reason: "Franchise work crosses operator flows, admin placement, and trust-sensitive approvals.",
      },
      {
        keywords: ["trust", "stl", "verification", "review", "badge", "approval"],
        primaryAgentId: "trust-systems-agent",
        supportingAgentIds: ["agent-governance-risk-agent", "deploy-sync-ops-agent"],
        reason: "Trust-sensitive changes need domain review, risk controls, and rollout verification.",
      },
      {
        keywords: ["deploy", "github", "push", "build", "local", "vercel", "sync"],
        primaryAgentId: "deploy-sync-ops-agent",
        supportingAgentIds: ["ceo-orchestrator-agent"],
        reason: "Operational and deployment requests should route to verification and sync ownership first.",
      },
    ],
    [],
  );

  const filteredChooserRecommendations = useMemo(() => {
    if (activeChooserCategory === "all") {
      return props.chooserRecommendations;
    }

    return props.chooserRecommendations.filter((item) => item.category === activeChooserCategory);
  }, [activeChooserCategory, props.chooserRecommendations]);

  const recommendationResult = useMemo(
    () => recommendAgentsForQuery(recommendationQuery, recommendationRules, props.chooserRecommendations),
    [recommendationQuery, recommendationRules, props.chooserRecommendations],
  );

  const runtimeStatusMap = useMemo(
    () => new Map(runtimeStatuses.map((status) => [status.agentId, status])),
    [runtimeStatuses],
  );

  const latestHandoffs = useMemo(() => runtimeHandoffs.slice(0, 4), [runtimeHandoffs]);

  const loadRuntime = useCallback(async () => {
    try {
      setRuntimeError(null);
      const res = await fetch("/api/agents/status", { cache: "no-store" });
      const json = await res.json().catch(() => null);
      if (!res.ok) throw new Error(json?.error?.message ?? "Failed to load agent runtime.");

      const data = (json?.data ?? json) as {
        summary?: RuntimeSummary;
        statuses?: AgentRuntimeStatus[];
        handoffs?: AgentHandoffRecord[];
      };

      setRuntimeSummary(data.summary ?? null);
      setRuntimeStatuses(data.statuses ?? []);
      setRuntimeHandoffs(data.handoffs ?? []);
    } catch (error) {
      setRuntimeError(error instanceof Error ? error.message : "Failed to load agent runtime.");
    }
  }, []);

  useEffect(() => {
    void loadRuntime();
  }, [loadRuntime]);

  useEffect(() => {
    if (!quickAgentId && allAgentIds[0]) {
      setQuickAgentId(allAgentIds[0]);
    }
  }, [allAgentIds, quickAgentId]);

  return (
    <main className="min-h-screen text-slate-100">
      <div className="container-ehb py-6 sm:py-8 space-y-5 sm:space-y-6 text-[10px] xs:text-[11px]">
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="space-y-1">
            <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Admin · Development Agents</p>
            <h1 className="text-lg sm:text-xl font-semibold leading-tight gradient-text">EHB Agent Control Center</h1>
            <p className="text-slate-300 max-w-3xl">
              Runtime-backed dashboard for the current EHB development agent system with persistent local status, history, and handoff visibility.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/admin" className="min-h-touch inline-flex items-center justify-center rounded-full glass-panel px-3 py-1.5 font-semibold text-white hover:shadow-neon-blue transition-all duration-200">
              ← Back to Super Admin
            </Link>
            <Link href="/admin/development" className="min-h-touch inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#00eaff] to-[#3b82f6] px-3 py-1.5 font-semibold text-slate-950 btn-glow">
              Open Release Center
            </Link>
          </div>
        </header>

        <section className="grid gap-3 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
          <KpiCard label="Development Agents" value={props.dashboardSummary.totalAgents} detail="Current documented roster" />
          <KpiCard
            label="Runtime Active / Blocked"
            value={runtimeSummary ? `${runtimeSummary.activeAgents} / ${runtimeSummary.blockedAgents}` : "Loading"}
            detail={runtimeSummary ? `Waiting: ${runtimeSummary.waitingAgents} · Completed: ${runtimeSummary.completedAgents}` : "Reading persistent runtime store"}
          />
          <KpiCard
            label="Core / Domain / Advanced"
            value={`${props.dashboardSummary.coreAgents} / ${props.dashboardSummary.domainAgents} / ${props.dashboardSummary.advancedAgents}`}
            detail="Structured operating layers"
          />
          <KpiCard
            label="Runtime Feed"
            value={runtimeSummary ? `${runtimeSummary.liveModeAgents} live` : "Loading"}
            detail={runtimeSummary ? `${runtimeSummary.totalHandoffs} handoffs · ${runtimeSummary.totalHistoryEvents} events` : `${props.dashboardSummary.sharedStatuses} shared statuses`}
          />
        </section>

        <section className="rounded-2xl glass-panel border border-cyan-500/20 p-4 sm:p-5">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
            <div className="space-y-1">
              <div className="text-[11px] uppercase tracking-[0.2em] text-cyan-300">Guardrail</div>
              <h2 className="text-sm sm:text-base font-semibold text-slate-100">Version 1 now uses a persistent local runtime store</h2>
              <p className="text-slate-300 max-w-3xl">
                The current dashboard reads from local agent runtime files and supports real status, history, and handoff actions for development use. It is still not external production telemetry.
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-slate-950/40 px-3 py-2 text-[11px] text-slate-300">
              Source: local runtime store + agent catalog
            </div>
          </div>
        </section>

        {runtimeError ? <section className="rounded-2xl border border-rose-400/20 bg-rose-500/10 p-4 text-rose-100">{runtimeError}</section> : null}

        <section className="rounded-2xl glass-panel border border-white/10 p-4 sm:p-5 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
            <div className="space-y-1">
              <div className="text-[11px] uppercase tracking-[0.2em] text-cyan-300">Super Admin</div>
              <h2 className="text-sm sm:text-base font-semibold text-slate-100">Quick runtime control</h2>
              <p className="text-[11px] text-slate-400 max-w-3xl">
                Push status updates and reset the local store. Production requires an authenticated Super Admin session.
              </p>
            </div>
            <button
              type="button"
              disabled={actionBusy}
              className="min-h-touch shrink-0 rounded-full border border-rose-400/30 bg-rose-500/10 px-3 py-1.5 text-[11px] font-semibold text-rose-100 hover:border-rose-400/50 disabled:opacity-50"
              onClick={() => {
                if (!window.confirm("Reset agent runtime files to catalog defaults?")) return;
                setActionNotice(null);
                setActionBusy(true);
                void (async () => {
                  try {
                    await postAgentRuntime({ action: "reset-runtime" });
                    setActionNotice({ type: "ok", text: "Runtime reset to defaults." });
                    await loadRuntime();
                  } catch (e) {
                    setActionNotice({ type: "err", text: e instanceof Error ? e.message : "Reset failed." });
                  } finally {
                    setActionBusy(false);
                  }
                })();
              }}
            >
              Reset to defaults
            </button>
          </div>
          {actionNotice ? (
            <div
              className={`rounded-xl border px-3 py-2 text-[11px] ${
                actionNotice.type === "ok"
                  ? "border-emerald-400/25 bg-emerald-500/10 text-emerald-100"
                  : "border-rose-400/25 bg-rose-500/10 text-rose-100"
              }`}
            >
              {actionNotice.text}
            </div>
          ) : null}
          <div className="grid gap-3 grid-cols-1 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3 text-[11px]">
              <label className="grid gap-1">
                <span className="text-slate-500">Agent</span>
                <select
                  className="rounded-xl border border-white/10 bg-slate-950/50 px-3 py-2 text-slate-100"
                  value={quickAgentId}
                  disabled={actionBusy || allAgentIds.length === 0}
                  onChange={(e) => setQuickAgentId(e.target.value)}
                >
                  {allAgentIds.map((id) => (
                    <option key={id} value={id}>
                      {id}
                    </option>
                  ))}
                </select>
              </label>
              <label className="grid gap-1">
                <span className="text-slate-500">Status</span>
                <select
                  className="rounded-xl border border-white/10 bg-slate-950/50 px-3 py-2 text-slate-100"
                  value={quickStatus}
                  disabled={actionBusy}
                  onChange={(e) => setQuickStatus(e.target.value as AgentStatus)}
                >
                  {RUNTIME_STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </label>
              <label className="grid gap-1 sm:col-span-2 xl:col-span-1">
                <span className="text-slate-500">Last task</span>
                <input
                  className="w-full rounded-xl border border-white/10 bg-slate-950/50 px-3 py-2 text-slate-100"
                  value={quickLastTask}
                  disabled={actionBusy}
                  onChange={(e) => setQuickLastTask(e.target.value)}
                />
              </label>
              <label className="grid gap-1">
                <span className="text-slate-500">Queue</span>
                <input
                  type="number"
                  min={0}
                  max={999}
                  className="rounded-xl border border-white/10 bg-slate-950/50 px-3 py-2 text-slate-100"
                  value={quickQueue}
                  disabled={actionBusy}
                  onChange={(e) => setQuickQueue(Number(e.target.value))}
                />
              </label>
              <label className="grid gap-1">
                <span className="text-slate-500">Health %</span>
                <input
                  type="number"
                  min={0}
                  max={100}
                  className="rounded-xl border border-white/10 bg-slate-950/50 px-3 py-2 text-slate-100"
                  value={quickHealth}
                  disabled={actionBusy}
                  onChange={(e) => setQuickHealth(Number(e.target.value))}
                />
              </label>
              <label className="grid gap-1">
                <span className="text-slate-500">Hist. title (opt.)</span>
                <input
                  className="rounded-xl border border-white/10 bg-slate-950/50 px-3 py-2 text-slate-100"
                  placeholder="Optional"
                  value={quickHistTitle}
                  disabled={actionBusy}
                  onChange={(e) => setQuickHistTitle(e.target.value)}
                />
              </label>
              <label className="grid gap-1 sm:col-span-2">
                <span className="text-slate-500">Hist. detail (opt.)</span>
                <input
                  className="rounded-xl border border-white/10 bg-slate-950/50 px-3 py-2 text-slate-100"
                  placeholder="Optional; use with title"
                  value={quickHistDetail}
                  disabled={actionBusy}
                  onChange={(e) => setQuickHistDetail(e.target.value)}
                />
              </label>
            </div>
            <button
              type="button"
              disabled={actionBusy || !quickAgentId}
              className="min-h-touch rounded-full border border-cyan-400/30 bg-cyan-500/15 px-4 py-2 text-[11px] font-semibold text-cyan-100 hover:border-cyan-400/50 disabled:opacity-50"
              onClick={() => {
                setActionNotice(null);
                setActionBusy(true);
                void (async () => {
                  try {
                    const hasPair = quickHistTitle.trim().length >= 3 && quickHistDetail.trim().length >= 3;
                    const partial = quickHistTitle.trim().length > 0 || quickHistDetail.trim().length > 0;
                    if (partial && !hasPair) {
                      throw new Error("Provide both history title and detail (3+ chars), or leave both empty.");
                    }
                    await postAgentRuntime({
                      action: "update-status",
                      agentId: quickAgentId,
                      status: quickStatus,
                      lastTask: quickLastTask.trim(),
                      queueSize: quickQueue,
                      healthScore: quickHealth,
                      ...(hasPair
                        ? { historyTitle: quickHistTitle.trim(), historyDetail: quickHistDetail.trim() }
                        : {}),
                    });
                    setActionNotice({ type: "ok", text: "Status updated." });
                    await loadRuntime();
                  } catch (e) {
                    setActionNotice({ type: "err", text: e instanceof Error ? e.message : "Update failed." });
                  } finally {
                    setActionBusy(false);
                  }
                })();
              }}
            >
              Apply update
            </button>
          </div>
        </section>

        <section className="grid gap-3 grid-cols-1 lg:grid-cols-3">
          {props.guidanceCards.map((card) => (
            <Panel key={card.title} title={card.title}>
              <p className="text-slate-300">{card.body}</p>
            </Panel>
          ))}
        </section>

        <section className="grid gap-3 grid-cols-1">
          <Panel title="Ask what you want to do" subtitle="Simple owner-style request to recommended development-agent routing">
            <div className="grid gap-3 xl:grid-cols-[1.3fr_1fr]">
              <div className="space-y-3">
                <textarea
                  value={recommendationQuery}
                  onChange={(event) => setRecommendationQuery(event.target.value)}
                  className="min-h-[110px] w-full rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-sm text-slate-100 outline-none transition-all duration-200 focus:border-cyan-400/30"
                  placeholder="Example: I want to change trust verification and make sure deployment is safe."
                />
                <p className="text-[11px] text-slate-400">Write your need in simple language. The system will suggest the primary and supporting agents.</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-950/30 p-4 space-y-3">
                <div>
                  <div className="text-[10px] uppercase tracking-wide text-slate-500">Primary agent</div>
                  <Link href={`/admin/agents/${recommendationResult.primaryAgentId}`} className="mt-1 inline-flex items-center rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1 text-sm font-medium text-cyan-200 hover:border-cyan-400/40">
                    {recommendationResult.primaryAgentId}
                  </Link>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-wide text-slate-500">Supporting agents</div>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {recommendationResult.supportingAgentIds.map((agentId) => (
                      <Link key={agentId} href={`/admin/agents/${agentId}`} className="inline-flex items-center rounded-full border border-white/10 bg-slate-900/60 px-3 py-1 text-[11px] text-slate-200 hover:border-cyan-400/30">
                        {agentId}
                      </Link>
                    ))}
                  </div>
                </div>
                <div className="rounded-xl border border-white/10 bg-slate-950/30 p-3 text-slate-300">{recommendationResult.reason}</div>
              </div>
            </div>
          </Panel>
        </section>

        <section className="grid gap-3 grid-cols-1">
          <Panel title="Which agent should I use?" subtitle="Owner-friendly starting scenarios with recommended primary and supporting agents">
            <div className="flex flex-wrap gap-2">
              {props.chooserCategories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setActiveChooserCategory(category.id)}
                  className={`min-h-touch rounded-full border px-3 py-1.5 text-[11px] font-medium transition-all duration-200 ${activeChooserCategory === category.id ? "border-cyan-400/30 bg-cyan-500/10 text-cyan-200" : "border-white/10 bg-slate-950/30 text-slate-300 hover:border-cyan-400/20"}`}
                >
                  {category.label}
                </button>
              ))}
            </div>
            <div className="grid gap-3 grid-cols-1 xl:grid-cols-2">
              {filteredChooserRecommendations.map((item) => (
                <div key={item.id} className="rounded-2xl border border-white/10 bg-slate-950/30 p-3 space-y-3">
                  <div className="space-y-1">
                    <h3 className="text-[12px] sm:text-[13px] font-semibold text-slate-100">{item.title}</h3>
                    <p className="text-slate-300">{item.ownerNeed}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center rounded-full border border-white/10 bg-slate-900/60 px-2 py-0.5 text-[10px] font-medium text-slate-200">
                      {props.chooserCategories.find((category) => category.id === item.category)?.label ?? item.category}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-[11px]">
                    <span className="text-slate-400">Primary:</span>
                    <Link href={`/admin/agents/${item.primaryAgentId}`} className="inline-flex items-center rounded-full border border-cyan-400/20 bg-cyan-500/10 px-2 py-0.5 font-medium text-cyan-200 hover:border-cyan-400/40">
                      {item.primaryAgentId}
                    </Link>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                    <span className="text-slate-400">Supporting:</span>
                    {item.supportingAgentIds.map((agentId) => (
                      <Link key={agentId} href={`/admin/agents/${agentId}`} className="inline-flex items-center rounded-full border border-white/10 bg-slate-900/60 px-2 py-0.5 text-slate-200 hover:border-cyan-400/30">
                        {agentId}
                      </Link>
                    ))}
                  </div>
                  <div className="rounded-xl border border-white/10 bg-slate-950/30 p-3 text-slate-300">{item.reason}</div>
                </div>
              ))}
            </div>
            {filteredChooserRecommendations.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/10 bg-slate-950/20 p-4 text-slate-400">
                No owner scenarios are defined for this chooser category yet.
              </div>
            ) : null}
          </Panel>
        </section>

        <section className="space-y-3">
          {props.groups.map((group) => (
            <Panel key={group.title} title={group.title} subtitle={group.detail}>
              <div className="grid gap-3 grid-cols-1 xl:grid-cols-2">
                {group.agents.map((agent) => {
                  const runtime = runtimeStatusMap.get(agent.id);
                  const statusMeta = runtime ? getAgentStatusMeta(runtime.status) : null;
                  const groupMeta = getAgentGroupMeta(agent.group);

                  return (
                    <Link
                      key={agent.id}
                      href={`/admin/agents/${agent.id}`}
                      className={`block rounded-2xl border border-white/10 bg-slate-950/30 p-3 space-y-3 transition-all duration-200 ${groupMeta.borderClassName} hover:shadow-neon-blue`}
                    >
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div className="space-y-1">
                          <h3 className="text-[12px] sm:text-[13px] font-semibold text-slate-100">{agent.id}</h3>
                          <p className="text-[11px] text-slate-400">{agent.owner}</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium ${groupMeta.badgeClassName}`}>{groupMeta.badgeLabel}</span>
                          {statusMeta ? <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium ${statusMeta.className}`}>{statusMeta.label}</span> : null}
                          {runtime ? <span className="inline-flex items-center rounded-full border border-emerald-400/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-200">{runtime.mode.toUpperCase()}</span> : null}
                        </div>
                      </div>
                      <p className="text-slate-300">{agent.summary}</p>
                      {runtime ? (
                        <div className="grid gap-2 sm:grid-cols-3 text-[11px]">
                          <div className="rounded-xl border border-white/10 bg-slate-950/30 p-2 text-slate-300">Queue: <span className="font-medium text-slate-100">{runtime.queueSize}</span></div>
                          <div className="rounded-xl border border-white/10 bg-slate-950/30 p-2 text-slate-300">Health: <span className="font-medium text-slate-100">{runtime.healthScore}%</span></div>
                          <div className="rounded-xl border border-white/10 bg-slate-950/30 p-2 text-slate-300">Update: <span className="font-medium text-slate-100">{runtime.lastUpdatedLabel}</span></div>
                        </div>
                      ) : null}
                      <div className="flex flex-wrap items-center justify-between gap-2 text-[11px]">
                        <span className="text-slate-400">{runtime ? runtime.lastTask : "Default flow starts with orchestration and verification."}</span>
                        <span className="font-medium text-cyan-300">Open detail view →</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </Panel>
          ))}
        </section>

        <section className="grid gap-3 grid-cols-1 xl:grid-cols-2">
          <Panel title="Recent Runtime Handoffs" subtitle="Latest accepted or completed agent-to-agent work">
            <div className="grid gap-2">
              {latestHandoffs.length > 0 ? latestHandoffs.map((handoff) => (
                <div key={handoff.id} className="rounded-xl border border-white/10 bg-slate-950/30 p-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="font-medium text-slate-100">{handoff.fromAgentId} → {handoff.toAgentId}</div>
                    <span className="inline-flex items-center rounded-full border border-white/10 bg-slate-900/60 px-2 py-0.5 text-[10px] text-slate-300">{handoff.status}</span>
                  </div>
                  <div className="mt-1 text-slate-300">{handoff.requestSummary}</div>
                  <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
                    <span>Expected: {handoff.expectedOutput} · {handoff.createdAtLabel}</span>
                    {handoff.status === "accepted" ? (
                      <button
                        type="button"
                        disabled={actionBusy}
                        className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2 py-1 text-[10px] font-semibold text-emerald-100 hover:border-emerald-400/50 disabled:opacity-50"
                        onClick={() => {
                          setActionNotice(null);
                          setActionBusy(true);
                          void (async () => {
                            try {
                              await postAgentRuntime({ action: "complete-handoff", handoffId: handoff.id });
                              setActionNotice({ type: "ok", text: "Handoff completed." });
                              await loadRuntime();
                            } catch (e) {
                              setActionNotice({ type: "err", text: e instanceof Error ? e.message : "Complete failed." });
                            } finally {
                              setActionBusy(false);
                            }
                          })();
                        }}
                      >
                        Mark complete
                      </button>
                    ) : null}
                  </div>
                </div>
              )) : <div className="rounded-xl border border-dashed border-white/10 bg-slate-950/20 p-3 text-slate-500">No runtime handoffs have been created yet.</div>}
            </div>
          </Panel>

          <Panel title="Shared Status Legend" subtitle="Use the same lifecycle language across all agent work">
            <div className="grid gap-2 sm:grid-cols-2">
              {props.statuses.map((status) => (
                <div key={status.name} className="rounded-xl border border-white/10 bg-slate-950/30 p-3">
                  <div className="text-[11px] font-semibold uppercase tracking-wide text-cyan-300">{status.name}</div>
                  <p className="mt-1 text-slate-300">{status.meaning}</p>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="Default Handoff Order" subtitle="Normal flow for development-agent coordination">
            <ol className="grid gap-2 sm:grid-cols-2">
              {props.handoffOrder.map((agent, index) => (
                <li key={agent} className="rounded-xl border border-white/10 bg-slate-950/30 p-3">
                  <div className="text-[10px] uppercase tracking-wide text-slate-500">Step {index + 1}</div>
                  <div className="mt-1 text-slate-100 font-medium">{agent}</div>
                </li>
              ))}
            </ol>
          </Panel>
        </section>

        <section className="grid gap-3 grid-cols-1 xl:grid-cols-2">
          <Panel title="Ownership Highlights" subtitle="Fast rules for routing sensitive or cross-domain work">
            <ul className="space-y-2 text-slate-300">
              {props.ownershipHighlights.map((item) => <li key={item}>• {item}</li>)}
            </ul>
          </Panel>

          <Panel title="Workflow Contract Snapshot" subtitle="Minimum app-level behavior for development-agent coordination">
            <ul className="space-y-2 text-slate-300">
              <li>• Default start: `{props.workflowContract.defaultStartingAgent}`</li>
              <li>• Specialists per request: up to {props.workflowContract.maxSpecialistsPerRequest}</li>
              <li>• Risk review route: `{props.workflowContract.routeRiskThrough}`</li>
              <li>• Memory route: `{props.workflowContract.routeMemoryThrough}`</li>
              <li>• Release verification route: `{props.workflowContract.releaseVerificationThrough}`</li>
            </ul>
          </Panel>
        </section>

        <section className="grid gap-3 grid-cols-1">
          <Panel title="What this dashboard is for" subtitle="Keep the system understandable for a non-technical owner">
            <ul className="space-y-2 text-slate-300">
              {props.dashboardPurpose.map((item) => <li key={item}>• {item}</li>)}
            </ul>
          </Panel>
        </section>
      </div>
    </main>
  );
}
