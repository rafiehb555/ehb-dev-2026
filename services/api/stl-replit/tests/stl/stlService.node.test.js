/**
 * EHB STL Engine — Zero-Dependency Test Suite.
 *
 * This is a Node built-in test runner version of stlService.test.js.
 * Runs with ZERO npm install required — only Node 18+ needed.
 *
 * Run locally:
 *   cd services/api/stl-replit
 *   node --test tests/stl/stlService.node.test.js
 *
 * Or (runs both this file and any other node:test files under tests/):
 *   node --test tests/
 *
 * Why two test files?
 *   - stlService.test.js  → full Jest suite (richer reporting, coverage)
 *   - stlService.node.test.js → fallback that runs anywhere without installs
 *
 * Both files assert the SAME gold-master values — if one starts failing,
 * the other will too, giving us double regression protection.
 */

import { describe, test } from "node:test";
import assert from "node:assert/strict";
import {
  calculateSTL,
  getLevel,
  explainSTL,
  getStlBreakdown,
} from "../../services/stlService.js";
import { getLevelFromScore, getLockLevel } from "../../utils/level.utils.js";

// -----------------------------------------------------------------------------
// 1. Score → Level ladder
// -----------------------------------------------------------------------------
describe("getLevelFromScore", () => {
  const cases = [
    [0, 1], [20, 1], [21, 2], [40, 2], [41, 3], [55, 3],
    [56, 4], [65, 4], [66, 5], [75, 5], [76, 6], [85, 6],
    [86, 7], [95, 7], [96, 8], [100, 8],
  ];
  for (const [score, expected] of cases) {
    test(`score ${score} → L${expected}`, () => {
      assert.equal(getLevelFromScore(score), expected);
    });
  }
});

// -----------------------------------------------------------------------------
// 2. Lock → Level ladder
// -----------------------------------------------------------------------------
describe("getLockLevel", () => {
  const cases = [
    [0, 1], [49, 1], [50, 2], [99, 2], [100, 3], [299, 3],
    [300, 4], [499, 4], [500, 5], [999, 5], [1000, 6],
    [2499, 6], [2500, 7], [4999, 7], [5000, 8],
  ];
  for (const [lock, expected] of cases) {
    test(`lock ${lock} → L${expected}`, () => {
      assert.equal(getLockLevel(lock), expected);
    });
  }
});

// -----------------------------------------------------------------------------
// 3. Core STL calculation (fixed-input → fixed-output)
// -----------------------------------------------------------------------------
describe("calculateSTL — core scenarios", () => {
  test("Normal user (all 70, lock 500) → 63", () => {
    assert.equal(calculateSTL({ pssScore: 70, crbScore: 70, dmoScore: 70, lockAmount: 500 }), 63);
  });

  test("High lock but weak modules (all 30, lock 10000) → 25", () => {
    assert.equal(calculateSTL({ pssScore: 30, crbScore: 30, dmoScore: 30, lockAmount: 10000 }), 25);
  });

  test("Low PSS drags everything (pss 10, crb 90, dmo 90) → 13", () => {
    assert.equal(calculateSTL({ pssScore: 10, crbScore: 90, dmoScore: 90, lockAmount: 5000 }), 13);
  });

  test("Max tier (all 100, lock 5000) → 100", () => {
    assert.equal(calculateSTL({ pssScore: 100, crbScore: 100, dmoScore: 100, lockAmount: 5000 }), 100);
  });

  test("Fresh signup (all 0, lock 0) → 13", () => {
    assert.equal(calculateSTL({ pssScore: 0, crbScore: 0, dmoScore: 0, lockAmount: 0 }), 13);
  });

  test("Lock mismatch (all 100 but lock 50) → 25", () => {
    assert.equal(calculateSTL({ pssScore: 100, crbScore: 100, dmoScore: 100, lockAmount: 50 }), 25);
  });

  test("Clamp guard (pss 150, crb -20, dmo 80, lock 1000) → 13", () => {
    assert.equal(calculateSTL({ pssScore: 150, crbScore: -20, dmoScore: 80, lockAmount: 1000 }), 13);
  });

  test("Nested modules fallback (modules.*.score) works", () => {
    const user = {
      modules: { pss: { score: 80 }, crb: { score: 80 }, dmo: { score: 80 } },
      lockAmount: 1500,
    };
    assert.equal(calculateSTL(user), 75);
  });

  test("Missing lockAmount defaults to 0 (L1 cap)", () => {
    assert.equal(calculateSTL({ pssScore: 90, crbScore: 90, dmoScore: 90 }), 13);
  });

  test("Result is always integer in [0, 100]", () => {
    for (let i = 0; i < 50; i++) {
      const user = {
        pssScore: Math.floor(Math.random() * 120) - 10,
        crbScore: Math.floor(Math.random() * 120) - 10,
        dmoScore: Math.floor(Math.random() * 120) - 10,
        lockAmount: Math.floor(Math.random() * 6000),
      };
      const result = calculateSTL(user);
      assert.equal(Number.isInteger(result), true);
      assert.ok(result >= 0 && result <= 100, `Result ${result} out of range`);
    }
  });
});

// -----------------------------------------------------------------------------
// 4. Regression guard (gold-master baseline — 2026-04-11)
// -----------------------------------------------------------------------------
describe("GOLD MASTER — do not change without conscious PR", () => {
  const goldMaster = [
    ["Fresh signup", { pssScore: 0, crbScore: 0, dmoScore: 0, lockAmount: 0 }, 13],
    ["Bronze", { pssScore: 35, crbScore: 35, dmoScore: 35, lockAmount: 100 }, 25],
    ["Silver", { pssScore: 55, crbScore: 55, dmoScore: 55, lockAmount: 500 }, 38],
    ["Gold", { pssScore: 75, crbScore: 75, dmoScore: 75, lockAmount: 1000 }, 63],
    ["Platinum", { pssScore: 90, crbScore: 90, dmoScore: 90, lockAmount: 2500 }, 88],
    ["VIP", { pssScore: 100, crbScore: 100, dmoScore: 100, lockAmount: 5000 }, 100],
  ];
  for (const [label, input, expected] of goldMaster) {
    test(`${label} → ${expected}`, () => {
      assert.equal(calculateSTL(input), expected);
    });
  }
});

// -----------------------------------------------------------------------------
// 5. Labels & explanations
// -----------------------------------------------------------------------------
describe("getLevel — label generation", () => {
  const cases = [[0, "L1"], [20, "L1"], [50, "L3"], [75, "L5"], [100, "L8"]];
  for (const [score, label] of cases) {
    test(`getLevel(${score}) → ${label}`, () => {
      assert.equal(getLevel(score), label);
    });
  }
});

describe("explainSTL — reason flags", () => {
  test("clean user has no reasons", () => {
    const user = {
      modules: {
        pss: { kycVerified: true, verificationPending: 0 },
        crb: { examsFailed: 0 },
        dmo: { activityLevel: "high" },
      },
    };
    assert.deepEqual(explainSTL(user), []);
  });

  test("unverified KYC flagged", () => {
    assert.ok(explainSTL({ modules: { pss: { kycVerified: false } } }).includes("KYC not verified"));
  });

  test("failed exams flagged", () => {
    const user = { modules: { pss: { kycVerified: true }, crb: { examsFailed: 2 } } };
    assert.ok(explainSTL(user).includes("Some exams failed"));
  });

  test("low activity flagged", () => {
    const user = { modules: { pss: { kycVerified: true }, dmo: { activityLevel: "low" } } };
    assert.ok(explainSTL(user).includes("Low activity"));
  });
});

describe("getStlBreakdown — dashboard shape", () => {
  test("identifies weakArea as the lowest module", () => {
    const user = { pssScore: 20, crbScore: 80, dmoScore: 80, lockAmount: 500 };
    assert.equal(getStlBreakdown(user).weakArea, "PSS");
  });

  test("reports correct lock level label", () => {
    const result = getStlBreakdown({ pssScore: 50, crbScore: 50, dmoScore: 50, lockAmount: 1000 });
    assert.equal(result.modules.lock.level, "L6");
    assert.equal(result.modules.lock.amount, 1000);
  });
});
