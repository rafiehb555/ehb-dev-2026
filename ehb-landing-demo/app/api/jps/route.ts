import { ok } from "@/lib/apiResponse";
import { getEffectiveJpsOverview } from "@/lib/jps/store";

export async function GET() {
  return ok(await getEffectiveJpsOverview());
}
