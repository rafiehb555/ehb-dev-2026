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
    const password = "wrong-password-e2e";

    for (let i = 0; i < 8; i++) {
      const res = await request.post("/api/auth/login", {
        json: { email, password },
      });
      if (res.status() !== 401) {
        throw new Error(`login POST ${i + 1}: expected 401, got ${res.status()}: ${await res.text()}`);
      }
    }

    await page.goto("/auth", { waitUntil: "domcontentloaded" });
    await expect(page.getByPlaceholder("Email")).toBeVisible();
    await page.getByPlaceholder("Email").fill(email);
    await page.getByPlaceholder("Password").fill(password);
    await expect(page.getByPlaceholder("Email")).toHaveValue(email);
    await expect(page.getByPlaceholder("Password")).toHaveValue(password);

    const ninth = page.waitForResponse(
      (r) => r.url().includes("/api/auth/login") && r.request().method() === "POST"
    );
    await page.getByTestId("auth-submit").click();
    const loginRes = await ninth;
    expect(loginRes.status()).toBe(429);

    await expect(page.getByTestId("auth-submit")).toHaveText(/Retry in \d+s/, { timeout: 15_000 });
    await expect(page.getByText(/Too many attempts/i)).toBeVisible();
  });
});
