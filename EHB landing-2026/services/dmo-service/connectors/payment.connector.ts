export type PaymentResult = {
  success: boolean;
  transactionId?: string;
  message?: string;
};

export async function processPayment(_userId: string, _amount: number): Promise<PaymentResult> {
  // Safe stub for workflow wiring. Replace with payment service call.
  return { success: true, transactionId: `demo-${Date.now()}` };
}
