import { mkdtemp, rm } from "node:fs/promises";
import * as path from "node:path";
import { tmpdir } from "node:os";

let currentDir: string | undefined;

export async function setupAgentRuntimeTestDir(): Promise<void> {
  currentDir = await mkdtemp(path.join(tmpdir(), "ehb-agents-"));
  process.env.EHB_AGENT_RUNTIME_DIR = currentDir;
}

export async function teardownAgentRuntimeTestDir(): Promise<void> {
  const d = currentDir;
  delete process.env.EHB_AGENT_RUNTIME_DIR;
  currentDir = undefined;
  if (d) {
    await rm(d, { recursive: true, force: true });
  }
}
