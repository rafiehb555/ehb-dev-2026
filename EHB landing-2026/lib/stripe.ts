import StripeImport from "stripe";

/** Stripe SDK instance (typed loosely for compatibility with stripe-node’s export shape). */
export type StripeService = InstanceType<typeof StripeCtor>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- stripe default export is callable/constructible at runtime; typings use `export =`.
const StripeCtor = StripeImport as any;

let stripeSingleton: StripeService | null = null;

export function getStripe(): StripeService | null {
  const key = process.env.STRIPE_SECRET_KEY?.trim();
  if (!key) return null;
  if (!stripeSingleton) {
    stripeSingleton = new StripeCtor(key) as StripeService;
  }
  return stripeSingleton;
}

export function getAppBaseUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_APP_URL?.trim().replace(/\/$/, "");
  if (explicit) return explicit;
  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) return vercel.startsWith("http") ? vercel : `https://${vercel}`;
  return "http://localhost:3000";
}

export function stripeCheckoutCurrency(): string {
  return (process.env.STRIPE_CHECKOUT_CURRENCY ?? "usd").trim().toLowerCase() || "usd";
}
