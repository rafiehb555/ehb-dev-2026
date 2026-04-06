# EHB Agent Example Prompts

Use these prompts as copy-paste starters.

## Start here first

### `ceo-orchestrator-agent`
- Review this EHB request and tell me which 1 to 3 agents should handle it first.
- I am non-technical. Break this feature idea into clear EHB agent steps.
- This request touches admin, trust, and deployment. Route it safely.
- Tell me what final verification is needed before we treat this as complete.

## Planning and flow

### `product-roadmap-agent`
- Based on current EHB progress, what should we build next and what should wait?
- Turn this broad EHB feature idea into a phased delivery plan.
- Tell me what is done, what remains, and what dependencies block this work.

### `user-flow-agent`
- If I change this button, which EHB pages, roles, and routes are affected?
- Map the full user and admin journey for this feature before development starts.
- Trace where this card or data item is reused across EHB.

## Design and data

### `ui-design-system-agent`
- Make this EHB page match the shared admin and DMO design language.
- Review these cards and buttons and tell me what shared UI pattern should be used.
- Check if this visual change will create design drift across related pages.

### `data-architecture-agent`
- Where should this EHB data live: config, file store, API, or database?
- Tell me the source of truth for this repeated content and data.
- Review this change and separate demo behavior from real persistent behavior.

## Operations and docs

### `deploy-sync-ops-agent`
- Run the correct local, build, and deployment verification for this EHB change.
- Check local vs GitHub vs Vercel parity for this route or feature.
- Review the git state and tell me if it is safe to continue.

### `docs-knowledge-agent`
- Update the EHB docs to match this new agent or workflow change.
- Explain this technical EHB change in simple non-technical language.
- Tell me which docs are now outdated because of this work.

## Domain areas

### `admin-dmo-agent`
- Where should this new management feature live in admin or DMO?
- Review this DMO request and tell me which sections and views are affected.
- Make sure this operational workflow fits the existing admin and DMO structure.

### `franchise-agent`
- Review this franchise feature and separate public page impact from operator workflow impact.
- Tell me how this booking or inspection flow should work across EHB franchise surfaces.
- Check whether this change affects franchise hierarchy or DMO handoffs.

### `trust-systems-agent`
- Review this STL or verification change and tell me the trust impact.
- Check whether this review, badge, or approval logic could mislead users.
- Trace how this trust signal affects profile, marketplace, franchise, and DMO behavior.

## Advanced control

### `agent-governance-risk-agent`
- Review this EHB change for risk, approvals, and rollout safety.
- Tell me what should be blocked or require approval before this goes live.
- Check whether this request touches trust, money, permissions, or misleading claims.

### `agent-observability-metrics-agent`
- Tell me what metrics and health signals we should track for this workflow.
- Define a useful dashboard view for this EHB agent process.
- What failure signals should we monitor before we call this stable?

### `integration-memory-agent`
- Record the source-of-truth and reuse map for this EHB feature.
- Tell me where this same concept already appears in the codebase and docs.
- What decisions from this task should be saved for future EHB work?

### `agent-ui-dashboard-agent`
- Design the first EHB agent dashboard view for a non-technical owner.
- Tell me which agent cards, statuses, and handoff elements should appear first.
- Make a simple control-center structure for the EHB agent system.
