import { describe, expect, it } from "vitest";
import { resolveStlLevelFromScoreAndDb } from "@/lib/stl/engine";

describe("resolveStlLevelFromScoreAndDb", () => {
  it("returns null when score is missing", () => {
    expect(resolveStlLevelFromScoreAndDb(null, 3)).toBeNull();
    expect(resolveStlLevelFromScoreAndDb(undefined, 2)).toBeNull();
  });

  it("prefers DB level when valid", () => {
    expect(resolveStlLevelFromScoreAndDb(50, 4)).toBe(4);
  });

  it("derives level from score when DB level is null", () => {
    expect(resolveStlLevelFromScoreAndDb(85, null)).toBe(4);
    expect(resolveStlLevelFromScoreAndDb(92, undefined)).toBe(5);
  });
});
