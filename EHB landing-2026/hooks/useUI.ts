"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { UiWidgetConfig } from "@/lib/ai/uiEngine";

type UseUiState = {
  loading: boolean;
  widgets: UiWidgetConfig[];
  error: string | null;
};

export default function useUI() {
  const [state, setState] = useState<UseUiState>({ loading: true, widgets: [], error: null });

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await api.get("/ui/config");
        const json = res.data;
        if (!alive) return;
        if (json?.success === false) {
          setState({ loading: false, widgets: [], error: json?.error?.message ?? "Failed to load UI config" });
          return;
        }
        setState({ loading: false, widgets: (json?.data?.ui ?? []) as UiWidgetConfig[], error: null });
      } catch {
        if (!alive) return;
        setState({ loading: false, widgets: [], error: "Failed to load UI config" });
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  return state;
}

