# Complete Database Architecture Quick Reference

> 300+ Tables Enterprise System

## Database Modules

| Module | Tables | Purpose |
|--------|--------|---------|
| User & Identity | ~30 | Accounts, profiles |
| JPS Professional | ~25 | Skills, experience |
| PSS Verification | ~30 | KYC, AML |
| CRB Certification | ~30 | Certificates |
| STL Trust Engine | ~20 | Scores, rankings |
| Marketplace | ~40 | Products, orders |
| Wallet & Finance | ~30 | Payments |
| Franchise Network | ~20 | Operations |
| Applications | ~25 | Licenses |
| Notifications | ~10 | Alerts |
| Analytics & AI | ~40 | ML, reporting |
| **TOTAL** | **~300+** | |

## Key Tables by Module

### User
```
users, user_profiles, user_roles, user_sessions
```

### JPS
```
jps_profiles, jps_skills, jps_experience, jps_education
```

### PSS
```
pss_identity_verification, pss_aml_screening, pss_risk_scores
```

### CRB
```
crb_certificates, crb_inspections, crb_refilling_records
```

### STL
```
stl_scores, stl_history, stl_rankings
```

### Marketplace
```
products, services, orders, order_items
```

## Full Details

See: `docs/database/complete-database-architecture.md`
See: `docs/architecture/complete-er-diagram.md`
