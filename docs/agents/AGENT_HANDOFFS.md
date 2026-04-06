# EHB Agent Handoffs

This file defines the standard handoff flow for the current EHB agents.

## Default handoff order

1. `ceo-orchestrator-agent`
2. `product-roadmap-agent` when scope or priority is unclear
3. `user-flow-agent` when journeys or page impact are involved
4. `ui-design-system-agent` when visual or component consistency is involved
5. `data-architecture-agent` when storage, schema, or shared data is involved
6. `docs-knowledge-agent` when project memory, explanation, or documentation is required
7. `admin-dmo-agent` when admin or DMO operational structure is involved
8. `franchise-agent` when franchise business or operator workflow is involved
9. `trust-systems-agent` when STL, verification, or trust logic is involved
10. `agent-governance-risk-agent` when risk, approval, or policy-sensitive changes are involved
11. `agent-observability-metrics-agent` when health signals, monitoring, or reporting are needed
12. `integration-memory-agent` when cross-module reuse, memory, or continuity are involved
13. `agent-ui-dashboard-agent` when the agent system itself needs a usable UI view
14. `deploy-sync-ops-agent` for final run, build, sync, or deploy verification

## Standard handoff format

Every handoff should include:
- request summary
- reason for handoff
- affected files or folders
- expected output
- verification needed after completion

## Example

`ceo-orchestrator-agent` receives:
"Change homepage industry cards and make sure the same content is correct everywhere."

Expected handoffs:
- `user-flow-agent` to trace impact
- `ui-design-system-agent` to review component consistency
- `data-architecture-agent` to verify source of truth
- `integration-memory-agent` to record reuse and shared dependency links
- `docs-knowledge-agent` to ensure the explanation and docs stay aligned
- `agent-governance-risk-agent` to flag rollout or trust risks if needed
- `deploy-sync-ops-agent` to verify build and routes
