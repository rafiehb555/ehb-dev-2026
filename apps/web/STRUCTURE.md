# EHB App – Folder Structure

Real development isi structure ko follow karega.  
**Blueprint:** [EHB_FRONTEND_SUPER_APP_ARCHITECTURE.md](../docs/architecture/EHB_FRONTEND_SUPER_APP_ARCHITECTURE.md)

```
ehb-landing-demo/
├── app/                      # Next.js App Router
│   ├── landing/
│   ├── home/
│   ├── industries/
│   │   └── [industry]/
│   ├── services/
│   │   └── [serviceId]/
│   ├── ai-marketplace/
│   ├── franchise/
│   ├── development/
│   ├── dashboard/
│   └── admin/
├── components/               # Shared UI (ui/, layout/)
├── layouts/                  # MainLayout, DashboardLayout, AdminLayout, IndustryLayout
├── modules/                  # Domain modules
│   ├── core/                 # PSS, CRB, STL, DMO, JPS
│   ├── departments/          # ai, blockchain, finance, franchise
│   ├── industries/           # Industry config & features
│   ├── shared/               # Search, booking, payment, messaging, reviews
│   ├── flows/                # user, provider (auth, onboarding)
│   ├── auth/                 # components, hooks, services, types
│   ├── profile/
│   ├── booking/
│   ├── wallet/
│   ├── affiliate/
│   ├── franchise/
│   ├── ai/
│   ├── services/
│   ├── notifications/
│   └── analytics/
├── services/                 # API layer (authAPI, bookingAPI, walletAPI, …)
├── hooks/                    # Shared hooks
├── context/                  # React context (user, wallet, notifications)
├── types/                    # Shared TypeScript types
├── config/                   # App config (env, constants)
├── lib/                      # Utils, API client
├── public/
└── ...
```

**Single source of truth:** [docs/FOLDER_ARCHITECTURE.md](../docs/FOLDER_ARCHITECTURE.md)
