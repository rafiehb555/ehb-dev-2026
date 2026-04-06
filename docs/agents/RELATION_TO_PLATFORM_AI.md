# EHB Development Agents vs Platform AI

This file prevents confusion between two different EHB agent layers.

## 1. Development agent system

The files in `docs/agents/` and `.cursor/skills/` define the EHB development agent system.

These agents help build, review, route, document, and verify work across the EHB codebase.

Examples:
- `ceo-orchestrator-agent`
- `user-flow-agent`
- `data-architecture-agent`
- `admin-dmo-agent`
- `deploy-sync-ops-agent`

## 2. Platform AI system

The file `docs/architecture/ai-agent-system.md` defines future product/platform AI agents.

Those agents help the EHB platform operate for end users and providers.

Examples:
- Search Agent
- Fraud Detection Agent
- Trust Score Agent
- Marketplace Optimization Agent
- Support Agent

## Why this difference matters

These are not the same system.

- `docs/agents/` agents = development and operating guidance for building EHB
- `docs/architecture/ai-agent-system.md` agents = future product intelligence inside the EHB platform

## How they should relate

- development agents can help design and implement platform AI systems
- platform AI systems should not be confused with Cursor skill ownership
- agent dashboards in admin or DMO should clearly say whether they show development agents or platform AI agents

## Safe naming rule

When writing docs or UI:
- say `EHB development agents` for the orchestration system in `docs/agents/`
- say `EHB platform AI agents` for the future product AI layer in `docs/architecture/ai-agent-system.md`

## Recommendation

If a future agent control center is built, keep separate areas for:
- development agent operations
- platform AI operations
