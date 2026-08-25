// ═══════════════════════════════════════════════════════════
// GLOSARIO GLOBAL — Términos técnicos con definiciones
// Cualquier texto pasado por <GlossaryText> resalta automáticamente
// los términos presentes y los vuelve clickables en azul.
// ═══════════════════════════════════════════════════════════

export interface GlossaryEntry {
  term: string;
  def: string;
  aliases?: string[];
}

const GLOBAL_GLOSSARY: GlossaryEntry[] = [
  // ─── Matemáticas básicas
  { term: "vector", def: "Lista ordenada de números. Ej: [3, 7, 2] es un vector 3D. Vive en R^n.", aliases: ["vectores"] },
  { term: "escalar", def: "Un solo número (no una lista). Ej: la temperatura 24°C." },
  { term: "matriz", def: "Tabla de números organizados en filas y columnas. Una matriz 3×4 tiene 3 filas y 4 columnas.", aliases: ["matrices"] },
  { term: "producto punto", def: "Suma de productos componente a componente: a·b = Σ a_i × b_i. Mide alineación entre dos vectores.", aliases: ["dot product"] },
  { term: "norma", def: "La 'longitud' de un vector: |v| = √(v1² + v2² + ... + vn²). Ej: |[3,4]| = 5.", aliases: ["norma L2", "magnitud"] },
  { term: "transpuesta", def: "Intercambiar filas por columnas. Si A es 3×4, Aᵀ es 4×3.", aliases: ["traspuesta"] },
  { term: "derivada", def: "Tasa de cambio instantáneo. La pendiente de f en un punto. Si f'(x) > 0, f sube.", aliases: ["derivadas"] },
  { term: "derivada parcial", def: "Derivada de f respecto a UNA variable, manteniendo las otras fijas.", aliases: ["derivadas parciales"] },
  { term: "gradiente", def: "Vector de todas las derivadas parciales. Apunta cuesta ARRIBA. Para minimizar, camina en -∇f." },
  { term: "regla de la cadena", def: "Si z = f(g(x)), entonces dz/dx = f'(g(x))·g'(x). El motor de backpropagation." },
  { term: "softmax", def: "Función que convierte una lista de números reales en probabilidades (0-1, suman 1). Fórmula: softmax(z)_i = e^z_i / Σ e^z_j." },
  { term: "sigmoide", def: "f(x) = 1/(1+e^-x). Comprime a (0,1). Sufre vanishing gradient en profundidad." },
  { term: "ReLU", def: "Rectified Linear Unit: f(x) = max(0, x). Activación estándar en hidden layers." },

  // ─── Tokens
  { term: "token", def: "Unidad atómica de texto que un modelo procesa. Puede ser palabra, subpalabra o caracter.", aliases: ["tokens"] },
  { term: "BPE", def: "Byte-Pair Encoding. Algoritmo que fusiona iterativamente los pares de bytes más frecuentes del corpus." },
  { term: "WordPiece", def: "Variante de BPE usada por BERT. Usa pointwise mutual information en lugar de frecuencia absoluta." },
  { term: "vocabulario", def: "Conjunto finito de todos los tokens que un modelo conoce. GPT-4 tiene ~100k tokens.", aliases: ["vocab"] },
  { term: "context window", def: "Cantidad máxima de tokens que el modelo puede procesar a la vez. GPT-4 Turbo: 128k." },
  { term: "corpus", def: "Conjunto grande de textos usado para entrenar. Internet entero es el corpus del pre-entrenamiento." },
  { term: "pointwise mutual information", def: "Mide cuánto más aparece el par (a,b) junto de lo esperable por azar: PMI = log(freq(a,b) / (freq(a)·freq(b)))." },

  // ─── Embeddings
  { term: "embedding", def: "Vector numérico de dimensión fija (d) que representa un token. Cercanía ≈ similitud semántica.", aliases: ["embeddings"] },
  { term: "similitud coseno", def: "cos(A,B) = (A·B)/(|A|·|B|). 1 = paralelos, 0 = ortogonales, -1 = opuestos.", aliases: ["coseno"] },
  { term: "espacio latente", def: "El espacio R^d donde viven los embeddings. Sus dimensiones codifican factores semánticos." },
  { term: "Word2vec", def: "Algoritmo de Mikolov 2013 (CBOW y Skip-gram) que entrena embeddings prediciendo contexto." },
  { term: "positional encoding", def: "Vector que se suma al embedding del token para codificar su posición en la secuencia." },
  { term: "RoPE", def: "Rotary Position Embedding. Rota el embedding según la posición. Usado por LLaMA y Qwen." },

  // ─── Neuronas
  { term: "neurona", def: "Unidad que calcula suma ponderada de entradas + sesgo, aplicando luego una función de activación.", aliases: ["neuronas"] },
  { term: "peso", def: "Coeficiente que determina la importancia de una entrada. Se aprende durante entrenamiento.", aliases: ["pesos"] },
  { term: "sesgo", def: "Constante que desplaza la activación de una neurona. Permite que se 'encienda' aun con entradas cero.", aliases: ["bias"] },
  { term: "función de activación", def: "No linealidad aplicada tras la suma ponderada: ReLU, sigmoide, tanh, GELU, SwiGLU." },
  { term: "GELU", def: "Gaussian Error Linear Unit: x·Φ(x). Activación estándar en BERT y GPT." },
  { term: "MLP", def: "Multi-Layer Perceptron. Red neuronal con múltiples capas densas." },
  { term: "feature", def: "Característica o atributo de un dato. En una imagen: píxeles. En texto: tokens. Sinónimo de 'entrada'.", aliases: ["features"] },
  { term: "regresión", def: "Tarea de ML que predice un número continuo (ej: precio, temperatura). vs clasificación que predice categoría." },

  // ─── Backprop
  { term: "backpropagation", def: "Algoritmo que usa la regla de la cadena para calcular gradientes eficientemente, recorriendo la red al revés." },
  { term: "forward pass", def: "Calcular la salida de la red dada una entrada. Propagación hacia adelante." },
  { term: "loss", def: "Función de pérdida. Mide cuánto se equivoca el modelo. Ej: cross-entropy, MSE.", aliases: ["pérdida"] },
  { term: "cross-entropy", def: "L = -Σ y log(ŷ). Surprisal del target bajo la predicción. Estándar en LLMs." },
  { term: "MSE", def: "Mean Squared Error: promedio de (ŷ-y)². Estándar en regresión." },
  { term: "vanishing gradient", def: "En redes profundas, los gradientes se multiplican por <1 al retropropagar, decayendo a 0." },
  { term: "exploding gradient", def: "Los gradientes crecen exponencialmente al retropropagar, causando overflow numérico." },
  { term: "gradient clipping", def: "Limitar la norma del gradiente a un máximo. Previene exploding gradient." },
  { term: "logit", def: "Salida cruda de una capa neuronal: un número real no acotado (puede ser negativo o muy grande). Se convierte en probabilidad vía softmax.", aliases: ["logits"] },
  { term: "target", def: "Valor verdadero que el modelo debe predecir. En clasificación: la clase correcta. Se compara con la predicción.", aliases: ["etiqueta", "label"] },
  { term: "one-hot", def: "Codificación de categoría como vector con un 1 en la posición correcta y 0 en las demás. Ej: clase 2 de 4 → [0,0,1,0]." },
  { term: "log-likelihood", def: "Logaritmo de la verosimilitud. Maximizarla = minimizar cross-entropy. log p(y|modelo)." },
  { term: "entropía", def: "-Σ p log p. Mide la incertidumbre de una distribución. Base de information theory.", aliases: ["entropy"] },
  { term: "information theory", def: "Rama de la matemática que cuantifica información, sorpresa y compresión. Shannon 1948. Base de cross-entropy y KL divergence." },
  { term: "KL divergence", def: "D_KL(p‖q) = Σ p log(p/q). 'Costo extra' de usar q en lugar de p." },
  { term: "surprisal", def: "-log p(x). Cuánto sorprende un evento individual." },
  { term: "retrieval", def: "Recuperación. En RAG, buscar documentos relevantes a una query en una base vectorial." },

  // ─── Entrenamiento
  { term: "gradient descent", def: "w ← w - η·∇L. Da pasos en dirección opuesta al gradiente para minimizar la pérdida." },
  { term: "learning rate", def: "Tamaño del paso en gradient descent. Pequeño = lento, grande = puede diverger.", aliases: ["eta", "lr"] },
  { term: "batch", def: "Subconjunto de ejemplos usados para estimar el gradiente. Típicamente 32-2048.", aliases: ["mini-batch"] },
  { term: "SGD", def: "Stochastic Gradient Descent. Estima el gradiente con un mini-batch en cada paso." },
  { term: "momentum", def: "Promedio exponencial del gradiente. Suaviza la trayectoria y acelera convergencia." },
  { term: "Adam", def: "Adaptive Moment Estimation. Combina momentum (1er momento) y RMSProp (2do momento)." },
  { term: "AdamW", def: "Adam con weight decay desacoplado. Estándar para pre-entrenamiento de transformers." },
  { term: "weight decay", def: "Regularización L2: añade λ‖w‖² a la pérdida. Encoge pesos hacia 0." },
  { term: "warmup", def: "Aumentar el learning rate linealmente de 0 a η_max en los primeros N pasos." },
  { term: "cosine schedule", def: "lr(t) = 0.5·lr_max·(1 + cos(πt/T)). Decae suavemente. Estándar en LLMs." },
  { term: "MFU", def: "Model FLOPs Utilization. Fracción de FLOPS teóricos realmente aprovechada. 50-60% en training bien afinado." },
  { term: "overfitting", def: "El modelo memoriza ruido del entrenamiento. Baja loss train, alta loss test." },
  { term: "underfitting", def: "El modelo es demasiado simple. Tanto loss train como test son altos." },

  // ─── Atención
  { term: "Query", def: "Vector que pregunta: '¿qué información necesito?'." },
  { term: "Key", def: "Vector que anuncia: 'esto es lo que ofrezco'." },
  { term: "Value", def: "Vector con el contenido que se transfiere si Query y Key coinciden." },
  { term: "scaled dot-product attention", def: "softmax(QKᵀ/√d_k)·V. La fórmula canónica del paper Attention Is All You Need." },
  { term: "multi-head attention", def: "h atenciones en paralelo sobre proyecciones distintas del input. Cada head captura relaciones diferentes." },
  { term: "causal mask", def: "Matriz triangular que impide atender tokens futuros. Esencial en autoregresión." },
  { term: "self-attention", def: "Q, K, V provienen todos de la misma secuencia." },
  { term: "cross-attention", def: "Q de una secuencia, K/V de otra. Usado en encoder-decoder." },
  { term: "Flash Attention", def: "Reordena el cómputo de attention en bloques sin materializar la matriz n×n. Misma matemática, menos memoria." },

  // ─── Transformer
  { term: "transformer", def: "Arquitectura de Vaswani 2017: bloques de attention + FFN con residuals y LayerNorm." },
  { term: "FFN", def: "Feed-Forward Network. MLP de 2 capas aplicado a cada posición. Expande d_model → 4·d_model → d_model." },
  { term: "LayerNorm", def: "Normaliza activaciones a media 0 varianza 1 por token. Estabiliza entrenamiento profundo." },
  { term: "RMSNorm", def: "LayerNorm sin restar la media. Más rápido. Usado por LLaMA." },
  { term: "residual connection", def: "Sumar la entrada a la salida: x + Sublayer(x). Da al gradiente un atajo de derivada 1." },
  { term: "pre-norm", def: "x + Sublayer(LayerNorm(x)). Estándar moderno (GPT-2+). Más estable que post-norm." },
  { term: "SwiGLU", def: "Swish-gated linear unit: (Swish(xW₁) ⊙ xW₂)W₃. Reemplaza GELU en FFN modernas. ~50% más parámetros." },
  { term: "encoder", def: "Bloque transformer que procesa la entrada con self-attention bidireccional. BERT es encoder-only." },
  { term: "decoder", def: "Bloque transformer con causal mask. Genera token a token. GPT es decoder-only." },
  { term: "KV cache", def: "Cache de las Keys y Values ya computadas. Evita recalcular attention para tokens pasados." },
  { term: "BERT", def: "Bidirectional Encoder Representations from Transformers (Google 2018). Encoder-only, bidireccional, para clasificación y NER." },
  { term: "GPT-3", def: "Generative Pre-trained Transformer 3 (OpenAI 2020). 175B parámetros, decoder-only, few-shot learner." },
  { term: "LLM", def: "Large Language Model. Modelo de lenguaje entrenado en trillones de tokens. GPT, Claude, Llama, Gemini." },

  // ─── Generación
  { term: "autoregresión", def: "Generar token a token condicionado en lo anterior. x_t ~ P(x_t | x_<t).", aliases: ["autoregressive", "autoregresivo"] },
  { term: "temperature", def: "Divide logits por T antes de softmax. T→0 = greedy, T→∞ = uniforme. Controla aleatoriedad." },
  { term: "top-k", def: "Mantener solo los k tokens más probables antes de muestrear." },
  { term: "top-p", def: "Mantener el conjunto mínimo de tokens cuya probabilidad acumulada ≥ p. Adaptativo.", aliases: ["nucleus sampling"] },
  { term: "beam search", def: "Mantener las B secuencias parciales más probables. Calidad vs diversidad." },
  { term: "greedy decoding", def: "Siempre elegir el token más probable. Determinista, repetitivo." },
  { term: "speculative decoding", def: "Modelo pequeño propone, grande verifica en paralelo. 2-3x más rápido sin perder calidad." },

  // ─── Alignment
  { term: "pre-entrenamiento", def: "Fase 1: predecir siguiente token sobre trillones de tokens de internet.", aliases: ["pretraining", "pre-entrenado"] },
  { term: "SFT", def: "Supervised Fine-Tuning. Ajustar el modelo con ejemplos (instrucción, respuesta ideal)." },
  { term: "RLHF", def: "Reinforcement Learning from Human Feedback. Reward model + PPO para alinear con preferencias humanas." },
  { term: "DPO", def: "Direct Preference Optimization. Optimiza la política directamente sobre preferencias. Sin reward model ni PPO." },
  { term: "reward model", def: "Modelo entrenado con rankings humanos. Asigna escalar r(prompt, respuesta)." },
  { term: "PPO", def: "Proximal Policy Optimization. Algoritmo RL con clip ratio para estabilidad." },
  { term: "Constitutional AI", def: "El modelo se auto-corrige contra principios explícitos. Alternativa de Anthropic a RLHF puro." },
  { term: "alucinación", def: "El LLM genera contenido plausible pero falso. RAG la reduce al anclar en documentos.", aliases: ["alucinaciones", "hallucination"] },

  // ─── RAG
  { term: "RAG", def: "Retrieval-Augmented Generation. Recupera documentos relevantes y los pasa al LLM como contexto." },
  { term: "vector DB", def: "Base de datos optimizada para buscar vectores por similitud. Pinecone, Weaviate, Qdrant." },
  { term: "chunking", def: "Partir documentos en fragmentos (chunks) de ~200-1000 tokens para recuperación." },
  { term: "HNSW", def: "Hierarchical Navigable Small World. Índice para búsqueda aproximada de vecinos. Sub-linear time." },
  { term: "reranking", def: "Segunda fase con cross-encoder más caro que reordena los top-k recuperados." },
  { term: "hybrid search", def: "Combina similitud semántica (vector) con BM25 (keyword). Lo mejor de ambos." },
  { term: "BM25", def: "Algoritmo de búsqueda full-text basado en frecuencia de términos. Complementa embeddings." },

  // ─── Agentes
  { term: "agente", def: "LLM en un loop: observa → piensa → actúa (con tools) → repite hasta lograr el objetivo.", aliases: ["agentes"] },
  { term: "ReAct", def: "Reason + Act. Patrón de agente que alterna Thought, Action, Observation." },
  { term: "tool use", def: "Capacidad del LLM de llamar funciones externas (búsqueda, código, APIs) y razonar sobre el resultado." },
  { term: "function calling", def: "Mecanismo nativo en LLMs modernos para emitir llamadas a funciones con JSON válido." },
  { term: "reflection", def: "El agente evalúa su propia trayectoria y lo añade al contexto del siguiente intento." },
  { term: "trajectory", def: "Secuencia de (state, action, observation) que un agente recorre." },
  { term: "planning", def: "Descomponer el objetivo en sub-tareas. CoT, ToT, LLM+P." },

  // ─── Orquestación
  { term: "orquestador", def: "Sistema central que recibe el objetivo, lo descompone y reparte entre agentes especializados." },
  { term: "pipeline", def: "Patrón: agentes en cadena A→B→C. Cada uno pasa su salida al siguiente." },
  { term: "supervisor", def: "Patrón: orquestador central decide qué worker invocar en cada paso." },
  { term: "swarm", def: "Patrón descentralizado: agentes se transfieren control vía handoffs, sin orquestador central." },
  { term: "handoff", def: "Mecanismo por el cual un agente cede control a otro más adecuado." },

  // ─── Hardware
  { term: "GPU", def: "Graphics Processing Unit. Miles de núcleos simples para cómputo paralelo. Motor del deep learning." },
  { term: "TPU", def: "Tensor Processing Unit. ASIC de Google específico para matmuls. Usado en PaLM, Gemini." },
  { term: "FLOPS", def: "Floating-point Operations Per Second. Mide velocidad teórica de un chip. H100: 989 TFLOPS FP16 dense." },
  { term: "HBM", def: "High Bandwidth Memory. Memoria 3D apilada junto a la GPU. H100: 80GB a 3.35 TB/s." },
  { term: "FP16", def: "Half precision: 2 bytes. Rango limitado ±65504." },
  { term: "BF16", def: "Brain Float: 2 bytes. Mismo rango que FP32 pero menos precisión. Estándar en training." },
  { term: "FP32", def: "Single precision: 4 bytes. Máxima precisión para gradientes maestros." },
  { term: "mixed precision", def: "Entrenar en FP16/BF16 pero mantener copias FP32 para pesos maestros. 2-3x speedup." },
  { term: "roofline model", def: "Performance = min(peak_FLOPS, bandwidth × operational_intensity). Predice si eres compute o memory bound." },
  { term: "memory-bound", def: "Carga limitada por ancho de banda HBM, no por FLOPS. Típico en inference batch=1." },
  { term: "compute-bound", def: "Carga limitada por FLOPS, no por memoria. Típico en training batch grande." },

  // ─── Scaling
  { term: "scaling law", def: "La loss decae como power law con compute, parámetros y datos. No hay techo obvio." },
  { term: "Kaplan", def: "Kaplan 2020. Scaling law: parámetros importan más que datos. Resultado equivocado." },
  { term: "Chinchilla", def: "Hoffmann 2022. Compute-óptimo requiere ~20 tokens/parámetro. Kaplan undertrained." },
  { term: "emergent abilities", def: "Capacidades que aparecen súbitamente arriba de cierto umbral de escala. Debate abierto." },
  { term: "Bitter Lesson", def: "Sutton 2019: métodos generales que escalan con compute siempre ganan a ingeniería manual." },

  // ─── Modern
  { term: "MoE", def: "Mixture of Experts. Router selecciona top-k expertos por token. Mixtral 8x7B: 47B total, 13B activo." },
  { term: "LoRA", def: "Low-Rank Adaptation. ΔW = BA con r << d. Entrena <1% de parámetros. Estándar para fine-tune." },
  { term: "QLoRA", def: "LoRA sobre modelo cuantizado a 4 bits. Calidad de full FT con VRAM de GPU de consumidor." },
  { term: "quantization", def: "Reducir precisión: FP16 → INT8 → INT4. Llama-7B: 14GB → 4GB. Pérdida <1% en MMLU." },
  { term: "MMLU", def: "Massive Multitask Language Understanding. 57 materias académicas. Benchmark estándar." },
  { term: "PagedAttention", def: "Kernel de vLLM que pagina el KV cache como un SO. 2-4x throughput en inference." },
  { term: "vLLM", def: "Servidor de inference optimizado. PagedAttention + continuous batching." },
  { term: "perplexity", def: "exp(cross-entropy). Métrica de calidad de modelo de lenguaje. Más bajo = mejor." },

  // ─── Optimización
  { term: "Hessian", def: "Matriz de segundas derivadas parciales. Costo O(n³) — inviable para LLMs." },
  { term: "autodiff", def: "Diferenciación automática. Backprop = reverse-mode autodiff." },
];

const GLOSSARY_MAP: Map<string, GlossaryEntry> = (() => {
  const m = new Map<string, GlossaryEntry>();
  for (const entry of GLOBAL_GLOSSARY) {
    m.set(entry.term.toLowerCase(), entry);
    if (entry.aliases) {
      for (const alias of entry.aliases) {
        m.set(alias.toLowerCase(), entry);
      }
    }
  }
  return m;
})();

export function lookupGlossary(term: string): GlossaryEntry | undefined {
  return GLOSSARY_MAP.get(term.toLowerCase());
}

export const ALL_GLOSSARY_TERMS: string[] = (() => {
  const terms: string[] = [];
  for (const entry of GLOBAL_GLOSSARY) {
    terms.push(entry.term);
    if (entry.aliases) terms.push(...entry.aliases);
  }
  return terms.sort((a, b) => b.length - a.length);
})();
