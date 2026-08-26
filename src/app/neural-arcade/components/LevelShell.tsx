"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, CheckCircle2, Star, RotateCcw, Home, GraduationCap } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { LevelMeta, Phase } from "../types";
import { useArcade } from "../store";
import { useLocale } from "../i18n";
import type { MessageKey } from "../i18n";
import { ExperienceControls } from "./ExperienceControls";

const PHASES: { key: Phase; labelKey: MessageKey }[] = [
  { key: "theory", labelKey: "phaseTheory" },
  { key: "demo", labelKey: "phaseDemo" },
  { key: "practice", labelKey: "phasePractice" },
  { key: "challenge", labelKey: "phaseChallenge" },
  { key: "mastery", labelKey: "phaseMastery" },
];

const EMPTY_PHASES: readonly Phase[] = [];

export function LevelShell({
  level,
  currentPhase,
  onPhaseChange,
  children,
}: {
  level: LevelMeta;
  currentPhase: Phase;
  onPhaseChange: (p: Phase) => void;
  children: ReactNode;
}) {
  const closeLevel = useArcade(s => s.closeLevel);
  const { t } = useLocale();
  // Returning a fresh [] inside the selector changes the snapshot on every
  // read and can trigger React's maximum-update-depth protection.
  const storedPhases = useArcade(s => s.progress[level.id]?.phasesDone);
  const completedPhases = storedPhases ?? EMPTY_PHASES;
  const phaseIdx = PHASES.findIndex(p => p.key === currentPhase);
  const highestCompletedIdx = PHASES.reduce(
    (highest, phase, index) => completedPhases.includes(phase.key) ? Math.max(highest, index) : highest,
    -1,
  );
  const highestAccessibleIdx = Math.max(
    phaseIdx,
    Math.min(PHASES.length - 1, highestCompletedIdx + 1),
  );

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header sticky */}
      <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/90 backdrop-blur supports-[backdrop-filter]:bg-slate-950/60">
        <div className="max-w-3xl mx-auto px-3 py-2.5 flex items-center gap-3">
          <button
            onClick={closeLevel}
            className="rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-slate-300 hover:bg-slate-800 transition"
            aria-label={t("back")}
          >
            <Home className="w-4 h-4" />
          </button>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-lg" aria-hidden>{level.icon}</span>
              <h1 className="text-sm font-bold tracking-wide" style={{ color: level.color }}>
                {t("level")} {level.index + 1} · {level.title}
              </h1>
            </div>
            <p className="text-[11px] text-slate-400 truncate">{level.tag}</p>
          </div>
          <div className="hidden sm:flex items-center gap-1 text-xs text-slate-400">
            <GraduationCap className="w-3.5 h-3.5" />
            ~{level.estimatedMin}{t("minute")}
          </div>
          <ExperienceControls compact className="flex-shrink-0 border-0 bg-transparent p-0 shadow-none" />
        </div>

        {/* Phase stepper */}
        <div className="max-w-3xl mx-auto px-3 pb-2.5">
          <div className="flex items-center gap-1 overflow-x-auto">
            {PHASES.map((p, i) => {
              const done = completedPhases.includes(p.key);
              const active = i === phaseIdx;
              const accessible = i <= highestAccessibleIdx;
              return (
                <button
                  key={p.key}
                  onClick={() => accessible && onPhaseChange(p.key)}
                  disabled={!accessible}
                  className={cn(
                    "flex items-center gap-1.5 px-2 py-1 rounded-md transition flex-shrink-0",
                    active && "bg-slate-800",
                    done && "hover:bg-slate-800 cursor-pointer",
                    !accessible && "opacity-40 cursor-not-allowed"
                  )}
                >
                  <div
                    className={cn(
                      "w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border",
                      done
                        ? "bg-emerald-500/20 border-emerald-500 text-emerald-400"
                        : active
                        ? "border-cyan-500 text-cyan-300"
                        : "border-slate-700 text-slate-500"
                    )}
                  >
                    {done ? <CheckCircle2 className="w-3 h-3" /> : i + 1}
                  </div>
                  <span
                    className={cn(
                      "text-[11px] font-medium whitespace-nowrap",
                      active ? "text-slate-100" : done ? "text-slate-300" : "text-slate-500"
                    )}
                  >
                    {t(p.labelKey)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Content — pt-20 ensures sticky header never covers quiz buttons */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-3 pt-20 pb-6 sm:pt-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPhase}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

// Botón grande de "siguiente fase"
export function NextPhaseButton({
  currentPhase,
  onNext,
  color,
  label,
}: {
  currentPhase: Phase;
  onNext: () => void;
  color: string;
  label?: string;
}) {
  const { t } = useLocale();
  const next = PHASES[PHASES.findIndex(p => p.key === currentPhase) + 1];
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onNext}
      className="w-full mt-4 rounded-xl py-3.5 font-bold text-sm tracking-wide flex items-center justify-center gap-2 transition"
      style={{
        background: color,
        color: "#0a0414",
        boxShadow: `0 6px 24px ${color}55`,
      }}
    >
      {label ?? (next ? `${t("continueTo")} ${t(next.labelKey).toUpperCase()}` : t("completeLevel"))}
      {next && <ArrowRight className="w-4 h-4" />}
    </motion.button>
  );
}

// Pantalla de finalización del nivel
export function LevelComplete({
  stars,
  level,
  isLastLevel = false,
  onRetry,
  onNextLevel,
}: {
  stars: number;
  level: LevelMeta;
  isLastLevel?: boolean;
  onRetry: () => void;
  onNextLevel: () => void;
}) {
  const { t } = useLocale();
  return (
    <div className="text-center py-8">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200 }}
        className="text-6xl mb-4"
      >
        {stars === 3 ? "🏆" : stars === 2 ? "🎉" : "👍"}
      </motion.div>
      <div className="flex justify-center gap-1.5 mb-3">
        {[0, 1, 2].map(i => (
          <motion.div
            key={i}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2 + i * 0.15, type: "spring" }}
          >
            <Star
              className={cn("w-10 h-10", i < stars ? "fill-amber-400 text-amber-400" : "text-slate-700")}
            />
          </motion.div>
        ))}
      </div>
      <h2 className="text-2xl font-extrabold tracking-wider mb-1" style={{ color: level.color }}>
        {isLastLevel ? t("aiArchitect") : t("levelComplete")}
      </h2>
      <p className="text-sm text-slate-400 mb-6">
        {t("mastered")} <b className="text-slate-200">{level.title}</b>
        {isLastLevel && ` · ${t("allLevelsComplete")}`}
      </p>
      <div className="flex gap-2">
        <button
          onClick={onRetry}
          className="flex-1 rounded-xl border border-slate-700 bg-slate-900 py-3 text-sm font-semibold text-slate-300 hover:bg-slate-800 transition flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          {t("retry")}
        </button>
        <button
          onClick={onNextLevel}
          className="flex-1 rounded-xl py-3 text-sm font-bold text-[#0a0414] flex items-center justify-center gap-2"
          style={{ background: level.color }}
        >
          {isLastLevel ? t("backToMap") : t("nextLevel")}
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
