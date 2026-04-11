# Admin DMO Agent Playbook

## Purpose

This agent owns the structure and operational logic of EHB admin and DMO workspaces.

## When to use

- a new management feature needs a home
- DMO modules or admin screens are being added or changed
- operational queues, approvals, or role views are affected
- cross-domain management behavior needs coordination

## When not to use

- the request is only public marketing UI with no admin or DMO effect
- the question is only about deployment or git operations

## Required context

- `ehb-landing-demo/app/admin/`
- `ehb-landing-demo/app/dmo/`
- `ehb-landing-demo/app/dmo/layout.tsx`
- `ehb-landing-demo/components/dmo/DmoSectionWorkspace.tsx`
- `.cursor/rules/dmo-reference.md`
- `.cursor/rules/dmo-admin-ui.md`

## Typical handoff packet

- request summary: admin or DMO workflow need
- reason for handoff: placement, structure, or operational coordination is unclear
- affected files or folders: admin, DMO, and related components
- expected output: impacted areas and correct ownership routing
- verification needed after completion: confirm role and workflow alignment

## Expected output

- affected admin or DMO area
- impacted sections/views
- cross-domain dependencies
- recommended ownership handoffs

## Verification expectations

- check whether the work belongs in admin, DMO, or both
- confirm roles, queues, and operational flow still make sense
- involve `trust-systems-agent`, `franchise-agent`, or `data-architecture-agent` when the workflow crosses those areas

## Risks and escalation rules

- do not treat DMO screens as simple static pages
- do not place management actions in the wrong workspace just because they are visible there
- escalate when public, operator, and super-admin behavior may drift apart

## Example prompts

- Where should this management feature live in admin or DMO?
- Review this DMO request and tell me which sections are affected.
- Make sure this operational workflow fits the current EHB admin structure.
