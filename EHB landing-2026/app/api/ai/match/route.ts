import { z } from "zod";
import { ok, fail } from "@/lib/apiResponse";
import { handleRouteError } from "@/lib/apiErrors";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { trackEvent } from "@/lib/ai/recommendationEngine";
import type { Prisma } from "@prisma/client";

const MatchSchema = z.object({
  query: z.string().min(2).max(200),
  industry: z.string().min(1).max(100).optional(),
  location: z.string().max(120).optional(),
  limit: z.coerce.number().int().min(1).max(10).optional(),
});

export async function POST(req: Request) {
  try {
    const user = await getSessionUser();
    if (!user) return fail(401, "AUTH", "Login required");

    const body = MatchSchema.parse(await req.json());
    const limit = body.limit ?? 5;

    const orWhere: Prisma.ProviderServiceWhereInput[] = [
      { service: { name: { contains: body.query, mode: "insensitive" } } },
      { service: { description: { contains: body.query, mode: "insensitive" } } },
    ];
    if (body.industry) {
      orWhere.push({ service: { industry: { slug: body.industry } } });
    }
    if (body.location) {
      orWhere.push({ location: { contains: body.location, mode: "insensitive" } });
    }

    const services = await prisma.providerService.findMany({
      where: {
        isActive: true,
        OR: orWhere,
      },
      include: {
        user: { select: { id: true, name: true } },
        service: { select: { id: true, name: true, description: true } },
        profile: { select: { rating: true, stlScore: true } },
      },
      take: 25,
    });

    const matches = services
      .map((service) => {
        const rating = Number(service.profile?.rating ?? 0);
        const stlScore = Number(service.profile?.stlScore ?? 0);
        const locationMatch =
          body.location && service.location
            ? service.location.toLowerCase().includes(body.location.toLowerCase())
              ? 85
              : 50
            : 60;
        const score = Math.round(
          Math.max(
            0,
            Math.min(
              100,
              35 +
                (body.query ? 20 : 0) +
                locationMatch * 0.2 +
                rating * 8 +
                Math.min(stlScore, 100) * 0.15
            )
          )
        );

        return {
          providerServiceId: service.id,
          providerId: service.user.id,
          providerName: service.user.name,
          serviceName: service.service.name,
          location: service.location ?? null,
          rating,
          stlScore,
          score,
        };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    await trackEvent({
      userId: user.userId,
      eventType: "CLICK",
      entityType: "ai_match",
      metadata: {
        query: body.query,
        industry: body.industry ?? null,
        location: body.location ?? null,
        matches: matches.length,
      },
    });

    return ok({ matches, total: matches.length });
  } catch (err) {
    return handleRouteError(err);
  }
}
