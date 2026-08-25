import type { QuizQuestion } from "./components/QuizRunner";

// ═══════════════════════════════════════════════════════════
// QUIZZES PARA NIVELES NUEVOS — hardware, scaling, modern
// 5 preguntas c/u, dificultad creciente Básico → Experto
// Estructura idéntica a quizzes.ts (PRACTICE_QUESTIONS)
// ═══════════════════════════════════════════════════════════

export const EXTRA_CHALLENGES: Record<string, QuizQuestion[]> = {
  // ─────────────────────────────────────────────────────────
  // HARDWARE — GPU, memoria, precisión, costos
  // ─────────────────────────────────────────────────────────
  hardware: [
    {
      question:
        "¿Por qué un GPU es mucho más rápido que un CPU para entrenar redes neuronales?",
      options: [
        "Porque tiene mayor frecuencia de reloj (GHz)",
        "Porque tiene miles de núcleos simples optimizados para paralelismo masivo de matrices",
        "Porque tiene más memoria cache L3",
        "Porque ejecuta instrucciones x86 más complejas",
      ],
      correct: 1,
      explain:
        "Un CPU top (64 cores) entrega ~1 TFLOPS FP32. Un H100 entrega ~1 PetaFLOPS FP16 con tensor cores. El entrenamiento de LLMs es 90%+ multiplicación de matrices: el paralelismo masivo del GPU encaja perfecto.",
      difficulty: "Básico",
    },
    {
      question:
        "Un NVIDIA H100 SXM tiene 989 TFLOPS FP16 (con sparse) y 3.35 TB/s de ancho de banda. ¿Por qué importa el ancho de banda tanto como los FLOPS?",
      options: [
        "Porque sin ancho de banda no se pueden cargar los pesos a los cores a la velocidad que estos los consumen (memory-bound)",
        "Porque afecta la latencia de red",
        "Porque es lo que mide la cantidad de cores",
        "Porque determina cuánta VRAM hay",
      ],
      correct: 0,
      explain:
        "En inference (y en muchas ops de training como LayerNorm o softmax) el cuello de botella no son los FLOPS sino mover pesos/activaciones desde HBM a los cores. Roofline model: si Arithmetic Intensity < FLOPS/BW, estás memory-bound.",
      difficulty: "Intermedio",
    },
    {
      question: "¿Cuál es la principal ventaja de BF16 sobre FP16?",
      options: [
        "Tiene el doble de precisión en la mantisa",
        "Ocupa 32 bits en vez de 16 bits, así es más exacto",
        "Mantiene el mismo rango dinámico que FP32 (8 bits de exponente) con menos precisión, evitando overflow/underflow en training",
        "Es más rápido de calcular en el GPU",
      ],
      correct: 2,
      explain:
        "BF16 = 1 signo + 8 exponente + 7 mantisa (igual exponente que FP32). FP16 = 1 + 5 + 10 (menos rango, más precisión). En training los gradientes tienen magnitudes extremas; FP16 satura, BF16 no. Por eso PyTorch usa BF16 por defecto hoy.",
      difficulty: "Avanzado",
    },
    {
      question:
        "Llama-2 70B tiene ~70 mil millones de parámetros. ¿Cuánta VRAM mínima necesitas para inferencia en FP16?",
      options: [
        "70 GB (1 byte por parámetro)",
        "140 GB (2 bytes por parámetro en FP16)",
        "35 GB (comprime 4x con cuantización automática)",
        "700 GB (10x el número de parámetros)",
      ],
      correct: 1,
      explain:
        "FP16 = 2 bytes/param. 70B × 2 = 140 GB solo de pesos. Necesitas además KV cache y activaciones (~10-20% extra). Un H100 de 80GB no alcanza: se usan 2× H100 (160GB) o cuantización a INT4 (~35GB).",
      difficulty: "Avanzado",
    },
    {
      question:
        "La fórmula para estimar el costo de entrenar un modelo es:",
      options: [
        "costo ≈ N × D × $0.01 (N = parámetros, D = dataset)",
        "costo ≈ 6 × N × D × $/FLOP, donde N = parámetros y D = tokens entrenados",
        "costo ≈ 2 × D² × $/FLOP (solo depende del dataset)",
        "costo ≈ N × lr × epochs × $/GPU-hora",
      ],
      correct: 1,
      explain:
        "El factor 6 = 2 (forward+backward) × 3 (param×grad×optimizer-state en ADAM). GPT-3 (175B × 300B tokens) ≈ 3.15e23 FLOPs. A $15/GPU-hora y ~500 TFLOPS efectivos → ~$4.6M. Esta es la regla de oro de Kaplan/Chinchilla/OpenAI.",
      difficulty: "Experto",
    },
    {
      question:
        "Si tienes $100M de presupuesto y H100s a $2/hr sosteniendo 500 TFLOPS efectivos, ¿cuántos FLOPs puedes comprar en total?",
      options: [
        "2.5 × 10²² FLOPs (50M horas × 500 TFLOPS)",
        "5 × 10²² FLOPs (100M × 500 TFLOPS, olvidando dividir por $2/hr)",
        "2.5 × 10²⁰ FLOPs (confundiendo TFLOPS=10¹² con GFLOPS=10⁹)",
        "2.5 × 10²⁸ FLOPs (confundiendo TFLOPS=10¹² con PFLOPS=10¹⁵)",
      ],
      correct: 0,
      explain:
        "Horas de GPU: $100M / $2 por hora = 50M horas = 5×10⁷ h. FLOPs = 5×10⁷ h × 500 TFLOPS = 5×10⁷ × 5×10¹⁴ FLOPs/h = 2.5×10²² FLOPs. Para contexto: GPT-3 requirió ~3.15×10²³ FLOPs (12.6x este presupuesto). La confusión común: olvidar dividir por $/hr, o confundir TFLOPS (10¹²) con GFLOPS (10⁹) o PFLOPS (10¹⁵).",
      difficulty: "Experto",
    },
  ],

  // ─────────────────────────────────────────────────────────
  // SCALING — leyes de escalamiento, Chinchilla, lecciones
  // ─────────────────────────────────────────────────────────
  scaling: [
    {
      question:
        "La ley de escalamiento de Kaplan et al. (2020) describe cómo la loss L varía con el compute C. ¿Cuál es aproximadamente el exponente α_C en L(C) ∝ C^(-α_C)?",
      options: [
        "L ∝ C^(-0.5) (duplicar compute reduce loss a la mitad)",
        "L ∝ C^(-0.05) (exponente muy plano; cada duplicación de compute baja la loss ~3.5%)",
        "L ∝ C^(-1) (relación lineal)",
        "L ∝ C^(-0.076) (este es el exponente de parámetros α_N, no el de compute)",
      ],
      correct: 1,
      explain:
        "Kaplan 2020 §5.3 reporta α_C ≈ 0.050 para el exponente del compute (L(C_min) ∝ C_min^(-0.050)). Es decir: duplicar compute reduce la loss ~3.5%. Para reducir loss 10x necesitas 10^(1/0.05) ≈ 10^20 más compute. NOTA: -0.076 es el exponente de parámetros α_N (Kaplan Table 1), NO el de compute. Es fácil confundirlos.",
      difficulty: "Avanzado",
    },
    {
      question:
        "El paper de Chinchilla (Hoffmann et al. 2022) encontró que la proporción óptima tokens/parámetros para entrenar un LLM es aproximadamente:",
      options: [
        "1 token por parámetro (más datos = desperdicio)",
        "20 tokens por parámetro",
        "1000 tokens por parámetro (más siempre es mejor)",
        "0.5 tokens por parámetro (más modelo, menos datos)",
      ],
      correct: 1,
      explain:
        "Chinchilla: para compute óptimo, escala datos y modelo en igual proporción, ~20 tokens/param. GPT-3 usó 1.7 tokens/param (300B/175B, undertrained). Llama 2 70B usó ~29 tokens/param (2T/70B, ligeramente overtrained para su tamaño, pero más barato en inference).",
      difficulty: "Intermedio",
    },
    {
      question: "¿Por qué se dice que GPT-3 (175B) estaba 'sub-entrenado'?",
      options: [
        "Porque se entrenó con poco LR",
        "Porque usó solo 1.7 tokens por parámetro (300B tokens / 175B params), muy por debajo del óptimo Chinchilla de 20",
        "Porque el dataset era de mala calidad",
        "Porque no usaron flash attention",
      ],
      correct: 1,
      explain:
        "GPT-3 gastó compute en hacer el modelo más grande en vez de entrenarlo más (1.7 tokens/param vs óptimo de 20). Un Chinchilla-óptimo de 175B debería ver ~3.5T tokens. Esto explica por qué modelos posteriores más pequeños pero bien entrenados (Llama 7B con 1T tokens ≈ 143 tokens/param) superan a GPT-3 en benchmarks.",
      difficulty: "Intermedio",
    },
    {
      question:
        "Wei et al. (2022) popularizaron el concepto de 'emergent abilities' en LLMs. ¿Qué significa?",
      options: [
        "Habilidades que aparecen súbitamente en modelos grandes (no previsibles extrapolando modelos chicos), como aritmética de 3 dígitos o chain-of-thought",
        "Habilidades que los modelos aprenden en el fine-tuning",
        "Habilidades que solo emergen con RLHF",
        "Habilidades que el modelo tiene desde el pre-training básico",
      ],
      correct: 0,
      explain:
        "Modelos <10B params casi no resuelven ciertas tareas (random), pero en escala >60B la accuracy salta abruptamente a >80%. Es un cambio de régimen, no una pendiente suave. Debate abierto: Schaeffer 2023 argumenta que es artefacto de la métrica discreta.",
      difficulty: "Avanzado",
    },
    {
      question:
        "Richard Sutton escribió 'The Bitter Lesson' (2019). ¿Cuál es su tesis central?",
      options: [
        "Que los métodos basados en conocimiento humano/expertos siempre superan al aprendizaje por refuerzo",
        "Que a largo plazo, los métodos de cómputo escalable (búsqueda + aprendizaje) terminan superando a las ingenierías manuales, por más inteligentes que estas sean",
        "Que el deep learning es una moda pasajera",
        "Que los LLMs nunca alcanzarán AGI",
      ],
      correct: 1,
      explain:
        "Sutton analizó 70 años de IA: en ajedrez, Go, traducción, visión... los enfoques basados en conocimiento humano perdieron siempre contra métodos que escalaban con compute. Lección amarga: dejar de creer que 'sabemos' cómo modelar la tarea; confiar en búsqueda y aprendizaje a gran escala.",
      difficulty: "Experto",
    },
    {
      question:
        "Con compute C = 1×10²¹ FLOPs y la regla Chinchilla (D* = 20·N*, 6·N·D = C), ¿qué tamaño de modelo N* y cuántos tokens D* son óptimos?",
      options: [
        "N* ≈ 2.9B params, D* ≈ 58B tokens",
        "N* ≈ 10B params, D* ≈ 17B tokens (compute correcto, pero D ≠ 20N)",
        "N* ≈ 1B params, D* ≈ 167B tokens (overtrained tipo Llama)",
        "N* ≈ 100B params, D* ≈ 1.7B tokens (undertrained tipo GPT-3)",
      ],
      correct: 0,
      explain:
        "Chinchilla: 6·N·D = C y D* = 20·N*. Sustituyendo: 6·N·(20·N) = 120·N² = 1e21 → N² = 8.33e18 → N ≈ 2.89e9 ≈ 2.9B. D = 20·2.9B = 58B tokens. Verificación: 6 × 2.9e9 × 58e9 ≈ 1.01e21 FLOPs ✓. El error de '10B/17B' respeta 6·N·D=C pero ignora D=20N. Llama-7B entrenado con 1T tokens (143 tokens/param) está overtrained vs Chinchilla pero es más barato en inference.",
      difficulty: "Experto",
    },
  ],

  // ─────────────────────────────────────────────────────────
  // MODERN — MoE, LoRA, cuantización, benchmarks, serving
  // ─────────────────────────────────────────────────────────
  modern: [
    {
      question:
        "En Mixtral 8x7B (un Mixture-of-Experts), ¿cuántos expertos se activan por token?",
      options: [
        "Los 8 expertos procesan cada token en paralelo y sus salidas se promedian (estilo ensemble)",
        "2 expertos (top-2) seleccionados por un router gating network por token",
        "Solo el experto especializado en el idioma o dominio del token (1 por token)",
        "Número variable entre 1 y 8: el router decide dinámicamente según su confianza",
      ],
      correct: 1,
      explain:
        "Mixtral tiene 8 expertos FFN por capa, pero solo activa top-2 por token (k fijo, no dinámico). Los expertos NO se eligen por idioma ni se promedian: el router aplica softmax sobre 8 logits y toma los 2 mayores. Total de parámetros: ~47B. Activados por token: ~13B. Esto da calidad cercana a un 47B denso con costo de inference de un ~13B.",
      difficulty: "Básico",
    },
    {
      question:
        "En LoRA (Low-Rank Adaptation), el rango típico usado para fine-tunar un LLM está en el rango:",
      options: [
        "1 a 4 (mínimo posible)",
        "8 a 64",
        "256 a 1024 (cercano al rango original)",
        "1000+ (igual al rango de los pesos originales)",
      ],
      correct: 1,
      explain:
        "LoRA descompone ΔW = B·A donde A es r×d y B es d×r. Rank r = 8-64 cubre la mayoría de casos. Parámetros entrenables: <1% del modelo. Memoria de optimizer: ~70% menos que full FT. Es el técnica ampliamente usada para adaptar LLMs modernos.",
      difficulty: "Intermedio",
    },
    {
      question:
        "Al cuantizar Llama-7B de FP16 a INT4, ¿cómo cambia la VRAM requerida para inference?",
      options: [
        "De 70 GB a 35 GB (reduce ~50%)",
        "De 13 GB a ~4 GB (reduce ~70%)",
        "De 14 GB a 12 GB (casi no cambia)",
        "De 28 GB a 28 GB (la cuantización no afecta VRAM)",
      ],
      correct: 1,
      explain:
        "FP16 = 2 bytes/param × 7B = 14 GB. INT4 = 0.5 bytes/param × 7B = 3.5 GB (+ overhead). Con GGUF/groupwise quantization se logra correr un 7B en una MacBook con 8GB RAM. Pérdida de calidad: <1% en MMLU. Trade-off brutal a favor del deployment edge.",
      difficulty: "Avanzado",
    },
    {
      question: "MMLU (Massive Multitask Language Understanding) evalúa LLMs sobre ¿cuántas materias?",
      options: [
        "10 materias (matemática, historia, etc. básicas)",
        "57 materias académicas (desde historia universal hasta astronomía y derecho)",
        "100 materias (todas las carreras universitarias)",
        "1 sola materia pero con miles de preguntas",
      ],
      correct: 1,
      explain:
        "MMLU cubre 57 subjects con ~14k preguntas multiple-choice de exámenes profesionales y universitarios. Es EL benchmark de conocimiento general. GPT-3 (175B) sacó 43.9%, GPT-4 ~86.4%, Llama-3 70B ~82. Los LLMs modernos saturan; por eso surgen MMLU-Pro (10 opciones, 120 subjects) y GPQA.",
      difficulty: "Avanzado",
    },
    {
      question:
        "vLLM usa PagedAttention para acelerar el serving de LLMs. ¿Cuál es la mejora típica de throughput?",
      options: [
        "1.1-1.3x (marginal)",
        "2-4x respecto a HuggingFace Transformers naive",
        "10-50x (órdenes de magnitud)",
        "No mejora throughput, solo reduce latencia por request",
      ],
      correct: 1,
      explain:
        "PagedAttention divide el KV cache en bloques fijos (como la MMU de un SO) eliminando fragmentación. Permite continuous batching y sharing de KV entre secuencias con prefijo común. Resultado: 2-4x más throughput en producción. vLLM, TGI y SGLang adoptan variantes de esta idea.",
      difficulty: "Experto",
    },
    {
      question:
        "Mixtral 8x7B tiene 47B parámetros totales pero solo activa 13B por token. Con la regla 2·N·D FLOPs para inference (N = params activados, D = tokens), ¿cuántos FLOPs consume atender 1M requests de 500+200 tokens cada uno?",
      options: [
        "≈ 1.82 × 10¹⁹ FLOPs (2·13B·700 tokens·1M requests)",
        "≈ 6.58 × 10¹⁹ FLOPs (usando N_total=47B en vez de N_active=13B)",
        "≈ 9.1 × 10¹⁸ FLOPs (olvidando el factor 2 en 2·N·D)",
        "≈ 1.82 × 10²² FLOPs (confundir 1M requests con 1B requests)",
      ],
      correct: 0,
      explain:
        "FLOPs/token en inference ≈ 2·N_active = 2·13e9 = 2.6e10. Tokens por request = 500 + 200 = 700. FLOPs/request = 700 × 2.6e10 = 1.82e13. 1M requests → 1e6 × 1.82e13 = 1.82e19 FLOPs/día. Nótese que se usa N_active (13B), no N_total (47B): esa es la ventaja de MoE. El error con 47B daría 6.58e19 (3.6x más caro).",
      difficulty: "Experto",
    },
  ],
};
