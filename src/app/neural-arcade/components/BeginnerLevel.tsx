"use client";

import { useCallback, useState } from "react";
import { BookOpen, CheckCircle2, Gamepad2, Trophy } from "lucide-react";
import { ALL_LEVELS } from "../curriculum";
import { useLocale } from "../i18n";
import { playSound } from "../lib/sound";
import { useArcade } from "../store";
import type { LevelMeta, Phase } from "../types";
import { LevelComplete, LevelShell, NextPhaseButton } from "./LevelShell";
import { MathMission } from "./MathMissions";
import { TokenMission } from "./TokenMissions";

// Keep the stored phase IDs so existing progress survives the new play-first
// introduction. Each former reading/quiz phase now represents a playable goal.
const MISSION_PHASES: Phase[] = ["theory", "demo", "practice", "challenge"];
const LABELS = {
  es: {
    math: ["Mover", "Dibujar", "Cargar", "Rescatar"],
    tokens: ["Separar", "Construir", "Numerar", "Enviar"],
  },
  en: {
    math: ["Move", "Draw", "Charge", "Rescue"],
    tokens: ["Split", "Build", "Number", "Send"],
  },
};

export function BeginnerLevel({ level }: { level: LevelMeta }) {
  const { activePhase, setPhase, completePhase, openLevel, closeLevel, progress } = useArcade();
  const { locale, t } = useLocale();
  const [readyPhase, setReadyPhase] = useState<Phase | null>(null);
  const [finished, setFinished] = useState(false);
  const isMath = level.id === "math";
  const labels = LABELS[locale][isMath ? "math" : "tokens"];
  const mission = MISSION_PHASES.indexOf(activePhase);
  const spanish = locale === "es";
  const phaseLabels = Object.fromEntries([
    ...MISSION_PHASES.map((phase, index) => [phase, labels[index]]),
    ["mastery", spanish ? "Logros" : "Recap"],
  ]) as Record<Phase, string>;

  const finishMission = useCallback((stars: number) => {
    setReadyPhase(activePhase);
    completePhase(level.id, activePhase, activePhase === "challenge" ? stars : undefined);
    playSound(activePhase === "challenge" ? "levelUp" : "success");
  }, [activePhase, completePhase, level.id]);

  const changePhase = (phase: Phase) => {
    if (phase === activePhase) return;
    setReadyPhase(null);
    setFinished(false);
    setPhase(phase);
  };

  const nextMission = () => {
    if (readyPhase !== activePhase || mission < 0) return;
    changePhase(MISSION_PHASES[mission + 1] ?? "mastery");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <LevelShell
        level={level}
        currentPhase={activePhase}
        onPhaseChange={changePhase}
        phaseLabels={phaseLabels}
        compact
      >
        {finished ? (
          <LevelComplete
            stars={progress[level.id]?.stars ?? 3}
            level={level}
            onRetry={() => { setFinished(false); changePhase("theory"); }}
            onNextLevel={() => {
              const next = ALL_LEVELS.find(candidate => candidate.index === level.index + 1);
              if (next) openLevel(next.id);
              else closeLevel();
            }}
          />
        ) : activePhase === "mastery" ? (
          <section className="space-y-5" aria-labelledby="beginner-recap-title">
            <div className="rounded-2xl border border-emerald-400/30 bg-emerald-400/5 p-5 sm:p-7">
              <Trophy className="mb-3 h-10 w-10 text-amber-300" aria-hidden="true" />
              <p className="text-xs font-bold tracking-widest text-emerald-300">4 / 4 {spanish ? "MISIONES" : "MISSIONS"}</p>
              <h2 id="beginner-recap-title" className="mt-2 text-2xl font-extrabold">
                {spanish ? "Lo aprendiste jugando" : "You learned by playing"}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">
                {spanish
                  ? "Tus estrellas reconocen las misiones completadas. Probar y equivocarte es parte de aprender."
                  : "Your stars recognize completed missions. Trying and making mistakes are part of learning."}
              </p>
              <ul className="mt-5 space-y-4">
                {level.glossary.slice(0, 4).map(entry => (
                  <li key={entry.term} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-300" aria-hidden="true" />
                    <div>
                      <h3 className="font-bold text-slate-100">{entry.term}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-slate-300">{entry.definition}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <NextPhaseButton currentPhase="mastery" color={level.color} label={t("completeLevel")} onNext={() => {
              completePhase(level.id, "mastery");
              setFinished(true);
            }} />
          </section>
        ) : (
          <section aria-label={spanish ? `Misión ${mission + 1} de 4` : `Mission ${mission + 1} of 4`}>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="flex items-center gap-2 font-bold tracking-wider" style={{ color: level.color }}>
                <Gamepad2 className="h-4 w-4" aria-hidden="true" />
                {spanish ? "MISIÓN" : "MISSION"} {mission + 1} / 4
              </span>
              <span className="text-slate-400">{spanish ? "A tu ritmo · prueba todas las veces que quieras" : "At your pace · try as often as you like"}</span>
            </div>
            {isMath
              ? <MathMission key={activePhase} mission={mission} onComplete={finishMission} />
              : <TokenMission key={activePhase} mission={mission} onComplete={finishMission} />}
            {readyPhase === activePhase && (
              <NextPhaseButton
                currentPhase={activePhase}
                onNext={nextMission}
                color={level.color}
                label={mission === 3
                  ? (spanish ? "VER MIS LOGROS" : "SEE MY ACHIEVEMENTS")
                  : (spanish ? "SIGUIENTE MISIÓN" : "NEXT MISSION")}
              />
            )}
            <details className="mt-6 rounded-xl border border-slate-800 bg-slate-900/40">
              <summary className="cursor-pointer px-4 py-3 text-sm font-semibold text-slate-300 focus-visible:outline-2 focus-visible:outline-cyan-400">
                <BookOpen className="mr-2 inline h-4 w-4" aria-hidden="true" />
                {spanish ? "¿Por qué funciona? · explicación opcional" : "Why does it work? · optional explanation"}
              </summary>
              <div className="space-y-3 border-t border-slate-800 p-4 text-sm leading-relaxed text-slate-300">
                <h3 className="font-bold text-slate-100">{level.theory[mission]?.title}</h3>
                {level.theory[mission]?.body.split("\n\n").map((paragraph, index) => (
                  <p key={index}>{paragraph.replaceAll("**", "")}</p>
                ))}
              </div>
            </details>
          </section>
        )}
      </LevelShell>
    </div>
  );
}
