import { ok } from "@/lib/apiResponse";
import { getEhbStlMetaPayload } from "@/lib/dmo/ehbStlLevelContent";

const META_CACHE_HEADERS = {
  "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
};

/** Public reference bundle for EHB-STL-LEVEL (same data as `/dmo/ehb-stl-level`). */
export async function GET() {
  return ok(getEhbStlMetaPayload(), { headers: META_CACHE_HEADERS });
}
