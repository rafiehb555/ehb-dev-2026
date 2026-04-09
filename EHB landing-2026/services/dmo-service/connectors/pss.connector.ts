export type PssStatus = {
  verified: boolean;
  reason?: string;
};

export async function getPSSStatus(_userId: string): Promise<PssStatus> {
  // Safe stub for workflow wiring. Replace with real PSS service integration.
  return { verified: true };
}
