import { prisma } from "@/lib/prisma";
import { ok } from "@/lib/apiResponse";
import { handleRouteError } from "@/lib/apiErrors";
import { ListIndustriesQuerySchema } from "@/lib/industry/schemas";

function demoIndustries() {
  return [
    { id: "industry-demo-1", name: "Construction", description: "Infrastructure, civil works, and field services.", sortOrder: 1 },
    { id: "industry-demo-2", name: "Healthcare", description: "Medical, clinic, diagnostics, and care services.", sortOrder: 2 },
    { id: "industry-demo-3", name: "Education", description: "Training, learning, and institutional services.", sortOrder: 3 },
    { id: "industry-demo-4", name: "Technology", description: "Software, AI, cloud, and digital operations.", sortOrder: 4 },
  ];
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const q = ListIndustriesQuerySchema.parse({
      take: url.searchParams.get("take") ?? undefined,
      skip: url.searchParams.get("skip") ?? undefined,
    });

    const take = q.take ?? 100;
    const skip = q.skip ?? 0;

    if (!process.env.DATABASE_URL || process.env.NODE_ENV !== "production") {
      const items = demoIndustries().slice(skip, skip + take);
      if (!process.env.DATABASE_URL) {
        return ok({ items, total: demoIndustries().length, take, skip });
      }
    }

    const [items, total] = await prisma.$transaction([
      prisma.industry.findMany({ orderBy: [{ sortOrder: "asc" }, { name: "asc" }], take, skip }),
      prisma.industry.count(),
    ]);

    return ok({ items, total, take, skip });
  } catch (err) {
    if (process.env.NODE_ENV !== "production") {
      const items = demoIndustries();
      return ok({ items, total: items.length, take: items.length, skip: 0 });
    }
    return handleRouteError(err);
  }
}

