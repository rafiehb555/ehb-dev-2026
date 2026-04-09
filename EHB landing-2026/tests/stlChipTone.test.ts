import { stlLevelChipClasses } from "@/lib/stl/chipTone";
import { describe, expect, it } from "vitest";

describe("stlLevelChipClasses", () => {
  it("maps L1–L8 to non-empty class strings", () => {
    for (const level of [1, 2, 3, 4, 5, 6, 7, 8] as const) {
      const c = stlLevelChipClasses(level);
      expect(c.length).toBeGreaterThan(10);
      expect(c).toContain("border-");
    }
  });

  it("uses distinct tones across the scale", () => {
    expect(stlLevelChipClasses(1)).toContain("rose");
    expect(stlLevelChipClasses(8)).toContain("amber");
  });
});
