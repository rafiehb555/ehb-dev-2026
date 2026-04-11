import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/rbac", () => ({
  requireSession: async () => ({
    ok: true as const,
    user: { userId: "vitest-admin", role: "SUPER_ADMIN" as const },
  }),
}));

import { GET as getRuntime, POST as postRuntime } from "@/app/api/agents/runtime/route";
import { GET as getAgentDetail } from "@/app/api/agents/[agentId]/route";
import { GET as getAgentHistory } from "@/app/api/agents/history/[agentId]/route";
import {
  createAgentHandoff,
  listAgentRuntimeHandoffs,
  resetAgentRuntimeStore,
  updateAgentRuntimeStatus,
} from "@/lib/agents/runtimeStore";
import { setupAgentRuntimeTestDir, teardownAgentRuntimeTestDir } from "./agentRuntimeTestEnv";

describe("agent runtime api routes", () => {
  beforeEach(async () => {
    await setupAgentRuntimeTestDir();
    await resetAgentRuntimeStore();
  });

  afterEach(async () => {
    await teardownAgentRuntimeTestDir();
  });

  it("returns runtime status payload", async () => {
    const response = await getRuntime();
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json.success).toBe(true);
    expect(Array.isArray(json.data.statuses)).toBe(true);
  });

  it("creates a handoff through runtime store flow used by the route", async () => {
    const handoff = await createAgentHandoff({
      fromAgentId: "ceo-orchestrator-agent",
      toAgentId: "product-roadmap-agent",
      requestSummary: "Plan the next phase",
      reason: "Need sequence confirmation",
      expectedOutput: "A staged plan",
    });

    expect(handoff.toAgentId).toBe("product-roadmap-agent");
    expect(handoff.status).toBe("accepted");
  });

  it("returns enriched detail and history payloads", async () => {
    const detailResponse = await getAgentDetail(new Request("http://localhost:3000/api/agents/trust-systems-agent"), {
      params: { agentId: "trust-systems-agent" },
    });
    const historyResponse = await getAgentHistory(new Request("http://localhost:3000/api/agents/history/trust-systems-agent"), {
      params: { agentId: "trust-systems-agent" },
    });

    const detailJson = await detailResponse.json();
    const historyJson = await historyResponse.json();

    expect(detailResponse.status).toBe(200);
    expect(historyResponse.status).toBe(200);
    expect(Array.isArray(detailJson.data.runtimeHistory)).toBe(true);
    expect(Array.isArray(historyJson.data.history)).toBe(true);
  });

  it("POST completes a handoff", async () => {
    const handoff = await createAgentHandoff({
      fromAgentId: "ceo-orchestrator-agent",
      toAgentId: "product-roadmap-agent",
      requestSummary: "Plan coordination",
      reason: "Test complete",
      expectedOutput: "Done marker",
    });

    const response = await postRuntime(
      new Request("http://localhost/api/agents/runtime", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "complete-handoff", handoffId: handoff.id }),
      }),
    );
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json.success).toBe(true);
    const updated = (await listAgentRuntimeHandoffs()).find((item) => item.id === handoff.id);
    expect(updated?.status).toBe("completed");
  });

  it("POST resets runtime store", async () => {
    await updateAgentRuntimeStatus({
      agentId: "trust-systems-agent",
      status: "blocked",
      lastTask: "Temporary blocked state for reset test",
      historyTitle: "Reset test",
      historyDetail: "Seeding non-default data before reset.",
    });

    const response = await postRuntime(
      new Request("http://localhost/api/agents/runtime", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reset-runtime" }),
      }),
    );
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json.success).toBe(true);
    expect(Array.isArray(json.data.snapshot.statuses)).toBe(true);
  });

  it("POST sets all agents to working", async () => {
    const response = await postRuntime(
      new Request("http://localhost/api/agents/runtime", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "set-all-working", lastTask: "API bulk working test line here" }),
      }),
    );
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json.success).toBe(true);
    const statuses = json.data.snapshot.statuses as { status: string }[];
    expect(statuses.every((s) => s.status === "working")).toBe(true);
  });
});
