# EHB Navigation Quick Reference

> User App + Admin Routes

## User App Main Sections

```
/ (Home)
├── /profile         → JPS Profile
├── /marketplace     → GoSellr (Products/Services)
├── /jobs            → Jobs & Skills
├── /health          → WMS (Medical)
├── /travel          → AGTS (Travel)
├── /legal           → OLS (Legal)
├── /tech            → SOT (Technology)
├── /media           → EHB Tube
├── /education       → HPS + OBS
├── /applications    → Government Services
├── /wallet          → EHB Wallet
└── /trust           → STL/PSS/CRB
```

## Admin DMO Sections

```
/admin (Dashboard)
├── /admin/users          → User Management
├── /admin/providers      → Service Providers
├── /admin/companies      → Companies
├── /admin/officers       → Government Officers
├── /admin/franchise      → Franchise Network
├── /admin/pss            → PSS Verification
├── /admin/crb            → CRB Certification
├── /admin/stl            → STL Trust System
├── /admin/certificates   → Certificates & Licenses
├── /admin/applications   → Application Management
├── /admin/finance        → Financial Management
├── /admin/notifications  → Notifications & Penalties
├── /admin/blockchain     → Blockchain Records
└── /admin/settings       → System Settings
```

## Auth Levels

| Route Pattern | Required Auth |
|---------------|---------------|
| Public pages | None |
| /profile/* | User |
| /wallet/* | User |
| /applications/* | User |
| /admin/* | Admin role |
| /admin/officers/* | SuperAdmin |
| /admin/settings/* | SuperAdmin |

---

*Full navigation: docs/ui-ux/navigation-architecture.md*
