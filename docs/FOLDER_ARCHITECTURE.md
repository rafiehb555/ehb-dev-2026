# EHB Real Folder Architecture

> **Single source of truth.** Is structure ko demo se production tak follow kiya jayega. Naya code ya docs add karte waqt isi layout ko maintain karein.

---

## 1. Project Root Structure

```
EHB-DEVELOPMENT-2026 (workspace root)
│
├── .cursor                    # Cursor IDE / rules (optional)
├── docs                       # All platform blueprint & documentation
│   ├── architecture           # Platform, core systems, shared tools, Super Admin
│   ├── industries             # 32 industries list + industry template
│   ├── departments            # AI, Blockchain, Finance, Franchise
│   ├── flows                  # User flow, Provider flow
│   ├── development            # Development tracker, Demo→Production strategy
│   ├── database               # DB design (existing)
│   ├── roadmap               # Roadmaps (existing)
│   ├── services               # Service docs (existing)
│   ├── strategy               # Strategy docs (existing)
│   ├── ui-ux                  # UI/UX design (existing)
│   ├── INDEX.md               # Master doc index
│   ├── CHANGELOG.md           # Doc change log
│   └── FOLDER_ARCHITECTURE.md # This file
│
└── ehb-landing-demo           # Next.js app (demo → production)
        ├── app/               # Routes, layouts, pages
        ├── components/        # Shared UI (ui, layout)
        ├── lib/               # Utils, config, API client
        ├── modules/           # Real development – domain modules
        │   ├── core/          # PSS, CRB, STL, DMO, JPS
        │   ├── departments/   # ai, blockchain, finance, franchise
        │   ├── industries/    # Industry config & features
        │   ├── shared/        # Shared tools (search, booking, payment, messaging)
        │   └── flows/         # User flow, Provider flow (auth, onboarding)
        ├── public/
        └── ...
```

---

## 2. Canonical Docs Folders (Phase Blueprint)

Ye 5 folders **platform blueprint** ke liye mandatory hain. Inhi mein real architecture docs rakh kar demo → production conversion bina structure break kiye ki jati hai.

| Folder | Purpose | Key files |
|--------|---------|-----------|
| **docs/architecture** | Platform layers, core systems, shared tools, Super Admin, backend, DB, frontend | EHB_PLATFORM_ARCHITECTURE.md, EHB_CORE_SYSTEMS.md, SHARED_TOOLS.md, EHB_SUPER_ADMIN_CONTROL_PANEL.md, EHB_MICROSERVICES_ARCHITECTURE.md, EHB_DATABASE_MASTER_SCHEMA.md, EHB_FRONTEND_SUPER_APP_ARCHITECTURE.md |
| **docs/industries** | 32 industries + template for new industry launch | EHB_INDUSTRIES.md, INDUSTRY_TEMPLATE.md |
| **docs/departments** | Core departments (AI, Blockchain, Finance, Franchise) | AI_DEPARTMENT.md, BLOCKCHAIN.md, FINANCE.md, FRANCHISE_SYSTEM.md |
| **docs/flows** | User and provider lifecycle flows | USER_FLOW.md, PROVIDER_FLOW.md |
| **docs/development** | Progress tracking and conversion strategy | DEVELOPMENT_TRACKER.md, DEMO_TO_PRODUCTION.md |

---

## 3. Rules (Agy B Follow Kia Jayega)

1. **Naya architecture doc** → `docs/architecture` ya usi se related sub-topic (e.g. departments → `docs/departments`).
2. **Naya industry / template** → `docs/industries`.
3. **Naya department spec** → `docs/departments`.
4. **Naya flow (user/provider/admin)** → `docs/flows`.
5. **Development status / demo→prod plan** → `docs/development`.
6. **Demo app** abhi `ehb-landing-demo`; production mein isi repo ke andar ya alag repo ho sakta hai, lekin **docs structure yahi rahega**.

---

## 4. Real Code Folders (ehb-landing-demo)

Real development isi structure par chalega:

| Folder | Use for |
|--------|--------|
| **app/** | Routes, layouts, page components (Next.js App Router) |
| **components/** | Shared UI: `ui/` (buttons, cards, inputs), `layout/` (header, footer) |
| **lib/** | Utils, config, API client |
| **modules/core** | PSS, CRB, STL, DMO, JPS – components, hooks, types |
| **modules/departments** | `ai/`, `blockchain/`, `finance/`, `franchise/` – department-specific code |
| **modules/industries** | Industry config and industry-specific features |
| **modules/shared** | Shared tools: search, booking, payment, messaging, reviews, analytics |
| **modules/flows** | `user/`, `provider/` – auth, onboarding, flow logic |

Naya feature: us domain ke hisaab se sahi module mein add karein (core, departments, industries, shared, flows).

---

## 5. Reference

- Full doc list: [docs/INDEX.md](INDEX.md)
- Demo → Production stages: [docs/development/DEMO_TO_PRODUCTION.md](development/DEMO_TO_PRODUCTION.md)
- Platform layers: [docs/architecture/EHB_PLATFORM_ARCHITECTURE.md](architecture/EHB_PLATFORM_ARCHITECTURE.md)
