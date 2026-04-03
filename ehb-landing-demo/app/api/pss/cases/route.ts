import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/rbac";
import { fail, ok } from "@/lib/apiResponse";
import { handleRouteError } from "@/lib/apiErrors";
import { ListPssCasesQuerySchema } from "@/lib/pss/schemas";
import { refillAlertFromDueDate } from "@/lib/pss/intelligence";
import { isMongoObjectId } from "@/lib/mongoId";

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

function demoCases() {
  const now = Date.now();
  return [
    {
      id: "pss-demo-1",
      userId: "ehb-demo-user-1",
      user: { id: "ehb-demo-user-1", name: "Ali Khan", email: "ali@test.com", role: "USER" },
      type: "KYC",
      status: "UNDER_REVIEW" as const,
      riskScore: 78,
      risk: "high" as const,
      stage: "AML_RISK",
      phaseCompleted: 3,
      updatedAt: new Date(now - 2 * 60 * 60 * 1000).toISOString(),
      lastVerifiedAt: null,
      nextRefill: { dueDate: new Date(now + 4 * 24 * 60 * 60 * 1000).toISOString(), status: "PENDING" },
      refillAlert: "warning",
      refillDaysRemaining: 4,
    },
    {
      id: "pss-demo-2",
      userId: "ehb-demo-user-2",
      user: { id: "ehb-demo-user-2", name: "Sara Noor", email: "sara@test.com", role: "USER" },
      type: "KYC",
      status: "VERIFIED" as const,
      riskScore: 24,
      risk: "low" as const,
      stage: "COMPLETED",
      phaseCompleted: 6,
      updatedAt: new Date(now - 10 * 60 * 60 * 1000).toISOString(),
      lastVerifiedAt: new Date(now - 36 * 60 * 60 * 1000).toISOString(),
      nextRefill: null,
      refillAlert: "ok",
      refillDaysRemaining: 32,
    },
    {
      id: "pss-demo-3",
      userId: "ehb-demo-user-3",
      user: { id: "ehb-demo-user-3", name: "Usman Raza", email: "usman@test.com", role: "USER" },
      type: "KYC",
      status: "PENDING" as const,
      riskScore: 46,
      risk: "medium" as const,
      stage: "DOCUMENTS",
      phaseCompleted: 1,
      updatedAt: new Date(now - 90 * 60 * 1000).toISOString(),
      lastVerifiedAt: null,
      nextRefill: { dueDate: new Date(now + 14 * 24 * 60 * 60 * 1000).toISOString(), status: "PENDING" },
      refillAlert: "ok",
      refillDaysRemaining: 14,
    },
  ];
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

    if (!process.env.DATABASE_URL || !isMongoObjectId(auth.user.userId)) {
      const allCases = demoCases()
        .filter((item) => (query.risk ? item.risk === query.risk : true))
        .filter((item) => (query.query ? [item.user.name, item.user.email].some((value) => value.toLowerCase().includes(query.query!.toLowerCase())) : true))
        .filter((item) => (query.status ? item.status === query.status : true));
      const take = query.take ?? 50;
      const skip = query.skip ?? 0;
      return ok({
        cases: allCases.slice(skip, skip + take),
        page: { take, skip, total: allCases.length, hasNext: skip + take < allCases.length },
      });
    }

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

