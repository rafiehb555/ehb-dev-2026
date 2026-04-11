import { ok } from "@/lib/apiResponse";
import { getJpsOverview } from "@/lib/jps/data";
import { getEffectiveJpsOverview } from "@/lib/jps/store";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return ok(await getEffectiveJpsOverview());
  } catch {
    return ok(getJpsOverview());
  }
}
