import { upgradeSTLController } from "@/services/dmo-service/controllers/stl.controller";

export async function handleStlUpgradeRoute(req: Request): Promise<Response> {
  return upgradeSTLController(req);
}
