# EHB Database Quick Reference

> 23 tables across 8 layers

## Database Layers

| Layer | Tables | Purpose |
|-------|--------|---------|
| Core Users | users, profiles, skills, user_skills | Identity (JPS) |
| Verification | pss_verifications, crb_certifications, stl_levels | Trust system |
| Services | industries, categories, services, service_providers, bookings | 700+ services |
| Financial | wallets, transactions, escrow_transactions | EHB Wallet |
| Affiliate | affiliates, affiliate_commissions | Referral system |
| Franchise | franchises, franchise_revenue | Franchise network |
| AI Marketplace | ai_tools, ai_usage | AI features |
| Blockchain | blockchain_transactions, blockchain_proofs | Immutable proof |

## Key Relationships

```
users (1) ──→ (1) profiles
users (1) ──→ (N) user_skills ──→ skills
users (1) ──→ (N) pss_verifications
users (1) ──→ (1) stl_levels
users (1) ──→ (1) wallets ──→ (N) transactions
users (1) ──→ (N) service_providers ──→ services ──→ categories ──→ industries
```

## Primary Keys
All tables use **UUID** as primary key.

## Enums Reference

| Table | Field | Values |
|-------|-------|--------|
| users | role | user, provider, admin, franchise |
| stl_levels | level | free, basic, medium, high, vip |
| pss_verifications | status | pending, verified, rejected |
| bookings | status | pending, confirmed, completed, cancelled |
| transactions | status | pending, completed, failed |

---

*Basic schema: docs/database/database-master-structure.md*
*Full DMO schema (200+ tables): docs/database/dmo-master-database.md*
