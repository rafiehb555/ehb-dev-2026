/**
 * Windows: free a TCP port so Next.js can bind (EADDRINUSE fix).
 * Usage: node scripts/kill-port.cjs 3000
 */
const { execSync } = require("child_process");

const port = process.argv[2] || "3000";

try {
  const out = execSync(`netstat -ano | findstr :${port}`, { encoding: "utf8" });
  const pids = new Set();
  for (const line of out.split("\n")) {
    if (!line.includes("LISTENING")) continue;
    const parts = line.trim().split(/\s+/);
    const pid = parts[parts.length - 1];
    if (/^\d+$/.test(pid)) pids.add(pid);
  }
  if (pids.size === 0) {
    console.log(`Port ${port}: no LISTENING process found.`);
    process.exit(0);
  }
  for (const pid of pids) {
    console.log(`Stopping process ${pid} on port ${port}...`);
    try {
      execSync(`taskkill /PID ${pid} /F`, { stdio: "inherit" });
    } catch {
      // ignore — may need admin or already gone
    }
  }
} catch {
  console.log(`Port ${port}: nothing to kill (or netstat findstr failed).`);
}
