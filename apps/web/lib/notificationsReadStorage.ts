/** Same key used by `storage` listeners in other tabs (must stay in sync). */
export const NOTIFICATION_READ_IDS_STORAGE_KEY = "ehb-notif-read-ids-v1";

const MAX_READ_IDS = 400;

export function loadReadNotificationIds(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(NOTIFICATION_READ_IDS_STORAGE_KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw) as unknown;
    if (!Array.isArray(arr)) return new Set();
    return new Set(arr.filter((x): x is string => typeof x === "string"));
  } catch {
    return new Set();
  }
}

export function mergePersistReadNotificationIds(existing: Set<string>, ids: string[]): Set<string> {
  const merged = new Set(existing);
  for (const id of ids) merged.add(id);
  let arr = [...merged];
  if (arr.length > MAX_READ_IDS) arr = arr.slice(-MAX_READ_IDS);
  try {
    localStorage.setItem(NOTIFICATION_READ_IDS_STORAGE_KEY, JSON.stringify(arr));
  } catch {
    // quota / private mode — keep in-memory only
  }
  return new Set(arr);
}
