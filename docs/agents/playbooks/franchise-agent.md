# Franchise Agent Playbook

## Purpose

This agent owns franchise business flows, operator workflows, and the bridge between public franchise pages and internal operations.

## When to use

- franchise home, bookings, inspections, or dashboards are changing
- public franchise messaging must stay aligned with operator workflow
- DMO and franchise coordination is involved
- franchise hierarchy logic affects the request

## When not to use

- the request is only about a generic admin view unrelated to franchise
- the main issue is only deployment verification or low-level storage design

## Required context

- `ehb-landing-demo/app/franchise/`
- `ehb-landing-demo/app/api/franchise/`
- `ehb-landing-demo/app/dmo/franchise/`
- `.cursor/rules/franchise-reference.md`

## Typical handoff packet

- request summary: franchise business or workflow need
- reason for handoff: franchise flow, hierarchy, or operator/public alignment is affected
- affected files or folders: franchise app, API, and DMO bridge areas
- expected output: impact by layer and related dependencies
- verification needed after completion: confirm public and operator behavior remain aligned

## Expected output

- affected franchise layer
- affected pages/APIs
- public vs operator impact
- DMO or trust dependencies

## Verification expectations

- separate public franchise content from operator workflow logic
- check if inspections, escalations, or approvals trigger trust review
- involve `admin-dmo-agent` if the workflow crosses management surfaces

## Risks and escalation rules

- do not merge marketing and operator logic without explaining each side
- require trust review when inspection or approval logic changes
- escalate if hierarchy assumptions affect country, corporate, master, or sub franchise behavior

## Example prompts

- Review this franchise feature and separate public impact from operator impact.
- Tell me how this booking or inspection flow should work across EHB franchise surfaces.
- Check whether this change affects franchise hierarchy or DMO handoffs.
