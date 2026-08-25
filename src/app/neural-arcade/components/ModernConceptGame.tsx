"use client";

import { useState } from "react";
import { CheckCircle2, ChevronRight, CircleHelp, ShieldCheck, Wrench, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

type Module = { hook: string; options: string[]; correct: number; why: string; steps: string[] };

const MODULES: Record<string, Module> = {
  hardware: { hook: "Tienes un modelo grande y una GPU con poca VRAM. ¿Qué palanca reduce memoria de inference?", options: ["Quantization", "Aumentar el vocabulario", "Subir la temperatura", "Eliminar batching"], correct: 0, why: "Reducir precisión numérica puede disminuir memoria y ancho de banda, con un trade-off de calidad.", steps: ["Modelo", "Quantization", "VRAM", "Serving"] },
  scaling: { hook: "Tu presupuesto de cómputo aumenta. ¿Qué estudian las scaling laws?", options: ["Cómo cambia el rendimiento con parámetros, datos y compute", "Solo la latencia de UI", "Solo el tamaño del tokenizer", "Solo el número de tools"], correct: 0, why: "Las scaling laws describen relaciones empíricas entre recursos de entrenamiento y métricas del modelo.", steps: ["Compute", "Datos", "Parámetros", "Loss / capability"] },
  modern: { hook: "Quieres más parámetros totales sin activar todos para cada token. ¿Qué arquitectura encaja?", options: ["Mixture of Experts", "Un tokenizer distinto", "Solo RAG", "Solo LoRA"], correct: 0, why: "MoE usa un router para activar solo algunos expertos por token.", steps: ["Token", "Router", "Top-k experts", "Combine"] },
  posttraining: { hook: "Un modelo base responde bien, pero no sigue el formato de tu aplicación. ¿Qué capa atacarías primero?", options: ["Post-training con ejemplos/preferencias", "Cambiar la GPU", "Aumentar el contexto", "Añadir un vector DB"], correct: 0, why: "El post-training moldea el comportamiento del modelo después del pre-entrenamiento.", steps: ["Modelo base", "SFT / preferencias", "Evaluación", "Modelo adaptado"] },
  inference: { hook: "Tu modelo responde lento con muchas solicitudes concurrentes. ¿Qué combinación ataca el serving?", options: ["Continuous batching + KV cache + serving optimizado", "Solo más prompt", "Más documentos RAG", "Más temperatura"], correct: 0, why: "El cuello de botella de inference depende de memoria, batching, cache y hardware; no de añadir texto al prompt.", steps: ["Prefill", "KV cache", "Decode", "Batching / serving"] },
  multimodal: { hook: "Quieres que un modelo entienda una foto. ¿Qué falta antes de que el LLM pueda razonar sobre ella?", options: ["Una representación visual compatible", "Solo más tokens de texto", "Un reward model", "Un router MoE obligatorio"], correct: 0, why: "La imagen necesita ser transformada en una representación que el sistema multimodal pueda integrar con el lenguaje.", steps: ["Imagen", "Vision encoder", "Representación", "LLM / multimodal"] },
  context: { hook: "Un agente recibe 200 páginas y empieza a perder instrucciones importantes. ¿Qué principio aplicarías?", options: ["Seleccionar y comprimir contexto relevante", "Meter todavía más documentos", "Eliminar el system prompt", "Subir la temperatura"], correct: 0, why: "Context engineering busca maximizar señal útil y minimizar ruido, costo y contradicciones.", steps: ["Fuentes", "Selección", "Compresión", "Contexto final"] },
  memory: { hook: "El usuario quiere que el agente recuerde una preferencia entre sesiones. ¿Dónde pertenece?", options: ["Memoria persistente", "Solo al contexto actual", "Al KV cache del modelo", "A los pesos del LLM"], correct: 0, why: "La memoria persiste entre ejecuciones; el contexto y KV cache son mecanismos de la ejecución actual.", steps: ["Evento", "Política de memoria", "Almacenamiento", "Retrieval"] },
  tools: { hook: "El modelo necesita consultar una API. ¿Quién debe ejecutar realmente la acción?", options: ["El runtime de la aplicación", "El modelo directamente", "El vector DB", "El tokenizer"], correct: 0, why: "El modelo propone una llamada estructurada; el runtime valida permisos y ejecuta la herramienta.", steps: ["LLM", "Tool call", "Validación", "Tool → observation"] },
  reasoning: { hook: "Tienes una respuesta que puede verificarse automáticamente. ¿Qué mejora el sistema?", options: ["Generar y verificar alternativas", "Ocultar el resultado al evaluador", "Eliminar las herramientas", "Usar siempre temperatura 0"], correct: 0, why: "Los verificadores permiten gastar más cómputo en inferencia y seleccionar o mejorar soluciones.", steps: ["Problema", "Candidatos", "Verifier", "Respuesta"] },
  skills: { hook: "Un agente tiene 40 capacidades especializadas. ¿Cómo evitas meter todas sus instrucciones en cada prompt?", options: ["Progressive disclosure de skills", "Copiar todas las instrucciones siempre", "Eliminar las tools", "Entrenar un modelo nuevo por skill"], correct: 0, why: "Las skills pueden descubrirse y cargarse bajo demanda, reduciendo ruido y consumo de contexto.", steps: ["Catálogo", "Skill seleccionada", "Instrucciones / recursos", "Tools"] },
  mcp: { hook: "Quieres conectar un agente con herramientas de terceros usando un contrato interoperable. ¿Qué pieza encaja?", options: ["MCP client ↔ MCP server", "Solo un prompt gigante", "Un tokenizer", "Un checkpoint LoRA"], correct: 0, why: "MCP estandariza la interacción entre aplicaciones de IA y servidores que exponen tools, resources y prompts.", steps: ["Agent", "MCP client", "MCP server", "Tool / resource"] },
  safety: { hook: "Una página web contiene una instrucción que intenta hacer que el agente revele un secreto. ¿Cómo debes tratarla?", options: ["Como dato no confiable + aplicar permisos fuera del modelo", "Como system prompt", "Como una autorización", "Como una nueva skill confiable"], correct: 0, why: "El contenido externo puede contener indirect prompt injection; la seguridad debe imponerse en el runtime.", steps: ["Contenido externo", "Detección / aislamiento", "Policy", "Acción permitida"] },
};

export function ModernConceptGame({ color, levelId }: { color: string; levelId?: string }) {
  const conceptModule = MODULES[levelId ?? "tools"] ?? MODULES.tools;
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-700/60 bg-slate-900/70 p-5">
        <div className="flex items-center gap-2 mb-3" style={{ color }}>
          <Zap className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-wider">Laboratorio de arquitectura</span>
        </div>
        <p className="text-sm sm:text-base font-semibold text-slate-100">{conceptModule.hook}</p>
      </div>

      <div className="grid gap-2">
        {conceptModule.options.map((option, i) => {
          const state = selected === null ? "idle" : i === conceptModule.correct ? "correct" : selected === i ? "wrong" : "idle";
          return (
            <button
              key={option}
              onClick={() => setSelected(i)}
              className={cn(
                "w-full rounded-xl border p-3 text-left text-sm transition",
                state === "correct" && "border-emerald-500/70 bg-emerald-500/10 text-emerald-200",
                state === "wrong" && "border-rose-500/70 bg-rose-500/10 text-rose-200",
                state === "idle" && "border-slate-700 bg-slate-900/50 text-slate-300 hover:border-slate-500",
              )}
            >
              <span className="flex items-center gap-2">
                {state === "correct" ? <CheckCircle2 className="w-4 h-4" /> : <CircleHelp className="w-4 h-4" />}
                {option}
              </span>
            </button>
          );
        })}
      </div>

      {selected !== null && (
        <div className="rounded-xl border border-slate-700/60 bg-slate-900/60 p-4 text-xs text-slate-300">
          <p className="font-semibold text-slate-100 mb-1">{selected === conceptModule.correct ? "¡Correcto!" : "Casi."}</p>
          <p>{conceptModule.why}</p>
        </div>
      )}

      <div className="rounded-2xl border border-slate-700/60 bg-slate-950/50 p-4">
        <div className="flex items-center gap-2 mb-3 text-slate-300">
          <Wrench className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-wider">Pipeline</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {conceptModule.steps.map((step, i) => (
            <div key={step} className="flex items-center gap-2">
              <span className="rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-[11px] text-slate-300">{step}</span>
              {i < conceptModule.steps.length - 1 && <ChevronRight className="w-3 h-3 text-slate-600" />}
            </div>
          ))}
        </div>
        <p className="mt-3 text-[11px] text-slate-500">El reto muestra el patrón conceptual; la implementación real puede añadir modelos, runtimes, políticas y observabilidad.</p>
      </div>

      <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 text-[11px] text-emerald-200/80">
        <ShieldCheck className="inline w-3.5 h-3.5 mr-1" />
        Aprende el concepto antes de construirlo: el modelo propone, el sistema valida y ejecuta.
      </div>
    </div>
  );
}
