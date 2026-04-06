"use client";

import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import {
  Activity,
  Bot,
  Briefcase,
  HeartPulse,
  Layers,
  LayoutGrid,
  PauseCircle,
  Sparkles,
} from "lucide-react";
import { KpiCard } from "@/components/ui/KpiCard";
import { RuntimeToast, type RuntimeToastPayload } from "@/components/ui/RuntimeToast";

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

/** Distinct dashboard visuals per layer (routing / domain / advanced). */
function getGroupVisual(group: AgentGroupKey) {
  const meta = getAgentGroupMeta(group);
  const map = {
    core: {
      ...meta,
      panelWrap:
        "border-cyan-500/30 bg-gradient-to-br from-cyan-950/35 via-slate-950/90 to-slate-950 shadow-[inset_0_1px_0_0_rgba(34,211,238,0.12)]",
      cardShell:
        "border-cyan-500/25 bg-gradient-to-br from-cyan-950/35 to-slate-950/90 hover:border-cyan-400/50 hover:shadow-[0_0_24px_-4px_rgba(34,211,238,0.35)]",
      accentBar: "from-cyan-400 via-teal-400 to-emerald-500",
      iconBg: "from-cyan-500/50 to-teal-600/30 border border-cyan-400/30",
      Icon: Layers,
    },
    domain: {
      ...meta,
      panelWrap:
        "border-violet-500/30 bg-gradient-to-br from-violet-950/40 via-slate-950/90 to-slate-950 shadow-[inset_0_1px_0_0_rgba(167,139,250,0.12)]",
      cardShell:
        "border-violet-500/25 bg-gradient-to-br from-violet-950/35 to-slate-950/90 hover:border-violet-400/50 hover:shadow-[0_0_24px_-4px_rgba(167,139,250,0.35)]",
      accentBar: "from-violet-400 via-fuchsia-500 to-pink-500",
      iconBg: "from-violet-500/50 to-fuchsia-600/30 border border-violet-400/30",
      Icon: Briefcase,
    },
    advanced: {
      ...meta,
      panelWrap:
        "border-amber-500/30 bg-gradient-to-br from-amber-950/35 via-slate-950/90 to-slate-950 shadow-[inset_0_1px_0_0_rgba(251,191,36,0.1)]",
      cardShell:
        "border-amber-500/25 bg-gradient-to-br from-amber-950/30 to-slate-950/90 hover:border-amber-400/50 hover:shadow-[0_0_24px_-4px_rgba(251,191,36,0.3)]",
      accentBar: "from-amber-400 via-orange-500 to-rose-500",
      iconBg: "from-amber-500/45 to-orange-600/30 border border-amber-400/30",
      Icon: Sparkles,
    },
  } as const;
  return map[group];
}

const BUSY_RUNTIME_STATUSES: ReadonlySet<AgentStatus> = new Set([
  "working",
  "planning",
  "verifying",
  "reading-context",
]);

function MiniProgressBar(props: { value: number; max: number; barClassName: string }) {
  const pct = props.max > 0 ? Math.min(100, Math.round((props.value / props.max) * 100)) : 0;
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800/90">
      <div
        className={`h-full rounded-full transition-all duration-500 ${props.barClassName}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
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
  const [runtimeRefreshing, setRuntimeRefreshing] = useState(false);
  const [actionBusy, setActionBusy] = useState(false);
  const [runtimeToast, setRuntimeToast] = useState<RuntimeToastPayload>(null);

  const dismissToast = useCallback(() => setRuntimeToast(null), []);

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

  const busyAgentsNow = useMemo(
    () => runtimeStatuses.filter((s) => BUSY_RUNTIME_STATUSES.has(s.status)),
    [runtimeStatuses],
  );

  const rosterTotal = props.dashboardSummary.totalAgents;
  const busySharePct = useMemo(
    () => (rosterTotal > 0 ? Math.min(100, Math.round((busyAgentsNow.length / rosterTotal) * 100)) : 0),
    [busyAgentsNow.length, rosterTotal],
  );

  const loadRuntime = useCallback(async () => {
    setRuntimeRefreshing(true);
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
    } finally {
      setRuntimeRefreshing(false);
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
    <main className="min-h-screen text-slate-100" aria-busy={runtimeRefreshing || actionBusy}>
      <RuntimeToast toast={runtimeToast} onDismiss={dismissToast} />
      <div className="container-ehb py-6 sm:py-8 space-y-5 sm:space-y-6 text-[10px] xs:text-[11px]">
        <header className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/95 via-slate-950 to-slate-900 p-5 sm:p-6">
          <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-cyan-500/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-10 left-1/4 h-32 w-32 rounded-full bg-violet-500/10 blur-3xl" />
          <div className="relative flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500/40 to-blue-600/25 border border-cyan-400/20 shadow-lg">
                <LayoutGrid className="h-7 w-7 text-cyan-100" aria-hidden />
              </div>
              <div className="space-y-1.5">
                <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-cyan-300/90">Admin · Agent roster</p>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">Agent Control Center</h1>
                <p className="max-w-2xl text-[12px] sm:text-[13px] leading-relaxed text-slate-400">
                  Dashboard view: live runtime status, per-agent task, and health — stored locally for development (not production telemetry).
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                href="/admin"
                className="min-h-touch inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-slate-900/60 px-4 py-2 text-[12px] font-semibold text-slate-100 hover:border-cyan-400/30 hover:bg-slate-800/80"
              >
                ← Super Admin
              </Link>
              <Link
                href="/admin/development"
                className="min-h-touch inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2 text-[12px] font-semibold text-slate-950 shadow-md shadow-cyan-500/20"
              >
                Release center
              </Link>
            </div>
          </div>
        </header>

        <section className="grid gap-3 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
          <KpiCard
            label="Total agents"
            value={props.dashboardSummary.totalAgents}
            detail="Roster in catalog"
            icon={<Bot className="text-slate-300" aria-hidden />}
          />
          <KpiCard
            label="Active / blocked"
            value={runtimeSummary ? `${runtimeSummary.activeAgents} / ${runtimeSummary.blockedAgents}` : "—"}
            detail={
              runtimeSummary
                ? `Waiting: ${runtimeSummary.waitingAgents} · Done: ${runtimeSummary.completedAgents}`
                : "Loading runtime…"
            }
            icon={<Activity className="text-emerald-400/90" aria-hidden />}
          />
          <KpiCard
            label="Layers · Core / Domain / Adv"
            value={`${props.dashboardSummary.coreAgents} / ${props.dashboardSummary.domainAgents} / ${props.dashboardSummary.advancedAgents}`}
            detail="Different color sections below"
            icon={<Layers className="text-cyan-400/80" aria-hidden />}
          />
          <KpiCard
            label="Runtime feed"
            value={runtimeSummary ? `${runtimeSummary.liveModeAgents} live` : "—"}
            detail={
              runtimeRefreshing && runtimeSummary
                ? `Refreshing… · ${runtimeSummary.totalHandoffs} handoffs · ${runtimeSummary.totalHistoryEvents} events`
                : runtimeSummary
                  ? `${runtimeSummary.totalHandoffs} handoffs · ${runtimeSummary.totalHistoryEvents} events`
                  : `${props.dashboardSummary.sharedStatuses} status labels`
            }
            icon={<HeartPulse className="text-violet-400/80" aria-hidden />}
          />
        </section>

        <section className="rounded-2xl border border-emerald-500/25 bg-gradient-to-br from-emerald-950/30 via-slate-950/80 to-slate-950 p-4 sm:p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/40 to-cyan-600/30 border border-emerald-400/25">
                <Activity className="h-5 w-5 text-emerald-200" aria-hidden />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-white">Who is busy right now</h2>
                <p className="mt-0.5 text-[11px] text-slate-400">
                  Agents in <span className="text-emerald-300/90">working / planning / verifying / reading</span> — with current task text from runtime.
                </p>
              </div>
            </div>
            <div className="text-right text-[11px] tabular-nums text-slate-400">
              <span className="text-lg font-semibold text-emerald-300">{busyAgentsNow.length}</span>
              <span className="text-slate-500"> / {rosterTotal}</span>
              <span className="block text-[10px] text-slate-500">share of roster “in motion”</span>
            </div>
          </div>
          <div className="mt-4 space-y-1.5">
            <div className="flex justify-between text-[10px] uppercase tracking-wide text-slate-500">
              <span>Occupancy</span>
              <span>{busySharePct}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800/90">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500 transition-all duration-500"
                style={{ width: `${busySharePct}%` }}
              />
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {busyAgentsNow.length === 0 ? (
              <div className="flex items-center gap-2 rounded-xl border border-amber-400/25 bg-amber-500/10 px-3 py-2 text-[11px] text-amber-100">
                <PauseCircle className="h-4 w-4 shrink-0 text-amber-300" aria-hidden />
                <span>No agent is in an active working state right now (check runtime or update status below).</span>
              </div>
            ) : (
              busyAgentsNow.map((s) => {
                const sm = getAgentStatusMeta(s.status);
                return (
                  <Link
                    key={s.agentId}
                    href={`/admin/agents/${s.agentId}`}
                    className="group flex max-w-full min-w-0 flex-col gap-1 rounded-xl border border-emerald-500/30 bg-slate-950/60 px-3 py-2 text-left transition-all hover:border-emerald-400/50 hover:bg-slate-900/80"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="relative flex h-2 w-2 shrink-0">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-40" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                      </span>
                      <span className="truncate font-mono text-[11px] font-semibold text-emerald-100 group-hover:text-white">
                        {s.agentId}
                      </span>
                      <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium ${sm.className}`}>
                        {sm.label}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-2">
                      <span className="text-slate-500">Task: </span>
                      {s.lastTask}
                    </p>
                  </Link>
                );
              })
            )}
          </div>
        </section>

        <section className={`space-y-3 transition-opacity duration-200 ${runtimeRefreshing ? "opacity-60" : ""}`}>
          {props.groups.map((group) => {
            const firstAgent = group.agents[0];
            const gv = getGroupVisual(firstAgent ? firstAgent.group : "core");
            const GroupIcon = gv.Icon;
            return (
              <section
                key={group.title}
                className={`rounded-2xl border p-4 sm:p-5 ${gv.panelWrap}`}
              >
                <div className="mb-4 flex flex-wrap items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${gv.iconBg}`}>
                    <GroupIcon className="h-5 w-5 text-white" aria-hidden />
                  </div>
                  <div>
                    <h2 className="text-sm sm:text-base font-semibold text-slate-50">{group.title}</h2>
                    <p className="text-[11px] text-slate-400">{group.detail}</p>
                  </div>
                </div>
                <div className="grid gap-3 grid-cols-1 xl:grid-cols-2">
                  {group.agents.map((agent) => {
                    const runtime = runtimeStatusMap.get(agent.id);
                    const statusMeta = runtime ? getAgentStatusMeta(runtime.status) : null;
                    const gvis = getGroupVisual(agent.group);
                    const busy = runtime ? BUSY_RUNTIME_STATUSES.has(runtime.status) : false;
                    const CardIcon = gvis.Icon;

                    return (
                      <Link
                        key={agent.id}
                        href={`/admin/agents/${agent.id}`}
                        className={`relative block overflow-hidden rounded-2xl border p-4 text-left transition-all duration-200 ${gvis.cardShell}`}
                      >
                        <div
                          className={`absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b ${gvis.accentBar}`}
                          aria-hidden
                        />
                        <div className="relative flex gap-3 pl-2">
                          <div
                            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${gvis.iconBg}`}
                          >
                            <CardIcon className="h-6 w-6 text-white/95" aria-hidden />
                          </div>
                          <div className="min-w-0 flex-1 space-y-2">
                            <div className="flex flex-wrap items-start justify-between gap-2">
                              <div className="min-w-0">
                                <h3 className="truncate font-mono text-[12px] sm:text-[13px] font-semibold text-slate-50">
                                  {agent.id}
                                </h3>
                                <p className="text-[11px] text-slate-400">{agent.owner}</p>
                              </div>
                              <div className="flex flex-wrap items-center justify-end gap-1">
                                {busy ? (
                                  <span className="relative flex h-2 w-2">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />
                                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                                  </span>
                                ) : null}
                                {statusMeta ? (
                                  <span
                                    className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium ${statusMeta.className}`}
                                  >
                                    {statusMeta.label}
                                  </span>
                                ) : null}
                                {runtime ? (
                                  <span className="inline-flex items-center rounded-full border border-white/10 bg-slate-900/60 px-2 py-0.5 text-[10px] text-slate-300">
                                    {runtime.mode}
                                  </span>
                                ) : null}
                              </div>
                            </div>
                            <p className="line-clamp-2 text-[11px] leading-snug text-slate-300">{agent.summary}</p>
                            {runtime ? (
                              <div className="space-y-1.5">
                                <div className="flex items-center justify-between text-[10px] text-slate-500">
                                  <span className="flex items-center gap-1">
                                    <HeartPulse className="h-3 w-3" aria-hidden />
                                    Health
                                  </span>
                                  <span className="tabular-nums text-slate-300">{runtime.healthScore}%</span>
                                </div>
                                <MiniProgressBar
                                  value={runtime.healthScore}
                                  max={100}
                                  barClassName="bg-gradient-to-r from-emerald-500 to-cyan-400"
                                />
                                <div className="grid grid-cols-2 gap-2 text-[10px] sm:grid-cols-3">
                                  <div className="rounded-lg border border-white/10 bg-slate-950/40 px-2 py-1.5 text-slate-400">
                                    Queue <span className="font-medium text-slate-100">{runtime.queueSize}</span>
                                  </div>
                                  <div className="rounded-lg border border-white/10 bg-slate-950/40 px-2 py-1.5 text-slate-400">
                                    Updated <span className="font-medium text-slate-100">{runtime.lastUpdatedLabel}</span>
                                  </div>
                                  <div className="col-span-2 rounded-lg border border-white/10 bg-slate-950/40 px-2 py-1.5 text-slate-400 sm:col-span-1">
                                    <span className="block text-[9px] uppercase tracking-wide text-slate-500">Current task</span>
                                    <span className="line-clamp-2 text-[11px] text-slate-200">{runtime.lastTask}</span>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <p className="text-[11px] text-slate-500">No runtime row yet — open detail or use quick control.</p>
                            )}
                            <div className="flex items-center justify-between pt-1 text-[11px] text-cyan-300/90">
                              <span className="text-slate-500">Open playbook →</span>
                              <span className="font-medium">View</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </section>

        <p className="rounded-xl border border-white/10 bg-slate-950/50 px-3 py-2 text-[11px] text-slate-400">
          <span className="font-medium text-slate-300">Note:</span> Status is stored in local runtime files for development; it reflects manual updates and seeds, not automatic AI execution.
        </p>

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
              disabled={actionBusy || runtimeRefreshing}
              className="min-h-touch shrink-0 rounded-full border border-rose-400/30 bg-rose-500/10 px-3 py-1.5 text-[11px] font-semibold text-rose-100 hover:border-rose-400/50 disabled:opacity-50"
              onClick={() => {
                if (!window.confirm("Reset agent runtime files to catalog defaults?")) return;
                setRuntimeToast(null);
                setActionBusy(true);
                void (async () => {
                  try {
                    await postAgentRuntime({ action: "reset-runtime" });
                    setRuntimeToast({ type: "ok", text: "Runtime reset to defaults." });
                    await loadRuntime();
                  } catch (e) {
                    setRuntimeToast({ type: "err", text: e instanceof Error ? e.message : "Reset failed." });
                  } finally {
                    setActionBusy(false);
                  }
                })();
              }}
            >
              Reset to defaults
            </button>
          </div>
          <div className="grid gap-3 grid-cols-1 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3 text-[11px]">
              <label className="grid gap-1">
                <span className="text-slate-500">Agent</span>
                <select
                  className="rounded-xl border border-white/10 bg-slate-950/50 px-3 py-2 text-slate-100"
                  value={quickAgentId}
                  disabled={actionBusy || runtimeRefreshing || allAgentIds.length === 0}
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
                  disabled={actionBusy || runtimeRefreshing}
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
                  disabled={actionBusy || runtimeRefreshing}
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
                  disabled={actionBusy || runtimeRefreshing}
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
                  disabled={actionBusy || runtimeRefreshing}
                  onChange={(e) => setQuickHealth(Number(e.target.value))}
                />
              </label>
              <label className="grid gap-1">
                <span className="text-slate-500">Hist. title (opt.)</span>
                <input
                  className="rounded-xl border border-white/10 bg-slate-950/50 px-3 py-2 text-slate-100"
                  placeholder="Optional"
                  value={quickHistTitle}
                  disabled={actionBusy || runtimeRefreshing}
                  onChange={(e) => setQuickHistTitle(e.target.value)}
                />
              </label>
              <label className="grid gap-1 sm:col-span-2">
                <span className="text-slate-500">Hist. detail (opt.)</span>
                <input
                  className="rounded-xl border border-white/10 bg-slate-950/50 px-3 py-2 text-slate-100"
                  placeholder="Optional; use with title"
                  value={quickHistDetail}
                  disabled={actionBusy || runtimeRefreshing}
                  onChange={(e) => setQuickHistDetail(e.target.value)}
                />
              </label>
            </div>
            <button
              type="button"
              disabled={actionBusy || runtimeRefreshing || !quickAgentId}
              className="min-h-touch rounded-full border border-cyan-400/30 bg-cyan-500/15 px-4 py-2 text-[11px] font-semibold text-cyan-100 hover:border-cyan-400/50 disabled:opacity-50"
              onClick={() => {
                setRuntimeToast(null);
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
                    setRuntimeToast({ type: "ok", text: "Status updated." });
                    await loadRuntime();
                  } catch (e) {
                    setRuntimeToast({ type: "err", text: e instanceof Error ? e.message : "Update failed." });
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
                        disabled={actionBusy || runtimeRefreshing}
                        className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2 py-1 text-[10px] font-semibold text-emerald-100 hover:border-emerald-400/50 disabled:opacity-50"
                        onClick={() => {
                          setRuntimeToast(null);
                          setActionBusy(true);
                          void (async () => {
                            try {
                              await postAgentRuntime({ action: "complete-handoff", handoffId: handoff.id });
                              setRuntimeToast({ type: "ok", text: "Handoff completed." });
                              await loadRuntime();
                            } catch (e) {
                              setRuntimeToast({ type: "err", text: e instanceof Error ? e.message : "Complete failed." });
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
