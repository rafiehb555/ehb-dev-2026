import { prisma } from "@/lib/prisma";
import { ok } from "@/lib/apiResponse";
import { requireSession } from "@/lib/rbac";
import { z } from "zod";
import { buildReferralCode, readAffiliateStore, writeAffiliateStore } from "@/lib/affiliate/store";

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
    const [wallet, txns, store, user, stlScore] = await Promise.all([
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
      readAffiliateStore(),
      prisma.user.findUnique({ where: { id: auth.user.userId }, select: { name: true } }),
      prisma.sTLScore.findUnique({
        where: { entityType_entityId: { entityType: "USER", entityId: auth.user.userId } },
        select: { level: true },
      }),
    ]);

    const total = Number(wallet?.affiliateIncome ?? 0);
    const todayKey = new Date().toISOString().slice(0, 10);
    const monthKey = new Date().toISOString().slice(0, 7);
    const today = txns
      .filter((t) => t.status === "COMPLETED" && t.createdAt.toISOString().slice(0, 10) === todayKey)
      .reduce((sum, t) => sum + Number(t.amount), 0);
    const month = txns
      .filter((t) => t.status === "COMPLETED" && t.createdAt.toISOString().slice(0, 7) === monthKey)
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
    const directReferrals = Object.entries(store.referredBy)
      .filter(([, referrerId]) => referrerId === auth.user.userId)
      .map(([uid]) => uid);
    const referrals = directReferrals.length;
    const active = users.filter((u) => u.status === "Active").length;
    const code = store.referralCodes[auth.user.userId] ?? buildReferralCode(user?.name ?? "EHB", auth.user.userId);
    const level = Number(stlScore?.level ?? 1);
    const commissionRate = level >= 7 ? 15 : level >= 6 ? 12 : level >= 5 ? 10 : 8;

    return ok({
      total: Number(total.toFixed(2)),
      today: Number(today.toFixed(2)),
      month: Number(month.toFixed(2)),
      stlLevel: level,
      commissionRate,
      referrals,
      active,
      referralCode: code,
      referredBy: store.referredBy[auth.user.userId] ?? null,
      link: `https://ehb.com/signup?ref=${code}`,
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

const BodySchema = z.object({
  action: z.enum(["GENERATE_LINK", "RECORD_COMMISSION"]),
  fromUser: z.string().optional(),
  amount: z.number().positive().optional(),
  type: z.string().optional(),
});

export async function POST(req: Request) {
  const auth = await requireSession(["USER", "FRANCHISE", "ADMIN", "SUPER_ADMIN"]);
  if (!auth.ok) return ok({ success: false, message: auth.error });

  try {
    const body = BodySchema.parse(await req.json());
    const store = await readAffiliateStore();
    const me = await prisma.user.findUnique({ where: { id: auth.user.userId }, select: { name: true } });
    const code = buildReferralCode(me?.name ?? "EHB", auth.user.userId);
    store.referralCodes[auth.user.userId] = code;

    if (body.action === "RECORD_COMMISSION" && body.fromUser && body.amount && body.type) {
      const canRecord = auth.user.role === "ADMIN" || auth.user.role === "SUPER_ADMIN";
      if (!canRecord) return ok({ success: false, message: "Only admin can record commissions" });
      store.commissions.push({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        userId: auth.user.userId,
        fromUser: body.fromUser,
        amount: body.amount,
        type: body.type,
        createdAt: new Date().toISOString(),
      });
      await prisma.wallet.upsert({
        where: { userId: auth.user.userId },
        create: { userId: auth.user.userId, affiliateIncome: body.amount },
        update: { affiliateIncome: { increment: body.amount } },
      });
      await prisma.transaction.create({
        data: {
          userId: auth.user.userId,
          amount: body.amount,
          type: "AFFILIATE",
          status: "COMPLETED",
          referenceId: body.fromUser,
        },
      });
    }

    await writeAffiliateStore(store, auth.user.userId);
    return ok({ success: true, referralCode: code, link: `https://ehb.com/signup?ref=${code}` });
  } catch (err) {
    return ok({ success: false, message: err instanceof Error ? err.message : "Failed to process affiliate action" });
  }
}

