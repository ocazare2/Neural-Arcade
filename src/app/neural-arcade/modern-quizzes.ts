import type { QuizQuestion } from "./components/QuizRunner";

const q = (question: string, options: string[], correct: number, explain: string, difficulty: QuizQuestion["difficulty"]): QuizQuestion => ({ question, options, correct, explain, difficulty });

export const MODERN_PRACTICE: Record<string, QuizQuestion[]> = {
  hardware: [q("¿Qué técnica puede reducir significativamente la memoria de inference?", ["Quantization", "Aumentar temperatura", "Más tokens", "Más system prompts"], 0, "Quantization reduce la precisión numérica de pesos/activaciones y puede reducir memoria y ancho de banda.", "Básico")],
  scaling: [q("¿Qué relacionan las scaling laws?", ["Rendimiento con parámetros, datos y compute", "Solo colores", "Solo latencia de red", "Solo número de usuarios"], 0, "Estudian relaciones empíricas entre recursos de entrenamiento y desempeño.", "Básico")],
  modern: [q("¿Qué hace el router en un MoE?", ["Selecciona qué expertos procesan cada token", "Cuantiza el modelo", "Recupera documentos", "Genera audio"], 0, "El router asigna tokens a un subconjunto de expertos, normalmente top-k.", "Básico")],
  posttraining: [q("¿Qué busca principalmente el post-training?", ["Moldear comportamiento y capacidades útiles", "Cambiar el tokenizer", "Aumentar la VRAM", "Eliminar el contexto"], 0, "El post-training adapta el modelo base para seguir instrucciones, preferencias y tareas específicas.", "Básico")],
  inference: [q("¿Qué conserva el KV cache?", ["K y V ya calculados para el prefijo", "Los pesos del modelo", "Los documentos RAG", "Las herramientas"], 0, "Evita recomputar claves y valores de atención de tokens anteriores durante decode.", "Básico")],
  multimodal: [q("¿Qué componente puede transformar una imagen en una representación que el sistema pueda integrar?", ["Vision encoder", "Tokenizer de texto únicamente", "Reward model", "Rate limiter"], 0, "El encoder visual convierte la señal de imagen en una representación útil para el modelo multimodal.", "Básico")],
  context: [q("¿Cuál es el objetivo de context engineering?", ["Maximizar señal útil y minimizar ruido", "Llenar siempre toda la ventana", "Eliminar memoria", "Aumentar temperatura"], 0, "El contexto debe contener la información relevante para la decisión actual.", "Básico")],
  memory: [q("¿Qué diferencia a memoria de contexto?", ["La memoria puede persistir entre ejecuciones", "La memoria siempre son pesos", "El contexto siempre es permanente", "No hay diferencia"], 0, "El contexto pertenece a una ejecución; la memoria puede persistir.", "Básico")],
  tools: [q("¿Quién debería imponer permisos para una tool?", ["El runtime de la aplicación", "El modelo por sí solo", "El tokenizer", "El embedding"], 0, "El modelo propone la acción; el runtime debe validar y ejecutar.", "Básico")],
  reasoning: [q("¿Qué permite un verifier?", ["Comprobar si una solución satisface criterios", "Aumentar el vocabulario", "Cambiar el modelo base", "Crear tokens especiales"], 0, "Un verifier aporta una señal externa o estructurada para evaluar candidatos.", "Básico")],
  skills: [q("¿Qué significa progressive disclosure en skills?", ["Cargar detalles solo cuando una skill es necesaria", "Meter todas las skills en cada prompt", "Entrenar una GPU nueva", "Eliminar tools"], 0, "La idea es reducir ruido y consumo de contexto mediante carga bajo demanda.", "Básico")],
  mcp: [q("¿Qué expone normalmente un MCP server?", ["Tools, resources y prompts", "Solo pesos del LLM", "Solo GPU", "Solo tokens"], 0, "MCP define capacidades interoperables que un servidor puede exponer a un cliente.", "Básico")],
  safety: [q("¿Una página web debe poder cambiar las reglas de seguridad del agente?", ["No; es contenido no confiable", "Sí, siempre", "Solo si contiene Markdown", "Solo si viene de RAG"], 0, "El contenido externo puede contener indirect prompt injection y debe tratarse como dato no confiable.", "Básico")],
};

export const MODERN_CHALLENGES: Record<string, QuizQuestion[]> = {
  posttraining: [
    q("¿Qué diferencia describe mejor SFT frente a DPO?", ["SFT aprende de respuestas objetivo; DPO optimiza preferencias entre respuestas", "SFT solo cambia GPU; DPO cambia tokenizer", "Son exactamente iguales", "DPO solo sirve para embeddings"], 0, "SFT usa ejemplos supervisados; DPO usa pares de preferencias para optimizar directamente la política.", "Intermedio"),
    q("¿Por qué son útiles los verificadores en reasoning post-training?", ["Permiten obtener una señal de éxito más objetiva en tareas verificables", "Eliminan toda necesidad de datos", "Aumentan automáticamente el contexto", "Sustituyen la inferencia"], 0, "Un checker matemático, compilador o test puede evaluar resultados sin depender exclusivamente de una preferencia humana.", "Avanzado"),
    q("¿Qué riesgo tiene la destilación?", ["Transferir errores o sesgos del teacher al student", "Siempre duplica el tamaño", "Impide cuantizar", "Elimina el entrenamiento"], 0, "La destilación puede comprimir comportamiento, pero también transmitir defectos.", "Experto"),
  ],
  inference: [
    q("¿Qué suele dominar el costo de decode con batch pequeño?", ["Movimiento de memoria y acceso al KV cache", "Solo FLOPS teóricos", "El tokenizer", "El color de la UI"], 0, "Decode suele ser memory-bound con batch pequeño.", "Intermedio"),
    q("¿Qué aporta continuous batching?", ["Mantener el acelerador ocupado incorporando solicitudes dinámicamente", "Eliminar el KV cache", "Entrenar durante inference", "Cambiar los pesos"], 0, "Las solicitudes entran y salen del batch sin esperar a formar lotes estáticos.", "Avanzado"),
    q("¿Qué hace speculative decoding?", ["Un draft propone tokens y un target los verifica", "Cuantiza el tokenizer", "Reduce el vocabulario", "Elimina el modelo target"], 0, "La técnica aumenta tokens aceptados por paso cuando el draft predice bien.", "Experto"),
  ],
  multimodal: [
    q("¿Qué problema resuelve un espacio multimodal compartido?", ["Permite relacionar representaciones de distintas modalidades", "Elimina la necesidad de datos", "Convierte todo en SQL", "Reduce todos los modelos a un token"], 0, "Representaciones compatibles permiten que información visual, textual o acústica interactúe.", "Intermedio"),
    q("¿Por qué video es más costoso que una sola imagen?", ["Añade una dimensión temporal y muchas más representaciones", "Porque no puede tokenizarse", "Porque siempre usa RL", "Porque no tiene embeddings"], 0, "La secuencia temporal aumenta datos, memoria y cómputo.", "Avanzado"),
    q("¿Qué reto es especialmente importante en voz en tiempo real?", ["Latencia y turn-taking", "Solo tamaño de vocabulario", "Solo cuantización de pesos", "Solo OCR"], 0, "Las conversaciones de voz requieren streaming y coordinación temporal además de calidad.", "Experto"),
  ],
  context: [
    q("¿Qué debería sobrevivir a una compresión de contexto?", ["Objetivos, restricciones, decisiones y evidencia relevante", "Todo el texto sin cambios", "Solo emojis", "Nada"], 0, "La compresión debe preservar información necesaria para continuar la tarea.", "Intermedio"),
    q("¿Por qué 'más contexto' puede empeorar un agente?", ["Introduce ruido, contradicciones, costo y latencia", "Siempre reduce tokens", "El modelo deja de tener pesos", "El KV cache desaparece"], 0, "El contexto es un recurso limitado en utilidad, aunque la ventana sea grande.", "Avanzado"),
    q("¿Qué es context pollution?", ["Información irrelevante o conflictiva que degrada el contexto", "Un tipo de GPU", "Una técnica de cuantización", "Un protocolo de red"], 0, "Contenido innecesario ocupa espacio y puede afectar las decisiones del modelo.", "Experto"),
  ],
  memory: [
    q("¿Cuál es un ejemplo de memoria episódica?", ["Recordar una interacción concreta de hace una semana", "Los pesos del modelo", "El tokenizer", "El KV cache de una request actual"], 0, "La memoria episódica conserva eventos o experiencias concretas.", "Intermedio"),
    q("¿Por qué no conviene guardar todo?", ["Aumenta ruido, costo y riesgos de privacidad", "Porque las bases de datos no existen", "Porque RAG lo prohíbe", "Porque rompe el tokenizer"], 0, "Una política de memoria debe decidir qué merece persistir.", "Avanzado"),
    q("¿Qué debería acompañar a una memoria persistente?", ["Provenance, políticas de acceso y borrado/corrección", "Permisos ilimitados", "Sin auditoría", "Solo más tokens"], 0, "La memoria es un sistema de datos y necesita controles de ciclo de vida.", "Experto"),
  ],
  tools: [
    q("¿Qué describe un tool schema?", ["Nombre, argumentos, tipos y restricciones de una herramienta", "Los pesos del modelo", "La temperatura de la GPU", "La historia completa del usuario"], 0, "El schema establece el contrato de la llamada.", "Intermedio"),
    q("¿Por qué el runtime debe validar una llamada?", ["El modelo puede equivocarse o ser manipulado", "Porque el modelo nunca puede generar JSON", "Para cambiar el tokenizer", "Para entrenar el modelo"], 0, "La seguridad y corrección no deben depender de obediencia del modelo.", "Avanzado"),
    q("¿Qué es computer use?", ["Permitir que un modelo/agent interactúe con una interfaz mediante acciones observables y controles", "Entrenar una GPU", "Una base vectorial", "Un nuevo tokenizer"], 0, "Computer use amplía tools hacia interfaces de computadora y exige controles adicionales.", "Experto"),
  ],
  reasoning: [
    q("¿Qué es test-time compute?", ["Cómputo adicional durante inferencia para explorar o verificar", "Cómputo usado solo al entrenar", "Memoria del tokenizer", "Un tipo de embedding"], 0, "La idea es gastar más recursos en el momento de resolver una tarea.", "Intermedio"),
    q("¿Qué ventaja tiene self-consistency?", ["Comparar varias soluciones para obtener una respuesta más robusta", "Eliminar verificadores", "Reducir el contexto a cero", "Cambiar la GPU"], 0, "Múltiples muestras pueden revelar una solución consistente.", "Avanzado"),
    q("¿Por qué un verifier externo es valioso?", ["Puede evaluar propiedades concretas sin confiar solo en la salida del modelo", "Siempre es más inteligente que el modelo", "No necesita especificación", "Elimina todos los errores"], 0, "Un verificador aporta una señal independiente y acotada.", "Experto"),
  ],
  skills: [
    q("¿Qué puede contener una skill?", ["Instrucciones, recursos, ejemplos o procedimientos especializados", "Solo pesos del modelo", "Solo una GPU", "Solo un tokenizer"], 0, "Una skill empaqueta una capacidad reutilizable alrededor del agente.", "Intermedio"),
    q("¿Qué ventaja tiene progressive disclosure?", ["No cargar todos los detalles de todas las skills en cada ejecución", "Eliminar contexto", "Evitar cualquier tool", "Entrenar desde cero"], 0, "Reduce ruido y conserva contexto para lo que realmente se necesita.", "Avanzado"),
    q("¿Qué problema aparece al combinar muchas skills?", ["Conflictos de instrucciones, permisos y recursos", "El modelo pierde todos sus pesos", "La GPU deja de funcionar", "MCP desaparece"], 0, "La composición necesita precedencia y políticas de aislamiento.", "Experto"),
  ],
  mcp: [
    q("En MCP, ¿qué relación es correcta?", ["Un cliente se conecta a un servidor que expone capacidades", "Un tokenizer se conecta a una GPU", "Un vector DB entrena el modelo", "Una skill reemplaza al servidor"], 0, "MCP define la interoperabilidad entre clientes y servidores de capacidades.", "Intermedio"),
    q("¿Qué cambió en MCP 2026-07-28?", ["El núcleo pasó a ser stateless y se retiró la sesión de protocolo", "Se eliminó tools/call", "MCP dejó de usar JSON-RPC", "Se convirtió en un modelo de lenguaje"], 0, "La revisión 2026-07-28 elimina el handshake y Mcp-Session-Id del núcleo protocolario.", "Avanzado"),
    q("¿Qué son MRTR?", ["Multi Round-Trip Requests para continuar una operación después de solicitar input", "Un nuevo embedding", "Un tipo de quantization", "Un benchmark"], 0, "MRTR permite interacción adicional sin mantener un stream bidireccional permanente.", "Experto"),
    q("¿MCP sustituye la autorización de tu aplicación?", ["No", "Sí, siempre", "Solo para tools destructivas", "Solo con SQLite"], 0, "MCP es interoperabilidad; el runtime sigue imponiendo identidad, permisos y políticas.", "Experto"),
  ],
  safety: [
    q("¿Qué es indirect prompt injection?", ["Instrucciones maliciosas que llegan desde contenido externo", "Un error de tokenizer", "Una cuantización", "Una técnica de RAG"], 0, "Puede llegar desde webs, documentos, emails o resultados de herramientas.", "Intermedio"),
    q("¿Dónde debe vivir la autorización crítica?", ["En el runtime/policy layer", "Solo en el system prompt", "En el modelo sin controles externos", "En el color de la UI"], 0, "Los permisos deben imponerse fuera del modelo.", "Avanzado"),
    q("¿Qué mide una agent eval madura?", ["Resultado, trayectoria, tools, seguridad, costo y latencia", "Solo longitud de respuesta", "Solo BLEU", "Solo temperatura"], 0, "Los agentes requieren evaluación del sistema completo, no solo de texto final.", "Experto"),
  ],
};
