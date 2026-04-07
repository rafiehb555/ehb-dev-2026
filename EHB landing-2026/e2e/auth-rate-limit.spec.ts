import { test, expect } from "@playwright/test";

/**
 * Exercises the client cooldown path when POST /api/auth/login returns 429
 * (same JSON shape as the real route). Does not depend on DB or in-memory counters.
 */
test.describe("Auth login 429 UI", () => {
  test.describe.configure({ timeout: 60_000 });

  test("shows cooldown when login returns 429", async ({ page }) => {
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
    await page.getByRole("heading", { name: "Auth Control Center" }).locator("..").getByRole("button", { name: "Login" }).click();
    await expect(page.getByTestId("auth-submit")).toHaveText(/Sign In/);
    await page.getByTestId("auth-email").fill("ui-e2e@example.com");
    await page.getByTestId("auth-password").fill("wrong-password-e2e");
    await expect(page.getByTestId("auth-email")).toHaveValue("ui-e2e@example.com");

    const loginPost = page.waitForRequest(
      (r) => r.url().includes("/api/auth/login") && r.method() === "POST",
      { timeout: 10_000 }
    );
    await page.getByTestId("auth-submit").click();
    await loginPost;

    await expect(page.getByTestId("auth-submit")).toHaveText(/Retry in 60s/, { timeout: 15_000 });
    await expect(page.getByText(/Too many attempts/i)).toBeVisible();
    await expect(page.getByTestId("auth-error")).toContainText(/Too many login attempts/i);
  });
});
