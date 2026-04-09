"use client";

import { BadgeCheck, Building2, ShieldCheck, Target } from "lucide-react";
import { motion } from "framer-motion";
import Card from "@/components/ui/Card";

const data = [
  { name: "PSS", value: "80%", icon: ShieldCheck, tone: "text-emerald-300", status: "Good" },
  { name: "CRB", value: "60%", icon: BadgeCheck, tone: "text-rose-300", status: "Weakest" },
  { name: "DMO", value: "75%", icon: Target, tone: "text-cyan-300", status: "Stable" },
  { name: "Franchise", value: "50%", icon: Building2, tone: "text-amber-300", status: "Pending" },
];

export default function Snapshot() {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
      className="grid grid-cols-2 gap-3 md:grid-cols-4"
    >
      {data.map((item) => (
        <motion.div key={item.name} variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }}>
          <Card
            size="small"
            className={`rounded-xl border bg-white/[0.04] p-4 text-center backdrop-blur-lg transition duration-200 hover:-translate-y-1 hover:shadow-lg ${
              item.name === "CRB"
                ? "border-rose-500/35 hover:shadow-rose-500/20"
                : "border-white/10 hover:shadow-cyan-500/15"
            }`}
          >
            <item.icon className={`mx-auto mb-2 h-4 w-4 ${item.tone}`} />
            <div className="text-xs text-gray-400">{item.name}</div>
            <div className="text-lg font-semibold">{item.value}</div>
            <p className={`mt-1 text-[10px] uppercase tracking-[0.14em] ${item.name === "CRB" ? "text-rose-300" : "text-gray-500"}`}>
              {item.status}
            </p>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
}

