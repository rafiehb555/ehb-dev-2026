/**
 * EHB STL Engine — Core Unit Test Suite (Phase 1 safety net).
 *
 * These tests lock in the current behavior of the STL calculation engine
 * using FIXED input → FIXED expected output assertions. They are deliberately
 * based on the actual implementation in:
 *   - services/stlService.js  (calculateSTL, getLevel, explainSTL, getStlBreakdown)
 *   - utils/level.utils.js    (getLevelFromScore, getLockLevel)
 *
 * Design notes:
 * 1. NO mocks of Mongo or external services. We only test pure functions.
 * 2. recalculateUserStl() is NOT unit-tested here because it calls
 *    analyzeUser() (AI service). A separate integration test can cover it
 *    with a stubbed analyzeUser — see TODO at bottom.
 * 3. The "fixed expected output" philosophy means: if any test fails after
 *    a future change, the engineer MUST consciously decide whether the
 *    change is intended. This protects the entire trust economy from
 *    silent regressions.
 *
 * Run with:
 *   npm test
 * or
 *   node --experimental-vm-modules node_modules/jest/bin/jest.js tests/stl
 */

import { describe, test, expect } from "@jest/globals";
import {
  calculateSTL,
  getLevel,
  explainSTL,
  getStlBreakdown,
} from "../../services/stlService.js";
import { getLevelFromScore, getLockLevel } from "../../utils/level.utils.js";

// =============================================================================
// SECTION 1 — Level threshold helpers (utils/level.utils.js)
// =============================================================================
// These thresholds are the literal source of truth for the 8-level ladder.
// If ANY of these break, the entire STL tier system is affected.

describe("getLevelFromScore — score-to-level ladder", () => {
  test.each([
    // [score, expectedLevel]
    [0, 1],
    [20, 1],
    [21, 2],
    [40, 2],
    [41, 3],
    [55, 3],
    [56, 4],
    [65, 4],
    [66, 5],
    [75, 5],
    [76, 6],
    [85, 6],
    [86, 7],
    [95, 7],
    [96, 8],
    [100, 8],
    // Edge: above 100 still returns 8 because implementation caps at "else return 8"
    [150, 8],
  ])("score %i → L%i", (score, expected) => {
    expect(getLevelFromScore(score)).toBe(expected);
  });

  test("null / undefined score behaves as 0 → L1", () => {
    expect(getLevelFromScore(null)).toBe(1);
    expect(getLevelFromScore(undefined)).toBe(1);
  });
});

describe("getLockLevel — lock-amount-to-level ladder", () => {
  test.each([
    [0, 1],
    [49, 1],
    [50, 2],
    [99, 2],
    [100, 3],
    [299, 3],
    [300, 4],
    [499, 4],
    [500, 5],
    [999, 5],
    [1000, 6],
    [2499, 6],
    [2500, 7],
    [4999, 7],
    [5000, 8],
    [10000, 8],
  ])("lockAmount %i → L%i", (lock, expected) => {
    expect(getLockLevel(lock)).toBe(expected);
  });

  test("negative lock amounts floor to 0 and return L1", () => {
    // Implementation does Number(amount || 0) and then checks >= comparisons.
    // Negative numbers don't match any rung and fall through to "return 1".
    expect(getLockLevel(-500)).toBe(1);
  });

  test("null / undefined lock amount → L1", () => {
    expect(getLockLevel(null)).toBe(1);
    expect(getLockLevel(undefined)).toBe(1);
  });
});

// =============================================================================
// SECTION 2 — calculateSTL (main engine)
// =============================================================================
// Algorithm (from services/stlService.js lines 16-29):
//   1. Clamp pss/crb/dmo to [0, 100].
//   2. avgScore = (pss + crb + dmo) / 3.
//   3. scoreLevel = getLevelFromScore(avgScore).
//   4. lockLevel = getLockLevel(lockAmount).
//   5. pssLevel = getLevelFromScore(pss), crbLevel, dmoLevel.
//   6. finalLevel = MIN of (scoreLevel, lockLevel, pssLevel, crbLevel, dmoLevel).
//   7. finalScore = Math.round((finalLevel / 8) * 100).

describe("calculateSTL — fixed-input → fixed-output", () => {
  test("Scenario 1: NORMAL user (all modules solid, decent lock)", () => {
    // pss=70, crb=70, dmo=70 → avg=70 → scoreLevel=L5
    // pssLevel=L5, crbLevel=L5, dmoLevel=L5
    // lock=500 → lockLevel=L5
    // min(L5, L5, L5, L5, L5) = L5 → round((5/8)*100) = 63
    const user = { pssScore: 70, crbScore: 70, dmoScore: 70, lockAmount: 500 };
    expect(calculateSTL(user)).toBe(63);
  });

  test("Scenario 2: HIGH COIN HOLDER but low activity", () => {
    // pss=30, crb=30, dmo=30 → avg=30 → scoreLevel=L2
    // pssLevel=L2, crbLevel=L2, dmoLevel=L2
    // lock=10000 → lockLevel=L8
    // min = L2 → round((2/8)*100) = 25
    // Proves: big lock DOES NOT rescue a user with weak module scores.
    const user = { pssScore: 30, crbScore: 30, dmoScore: 30, lockAmount: 10000 };
    expect(calculateSTL(user)).toBe(25);
  });

  test("Scenario 3: HIGH COMPLAINT / LOW PSS user (all else strong)", () => {
    // pss=10, crb=90, dmo=90 → avg=63.33 → scoreLevel=L4 (<=65)
    // pssLevel=L1 (<=20)
    // min = L1 → round((1/8)*100) = 13
    // Proves: a single weak module drags finalLevel to its floor.
    const user = { pssScore: 10, crbScore: 90, dmoScore: 90, lockAmount: 5000 };
    expect(calculateSTL(user)).toBe(13);
  });

  test("Scenario 4: MAX / TOP TIER user", () => {
    // pss=100, crb=100, dmo=100 → all L8
    // lock=5000 → L8
    // min = L8 → round((8/8)*100) = 100
    const user = { pssScore: 100, crbScore: 100, dmoScore: 100, lockAmount: 5000 };
    expect(calculateSTL(user)).toBe(100);
  });

  test("Scenario 5: ZERO / empty-data user (brand new signup)", () => {
    // pss=0, crb=0, dmo=0 → all L1
    // lock=0 → L1
    // min = L1 → round((1/8)*100) = 13
    const user = { pssScore: 0, crbScore: 0, dmoScore: 0, lockAmount: 0 };
    expect(calculateSTL(user)).toBe(13);
  });

  test("Scenario 6: LOCK MISMATCH — modules top-tier but lock too low", () => {
    // pss=100, crb=100, dmo=100 → L8/L8/L8
    // lock=50 → lockLevel=L2
    // min = L2 → round((2/8)*100) = 25
    // Proves: coin-lock ceiling correctly caps otherwise-perfect user.
    const user = { pssScore: 100, crbScore: 100, dmoScore: 100, lockAmount: 50 };
    expect(calculateSTL(user)).toBe(25);
  });

  test("Scenario 7: Clamp guard — input scores beyond [0, 100] do not break", () => {
    // 150 is clamped to 100 → L8; -20 clamped to 0 → L1
    // min pulled down by L1 crb
    const user = { pssScore: 150, crbScore: -20, dmoScore: 80, lockAmount: 1000 };
    // pss clamped to 100 → L8
    // crb clamped to 0 → L1
    // dmo = 80 → L6
    // avg = (100+0+80)/3 = 60 → L4
    // lock 1000 → L6
    // min(L4, L6, L8, L1, L6) = L1 → 13
    expect(calculateSTL(user)).toBe(13);
  });

  test("Scenario 8: Nested modules object (alternate shape)", () => {
    // Engine also reads user.modules.{pss|crb|dmo}.score as fallback
    const user = {
      modules: {
        pss: { score: 80 },
        crb: { score: 80 },
        dmo: { score: 80 },
      },
      lockAmount: 1500,
    };
    // all → L6, avg=80 → L6, lock=1500 → L6 → min=L6 → 75
    expect(calculateSTL(user)).toBe(75);
  });

  test("Scenario 9: Missing lockAmount defaults to 0 (L1 cap)", () => {
    const user = { pssScore: 90, crbScore: 90, dmoScore: 90 };
    // Level from each = L7, avg=90 → L7, but lock=0 → L1 → cap = L1 = 13
    expect(calculateSTL(user)).toBe(13);
  });

  test("Scenario 10: Result is always an integer in [0, 100]", () => {
    // Property-style smoke check — randomized fuzz across the legal space.
    for (let i = 0; i < 50; i++) {
      const user = {
        pssScore: Math.floor(Math.random() * 120) - 10, // -10..110 stresses clamp
        crbScore: Math.floor(Math.random() * 120) - 10,
        dmoScore: Math.floor(Math.random() * 120) - 10,
        lockAmount: Math.floor(Math.random() * 6000),
      };
      const result = calculateSTL(user);
      expect(Number.isInteger(result)).toBe(true);
      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThanOrEqual(100);
    }
  });
});

// =============================================================================
// SECTION 3 — getLevel (score → "L1".."L8" label)
// =============================================================================

describe("getLevel — score to label string", () => {
  test.each([
    [0, "L1"],
    [20, "L1"],
    [50, "L3"],
    [75, "L5"],
    [100, "L8"],
  ])("getLevel(%i) → %s", (score, label) => {
    expect(getLevel(score)).toBe(label);
  });
});

// =============================================================================
// SECTION 4 — explainSTL (human-readable reasons)
// =============================================================================

describe("explainSTL — reason generation", () => {
  test("returns no reasons for a clean user", () => {
    const user = {
      modules: {
        pss: { kycVerified: true, verificationPending: 0 },
        crb: { examsFailed: 0 },
        dmo: { activityLevel: "high" },
      },
    };
    expect(explainSTL(user)).toEqual([]);
  });

  test("flags unverified KYC", () => {
    const user = { modules: { pss: { kycVerified: false } } };
    expect(explainSTL(user)).toContain("KYC not verified");
  });

  test("flags failed exams", () => {
    const user = {
      modules: {
        pss: { kycVerified: true },
        crb: { examsFailed: 2 },
      },
    };
    expect(explainSTL(user)).toContain("Some exams failed");
  });

  test("flags pending verifications", () => {
    const user = {
      modules: {
        pss: { kycVerified: true, verificationPending: 3 },
      },
    };
    expect(explainSTL(user)).toContain("Pending verifications");
  });

  test("flags low activity", () => {
    const user = {
      modules: {
        pss: { kycVerified: true },
        dmo: { activityLevel: "low" },
      },
    };
    expect(explainSTL(user)).toContain("Low activity");
  });

  test("can return multiple reasons simultaneously", () => {
    const user = {
      modules: {
        pss: { kycVerified: false, verificationPending: 2 },
        crb: { examsFailed: 1 },
        dmo: { activityLevel: "low" },
      },
    };
    const reasons = explainSTL(user);
    expect(reasons.length).toBeGreaterThanOrEqual(4);
  });
});

// =============================================================================
// SECTION 5 — getStlBreakdown (dashboard data shape)
// =============================================================================

describe("getStlBreakdown — module-level report shape", () => {
  test("returns the expected top-level keys", () => {
    const user = {
      pssScore: 60,
      crbScore: 70,
      dmoScore: 80,
      lockAmount: 300,
      modules: {
        pss: { kycVerified: true, complaints: 0 },
        crb: { examsPassed: 3, examsFailed: 0 },
        dmo: { activityLevel: "medium" },
      },
    };
    const result = getStlBreakdown(user);
    expect(result).toHaveProperty("modules");
    expect(result).toHaveProperty("weakArea");
    expect(result.modules).toHaveProperty("pss");
    expect(result.modules).toHaveProperty("crb");
    expect(result.modules).toHaveProperty("dmo");
    expect(result.modules).toHaveProperty("lock");
  });

  test("identifies the lowest-scored core module as weakArea", () => {
    // pss is lowest here
    const user = {
      pssScore: 20,
      crbScore: 80,
      dmoScore: 80,
      lockAmount: 500,
    };
    expect(getStlBreakdown(user).weakArea).toBe("PSS");
  });

  test("reports lock level as label", () => {
    const user = { pssScore: 50, crbScore: 50, dmoScore: 50, lockAmount: 1000 };
    const { modules } = getStlBreakdown(user);
    expect(modules.lock.level).toBe("L6"); // 1000 → L6
    expect(modules.lock.amount).toBe(1000);
  });

  test("PSS level: unverified KYC → L1 Unverified", () => {
    const user = {
      pssScore: 80,
      modules: { pss: { kycVerified: false } },
    };
    const { modules } = getStlBreakdown(user);
    expect(modules.pss.level).toBe("L1");
    expect(modules.pss.name).toBe("Unverified");
  });

  test("CRB level: 3 passes, 0 fails → L5 Expert", () => {
    const user = {
      crbScore: 80,
      modules: { crb: { examsPassed: 3, examsFailed: 0 } },
    };
    const { modules } = getStlBreakdown(user);
    expect(modules.crb.level).toBe("L5");
    expect(modules.crb.name).toBe("Expert");
  });

  test("DMO level: high activity → L5 Elite", () => {
    const user = {
      dmoScore: 70,
      modules: { dmo: { activityLevel: "high" } },
    };
    const { modules } = getStlBreakdown(user);
    expect(modules.dmo.level).toBe("L5");
    expect(modules.dmo.name).toBe("Elite");
  });
});

// =============================================================================
// SECTION 6 — Regression guard (PHASE 1 baseline)
// =============================================================================
// These expected values are the "gold master" for 2026-04-11. If any CHANGES,
// the engineer must update this table INTENTIONALLY in a PR with explicit
// rationale in the commit message.

describe("REGRESSION GUARD — gold-master expected outputs", () => {
  const goldMaster = [
    { label: "Fresh signup", input: { pssScore: 0, crbScore: 0, dmoScore: 0, lockAmount: 0 }, expected: 13 },
    { label: "Bronze tier", input: { pssScore: 35, crbScore: 35, dmoScore: 35, lockAmount: 100 }, expected: 25 },
    { label: "Silver tier", input: { pssScore: 55, crbScore: 55, dmoScore: 55, lockAmount: 500 }, expected: 38 },
    { label: "Gold tier", input: { pssScore: 75, crbScore: 75, dmoScore: 75, lockAmount: 1000 }, expected: 63 },
    { label: "Platinum tier", input: { pssScore: 90, crbScore: 90, dmoScore: 90, lockAmount: 2500 }, expected: 88 },
    { label: "VIP tier", input: { pssScore: 100, crbScore: 100, dmoScore: 100, lockAmount: 5000 }, expected: 100 },
  ];

  test.each(goldMaster)("$label → STL $expected", ({ input, expected }) => {
    expect(calculateSTL(input)).toBe(expected);
  });
});

// =============================================================================
// TODO (Phase 2):
//  - Integration test for recalculateUserStl() with mocked analyzeUser.
//  - Multi-STL (user / seller / product / franchise) test suite.
//  - Snapshot tests for the AI adjustment reason text.
// =============================================================================
