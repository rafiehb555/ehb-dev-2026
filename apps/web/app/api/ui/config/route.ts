import { ok } from "@/lib/apiResponse";
import { getSessionUser } from "@/lib/auth";
import { getUIConfig } from "@/lib/ai/uiEngine";
import { buildStlFullSnapshot } from "@/lib/stl/fullSnapshot";
import type { AppRole } from "@/types/user.types";

const DEMO_USER_ID = "demo-user";

export async function GET() {
  const session = await getSessionUser();
  const role = ((session?.role as string) ?? "USER") as AppRole;
  const userId = session?.userId ?? DEMO_USER_ID;

  const snapshot = await buildStlFullSnapshot(userId);
  const widgets = getUIConfig({ role, stl: snapshot.trustScore });

  return ok({
    userId,
    role,
    stl: snapshot.trustScore,
    ui: widgets,
  });
}

