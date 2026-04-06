import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { z } from "zod";
import {
  agentRuntimeHandoffs,
  agentRuntimeHistory,
  agentRuntimeStatuses,
  flatAgentDefinitions,
} from "@/lib/agents/catalog";
import {
  AgentHandoffRecordSchema,
  AgentRuntimeHistoryEventSchema,
  AgentRuntimeStatusSchema,
  type AgentHandoffRecord,
  type AgentPriority,
  type AgentRuntimeHistoryEvent,
  type AgentRuntimeSnapshot,
  type AgentRuntimeStatus,
} from "@/lib/agents/schemas";

const AGENT_DATA_DIR = path.join(process.cwd(), "data", "agents");
const RUNTIME_STATUS_PATH = path.join(AGENT_DATA_DIR, "runtime.json");
const RUNTIME_HISTORY_PATH = path.join(AGENT_DATA_DIR, "history.json");
const RUNTIME_HANDOFF_PATH = path.join(AGENT_DATA_DIR, "handoffs.json");
const MAX_HISTORY_EVENTS = 250;

const RuntimeStatusesFileSchema = z.array(AgentRuntimeStatusSchema);
const RuntimeHistoryFileSchema = z.array(AgentRuntimeHistoryEventSchema);
const RuntimeHandoffFileSchema = z.array(AgentHandoffRecordSchema);

function toRelativeLabel(iso: string, prefix = "Updated") {
  const diffMs = Math.max(0, Date.now() - new Date(iso).getTime());
  const diffMinutes = Math.floor(diffMs / 60000);

  if (diffMinutes <= 0) return `${prefix} just now`;
  if (diffMinutes < 60) return `${prefix} ${diffMinutes}m ago`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${prefix} ${diffHours}h ago`;

  const diffDays = Math.floor(diffHours / 24);
  return `${prefix} ${diffDays}d ago`;
}

function normalizeStatuses(statuses: AgentRuntimeStatus[]) {
  const order = new Map(flatAgentDefinitions.map((agent, index) => [agent.id, index]));

  return [...statuses]
    .sort((a, b) => (order.get(a.agentId) ?? 999) - (order.get(b.agentId) ?? 999))
    .map((status) => ({
      ...status,
      lastUpdatedLabel: toRelativeLabel(status.lastUpdatedAt),
    }));
}

function normalizeHistory(history: AgentRuntimeHistoryEvent[]) {
  return [...history]
    .sort((a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime())
    .map((event) => ({
      ...event,
      occurredAtLabel: toRelativeLabel(event.occurredAt, ""),
    }))
    .map((event) => ({
      ...event,
      occurredAtLabel: event.occurredAtLabel.replace(/^\s+/, "") || "Just now",
    }));
}

function normalizeHandoffs(handoffs: AgentHandoffRecord[]) {
  return [...handoffs]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .map((handoff) => ({
      ...handoff,
      createdAtLabel: toRelativeLabel(handoff.createdAt, ""),
    }))
    .map((handoff) => ({
      ...handoff,
      createdAtLabel: handoff.createdAtLabel.replace(/^\s+/, "") || "Just now",
    }));
}

const defaultRuntimeStatuses: AgentRuntimeStatus[] = agentRuntimeStatuses.map((status) => ({
  ...status,
  mode: "live",
  lastUpdatedLabel: toRelativeLabel(status.lastUpdatedAt),
}));

const defaultRuntimeHistory: AgentRuntimeHistoryEvent[] = agentRuntimeHistory.map((event) => ({
  ...event,
  mode: "live",
  occurredAtLabel: toRelativeLabel(event.occurredAt, "").replace(/^\s+/, "") || "Just now",
}));

const defaultRuntimeHandoffs: AgentHandoffRecord[] = agentRuntimeHandoffs.map((handoff) => ({
  ...handoff,
  createdAtLabel: toRelativeLabel(handoff.createdAt, "").replace(/^\s+/, "") || "Just now",
}));

async function ensureDirectory() {
  await mkdir(AGENT_DATA_DIR, { recursive: true });
}

async function readOrSeedFile<T>(
  filePath: string,
  fallback: T,
  parse: (value: unknown) => T,
): Promise<T> {
  await ensureDirectory();

  try {
    const raw = await readFile(filePath, "utf8");
    return parse(JSON.parse(raw));
  } catch {
    await writeFile(filePath, JSON.stringify(fallback, null, 2), "utf8");
    return fallback;
  }
}

async function writeStoreFile(filePath: string, value: unknown) {
  await ensureDirectory();
  await writeFile(filePath, JSON.stringify(value, null, 2), "utf8");
}

async function readStatuses() {
  return readOrSeedFile(RUNTIME_STATUS_PATH, defaultRuntimeStatuses, (value) =>
    RuntimeStatusesFileSchema.parse(value),
  );
}

async function readHistory() {
  return readOrSeedFile(RUNTIME_HISTORY_PATH, defaultRuntimeHistory, (value) =>
    RuntimeHistoryFileSchema.parse(value),
  );
}

async function readHandoffs() {
  return readOrSeedFile(RUNTIME_HANDOFF_PATH, defaultRuntimeHandoffs, (value) =>
    RuntimeHandoffFileSchema.parse(value),
  );
}

async function writeSnapshot(snapshot: AgentRuntimeSnapshot) {
  await Promise.all([
    writeStoreFile(RUNTIME_STATUS_PATH, snapshot.statuses),
    writeStoreFile(RUNTIME_HISTORY_PATH, snapshot.history),
    writeStoreFile(RUNTIME_HANDOFF_PATH, snapshot.handoffs),
  ]);
}

function createHistoryEvent(args: {
  agentId: string;
  status: AgentRuntimeStatus["status"];
  title: string;
  detail: string;
}): AgentRuntimeHistoryEvent {
  const occurredAt = new Date().toISOString();

  return {
    id: `agent_evt_${randomUUID().slice(0, 8)}`,
    agentId: args.agentId,
    status: args.status,
    title: args.title,
    detail: args.detail,
    occurredAt,
    occurredAtLabel: "Just now",
    mode: "live",
  };
}

function ensureStatusEntry(
  statuses: AgentRuntimeStatus[],
  agentId: string,
): AgentRuntimeStatus {
  const existing = statuses.find((item) => item.agentId === agentId);
  if (existing) return existing;

  const created: AgentRuntimeStatus = {
    agentId,
    status: "idle",
    queueSize: 0,
    healthScore: 80,
    lastTask: "Waiting for new work",
    mode: "live",
    lastUpdatedAt: new Date().toISOString(),
    lastUpdatedLabel: "Updated just now",
  };
  statuses.push(created);
  return created;
}

export async function readAgentRuntimeSnapshot(): Promise<AgentRuntimeSnapshot> {
  const [statuses, history, handoffs] = await Promise.all([
    readStatuses(),
    readHistory(),
    readHandoffs(),
  ]);

  return {
    statuses: normalizeStatuses(statuses),
    history: normalizeHistory(history),
    handoffs: normalizeHandoffs(handoffs),
  };
}

export function buildAgentRuntimeSummary(
  statuses: AgentRuntimeStatus[],
  history: AgentRuntimeHistoryEvent[],
  handoffs: AgentHandoffRecord[],
) {
  return {
    activeAgents: statuses.filter((item) =>
      ["working", "planning", "verifying", "reading-context"].includes(item.status),
    ).length,
    blockedAgents: statuses.filter((item) => item.status === "blocked").length,
    waitingAgents: statuses.filter((item) => item.status === "waiting-for-input").length,
    completedAgents: statuses.filter((item) => item.status === "completed").length,
    mockModeAgents: statuses.filter((item) => item.mode === "mock").length,
    liveModeAgents: statuses.filter((item) => item.mode === "live").length,
    totalHistoryEvents: history.length,
    totalHandoffs: handoffs.length,
    completedHandoffs: handoffs.filter((item) => item.status === "completed").length,
  };
}

export async function listAgentRuntimeStatuses() {
  return (await readAgentRuntimeSnapshot()).statuses;
}

export async function listAgentRuntimeHistory() {
  return (await readAgentRuntimeSnapshot()).history;
}

export async function listAgentRuntimeHandoffs() {
  return (await readAgentRuntimeSnapshot()).handoffs;
}

export async function getAgentRuntimeStatus(agentId: string) {
  return (await readAgentRuntimeSnapshot()).statuses.find((item) => item.agentId === agentId) ?? null;
}

export async function getAgentRuntimeHistory(agentId: string) {
  return (await readAgentRuntimeSnapshot()).history.filter((item) => item.agentId === agentId);
}

export async function getAgentRuntimeHandoffs(agentId: string) {
  return (await readAgentRuntimeSnapshot()).handoffs.filter(
    (item) => item.fromAgentId === agentId || item.toAgentId === agentId,
  );
}

export async function getAgentRuntimeSummary() {
  const snapshot = await readAgentRuntimeSnapshot();
  return buildAgentRuntimeSummary(snapshot.statuses, snapshot.history, snapshot.handoffs);
}

export async function updateAgentRuntimeStatus(args: {
  agentId: string;
  status: AgentRuntimeStatus["status"];
  queueSize?: number;
  healthScore?: number;
  lastTask: string;
  actorId?: string | null;
  historyTitle?: string;
  historyDetail?: string;
}) {
  const snapshot = await readAgentRuntimeSnapshot();
  const now = new Date().toISOString();
  const current = ensureStatusEntry(snapshot.statuses, args.agentId);

  const nextStatus: AgentRuntimeStatus = {
    ...current,
    status: args.status,
    queueSize: args.queueSize ?? current.queueSize,
    healthScore: args.healthScore ?? current.healthScore,
    lastTask: args.lastTask,
    mode: "live",
    lastUpdatedAt: now,
    lastUpdatedLabel: "Updated just now",
  };

  const statusExists = snapshot.statuses.some((item) => item.agentId === args.agentId);
  const nextStatuses = statusExists
    ? snapshot.statuses.map((item) => (item.agentId === args.agentId ? nextStatus : item))
    : [...snapshot.statuses, nextStatus];

  const nextHistory = [...snapshot.history];
  if (args.historyTitle && args.historyDetail) {
    nextHistory.unshift(
      createHistoryEvent({
        agentId: args.agentId,
        status: args.status,
        title: args.historyTitle,
        detail: args.historyDetail,
      }),
    );
  }

  await writeSnapshot({
    statuses: nextStatuses,
    history: nextHistory.slice(0, MAX_HISTORY_EVENTS),
    handoffs: snapshot.handoffs,
  });

  return normalizeStatuses([nextStatus])[0];
}

export async function appendAgentRuntimeHistory(args: {
  agentId: string;
  status: AgentRuntimeStatus["status"];
  title: string;
  detail: string;
}) {
  const snapshot = await readAgentRuntimeSnapshot();
  const event = createHistoryEvent(args);

  await writeSnapshot({
    statuses: snapshot.statuses,
    history: [event, ...snapshot.history].slice(0, MAX_HISTORY_EVENTS),
    handoffs: snapshot.handoffs,
  });

  return normalizeHistory([event])[0];
}

export async function createAgentHandoff(args: {
  fromAgentId: string;
  toAgentId: string;
  requestSummary: string;
  reason: string;
  expectedOutput: string;
  priority?: AgentPriority;
  triggeredById?: string | null;
}) {
  const snapshot = await readAgentRuntimeSnapshot();
  const now = new Date().toISOString();
  const nextAgentStatus = ensureStatusEntry(snapshot.statuses, args.toAgentId);

  const handoff: AgentHandoffRecord = {
    id: `agent_handoff_${randomUUID().slice(0, 8)}`,
    fromAgentId: args.fromAgentId,
    toAgentId: args.toAgentId,
    requestSummary: args.requestSummary,
    reason: args.reason,
    expectedOutput: args.expectedOutput,
    priority: args.priority ?? "NORMAL",
    status: "accepted",
    triggeredById: args.triggeredById ?? null,
    createdAt: now,
    updatedAt: now,
    createdAtLabel: "Just now",
  };

  const updatedToStatus: AgentRuntimeStatus = {
    ...nextAgentStatus,
    status: "reading-context",
    queueSize: nextAgentStatus.queueSize + 1,
    lastTask: args.requestSummary,
    mode: "live",
    lastUpdatedAt: now,
    lastUpdatedLabel: "Updated just now",
  };
  const hasToStatus = snapshot.statuses.some((status) => status.agentId === args.toAgentId);
  const nextStatuses = hasToStatus
    ? snapshot.statuses.map((status) =>
        status.agentId === args.toAgentId ? updatedToStatus : status,
      )
    : [...snapshot.statuses, updatedToStatus];

  const nextHistory = [
    createHistoryEvent({
      agentId: args.fromAgentId,
      status: "working",
      title: "Handoff sent",
      detail: `Sent work to ${args.toAgentId}: ${args.requestSummary}`,
    }),
    createHistoryEvent({
      agentId: args.toAgentId,
      status: "reading-context",
      title: "Handoff received",
      detail: `Received work from ${args.fromAgentId}: ${args.requestSummary}`,
    }),
    ...snapshot.history,
  ].slice(0, MAX_HISTORY_EVENTS);

  await writeSnapshot({
    statuses: nextStatuses,
    history: nextHistory,
    handoffs: [handoff, ...snapshot.handoffs],
  });

  return normalizeHandoffs([handoff])[0];
}

export async function completeAgentHandoff(args: {
  handoffId: string;
  actorId?: string | null;
}) {
  const snapshot = await readAgentRuntimeSnapshot();
  const handoff = snapshot.handoffs.find((item) => item.id === args.handoffId);

  if (!handoff) {
    throw new Error(`Handoff not found: ${args.handoffId}`);
  }

  const now = new Date().toISOString();
  const nextStatuses = snapshot.statuses.map((status) =>
    status.agentId === handoff.toAgentId
      ? {
          ...status,
          status: "completed" as const,
          queueSize: Math.max(0, status.queueSize - 1),
          lastTask: handoff.expectedOutput,
          mode: "live" as const,
          lastUpdatedAt: now,
          lastUpdatedLabel: "Updated just now",
        }
      : status,
  );

  const nextHandoffs = snapshot.handoffs.map((item) =>
    item.id === args.handoffId
      ? {
          ...item,
          status: "completed" as const,
          updatedAt: now,
          createdAtLabel: item.createdAtLabel,
        }
      : item,
  );

  const nextHistory = [
    createHistoryEvent({
      agentId: handoff.toAgentId,
      status: "completed",
      title: "Handoff completed",
      detail: `Completed handoff from ${handoff.fromAgentId}: ${handoff.expectedOutput}`,
    }),
    ...snapshot.history,
  ].slice(0, MAX_HISTORY_EVENTS);

  await writeSnapshot({
    statuses: nextStatuses,
    history: nextHistory,
    handoffs: nextHandoffs,
  });

  return normalizeHandoffs(nextHandoffs).find((item) => item.id === args.handoffId) ?? null;
}

export async function resetAgentRuntimeStore() {
  const snapshot: AgentRuntimeSnapshot = {
    statuses: defaultRuntimeStatuses,
    history: defaultRuntimeHistory,
    handoffs: defaultRuntimeHandoffs,
  };
  await writeSnapshot(snapshot);
  return readAgentRuntimeSnapshot();
}
