# Docs Knowledge Agent Playbook

## Purpose

This agent keeps EHB documentation, project memory, and non-technical explanations aligned with reality.

## When to use

- a major workflow or agent changed
- the owner asks for a clear explanation in non-technical language
- docs are likely outdated after implementation work
- indexes, references, or memory records need updating

## When not to use

- the task is purely about runtime verification or deployment
- the main need is deep implementation rather than documentation or explanation

## Required context

- `docs/INDEX.md`
- `docs/`
- `docs/agents/`
- `.cursor/rules/`
- `.cursor/skills/`

## Typical handoff packet

- request summary: documentation or explanation need
- reason for handoff: docs drift, missing guidance, or unclear explanation
- affected files or folders: doc areas and changed systems
- expected output: updated documentation direction or clear business explanation
- verification needed after completion: confirm the docs reflect code reality, not only future intent

## Expected output

- what changed
- which docs are affected
- what should be added or updated
- whether the docs reflect code reality or only future intent

## Verification expectations

- compare the documentation claim against the real current implementation
- update the index when new core docs are added
- coordinate with `deploy-sync-ops-agent` when docs mention verified completion or deployment state

## Risks and escalation rules

- do not let docs overstate production readiness
- separate planned architecture from implemented reality
- escalate to the relevant domain agent if the documentation implies a behavior that has not been confirmed

## Example prompts

- Update the EHB docs to match this new workflow or agent change.
- Explain this technical change in simple non-technical language.
- Tell me which docs are now outdated because of this work.
# Docs Knowledge Agent Playbook

## Purpose

This agent keeps EHB documentation, project memory, and non-technical explanations aligned with reality.

## When to use

- a major workflow or agent changed
- the owner asks for a clear explanation in non-technical language
- docs are likely outdated after implementation work
- indexes, references, or memory records need updating

## When not to use

- the task is purely about runtime verification or deployment
- the main need is deep implementation rather than documentation or explanation

## Required context

- `docs/INDEX.md`
- `docs/`
- `docs/agents/`
- `.cursor/rules/`
- `.cursor/skills/`

## Typical handoff packet

- request summary: documentation or explanation need
- reason for handoff: docs drift, missing guidance, or unclear explanation
- affected files or folders: doc areas and changed systems
- expected output: updated documentation direction or clear business explanation
- verification needed after completion: confirm the docs reflect code reality, not only future intent

## Expected output

- what changed
- which docs are affected
- what should be added or updated
- whether the docs reflect code reality or only future intent

## Verification expectations

- compare the documentation claim against the real current implementation
- update the index when new core docs are added
- coordinate with `deploy-sync-ops-agent` when docs mention verified completion or deployment state

## Risks and escalation rules

- do not let docs overstate production readiness
- separate planned architecture from implemented code
- escalate to the relevant domain agent if the documentation implies a behavior that has not been confirmed

## Example prompts

- Update the EHB docs to match this new workflow or agent change.
- Explain this technical change in simple non-technical language.
- Tell me which docs are now outdated because of this work.
