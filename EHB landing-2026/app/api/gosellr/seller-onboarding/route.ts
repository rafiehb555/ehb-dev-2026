import { z } from "zod";
import { requireSession } from "@/lib/rbac";
import { ok, fail } from "@/lib/apiResponse";
import { handleRouteError } from "@/lib/apiErrors";
import { prisma } from "@/lib/prisma";
import { writeAuditLog } from "@/lib/audit";
import { syncApplicationRisk } from "@/lib/fraud/orchestration";

const SellerOnboardingSchema = z.object({
  storeName: z.string().min(2).max(120),
  category: z.string().min(2).max(120),
  notes: z.string().max(1000).optional(),
});

export async function POST(req: Request) {
  const auth = await requireSession(["USER", "FRANCHISE", "ADMIN", "SUPER_ADMIN"]);
  if (!auth.ok) return fail(auth.status, "AUTH", auth.error);

  try {
    const body = SellerOnboardingSchema.parse(await req.json());

    const application = await prisma.application.create({
      data: {
        type: "SELLER_ONBOARDING" as any,
        status: "NEW",
        sourceSystem: "AUTOMATION",
        priority: "MEDIUM",
        applicantId: auth.user.userId,
        payload: {
          storeName: body.storeName,
          category: body.category,
          notes: body.notes ?? null,
          onboardingState: "PENDING_DMO_APPROVAL",
        },
      },
      select: { id: true, type: true, status: true },
    });

    await syncApplicationRisk(application.id, auth.user.userId);

    await writeAuditLog({
      actorId: auth.user.userId,
      action: "GOSELLR_SELLER_ONBOARDING_CREATED",
      targetType: "APPLICATION",
      targetId: application.id,
      metadata: {
        storeName: body.storeName,
        category: body.category,
      },
    });

    return ok({ application }, { status: 201 });
  } catch (err) {
    return handleRouteError(err);
  }
}
