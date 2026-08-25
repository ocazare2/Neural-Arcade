"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

export type MascotMood = "idle" | "happy" | "thinking" | "excited" | "struggling";

export const MASCOT_PHRASES = {
  welcome: ["¡Hola! Soy Neuro. Vamos a construir IA juntos.", "¿List@ para entrenar tu primera red neuronal?"],
  levelComplete: ["¡Lo lograste! Tu IA está aprendiendo.", "Ese concepto era difícil. ¡Respeto!", "¡Excelente! Neuro está orgulloso."],
  levelStart: ["Concentrá. Este es importante.", "Ya casi lo tienes.", "Tú puedes."],
  combo: ["¡En racha!", "¡Estás en fuego!", "¡Imparable!"],
  wrong: ["Tranqui, eso pasa. Intenta de nuevo.", "Error = aprendizaje. Otra vez."],
  hint: ["Piensa paso a paso.", "¿Qué conceptos viste antes?"],
  idle: ["Bienvenid@. Yo te guío, vos jugás.", "Cada nivel es un mini-juego.", "Aprender IA jugando es posible."],
  mastery: ["¡Maestría total! Ya entendiste el concepto.", "Lo dominaste. Neuro impresionado."],
  goodbye: ["¡Volvé pronto! Neuro te espera.", "Hasta la próxima, neuroaprendiz."],
};

export function pickPhrase(key: keyof typeof MASCOT_PHRASES, seed?: number): string {
  const arr = MASCOT_PHRASES[key];
  return arr[seed !== undefined ? seed % arr.length : Math.floor(Math.random() * arr.length)];
}

const MOOD_COLORS: Record<MascotMood, { body: string; glow: string }> = {
  idle: { body: "#22d3ee", glow: "#22d3ee55" },
  happy: { body: "#22d3ee", glow: "#22d3ee88" },
  thinking: { body: "#fbbf24", glow: "#fbbf2455" },
  excited: { body: "#f472b6", glow: "#f472b688" },
  struggling: { body: "#fb7185", glow: "#fb718555" },
};

export function Mascot({ mood = "idle", message, size = 80, trackCursor = true }: {
  mood?: MascotMood;
  message?: string;
  size?: number;
  trackCursor?: boolean;
}) {
  const ref = useRef<SVGSVGElement>(null);
  const [pupil, setPupil] = useState({ x: 0, y: 0 });
  const [showBubble, setShowBubble] = useState(false);
  const colors = MOOD_COLORS[mood];

  useEffect(() => {
    if (!message) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-shot trigger when message prop changes
    setShowBubble(true);
    const t = setTimeout(() => setShowBubble(false), 5000);
    return () => clearTimeout(t);
  }, [message]);

  useEffect(() => {
    if (!trackCursor) return;
    const handler = (e: MouseEvent) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      const max = size * 0.04;
      const scale = dist > 0 ? Math.min(max, dist / 20) / dist : 0;
      setPupil({ x: dx * scale, y: dy * scale });
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, [trackCursor, size]);

  const anim = mood === "happy" ? { scale: [1, 1.08, 1], y: [0, -4, 0] }
    : mood === "thinking" ? { scale: [1, 1.05, 1] }
    : mood === "excited" ? { rotate: [0, -5, 5, 0], scale: [1, 1.1, 1] }
    : mood === "struggling" ? { x: [0, -2, 2, 0] }
    : { y: [0, -3, 0] };

  return (
    <div className="relative inline-block" style={{ width: size, height: size }}>
      <motion.svg
        ref={ref}
        width={size}
        height={size}
        viewBox="0 0 100 100"
        animate={anim}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        style={{ filter: `drop-shadow(0 0 8px ${colors.glow})` }}
      >
        {/* Body — neural net orb */}
        <circle cx="50" cy="50" r="38" fill={colors.body} opacity="0.15" />
        <circle cx="50" cy="50" r="32" fill="none" stroke={colors.body} strokeWidth="2" opacity="0.6" />
        {/* Nodes */}
        <circle cx="30" cy="40" r="4" fill={colors.body} />
        <circle cx="30" cy="60" r="4" fill={colors.body} />
        <circle cx="50" cy="35" r="4" fill={colors.body} />
        <circle cx="50" cy="65" r="4" fill={colors.body} />
        <circle cx="70" cy="50" r="4" fill={colors.body} />
        {/* Edges */}
        <line x1="30" y1="40" x2="50" y2="35" stroke={colors.body} strokeWidth="1" opacity="0.4" />
        <line x1="30" y1="40" x2="50" y2="65" stroke={colors.body} strokeWidth="1" opacity="0.4" />
        <line x1="30" y1="60" x2="50" y2="35" stroke={colors.body} strokeWidth="1" opacity="0.4" />
        <line x1="30" y1="60" x2="50" y2="65" stroke={colors.body} strokeWidth="1" opacity="0.4" />
        <line x1="50" y1="35" x2="70" y2="50" stroke={colors.body} strokeWidth="1" opacity="0.4" />
        <line x1="50" y1="65" x2="70" y2="50" stroke={colors.body} strokeWidth="1" opacity="0.4" />
        {/* Eyes */}
        <ellipse cx="42" cy="50" rx="6" ry="7" fill="white" />
        <ellipse cx="58" cy="50" rx="6" ry="7" fill="white" />
        <circle cx={42 + pupil.x} cy={50 + pupil.y} r="3" fill="#0a0414" />
        <circle cx={58 + pupil.x} cy={50 + pupil.y} r="3" fill="#0a0414" />
        {/* Antenna */}
        <line x1="50" y1="18" x2="50" y2="10" stroke={colors.body} strokeWidth="1.5" />
        <motion.circle cx="50" cy="8" r="2" fill={colors.body}
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </motion.svg>
      {showBubble && message && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 5 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 rounded-lg bg-slate-900 border border-cyan-500/40 text-xs text-slate-200 shadow-xl whitespace-nowrap max-w-[260px] text-center"
          style={{ fontSize: Math.max(10, size * 0.13) }}
        >
          {message}
        </motion.div>
      )}
    </div>
  );
}
