import cron from "node-cron";
import { prisma } from "@/lib/prisma";
import { buildStlFullSnapshot } from "@/lib/stl/fullSnapshot";
import { runAutomation } from "@/services/dmo-service/automation/automation.engine";

export function startStlAutomationJob() {
  return cron.schedule("*/5 * * * *", async () => {
    console.log("[stl-job] running STL automation...");
    const users = await prisma.user.findMany({
      take: 50,
      select: { id: true, role: true },
      orderBy: { createdAt: "desc" },
    });

    for (const user of users) {
      try {
        const snapshot = await buildStlFullSnapshot(user.id);
        await runAutomation("STL_CHECK", {
          userId: user.id,
          role: user.role,
          stl: snapshot.trustScore,
          pssVerified: snapshot.pss.kyc,
          crbPassed: snapshot.crb.examsPassed >= snapshot.crb.requiredExams,
          balance: 200,
          level: snapshot.stlLevel,
        });
      } catch (error) {
        console.error("[stl-job] user failed", user.id, error);
      }
    }
  });
}

