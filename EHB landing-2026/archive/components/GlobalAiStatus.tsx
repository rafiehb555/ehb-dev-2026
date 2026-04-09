/** Archived - not used in production */

"use client";

import { useEffect, useState } from "react";

const MESSAGES = [
  "AI is analyzing opportunities for you…",
  "Scanning 32 industries for best matches…",
  "Finding services that fit your skills…",
  "Checking new jobs and projects in your area…",
  "Watching marketplace activity in real time…",
];

export function GlobalAiStatus() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % MESSAGES.length);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="w-full border-b border-white/5 bg-black/20">
      <div className="container-ehb py-2 flex items-center justify-center gap-2 text-[11px] sm:text-xs text-ehb-textBody">
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-400/40 px-2 py-[2px] text-[10px] font-semibold text-emerald-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping-slow" aria-hidden />
          <span>AI Status</span>
        </span>
        <span className="text-ehb-textBody/90 ai-status-text truncate max-w-[220px] sm:max-w-[360px]">
          {MESSAGES[index]}
        </span>
      </div>
    </div>
  );
}

