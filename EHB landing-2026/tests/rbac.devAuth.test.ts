import { afterEach, describe, expect, it, vi } from "vitest";
import { isDevSessionFallbackEnabled } from "@/lib/rbac";

describe("isDevSessionFallbackEnabled", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("is always false in production", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("EHB_DEV_AUTH_BYPASS", "true");
    expect(isDevSessionFallbackEnabled()).toBe(false);
  });

  it("is false when EHB_DEV_AUTH_BYPASS is false in development", () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("EHB_DEV_AUTH_BYPASS", "false");
    expect(isDevSessionFallbackEnabled()).toBe(false);
  });

  it("is false when EHB_DEV_AUTH_BYPASS is 0", () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("EHB_DEV_AUTH_BYPASS", "0");
    expect(isDevSessionFallbackEnabled()).toBe(false);
  });

  it("is true in development when EHB_DEV_AUTH_BYPASS is empty (not explicitly false)", () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("EHB_DEV_AUTH_BYPASS", "");
    expect(isDevSessionFallbackEnabled()).toBe(true);
  });
});
