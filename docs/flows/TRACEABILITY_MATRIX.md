# Traceability matrix — plan files to flow docs

> **Living table.** Each `docs/development/EHB_*_PLAN.md` should map to at least one flow doc under `docs/flows/`.  
> Master index: [EHB_MASTER_SYSTEM_PLAN.md](../development/EHB_MASTER_SYSTEM_PLAN.md) §DOCUMENT INDEX (v7.0+).

| Plan file | Flow doc(s) | Status | Notes |
|-----------|---------------|--------|-------|
| EHB_MASTER_SYSTEM_PLAN.md | — (anchor) | n/a | Single source of truth; no separate flow required |
| EHB_MASTER_NAMES_PLAN.md | [GLOSSARY_EHB.md](GLOSSARY_EHB.md) | Draft | Naming + tree; full tables stay in names plan |
| EHB_COLOR_SCHEME_PLAN.md | [FLOW-P1-foundation-ui.md](FLOW-P1-foundation-ui.md) | Draft | Full tables in color plan; **code:** `ehb.textBody` / `textMuted` in [`tailwind.config.ts`](../../EHB%20landing-2026/tailwind.config.ts); text-token rollout covers **all** `app/**` and `components/**` plus SILVER badge in `lib/industry/verificationStandards.ts`; OLS law mirror under `content/industries/law/ols-law-source/nextjs-app/src` aligned and included in Tailwind `content` (see FLOW-P1, `docs/INDEX.md`) |
| EHB_UIUX_DESIGN_PLAN.md | [FLOW-P1-foundation-ui.md](FLOW-P1-foundation-ui.md) | Draft | Components/wireframes stay in UIUX plan |
| EHB_STL_FULL_PLAN.md | [FLOW-P2-trust-stack.md](FLOW-P2-trust-stack.md) | Draft | Engine + triggers + gaps |
| EHB_STL_UI_DESIGN_PLAN.md | [FLOW-P2-trust-stack.md](FLOW-P2-trust-stack.md) | Draft | DMO + user STL UI |
| EHB_PSS_CRB_PLAN.md | [FLOW-P2-trust-stack.md](FLOW-P2-trust-stack.md) | Draft | PSS + CRB sections; layer↔phase mapping open |
| EHB_DMO_PLAN.md | [FLOW-P3-dmo-governance.md](FLOW-P3-dmo-governance.md) | Draft | Workspace route map + governance |
| EHB_JPS_PLAN.md | [FLOW-P4-jps-workforce.md](FLOW-P4-jps-workforce.md) | Draft | Designations + STL gates + contracts |
| EHB_GOSELLR_PLAN.md | [FLOW-P5-gosellr-marketplace.md](FLOW-P5-gosellr-marketplace.md) | Draft | Orders escrow STL commission |
| EHB_WALLET_TOKEN_PLAN.md | [FLOW-P6-wallet-token.md](FLOW-P6-wallet-token.md) | Draft | Sub-wallets Trusty limits staking |
| EHB_FRANCHISE_PLAN.md | [FLOW-P7-franchise-network.md](FLOW-P7-franchise-network.md) | Draft | Hierarchy CRB routing splits |
| EHB_AFFILIATE_PLAN.md | [FLOW-P8-affiliate-complaints.md](FLOW-P8-affiliate-complaints.md) | Draft | Section A affiliate |
| EHB_COMPLAINT_PENALTY_PLAN.md | [FLOW-P8-affiliate-complaints.md](FLOW-P8-affiliate-complaints.md) | Draft | Section B complaints |
| EHB_BLOCKCHAIN_PLAN.md | [FLOW-P9-blockchain-trust.md](FLOW-P9-blockchain-trust.md) | Draft | Parachains relay validators |
| EHB_INDUSTRIES_UI_PLAN.md | [FLOW-P10-industries-ui.md](FLOW-P10-industries-ui.md) | Draft | Tiers cards search DMO |

**Related (non-INDEX legacy flows):** [USER_FLOW.md](USER_FLOW.md), [PROVIDER_FLOW.md](PROVIDER_FLOW.md)

**Integration & handoff:** [FLOW-P11-integration-readiness.md](FLOW-P11-integration-readiness.md) — epics, decisions log, implementation checklist.

**Ops smoke:** `GET /api/health` in the Next app ([`app/api/health/route.ts`](../../EHB%20landing-2026/app/api/health/route.ts)) — deploy/uptime checks; optional `gitSha` when `VERCEL_GIT_COMMIT_SHA` is set.

**Economics & PSS:** [ECONOMICS_MASTER.md](ECONOMICS_MASTER.md) · [PSS_TO_STL_ENGINE_MAPPING.md](PSS_TO_STL_ENGINE_MAPPING.md) · [INDEX.md](INDEX.md) (all flows).

**How to update:** When a flow doc is added, replace `*TBD*` with a markdown link and set **Status** to Draft → Review → Approved.
