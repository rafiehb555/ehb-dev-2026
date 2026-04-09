import { startStlAutomationJob } from "@/jobs/stl.job";

const task = startStlAutomationJob();
console.log("[stl-automation] cron started (*/5 * * * *)");

process.on("SIGINT", () => {
  task.stop();
  process.exit(0);
});

