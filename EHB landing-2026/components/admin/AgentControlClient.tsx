"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Activity,
  AlertTriangle,
  Bot,
  Briefcase,
  CheckCircle2,
  GitBranch,
  HeartPulse,
  Info,
  Layers,
  LayoutGrid,
  ListTree,
  MessageSquareQuote,
  PauseCircle,
  Rocket,
  ShieldCheck,
  Sparkles,
  Wrench,
} from "lucide-react";
import { Accordion } from "@/components/ui/accordion";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardIcon, CardTitle } from "@/components/ui/card";
import { KpiCard } from "@/components/ui/KpiCard";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { RuntimeToast, type RuntimeToastPayload } from "@/components/ui/RuntimeToast";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip } from "@/components/ui/tooltip";
import { getChooserCategoryTheme } from "@/lib/agents/chooserStyles";

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
    idle: { label: "Idle", className: "border-slate-400/20 bg-slate-500/10 text-ehb-textBody" },
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

  const routingMatchScore = useMemo(() => {
    const q = recommendationQuery.toLowerCase();
    const hit = recommendationRules.some((rule) => rule.keywords.some((kw) => q.includes(kw)));
    return hit ? 92 : 68;
  }, [recommendationQuery, recommendationRules]);

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
    <main className="min-h-screen text-white" aria-busy={runtimeRefreshing || actionBusy}>
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
                <p className="max-w-2xl text-[12px] sm:text-[13px] leading-relaxed text-ehb-textMuted">
                  Dashboard view: live runtime status, per-agent task, and health — stored locally for development (not production telemetry).
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                href="/admin"
                className="min-h-touch inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-slate-900/60 px-4 py-2 text-[12px] font-semibold text-white hover:border-cyan-400/30 hover:bg-slate-800/80"
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
            icon={<Bot className="text-ehb-textBody" aria-hidden />}
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
                <p className="mt-0.5 text-[11px] text-ehb-textMuted">
                  Agents in <span className="text-emerald-300/90">working / planning / verifying / reading</span> — with current task text from runtime.
                </p>
              </div>
            </div>
            <div className="text-right text-[11px] tabular-nums text-ehb-textMuted">
              <span className="text-lg font-semibold text-emerald-300">{busyAgentsNow.length}</span>
              <span className="text-ehb-textMuted"> / {rosterTotal}</span>
              <span className="block text-[10px] text-ehb-textMuted">share of roster “in motion”</span>
            </div>
          </div>
          <div className="mt-4 space-y-1.5">
            <div className="flex justify-between text-[10px] uppercase tracking-wide text-ehb-textMuted">
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
                    <p className="text-[11px] text-ehb-textMuted line-clamp-2">
                      <span className="text-ehb-textMuted">Task: </span>
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
                    <h2 className="text-sm sm:text-base font-semibold text-white">{group.title}</h2>
                    <p className="text-[11px] text-ehb-textMuted">{group.detail}</p>
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
                                <h3 className="truncate font-mono text-[12px] sm:text-[13px] font-semibold text-white">
                                  {agent.id}
                                </h3>
                                <p className="text-[11px] text-ehb-textMuted">{agent.owner}</p>
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
                                  <span className="inline-flex items-center rounded-full border border-white/10 bg-slate-900/60 px-2 py-0.5 text-[10px] text-ehb-textBody">
                                    {runtime.mode}
                                  </span>
                                ) : null}
                              </div>
                            </div>
                            <p className="line-clamp-2 text-[11px] leading-snug text-ehb-textBody">{agent.summary}</p>
                            {runtime ? (
                              <div className="space-y-1.5">
                                <div className="flex items-center justify-between text-[10px] text-ehb-textMuted">
                                  <span className="flex items-center gap-1">
                                    <HeartPulse className="h-3 w-3" aria-hidden />
                                    Health
                                  </span>
                                  <span className="tabular-nums text-ehb-textBody">{runtime.healthScore}%</span>
                                </div>
                                <MiniProgressBar
                                  value={runtime.healthScore}
                                  max={100}
                                  barClassName="bg-gradient-to-r from-emerald-500 to-cyan-400"
                                />
                                <div className="grid grid-cols-2 gap-2 text-[10px] sm:grid-cols-3">
                                  <div className="rounded-lg border border-white/10 bg-slate-950/40 px-2 py-1.5 text-ehb-textMuted">
                                    Queue <span className="font-medium text-white">{runtime.queueSize}</span>
                                  </div>
                                  <div className="rounded-lg border border-white/10 bg-slate-950/40 px-2 py-1.5 text-ehb-textMuted">
                                    Updated <span className="font-medium text-white">{runtime.lastUpdatedLabel}</span>
                                  </div>
                                  <div className="col-span-2 rounded-lg border border-white/10 bg-slate-950/40 px-2 py-1.5 text-ehb-textMuted sm:col-span-1">
                                    <span className="block text-[9px] uppercase tracking-wide text-ehb-textMuted">Current task</span>
                                    <span className="line-clamp-2 text-[11px] text-ehb-textBody">{runtime.lastTask}</span>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <p className="text-[11px] text-ehb-textMuted">No runtime row yet — open detail or use quick control.</p>
                            )}
                            <div className="flex items-center justify-between pt-1 text-[11px] text-cyan-300/90">
                              <span className="text-ehb-textMuted">Open playbook →</span>
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

        <section className="space-y-3">
          <Alert variant="default" icon={<Info className="h-4 w-4" aria-hidden />} title="Runtime data source">
            Status and tasks are stored in local <Badge variant="outline">data/agents/</Badge> files for development. This is not live production telemetry or autonomous AI execution.
          </Alert>
          {runtimeError ? (
            <Alert variant="destructive" icon={<AlertTriangle className="h-4 w-4" aria-hidden />} title="Could not load runtime">
              {runtimeError}
            </Alert>
          ) : null}
        </section>

        <Card className="border-cyan-500/20 bg-gradient-to-br from-slate-950/90 via-slate-900/80 to-slate-950 shadow-[0_0_40px_-12px_rgba(34,211,238,0.25)]">
          <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-3 sm:pb-2">
            <div className="flex gap-3">
              <CardIcon className="from-violet-500/30 to-blue-600/20 border-violet-400/25">
                <Wrench className="h-5 w-5" aria-hidden />
              </CardIcon>
              <div>
                <Badge variant="cyan" className="mb-1.5">
                  Super Admin
                </Badge>
                <CardTitle>Quick runtime control</CardTitle>
                <CardDescription className="mt-1 max-w-xl">
                  Update agent status, queue, and health. Production requires a real Super Admin session.
                </CardDescription>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Tooltip content="Sets every roster agent to Working + shared task (local runtime only)">
                <span>
                  <button
                    type="button"
                    disabled={actionBusy || runtimeRefreshing}
                    className="min-h-touch inline-flex items-center justify-center gap-1.5 rounded-xl border border-emerald-400/35 bg-emerald-500/15 px-4 py-2 text-[11px] font-semibold text-emerald-100 hover:bg-emerald-500/25 disabled:opacity-50"
                    onClick={() => {
                      if (!window.confirm("Set ALL agents to Working on the dashboard? (Updates local runtime files.)")) return;
                      const custom = window.prompt(
                        "Optional: same Last task for every agent (3–200 chars). Leave empty for default text.",
                        "",
                      );
                      const trimmed = custom?.trim() ?? "";
                      setRuntimeToast(null);
                      setActionBusy(true);
                      void (async () => {
                        try {
                          await postAgentRuntime({
                            action: "set-all-working",
                            ...(trimmed.length >= 3 ? { lastTask: trimmed.slice(0, 200) } : {}),
                          });
                          setRuntimeToast({ type: "ok", text: "All agents set to Working." });
                          await loadRuntime();
                        } catch (e) {
                          setRuntimeToast({ type: "err", text: e instanceof Error ? e.message : "Bulk update failed." });
                        } finally {
                          setActionBusy(false);
                        }
                      })();
                    }}
                  >
                    Set all to Working
                  </button>
                </span>
              </Tooltip>
              <Tooltip content="Restores seed data from the catalog (confirmation required)">
                <span>
                  <button
                    type="button"
                    disabled={actionBusy || runtimeRefreshing}
                    className="min-h-touch inline-flex items-center justify-center rounded-xl border border-rose-400/35 bg-rose-500/10 px-4 py-2 text-[11px] font-semibold text-rose-100 hover:bg-rose-500/20 disabled:opacity-50"
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
                </span>
              </Tooltip>
            </div>
          </CardHeader>
          <Separator className="mx-4 sm:mx-5" />
          <CardContent>
            <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                <div className="space-y-1.5">
                  <Label htmlFor="qc-agent">Agent</Label>
                  <select
                    id="qc-agent"
                    className="min-h-touch w-full rounded-xl border border-white/12 bg-slate-950/70 px-3 py-2 text-[12px] text-white outline-none focus:border-cyan-400/40 focus:ring-1 focus:ring-cyan-400/30"
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
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="qc-status">Status</Label>
                  <select
                    id="qc-status"
                    className="min-h-touch w-full rounded-xl border border-white/12 bg-slate-950/70 px-3 py-2 text-[12px] text-white outline-none focus:border-cyan-400/40"
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
                </div>
                <div className="space-y-1.5 sm:col-span-2 xl:col-span-1">
                  <Label htmlFor="qc-task">Last task</Label>
                  <input
                    id="qc-task"
                    className="min-h-touch w-full rounded-xl border border-white/12 bg-slate-950/70 px-3 py-2 text-[12px] text-white outline-none focus:border-cyan-400/40"
                    value={quickLastTask}
                    disabled={actionBusy || runtimeRefreshing}
                    onChange={(e) => setQuickLastTask(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="qc-queue">Queue</Label>
                  <input
                    id="qc-queue"
                    type="number"
                    min={0}
                    max={999}
                    className="min-h-touch w-full rounded-xl border border-white/12 bg-slate-950/70 px-3 py-2 text-[12px] text-white"
                    value={quickQueue}
                    disabled={actionBusy || runtimeRefreshing}
                    onChange={(e) => setQuickQueue(Number(e.target.value))}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="qc-health">Health %</Label>
                  <input
                    id="qc-health"
                    type="number"
                    min={0}
                    max={100}
                    className="min-h-touch w-full rounded-xl border border-white/12 bg-slate-950/70 px-3 py-2 text-[12px] text-white"
                    value={quickHealth}
                    disabled={actionBusy || runtimeRefreshing}
                    onChange={(e) => setQuickHealth(Number(e.target.value))}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="qc-ht">Hist. title (opt.)</Label>
                  <input
                    id="qc-ht"
                    className="min-h-touch w-full rounded-xl border border-white/12 bg-slate-950/70 px-3 py-2 text-[12px] text-white"
                    placeholder="Optional"
                    value={quickHistTitle}
                    disabled={actionBusy || runtimeRefreshing}
                    onChange={(e) => setQuickHistTitle(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="qc-hd">Hist. detail (opt.)</Label>
                  <input
                    id="qc-hd"
                    className="min-h-touch w-full rounded-xl border border-white/12 bg-slate-950/70 px-3 py-2 text-[12px] text-white"
                    placeholder="Use with title (3+ chars each)"
                    value={quickHistDetail}
                    disabled={actionBusy || runtimeRefreshing}
                    onChange={(e) => setQuickHistDetail(e.target.value)}
                  />
                </div>
              </div>
              <Tooltip content="Writes to runtime.json + optional history row">
                <span className="inline-flex lg:pb-0.5">
                  <button
                    type="button"
                    disabled={actionBusy || runtimeRefreshing || !quickAgentId}
                    className="min-h-touch inline-flex items-center justify-center rounded-xl border border-cyan-400/35 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 px-5 py-2.5 text-[12px] font-semibold text-cyan-50 shadow-lg shadow-cyan-500/10 hover:from-cyan-500/30 hover:to-blue-600/30 disabled:opacity-50"
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
                </span>
              </Tooltip>
            </div>
          </CardContent>
        </Card>

        <section className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="normal-case tracking-normal">
              Guidance
            </Badge>
            <h2 className="text-sm font-semibold text-white">Quick routing rules</h2>
          </div>
          <Accordion
            defaultOpenId="g0"
            items={props.guidanceCards.map((card, i) => ({
              id: `g${i}`,
              title: card.title,
              icon:
                i === 0 ? (
                  <Rocket className="h-4 w-4 text-cyan-300" />
                ) : i === 1 ? (
                  <ShieldCheck className="h-4 w-4 text-violet-300" />
                ) : (
                  <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                ),
              content: <p className="text-ehb-textBody">{card.body}</p>,
            }))}
          />
        </section>

        <Card className="border-violet-500/20 bg-gradient-to-br from-violet-950/20 via-slate-950 to-slate-900/90">
          <CardHeader className="flex flex-row flex-wrap items-start gap-3">
            <CardIcon className="from-fuchsia-500/25 to-violet-600/20 border-fuchsia-400/20">
              <MessageSquareQuote className="h-5 w-5" aria-hidden />
            </CardIcon>
            <div className="min-w-0 flex-1">
              <CardTitle>Ask what you want to do</CardTitle>
              <CardDescription>Plain-language request → suggested primary & supporting agents (keyword routing).</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 xl:grid-cols-[1.15fr_1fr]">
              <div className="space-y-2">
                <Label htmlFor="owner-query">Your request</Label>
                <textarea
                  id="owner-query"
                  value={recommendationQuery}
                  onChange={(event) => setRecommendationQuery(event.target.value)}
                  className="min-h-[120px] w-full resize-y rounded-xl border border-white/12 bg-slate-950/70 px-4 py-3 text-[13px] leading-relaxed text-white outline-none transition-all focus:border-violet-400/40 focus:ring-1 focus:ring-violet-400/25"
                  placeholder="Example: I want to change trust verification and make sure deployment is safe."
                />
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] uppercase tracking-wide text-ehb-textMuted">
                    <Tooltip content="Heuristic match strength for this text">
                      <span className="cursor-help border-b border-dotted border-slate-500">Routing match</span>
                    </Tooltip>
                    <span>{routingMatchScore}%</span>
                  </div>
                  <Progress value={routingMatchScore} barClassName="bg-gradient-to-r from-violet-500 to-fuchsia-500" />
                </div>
              </div>
              <div className="space-y-3 rounded-xl border border-white/10 bg-slate-950/50 p-4">
                <div>
                  <div className="text-[10px] font-medium uppercase tracking-wide text-ehb-textMuted">Primary agent</div>
                  <Link
                    href={`/admin/agents/${recommendationResult.primaryAgentId}`}
                    className="mt-1 inline-flex items-center rounded-full border border-cyan-400/30 bg-cyan-500/15 px-3 py-1.5 text-[12px] font-medium text-cyan-100 hover:border-cyan-400/50"
                  >
                    {recommendationResult.primaryAgentId}
                  </Link>
                </div>
                <Separator />
                <div>
                  <div className="text-[10px] font-medium uppercase tracking-wide text-ehb-textMuted">Supporting</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {recommendationResult.supportingAgentIds.map((agentId) => (
                      <Link
                        key={agentId}
                        href={`/admin/agents/${agentId}`}
                        className="inline-flex items-center rounded-full border border-white/12 bg-slate-900/70 px-2.5 py-1 text-[11px] text-ehb-textBody hover:border-violet-400/35"
                      >
                        {agentId}
                      </Link>
                    ))}
                  </div>
                </div>
                <div className="rounded-lg border border-violet-500/20 bg-violet-950/25 p-3 text-[12px] leading-snug text-ehb-textBody">{recommendationResult.reason}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Which agent should I use?</CardTitle>
            <CardDescription>Pick a category tab, then open a scenario card. Colors match scenario type.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Tabs
              defaultValue={props.chooserCategories[0]?.id ?? "all"}
              value={activeChooserCategory}
              onValueChange={setActiveChooserCategory}
            >
              <TabsList className="w-full justify-start overflow-x-auto pb-0.5">
                {props.chooserCategories.map((category) => (
                  <TabsTrigger key={category.id} value={category.id} className="shrink-0">
                    {category.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
            <div className="grid gap-3 grid-cols-1 xl:grid-cols-2">
              {filteredChooserRecommendations.map((item) => {
                const theme = getChooserCategoryTheme(item.category);
                return (
                  <div
                    key={item.id}
                    className={`group relative overflow-hidden rounded-2xl border p-4 transition-shadow hover:shadow-lg ${theme.card}`}
                  >
                    <div className={`absolute left-0 top-0 h-full w-1 bg-gradient-to-b ${theme.bar}`} aria-hidden />
                    <div className="space-y-3 pl-2">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <h3 className="text-[13px] font-semibold text-white">{item.title}</h3>
                        <Badge variant={theme.badge}>{props.chooserCategories.find((c) => c.id === item.category)?.label ?? item.category}</Badge>
                      </div>
                      <p className="text-[12px] leading-relaxed text-ehb-textBody">{item.ownerNeed}</p>
                      <div className="flex flex-wrap items-center gap-2 text-[11px]">
                        <span className="text-ehb-textMuted">Primary</span>
                        <Link
                          href={`/admin/agents/${item.primaryAgentId}`}
                          className="inline-flex items-center rounded-full border border-cyan-400/25 bg-cyan-500/10 px-2 py-0.5 font-medium text-cyan-100 hover:border-cyan-400/45"
                        >
                          {item.primaryAgentId}
                        </Link>
                      </div>
                      <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                        <span className="text-ehb-textMuted">Supporting</span>
                        {item.supportingAgentIds.map((agentId) => (
                          <Link
                            key={agentId}
                            href={`/admin/agents/${agentId}`}
                            className="inline-flex items-center rounded-full border border-white/10 bg-slate-900/70 px-2 py-0.5 text-ehb-textBody hover:border-white/25"
                          >
                            {agentId}
                          </Link>
                        ))}
                      </div>
                      <div className="rounded-lg border border-white/10 bg-slate-950/40 p-3 text-[12px] text-ehb-textBody">{item.reason}</div>
                    </div>
                  </div>
                );
              })}
            </div>
            {filteredChooserRecommendations.length === 0 ? (
              <div className="rounded-xl border border-dashed border-amber-400/25 bg-amber-950/20 p-4 text-center text-[12px] text-amber-100/90">
                No scenarios for this filter — try <strong>All scenarios</strong>.
              </div>
            ) : null}
          </CardContent>
        </Card>

        <Card className="border-slate-600/25 bg-gradient-to-b from-slate-900/80 to-slate-950">
          <CardHeader className="flex flex-row flex-wrap items-center gap-3">
            <CardIcon className="from-slate-600/40 to-slate-800/30 border-slate-500/30">
              <GitBranch className="h-5 w-5" aria-hidden />
            </CardIcon>
            <div>
              <CardTitle>Handoffs, legend & flow order</CardTitle>
              <CardDescription>Switch tabs — same data, clearer layout.</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="handoffs">
              <TabsList className="mb-4 w-full flex-wrap justify-start gap-1">
                <TabsTrigger value="handoffs">Recent handoffs</TabsTrigger>
                <TabsTrigger value="legend">Status legend</TabsTrigger>
                <TabsTrigger value="order">Default order</TabsTrigger>
              </TabsList>
              <TabsContent value="handoffs" className="mt-0">
                <div className="grid gap-2">
                  {latestHandoffs.length > 0 ? (
                    latestHandoffs.map((handoff) => (
                      <div
                        key={handoff.id}
                        className="rounded-xl border border-white/10 bg-slate-950/50 p-3 transition-colors hover:border-cyan-400/20"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="font-mono text-[11px] font-medium text-cyan-100">
                            {handoff.fromAgentId} → {handoff.toAgentId}
                          </div>
                          <Badge
                            variant={
                              handoff.status === "completed" ? "emerald" : handoff.status === "cancelled" ? "rose" : "amber"
                            }
                          >
                            {handoff.status}
                          </Badge>
                        </div>
                        <p className="mt-2 text-[12px] text-ehb-textBody">{handoff.requestSummary}</p>
                        <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-[11px] text-ehb-textMuted">
                          <span>
                            Expected: <span className="text-ehb-textMuted">{handoff.expectedOutput}</span> · {handoff.createdAtLabel}
                          </span>
                          {handoff.status === "accepted" ? (
                            <button
                              type="button"
                              disabled={actionBusy || runtimeRefreshing}
                              className="rounded-full border border-emerald-400/35 bg-emerald-500/15 px-3 py-1 text-[10px] font-semibold text-emerald-100 hover:bg-emerald-500/25 disabled:opacity-50"
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
                    ))
                  ) : (
                    <Alert variant="warning" icon={<ListTree className="h-4 w-4" />} title="No handoffs yet">
                      Create one from an agent detail page or API, or use seed data after reset.
                    </Alert>
                  )}
                </div>
              </TabsContent>
              <TabsContent value="legend" className="mt-0">
                <div className="grid gap-2 sm:grid-cols-2">
                  {props.statuses.map((status) => (
                    <div
                      key={status.name}
                      className="rounded-xl border border-cyan-500/15 bg-gradient-to-br from-slate-950/80 to-cyan-950/20 p-3"
                    >
                      <Badge variant="cyan" className="mb-2 normal-case">
                        {status.name}
                      </Badge>
                      <p className="text-[12px] leading-snug text-ehb-textBody">{status.meaning}</p>
                    </div>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="order" className="mt-0">
                <ol className="grid gap-2 sm:grid-cols-2">
                  {props.handoffOrder.map((agent, index) => (
                    <li
                      key={agent}
                      className="flex gap-3 rounded-xl border border-violet-500/20 bg-violet-950/20 p-3"
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-500/20 text-[11px] font-bold text-violet-200">
                        {index + 1}
                      </span>
                      <div className="min-w-0">
                        <div className="text-[10px] uppercase tracking-wide text-violet-300/80">Step</div>
                        <div className="font-mono text-[12px] font-medium text-white">{agent}</div>
                      </div>
                    </li>
                  ))}
                </ol>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="grid gap-3 grid-cols-1 xl:grid-cols-2">
          <Card className="border-emerald-500/20 bg-emerald-950/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-400" aria-hidden />
                Ownership highlights
              </CardTitle>
              <CardDescription>Sensitive routing rules at a glance.</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2.5 text-[12px] text-ehb-textBody">
                {props.ownershipHighlights.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400/80" aria-hidden />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="border-blue-500/20 bg-blue-950/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-blue-400" aria-hidden />
                Workflow contract
              </CardTitle>
              <CardDescription>Default orchestration limits.</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-[12px] text-ehb-textBody">
                <li>
                  <span className="text-ehb-textMuted">Start: </span>
                  <code className="rounded bg-slate-900/80 px-1.5 py-0.5 text-[11px] text-cyan-200">{props.workflowContract.defaultStartingAgent}</code>
                </li>
                <li>
                  <span className="text-ehb-textMuted">Max specialists: </span>
                  {props.workflowContract.maxSpecialistsPerRequest}
                </li>
                <li>
                  <span className="text-ehb-textMuted">Risk: </span>
                  <code className="text-[11px] text-ehb-textBody">{props.workflowContract.routeRiskThrough}</code>
                </li>
                <li>
                  <span className="text-ehb-textMuted">Memory: </span>
                  <code className="text-[11px] text-ehb-textBody">{props.workflowContract.routeMemoryThrough}</code>
                </li>
                <li>
                  <span className="text-ehb-textMuted">Release: </span>
                  <code className="text-[11px] text-ehb-textBody">{props.workflowContract.releaseVerificationThrough}</code>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <Alert variant="success" icon={<CheckCircle2 className="h-4 w-4" />} title="What this screen is for">
          <ul className="mt-2 list-inside list-disc space-y-1 text-[12px] text-emerald-50/95">
            {props.dashboardPurpose.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Alert>
      </div>
    </main>
  );
}
