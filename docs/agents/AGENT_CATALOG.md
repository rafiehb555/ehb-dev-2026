# EHB Agent Catalog

This file lists the current EHB agents and what each one owns.

## Phase 1 Core Agents

### `ceo-orchestrator-agent`
- Main entry point for non-technical requests
- Decides which specialist agents should work
- Converts business requests into structured execution

### `product-roadmap-agent`
- Owns sequencing, dependencies, and milestone planning
- Decides what should be built first and what can wait

### `user-flow-agent`
- Owns click paths, page-to-page impact, and role journeys
- Tracks where buttons, cards, and data are reused

### `ui-design-system-agent`
- Owns shared UI rules, cards, buttons, spacing, and consistency
- Protects visual quality across landing, home, DMO, and admin

### `data-architecture-agent`
- Owns storage decisions, schemas, API contracts, and shared data rules
- Decides whether data belongs in files, config, APIs, or database

### `deploy-sync-ops-agent`
- Owns local run, build verification, Git sync, GitHub push, and Vercel parity
- Handles deployment and environment safety checks

## Phase 2 Domain Agents

### `docs-knowledge-agent`
- Owns documentation quality, project memory, and non-technical explanations
- Keeps docs aligned with real code, workflows, and business direction

### `admin-dmo-agent`
- Owns DMO and admin operational structure
- Protects consistency across management dashboards, queues, and control screens

### `franchise-agent`
- Owns franchise business flows, operator workflows, bookings, and inspections
- Protects alignment between public franchise pages and internal franchise operations

### `trust-systems-agent`
- Owns STL, verification, review integrity, and trust-related status logic
- Protects platform credibility across trust signals and approval flows

## Phase 3 Advanced Agents

### `agent-governance-risk-agent`
- Owns risk review, approval boundaries, and policy-sensitive change safety
- Protects EHB from unsafe rollout decisions and unclear governance

### `agent-observability-metrics-agent`
- Owns health signals, progress metrics, and failure visibility
- Makes agent work, deployment status, and system health measurable

### `integration-memory-agent`
- Owns reusable project memory, cross-feature continuity, and reuse mapping
- Protects EHB from repeated decisions and fragmented source-of-truth logic

### `agent-ui-dashboard-agent`
- Owns the UI model for visualizing agents, statuses, handoffs, and progress
- Makes the agent system understandable to non-technical operators

## Usage rule

For normal work, requests should start with `ceo-orchestrator-agent`.
That agent decides whether 1 or more specialist agents need to be involved.
