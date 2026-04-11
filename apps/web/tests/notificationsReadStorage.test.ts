import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  loadReadNotificationIds,
  mergePersistReadNotificationIds,
  NOTIFICATION_READ_IDS_STORAGE_KEY,
} from "@/lib/notificationsReadStorage";

function createMemoryStorage(): Storage {
  const store: Record<string, string> = {};
  return {
    get length() {
      return Object.keys(store).length;
    },
    clear() {
      for (const k of Object.keys(store)) delete store[k];
    },
    getItem(key: string) {
      return store[key] ?? null;
    },
    key(index: number) {
      return Object.keys(store)[index] ?? null;
    },
    removeItem(key: string) {
      delete store[key];
    },
    setItem(key: string, value: string) {
      store[key] = value;
    },
  };
}

describe("notificationsReadStorage", () => {
  beforeEach(() => {
    const storage = createMemoryStorage();
    vi.stubGlobal("localStorage", storage);
    vi.stubGlobal("window", { localStorage: storage });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("mergePersistReadNotificationIds caps at 400 ids", () => {
    const existing = new Set<string>();
    const ids = Array.from({ length: 450 }, (_, i) => `id-${i}`);
    const result = mergePersistReadNotificationIds(existing, ids);
    expect(result.size).toBe(400);
  });

  it("loadReadNotificationIds reads persisted JSON array", () => {
    localStorage.setItem(NOTIFICATION_READ_IDS_STORAGE_KEY, JSON.stringify(["a", "b"]));
    const ids = loadReadNotificationIds();
    expect(ids.has("a")).toBe(true);
    expect(ids.has("b")).toBe(true);
    expect(ids.size).toBe(2);
  });
});
