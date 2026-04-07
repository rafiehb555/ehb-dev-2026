"use client";

import { useState } from "react";
import { useCart } from "@/components/gosellr/useCart";

export function GoSellrCartActions({ productId }: { productId: string }) {
  const { addItem, getQty } = useCart();
  const [busy, setBusy] = useState(false);
  const qty = getQty(productId);

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          await new Promise((r) => setTimeout(r, 250));
          addItem(productId, 1);
          setBusy(false);
        }}
        className="min-h-touch inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#33C3FF] to-[#22b14c] px-5 py-2.5 text-sm font-semibold text-slate-950 btn-glow hover:opacity-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {busy ? "Adding..." : "Add to cart"}
      </button>
      {qty > 0 ? (
        <span className="inline-flex items-center rounded-full bg-white/5 border border-white/10 px-3 py-[2px] text-[11px] text-ehb-textBody">
          Qty: <span className="text-white font-semibold ml-1">{qty}</span>
        </span>
      ) : null}
    </div>
  );
}

