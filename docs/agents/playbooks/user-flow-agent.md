# User Flow Agent Playbook

## Purpose

This agent maps journeys, roles, route impact, and cross-page dependencies.

## When to use

- a button, link, card, or feature affects more than one page
- the owner wants to know which roles are affected
- admin, DMO, franchise, or user journeys need tracing
- the request asks where the same thing appears elsewhere

## When not to use

- the request is only about storage or schema design
- the task is a narrow single-file implementation with no route or role impact

## Required context

- `ehb-landing-demo/app/page.tsx`
- `ehb-landing-demo/app/home/page.tsx`
- `ehb-landing-demo/app/admin/page.tsx`
- `ehb-landing-demo/app/dmo/layout.tsx`
- `ehb-landing-demo/app/franchise/layout.tsx`
- `ehb-landing-demo/components/dmo/DmoSectionWorkspace.tsx`
- `.cursor/rules/navigation-complete.md`

## Typical handoff packet

- request summary: requested journey or page change
- reason for handoff: route impact or role impact is unclear
- affected files or folders: likely pages, layouts, and shared components
- expected output: route map, affected roles, reuse, and risk areas
- verification needed after completion: confirm no connected flow was ignored before implementation

## Expected output

- start point
- affected roles
- affected routes
- reusable/shared elements touched
- high-risk dependency areas

## Verification expectations

- trace the start page, target route, and user role
- check whether shared content or shared components are involved
- escalate to `data-architecture-agent` if the same data may live in config, content, API, or database

## Risks and escalation rules

- never assume a page is isolated
- do not approve a route-level change without checking related layouts and shared entry points
- if DMO or franchise roles are involved, consider `admin-dmo-agent` or `franchise-agent`

## Example prompts

- If I change this button, which EHB pages and roles are affected?
- Map this user and admin journey before we implement it.
- Trace where this card or data item is reused across EHB.
