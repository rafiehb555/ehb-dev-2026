import { prisma } from "@/lib/prisma";
import { ok } from "@/lib/apiResponse";
import { handleRouteError } from "@/lib/apiErrors";
import { demoIndustriesFromConfig } from "@/lib/industry/demoIndustries";
import { ListIndustriesQuerySchema } from "@/lib/industry/schemas";

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
      const allDemo = demoIndustriesFromConfig();
      const items = allDemo.slice(skip, skip + take);
      if (!process.env.DATABASE_URL) {
        return ok({ items, total: allDemo.length, take, skip });
      }
    }

    const [items, total] = await prisma.$transaction([
      prisma.industry.findMany({ orderBy: [{ sortOrder: "asc" }, { name: "asc" }], take, skip }),
      prisma.industry.count(),
    ]);

    return ok({ items, total, take, skip });
  } catch (err) {
    if (process.env.NODE_ENV !== "production") {
      const items = demoIndustriesFromConfig();
      return ok({ items, total: items.length, take: items.length, skip: 0 });
    }
    return handleRouteError(err);
  }
}

