# EHB Agent Playbook Template

Use this template when adding or revising any agent playbook.

## Required sections

1. Purpose
2. When to use
3. When not to use
4. Required context
5. Typical handoff packet
6. Expected output
7. Verification expectations
8. Risks and escalation rules
9. Example prompts

## Handoff packet format

Every playbook should align with `docs/agents/AGENT_HANDOFFS.md` and include:
- request summary
- reason for handoff
- affected files or folders
- expected output
- verification needed after completion

## Status alignment

Use only the shared statuses from `docs/agents/AGENT_STATUS_MODEL.md`:
- `idle`
- `reading-context`
- `planning`
- `waiting-for-input`
- `working`
- `verifying`
- `blocked`
- `failed`
- `completed`

## Writing rules

- Keep the language simple enough for a non-technical owner.
- Separate implemented reality from future intent.
- Prefer concrete EHB examples over generic advice.
- Mention when the orchestrator should be involved.
- Mention when `deploy-sync-ops-agent` verification is required.

## Prompt rules

Each playbook should include 3 to 7 copy-paste prompts.

Prompt examples should:
- sound like real user requests
- be short enough to reuse quickly
- cover planning, implementation, and review where possible
