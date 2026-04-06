export type EscrowTimelineItem = {
  title: string;
  at: string;
  note?: string;
};

function iso(d: Date): string {
  return d.toISOString();
}

/**
 * Buyer-facing steps from order creation + optional escrow metadata (extend route, etc.).
 */
export function buildEscrowTimeline(
  metadata: Record<string, unknown> | null | undefined,
  createdAt: Date
): EscrowTimelineItem[] {
  const items: EscrowTimelineItem[] = [];
  const m = metadata ?? {};

  items.push({
    title: "Order placed",
    at: iso(createdAt),
  });

  if (m.escrowHeld === true) {
    items.push({
      title: "Funds in escrow (settlement pending)",
      at: iso(createdAt),
    });
  }

  if (typeof m.paymentCapturedAt === "string") {
    const d = new Date(m.paymentCapturedAt);
    if (!Number.isNaN(d.getTime())) {
      const method = typeof m.paymentMethod === "string" ? m.paymentMethod : "";
      const title =
        method === "STRIPE"
          ? "Payment captured (Stripe)"
          : method === "DEMO_WALLET"
            ? "Payment captured (demo wallet)"
            : "Payment captured";
      items.push({
        title,
        at: iso(d),
        note: method ? `Method: ${method}` : undefined,
      });
    }
  }

  if (typeof m.shippedAt === "string") {
    const d = new Date(m.shippedAt);
    if (!Number.isNaN(d.getTime())) {
      items.push({
        title: "Marked shipped",
        at: iso(d),
        note: typeof m.trackingNumber === "string" ? `Tracking: ${m.trackingNumber}` : undefined,
      });
    }
  }

  if (typeof m.escrowReleasedAt === "string") {
    const d = new Date(m.escrowReleasedAt);
    if (!Number.isNaN(d.getTime())) {
      items.push({
        title: m.escrowAutoReleased === true ? "Escrow auto-released" : "Escrow released",
        at: iso(d),
      });
    }
  }

  if (typeof m.escrowRelease === "string") {
    const d = new Date(m.escrowRelease);
    if (!Number.isNaN(d.getTime())) {
      items.push({
        title: "Scheduled release to seller",
        at: iso(d),
      });
    }
  }

  if (typeof m.escrowExtendedAt === "string") {
    const d = new Date(m.escrowExtendedAt);
    if (!Number.isNaN(d.getTime())) {
      items.push({
        title: "Escrow hold extended",
        at: iso(d),
        note: typeof m.escrowExtensionReason === "string" ? m.escrowExtensionReason : undefined,
      });
    }
  }

  items.sort((a, b) => new Date(a.at).getTime() - new Date(b.at).getTime());
  return items;
}
