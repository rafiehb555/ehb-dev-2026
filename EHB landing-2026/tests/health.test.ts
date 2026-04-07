import { describe, expect, it, vi } from "vitest";

describe("GET /api/health", () => {
  it("returns 200 with ok and db signal when ping succeeds", async () => {
    vi.resetModules();
    const connect = vi.fn(async () => undefined);
    const runCommand = vi.fn(async () => ({ ok: 1 }));
    vi.doMock("@/lib/prisma", () => ({
      prisma: { $connect: connect, $runCommandRaw: runCommand, user: { count: vi.fn(async () => 1) } },
    }));
    const { GET } = await import("@/app/api/health/route");

    const res = await GET(new Request("http://localhost/api/health"));
    expect(res.status).toBe(200);
    const json = (await res.json()) as {
      ok: boolean;
      service: string;
      timestamp: string;
      uptimeSec: number;
      gitSha?: string;
      db: { ok: boolean; latencyMs: number; error?: string };
    };
    expect(json.ok).toBe(true);
    expect(json.service).toBe("ehb-landing-demo");
    expect(json.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    expect(Number.isFinite(json.uptimeSec)).toBe(true);
    expect(json.uptimeSec).toBeGreaterThanOrEqual(0);
    expect(json.db.ok).toBe(true);
    expect(typeof json.db.latencyMs).toBe("number");
    expect(runCommand).toHaveBeenCalledWith({ ping: 1 });
  });

  it("returns 503 with error details when db check fails", async () => {
    vi.resetModules();
    const connect = vi.fn(async () => undefined);
    const runCommand = vi.fn(async () => {
      throw new Error("db unavailable");
    });
    vi.doMock("@/lib/prisma", () => ({
      prisma: { $connect: connect, $runCommandRaw: runCommand, user: { count: vi.fn(async () => 1) } },
    }));
    const { GET } = await import("@/app/api/health/route");

    const res = await GET(new Request("http://localhost/api/health"));
    expect(res.status).toBe(503);
    const json = (await res.json()) as {
      ok: boolean;
      service: string;
      timestamp: string;
      uptimeSec: number;
      db: { ok: boolean; latencyMs: number; error?: string };
    };
    expect(json.ok).toBe(false);
    expect(json.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    expect(json.uptimeSec).toBeGreaterThanOrEqual(0);
    expect(json.db.ok).toBe(false);
    expect(json.db.error).toContain("db unavailable");
  });

  it("returns 200 with liveness=1 without touching the database", async () => {
    vi.resetModules();
    const connect = vi.fn(async () => undefined);
    const runCommand = vi.fn(async () => ({ ok: 1 }));
    vi.doMock("@/lib/prisma", () => ({
      prisma: { $connect: connect, $runCommandRaw: runCommand, user: { count: vi.fn(async () => 1) } },
    }));
    const { GET } = await import("@/app/api/health/route");

    const res = await GET(new Request("http://localhost/api/health?liveness=1"));
    expect(res.status).toBe(200);
    const json = (await res.json()) as {
      ok: boolean;
      liveness: boolean;
      db: { skipped: boolean };
    };
    expect(json.ok).toBe(true);
    expect(json.liveness).toBe(true);
    expect(json.db.skipped).toBe(true);
    expect(connect).not.toHaveBeenCalled();
    expect(runCommand).not.toHaveBeenCalled();
  });

  it("treats liveness=true like liveness=1", async () => {
    vi.resetModules();
    const connect = vi.fn(async () => undefined);
    vi.doMock("@/lib/prisma", () => ({
      prisma: { $connect: connect, $runCommandRaw: vi.fn(), user: { count: vi.fn() } },
    }));
    const { GET } = await import("@/app/api/health/route");

    const res = await GET(new Request("http://localhost/api/health?liveness=true"));
    expect(res.status).toBe(200);
    expect(connect).not.toHaveBeenCalled();
  });

  it("uses user.count when $runCommandRaw is not available (PostgreSQL path)", async () => {
    vi.resetModules();
    const connect = vi.fn(async () => undefined);
    const count = vi.fn(async () => 0);
    vi.doMock("@/lib/prisma", () => ({
      prisma: { $connect: connect, user: { count } },
    }));
    const { GET } = await import("@/app/api/health/route");

    const res = await GET(new Request("http://localhost/api/health"));
    expect(res.status).toBe(200);
    expect(connect).toHaveBeenCalled();
    expect(count).toHaveBeenCalled();
    const json = (await res.json()) as { db: { ok: boolean } };
    expect(json.db.ok).toBe(true);
  });
});
