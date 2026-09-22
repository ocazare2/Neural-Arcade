"use client";

import { useRef, useState, type ReactNode } from "react";
import { CheckCircle2, RotateCcw, Scissors, Undo2 } from "lucide-react";
import { playSound } from "../lib/sound";
import { advanceTokenBuild, type TokenBuildTarget } from "../token-build";

type MissionProps = { onComplete: (stars: number) => void };

const chipClass = "min-h-12 min-w-12 rounded-xl border border-cyan-400/40 bg-cyan-400/10 px-4 py-3 font-mono font-bold text-cyan-100 transition hover:bg-cyan-400/20 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-300 disabled:cursor-default disabled:opacity-50";
const actionClass = "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-slate-600 px-3 py-2 text-sm text-slate-200 hover:bg-slate-700/50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-300 disabled:opacity-40";

function useMissionResult(onComplete: MissionProps["onComplete"]) {
  const reported = useRef(false);
  const [finished, setFinished] = useState(false);
  function finish() {
    setFinished(true);
    if (!reported.current) {
      reported.current = true;
      onComplete(3);
    }
  }
  return { finished, finish, retry: () => setFinished(false) };
}

function Playground({ title, instruction, children, finished, explanation, notice }: {
  title: string;
  instruction: string;
  children: ReactNode;
  finished: boolean;
  explanation: string;
  notice?: string;
}) {
  return (
    <section className="min-w-0 space-y-5 rounded-2xl border border-cyan-400/20 bg-slate-900/70 p-4 sm:p-6">
      <div>
        <h3 className="text-lg font-bold text-cyan-100">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-300">{instruction}</p>
      </div>
      {children}
      <div aria-live="polite" aria-atomic="true">
        {finished ? (
          <div className="rounded-xl border border-emerald-400/30 bg-emerald-400/10 p-4 text-sm leading-relaxed text-emerald-100">
            <p className="mb-1 flex items-center gap-2 font-bold"><CheckCircle2 aria-hidden="true" className="h-5 w-5 shrink-0" />¡Misión completada!</p>
            <p>{explanation}</p>
          </div>
        ) : notice ? <p className="rounded-lg bg-slate-800 p-3 text-sm leading-relaxed text-slate-200">{notice}</p> : null}
      </div>
    </section>
  );
}

function EditControls({ undo, reset, canUndo }: { undo: () => void; reset: () => void; canUndo: boolean }) {
  return (
    <div className="flex flex-wrap gap-2">
      <button type="button" onClick={undo} disabled={!canUndo} className={actionClass}><Undo2 aria-hidden="true" className="h-4 w-4" />Deshacer</button>
      <button type="button" onClick={reset} className={actionClass}><RotateCcw aria-hidden="true" className="h-4 w-4" />Reiniciar</button>
    </div>
  );
}

function TokenSlots({ pieces, capacity, ids }: { pieces: string[]; capacity: number; ids?: Record<string, number> }) {
  return (
    <ol aria-label="Piezas del mensaje, en orden" className={`grid grid-cols-3 gap-2 ${capacity > 3 ? "sm:grid-cols-6" : ""}`}>
      {Array.from({ length: capacity }, (_, index) => (
        <li key={index} className={`flex min-h-20 min-w-0 flex-col items-center justify-center rounded-xl border p-2 ${pieces[index] ? "border-cyan-400/50 bg-cyan-400/10 text-cyan-100" : "border-dashed border-slate-600 text-slate-500"}`}>
          <span className="mb-1 text-xs">{index + 1}</span>
          <span className="max-w-full break-all font-mono font-bold">{pieces[index] ?? "·"}</span>
          {ids && pieces[index] !== undefined && <span className="mt-1 text-xs text-amber-200">ID {ids[pieces[index]]}</span>}
        </li>
      ))}
    </ol>
  );
}

function CutMessage({ onComplete }: MissionProps) {
  const message = "elgatoduerme";
  const [cuts, setCuts] = useState<number[]>([]);
  const [notice, setNotice] = useState("");
  const { finished, finish, retry } = useMissionResult(onComplete);
  const boundaries = [...cuts].sort((a, b) => a - b);
  const tokens = [...boundaries, message.length].map((end, index) => message.slice(index === 0 ? 0 : boundaries[index - 1], end));

  function toggleCut(position: number) {
    if (finished) return;
    const next = cuts.includes(position) ? cuts.filter(cut => cut !== position) : [...cuts, position];
    setCuts(next);
    playSound("tick");
    if (next.length === 2 && next.includes(2) && next.includes(6)) finish();
    else setNotice(next.some(cut => cut !== 2 && cut !== 6)
      ? "Ese corte separa una palabra. Tócalo otra vez para unirla; aquí buscamos «el», «gato» y «duerme»."
      : "Mira las piezas de abajo: cada corte crea un token nuevo.");
  }

  function reset() { setCuts([]); setNotice(""); retry(); }

  return (
    <Playground
      title="1. Corta un mensaje"
      instruction="Toca la última letra de «el» y de «gato» para cortar el mensaje en 3 piezas. A cada pieza la llamamos token."
      finished={finished}
      explanation="Creaste 3 tokens: «el», «gato» y «duerme». Este es un corte de práctica: un token real también puede ser parte de una palabra, un espacio o un signo."
      notice={notice}
    >
      <div className="rounded-xl bg-slate-950/70 p-4 text-center">
        <p className="text-xs text-slate-400">El mensaje que queremos separar</p>
        <p className="mt-2 break-words text-xl font-bold text-white">el gato duerme</p>
      </div>
      <div className="grid grid-cols-4 gap-2 sm:grid-cols-6" aria-label="Letras del mensaje; toca para cortar después de una letra">
        {Array.from(message).map((letter, index) => (
          <button
            key={index}
            type="button"
            disabled={finished || index === message.length - 1}
            aria-label={`Cortar después de la letra ${index + 1}: ${letter}`}
            aria-pressed={cuts.includes(index + 1)}
            onClick={() => toggleCut(index + 1)}
            className={`relative flex min-h-16 min-w-0 flex-col items-center justify-center rounded-lg border focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-300 disabled:cursor-default ${cuts.includes(index + 1) ? "border-amber-300 bg-amber-300/15 text-amber-100" : "border-slate-600 bg-slate-800 text-white hover:border-cyan-400"}`}
          >
            <span className="text-[10px] text-slate-400">{index + 1}</span>
            <span className="font-mono text-xl">{letter}</span>
            {cuts.includes(index + 1) && <Scissors aria-hidden="true" className="absolute right-1 top-1 h-3 w-3" />}
          </button>
        ))}
      </div>
      <div>
        <p className="mb-2 text-sm text-slate-300">Tus piezas: {tokens.length} {tokens.length === 1 ? "token" : "tokens"}</p>
        <div className="flex flex-wrap gap-2" aria-label={`Tus tokens: ${tokens.join(", ")}`}>
          {tokens.map((token, index) => <span key={index} className="max-w-full break-all rounded-lg border border-cyan-400/40 bg-cyan-400/10 px-3 py-2 font-mono text-cyan-100">{token}</span>)}
        </div>
      </div>
      <EditControls canUndo={cuts.length > 0 && !finished} undo={() => { setCuts(cuts.slice(0, -1)); setNotice(""); }} reset={reset} />
    </Playground>
  );
}

function BuildWord({ onComplete }: MissionProps) {
  const [target, setTarget] = useState<TokenBuildTarget>("robot");
  const [pieces, setPieces] = useState<string[]>([]);
  const [notice, setNotice] = useState("");
  const { finished, finish, retry } = useMissionResult(onComplete);
  const assembled = pieces.join("");
  const wordNumber = target === "robot" ? 1 : 2;

  function add(piece: string) {
    if (finished || pieces.length >= 4) return;
    const next = advanceTokenBuild({ pieces, target }, piece);
    setPieces(next.pieces);
    setTarget(next.target);
    setNotice(next.notice);
    playSound("tick");
    if (next.completed) finish();
  }

  function reset() { setTarget("robot"); setPieces([]); setNotice(""); retry(); }

  return (
    <Playground
      title="2. Construye con piezas pequeñas"
      instruction="Toca las piezas en orden para construir la palabra de la pantalla. Puedes reutilizar una pieza o deshacer un movimiento."
      finished={finished}
      explanation="«Robot» usó 2 tokens y «robotito» usó 3. Las piezas disponibles forman nuestro vocabulario. Una palabra no siempre equivale a un token: distintos modelos pueden dividirla de otra manera."
      notice={notice}
    >
      <div className="rounded-xl bg-slate-950/70 p-4 text-center">
        <p className="text-xs text-slate-400">Palabra {wordNumber} de 2</p>
        <p className="mt-2 text-2xl font-bold text-white">{target}</p>
        <p className="mt-3 min-h-8 break-all font-mono text-xl text-cyan-200" aria-label={`Tu palabra: ${assembled || "vacía"}`}>{assembled || "___"}</p>
        <p className="mt-1 text-xs text-slate-400">{pieces.length} {pieces.length === 1 ? "token" : "tokens"}</p>
      </div>
      <div className="flex flex-wrap justify-center gap-3" aria-label="Piezas disponibles">
        {["ito", "rob", "ot"].map(piece => <button key={piece} type="button" className={chipClass} disabled={finished || pieces.length >= 4} onClick={() => add(piece)}>{piece}</button>)}
      </div>
      <EditControls canUndo={pieces.length > 0 && !finished} undo={() => { setPieces(pieces.slice(0, -1)); setNotice(""); }} reset={reset} />
    </Playground>
  );
}

function LabelTokens({ onComplete }: MissionProps) {
  const dictionary: Record<string, number> = { hola: 7, robot: 42 };
  const target = ["hola", "robot", "hola"];
  const [pieces, setPieces] = useState<string[]>([]);
  const [notice, setNotice] = useState("");
  const { finished, finish, retry } = useMissionResult(onComplete);

  function add(piece: string) {
    if (finished || pieces.length >= target.length) return;
    const next = [...pieces, piece];
    setPieces(next);
    playSound("tick");
    if (next.length === target.length && next.every((token, index) => token === target[index])) finish();
    else setNotice(next.every((token, index) => token === target[index])
      ? "Cada pieza recibe su etiqueta. Cuando repitas «hola», aparecerá otra vez el 7."
      : "Mira el orden del mensaje. Puedes deshacer la última pieza para corregirlo.");
  }

  return (
    <Playground
      title="3. Envíale el mensaje al robot"
      instruction="Construye «hola robot hola» tocando las piezas en ese orden. El robot cambiará cada pieza por su número de identificación (ID)."
      finished={finished}
      explanation="El robot recibió 7, 42, 7: la misma pieza conserva el mismo ID en este diccionario. El 42 no significa que «robot» sea más grande o más importante que «hola»; los números son etiquetas."
      notice={notice}
    >
      <p className="rounded-xl bg-slate-950/70 p-4 text-center text-xl font-bold text-white">hola robot hola</p>
      <div>
        <p className="mb-2 text-sm text-slate-300">Diccionario de este robot · toca para enviar</p>
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(dictionary).map(([piece, id]) => (
            <button key={piece} type="button" className={chipClass} disabled={finished || pieces.length >= target.length} onClick={() => add(piece)} aria-label={`Enviar ${piece}, ID ${id}`}>
              <span className="block">{piece}</span><span className="mt-1 block text-xs font-normal text-amber-200">ID {id}</span>
            </button>
          ))}
        </div>
      </div>
      <TokenSlots pieces={pieces} capacity={3} ids={dictionary} />
      <p className="rounded-lg bg-slate-950/70 p-3 text-center font-mono text-amber-200" aria-label="Mensaje convertido a números">{pieces.length ? pieces.map(piece => dictionary[piece]).join(" → ") : "Aquí aparecerán los ID"}</p>
      <EditControls canUndo={pieces.length > 0 && !finished} undo={() => { setPieces(pieces.slice(0, -1)); setNotice(""); }} reset={() => { setPieces([]); setNotice(""); retry(); }} />
    </Playground>
  );
}

function PackMemory({ onComplete }: MissionProps) {
  const target = ["hola", "rob", "ot", "vamos", "a", "jugar"];
  const [pieces, setPieces] = useState<string[]>([]);
  const [notice, setNotice] = useState("");
  const { finished, finish, retry } = useMissionResult(onComplete);

  function add(piece: string) {
    if (finished) return;
    if (pieces.length === target.length) {
      setNotice("Los 6 espacios están ocupados. Deshaz una pieza para liberar un espacio y corregir el mensaje.");
      return;
    }
    const next = [...pieces, piece];
    setPieces(next);
    playSound("tick");
    if (next.length === target.length && next.every((token, index) => token === target[index])) finish();
    else setNotice(next.every((token, index) => token === target[index])
      ? `${next.length} de 6 espacios ocupados. «rob» y «ot» se unen para formar «robot», pero ocupan dos espacios.`
      : "Revisa el orden del mensaje. Deshacer devuelve el último token a la mesa.");
  }

  const message = pieces.reduce((text, piece, index) => text + (index > 0 && !(pieces[index - 1] === "rob" && piece === "ot") ? " " : "") + piece, "");

  return (
    <Playground
      title="4. Llena la memoria del robot"
      instruction="Construye «hola robot vamos a jugar» con las piezas de abajo. Este robot de práctica solo tiene espacio para 6 tokens; «robot» se arma con «rob» + «ot»."
      finished={finished}
      explanation="¡El mensaje cabe justo! Escribiste 5 palabras usando 6 tokens. Los modelos tienen un límite de tokens para el texto que pueden tener disponible a la vez: se llama ventana de contexto; el tamaño depende del modelo."
      notice={notice}
    >
      <div className="rounded-xl bg-slate-950/70 p-4 text-center">
        <p className="text-xs text-slate-400">Mensaje objetivo</p>
        <p className="mt-2 text-lg font-bold text-white">hola robot vamos a jugar</p>
      </div>
      <div>
        <p className="mb-3 flex flex-wrap items-center justify-between gap-2 text-sm text-slate-300"><span>Memoria del robot</span><span className="font-mono text-cyan-200">{pieces.length} / 6 tokens</span></p>
        <TokenSlots pieces={pieces} capacity={6} />
        <p className="mt-3 min-h-8 break-words text-center text-sm text-cyan-100" aria-label={`Mensaje construido: ${message || "vacío"}`}>{message || "Toca una pieza para empezar"}</p>
      </div>
      <div className="flex flex-wrap justify-center gap-2" aria-label="Piezas para llenar la memoria">
        {["jugar", "rob", "hola", "a", "ot", "vamos"].map(piece => <button key={piece} type="button" className={chipClass} disabled={finished} onClick={() => add(piece)}>{piece}</button>)}
      </div>
      <EditControls canUndo={pieces.length > 0 && !finished} undo={() => { setPieces(pieces.slice(0, -1)); setNotice(""); }} reset={() => { setPieces([]); setNotice(""); retry(); }} />
    </Playground>
  );
}

export function TokenMission({ mission, onComplete }: MissionProps & { mission: number }) {
  switch (mission) {
    case 1: return <BuildWord key={mission} onComplete={onComplete} />;
    case 2: return <LabelTokens key={mission} onComplete={onComplete} />;
    case 3: return <PackMemory key={mission} onComplete={onComplete} />;
    default: return <CutMessage key={mission} onComplete={onComplete} />;
  }
}
