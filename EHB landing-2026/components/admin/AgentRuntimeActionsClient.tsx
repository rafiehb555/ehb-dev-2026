"use client";

import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState, type ReactNode } from "react";

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

const STATUS_OPTIONS: AgentStatus[] = [
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

const PRIORITY_OPTIONS = ["LOW", "NORMAL", "HIGH", "CRITICAL"] as const;

function SubPanel(props: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/25 p-3 space-y-2">
      <div className="text-[11px] font-semibold uppercase tracking-wide text-cyan-300">{props.title}</div>
      {props.children}
    </div>
  );
}

async function postRuntime(body: unknown) {
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

export default function AgentRuntimeActionsClient(props: {
  agentId: string;
  rosterAgentIds: ReadonlyArray<string>;
  completableHandoffs?: ReadonlyArray<{ id: string; fromAgentId: string; toAgentId: string; status: string }>;
}) {
  const router = useRouter();
  const targetAgents = useMemo(
    () => props.rosterAgentIds.filter((id) => id !== props.agentId),
    [props.rosterAgentIds, props.agentId],
  );

  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const [statusForm, setStatusForm] = useState({
    status: "working" as AgentStatus,
    lastTask: "Processing owner request in Cursor",
    queueSize: 0,
    healthScore: 85,
    historyTitle: "",
    historyDetail: "",
  });

  const [historyForm, setHistoryForm] = useState({
    status: "working" as AgentStatus,
    title: "Manual note",
    detail: "Recorded from the agent detail page.",
  });

  const [handoffForm, setHandoffForm] = useState({
    toAgentId: targetAgents[0] ?? "",
    requestSummary: "Coordinate next implementation step",
    reason: "Owner asked to continue with the specialist path",
    expectedOutput: "Clear next actions and verification notes",
    priority: "NORMAL" as (typeof PRIORITY_OPTIONS)[number],
  });

  const refresh = useCallback(() => {
    router.refresh();
  }, [router]);

  const run = useCallback(
    async (fn: () => Promise<void>) => {
      setNotice(null);
      setBusy(true);
      try {
        await fn();
        setNotice({ type: "ok", text: "Saved." });
        refresh();
      } catch (e) {
        setNotice({ type: "err", text: e instanceof Error ? e.message : "Action failed." });
      } finally {
        setBusy(false);
      }
    },
    [refresh],
  );

  return (
    <section className="glass-panel card-hover p-4 space-y-3 border border-cyan-500/15">
      <div className="space-y-1">
        <h2 className="text-sm sm:text-base font-semibold text-slate-100">Runtime actions</h2>
        <p className="text-[11px] text-slate-400">
          Updates persist to the local agent runtime store. In development, Super Admin actions are allowed without a separate login.
        </p>
      </div>

      {notice ? (
        <div
          className={`rounded-xl border px-3 py-2 text-[11px] ${
            notice.type === "ok" ? "border-emerald-400/25 bg-emerald-500/10 text-emerald-100" : "border-rose-400/25 bg-rose-500/10 text-rose-100"
          }`}
        >
          {notice.text}
        </div>
      ) : null}

      <div className="grid gap-3 grid-cols-1 xl:grid-cols-3">
        <SubPanel title="Update status">
          <div className="grid gap-2 text-[11px]">
            <label className="grid gap-1">
              <span className="text-slate-500">Status</span>
              <select
                className="rounded-xl border border-white/10 bg-slate-950/50 px-3 py-2 text-slate-100"
                value={statusForm.status}
                disabled={busy}
                onChange={(e) => setStatusForm((s) => ({ ...s, status: e.target.value as AgentStatus }))}
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-1">
              <span className="text-slate-500">Last task (3–200 chars)</span>
              <input
                className="rounded-xl border border-white/10 bg-slate-950/50 px-3 py-2 text-slate-100"
                value={statusForm.lastTask}
                disabled={busy}
                onChange={(e) => setStatusForm((s) => ({ ...s, lastTask: e.target.value }))}
              />
            </label>
            <div className="grid gap-2 sm:grid-cols-2">
              <label className="grid gap-1">
                <span className="text-slate-500">Queue</span>
                <input
                  type="number"
                  min={0}
                  max={999}
                  className="rounded-xl border border-white/10 bg-slate-950/50 px-3 py-2 text-slate-100"
                  value={statusForm.queueSize}
                  disabled={busy}
                  onChange={(e) => setStatusForm((s) => ({ ...s, queueSize: Number(e.target.value) }))}
                />
              </label>
              <label className="grid gap-1">
                <span className="text-slate-500">Health %</span>
                <input
                  type="number"
                  min={0}
                  max={100}
                  className="rounded-xl border border-white/10 bg-slate-950/50 px-3 py-2 text-slate-100"
                  value={statusForm.healthScore}
                  disabled={busy}
                  onChange={(e) => setStatusForm((s) => ({ ...s, healthScore: Number(e.target.value) }))}
                />
              </label>
            </div>
            <label className="grid gap-1">
              <span className="text-slate-500">Optional history title</span>
              <input
                className="rounded-xl border border-white/10 bg-slate-950/50 px-3 py-2 text-slate-100"
                placeholder="Leave empty to skip history row"
                value={statusForm.historyTitle}
                disabled={busy}
                onChange={(e) => setStatusForm((s) => ({ ...s, historyTitle: e.target.value }))}
              />
            </label>
            <label className="grid gap-1">
              <span className="text-slate-500">Optional history detail</span>
              <input
                className="rounded-xl border border-white/10 bg-slate-950/50 px-3 py-2 text-slate-100"
                placeholder="Required if title is set"
                value={statusForm.historyDetail}
                disabled={busy}
                onChange={(e) => setStatusForm((s) => ({ ...s, historyDetail: e.target.value }))}
              />
            </label>
            <button
              type="button"
              disabled={busy}
              className="min-h-touch rounded-full border border-cyan-400/30 bg-cyan-500/15 px-3 py-2 font-semibold text-cyan-100 hover:border-cyan-400/50 disabled:opacity-50"
              onClick={() =>
                run(async () => {
                  const hasPair =
                    statusForm.historyTitle.trim().length >= 3 && statusForm.historyDetail.trim().length >= 3;
                  const onlyOne =
                    statusForm.historyTitle.trim().length > 0 || statusForm.historyDetail.trim().length > 0;
                  if (onlyOne && !hasPair) {
                    throw new Error("Provide both history title and detail (3+ chars each), or leave both empty.");
                  }
                  await postRuntime({
                    action: "update-status",
                    agentId: props.agentId,
                    status: statusForm.status,
                    lastTask: statusForm.lastTask.trim(),
                    queueSize: statusForm.queueSize,
                    healthScore: statusForm.healthScore,
                    ...(hasPair
                      ? {
                          historyTitle: statusForm.historyTitle.trim(),
                          historyDetail: statusForm.historyDetail.trim(),
                        }
                      : {}),
                  });
                })
              }
            >
              Apply status
            </button>
          </div>
        </SubPanel>

        <SubPanel title="Append history only">
          <div className="grid gap-2 text-[11px]">
            <label className="grid gap-1">
              <span className="text-slate-500">Status label</span>
              <select
                className="rounded-xl border border-white/10 bg-slate-950/50 px-3 py-2 text-slate-100"
                value={historyForm.status}
                disabled={busy}
                onChange={(e) => setHistoryForm((s) => ({ ...s, status: e.target.value as AgentStatus }))}
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-1">
              <span className="text-slate-500">Title</span>
              <input
                className="rounded-xl border border-white/10 bg-slate-950/50 px-3 py-2 text-slate-100"
                value={historyForm.title}
                disabled={busy}
                onChange={(e) => setHistoryForm((s) => ({ ...s, title: e.target.value }))}
              />
            </label>
            <label className="grid gap-1">
              <span className="text-slate-500">Detail</span>
              <textarea
                className="min-h-[72px] rounded-xl border border-white/10 bg-slate-950/50 px-3 py-2 text-slate-100"
                value={historyForm.detail}
                disabled={busy}
                onChange={(e) => setHistoryForm((s) => ({ ...s, detail: e.target.value }))}
              />
            </label>
            <button
              type="button"
              disabled={busy}
              className="min-h-touch rounded-full border border-white/15 bg-slate-900/60 px-3 py-2 font-semibold text-slate-100 hover:border-cyan-400/30 disabled:opacity-50"
              onClick={() =>
                run(async () => {
                  await postRuntime({
                    action: "append-history",
                    agentId: props.agentId,
                    status: historyForm.status,
                    title: historyForm.title.trim(),
                    detail: historyForm.detail.trim(),
                  });
                })
              }
            >
              Append event
            </button>
          </div>
        </SubPanel>

        <SubPanel title="Create handoff from this agent">
          <div className="grid gap-2 text-[11px]">
            <label className="grid gap-1">
              <span className="text-slate-500">To agent</span>
              <select
                className="rounded-xl border border-white/10 bg-slate-950/50 px-3 py-2 text-slate-100"
                value={handoffForm.toAgentId}
                disabled={busy || targetAgents.length === 0}
                onChange={(e) => setHandoffForm((s) => ({ ...s, toAgentId: e.target.value }))}
              >
                {targetAgents.map((id) => (
                  <option key={id} value={id}>
                    {id}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-1">
              <span className="text-slate-500">Request summary</span>
              <input
                className="rounded-xl border border-white/10 bg-slate-950/50 px-3 py-2 text-slate-100"
                value={handoffForm.requestSummary}
                disabled={busy}
                onChange={(e) => setHandoffForm((s) => ({ ...s, requestSummary: e.target.value }))}
              />
            </label>
            <label className="grid gap-1">
              <span className="text-slate-500">Reason</span>
              <textarea
                className="min-h-[56px] rounded-xl border border-white/10 bg-slate-950/50 px-3 py-2 text-slate-100"
                value={handoffForm.reason}
                disabled={busy}
                onChange={(e) => setHandoffForm((s) => ({ ...s, reason: e.target.value }))}
              />
            </label>
            <label className="grid gap-1">
              <span className="text-slate-500">Expected output</span>
              <input
                className="rounded-xl border border-white/10 bg-slate-950/50 px-3 py-2 text-slate-100"
                value={handoffForm.expectedOutput}
                disabled={busy}
                onChange={(e) => setHandoffForm((s) => ({ ...s, expectedOutput: e.target.value }))}
              />
            </label>
            <label className="grid gap-1">
              <span className="text-slate-500">Priority</span>
              <select
                className="rounded-xl border border-white/10 bg-slate-950/50 px-3 py-2 text-slate-100"
                value={handoffForm.priority}
                disabled={busy}
                onChange={(e) =>
                  setHandoffForm((s) => ({ ...s, priority: e.target.value as (typeof PRIORITY_OPTIONS)[number] }))
                }
              >
                {PRIORITY_OPTIONS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="button"
              disabled={busy || targetAgents.length === 0}
              className="min-h-touch rounded-full border border-violet-400/30 bg-violet-500/15 px-3 py-2 font-semibold text-violet-100 hover:border-violet-400/50 disabled:opacity-50"
              onClick={() =>
                run(async () => {
                  await postRuntime({
                    action: "create-handoff",
                    fromAgentId: props.agentId,
                    toAgentId: handoffForm.toAgentId,
                    requestSummary: handoffForm.requestSummary.trim(),
                    reason: handoffForm.reason.trim(),
                    expectedOutput: handoffForm.expectedOutput.trim(),
                    priority: handoffForm.priority,
                  });
                })
              }
            >
              Create handoff
            </button>
          </div>
        </SubPanel>
      </div>

      {props.completableHandoffs && props.completableHandoffs.filter((h) => h.status === "accepted").length > 0 ? (
        <SubPanel title="Complete open handoff">
          <p className="text-[11px] text-slate-400 mb-2">Accepted handoffs waiting for closure.</p>
          <div className="flex flex-col gap-2">
            {props.completableHandoffs
              .filter((h) => h.status === "accepted")
              .map((h) => (
                <div
                  key={h.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-white/10 bg-slate-950/40 px-3 py-2 text-[11px]"
                >
                  <span className="text-slate-200">
                    {h.fromAgentId} → {h.toAgentId}{" "}
                    <span className="text-slate-500">({h.id})</span>
                  </span>
                  <button
                    type="button"
                    disabled={busy}
                    className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-[10px] font-semibold text-emerald-100 hover:border-emerald-400/50 disabled:opacity-50"
                    onClick={() =>
                      run(async () => {
                        await postRuntime({ action: "complete-handoff", handoffId: h.id });
                      })
                    }
                  >
                    Mark complete
                  </button>
                </div>
              ))}
          </div>
        </SubPanel>
      ) : null}
    </section>
  );
}
