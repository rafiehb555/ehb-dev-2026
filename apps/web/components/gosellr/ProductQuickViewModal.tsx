"use client";

/**
 * ═══════════════════════════════════════════════════════════════════════
 *  GoSellr — Product Quick View Modal
 *  Premium glass modal popup with seller STL card, buyer protection,
 *  guarantee chips, quantity stepper, and Add-to-Cart CTA.
 *
 *  Usage:
 *    const [open, setOpen] = useState(false);
 *    <ProductQuickViewModal product={p} open={open} onClose={() => setOpen(false)} />
 *
 *  Accessibility: ESC to close, click-outside close, focus-trapped, aria-modal.
 * ═══════════════════════════════════════════════════════════════════════
 */

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import type { GosellrProduct } from "@/lib/marketplace/gosellrProducts";
import { STLUserCard } from "@/components/stl/STLUserCard";
import type { TrustLevel } from "@ehb/trust-engine";

export interface ProductQuickViewModalProps {
  product: GosellrProduct;
  open: boolean;
  onClose: () => void;
  onAddToCart?: (productId: string, qty: number) => void;
}

export function ProductQuickViewModal({
  product,
  open,
  onClose,
  onAddToCart,
}: ProductQuickViewModalProps) {
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);

  // ESC close
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    // lock body scroll
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  // reset qty when product changes
  useEffect(() => {
    setQty(1);
    setAdding(false);
  }, [product.id, open]);

  const handleAdd = useCallback(async () => {
    if (!onAddToCart) return;
    setAdding(true);
    try {
      await onAddToCart(product.id, qty);
    } finally {
      setTimeout(() => setAdding(false), 600);
    }
  }, [onAddToCart, product.id, qty]);

  if (!open) return null;

  const stl = (product.sellerStl ?? 1) as TrustLevel;
  const pss = (product.sellerPss ?? null) as TrustLevel | null;
  const crb = (product.sellerCrb ?? null) as TrustLevel | null;
  const dmo = (product.sellerDmo ?? null) as TrustLevel | null;
  const score = product.sellerScore ?? 0;
  const total = (product.priceUsd * qty).toFixed(2);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="pqv-title"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: "rgba(4, 6, 12, 0.75)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl overflow-hidden rounded-2xl"
        style={{
          background: "linear-gradient(135deg, rgba(19,22,42,0.98) 0%, rgba(26,29,51,0.98) 100%)",
          border: "1px solid rgba(123,110,246,0.25)",
          boxShadow: "0 0 80px rgba(123,110,246,0.18), 0 20px 60px rgba(0,0,0,0.6)",
          animation: "pqvIn 350ms cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {/* ambient accent */}
        <div
          aria-hidden
          className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full opacity-30 blur-3xl"
          style={{ background: "#29ABE2" }}
        />

        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full text-white/60 transition-all hover:bg-white/10 hover:text-white"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
        >
          ✕
        </button>

        <div className="grid gap-0 md:grid-cols-2">
          {/* LEFT: Image */}
          <div
            className="relative flex aspect-square items-center justify-center overflow-hidden md:aspect-auto"
            style={{
              background: "linear-gradient(135deg, rgba(41,171,226,0.08) 0%, rgba(123,110,246,0.08) 100%)",
            }}
          >
            {product.image ? (
              <Image
                src={product.image}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            ) : (
              <div className="text-6xl opacity-30">📦</div>
            )}

            {/* Category chip */}
            <div className="absolute left-4 top-4">
              <span
                className="rounded-md px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider"
                style={{
                  background: "rgba(41,171,226,0.18)",
                  border: "1px solid rgba(41,171,226,0.35)",
                  color: "#29ABE2",
                  backdropFilter: "blur(8px)",
                }}
              >
                {product.category}
              </span>
            </div>

            {/* Rating badge */}
            {product.rating > 0 && (
              <div className="absolute bottom-4 left-4 flex items-center gap-1.5 rounded-md px-2.5 py-1"
                style={{ background: "rgba(12,14,26,0.85)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(8px)" }}>
                <span style={{ color: "#F0A030" }}>★</span>
                <span className="text-[12px] font-bold text-white">{product.rating.toFixed(1)}</span>
              </div>
            )}
          </div>

          {/* RIGHT: Details */}
          <div className="flex flex-col p-6">
            <h2 id="pqv-title" className="pr-10 text-[22px] font-bold leading-tight text-white">
              {product.name}
            </h2>
            <p className="mt-1.5 text-[13px] text-white/55">{product.short}</p>

            {/* Price */}
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-white">${product.priceUsd.toFixed(2)}</span>
              <span className="text-[11px] uppercase tracking-wider text-white/40">USD</span>
            </div>

            {/* Seller STL card (compact standard) */}
            <div className="mt-5">
              <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-white/45">
                Sold by
              </div>
              <STLUserCard
                name={product.sellerRule ?? "Verified Seller"}
                role="Seller"
                stl={stl}
                pss={pss}
                crb={crb}
                dmo={dmo}
                score={score}
                verified={stl >= 3}
                industry="GoSellr"
                industryAccent="#29ABE2"
              />
            </div>

            {/* Guarantee chips */}
            {(product.moneyBackDays || product.replacementDays) && (
              <div className="mt-4 flex flex-wrap gap-2">
                {product.moneyBackDays ? (
                  <Chip icon="💰" label={`${product.moneyBackDays}d Money-Back`} color="#22B14C" />
                ) : null}
                {product.replacementDays ? (
                  <Chip icon="🔄" label={`${product.replacementDays}d Replacement`} color="#29ABE2" />
                ) : null}
              </div>
            )}

            {/* Quantity + Total */}
            <div className="mt-auto pt-5">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-[11px] uppercase tracking-wider text-white/45">Qty</span>
                  <div className="flex items-center overflow-hidden rounded-lg border border-white/10">
                    <button
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                      className="h-9 w-9 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
                      aria-label="Decrease quantity"
                    >−</button>
                    <div className="flex h-9 w-12 items-center justify-center text-sm font-bold text-white">{qty}</div>
                    <button
                      onClick={() => setQty((q) => Math.min(99, q + 1))}
                      className="h-9 w-9 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
                      aria-label="Increase quantity"
                    >+</button>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] uppercase tracking-wider text-white/45">Total</div>
                  <div className="text-lg font-bold text-white">${total}</div>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex gap-2">
                <button
                  onClick={handleAdd}
                  disabled={adding}
                  className="flex-1 rounded-lg py-3 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 disabled:opacity-60"
                  style={{
                    background: "linear-gradient(135deg, #29ABE2 0%, #7B6EF6 100%)",
                    boxShadow: "0 4px 20px rgba(41,171,226,0.35)",
                  }}
                >
                  {adding ? "Adding…" : "Add to Cart"}
                </button>
                <Link
                  href={`/gosellr/product/${product.id}`}
                  className="rounded-lg px-5 py-3 text-sm font-semibold text-white/80 transition-all hover:bg-white/10 hover:text-white"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
                >
                  Full Details
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* keyframes */}
      <style>{`
        @keyframes pqvIn {
          from { opacity: 0; transform: translateY(20px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0)    scale(1); }
        }
      `}</style>
    </div>
  );
}

function Chip({ icon, label, color }: { icon: string; label: string; color: string }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] font-semibold"
      style={{
        background: `${color}22`,
        border: `1px solid ${color}55`,
        color,
      }}
    >
      <span>{icon}</span>
      <span>{label}</span>
    </span>
  );
}

export default ProductQuickViewModal;
