# Integration Memory Agent Playbook

## Purpose

This agent records reuse, cross-module continuity, and important decisions that future EHB work should not forget.

## When to use

- the same concept appears in more than one place
- the owner asks where a value, rule, or feature is reused
- the project needs a memory layer for future agent work
- an important decision should be recorded for reuse

## When not to use

- the request is only about a single isolated implementation detail
- no meaningful cross-module reuse or continuity issue is involved

## Required context

- `docs/agents/`
- `docs/`
- `.cursor/skills/`
- `ehb-landing-demo/app/`
- `ehb-landing-demo/lib/`

## Typical handoff packet

- request summary: reuse, memory, or continuity need
- reason for handoff: the same concept appears across modules or decisions must be saved
- affected files or folders: repeated concept locations
- expected output: reuse map and memory items to retain
- verification needed after completion: confirm the reuse claim is supported by code or docs

## Expected output

- reused entities or decisions
- connected modules or files
- source-of-truth recommendation
- memory items that should be recorded

## Verification expectations

- separate current reuse from proposed future reuse
- trace the repeated concept back to a likely source of truth
- involve `data-architecture-agent` when the reuse implies storage or schema decisions

## Risks and escalation rules

- do not invent dependencies that are not supported by evidence
- do not record a memory item as fact if it is still only a proposal
- escalate to the orchestrator when the reuse pattern crosses many ownership areas

## Example prompts

- Record the source-of-truth and reuse map for this EHB feature.
- Tell me where this same concept already appears in the codebase and docs.
- What decisions from this task should be saved for future EHB work?
