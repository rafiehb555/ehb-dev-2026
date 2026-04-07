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

const LOGIN_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const LOGIN_MAX_ATTEMPTS = 8;
const loginAttempts = new Map<string, { count: number; resetAt: number }>();

function clientIp(req: Request) {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]?.trim() || "unknown";
  return req.headers.get("x-real-ip") || "unknown";
}

function rateLimitKey(req: Request, email: string) {
  return `${clientIp(req)}|${email.toLowerCase()}`;
}

function isRateLimited(key: string, now: number) {
  const slot = loginAttempts.get(key);
  if (!slot) return false;
  if (now >= slot.resetAt) {
    loginAttempts.delete(key);
    return false;
  }
  return slot.count >= LOGIN_MAX_ATTEMPTS;
}

function markAttempt(key: string, now: number) {
  const slot = loginAttempts.get(key);
  if (!slot || now >= slot.resetAt) {
    loginAttempts.set(key, { count: 1, resetAt: now + LOGIN_WINDOW_MS });
    return;
  }
  slot.count += 1;
  loginAttempts.set(key, slot);
}

function clearAttempts(key: string) {
  loginAttempts.delete(key);
}

export async function POST(req: Request) {
  try {
    const body = LoginSchema.parse(await req.json());
    const now = Date.now();
    const key = rateLimitKey(req, body.email);
    if (isRateLimited(key, now)) {
      return fail(429, "RATE_LIMITED", "Too many login attempts. Try again in a few minutes.");
    }

    const user = await prisma.user.findUnique({
      where: { email: body.email },
      select: { id: true, role: true, passwordHash: true, email: true, name: true },
    });
    if (!user) {
      markAttempt(key, now);
      return fail(401, "UNAUTHORIZED", "Invalid credentials");
    }

    const passOk = await bcrypt.compare(body.password, user.passwordHash);
    if (!passOk) {
      markAttempt(key, now);
      return fail(401, "UNAUTHORIZED", "Invalid credentials");
    }

    clearAttempts(key);
    await createSessionCookie({ userId: user.id, role: user.role });
    return ok({ user: { id: user.id, role: user.role, email: user.email, name: user.name } });
  } catch (err) {
    return handleRouteError(err);
  }
}

