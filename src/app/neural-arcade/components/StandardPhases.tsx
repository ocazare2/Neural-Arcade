"use client";

import { motion } from "framer-motion";
import { BookOpen, GraduationCap, Award, Sparkles } from "lucide-react";
import type { LevelMeta } from "../types";
import { TheorySection, Formula, InfoBox, PaperRef, GlossaryInline, highlightGlossary } from "./ui";
import { useLocale } from "../i18n";

// ───────────────────────────────────────────────────────────
// FASE: TEORÍA
// Muestra los bloques de teoría (Básico → Experto)
// con fórmulas, glosario inline, y referencias.
// ───────────────────────────────────────────────────────────
export function TheoryPhase({ level }: { level: LevelMeta }) {
  const { locale, t } = useLocale();
  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-slate-700/50 bg-slate-900/40 p-4">
        <div className="flex items-start gap-3">
          <div
            className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
            style={{ background: `${level.color}22`, border: `1px solid ${level.color}55` }}
          >
            {level.icon}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-extrabold tracking-wide" style={{ color: level.color }}>
              {level.title}
            </h2>
            <p className="text-sm text-slate-300/80 mt-1 leading-relaxed">{level.summary}</p>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {level.concepts.map(c => (
                <span
                  key={c}
                  className="text-[10px] px-2 py-0.5 rounded-full border border-slate-700 bg-slate-800/60 text-slate-300"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <InfoBox variant="info" title={t("howToRead")}>
        {t("howToReadIntro")} {t("touchBlueTerms")} {" "}
        <GlossaryInline
          term={locale === "es" ? "azul" : "blue"}
          def={locale === "es"
            ? "Los términos subrayados abren una definición emergente."
            : "Underlined terms open a definition that stays inside the screen."}
        />
      </InfoBox>

      {/* Bloques de teoría */}
      <div className="space-y-2">
        {level.theory.map((block, i) => (
          <TheorySection
            key={i}
            title={block.title}
            level={block.level}
            defaultOpen={i === 0}
          >
            <ProseMarkdown text={block.body} />
            {block.formula && (
              <Formula explain={block.formulaExplain}>{block.formula}</Formula>
            )}
          </TheorySection>
        ))}
      </div>

      {/* Glosario completo del nivel */}
      <div className="rounded-xl border border-slate-700/50 bg-slate-900/40 overflow-hidden">
        <div className="px-4 py-2.5 border-b border-slate-700/50 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-bold text-slate-100">{t("levelGlossary")}</h3>
          <span className="text-xs text-slate-500">({level.glossary.length} {t("terms")})</span>
        </div>
        <dl className="divide-y divide-slate-800">
          {level.glossary.map(t => (
            <div key={t.term} className="px-4 py-2.5">
              <dt className="text-sm font-semibold text-cyan-300">
                {t.term}
                {t.symbol && (
                  <span className="ml-2 text-xs font-mono text-slate-400">({t.symbol})</span>
                )}
              </dt>
              <dd className="text-xs text-slate-300/85 mt-0.5 leading-relaxed">{t.definition}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────
// FASE: MAESTRÍA
// Muestra la fórmula central, el paper de referencia,
// y un "dato pro" que conecta con la frontera actual.
// ───────────────────────────────────────────────────────────
export function MasteryPhase({ level }: { level: LevelMeta }) {
  const { t } = useLocale();
  // La fórmula central es la del bloque Avanzado (índice 2) típicamente,
  // o la del Experto si es más representativa.
  const formulaBlock =
    level.theory.find(b => b.formula && b.level === "Avanzado") ??
    level.theory.find(b => b.formula && b.level === "Experto") ??
    level.theory.find(b => b.formula);

  return (
    <div className="space-y-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-2xl p-5 text-center"
        style={{
          background: `linear-gradient(135deg, ${level.color}22, transparent)`,
          border: `1px solid ${level.color}55`,
        }}
      >
        <Award className="w-10 h-10 mx-auto mb-2" style={{ color: level.color }} />
        <h2 className="text-2xl font-extrabold tracking-wider" style={{ color: level.color }}>
          {t("mastery")}
        </h2>
        <p className="text-sm text-slate-300/80 mt-1">
          {t("mastered")} <b className="text-slate-100">{level.title}</b>. {t("essence")}
        </p>
      </motion.div>

      {formulaBlock?.formula && (
        <div className="rounded-xl border border-slate-700/50 bg-slate-900/40 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-slate-100">{t("centralFormula")}</h3>
          </div>
          <p className="text-xs text-slate-400 mb-2">{formulaBlock.title}</p>
          <Formula explain={formulaBlock.formulaExplain}>{formulaBlock.formula}</Formula>
        </div>
      )}

      {level.paperRef && (
        <div>
          <PaperRef {...level.paperRef} />
        </div>
      )}

      <InfoBox variant="pro" title={t("proFact")}>
        {level.theory[level.theory.length - 1].body}
      </InfoBox>

      <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 flex items-start gap-3">
        <GraduationCap className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-emerald-300">{t("levelMastered")}</p>
          <p className="text-xs text-slate-300/85 mt-1 leading-relaxed">
            {t("levelMasteredBody")}
          </p>
        </div>
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────
// Mini parser Markdown: soporta **bold**, saltos de línea,
// listas con •, y términos de glosario del nivel.
// ───────────────────────────────────────────────────────────
function ProseMarkdown({ text }: { text: string }) {
  // Buscar términos del glosario para subrayar
  const lines = text.split("\n");
  return (
    <div className="space-y-1.5">
      {lines.map((line, i) => {
        if (!line.trim()) return <div key={i} className="h-1" />;
        if (line.startsWith("•") || line.match(/^\d+\./)) {
          return (
            <p key={i} className="pl-2 text-sm text-slate-300/90 leading-relaxed">
              {renderInline(line)}
            </p>
          );
        }
        return (
          <p key={i} className="text-sm text-slate-300/90 leading-relaxed">
            {renderInline(line)}
          </p>
        );
      })}
    </div>
  );
}

function renderInline(text: string): React.ReactNode {
  // **bold**
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) => {
    if (p.startsWith("**") && p.endsWith("**")) {
      return (
        <b key={i} className="font-semibold text-slate-100">
          {highlightGlossary(p.slice(2, -2), `b-${i}`)}
        </b>
      );
    }
    return <span key={i}>{highlightGlossary(p, `s-${i}`)}</span>;
  });
}
