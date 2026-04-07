"use client";

import { useEffect, useState } from "react";
import { stlLevelChipClasses } from "@/lib/stl/chipTone";

type Stl = { score: number; level: number; label: string; source: "db" | "synthetic" };

/** Fetches `GET /api/gosellr/trust` and shows EHB-STL-LEVEL for the product (seller trust stack). */
export function GoSellrProductStlLine({ productId }: { productId: string }) {
  const [stl, setStl] = useState<Stl | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/gosellr/trust?productId=${encodeURIComponent(productId)}`, { cache: "no-store" })
      .then((res) => res.json())
      .then((json) => {
        if (!cancelled && json?.success && json.data?.stl) setStl(json.data.stl as Stl);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [productId]);

  if (!stl) return null;

  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2">
      <div>
        <p className="text-[11px] uppercase tracking-[0.18em] text-ehb-textMuted">Seller · EHB-STL-LEVEL</p>
        <p className="text-[11px] text-ehb-textBody mt-0.5">{stl.label}</p>
      </div>
      <span
        className={`inline-flex shrink-0 items-center rounded-full border px-3 py-1 text-xs font-semibold ${stlLevelChipClasses(stl.level)}`}
        title={stl.source === "synthetic" ? "Demo blend until PRODUCT STL row exists" : "From STL engine"}
      >
        L{stl.level} · {stl.score.toFixed(0)}
      </span>
    </div>
  );
}
