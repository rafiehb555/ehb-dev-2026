import { prisma } from "@/lib/prisma";
import { ok } from "@/lib/apiResponse";
import { requireSession } from "@/lib/rbac";

type AffiliateUser = {
  id: string;
  name: string;
  level: number;
  earnings: number;
  status: "Active" | "Dormant";
};

function demoResponse() {
  return {
    total: 1250,
    today: 45,
    referrals: 32,
    active: 18,
    link: "https://ehb.com/ref/ehb-demo-admin",
    users: [
      { id: "1", name: "Ahmed", level: 1, earnings: 120, status: "Active" as const },
      { id: "2", name: "Sara", level: 2, earnings: 80, status: "Active" as const },
      { id: "3", name: "Bilal", level: 3, earnings: 40, status: "Dormant" as const },
    ],
    suggestions: ["Invite 5 more users to unlock +$50 bonus", "Top conversion category: services"],
  };
}

export async function GET() {
  const auth = await requireSession(["USER", "FRANCHISE", "ADMIN", "SUPER_ADMIN"]);
  if (!auth.ok) return ok(demoResponse());

  if (!process.env.DATABASE_URL) return ok(demoResponse());

  try {
    const [wallet, txns] = await Promise.all([
      prisma.wallet.findUnique({
        where: { userId: auth.user.userId },
        select: { affiliateIncome: true },
      }),
      prisma.transaction.findMany({
        where: { userId: auth.user.userId, type: "AFFILIATE" },
        orderBy: { createdAt: "desc" },
        take: 300,
        select: { id: true, amount: true, status: true, createdAt: true, referenceId: true },
      }),
    ]);

    const total = Number(wallet?.affiliateIncome ?? 0);
    const todayKey = new Date().toISOString().slice(0, 10);
    const today = txns
      .filter((t) => t.status === "COMPLETED" && t.createdAt.toISOString().slice(0, 10) === todayKey)
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const grouped = new Map<string, AffiliateUser>();
    for (const t of txns) {
      const ref = t.referenceId ?? "";
      if (!ref) continue;
      const key = ref.toLowerCase();
      const current = grouped.get(key);
      const amount = Number(t.amount);
      if (current) {
        current.earnings += amount;
      } else {
        grouped.set(key, {
          id: key,
          name: ref,
          level: ref.includes("L3") ? 3 : ref.includes("L2") ? 2 : 1,
          earnings: amount,
          status: t.status === "COMPLETED" ? "Active" : "Dormant",
        });
      }
    }

    const users = Array.from(grouped.values())
      .sort((a, b) => b.earnings - a.earnings)
      .slice(0, 30);
    const referrals = users.length;
    const active = users.filter((u) => u.status === "Active").length;

    return ok({
      total: Number(total.toFixed(2)),
      today: Number(today.toFixed(2)),
      referrals,
      active,
      link: `https://ehb.com/ref/${auth.user.userId}`,
      users,
      suggestions: [
        "Invite 5 more users to unlock +$50 bonus",
        active < referrals ? "Re-engage dormant referrals for network growth" : "Top category: services",
      ],
    });
  } catch {
    return ok(demoResponse());
  }
}

