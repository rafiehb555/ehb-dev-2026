# EHB Agent Workflow Contract

This file defines the minimum viable workflow contract for the EHB development agent system.

## Core rule

All normal work should start with `ceo-orchestrator-agent`.

That agent decides whether 1 to 3 specialist agents should work next.

## Handoff payload

Every structured handoff should include:

- `handoffId`
- `correlationId`
- `fromAgent`
- `toAgent`
- `requestSummary`
- `reason`
- `affectedPaths`
- `expectedOutput`
- `verification`
- `priority`
- `blockedBy`
- `memoryRefs`

## Minimum field meanings

### `handoffId`

Unique ID for one handoff.

### `correlationId`

Shared ID connecting several related handoffs in one request.

### `fromAgent`

The agent that is sending the work.

### `toAgent`

The agent that should receive the work next.

### `requestSummary`

Simple description of what the owner wants.

### `reason`

Why this receiving agent is needed.

### `affectedPaths`

Relevant files or folders.

### `expectedOutput`

What the receiving agent must return.

### `verification`

What must be checked before the work is treated as complete.

### `priority`

Optional urgency label for ordering work.

### `blockedBy`

Optional dependency or blocker list.

### `memoryRefs`

Optional links to reuse notes, prior decisions, or source-of-truth references.

## Shared states

Use only these shared statuses:
- `idle`
- `reading-context`
- `planning`
- `waiting-for-input`
- `working`
- `verifying`
- `blocked`
- `failed`
- `completed`

## Suggested lifecycle

1. `idle`
2. `reading-context`
3. `planning`
4. `waiting-for-input` if a user answer is required
5. `working`
6. `verifying`
7. `completed` or `failed` or `blocked`

## Minimum viable behavior

- all normal work starts with `ceo-orchestrator-agent`
- the orchestrator routes only 1 to 3 specialists at a time
- every handoff includes verification expectations
- `agent-governance-risk-agent` reviews risky trust, money, permissions, moderation, or approval-sensitive work
- `integration-memory-agent` records reuse or source-of-truth continuity when the same concept appears across modules
- `deploy-sync-ops-agent` closes release-sensitive tasks when run, build, Git, GitHub, or deploy verification is required

## Recommended event language

Useful workflow events include:
- `context.started`
- `plan.ready`
- `input.required`
- `work.started`
- `verify.started`
- `handoff.requested`
- `handoff.accepted`
- `handoff.returned`
- `task.completed`
- `task.failed`
- `task.blocked`

## Safety rules

- do not mark work `completed` if required verification did not happen
- do not confuse documentation updates with proof that implementation is done
- do not present reference-only dashboard states as live runtime telemetry
- if trust, money, permissions, or misleading claims are involved, risk review should happen before rollout

## Dashboard alignment

Any future dashboard should use this workflow contract together with:
- `docs/agents/AGENT_STATUS_MODEL.md`
- `docs/agents/AGENT_HANDOFFS.md`
- `docs/agents/AGENT_DASHBOARD_PLAN.md`
