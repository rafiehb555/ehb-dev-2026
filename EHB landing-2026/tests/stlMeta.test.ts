import { GET } from "@/app/api/stl/meta/route";
import { describe, expect, it } from "vitest";

describe("GET /api/stl/meta", () => {
  it("returns success with documentVersion, eight levels, and cache headers", async () => {
    const res = await GET();
    expect(res.status).toBe(200);
    const json = (await res.json()) as {
      success: boolean;
      data: { documentVersion: string; levels: { level: string }[]; formula: unknown[] };
    };
    expect(json.success).toBe(true);
    expect(json.data.documentVersion).toBe("8.0");
    expect(json.data.levels).toHaveLength(8);
    expect(json.data.levels.map((l) => l.level)).toEqual(["L1", "L2", "L3", "L4", "L5", "L6", "L7", "L8"]);
    expect(json.data.formula.length).toBeGreaterThan(0);
    const cc = res.headers.get("Cache-Control");
    expect(cc).toBeTruthy();
    expect(cc).toContain("public");
  });
});
