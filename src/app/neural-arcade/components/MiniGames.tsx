"use client";

import { useState, useEffect, useRef } from "react";
import { Play, RotateCcw, Clock, CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { playSound } from "../lib/sound";
import { CONCEPT_GAME_MODULES, type ConceptGameId } from "../concept-game-data";
import {
  GRADIENT_SURFACES,
  createGradientRound,
  takeGradientStep,
  type GradientPoint,
} from "../gradient-game";
import { FloatingText, ScreenShake, ComboSystem } from "./Polish";

// ═══════════════════════════════════════════════════════════
// Shared game frame — start screen, gameplay, end screen
// ═══════════════════════════════════════════════════════════
function GameFrame({ title, instruction, color, onRestart, children }: {
  title: string;
  instruction: string;
  color: string;
  onRestart?: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-base sm:text-lg font-bold" style={{ color }}>{title}</h3>
        {onRestart && (
          <button onClick={onRestart} className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1">
            <RotateCcw className="w-3 h-3" /> Reiniciar
          </button>
        )}
      </div>
      <p className="text-xs text-slate-400 italic">{instruction}</p>
      {children}
    </div>
  );
}

function StartScreen({ title, desc, onStart, color }: { title: string; desc: string; onStart: () => void; color: string }) {
  return (
    <div className="rounded-xl border border-slate-700/50 bg-slate-900/40 p-6 text-center space-y-3">
      <h3 className="text-xl font-bold" style={{ color }}>{title}</h3>
      <p className="text-sm text-slate-400">{desc}</p>
      <button onClick={onStart} className="rounded-xl px-6 py-3 font-bold text-sm text-[#0a0414] flex items-center gap-2 mx-auto" style={{ background: color }}>
        <Play className="w-4 h-4 fill-current" /> EMPEZAR
      </button>
    </div>
  );
}

function EndScreen({ score, max, onRestart, color, msg }: { score: number; max?: number; onRestart: () => void; color: string; msg?: string }) {
  return (
    <div className="rounded-xl border border-slate-700/50 bg-slate-900/40 p-6 text-center space-y-3">
      <div className="text-4xl">{score >= 80 ? "🏆" : score >= 50 ? "⭐" : "✅"}</div>
      <p className="text-2xl font-bold" style={{ color }}>{max ? `${score}/${max}` : `${score} pts`}</p>
      {msg && <p className="text-xs text-slate-400">{msg}</p>}
      <button onClick={onRestart} className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-sm text-slate-200 hover:bg-slate-700 flex items-center gap-2 mx-auto">
        <RotateCcw className="w-4 h-4" /> Otra vez
      </button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// 1. TOKEN SURGEON — cut words into tokens
// ═══════════════════════════════════════════════════════════
const WORDS = [
  { word: "gato", cuts: [] },
  { word: "perro", cuts: [] },
  { word: "sol", cuts: [] },
  { word: "luna", cuts: [] },
  { word: "casa", cuts: [] },
  { word: "computadora", cuts: [5, 8] },
  { word: "inteligencia", cuts: [5, 9] },
  { word: "programacion", cuts: [7, 10] },
  { word: "biblioteca", cuts: [3, 7] },
  { word: "universidad", cuts: [4, 8] },
];

export function TokenSurgeonGame({ color }: { color: string }) {
  const [phase, setPhase] = useState<"start" | "play" | "end">("start");
  const [idx, setIdx] = useState(0);
  const [cuts, setCuts] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [time, setTime] = useState(60);
  const [shake, setShake] = useState(0);
  const [floats, setFloats] = useState<{id: number; text: string; x: number; y: number; c: string}[]>([]);
  const floatId = useRef(0);

  useEffect(() => {
    if (phase !== "play") return;
    const t = setInterval(() => setTime(t => { if (t <= 1) { setPhase("end"); return 0; } return t - 1; }), 1000);
    return () => clearInterval(t);
  }, [phase]);

  const addFloat = (text: string, x: number, y: number, c: string) => {
    const id = ++floatId.current;
    setFloats(f => [...f, { id, text, x, y, c }]);
    setTimeout(() => setFloats(f => f.filter(it => it.id !== id)), 1200);
  };

  const toggleCut = (pos: number) => {
    playSound("tick");
    setCuts(c => c.includes(pos) ? c.filter(x => x !== pos) : [...c, pos]);
  };

  const check = () => {
    const word = WORDS[idx];
    const player = [...cuts].sort((a, b) => a - b);
    const real = [...word.cuts].sort((a, b) => a - b);
    const ok = player.length === real.length && player.every((p, i) => Math.abs(p - real[i]) <= 1);
    if (ok) {
      const pts = 10 + Math.min(combo, 5) * 2;
      setScore(s => s + pts);
      setCombo(c => c + 1);
      playSound("success");
      addFloat(`+${pts}`, window.innerWidth / 2, 200, "#34d399");
    } else {
      setCombo(0);
      playSound("wrong");
      setShake(s => s + 1);
      addFloat("✗", window.innerWidth / 2, 200, "#f87171");
    }
    if (idx < WORDS.length - 1) { setIdx(i => i + 1); setCuts([]); }
    else setPhase("end");
  };

  const reset = () => { setPhase("start"); setIdx(0); setCuts([]); setScore(0); setCombo(0); setTime(60); };

  if (phase === "start") return <StartScreen title="TOKEN SURGEON" desc="Corta palabras en tokens. 60 segundos. 10 palabras." onStart={() => setPhase("play")} color={color} />;
  if (phase === "end") return <EndScreen score={score} onRestart={reset} color={color} msg={idx >= WORDS.length - 1 ? "¡Completaste todas las palabras!" : "Se acabó el tiempo."} />;

  const word = WORDS[idx];
  const letters = word.word.split("");
  const segments: { text: string; isCut: boolean }[] = [];
  let cur = "";
  letters.forEach((l, i) => {
    if (cuts.includes(i)) { if (cur) segments.push({ text: cur, isCut: false }); segments.push({ text: l, isCut: true }); cur = ""; }
    else cur += l;
  });
  if (cur) segments.push({ text: cur, isCut: false });

  return (
    <GameFrame title="Cirugía de Tokens" instruction="Toca entre letras para cortar. Meta: el número correcto de tokens." color={color} onRestart={reset}>
      <ComboSystem combo={combo} color={color} />
      <ScreenShake trigger={shake} intensity={4}>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-slate-400">{idx + 1}/{WORDS.length}</span>
          <span className="text-xs font-mono" style={{ color: time < 10 ? "#fb7185" : color }}><Clock className="w-3 h-3 inline" /> {time}s</span>
          <span className="text-xs font-bold" style={{ color }}>{score} pts</span>
        </div>
        <div className="rounded-xl border border-slate-700/50 bg-slate-900/40 p-4">
          <p className="text-xs text-slate-500 mb-2">META: {word.cuts.length + 1} tokens · NECESITAS {word.cuts.length} cortes</p>
          <div className="flex flex-wrap gap-1 justify-center">
            {letters.map((l, i) => (
              <div key={i} className="flex items-center">
                <button onClick={() => toggleCut(i)} disabled={i === 0}
                  className={cn("w-3 h-8 rounded transition", i === 0 ? "opacity-0" : cuts.includes(i) ? "bg-cyan-400" : "bg-slate-700 hover:bg-slate-600")} />
                <span className="text-2xl font-bold text-slate-100 px-0.5">{l}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 text-center">
            <span className="text-xs text-slate-500">Tienes: {cuts.length + 1} tokens</span>
          </div>
        </div>
        <button onClick={check} className="w-full mt-3 rounded-xl py-3 font-bold text-sm text-[#0a0414]" style={{ background: color }}>
          VERIFICAR
        </button>
      </ScreenShake>
      {floats.map(f => <FloatingText key={f.id} text={f.text} x={f.x} y={f.y} color={f.c} trigger={f.id} />)}
    </GameFrame>
  );
}

// ═══════════════════════════════════════════════════════════
// 2. ATTENTION CONNECT — draw attention lines
// ═══════════════════════════════════════════════════════════
interface AttentionSentence {
  words: string[];
  attn: Record<number, Record<number, number>>;
}

const SENTENCES: AttentionSentence[] = [
  { words: ["El", "robot", "levantó", "la", "caja", "porque", "estaba", "pesada"], attn: { 7: { 4: 0.9, 6: 0.5 } } },
  { words: ["Los", "exámenes", "eran", "urgentes", "porque", "los", "estudié", "poco"], attn: { 3: { 1: 0.8 } } },
  { words: ["El", "gato", "corría", "rápido", "cuando", "vio", "al", "ratón"], attn: { 2: { 7: 0.7, 5: 0.4 } } },
];

export function AttentionConnectGame({ color }: { color: string }) {
  const [phase, setPhase] = useState<"start" | "play" | "reveal" | "end">("start");
  const [round, setRound] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [guesses, setGuesses] = useState<Record<number, number[]>>({});
  const [score, setScore] = useState(0);

  const reset = () => { setPhase("start"); setRound(0); setSelected(null); setGuesses({}); setScore(0); };

  if (phase === "start") return <StartScreen title="ATTENTION CONNECT" desc="Dibuja líneas de atención. Compara con la realidad." onStart={() => setPhase("play")} color={color} />;

  const sent = SENTENCES[round];

  const clickWord = (i: number) => {
    if (phase === "reveal") return;
    if (selected === null) setSelected(i);
    else if (selected === i) setSelected(null);
    else {
      setGuesses(g => {
        const arr = g[selected] || [];
        const exists = arr.includes(i);
        return { ...g, [selected]: exists ? arr.filter(x => x !== i) : [...arr, i] };
      });
      setSelected(null);
    }
  };

  const reveal = () => {
    let pts = 0;
    Object.entries(sent.attn).forEach(([src, targets]) => {
      const s = +src;
      const player = guesses[s] || [];
      Object.entries(targets).forEach(([t, w]) => {
        if (player.includes(+t)) pts += Math.round(w * 100);
      });
    });
    setScore(s => s + pts);
    setPhase("reveal");
    playSound("levelUp");
  };

  const next = () => {
    if (round < SENTENCES.length - 1) { setRound(r => r + 1); setGuesses({}); setSelected(null); setPhase("play"); }
    else setPhase("end");
  };

  if (phase === "end") return <EndScreen score={score} max={300} onRestart={reset} color={color} msg="Score basado en accuracy de attention." />;

  return (
    <GameFrame title="Attention Connect" instruction="Toca una palabra, luego su target. Verde=correcto, rojo=fallaste." color={color} onRestart={reset}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-slate-400">Ronda {round + 1}/{SENTENCES.length}</span>
        <span className="text-xs font-bold" style={{ color }}>{score} pts</span>
      </div>
      <div className="rounded-xl border border-slate-700/50 bg-slate-900/40 p-4">
        <div className="flex flex-wrap gap-2 justify-center">
          {sent.words.map((w, i) => {
            const isSel = selected === i;
            const hasGuess = (guesses[i] || []).length > 0;
            const isTarget = Object.values(guesses).flat().includes(i);
            const isReal = phase === "reveal" && Object.entries(sent.attn).some(([s, t]) => +s === i || Object.keys(t).map(Number).includes(i));
            return (
              <button key={i} onClick={() => clickWord(i)}
                className={cn("px-2 py-1 rounded-lg text-sm font-medium transition",
                  isSel ? "bg-cyan-400 text-[#0a0414]" : hasGuess || isTarget ? "border-2" : "bg-slate-800 text-slate-200 border border-slate-700")}
                style={hasGuess || isTarget ? { borderColor: color, color: phase === "reveal" && isReal ? "#34d399" : color } : {}}>
                {w}
              </button>
            );
          })}
        </div>
        {phase === "play" && (
          <p className="text-xs text-slate-500 mt-3 text-center">
            {selected !== null ? `Toca la palabra que "${sent.words[selected]}" atiende` : "Toca una palabra para empezar"}
          </p>
        )}
      </div>
      {phase === "play" ? (
        <button onClick={reveal} className="w-full mt-3 rounded-xl py-3 font-bold text-sm text-[#0a0414]" style={{ background: color }}>REVELAR</button>
      ) : (
        <button onClick={next} className="w-full mt-3 rounded-xl py-3 font-bold text-sm text-[#0a0414]" style={{ background: color }}>
          {round < SENTENCES.length - 1 ? "SIGUIENTE" : "VER RESULTADO"}
        </button>
      )}
    </GameFrame>
  );
}

// ═══════════════════════════════════════════════════════════
// 3. GRADIENT ROLLER — tune LR to reach valley
// ═══════════════════════════════════════════════════════════
export function GradientRollerGame({ color }: { color: string }) {
  const [phase, setPhase] = useState<"start" | "play" | "end">("start");
  const [round, setRound] = useState(0);
  const [pos, setPos] = useState<GradientPoint>({ ...GRADIENT_SURFACES[0].start });
  const [lr, setLr] = useState(0.1);
  const [steps, setSteps] = useState(0);
  const [score, setScore] = useState(0);
  const [exploded, setExploded] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const [trail, setTrail] = useState<GradientPoint[]>([]);
  const transitionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (transitionTimer.current) clearTimeout(transitionTimer.current);
  }, []);

  const beginRound = (nextRound: number) => {
    const next = createGradientRound(nextRound);
    setRound(nextRound);
    setPos(next.position);
    setTrail([next.position]);
    setSteps(next.steps);
    setExploded(next.exploded);
    setTransitioning(false);
    setPhase("play");
  };

  const reset = () => {
    if (transitionTimer.current) clearTimeout(transitionTimer.current);
    transitionTimer.current = null;
    setPhase("start");
    setRound(0);
    setPos({ ...GRADIENT_SURFACES[0].start });
    setLr(0.1);
    setSteps(0);
    setScore(0);
    setExploded(false);
    setTransitioning(false);
    setTrail([]);
  };

  const scheduleNextRound = (delay: number) => {
    setTransitioning(true);
    transitionTimer.current = setTimeout(() => {
      const nextRound = round + 1;
      if (nextRound < GRADIENT_SURFACES.length) beginRound(nextRound);
      else setPhase("end");
      transitionTimer.current = null;
    }, delay);
  };

  const step = () => {
    if (exploded || transitioning) return;
    const result = takeGradientStep(round, pos, lr, steps);
    setSteps(result.steps);
    if (result.exploded) {
      setExploded(true);
      playSound("wrong");
      scheduleNextRound(1200);
      return;
    }
    setPos(result.position);
    setTrail(current => [...current, result.position].slice(-20));
    playSound("tick");
    if (result.solved) {
      setScore(current => current + result.points);
      playSound("levelUp");
      scheduleNextRound(800);
    }
  };

  if (phase === "start") return <StartScreen title="GRADIENT ROLLER" desc="Ajusta el learning rate. Lleva la bola al valle. 3 rondas." onStart={() => beginRound(0)} color={color} />;
  if (phase === "end") return <EndScreen score={score} max={300} onRestart={reset} color={color} msg="LR alto explota. LR bajo eterno. Encontrar el óptimo es el arte." />;

  const s = GRADIENT_SURFACES[round];
  const toSvg = (x: number, y: number) => ({ sx: 50 + x * 5, sy: 50 - y * 5 });
  const ball = toSvg(pos.x, pos.y);
  const target = toSvg(s.target.x, s.target.y);

  return (
    <GameFrame title={`Gradient Roller · ${s.name}`} instruction="LR alto = explota. LR bajo = lento. Ajusta y da pasos." color={color} onRestart={reset}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-slate-400">Ronda {round + 1}/{GRADIENT_SURFACES.length}</span>
        <span className="text-xs text-slate-400">{steps} pasos</span>
        <span className="text-xs font-bold" style={{ color }}>{score} pts</span>
      </div>
      <div className="rounded-xl border border-slate-700/50 bg-slate-900/40 p-3">
        <svg viewBox="0 0 100 100" className="w-full h-56">
          {[20, 40, 60, 80].map(v => (<g key={v} stroke="#1e293b" strokeWidth="0.2"><line x1={v} y1="0" x2={v} y2="100" /><line x1="0" y1={v} x2="100" y2={v} /></g>))}
          <circle cx={target.sx} cy={target.sy} r="3" fill="#34d399" />
          <text x={target.sx + 3} y={target.sy} fontSize="3" fill="#34d399">META</text>
          {trail.length > 1 && trail.map((p, i) => { if (i === 0) return null; const a = toSvg(trail[i - 1].x, trail[i - 1].y); const b = toSvg(p.x, p.y); return <line key={i} x1={a.sx} y1={a.sy} x2={b.sx} y2={b.sy} stroke={color} strokeWidth="0.4" opacity={0.3 + (i / trail.length) * 0.7} />; })}
          <circle cx={ball.sx} cy={ball.sy} r="2" fill={exploded ? "#fb7185" : "#fde047"} style={{ filter: `drop-shadow(0 0 4px ${exploded ? "#fb7185" : "#fde047"})` }} />
          {exploded && <text x={ball.sx} y={ball.sy - 5} fontSize="6" textAnchor="middle">💥</text>}
        </svg>
      </div>
      <div className="mt-3">
        <label htmlFor="gradient-learning-rate" className="text-xs text-slate-400">
          Learning rate: {lr.toFixed(2)} {lr > s.goodLr * 3 ? "⚠️" : lr < s.goodLr / 2 ? "🐢" : "✓"}
        </label>
        <input id="gradient-learning-rate" type="range" min="0.01" max="0.8" step="0.01" value={lr} onChange={e => setLr(+e.target.value)} className="w-full accent-cyan-500" />
      </div>
      <button onClick={step} disabled={exploded || transitioning} className="w-full mt-2 rounded-xl py-3 font-bold text-sm text-[#0a0414] disabled:opacity-50" style={{ background: color }}>
        {exploded ? "💥 EXPLOTÓ" : transitioning ? "✓ RONDA COMPLETADA" : "DAR PASO ⬇️"}
      </button>
    </GameFrame>
  );
}

// ═══════════════════════════════════════════════════════════
// 4-13. CONCEPT CHALLENGES — complete three-round games
// ═══════════════════════════════════════════════════════════
export function EmbeddingSpaceGame({ color }: { color: string }) {
  return <ConceptChallengeGame color={color} gameId="embed" />;
}
export function NeuronBuilderGame({ color }: { color: string }) {
  return <ConceptChallengeGame color={color} gameId="neuron" />;
}
export function BackpropTracerGame({ color }: { color: string }) {
  return <ConceptChallengeGame color={color} gameId="backprop" />;
}
export function TransformerStackGame({ color }: { color: string }) {
  return <ConceptChallengeGame color={color} gameId="trans" />;
}
export function TokenGeneratorGame({ color }: { color: string }) {
  return <ConceptChallengeGame color={color} gameId="gen" />;
}
export function AlignmentSorterGame({ color }: { color: string }) {
  return <ConceptChallengeGame color={color} gameId="align" />;
}
export function RagHunterGame({ color }: { color: string }) {
  return <ConceptChallengeGame color={color} gameId="rag" />;
}
export function AgentLoopGame({ color }: { color: string }) {
  return <ConceptChallengeGame color={color} gameId="agent" />;
}
export function OrchestratorGame({ color }: { color: string }) {
  return <ConceptChallengeGame color={color} gameId="orch" />;
}
export function MathPlaygroundGame({ color }: { color: string }) {
  return <ConceptChallengeGame color={color} gameId="math" />;
}

function ConceptChallengeGame({ color, gameId }: { color: string; gameId: ConceptGameId }) {
  const game = CONCEPT_GAME_MODULES[gameId];
  const [phase, setPhase] = useState<"start" | "play" | "end">("start");
  const [round, setRound] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);

  const reset = () => {
    setPhase("start");
    setRound(0);
    setPicked(null);
    setScore(0);
  };

  const choose = (index: number) => {
    if (picked !== null) return;
    setPicked(index);
    if (index === game.rounds[round].correct) {
      setScore(current => current + 100);
      playSound("success");
    } else {
      playSound("wrong");
    }
  };

  const next = () => {
    if (round < game.rounds.length - 1) {
      setRound(current => current + 1);
      setPicked(null);
    } else {
      setPhase("end");
    }
  };

  if (phase === "start") {
    return <StartScreen title={game.title} desc={game.instruction} onStart={() => setPhase("play")} color={color} />;
  }
  if (phase === "end") {
    return <EndScreen score={score} max={game.rounds.length * 100} onRestart={reset} color={color} msg="Cada decisión conecta el concepto con una situación real." />;
  }

  const challenge = game.rounds[round];
  return (
    <GameFrame title={game.title} instruction={game.instruction} color={color} onRestart={reset}>
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span>Ronda {round + 1}/{game.rounds.length}</span>
        <span className="font-bold" style={{ color }}>{score} pts</span>
      </div>
      <div className="rounded-xl border border-slate-700/50 bg-slate-900/40 p-4">
        <p className="text-sm font-semibold text-slate-100 mb-3">{challenge.prompt}</p>
        <div className="grid gap-2">
          {challenge.options.map((option, index) => {
            const correct = index === challenge.correct;
            const selected = picked === index;
            return (
              <button
                key={option}
                onClick={() => choose(index)}
                disabled={picked !== null}
                className={cn(
                  "w-full rounded-lg border px-3 py-2.5 text-left text-sm transition flex items-center justify-between gap-2",
                  picked !== null && correct && "border-emerald-500 bg-emerald-500/10 text-emerald-100",
                  selected && !correct && "border-rose-500 bg-rose-500/10 text-rose-100",
                  picked === null && "border-slate-700 bg-slate-900/60 text-slate-200 hover:border-slate-500",
                  picked !== null && !correct && !selected && "border-slate-800 text-slate-500",
                )}
              >
                <span>{option}</span>
                {picked !== null && correct && <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />}
                {selected && !correct && <XCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />}
              </button>
            );
          })}
        </div>
        {picked !== null && (
          <p className="mt-3 text-xs leading-relaxed text-slate-300" role="status">
            {challenge.explain}
          </p>
        )}
      </div>
      {picked !== null && (
        <button onClick={next} className="w-full rounded-xl py-3 text-sm font-bold text-[#0a0414]" style={{ background: color }}>
          {round < game.rounds.length - 1 ? "SIGUIENTE RETO" : "VER RESULTADO"}
        </button>
      )}
    </GameFrame>
  );
}
