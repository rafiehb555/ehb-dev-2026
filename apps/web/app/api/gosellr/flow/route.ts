/**
 * ═══════════════════════════════════════════════════════════════════════
 *  GoSellr — Unified Seller Journey State
 *  GET /api/gosellr/flow
 *
 *  Aggregates every gate the seller must pass:
 *    1. REGISTER      — user exists
 *    2. PSS           — PSSVerification case status
 *    3. CRB           — CRBApplication (certification) status
 *    4. DMO_APPROVAL  — SELLER_ONBOARDING Application state
 *    5. FRANCHISE     — FranchiseUser assignment
 *    6. STL           — profile.stlStatus / computed level
 *    7. ACTIVE        — all above green → seller live on GoSellr
 * ═══════════════════════════════════════════════════════════════════════
 */

import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/rbac";
import { ok, fail } from "@/lib/apiResponse";
import { handleRouteError } from "@/lib/apiErrors";

type StepStatus = "not_started" | "in_progress" | "approved" | "rejected";

export async function GET() {
  const auth = await requireSession(["USER", "FRANCHISE", "ADMIN", "SUPER_ADMIN"]);
  if (!auth.ok) return fail(auth.status, "AUTH", auth.error);

  try {
    const userId = auth.user.userId;

    const [user, profile, pss, application, franchiseLink, crb] = await Promise.all([
      prisma.user.findUnique({ where: { id: userId }, select: { id: true, email: true, createdAt: true } }),
      prisma.profile.findFirst({
        where: { userId },
        select: { verificationStatus: true, stlStatus: true, stlUpdatedAt: true },
      }),
      prisma.pSSVerification.findUnique({
        where: { userId },
        select: { id: true, status: true, phaseCompleted: true, currentStep: true, riskLevel: true },
      }),
      prisma.application.findFirst({
        where: { applicantId: userId, type: "SELLER_ONBOARDING" as any },
        orderBy: { createdAt: "desc" },
        select: { id: true, status: true, payload: true, createdAt: true },
      }),
      prisma.franchiseUser.findFirst({
        where: { userId },
        select: { id: true, franchiseId: true, franchise: { select: { name: true, country: true, level: true } } },
      }),
      prisma.cRBApplication
        ?.findFirst({
          where: { applicantId: userId },
          orderBy: { createdAt: "desc" },
          select: { id: true, status: true },
        })
        .catch(() => null),
    ]);

    // ─── Step 1: REGISTER ──────────────────────────────────────────
    const stepRegister = {
      key: "REGISTER",
      title: "Account Registered",
      status: (user ? "approved" : "not_started") as StepStatus,
      detail: user ? user.email : "No account",
    };

    // ─── Step 2: PSS ───────────────────────────────────────────────
    let pssStatus: StepStatus = "not_started";
    if (pss) {
      if (pss.status === "VERIFIED") pssStatus = "approved";
      else if (pss.status === "REJECTED") pssStatus = "rejected";
      else pssStatus = "in_progress";
    }
    const stepPss = {
      key: "PSS",
      title: "PSS Verification",
      status: pssStatus,
      detail: pss ? `${pss.phaseCompleted}/4 phases · ${pss.currentStep}` : "Not submitted",
      link: "/verify",
    };

    // ─── Step 3: CRB ───────────────────────────────────────────────
    let crbStatus: StepStatus = "not_started";
    if (crb) {
      const s = String(crb.status ?? "").toUpperCase();
      if (s === "APPROVED" || s === "VERIFIED") crbStatus = "approved";
      else if (s === "REJECTED") crbStatus = "rejected";
      else crbStatus = "in_progress";
    }
    const stepCrb = {
      key: "CRB",
      title: "CRB Certification",
      status: crbStatus,
      detail: crb ? `Case ${crb.id.slice(-6)} · ${crb.status}` : "Not started",
      link: "/crb",
    };

    // ─── Step 4: DMO Approval ──────────────────────────────────────
    const payload = (application?.payload ?? {}) as any;
    const dmoStatusMap: Record<string, StepStatus> = {
      NEW: "in_progress",
      IN_REVIEW: "in_progress",
      UNDER_INSPECTION: "in_progress",
      APPROVED: "approved",
      REJECTED: "rejected",
    };
    const stepDmo = {
      key: "DMO_APPROVAL",
      title: "DMO Approval",
      status: application ? dmoStatusMap[application.status] ?? "in_progress" : "not_started",
      detail: application
        ? `${application.status} · ${payload.storeName ?? "Store"} (${payload.category ?? "—"})`
        : "Submit seller onboarding first",
      link: "/gosellr/seller-onboarding",
    };

    // ─── Step 5: Franchise Assignment ──────────────────────────────
    const stepFranchise = {
      key: "FRANCHISE",
      title: "Franchise Assigned",
      status: (franchiseLink ? "approved" : stepDmo.status === "approved" ? "in_progress" : "not_started") as StepStatus,
      detail: franchiseLink
        ? `${franchiseLink.franchise?.name ?? "Franchise"} · ${franchiseLink.franchise?.country ?? "—"} · ${franchiseLink.franchise?.level ?? "SUB"}`
        : "Auto-assigned after DMO approval",
    };

    // ─── Step 6: STL ───────────────────────────────────────────────
    const stlStatus = String(profile?.stlStatus ?? "").toUpperCase();
    const stepStl = {
      key: "STL",
      title: "Service Trust Level",
      status: (stlStatus === "NORMAL" || stlStatus === "ACTIVE"
        ? "approved"
        : stlStatus === "LIMITED"
        ? "rejected"
        : stepFranchise.status === "approved"
        ? "in_progress"
        : "not_started") as StepStatus,
      detail: profile?.stlStatus ? `Status: ${profile.stlStatus}` : "Awaiting assessment",
    };

    // ─── Step 7: ACTIVE ────────────────────────────────────────────
    const allGreen =
      stepRegister.status === "approved" &&
      stepPss.status === "approved" &&
      stepCrb.status === "approved" &&
      stepDmo.status === "approved" &&
      stepFranchise.status === "approved" &&
      stepStl.status === "approved";
    const stepActive = {
      key: "ACTIVE",
      title: "Live on GoSellr",
      status: (allGreen ? "approved" : "not_started") as StepStatus,
      detail: allGreen ? "You can publish products" : "Complete all previous steps",
    };

    const steps = [stepRegister, stepPss, stepCrb, stepDmo, stepFranchise, stepStl, stepActive];
    const completed = steps.filter((s) => s.status === "approved").length;
    const progress = Math.round((completed / steps.length) * 100);

    return ok({
      userId,
      progress,
      completed,
      total: steps.length,
      steps,
      summary: {
        pssVerified: stepPss.status === "approved",
        crbCertified: stepCrb.status === "approved",
        dmoApproved: stepDmo.status === "approved",
        franchiseAssigned: !!franchiseLink,
        stlActive: stepStl.status === "approved",
        sellerLive: allGreen,
      },
    });
  } catch (err) {
    return handleRouteError(err);
  }
}
