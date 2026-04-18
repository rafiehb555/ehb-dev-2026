# PSS Backend — Proof & Security System

Central trust engine for the EHB ecosystem. Every platform (GoSellr, OLS, HPS, JPS, WMS, OBS, AGTS)
calls PSS through the `pss-client` library. PSS owns `pss_db`, runs criteria → score → rule engine,
routes to franchise/CRB, and pushes signed webhooks back.

## Stack
- Node 20 · Express (ESM) · Mongoose 7 · Bull + Redis · Zod validation
- HMAC-SHA256 webhook signing · JWT platform-key auth
- Tests: `npm run test:stl` (58 gold-master regression tests — do not break)

## Structure
```
services/api/pss-backend/
├── src/
│   ├── models/           Mongoose schemas (pss_db)
│   ├── modules/
│   │   ├── stl-engine/   Score calc + level mapping
│   │   ├── rule-engine/  Priority-ordered routing
│   │   ├── criteria/     Per-platform criteria sets
│   │   ├── webhook/      HMAC sign + delivery + retry
│   │   └── audit/        Immutable audit log
│   ├── routes/           Express routes (PSS API surface)
│   └── server.js         Entry point (port 6000)
└── package.json
```

## Ports
- PSS Backend: **6000** (separate from stl-replit 5000 and AI 8080)

## DB
- `pss_db` on MongoDB Atlas
- Collections: `users · platforms · entities · stl_records · stl_requests ·
  criteria_sets · platform_rules · franchises · franchise_reviews ·
  crb_reviews · audit_logs · webhook_deliveries`

## API surface (11 endpoints)
See `src/routes/` — authoritative list in `ehb-info/EHB-PSS-MASTER-PLAN.md` §10.

## Launch
```bash
cd services/api/pss-backend
npm install
npm run dev
```
