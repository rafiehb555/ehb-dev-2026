"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type NotificationItem = {
  id: string;
  text: string;
  createdAt: number;
  read: boolean;
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
  const [items, setItems] = useState<NotificationItem[]>(() => [
    { id: "n1", text: "New job posted in IT: React Developer (Remote).", createdAt: Date.now() - 1000 * 60 * 18, read: false },
    { id: "n2", text: "Earnings update: +$10 earned from your activity.", createdAt: Date.now() - 1000 * 60 * 55, read: false },
    { id: "n3", text: "Service verified successfully by EHB (PSS + DMO).", createdAt: Date.now() - 1000 * 60 * 90, read: false },
  ]);

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
    const id = window.setInterval(() => {
      // keep it calm: only add when user is not focused on dropdown
      const pick = RANDOM_NOTIFICATIONS[Math.floor(Math.random() * RANDOM_NOTIFICATIONS.length)];
      const next: NotificationItem = {
        id: `n_${Date.now()}_${Math.random().toString(16).slice(2)}`,
        text: pick.text,
        createdAt: Date.now(),
        read: open ? true : Boolean(pick.readDefault ?? false),
      };

      setItems((prev) => [next, ...prev].slice(0, 10));
    }, 9000);

    return () => window.clearInterval(id);
  }, [open]);

  const markAllRead = () => {
    setItems((prev) => prev.map((i) => ({ ...i, read: true })));
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
        className="relative inline-flex items-center justify-center rounded-full h-7 w-7 text-xs text-slate-200 hover:bg-white/5 transition-colors"
        aria-label={bellAria}
      >
        <span aria-hidden>🔔</span>
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 h-3.5 min-w-[14px] px-[3px] rounded-full bg-rose-500 text-[9px] font-semibold text-white flex items-center justify-center">
            {Math.min(99, unreadCount)}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-9 w-[320px] max-w-[calc(100vw-24px)] z-[70]">
          <div className="rounded-2xl glass-panel border border-white/10 bg-slate-950/85 backdrop-blur p-3 shadow-[0_0_42px_rgba(0,234,255,0.12)]">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div>
                <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400">Notifications</p>
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
              {items.length === 0 ? (
                <p className="text-[12px] text-slate-400">No notifications.</p>
              ) : (
                items.map((n) => (
                  <button
                    key={n.id}
                    type="button"
                    onClick={() => {
                      setItems((prev) => prev.map((i) => (i.id === n.id ? { ...i, read: true } : i)));
                    }}
                    className="w-full text-left rounded-xl border border-white/5 bg-white/0 hover:bg-white/5 transition-colors px-3 py-2"
                    aria-label={n.text}
                  >
                    <div className="flex items-start gap-2">
                      <span
                        className="mt-[2px] h-2 w-2 rounded-full"
                        style={{ backgroundColor: n.read ? "rgba(148,163,184,0.55)" : "rgba(244,63,94,0.95)" }}
                        aria-hidden
                      />
                      <div className="min-w-0 flex-1">
                        <p className={`text-[12px] ${n.read ? "text-slate-200/90" : "text-white"} leading-relaxed`}>
                          {n.text}
                        </p>
                        <p className="text-[10px] text-slate-500 mt-0.5">{timeAgo(n.createdAt)}</p>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

