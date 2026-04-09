import { getSTLFromService } from "@/services/dmo-service/connectors/stl.connector";
import { getPSSStatus } from "@/services/dmo-service/connectors/pss.connector";
import { processPayment } from "@/services/dmo-service/connectors/payment.connector";
import { runAIBrain } from "@/services/dmo-service/ai/ai.engine";

export type StlUpgradeWorkflowResult = {
  success: boolean;
  message: string;
  data?: unknown;
};

export async function runSTLUpgradeWorkflow(userId: string): Promise<StlUpgradeWorkflowResult> {
  try {
    // 1) PSS verification gate
    const pss = await getPSSStatus(userId);
    if (!pss.verified) {
      return { success: false, message: pss.reason ?? "PSS Verification Required" };
    }

    // 2) AI decision gate (safe defaults keep existing behavior unless risk flags are raised).
    const ai = await runAIBrain({
      userId,
      failedPayments: 0,
      pssVerified: pss.verified,
      multipleAccounts: false,
      balance: 1000,
    });
    if (ai.risk.level === "HIGH") {
      return { success: false, message: "High Risk User" };
    }
    if (!ai.eligibility.allowed) {
      return { success: false, message: ai.eligibility.reason ?? "Eligibility check failed" };
    }

    // 3) Payment check/charge
    const payment = await processPayment(userId, 100);
    if (!payment.success) {
      return { success: false, message: payment.message ?? "Payment Failed" };
    }

    // 4) STL snapshot / upgrade-side read
    const stl = await getSTLFromService(userId);

    return {
      success: true,
      message: "STL Upgrade Successful",
      data: stl,
    };
  } catch {
    return { success: false, message: "Workflow Error" };
  }
}
