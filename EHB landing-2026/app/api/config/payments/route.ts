import { ok } from "@/lib/apiResponse";

/** Public payment capabilities (no secrets). */
export async function GET() {
  return ok({
    stripeCheckout: Boolean(process.env.STRIPE_SECRET_KEY?.trim()),
    providers: {
      easypaisa: true,
      jazzcash: true,
      stripe: Boolean(process.env.STRIPE_SECRET_KEY?.trim()),
      paypal: Boolean(process.env.PAYPAL_CLIENT_ID?.trim()),
    },
    paymentTypes: ["STL_UPGRADE", "CRB_EXAM", "DMO_REFILL", "FRANCHISE_FEE"],
  });
}
