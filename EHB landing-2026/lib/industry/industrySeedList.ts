import { INDUSTRIES } from "./config";

/** Prisma Industry upsert source — single source of truth with lib/industry/config.ts */
export const INDUSTRY_DB_SEED = INDUSTRIES.map((i) => ({
  slug: i.slug,
  name: i.name,
  description: i.overview,
  sortOrder: i.id,
}));
