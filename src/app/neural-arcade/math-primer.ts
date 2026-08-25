import type { LevelMeta } from "./types";

// ═══════════════════════════════════════════════════════════
// NIVEL 0 — MATEMÁTICAS ESENCIALES
// Para principiantes absolutos. Sin prerrequisitos.
// ═══════════════════════════════════════════════════════════

export const MATH_LEVEL: LevelMeta = {
  id: "math",
  index: -1,
  title: "MATEMÁTICAS",
  icon: "📐",
  color: "#14b8a6",
  tag: "Vectores, matrices y derivadas desde cero",
  summary: "Las matemáticas que necesitas antes de tocar IA. Sin esto, nada tiene sentido.",
  estimatedMin: 25,
  concepts: ["Vector", "Matriz", "Producto punto", "Norma", "Derivada", "Regla de la cadena", "Softmax"],
  paperRef: { title: "The Matrix Cookbook", year: 2012, authors: "Petersen & Pedersen" },
  glossary: [
    { term: "Vector", symbol: "v", definition: "Lista ordenada de n números reales. Ej: [3, 7, 2] es un vector 3D. Vive en R^n." },
    { term: "Escalar", definition: "Un solo número (no una lista). Ej: la temperatura 24°C. Los vectores se componen de escalares." },
    { term: "Matriz", symbol: "A", definition: "Tabla de números organizados en filas y columnas. Una matriz 3×4 tiene 3 filas y 4 columnas. Es una pila de vectores." },
    { term: "Producto punto", symbol: "a·b", definition: "a·b = Σ a_i × b_i. Mide cuánto se alinean dos vectores. Grande positivo = misma dirección; 0 = perpendiculares." },
    { term: "Norma L2", symbol: "|v|", definition: "La 'longitud' de un vector: √(v1² + v2² + ... + vn²). Ej: |[3,4]| = √(9+16) = 5." },
    { term: "Derivada", symbol: "f'(x)", definition: "Tasa de cambio instantáneo. La pendiente de f en un punto. Si f'(x) > 0, f sube; si < 0, f baja." },
    { term: "Derivada parcial", symbol: "∂f/∂x", definition: "Derivada de f respecto a UNA variable, manteniendo las otras fijas. ∂f/∂x = cómo cambia f si solo muevo x." },
    { term: "Gradiente", symbol: "∇f", definition: "Vector de todas las derivadas parciales. Apunta en la dirección de MÁXIMO aumento. Para minimizar, camina en -∇f." },
    { term: "Softmax", definition: "Función que convierte una lista de números en probabilidades (0-1, suman 1). Fórmula: softmax(z)_i = e^z_i / Σ e^z_j." },
  ],
  theory: [
    {
      title: "¿Qué es un vector? Un número no alcanza",
      level: "Básico",
      body: "Un solo número — un **escalar** — a veces basta. La temperatura es 24°C. La edad es 25. La velocidad es 90 km/h. Un número, una cantidad.\n\nPero para describir algo rico necesitas MUCHOS números a la vez. Imagina que quieres describir a una persona con una sola lista:\n  persona = [edad=25, altura_cm=170, peso_kg=65]\nEsa lista ordenada de números es un **vector**.\n\nMás ejemplos cotidianos:\n• **Color RGB**: rojo puro = [255, 0, 0], azul puro = [0, 0, 255], blanco = [255, 255, 255].\n• **Coordenadas GPS**: Ciudad de México = [lat=19.43, lon=-99.13].\n• **Persona completa**: [edad, altura_cm, peso_kg, ingresos_mxn] = [25, 170, 65, 30000].\n\n**Notación**: escribimos los vectores en minúscula negrita (v) o con flecha (v⃗). Un vector genérico de n componentes es v = [v₁, v₂, ..., vₙ].\n\n**Suma de vectores** (solo si tienen la misma longitud, componente a componente):\n  [1, 2] + [3, 4] = [1+3, 2+4] = [4, 6]\n  [10, 20, 30] + [1, 2, 3] = [11, 22, 33]\nNo puedes sumar [1, 2] + [1, 2, 3] — longitudes distintas.\n\n**Multiplicación por escalar** (cada componente se multiplica):\n  2 × [1, 3] = [2×1, 2×3] = [2, 6]\n  0.5 × [10, 20] = [5, 10]\n\nEstas dos operaciones — suma entre vectores y multiplicación por escalar — son TODO lo que necesitas para definir un espacio vectorial. De aquí nacen los embeddings, los pesos de las redes, y todo lo demás en IA.",
      formula: "v = [v_1, v_2, \\ldots, v_n] \\in \\mathbb{R}^n",
      formulaExplain: "Un vector de n dimensiones es una lista ordenada de n números reales. R^n significa 'el espacio de n dimensiones'. Un vector 2D vive en R², uno 3D en R³. Los embeddings viven en R^d donde d=768 (BERT) o 12288 (GPT-3).",
    },
    {
      title: "Producto punto: cuándo se parecen dos vectores",
      level: "Intermedio",
      body: "Necesitamos una forma de medir qué tan SIMILARES son dos vectores. El producto punto es la respuesta.\n\n**Definición**: dados a = [a₁, a₂, ..., aₙ] y b = [b₁, b₂, ..., bₙ],\n  a · b = a₁×b₁ + a₂×b₂ + ... + aₙ×bₙ\n\n**Ejemplo trabajado**: a = [1, 2, 3], b = [4, 5, 6].\n  a · b = 1×4 + 2×5 + 3×6 = 4 + 10 + 18 = 32\n\nCada par de componentes se multiplica, luego se suman. El resultado es un ESCALAR (un solo número), no un vector.\n\n**Significado geométrico**: a · b = |a| × |b| × cos(θ), donde θ es el ángulo entre los vectores.\n• Si apuntan en la MISMA dirección (θ=0°): producto punto grande y positivo.\n• Si son PERPENDICULARES (θ=90°): producto punto = 0.\n• Si apuntan en direcciones OPUESTAS (θ=180°): producto punto grande y negativo.\n\n**Norma (longitud) de un vector**: |v| = √(v₁² + v₂² + ... + vₙ²).\nEjemplo: |[3, 4]| = √(9 + 16) = √25 = 5. (Teorema de Pitágoras generalizado.)\n\n**Similitud coseno** — el producto punto normalizado:\n  cos(θ) = (a · b) / (|a| × |b|)\nResultado siempre en [-1, 1]. Es la métrica estándar para comparar embeddings: cos=1 significa 'idénticos', cos=0 significa 'sin relación', cos=-1 significa 'opuestos'.\n\nTrabajado: a=[1,0], b=[1,1]. a·b=1. |a|=1, |b|=√2≈1.414. cos(θ) = 1/1.414 ≈ 0.707 → θ=45°.",
      formula: "a \\cdot b = \\sum_{i=1}^{n} a_i b_i = a_1 b_1 + a_2 b_2 + \\ldots + a_n b_n",
      formulaExplain: "El producto punto multiplica componente a componente y suma. Es la base de TODA la similitud semántica en IA: attention, embeddings, RAG retrieval. Si dos vectores apuntan en la misma dirección, su dot product es grande y positivo.",
    },
    {
      title: "Matrices: cuando necesitas muchos vectores a la vez",
      level: "Avanzado",
      body: "Una **matriz** es una tabla de números: una pila de vectores apilados como filas. ¿Para qué? Porque las redes neuronales procesan MUCHOS vectores a la vez, no uno.\n\n**Ejemplo concreto**. Imagina un batch de 3 personas, cada una con 4 features (edad, altura_cm, peso_kg, ingresos):\n  P1: [25, 170, 65, 30000]\n  P2: [30, 165, 58, 45000]\n  P3: [22, 180, 75, 20000]\nSi apilamos esas 3 filas obtenemos una MATRIZ de 3 filas × 4 columnas (3×4).\n\n**Notación**: las matrices se escriben en MAYÚSCULA negrita (A, W, X). La entrada en la fila i, columna j es A_{ij} (o A[i][j]).\n\n**Multiplicación matriz × vector** — la operación central de toda red neuronal. Cada FILA de la matriz se multiplica (dot product) con el vector de entrada.\n\nEjemplo trabajado:\n  W = [[1, 0],\n       [0, 1],\n       [2, 3]]     ← matriz 3×2 (3 filas, 2 columnas)\n  x = [4, 5]        ← vector de tamaño 2\n  W · x = [ (1×4 + 0×5),\n            (0×4 + 1×5),\n            (2×4 + 3×5) ]\n        = [ 4, 5, 23 ]    ← vector de tamaño 3\nFíjate: entró un vector de tamaño 2 y salió uno de tamaño 3. La matriz 3×2 transforma R² → R³.\n\n**Multiplicación matriz × matriz** — necesaria para attention (QKᵀ). Cada entrada (i,j) del resultado es el dot product de la fila i de A con la columna j de B. Las columnas de A deben igualar las filas de B.\n\nEjemplo trabajado: A (2×3) × B (3×2) = C (2×2).\n  A = [[1, 2, 3],\n       [4, 5, 6]]\n  B = [[7,  8],\n       [9,  10],\n       [11, 12]]\n  C[0,0] = fila 0 de A · col 0 de B = 1×7 + 2×9 + 3×11 = 7 + 18 + 33 = 58\n  C[0,1] = fila 0 de A · col 1 de B = 1×8 + 2×10 + 3×12 = 8 + 20 + 36 = 64\n  C[1,0] = fila 1 de A · col 0 de B = 4×7 + 5×9 + 6×11 = 28 + 45 + 66 = 139\n  C[1,1] = fila 1 de A · col 1 de B = 4×8 + 5×10 + 6×12 = 32 + 50 + 72 = 154\n  C = [[58,  64],\n       [139, 154]]\n\n**Esto es lo que hace una capa neuronal**. Una capa densa con m neuronas y entrada de tamaño n aplica:\n  y = W · x + b\ndonde W es m×n, x es n, b es m, y la salida y es m. La matriz W contiene TODOS los pesos de TODAS las neuronas de esa capa, organizados por filas.\n\n**Transpuesta** (Aᵀ). Intercambia filas por columnas. Si A es 3×4, entonces Aᵀ es 4×3.",
      formula: "(W \\cdot x)_i = \\sum_{j} W_{ij} x_j",
      formulaExplain: "La fila i de W se multiplica componente a componente con x y se suma. Esto da la componente i del resultado. Una capa neuronal con m neuronas y entrada de tamaño n usa una matriz W de m×n.",
    },
    {
      title: "Derivadas: cómo saber si vas bien o mal",
      level: "Experto",
      body: "Entrenar una red neuronal = **minimizar el error**. Para minimizar, necesitas saber CÓMO cambia el error cuando mueves cada parámetro. Esa es la derivada.\n\n**Empezamos en 1D**. Sea f(x) = x². Su derivada es f'(x) = 2x.\n• En x = 3:  f'(3) = 6. La pendiente es +6 → la función sube fuerte.\n• En x = -2: f'(-2) = -4. La pendiente es -4 → la función baja.\n• En x = 0:  f'(0) = 0. Estás en el mínimo. No sube ni baja.\n\n**Interpretación**: la derivada es la pendiente. 'Si nudgeo x en +0.001, f cambia aproximadamente f'(x) × 0.001'.\nEjemplo: en x=3, f(3)=9. Si muevo x a 3.001, f(3.001) ≈ 9 + 6×0.001 = 9.006.\n\n**Gradient descent** — la idea central del entrenamiento:\n• Si la pendiente es POSITIVA, la función sube → para BAJAR, mueve x a la IZQUIERDA.\n• Si la pendiente es NEGATIVA, la función baja → para seguir bajando, mueve x a la DERECHA.\nEn ambos casos: dar un paso en dirección OPUESTA a la pendiente.\n  x_nuevo = x_viejo - learning_rate × f'(x)\nEjemplo: f(x)=x², empieza en x=3, learning_rate=0.1.\n  x₁ = 3 - 0.1 × 6 = 2.4\n  x₂ = 2.4 - 0.1 × 4.8 = 1.92\n  x₃ = 1.92 - 0.1 × 3.84 = 1.536\nVa convergiendo a x=0, el mínimo.\n\n**Derivadas parciales**. Cuando f depende de varias variables, la derivada parcial ∂f/∂x_i responde: 'si solo muevo x_i y dejo las otras fijas, cómo cambia f?'.\nEjemplo: f(x, y) = x² + 3y.\n  ∂f/∂x = 2x   (derivamos en x, tratamos y como constante)\n  ∂f/∂y = 3    (derivamos en y, tratamos x² como constante)\n\n**El gradiente** ∇f es el VECTOR de todas las derivadas parciales:\n  ∇f = [∂f/∂x, ∂f/∂y] = [2x, 3]\nApunta en la dirección de MÁXIMO AUMENTO de f. Para MINIMIZAR, caminas en dirección OPUESTA: -∇f.\n\n**Regla de la cadena** (semilla de backpropagation). Si z = f(g(x)), entonces:\n  dz/dx = f'(g(x)) × g'(x)\nEjemplo: z = (3x + 1)². Sea g(x) = 3x + 1 y f(u) = u².\n  dz/dx = 2·(3x+1) · 3 = 6·(3x+1).\nEn x=2: dz/dx = 6·7 = 42.\nEsta regla, aplicada recursivamente capa por capa, es EXACTAMENTE lo que hace backpropagation.",
      formula: "\\nabla f = \\left[\\frac{\\partial f}{\\partial x_1}, \\frac{\\partial f}{\\partial x_2}, \\ldots, \\frac{\\partial f}{\\partial x_n}\\right], \\quad x_{\\text{nuevo}} = x - \\eta \\cdot \\nabla f",
      formulaExplain: "El gradiente es un vector con todas las derivadas parciales. Apunta cuesta ARRIBA. Para bajar (minimizar el error), damos un paso en dirección OPUESTA: x_nuevo = x - η·∇f. η (eta) es el learning rate: qué tan grande es el paso.",
    },
    {
      title: "Softmax: de números a probabilidades",
      level: "Experto",
      body: "Imagina que un modelo tiene que predecir cuál de 3 opciones es la correcta. Su salida cruda son 3 números: z = [2, 1, 0.1]. Pero queremos PROBABILIDADES (números entre 0 y 1 que sumen 1). Softmax hace exactamente eso.\n\n**Definición**: para un vector de logits z = [z₁, z₂, ..., zₙ],\n  softmax(z)_i = exp(z_i) / Σ_j exp(z_j)\n\nCada componente se exponencia (e^z) y se normaliza dividiendo por la suma total.\n\n**Ejemplo trabajado paso a paso**. Logits z = [2, 1, 0.1].\n• Paso 1: exponenciar cada uno.\n  e² ≈ 7.389\n  e¹ ≈ 2.718\n  e^0.1 ≈ 1.105\n• Paso 2: sumar.\n  Σ = 7.389 + 2.718 + 1.105 = 11.212\n• Paso 3: dividir cada e^z por la suma.\n  P₁ = 7.389 / 11.212 ≈ 0.659   (66%)\n  P₂ = 2.718 / 11.212 ≈ 0.242   (24%)\n  P₃ = 1.105 / 11.212 ≈ 0.099   (10%)\n• Verificación: 0.659 + 0.242 + 0.099 = 1.000 ✓\n\nEl logit más alto (2) se lleva la mayor probabilidad (66%). Pero los otros NO se descartan — siguen teniendo probabilidad. Esto permite MUESTREAR (tener creatividad) en vez de siempre elegir el más probable.\n\n**Truco numérico**: para evitar que e^z explote (e^1000 = Inf), se resta el máximo antes de exponenciar. softmax([2,1,0.1]) = softmax([2-2, 1-2, 0.1-2]) = softmax([0, -1, -1.9]). El resultado es idéntico pero numéricamente estable. Todas las librerías serias (PyTorch, TensorFlow) lo hacen.\n\n**Por qué te importa**: softmax aparece EN TODOS LADOS en IA moderna. Cuando veas 'attention' (nivel 6), su fórmula incluye softmax para convertir similitudes en pesos. Cuando veas 'generación' (nivel 8), el LLM produce logits y softmax los convierte en probabilidades del siguiente token. Por eso aprendemos softmax aquí: es el puente entre 'números crudos' y 'decisiones probabilísticas'.",
      formula: "\\text{softmax}(z)_i = \\frac{e^{z_i}}{\\sum_{j=1}^{n} e^{z_j}}",
      formulaExplain: "Cada logit se exponencia (lo hace positivo) y se normaliza (divide por la suma). El resultado es una distribución de probabilidad: todas las entradas en (0, 1) y suman 1. El logit más grande se lleva la mayor probabilidad, pero los demás siguen teniendo su cuota.",
    },
  ],
};
