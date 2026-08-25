"use client";

import { useState, useEffect, useLayoutEffect, useRef, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronDown, BookOpen, Sparkles, Trophy, Info, Lightbulb } from "lucide-react";
import { ALL_GLOSSARY_TERMS, lookupGlossary } from "../glossary";
import { cn } from "@/lib/utils";

// ───────────────────────────────────────────────────────────
// Fórmula matemática renderizada con estilo (sin KaTeX externo)
// Soporta subíndices con _, superíndices con ^, fracciones con \frac{}{}
// ───────────────────────────────────────────────────────────
export function Formula({ children, explain }: { children: string; explain?: string }) {
  const [showExplain, setShowExplain] = useState(false);
  return (
    <div className="my-3">
      <div className="rounded-lg border border-cyan-500/30 bg-gradient-to-br from-slate-900/80 to-slate-800/60 px-4 py-3 font-mono text-sm sm:text-base text-cyan-100 overflow-x-auto">
        <MathText>{children}</MathText>
      </div>
      {explain && (
        <div className="mt-1">
          <button
            onClick={() => setShowExplain(!showExplain)}
            className="text-xs text-cyan-400/80 hover:text-cyan-300 flex items-center gap-1"
          >
            {showExplain ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
            {showExplain ? "Ocultar explicación" : "Explicar la fórmula"}
          </button>
          <AnimatePresence>
            {showExplain && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="text-xs text-slate-300/80 mt-1.5 leading-relaxed"
              >
                {explain}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

// Parser simple para matemática inline: soporta ^ superscript, _ subscript, \frac{}{}
function MathText({ children }: { children: string }) {
  const tokens = parseMath(children);
  return <span>{tokens.map((t, i) => <span key={i}>{t}</span>)}</span>;
}

function parseMath(input: string): ReactNode[] {
  // Defensive: limit input length and nesting depth to prevent abuse
  if (input.length > 2000) return [input.slice(0, 2000) + "..."];
  let depth = 0;
  const MAX_DEPTH = 20;

  const out: ReactNode[] = [];
  let i = 0;
  let buf = "";
  const flush = () => { if (buf) { out.push(buf); buf = ""; } };

  while (i < input.length) {
    const c = input[i];

    // Fracción: \frac{a}{b}
    if (input.slice(i, i + 5) === "\\frac") {
      flush();
      i += 5;
      // Depth limit: prevent stack overflow from deeply nested \frac{\frac{...}}
      if (++depth > MAX_DEPTH) { buf += input.slice(i); break; }
      const num = readBrace(input, i);
      if (num.endIndex === i) { buf += input.slice(i); break; } // unbalanced, abort
      i = num.endIndex;
      const den = readBrace(input, i);
      if (den.endIndex === i) { buf += input.slice(i); break; } // unbalanced, abort
      i = den.endIndex;
      out.push(
        <span key={`frac-${i}`} className="inline-flex flex-col items-center align-middle mx-1 text-[0.85em]">
          <span className="border-b border-cyan-300/60 px-1.5 pb-0.5">{parseMath(num.content)}</span>
          <span className="px-1.5 pt-0.5">{parseMath(den.content)}</span>
        </span>
      );
      continue;
    }

    // Superíndice ^
    if (c === "^") {
      flush();
      i++;
      const next = readSingle(input, i);
      i = next.endIndex;
      out.push(<sup key={`sup-${i}`} className="text-[0.75em]">{next.content}</sup>);
      continue;
    }

    // Subíndice _
    if (c === "_") {
      flush();
      i++;
      const next = readSingle(input, i);
      i = next.endIndex;
      out.push(<sub key={`sub-${i}`} className="text-[0.75em]">{next.content}</sub>);
      continue;
    }

    // Raíz cuadrada \sqrt{}
    if (input.slice(i, i + 5) === "\\sqrt") {
      flush();
      i += 5;
      const arg = readBrace(input, i);
      i = arg.endIndex;
      out.push(
        <span key={`sqrt-${i}`} className="inline-flex items-center">
          <span className="text-lg">√</span>
          <span className="border-t border-cyan-300/60 px-0.5">{parseMath(arg.content)}</span>
        </span>
      );
      continue;
    }

    // Sumatoria, producto, etc.
    if (input.slice(i, i + 4) === "\\sum") {
      flush();
      out.push(<span key={`sum-${i}`} className="text-lg">∑</span>);
      i += 4;
      continue;
    }
    if (input.slice(i, i + 5) === "\\prod") {
      flush();
      out.push(<span key={`prod-${i}`} className="text-lg">∏</span>);
      i += 5;
      continue;
    }
    if (input.slice(i, i + 5) === "\\cdot") { flush(); out.push(<span key={`cd-${i}`}>·</span>); i += 5; continue; }
    if (input.slice(i, i + 6) === "\\times") { flush(); out.push(<span key={`tm-${i}`}>×</span>); i += 6; continue; }
    if (input.slice(i, i + 5) === "\\div") { flush(); out.push(<span key={`dv-${i}`}>÷</span>); i += 5; continue; }
    if (input.slice(i, i + 5) === "\\leq") { flush(); out.push(<span key={`lq-${i}`}>≤</span>); i += 5; continue; }
    if (input.slice(i, i + 5) === "\\geq") { flush(); out.push(<span key={`gq-${i}`}>≥</span>); i += 5; continue; }
    if (input.slice(i, i + 4) === "\\to") { flush(); out.push(<span key={`to-${i}`}>→</span>); i += 4; continue; }
    if (input.slice(i, i + 5) === "\\top") { flush(); out.push(<span key={`tp-${i}`} className="text-[0.7em]">ᵀ</span>); i += 5; continue; }

    buf += c;
    i++;
  }
  flush();
  return out;
}

function readBrace(s: string, i: number): { content: string; endIndex: number } {
  if (s[i] !== "{") return { content: "", endIndex: i };
  let depth = 0;
  const start = i + 1;
  while (i < s.length) {
    if (s[i] === "{") depth++;
    else if (s[i] === "}") {
      depth--;
      if (depth === 0) return { content: s.slice(start, i), endIndex: i + 1 };
    }
    i++;
  }
  return { content: s.slice(start), endIndex: s.length };
}

function readSingle(s: string, i: number): { content: string; endIndex: number } {
  if (s[i] === "{") return readBrace(s, i);
  // Un caracter o secuencia de letras
  return { content: s[i] ?? "", endIndex: i + 1 };
}

// ───────────────────────────────────────────────────────────
// Bloque de teoría colapsable
// ───────────────────────────────────────────────────────────
export function TheorySection({
  title,
  level,
  children,
  defaultOpen = false,
}: {
  title: string;
  level: "Básico" | "Intermedio" | "Avanzado" | "Experto";
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  // `overflow-hidden` is required during the height animation (entry/exit) so
  // the content doesn't spill outside the shrinking/growing box. But once the
  // entry animation finishes we switch to `overflow-visible` so that glossary
  // tooltips (absolutely positioned inside the section) are NOT clipped by the
  // section's bounds — a previous bug where tooltips near the top/bottom of a
  // theory block were invisible.
  const [animDone, setAnimDone] = useState(false);
  useEffect(() => {
    if (!open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- reset animation state when section closes
      setAnimDone(false);
    }
  }, [open]);

  const levelColor = {
    "Básico": "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
    "Intermedio": "text-cyan-400 border-cyan-500/30 bg-cyan-500/10",
    "Avanzado": "text-fuchsia-400 border-fuchsia-500/30 bg-fuchsia-500/10",
    "Experto": "text-amber-400 border-amber-500/30 bg-amber-500/10",
  }[level];

  return (
    <div className="rounded-xl border border-slate-700/50 bg-slate-900/40 overflow-visible">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-800/40 transition"
      >
        <div className="flex items-center gap-3 text-left">
          <span className={cn("text-[10px] uppercase tracking-wider px-2 py-0.5 rounded border", levelColor)}>
            {level}
          </span>
          <span className="text-sm font-semibold text-slate-100">{title}</span>
        </div>
        {open ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            onAnimationComplete={() => setAnimDone(true)}
            className={animDone ? "overflow-visible" : "overflow-hidden"}
          >
            <div className="px-4 py-3 text-sm text-slate-300/90 leading-relaxed space-y-2">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ───────────────────────────────────────────────────────────
// Cuadro informativo
// ───────────────────────────────────────────────────────────
export function InfoBox({
  variant = "info",
  title,
  children,
}: {
  variant?: "info" | "tip" | "warning" | "pro";
  title?: string;
  children: ReactNode;
}) {
  const styles = {
    info: { icon: Info, color: "text-sky-400 border-sky-500/30 bg-sky-500/5" },
    tip: { icon: Lightbulb, color: "text-amber-400 border-amber-500/30 bg-amber-500/5" },
    warning: { icon: Sparkles, color: "text-rose-400 border-rose-500/30 bg-rose-500/5" },
    pro: { icon: Trophy, color: "text-fuchsia-400 border-fuchsia-500/30 bg-fuchsia-500/5" },
  }[variant];
  const Icon = styles.icon;
  return (
    <div className={cn("rounded-lg border px-3 py-2.5 flex gap-2.5", styles.color)}>
      <Icon className="w-4 h-4 flex-shrink-0 mt-0.5" />
      <div className="text-xs leading-relaxed">
        {title && <p className="font-semibold mb-0.5">{title}</p>}
        {children}
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────
// Término de glosario inline
// Estado global: solo un tooltip abierto a la vez.
// Click-outside y Escape cierran el tooltip activo.
// ───────────────────────────────────────────────────────────
let _activeGlossaryRef: { close: () => void } | null = null;

export function GlossaryInline({ term, def }: { term: string; def: string }) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState<"left" | "right">("left");
  const [vertical, setVertical] = useState<"below" | "above">("below");
  const btnRef = useRef<HTMLButtonElement>(null);
  const spanRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    if (!open || !btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const TOOLTIP_WIDTH = 256; // w-64 = 16rem = 256px
    const TOOLTIP_HEIGHT = 120; // approximate max height
    const MARGIN = 8;
    // Horizontal: flip right→left if tooltip would overflow right edge.
    const wouldOverflowRight = rect.left + TOOLTIP_WIDTH > viewportWidth - MARGIN;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- DOM measurement before paint is the canonical useLayoutEffect use case (prevents tooltip flicker)
    setPosition(wouldOverflowRight ? "right" : "left");
    // Vertical: prefer "below". Only flip to "above" if "below" would overflow
    // the bottom AND "above" actually fits. Otherwise we'd hide the tooltip
    // behind the sticky LevelShell header (which sits at the top of the viewport).
    const wouldOverflowBottom = rect.bottom + TOOLTIP_HEIGHT > viewportHeight - MARGIN;
    const wouldOverflowTop = rect.top - TOOLTIP_HEIGHT < MARGIN;
    setVertical(wouldOverflowBottom && !wouldOverflowTop ? "above" : "below");
  }, [open]);

  // Re-measure on resize/scroll/orientation change while tooltip is open
  useEffect(() => {
    if (!open) return;
    const remeasure = () => {
      if (!btnRef.current) return;
      const rect = btnRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const TOOLTIP_WIDTH = 256;
      const TOOLTIP_HEIGHT = 120;
      const MARGIN = 8;
      setPosition(rect.left + TOOLTIP_WIDTH > viewportWidth - MARGIN ? "right" : "left");
      const wouldOverflowBottom = rect.bottom + TOOLTIP_HEIGHT > viewportHeight - MARGIN;
      const wouldOverflowTop = rect.top - TOOLTIP_HEIGHT < MARGIN;
      setVertical(wouldOverflowBottom && !wouldOverflowTop ? "above" : "below");
    };
    window.addEventListener("resize", remeasure);
    window.addEventListener("scroll", remeasure, true);
    window.addEventListener("orientationchange", remeasure);
    return () => {
      window.removeEventListener("resize", remeasure);
      window.removeEventListener("scroll", remeasure, true);
      window.removeEventListener("orientationchange", remeasure);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onClick = (e: MouseEvent) => {
      if (spanRef.current && !spanRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  // Capture the close fn for this instance so we can identify it on unmount.
  // If the component unmounts while its tooltip is the active one, clear the
  // global ref so future clicks don't call setState on a dead component.
  const closeFnRef = useRef<(() => void) | null>(null);
  useEffect(() => {
    return () => {
      if (closeFnRef.current && _activeGlossaryRef?.close === closeFnRef.current) {
        _activeGlossaryRef = null;
      }
    };
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    // Stop propagation so that if this glossary term sits inside a clickable
    // parent (e.g., a quiz-option <div role="button">), clicking the term
    // only toggles the tooltip — it does NOT also pick the answer.
    e.stopPropagation();
    if (open) {
      setOpen(false);
      _activeGlossaryRef = null;
      closeFnRef.current = null;
      return;
    }
    if (_activeGlossaryRef) _activeGlossaryRef.close();
    const close = () => setOpen(false);
    closeFnRef.current = close;
    setOpen(true);
    _activeGlossaryRef = { close };
  };

  const tooltipClasses = cn(
    "absolute z-50 w-64 max-w-[75vw] rounded-lg border border-cyan-500/40 bg-slate-900 px-3 py-2 text-xs text-slate-200 shadow-xl text-left font-normal block",
    position === "right" ? "right-0" : "left-0",
    vertical === "above" ? "bottom-full mb-1" : "top-full mt-1"
  );

  return (
    <span ref={spanRef} className="relative inline-block">
      <button
        ref={btnRef}
        onClick={handleClick}
        className="text-cyan-400 underline decoration-dotted underline-offset-2 hover:text-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 rounded"
        aria-expanded={open}
        aria-label={`Definición de ${term}`}
      >
        {term}
      </button>
      <AnimatePresence>
        {open && (
          <motion.span
            initial={{ opacity: 0, y: vertical === "above" ? 4 : -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: vertical === "above" ? 4 : -4 }}
            className={tooltipClasses}
            role="tooltip"
          >
            <span className="font-semibold text-cyan-300">{term}: </span>{def}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}


// ───────────────────────────────────────────────────────────
// Caja de "Dato Pro" — referencias a papers
// ───────────────────────────────────────────────────────────
export function PaperRef({ title, year, authors }: { title: string; year: number; authors: string }) {
  return (
    <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 px-3 py-2.5">
      <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold mb-1">
        <BookOpen className="w-3.5 h-3.5" />
        PAPER DE REFERENCIA
      </div>
      <p className="text-sm text-slate-200 italic">&ldquo;{title}&rdquo;</p>
      <p className="text-xs text-slate-400 mt-0.5">{authors} · {year}</p>
    </div>
  );
}

// ───────────────────────────────────────────────────────────
// Resalta términos del glosario global en azul con tooltip click.
// Reutilizable por StandardPhases y QuizRunner.
// Greedy: términos más largos primero. Regex hoisted a module scope.
// ───────────────────────────────────────────────────────────

const GLOSSARY_PATTERN: RegExp = (() => {
  const escaped = ALL_GLOSSARY_TERMS.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  return new RegExp(`\\b(${escaped.join("|")})\\b`, "gi");
})();

export function highlightGlossary(text: string, keyPrefix: string): React.ReactNode {
  GLOSSARY_PATTERN.lastIndex = 0;
  const out: React.ReactNode[] = [];
  let lastIdx = 0;
  let match: RegExpExecArray | null;
  let counter = 0;
  while ((match = GLOSSARY_PATTERN.exec(text)) !== null) {
    const matchedText = match[0];
    const start = match.index;
    const end = start + matchedText.length;
    if (start > lastIdx) out.push(text.slice(lastIdx, start));
    const entry = lookupGlossary(matchedText);
    if (entry) {
      out.push(<GlossaryInline key={`${keyPrefix}-${counter++}`} term={matchedText} def={entry.def} />);
    } else {
      out.push(matchedText);
    }
    lastIdx = end;
  }
  if (lastIdx < text.length) out.push(text.slice(lastIdx));
  return <>{out}</>;
}
