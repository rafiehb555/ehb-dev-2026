import { stlLevelChipClasses } from "@/lib/stl/chipTone";
import { describe, expect, it } from "vitest";

describe("stlLevelChipClasses", () => {
  it("maps L1–L5 to non-empty class strings", () => {
    for (const level of [1, 2, 3, 4, 5] as const) {
      const c = stlLevelChipClasses(level);
      expect(c.length).toBeGreaterThan(10);
      expect(c).toContain("border-");
    }
  });

  it("uses cooler tones for higher trust levels", () => {
    expect(stlLevelChipClasses(1)).toContain("rose");
    expect(stlLevelChipClasses(5)).toContain("emerald");
  });
});
