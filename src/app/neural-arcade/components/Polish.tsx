"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
// PulseButton — buttons that pulse subtly, scale on tap
export function PulseButton({ children, onClick, color = "#22d3ee", disabled, autoFocus, className }: { children: ReactNode; onClick: () => void; color?: string; disabled?: boolean; autoFocus?: boolean; className?: string }) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      autoFocus={autoFocus}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.95 }}
      animate={{ scale: [1, 1.02, 1] }}
      transition={{ scale: { duration: 2, repeat: Infinity, ease: "easeInOut" } }}
      className={cn(
        "rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2",
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
        className
      )}
      style={{
        background: color,
        color: "#0a0414",
        boxShadow: disabled ? "none" : `0 4px 16px ${color}55`,
      }}
    >
      {children}
    </motion.button>
  );
}
