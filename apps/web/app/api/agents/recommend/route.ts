import { fail, ok } from "@/lib/apiResponse";
import { recommendAgentsForQuery } from "@/lib/agents/catalog";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const query = (url.searchParams.get("q") ?? "").trim();

  if (!query) {
    return fail(400, "QUERY_REQUIRED", "Provide a query using the q parameter.");
  }

  return ok(recommendAgentsForQuery(query));
}
