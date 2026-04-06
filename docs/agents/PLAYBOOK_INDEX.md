# EHB Agent Playbook Index

Use this file to find the right playbook quickly.

## Core agents

| Agent | Best for | Playbook |
|------|----------|----------|
| `ceo-orchestrator-agent` | broad non-technical requests and routing | `docs/agents/playbooks/ceo-orchestrator-agent.md` |
| `product-roadmap-agent` | planning, sequencing, and priorities | `docs/agents/playbooks/product-roadmap-agent.md` |
| `user-flow-agent` | page impact and role journeys | `docs/agents/playbooks/user-flow-agent.md` |
| `ui-design-system-agent` | reusable UI and design consistency | `docs/agents/playbooks/ui-design-system-agent.md` |
| `data-architecture-agent` | source of truth, APIs, storage, schemas | `docs/agents/playbooks/data-architecture-agent.md` |
| `deploy-sync-ops-agent` | local run, Git, GitHub, Vercel, parity | `docs/agents/playbooks/deploy-sync-ops-agent.md` |

## Domain agents

| Agent | Best for | Playbook |
|------|----------|----------|
| `docs-knowledge-agent` | docs updates and non-technical explanation | `docs/agents/playbooks/docs-knowledge-agent.md` |
| `admin-dmo-agent` | DMO/admin structure and operations | `docs/agents/playbooks/admin-dmo-agent.md` |
| `franchise-agent` | franchise journeys and operator logic | `docs/agents/playbooks/franchise-agent.md` |
| `trust-systems-agent` | STL, verification, review integrity, trust logic | `docs/agents/playbooks/trust-systems-agent.md` |

## Advanced agents

| Agent | Best for | Playbook |
|------|----------|----------|
| `agent-governance-risk-agent` | high-risk review and approval boundaries | `docs/agents/playbooks/agent-governance-risk-agent.md` |
| `agent-observability-metrics-agent` | metrics, health signals, and reporting | `docs/agents/playbooks/agent-observability-metrics-agent.md` |
| `integration-memory-agent` | reuse mapping and decision memory | `docs/agents/playbooks/integration-memory-agent.md` |
| `agent-ui-dashboard-agent` | agent control-center and dashboard UI | `docs/agents/playbooks/agent-ui-dashboard-agent.md` |

## Shared guides

- Quickstart: `docs/agents/AGENT_QUICKSTART.md`
- Prompt library: `docs/agents/EXAMPLE_PROMPTS.md`
- Ownership: `docs/agents/AGENT_OWNERSHIP.md`
- Handoffs: `docs/agents/AGENT_HANDOFFS.md`
- Status model: `docs/agents/AGENT_STATUS_MODEL.md`
- Platform AI difference: `docs/agents/RELATION_TO_PLATFORM_AI.md`
- Dashboard plan: `docs/agents/AGENT_DASHBOARD_PLAN.md`
- Workflow contract: `docs/agents/AGENT_WORKFLOW_CONTRACT.md`

## When not to skip the orchestrator

Start with `ceo-orchestrator-agent` when:
- the request is broad
- more than one system may be involved
- you are not sure which agent should own the work
- risk, rollout, or deployment may be involved
