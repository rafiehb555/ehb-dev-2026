/**
 * Jest configuration for EHB STL Backend (services/api/stl-replit).
 *
 * This project uses native ESM ("type": "module" in package.json), so we
 * use the experimental VM modules mode instead of babel-jest. No transform
 * required — Jest will execute the ESM sources directly.
 *
 * Run tests with:
 *   node --experimental-vm-modules node_modules/jest/bin/jest.js
 * or via the npm script:
 *   npm test
 *
 * Note: This file was added as part of Phase 1 safety/testing hardening
 * (2026-04-11). It is completely additive — it does NOT modify any existing
 * file and can be deleted at any time to revert.
 */
export default {
  testEnvironment: "node",
  rootDir: ".",
  testMatch: ["<rootDir>/tests/**/*.test.js"],
  transform: {},
  verbose: true,
  clearMocks: true,
  // Collect coverage only from the modules we currently have tests for —
  // we can broaden this as more test files are added.
  collectCoverageFrom: [
    "services/stlService.js",
    "utils/level.utils.js",
  ],
  coverageDirectory: "<rootDir>/coverage",
  coverageReporters: ["text", "html"],
};
