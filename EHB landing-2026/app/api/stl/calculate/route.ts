import { requireSession } from "@/lib/rbac";
import { fail, ok } from "@/lib/apiResponse";
import { handleRouteError } from "@/lib/apiErrors";
import { prisma } from "@/lib/prisma";
import { computeStlByEntity, recalcStlByEntity } from "@/lib/stl/engine";
import { z } from "zod";
import { isMongoObjectId } from "@/lib/mongoId";

const BodySchema = z.object({
  entityId: z.string().min(1).max(120).optional(),
  entityType: z.enum(["USER", "SERVICE", "PRODUCT"]).default("USER"),
  reason: z.string().max(240).optional(),
});

const QuerySchema = z.object({
  entityType: z.enum(["USER", "SERVICE", "PRODUCT"]).optional(),
  take: z.coerce.number().int().min(1).max(200).optional(),
  skip: z.coerce.number().int().min(0).max(5000).optional(),
  logsTake: z.coerce.number().int().min(1).max(200).optional(),
});

function demoScores() {
  const now = Date.now();
  return [
    {
      id: "stl-score-1",
      entityId: "Ali Khan",
      entityType: "USER",
      score: 86,
      level: 4,
      breakdown: { pss: 30, crb: 16, performance: 18, behavior: 12, industries: 6, refilling: 4, total: 86, level: 4, label: "Highly Trusted" },
      lastUpdated: new Date(now - 60 * 60 * 1000).toISOString(),
    },
    {
      id: "stl-score-2",
      entityId: "Sara Noor",
      entityType: "USER",
      score: 72,
      level: 3,
      breakdown: { pss: 28, crb: 10, performance: 16, behavior: 8, industries: 5, refilling: 5, total: 72, level: 3, label: "Trusted" },
      lastUpdated: new Date(now - 3 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "stl-score-3",
      entityId: "Usman Raza",
      entityType: "USER",
      score: 48,
      level: 2,
      breakdown: { pss: 20, crb: 4, performance: 12, behavior: 4, industries: 3, refilling: 5, total: 48, level: 2, label: "Basic Verified" },
      lastUpdated: new Date(now - 5 * 60 * 60 * 1000).toISOString(),
    },
  ];
}

function demoLogs() {
  const now = Date.now();
  return [
    { id: "stl-log-1", entityId: "Ali Khan", entityType: "USER", change: 5, reason: "PSS_RENEWED", createdAt: new Date(now - 2 * 60 * 60 * 1000).toISOString() },
    { id: "stl-log-2", entityId: "Sara Noor", entityType: "USER", change: -3, reason: "REFILL_WARNING", createdAt: new Date(now - 4 * 60 * 60 * 1000).toISOString() },
    { id: "stl-log-3", entityId: "Usman Raza", entityType: "USER", change: 8, reason: "CRB_CERTIFIED", createdAt: new Date(now - 8 * 60 * 60 * 1000).toISOString() },
  ];
}

export async function POST(req: Request) {
  const auth = await requireSession(["ADMIN", "SUPER_ADMIN", "FRANCHISE", "USER"]);
  if (!auth.ok) return fail(auth.status, "AUTH", auth.error);

  try {
    const body = BodySchema.parse(await req.json());
    const targetEntityId = body.entityId?.trim() || auth.user.userId;

    if (body.entityType !== "USER" && !body.entityId?.trim()) {
      return fail(400, "VALIDATION_ERROR", "entityId is required for SERVICE and PRODUCT STL calculation");
    }

    if (auth.user.role !== "ADMIN" && auth.user.role !== "SUPER_ADMIN") {
      if (body.entityType === "USER" && targetEntityId !== auth.user.userId) {
        return fail(403, "FORBIDDEN", "Forbidden");
      }

      if (body.entityType === "SERVICE") {
        const service = await prisma.providerService.findUnique({
          where: { id: targetEntityId },
          select: { userId: true },
        });
        if (!service) return fail(404, "NOT_FOUND", "Service not found");
        if (service.userId !== auth.user.userId) return fail(403, "FORBIDDEN", "Forbidden");
      }

      if (body.entityType === "PRODUCT") {
        const product = await prisma.product.findUnique({
          where: { id: targetEntityId },
          select: { sellerId: true },
        });
        if (!product) return fail(404, "NOT_FOUND", "Product not found");
        if (product.sellerId !== auth.user.userId) return fail(403, "FORBIDDEN", "Forbidden");
      }
    }

    try {
      const result = await recalcStlByEntity({
        entityId: targetEntityId,
        entityType: body.entityType,
        actorId: auth.user.userId,
        reason: body.reason ?? "STL_CALCULATE_API",
      });

      return ok({
        entityId: targetEntityId,
        entityType: body.entityType,
        score: Number(result.scoreRow.score),
        level: result.scoreRow.level,
        breakdown: result.scoreRow.breakdown,
        change: result.change,
        prevScore: result.prevScore,
        nextScore: result.nextScore,
        persisted: true,
      });
    } catch {
      const breakdown = await computeStlByEntity({
        entityId: targetEntityId,
        entityType: body.entityType,
      });

      return ok({
        entityId: targetEntityId,
        entityType: body.entityType,
        score: breakdown.total,
        level: breakdown.level,
        breakdown,
        change: null,
        prevScore: null,
        nextScore: breakdown.total,
        persisted: false,
        warning: "STL computed successfully but could not be persisted in the current database environment.",
      });
    }
  } catch (err) {
    return handleRouteError(err);
  }
}

export async function GET(req: Request) {
  const auth = await requireSession(["ADMIN", "SUPER_ADMIN", "FRANCHISE", "USER"]);
  if (!auth.ok) return fail(auth.status, "AUTH", auth.error);

  try {
    const url = new URL(req.url);
    const q = QuerySchema.parse({
      entityType: url.searchParams.get("entityType") ?? undefined,
      take: url.searchParams.get("take") ?? undefined,
      skip: url.searchParams.get("skip") ?? undefined,
      logsTake: url.searchParams.get("logsTake") ?? undefined,
    });

    if (!process.env.DATABASE_URL || !isMongoObjectId(auth.user.userId)) {
      const scores = demoScores().filter((item) => (q.entityType ? item.entityType === q.entityType : true));
      const logs = demoLogs().filter((item) => (q.entityType ? item.entityType === q.entityType : true));
      return ok({
        scores: scores.slice(q.skip ?? 0, (q.skip ?? 0) + (q.take ?? 50)),
        logs: logs.slice(0, q.logsTake ?? 50),
        page: { take: q.take ?? 50, skip: q.skip ?? 0, logsTake: q.logsTake ?? 50 },
      });
    }

    const whereScore = {
      ...(q.entityType ? { entityType: q.entityType } : {}),
      ...(auth.user.role === "USER" ? { entityId: auth.user.userId } : {}),
    };
    const whereLog = {
      ...(q.entityType ? { entityType: q.entityType } : {}),
      ...(auth.user.role === "USER" ? { entityId: auth.user.userId } : {}),
    };

    const [scores, logs] = await Promise.all([
      prisma.sTLScore.findMany({
        where: whereScore,
        orderBy: [{ score: "desc" }, { lastUpdated: "desc" }],
        take: q.take ?? 50,
        skip: q.skip ?? 0,
      }),
      prisma.sTLLog.findMany({
        where: whereLog,
        orderBy: { createdAt: "desc" },
        take: q.logsTake ?? 50,
      }),
    ]);

    return ok({
      scores,
      logs,
      page: { take: q.take ?? 50, skip: q.skip ?? 0, logsTake: q.logsTake ?? 50 },
    });
  } catch (err) {
    return handleRouteError(err);
  }
}

