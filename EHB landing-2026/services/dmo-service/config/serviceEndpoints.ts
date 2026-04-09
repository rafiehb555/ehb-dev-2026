export type DmoServiceConfig = {
  stlServiceBaseUrl: string;
  pssServiceBaseUrl: string;
  paymentServiceBaseUrl: string;
};

export const dmoServiceConfig: DmoServiceConfig = {
  stlServiceBaseUrl: process.env.STL_SERVICE_BASE_URL ?? "http://localhost:5001",
  pssServiceBaseUrl: process.env.PSS_SERVICE_BASE_URL ?? "http://localhost:5002",
  paymentServiceBaseUrl: process.env.PAYMENT_SERVICE_BASE_URL ?? "http://localhost:5004",
};
