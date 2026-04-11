# Data Architecture Agent Playbook

## Purpose

This agent decides source-of-truth, storage location, schema direction, and safe data reuse for EHB.

## When to use

- the owner asks where data should live
- the same data appears in multiple places
- API, schema, config, file-store, or database choices are involved
- a feature mixes demo data and real persistent behavior

## When not to use

- the request is only about visual consistency
- the task is only about wording or documentation without data structure impact

## Required context

- `ehb-landing-demo/prisma/schema.prisma`
- `ehb-landing-demo/lib/appDataStore.ts`
- `ehb-landing-demo/lib/content/homepage.ts`
- `ehb-landing-demo/lib/industry/config.ts`
- `ehb-landing-demo/lib/industry/services.ts`
- `ehb-landing-demo/lib/jps/store.ts`
- `ehb-landing-demo/app/api/`
- `docs/development/DEMO_TO_PRODUCTION.md`

## Typical handoff packet

- request summary: data or storage question
- reason for handoff: source of truth or technology choice is unclear
- affected files or folders: config, content, API, lib, or schema areas
- expected output: storage recommendation and validation notes
- verification needed after completion: confirm demo vs real behavior is explicit

## Expected output

- recommended source of truth
- reason for storage choice
- affected files/modules
- demo vs real behavior notes
- validation required after change

## Verification expectations

- identify whether the concept is static vocabulary, shared operational data, or persistent record data
- check if the same concept is duplicated across more than one file
- involve `deploy-sync-ops-agent` when verification requires route, API, or build checks

## Risks and escalation rules

- do not treat file-based data, API data, and database data as equivalent
- flag duplicate or drifting definitions immediately
- involve `trust-systems-agent` or `admin-dmo-agent` when data decisions affect those domains

## Example prompts

- Where should this EHB data live: config, file store, API, or database?
- Tell me the source of truth for this repeated data and content.
- Separate demo behavior from real persistent behavior for this feature.
