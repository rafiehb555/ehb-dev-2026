"use client";

import { useCallback, useMemo, useState } from "react";

type CartItem = { productId: string; qty: number };

const CART_KEY = "ehb_gosellr_cart_v1";

function safeParseCart(raw: string | null): CartItem[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as CartItem[];
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((x) => typeof x?.productId === "string" && typeof x?.qty === "number" && x.qty > 0)
      .map((x) => ({ productId: x.productId, qty: x.qty }));
  } catch {
    return [];
  }
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window === "undefined") return [];
    return safeParseCart(window.localStorage.getItem(CART_KEY));
  });

  const persist = useCallback((next: CartItem[]) => {
    setItems(next);
    try {
      window.localStorage.setItem(CART_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
  }, []);

  const addItem = useCallback(
    (productId: string, qty: number) => {
      const next = [...items];
      const idx = next.findIndex((i) => i.productId === productId);
      if (idx >= 0) next[idx] = { ...next[idx], qty: next[idx].qty + qty };
      else next.push({ productId, qty });
      persist(next);
    },
    [items, persist]
  );

  const setQty = useCallback(
    (productId: string, qty: number) => {
      const next = items
        .map((i) => (i.productId === productId ? { ...i, qty } : i))
        .filter((i) => i.qty > 0);
      persist(next);
    },
    [items, persist]
  );

  const removeItem = useCallback(
    (productId: string) => {
      const next = items.filter((i) => i.productId !== productId);
      persist(next);
    },
    [items, persist]
  );

  const clear = useCallback(() => {
    persist([]);
  }, [persist]);

  const getQty = useCallback((productId: string) => items.find((i) => i.productId === productId)?.qty ?? 0, [items]);

  const cart = useMemo(() => {
    return { items, count: items.reduce((s, i) => s + i.qty, 0) };
  }, [items]);

  return { ...cart, addItem, setQty, removeItem, clear, getQty };
}

