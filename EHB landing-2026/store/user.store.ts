"use client";

import { useSyncExternalStore } from "react";
import type { AppUser } from "@/types/user.types";

type UserStoreState = {
  user: AppUser | null;
};

let state: UserStoreState = { user: null };
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return state;
}

export const userStore = {
  setUser(user: AppUser | null) {
    state = { ...state, user };
    emit();
  },
  clear() {
    state = { user: null };
    emit();
  },
  getState: getSnapshot,
};

export function useUserStore() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
