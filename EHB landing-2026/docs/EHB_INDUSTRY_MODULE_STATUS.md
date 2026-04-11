# EHB Industry Module Status

Industry module now includes:

- DMO control page: `/dmo/industry`
  - industry master list
  - request verification
  - entity mapping
  - verification queue
  - admin decision drawer
- Unified verify API: `POST /api/industry/verify`
  - mode `REQUEST` for new/refresh verification + DMO task
  - mode `DECISION` for verify/reject + STL refresh
- Existing APIs remain active:
  - `POST /api/industry/attach`
  - `GET/POST /api/industry/verifications`
  - `POST /api/industry/verifications/approve`
- STL integration:
  - industry decision triggers best-effort STL recalculation
- Refill integration:
  - verified industry schedules industry refill record

Next recommended hardening:
- seed/maintain full 32-industry master data
- ownership checks per entity type
- add dedicated `GET /api/industry/score` aggregate endpoint

