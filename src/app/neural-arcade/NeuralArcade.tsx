"use client";

import { useState, useEffect, lazy, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Zap, Lock, Trophy, ChevronRight, RotateCcw, Sparkles, BookOpen, Play, Heart } from "lucide-react";
import { useArcade } from "./store";
import { LevelShell, NextPhaseButton, LevelComplete } from "./components/LevelShell";
import { TheoryPhase, MasteryPhase } from "./components/StandardPhases";
import { QuizRunner } from "./components/QuizRunner";
import { PRACTICE_QUESTIONS, CHALLENGE_QUESTIONS } from "./quizzes";
import { Mascot, pickPhrase } from "./components/Mascot";
import { Onboarding, hasBeenOnboarded } from "./components/Onboarding";
import { PulseButton } from "./components/Polish";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { ExperienceControls } from "./components/ExperienceControls";
import type { Phase, LevelMeta } from "./types";
import { ALL_LEVELS } from "./curriculum";
import { LocaleProvider, useLocale } from "./i18n";
import { cn } from "@/lib/utils";
import { APP_VERSION } from "@/lib/version";

// ─────────────────────────────────────────────────────────────
// Code-splitting: each mini-game is loaded lazily ONLY when the
// user reaches the "demo" phase of the corresponding level.
// On the home screen (level map), none of these chunks are fetched,
// keeping the initial bundle small.
// ─────────────────────────────────────────────────────────────
const TokenSurgeonGame = lazy(() =>
  import("./components/MiniGames").then(m => ({ default: m.TokenSurgeonGame })),
);
const AttentionConnectGame = lazy(() =>
  import("./components/MiniGames").then(m => ({ default: m.AttentionConnectGame })),
);
const GradientRollerGame = lazy(() =>
  import("./components/MiniGames").then(m => ({ default: m.GradientRollerGame })),
);
const EmbeddingSpaceGame = lazy(() =>
  import("./components/MiniGames").then(m => ({ default: m.EmbeddingSpaceGame })),
);
const NeuronBuilderGame = lazy(() =>
  import("./components/MiniGames").then(m => ({ default: m.NeuronBuilderGame })),
);
const BackpropTracerGame = lazy(() =>
  import("./components/MiniGames").then(m => ({ default: m.BackpropTracerGame })),
);
const TransformerStackGame = lazy(() =>
  import("./components/MiniGames").then(m => ({ default: m.TransformerStackGame })),
);
const TokenGeneratorGame = lazy(() =>
  import("./components/MiniGames").then(m => ({ default: m.TokenGeneratorGame })),
);
const AlignmentSorterGame = lazy(() =>
  import("./components/MiniGames").then(m => ({ default: m.AlignmentSorterGame })),
);
const RagHunterGame = lazy(() =>
  import("./components/MiniGames").then(m => ({ default: m.RagHunterGame })),
);
const AgentLoopGame = lazy(() =>
  import("./components/MiniGames").then(m => ({ default: m.AgentLoopGame })),
);
const OrchestratorGame = lazy(() =>
  import("./components/MiniGames").then(m => ({ default: m.OrchestratorGame })),
);
const MathPlaygroundGame = lazy(() =>
  import("./components/MiniGames").then(m => ({ default: m.MathPlaygroundGame })),
);
const ModernConceptGame = lazy(() =>
  import("./components/ModernConceptGame").then(m => ({ default: m.ModernConceptGame })),
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

const DEMOS: Record<string, React.ComponentType<{ color: string; levelId?: string }>> = {
  math: MathPlaygroundGame,
  tokens: TokenSurgeonGame,
  embed: EmbeddingSpaceGame,
  neuron: NeuronBuilderGame,
  backprop: BackpropTracerGame,
  grad: GradientRollerGame,
  attn: AttentionConnectGame,
  trans: TransformerStackGame,
  gen: TokenGeneratorGame,
  align: AlignmentSorterGame,
  rag: RagHunterGame,
  agent: AgentLoopGame,
  orch: OrchestratorGame,
  posttraining: ModernConceptGame,
  inference: ModernConceptGame,
  multimodal: ModernConceptGame,
  context: ModernConceptGame,
  memory: ModernConceptGame,
  tools: ModernConceptGame,
  reasoning: ModernConceptGame,
  skills: ModernConceptGame,
  mcp: ModernConceptGame,
  safety: ModernConceptGame,
  hardware: ModernConceptGame,
  scaling: ModernConceptGame,
  modern: ModernConceptGame,
};

const PHASE_ORDER: Phase[] = ["theory", "demo", "practice", "challenge", "mastery"];

export default function NeuralArcade() {
  return (
    <LocaleProvider>
      <NeuralArcadeContent />
    </LocaleProvider>
  );
}

function NeuralArcadeContent() {
  const { activeLevel, activePhase, closeLevel } = useArcade();

  // Scroll to top on phase change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activePhase, activeLevel]);

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
    return <ErrorBoundary><LevelView key={level.id} level={level} /></ErrorBoundary>;
  }

  return <ErrorBoundary><HomeView /></ErrorBoundary>;
}

// ═══════════════════════════════════════════════════════════
// HOME — mapa de niveles
// ═══════════════════════════════════════════════════════════
function HomeView() {
  const { progress, xp, openLevel, reset } = useArcade();
  const { t } = useLocale();
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [mounted, setMounted] = useState(false);
  const homeIsInert = showOnboarding || showResetConfirm;
  const totalStars = ALL_LEVELS.reduce((sum, level) => sum + (progress[level.id]?.stars ?? 0), 0);
  const completedCount = ALL_LEVELS.filter(level => progress[level.id]?.phasesDone?.includes("challenge")).length;
  const allDone = ALL_LEVELS.every(level => progress[level.id]?.phasesDone?.includes("challenge"));

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time mount hydration for SSR-safe localStorage check
    setMounted(true);
    if (!hasBeenOnboarded()) setShowOnboarding(true);
  }, []);

  // Find first playable level (unlocked but not completed)
  const firstPlayableIdx = ALL_LEVELS.findIndex(l => {
    const i = ALL_LEVELS.indexOf(l);
    const unlocked = i === 0 || progress[ALL_LEVELS[i - 1].id]?.phasesDone?.includes("challenge");
    const done = progress[l.id]?.phasesDone?.includes("challenge");
    return unlocked && !done;
  });
  const playLevelId = firstPlayableIdx >= 0 ? ALL_LEVELS[firstPlayableIdx].id : ALL_LEVELS[0].id;
  const playLabel = firstPlayableIdx <= 0 ? t("play") : t("continue");

  const isUnlocked = (i: number) => i === 0 || progress[ALL_LEVELS[i - 1].id]?.phasesDone?.includes("challenge");

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

        {/* Path of levels */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-cyan-500/30 via-fuchsia-500/30 to-amber-500/30" />

          <div className="space-y-3">
            {ALL_LEVELS.map((lv, i) => {
              const unlocked = isUnlocked(i);
              const stars = progress[lv.id]?.stars ?? 0;
              const done = progress[lv.id]?.phasesDone?.includes("challenge");
              const left = i % 2 === 0;

              return (
                <motion.div
                  key={lv.id}
                  initial={{ opacity: 0, x: left ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className={cn(
                    "relative pl-10 sm:pl-0",
                    left ? "sm:pr-1/2" : "sm:pl-1/2"
                  )}
                >
                  {/* Node on the line */}
                  <div
                    className={cn(
                      "absolute top-4 w-3 h-3 rounded-full border-2 -translate-x-1/2 sm:left-1/2 left-4",
                      done ? "bg-emerald-400 border-emerald-300" : unlocked ? "bg-cyan-400 border-cyan-300 animate-pulse" : "bg-slate-800 border-slate-700"
                    )}
                  />

                  <button
                    onClick={() => unlocked && openLevel(lv.id)}
                    disabled={!unlocked}
                    className={cn(
                      "w-full sm:w-[calc(50%-1.5rem)] rounded-2xl border-2 p-4 text-left transition-all",
                      left ? "sm:mr-auto" : "sm:ml-auto",
                      unlocked
                        ? "hover:scale-[1.02] cursor-pointer"
                        : "opacity-40 cursor-not-allowed",
                    )}
                    style={{
                      borderColor: unlocked ? lv.color : "#334155",
                      background: done
                        ? `linear-gradient(135deg, ${lv.color}22, transparent)`
                        : "rgba(15, 23, 42, 0.6)",
                      boxShadow: unlocked && !done ? `0 0 24px ${lv.color}33` : "none",
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-3xl flex-shrink-0">{unlocked ? lv.icon : <Lock className="w-6 h-6 text-slate-600" />}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-slate-500 font-mono">N{lv.index + 1}</span>
                          <h3 className="text-sm font-extrabold tracking-wide" style={{ color: unlocked ? lv.color : "#64748b" }}>
                            {lv.title}
                          </h3>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{lv.tag}</p>
                        {stars > 0 && (
                          <div className="flex gap-0.5 mt-1">
                            {[0, 1, 2].map(s => (
                              <Star key={s} className={cn("w-3 h-3", s < stars ? "fill-amber-400 text-amber-400" : "text-slate-700")} />
                            ))}
                          </div>
                        )}
                      </div>
                      {unlocked && !done && <ChevronRight className="w-4 h-4 flex-shrink-0" style={{ color: lv.color }} />}
                      {done && <span className="text-emerald-400 text-xl">✓</span>}
                    </div>
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-6 border-t border-slate-800 text-center space-y-4">
          <p className="text-xs text-slate-500">
            Neural Arcade v{APP_VERSION} · {ALL_LEVELS.length} {t("levels")} · {ALL_LEVELS.reduce((s, l) => s + l.theory.length, 0)} {t("theoryBlocks")} · 26 {t("demos")} · {t("interactiveGlossary")}
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

// ═══════════════════════════════════════════════════════════
// LEVEL VIEW — maneja las 5 fases
// ═══════════════════════════════════════════════════════════
function LevelView({ level }: { level: LevelMeta }) {
  const { activePhase, setPhase, completePhase, closeLevel, openLevel, progress } = useArcade();
  const { t } = useLocale();
  const [challengeStars, setChallengeStars] = useState<number | null>(null);
  const [showComplete, setShowComplete] = useState(false);

  const DemoComponent = DEMOS[level.id];
  const practiceQs = PRACTICE_QUESTIONS[level.id] ?? [];
  const challengeQs = CHALLENGE_QUESTIONS[level.id] ?? [];

  const handleNext = () => {
    const idx = PHASE_ORDER.indexOf(activePhase);
    completePhase(level.id, activePhase);
    if (idx < PHASE_ORDER.length - 1) {
      setPhase(PHASE_ORDER[idx + 1]);
    } else {
      setShowComplete(true);
    }
  };

  // Wrap setPhase so that navigating BACK to the challenge phase (via the
  // stepper) clears the previously-earned stars. Without this, the
  // "CONTINUAR A MAESTRÍA" button would still be visible and the user could
  // skip re-taking the quiz. The QuizRunner remounts on phase change
  // (keyed by currentPhase in LevelShell), so its internal state is already
  // fresh — we just need to clear the parent's cached stars.
  const handlePhaseChange = (p: Phase) => {
    if (p === "challenge" && activePhase !== "challenge") {
      setChallengeStars(null);
    }
    setPhase(p);
  };

  if (showComplete) {
    // Detect if this is the final level (no level with a higher index exists).
    const nextIdx = level.index + 1;
    const hasNextLevel = nextIdx < 0
      ? true // MATH_LEVEL (index=-1) always has tokens (index=0) next
      : ALL_LEVELS.some(l => l.index === nextIdx);
    // Show the BEST stars earned (persisted max from store), not just the
    // most-recent attempt. Otherwise a user who got 3★, retried, and got 1★
    // would see 1★ on this screen while the home screen correctly shows 3★.
    const bestStars = Math.max(challengeStars ?? 1, progress[level.id]?.stars ?? 0);
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 text-slate-100">
        <div className="max-w-3xl mx-auto px-3 py-6">
          <LevelComplete
            stars={bestStars}
            level={level}
            isLastLevel={!hasNextLevel}
            onRetry={() => {
              setShowComplete(false);
              setPhase("challenge");
              setChallengeStars(null);
            }}
            onNextLevel={() => {
              const actualIdx = nextIdx < 0 ? 0 : ALL_LEVELS.findIndex(l => l.index === nextIdx);
              if (actualIdx >= 0 && actualIdx < ALL_LEVELS.length) {
                closeLevel();
                openLevel(ALL_LEVELS[actualIdx].id);
              } else {
                closeLevel();
              }
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 text-slate-100">
      <LevelShell
        level={level}
        currentPhase={activePhase}
        onPhaseChange={handlePhaseChange}
      >
        {activePhase === "theory" && (
          <div>
            <TheoryPhase level={level} />
            <NextPhaseButton currentPhase="theory" onNext={handleNext} color={level.color} />
          </div>
        )}

        {activePhase === "demo" && (
          <div>
            {DemoComponent ? (
              <Suspense fallback={<GameLoader />}>
                <DemoComponent color={level.color} levelId={level.id} />
              </Suspense>
            ) : (
              <div role="status" className="rounded-xl border border-rose-500/40 bg-rose-950/20 p-6 text-center">
                <p className="text-sm text-rose-200 font-semibold mb-1">{t("demoLoadError")}</p>
                <p className="text-xs text-slate-400">{t("reloadToRetry")}</p>
              </div>
            )}
            <NextPhaseButton currentPhase="demo" onNext={handleNext} color={level.color} />
          </div>
        )}

        {activePhase === "practice" && (
          <div>
            <div className="rounded-xl border border-slate-700/50 bg-slate-900/40 p-3 mb-4 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-cyan-400 flex-shrink-0" />
              <p className="text-xs text-slate-300">
                {t("practiceIntro")}
              </p>
            </div>
            <QuizRunner
              questions={practiceQs}
              color={level.color}
              showHint
              // Practice doesn't award stars or affect progression — it's a
              // warm-up. We deliberately ignore the (stars, correct, total)
              // callback. The handleNext below marks the phase as done.
            />
            <NextPhaseButton currentPhase="practice" onNext={handleNext} color={level.color} label={t("continueChallenge")} />
          </div>
        )}

        {activePhase === "challenge" && (
          <div>
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-3 mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <p className="text-xs text-slate-300">
                {t("finalChallenge")} · {challengeQs.length} {t("questions")} · {t("noHints")} · {t("scoreDetermines")}.
              </p>
            </div>
            <QuizRunner
              questions={challengeQs}
              color={level.color}
              onComplete={(stars) => {
                setChallengeStars(stars);
                completePhase(level.id, "challenge", stars);
              }}
            />
            {challengeStars !== null && (
              <NextPhaseButton
                currentPhase="challenge"
                onNext={handleNext}
                color={level.color}
                label={t("continueMastery")}
              />
            )}
          </div>
        )}

        {activePhase === "mastery" && (
          <div>
            <MasteryPhase level={level} />
            <NextPhaseButton
              currentPhase="mastery"
              onNext={handleNext}
              color={level.color}
              label={t("completeLevel")}
            />
          </div>
        )}
      </LevelShell>
    </div>
  );
}
