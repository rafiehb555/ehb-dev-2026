import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/rbac";
import { fail, ok } from "@/lib/apiResponse";
import { handleRouteError } from "@/lib/apiErrors";
import { ListPssCasesQuerySchema } from "@/lib/pss/schemas";
import { refillAlertFromDueDate } from "@/lib/pss/intelligence";

function statusFrom(phaseCompleted: number, verificationStatus: "PENDING" | "VERIFIED" | "REJECTED") {
  if (verificationStatus === "REJECTED") return "REJECTED" as const;
  if (verificationStatus === "VERIFIED" || phaseCompleted >= 6) return "VERIFIED" as const;
  if (phaseCompleted === 0) return "PENDING" as const;
  return "UNDER_REVIEW" as const;
}

function stageFrom(phaseCompleted: number) {
  if (phaseCompleted <= 0) return "IDENTITY";
  if (phaseCompleted === 1) return "DOCUMENTS";
  if (phaseCompleted === 2) return "LIVENESS";
  if (phaseCompleted === 3) return "AML_RISK";
  if (phaseCompleted === 4 || phaseCompleted === 5) return "FINAL_DECISION";
  return "COMPLETED";
}

export async function GET(req: Request) {
  const auth = await requireSession(["USER", "FRANCHISE", "ADMIN", "SUPER_ADMIN"]);
  if (!auth.ok) return fail(auth.status, "AUTH", auth.error);

  try {
    const url = new URL(req.url);
    const query = ListPssCasesQuerySchema.parse({
      status: url.searchParams.get("status") ?? undefined,
      risk: url.searchParams.get("risk") ?? undefined,
      query: url.searchParams.get("query") ?? undefined,
      take: url.searchParams.get("take") ?? undefined,
      skip: url.searchParams.get("skip") ?? undefined,
    });

    const whereUser = auth.user.role === "USER" ? { userId: auth.user.userId } : {};
    const verifications = await prisma.pSSVerification.findMany({
      where: {
        ...(query.risk ? { riskLevel: query.risk } : {}),
        ...(query.query
          ? {
              OR: [
                { user: { name: { contains: query.query, mode: "insensitive" } } },
                { user: { email: { contains: query.query, mode: "insensitive" } } },
              ],
            }
          : {}),
        ...whereUser,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            profile: { select: { verificationStatus: true } },
          },
        },
        refills: {
          where: { status: "PENDING" },
          orderBy: { dueDate: "asc" },
          take: 1,
        },
      },
      orderBy: { updatedAt: "desc" },
      take: query.take ?? 50,
      skip: query.skip ?? 0,
    });

    const cases = verifications
      .map((v) => {
        const verificationStatus = v.user.profile?.verificationStatus ?? "PENDING";
        const status = statusFrom(v.phaseCompleted, verificationStatus);
        return {
          id: v.id,
          userId: v.userId,
          user: { id: v.user.id, name: v.user.name, email: v.user.email, role: v.user.role },
          type: "KYC",
          status,
          riskScore: v.riskScore ?? 0,
          risk: (v.riskLevel ?? "low") as "low" | "medium" | "high",
          stage: stageFrom(v.phaseCompleted),
          phaseCompleted: v.phaseCompleted,
          updatedAt: v.updatedAt,
          lastVerifiedAt: v.lastVerifiedAt,
          nextRefill: v.refills[0]
            ? {
                dueDate: v.refills[0].dueDate,
                status: v.refills[0].status,
              }
            : null,
          refillAlert: refillAlertFromDueDate(v.refills[0]?.dueDate).status,
          refillDaysRemaining: refillAlertFromDueDate(v.refills[0]?.dueDate).daysRemaining,
        };
      })
      .filter((c) => (query.status ? c.status === query.status : true));

    return ok({
      cases,
      page: { take: query.take ?? 50, skip: query.skip ?? 0 },
    });
  } catch (err) {
    return handleRouteError(err);
  }
}

