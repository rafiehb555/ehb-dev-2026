"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { api } from "@/lib/api";
import type { StlFullSnapshot } from "@/lib/stl/fullSnapshot";
import { getDemoStlSnapshot } from "@/lib/stl/demoSnapshot";

type UseStlState = {
  loading: boolean;
  data: StlFullSnapshot | null;
  error: string | null;
};

/* ----------------------------- Module-level cache -----------------------------
 * A single shared cache across every component that mounts useSTL() in the
 * client bundle. Prevents the "click a DMO card → see blank skeleton → fetch"
 * round-trip every single time the user navigates between DMO sub-pages.
 *
 * - `cached` holds the last successful snapshot.
 * - `cachedAt` is the last successful fetch epoch (ms).
 * - `inflight` holds a promise so concurrent mounts share one network call.
 * -----------------------------------------------------------------------------*/
const FRESH_MS = 60_000; // 60s — matches server-side 45s TTL with small grace window.

let cached: StlFullSnapshot | null = null;
let cachedAt = 0;
let inflight: Promise<StlFullSnapshot | null> | null = null;

function isFresh(): boolean {
  return cached !== null && Date.now() - cachedAt < FRESH_MS;
}

async function fetchSnapshot(signal?: AbortSignal): Promise<StlFullSnapshot | null> {
  if (inflight) return inflight;
  inflight = (async () => {
    try {
      const res = await api.get("/stl/full-snapshot", { signal });
      const json = res.data;
      if (json?.success === false) return null;
      const data = (json?.data ?? null) as StlFullSnapshot | null;
      if (data) {
        cached = data;
        cachedAt = Date.now();
      }
      return data;
    } finally {
      inflight = null;
    }
  })();
  return inflight;
}

export function useSTL() {
  /*
   * Initial state strategy:
   *   1. If we already have a fresh module cache → return it instantly, no loading flash.
   *   2. Otherwise return the client-safe demo snapshot so the Hero/score dial
   *      paint on the very first frame. We then refresh in the background and
   *      swap to live data silently.
   *
   * This removes the slow "click → blank skeleton → network → render" path
   * Rafi reported on the ehb-stl-level card.
   */
  const initial: UseStlState =
    cached !== null
      ? { loading: !isFresh(), data: cached, error: null }
      : { loading: true, data: getDemoStlSnapshot(), error: null };

  const [state, setState] = useState<UseStlState>(initial);
  const aliveRef = useRef(true);

  useEffect(() => {
    aliveRef.current = true;

    // Cache hit within freshness window → nothing to do.
    if (isFresh()) {
      setState({ loading: false, data: cached, error: null });
      return () => {
        aliveRef.current = false;
      };
    }

    const controller = new AbortController();
    (async () => {
      try {
        const snapshot = await fetchSnapshot(controller.signal);
        if (!aliveRef.current) return;
        if (snapshot) {
          setState({ loading: false, data: snapshot, error: null });
        } else {
          // Live fetch failed — keep demo data visible instead of showing an error card.
          setState((prev) => ({
            loading: false,
            data: prev.data ?? getDemoStlSnapshot(),
            error: null,
          }));
        }
      } catch (err) {
        if (!aliveRef.current) return;
        if (axios.isCancel(err) || (err as any)?.name === "CanceledError") return;
        // Network error: still surface something usable rather than blocking the UI.
        const message = axios.isAxiosError(err)
          ? (err.response?.data?.error?.message ?? "Failed to load STL")
          : "Failed to load STL";
        setState((prev) => ({
          loading: false,
          data: prev.data ?? getDemoStlSnapshot(),
          error: prev.data ? null : message,
        }));
      }
    })();

    return () => {
      aliveRef.current = false;
      controller.abort();
    };
  }, []);

  return state;
}

/** Test helper: wipe the module cache. Safe to call in dev tools / HMR. */
export function __resetUseStlCacheForTests() {
  cached = null;
  cachedAt = 0;
  inflight = null;
}

export default useSTL;
