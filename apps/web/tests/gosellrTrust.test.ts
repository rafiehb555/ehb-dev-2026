import { GET } from "@/app/api/gosellr/trust/route";
import { describe, expect, it } from "vitest";

describe("GET /api/gosellr/trust", () => {
  it("returns stl with level, score, label, source for productId", async () => {
    const res = await GET(new Request("http://localhost/api/gosellr/trust?productId=cleanmaster-ai"));
    expect(res.status).toBe(200);
    const json = (await res.json()) as {
      success: boolean;
      data: {
        stl: { level: number; score: number; label: string; source: "db" | "synthetic" };
        trustScore: number;
      };
    };
    expect(json.success).toBe(true);
    expect(json.data.stl).toBeDefined();
    expect(json.data.stl.level).toBeGreaterThanOrEqual(1);
    expect(json.data.stl.level).toBeLessThanOrEqual(8);
    expect(json.data.stl.score).toBeGreaterThanOrEqual(0);
    expect(json.data.stl.score).toBeLessThanOrEqual(100);
    expect(json.data.stl.label.length).toBeGreaterThan(0);
    expect(["db", "synthetic"]).toContain(json.data.stl.source);
  });

  it("rejects when productId and sellerId missing", async () => {
    const res = await GET(new Request("http://localhost/api/gosellr/trust"));
    expect(res.status).toBe(400);
  });
});
