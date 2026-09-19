import type { LevelMeta } from "./types";

// Referencia breve para las cuatro misiones del nivel inicial.
export const MATH_LEVEL: LevelMeta = {
  id: "math",
  index: -1,
  title: "MATEMÁTICAS",
  icon: "📐",
  color: "#14b8a6",
  tag: "Mueve, dibuja, combina y prueba",
  summary: "Guía un robot, dibuja con píxeles y descubre cómo los números ayudan a una máquina a aprender.",
  estimatedMin: 6,
  concepts: ["Vector", "Matriz", "Peso", "Error"],
  paperRef: { title: "The Matrix Cookbook", year: 2012, authors: "Petersen & Pedersen" },
  glossary: [
    { term: "Vector", definition: "Lista de números en un orden acordado. En nuestro tablero, [3, 2] guarda primero la posición horizontal del robot y después la vertical." },
    { term: "Matriz", definition: "Tabla organizada en filas y columnas. Un dibujo de 3 filas con 3 píxeles en cada fila puede guardarse como una matriz de 3 × 3." },
    { term: "Peso", definition: "Número que indica cuánto aporta cada unidad a un resultado. En nuestro portal, cada pila aporta 2 de energía y cada estrella aporta 3: esos son sus pesos." },
    { term: "Error", definition: "Diferencia entre el resultado y la meta. Si el robot está en [4, 1] y busca [4, 0], falta corregir una casilla vertical para llegar." },
  ],
  theory: [
    {
      title: "Dos números para encontrar al robot",
      level: "Básico",
      body: "Para guardar la posición del robot usamos dos números: primero cuánto avanza a la derecha y después cuánto sube. Partiendo de la esquina inferior izquierda, [3, 2] significa «3 a la derecha, 2 hacia arriba».\n\nEsta lista ordenada se llama **vector**: cada lugar de la lista tiene un significado. Si cambias [3, 2] por [2, 3], el robot termina en otra casilla.",
      formula: "[3, 2] + [1, 0] = [4, 2]",
      formulaExplain: "El movimiento [1, 0] suma un paso horizontal y ninguno vertical. Por eso solo cambia el primer número: el robot pasa de [3, 2] a [4, 2].",
    },
    {
      title: "Un dibujo hecho de casillas",
      level: "Básico",
      body: "Un **píxel** es una pequeña casilla de una imagen. En nuestro dibujo, 1 significa «encendida» y 0 significa «apagada».\n\nPon esas casillas en filas horizontales y columnas verticales: tendrás una **matriz**, una tabla de números. Una tabla de 3 filas y 3 columnas guarda 9 píxeles; cambiar un número cambia una parte del dibujo.",
      formula: "3 \\text{ filas} \\times 3 \\text{ columnas} = 9 \\text{ casillas}",
      formulaExplain: "Cuenta primero las filas y luego cuántas casillas hay en cada una. Cada casilla conserva su posición, así que una máquina puede guardar el dibujo completo como una tabla.",
    },
    {
      title: "Combina objetos para dar energía",
      level: "Básico",
      body: "Cada pila aporta 2 de energía y cada estrella aporta 3. Con 3 pilas obtienes 3 × 2 = 6; con 2 estrellas obtienes 2 × 3 = 6, así que juntas llegan a 12.\n\nLo que aporta cada objeto es su **peso** en esta cuenta. Multiplicar cada cantidad por su peso y sumar los resultados se llama suma ponderada; una neurona artificial combina sus entradas de una forma parecida.",
      formula: "(3 \\times 2) + (2 \\times 3) = 12",
      formulaExplain: "Primero calcula lo que aporta cada tipo de objeto y después suma. Puedes encontrar distintas combinaciones que lleguen a 12: por ejemplo, 6 pilas sin estrellas también aportan esa energía.",
    },
    {
      title: "Probar, mirar y ajustar",
      level: "Básico",
      body: "La batería está en [4, 0]. Si tu robot está en [4, 1], ya coincide en horizontal, pero le sobra una casilla vertical: esa diferencia es el **error** en este juego. Bajar una casilla lo lleva a cero; antes, quizá tengas que alejarte para rodear un muro.\n\nEntrenar una máquina también consiste en comparar un resultado con el esperado y ajustar sus números. Aquí tú decides los movimientos; una IA usa un procedimiento de aprendizaje y muchos ejemplos, no solo un recorrido.",
      formula: "[4, 1] + [0, -1] = [4, 0]",
      formulaExplain: "El movimiento [0, -1] deja igual el número horizontal y resta uno al vertical. El resultado coincide con la meta, así que la diferencia es cero. Esta comparación muestra para qué sirve medir un error.",
    },
  ],
};
