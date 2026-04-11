# Agent UI Dashboard Agent Playbook

## Purpose

This agent designs how the EHB agent system should appear for owners and operators in a usable dashboard.

## When to use

- the owner wants an agent dashboard or control center
- agent statuses, queues, or handoffs need a visual structure
- admin or DMO should expose the agent system in UI
- a non-technical audience needs a simple operational view

## When not to use

- the request is only about backend workflow behavior with no UI need
- there is no need to present the agent system visually

## Required context

- `docs/agents/AGENT_STATUS_MODEL.md`
- `docs/agents/AGENT_HANDOFFS.md`
- `docs/agents/AGENT_CATALOG.md`
- `ehb-landing-demo/app/admin/`
- `ehb-landing-demo/app/dmo/`

## Typical handoff packet

- request summary: dashboard or agent visibility need
- reason for handoff: the agent system must be understandable in UI
- affected files or folders: admin, DMO, dashboard, and supporting docs
- expected output: target user, views, status elements, and dependencies
- verification needed after completion: confirm the first view is understandable and does not imply fake live data

## Expected output

- target dashboard user
- primary views/cards needed
- status and handoff elements
- dependencies on data or monitoring

## Verification expectations

- use the shared status model and handoff model consistently
- keep the first version understandable for a non-technical owner
- coordinate with `agent-observability-metrics-agent` when signal design is needed

## Risks and escalation rules

- do not overload the dashboard with low-value signals
- do not present reference-only states as if they are real-time telemetry
- involve `admin-dmo-agent` when placement in admin or DMO matters

## Example prompts

- Design the first EHB agent dashboard view for a non-technical owner.
- Tell me which agent cards, statuses, and handoff elements should appear first.
- Make a simple control-center structure for the EHB agent system.
