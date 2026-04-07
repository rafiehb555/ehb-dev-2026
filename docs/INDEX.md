# EHB DOCUMENTATION INDEX

> Master index of all project documentation (Auto-Updated)

**Last Updated:** April 7, 2026

---

## EHB landing-2026 — implementation notes (code + ops)

### Health (deploy / uptime smoke)

- **`GET /api/health`** — [`EHB landing-2026/app/api/health/route.ts`](../EHB%20landing-2026/app/api/health/route.ts) returns `{ ok: true, service, gitSha? }` (short SHA when `VERCEL_GIT_COMMIT_SHA` is set). Use for monitors and post-deploy checks alongside [`/dmo/stl`](../EHB%20landing-2026/app/dmo/stl/page.tsx) (static STL DMO page).

### Law industry — OLS reference source (not a separate deploy)

- **Folder:** [`EHB landing-2026/content/industries/law/ols-law-source/nextjs-app/src/`](../EHB%20landing-2026/content/industries/law/ols-law-source/nextjs-app/src) — legacy/next reference UI for law (multi-agent, investor demo, etc.). Body/muted text uses the same Tailwind tokens as the main app (`text-ehb-textBody`, `text-ehb-textMuted`; see [FLOW-P1-foundation-ui.md](flows/FLOW-P1-foundation-ui.md)).
- **Tailwind:** [`tailwind.config.ts`](../EHB%20landing-2026/tailwind.config.ts) `content` includes this tree so class names in those files are scanned by JIT (safe if you import or promote components into `app/`).

### Notifications: client vs server state

| Layer | What it is | Where |
|--------|------------|--------|
| **Client (browser)** | “Read” state for the bell is stored in `localStorage` (`ehb-notif-read-ids-v1`), with **`storage`** events and optional **`BroadcastChannel`** so tabs stay aligned without a full reload. | `lib/notificationsReadStorage.ts`, `lib/notificationsReadBroadcast.ts`, `components/NotificationsBell.tsx` |
| **Server** | Notification **rows** are still derived from DB (orders, applications, STL, refills, etc.) in `GET /api/notifications`. There is **no** persisted “read inbox” on the server yet. | `app/api/notifications/route.ts` |

**When to add server state:** cross-device read sync, compliance retention, or email/SMS digests — then add a small Prisma model (e.g. per-user `lastNotificationsReadAt` or per-id dismissals) and reconcile with the client.

### Marketplace payments (Stripe + demo)

- **`STRIPE_SECRET_KEY`** set → `POST /api/marketplace/order/[id]/pay` creates a **Stripe Checkout** session; **`POST /api/webhooks/stripe`** confirms **`checkout.session.completed`**, checks amount, marks order **PAID**, stores **`ProcessedStripeEvent`** for idempotency (`evt_…` once).
- If Stripe is **not** configured → same route uses **demo wallet** (immediate PAID). Optional **`idempotencyKey`** in the body avoids duplicate demo writes on retries.
- **Env:** `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_APP_URL` (or Vercel URL), optional `STRIPE_CHECKOUT_CURRENCY` (default `usd`).

---

## PROJECT DOCUMENTATION FOLDER STRUCTURE (Demo → Production)

Blueprint for converting the Next.js demo into production without breaking structure:

```
docs
├── architecture    ← Platform & core architecture
├── industries      ← 32 industries + industry template
├── departments     ← AI, Blockchain, Finance, Franchise
├── flows           ← User flow, Provider flow
└── development     ← Development tracker, Demo→Production strategy
```

| Folder | Key files |
|--------|-----------|
| [architecture/](architecture/) | [EHB_PLATFORM_ARCHITECTURE.md](architecture/EHB_PLATFORM_ARCHITECTURE.md), [EHB_CORE_SYSTEMS.md](architecture/EHB_CORE_SYSTEMS.md), [SHARED_TOOLS.md](architecture/SHARED_TOOLS.md), [EHB_SUPER_ADMIN_CONTROL_PANEL.md](architecture/EHB_SUPER_ADMIN_CONTROL_PANEL.md), [EHB_MICROSERVICES_ARCHITECTURE.md](architecture/EHB_MICROSERVICES_ARCHITECTURE.md), [EHB_DATABASE_MASTER_SCHEMA.md](architecture/EHB_DATABASE_MASTER_SCHEMA.md), [EHB_FRONTEND_SUPER_APP_ARCHITECTURE.md](architecture/EHB_FRONTEND_SUPER_APP_ARCHITECTURE.md) |
| [industries/](industries/) | [EHB_INDUSTRIES.md](industries/EHB_INDUSTRIES.md), [INDUSTRY_TEMPLATE.md](industries/INDUSTRY_TEMPLATE.md) |
| [departments/](departments/) | [AI_DEPARTMENT.md](departments/AI_DEPARTMENT.md), [BLOCKCHAIN.md](departments/BLOCKCHAIN.md), [FINANCE.md](departments/FINANCE.md), [FRANCHISE_SYSTEM.md](departments/FRANCHISE_SYSTEM.md) |
| [flows/](flows/) | **[flows/INDEX.md](flows/INDEX.md)** (design-flow P1–P11 index), [ECONOMICS_MASTER.md](flows/ECONOMICS_MASTER.md), [USER_FLOW.md](flows/USER_FLOW.md), [PROVIDER_FLOW.md](flows/PROVIDER_FLOW.md) |
| [development/](development/) | [DEVELOPMENT_TRACKER.md](development/DEVELOPMENT_TRACKER.md), [DEMO_TO_PRODUCTION.md](development/DEMO_TO_PRODUCTION.md), [LOCAL_DEPLOY_PARITY_CHECKLIST.md](development/LOCAL_DEPLOY_PARITY_CHECKLIST.md), [VERCEL_LOCAL_ROUTE_MISMATCH_INVENTORY.md](development/VERCEL_LOCAL_ROUTE_MISMATCH_INVENTORY.md) |

**Real folder architecture (single source of truth):** [FOLDER_ARCHITECTURE.md](FOLDER_ARCHITECTURE.md) — is structure ko agy bhi follow kiya jayega.  
**Real code folders (ehb-landing-demo):** `app/`, `components/`, `lib/`, `modules/` (core, departments, industries, shared, flows) — real development isi par chalegi.

---

## QUICK STATS

| Category | Documents | Status |
|----------|:---------:|:------:|
| Architecture | 56 | ✅ |
| Database | 5 | ✅ |
| UI/UX | 10 | ✅ |
| Services | 1 | ✅ |
| Strategy | 14 | ✅ |
| Roadmap | 5 | ✅ |
| API | 0 | ⏳ |
| Requirements | 0 | ⏳ |

---

## ARCHITECTURE DOCUMENTS

| File | Description | Updated |
|------|-------------|---------|
| [EHB_SUPER_ADMIN_CONTROL_PANEL.md](architecture/EHB_SUPER_ADMIN_CONTROL_PANEL.md) | Super Admin command center (industries, franchise, AI, blockchain, finance, dev) | Mar 14 |
| [EHB_MICROSERVICES_ARCHITECTURE.md](architecture/EHB_MICROSERVICES_ARCHITECTURE.md) | Backend microservices (API gateway, 12 services, deployment) | Mar 14 |
| [EHB_DATABASE_MASTER_SCHEMA.md](architecture/EHB_DATABASE_MASTER_SCHEMA.md) | Database master schema (identity, verification, industry, transaction, franchise, AI, blockchain, analytics) | Mar 14 |
| [EHB_FRONTEND_SUPER_APP_ARCHITECTURE.md](architecture/EHB_FRONTEND_SUPER_APP_ARCHITECTURE.md) | Next.js super-app (folders, layouts, modules, industry/service/dashboard/admin) | Mar 14 |
| [microservices-architecture.md](architecture/microservices-architecture.md) | 11 microservices design | Mar 13 |
| [dmo-blueprint.md](architecture/dmo-blueprint.md) | DMO complete specification | Mar 13 |
| [super-app-ecosystem.md](architecture/super-app-ecosystem.md) | 5-layer ecosystem design | Mar 13 |
| [complete-ecosystem-architecture.md](architecture/complete-ecosystem-architecture.md) | All layers connected (users→infra) | Mar 13 |
| [global-governance-model.md](architecture/global-governance-model.md) | Digital government system | Mar 13 |
| [multi-country-infrastructure.md](architecture/multi-country-infrastructure.md) | Multi-region data architecture | Mar 13 |
| [microservices-google-style.md](architecture/microservices-google-style.md) | Google/Amazon style backend | Mar 13 |
| [blockchain-polkadot.md](architecture/blockchain-polkadot.md) | Polkadot blockchain design | Mar 13 |
| [investor-pitch-architecture.md](architecture/investor-pitch-architecture.md) | Investor system diagram | Mar 13 |
| [dmo-data-flow.md](architecture/dmo-data-flow.md) | End-to-end data flow | Mar 13 |
| [franchise-operating-model.md](architecture/franchise-operating-model.md) | Global franchise system | Mar 13 |
| [pss-security-compliance.md](architecture/pss-security-compliance.md) | KYC/AML/Risk monitoring | Mar 13 |
| [kyc-kyb-onboarding-flow.md](architecture/kyc-kyb-onboarding-flow.md) | Complete onboarding flow | Mar 13 |
| [pss-ai-fraud-detection.md](architecture/pss-ai-fraud-detection.md) | AI fraud detection system | Mar 13 |
| [dmo-bank-level-security.md](architecture/dmo-bank-level-security.md) | Bank-grade security model | Mar 13 |
| [complete-data-architecture.md](architecture/complete-data-architecture.md) | Global data flow & storage | Mar 13 |
| [dmo-ai-decision-engine.md](architecture/dmo-ai-decision-engine.md) | Autonomous AI governance | Mar 13 |
| [crb-certification-system.md](architecture/crb-certification-system.md) | CRB complete system | Mar 13 |
| [stl-trust-level-system.md](architecture/stl-trust-level-system.md) | STL reputation system | Mar 13 |
| [stl-ai-algorithm.md](architecture/stl-ai-algorithm.md) | STL AI scoring algorithm | Mar 13 |
| [crb-inspector-mobile-app.md](architecture/crb-inspector-mobile-app.md) | Inspector app design | Mar 13 |
| [trust-infrastructure-diagram.md](architecture/trust-infrastructure-diagram.md) | PSS+CRB+STL+DMO integration | Mar 13 |
| [dmo-master-architecture.md](architecture/dmo-master-architecture.md) | DMO complete control system | Mar 13 |
| [jps-job-profile-skill.md](architecture/jps-job-profile-skill.md) | JPS professional identity | Mar 13 |
| [complete-ecosystem-flow.md](architecture/complete-ecosystem-flow.md) | End-to-end system flow | Mar 13 |
| [platform-master-architecture.md](architecture/platform-master-architecture.md) | All systems connected | Mar 13 |
| [complete-er-diagram.md](architecture/complete-er-diagram.md) | Database relationships | Mar 13 |
| [user-journey-signup-to-income.md](architecture/user-journey-signup-to-income.md) | Complete user lifecycle | Mar 13 |
| [complete-user-lifecycle-system.md](architecture/complete-user-lifecycle-system.md) | 8-stage lifecycle (signup→income) | Mar 13 |
| [backend-microservices-complete.md](architecture/backend-microservices-complete.md) | Full backend structure | Mar 13 |
| [ai-marketplace-matching-algorithm.md](architecture/ai-marketplace-matching-algorithm.md) | AI matching logic | Mar 13 |
| [dmo-global-data-flow.md](architecture/dmo-global-data-flow.md) | Country→Region→Global flow | Mar 13 |
| [multi-industry-verification-system.md](architecture/multi-industry-verification-system.md) | 32 industries cross-verification | Mar 13 |
| [industry-verification-matrix.md](architecture/industry-verification-matrix.md) | Industry verification matrix | Mar 13 |
| [industry-verification-network-map.md](architecture/industry-verification-network-map.md) | Industry network map (nodes & flows) | Mar 13 |
| [industry-authority-model.md](architecture/industry-authority-model.md) | Industry authority hierarchy & STL impact | Mar 13 |
| [franchise-verification-model.md](architecture/franchise-verification-model.md) | Franchise-based physical verification | Mar 13 |
| [ai-automation-system.md](architecture/ai-automation-system.md) | AI automation modules & flows | Mar 13 |
| [mega-system-architecture.md](architecture/mega-system-architecture.md) | Enterprise backend (Amazon/Alibaba-style) | Mar 13 |
| [master-ecosystem-map.md](architecture/master-ecosystem-map.md) | One-page global ecosystem map | Mar 13 |
| [final-system-architecture-diagram.md](architecture/final-system-architecture-diagram.md) | Layered world-class architecture diagram | Mar 13 |
| [industry-master-structure.md](architecture/industry-master-structure.md) | 32 industries structure (industry→sub-sector→services) | Mar 13 |
| [industry-subsector-structure.md](architecture/industry-subsector-structure.md) | 32 industries with 300+ sub-sectors | Mar 13 |
| [final-master-system-map.md](architecture/final-master-system-map.md) | Complete global ecosystem master map | Mar 13 |
| [multi-relay-blockchain-architecture.md](architecture/multi-relay-blockchain-architecture.md) | Multi-relay, validator-based blockchain design | Mar 13 |
| [mosaic-galaxy-integration.md](architecture/mosaic-galaxy-integration.md) | EHB × Mosaic Galaxy integration (relay, highway, parachain) | Mar 13 |
| [validator-node-architecture.md](architecture/validator-node-architecture.md) | Validator & collator node architecture | Mar 13 |
| [parachain-technical-design.md](architecture/parachain-technical-design.md) | Substrate-style EHB parachain runtime & pallets | Mar 13 |
| [tokenomics-and-staking-model.md](architecture/tokenomics-and-staking-model.md) | Token utilities, supply, staking & rewards | Mar 13 |
| [global-cloud-infrastructure.md](architecture/global-cloud-infrastructure.md) | Multi-region cloud & infra design | Mar 13 |
| [ai-agent-system.md](architecture/ai-agent-system.md) | Autonomous AI agents for platform management | Mar 13 |
| [metaverse-digital-economy-integration.md](architecture/metaverse-digital-economy-integration.md) | Metaverse & digital economy integration | Mar 13 |
| [ai-super-agent-architecture.md](architecture/ai-super-agent-architecture.md) | Self-operating AI super agent for EHB | Mar 13 |
| [trillion-scale-platform-architecture.md](architecture/trillion-scale-platform-architecture.md) | Hyperscale global platform architecture | Mar 13 |
| [jps-designation-engine.md](architecture/jps-designation-engine.md) | Flexible designation + STL + affiliate-integrated JPS engine | Mar 13 |
| [global-industry-governance-system.md](architecture/global-industry-governance-system.md) | 5-layer industry governance (global→local) | Mar 13 |
| [EHB_PLATFORM_ARCHITECTURE.md](architecture/EHB_PLATFORM_ARCHITECTURE.md) | Global platform layers (Core, Shared, Industry, AI, Blockchain, Finance, Franchise) | Mar 14 |
| [EHB_CORE_SYSTEMS.md](architecture/EHB_CORE_SYSTEMS.md) | Core systems: AI, Blockchain, Finance, Affiliate, Franchise, JPS, PSS/CRB/STL, DMO | Mar 14 |
| [SHARED_TOOLS.md](architecture/SHARED_TOOLS.md) | Shared platform tools reused across industries | Mar 14 |
| [EHB_SUPER_ADMIN_CONTROL_PANEL.md](architecture/EHB_SUPER_ADMIN_CONTROL_PANEL.md) | Master dashboard: industry, franchise, AI, blockchain, finance, development | Mar 14 |

---

## AGENT SYSTEM DOCUMENTS

| File | Description | Updated |
|------|-------------|---------|
| [agents/AGENT_QUICKSTART.md](agents/AGENT_QUICKSTART.md) | Start here for the EHB development agent system | Apr 6 |
| [agents/AGENT_CATALOG.md](agents/AGENT_CATALOG.md) | Development agent roster and ownership summary | Apr 6 |
| [agents/AGENT_OWNERSHIP.md](agents/AGENT_OWNERSHIP.md) | Ownership boundaries for current development agents | Apr 6 |
| [agents/AGENT_HANDOFFS.md](agents/AGENT_HANDOFFS.md) | Standard handoff order and required packet fields | Apr 6 |
| [agents/AGENT_STATUS_MODEL.md](agents/AGENT_STATUS_MODEL.md) | Shared agent lifecycle statuses | Apr 6 |
| [agents/PLAYBOOK_INDEX.md](agents/PLAYBOOK_INDEX.md) | Entry index for all 14 agent playbooks | Apr 6 |
| [agents/EXAMPLE_PROMPTS.md](agents/EXAMPLE_PROMPTS.md) | Copy-paste prompts for the development agent system | Apr 6 |
| [agents/AGENT_PLAYBOOK_TEMPLATE.md](agents/AGENT_PLAYBOOK_TEMPLATE.md) | Standard template for all future playbooks | Apr 6 |
| [agents/AGENT_DASHBOARD_PLAN.md](agents/AGENT_DASHBOARD_PLAN.md) | First admin-facing dashboard direction for development agents | Apr 6 |
| [agents/AGENT_WORKFLOW_CONTRACT.md](agents/AGENT_WORKFLOW_CONTRACT.md) | Handoff payload, statuses, and workflow rules | Apr 6 |
| [agents/RELATION_TO_PLATFORM_AI.md](agents/RELATION_TO_PLATFORM_AI.md) | Difference between development agents and platform AI agents | Apr 6 |

---

## DEPARTMENTS

| File | Description | Updated |
|------|-------------|---------|
| [AI_DEPARTMENT.md](departments/AI_DEPARTMENT.md) | AI modules: Assistant, Agents, Search, Analytics, Marketplace | Mar 14 |
| [BLOCKCHAIN.md](departments/BLOCKCHAIN.md) | Validators, smart contracts, token system | Mar 14 |
| [FINANCE.md](departments/FINANCE.md) | Wallet, payments, escrow, affiliate/franchise engines | Mar 14 |
| [FRANCHISE_SYSTEM.md](departments/FRANCHISE_SYSTEM.md) | Global Admin → Country → Corporate → Sub franchise | Mar 14 |

---

## INDUSTRIES

| File | Description | Updated |
|------|-------------|---------|
| [EHB_INDUSTRIES.md](industries/EHB_INDUSTRIES.md) | 32 industries list | Mar 14 |
| [INDUSTRY_TEMPLATE.md](industries/INDUSTRY_TEMPLATE.md) | Industry structure: Categories, Services, Providers, Orders, Reviews, Analytics | Mar 14 |

---

## FLOWS

| File | Description | Updated |
|------|-------------|---------|
| [USER_FLOW.md](flows/USER_FLOW.md) | User: Signup → PSS → JPS → CRB → STL → Service Access | Mar 14 |
| [PROVIDER_FLOW.md](flows/PROVIDER_FLOW.md) | Provider: Signup → PSS → CRB → STL → DMO listing → Orders → Payments | Mar 14 |

---

## DEVELOPMENT (Demo → Production)

| File | Description | Updated |
|------|-------------|---------|
| [DEVELOPMENT_TRACKER.md](development/DEVELOPMENT_TRACKER.md) | Progress by core system and industry | Mar 14 |
| [DEMO_TO_PRODUCTION.md](development/DEMO_TO_PRODUCTION.md) | 5-stage conversion: Demo UI → APIs → DB → Blockchain → Production | Mar 14 |
| [LOCAL_DEPLOY_PARITY_CHECKLIST.md](development/LOCAL_DEPLOY_PARITY_CHECKLIST.md) | Pre-rollout checklist for local vs deployed parity across landing, franchise, DMO, and JPS flows | Apr 2 |
| [VERCEL_LOCAL_ROUTE_MISMATCH_INVENTORY.md](development/VERCEL_LOCAL_ROUTE_MISMATCH_INVENTORY.md) | Route-by-route local vs Vercel mismatch inventory using the canonical deployed URL | Apr 2 |

---

## STRATEGY DOCUMENTS

| File | Description | Updated |
|------|-------------|---------|
| [global-expansion-strategy.md](strategy/global-expansion-strategy.md) | Country-by-country rollout | Mar 13 |
| [token-economy-model.md](strategy/token-economy-model.md) | Digital token & economy | Mar 13 |
| [dao-governance-protocol.md](strategy/dao-governance-protocol.md) | Hybrid DAO governance | Mar 13 |
| [investor-fundraising-strategy.md](strategy/investor-fundraising-strategy.md) | Multi-stage fundraising | Mar 13 |
| [global-trust-score-system.md](architecture/global-trust-score-system.md) | Global STL ranking & country factors | Mar 13 |
| [global-legal-structure.md](strategy/global-legal-structure.md) | Multi-layer legal framework | Mar 13 |
| [investor-pitch-structure.md](strategy/investor-pitch-structure.md) | Master investor pitch deck framework | Mar 13 |
| [global-platform-strategy.md](strategy/global-platform-strategy.md) | 1B-user global platform strategy | Mar 13 |
| [future-technology-roadmap.md](strategy/future-technology-roadmap.md) | AI + Web3 + next-gen tech plan | Mar 13 |
| [global-ecosystem-economy.md](strategy/global-ecosystem-economy.md) | Internal multi-layer digital economy | Mar 13 |
| [final-master-blueprint.md](strategy/final-master-blueprint.md) | Book-level master project outline | Mar 13 |
| [global-franchise-master-plan.md](strategy/global-franchise-master-plan.md) | Worldwide franchise & verification network model | Mar 13 |
| [affiliate-program-model.md](strategy/affiliate-program-model.md) | Multi-tier EHB affiliate & referral system | Mar 13 |
| [affiliate-matrix-structure.md](strategy/affiliate-matrix-structure.md) | 5×10 matrix + 10-rank affiliate & industry integration | Mar 13 |
| [global-economy-model.md](strategy/global-economy-model.md) | 6-layer economy: marketplace, affiliate, franchise, certification, subscription, blockchain | Mar 13 |

---

## DATABASE DOCUMENTS

| File | Description | Updated |
|------|-------------|---------|
| [database-master-structure.md](database/database-master-structure.md) | Basic 23 tables | Mar 13 |
| [dmo-master-database.md](database/dmo-master-database.md) | Full 200+ tables (15 modules) | Mar 13 |
| [er-diagram.md](database/er-diagram.md) | Entity relationships | Mar 13 |
| [complete-database-architecture.md](database/complete-database-architecture.md) | 300+ tables full system | Mar 13 |
| [super-database-architecture.md](database/super-database-architecture.md) | Enterprise modular DB (15 modules) | Mar 13 |

---

## UI/UX DOCUMENTS

| File | Description | Updated |
|------|-------------|---------|
| [design-system.md](ui-ux/design-system.md) | Colors, typography, components | Mar 13 |
| [dmo-admin-system.md](ui-ux/dmo-admin-system.md) | Admin dashboard wireframe | Mar 13 |
| [navigation-architecture.md](ui-ux/navigation-architecture.md) | Basic navigation map | Mar 13 |
| [complete-navigation-map.md](ui-ux/complete-navigation-map.md) | All 255 screens documented | Mar 13 |
| [super-app-ui-wireframe.md](ui-ux/super-app-ui-wireframe.md) | Full super-app UI design | Mar 13 |
| [trust-card-system.md](ui-ux/trust-card-system.md) | Marketplace trust cards | Mar 13 |
| [industry-verification-system.md](ui-ux/industry-verification-system.md) | Multi-industry verification | Mar 13 |
| [trust-radar-visualization.md](ui-ux/trust-radar-visualization.md) | 360° trust radar | Mar 13 |
| [industry-stl-impact-system.md](ui-ux/industry-stl-impact-system.md) | Industry STL boost system | Mar 13 |
| [trust-score-dashboard.md](ui-ux/trust-score-dashboard.md) | AI trust analytics dashboard | Mar 13 |
| [LANDING-DESIGN-ROADMAP.md](ui-ux/LANDING-DESIGN-ROADMAP.md) | Landing reference-level design steps (glass, 3D, fluid bg) | Mar 13 |

---

## SERVICES DOCUMENTS

| File | Description | Updated |
|------|-------------|---------|
| [services-taxonomy.md](services/services-taxonomy.md) | 700+ services (15 industries) | Mar 13 |

---

## ROADMAP DOCUMENTS

| File | Description | Updated |
|------|-------------|---------|
| [MASTER-ROADMAP.md](roadmap/MASTER-ROADMAP.md) | 8-phase overview | Mar 13 |
| [STATUS.md](roadmap/STATUS.md) | Progress tracker | Mar 13 |
| [phases/complete-roadmap.md](roadmap/phases/complete-roadmap.md) | Full phase details | Mar 13 |
| [full-development-plan.md](roadmap/full-development-plan.md) | Step-by-step real build strategy | Mar 13 |
| [platform-development-roadmap.md](roadmap/platform-development-roadmap.md) | 14-phase roadmap: Investor Demo → real dev → scaling | Mar 14 |

---

## API DOCUMENTS

| File | Description | Updated |
|------|-------------|---------|
| *No documents yet* | - | - |

---

## REQUIREMENTS DOCUMENTS

| File | Description | Updated |
|------|-------------|---------|
| *No documents yet* | - | - |

---

## ASSETS (Images/Wireframes)

| File | Description |
|------|-------------|
| [ui-default-theme-dark.png](../assets/ui-default-theme-dark.png) | User app default theme |
| [dmo-admin-wireframe.png](../assets/dmo-admin-wireframe.png) | Admin dashboard wireframe |
| [dmo-data-flow-ui.png](../assets/dmo-data-flow-ui.png) | DMO data flow diagram |
| [dmo-crb-pss-workflow.png](../assets/dmo-crb-pss-workflow.png) | DMO+CRB+PSS workflow |

---

## CURSOR RULES (Auto-Load)

| File | Purpose |
|------|---------|
| 00-auto-save-system.md | Auto-save protocol |
| project-context.md | Project overview |
| ehb-master-context.md | Platform details |
| ai-development-prompt.md | AI guidelines |
| frontend-nextjs.md | Next.js config |
| database-reference.md | DB quick ref |
| database-modules.md | 15 modules ref |
| microservices-reference.md | Services ref |
| microservices-detailed.md | Google-style services |
| dmo-reference.md | DMO quick ref |
| dmo-admin-ui.md | Admin UI ref |
| ui-design-system.md | Design ref |
| services-reference.md | Services ref |
| ecosystem-reference.md | Ecosystem ref |
| navigation-reference.md | Nav routes ref |
| navigation-complete.md | 255 screens ref |
| architecture-layers.md | 5 layers ref |
| infrastructure-reference.md | Multi-country ref |
| blockchain-reference.md | Polkadot ref |
| franchise-reference.md | Franchise model ref |
| roadmap-reference.md | 8-phase roadmap |
| pss-security-reference.md | PSS modules ref |
| kyc-kyb-reference.md | Onboarding ref |
| ai-fraud-detection-reference.md | Fraud AI ref |
| bank-security-reference.md | Security layers |
| data-architecture-reference.md | Data flow ref |
| ai-decision-engine-reference.md | AI engine ref |
| expansion-strategy-reference.md | Expansion phases |
| token-economy-reference.md | Token model ref |
| dao-governance-reference.md | DAO protocol ref |
| fundraising-reference.md | Investor strategy |
| crb-system-reference.md | CRB certification ref |
| stl-system-reference.md | STL trust engine ref |
| crb-inspector-app-reference.md | Inspector app ref |
| trust-infrastructure-reference.md | Trust pillars ref |
| dmo-master-reference.md | DMO control ref |
| super-app-wireframe-reference.md | UI wireframe ref |
| jps-system-reference.md | JPS professional ref |
| ecosystem-flow-reference.md | Ecosystem flow ref |
| database-300-tables-reference.md | 300+ tables ref |
| user-journey-reference.md | User lifecycle ref |
| microservices-complete-reference.md | Full backend ref |
| ai-matching-reference.md | AI matching ref |
| global-data-flow-reference.md | Global data ref |
| trust-card-reference.md | Trust card UI ref |
| industry-verification-reference.md | Industry verify ref |
| trust-radar-reference.md | Trust radar ref |
| industry-stl-impact-reference.md | Industry STL boost ref |
| trust-dashboard-reference.md | Trust dashboard ref |
| multi-industry-verification-reference.md | 32 industries ref |

---

*This index is auto-updated when new documents are added*
