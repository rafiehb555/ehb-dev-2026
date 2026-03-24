import { prisma } from "@/lib/prisma";
import { ok } from "@/lib/apiResponse";
import { handleRouteError } from "@/lib/apiErrors";
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

    const [items, total] = await prisma.$transaction([
      prisma.industry.findMany({ orderBy: [{ sortOrder: "asc" }, { name: "asc" }], take, skip }),
      prisma.industry.count(),
    ]);

    return ok({ items, total, take, skip });
  } catch (err) {
    return handleRouteError(err);
  }
}

