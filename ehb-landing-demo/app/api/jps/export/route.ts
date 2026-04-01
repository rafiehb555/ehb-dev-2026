import { NextResponse } from "next/server";
import { fail } from "@/lib/apiResponse";
import { requireSession } from "@/lib/rbac";
import { getEffectiveJpsOverview, readJpsOverride } from "@/lib/jps/store";

export async function GET() {
  const auth = await requireSession(["ADMIN", "SUPER_ADMIN"]);
  if (!auth.ok) return fail(auth.status, "AUTH", auth.error);

  const imported = await readJpsOverride();
  const overview = imported ?? (await getEffectiveJpsOverview());
  const source = imported ? "imported" : "fallback";
  const timestamp = new Date().toISOString().slice(0, 10);

  return new NextResponse(JSON.stringify(overview, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="ehb-jps-${source}-${timestamp}.json"`,
      "Cache-Control": "no-store",
      "X-Jps-Export-Source": source,
    },
  });
}
