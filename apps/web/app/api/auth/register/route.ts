import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createSessionCookie } from "@/lib/auth";
import { handleRouteError } from "@/lib/apiErrors";
import { fail, ok } from "@/lib/apiResponse";
import { buildReferralCode, readAffiliateStore, writeAffiliateStore } from "@/lib/affiliate/store";

const RegisterSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email().max(120),
  password: z.string().min(8).max(200),
  role: z.enum(["USER", "ADMIN", "SUPER_ADMIN", "FRANCHISE"]).optional(),
  referralCode: z.string().min(3).max(32).optional(),
});

export async function POST(req: Request) {
  try {
    const body = RegisterSchema.parse(await req.json());
    const existing = await prisma.user.findUnique({ where: { email: body.email } });
    if (existing) return fail(409, "CONFLICT", "Email already in use");

    const passwordHash = await bcrypt.hash(body.password, 12);
    const user = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        passwordHash,
        role: body.role ?? "USER",
      },
      select: { id: true, role: true, email: true, name: true },
    });

    const store = await readAffiliateStore();
    const ownCode = buildReferralCode(user.name, user.id);
    store.referralCodes[user.id] = ownCode;
    if (body.referralCode) {
      const code = body.referralCode.trim().toUpperCase();
      const referrerUserId = Object.entries(store.referralCodes).find(([, v]) => v.toUpperCase() === code)?.[0];
      if (referrerUserId && referrerUserId !== user.id) {
        store.referredBy[user.id] = referrerUserId;
      }
    }
    await writeAffiliateStore(store, user.id);

    await createSessionCookie({ userId: user.id, role: user.role });
    return ok({ user });
  } catch (err) {
    return handleRouteError(err);
  }
}

