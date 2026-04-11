import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { ok } from "@/lib/apiResponse";
import { getDemoMeUser, isDmoDemoMode } from "@/lib/dmo/demoStore";

export async function GET() {
  const session = await getSessionUser();
  if (!session) {
    if (isDmoDemoMode()) return ok({ user: getDemoMeUser() });
    return ok({ user: null });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { id: true, email: true, name: true, role: true, createdAt: true },
  });
  return ok({ user });
}

