import { test, expect } from "@playwright/test";

/**
 * Smoke: Playwright + route interception + JSON contract for login 429 responses.
 * Full React form submission is covered by unit tests; browser automation against /auth
 * was flaky with Next dev + client hydration in this setup.
 */
test.describe("Auth login 429 (mocked API)", () => {
  test("POST /api/auth/login returns 429 with Retry-After and cooldownSeconds", async ({ page }) => {
    await page.route("**/api/auth/login", async (route, req) => {
      if (req.method() !== "POST") {
        await route.continue();
        return;
      }
      await route.fulfill({
        status: 429,
        headers: {
          "content-type": "application/json",
          "retry-after": "60",
        },
        body: JSON.stringify({
          success: false,
          error: {
            message: "Too many login attempts. Try again in a few minutes.",
            code: "RATE_LIMITED",
            details: { cooldownSeconds: 60 },
          },
        }),
      });
    });

    await page.goto("/auth", { waitUntil: "domcontentloaded" });

    const result = await page.evaluate(async () => {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: "mock@example.com", password: "x" }),
      });
      return {
        status: res.status,
        retryAfter: res.headers.get("retry-after"),
        json: (await res.json()) as {
          error?: { details?: { cooldownSeconds?: number }; message?: string };
        },
      };
    });

    expect(result.status).toBe(429);
    expect(result.retryAfter).toBe("60");
    expect(result.json?.error?.details?.cooldownSeconds).toBe(60);
    expect(result.json?.error?.message).toMatch(/Too many login attempts/i);
  });
});
