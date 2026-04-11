import { beforeEach, describe, expect, it, vi } from "vitest";

type MockSetup = {
  findUser?: boolean;
  passwordOkSequence?: boolean[];
};

async function loadPostHandler(setup: MockSetup = {}) {
  vi.resetModules();

  const compareQueue = [...(setup.passwordOkSequence ?? [false])];
  const compareMock = vi.fn(async () => (compareQueue.length ? compareQueue.shift()! : false));
  const findUniqueMock = vi.fn(async () => {
    if (!setup.findUser) return null;
    return {
      id: "u-1",
      role: "USER",
      passwordHash: "hash",
      email: "demo@ehb.local",
      name: "Demo User",
    };
  });
  const createSessionCookieMock = vi.fn(async () => undefined);

  vi.doMock("@/lib/prisma", () => ({
    prisma: {
      user: { findUnique: findUniqueMock },
    },
  }));
  vi.doMock("bcryptjs", () => ({ default: { compare: compareMock } }));
  vi.doMock("@/lib/auth", () => ({ createSessionCookie: createSessionCookieMock }));

  const route = await import("@/app/api/auth/login/route");
  return {
    POST: route.POST,
    mocks: { compareMock, findUniqueMock, createSessionCookieMock },
  };
}

describe("POST /api/auth/login rate limit", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 429 after repeated failed attempts in same window", async () => {
    const { POST } = await loadPostHandler({ findUser: true, passwordOkSequence: Array(20).fill(false) });

    const statuses: number[] = [];
    let last: Response | null = null;
    for (let i = 0; i < 9; i++) {
      const res = await POST(
        new Request("http://localhost/api/auth/login", {
          method: "POST",
          headers: { "content-type": "application/json", "x-forwarded-for": "10.10.10.10" },
          body: JSON.stringify({ email: "demo@ehb.local", password: "wrong-pass" }),
        })
      );
      statuses.push(res.status);
      last = res;
    }

    expect(statuses.slice(0, 8).every((s) => s === 401)).toBe(true);
    expect(statuses[8]).toBe(429);
    const retryAfter = last?.headers.get("Retry-After");
    expect(retryAfter).toMatch(/^\d+$/);
    const payload = await last?.json();
    expect(payload?.error?.details?.cooldownSeconds).toBe(Number(retryAfter));
  });

  it("clears failed attempts after successful login", async () => {
    const { POST, mocks } = await loadPostHandler({
      findUser: true,
      passwordOkSequence: [false, false, true, false],
    });

    const headers = { "content-type": "application/json", "x-forwarded-for": "10.10.10.11" };
    const body = JSON.stringify({ email: "demo@ehb.local", password: "pass" });

    const fail1 = await POST(new Request("http://localhost/api/auth/login", { method: "POST", headers, body }));
    const fail2 = await POST(new Request("http://localhost/api/auth/login", { method: "POST", headers, body }));
    const ok = await POST(new Request("http://localhost/api/auth/login", { method: "POST", headers, body }));
    const failAfterSuccess = await POST(new Request("http://localhost/api/auth/login", { method: "POST", headers, body }));

    expect(fail1.status).toBe(401);
    expect(fail2.status).toBe(401);
    expect(ok.status).toBe(200);
    expect(failAfterSuccess.status).toBe(401);
    expect(fail1.headers.get("Retry-After")).toBeNull();
    expect(fail2.headers.get("Retry-After")).toBeNull();
    expect(failAfterSuccess.headers.get("Retry-After")).toBeNull();
    expect(mocks.createSessionCookieMock).toHaveBeenCalledTimes(1);
  });
});

