# EHB landing demo (Next.js)

## Scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | Dev server (port 3000) |
| `npm run build` | Production build |
| `npm run build:clean` | Removes `.next` then builds — use if you see missing chunk / `ENOENT` route errors |
| `npm run lint` | ESLint (`next lint`) |
| `npm test` | Unit tests (Vitest) |
| `npm run clean` | Delete `.next` only |

## CI

Repository workflow: [`.github/workflows/ehb-landing-ci.yml`](../.github/workflows/ehb-landing-ci.yml) — runs from this directory: install → Typecheck → tests → lint → production build.

## Documentation

- [docs/INDEX.md](../docs/INDEX.md) — health checks, payments, OLS reference, CI notes  
- [docs/flows/INDEX.md](../docs/flows/INDEX.md) — design flows P1–P11  

## Static assets

- **`public/images/`** — Industry cards/heroes (`public/images/industries/…`), GoSellr / AI marketplace product art (`public/images/ai-market/…`), profile avatars (`public/images/profiles/…`), DMO explainer SVGs (`public/images/cards/…`). Referenced from `lib/industry/designAssets.ts`, `lib/marketplace/gosellrProducts.ts`, and related components using `next/image`.
