import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/rbac";
import { handleRouteError } from "@/lib/apiErrors";
import { fail, ok } from "@/lib/apiResponse";
import { ListRegistryQuerySchema } from "@/lib/dmo/schemas";

export async function GET(req: Request) {
  const auth = await requireSession(["ADMIN", "SUPER_ADMIN"]);
  if (!auth.ok) return fail(auth.status, "AUTH", auth.error);

  try {
    const url = new URL(req.url);
    const query = ListRegistryQuerySchema.parse({
      entityType: url.searchParams.get("entityType") ?? undefined,
      status: url.searchParams.get("status") ?? undefined,
      source: url.searchParams.get("source") ?? undefined,
      take: url.searchParams.get("take") ?? undefined,
      skip: url.searchParams.get("skip") ?? undefined,
    });

    const records = await prisma.registryRecord.findMany({
      where: {
        ...(query.entityType ? { entityType: query.entityType } : {}),
        ...(query.status ? { status: query.status } : {}),
        ...(query.source ? { verificationSource: query.source } : {}),
      },
      orderBy: { createdAt: "desc" },
      take: query.take ?? 50,
      skip: query.skip ?? 0,
    });

    return ok({ records, page: { take: query.take ?? 50, skip: query.skip ?? 0 } });
  } catch (err) {
    return handleRouteError(err);
  }
}

