# EHB Agent Ownership

This file defines the ownership boundaries for the current EHB agents.

## Ownership map

### `ceo-orchestrator-agent`
- Owns request intake
- Owns task routing
- Does not own deep implementation details

### `product-roadmap-agent`
- Owns roadmap, priorities, and dependency order
- Uses `docs/`, roadmap files, and architecture rules as guidance

### `user-flow-agent`
- Owns user, admin, DMO, and franchise journeys
- Checks cross-page impact before changes are treated as isolated

### `ui-design-system-agent`
- Owns reusable UI patterns
- Owns card, button, spacing, and consistency review

### `data-architecture-agent`
- Owns source-of-truth decisions
- Owns storage-location decisions
- Owns API/data consistency review

### `deploy-sync-ops-agent`
- Owns local run, build, route checks, Git sync, and deploy verification
- Does not decide product or UX priorities

### `docs-knowledge-agent`
- Owns documentation clarity, memory, and translation of technical work for non-technical users
- Does not claim implementation is complete without verification

### `admin-dmo-agent`
- Owns DMO/admin area structure and operational workflow boundaries
- Coordinates when DMO changes affect franchise, trust, or shared data behavior

### `franchise-agent`
- Owns franchise journeys, hierarchy, bookings, inspections, and operator workflow logic
- Coordinates with DMO and trust systems for approvals and compliance paths

### `trust-systems-agent`
- Owns trust score logic, verification status, review integrity, and audit-sensitive trust changes
- Flags risks where credibility can be overstated or manipulated

### `agent-governance-risk-agent`
- Owns cross-domain risk review, approval gates, and policy-sensitive change checks
- Coordinates when trust, money, permissions, or compliance-like behavior is affected

### `agent-observability-metrics-agent`
- Owns monitoring intent, measurable signals, and failure visibility design
- Does not invent metrics unless there is a real source or realistic plan to create one

### `integration-memory-agent`
- Owns reusable context, decision continuity, and cross-module reuse awareness
- Helps maintain a long-term memory layer for future EHB agent workflows

### `agent-ui-dashboard-agent`
- Owns how the agent system should appear in UI for operators and owners
- Coordinates with observability and DMO/admin ownership for agent control-center design

## Shared rule

If a task touches multiple ownership areas, the orchestrator should coordinate the handoff.
