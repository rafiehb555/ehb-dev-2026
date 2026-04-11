import { describe, expect, it } from "vitest";
import { recommendAgentsForQuery } from "@/lib/agents/catalog";

describe("recommendAgentsForQuery", () => {
  it("routes trust-sensitive requests to trust systems", () => {
    const result = recommendAgentsForQuery("I want to change trust verification and approval logic");

    expect(result.primaryAgentId).toBe("trust-systems-agent");
    expect(result.supportingAgentIds).toContain("agent-governance-risk-agent");
  });

  it("falls back to orchestrator for unclear requests", () => {
    const result = recommendAgentsForQuery("help me decide");

    expect(result.primaryAgentId).toBe("ceo-orchestrator-agent");
    expect(result.supportingAgentIds).toContain("product-roadmap-agent");
  });
});
