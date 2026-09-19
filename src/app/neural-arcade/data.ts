import type { LevelMeta } from "./types";

// ═══════════════════════════════════════════════════════════
// NEURAL ARCADE — Currículo completo de IA — edición 2026
//
// Estructura pedagógica: cada nivel sigue la taxonomía de Bloom
// (Recordar → Comprender → Aplicar → Analizar → Crear/Evaluar)
// mapeada a 5 fases: Teoría → Demo → Práctica → Reto → Maestría.
//
// Teoría: 4 bloques progresivos (Básico → Experto)
// Cada bloque incluye definición formal, fórmula, ejemplo.
// ═══════════════════════════════════════════════════════════

export const LEVELS: LevelMeta[] = [
  // ───────────────────────────────────────────────────────
  // NIVEL 1 — TOKENS
  // ───────────────────────────────────────────────────────
  {
    id: "tokens",
    index: 0,
    title: "TOKENS",
    icon: "🔤",
    color: "#22d3ee",
    tag: "Arma palabras y empaca mensajes",
    summary: "Juega con las piezas de un mensaje: descubre cómo una máquina separa, etiqueta y guarda texto.",
    estimatedMin: 6,
    concepts: ["Token", "Vocabulario", "Token ID", "Ventana de contexto"],
    paperRef: { title: "Neural Machine Translation of Rare Words with Subword Units", year: 2015, authors: "Sennrich, Haddow, Birch" },
    glossary: [
      { term: "Token", definition: "Pieza de texto que procesa un modelo. En nuestro juego, «el», «gato» y «duerme» son tres fichas; en un modelo real, un token también puede ser parte de una palabra o un signo." },
      { term: "Vocabulario", definition: "Conjunto de piezas disponibles, cada una con una etiqueta numérica. En el juego usamos «rob», «ot» e «ito» para construir «robotito»; esas piezas son un ejemplo inventado." },
      { term: "Token ID", definition: "Etiqueta numérica de un token. En nuestro diccionario, «hola» es 7 y «robot» es 42: son identificadores, no cantidades ni importancia." },
      { term: "Ventana de contexto", definition: "Límite de tokens que un modelo puede tener disponibles a la vez. En este robot de práctica caben 6 piezas; los límites reales dependen del modelo." },
      { term: "Tokenizador", definition: "Programa que separa un texto en piezas y busca sus etiquetas numéricas. Distintos tokenizadores pueden partir la misma palabra de maneras diferentes." },
    ],
    theory: [
      {
        title: "Un mensaje hecho de piezas",
        level: "Básico",
        body: "En el rompecabezas «el gato duerme» usamos tres fichas: «el», «gato» y «duerme». Cada ficha representa un **token**, una pieza de texto que una máquina puede procesar.\n\nEl programa que separa el texto se llama **tokenizador**. En este ejemplo de juguete cada palabra es una ficha; un modelo real puede usar otras piezas y también tiene que representar los espacios.",
        formula: "\\text{el gato duerme} \\rightarrow [\\text{el}, \\text{gato}, \\text{duerme}]",
        formulaExplain: "En este rompecabezas contamos 3 fichas y las mantenemos en el orden de la frase. Esa cuenta pertenece al juego: un tokenizador real puede dividir las palabras o agrupar los espacios con ellas.",
      },
      {
        title: "Una palabra puede necesitar varias fichas",
        level: "Básico",
        body: "Nuestra caja tiene las fichas «rob», «ot» e «ito», pero no una ficha completa para «robotito». Puedes unir las tres en orden y recuperar la palabra: rob + ot + ito = robotito.\n\nEsta idea permite representar palabras con piezas más pequeñas. La caja de piezas disponibles se llama **vocabulario**; la división de este juego es inventada y no indica cómo todos los modelos separan «robotito».",
        formula: "[\\text{rob}, \\text{ot}, \\text{ito}] \\rightarrow \\text{robotito}",
        formulaExplain: "Las tres fichas forman una sola palabra, así que contar palabras no basta para contar tokens. Lo que cuenta es cuántas piezas produce el tokenizador que estés usando.",
      },
      {
        title: "Un número que funciona como etiqueta",
        level: "Básico",
        body: "Nuestro diccionario dice «hola» → 7 y «robot» → 42. Al enviar «hola robot hola», cambiamos cada pieza por su etiqueta y obtenemos [7, 42, 7].\n\nLa etiqueta se llama **Token ID**: identifica una pieza, como el número de un casillero. Repetir «hola» repite el 7; el 42 no hace a «robot» más importante. Estos números son inventados y cada vocabulario tiene los suyos.",
        formula: "[\\text{hola}, \\text{robot}, \\text{hola}] \\rightarrow [7, 42, 7]",
        formulaExplain: "Busca cada pieza en la misma tabla y conserva su orden. Si consultas la tabla al revés, 7 recupera «hola» y 42 recupera «robot». La etiqueta permite buscar la pieza, pero no describe su significado.",
      },
      {
        title: "El mensaje debe caber en la mochila",
        level: "Básico",
        body: "Imagina una mochila con espacio para 6 fichas: un mensaje de 4 tokens deja 2 lugares libres. Si agregas 3 fichas más, ya no cabe completo y tendrás que acortarlo.\n\nLa **ventana de contexto** es un límite de tokens que el modelo puede usar en una interacción, no una memoria permanente. Nuestra mochila es una simplificación: en un modelo real también cuentan las instrucciones, la conversación incluida y el espacio necesario para responder.",
        formula: "6 \\text{ lugares} - 4 \\text{ piezas} = 2 \\text{ libres}",
        formulaExplain: "Cada pieza ocupa un lugar en esta mochila de práctica. En un servicio real, el límite depende del modelo y un mensaje demasiado largo puede rechazarse o recortarse; no siempre se borra automáticamente lo más antiguo.",
      },
    ],
  },

  // ───────────────────────────────────────────────────────
  // NIVEL 2 — EMBEDDINGS
  // ───────────────────────────────────────────────────────
  {
    id: "embed",
    index: 1,
    title: "EMBEDDINGS",
    icon: "🌌",
    color: "#a78bfa",
    tag: "Semántica como geometría",
    summary: "Tokens convertidos en vectores donde el significado se vuelve distancia.",
    estimatedMin: 15,
    concepts: ["Vector de embedding", "Dimensión d", "Similitud coseno", "Word2vec", "Aritmética de vectores", "Espacio latente"],
    paperRef: { title: "Efficient Estimation of Word Representations in Vector Space", year: 2013, authors: "Mikolov et al." },
    glossary: [
      { term: "Embedding", definition: "Vector numérico de dimensión fija (d) que representa un token o secuencia en un espacio donde cercanía ≈ similitud semántica." },
      { term: "Dimensión (d)", definition: "Tamaño del vector. Típicamente entre 256 (modelos pequeños) y 12,288 (GPT-3 175B)." },
      { term: "Similitud coseno", definition: "Mide el ángulo entre dos vectores. 1 = idéntica dirección, 0 = ortogonales, -1 = opuestos." },
      { term: "Espacio latente", definition: "El espacio ℝ^d donde viven los embeddings. Sus dimensiones codifican factores semánticos latentes aprendidos durante el entrenamiento." },
    ],
    theory: [
      {
        title: "Por qué necesitamos vectores",
        level: "Básico",
        body: "Un token ID (ej. 4521) es un entero sin significado: el ID 4522 no es 'más similar' a 4521 que el ID 5. Para que la red neuronal aprenda relaciones semánticas, mapeamos cada ID a un vector de d números reales: **e_token ∈ ℝ^d**.\n\nEstos vectores se inicializan al azar y se ajustan durante el entrenamiento. Tras millones de ejemplos, el modelo descubre que 'perro' y 'gato' terminan cerca, y 'perro' y 'taco' lejos.",
      },
      {
        title: "Similitud coseno — la métrica reina",
        level: "Intermedio",
        body: "Para comparar dos embeddings usamos el coseno del ángulo entre ellos. Es invariante a la magnitud del vector y muy eficiente de computar.",
        formula: "\\cos(\\theta) = \\frac{A \\cdot B}{\\|A\\| \\cdot \\|B\\|} = \\frac{\\sum_i A_i B_i}{\\sqrt{\\sum_i A_i^2} \\cdot \\sqrt{\\sum_i B_i^2}}",
        formulaExplain: "El numerador es el producto punto (cuánto alineados están). El denominador normaliza por las magnitudes, así el resultado está en [-1, 1]. En NLP casi siempre ignoramos el signo y usamos valores en [0, 1].",
      },
      {
        title: "Word2vec y la famosa analogía Rey − Hombre + Mujer ≈ Reina",
        level: "Avanzado",
        body: "Mikolov (2013) entrenó embeddings con dos arquitecturas: **CBOW** (predice el token central a partir del contexto) y **Skip-gram** (predice el contexto a partir del token central). El resultado: el espacio latente captura relaciones lineales.\n\nOperaciones vectoriales tienen sentido semántico:",
        formula: "\\vec{rey} - \\vec{hombre} + \\vec{mujer} \\approx \\vec{reina}",
        formulaExplain: "El vector diferencia 'rey - hombre' captura el concepto 'realeza'. Al sumárselo a 'mujer' obtenemos la 'reina'. Esto demostró que los embeddings codifican relaciones de género, plural, tiempo verbal, geografía, etc.",
      },
      {
        title: "Embeddings posicionales — el orden importa",
        level: "Experto",
        body: "Los embeddings de token son idénticos sin importar dónde aparezca el token. Pero 'perro muerde hombre' ≠ 'hombre muerde perro'. La solución es **sumar** al embedding del token otro vector, el **positional encoding**, que codifica la posición.\n\nLa forma original (Vaswani 2017) usa seno y coseno de frecuencias decrecientes:",
        formula: "PE_{(pos,2i)} = \\sin(pos / 10000^{2i/d}), \\quad PE_{(pos,2i+1)} = \\cos(pos / 10000^{2i/d})",
        formulaExplain: "Cada dimensión del embedding posicional es un seno/coseno con frecuencia distinta. El modelo puede aprender a atender por desfase relativo porque PE(pos+k) es una función lineal de PE(pos). Modelos modernos (GPT-NeoX, LLaMA) usan RoPE (Rotary Position Embedding) que aplica una rotación al embedding según la posición.",
      },
    ],
  },

  // ───────────────────────────────────────────────────────
  // NIVEL 3 — NEURONAS
  // ───────────────────────────────────────────────────────
  {
    id: "neuron",
    index: 2,
    title: "NEURONAS",
    icon: "⚡",
    color: "#fbbf24",
    tag: "El átomo del aprendizaje",
    summary: "Una neurona artificial: pesos, sesgo y función de activación.",
    estimatedMin: 14,
    concepts: ["Perceptrón", "Pesos (w)", "Sesgo (b)", "Función de activación", "ReLU", "Sigmoide", "Forward pass"],
    paperRef: { title: "A Logical Calculus of Ideas Immanent in Nervous Activity", year: 1943, authors: "McCulloch & Pitts" },
    glossary: [
      { term: "Neurona artificial", definition: "Unidad que calcula la suma ponderada de sus entradas, le suma un sesgo, y aplica una función no lineal (activación)." },
      { term: "Pesos (w)", symbol: "w", definition: "Vector de coeficientes reales que determina la importancia de cada entrada. Son los parámetros que se aprenden." },
      { term: "Sesgo (b)", symbol: "b", definition: "Constante real que desplaza la activación. Permite que la neurona se 'encienda' aun con entradas cero." },
      { term: "ReLU", definition: "Rectified Linear Unit. f(x) = max(0, x). Es la activación estándar en redes profundas por su simplicidad y buen gradiente." },
      { term: "Sigmoide", definition: "f(x) = 1/(1+e^{-x}). Comprime valores a (0,1). Útil para salida binaria pero sufre vanishing gradient en profundidad." },
    ],
    theory: [
      {
        title: "La neurona como función lineal + activación",
        level: "Básico",
        body: "Una neurona recibe n entradas x₁, x₂, ..., xₙ. Cada una tiene un peso wᵢ. Suma todo, le suma un sesgo b, y pasa el resultado por una función de activación no lineal f.",
        formula: "y = f\\left( \\sum_{i=1}^{n} w_i x_i + b \\right) = f(W \\cdot x + b)",
        formulaExplain: "W·x es el producto punto entre el vector de pesos y el vector de entradas. f introduce no linealidad: sin ella, una red de N capas colapsa matemáticamente en una sola transformación lineal.",
      },
      {
        title: "Funciones de activación — menú estándar",
        level: "Intermedio",
        body: "La elección de f define el comportamiento:\n\n• **Sigmoide** σ(x) = 1/(1+e^{-x}) — salida en (0,1), sufre saturación.\n• **Tanh** tanh(x) — salida en (-1,1), mejor centrada.\n• **ReLU** max(0,x) — simple, gradientes limpios, estándar en hidden layers.\n• **GELU** x · Φ(x) — suave, usada en BERT y GPT. Combina lo mejor de ReLU y sigmoide.\n• **Softmax** — para clasificación final, produce distribución de probabilidad.",
        formula: "\\text{GELU}(x) = x \\cdot \\Phi(x) = x \\cdot \\frac{1}{2}\\left[1 + \\text{erf}(x/\\sqrt{2})\\right]",
        formulaExplain: "Φ(x) es la CDF de una normal estándar. GELU multiplica la entrada por la probabilidad de que sea positiva. Pequeña, suave, domina en transformers modernos.",
      },
      {
        title: "Capas y arquitectura MLP",
        level: "Avanzado",
        body: "Una **capa densa** (fully connected) apila m neuronas que comparten las mismas entradas pero tienen pesos distintos. Una **red neuronal** (MLP, Multi-Layer Perceptron) apila L capas:\n\nh₁ = f(W₁x + b₁)\nh₂ = f(W₂h₁ + b₂)\n...\ny = g(W_L h_{L-1} + b_L)\n\nSin función de activación entre capas, todo el stack es equivalente a una sola transformación lineal y = (W_L·...·W₁)x. La no linealidad es lo que da expresividad universal.",
      },
      {
        title: "Teorema de aproximación universal",
        level: "Experto",
        body: "Cybenko (1989) y Hornik (1991) demostraron que una red con una sola capa oculta suficientemente ancha puede aproximar cualquier función continua en un compacto. La profundidad es más eficiente: muchas capas estrechas representan ciertas funciones con exponencialmente menos neuronas que una capa ancha.\n\nEsto justifica la **deep learning**: profundidad ≠ más parámetros, profundidad = composición jerárquica de abstracciones.",
      },
    ],
  },

  // ───────────────────────────────────────────────────────
  // NIVEL 4 — RED NEURONAL Y BACKPROPAGATION
  // ───────────────────────────────────────────────────────
  {
    id: "backprop",
    index: 3,
    title: "BACKPROPAGATION",
    icon: "🔄",
    color: "#fb7185",
    tag: "Cómo aprende una red",
    summary: "El algoritmo que distribuye el error a través de millones de pesos.",
    estimatedMin: 18,
    concepts: ["Forward pass", "Función de pérdida", "Gradiente", "Regla de la cadena", "Backpropagation", "Vanishing gradient"],
    paperRef: { title: "Learning representations by back-propagating errors", year: 1986, authors: "Rumelhart, Hinton, Williams" },
    glossary: [
      { term: "Forward pass", definition: "Calcular la salida de la red dada una entrada. Propagación hacia adelante." },
      { term: "Loss (L)", definition: "Función de pérdida. Mide cuánto se equivoca la red. Ej: MSE para regresión, cross-entropy para clasificación." },
      { term: "Gradiente (∇L)", definition: "Vector de derivadas parciales de L respecto a cada parámetro. Apunta en la dirección de máximo incremento del error." },
      { term: "Backpropagation", definition: "Algoritmo que usa la regla de la cadena para calcular eficientemente todos los gradientes en una red profunda, recorriéndola al revés." },
      { term: "Vanishing gradient", definition: "En redes profundas con sigmoide, los gradientes se multiplican por <1 al retropropagar, exponenciándose a cero. Solución: ReLU + skip connections." },
    ],
    theory: [
      {
        title: "El problema: ajustar pesos para reducir el error",
        level: "Básico",
        body: "Tras un forward pass obtenemos una predicción ŷ. La comparamos con la verdad y usando una función de pérdida L(ŷ, y). El objetivo del entrenamiento es **minimizar** el promedio de L sobre todos los ejemplos.\n\nPara ajustar los pesos, necesitamos saber: 'si cambio este peso un poco, ¿cómo cambia el error?'. Esa derivada es el gradiente.",
      },
      {
        title: "Cross-entropy — la pérdida estándar en LLMs",
        level: "Intermedio",
        body: "En clasificación y modelado de lenguaje, cada ejemplo tiene una distribución verdadera y (one-hot) y una predicha ŷ (softmax). Cross-entropy mide la divergencia:",
        formula: "L_{CE} = -\\sum_{i=1}^{C} y_i \\log(\\hat{y}_i)",
        formulaExplain: "Como y es one-hot (un solo 1, el resto 0), solo sobrevive el término correspondiente a la clase correcta: L = -log(ŷ_correcta). Minimizar esto es maximizar la probabilidad asignada a la clase correcta. En LLMs, C = vocabulario (~50k).",
      },
      {
        title: "La regla de la cadena — el motor de backprop",
        level: "Avanzado",
        body: "Si z = f(g(x)) y queremos dz/dx, la regla de la cadena dice: dz/dx = (dz/dg)·(dg/dx). En una red, cada capa es una función compuesta. Backpropagation aplica esta regla desde la salida hasta la entrada.",
        formula: "\\frac{\\partial L}{\\partial w^{(l)}_{ij}} = \\frac{\\partial L}{\\partial z^{(l)}_j} \\cdot \\frac{\\partial z^{(l)}_j}{\\partial w^{(l)}_{ij}}",
        formulaExplain: "El primer factor (error signal δ) se propaga hacia atrás desde la capa L. El segundo es local: depende solo de la entrada a esa neurona. Backprop evita recalcular desde cero para cada peso compartiendo los δ.",
      },
      {
        title: "Vanishing/exploding gradient — y cómo se resuelve",
        level: "Experto",
        body: "Al retropropagar a través de L capas, el gradiente se multiplica por derivadas parciales en cada paso. Si |∂L/∂z| < 1 típicamente (caso sigmoide), el gradiente decae exponencialmente: las capas tempranas no aprenden. Si > 1, explota.\n\nSoluciones modernas:\n• **ReLU** — derivada 0 o 1, no decae.\n• **Residual connections** (ResNet, transformer) — suman h(x) + F(x), dando al gradiente un atajo de derivada 1.\n• **LayerNorm** — normaliza activaciones para mantener magnitudes estables.\n• **Gradient clipping** — limita la norma del gradiente a un máximo.",
      },
    ],
  },

  // ───────────────────────────────────────────────────────
  // NIVEL 5 — ENTRENAMIENTO (OPTIMIZACIÓN)
  // ───────────────────────────────────────────────────────
  {
    id: "grad",
    index: 4,
    title: "ENTRENAMIENTO",
    icon: "⛰️",
    color: "#fb7185",
    tag: "Bajando la montaña del error",
    summary: "Gradient descent, learning rate, Adam: cómo se ajustan millones de pesos.",
    estimatedMin: 16,
    concepts: ["Gradient Descent", "Learning rate", "Batch / Mini-batch", "Momentum", "Adam", "Weight decay"],
    paperRef: { title: "Adam: A Method for Stochastic Optimization", year: 2014, authors: "Kingma & Ba" },
    glossary: [
      { term: "Gradient Descent", definition: "Algoritmo iterativo: w ← w - η · ∇L. En cada paso, mueve los pesos en dirección opuesta al gradiente." },
      { term: "Learning rate (η)", definition: "Tamaño del paso. Pequeño = convergencia lenta pero estable. Grande = rápido pero puede divergir." },
      { term: "Mini-batch", definition: "Subconjunto de ejemplos usado para estimar el gradiente en cada paso. Típicamente 32-2048." },
      { term: "Momentum", definition: "Acumula gradientes pasados para suavizar la trayectoria y acelerar convergencia en direcciones consistentes." },
      { term: "Adam", definition: "Adaptive Moment Estimation. Combina momentum (1er momento) y RMSProp (2do momento) con corrección de bias. Estándar de facto." },
    ],
    theory: [
      {
        title: "Gradient Descent — la metáfora de la montaña",
        level: "Básico",
        body: "Imagina que estás ciego en una montaña y quieres llegar al valle. Tocas el suelo con el pie para sentir la pendiente, y das un paso cuesta abajo. La magnitud del paso es proporcional a la pendiente y al 'learning rate'.\n\nMatemáticamente, queremos el mínimo de la función de pérdida L(w) donde w son todos los parámetros del modelo.",
        formula: "w_{t+1} = w_t - \\eta \\cdot \\nabla_w L(w_t)",
        formulaExplain: "η es el learning rate. Demasiado pequeño: tardas eternidades. Demasiado grande: rebotas y diverges. En la práctica se usan esquemas como cosine annealing: empezar alto y decrecer cosine.",
      },
      {
        title: "SGD, Mini-batch y Stochastic Gradient Descent",
        level: "Intermedio",
        body: "Calcular L sobre todo el dataset es carísimo. SGD estima el gradiente con un **mini-batch** de m ejemplos. La esperanza del gradiente del mini-batch es igual al gradiente verdadero, pero con ruido. Ese ruido ayuda a escapar de mínimos locales pobres.",
        formula: "\\hat{\\nabla} L = \\frac{1}{m} \\sum_{i=1}^{m} \\nabla L(x_i, y_i)",
        formulaExplain: "Entre más pequeño el batch, más ruidoso el gradiente y más lento por paso, pero más barato por ejemplo. Batch=1 (SGD puro) es el extremo. Tamaños típicos en LLMs: 256k-4M tokens por paso.",
      },
      {
        title: "Momentum y RMSProp — suavizando la trayectoria",
        level: "Avanzado",
        body: "Plain SGD oscila en direcciones de alta curvatura. Momentum acumula un promedio exponencial del gradiente para suavizar. RMSProp normaliza por la magnitud del gradiente reciente, lo que adapta el paso por dimensión.",
        formula: "m_t = \\beta_1 m_{t-1} + (1-\\beta_1) g_t \\qquad v_t = \\beta_2 v_{t-1} + (1-\\beta_2) g_t^2",
        formulaExplain: "m_t (1er momento) es el promedio del gradiente. v_t (2do momento) es el promedio de los gradientes al cuadrado. Adam los combina: el paso es proporcional a m_t / √v_t. β₁=0.9, β₂=0.999 son defaults universales.",
      },
      {
        title: "Adam, weight decay y cosine schedule — el stack moderno",
        level: "Experto",
        body: "AdamW es el optimizador estándar para LLMs. Separa weight decay del gradiente (corrigiendo un bug de Adam+L2). El **schedule** del learning rate suele ser cosine: empieza en η_max, decae cosine hasta η_min · η_max.\n\nReglas prácticas:\n• Warmup: aumentar η linealmente de 0 a η_max en los primeros N pasos (evita inestabilidad temprana).\n• η_max para un LLM de 7B: ~3e-4. Para 70B: ~1.5e-4.\n• Batch size y η se escalan aproximadamente linealmente (regla de scaling).",
        formula: "\\eta_t = \\eta_{min} + \\frac{1}{2}(\\eta_{max} - \\eta_{min})\\left(1 + \\cos\\left(\\frac{t \\pi}{T}\\right)\\right)",
        formulaExplain: "T es el total de pasos. El cosine decay baja suavemente al inicio y al final, dando más tiempo en el régimen estable. Es estándar en LLaMA, GPT, Claude.",
      },
    ],
  },

  // ───────────────────────────────────────────────────────
  // NIVEL 6 — ATENCIÓN
  // ───────────────────────────────────────────────────────
  {
    id: "attn",
    index: 5,
    title: "ATENCIÓN",
    icon: "👁️",
    color: "#34d399",
    tag: "La fórmula que lo cambió todo",
    summary: "Scaled Dot-Product Attention y Multi-Head Attention.",
    estimatedMin: 20,
    concepts: ["Query", "Key", "Value", "Scaled Dot-Product", "Softmax", "Multi-Head Attention", "Causal mask"],
    paperRef: { title: "Attention Is All You Need", year: 2017, authors: "Vaswani et al. (Google Brain)" },
    glossary: [
      { term: "Query (Q)", definition: "Vector que pregunta: \"¿qué información necesito?\"" },
      { term: "Key (K)", definition: "Vector que anuncia: 'esto es lo que yo ofrezco'. Es lo que compara la query." },
      { term: "Value (V)", definition: "Vector con el contenido que se transfiere si la query y la key coinciden." },
      { term: "Softmax", definition: "Función que convierte un vector de scores en una distribución de probabilidad (suma 1). Suaviza y normaliza." },
      { term: "Multi-Head Attention", definition: "Ejecutar h atenciones en paralelo sobre proyecciones distintas del input. Permite que el modelo atienda a diferentes relaciones simultáneamente." },
      { term: "Causal mask", definition: "Matriz triangular que impide que un token atienda a tokens futuros. Esencial para autoregresión." },
    ],
    theory: [
      {
        title: "La intuición: buscar en un diccionario difuso",
        level: "Básico",
        body: "En un diccionario normal, buscas por clave exacta: dict['gato'] → definición. En atención, buscas con una **query** que puede coincidir parcialmente con varias **keys**. El resultado es un **promedio ponderado** de los **values** correspondientes, donde el peso es la similitud query-key.\n\nCada token emite su propia query, key y value (proyectados por matrices W^Q, W^K, W^V). Así, cada posición puede 'mirar' a las demás y decidir cuáles importan.",
      },
      {
        title: "Scaled Dot-Product Attention — la fórmula sagrada",
        level: "Intermedio",
        body: "Esta es la ecuación del paper Attention Is All You Need, línea por línea:",
        formula: "\\text{Attention}(Q,K,V) = \\text{softmax}\\left(\\frac{Q K^{\\top}}{\\sqrt{d_k}}\\right) V",
        formulaExplain: "Q Kᵀ es una matriz de similitudes (producto punto) entre cada query y cada key. √d_k escala para mantener varianza estable (sin esto, softmax satura con d_k grande). Softmax convierte cada fila en una distribución. Multiplicar por V da el promedio ponderado de values.",
      },
      {
        title: "Multi-Head Attention — atención paralela",
        level: "Avanzado",
        body: "Una sola atención es limitada: solo puede capturar un tipo de relación por capa. Multi-head divide el espacio de embedding en h sub-espacios (heads), cada uno con sus propias W^Q, W^K, W^V, calcula atención independiente y concatena los resultados.",
        formula: "\\text{head}_i = \\text{Attention}(Q W_i^Q, K W_i^K, V W_i^V)",
        formulaExplain: "Cada head aprende a atender a un tipo distinto de relación: sintáctica (sujeto-verbo), semántica (sinónimos), posicional (adyacente), etc. Típicamente h=8, 16, 32 o 64. La dimensión por head d_k = d_model / h.",
      },
      {
        title: "Atención causal y complejidad cuadrática",
        level: "Experto",
        body: "En generación autoregresiva, el token t no puede atender al t+1 (no se conoce aún). Se aplica una **causal mask**: la mitad superior de QKᵀ se rellena con -∞, de modo que softmax dé 0 allí.\n\nEl costo de attention es **O(n² · d)** en tiempo y memoria, donde n es la longitud de la secuencia. Para n=128k tokens, la matriz de atención de un head consume 64 GB. Soluciones: Flash Attention (reordena el cómputo sin materializar la matriz), Sparse Attention, Sliding Window Attention (Mistral), Ring Attention (distribuida).",
      },
    ],
  },

  // ───────────────────────────────────────────────────────
  // NIVEL 7 — TRANSFORMER
  // ───────────────────────────────────────────────────────
  {
    id: "trans",
    index: 6,
    title: "TRANSFORMER",
    icon: "🏗️",
    color: "#f472b6",
    tag: "La arquitectura de GPT y Claude",
    summary: "Bloques residuales, LayerNorm, FFN: cómo se ensambla el modelo completo.",
    estimatedMin: 22,
    concepts: ["Encoder/Decoder", "Bloque transformer", "FFN", "LayerNorm", "Residual connection", "Stacking", "Pre-norm vs Post-norm"],
    paperRef: { title: "Attention Is All You Need", year: 2017, authors: "Vaswani et al. (Google Brain)" },
    glossary: [
      { term: "Bloque transformer", definition: "Unidad que combina Multi-Head Attention + Feed-Forward Network con conexiones residuales y LayerNorm. Un LLM apila N bloques (ej. GPT-3: 96)." },
      { term: "FFN", definition: "Feed-Forward Network. MLP de 2 capas aplicada independientemente a cada posición. Típicamente expande d_model → 4·d_model → d_model." },
      { term: "LayerNorm", definition: "Normaliza las activaciones de una capa a media 0 varianza 1 por token. Estabiliza entrenamiento profundo." },
      { term: "Residual connection", definition: "Suma la entrada a la salida de un sub-bloque: x + Sublayer(x). Da al gradiente un atajo de derivada 1." },
      { term: "Pre-norm", definition: "Aplicar LayerNorm antes del sub-bloque en lugar de después. Estándar moderno (GPT-2+) por ser más estable." },
    ],
    theory: [
      {
        title: "El bloque transformer — receta modular",
        level: "Básico",
        body: "Un bloque transformer tiene dos sub-módulos: **Multi-Head Self-Attention** y **Feed-Forward Network**. Cada uno va envuelto en una conexión residual y un LayerNorm. Apilar N de estos bloques da un LLM.\n\nLa entrada y la salida de cada bloque tienen la misma dimensión d_model, lo que permite apilar arbitrariamente.",
      },
      {
        title: "FFN — la 'memoria' del transformer",
        level: "Intermedio",
        body: "La FFN es un MLP aplicado a cada posición independientemente. Típicamente:",
        formula: "\\text{FFN}(x) = \\text{GELU}(x W_1 + b_1) W_2 + b_2",
        formulaExplain: "W₁ proyecta de d_model a 4·d_model (expansión). W₂ regresa a d_model. GELU introduce no linealidad. Aunque attention se lleva la fama, ~2/3 de los parámetros del modelo están en las FFN. Se ha demostrado que las FFN actúan como memorias direccionables por clave-valor (Geva et al. 2020).",
      },
      {
        title: "Pre-norm vs Post-norm",
        level: "Avanzado",
        body: "El paper original usaba **post-norm**: LayerNorm(Sublayer(x) + x). Es inestable en profundidad. GPT-2 introdujo **pre-norm**: x + Sublayer(LayerNorm(x)). Esto preserva el flujo del gradiente a través del residual path sin pasar por LayerNorm.\n\nLa diferencia parece menor pero permite entrenar modelos de 100+ capas. LLaMA, GPT-4, Claude usan pre-norm. Algunos modelos añaden también una LayerNorm final (RMSNorm) antes del embedding de salida.",
      },
      {
        title: "RMSNorm y SwiGLU — variantes modernas",
        level: "Experto",
        body: "LLaMA reemplazó LayerNorm por **RMSNorm**: omite el re-centering (restar la media), solo normaliza por la RMS. Es ~10-50% más rápido y equivalente en calidad.",
        formula: "\\text{RMSNorm}(x_i) = \\frac{x_i}{\\sqrt{\\frac{1}{d}\\sum_j x_j^2 + \\epsilon}} \\cdot \\gamma_i",
        formulaExplain: "γ es un parámetro aprendido por dimensión. La idea: la media no aporta mucho; solo la escala varía y debe normalizarse. SwiGLU (otra innovación de LLaMA) reemplaza GELU por una activación con puerta: GLU(x) = (xW₁ ⊙ σ(xW₂))W₃. Mejor calidad pero añade ~50% de parámetros en la FFN.",
      },
    ],
  },

  // ───────────────────────────────────────────────────────
  // NIVEL 8 — GENERACIÓN
  // ───────────────────────────────────────────────────────
  {
    id: "gen",
    index: 7,
    title: "GENERACIÓN",
    icon: "🎲",
    color: "#60a5fa",
    tag: "Decodificando tokens",
    summary: "Autoregresión, temperature, top-k, top-p, beam search y KV cache.",
    estimatedMin: 18,
    concepts: ["Autoregresión", "Logits", "Softmax con temperature", "Top-k", "Top-p (nucleus)", "Beam search", "KV cache"],
    paperRef: { title: "The Curious Case of Neural Text Degeneration", year: 2019, authors: "Holtzman et al." },
    glossary: [
      { term: "Logits", definition: "Salida cruda del modelo antes de softmax: vector de V números reales. Mayor logit = más probable." },
      { term: "Autoregresión", definition: "Generar token a token, condicionado en todo lo generado hasta ahora. x_t ~ P(x_t | x_<t)." },
      { term: "Temperature (T)", definition: "Parámetro que aplana o agudiza la distribución. T>1 = más diverso, T<1 = más conservador, T=0 = greedy." },
      { term: "Top-k", definition: "Mantener solo los k tokens más probables antes de muestrear. Recorta la cola larga." },
      { term: "Top-p (Nucleus)", definition: "Mantener el conjunto mínimo de tokens cuya probabilidad acumulada ≥ p. Adaptativo: más tokens si la distribución es plana." },
      { term: "KV cache", definition: "Cache de las Keys y Values ya computadas. Evita recalcular attention para tokens pasados en cada paso de generación." },
    ],
    theory: [
      {
        title: "El LLM como predictor del siguiente token",
        level: "Básico",
        body: "Un LLM solo hace una cosa: dada una secuencia de tokens x₁..xₙ, producir una distribución de probabilidad sobre el siguiente token x_{n+1}. Generar texto es repetir este proceso (autoregresión).\n\nEn cada paso el modelo emite **logits** — un vector de V números reales. Pasarlos por softmax da probabilidades.",
        formula: "P(x_{n+1} = w) = \\frac{\\exp(z_w)}{\\sum_{w'} \\exp(z_{w'})}",
        formulaExplain: "z_w es el logit del token w. Softmax convierte logits no acotados en probabilidades en (0,1) que suman 1.",
      },
      {
        title: "Temperature — controlando el azar",
        level: "Intermedio",
        body: "Softmax con temperature T divide los logits por T antes de exponenciar:",
        formula: "P_T(w) = \\frac{\\exp(z_w / T)}{\\sum_{w'} \\exp(z_{w'} / T)}",
        formulaExplain: "T=1: distribución original. T→0: se concentra en el argmax (determinista, greedy). T→∞: distribución uniforme (caos). Típicamente T∈[0.3, 1.2]. T alta = creatividad, T baja = precisión.",
      },
      {
        title: "Top-k y Top-p — recortando la cola",
        level: "Avanzado",
        body: "Softmax completo permite muestrear tokens absurdamente improbables (la cola larga). **Top-k** fija un número máximo de candidatos. **Top-p (nucleus sampling)** mantiene el conjunto mínimo cuya probabilidad acumulada ≥ p.\n\nHoltzman (2019) demostró que nucleus sampling genera texto más natural que beam search en textos largos, porque beam search tiende a degenerar en repeticiones seguras ('I went to the store. I went to the store.').",
        formula: "\\text{nucleus}(p) = \\min \\{ S : \\sum_{w \\in S} P(w) \\geq p \\}",
        formulaExplain: "S es el conjunto de tokens más probables ordenado descendientemente. Para p=0.9, si los top-3 suman 0.85 y los top-4 suman 0.93, solo consideramos los top-4. Adaptativo: en distribuciones picudas toma pocos tokens; en planas, muchos.",
      },
      {
        title: "KV cache y complejidad de inferencia",
        level: "Experto",
        body: "En generación autoregresiva, cada nuevo token debe atender a todos los anteriores. Sin optimización, el costo del token t es O(t·d) — y generar n tokens cuesta O(n²·d).\n\n**KV cache**: en cada paso guardamos las K y V de los tokens pasados. El token nuevo solo computa su propia q, k, v y reusa las k, v cacheadas. Costo por token baja a O(n·d) y la generación es lineal. La memoria del cache crece como O(n·d_model·n_layers). En n=8k, Llama-7B consume ~2 GB solo de cache.\n\nOptimizaciones modernas: **PagedAttention** (vLLM) pagina el cache como un SO, **speculative decoding** usa un modelo pequeño para proponer y el grande para verificar en paralelo.",
      },
    ],
  },

  // ───────────────────────────────────────────────────────
  // NIVEL 9 — ALIGNMENT (RLHF, SFT, DPO)
  // ───────────────────────────────────────────────────────
  {
    id: "align",
    index: 8,
    title: "ALIGNMENT",
    icon: "🎯",
    color: "#22d3ee",
    tag: "De texto crudo a asistente útil",
    summary: "Pre-entrenamiento, SFT, RLHF y DPO: las 4 etapas de un LLM moderno.",
    estimatedMin: 20,
    concepts: ["Pre-entrenamiento", "SFT (Supervised Fine-Tuning)", "RLHF", "Reward model", "PPO", "DPO", "Constitutional AI"],
    paperRef: { title: "Training language models to follow instructions with human feedback", year: 2022, authors: "Ouyang et al. (OpenAI, InstructGPT)" },
    glossary: [
      { term: "Pre-entrenamiento", definition: "Fase 1: entrenar sobre trillones de tokens de internet con next-token prediction. Da un modelo que predice texto pero no sigue instrucciones." },
      { term: "SFT", definition: "Supervised Fine-Tuning. Fase 2: ajustar el modelo con ejemplos (instrucción, respuesta ideal) supervisados. Aprende el formato 'pregunta → respuesta'." },
      { term: "RLHF", definition: "Reinforcement Learning from Human Feedback. Fase 3: entrenar un reward model con preferencias humanas y optimizar el LLM con PPO contra ese reward." },
      { term: "Reward model", definition: "Modelo que asigna un escalar r(prompt, respuesta) a partir de rankings humanos. Sirve como función de recompensa en PPO." },
      { term: "PPO", definition: "Proximal Policy Optimization. Algoritmo de RL que actualiza la política (el LLM) sin alejarse demasiado de la versión anterior (clip ratio)." },
      { term: "DPO", definition: "Direct Preference Optimization. Alternativa a RLHF que omite el reward model: optimiza directamente la política a partir de preferencias. Más simple y estable." },
    ],
    theory: [
      {
        title: "Las 4 etapas de un LLM moderno",
        level: "Básico",
        body: "Un modelo como GPT-4 o Claude pasa por cuatro fases:\n\n1. **Pre-entrenamiento** — trillones de tokens de internet. Aprende gramática, hechos, razonamiento básico. Sale un 'completador de texto'.\n2. **SFT** — miles de ejemplos (prompt, respuesta ideal). Aprende el formato de diálogo.\n3. **RLHF / DPO** — millones de comparaciones (A vs B). Aprende qué respuestas prefieren los humanos.\n4. **Constitutional AI (opcional, Anthropic)** — el modelo se auto-corrige contra principios explícitos en lugar de feedback humano bruto.",
      },
      {
        title: "Pre-entrenamiento: la función objetivo",
        level: "Intermedio",
        body: "El objetivo del pre-entrenamiento es maximizar la log-likelihood del siguiente token dado el contexto, promediada sobre todo el corpus:",
        formula: "\\mathcal{L}_{PT} = -\\frac{1}{N} \\sum_{t=1}^{N} \\log P(x_t | x_{<t}; \\theta)",
        formulaExplain: "θ son los parámetros del modelo. Minimizar esta pérdida es maximizar la probabilidad que el modelo asigna al token verdadero. Tras millones de pasos sobre trillones de tokens, el modelo 'comprime' internet en sus pesos. El costo: millones de dólares de GPU.",
      },
      {
        title: "SFT y la función objetivo de InstructGPT",
        level: "Avanzado",
        body: "SFT usa la misma pérdida que el pre-entrenamiento, pero solo sobre los tokens de la respuesta (no del prompt):",
        formula: "\\mathcal{L}_{SFT} = -\\sum_{t \\in \\text{respuesta}} \\log P(x_t | x_{<t}, \\text{prompt}; \\theta)",
        formulaExplain: "El modelo aprende a generar respuestas en el estilo del dataset. El riesgo: sobreajuste a unos pocos miles de ejemplos. Solución: mezclar con datos de pre-entrenamiento para no olvidar.",
      },
      {
        title: "DPO — la simplificación matemática de RLHF",
        level: "Experto",
        body: "RLHF requiere entrenar un reward model separado y luego PPO con su reward. Es complejo, inestable, y requiere mantener 4 modelos en memoria (actor, referencia, reward, value). DPO (Rafailov 2023) reescribe el problema: dada una preferencia y_w ≻ y_l, optimiza directamente:",
        formula: "\\mathcal{L}_{DPO} = -\\log \\sigma\\left(\\beta \\log \\frac{\\pi_\\theta(y_w|x)}{\\pi_{ref}(y_w|x)} - \\beta \\log \\frac{\\pi_\\theta(y_l|x)}{\\pi_{ref}(y_l|x)}\\right)",
        formulaExplain: "π_θ es la política actual, π_ref la SFT inicial (fija), σ es sigmoide, β controla cuánto alejarse de π_ref. DPO maximiza la diferencia de log-ratios entre respuesta preferida y rechazada. Sin reward model, sin PPO, sin value function. 5x más barato que RLHF y da resultados comparables. Es el estándar moderno para alignment.",
      },
    ],
  },

  // ───────────────────────────────────────────────────────
  // NIVEL 10 — RAG
  // ───────────────────────────────────────────────────────
  {
    id: "rag",
    index: 9,
    title: "RAG",
    icon: "📚",
    color: "#c084fc",
    tag: "Memoria externa para el LLM",
    summary: "Retrieval-Augmented Generation: buscar, ranquear, generar.",
    estimatedMin: 16,
    concepts: ["Vector DB", "Embedding de consulta", "Retrieval top-k", "Reranking", "Chunking", "Hybrid search", "Alucinación"],
    paperRef: { title: "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks", year: 2020, authors: "Lewis et al. (Facebook AI)" },
    glossary: [
      { term: "RAG", definition: "Retrieval-Augmented Generation. Pipeline que recupera documentos relevantes de una base externa y los inyecta en el prompt del LLM." },
      { term: "Vector DB", definition: "Base de datos optimizada para almacenar y buscar vectores por similitud (Pinecone, Weaviate, Qdrant, pgvector). Usa índices ANN como HNSW." },
      { term: "Chunking", definition: "Partir documentos largos en fragmentos (chunks) de ~256-1024 tokens para que cada fragmento represente una idea atómica recuperable." },
      { term: "HNSW", definition: "Hierarchical Navigable Small World. Índice gráfico que permite búsqueda aproximada de vecinos en sub-linear time. Estándar en vector DBs." },
      { term: "Reranking", definition: "Segunda fase que reordena los top-k candidatos con un modelo más caro (ej. cross-encoder BERT) para mayor precisión." },
      { term: "Alucinación", definition: "Cuando el LLM genera contenido plausible pero falso. RAG reduce alucinaciones al anclar la respuesta en documentos recuperados." },
    ],
    theory: [
      {
        title: "Por qué RAG: límites del conocimiento paramétrico",
        level: "Básico",
        body: "Un LLM guarda su conocimiento en los pesos (memoria **paramétrica**). Es limitado: no puede actualizar sin reentrenar, no sabe citar fuentes, alucina hechos.\n\nRAG añade memoria **no-paramétrica**: una base externa de documentos. Antes de responder, recupera los más relevantes y los pasa al LLM como contexto. El LLM genera condicionado en esos documentos.",
      },
      {
        title: "Pipeline RAG estándar",
        level: "Intermedio",
        body: "1. **Indexación**: chunk documentos → embeddear cada chunk → almacenar en vector DB.\n2. **Query embedding**: embeddear la pregunta del usuario con el mismo modelo.\n3. **Retrieval**: buscar los k chunks más cercanos por similitud coseno (típicamente k=5-20).\n4. **Reranking** (opcional): cross-encoder reordena los top-k por relevancia fina.\n5. **Generación**: prompt = pregunta + chunks recuperados → LLM genera respuesta con citas.",
        formula: "P(y | q) = \\sum_{d \\in \\text{top-}k(q)} P(d | q) \\cdot P(y | q, d)",
        formulaExplain: "La fórmula original de Lewis (2020): la respuesta es una mezcla sobre los documentos recuperados. En la práctica se concatenan los top-k en un solo prompt y el LLM los atiende juntos.",
      },
      {
        title: "Chunking y hybrid search",
        level: "Avanzado",
        body: "El chunking determina la granularidad de recuperación. Chunks muy cortos pierden contexto; muy largos diluyen relevancia. Técnicas:\n\n• **Fixed-size** con overlap (200 tokens, 50 overlap)\n• **Semantic chunking** — partir en límites de párrafo o sección\n• **Recursive** — partir por capítulo → sección → párrafo\n\n**Hybrid search** combina similitud semántica (vector) con BM25 (full-text keyword). Funciona porque los embeddings son malos para nombres propios y términos raros que BM25 captura perfectamente.",
      },
      {
        title: "Limitaciones y fronteras de RAG",
        level: "Experto",
        body: "RAG simple falla cuando:\n• La pregunta requiere razonar sobre múltiples documentos.\n• El chunk óptimo no coincide con el recuperado.\n• Hay contradicción entre fuentes.\n\nMejoras activas de investigación:\n• **Multi-hop RAG**: recuperar, razonar, recuperar de nuevo.\n• **Self-RAG**: el LLM decide si necesita recuperar y auto-evalúa la calidad.\n• **GraphRAG**: construir un grafo de entidades sobre los documentos y recuperar subgrafos.\n• **Agentic RAG**: un agente con tools (búsqueda, calculator, etc.) itera.",
      },
    ],
  },

  // ───────────────────────────────────────────────────────
  // NIVEL 11 — AGENTES
  // ───────────────────────────────────────────────────────
  {
    id: "agent",
    index: 10,
    title: "AGENTES",
    icon: "🤖",
    color: "#2dd4bf",
    tag: "El loop que actúa",
    summary: "ReAct, herramientas, planificación y memoria: de chatbot a agente.",
    estimatedMin: 18,
    concepts: ["Loop Observar-Pensar-Actuar", "ReAct", "Herramientas (tools)", "Planificación", "Memoria", "Reflection", "Trajectory"],
    paperRef: { title: "ReAct: Synergizing Reasoning and Acting in Language Models", year: 2022, authors: "Yao et al. (Princeton + Google)" },
    glossary: [
      { term: "Agente", definition: "LLM dentro de un loop que observa su entorno, razona, y ejecuta acciones hasta lograr un objetivo." },
      { term: "Tool use", definition: "Capacidad del LLM de llamar funciones externas (búsqueda, calculator, API, código) y razonar sobre el resultado." },
      { term: "ReAct", definition: "Patrón de agente que alterna Thought (pensamiento), Action (acción con tool), Observation (resultado) en cada paso." },
      { term: "Trajectory", definition: "La secuencia completa de (state, action, observation) que un agente recorre. Es su historial de ejecución." },
      { term: "Reflection", definition: "Capacidad del agente de evaluar su propia trayectoria y corregir antes de continuar. Reflexion, Self-Refine." },
      { term: "Planning", definition: "Descomponer el objetivo en sub-tareas. Técnicas: Chain-of-Thought, Tree-of-Thoughts, LLM+P." },
    ],
    theory: [
      {
        title: "Del chatbot al agente: añadir el loop",
        level: "Básico",
        body: "Un chatbot LLM responde una vez y termina. Un **agente** repite el ciclo Observar → Pensar → Actuar hasta lograr el objetivo. La diferencia clave: el agente puede usar **herramientas** (functions, APIs, búsqueda, código) y observar su resultado antes de seguir.\n\nEsto convierte al LLM de 'generador de texto' a 'cerebro que decide qué hacer'.",
      },
      {
        title: "ReAct — el patrón fundacional",
        level: "Intermedio",
        body: "ReAct (Yao 2022) fuerza al LLM a producir cada paso en formato estructurado:",
        formula: "\\text{Thought}_t \\to \\text{Action}_t \\to \\text{Observation}_t \\to \\text{Thought}_{t+1} \\to \\dots",
        formulaExplain: "Thought: razonamiento en lenguaje natural sobre qué hacer. Action: llamada a una herramienta específica con argumentos JSON. Observation: resultado devuelto. El loop termina cuando el LLM emite 'Final Answer: ...'.",
      },
      {
        title: "Tools, function calling y JSON schema",
        level: "Avanzado",
        body: "Modernos LLMs (Claude, GPT-4) soportan **function calling nativo**: el modelo está fine-tuneado para emitir una llamada a función con JSON válido cuando decide usar una tool. Cada tool se describe con un JSON Schema.\n\nEjemplo de tool: `search(query: str) → str`. El LLM recibe la descripción, decide si llamar, y construye los argumentos. El sistema ejecuta la tool y devuelve el resultado como nueva observación.\n\nEl prompt del sistema típicamente lista todas las tools disponibles. La elección de cuál usar en cada paso es el problema central de la **agency**.",
      },
      {
        title: "Memoria, reflection y límites actuales",
        level: "Experto",
        body: "Un agente maduro combina varios tipos de **memoria**:\n• **Working memory**: contexto inmediato (los últimos N tokens).\n• **Episodic memory**: trayectorias pasadas, recuperables por similitud.\n• **Semantic memory**: hechos generales extraídos de experiencias.\n\n**Reflection** (Shinn 2023, Reflexion): tras cada intento, el agente genera un texto auto-evaluando qué falló y lo añade al contexto del siguiente intento. Mejora success rate en benchmarks como HumanEval de 80% a 91%.\n\nLímites actuales: drift del objetivo tras varios hops, errores que se propagan, costo creciente con la trayectoria, dificultad de evaluación. La frontera actual es **agentic reliability**: cómo hacer que un agente de 50 pasos no falle en el 49.",
      },
    ],
  },

  // ───────────────────────────────────────────────────────
  // NIVEL 12 — ORQUESTACIÓN
  // ───────────────────────────────────────────────────────
  {
    id: "orch",
    index: 11,
    title: "ORQUESTACIÓN",
    icon: "🎭",
    color: "#facc15",
    tag: "Sistemas multi-agente",
    summary: "Supervisor, swarm, jerarquías: coordinar equipos de agentes especializados.",
    estimatedMin: 18,
    concepts: ["Patrón supervisor", "Pipeline", "Swarm", "Handoff", "Hierarchical", "Consensus", "A2A protocol"],
    paperRef: { title: "MetaGPT: Meta Programming for Multi-Agent Collaborative Framework", year: 2023, authors: "Hong et al." },
    glossary: [
      { term: "Orquestador", definition: "Agente o sistema central que recibe el objetivo, lo descompone y reparte tareas entre agentes especializados." },
      { term: "Pipeline", definition: "Patrón más simple: agentes en cadena, cada uno pasa su salida al siguiente." },
      { term: "Supervisor", definition: "Patrón donde un agente central asigna tareas a workers y agrega resultados. LangGraph supervisor." },
      { term: "Swarm", definition: "Patrón de OpenAI donde los agentes se transfieren control entre sí (handoff) sin un orquestador central." },
      { term: "Handoff", definition: "Mecanismo por el cual un agente cede el control a otro más adecuado para la sub-tarea actual." },
      { term: "Hierarchical", definition: "Árbol de orquestadores: un supervisor global reparte a sub-supervisores que reparten a workers." },
      { term: "A2A", definition: "Agent2Agent: protocolo abierto para que agentes independientes descubran capacidades, intercambien información y colaboren sin compartir necesariamente su estado interno." },
    ],
    theory: [
      {
        title: "Por qué múltiples agentes",
        level: "Básico",
        body: "Un solo agente con muchas tools funciona para tareas simples, pero degrada cuando la tarea crece: contexto saturado, drift de objetivo, dificultad de evaluar. La solución: **equipos de agentes especializados**, cada uno con pocas tools y un rol claro.\n\nVentajas: paralelismo, separación de concerns, mejor trazabilidad. Desventajas: overhead de comunicación, coordinación compleja, fallas en cascada.",
      },
      {
        title: "Patrones de orquestación",
        level: "Intermedio",
        body: "Tres patrones fundacionales:\n\n**Pipeline**: A→B→C. Cada agente tiene una tarea bien definida. Ej: investigador → escritor → editor. Simple y determinista.\n\n**Supervisor**: un orquestador central recibe el objetivo, decide qué worker invoca, agrega la respuesta, decide el siguiente paso. LangGraph, AutoGen.\n\n**Swarm**: sin orquestador central. Cada agente decide a quién transferir control. OpenAI Swarm (2024), AGNO.",
      },
      {
        title: "Handoffs y grafo de estado",
        level: "Avanzado",
        body: "En swarm, cada agente expone **handoff functions** que transfieren control a otro agente junto con un resumen del estado. El handoff es una llamada a función que retorna el nuevo agente y su contexto.\n\nFormalmente, el sistema es un **grafo de estados finito** donde cada nodo es un agente y cada transición es un handoff. LangGraph explícitamente modela el sistema como un StateGraph con edges condicionales.",
        formula: "\\text{state}_{t+1} = f_{\\text{agent}_t}(\\text{state}_t), \\quad \\text{agent}_{t+1} = g(\\text{state}_{t+1})",
        formulaExplain: "El estado es compartido entre todos los agentes (típicamente un diccionario con mensajes, contexto, resultados parciales). f es la lógica del agente actual y g es la política de handoff. Esto permite paralelismo (varios agentes en ramas distintas) y recuperación (volver a un estado previo si algo falla).",
      },
      {
        title: "Consenso, votación y bordes de la frontera",
        level: "Experto",
        body: "Para tareas críticas, múltiples agentes proponen soluciones y se vota. Técnicas:\n• **Majority voting** — cada agente da su respuesta, gana la mayoría.\n• **Debate** — agentes argumentan en rondas, un juez decide.\n• **Mixture of Agents (MoA)** — las salidas de N agentes se agregan en un prompt para un agregador final.\n\nEn el ecosistema actual, **A2A (Agent2Agent)** y **MCP** cumplen funciones complementarias: A2A conecta agentes entre sí, mientras MCP conecta aplicaciones/agentes con tools y recursos. A2A está bajo la Linux Foundation y su especificación más reciente es 1.0; MCP publicó la revisión 2026-07-28. También aparecen capas de interfaz para agentes, como A2UI.\n\nEl reto abierto: **coordinación a escala**. Cuando pasas de 3 a 30 a 300 agentes, aparecen fenómenos de sistemas complejos: emergencia, oscilaciones y cuellos de botella no obvios. No hay ciencia madura aquí todavía.",
      },
    ],
  },

  // ───────────────────────────────────────────────────────
  // NIVEL 16 — POST-TRAINING
  // ───────────────────────────────────────────────────────
  {
    id: "posttraining",
    index: 15,
    title: "POST-TRAINING",
    icon: "🎯",
    color: "#fb7185",
    tag: "Convertir un modelo base en un asistente útil",
    summary: "SFT, preferencias, RL, verificación y destilación después del pre-entrenamiento.",
    estimatedMin: 18,
    concepts: ["SFT", "Preference optimization", "DPO", "RL", "GRPO", "Reward model", "Verifier", "Distillation"],
    paperRef: { title: "Training language models to follow instructions with human feedback", year: 2022, authors: "Ouyang et al." },
    glossary: [
      { term: "Post-training", definition: "Conjunto de técnicas aplicadas después del pre-entrenamiento para mejorar seguimiento de instrucciones, preferencias, seguridad o capacidades específicas." },
      { term: "SFT", definition: "Supervised Fine-Tuning: entrenamiento con ejemplos de instrucciones y respuestas deseadas." },
      { term: "DPO", definition: "Direct Preference Optimization: optimiza preferencias de respuestas sin necesitar un reward model separado como en RLHF clásico." },
      { term: "GRPO", definition: "Group Relative Policy Optimization: variante de optimización por preferencias/recompensas que usa comparaciones relativas dentro de grupos de respuestas." },
      { term: "Distillation", definition: "Transferir comportamiento de un modelo teacher a uno student más pequeño o especializado." },
    ],
    theory: [
      { title: "Del modelo base al asistente", level: "Básico", body: "El pre-entrenamiento enseña a predecir texto; no garantiza que el modelo siga instrucciones, respete formatos o sea útil para una conversación. El post-training modifica el comportamiento del modelo mediante ejemplos, preferencias, recompensas o verificadores.\n\nLa separación clave es: **pre-training = aprender patrones generales**; **post-training = moldear comportamiento y capacidades utilizables**." },
      { title: "SFT y preferencias", level: "Intermedio", body: "SFT entrena con pares instrucción→respuesta. Después pueden usarse datos de preferencias donde una respuesta es preferida frente a otra. DPO convierte esas preferencias en una pérdida directa, mientras que los métodos RL usan una señal de recompensa para actualizar la política." },
      { title: "RL, GRPO y verificadores", level: "Avanzado", body: "Para tareas con respuestas verificables, la señal puede venir de un **verificador**: un resultado matemático correcto, tests que pasan o una evaluación estructurada. Los métodos de RL modernos pueden comparar varias muestras del mismo prompt y reforzar las mejores sin depender siempre de un reward model clásico." },
      { title: "Destilación y evaluación post-training", level: "Experto", body: "Un modelo grande puede actuar como teacher y generar datos o preferencias para entrenar un student. La destilación reduce costo y latencia, pero puede transferir errores y sesgos. Por eso el post-training debe cerrarse con evals específicas: capacidad, robustez, seguridad, formato y regresiones." },
    ],
  },

  // NIVEL 17 — INFERENCE
  {
    id: "inference",
    index: 16,
    title: "INFERENCE",
    icon: "⚡",
    color: "#f59e0b",
    tag: "Hacer que un modelo responda rápido y barato",
    summary: "KV cache, batching, cuantización, speculative decoding y serving a escala.",
    estimatedMin: 20,
    concepts: ["Prefill", "Decode", "KV cache", "Quantization", "Continuous batching", "PagedAttention", "Speculative decoding", "Serving"],
    paperRef: { title: "Efficient Memory Management for Large Language Model Serving with PagedAttention", year: 2023, authors: "Kwon et al." },
    glossary: [
      { term: "Prefill", definition: "Fase que procesa el prompt completo y construye las claves y valores del KV cache antes de generar nuevos tokens." },
      { term: "Decode", definition: "Fase autoregresiva en la que el modelo genera nuevos tokens, normalmente uno por paso." },
      { term: "KV cache", definition: "Memoria que conserva claves y valores de atención ya calculados para no recomputarlos en cada token generado." },
      { term: "Continuous batching", definition: "Técnica de serving que incorpora y retira solicitudes dinámicamente para mantener ocupado el hardware." },
      { term: "Speculative decoding", definition: "Un modelo draft propone tokens y el modelo target los verifica en paralelo para aumentar tokens generados por unidad de tiempo." },
    ],
    theory: [
      { title: "Prefill vs decode", level: "Básico", body: "La inferencia de un LLM tiene dos fases. **Prefill** procesa el contexto inicial en paralelo y suele ser compute-heavy. **Decode** genera token por token y suele estar limitado por memoria y ancho de banda, especialmente con batch pequeño." },
      { title: "KV cache: memoria a cambio de velocidad", level: "Intermedio", body: "Sin KV cache, cada token nuevo obligaría a recalcular la atención sobre todo el prefijo. El cache conserva K y V de los tokens anteriores. El precio es memoria: cuanto más largo el contexto y mayor el batch, mayor el KV cache." },
      { title: "Serving moderno", level: "Avanzado", body: "Servidores como vLLM y otros motores modernos combinan KV cache eficiente, continuous batching y kernels optimizados. PagedAttention trata el KV cache en bloques, reduciendo fragmentación y facilitando compartir memoria entre solicitudes compatibles." },
      { title: "Latencia, throughput y costo", level: "Experto", body: "Optimizar inference no significa simplemente 'más FLOPS'. Hay que equilibrar **TTFT** (time to first token), tokens por segundo, concurrencia, longitud de contexto, memoria, costo por token y utilización del acelerador. Speculative decoding, quantization y routing de modelos son herramientas distintas para distintos cuellos de botella." },
    ],
  },

  // NIVEL 18 — MULTIMODAL
  {
    id: "multimodal",
    index: 17,
    title: "MULTIMODAL",
    icon: "👁️",
    color: "#38bdf8",
    tag: "Texto, imagen, audio y video en un mismo sistema",
    summary: "Cómo los modelos combinan modalidades y transforman señales no textuales en representaciones útiles.",
    estimatedMin: 18,
    concepts: ["Vision encoder", "Audio encoder", "Image tokens", "Multimodal embeddings", "Cross-attention", "Speech-to-text", "Text-to-speech", "Video understanding"],
    paperRef: { title: "Flamingo: a Visual Language Model for Few-Shot Learning", year: 2022, authors: "Alayrac et al." },
    glossary: [
      { term: "Multimodal model", definition: "Modelo capaz de procesar o generar más de una modalidad, como texto, imagen, audio o video." },
      { term: "Encoder", definition: "Componente que transforma una señal de entrada en representaciones que otro modelo puede consumir." },
      { term: "Cross-attention", definition: "Atención donde una representación consulta información proveniente de otra modalidad o secuencia." },
      { term: "Multimodal embedding", definition: "Representación vectorial que permite relacionar información de diferentes modalidades en un espacio compatible." },
    ],
    theory: [
      { title: "Una IA no tiene por qué ser solo texto", level: "Básico", body: "Una imagen puede convertirse en tokens o features visuales; el audio puede convertirse en unidades acústicas o texto; un video puede representarse como una secuencia temporal de información visual y sonora. El modelo aprende a relacionar esas representaciones con lenguaje y acciones." },
      { title: "Encoders y espacios compartidos", level: "Intermedio", body: "Una arquitectura multimodal puede usar encoders especializados para visión o audio y después proyectar sus representaciones a un espacio que el modelo de lenguaje pueda procesar. Otra opción es entrenar tokens multimodales directamente dentro de una arquitectura unificada." },
      { title: "Cross-attention y fusión", level: "Avanzado", body: "La fusión puede ocurrir mediante cross-attention, concatenación de tokens, adapters o arquitecturas híbridas. La pregunta central es dónde y cómo se permite que una modalidad influya en otra sin destruir información específica de cada señal." },
      { title: "Video, voz y sistemas en tiempo real", level: "Experto", body: "Video añade una dimensión temporal enorme y audio exige baja latencia para conversaciones naturales. Los sistemas modernos deben resolver sincronización, compresión, streaming, turn-taking y costos de inferencia además de la calidad del modelo." },
    ],
  },

  // NIVEL 19 — CONTEXT ENGINEERING
  {
    id: "context",
    index: 18,
    title: "CONTEXT ENGINEERING",
    icon: "🧩",
    color: "#8b5cf6",
    tag: "Diseñar el contexto que recibe el modelo",
    summary: "Context windows, compresión, selección, prioridades y cómo evitar saturar al modelo.",
    estimatedMin: 18,
    concepts: ["Context window", "Context selection", "Compression", "Summarization", "Prompt assembly", "Context pollution", "Long context"],
    glossary: [
      { term: "Context engineering", definition: "Diseño sistemático de la información que se entrega al modelo en cada paso para maximizar utilidad, precisión y eficiencia." },
      { term: "Context pollution", definition: "Información irrelevante, redundante o conflictiva que ocupa contexto y puede degradar la respuesta o las decisiones del agente." },
      { term: "Context compression", definition: "Reducir información previa conservando los elementos relevantes para una tarea futura." },
      { term: "Prompt assembly", definition: "Proceso de combinar instrucciones, historial, memoria, retrieval, resultados de tools y restricciones en el contexto final." },
    ],
    theory: [
      { title: "Más contexto no siempre es mejor", level: "Básico", body: "Un contexto grande permite incluir más información, pero también puede aumentar costo, latencia y ruido. El objetivo no es llenar la ventana: es entregar la **información correcta en el momento correcto**." },
      { title: "Construir el contexto", level: "Intermedio", body: "Un sistema puede ensamblar: instrucciones del sistema + tarea actual + historial relevante + memoria + documentos recuperados + resultados de herramientas. Cada bloque debe tener una razón de estar presente y un límite de tamaño." },
      { title: "Compresión y selección", level: "Avanzado", body: "Cuando una trayectoria crece, se pueden resumir mensajes antiguos, recuperar solo eventos relevantes o sustituir resultados enormes por referencias. El sistema debe preservar objetivos, restricciones, decisiones y evidencia crítica." },
      { title: "Contexto como recurso de ingeniería", level: "Experto", body: "En agentes, el contexto funciona como una memoria de trabajo limitada. Diseñarlo implica medir qué información ayuda, qué información distrae, cuándo recuperar, cuándo resumir y cómo evitar que herramientas inyecten contenido no confiable." },
    ],
  },

  // NIVEL 20 — MEMORY
  {
    id: "memory",
    index: 19,
    title: "MEMORIA",
    icon: "🧠",
    color: "#ec4899",
    tag: "Recordar sin confundir memoria con contexto",
    summary: "Working, episodic y semantic memory; persistencia, retrieval y límites de memoria para agentes.",
    estimatedMin: 18,
    concepts: ["Working memory", "Episodic memory", "Semantic memory", "Long-term memory", "Memory retrieval", "Memory write", "Forgetting"],
    glossary: [
      { term: "Working memory", definition: "Información disponible en el contexto inmediato de una ejecución." },
      { term: "Episodic memory", definition: "Recuerdos de eventos o trayectorias concretas que pueden recuperarse posteriormente." },
      { term: "Semantic memory", definition: "Hechos o conocimientos persistentes extraídos de experiencias y almacenados de forma reutilizable." },
      { term: "Memory policy", definition: "Reglas que determinan qué información guardar, cuándo recuperarla, actualizarla o eliminarla." },
    ],
    theory: [
      { title: "Context no es memoria", level: "Básico", body: "El contexto existe en una ejecución; la memoria persiste entre ejecuciones. Un agente puede tener una ventana de contexto enorme y aun así no tener memoria a largo plazo. Separar ambos conceptos evita diseños confusos." },
      { title: "Tres formas útiles de memoria", level: "Intermedio", body: "**Working**: lo que está pasando ahora. **Episódica**: experiencias anteriores. **Semántica**: hechos estables derivados de esas experiencias. Cada una requiere distintas estrategias de almacenamiento y recuperación." },
      { title: "Escribir memoria es una decisión", level: "Avanzado", body: "Guardar todo es mala idea: aumenta ruido, costo y riesgos de privacidad. Un sistema de memoria debe decidir qué merece persistir, con qué confianza, durante cuánto tiempo y bajo qué condiciones puede corregirse o eliminarse." },
      { title: "Memoria, privacidad y consistencia", level: "Experto", body: "Una memoria persistente puede contener información sensible, contradictoria o desactualizada. Por eso necesita provenance, TTL o políticas de borrado, controles de acceso y mecanismos para resolver conflictos. La memoria debe ser tratada como un sistema, no como un simple vector DB." },
    ],
  },

  // NIVEL 21 — TOOLS
  {
    id: "tools",
    index: 20,
    title: "TOOL USE",
    icon: "🛠️",
    color: "#14b8a6",
    tag: "Cuando el modelo deja de limitarse a hablar",
    summary: "Function calling, schemas, ejecución, observaciones, permisos y computer use.",
    estimatedMin: 18,
    concepts: ["Function calling", "Tool schema", "Tool execution", "Observation", "Permissions", "Computer use", "Tool result"],
    glossary: [
      { term: "Tool", definition: "Capacidad externa que un modelo o agente puede invocar para consultar información o realizar una acción." },
      { term: "Function calling", definition: "Mecanismo por el que el modelo produce una llamada estructurada a una función definida por la aplicación." },
      { term: "Tool schema", definition: "Descripción estructurada de una herramienta, sus argumentos, tipos, restricciones y resultado esperado." },
      { term: "Computer use", definition: "Uso de interfaces de computadora por un modelo o agente, normalmente mediante acciones observables y controles de seguridad." },
    ],
    theory: [
      { title: "De generar texto a pedir acciones", level: "Básico", body: "Un LLM puede responder con texto, pero una aplicación puede darle herramientas: buscar, calcular, consultar una base, ejecutar código o interactuar con una interfaz. El modelo decide **qué herramienta pedir**; la aplicación debe ejecutar y devolver el resultado." },
      { title: "Schemas y contratos", level: "Intermedio", body: "Una tool debe tener un contrato claro: nombre, descripción, argumentos tipados y errores previsibles. JSON Schema ayuda a reducir ambigüedad y permite validar la llamada antes de ejecutar una acción." },
      { title: "El loop Tool → Observation", level: "Avanzado", body: "El patrón general es: modelo propone llamada → runtime valida permisos → tool ejecuta → resultado vuelve al contexto → modelo decide el siguiente paso. La herramienta no debe asumir que el modelo es confiable: el runtime es quien impone las reglas." },
      { title: "Tools peligrosas", level: "Experto", body: "Una tool que puede borrar datos, enviar dinero, modificar código o acceder a secretos necesita autenticación, autorización, límites, confirmaciones y auditoría. La superficie de ataque de un agente crece con las herramientas que puede invocar." },
    ],
  },

  // NIVEL 22 — REASONING
  {
    id: "reasoning",
    index: 21,
    title: "REASONING",
    icon: "🔎",
    color: "#6366f1",
    tag: "Más cómputo para resolver problemas difíciles",
    summary: "Test-time compute, búsqueda, verificación, self-consistency y razonamiento asistido por herramientas.",
    estimatedMin: 20,
    concepts: ["Test-time compute", "Verification", "Search", "Self-consistency", "Verifier", "Reasoning model", "Tool-assisted reasoning"],
    glossary: [
      { term: "Test-time compute", definition: "Cómputo adicional usado durante la inferencia para explorar, verificar o mejorar una respuesta antes de entregarla." },
      { term: "Verifier", definition: "Modelo, programa o regla que evalúa si una solución satisface criterios concretos." },
      { term: "Self-consistency", definition: "Muestrear varias soluciones y elegir una respuesta consistente con la mayoría o con un agregador/verificador." },
      { term: "Search", definition: "Exploración de múltiples posibles acciones, estados o soluciones en vez de producir una única trayectoria inmediata." },
    ],
    theory: [
      { title: "Generar una respuesta no es lo mismo que resolver", level: "Básico", body: "En tareas difíciles, un sistema puede gastar más cómputo durante la inferencia para explorar alternativas, comprobar pasos o usar herramientas. Esto se conoce como **test-time compute**." },
      { title: "Generación múltiple y verificación", level: "Intermedio", body: "Una estrategia simple es producir varias soluciones y compararlas. Si existe un verificador confiable —por ejemplo un compilador o un checker matemático— el sistema puede seleccionar o mejorar la respuesta antes de devolverla." },
      { title: "Search y planificación", level: "Avanzado", body: "El razonamiento puede convertirse en búsqueda: generar una acción, evaluar el estado, explorar otra rama y conservar las mejores. Esto conecta modelos de lenguaje con ideas clásicas de búsqueda, planificación y optimización." },
      { title: "Razonamiento dentro de agentes", level: "Experto", body: "Un agente puede combinar reasoning, tools, memoria y verificación. La meta no es revelar cadenas internas privadas, sino construir sistemas observables donde podamos evaluar entradas, acciones, resultados, costos y éxito final." },
    ],
  },

  // NIVEL 23 — AGENT SKILLS
  {
    id: "skills",
    index: 22,
    title: "AGENT SKILLS",
    icon: "🧰",
    color: "#84cc16",
    tag: "Capacidades especializadas bajo demanda",
    summary: "Skills, progressive disclosure, instrucciones reutilizables y composición de capacidades de agentes.",
    estimatedMin: 16,
    concepts: ["Skill", "Progressive disclosure", "Skill instructions", "Capability composition", "Activation", "Tool mapping", "Skill isolation"],
    glossary: [
      { term: "Agent Skill", definition: "Paquete reutilizable de instrucciones, conocimiento, archivos o procedimientos que dota a un agente de una capacidad especializada." },
      { term: "Progressive disclosure", definition: "Patrón donde el agente descubre primero una descripción breve y carga detalles o recursos adicionales solo cuando los necesita." },
      { term: "Capability composition", definition: "Combinar varias skills para completar una tarea sin introducir todo su contenido en el contexto desde el principio." },
      { term: "Skill isolation", definition: "Separar instrucciones y recursos de una capacidad para reducir interferencias, conflictos y exposición innecesaria de contexto." },
    ],
    theory: [
      { title: "Una skill no es un modelo nuevo", level: "Básico", body: "Una skill es una forma de empaquetar una capacidad especializada para que un agente pueda reutilizarla. Puede contener instrucciones, ejemplos, referencias, scripts o reglas de procedimiento. El modelo sigue siendo el mismo; cambia el contexto y las capacidades disponibles." },
      { title: "Progressive disclosure", level: "Intermedio", body: "En lugar de meter todas las instrucciones de todas las skills en el prompt, el agente puede ver un catálogo corto y cargar la skill seleccionada cuando la tarea lo requiere. Esto reduce ruido y conserva contexto." },
      { title: "Skills + tools", level: "Avanzado", body: "Una skill puede describir **cómo** realizar una tarea y mapearla a tools que permiten ejecutarla. Por ejemplo, una skill de análisis de datos puede incluir un procedimiento y usar una tool de Python o una base de datos." },
      { title: "Composición y seguridad", level: "Experto", body: "Las skills pueden combinarse, pero sus instrucciones pueden entrar en conflicto. Un runtime serio necesita precedencia, sandboxing, permisos, provenance y límites de qué recursos puede leer o ejecutar cada skill." },
    ],
  },

  // NIVEL 24 — MCP
  {
    id: "mcp",
    index: 23,
    title: "MCP",
    icon: "🔌",
    color: "#22d3ee",
    tag: "Conectar agentes con herramientas y datos mediante un protocolo abierto",
    summary: "Model Context Protocol 2026-07-28: tools, resources, prompts, stateless core, Tasks, Apps y autorización.",
    estimatedMin: 22,
    concepts: ["MCP Client", "MCP Server", "Tools", "Resources", "Prompts", "Stateless", "MRTR", "Tasks", "MCP Apps", "Authorization"],
    paperRef: { title: "Model Context Protocol Specification 2026-07-28", year: 2026, authors: "Model Context Protocol maintainers" },
    glossary: [
      { term: "MCP", definition: "Model Context Protocol: estándar abierto para conectar aplicaciones de IA con herramientas, recursos y prompts externos." },
      { term: "MCP Server", definition: "Servicio que expone capacidades MCP, como tools, resources o prompts, para que un cliente pueda descubrirlas y utilizarlas." },
      { term: "MCP Client", definition: "Componente de una aplicación de IA que habla MCP y decide qué capacidades del servidor puede utilizar." },
      { term: "Stateless core", definition: "Desde la revisión 2026-07-28, el protocolo MCP ya no requiere handshake ni sesión de protocolo para cada servidor; las solicitudes pueden enrutar directamente entre instancias." },
      { term: "MRTR", definition: "Multi Round-Trip Requests: patrón de la revisión 2026-07-28 para que una tool solicite información o confirmación y continúe después sin mantener una sesión bidireccional permanente." },
      { term: "MCP Apps", definition: "Extensión de MCP para experiencias de interfaz de usuario asociadas a capacidades de servidores." },
    ],
    theory: [
      { title: "Por qué existe MCP", level: "Básico", body: "Una aplicación de IA puede integrar cientos de sistemas externos. Sin un protocolo común, cada integración necesita un contrato diferente. **MCP estandariza cómo descubrir y usar capacidades externas**. La arquitectura básica es: aplicación → MCP client → MCP server → sistema externo." },
      { title: "Tools, Resources y Prompts", level: "Intermedio", body: "Un servidor MCP puede exponer **tools** para acciones, **resources** para información y **prompts** reutilizables. El objetivo es separar la capacidad externa del modelo y ofrecer un contrato interoperable." },
      { title: "MCP 2026-07-28", level: "Avanzado", body: "La revisión publicada el 28 de julio de 2026 introduce un núcleo protocolario **stateless**, elimina el handshake y la sesión de protocolo, incorpora **Multi Round-Trip Requests (MRTR)**, routing mediante headers, resultados de listas cacheables, un framework formal de extensiones y endurecimiento de autorización. También mueve Tasks al sistema de extensiones y establece una política formal de deprecación." },
      { title: "MCP en sistemas reales", level: "Experto", body: "MCP no sustituye autenticación, autorización ni políticas del runtime. Un agente puede descubrir una tool, pero la aplicación debe decidir si tiene permiso para usarla, validar argumentos, controlar secretos, auditar acciones y solicitar confirmación para operaciones de alto impacto. MCP es una capa de interoperabilidad, no una capa de confianza." },
    ],
  },

  // NIVEL 25 — SEGURIDAD Y EVALS
  {
    id: "safety",
    index: 24,
    title: "SEGURIDAD Y EVALS",
    icon: "🛡️",
    color: "#ef4444",
    tag: "Medir y proteger sistemas agentic",
    summary: "Prompt injection, tool abuse, exfiltración, permisos, observabilidad y evaluación de agentes.",
    estimatedMin: 22,
    concepts: ["Prompt injection", "Indirect injection", "Tool abuse", "Least privilege", "Sandbox", "Observability", "Agent evals", "Regression testing"],
    glossary: [
      { term: "Prompt injection", definition: "Entrada diseñada para alterar instrucciones o prioridades del modelo de forma no deseada." },
      { term: "Indirect prompt injection", definition: "Instrucciones maliciosas que llegan al modelo desde contenido externo, como una página web, documento, correo o resultado de una tool." },
      { term: "Least privilege", definition: "Dar a cada agente, skill o tool solamente los permisos mínimos necesarios para completar su tarea." },
      { term: "Agent eval", definition: "Evaluación sistemática de un sistema agentic sobre tareas, decisiones, herramientas, seguridad, costo, latencia y resultado final." },
    ],
    theory: [
      { title: "El modelo no es una frontera de seguridad", level: "Básico", body: "Un prompt no es un mecanismo de autorización. Si un agente puede enviar dinero, borrar archivos o consultar secretos, esos permisos deben imponerse fuera del modelo mediante el runtime." },
      { title: "Prompt injection e indirect injection", level: "Intermedio", body: "Una instrucción maliciosa puede llegar directamente del usuario o indirectamente desde una página, PDF, email o tool. El contenido recuperado debe tratarse como **datos no confiables**, no como instrucciones del sistema." },
      { title: "Tool abuse y least privilege", level: "Avanzado", body: "Cada tool debe tener permisos mínimos, validación de argumentos, límites de frecuencia y auditoría. Las acciones destructivas pueden requerir aprobación humana. Un sandbox reduce el impacto cuando el modelo se equivoca o es manipulado." },
      { title: "Evals de sistemas agentic", level: "Experto", body: "Evaluar un agente no es solo preguntar si la respuesta final es correcta. Hay que medir trayectoria, selección de tools, pasos innecesarios, violaciones de permisos, costo, latencia, recuperación ante errores y regresiones entre versiones. Los casos adversariales deben formar parte del conjunto de evaluación." },
    ],
  },

];
