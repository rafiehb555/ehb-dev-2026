"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";

type AnimatedCardProps = {
  children: ReactNode;
  className?: string;
};

export default function AnimatedCard({ children, className = "" }: AnimatedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      whileHover={{ scale: 1.015 }}
      className={`rounded-xl border border-gray-800 bg-[#111827] p-4 transition hover:shadow-lg hover:shadow-green-500/10 ${className}`}
    >
      {children}
    </motion.div>
  );
}

