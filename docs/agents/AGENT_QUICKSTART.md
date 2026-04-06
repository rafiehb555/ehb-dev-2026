# EHB Agent Quickstart

This guide explains how to use the EHB development agent system in simple terms.

## Start here

For most requests, start with `ceo-orchestrator-agent`.

Use it when:
- you are not sure which agent should help
- your request touches more than one area
- you want one simple answer instead of managing technical details yourself

## What this agent system is

The files in `docs/agents/` and `.cursor/skills/` define the EHB development and delivery agent system.

These agents help with:
- planning
- user flow
- UI consistency
- data decisions
- admin and DMO structure
- franchise logic
- trust systems
- deployment safety
- documentation
- governance
- observability
- memory and reuse
- dashboard design

## What this agent system is not

This agent system is different from the platform AI agents described in `docs/architecture/ai-agent-system.md`.

- `docs/agents/` = development orchestration agents for building and managing EHB work
- `docs/architecture/ai-agent-system.md` = future product/platform AI agents such as search, fraud detection, support, and trust-score automation

Use `docs/agents/RELATION_TO_PLATFORM_AI.md` if you need to understand the difference.

## Normal working order

1. Start with `ceo-orchestrator-agent`
2. Let it route work to 1-3 specialist agents
3. Use `deploy-sync-ops-agent` when run, build, Git, GitHub, or deployment verification is needed
4. Use `docs-knowledge-agent` to keep important docs aligned after major work

## Main reference files

- `docs/agents/AGENT_CATALOG.md`
- `docs/agents/AGENT_OWNERSHIP.md`
- `docs/agents/AGENT_HANDOFFS.md`
- `docs/agents/AGENT_STATUS_MODEL.md`
- `docs/agents/PLAYBOOK_INDEX.md`
- `docs/agents/EXAMPLE_PROMPTS.md`

## Status language

All agents should use the same status words:
- `idle`
- `reading-context`
- `planning`
- `waiting-for-input`
- `working`
- `verifying`
- `blocked`
- `failed`
- `completed`

## How to pick an agent quickly

- Need planning or what-to-build-next guidance: `product-roadmap-agent`
- Need page impact or journey tracing: `user-flow-agent`
- Need visual consistency: `ui-design-system-agent`
- Need source-of-truth or API/storage decisions: `data-architecture-agent`
- Need admin or DMO structure: `admin-dmo-agent`
- Need franchise workflow guidance: `franchise-agent`
- Need STL, verification, or trust guidance: `trust-systems-agent`
- Need safer rollout advice: `agent-governance-risk-agent`
- Need metrics or dashboard signals: `agent-observability-metrics-agent`
- Need reuse tracking or memory: `integration-memory-agent`
- Need agent dashboard design: `agent-ui-dashboard-agent`

## Recommended first reading order

1. `docs/agents/AGENT_CATALOG.md`
2. `docs/agents/AGENT_OWNERSHIP.md`
3. `docs/agents/AGENT_HANDOFFS.md`
4. `docs/agents/PLAYBOOK_INDEX.md`
5. `docs/agents/EXAMPLE_PROMPTS.md`

## Rule for non-technical owners

You do not need to decide:
- which file should change
- which technology should be used
- where the data should live
- where a button or card is reused

That is what the agent system is for.
