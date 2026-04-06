# CEO Orchestrator Agent Playbook

## Purpose

This is the main entry point for most EHB owner requests. It translates a broad or non-technical request into a small, structured set of specialist tasks.

## When to use

- the request is broad or unclear
- multiple systems may be involved
- the owner does not know which technical area is affected
- one clear answer is needed after several specialist reviews

## When not to use

- the request already clearly belongs to one specialist agent
- the task is only about a single narrow verification step already owned by another agent

## Required context

- `docs/agents/AGENT_CATALOG.md`
- `docs/agents/AGENT_OWNERSHIP.md`
- `docs/agents/AGENT_HANDOFFS.md`
- `docs/INDEX.md`
- major impacted app areas such as `ehb-landing-demo/app/`, `ehb-landing-demo/components/`, and `ehb-landing-demo/lib/`

## Typical handoff packet

- request summary: owner request in simple language
- reason for handoff: why roadmap, flow, UI, data, docs, DMO, franchise, trust, or deploy review is needed
- affected files or folders: best-known impact area
- expected output: specialist summary or decision
- verification needed after completion: final checks, usually with `deploy-sync-ops-agent` if implementation is involved

## Expected output

- what the user wants
- which 1 to 3 specialist agents should work
- why those agents were selected
- what final verification is needed

## Verification expectations

- confirm the routing matches ownership boundaries in `docs/agents/AGENT_OWNERSHIP.md`
- escalate to `user-flow-agent` or `data-architecture-agent` if impact is unclear
- involve `deploy-sync-ops-agent` when local, build, Git, GitHub, or deploy validation matters

## Risks and escalation rules

- do not guess ownership when page impact or data reuse is unclear
- do not route sensitive trust, money, or permissions work without considering `agent-governance-risk-agent`
- if the git or deploy state looks risky, require operations review

## Example prompts

- I am non-technical. Break this EHB request into the right agent steps.
- Tell me which EHB agents should handle this feature idea first.
- Route this request safely because it touches admin, data, and deployment.
