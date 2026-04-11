import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/rbac";
import { fail, ok } from "@/lib/apiResponse";
import { handleRouteError } from "@/lib/apiErrors";
import { isDmoDemoMode, listDemoAssignableUsers } from "@/lib/dmo/demoStore";

export async function GET() {
  const auth = await requireSession(["FRANCHISE", "ADMIN", "SUPER_ADMIN"]);
  if (!auth.ok) return fail(auth.status, "AUTH", auth.error);

  try {
    if (isDmoDemoMode()) {
      return ok({ users: listDemoAssignableUsers() });
    }

    const users = await prisma.user.findMany({
      where: { role: { in: ["FRANCHISE", "ADMIN", "SUPER_ADMIN"] } },
      select: { id: true, name: true, email: true, role: true },
      take: 100,
      orderBy: { createdAt: "desc" },
    });
    return ok({ users });
  } catch (err) {
    return handleRouteError(err);
  }
}

