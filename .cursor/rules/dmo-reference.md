# DMO Quick Reference

> Decentralized Management Office - Core Operating Layer

## What is DMO?
Central governance system through which ALL EHB services operate.

## DMO Modules (8)

| Module | Purpose | Tables |
|--------|---------|--------|
| Identity (JPS) | User/company profiles | users, profiles, companies |
| PSS | AI online verification | pss_checks, documents, kyc_records |
| CRB | Physical certification | crb_applications, inspections, certificates |
| STL | Trust scoring | stl_scores, stl_history |
| Wallet | Financial operations | wallet_accounts, transactions |
| Applications | Workflow engine | applications, workflow_steps, approvals |
| Registry | Certificates storage | licenses, certificates, registry_entries |
| Blockchain | Immutable records | blockchain_hashes |

## User Flow (8 Steps)

```
1. Registration → 2. JPS Profile → 3. STL Apply
       ↓
4. PSS Verify → 5. CRB Certify → 6. DMO Store
       ↓
7. STL Calculate → 8. Service Active
```

## 6-Month Refilling Cycle
- CRB re-verification required every 6 months
- Non-compliance → services hidden → STL downgrade

## Key APIs

```
/auth/*          - Authentication
/profiles/*      - JPS profiles
/pss/*           - PSS verification
/crb/*           - CRB certification
/stl/*           - Trust levels
/wallet/*        - Financial
/applications/*  - Workflows
```

## Visual References
- `assets/dmo-data-flow-ui.png`
- `assets/dmo-crb-pss-workflow.png`

---

*Full blueprint: docs/architecture/dmo-blueprint.md*
