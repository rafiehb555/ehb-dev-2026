import { z } from "zod";
import { runSTLUpgradeWorkflow } from "@/services/dmo-service/workflows/stl.workflow";
import { triggerAutomationEvent } from "@/services/dmo-service/automation/trigger";

const BodySchema = z.object({
  userId: z.string().min(8),
});

export async function upgradeSTLController(req: Request): Promise<Response> {
  try {
    const body = BodySchema.parse(await req.json());
    const result = await runSTLUpgradeWorkflow(body.userId);
    await triggerAutomationEvent("STL_CHECK", {
      userId: body.userId,
      pssVerified: result.success,
      crbPassed: result.success,
      balance: result.success ? 200 : 0,
      level: 1,
    });
    return Response.json(result);
  } catch {
    return Response.json({ success: false, message: "Workflow Controller Error" }, { status: 500 });
  }
}
