"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Sparkles, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { highlightGlossary } from "./ui";
import { useLocale } from "../i18n";

export interface QuizQuestion {
  question: string;
  /** Puede incluir código/fórmula/emoji en la pregunta */
  code?: string;
  options: string[];
  correct: number;
  /** Explicación mostrada tras responder */
  explain: string;
  /** Etiqueta de dificultad */
  difficulty?: "Básico" | "Intermedio" | "Avanzado" | "Experto";
}

export function QuizRunner({
  questions,
  color,
  onComplete,
  showHint = false,
}: {
  questions: QuizQuestion[];
  color: string;
  /** Optional callback fired when the quiz finishes. Practice mode omits it. */
  onComplete?: (stars: number, correct: number, total: number) => void;
  showHint?: boolean;
}) {
  const { t } = useLocale();
  const difficultyLabels = {
    "Básico": t("basic"),
    "Intermedio": t("intermediate"),
    "Avanzado": t("advanced"),
    "Experto": t("expert"),
  } as const;
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [mistakes, setMistakes] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [done, setDone] = useState(false);
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (advanceTimer.current) clearTimeout(advanceTimer.current);
  }, []);

  // Defensive: if a level has no questions, render an empty-state instead of crashing.
  if (questions.length === 0) {
    return (
      <div className="text-center py-8 px-4 rounded-xl border border-slate-700/50 bg-slate-900/40">
        <BookOpen className="w-8 h-8 mx-auto mb-2 text-slate-500" />
        <p className="text-sm text-slate-300 font-semibold">{t("practiceUnavailable")}</p>
        <p className="text-xs text-slate-500 mt-1">
          {t("skipToChallenge")}
        </p>
      </div>
    );
  }

  const q = questions[idx];

  const pick = (i: number) => {
    if (picked !== null) return;
    setPicked(i);
    // Compute locally so the setTimeout callback doesn't read stale state.
    // (setState calls below are async; the closure captured `mistakes`/`correctCount`
    // would still hold the pre-click value when the timeout fires 1.8s later,
    // causing e.g. a first-ever mistake on the LAST question to be ignored when
    // computing stars — awarding 3 stars instead of 2.)
    const isCorrect = i === q.correct;
    const newMistakes = mistakes + (isCorrect ? 0 : 1);
    const newCorrect = correctCount + (isCorrect ? 1 : 0);
    if (isCorrect) {
      setCorrectCount(c => c + 1);
    } else {
      setMistakes(m => m + 1);
    }
    advanceTimer.current = setTimeout(() => {
      if (idx < questions.length - 1) {
        setIdx(idx + 1);
        setPicked(null);
      } else {
        setDone(true);
        const stars = newMistakes === 0 ? 3 : newMistakes <= 1 ? 2 : 1;
        // onComplete is optional (practice mode doesn't supply it).
        onComplete?.(stars, newCorrect, questions.length);
      }
      advanceTimer.current = null;
    }, 1800);
  };

  if (done) {
    return (
      <div className="text-center py-8">
        <Sparkles className="w-12 h-12 mx-auto mb-3" style={{ color }} />
        <p className="text-lg font-bold text-slate-100">{t("challengeComplete")}</p>
        <p className="text-sm text-slate-400 mt-1">
          {correctCount}/{questions.length} {t("correctPlural")} · {mistakes} {mistakes === 1 ? t("error") : t("errors")}
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Progress */}
      <div className="flex items-center gap-1.5 mb-4">
        {questions.map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-1.5 flex-1 rounded-full transition-all",
              i < idx ? "bg-emerald-500" : i === idx ? "bg-cyan-400" : "bg-slate-700"
            )}
          />
        ))}
      </div>

      <div className="flex items-center justify-between mb-3 text-xs text-slate-400">
        <span>{t("question")} {idx + 1} {t("of")} {questions.length}</span>
        {q.difficulty && (
          <span className="px-2 py-0.5 rounded-full border border-slate-700 bg-slate-900">
            {difficultyLabels[q.difficulty]}
          </span>
        )}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={idx}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -12 }}
        >
          <h3 className="text-base sm:text-lg font-semibold text-slate-100 mb-2 leading-relaxed">
            {highlightGlossary(q.question, `q-${idx}`)}
          </h3>
          {q.code && (
            <pre className="rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2 mb-3 text-xs font-mono text-cyan-200 overflow-x-auto">
              {q.code}
            </pre>
          )}

          <div className="space-y-2">
            {q.options.map((opt, i) => {
              const isCorrect = i === q.correct;
              const showCorrect = picked !== null && isCorrect;
              const showWrong = picked === i && !isCorrect;
              return (
                <button
                  type="button"
                  key={i}
                  onClick={() => pick(i)}
                  disabled={picked !== null}
                  className={cn(
                    "w-full text-left rounded-lg border px-3 py-2.5 text-sm transition-all flex items-center justify-between gap-2 cursor-pointer",
                    showCorrect
                      ? "border-emerald-500 bg-emerald-500/15 text-emerald-100"
                      : showWrong
                      ? "border-rose-500 bg-rose-500/15 text-rose-100"
                      : "border-slate-700 bg-slate-900/60 text-slate-200 hover:border-slate-600 hover:bg-slate-800/60",
                    picked !== null && !showCorrect && !showWrong && "opacity-50",
                    picked !== null && "cursor-default"
                  )}
                >
                  {/* Keep the native answer button free of nested glossary buttons. */}
                  <span>{opt}</span>
                  {showCorrect && <Check className="w-4 h-4 flex-shrink-0" />}
                  {showWrong && <X className="w-4 h-4 flex-shrink-0" />}
                </button>
              );
            })}
          </div>

          {picked !== null && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "mt-3 rounded-lg border px-3 py-2.5 text-xs leading-relaxed",
                picked === q.correct
                  ? "border-emerald-500/40 bg-emerald-500/5 text-emerald-100"
                  : "border-rose-500/40 bg-rose-500/5 text-rose-100"
              )}
            >
              <span className="font-semibold">
                {picked === q.correct ? `${t("correctFeedback")} ` : `${t("wrongFeedback")} `}
              </span>
              {highlightGlossary(q.explain, `exp-${idx}`)}
            </motion.div>
          )}

          {showHint && picked === null && (
            <p className="mt-3 text-xs text-slate-500 italic">
              {t("hint")}
            </p>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
