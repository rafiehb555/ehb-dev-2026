# EHB Automation Engine (AI + System Rules)

This document describes the event-driven automation layer implemented for DMO stack.

## Core Flow

```text
Event -> Rule -> Action -> System Update -> Audit -> Next Event
```

## Implemented Events

- `PSS_VERIFIED`
- `DMO_APPROVED`
- `STL_UPDATED`
- `REFILL_EXPIRED`

## Implemented Actions

- `PSS_VERIFIED` -> create DMO application (`PSS_VERIFICATION`, fallback `PSS`)
- `DMO_APPROVED` -> create registry record + recalculate STL
- `STL_UPDATED` -> request marketplace ranking refresh (audit marker)
- `REFILL_EXPIRED` -> downgrade STL + hide provider services

## API Endpoints

- `POST /api/automation/trigger`
  - Trigger event execution manually or from integrations.
- `GET /api/automation/events`
  - Inspect automation event processing records.
- `GET /api/automation/rules`
  - List active automation rules.
- `POST /api/automation/rules`
  - Upsert an automation rule.

## Background Jobs

- Existing refill checker: `POST /api/jobs/pss-refill-scan`
  - Now emits `REFILL_EXPIRED` automation events for expired users.
- New SLA checker: `POST /api/jobs/sla-scan`
  - Detects stale DMO applications and writes SLA breach audits.

## Notes

- Engine supports fallback mode in demo/no-DB scenarios.
- Automation event persistence uses `automation_events` table when available.
- If automation tables are not migrated yet, execution falls back to direct action mode.

