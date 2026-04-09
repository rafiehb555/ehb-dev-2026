"use client";

import { useEffect, useState } from "react";
import type { AppUser } from "@/types/user.types";

type UseUserState = {
  loading: boolean;
  user: AppUser | null;
  error: string | null;
};

export function useUser() {
  const [state, setState] = useState<UseUserState>({ loading: true, user: null, error: null });

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch("/api/auth/me", { cache: "no-store" });
        const json = await res.json();
        if (!alive) return;
        if (!res.ok || json?.success === false) {
          setState({ loading: false, user: null, error: json?.error?.message ?? "Unauthorized" });
          return;
        }
        const raw = (json?.data?.user ?? null) as
          | { id?: string; userId?: string; role?: string; name?: string | null; email?: string | null }
          | null;
        if (!raw) {
          setState({ loading: false, user: null, error: null });
          return;
        }
        const user: AppUser = {
          userId: raw.userId ?? raw.id ?? "demo-user",
          role: (raw.role ?? "USER") as AppUser["role"],
          name: raw.name ?? null,
          email: raw.email ?? null,
        };
        setState({ loading: false, user, error: null });
      } catch {
        if (!alive) return;
        setState({ loading: false, user: null, error: "Failed to load user" });
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  return state;
}

export default useUser;
