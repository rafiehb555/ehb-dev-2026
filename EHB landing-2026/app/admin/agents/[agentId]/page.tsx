import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";

import AgentRuntimeActionsClient from "@/components/admin/AgentRuntimeActionsClient";
import { KpiCard } from "@/components/ui/KpiCard";
import {
  getAgentRelatedRecommendations,
  agentWorkflowContractSummary,
  flatAgentDefinitions,
  getAgentDetail,
  getAgentGroupMeta,
  getAgentHandoffTimeline,
  getAgentNeighbors,
  getRelatedAgents,
  getAgentStatusMeta,
} from "@/lib/agents/catalog";
import {
  getAgentRuntimeHandoffs,
  getAgentRuntimeHistory,
  getAgentRuntimeStatus,
} from "@/lib/agents/runtimeStore";

type AgentDetailPageProps = {
  params: {
    agentId: string;
  };
};

function Panel(props: { title: string; subtitle?: string; children: ReactNode }) {
  return (
    <section className="glass-panel card-hover p-4 space-y-3 border border-white/5">
      <div className="space-y-1">
        <h2 className="text-sm sm:text-base font-semibold text-white">{props.title}</h2>
        {props.subtitle ? <p className="text-[11px] text-ehb-textMuted">{props.subtitle}</p> : null}
      </div>
      {props.children}
    </section>
  );
}

export default async function AdminAgentDetailPage({ params }: AgentDetailPageProps) {
  const agent = getAgentDetail(params.agentId);

  if (!agent) {
    notFound();
  }

  const groupMeta = getAgentGroupMeta(agent.group);
  const { previous, next } = getAgentNeighbors(agent.id);
  const handoffTimeline = getAgentHandoffTimeline(agent.id);
  const runtime = await getAgentRuntimeStatus(agent.id);
  const runtimeHistory = await getAgentRuntimeHistory(agent.id);
  const runtimeHandoffs = await getAgentRuntimeHandoffs(agent.id);
  const statusMeta = runtime ? getAgentStatusMeta(runtime.status) : null;
  const relatedAgents = getRelatedAgents(agent.id);
  const relatedRecommendations = getAgentRelatedRecommendations(agent.id);

  return (
    <main className="min-h-screen text-white">
      <div className="container-ehb py-6 sm:py-8 space-y-5 sm:space-y-6 text-[10px] xs:text-[11px]">
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="space-y-1">
            <p className="text-[11px] uppercase tracking-[0.2em] text-ehb-textMuted">
              Admin · Development Agents · Detail
            </p>
            <h1 className="text-lg sm:text-xl font-semibold leading-tight gradient-text">
              {agent.id}
            </h1>
            <p className="text-ehb-textBody max-w-3xl">{agent.purpose}</p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              <span
                className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium ${groupMeta.badgeClassName}`}
              >
                {groupMeta.badgeLabel}
              </span>
              {statusMeta ? (
                <span
                  className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium ${statusMeta.className}`}
                >
                  {statusMeta.label}
                </span>
              ) : null}
              {runtime ? (
                <span className="inline-flex items-center rounded-full border border-emerald-400/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-200">
                  {runtime.mode.toUpperCase()}
                </span>
              ) : null}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/admin/agents"
              className="min-h-touch inline-flex items-center justify-center rounded-full glass-panel px-3 py-1.5 font-semibold text-white hover:shadow-neon-blue transition-all duration-200"
            >
              ← Back to Agent Center
            </Link>
            <Link
              href="/admin"
              className="min-h-touch inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#00eaff] to-[#3b82f6] px-3 py-1.5 font-semibold text-slate-950 btn-glow"
            >
              Open Super Admin
            </Link>
          </div>
        </header>

        <section className="grid gap-3 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
          <KpiCard label="Agent Group" value={groupMeta.badgeLabel} detail="Current operating layer" />
          <KpiCard label="Owner Focus" value={agent.owner} detail="Primary responsibility" />
          <KpiCard label="Max Specialists" value={agentWorkflowContractSummary.maxSpecialistsPerRequest} detail="Normal orchestrator routing limit" />
          <KpiCard
            label="Runtime Status"
            value={statusMeta ? statusMeta.label : "Unknown"}
            detail={runtime ? `Queue: ${runtime.queueSize} · Health: ${runtime.healthScore}%` : "No runtime feed"}
          />
        </section>

        <AgentRuntimeActionsClient
          agentId={agent.id}
          rosterAgentIds={flatAgentDefinitions.map((item) => item.id)}
          completableHandoffs={runtimeHandoffs.map((h) => ({
            id: h.id,
            fromAgentId: h.fromAgentId,
            toAgentId: h.toAgentId,
            status: h.status,
          }))}
        />

        {runtime ? (
          <section className="grid gap-3 grid-cols-1 xl:grid-cols-2">
            <Panel title="Current Runtime Snapshot" subtitle="Live snapshot from the local persistent runtime store">
              <div className="grid gap-2 sm:grid-cols-2">
                <div className="rounded-xl border border-white/10 bg-slate-950/30 p-3 text-ehb-textBody">
                  Last task: <span className="font-medium text-white">{runtime.lastTask}</span>
                </div>
                <div className="rounded-xl border border-white/10 bg-slate-950/30 p-3 text-ehb-textBody">
                  Last update: <span className="font-medium text-white">{runtime.lastUpdatedLabel}</span>
                </div>
                <div className="rounded-xl border border-white/10 bg-slate-950/30 p-3 text-ehb-textBody">
                  Queue size: <span className="font-medium text-white">{runtime.queueSize}</span>
                </div>
                <div className="rounded-xl border border-white/10 bg-slate-950/30 p-3 text-ehb-textBody">
                  Health score: <span className="font-medium text-white">{runtime.healthScore}%</span>
                </div>
              </div>
            </Panel>
            <Panel title="Runtime Guardrail" subtitle="Current status feed uses local persistent agent runtime">
              <div className="rounded-xl border border-amber-400/20 bg-amber-500/10 p-3 text-amber-100">
                This runtime panel uses `{runtime.mode}` status data stored in local agent runtime
                files for development operations. It should not be treated as external production
                telemetry.
              </div>
              <div className="rounded-xl border border-white/10 bg-slate-950/30 p-3 text-ehb-textBody">
                Release-sensitive verification still routes through
                {" "}
                <span className="font-medium text-white">
                  {agentWorkflowContractSummary.releaseVerificationThrough}
                </span>
                .
              </div>
            </Panel>
          </section>
        ) : null}

        <section className="grid gap-3 grid-cols-1 xl:grid-cols-2">
          <Panel title="Runtime History" subtitle="Recent status movement for this development agent">
            <div className="grid gap-2">
              {runtimeHistory.length > 0 ? (
                runtimeHistory.map((event) => {
                  const eventStatus = getAgentStatusMeta(event.status);

                  return (
                    <div
                      key={event.id}
                      className="rounded-xl border border-white/10 bg-slate-950/30 p-3 space-y-2"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="font-medium text-white">{event.title}</div>
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span
                            className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium ${eventStatus.className}`}
                          >
                            {eventStatus.label}
                          </span>
                          <span className="inline-flex items-center rounded-full border border-white/10 bg-slate-900/60 px-2 py-0.5 text-[10px] text-ehb-textBody">
                            {event.occurredAtLabel}
                          </span>
                        </div>
                      </div>
                      <p className="text-ehb-textBody">{event.detail}</p>
                    </div>
                  );
                })
              ) : (
                <div className="rounded-xl border border-dashed border-white/10 bg-slate-950/20 p-3 text-ehb-textMuted">
                  No runtime history is defined for this agent yet.
                </div>
              )}
            </div>
          </Panel>
          <Panel title="Runtime Handoffs" subtitle="Accepted or completed work connected to this agent">
            <div className="grid gap-2">
              {runtimeHandoffs.length > 0 ? (
                runtimeHandoffs.map((handoff) => (
                  <div key={handoff.id} className="rounded-xl border border-white/10 bg-slate-950/30 p-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="font-medium text-white">
                        {handoff.fromAgentId} → {handoff.toAgentId}
                      </div>
                      <span className="inline-flex items-center rounded-full border border-white/10 bg-slate-900/60 px-2 py-0.5 text-[10px] text-ehb-textBody">
                        {handoff.status}
                      </span>
                    </div>
                    <div className="mt-1 text-ehb-textBody">{handoff.requestSummary}</div>
                    <div className="mt-2 text-[11px] text-ehb-textMuted">
                      Expected: {handoff.expectedOutput} · {handoff.createdAtLabel}
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-xl border border-dashed border-white/10 bg-slate-950/20 p-3 text-ehb-textMuted">
                  No runtime handoffs are recorded for this agent yet.
                </div>
              )}
            </div>
          </Panel>
        </section>

        <section className="grid gap-3 grid-cols-1">
          <Panel title="Scenario Fit" subtitle="How this agent is usually selected in owner-facing routing">
            <div className="rounded-xl border border-white/10 bg-slate-950/30 p-3 text-ehb-textBody">
              {relatedRecommendations.length > 0
                ? "This agent already appears in guided owner scenarios, so it can be selected both by playbook recommendations and by free-text routing."
                : "This agent currently relies more on manual exploration and neighboring workflow context than on guided chooser scenarios."}
            </div>
            <div className="rounded-xl border border-white/10 bg-slate-950/30 p-3 text-ehb-textBody">
              Recommended pairing still depends on request type, risk level, and verification needs.
            </div>
          </Panel>
        </section>

        <section className="grid gap-3 grid-cols-1 xl:grid-cols-2">
          <Panel title="Agent Navigation" subtitle="Move through the development-agent roster">
            <div className="grid gap-2 sm:grid-cols-2">
              {previous ? (
                <Link
                  href={`/admin/agents/${previous.id}`}
                  className="rounded-xl border border-white/10 bg-slate-950/30 p-3 transition-all duration-200 hover:border-cyan-400/40"
                >
                  <div className="text-[10px] uppercase tracking-wide text-ehb-textMuted">Previous agent</div>
                  <div className="mt-1 font-medium text-white">{previous.id}</div>
                  <div className="mt-1 text-ehb-textMuted">{previous.owner}</div>
                </Link>
              ) : (
                <div className="rounded-xl border border-dashed border-white/10 bg-slate-950/20 p-3 text-ehb-textMuted">
                  This is the first agent in the current detail sequence.
                </div>
              )}
              {next ? (
                <Link
                  href={`/admin/agents/${next.id}`}
                  className="rounded-xl border border-white/10 bg-slate-950/30 p-3 transition-all duration-200 hover:border-cyan-400/40"
                >
                  <div className="text-[10px] uppercase tracking-wide text-ehb-textMuted">Next agent</div>
                  <div className="mt-1 font-medium text-white">{next.id}</div>
                  <div className="mt-1 text-ehb-textMuted">{next.owner}</div>
                </Link>
              ) : (
                <div className="rounded-xl border border-dashed border-white/10 bg-slate-950/20 p-3 text-ehb-textMuted">
                  This is the last agent in the current detail sequence.
                </div>
              )}
            </div>
          </Panel>
          <Panel title="Workflow Position" subtitle="How this agent appears in the default handoff order">
            <div className="rounded-xl border border-white/10 bg-slate-950/30 p-3">
              <div className="text-[10px] uppercase tracking-wide text-ehb-textMuted">Workflow role</div>
              <div className="mt-1 text-white font-medium">
                {handoffTimeline.find((item) => item.isCurrent)?.step
                  ? `Step ${handoffTimeline.find((item) => item.isCurrent)?.step} in the default handoff path`
                  : "Not in the default handoff path"}
              </div>
            </div>
          </Panel>
        </section>

        <section className="grid gap-3 grid-cols-1 xl:grid-cols-2">
          <Panel title="Related agents" subtitle="Suggested nearby agents based on owner scenarios and shared workflows">
            <div className="grid gap-2">
              {relatedAgents.length > 0 ? (
                relatedAgents.map((relatedAgent) => (
                  <Link
                    key={relatedAgent.id}
                    href={`/admin/agents/${relatedAgent.id}`}
                    className="rounded-xl border border-white/10 bg-slate-950/30 p-3 transition-all duration-200 hover:border-cyan-400/30"
                  >
                    <div className="font-medium text-white">{relatedAgent.id}</div>
                    <div className="mt-1 text-ehb-textMuted">{relatedAgent.owner}</div>
                  </Link>
                ))
              ) : (
                <div className="rounded-xl border border-dashed border-white/10 bg-slate-950/20 p-3 text-ehb-textMuted">
                  No related agents are mapped for this detail page yet.
                </div>
              )}
            </div>
          </Panel>
          <Panel title="Owner scenarios" subtitle="Where this agent appears in guided chooser recommendations">
            <div className="grid gap-2">
              {relatedRecommendations.length > 0 ? (
                relatedRecommendations.map((recommendation) => (
                  <div
                    key={recommendation.id}
                    className="rounded-xl border border-white/10 bg-slate-950/30 p-3"
                  >
                    <div className="font-medium text-white">{recommendation.title}</div>
                    <div className="mt-1 text-ehb-textBody">{recommendation.reason}</div>
                  </div>
                ))
              ) : (
                <div className="rounded-xl border border-dashed border-white/10 bg-slate-950/20 p-3 text-ehb-textMuted">
                  No chooser scenarios reference this agent yet.
                </div>
              )}
            </div>
          </Panel>
        </section>

        <section className="grid gap-3 grid-cols-1 xl:grid-cols-2">
          <Panel title="Summary">
            <p className="text-ehb-textBody">{agent.summary}</p>
          </Panel>
          <Panel title="When to use">
            <ul className="space-y-2 text-ehb-textBody">
              {agent.whenToUse.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </Panel>
        </section>

        <section className="grid gap-3 grid-cols-1 xl:grid-cols-2">
          <Panel title="When not to use">
            <ul className="space-y-2 text-ehb-textBody">
              {agent.whenNotToUse.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </Panel>
          <Panel title="Expected outputs">
            <ul className="space-y-2 text-ehb-textBody">
              {agent.outputs.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </Panel>
        </section>

        <section className="grid gap-3 grid-cols-1 xl:grid-cols-2">
          <Panel title="Verification expectations">
            <ul className="space-y-2 text-ehb-textBody">
              {agent.verification.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </Panel>
          <Panel title="Risks and escalation">
            <ul className="space-y-2 text-ehb-textBody">
              {agent.risks.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </Panel>
        </section>

        <section className="grid gap-3 grid-cols-1 xl:grid-cols-2">
          <Panel title="Reference files">
            <div className="grid gap-2">
              {agent.references.map((reference) => (
                <div
                  key={`${reference.label}-${reference.path}`}
                  className="rounded-xl border border-white/10 bg-slate-950/30 p-3"
                >
                  <div className="text-[11px] font-semibold text-cyan-300">{reference.label}</div>
                  <div className="mt-1 text-ehb-textBody">{reference.path}</div>
                </div>
              ))}
            </div>
          </Panel>
          <Panel title="Copy-paste prompts">
            <div className="grid gap-2">
              {agent.samplePrompts.map((prompt) => (
                <div key={prompt} className="rounded-xl border border-white/10 bg-slate-950/30 p-3 text-ehb-textBody">
                  {prompt}
                </div>
              ))}
            </div>
          </Panel>
        </section>

        <section className="grid gap-3 grid-cols-1">
          <Panel title="Default Handoff Timeline" subtitle="Reference-only workflow order with the current agent highlighted">
            <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
              {handoffTimeline.map((item) => (
                <div
                  key={item.id}
                  className={`rounded-xl border p-3 ${
                    item.isCurrent
                      ? "border-cyan-400/40 bg-cyan-500/10"
                      : item.isPast
                        ? "border-white/10 bg-slate-950/40"
                        : "border-white/10 bg-slate-950/20"
                  }`}
                >
                  <div className="text-[10px] uppercase tracking-wide text-ehb-textMuted">Step {item.step}</div>
                  <div className="mt-1 font-medium text-white">{item.id}</div>
                  <div className="mt-1 text-[11px] text-ehb-textMuted">
                    {item.isCurrent ? "Current detail agent" : item.isPast ? "Earlier in the default flow" : "Later in the default flow"}
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </section>
      </div>
    </main>
  );
}
