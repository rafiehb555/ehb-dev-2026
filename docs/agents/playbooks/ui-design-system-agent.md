# UI Design System Agent Playbook

## Purpose

This agent protects reusable visual patterns and cross-page consistency across EHB.

## When to use

- a card, button, section, color, spacing, or layout is changing
- more than one page should share the same visual logic
- admin, DMO, landing, home, or franchise surfaces need to match better
- responsive or polish work is requested

## When not to use

- the request is only about data placement or API structure
- the question is primarily about routing rather than presentation

## Required context

- `ehb-landing-demo/components/`
- `ehb-landing-demo/app/page.tsx`
- `ehb-landing-demo/app/home/page.tsx`
- `ehb-landing-demo/app/dmo/layout.tsx`
- `ehb-landing-demo/app/admin/page.tsx`
- `ehb-landing-demo/app/franchise/layout.tsx`
- `.cursor/rules/ui-design-system.md`

## Typical handoff packet

- request summary: requested UI or design change
- reason for handoff: shared pattern or consistency review is needed
- affected files or folders: pages, layouts, and shared component areas
- expected output: shared pattern recommendation and consistency checks
- verification needed after completion: confirm related pages still align

## Expected output

- shared component or pattern involved
- impacted pages
- proposed design direction
- consistency checks required

## Verification expectations

- check reuse of the same design pattern across related areas
- review mobile, tablet, and desktop impact when layout changes
- ask `user-flow-agent` for cross-page tracing if route behavior is connected to the design change

## Risks and escalation rules

- do not approve a single-page visual change without checking reuse
- keep marketing surfaces and operational surfaces distinct, but still within one brand language
- escalate to `data-architecture-agent` if the visual change depends on repeated content coming from the wrong source

## Example prompts

- Review these cards and tell me what shared UI pattern EHB should use.
- Make this page match the admin and DMO design language.
- Check whether this visual change will create design drift.
