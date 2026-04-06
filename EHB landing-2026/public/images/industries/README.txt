Industry visuals
----------------
Default branded placeholders (shared for all slugs until you override per industry):

  shared/card.svg
  shared/hero.svg

Per-industry files (optional): add under <slug>/ and register in lib/industry/designAssets.ts (PATH_OVERRIDES), e.g.:

  health/card.webp
  health/hero.webp

Prototype ZIPs on D:\ehb ui ux are listed in lib/industry/zipSourceInventory.ts.

Database: run `npx prisma db seed` when DATABASE_URL is set so DMO verification uses real Industry rows.
