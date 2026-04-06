import { requireSession } from "@/lib/rbac";
import { fail, ok } from "@/lib/apiResponse";
import { handleRouteError } from "@/lib/apiErrors";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const auth = await requireSession(["USER", "ADMIN", "SUPER_ADMIN", "FRANCHISE"]);
  if (!auth.ok) return fail(auth.status, "AUTH", auth.error);

  try {
    const profile = await prisma.profile.findUnique({
      where: { userId: auth.user.userId },
      select: { stlStatus: true, stlScore: true, stlUpdatedAt: true },
    });

    const verification = await prisma.pSSVerification.findUnique({
      where: { userId: auth.user.userId },
      select: { id: true, phaseCompleted: true, lastVerifiedAt: true, riskLevel: true },
    });

    const nextRefill = verification
      ? await prisma.pSSRefill.findFirst({
          where: { verificationId: verification.id, status: "PENDING" },
          orderBy: { dueDate: "asc" },
        })
      : null;

    return ok({
      stl: profile ?? { stlStatus: "SUSPENDED", stlScore: 0, stlUpdatedAt: new Date().toISOString() },
      verification,
      nextRefill,
    });
  } catch (err) {
    return handleRouteError(err);
  }
}

