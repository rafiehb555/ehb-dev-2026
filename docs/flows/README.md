# docs/flows

**Cursor Plan mode:** assistants may only **edit markdown** here; changing `EHB landing-2026/*.ts` (e.g. `tailwind.config.ts`) needs **Agent mode** or manual paste — see [FLOW-P11-integration-readiness.md](FLOW-P11-integration-readiness.md) “Remaining”.

User aur Provider lifecycle flows (Signup → PSS → CRB → STL → Access / Listing → Orders → Payments).

**Key files:** [USER_FLOW.md](USER_FLOW.md), [PROVIDER_FLOW.md](PROVIDER_FLOW.md)

**Full index:** [INDEX.md](INDEX.md) · **Economics:** [ECONOMICS_MASTER.md](ECONOMICS_MASTER.md) · **PSS→STL:** [PSS_TO_STL_ENGINE_MAPPING.md](PSS_TO_STL_ENGINE_MAPPING.md)

**Design-phase (P0+):** [GLOSSARY_EHB.md](GLOSSARY_EHB.md) · [EHB_MODULE_DEPENDENCY.md](EHB_MODULE_DEPENDENCY.md) · [TRACEABILITY_MATRIX.md](TRACEABILITY_MATRIX.md) · [DESIGN_DOC_TEMPLATE.md](DESIGN_DOC_TEMPLATE.md) · [FLOW-P1-foundation-ui.md](FLOW-P1-foundation-ui.md) · [FLOW-P2-trust-stack.md](FLOW-P2-trust-stack.md) · [FLOW-P3-dmo-governance.md](FLOW-P3-dmo-governance.md) · [FLOW-P4-jps-workforce.md](FLOW-P4-jps-workforce.md) · [FLOW-P5-gosellr-marketplace.md](FLOW-P5-gosellr-marketplace.md) · [FLOW-P6-wallet-token.md](FLOW-P6-wallet-token.md) · [FLOW-P7-franchise-network.md](FLOW-P7-franchise-network.md) · [FLOW-P8-affiliate-complaints.md](FLOW-P8-affiliate-complaints.md) · [FLOW-P9-blockchain-trust.md](FLOW-P9-blockchain-trust.md) · [FLOW-P10-industries-ui.md](FLOW-P10-industries-ui.md) · [FLOW-P11-integration-readiness.md](FLOW-P11-integration-readiness.md)

Master index: [docs/INDEX.md](../INDEX.md) · Folder rules: [docs/FOLDER_ARCHITECTURE.md](../FOLDER_ARCHITECTURE.md)

## Landing app — CI & local builds

The Next.js app lives in [`EHB landing-2026/`](../../EHB%20landing-2026/).

| What | Where / command |
|------|------------------|
| **CI** | [`.github/workflows/ehb-landing-ci.yml`](../../.github/workflows/ehb-landing-ci.yml) — `npm ci` → `tsc --noEmit` → `npm test` → `npm run lint` → `npm run build` |
| **Stale `.next` / missing chunk** | From `EHB landing-2026/`: **`npm run build:clean`** (`clean` + `build`) |
| **Implementation index** | [docs/INDEX.md](../INDEX.md) — health smoke, Stripe, OLS law reference, Tailwind `content` globs |

Design tokens and text colors: [FLOW-P1-foundation-ui.md](FLOW-P1-foundation-ui.md). **P1 text-token example paths** (landing): [TRACEABILITY_MATRIX.md](TRACEABILITY_MATRIX.md) — `development`, `dmo/home`, `dmo/Toast`.
