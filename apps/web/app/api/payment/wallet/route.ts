import { prisma } from "@/lib/prisma";
import { fail, ok } from "@/lib/apiResponse";
import { handleRouteError } from "@/lib/apiErrors";
import { requireSession } from "@/lib/rbac";

export async function GET() {
  const auth = await requireSession(["USER", "FRANCHISE", "ADMIN", "SUPER_ADMIN", "SELLER"]);
  if (!auth.ok) return fail(auth.status, "AUTH", auth.error);

  try {
    const [wallet, txns] = await Promise.all([
      prisma.wallet.findUnique({
        where: { userId: auth.user.userId },
        select: {
          balance: true,
          affiliateIncome: true,
          serviceIncome: true,
          productIncome: true,
          franchiseIncome: true,
        },
      }),
      prisma.transaction.findMany({
        where: { userId: auth.user.userId, status: "COMPLETED" },
        orderBy: { createdAt: "desc" },
        take: 200,
      }),
    ]);

    const spent = txns
      .filter((t) => t.type === "ORDER" || t.type === "FRANCHISE")
      .reduce((sum, t) => sum + Number(t.amount), 0);
    const earned =
      Number(wallet?.affiliateIncome ?? 0) +
      Number(wallet?.serviceIncome ?? 0) +
      Number(wallet?.productIncome ?? 0) +
      Number(wallet?.franchiseIncome ?? 0);

    return ok({
      balance: Number((wallet?.balance ?? 0).toFixed(2)),
      spent: Number(spent.toFixed(2)),
      earned: Number(earned.toFixed(2)),
      recent: txns.slice(0, 15).map((t) => ({
        id: t.id,
        amount: Number(t.amount.toFixed(2)),
        type: t.type,
        status: t.status,
        referenceId: t.referenceId,
        createdAt: t.createdAt.toISOString(),
      })),
    });
  } catch (err) {
    return handleRouteError(err);
  }
}
