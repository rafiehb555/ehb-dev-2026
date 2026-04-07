/** Shared demo queue rows when API is unavailable (auth / empty DB). Mirrors `demoCases()` in `app/api/pss/cases/route.ts`. */

export type PssDemoCaseRow = {
  id: string;
  userId: string;
  user: { id: string; name: string; email: string; role: string };
  type: string;
  status: string;
  riskScore: number;
  risk: "low" | "medium" | "high";
  stage: string;
  phaseCompleted?: number;
  updatedAt: string;
  lastVerifiedAt: string | null;
};

export function getPssDemoCases(): PssDemoCaseRow[] {
  const now = Date.now();
  return [
    {
      id: "pss-demo-1",
      userId: "ehb-demo-user-1",
      user: { id: "ehb-demo-user-1", name: "Ali Khan", email: "ali@test.com", role: "USER" },
      type: "KYC",
      status: "UNDER_REVIEW",
      riskScore: 78,
      risk: "high",
      stage: "AML_RISK",
      phaseCompleted: 3,
      updatedAt: new Date(now - 2 * 60 * 60 * 1000).toISOString(),
      lastVerifiedAt: null,
    },
    {
      id: "pss-demo-2",
      userId: "ehb-demo-user-2",
      user: { id: "ehb-demo-user-2", name: "Sara Noor", email: "sara@test.com", role: "USER" },
      type: "KYC",
      status: "VERIFIED",
      riskScore: 24,
      risk: "low",
      stage: "COMPLETED",
      phaseCompleted: 6,
      updatedAt: new Date(now - 10 * 60 * 60 * 1000).toISOString(),
      lastVerifiedAt: new Date(now - 36 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "pss-demo-3",
      userId: "ehb-demo-user-3",
      user: { id: "ehb-demo-user-3", name: "Usman Raza", email: "usman@test.com", role: "USER" },
      type: "KYC",
      status: "PENDING",
      riskScore: 46,
      risk: "medium",
      stage: "DOCUMENTS",
      phaseCompleted: 1,
      updatedAt: new Date(now - 90 * 60 * 1000).toISOString(),
      lastVerifiedAt: null,
    },
  ];
}
