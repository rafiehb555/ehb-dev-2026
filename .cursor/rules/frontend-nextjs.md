# EHB Frontend - Next.js Guidelines

> Frontend hamesha Next.js par rahega

## Technology Stack (Frontend)

| Component | Technology |
|-----------|------------|
| Framework | Next.js 14+ (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| State | React Context / Zustand |
| API Calls | Fetch / Axios / React Query |
| Forms | React Hook Form |
| UI Components | shadcn/ui (recommended) |
| Icons | Lucide Icons |

## Default Theme
- **Theme:** Dark Blue (see `assets/ui-default-theme-dark.png`)
- **Design System:** `docs/ui-ux/design-system.md`
- User can change theme in Settings
- Dark Blue auto-selected by default

## Project Structure

```
app/
├── (auth)/                    # Auth pages (login, register)
├── (dashboard)/               # Protected dashboard pages
├── (platforms)/               # Industry platform pages
│   ├── gosellr/              # E-commerce
│   ├── wms/                  # Healthcare
│   ├── hps/                  # Education
│   ├── obs/                  # Books
│   ├── ols/                  # Legal
│   ├── agts/                 # Travel
│   ├── hms/                  # Machinery
│   ├── sot/                  # Technology
│   └── tube/                 # Media
├── api/                       # API routes
├── layout.tsx                 # Root layout
└── page.tsx                   # Home page

components/
├── ui/                        # Reusable UI components
├── shared/                    # Shared across platforms
├── platforms/                 # Platform-specific components
└── layouts/                   # Layout components

lib/
├── api/                       # API client functions
├── utils/                     # Utility functions
└── hooks/                     # Custom hooks
```

## Development Guidelines

1. **Server Components by default** - Use 'use client' only when needed
2. **API Routes** for backend communication
3. **Middleware** for auth protection
4. **Dynamic routes** for platform pages
5. **Parallel routes** for dashboard sections

## Platform Routing

```
/                          → Home (AI Discovery)
/gosellr                   → E-commerce platform
/wms                       → Healthcare platform
/hps                       → Education platform
/dashboard                 → User dashboard
/dashboard/jps             → Profile management
/dashboard/wallet          → EHB Wallet
```

---

*Next.js is the FIXED frontend choice for EHB*
