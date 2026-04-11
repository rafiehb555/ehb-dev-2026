export const PAYMENT_TYPES = ["STL_UPGRADE", "CRB_EXAM", "DMO_REFILL", "FRANCHISE_FEE"] as const;
export type PaymentType = (typeof PAYMENT_TYPES)[number];

export const PAYMENT_PROVIDERS = ["EASYPAISA", "JAZZCASH", "STRIPE", "PAYPAL"] as const;
export type PaymentProvider = (typeof PAYMENT_PROVIDERS)[number];

export function defaultAmountForType(type: PaymentType) {
  switch (type) {
    case "STL_UPGRADE":
      return 50;
    case "CRB_EXAM":
      return 25;
    case "DMO_REFILL":
      return 15;
    case "FRANCHISE_FEE":
      return 500;
  }
}

export function txLabelForType(type: PaymentType) {
  switch (type) {
    case "STL_UPGRADE":
      return "STL Upgrade";
    case "CRB_EXAM":
      return "CRB Exam";
    case "DMO_REFILL":
      return "DMO Refill";
    case "FRANCHISE_FEE":
      return "Franchise Fee";
  }
}
