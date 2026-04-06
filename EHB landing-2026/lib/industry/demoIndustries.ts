import { INDUSTRIES } from "@/lib/industry/config";

/** Row shape for GET /api/industries when using config-backed demo data (no DB). */
export type DemoIndustryApiRow = {
  id: string;
  name: string;
  description: string | null;
  slug: string;
  sortOrder: number;
};

export function demoIndustriesFromConfig(): DemoIndustryApiRow[] {
  return INDUSTRIES.map((ind) => ({
    id: `demo-industry-${ind.slug}`,
    name: ind.name,
    description: ind.overview,
    slug: ind.slug,
    sortOrder: ind.id,
  }));
}
