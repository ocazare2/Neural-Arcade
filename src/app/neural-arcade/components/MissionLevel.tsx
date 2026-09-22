"use client";

import { useCallback, useRef, useState, type ReactNode } from "react";
import {
  ArrowRight,
  BookOpen,
  Boxes,
  Check,
  CheckCircle2,
  CircuitBoard,
  Coins,
  Compass,
  Lightbulb,
  RotateCcw,
  Sparkles,
  Trophy,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { evaluateBuild } from "../build-decision";
import { formatFormula } from "../formula-format";
import { ALL_LEVELS } from "../curriculum";
import { useLocale } from "../i18n";
import { playSound } from "../lib/sound";
import { getLearningLadder, getLearningRung, type LearningRung } from "../learning-ladder";
import type { MissionPlan, PipelineStep, SortItem } from "../mission-types";
import { useArcade } from "../store";
import type { LevelMeta, Phase } from "../types";
import { LevelComplete, LevelShell, NextPhaseButton } from "./LevelShell";

const MISSION_PHASES: readonly Phase[] = ["theory", "demo", "practice", "challenge"];

const PHASE_LABELS = {
  es: {
    theory: "Base",
    demo: "Mecanismo",
    practice: "Precisión",
    challenge: "Diseña",
    mastery: "Mapa",
  },
  en: {
    theory: "Foundation",
    demo: "Mechanism",
    practice: "Precision",
    challenge: "Design",
    mastery: "Map",
  },
} satisfies Record<string, Record<Phase, string>>;

type CompleteMission = (stars?: number) => void;

export function MissionLevel({ level, plan }: { level: LevelMeta; plan: MissionPlan }) {
  const { activePhase, setPhase, completePhase, openLevel, closeLevel, progress } = useArcade();
  const { locale } = useLocale();
  const [readyPhase, setReadyPhase] = useState<Phase | null>(null);
  const [finished, setFinished] = useState(false);
  const mission = MISSION_PHASES.indexOf(activePhase);
  const storedDone = progress[level.id]?.phasesDone ?? [];
  const rung = activePhase === "mastery" ? null : getLearningRung(level, activePhase);
  // Preserve a partial mission's CTA after a refresh, while keeping a full
  // replay playable instead of letting completed levels jump to the recap.
  const phaseReady = readyPhase === activePhase || (!storedDone.includes("mastery") && storedDone.includes(activePhase));
  const spanish = locale === "es";

  const finishMission = useCallback((stars = 3) => {
    setReadyPhase(activePhase);
    completePhase(level.id, activePhase, activePhase === "challenge" ? stars : undefined);
    playSound(activePhase === "challenge" ? "levelUp" : "success");
  }, [activePhase, completePhase, level.id]);

  function changePhase(phase: Phase) {
    if (phase === activePhase) return;
    setReadyPhase(null);
    setFinished(false);
    setPhase(phase);
  }

  function nextMission() {
    if (!phaseReady || mission < 0) return;
    changePhase(MISSION_PHASES[mission + 1] ?? "mastery");
  }

  function nextLevel() {
    const position = ALL_LEVELS.findIndex((candidate) => candidate.id === level.id);
    const next = ALL_LEVELS[position + 1];
    if (next) openLevel(next.id);
    else closeLevel();
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <LevelShell
        level={level}
        currentPhase={activePhase}
        onPhaseChange={changePhase}
        phaseLabels={PHASE_LABELS[locale]}
        compact
      >
        {finished ? (
          <LevelComplete
            stars={progress[level.id]?.stars ?? 3}
            level={level}
            isLastLevel={ALL_LEVELS.at(-1)?.id === level.id}
            onRetry={() => { setFinished(false); changePhase("theory"); }}
            onNextLevel={nextLevel}
          />
        ) : activePhase === "mastery" ? (
          <MasteryMission level={level} plan={plan} onFinish={() => {
            completePhase(level.id, "mastery");
            setFinished(true);
          }} />
        ) : (
          <section aria-label={spanish ? `Misión ${mission + 1} de 4` : `Mission ${mission + 1} of 4`}>
            <MissionBanner
              color={level.color}
              mission={mission}
              title={PHASE_LABELS[locale][activePhase]}
              subtitle={rung?.question ?? plan.outcome}
              spanish={spanish}
            />

            {rung && <LearningLadder rung={rung} color={level.color} spanish={spanish} />}

            {activePhase === "theory" && (
              <ConceptDiscovery key={level.id} plan={plan} color={level.color} onComplete={finishMission} />
            )}
            {activePhase === "demo" && (
              <PipelineMission key={level.id} plan={plan} onComplete={finishMission} />
            )}
            {activePhase === "practice" && (
              <SorterMission key={level.id} plan={plan} color={level.color} onComplete={finishMission} />
            )}
            {activePhase === "challenge" && (
              <BuilderMission key={level.id} plan={plan} color={level.color} onComplete={finishMission} />
            )}

            {phaseReady && (
              <NextPhaseButton
                currentPhase={activePhase}
                onNext={nextMission}
                color={level.color}
                label={mission === 3
                  ? (spanish ? "VER LO QUE APRENDÍ" : "SEE WHAT I LEARNED")
                  : (spanish ? "SIGUIENTE MISIÓN" : "NEXT MISSION")}
              />
            )}
          </section>
        )}
      </LevelShell>
    </div>
  );
}

function MissionBanner({ color, mission, title, subtitle, spanish }: {
  color: string;
  mission: number;
  title: string;
  subtitle: string;
  spanish: boolean;
}) {
  return (
    <div className="mb-4 rounded-2xl border bg-slate-900/70 p-4" style={{ borderColor: `${color}55` }}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.18em]" style={{ color }}>
          <CircuitBoard className="h-4 w-4" aria-hidden />
          {spanish ? "Misión" : "Mission"} {mission + 1} / 4 · {title}
        </span>
        <span className="text-[11px] text-slate-500">{spanish ? "Prueba sin perder vidas" : "Try without losing lives"}</span>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-slate-300">{subtitle}</p>
    </div>
  );
}

function GameCard({ title, instruction, icon, children }: {
  title: string;
  instruction: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="space-y-5 rounded-2xl border border-slate-700/70 bg-slate-950/70 p-4 sm:p-6">
      <div>
        <div className="mb-2 flex items-center gap-2 text-cyan-300">
          {icon}
          <h2 className="text-lg font-extrabold text-slate-100 sm:text-xl">{title}</h2>
        </div>
        <p className="text-sm leading-relaxed text-slate-300">{instruction}</p>
      </div>
      {children}
    </div>
  );
}

function Completion({ children }: { children: ReactNode }) {
  const { locale } = useLocale();
  const spanish = locale === "es";
  return (
    <div role="status" className="rounded-xl border border-emerald-400/35 bg-emerald-500/10 p-4 text-sm leading-relaxed text-emerald-100">
      <p className="mb-1 flex items-center gap-2 font-extrabold text-emerald-300">
        <CheckCircle2 className="h-5 w-5" aria-hidden /> {spanish ? "Circuito completo" : "Circuit complete"}
      </p>
      {children}
    </div>
  );
}

function ConceptDiscovery({ plan, color, onComplete }: { plan: MissionPlan; color: string; onComplete: CompleteMission }) {
  const { locale } = useLocale();
  const spanish = locale === "es";
  const [active, setActive] = useState(0);
  const [visited, setVisited] = useState<Set<number>>(() => new Set());
  const reported = useRef(false);
  const guide = plan.concepts[active];
  const done = visited.size === plan.concepts.length;

  function inspect(index: number) {
    setActive(index);
    const next = new Set(visited).add(index);
    setVisited(next);
    playSound("tick");
    if (next.size === plan.concepts.length && !reported.current) {
      reported.current = true;
      onComplete();
    }
  }

  return (
    <GameCard
      title={spanish ? `Enciende el tablero: ${plan.role}` : `Light up the board: ${plan.role}`}
      instruction={spanish
        ? "Activa cada nodo. Verás qué hace y una comparación cotidiana; juntos forman el mapa completo del nivel."
        : "Activate every node. You will see what it does and an everyday comparison; together they form this level's complete map."}
      icon={<Compass className="h-5 w-5" aria-hidden />}
    >
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {plan.concepts.map((item, index) => {
          const seen = visited.has(index);
          const selected = active === index && seen;
          return (
            <button
              key={item.concept}
              type="button"
              onClick={() => inspect(index)}
              aria-pressed={selected}
              className={cn(
                "min-h-16 min-w-0 rounded-xl border px-3 py-2 text-left text-xs font-bold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300",
                seen ? "border-emerald-400/50 bg-emerald-500/10 text-emerald-100" : "border-slate-700 bg-slate-900 text-slate-300 hover:border-slate-500",
                selected && "ring-2 ring-cyan-300/60",
              )}
            >
              <span className="flex items-start gap-2">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px]" style={{ borderColor: seen ? "#34d399" : color }}>
                  {seen ? <Check className="h-3 w-3" aria-hidden /> : index + 1}
                </span>
                <span className="break-words">{item.concept}</span>
              </span>
            </button>
          );
        })}
      </div>

      {visited.size === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-700 bg-slate-900/50 p-5 text-center text-sm text-slate-400">
          {spanish ? "Toca cualquier nodo para encenderlo. No necesitas memorizar: observa cómo encaja." : "Tap any node to light it up. You do not need to memorize it: notice how it fits."}
        </div>
      ) : (
        <div className="rounded-xl border p-4" style={{ borderColor: `${color}66`, background: `${color}10` }} aria-live="polite">
          <p className="font-extrabold" style={{ color }}>{guide.concept}</p>
          <p className="mt-2 text-sm leading-relaxed text-slate-200">{guide.plain}</p>
          <p className="mt-3 flex items-start gap-2 rounded-lg bg-slate-950/60 p-3 text-xs leading-relaxed text-slate-300">
            <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" aria-hidden />
            <span><strong className="text-amber-200">{spanish ? "Imagínalo así:" : "Imagine it like this:"}</strong> {guide.example}</span>
          </p>
        </div>
      )}

      <div className="flex items-center gap-3 text-xs text-slate-400">
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-800">
          <div className="h-full rounded-full bg-emerald-400 transition-all" style={{ width: `${(visited.size / plan.concepts.length) * 100}%` }} />
        </div>
        <span className="font-mono">{visited.size}/{plan.concepts.length}</span>
      </div>
      {done && <Completion>{spanish ? "Ya puedes explicar cada pieza con tus propias palabras. En la siguiente misión las conectarás en movimiento." : "You can now explain every piece in your own words. In the next mission, you will connect them in motion."}</Completion>}
    </GameCard>
  );
}

function PipelineMission({ plan, onComplete }: { plan: MissionPlan; onComplete: CompleteMission }) {
  const { locale } = useLocale();
  const spanish = locale === "es";
  const steps = plan.pipeline.steps;
  const shuffled = [2, 0, 3, 1].map((index) => steps[index]).filter(Boolean);
  const [built, setBuilt] = useState<PipelineStep[]>([]);
  const [feedback, setFeedback] = useState(spanish ? "Empieza por la pieza que recibe la entrada." : "Start with the piece that receives the input.");
  const [mistakes, setMistakes] = useState(0);
  const reported = useRef(false);
  const done = built.length === steps.length;

  function addStep(step: PipelineStep) {
    if (done || built.some((item) => item.label === step.label)) return;
    const expected = steps[built.length];
    if (step.label !== expected.label) {
      setMistakes((value) => value + 1);
      setFeedback(spanish ? `Esa pieza funciona después. Busca primero: ${expected.detail}` : `That piece works later. Look first for: ${expected.detail}`);
      playSound("wrong");
      return;
    }
    const next = [...built, step];
    setBuilt(next);
    setFeedback(step.detail);
    playSound("tick");
    if (next.length === steps.length && !reported.current) {
      reported.current = true;
      onComplete();
    }
  }

  return (
    <GameCard title={plan.pipeline.title} instruction={plan.pipeline.instruction} icon={<Zap className="h-5 w-5" aria-hidden />}>
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
        <p className="mb-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">{spanish ? "Tu circuito" : "Your circuit"}</p>
        <ol className="grid gap-2 sm:grid-cols-4">
          {steps.map((_, index) => {
            const item = built[index];
            return (
              <li key={index} className={cn("min-h-20 rounded-lg border p-2 text-center", item ? "border-emerald-400/40 bg-emerald-500/10" : "border-dashed border-slate-700 bg-slate-950/50")}>
                <span className="text-[10px] text-slate-500">{index + 1}</span>
                <p className="mt-1 break-words text-xs font-bold text-slate-200">{item?.label ?? (spanish ? "pieza vacía" : "empty slot")}</p>
              </li>
            );
          })}
        </ol>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {shuffled.map((step) => {
          const used = built.some((item) => item.label === step.label);
          return (
            <button
              key={step.label}
              type="button"
              disabled={used || done}
              onClick={() => addStep(step)}
              className="min-h-14 min-w-0 rounded-xl border border-cyan-400/30 bg-cyan-950/40 px-3 py-2 text-sm font-bold text-cyan-100 transition hover:bg-cyan-900/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300 disabled:border-slate-800 disabled:bg-slate-900 disabled:text-slate-600"
            >
              {step.label}
            </button>
          );
        })}
      </div>
      <p className="min-h-10 rounded-lg bg-slate-900 p-3 text-sm leading-relaxed text-slate-300" aria-live="polite">{feedback}</p>
      {!done && built.length > 0 && (
        <button type="button" onClick={() => { setBuilt([]); setFeedback(spanish ? "Circuito vacío. Empieza por la entrada." : "Circuit cleared. Start from the input."); }} className="inline-flex min-h-11 items-center gap-2 rounded-lg px-3 text-sm text-slate-400 hover:bg-slate-800 hover:text-slate-200">
          <RotateCcw className="h-4 w-4" aria-hidden /> {spanish ? "Reiniciar circuito" : "Reset circuit"}
        </button>
      )}
      {done && <Completion>{spanish
        ? <>La salida de una pieza alimenta la siguiente. Tuviste {mistakes} {mistakes === 1 ? "intento que enseñó algo" : "intentos que enseñaron algo"}; equivocarse aquí no resta estrellas.</>
        : <>One piece&apos;s output feeds the next. You had {mistakes} {mistakes === 1 ? "attempt that taught you something" : "attempts that taught you something"}; mistakes here do not reduce stars.</>}</Completion>}
    </GameCard>
  );
}

function SorterMission({ plan, color, onComplete }: { plan: MissionPlan; color: string; onComplete: CompleteMission }) {
  const { locale } = useLocale();
  const spanish = locale === "es";
  const [placed, setPlaced] = useState<SortItem[]>([]);
  const [feedback, setFeedback] = useState(spanish ? "Envía la primera señal a la zona donde realmente pertenece." : "Send the first signal to the zone where it truly belongs.");
  const [mistakes, setMistakes] = useState(0);
  const reported = useRef(false);
  const item = plan.sorter.items[placed.length];
  const done = !item;

  function route(lane: 0 | 1) {
    if (!item) return;
    if (lane !== item.lane) {
      setMistakes((value) => value + 1);
      setFeedback(`Todavía no: ${item.why}`);
      playSound("wrong");
      return;
    }
    const next = [...placed, item];
    setPlaced(next);
    setFeedback(item.why);
    playSound("tick");
    if (next.length === plan.sorter.items.length && !reported.current) {
      reported.current = true;
      onComplete();
    }
  }

  return (
    <GameCard title={plan.sorter.title} instruction={plan.sorter.instruction} icon={<Boxes className="h-5 w-5" aria-hidden />}>
      {!done && (
        <div className="rounded-2xl border-2 bg-slate-900 p-5 text-center" style={{ borderColor: `${color}88` }}>
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500">{spanish ? "Señal" : "Signal"} {placed.length + 1} {spanish ? "de" : "of"} {plan.sorter.items.length}</p>
          <p className="mt-2 text-lg font-extrabold text-slate-100">{item.label}</p>
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        {plan.sorter.lanes.map((lane, index) => (
          <button
            key={lane.label}
            type="button"
            disabled={done}
            onClick={() => route(index as 0 | 1)}
            className="min-h-24 rounded-xl border border-slate-600 bg-slate-900/80 p-4 text-left transition hover:-translate-y-0.5 hover:border-cyan-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300 disabled:opacity-60"
          >
            <span className="font-extrabold text-cyan-200">{lane.label}</span>
            <span className="mt-1 block text-xs leading-relaxed text-slate-400">{lane.description}</span>
            <span className="mt-3 block text-[11px] text-emerald-300">{placed.filter((entry) => entry.lane === index).length} {spanish ? "recibidas" : "received"}</span>
          </button>
        ))}
      </div>
      <p className="min-h-11 rounded-lg bg-slate-900 p-3 text-sm leading-relaxed text-slate-300" aria-live="polite">{feedback}</p>
      <div className="flex gap-1" aria-label={spanish ? `${placed.length} de ${plan.sorter.items.length} señales clasificadas` : `${placed.length} of ${plan.sorter.items.length} signals sorted`}>
        {plan.sorter.items.map((entry, index) => <span key={entry.label} className={cn("h-2 flex-1 rounded-full", index < placed.length ? "bg-emerald-400" : "bg-slate-800")} />)}
      </div>
      {done && <Completion>{spanish ? <>Ahora distingues dos funciones que suelen confundirse. Los {mistakes} tropiezos sirvieron como feedback inmediato, no como castigo.</> : <>You can now tell apart two functions that are often confused. Those {mistakes} stumbles gave immediate feedback, not punishment.</>}</Completion>}
    </GameCard>
  );
}

function BuilderMission({ plan, color, onComplete }: { plan: MissionPlan; color: string; onComplete: CompleteMission }) {
  const { locale } = useLocale();
  const spanish = locale === "es";
  const [selected, setSelected] = useState<Set<number>>(() => new Set());
  const [mistakes, setMistakes] = useState(0);
  const [feedback, setFeedback] = useState(spanish ? "Elige solo los módulos necesarios y mantente dentro del presupuesto." : "Choose only the modules you need and stay within the budget.");
  const [done, setDone] = useState(false);
  const reported = useRef(false);
  const cost = [...selected].reduce((sum, index) => sum + plan.build.modules[index].cost, 0);

  function toggle(index: number) {
    if (done) return;
    const next = new Set(selected);
    if (next.has(index)) next.delete(index);
    else next.add(index);
    setSelected(next);
    playSound("tick");
  }

  function testBuild() {
    if (done) return;
    const evaluation = evaluateBuild(plan.build, selected);
    if (evaluation.status === "over-budget") {
      setMistakes((value) => value + 1);
      setFeedback(spanish ? `La máquina consume ${evaluation.cost}, pero solo tienes ${evaluation.budget}. Retira módulos que no ayudan al objetivo.` : `The machine uses ${evaluation.cost}, but you only have ${evaluation.budget}. Remove modules that do not help the goal.`);
      playSound("wrong");
      return;
    }
    if (evaluation.status === "missing-core") {
      setMistakes((value) => value + 1);
      setFeedback(evaluation.missing[0].why);
      playSound("wrong");
      return;
    }
    const { upgrades, spare } = evaluation;
    const stars = mistakes === 0 ? 3 : mistakes <= 2 ? 2 : 1;
    setDone(true);
    setFeedback(spanish
      ? upgrades.length
        ? `El núcleo cumple el objetivo y añadiste ${upgrades.map((module) => `«${module.label}»`).join(" y ")} sin superar el presupuesto.`
        : `El núcleo cumple el objetivo. Dejaste ${spare} de margen: también es una decisión válida si no aporta una mejora necesaria.`
      : upgrades.length
        ? `The core meets the goal and you added ${upgrades.map((module) => `“${module.label}”`).join(" and ")} without exceeding the budget.`
        : `The core meets the goal. You kept ${plan.build.budget - cost} spare: that is valid when no extra upgrade is needed.`);
    if (!reported.current) {
      reported.current = true;
      onComplete(stars);
    }
  }

  return (
    <GameCard title={plan.build.title} instruction={plan.build.brief} icon={<Coins className="h-5 w-5" aria-hidden />}>
      <div className="rounded-xl border border-violet-400/25 bg-violet-400/5 p-3 text-xs leading-relaxed text-violet-100">
        <p className="font-extrabold text-violet-200">{spanish ? "Decisión de arquitectura" : "Architecture decision"}</p>
        <p className="mt-1">{spanish
          ? "Primero instala el núcleo indispensable. Si queda energía, una mejora opcional puede entrar; no existe un premio por gastar todo el presupuesto."
          : "Install the indispensable core first. If energy remains, an optional upgrade can fit; spending every point is not the goal."}</p>
      </div>
      <div className={cn("rounded-xl border p-3", cost > plan.build.budget ? "border-rose-400/50 bg-rose-500/10" : "border-cyan-400/30 bg-cyan-500/5")}>
        <div className="flex items-center justify-between gap-3 text-sm">
          <span className="font-bold text-slate-200">{spanish ? "Energía usada" : "Energy used"}</span>
          <span className={cn("font-mono font-extrabold", cost > plan.build.budget ? "text-rose-300" : "text-cyan-200")}>{cost} / {plan.build.budget}</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-800">
          <div className={cn("h-full rounded-full transition-all", cost > plan.build.budget ? "bg-rose-400" : "bg-cyan-400")} style={{ width: `${Math.min(100, (cost / plan.build.budget) * 100)}%` }} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {plan.build.modules.map((module, index) => {
          const active = selected.has(index);
          return (
            <button
              key={module.label}
              type="button"
              disabled={done}
              aria-pressed={active}
              onClick={() => toggle(index)}
              className={cn(
                "min-h-24 min-w-0 rounded-xl border p-3 text-left transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300",
                active ? "border-cyan-300 bg-cyan-500/15 text-cyan-100" : "border-slate-700 bg-slate-900 text-slate-300 hover:border-slate-500",
              )}
            >
              <span className="flex items-start justify-between gap-2">
                <span className="break-words text-xs font-extrabold">{module.label}</span>
                <span className="shrink-0 rounded bg-slate-950 px-1.5 py-0.5 font-mono text-[10px] text-amber-200">{module.cost}⚡</span>
              </span>
              <span className="mt-3 block text-[10px] text-slate-500">{active ? (spanish ? "Instalado" : "Installed") : (spanish ? "Toca para instalar" : "Tap to install")}</span>
            </button>
          );
        })}
      </div>

      <p className="min-h-12 rounded-lg bg-slate-900 p-3 text-sm leading-relaxed text-slate-300" aria-live="polite">{feedback}</p>
      {!done && (
        <button type="button" onClick={testBuild} className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl font-extrabold text-slate-950 transition hover:brightness-110" style={{ background: color }}>
          {spanish ? "Probar mi máquina" : "Test my machine"} <ArrowRight className="h-4 w-4" aria-hidden />
        </button>
      )}
      {done && (
        <Completion>
          {spanish
            ? <>{plan.build.modules.filter((module) => module.essential).map((module) => module.label).join(" + ")} forman el núcleo. {plan.build.modules.filter((module, index) => !module.essential && selected.has(index)).length > 0 ? "Las mejoras elegidas caben porque no sustituyeron una pieza crítica." : "Un diseño mínimo y verificable puede ser mejor que añadir piezas sin una razón."} Obtuviste {mistakes === 0 ? "3" : mistakes <= 2 ? "2" : "1"} estrellas según cuántas pruebas necesitaste.</>
            : <>{plan.build.modules.filter((module) => module.essential).map((module) => module.label).join(" + ")} form the core. {plan.build.modules.filter((module, index) => !module.essential && selected.has(index)).length > 0 ? "The upgrades fit because they did not replace a critical piece." : "A minimal, verifiable design can be better than adding pieces without a reason."} You earned {mistakes === 0 ? "3" : mistakes <= 2 ? "2" : "1"} stars based on how many tests you needed.</>}
        </Completion>
      )}
    </GameCard>
  );
}

function LearningLadder({ rung, color, spanish }: { rung: LearningRung; color: string; spanish: boolean }) {
  const block = rung;
  const paragraphs = block.body.split("\n\n").filter(Boolean);
  const [coreIdea, ...details] = paragraphs;
  return (
    <aside className="mb-5 overflow-hidden rounded-2xl border bg-slate-900/70" style={{ borderColor: `${color}55` }} aria-labelledby={`learning-layer-${rung.phase}`}>
      <div className="border-b border-slate-700/70 bg-slate-950/40 px-4 py-3 sm:px-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.16em]" style={{ color }}>
            {spanish ? `Capa ${rung.step} de 4 · ${rung.level}` : `Layer ${rung.step} of 4 · ${rung.level}`}
          </p>
          <span className="rounded-full border border-slate-700 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-400">
            {spanish ? "Antes de jugar" : "Before playing"}
          </span>
        </div>
        <h2 id={`learning-layer-${rung.phase}`} className="mt-2 flex items-start gap-2 text-base font-extrabold text-slate-100 sm:text-lg">
          <BookOpen className="mt-0.5 h-5 w-5 shrink-0" style={{ color }} aria-hidden />
          <span>{block.title}</span>
        </h2>
      </div>
      <div className="space-y-4 p-4 text-sm leading-relaxed text-slate-300 sm:p-5">
        {coreIdea && <p>{coreIdea.replaceAll("**", "")}</p>}
        {block.formula && (
          <div className="rounded-xl border border-cyan-400/25 bg-slate-950 p-3">
            <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-cyan-300">{spanish ? "Modelo o fórmula" : "Model or formula"}</p>
            <p className="overflow-x-auto whitespace-nowrap font-mono text-xs text-cyan-100 sm:text-sm" aria-label={spanish ? "Fórmula matemática" : "Mathematical formula"}>{formatFormula(block.formula)}</p>
            {block.formulaExplain && <p className="mt-3 text-xs leading-relaxed text-slate-400">{block.formulaExplain}</p>}
          </div>
        )}
        <div className="rounded-xl border border-amber-300/20 bg-amber-300/5 p-3 text-xs leading-relaxed text-amber-50">
          <p className="font-extrabold text-amber-200">{spanish ? "Pregunta que vas a resolver" : "Question you will resolve"}</p>
          <p className="mt-1">{rung.question}</p>
          <p className="mt-2 text-amber-100/80">{rung.action}</p>
        </div>
        {details.length > 0 && (
          <details open={rung.step >= 3} className="rounded-xl border border-slate-700 bg-slate-950/40">
            <summary className="cursor-pointer px-3 py-2 text-xs font-bold text-slate-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300">
              {spanish ? (rung.step >= 3 ? "Detalle técnico de esta capa" : "Profundiza cuando estés listo") : (rung.step >= 3 ? "Technical detail for this layer" : "Go deeper when you are ready")}
            </summary>
            <div className="space-y-3 border-t border-slate-700 p-3 text-xs leading-relaxed text-slate-300">
              {details.map((paragraph, index) => <p key={index}>{paragraph.replaceAll("**", "")}</p>)}
            </div>
          </details>
        )}
      </div>
    </aside>
  );
}

function MasteryMission({ level, plan, onFinish }: { level: LevelMeta; plan: MissionPlan; onFinish: () => void }) {
  const { locale, t } = useLocale();
  const spanish = locale === "es";
  const ladder = getLearningLadder(level);
  return (
    <section className="space-y-5" aria-labelledby="mission-recap-title">
      <div className="rounded-2xl border border-emerald-400/30 bg-emerald-500/5 p-5 sm:p-7">
        <Trophy className="mb-3 h-10 w-10 text-amber-300" aria-hidden />
        <p className="text-xs font-bold tracking-widest text-emerald-300">4 / 4 {spanish ? "MISIONES" : "MISSIONS"}</p>
        <h2 id="mission-recap-title" className="mt-2 text-2xl font-extrabold">
          {spanish ? "Ya puedes explicarlo y construirlo" : "Now you can explain and build it"}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-300">{plan.outcome}</p>
      </div>

      <div className="rounded-2xl border border-cyan-400/25 bg-cyan-400/5 p-4 sm:p-5">
        <h3 className="font-extrabold text-cyan-100">{spanish ? "Tu escalera de comprensión" : "Your understanding ladder"}</h3>
        <p className="mt-1 text-xs leading-relaxed text-slate-300">{spanish ? "No solo nombraste conceptos: partiste de una intuición y terminaste tomando una decisión técnica." : "You did more than name concepts: you started from an intuition and ended with a technical decision."}</p>
        <ol className="mt-4 grid gap-2 sm:grid-cols-2">
          {ladder.map((rung) => (
            <li key={rung.phase} className="flex items-start gap-3 rounded-xl border border-slate-700 bg-slate-950/50 p-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-cyan-400/50 font-mono text-xs font-extrabold text-cyan-200">{rung.step}</span>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-cyan-300">{rung.level}</p>
                <p className="mt-1 text-xs font-bold leading-relaxed text-slate-100">{rung.title}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div className="rounded-2xl border border-slate-700 bg-slate-900/60 p-4 sm:p-5">
        <h3 className="mb-4 flex items-center gap-2 font-extrabold text-slate-100">
          <Sparkles className="h-5 w-5" style={{ color: level.color }} aria-hidden />
          {spanish ? "Tu mapa mental" : "Your mental map"}
        </h3>
        <ul className="grid gap-3 sm:grid-cols-2">
          {plan.concepts.map((guide) => (
            <li key={guide.concept} className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
              <p className="text-sm font-bold" style={{ color: level.color }}>{guide.concept}</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-400">{guide.plain}</p>
            </li>
          ))}
        </ul>
      </div>

      <NextPhaseButton currentPhase="mastery" color={level.color} label={t("completeLevel")} onNext={onFinish} />
    </section>
  );
}
