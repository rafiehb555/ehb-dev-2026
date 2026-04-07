"use client";

import Link from "next/link";
import { Bell } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { broadcastNotificationReadUpdate, subscribeNotificationReadUpdate } from "@/lib/notificationsReadBroadcast";
import {
  loadReadNotificationIds,
  mergePersistReadNotificationIds,
  NOTIFICATION_READ_IDS_STORAGE_KEY,
} from "@/lib/notificationsReadStorage";

type NotificationItem = {
  id: string;
  text: string;
  createdAt: number;
  read: boolean;
  href?: string;
};

const RANDOM_NOTIFICATIONS: { text: string; readDefault?: boolean }[] = [
  { text: "New job posted in IT: React Developer (Remote)." },
  { text: "Earnings update: +$10 earned from your activity." },
  { text: "A buyer verified your service successfully." },
  { text: "Order placed: delivery scheduled for tomorrow." },
  { text: "Trending in your area: delivery + small business services." },
  { text: "AI match found: best service to offer based on your profile." },
];

export function NotificationsBell() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [notifLoading, setNotifLoading] = useState(true);
  const readIdsRef = useRef<Set<string>>(new Set());

  const unreadCount = useMemo(() => items.filter((n) => !n.read).length, [items]);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!rootRef.current) return;
      if (!open) return;
      const target = e.target as Node | null;
      if (target && !rootRef.current.contains(target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    readIdsRef.current = loadReadNotificationIds();
    let cancelled = false;

    async function loadNotifications() {
      try {
        const res = await fetch("/api/notifications", { cache: "no-store" });
        const json = await res.json();
        if (!cancelled && json.success) {
          const readIds = readIdsRef.current;
          const next = (
            json.data as Array<{ id: string; title: string; message: string; time: string; href?: string }>
          ).map((item) => ({
            id: item.id,
            text: `${item.title}: ${item.message}`,
            createdAt: new Date(item.time).getTime(),
            read: readIds.has(item.id),
            href:
              typeof item.href === "string" && item.href.startsWith("/") && !item.href.startsWith("//")
                ? item.href
                : undefined,
          }));
          setItems(next.slice(0, 10));
        }
      } catch {
        if (!cancelled) {
          setItems((prev) => {
            if (prev.length > 0) return prev;
            const readIds = readIdsRef.current;
            return RANDOM_NOTIFICATIONS.slice(0, 3).map((item, index) => ({
              id: `fallback-${index}`,
              text: item.text,
              createdAt: Date.now() - index * 1000 * 60 * 15,
              read: readIds.has(`fallback-${index}`),
            }));
          });
        }
      } finally {
        if (!cancelled) setNotifLoading(false);
      }
    }

    void loadNotifications();
    const id = window.setInterval(() => {
      void loadNotifications();
    }, 15000);

    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, []);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== NOTIFICATION_READ_IDS_STORAGE_KEY) return;
      readIdsRef.current = loadReadNotificationIds();
      setItems((prev) => prev.map((i) => ({ ...i, read: readIdsRef.current.has(i.id) })));
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    const syncFromStore = () => {
      readIdsRef.current = loadReadNotificationIds();
      setItems((prev) => prev.map((i) => ({ ...i, read: readIdsRef.current.has(i.id) })));
    };
    return subscribeNotificationReadUpdate(syncFromStore);
  }, []);

  const markAllRead = () => {
    setItems((prev) => {
      readIdsRef.current = mergePersistReadNotificationIds(
        readIdsRef.current,
        prev.map((i) => i.id)
      );
      broadcastNotificationReadUpdate();
      return prev.map((i) => ({ ...i, read: true }));
    });
  };

  const markOneRead = (id: string) => {
    readIdsRef.current = mergePersistReadNotificationIds(readIdsRef.current, [id]);
    broadcastNotificationReadUpdate();
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, read: true } : i)));
  };

  const timeAgo = (ts: number) => {
    const diff = Math.max(0, Date.now() - ts);
    const mins = Math.floor(diff / (1000 * 60));
    if (mins <= 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    return `${hrs}h ago`;
  };

  const bellAria = unreadCount ? `${unreadCount} unread notifications` : "No unread notifications";

  return (
    <div ref={rootRef} className="relative inline-flex items-center">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="relative inline-flex items-center justify-center rounded-full h-7 w-7 text-xs text-slate-200 hover:bg-white/5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/50 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label={bellAria}
      >
        <Bell className="h-3.5 w-3.5 text-slate-200" strokeWidth={2} aria-hidden />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 h-3.5 min-w-[14px] px-[3px] rounded-full bg-rose-500 text-[9px] font-semibold text-white flex items-center justify-center">
            {Math.min(99, unreadCount)}
          </span>
        )}
      </button>

      {open && (
        <div
          className="absolute right-0 top-9 w-[320px] max-w-[calc(100vw-24px)] z-[70]"
          role="dialog"
          aria-label="Notifications"
        >
          <div className="rounded-2xl glass-panel border border-white/10 bg-slate-950/85 backdrop-blur p-3 shadow-[0_0_42px_rgba(0,234,255,0.12)]">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div>
                <p className="text-[11px] uppercase tracking-[0.22em] text-ehb-textMuted">Notifications</p>
                <p className="text-sm font-semibold text-white mt-1">Stay updated</p>
              </div>
              <button
                type="button"
                onClick={markAllRead}
                className="text-[11px] font-semibold text-slate-200 hover:text-white underline-offset-2 hover:underline"
              >
                Mark all read
              </button>
            </div>

            <div className="max-h-[260px] overflow-auto pr-1 space-y-2">
              {notifLoading ? (
                <div className="space-y-2 animate-pulse" aria-hidden>
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="h-14 rounded-xl bg-white/[0.06] border border-white/5" />
                  ))}
                </div>
              ) : items.length === 0 ? (
                <p className="text-[12px] text-ehb-textMuted py-2">You&apos;re all caught up.</p>
              ) : (
                items.map((n) => {
                  const inner = (
                    <div className="flex items-start gap-2">
                      <span
                        className="mt-[2px] h-2 w-2 rounded-full shrink-0"
                        style={{ backgroundColor: n.read ? "rgba(148,163,184,0.55)" : "rgba(244,63,94,0.95)" }}
                        aria-hidden
                      />
                      <div className="min-w-0 flex-1">
                        <p className={`text-[12px] ${n.read ? "text-slate-200/90" : "text-white"} leading-relaxed`}>
                          {n.text}
                        </p>
                        <p className="text-[10px] text-slate-500 mt-0.5">{timeAgo(n.createdAt)}</p>
                        {n.href && (
                          <p className="text-[10px] text-cyan-400/90 mt-1 font-medium">Open →</p>
                        )}
                      </div>
                    </div>
                  );
                  const rowClass =
                    "block w-full text-left rounded-xl border border-white/5 bg-white/0 hover:bg-white/5 transition-colors px-3 py-2";
                  if (n.href) {
                    return (
                      <Link
                        key={n.id}
                        href={n.href}
                        className={rowClass}
                        aria-label={n.text}
                        onClick={() => {
                          markOneRead(n.id);
                          setOpen(false);
                        }}
                      >
                        {inner}
                      </Link>
                    );
                  }
                  return (
                    <button
                      key={n.id}
                      type="button"
                      onClick={() => markOneRead(n.id)}
                      className={rowClass}
                      aria-label={n.text}
                    >
                      {inner}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

