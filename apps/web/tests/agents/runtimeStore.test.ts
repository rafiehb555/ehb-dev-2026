import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { flatAgentDefinitions } from "@/lib/agents/catalog";
import {
  createAgentHandoff,
  getAgentRuntimeSummary,
  listAgentRuntimeHandoffs,
  listAgentRuntimeStatuses,
  resetAgentRuntimeStore,
  setAllAgentsToWorking,
  updateAgentRuntimeStatus,
} from "@/lib/agents/runtimeStore";
import { setupAgentRuntimeTestDir, teardownAgentRuntimeTestDir } from "./agentRuntimeTestEnv";

describe("agent runtime store", () => {
  beforeEach(async () => {
    await setupAgentRuntimeTestDir();
  });

  afterEach(async () => {
    await teardownAgentRuntimeTestDir();
  });

  it("updates runtime status and keeps live mode", async () => {
    await resetAgentRuntimeStore();

    const status = await updateAgentRuntimeStatus({
      agentId: "trust-systems-agent",
      status: "working",
      lastTask: "Reviewing trust wording",
      historyTitle: "Work resumed",
      historyDetail: "Trust review continued after clarification.",
    });

    expect(status.agentId).toBe("trust-systems-agent");
    expect(status.status).toBe("working");
    expect(status.mode).toBe("live");
  });

  it("creates handoffs and updates summary counters", async () => {
    await resetAgentRuntimeStore();

    await createAgentHandoff({
      fromAgentId: "ceo-orchestrator-agent",
      toAgentId: "product-roadmap-agent",
      requestSummary: "Plan next release phase",
      reason: "Need sequencing before implementation",
      expectedOutput: "Phased roadmap recommendation",
    });

    const handoffs = await listAgentRuntimeHandoffs();
    const summary = await getAgentRuntimeSummary();

    expect(handoffs.length).toBeGreaterThan(0);
    expect(summary.totalHandoffs).toBeGreaterThan(0);
    expect(summary.liveModeAgents).toBeGreaterThan(0);
  });

  it("sets all catalog agents to working", async () => {
    await resetAgentRuntimeStore();

    await setAllAgentsToWorking({ lastTask: "Bulk demo — all agents working" });

    const statuses = await listAgentRuntimeStatuses();
    expect(statuses.length).toBe(flatAgentDefinitions.length);
    for (const s of statuses) {
      expect(s.status).toBe("working");
      expect(s.lastTask).toContain("Bulk demo");
    }
  });
});
