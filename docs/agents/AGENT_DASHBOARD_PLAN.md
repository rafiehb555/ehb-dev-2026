# EHB Agent Dashboard Plan

This file defines the first dashboard direction for the EHB development agent system.

## Goal

Create a simple first dashboard that helps a non-technical owner understand the current development agents, their roles, and their status language.

## Recommended placement

Primary location:
- `ehb-landing-demo/app/admin/`

Optional secondary entry:
- `ehb-landing-demo/app/dmo/super-admin/`

## Why admin comes first

- the dashboard is about development-agent visibility, not normal DMO operator workflow
- admin is the correct place for control-center style visibility
- DMO can later link to the dashboard, but should not own the first version

## First version scope

Version 1 should be read-only and documentation-aligned.

It should include:
- agent roster grouped by Core, Domain, and Advanced
- status legend using `docs/agents/AGENT_STATUS_MODEL.md`
- handoff order reference using `docs/agents/AGENT_HANDOFFS.md`
- ownership/risk reference using `docs/agents/AGENT_OWNERSHIP.md`
- a clear guidance block saying to start with `ceo-orchestrator-agent`

## First dashboard cards

### Agent roster

Show all development agents grouped by:
- Core
- Domain
- Advanced

### Status legend

Explain:
- `idle`
- `reading-context`
- `planning`
- `waiting-for-input`
- `working`
- `verifying`
- `blocked`
- `failed`
- `completed`

### Handoff reference

Show the normal order from `docs/agents/AGENT_HANDOFFS.md` so the owner can understand how work flows.

### Ownership and risk

Add a small guidance section that explains:
- when to use the orchestrator
- when risk review is needed
- when deploy verification is needed

## Guardrail

Do not show fake real-time telemetry in version 1.

Until a real data source exists, the dashboard should clearly say that statuses and flow are reference guidance, not live tracked runtime state.

## Future versions

Later versions can add:
- agent cards with real signal sources
- handoff timelines
- queue size and health widgets
- deployment and parity indicators
- risk and escalation panels

## Dependencies

This dashboard should stay aligned with:
- `docs/agents/AGENT_CATALOG.md`
- `docs/agents/AGENT_OWNERSHIP.md`
- `docs/agents/AGENT_HANDOFFS.md`
- `docs/agents/AGENT_STATUS_MODEL.md`
- `docs/agents/AGENT_WORKFLOW_CONTRACT.md`
