import { test, expect } from "@playwright/test";

test.describe("Auth login rate limit", () => {
  test.describe.configure({ timeout: 120_000 });
  test.beforeAll(async ({ request }, testInfo) => {
    const res = await request.get("/api/health");
    const json = (await res.json()) as { db?: { ok?: boolean; skipped?: boolean } };
    const db = json.db;
    const dbReachable = Boolean(db && !("skipped" in db && db.skipped) && "ok" in db && db.ok);
    if (!dbReachable) {
      testInfo.skip(true, "DB must be reachable for login rate-limit e2e");
    }
  });

  test("shows cooldown after repeated failed logins", async ({ page, request }) => {
    const email = `e2e-rate-${Date.now()}@example.com`;
    await page.goto("/auth", { waitUntil: "domcontentloaded" });
    await expect(page.getByPlaceholder("Email")).toBeVisible();
    await page.getByPlaceholder("Email").fill(email);
    await page.getByPlaceholder("Password").fill("wrong-password-e2e");

    await request.post("/api/auth/login", {
      json: { email: "warmup@example.com", password: "x" },
    });

    await expect(page.getByTestId("auth-submit")).toBeVisible();

    const triggerSubmit = () =>
      page.getByTestId("auth-submit").evaluate((el) => {
        (el as HTMLButtonElement).click();
      });

    for (let i = 0; i < 8; i++) {
      const loginResPromise = page.waitForResponse(
        (r) => r.url().includes("/api/auth/login") && r.request().method() === "POST"
      );
      await triggerSubmit();
      const loginRes = await loginResPromise;
      expect(loginRes.status()).toBe(401);
      const body = (await loginRes.json()) as { error?: { message?: string } };
      expect(body?.error?.message).toMatch(/Invalid credentials/i);

      await expect(page.getByTestId("auth-error")).toBeVisible({ timeout: 15_000 });
      await expect(page.getByTestId("auth-error")).toContainText(/Invalid credentials|Request failed/i);
      await expect(page.getByTestId("auth-submit")).toBeEnabled({ timeout: 15_000 });
    }

    const ninth = page.waitForResponse(
      (r) => r.url().includes("/api/auth/login") && r.request().method() === "POST"
    );
    await triggerSubmit();
    const res429 = await ninth;
    expect(res429.status()).toBe(429);

    await expect(page.getByTestId("auth-submit")).toHaveText(/Retry in \d+s/, { timeout: 15_000 });
    await expect(page.getByText(/Too many attempts/i)).toBeVisible();
  });
});
