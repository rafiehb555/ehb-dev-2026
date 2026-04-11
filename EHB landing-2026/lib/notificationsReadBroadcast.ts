/** Same-origin BroadcastChannel for instant read-state sync across tabs (complements `storage`). */

export const NOTIFICATION_READ_BROADCAST_NAME = "ehb-notif-read-v1";

export function broadcastNotificationReadUpdate(): void {
  if (typeof BroadcastChannel === "undefined") return;
  try {
    const ch = new BroadcastChannel(NOTIFICATION_READ_BROADCAST_NAME);
    ch.postMessage({ type: "read-ids-updated" });
    ch.close();
  } catch {
    /* ignore */
  }
}

export function subscribeNotificationReadUpdate(onMessage: () => void): () => void {
  if (typeof BroadcastChannel === "undefined") return () => {};
  try {
    const ch = new BroadcastChannel(NOTIFICATION_READ_BROADCAST_NAME);
    ch.onmessage = () => onMessage();
    return () => ch.close();
  } catch {
    return () => {};
  }
}
