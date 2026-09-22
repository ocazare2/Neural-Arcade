import type { LevelMeta } from "./types";

// Base matemática del recorrido: cada definición aparece primero en una acción.
export const MATH_LEVEL: LevelMeta = {
  id: "math",
  index: -1,
  title: "MATEMÁTICAS",
  icon: "📐",
  color: "#14b8a6",
  tag: "Vectores, matrices y producto punto",
  summary: "Construye el lenguaje matemático de una IA: componentes, dimensión, matrices, producto punto y error.",
  estimatedMin: 12,
  concepts: ["Vector", "Componente", "Dimensión", "Matriz", "Producto punto", "Peso", "Error"],
  paperRef: { title: "The Matrix Cookbook", year: 2012, authors: "Petersen & Pedersen" },
  glossary: [
    { term: "Vector", definition: "Una lista ordenada de componentes que representa una dirección, desplazamiento o conjunto de valores. En el tablero, Δp = [1, 0] significa un paso horizontal y ninguno vertical." },
    { term: "Componente", definition: "Un componente es cada número dentro de un vector. En [3, 2], el primero es horizontal y el segundo es vertical; intercambiarlos cambia el significado." },
    { term: "Dimensión", definition: "La cantidad de componentes de un vector. [3, 2] tiene dimensión 2; un embedding puede tener cientos o miles de componentes aprendidos." },
    { term: "Matriz", definition: "Tabla organizada en filas y columnas. Una matriz 3 × 3 puede verse como tres vectores de dimensión 3 apilados." },
    { term: "Producto punto", definition: "Empareja componentes de dos vectores de la misma dimensión, los multiplica y suma los resultados. Devuelve un escalar: un solo número." },
    { term: "Peso", definition: "Número que decide cuánto aporta una entrada. En w = [2, 3], una estrella cuenta más que una pila dentro del producto punto." },
    { term: "Error", definition: "Diferencia entre meta y resultado. Como vector e = meta − posición indica dirección y distancia por componente; una pérdida de entrenamiento lo resume en un número." },
  ],
  theory: [
    {
      title: "Puntos, vectores y desplazamientos",
      level: "Básico",
      body: "Un punto indica dónde está algo; en el tablero, el robot está en la coordenada (3, 2). Podemos describir esa ubicación desde el origen con el vector de posición p = [3, 2]. Sus dos componentes tienen orden: primero horizontal, luego vertical. Por eso [3, 2] y [2, 3] no son lo mismo.\n\nUn desplazamiento también es un vector. Δp = [1, 0] cambia solo la primera componente. Sumar vectores significa sumar componente con componente. Este ejemplo es de dimensión 2; un embedding aplica la misma idea con muchas más componentes que no podemos dibujar en un plano.",
      formula: "p + Δp = [3, 2] + [1, 0] = [4, 2]",
      formulaExplain: "p es la posición actual y Δp el movimiento. Suma 3 + 1 en horizontal y 2 + 0 en vertical. La dimensión se conserva: un vector de 2 componentes solo puede sumarse con otro de 2 componentes.",
    },
    {
      title: "Matrices: vectores apilados",
      level: "Básico",
      body: "Una matriz organiza números en filas y columnas. En una imagen pequeña, cada píxel puede ser 0 (apagado) o 1 (encendido). Cada fila de tres píxeles es un vector de dimensión 3; tres filas apiladas forman una matriz.\n\nLa forma 3 × 3 no es decoración: dice cuántos números hay y cómo se agrupan. Cambiar una entrada cambia un píxel específico. Las redes usan matrices mucho más grandes para guardar imágenes, lotes de datos y pesos de capas completas.",
      formula: "M ∈ \\mathbb{R}^{3 \\times 3} \quad \Rightarrow \quad 3 \\text{ filas} \\times 3 \\text{ columnas} = 9 \\text{ entradas}",
      formulaExplain: "M ∈ ℝ^(3 × 3) se lee: M es una matriz de números reales con 3 filas y 3 columnas. La forma importa porque las operaciones de matrices solo funcionan cuando sus dimensiones son compatibles.",
    },
    {
      title: "Producto punto: entradas con pesos",
      level: "Básico",
      body: "El portal recibe un vector de entradas x = [pilas, estrellas] y usa un vector de pesos w = [2, 3]. Cada peso indica cuánto cuenta su componente correspondiente. Para combinar ambos vectores, emparejamos, multiplicamos y sumamos.\n\nEse cálculo es el **producto punto**. Requiere que x y w tengan la misma dimensión y devuelve un escalar: un solo número. Una neurona artificial empieza exactamente así; después suma un sesgo y aplica una activación.",
      formula: "x \\cdot w = [3, 2] \\cdot [2, 3] = (3 \\times 2) + (2 \\times 3) = 12",
      formulaExplain: "La primera pila se empareja con el primer peso, y la primera estrella con el segundo. No se mezclan posiciones: el orden de las componentes conserva qué representa cada número.",
    },
    {
      title: "Error vectorial: meta menos posición",
      level: "Básico",
      body: "Cuando el robot no está en la meta, restamos su posición a la meta. El resultado e = meta − posición es un vector de error: cada signo indica en qué dirección falta corregir cada componente. Si e = [0, -1], la horizontal ya coincide y hay que bajar una casilla.\n\nEn este tablero hay muros, así que el vector de error no siempre es una ruta directa; es una brújula matemática. En entrenamiento, un modelo compara predicción y objetivo de manera parecida, pero una función de pérdida transforma esas diferencias en un escalar que puede minimizar.",
      formula: "e = meta - posición = [4, 0] - [4, 1] = [0, -1]",
      formulaExplain: "Sumar el error a la posición da la meta: posición + e = meta. Al llegar, e = [0, 0]. Esa es la señal que buscamos: ninguna componente necesita corrección.",
    },
  ],
};
