export const REQUIRED_CONCEPT_GAME_IDS = [
  "math",
  "embed",
  "neuron",
  "backprop",
  "trans",
  "gen",
  "align",
  "rag",
  "agent",
  "orch",
] as const;

export type ConceptGameId = (typeof REQUIRED_CONCEPT_GAME_IDS)[number];

export interface ConceptGameRound {
  prompt: string;
  options: readonly string[];
  correct: number;
  explain: string;
}

export interface ConceptGameModule {
  title: string;
  instruction: string;
  rounds: readonly ConceptGameRound[];
}

export const CONCEPT_GAME_MODULES: Record<ConceptGameId, ConceptGameModule> = {
  math: {
    title: "Playground de Vectores",
    instruction: "Resuelve tres operaciones que aparecen dentro de una red neuronal.",
    rounds: [
      {
        prompt: "¿Cuánto vale el producto punto [1, 2] · [3, 4]?",
        options: ["7", "11", "14", "24"],
        correct: 1,
        explain: "1×3 + 2×4 = 3 + 8 = 11.",
      },
      {
        prompt: "Una matriz W de 3×2 multiplica un vector de tamaño 2. ¿Qué tamaño tiene la salida?",
        options: ["2", "2×3", "3", "6"],
        correct: 2,
        explain: "Cada una de las tres filas produce un número; la salida tiene tamaño 3.",
      },
      {
        prompt: "Si ∇L apunta hacia el mayor aumento de la pérdida, ¿qué actualización la reduce?",
        options: ["w ← w − η∇L", "w ← w + η∇L", "w ← ∇L", "w ← η/L"],
        correct: 0,
        explain: "Gradient descent avanza en dirección opuesta al gradiente.",
      },
    ],
  },
  embed: {
    title: "Constelación de Palabras",
    instruction: "Elige la relación geométrica que mejor representa cada significado.",
    rounds: [
      {
        prompt: "¿Qué par debería tener mayor similitud coseno?",
        options: ["gato · felino", "gato · hipoteca", "gato · kilómetro", "gato · oxígeno"],
        correct: 0,
        explain: "Los embeddings cercanos suelen representar conceptos semánticamente relacionados.",
      },
      {
        prompt: "Dos vectores apuntan casi en la misma dirección. Su coseno estará cerca de…",
        options: ["−1", "0", "0.5", "1"],
        correct: 3,
        explain: "Direcciones alineadas producen una similitud coseno próxima a 1.",
      },
      {
        prompt: "¿Qué operación permite buscar vecinos semánticos?",
        options: ["Ordenar por longitud del texto", "Comparar distancia entre embeddings", "Contar mayúsculas", "Cambiar el tokenizer"],
        correct: 1,
        explain: "La búsqueda vectorial compara distancias o similitudes en el espacio de embeddings.",
      },
    ],
  },
  neuron: {
    title: "Cablea la Neurona",
    instruction: "Construye una neurona seleccionando la operación correcta en cada etapa.",
    rounds: [
      {
        prompt: "Antes de la activación, una neurona calcula…",
        options: ["softmax(x)", "Σ(wᵢxᵢ) + b", "x² sin pesos", "solo el bias"],
        correct: 1,
        explain: "La preactivación es una suma ponderada de entradas más un sesgo.",
      },
      {
        prompt: "¿Qué salida produce ReLU para x = −3?",
        options: ["−3", "3", "0", "1"],
        correct: 2,
        explain: "ReLU(x) = max(0, x), por lo que anula valores negativos.",
      },
      {
        prompt: "¿Por qué una sola neurona lineal no resuelve XOR?",
        options: ["XOR no es linealmente separable", "Faltan tokens", "El bias siempre vale cero", "ReLU no admite binarios"],
        correct: 0,
        explain: "XOR requiere una frontera no lineal que puede construirse con capas ocultas.",
      },
    ],
  },
  backprop: {
    title: "Traza el Gradiente",
    instruction: "Sigue la señal de error desde la salida hasta los parámetros.",
    rounds: [
      {
        prompt: "¿En qué orden recorre backpropagation una red?",
        options: ["Entrada → salida", "Salida → capas anteriores", "En orden aleatorio", "Solo la capa central"],
        correct: 1,
        explain: "La regla de la cadena propaga derivadas desde la pérdida hacia atrás.",
      },
      {
        prompt: "Si ∂L/∂w es positivo, gradient descent normalmente…",
        options: ["aumenta w", "no cambia w", "reduce w", "elimina la capa"],
        correct: 2,
        explain: "La actualización w ← w − η∂L/∂w reduce el peso cuando el gradiente es positivo.",
      },
      {
        prompt: "¿Qué ayuda a que el gradiente fluya en redes profundas?",
        options: ["Conexiones residuales", "Eliminar activaciones", "Usar solo enteros", "Duplicar la pérdida"],
        correct: 0,
        explain: "Las rutas residuales facilitan el flujo de señal y gradiente entre capas.",
      },
    ],
  },
  trans: {
    title: "Arma el Transformer",
    instruction: "Reconstruye el pipeline que transforma tokens en logits.",
    rounds: [
      {
        prompt: "¿Qué ocurre inmediatamente después de tokenizar?",
        options: ["Se ejecuta una tool", "Los IDs se convierten en embeddings", "Se calcula RLHF", "Se borra la posición"],
        correct: 1,
        explain: "La tabla de embeddings transforma cada ID discreto en un vector.",
      },
      {
        prompt: "Dentro de un bloque Transformer, attention sirve para…",
        options: ["mezclar información entre posiciones", "comprimir el archivo", "actualizar el dataset", "limitar la API"],
        correct: 0,
        explain: "Self-attention permite que cada posición combine información de otras posiciones.",
      },
      {
        prompt: "¿Qué capa convierte el estado final en puntuaciones del vocabulario?",
        options: ["KV cache", "Projection / LM head", "Tokenizer", "Reward model"],
        correct: 1,
        explain: "El LM head proyecta el estado oculto a un logit por token del vocabulario.",
      },
    ],
  },
  gen: {
    title: "Predice el Token",
    instruction: "Ajusta mentalmente la estrategia de muestreo para cada situación.",
    rounds: [
      {
        prompt: "Para una respuesta determinista, ¿qué estrategia elegirías?",
        options: ["Greedy / temperatura muy baja", "Temperatura 2", "Top-p 1 con alta temperatura", "Tokens aleatorios"],
        correct: 0,
        explain: "Elegir siempre el token más probable reduce la variabilidad.",
      },
      {
        prompt: "Subir la temperatura normalmente hace la distribución…",
        options: ["más concentrada", "más plana y diversa", "idéntica", "binaria"],
        correct: 1,
        explain: "Una temperatura mayor reparte probabilidad entre más candidatos.",
      },
      {
        prompt: "Top-p conserva…",
        options: ["exactamente p tokens", "tokens hasta acumular probabilidad p", "solo el token más largo", "todo el vocabulario siempre"],
        correct: 1,
        explain: "Nucleus sampling usa el conjunto mínimo cuya probabilidad acumulada alcanza p.",
      },
    ],
  },
  align: {
    title: "Ordena el Alignment",
    instruction: "Selecciona la etapa de post-training adecuada para cada objetivo.",
    rounds: [
      {
        prompt: "Quieres enseñar formato y seguimiento de instrucciones con ejemplos ideales.",
        options: ["SFT", "Pre-tokenización", "KV cache", "Quantization"],
        correct: 0,
        explain: "Supervised fine-tuning aprende directamente de pares instrucción-respuesta.",
      },
      {
        prompt: "Tienes pares de respuestas preferida y rechazada. ¿Qué técnica encaja?",
        options: ["RAG", "DPO", "Distillation de logits únicamente", "Batching"],
        correct: 1,
        explain: "DPO aprende de comparaciones de preferencia sin entrenar primero un reward model separado.",
      },
      {
        prompt: "¿Qué debe acompañar cualquier cambio de alignment?",
        options: ["Más colores de UI", "Evaluaciones de utilidad y seguridad", "Menos casos adversariales", "Eliminar el modelo base"],
        correct: 1,
        explain: "Las evaluaciones detectan regresiones, sobreajuste y comportamientos inseguros.",
      },
    ],
  },
  rag: {
    title: "Caza Documentos",
    instruction: "Construye una respuesta respaldada por fuentes recuperadas.",
    rounds: [
      {
        prompt: "¿Cuál es el orden básico de un sistema RAG?",
        options: ["Generar → borrar → indexar", "Consultar → recuperar → generar", "Entrenar → cuantizar → tokenizar", "Cachear → alinear → evaluar"],
        correct: 1,
        explain: "La consulta recupera contexto relevante antes de generar la respuesta.",
      },
      {
        prompt: "Chunks demasiado grandes suelen…",
        options: ["aumentar ruido y costo de contexto", "mejorar siempre la precisión", "eliminar embeddings", "evitar toda alucinación"],
        correct: 0,
        explain: "Un chunk grande puede mezclar temas y consumir contexto innecesario.",
      },
      {
        prompt: "Si ningún documento respalda la respuesta, el sistema debería…",
        options: ["inventar una cita", "declarar incertidumbre o no responder", "duplicar el prompt", "ocultar las fuentes"],
        correct: 1,
        explain: "La abstención explícita es preferible a generar una afirmación sin evidencia.",
      },
    ],
  },
  agent: {
    title: "Guía al Agente",
    instruction: "Mantén el loop del agente útil, verificable y bajo control.",
    rounds: [
      {
        prompt: "Después de ejecutar una herramienta, el agente recibe…",
        options: ["una observation", "nuevos pesos", "otro tokenizer", "un checkpoint"],
        correct: 0,
        explain: "La observación vuelve al loop para decidir el siguiente paso.",
      },
      {
        prompt: "¿Dónde deben validarse permisos y argumentos de una tool?",
        options: ["Solo dentro del prompt", "En el runtime antes de ejecutar", "Después de publicar", "En el tokenizer"],
        correct: 1,
        explain: "El runtime aplica controles deterministas fuera del modelo.",
      },
      {
        prompt: "¿Qué evita un loop infinito?",
        options: ["Un límite de pasos y condición de salida", "Más temperatura", "Más herramientas", "Ocultar errores"],
        correct: 0,
        explain: "Los presupuestos de pasos, tiempo y costo garantizan terminación controlada.",
      },
    ],
  },
  orch: {
    title: "Director de Orquesta",
    instruction: "Asigna trabajo a varios agentes sin perder control del resultado.",
    rounds: [
      {
        prompt: "Dos tareas no comparten dependencias. ¿Cómo reducir latencia?",
        options: ["Ejecutarlas en paralelo", "Ejecutarlas dos veces", "Usar un solo agente", "Esperar entre ambas"],
        correct: 0,
        explain: "Las tareas independientes pueden resolverse simultáneamente.",
      },
      {
        prompt: "¿Qué debe definir una delegación clara?",
        options: ["Solo el nombre del agente", "Objetivo, entradas y criterio de salida", "Una conversación ilimitada", "Acceso total por defecto"],
        correct: 1,
        explain: "Un contrato explícito reduce duplicación, ambigüedad y resultados incompatibles.",
      },
      {
        prompt: "Antes de combinar respuestas de varios agentes conviene…",
        options: ["publicarlas sin leer", "validar conflictos y evidencia", "eliminar las fuentes", "elegir la más larga"],
        correct: 1,
        explain: "La síntesis debe resolver contradicciones y verificar que cada salida cumpla su contrato.",
      },
    ],
  },
};
