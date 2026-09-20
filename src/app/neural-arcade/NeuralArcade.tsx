"use client";

import { useState, useEffect, lazy, Suspense } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Star, Zap, Lock, Trophy, ChevronRight, RotateCcw, Play, Heart, Route, CheckCircle2 } from "lucide-react";
import { useArcade } from "./store";
import { Mascot, pickPhrase } from "./components/Mascot";
import { Onboarding, hasBeenOnboarded } from "./components/Onboarding";
import { PulseButton } from "./components/Polish";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { ExperienceControls } from "./components/ExperienceControls";
import {
  ALL_LEVELS,
  CURRICULUM_CHAPTERS,
  CURRICULUM_LEVEL_ORDER,
  getLevelPosition,
  getPreviousLevel,
} from "./curriculum";
import { LocaleProvider, useLocale } from "./i18n";
import { cn } from "@/lib/utils";
import { APP_VERSION } from "@/lib/version";
import { getMissionProgress, isLevelComplete, isLevelUnlocked } from "./learning-progress";
import { MISSION_PLANS } from "./mission-plans";

const BeginnerLevel = lazy(() =>
  import("./components/BeginnerLevel").then(m => ({ default: m.BeginnerLevel })),
);
const MissionLevel = lazy(() =>
  import("./components/MissionLevel").then(m => ({ default: m.MissionLevel })),
);

// Loading fallback shown while a mini-game chunk is being fetched.
function GameLoader() {
  const { t } = useLocale();
  return (
    <div className="flex items-center justify-center py-20" role="status" aria-live="polite">
      <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
      <span className="sr-only">{t("loadingDemo")}</span>
    </div>
  );
}

export default function NeuralArcade() {
  return (
    <LocaleProvider>
      <NeuralArcadeContent />
    </LocaleProvider>
  );
}

function NeuralArcadeContent() {
  const { activeLevel, activePhase, closeLevel } = useArcade();
  const shouldReduceMotion = useReducedMotion();

  // Scroll to top on phase change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: shouldReduceMotion ? "auto" : "smooth" });
  }, [activePhase, activeLevel, shouldReduceMotion]);

  // Defensive: if the stored activeLevel ID no longer exists in ALL_LEVELS
  // (state corruption / version bump / deleted level), close it and return home.
  // Must be in an effect — calling zustand setState during render would warn
  // ("Cannot update a component while rendering a different component") and
  // can cause re-render loops.
  useEffect(() => {
    if (activeLevel && !ALL_LEVELS.find(l => l.id === activeLevel)) {
      closeLevel();
    }
  }, [activeLevel, closeLevel]);

  if (activeLevel) {
    const level = ALL_LEVELS.find(l => l.id === activeLevel);
    if (!level) {
      return <ErrorBoundary><HomeView /></ErrorBoundary>;
    }
    if (level.id === "math" || level.id === "tokens") {
      return <ErrorBoundary><Suspense fallback={<GameLoader />}><BeginnerLevel key={level.id} level={level} /></Suspense></ErrorBoundary>;
    }
    const plan = MISSION_PLANS[level.id];
    if (!plan) return <ErrorBoundary><HomeView /></ErrorBoundary>;
    return <ErrorBoundary><Suspense fallback={<GameLoader />}><MissionLevel key={level.id} level={level} plan={plan} /></Suspense></ErrorBoundary>;
  }

  return <ErrorBoundary><HomeView /></ErrorBoundary>;
}

// ═══════════════════════════════════════════════════════════
// HOME — mapa de niveles
// ═══════════════════════════════════════════════════════════
function HomeView() {
  const { progress, xp, openLevel, reset } = useArcade();
  const { t, locale } = useLocale();
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [mounted, setMounted] = useState(false);
  const homeIsInert = showOnboarding || showResetConfirm;
  const totalStars = ALL_LEVELS.reduce((sum, level) => sum + (progress[level.id]?.stars ?? 0), 0);
  const completedCount = ALL_LEVELS.filter(level => isLevelComplete(progress, level.id)).length;
  const allDone = ALL_LEVELS.every(level => isLevelComplete(progress, level.id));

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time mount hydration for SSR-safe localStorage check
    setMounted(true);
    if (!hasBeenOnboarded()) setShowOnboarding(true);
  }, []);

  // Find first playable level (unlocked but not completed)
  const firstPlayableIdx = ALL_LEVELS.findIndex((level, position) =>
    isLevelUnlocked(progress, CURRICULUM_LEVEL_ORDER, position) && !isLevelComplete(progress, level.id),
  );
  const playLevelId = firstPlayableIdx >= 0 ? ALL_LEVELS[firstPlayableIdx].id : ALL_LEVELS[0].id;
  const playLabel = allDone ? t("replayJourney") : firstPlayableIdx <= 0 ? t("play") : t("continue");

  const handleResetDialogKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      setShowResetConfirm(false);
      return;
    }
    if (event.key !== "Tab") return;
    const controls = [...event.currentTarget.querySelectorAll<HTMLButtonElement>("button:not([disabled])")];
    if (controls.length === 0) return;
    const first = controls[0];
    const last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      {/* Onboarding overlay (first visit only) */}
      {mounted && showOnboarding && (
        <Onboarding onComplete={() => setShowOnboarding(false)} />
      )}

      <ExperienceControls
        disabled={homeIsInert}
        className="fixed left-3 top-3 z-30"
      />

      {/* Mascot — top-right */}
      {mounted && !showOnboarding && (
        <div className="fixed top-2 right-2 z-20 hidden sm:block">
          <Mascot mood="idle" size={64} message={pickPhrase("idle")} />
        </div>
      )}

      {/* Decorative particles */}
      <div className="fixed inset-0 pointer-events-none opacity-30" aria-hidden="true">
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full"
            style={{
              left: `${(i * 37) % 100}%`,
              top: `${(i * 53) % 100}%`,
              background: ["#22d3ee", "#a78bfa", "#fbbf24", "#f472b6", "#34d399"][i % 5],
            }}
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{ duration: 2 + (i % 3), repeat: Infinity, delay: i * 0.1 }}
          />
        ))}
      </div>

      <main
        className="relative max-w-3xl mx-auto px-3 sm:px-4 pb-6 pt-20 sm:py-10"
        aria-hidden={homeIsInert ? true : undefined}
        inert={homeIsInert ? true : undefined}
      >
        {/* Header */}
        <header className="text-center mb-6">
          <motion.h1
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-3xl sm:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent"
            style={{ backgroundImage: "linear-gradient(135deg, #22d3ee, #a78bfa, #f472b6)" }}
          >
            NEURAL ARCADE
          </motion.h1>
          <p className="text-[11px] sm:text-xs tracking-[0.3em] text-slate-500 mt-2 uppercase">
            {t("tagline")}
          </p>
        </header>

        {/* PLAY button — most prominent CTA */}
        <div className="flex justify-center mb-6">
          <PulseButton
            onClick={() => openLevel(playLevelId)}
            color="#22d3ee"
            className="px-8 py-4 text-base sm:text-lg"
          >
            <Play className="w-5 h-5 fill-current" />
            {playLabel}
          </PulseButton>
        </div>

        {/* Stats bar */}
        <p className="mb-5 text-center text-sm text-slate-300">{t("beginnerInvitation")}</p>
        <div className="flex items-center justify-center gap-4 sm:gap-6 mb-6">
          <Stat icon={<Star className="w-4 h-4" />} value={`${totalStars}/${ALL_LEVELS.length * 3}`} label={t("stars")} color="#fde047" />
          <Stat icon={<Zap className="w-4 h-4" />} value={xp} label={t("xp")} color="#22d3ee" />
          <Stat icon={<Trophy className="w-4 h-4" />} value={`${completedCount}/${ALL_LEVELS.length}`} label={t("levels")} color="#a78bfa" />
        </div>

        {allDone && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="rounded-2xl border-2 border-amber-400/60 bg-gradient-to-br from-amber-500/15 to-fuchsia-500/10 p-5 text-center mb-6"
          >
            <div className="text-4xl mb-2">🏆</div>
            <p className="text-amber-300 font-extrabold tracking-wider">{t("architect")}</p>
            <p className="text-xs text-slate-300 mt-1.5">
              {t("allDone")}
            </p>
          </motion.div>
        )}

        {/* Ruta pedagógica agrupada por capítulos */}
        <div className="space-y-10">
          {CURRICULUM_CHAPTERS.map((chapter, chapterIndex) => {
            const chapterLevels = chapter.levelIds
              .map((levelId) => ALL_LEVELS.find((level) => level.id === levelId))
              .filter((level): level is (typeof ALL_LEVELS)[number] => Boolean(level));
            const chapterCompleted = chapterLevels.filter((level) => isLevelComplete(progress, level.id)).length;

            return (
              <section key={chapter.id} aria-labelledby={`chapter-${chapter.id}`}>
                <div className="mb-4 rounded-2xl border border-slate-700/70 bg-slate-900/75 p-4 sm:p-5">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-400/30 bg-cyan-400/10 text-cyan-300">
                      <Route className="h-5 w-5" aria-hidden />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-400">
                          {locale === "es" ? `Capítulo ${chapterIndex + 1}` : `Chapter ${chapterIndex + 1}`}
                        </p>
                        <span className="font-mono text-[11px] text-slate-400">
                          {chapterCompleted}/{chapterLevels.length}
                        </span>
                      </div>
                      <h2 id={`chapter-${chapter.id}`} className="mt-1 text-lg font-extrabold text-slate-100">
                        {chapter.title[locale]}
                      </h2>
                      <p className="mt-1 text-sm leading-relaxed text-slate-300">{chapter.goal[locale]}</p>
                    </div>
                  </div>
                  <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-slate-800" aria-hidden>
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-violet-400 transition-all"
                      style={{ width: `${(chapterCompleted / chapterLevels.length) * 100}%` }}
                    />
                  </div>
                </div>

                <ol className="relative ml-3 space-y-3 border-l border-slate-700/80">
                  {chapterLevels.map((lv) => {
                    const position = getLevelPosition(lv.id);
                    const unlocked = isLevelUnlocked(progress, CURRICULUM_LEVEL_ORDER, position);
                    const done = isLevelComplete(progress, lv.id);
                    const missionProgress = getMissionProgress(progress, lv.id);
                    const previous = getPreviousLevel(lv.id);
                    const current = position === firstPlayableIdx;
                    const lockDescriptionId = `lock-${lv.id}`;

                    return (
                      <motion.li
                        key={lv.id}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: Math.min(position * 0.025, 0.35) }}
                        className="relative pl-6"
                      >
                        <span
                          aria-hidden
                          className={cn(
                            "absolute -left-1.5 top-5 h-3 w-3 rounded-full border-2",
                            done
                              ? "border-emerald-300 bg-emerald-400"
                              : current
                                ? "animate-pulse border-cyan-200 bg-cyan-400"
                                : unlocked
                                  ? "border-slate-400 bg-slate-700"
                                  : "border-slate-700 bg-slate-900",
                          )}
                        />
                        <button
                          type="button"
                          onClick={() => unlocked && openLevel(lv.id)}
                          aria-disabled={!unlocked}
                          aria-describedby={!unlocked ? lockDescriptionId : undefined}
                          className={cn(
                            "w-full rounded-2xl border-2 p-4 text-left transition",
                            unlocked
                              ? "cursor-pointer hover:-translate-y-0.5 hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
                              : "cursor-not-allowed border-slate-800 bg-slate-950/50 opacity-60",
                          )}
                          style={unlocked ? {
                            borderColor: done ? `${lv.color}88` : lv.color,
                            background: done
                              ? `linear-gradient(135deg, ${lv.color}1f, rgba(15,23,42,.72))`
                              : "rgba(15, 23, 42, 0.72)",
                            boxShadow: current ? `0 0 24px ${lv.color}2f` : "none",
                          } : undefined}
                        >
                          <div className="flex items-start gap-3">
                            <span className="mt-0.5 text-3xl" aria-hidden>
                              {unlocked ? lv.icon : <Lock className="h-6 w-6 text-slate-600" />}
                            </span>
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="font-mono text-[10px] text-slate-500">N{lv.index + 1}</span>
                                <h3 className="break-words text-sm font-extrabold tracking-wide" style={{ color: unlocked ? lv.color : "#64748b" }}>
                                  {lv.title}
                                </h3>
                                {current && !done && (
                                  <span className="rounded-full bg-cyan-400/15 px-2 py-0.5 text-[9px] font-extrabold tracking-wider text-cyan-300">
                                    {locale === "es" ? "SIGUIENTE" : "NEXT"}
                                  </span>
                                )}
                                {done && (
                                  <span className="rounded-full bg-emerald-400/10 px-2 py-0.5 text-[9px] font-extrabold tracking-wider text-emerald-300">
                                    {locale === "es" ? "COMPLETADO" : "COMPLETE"}
                                  </span>
                                )}
                              </div>
                              <p className="mt-1 text-xs leading-relaxed text-slate-400">{lv.summary}</p>
                              <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px]">
                                <span className="font-semibold text-cyan-300">
                                  {missionProgress.completed}/4 {locale === "es" ? "misiones" : "missions"}
                                </span>
                                <span className="text-slate-500">~{lv.estimatedMin} {t("minute")}</span>
                                {unlocked && <span className="text-slate-500">{lv.concepts.length} {locale === "es" ? "conceptos" : "concepts"}</span>}
                              </div>
                              {!unlocked && previous && (
                                <p id={lockDescriptionId} className="mt-2 text-[11px] font-semibold text-amber-300/80">
                                  {locale === "es" ? `Completa ${previous.title} para desbloquear` : `Complete ${previous.title} to unlock`}
                                </p>
                              )}
                              {progress[lv.id]?.stars ? (
                                <div className="mt-2 flex gap-0.5" aria-label={`${progress[lv.id].stars} ${t("stars")}`}>
                                  {[0, 1, 2].map((star) => (
                                    <Star key={star} className={cn("h-3 w-3", star < progress[lv.id].stars ? "fill-amber-400 text-amber-400" : "text-slate-700")} />
                                  ))}
                                </div>
                              ) : null}
                            </div>
                            {unlocked && !done && <ChevronRight className="mt-1 h-4 w-4 shrink-0" style={{ color: lv.color }} aria-hidden />}
                            {done && <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-emerald-400" aria-hidden />}
                          </div>
                        </button>
                      </motion.li>
                    );
                  })}
                </ol>

                <p className="ml-9 mt-4 rounded-xl border border-violet-400/15 bg-violet-500/5 p-3 text-xs leading-relaxed text-violet-200/80">
                  {chapter.bridge[locale]}
                </p>
              </section>
            );
          })}
        </div>
        {/* Footer */}
        <footer className="mt-12 pt-6 border-t border-slate-800 text-center space-y-4">
          <p className="text-xs text-slate-500">
            Neural Arcade v{APP_VERSION} · {ALL_LEVELS.length} {t("levels")} · {ALL_LEVELS.length * 4} {locale === "es" ? "misiones jugables" : "playable missions"} · {ALL_LEVELS.reduce((sum, level) => sum + level.concepts.length, 0)} {locale === "es" ? "conceptos explicados" : "concepts explained"}
          </p>

          {/* Made with */}
          <p className="text-[10px] text-slate-600 flex items-center justify-center gap-1">
            <Heart className="w-2.5 h-2.5 text-rose-500 fill-rose-500" /> {t("madeFor")}
          </p>
          <p className="text-[10px] text-slate-500">
            {t("aiCredit")}
          </p>

          <button
            onClick={() => setShowResetConfirm(true)}
            className="text-xs text-slate-600 hover:text-slate-400 inline-flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            {t("resetProgress")}
          </button>
        </footer>
      </main>

      {/* Reset confirmation */}
      <AnimatePresence>
        {showResetConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowResetConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={e => e.stopPropagation()}
              onKeyDown={handleResetDialogKeyDown}
              role="dialog"
              aria-modal="true"
              aria-labelledby="reset-progress-title"
              aria-describedby="reset-progress-description"
              className="bg-slate-900 border border-slate-700 rounded-2xl p-5 max-w-sm w-full"
            >
              <p id="reset-progress-title" className="text-sm font-bold text-slate-100 mb-2">{t("resetTitle")}</p>
              <p id="reset-progress-description" className="text-xs text-slate-400 mb-4">{t("resetDescription")}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => { reset(); setShowResetConfirm(false); }}
                  className="flex-1 rounded-lg bg-rose-500 py-2 text-sm font-bold text-white hover:bg-rose-600"
                >
                  {t("confirmReset")}
                </button>
                <button
                  autoFocus
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 rounded-lg border border-slate-700 py-2 text-sm text-slate-300 hover:bg-slate-800"
                >
                  {t("cancel")}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Stat({ icon, value, label, color }: { icon: React.ReactNode; value: React.ReactNode; label: string; color: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center gap-1.5" style={{ color }}>
        {icon}
        <span className="font-mono font-bold text-base sm:text-lg">{value}</span>
      </div>
      <span className="text-[10px] text-slate-500 uppercase tracking-wider">{label}</span>
    </div>
  );
}
