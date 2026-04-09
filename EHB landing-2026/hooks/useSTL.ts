"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { api } from "@/lib/api";
import type { StlFullSnapshot } from "@/lib/stl/fullSnapshot";

type UseStlState = {
  loading: boolean;
  data: StlFullSnapshot | null;
  error: string | null;
};

export function useSTL() {
  const [state, setState] = useState<UseStlState>({ loading: true, data: null, error: null });

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await api.get("/stl/full-snapshot");
        const json = res.data;
        if (!alive) return;
        if (json?.success === false) {
          setState({ loading: false, data: null, error: json?.error?.message ?? "Failed to load STL" });
          return;
        }
        setState({ loading: false, data: (json?.data ?? null) as StlFullSnapshot | null, error: null });
      } catch (err) {
        if (!alive) return;
        const message = axios.isAxiosError(err)
          ? (err.response?.data?.error?.message ?? "Failed to load STL")
          : "Failed to load STL";
        setState({ loading: false, data: null, error: message });
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  return state;
}

export default useSTL;
