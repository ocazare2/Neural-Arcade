import type { LevelMeta } from "./types";

// ═══════════════════════════════════════════════════════════
// NEURAL ARCADE — Niveles avanzados del currículo 2026
//
// Complementan el currículo principal con hardware, scaling laws y
// arquitecturas modernas. Se integran en la ruta principal desde NeuralArcade.tsx.
// Mismo formato LevelMeta, mismos bloques pedagógicos.
// ═══════════════════════════════════════════════════════════

export const EXTRA_LEVELS: LevelMeta[] = [
  // ───────────────────────────────────────────────────────
  // NIVEL 13 — HARDWARE Y ESCALA
  // ───────────────────────────────────────────────────────
  {
    id: "hardware",
    index: 12,
    title: "Hardware y Escala",
    icon: "🖥️",
    color: "#94a3b8",
    tag: "GPUs, FLOPS y el costo real",
    summary: "Por qué entrenar un LLM cuesta millones y qué hardware hace falta.",
    estimatedMin: 18,
    concepts: ["GPU vs CPU", "FLOPS", "Mixed precision (BF16, FP16)", "Memory bandwidth", "HBM", "TPU", "Training cost"],
    paperRef: { title: "Mixed Precision Training", year: 2017, authors: "Micikevicius et al. (NVIDIA)" },
    glossary: [
      { term: "GPU", definition: "Graphics Processing Unit. Miles de núcleos simples optimizados para cómputo paralelo masivo. Es el motor de todo deep learning moderno." },
      { term: "FLOPS", definition: "Floating-point Operations Per Second. Mide la velocidad teórica de un chip. H100 SXM5: 989 TFLOPS FP16 Tensor Core dense (1979 con sparsity 2:4); 1979 TFLOPS FP8 dense (3958 con sparsity)." },
      { term: "FP16/BF16/FP32", definition: "Formatos numéricos: FP32 (4 bytes, máxima precisión), FP16 (2 bytes, rango limitado), BF16 (2 bytes, mismo rango que FP32 pero menos precisión)." },
      { term: "HBM", definition: "High Bandwidth Memory. Memoria apilada 3D pegada al chip GPU. H100: 80 GB HBM3 a 3.35 TB/s. Es el bottleneck de la mayoría de cargas LLM." },
      { term: "TPU", definition: "Tensor Processing Unit. ASIC de Google diseñado específicamente para multiplicación de matrices. Usado en PaLM, Gemini." },
      { term: "Mixed Precision", definition: "Técnica que entrena en FP16/BF16 pero mantiene copias FP32 para pesos maestros y gradientes. Reduce VRAM y acelera 2-3x sin pérdida de calidad." },
      { term: "Roofline", definition: "Modelo que visualiza si una carga es compute-bound o memory-bound. El performance máximo = min(peak FLOPS, bandwidth × operational intensity)." },
    ],
    theory: [
      {
        title: "CPU vs GPU — por qué entrenamos en tarjetas gráficas",
        level: "Básico",
        body: "Una CPU tiene pocos núcleos (8-64) pero muy potentes, optimizados para latencia baja y ramificación compleja. Una GPU tiene miles de núcleos simples (H100: 18k+ CUDA cores) que ejecutan la misma instrucción en paralelo sobre datos distintos (SIMT).\n\nLas redes neuronales son, en su núcleo, multiplicaciones de matrices masivas: Y = XW + b. Cada elemento del resultado es independiente y se puede computar en paralelo. Por eso la GPU gana ~100x sobre la CPU en entrenamiento. Sin GPU, GPT-3 hubiera tardado siglos. El trade-off: la GPU es pésima para lógica condicional y código serial, donde la CPU reina.",
        formula: "\\text{speedup} \\approx \\frac{N_{\\text{núcleos GPU}}}{N_{\\text{núcleos CPU}}} \\cdot \\frac{\\text{paralelismo aprovechable}}{\\text{overhead de lanzamiento}}",
        formulaExplain: "El speedup real depende de cuán paralelizable sea la carga. Una matmul de 4096×4096 aprovecha casi todo; un bucle if-else encadenado no aprovecha nada. LLMs son el caso ideal para GPU: casi todo el cómputo es GEMM.",
      },
      {
        title: "FLOPS, memoria y el modelo de roofline",
        level: "Intermedio",
        body: "El tiempo de un cómputo se acota por dos recursos: cuántas operaciones flotantes requiere (FLOPs) y cuántos bytes hay que mover (memoria). El modelo de roofline dice que el performance real es el mínimo entre la capacidad de cómputo y la capacidad de memoria.\n\nH100 SXM5 entrega 989 TFLOPS FP16 Tensor Core dense (1979 con sparsity 2:4) y 3.35 TB/s de ancho de banda HBM3. Sorprendentemente, la mayoría de cargas LLM (especialmente inference con batch pequeño) son **memory-bound**: pasan más tiempo esperando datos que computando. Por eso el ancho de banda HBM es más decisivo que los TFLOPS para servir modelos.",
        formula: "T = \\max\\left(\\frac{\\text{FLOPs}}{\\text{FLOPS}_{\\text{peak}}}, \\;\\frac{\\text{Bytes}}{\\text{Bandwidth}_{\\text{peak}}}\\right)",
        formulaExplain: "El primer término domina en cargas compute-bound (matmuls grandes, training batch grande). El segundo domina en memory-bound (attention con secuencia larga, inference batch=1). La 'operational intensity' (FLOPs/byte) determina cuál roofline aplica.",
      },
      {
        title: "Mixed Precision Training — BF16, FP16 y FP32",
        level: "Avanzado",
        body: "Entrenar en FP32 es estable pero caro: cada peso ocupa 4 bytes. Mixed Precision Training (Micikevicius 2017) almacena y computa en FP16/BF16 pero mantiene una copia FP32 'master' de los pesos para actualizaciones precisas. Reduce VRAM ~50% y acelera 2-3x gracias a los Tensor Cores.\n\nBF16 (bfloat16, Google 2017) es el estándar moderno para LLMs: tiene el mismo rango dinámico que FP32 (8 bits de exponente) pero menos precisión (7 bits de mantisa vs 23). FP16 tiene más precisión (10 bits mantisa) pero rango limitado (5 bits exponente), lo que causa overflows/underflows durante el entrenamiento. Por eso BF16 reemplazó a FP16 en la mayoría de frameworks modernos (PyTorch 2.0+, JAX).",
        formula: "\\text{VRAM}_{\\text{Adam}} \\approx P \\times (2_{\\text{FP16 w}} + 2_{\\text{FP16 grad}} + 4_{\\text{FP32 master}} + 4_{\\text{FP32 m}} + 4_{\\text{FP32 v}}) = 16 \\cdot P \\;\\text{bytes}",
        formulaExplain: "Para un modelo de P parámetros, Adam en mixed precision consume ~16 bytes por parámetro: pesos FP16 (2B) + gradientes FP16 (2B) + copia master FP32 (4B) + momento m FP32 (4B) + segundo momento v FP32 (4B). Un Llama-7B necesita ~112 GB solo de estado de optimizador — imposible en una sola GPU de 80 GB. De ahí la necesidad de FSDP, DeepSpeed ZeRO, tensor parallelism.",
      },
      {
        title: "Training cost economics — cuánto cuesta de verdad un LLM",
        level: "Experto",
        body: "La regla de oro para estimar FLOPs de entrenamiento: C ≈ 6 × N_params × N_tokens (factor 6 = 2 forward + 4 backward, ya que backward requiere gradiente respecto a pesos Y respecto a activaciones). GPT-3 175B entrenado con 300B tokens: C ≈ 6 × 1.75e11 × 3e11 = 3.15×10²³ FLOPs. A 100% MFU en V100 (~100 TFLOPS FP16) son ~100 GPU-años; con 50% MFU real, ~200 GPU-años ≈ $4.6M a costos de 2020. Llama 3 405B: estimados $700M-$1B incluida iteración de hyperparams y runs fallidos.\n\nLa regla práctica de costos: cost ≈ (6 × N_params × N_tokens / MFU) × $/FLOP_sostenido. El precio de alquiler y el rendimiento sostenido cambian por región, proveedor, red y carga; usa esta cuenta como un escenario, no como una cotización. Para un 7B con 1.4T tokens: C = 6 × 7e9 × 1.4e12 = 5.88e22 FLOPs. Si una GPU sostuviera 500 TFLOPS (5e14 FLOPs/s), 5.88e22 / 5e14 = 1.176e8 s ≈ 32,700 horas en una sola GPU. Para terminar cerca de 33 horas harían falta ~1,000 GPUs equivalentes; a $2–3 por GPU-hora, solo el acelerador rondaría $65k–98k antes de red, almacenamiento, fallos e iteración. Esto asume 50% MFU; si tu MFU es menor, el tiempo y el costo suben. Los costos de inference son distintos y dependen fuertemente del throughput y la longitud de contexto.",
        formula: "C_{\\text{train}} \\approx 6 \\cdot N_{\\text{params}} \\cdot N_{\\text{tokens}}, \\quad \\text{cost} \\approx \\frac{C_{\\text{train}}}{\\text{MFU} \\cdot \\text{FLOPS}_{\\text{GPU}}} \\cdot \\$\\text{/hr}",
        formulaExplain: "MFU (Model FLOPs Utilization) es la fracción de FLOPS teóricos realmente aprovechada. En training bien afinado alcanza 50-60%; en inference de batch=1 baja a <5% (memory-bound). Optimizar MFU es el trabajo de los ingenieros de ML systems: flash attention, kernel fusion, gradient checkpointing, communication overlap.",
      },
    ],
  },

  // ───────────────────────────────────────────────────────
  // NIVEL 14 — SCALING LAWS
  // ───────────────────────────────────────────────────────
  {
    id: "scaling",
    index: 13,
    title: "Scaling Laws",
    icon: "📈",
    color: "#22c55e",
    tag: "Las leyes que predicen el futuro",
    summary: "Cómo el rendimiento de un LLM escala predeciblemente con parámetros, datos y compute.",
    estimatedMin: 16,
    concepts: ["Kaplan scaling", "Chinchilla optimal", "Compute-optimal", "Emergent abilities", "Power law", "Bitter lesson"],
    paperRef: { title: "Training Compute-Optimal Large Language Models", year: 2022, authors: "Hoffmann et al. (DeepMind, Chinchilla)" },
    glossary: [
      { term: "Scaling law", definition: "Relación empírica (típicamente power law) entre una métrica de rendimiento (loss, accuracy) y los recursos de entrenamiento (params, datos, compute)." },
      { term: "Power law", definition: "Función de la forma f(x) = a · x^k. En escala log-log se ve como una recta. Caracteriza la mayoría de fenómenos de deep learning." },
      { term: "Compute-optimal", definition: "La asignación de parámetros y datos que minimiza la loss para un presupuesto fijo de FLOPs. Chinchilla: ~20 tokens por parámetro." },
      { term: "Chinchilla optimal", definition: "Modelo entrenado en la frontera compute-optimal. Para 10²¹ FLOPs, ~70B parámetros con 1.4T tokens (20:1 ratio)." },
      { term: "Emergent ability", definition: "Capacidad que aparece abruptamente al cruzar cierto umbral de escala (params/compute), sin estar presente en modelos más pequeños. Controvertido." },
      { term: "Bitter Lesson", definition: "Ensayo de Rich Sutton (2019): los métodos generales que aprovechan cómputo (search, learning) terminan venciendo a los métodos específicos de dominio a largo plazo." },
    ],
    theory: [
      {
        title: "La sorpresa: el rendimiento sigue leyes predecibles",
        level: "Básico",
        body: "Una observación asombrosa del deep learning: dentro de una familia de modelos, datos y objetivo comparables, la pérdida de un LLM suele decaer como una **power law** suave con compute, parámetros y datos. Kaplan et al. (OpenAI, 2020) mostraron que L(N) ≈ (Nc/N)^α con α≈0.076 en sus experimentos: pequeños incrementos en parámetros producen mejoras medibles y relativamente predecibles.\n\nEsto transformó la industria porque permite planear pilotos antes de hacer un entrenamiento grande. No significa que «basta con escalar»: calidad y licencia de datos, arquitectura, optimización, evaluación y producto también cambian el resultado. Una scaling law es una extrapolación útil bajo supuestos; hay que comprobarla con mediciones propias.",
        formula: "L(N) \\approx \\left(\\frac{N_c}{N}\\right)^{\\alpha}, \\quad \\alpha \\approx 0.076",
        formulaExplain: "L es la loss (cross-entropy), N es el número de parámetros, Nc es una constante de ajuste. Como α es pequeño, doblar parámetros solo baja la loss ~5%. Pero la loss se traduce exponencialmente en métricas downstream, así que pequeñas mejoras en loss = grandes saltos en benchmarks.",
      },
      {
        title: "Kaplan 2020 — la fórmula original",
        level: "Intermedio",
        body: "Kaplan et al. descomponen la pérdida en tres contribuciones: la que cuesta no tener suficientes parámetros, la que cuesta no tener suficientes datos, y una loss irreducible asintótica L_inf (el ruido del lenguaje mismo).\n\nLa conclusión práctica de Kaplan: con compute fijo, escala parámetros **más rápido** que datos. Es decir, mejor un modelo grande entrenado con pocos tokens que un modelo pequeño con muchos tokens. Esta recomendación guió GPT-3 (175B con solo 300B tokens, ~1.7 tokens/param). Hoy sabemos que esta recomendación estaba equivocada.",
        formula: "L(N, D) = \\left(\\frac{N_c}{N}\\right)^{\\alpha_N} + \\left(\\frac{D_c}{D}\\right)^{\\alpha_D} + L_{\\infty}",
        formulaExplain: "α_N≈0.076, α_D≈0.095, Nc≈8.8×10¹³, Dc≈5.4×10¹³. Los exponentes nos dicen que la loss es más sensible a datos (α_D > α_N), pero Kaplan interpretó mal el balance óptimo y recomendó escalar N más rápido que D. Chinchilla corrigió esto dos años después.",
      },
      {
        title: "Chinchilla 2022 — Kaplan estaba equivocado",
        level: "Avanzado",
        body: "Hoffmann et al. (DeepMind, 2022) re-entrenaron más de 400 modelos y, bajo sus datos, arquitectura y objetivo, encontraron una frontera compute-optimal cercana a **20 tokens por parámetro**, no ~1.7 como GPT-3. Eso sugirió que GPT-3 estaba **undertrained**: un modelo más pequeño con más datos podía rendir mejor con un presupuesto comparable.\n\nChinchilla 70B con 1.4T tokens usa un compute comparable al de GPT-3 175B con 300B tokens y reportó mejores resultados en sus evaluaciones. No conviertas 20:1 en una receta universal: la frontera cambia con la calidad y repetición de datos, arquitectura, longitud de contexto, objetivo, optimizador y evaluación. La lección durable es medir modelos y datos juntos, no maximizar un solo número.",
        formula: "N_{\\text{opt}} \\propto C^{0.5}, \\quad D_{\\text{opt}} \\propto C^{0.5}",
        formulaExplain: "En los ajustes de Chinchilla, parámetros óptimos y datos óptimos escalan aproximadamente con la raíz cuadrada del compute total C, de modo que su ratio queda cerca de 20:1. Esa relación describe esa frontera empírica, no una ley que sustituya pilotos. Kaplan estimaba N∝C^0.73 y D∝C^0.27; esa diferencia explica por qué sus recomendaciones podían dejar modelos con pocos datos.",
      },
      {
        title: "Emergent abilities y el Bitter Lesson",
        level: "Experto",
        body: "Wei et al. (Google, 2022) reportaron que ciertas tareas (aritmética multi-dígito, multi-step reasoning, symbolic manipulation) muestran **saltos abruptos** en rendimiento a cierto umbral de escala — son 'emergentes'. Sin embargo, Schaeffer et al. (2023) contradijeron: es un artefacto de métricas discretas (accuracy) sobre distribuciones continuas. Si mides con métricas suaves (log-likelihood), el rendimiento es suave y predecible.\n\nMás allá del debate, la lección profunda viene de Rich Sutton (2019): 'The Bitter Lesson'. Tras 70 años de AI, las técnicas que ganan a largo plazo son las que **apalancan cómputo**: search, learning, scaling. Las que codifican conocimiento humano específico (gramáticas, ontologías, heurísticas de dominio) terminan superadas. Esto explica por qué LLMs genéricos vencen a sistemas especializados: el cómputo barato recompensa la generalidad.",
        formula: "\\text{performance}(t) = f\\left(\\underbrace{\\text{compute}(t)}_{\\text{crece exponencialmente}}\\right) \\gg g\\left(\\underbrace{\\text{hand-crafted features}(t)}_{\\text{crece linealmente}}\\right)",
        formulaExplain: "En t largo, compute escala (ley de Moore + inversión) mientras que el esfuerzo humano escala linealmente. Cualquier método que dependa de ingeniería humana por dominio pierde contra uno general entrenado con más cómputo. Esta es la base filosófica del deep learning moderno: menos inducción manual, más escala.",
      },
    ],
  },

  // ───────────────────────────────────────────────────────
  // NIVEL 15 — ARQUITECTURAS MODERNAS
  // ───────────────────────────────────────────────────────
  {
    id: "modern",
    index: 14,
    title: "Arquitecturas Modernas",
    icon: "🧬",
    color: "#ec4899",
    tag: "MoE, LoRA, quantization, evals",
    summary: "Las técnicas que hacen viable entrenar y correr LLMs modernos.",
    estimatedMin: 22,
    concepts: ["MoE (Mixture of Experts)", "LoRA / QLoRA", "Quantization", "GGUF / AWQ / GPTQ", "MMLU / HumanEval", "vLLM / PagedAttention"],
    paperRef: { title: "Switch Transformers: Scaling to Trillion Parameter Models", year: 2021, authors: "Fedus et al. (Google)" },
    glossary: [
      { term: "MoE", definition: "Mixture of Experts. Cada capa FFN se reemplaza por N expertos y un router selecciona (top-k) cuáles activar por token. Permite escalar parámetros sin escalar cómputo." },
      { term: "Router", definition: "Red pequeña (típicamente lineal + softmax) que decide a qué experto(s) enviar cada token. Se entrena conjuntamente con el resto del modelo, con balance loss para evitar colapso." },
      { term: "LoRA", definition: "Low-Rank Adaptation. En lugar de fine-tunear todos los pesos W, se aproxima ΔW = B·A con matrices rango bajo. Solo B y A se entrenan: ~100x menos parámetros, mismo rendimiento." },
      { term: "QLoRA", definition: "Quantized LoRA. Cuantifica el modelo base a 4-bit (NF4) y entrena adaptadores LoRA en BF16. Permite fine-tunear un 70B en una sola GPU de 48GB." },
      { term: "Quantization", definition: "Reducir la precisión numérica de pesos/activaciones: FP16 → INT8 → INT4. Reduce VRAM 2-4x con <1% de pérdida de calidad en la mayoría de tareas." },
      { term: "MMLU", definition: "Massive Multitask Language Understanding. Benchmark de 57 asignaturas (STEM, humanidades, etc.) en formato multiple-choice. Estándar de facto para medir conocimiento." },
      { term: "PagedAttention", definition: "Kernel de vLLM que pagina el KV cache como un SO pagina RAM. Elimina fragmentación externa y permite 2-4x más throughput en inference." },
      { term: "Speculative decoding", definition: "Un modelo pequeño (draft) propone K tokens; el modelo grande los verifica en paralelo en un solo forward pass. Acelera 2-3x sin pérdida de calidad." },
    ],
    theory: [
      {
        title: "MoE — más parámetros sin más cómputo",
        level: "Básico",
        body: "En un transformer denso, cada token pasa por todas las FFN. En **Mixture of Experts** (MoE), cada FFN se reemplaza por N redes (expertos) y un **router** decide cuáles activar — típicamente top-2.\n\nMixtral 8x7B es el ejemplo canónico: 47B parámetros totales distribuidos en 8 expertos, pero solo 13B activos por token (top-2 de 8). El costo de inference es el de un modelo 13B, pero la calidad es comparable a un 47B denso. Esta es la clave de por qué Mistral y DeepSeek logran calidad de modelos gigantes a costo de modelos pequeños.\n\nEl trade-off: VRAM total sigue siendo ~47B (hay que cargar todos los expertos en memoria), y el entrenamiento es inestable (hay que balancear la carga entre expertos con auxiliary loss).",
        formula: "\\text{FFN}_{\\text{MoE}}(x) = \\sum_{i \\in \\text{top-}k} G_i(x) \\cdot \\text{Expert}_i(x)",
        formulaExplain: "G_i(x) es el peso que el router asigna al experto i (típicamente softmax de un score). Solo los top-k expertos (k=1 en Switch, k=2 en Mixtral) computan y ponderan. El resto se ignora. Esto desacopla parámetros totales (todos los expertos) de cómputo por token (solo k activos).",
      },
      {
        title: "LoRA — fine-tuning sin tocar pesos",
        level: "Intermedio",
        body: "Fine-tunear un LLM completo requiere actualizar y almacenar gradientes para todos sus parámetros (miles de millones). LoRA (Hu et al. 2021) observa que los updates durante fine-tuning son de **rango bajo**: en lugar de aprender ΔW (tamaño d×d), aprende ΔW = B·A donde B es d×r, A es r×d, con r << d.\n\nSolo se entrenan B y A; W queda congelado. Esto reduce los parámetros entrenables en ~100x y permite fine-tunear un 7B en una GPU consumer. La calidad es prácticamente igual al full fine-tuning para tareas específicas. Para servir, puedes pre-computar W_eff = W + B·A y correr inference normal.",
        formula: "h = W x + \\Delta W x = W x + B A x, \\quad B \\in \\mathbb{R}^{d \\times r}, \\; A \\in \\mathbb{R}^{r \\times d}, \\; r \\ll d",
        formulaExplain: "Para d=4096 (Llama-7B) y r=8: parámetros LoRA por capa = 2·8·4096 = 65,536 vs 4096² = 16,777,216 original. Reducción de 256x. En la práctica r=8 o r=16 cubren la mayoría de tareas; r=64+ se reserva para domain shifts grandes (cambio de idioma, modalidad). QLoRA (Dettmers 2023) cuantifica W a 4-bit NF4 antes de aplicarle LoRA, bajando VRAM de 80GB → 24GB para un 70B.",
      },
      {
        title: "Quantization — de FP16 a INT4 casi gratis",
        level: "Avanzado",
        body: "La mayoría del cómputo de inference consiste en multiplicar pesos por activaciones. Los pesos de un LLM tienen distribuciones relativamente sencillas (casi gaussianas, centradas en 0) y se pueden **cuantificar** a enteros de pocos bits sin perder mucha calidad.\n\nFormatos principales: **GGUF** (llama.cpp) usa k-quants con bloques de 32 valores; **AWQ** (Lin et al. 2023) mantiene los 'salient weights' (los más sensibles) en FP16 y cuantifica el resto; **GPTQ** (Frantar et al. 2022) usa una aproximación de Hessiana inversa para compensar el error de cuantificación. Pérdida típica en INT4: <1% en MMLU. VRAM de Llama-7B: 13 GB en FP16 → 4 GB en INT4. Esto habilita correr LLMs en laptops.",
        formula: "w_{\\text{quant}} = \\text{round}\\left(\\frac{w}{s}\\right), \\quad s = \\frac{\\max(|w|)}{2^{b-1}-1}",
        formulaExplain: "s es el scale factor que mapea el rango de pesos a enteros de b bits. En INT4, cada peso ocupa 0.5 bytes (vs 2 de FP16). AWQ mejora esto identificando el ~1% de pesos 'salient' cuyo error de cuantificación domina, escalándolos antes de cuantificar y deshaciendo después. Resultado: INT4 con calidad cercana a FP16.",
      },
      {
        title: "Evals y la pila de inference moderna",
        level: "Experto",
        body: "Medir un LLM es endemoniadamente difícil. Los benchmarks estándar: **MMLU** (57 asignaturas, multiple-choice) mide conocimiento; **HumanEval** (164 problemas Python) mide código; **MT-Bench** (multi-turn, evaluado por GPT-4) mide conversación; **GPQA** (Google-Proof Q&A) mide razonamiento experto. Cada uno tiene sesgos: contamination (el modelo vio el test en entrenamiento), format sensitivity, sampling variance.\n\nLa pila de inference puede combinar KV cache eficiente, batching dinámico y kernels optimizados; el resultado depende de hardware, carga y longitud de secuencia, así que se mide con p50/p95 y throughput real. Otra técnica es **speculative decoding**: un modelo pequeño (draft) propone γ tokens y el grande los verifica en paralelo. Si muchos se aceptan, se emiten varios tokens por una verificación del target; si se rechazan pronto, la ganancia cae. No promete una aceleración fija: hay que medir aceptación, calidad y costo.",
        formula: "\\text{speedup}_{\\text{spec}} \\approx \\frac{(1 + \\mathbb{E}[A]) \\cdot T_{\\text{target}}}{T_{\\text{target}} + \\gamma \\cdot T_{\\text{draft}}}",
        formulaExplain: "A es el número de propuestas draft aceptadas de un máximo γ. Una ronda emite 1+A tokens (incluido el token que corrige o continúa el target) y cuesta aproximadamente una verificación target más γ pasos draft. Si A se acerca a γ y el draft es barato, hay ganancia; si A es bajo, el trabajo extra puede no compensar. El modelo es una aproximación: kernels, batching y longitudes reales cambian el resultado.",
      },
    ],
  },
];
