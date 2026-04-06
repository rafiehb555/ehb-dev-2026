import { ok } from "@/lib/apiResponse";

/** Public payment capabilities (no secrets). */
export async function GET() {
  return ok({
    stripeCheckout: Boolean(process.env.STRIPE_SECRET_KEY?.trim()),
  });
}
