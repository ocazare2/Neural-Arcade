const MESSAGE_FLOW = [
  { id: "text", label: "Texto", plain: "Una persona escribe un mensaje para que el sistema lo procese." },
  { id: "tokens", label: "Piezas", plain: "El texto se separa en piezas que el modelo puede manejar." },
  { id: "ids", label: "IDs", plain: "Cada pieza se busca por un número de casillero; ese número aún no es significado." },
  { id: "embeddings", label: "Embeddings", plain: "Cada ID encuentra una lista aprendida de números que sirve para comparar contenido." },
  { id: "position", label: "Posición", plain: "La representación también necesita saber en qué lugar apareció cada pieza." },
  { id: "attention", label: "Atención", plain: "Cada pieza decide qué otras piezas le ayudan y mezcla su información." },
  { id: "transformer", label: "Transformer", plain: "Capas de atención y transformación refinan las representaciones sin perder el hilo anterior." },
  { id: "logits", label: "Logits", plain: "El modelo asigna una puntuación cruda a cada posible pieza siguiente." },
  { id: "next-token", label: "Siguiente pieza", plain: "Se elige una pieza, se añade al mensaje y el ciclo vuelve a empezar." },
] as const;

const TRAINING_FLOW = [
  { id: "target", label: "Respuesta esperada", plain: "Durante el entrenamiento ya conocemos cuál era la siguiente pieza correcta." },
  { id: "loss", label: "Pérdida", plain: "Medimos cuánto falló la puntuación del modelo frente a esa respuesta." },
  { id: "gradients", label: "Gradientes", plain: "Calculamos qué perillas aumentaron o redujeron ese error al moverlas un poco." },
  { id: "optimizer", label: "Optimizador", plain: "Elegimos cuánto mover cada perilla usando esas indicaciones y el historial de pasos." },
  { id: "weights", label: "Pesos nuevos", plain: "Los ajustes cambian y el siguiente intento usa una versión ligeramente mejor del modelo." },
] as const;

export const LLM_MESSAGE_FLOW = MESSAGE_FLOW;
export const LLM_TRAINING_FLOW = TRAINING_FLOW;

export type LLMMessageStepId = (typeof MESSAGE_FLOW)[number]["id"];
export type LLMTrainingStepId = (typeof TRAINING_FLOW)[number]["id"];

export interface LLMJourney {
  title: string;
  explanation: string;
  messageStep?: LLMMessageStepId;
  trainingStep?: LLMTrainingStepId;
}

const JOURNEYS: Readonly<Record<string, LLMJourney>> = {
  embed: {
    title: "De un casillero a un mapa aprendido",
    explanation: "Un ID solo encuentra una ficha. Aquí esa ficha se convierte en coordenadas aprendidas; después el modelo podrá combinarla con su posición y con las demás piezas.",
    messageStep: "embeddings",
  },
  neuron: {
    title: "La pequeña mezcladora dentro de una red",
    explanation: "Una neurona muestra la cuenta básica que reaparece dentro de las capas del Transformer: mezclar señales con pesos, sumar un ajuste y pasar por una puerta no lineal.",
    messageStep: "transformer",
  },
  backprop: {
    title: "La ruta inversa que enseña a las perillas",
    explanation: "Después de comparar una predicción con la respuesta correcta, el error viaja hacia atrás para responder cuánto influyó cada peso. Eso es lo que permite aprender, no solo calcular.",
    trainingStep: "gradients",
  },
  grad: {
    title: "De saber qué falló a mover los pesos",
    explanation: "El gradiente indica hacia dónde cambiar; el optimizador decide cuánto hacerlo. Juntos convierten muchos errores pequeños en pesos que funcionan mejor en ejemplos nuevos.",
    trainingStep: "optimizer",
  },
  attn: {
    title: "Las piezas consultan qué información necesitan",
    explanation: "La atención no adivina significado: compara señales, reparte pesos que suman uno y mezcla contenido. Es el puente entre una pieza aislada y un mensaje con contexto.",
    messageStep: "attention",
  },
  trans: {
    title: "El bloque que repite y refina el contexto",
    explanation: "Un Transformer encadena atención compartida, una transformación por pieza y carriles de regreso. Repetir ese bloque conserva el ancho de la representación mientras la hace más útil para predecir.",
    messageStep: "transformer",
  },
  gen: {
    title: "De puntuaciones a texto, una pieza por turno",
    explanation: "La última representación se convierte en puntuaciones, después en probabilidades. Elegir una pieza y repetir la misma ruta es exactamente cómo se forma una respuesta larga.",
    messageStep: "next-token",
  },
};

export function getLLMJourney(levelId: string): LLMJourney | undefined {
  return JOURNEYS[levelId];
}
