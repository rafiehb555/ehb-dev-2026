"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";

export function SuperTopbar() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function submitSearch(e: FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    router.push(`/search?q=${encodeURIComponent(q)}`);
  }

  return (
    <div className="rounded-2xl border border-cyan-400/20 bg-gradient-to-r from-[#031225]/90 via-[#04182e]/90 to-[#041326]/90 p-3 sm:p-4 shadow-[0_16px_40px_rgba(2,8,23,0.55)]">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <form onSubmit={submitSearch} className="flex-1">
          <div className="flex items-center rounded-xl border border-white/15 bg-black/20 px-3 py-2 text-sm text-ehb-textBody">
            <span className="mr-2" aria-hidden>
              🔍
            </span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search services, users, products, actions..."
              className="w-full bg-transparent outline-none placeholder:text-slate-500"
            />
          </div>
        </form>
        <div className="flex items-center gap-2">
          <Link href="/notifications" className="ehb-btn-secondary ehb-press">
            🔔 Notifications
          </Link>
          <Link href="/ai-marketplace" className="ehb-btn-primary ehb-press">
            🤖 AI Assistant
          </Link>
          <Link href="/profile" className="ehb-btn-secondary ehb-press">
            👤 Profile
          </Link>
        </div>
      </div>
    </div>
  );
}

