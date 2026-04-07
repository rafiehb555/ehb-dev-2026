"use client";

import { ChevronDown } from "lucide-react";
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export type AccordionItem = {
  id: string;
  title: ReactNode;
  content: ReactNode;
  icon?: ReactNode;
  accentClassName?: string;
};

export function Accordion({ items, defaultOpenId }: { items: AccordionItem[]; defaultOpenId?: string }) {
  const [open, setOpen] = useState<string | null>(defaultOpenId ?? items[0]?.id ?? null);

  return (
    <div className="space-y-2">
      {items.map((item) => {
        const isOpen = open === item.id;
        return (
          <div
            key={item.id}
            className={cn(
              "overflow-hidden rounded-xl border transition-colors",
              isOpen ? "border-cyan-500/30 bg-slate-900/50" : "border-white/10 bg-slate-950/40 hover:border-white/15",
            )}
          >
            <button
              type="button"
              aria-expanded={isOpen}
              className={cn(
                "flex w-full items-center gap-3 px-4 py-3 text-left transition-colors",
                item.accentClassName,
                "hover:bg-slate-800/40",
              )}
              onClick={() => setOpen(isOpen ? null : item.id)}
            >
              {item.icon ? <span className="shrink-0 text-ehb-textBody">{item.icon}</span> : null}
              <span className="min-w-0 flex-1 text-[13px] font-semibold text-white">{item.title}</span>
              <ChevronDown className={cn("h-4 w-4 shrink-0 text-ehb-textMuted transition-transform", isOpen ? "rotate-180" : "")} />
            </button>
            {isOpen ? (
              <div className="border-t border-white/5 px-4 py-3 text-[12px] leading-relaxed text-ehb-textBody">{item.content}</div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
