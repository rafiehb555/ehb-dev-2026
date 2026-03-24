import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createSessionCookie } from "@/lib/auth";
import { handleRouteError } from "@/lib/apiErrors";
import { fail, ok } from "@/lib/apiResponse";

const LoginSchema = z.object({
  email: z.string().email().max(120),
  password: z.string().min(1).max(200),
});

export async function POST(req: Request) {
  try {
    const body = LoginSchema.parse(await req.json());
    const user = await prisma.user.findUnique({
      where: { email: body.email },
      select: { id: true, role: true, passwordHash: true, email: true, name: true },
    });
    if (!user) return fail(401, "UNAUTHORIZED", "Invalid credentials");

    const passOk = await bcrypt.compare(body.password, user.passwordHash);
    if (!passOk) return fail(401, "UNAUTHORIZED", "Invalid credentials");

    await createSessionCookie({ userId: user.id, role: user.role });
    return ok({ user: { id: user.id, role: user.role, email: user.email, name: user.name } });
  } catch (err) {
    return handleRouteError(err);
  }
}

