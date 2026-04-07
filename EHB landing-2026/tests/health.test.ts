import { GET } from "@/app/api/health/route";
import { describe, expect, it } from "vitest";

describe("GET /api/health", () => {
  it("returns 200 with ok and service id", async () => {
    const res = await GET();
    expect(res.status).toBe(200);
    const json = (await res.json()) as { ok: boolean; service: string; gitSha?: string };
    expect(json.ok).toBe(true);
    expect(json.service).toBe("ehb-landing-demo");
  });
});
