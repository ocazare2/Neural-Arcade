"use client";

import { useRef, useState, type ReactNode } from "react";
import {
  ArrowDown, ArrowLeft, ArrowRight, ArrowUp, BatteryCharging,
  Bot, CheckCircle2, Minus, Plus, RotateCcw, Star, Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

type MissionProps = { onComplete: (stars: number) => void };
type Position = readonly [number, number];

const CONTROL_CLASS = "min-h-12 min-w-12 rounded-xl border border-cyan-400/30 bg-cyan-950/70 text-cyan-100 transition hover:bg-cyan-900 active:bg-cyan-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-300 disabled:cursor-not-allowed disabled:border-slate-800 disabled:bg-slate-900 disabled:text-slate-600";
const PIXEL_TARGET = [false, true, false, true, true, true, false, true, false];
const RESCUE_WALLS: readonly Position[] = [[1, 4], [1, 3], [1, 2], [3, 2], [3, 0], [3, 1]];
const NO_WALLS: readonly Position[] = [];

function samePosition(a: Position, b: Position) {
  return a[0] === b[0] && a[1] === b[1];
}

function subtract(a: Position, b: Position): Position {
  return [a[0] - b[0], a[1] - b[1]];
}

function vectorText(vector: Position) {
  return `[${vector[0]}, ${vector[1]}]`;
}

function MissionFrame({ title, instruction, children }: {
  title: string;
  instruction: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-4 rounded-2xl border border-cyan-500/25 bg-slate-950/70 p-3 sm:p-6">
      <div className="space-y-2">
        <h3 className="text-xl font-extrabold tracking-tight text-cyan-100">{title}</h3>
        <p className="text-sm leading-relaxed text-slate-300">{instruction}</p>
      </div>
      {children}
    </section>
  );
}

function Discovery({ children }: { children: ReactNode }) {
  return (
    <div role="status" className="rounded-xl border border-emerald-400/40 bg-emerald-950/40 p-4">
      <p className="mb-2 flex items-center gap-2 font-bold text-emerald-300">
        <CheckCircle2 className="h-5 w-5 shrink-0" aria-hidden />
        ¡Misión cumplida!
      </p>
      <p className="text-sm leading-relaxed text-slate-200">{children}</p>
    </div>
  );
}

function useMissionComplete(onComplete: MissionProps["onComplete"]) {
  const completed = useRef(false);
  return () => {
    if (completed.current) return;
    completed.current = true;
    onComplete(3);
  };
}

function RobotMission({ rescue = false, onComplete }: MissionProps & { rescue?: boolean }) {
  const start: Position = rescue ? [0, 4] : [0, 0];
  const target: Position = rescue ? [4, 0] : [3, 2];
  const walls = rescue ? RESCUE_WALLS : NO_WALLS;
  const [position, setPosition] = useState<Position>(start);
  const [lastMove, setLastMove] = useState<Position>([0, 0]);
  const [feedback, setFeedback] = useState(rescue
    ? "El error vectorial apunta desde tu posición hasta la meta. Los muros pueden impedir ir directo: usa el error como brújula, no como un camino obligatorio."
    : "El vector de posición p = [0, 0] tiene dos componentes: horizontal y vertical. Toca una flecha para sumar un desplazamiento Δp.");
  const complete = useMissionComplete(onComplete);
  const won = samePosition(position, target);
  const error = subtract(target, position);
  const previousPosition = subtract(position, lastMove);

  function move(dx: number, dy: number) {
    if (won) return;
    const next: Position = [position[0] + dx, position[1] + dy];
    if (next.some(value => value < 0 || value > 4)) {
      setFeedback(`El desplazamiento Δp = ${vectorText([dx, dy])} saldría del tablero. Los dos componentes siguen siendo importantes: uno horizontal y otro vertical.`);
      return;
    }
    if (walls.some(wall => samePosition(wall, next))) {
      setFeedback("Hay un muro por ese lado. El error vectorial todavía indica dónde está la meta; prueba un componente distinto para rodear el obstáculo.");
      return;
    }
    setPosition(next);
    setLastMove([dx, dy]);
    if (samePosition(next, target)) {
      setFeedback(rescue
        ? "¡Robot rescatado! Tu error vectorial ahora es e = [0, 0]: posición y meta coinciden."
        : "¡Batería encontrada! Llegaste usando suma de vectores, componente por componente.");
      complete();
    } else {
      setFeedback(rescue
        ? `p = ${vectorText(position)} + Δp = ${vectorText([dx, dy])} = ${vectorText(next)}. Ahora e = meta − p = ${vectorText(subtract(target, next))}.`
        : `p = ${vectorText(position)} + Δp = ${vectorText([dx, dy])} = ${vectorText(next)}. Sumaste cada componente por separado.`);
    }
  }

  const directions = [
    { label: "Izquierda", detail: "horizontal −1", dx: -1, dy: 0, Icon: ArrowLeft },
    { label: "Subir", detail: "vertical +1", dx: 0, dy: 1, Icon: ArrowUp },
    { label: "Bajar", detail: "vertical −1", dx: 0, dy: -1, Icon: ArrowDown },
    { label: "Derecha", detail: "horizontal +1", dx: 1, dy: 0, Icon: ArrowRight },
  ];

  return (
    <MissionFrame
      title={rescue ? "Error vectorial: rescata al robot" : "Laboratorio de vectores"}
      instruction={rescue
        ? "Describe la meta y tu posición con vectores desde el origen. Calcula e = meta − posición, luego rodea los muros con desplazamientos pequeños; puedes probar sin límite."
        : "La coordenada del robot es un punto; desde el origen la describimos con su vector de posición p. Llega a la batería sumando desplazamientos Δp, no memorizando flechas."}
    >
      <div className="rounded-xl border border-cyan-400/25 bg-cyan-950/20 p-3 sm:p-4">
        <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-cyan-300">El lenguaje del tablero</p>
        <p className="mt-2 text-sm leading-relaxed text-slate-200">
          El robot está en el <strong className="text-cyan-200">punto</strong> <span className="font-mono text-cyan-100">(x, y)</span>. La flecha desde el origen hasta ese punto es su <strong className="text-cyan-200">vector de posición</strong> <span className="font-mono text-cyan-100">p = [x, y]</span>: sus componentes están ordenados, horizontal primero y vertical después.
        </p>
        <div className="mt-3 grid grid-cols-2 gap-2 text-center sm:grid-cols-4">
          <div className="rounded-lg border border-cyan-500/20 bg-slate-950/60 p-2">
            <p className="text-[10px] uppercase tracking-wide text-slate-400">Posición p</p>
            <p className="mt-1 font-mono text-lg font-bold text-cyan-200">{vectorText(position)}</p>
          </div>
          <div className="rounded-lg border border-amber-400/20 bg-slate-950/60 p-2">
            <p className="text-[10px] uppercase tracking-wide text-slate-400">Meta</p>
            <p className="mt-1 font-mono text-lg font-bold text-amber-200">{vectorText(target)}</p>
          </div>
          <div className="rounded-lg border border-violet-400/20 bg-slate-950/60 p-2">
            <p className="text-[10px] uppercase tracking-wide text-slate-400">Último Δp</p>
            <p className="mt-1 font-mono text-lg font-bold text-violet-200">{vectorText(lastMove)}</p>
          </div>
          <div className="rounded-lg border border-emerald-400/20 bg-slate-950/60 p-2">
            <p className="text-[10px] uppercase tracking-wide text-slate-400">{rescue ? "Error e" : "Componentes"}</p>
            <p className="mt-1 font-mono text-lg font-bold text-emerald-200">{rescue ? vectorText(error) : "x, y"}</p>
          </div>
        </div>
        <div className="mt-3 rounded-lg bg-slate-950/70 p-2 text-center font-mono text-xs text-slate-300 sm:text-sm">
          <span className="text-violet-200">{vectorText(previousPosition)}</span> + <span className="text-cyan-200">{vectorText(lastMove)}</span> = <span className="text-emerald-200">{vectorText(position)}</span>
        </div>
        {rescue && <p className="mt-2 text-center font-mono text-xs text-emerald-100">posición + e = {vectorText(position)} + {vectorText(error)} = {vectorText(target)} = meta</p>}
        <p className="mt-2 text-center text-xs font-semibold text-amber-200">Dimensión: 2 componentes</p>
      </div>

      <div className="mx-auto w-full max-w-56 sm:max-w-72">
        <div role="img" aria-label={`Tablero de 5 por 5. Robot en horizontal ${position[0]}, vertical ${position[1]}. Batería en horizontal ${target[0]}, vertical ${target[1]}.${rescue ? " Hay muros grises que debes rodear." : ""}`}>
          <div className="grid grid-cols-[1.25rem_minmax(0,1fr)] gap-1.5" aria-hidden>
            {[4, 3, 2, 1, 0].map(y => (
              <div key={y} className="contents">
                <span className="flex items-center justify-center font-mono text-xs text-slate-400">{y}</span>
                <div className="grid grid-cols-5 gap-1">
                  {[0, 1, 2, 3, 4].map(x => {
                    const robot = samePosition(position, [x, y]);
                    const battery = samePosition(target, [x, y]);
                    const wall = walls.some(cell => samePosition(cell, [x, y]));
                    return (
                      <div key={x} className={cn(
                        "flex aspect-square min-w-0 items-center justify-center rounded-md border",
                        wall ? "border-slate-500 bg-slate-600" : "border-slate-800 bg-slate-900",
                        battery && "border-amber-400/70 bg-amber-950/60",
                        robot && "border-cyan-300 bg-cyan-900 shadow-[0_0_16px_#22d3ee35]",
                        robot && won && "border-emerald-300 bg-emerald-900",
                      )}>
                        {robot ? <Bot className="h-6 w-6 text-cyan-100 sm:h-8 sm:w-8" />
                          : battery ? <BatteryCharging className="h-6 w-6 text-amber-300 sm:h-8 sm:w-8" />
                          : wall ? <span className="font-mono text-lg text-slate-300">▧</span> : null}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
            <span />
            <div className="grid grid-cols-5 gap-1">
              {[0, 1, 2, 3, 4].map(x => <span key={x} className="text-center font-mono text-xs text-slate-400">{x}</span>)}
            </div>
          </div>
        </div>
        <p className="mt-3 text-center text-xs leading-relaxed text-slate-300">
          [<span className="text-cyan-300">horizontal ↔</span>, <span className="text-amber-300">vertical ↕</span>]
          <br />El origen es [0, 0], abajo a la izquierda. Cambiar el orden cambia el punto: [3, 2] ≠ [2, 3].
        </p>
      </div>

      <div className="mx-auto grid w-full max-w-72 grid-cols-4 gap-2">
        {directions.map(({ label, detail, dx, dy, Icon }) => (
          <button
            key={label}
            type="button"
            aria-label={`${label}: ${detail}`}
            title={`${label}: ${detail}`}
            disabled={won || position[0] + dx < 0 || position[0] + dx > 4 || position[1] + dy < 0 || position[1] + dy > 4}
            onClick={() => move(dx, dy)}
            className={cn(CONTROL_CLASS, "flex h-14 w-full flex-col items-center justify-center gap-0.5")}
          >
            <Icon className="h-6 w-6" aria-hidden />
            <span aria-hidden className="text-[10px] font-medium">{label}</span>
            <span aria-hidden className="font-mono text-[9px] text-cyan-300">Δp {vectorText([dx, dy])}</span>
          </button>
        ))}
      </div>
      <p aria-live="polite" aria-atomic="true" className="min-h-10 text-center text-sm leading-relaxed text-slate-300">{feedback}</p>
      {won ? (
        <Discovery>
          {rescue ? <><strong>e = meta − p = [0, 0]</strong>: ya no hay diferencia entre tu predicción y el objetivo. En una IA, medir ese error permite decidir qué números ajustar; los muros te recuerdan que minimizarlo puede requerir varios pasos.</>
            : <><strong>p = [3, 2]</strong> es un vector de dimensión 2: sus componentes son 3 horizontal y 2 vertical. Cada flecha añadió otro vector Δp; al sumar componente por componente llegaste a la meta. Una IA también usa vectores, solo que sus listas pueden tener cientos o miles de componentes.</>}
        </Discovery>
      ) : (
        <button type="button" onClick={() => { setPosition(start); setLastMove([0, 0]); setFeedback(rescue ? "Volviste al inicio. Recalcula e = meta − p y prueba otra ruta." : "Volviste al origen p = [0, 0]. Un vector se entiende al poder cambiarlo, observarlo y sumarlo."); }} className="mx-auto flex min-h-11 items-center justify-center gap-2 rounded-lg px-3 text-sm text-slate-400 hover:bg-slate-800 hover:text-slate-200 focus-visible:outline-2 focus-visible:outline-cyan-300">
          <RotateCcw className="h-4 w-4" aria-hidden /> Volver al inicio
        </button>
      )}
    </MissionFrame>
  );
}

function PixelMission({ onComplete }: MissionProps) {
  const [pixels, setPixels] = useState<boolean[]>(Array(9).fill(false));
  const complete = useMissionComplete(onComplete);
  const won = pixels.every((pixel, index) => pixel === PIXEL_TARGET[index]);
  const correct = pixels.filter((pixel, index) => pixel === PIXEL_TARGET[index]).length;
  const rows = [0, 1, 2].map((row) => pixels.slice(row * 3, row * 3 + 3).map(Number));

  function toggle(index: number) {
    if (won) return;
    const next = pixels.map((pixel, cell) => cell === index ? !pixel : pixel);
    setPixels(next);
    if (next.every((pixel, cell) => pixel === PIXEL_TARGET[cell])) complete();
  }

  return (
    <MissionFrame title="Matriz de píxeles: dibuja una señal" instruction="Copia el signo +. Cada fila es un vector de 3 componentes; al apilar 3 filas obtienes una matriz 3 × 3.">
      <div className="rounded-xl border border-violet-400/25 bg-violet-950/20 p-3 text-center">
        <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-violet-300">Matriz M</p>
        <p className="mt-1 text-xs text-slate-300">Forma: <strong className="font-mono text-violet-200">3 filas × 3 columnas</strong> = 9 números. Cada fila es un vector de dimensión 3.</p>
        <output aria-live="polite" aria-label="Matriz actual de píxeles" className="mt-3 block overflow-x-auto whitespace-nowrap rounded-lg bg-slate-950/70 p-2 font-mono text-xs text-cyan-100">
          [{rows.map((row) => `[${row.join(", ")}]`).join(", ")}]
        </output>
      </div>
      <div className="flex flex-col items-center justify-center gap-6 sm:flex-row sm:gap-10">
        <div className="text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-amber-300">Así debe quedar</p>
          <div role="img" aria-label="Modelo: signo más. Enciende el centro y las cuatro casillas pegadas a él; deja las cuatro esquinas apagadas." className="mx-auto grid w-24 grid-cols-3 gap-1 rounded-lg border border-amber-400/20 bg-slate-950 p-2">
            {PIXEL_TARGET.map((pixel, index) => <span aria-hidden key={index} className={cn("flex aspect-square items-center justify-center rounded-sm font-mono text-xs", pixel ? "bg-amber-300 text-slate-950" : "bg-slate-800 text-slate-400")}>{Number(pixel)}</span>)}
          </div>
        </div>
        <div className="w-full max-w-60">
          <p className="mb-2 text-center text-xs font-semibold uppercase tracking-wider text-cyan-300">Tu pantalla</p>
          <div className="grid grid-cols-[1.25rem_repeat(3,minmax(0,1fr))] gap-1.5">
            <span aria-hidden />
            {[1, 2, 3].map(column => <span key={column} aria-hidden className="text-center text-xs text-slate-400">{column}</span>)}
            {[0, 1, 2].map(row => (
              <div key={row} className="contents">
                <span aria-hidden className="flex items-center justify-center text-xs text-slate-400">{row + 1}</span>
                {[0, 1, 2].map(column => {
                  const index = row * 3 + column;
                  return (
                    <button
                      type="button"
                      key={column}
                      disabled={won}
                      aria-label={`Fila ${row + 1}, columna ${column + 1}: ${pixels[index] ? "encendida" : "apagada"}`}
                      aria-pressed={pixels[index]}
                      onClick={() => toggle(index)}
                      className={cn("aspect-square min-h-11 min-w-11 rounded-lg border text-xl font-bold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300 disabled:cursor-default", pixels[index] ? "border-cyan-200 bg-cyan-300 text-slate-950 shadow-[0_0_12px_#22d3ee30]" : "border-slate-700 bg-slate-900 text-slate-500 hover:border-cyan-500")}
                    >{Number(pixels[index])}</button>
                  );
                })}
              </div>
            ))}
          </div>
          <p className="mt-3 text-center text-xs text-slate-300">1 = encendida · 0 = apagada</p>
        </div>
      </div>
      <p aria-live="polite" aria-atomic="true" className="text-center text-sm text-slate-300">{correct} de 9 casillas coinciden con el modelo.</p>
      {won ? <Discovery>Tu dibujo es una <strong>matriz 3 × 3</strong>: tres vectores de dimensión 3 apilados. Cada entrada conserva fila y columna; por eso cambiar un 0 por un 1 cambia una parte concreta de la imagen. Una máquina procesa imágenes como tablas de números más grandes.</Discovery>
        : <p className="text-center text-xs leading-relaxed text-slate-400">Pista: enciende el centro y sus cuatro vecinos. Deja las esquinas en 0.</p>}
    </MissionFrame>
  );
}

function EnergyMission({ onComplete }: MissionProps) {
  const [cells, setCells] = useState(0);
  const [stars, setStars] = useState(0);
  const complete = useMissionComplete(onComplete);
  const energy = cells * 2 + stars * 3;
  const won = energy === 12;
  const inputs: Position = [cells, stars];
  const weights: Position = [2, 3];

  function change(source: "cells" | "stars", delta: number) {
    if (won) return;
    const nextCells = source === "cells" ? Math.min(6, Math.max(0, cells + delta)) : cells;
    const nextStars = source === "stars" ? Math.min(6, Math.max(0, stars + delta)) : stars;
    setCells(nextCells);
    setStars(nextStars);
    if (nextCells * 2 + nextStars * 3 === 12) complete();
  }

  return (
    <MissionFrame title="Producto punto: carga el portal" instruction="Consigue exactamente 12 de energía. Empareja cada entrada con su peso, multiplica y suma: eso es un producto punto.">
      <div className="rounded-xl border border-fuchsia-400/25 bg-fuchsia-950/20 p-3 text-center">
        <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-fuchsia-300">Dos vectores, un número</p>
        <div className="mt-3 grid grid-cols-2 gap-2 font-mono text-sm">
          <div className="rounded-lg bg-slate-950/70 p-2 text-cyan-100">x = {vectorText(inputs)}<span className="mt-1 block font-sans text-[10px] text-slate-400">entradas: pilas, estrellas</span></div>
          <div className="rounded-lg bg-slate-950/70 p-2 text-amber-100">w = {vectorText(weights)}<span className="mt-1 block font-sans text-[10px] text-slate-400">pesos: aporte de cada tipo</span></div>
        </div>
        <p className="mt-3 text-xs text-slate-300">Dimensión: 2 componentes en ambos vectores. El producto punto devuelve un <strong className="text-fuchsia-200">escalar</strong>: un solo número.</p>
        <output aria-live="polite" className="mt-3 block overflow-x-auto whitespace-nowrap rounded-lg bg-slate-950/70 p-2 font-mono text-sm text-fuchsia-100">
          x · w = ({cells} × 2) + ({stars} × 3) = {energy}
        </output>
      </div>
      <div className={cn("rounded-xl border p-4 text-center", won ? "border-emerald-400/50 bg-emerald-950/30" : energy > 12 ? "border-amber-400/40 bg-amber-950/20" : "border-cyan-400/30 bg-cyan-950/30")}>
        <p className="mb-2 flex items-center justify-center gap-2 text-sm text-slate-300"><Zap className="h-4 w-4 text-amber-300" aria-hidden /> Energía del portal</p>
        <p className="font-mono text-3xl font-bold text-cyan-100">{energy} <span className="text-lg text-slate-400">/ 12</span></p>
        <div aria-hidden className="mt-3 grid grid-cols-12 gap-1">
          {Array.from({ length: 12 }, (_, index) => <span key={index} className={cn("h-5 rounded-sm", index < energy ? won ? "bg-emerald-400" : energy > 12 ? "bg-amber-400" : "bg-cyan-400" : "bg-slate-800")} />)}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {([
          { source: "cells", label: "Pilas", singular: "pila", value: cells, weight: 2, Icon: BatteryCharging },
          { source: "stars", label: "Estrellas", singular: "estrella", value: stars, weight: 3, Icon: Star },
        ] as const).map(({ source, label, singular, value, weight, Icon }) => (
          <div key={source} className="rounded-xl border border-slate-700/80 bg-slate-900/70 p-3">
            <p className="flex items-center justify-between gap-2 text-sm font-bold text-slate-200"><span className="flex items-center gap-2"><Icon className="h-5 w-5 text-amber-300" aria-hidden />{label}</span><span className="text-xs font-normal text-slate-400">{weight} de energía c/u</span></p>
            <div className="mt-3 flex items-center justify-center gap-4">
              <button type="button" aria-label={`Quitar una ${singular}`} disabled={won || value === 0} onClick={() => change(source, -1)} className={cn(CONTROL_CLASS, "flex items-center justify-center")}><Minus className="h-5 w-5" aria-hidden /></button>
              <output className="min-w-8 text-center font-mono text-2xl font-bold text-cyan-100" aria-label={`Cantidad de ${label.toLowerCase()}`}>{value}</output>
              <button type="button" aria-label={`Añadir una ${singular}`} disabled={won || value === 6} onClick={() => change(source, 1)} className={cn(CONTROL_CLASS, "flex items-center justify-center")}><Plus className="h-5 w-5" aria-hidden /></button>
            </div>
            <div aria-hidden className="my-3 flex h-5 items-center justify-center gap-1.5">{value ? Array.from({ length: value }, (_, index) => <Icon key={index} className="h-5 w-5 text-amber-300" />) : <span className="text-xs text-slate-500">Todavía no has añadido ninguna</span>}</div>
            <p className="text-center font-mono text-sm text-slate-300">{value} × {weight} = <strong className="text-cyan-200">{value * weight}</strong> de energía</p>
          </div>
        ))}
      </div>
      <div className="rounded-lg bg-slate-900 p-3 text-center">
        <p className="text-xs text-slate-400">Emparejamos componentes, multiplicamos y sumamos</p>
        <p className="mt-1 font-mono text-lg text-cyan-100">{vectorText(inputs)} · {vectorText(weights)} = {cells * 2} + {stars * 3} = {energy}</p>
      </div>
      <p aria-live="polite" aria-atomic="true" className="text-center text-sm text-slate-300">{won ? "¡Portal encendido! Encontraste una combinación." : energy < 12 ? `Faltan ${12 - energy} de energía. Prueba con + y −.` : `Sobran ${energy - 12} de energía. Quita o cambia alguna pieza; no pierdes puntos.`}</p>
      {won && <Discovery>Calculaste el <strong>producto punto</strong> <strong>x · w = {cells} × 2 + {stars} × 3 = 12</strong>. Los vectores deben tener la misma dimensión para emparejar sus componentes. Los valores de w son <strong>pesos</strong>: una neurona artificial usa este mismo patrón —producto punto más sesgo— antes de decidir su salida.</Discovery>}
    </MissionFrame>
  );
}

export function MathMission({ mission, onComplete }: MissionProps & { mission: number }) {
  switch (mission) {
    case 0: return <RobotMission key="coordinates" onComplete={onComplete} />;
    case 1: return <PixelMission key="pixels" onComplete={onComplete} />;
    case 2: return <EnergyMission key="energy" onComplete={onComplete} />;
    default: return <RobotMission key="rescue" rescue onComplete={onComplete} />;
  }
}
