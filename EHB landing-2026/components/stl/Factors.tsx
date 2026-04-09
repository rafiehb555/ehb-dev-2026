"use client";

import Card from "@/components/ui/Card";
import { motion } from "framer-motion";

const factors = [
  { name: "PSS", value: 80 },
  { name: "CRB", value: 60, weakest: true },
  { name: "DMO", value: 75 },
  { name: "Franchise", value: 50 },
];

export default function Factors() {
  return (
    <Card size="large">
      <h3 className="text-sm text-gray-400">STL Factors</h3>

      <div className="mt-4 space-y-3">
        {factors.map((f) => (
          <div key={f.name} className={f.weakest ? "rounded-md border border-rose-500/25 bg-rose-500/5 p-1.5" : ""}>
            <div className="flex justify-between text-xs">
              <span>{f.name}</span>
              <span className={f.weakest ? "text-rose-300" : ""}>{f.value}%</span>
            </div>
            <div className="mt-1 h-1.5 w-full rounded-full bg-white/10">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${f.value}%` }}
                transition={{ duration: 0.65, ease: "easeOut" }}
                className={`h-1.5 rounded-full ${
                  f.weakest
                    ? "bg-gradient-to-r from-rose-500 to-rose-300"
                    : "bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400"
                }`}
              />
            </div>
            {f.weakest ? <p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-rose-300">Needs attention</p> : null}
          </div>
        ))}
      </div>
    </Card>
  );
}

