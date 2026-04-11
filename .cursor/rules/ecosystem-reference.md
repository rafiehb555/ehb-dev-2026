# EHB Ecosystem Quick Reference

> Super App Architecture Overview

## 5 Platform Layers

```
Layer 1: INTERFACE      → Mobile, Web, Portals
Layer 2: SERVICES       → GoSellr, WMS, HPS, AGTS, etc.
Layer 3: VERIFICATION   → PSS, CRB, STL
Layer 4: MANAGEMENT     → DMO, Workflows, Finance
Layer 5: INFRASTRUCTURE → DB, AI, Blockchain, Cloud
```

## 9 Industry Platforms

| Code | Name | Industry |
|------|------|----------|
| GSM | GoSellr | E-commerce |
| WMS | World Medical | Healthcare |
| HPS | Human Performance | Education |
| OBS | Online Book Store | Books |
| OLS | Online Law | Legal |
| AGTS | Advanced Travel | Travel |
| HMS | Homan Machinery | Machinery |
| SOT | Services of Tech | Technology |
| TUBE | EHB Tube | Media |

## Core Systems

```
DMO  → Central governance (brain)
JPS  → User profiles & skills
PSS  → AI verification
CRB  → Physical certification
STL  → Trust levels (Free→VIP)
```

## User Flow (9 Steps)

```
1. Register → 2. JPS Profile → 3. STL Apply
                    ↓
4. PSS Verify → 5. CRB Certify → 6. DMO Store
                    ↓
7. Blockchain → 8. Service Active → 9. 6-Month Refill
```

## Franchise Hierarchy

```
Corporate Franchise (Country)
  └── Master Franchise (Region)
        └── Sub Franchise (Local)
```

## Tech Stack Summary

```
Frontend:    Next.js
Backend:     NestJS
Database:    PostgreSQL
Cache:       Redis
Queue:       Kafka
Blockchain:  Polkadot
AI:          OpenAI + Custom
```

---

*Full architecture: docs/architecture/super-app-ecosystem.md*
