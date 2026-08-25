"use client";

import { useEffect, type ReactNode } from "react";
import { motion, AnimatePresence, useAnimationControls } from "framer-motion";
import { cn } from "@/lib/utils";


// ComboSystem — floating "x2 COMBO!" / "ON FIRE!" / "UNSTOPPABLE!"
export function ComboSystem({ combo, color }: { combo: number; color: string }) {
  if (combo < 2) return null;
  const label = combo >= 10 ? "UNSTOPPABLE!" : combo >= 5 ? "ON FIRE!" : `x${combo} COMBO`;
  const col = combo >= 10 ? "#fde047" : combo >= 5 ? "#fb923c" : color;
  return (
    <AnimatePresence>
      <motion.div
        key={combo}
        initial={{ scale: 0.5, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="fixed top-20 left-1/2 -translate-x-1/2 z-[54] pointer-events-none font-extrabold text-xl sm:text-2xl whitespace-nowrap"
        style={{ color: col, textShadow: `0 0 12px ${col}` }}
      >
        {label}
      </motion.div>
    </AnimatePresence>
  );
}

// ScreenShake — shakes children when trigger changes
export function ScreenShake({ trigger, intensity = 4, children }: { trigger: number; intensity?: number; children: ReactNode }) {
  const controls = useAnimationControls();
  useEffect(() => {
    if (trigger === 0) return;
    controls.start({
      x: [0, -intensity, intensity, -intensity * 0.6, intensity * 0.6, 0],
      transition: { duration: 0.4, times: [0, 0.2, 0.4, 0.6, 0.8, 1] },
    });
  }, [trigger, intensity, controls]);
  return <motion.div animate={controls}>{children}</motion.div>;
}

// FloatingText — "+10 XP" floating up and fading
export function FloatingText({ text, x, y, color, trigger }: { text: string; x: number; y: number; color: string; trigger: number }) {
  const controls = useAnimationControls();
  useEffect(() => {
    if (trigger === 0) return;
    controls.start({
      y: [0, -64],
      scale: [0.6, 1.1, 1],
      opacity: [0, 1, 0],
      transition: { duration: 1.1, ease: "easeOut", times: [0, 0.15, 1] },
    });
  }, [trigger, controls]);
  return (
    <motion.div
      initial={{ y: 0, scale: 0.6, opacity: 0 }}
      className="fixed z-[56] pointer-events-none font-extrabold text-base sm:text-lg whitespace-nowrap"
      style={{ left: x, top: y, marginLeft: "-50%", marginTop: "-0.6em", color, textShadow: `0 0 10px ${color}, 0 2px 4px rgba(0,0,0,0.6)` }}
      animate={controls}
    >
      {text}
    </motion.div>
  );
}



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
