import type { QuizQuestion } from "./components/QuizRunner";

export const SUPPLEMENTAL_PRACTICE: Record<string, QuizQuestion[]> = {
  "posttraining": [
    {
      "question": "¿Qué diferencia principal hay entre SFT y DPO?",
      "options": [
        "SFT aprende de respuestas objetivo; DPO aprende de pares preferido/rechazado",
        "SFT sólo sirve para imágenes; DPO sólo para texto",
        "DPO entrena siempre un reward model separado",
        "No existe ninguna diferencia"
      ],
      "correct": 0,
      "explain": "SFT imita ejemplos supervisados. DPO usa comparaciones de preferencia para aumentar la probabilidad de la respuesta elegida sin entrenar un reward model separado.",
      "difficulty": "Intermedio"
    },
    {
      "question": "¿Para qué sirve un verifier durante el post-training?",
      "options": [
        "Para aumentar el vocabulario",
        "Para comprobar automáticamente si una salida satisface criterios verificables",
        "Para comprimir el tokenizer",
        "Para reemplazar todos los datos de entrenamiento"
      ],
      "correct": 1,
      "explain": "Un verifier aporta una señal objetiva, por ejemplo ejecutar tests o comprobar una respuesta matemática, que puede guiar selección o aprendizaje.",
      "difficulty": "Avanzado"
    }
  ],
  "inference": [
    {
      "question": "¿Qué ocurre durante la fase de prefill de un LLM?",
      "options": [
        "Se procesan en paralelo los tokens del prompt y se construye el KV cache",
        "Se genera únicamente el último token",
        "Se actualizan los pesos del modelo",
        "Se elimina el contexto"
      ],
      "correct": 0,
      "explain": "El prefill procesa el prompt completo con paralelismo; después, el decode genera tokens de forma autoregresiva reutilizando el KV cache.",
      "difficulty": "Intermedio"
    },
    {
      "question": "¿Qué recurso reduce principalmente el KV cache?",
      "options": [
        "El número de capas del navegador",
        "El cómputo repetido de claves y valores de tokens anteriores",
        "El tamaño del archivo CSS",
        "La cantidad de ejemplos de SFT"
      ],
      "correct": 1,
      "explain": "El KV cache conserva claves y valores ya calculados para que cada nuevo token no vuelva a procesar toda la secuencia anterior.",
      "difficulty": "Intermedio"
    }
  ],
  "multimodal": [
    {
      "question": "¿Qué hace un vision encoder en un sistema multimodal?",
      "options": [
        "Convierte píxeles en representaciones que el modelo puede integrar",
        "Genera contraseñas para la imagen",
        "Reemplaza el modelo de lenguaje",
        "Ordena alfabéticamente los píxeles"
      ],
      "correct": 0,
      "explain": "El encoder visual transforma la imagen en embeddings; una proyección o adaptador los alinea con el espacio que consume el modelo de lenguaje.",
      "difficulty": "Básico"
    },
    {
      "question": "¿Qué significa grounding multimodal?",
      "options": [
        "Vincular una respuesta con evidencia concreta de la imagen, audio o video",
        "Traducir siempre al inglés",
        "Aumentar la temperatura",
        "Eliminar el encoder"
      ],
      "correct": 0,
      "explain": "Grounding exige que afirmaciones y referencias correspondan a evidencia observable de la modalidad, reduciendo respuestas inventadas.",
      "difficulty": "Avanzado"
    }
  ],
  "context": [
    {
      "question": "¿Cuál es el objetivo central del context engineering?",
      "options": [
        "Maximizar la señal relevante dentro del presupuesto de tokens",
        "Añadir todos los documentos disponibles",
        "Ocultar instrucciones al modelo",
        "Duplicar cada mensaje"
      ],
      "correct": 0,
      "explain": "Seleccionar, ordenar y comprimir la información útil suele rendir mejor que llenar la ventana con datos redundantes o contradictorios.",
      "difficulty": "Básico"
    },
    {
      "question": "¿Qué describe el problema lost in the middle?",
      "options": [
        "El modelo atiende peor información importante colocada en la zona media de contextos largos",
        "El servidor pierde archivos temporales",
        "El tokenizer elimina palabras cortas",
        "La GPU se apaga durante el entrenamiento"
      ],
      "correct": 0,
      "explain": "En contextos extensos, la información del centro puede recuperarse peor que la del inicio o final; la estructura y el orden del contexto importan.",
      "difficulty": "Avanzado"
    }
  ],
  "memory": [
    {
      "question": "¿Qué diferencia la memoria episódica de la semántica?",
      "options": [
        "La episódica guarda eventos concretos; la semántica conserva hechos generalizados",
        "La episódica sólo existe en GPU",
        "La semántica se borra cada turno",
        "Son exactamente iguales"
      ],
      "correct": 0,
      "explain": "Una memoria episódica registra experiencias con contexto temporal; una semántica consolida conocimientos o preferencias más estables.",
      "difficulty": "Intermedio"
    },
    {
      "question": "¿Qué debe evaluar una política de escritura de memoria?",
      "options": [
        "Utilidad, consentimiento, sensibilidad y tiempo de retención",
        "Sólo la longitud del texto",
        "El color de la interfaz",
        "La temperatura del modelo"
      ],
      "correct": 0,
      "explain": "No todo mensaje debe persistirse. La política debe minimizar datos, respetar consentimiento y definir cuándo actualizar o eliminar recuerdos.",
      "difficulty": "Avanzado"
    }
  ],
  "tools": [
    {
      "question": "¿Quién valida los argumentos de una tool antes de ejecutarla?",
      "options": [
        "El runtime de la aplicación",
        "El tokenizer",
        "La base de embeddings",
        "El usuario después de la ejecución"
      ],
      "correct": 0,
      "explain": "El modelo propone argumentos, pero el runtime debe validarlos contra un esquema, permisos y reglas de negocio antes de producir efectos.",
      "difficulty": "Básico"
    },
    {
      "question": "¿Por qué conviene que una operación con reintentos sea idempotente?",
      "options": [
        "Para que repetirla no duplique el efecto",
        "Para usar más tokens",
        "Para evitar autenticación",
        "Para aumentar la aleatoriedad"
      ],
      "correct": 0,
      "explain": "Si una llamada falla después de ejecutarse, un reintento idempotente evita cobros, mensajes o escrituras duplicadas.",
      "difficulty": "Avanzado"
    }
  ],
  "reasoning": [
    {
      "question": "¿Cuándo es especialmente útil generar varias soluciones candidatas?",
      "options": [
        "Cuando existe un verificador fiable para compararlas",
        "Cuando ninguna respuesta puede evaluarse",
        "Sólo en tareas de traducción",
        "Nunca, porque siempre empeora"
      ],
      "correct": 0,
      "explain": "El test-time compute aporta valor cuando un verificador puede puntuar candidatos y seleccionar o refinar el mejor.",
      "difficulty": "Intermedio"
    },
    {
      "question": "¿Qué riesgo introduce un verifier imperfecto?",
      "options": [
        "Optimizar respuestas que explotan sus errores sin resolver bien la tarea",
        "Eliminar automáticamente la latencia",
        "Garantizar verdad absoluta",
        "Reducir siempre el costo a cero"
      ],
      "correct": 0,
      "explain": "El sistema puede aprender a satisfacer la métrica del verifier y no el objetivo real, una forma de reward hacking.",
      "difficulty": "Avanzado"
    }
  ],
  "skills": [
    {
      "question": "¿Qué aporta progressive disclosure en un catálogo de skills?",
      "options": [
        "Cargar sólo instrucciones relevantes cuando se necesitan",
        "Copiar todas las instrucciones en cada turno",
        "Dar permisos administrativos a todas las tools",
        "Evitar cualquier documentación"
      ],
      "correct": 0,
      "explain": "Descubrir primero metadatos y cargar después la skill seleccionada reduce ruido, costo y conflictos de instrucciones.",
      "difficulty": "Básico"
    },
    {
      "question": "¿Qué hace publicable una skill además de que funcione una vez?",
      "options": [
        "Versionado, contrato claro, pruebas y límites de permisos",
        "Un nombre llamativo únicamente",
        "Ocultar sus dependencias",
        "Usar siempre acceso total"
      ],
      "correct": 0,
      "explain": "Una skill mantenible declara entradas, salidas, permisos, dependencias y casos de prueba para detectar regresiones.",
      "difficulty": "Avanzado"
    }
  ],
  "mcp": [
    {
      "question": "¿Cuál es la diferencia entre una tool y un resource en MCP?",
      "options": [
        "Una tool ejecuta una acción; un resource expone información identificable",
        "Un resource siempre borra datos",
        "Una tool sólo contiene imágenes",
        "No existe diferencia"
      ],
      "correct": 0,
      "explain": "Las tools representan operaciones invocables; los resources permiten leer contenido direccionable mediante URI.",
      "difficulty": "Básico"
    },
    {
      "question": "¿Quién debe imponer autorización al usar una tool MCP?",
      "options": [
        "El host o runtime y el servidor, fuera del modelo",
        "El texto generado por el modelo",
        "El nombre de la tool",
        "El usuario después de que ocurra el efecto"
      ],
      "correct": 0,
      "explain": "Descubrir una tool no equivale a tener permiso. El host y el servidor deben autenticar, autorizar y validar cada operación.",
      "difficulty": "Avanzado"
    }
  ],
  "safety": [
    {
      "question": "¿Cómo debe tratar un agente una instrucción encontrada dentro de una página web?",
      "options": [
        "Como contenido no confiable, no como autoridad del sistema",
        "Como permiso administrativo",
        "Como una nueva system prompt",
        "Como una firma criptográfica"
      ],
      "correct": 0,
      "explain": "El contenido externo puede contener prompt injection indirecta; debe mantenerse separado de las instrucciones y políticas confiables.",
      "difficulty": "Básico"
    },
    {
      "question": "¿Qué evalúa un red team de agentes?",
      "options": [
        "Rutas adversarias, abuso de tools, fugas y fallas de autorización",
        "Sólo la ortografía de la interfaz",
        "El tamaño del monitor",
        "Únicamente la velocidad del tokenizer"
      ],
      "correct": 0,
      "explain": "El red teaming busca cadenas de ataque y efectos reales, incluidos prompt injection, abuso de permisos, exfiltración y recuperación insegura.",
      "difficulty": "Avanzado"
    }
  ],
  "hardware": [
    {
      "question": "¿Cuándo una carga LLM suele ser memory-bound?",
      "options": [
        "Cuando espera mover pesos y KV cache más que ejecutar operaciones",
        "Cuando la CPU no tiene teclado",
        "Cuando el vocabulario está ordenado",
        "Cuando el prompt está en español"
      ],
      "correct": 0,
      "explain": "La inferencia con batch pequeño suele estar limitada por ancho de banda de memoria: mover pesos domina sobre el cómputo.",
      "difficulty": "Intermedio"
    },
    {
      "question": "¿Por qué BF16 suele ser más estable que FP16 durante training?",
      "options": [
        "Conserva un rango de exponente similar a FP32",
        "Tiene 64 bits de precisión",
        "No usa exponentes",
        "Elimina los gradientes"
      ],
      "correct": 0,
      "explain": "BF16 mantiene 8 bits de exponente como FP32, reduciendo overflows y underflows aunque tenga menos bits de mantisa.",
      "difficulty": "Avanzado"
    }
  ],
  "scaling": [
    {
      "question": "¿Qué corrigió Chinchilla respecto a modelos sobredimensionados?",
      "options": [
        "Mostró que, con compute fijo, también hay que escalar suficientes tokens de entrenamiento",
        "Demostró que los datos no importan",
        "Eliminó las GPUs",
        "Recomendó contexto infinito"
      ],
      "correct": 0,
      "explain": "Chinchilla mostró que muchos modelos estaban subentrenados: más datos para un tamaño menor podía superar modelos más grandes con el mismo compute.",
      "difficulty": "Intermedio"
    },
    {
      "question": "¿Qué forma suelen seguir las scaling laws empíricas?",
      "options": [
        "Una ley de potencia entre loss y recursos",
        "Una función aleatoria sin tendencia",
        "Una regla binaria",
        "Una progresión siempre lineal"
      ],
      "correct": 0,
      "explain": "La loss suele decrecer aproximadamente como una ley de potencia al aumentar parámetros, datos o cómputo dentro del régimen medido.",
      "difficulty": "Avanzado"
    }
  ],
  "modern": [
    {
      "question": "¿Qué hace el router en una arquitectura Mixture of Experts?",
      "options": [
        "Selecciona qué expertos procesan cada token",
        "Cambia el idioma del navegador",
        "Entrena el tokenizer desde cero",
        "Duplica todos los expertos siempre"
      ],
      "correct": 0,
      "explain": "El router calcula puntuaciones y activa un subconjunto top-k de expertos, aumentando parámetros totales sin usar todos por token.",
      "difficulty": "Intermedio"
    },
    {
      "question": "¿Qué trade-off introduce la quantization?",
      "options": [
        "Menos memoria y ancho de banda a cambio de posible pérdida de calidad",
        "Más memoria y cero velocidad",
        "Elimina la necesidad de evaluar",
        "Convierte texto en imágenes"
      ],
      "correct": 0,
      "explain": "Reducir la precisión de pesos o activaciones abarata serving, pero una quantization agresiva puede degradar exactitud o estabilidad.",
      "difficulty": "Avanzado"
    }
  ]
};

export const SUPPLEMENTAL_CHALLENGES: Record<string, QuizQuestion[]> = {
  "posttraining": [
    {
      "question": "Un modelo obtiene alta recompensa pero aprende a engañar al evaluador. ¿Qué fenómeno aparece?",
      "options": [
        "Reward hacking",
        "Tokenización byte-level",
        "Continuous batching",
        "Distillation"
      ],
      "correct": 0,
      "explain": "Reward hacking ocurre cuando el modelo explota imperfecciones de la señal de recompensa en lugar de cumplir el objetivo deseado.",
      "difficulty": "Experto"
    },
    {
      "question": "¿Qué dato necesita DPO como unidad básica de entrenamiento?",
      "options": [
        "Un prompt con una respuesta preferida y otra rechazada",
        "Sólo texto sin pares",
        "Gradientes de una GPU remota",
        "Una imagen sin etiqueta"
      ],
      "correct": 0,
      "explain": "DPO optimiza directamente comparaciones de preferencia condicionadas al mismo prompt.",
      "difficulty": "Intermedio"
    }
  ],
  "inference": [
    {
      "question": "¿Qué logra continuous batching en un servidor LLM?",
      "options": [
        "Incorporar y retirar solicitudes del batch mientras se decodifican",
        "Entrenar el modelo entre tokens",
        "Desactivar el KV cache",
        "Fijar un único tamaño de prompt"
      ],
      "correct": 0,
      "explain": "Continuous batching mantiene la GPU ocupada al admitir nuevas secuencias cuando otras terminan, mejorando throughput.",
      "difficulty": "Avanzado"
    },
    {
      "question": "¿Cómo acelera speculative decoding sin cambiar la distribución objetivo?",
      "options": [
        "Un modelo pequeño propone tokens y el grande los verifica en bloques",
        "Elimina el modelo grande",
        "Acepta cualquier token sin revisar",
        "Reduce el vocabulario a dos tokens"
      ],
      "correct": 0,
      "explain": "El modelo objetivo verifica propuestas del draft model; los tokens aceptados conservan la distribución del modelo grande con menos pasos seriales.",
      "difficulty": "Experto"
    }
  ],
  "multimodal": [
    {
      "question": "¿Por qué se necesita alinear representaciones visuales y textuales?",
      "options": [
        "Para que el modelo relacione entidades y conceptos entre modalidades",
        "Para convertir toda imagen en ASCII",
        "Para borrar el texto",
        "Para evitar cualquier entrenamiento"
      ],
      "correct": 0,
      "explain": "La alineación hace que evidencia visual y lenguaje ocupen representaciones compatibles para atención y generación condicionada.",
      "difficulty": "Avanzado"
    },
    {
      "question": "¿Qué reduce mejor una alucinación visual?",
      "options": [
        "Exigir evidencia localizada y permitir abstención cuando no existe",
        "Subir siempre la temperatura",
        "Ocultar la imagen",
        "Añadir una instrucción de responder con confianza"
      ],
      "correct": 0,
      "explain": "Grounding, verificación y abstención reducen afirmaciones no sustentadas por la entrada multimodal.",
      "difficulty": "Experto"
    }
  ],
  "context": [
    {
      "question": "¿Por qué conviene conservar provenance al construir contexto?",
      "options": [
        "Permite rastrear cada afirmación a su fuente y resolver conflictos",
        "Aumenta el vocabulario",
        "Sustituye autenticación",
        "Evita cualquier latencia"
      ],
      "correct": 0,
      "explain": "La procedencia ayuda a citar, depurar y decidir qué fuente confiar cuando hay información contradictoria.",
      "difficulty": "Avanzado"
    },
    {
      "question": "Dos fuentes confiables se contradicen. ¿Qué debe hacer el sistema?",
      "options": [
        "Explicitar el conflicto, aplicar reglas de frescura/autoridad y evitar inventar una síntesis",
        "Elegir al azar sin decirlo",
        "Concatenar ambas como si coincidieran",
        "Eliminar todas las fuentes"
      ],
      "correct": 0,
      "explain": "Los conflictos requieren políticas claras y trazabilidad; ocultarlos produce respuestas seguras en apariencia pero poco fiables.",
      "difficulty": "Experto"
    }
  ],
  "memory": [
    {
      "question": "¿Qué debe ocurrir cuando una preferencia nueva contradice una memoria antigua?",
      "options": [
        "Aplicar una política de actualización con versión, fecha y procedencia",
        "Conservar ambas como verdad sin contexto",
        "Borrar toda la cuenta",
        "Modificar los pesos del LLM"
      ],
      "correct": 0,
      "explain": "Versionar recuerdos y conservar procedencia permite resolver cambios del usuario sin acumular estado contradictorio.",
      "difficulty": "Avanzado"
    },
    {
      "question": "¿Qué control evita que la memoria de un usuario aparezca en la sesión de otro?",
      "options": [
        "Aislamiento por identidad y autorización en cada lectura",
        "Una temperatura baja",
        "Un prompt más largo",
        "El KV cache"
      ],
      "correct": 0,
      "explain": "La separación de tenants debe imponerse en almacenamiento y autorización, no confiarse al modelo.",
      "difficulty": "Experto"
    }
  ],
  "tools": [
    {
      "question": "Un cobro fue procesado pero la respuesta se perdió. ¿Cómo debe reintentarse?",
      "options": [
        "Con una clave de idempotencia que devuelva el resultado original",
        "Enviando el cobro repetidamente",
        "Desactivando logs",
        "Cambiando de modelo"
      ],
      "correct": 0,
      "explain": "La idempotencia permite repetir de forma segura una operación cuyo resultado de red es incierto.",
      "difficulty": "Avanzado"
    },
    {
      "question": "¿Qué principio limita el daño si un agente es comprometido?",
      "options": [
        "Mínimo privilegio y permisos por operación",
        "Acceso administrativo permanente",
        "Más temperatura",
        "Ocultar los nombres de tools"
      ],
      "correct": 0,
      "explain": "Conceder sólo las capacidades necesarias reduce el impacto de prompt injection, errores y abuso.",
      "difficulty": "Experto"
    }
  ],
  "reasoning": [
    {
      "question": "¿Qué debe considerar una política de parada en test-time compute?",
      "options": [
        "Ganancia esperada de calidad frente a costo y latencia",
        "Sólo el número de colores en la UI",
        "Siempre generar infinitos candidatos",
        "Nunca usar verificadores"
      ],
      "correct": 0,
      "explain": "Más cómputo deja de ser rentable cuando la mejora marginal es menor que el costo o viola el presupuesto de latencia.",
      "difficulty": "Avanzado"
    },
    {
      "question": "¿Cómo puede un verifier introducir sesgo sistemático?",
      "options": [
        "Premiando un estilo fácil de medir aunque no sea la mejor solución",
        "Aumentando la memoria de la GPU",
        "Ordenando tokens",
        "Comprimiendo imágenes"
      ],
      "correct": 0,
      "explain": "Si la métrica favorece ciertos formatos o atajos, el sistema optimiza esa preferencia y puede degradar el objetivo real.",
      "difficulty": "Experto"
    }
  ],
  "skills": [
    {
      "question": "¿Por qué no conviene cargar 40 skills completas en cada prompt?",
      "options": [
        "Aumenta ruido, costo y conflictos de instrucciones",
        "Reduce el contexto usado",
        "Garantiza elegir la correcta",
        "Mejora siempre la seguridad"
      ],
      "correct": 0,
      "explain": "La carga bajo demanda mantiene el contexto relevante y hace más auditable la selección de capacidades.",
      "difficulty": "Intermedio"
    },
    {
      "question": "¿Qué riesgo de supply chain existe al instalar una skill de terceros?",
      "options": [
        "Que sus instrucciones, scripts o dependencias ejecuten acciones no esperadas",
        "Que use un nombre corto",
        "Que tenga documentación",
        "Que incluya pruebas"
      ],
      "correct": 0,
      "explain": "Las skills deben revisarse, fijarse por versión y ejecutarse con permisos mínimos porque pueden incorporar código y dependencias.",
      "difficulty": "Experto"
    }
  ],
  "mcp": [
    {
      "question": "En MCP, ¿qué relación describe mejor host, client y server?",
      "options": [
        "El host contiene clientes que mantienen sesiones con servidores de capacidades",
        "El server controla siempre toda la aplicación",
        "El client es una base de datos",
        "Los tres nombres son sinónimos"
      ],
      "correct": 0,
      "explain": "El host coordina la experiencia y las políticas; cada cliente conecta con un servidor que expone tools, resources o prompts.",
      "difficulty": "Avanzado"
    }
  ],
  "safety": [
    {
      "question": "¿Por qué un prompt no es una frontera de autorización?",
      "options": [
        "Porque el modelo puede equivocarse o ser manipulado; los permisos deben imponerse en el runtime",
        "Porque los prompts no admiten texto",
        "Porque sólo funcionan offline",
        "Porque sustituyen al servidor"
      ],
      "correct": 0,
      "explain": "Las acciones sensibles requieren controles deterministas fuera del modelo: identidad, autorización, validación y confirmación.",
      "difficulty": "Experto"
    },
    {
      "question": "¿Qué mejora la cobertura de una evaluación de seguridad?",
      "options": [
        "Casos adversarios variados, cambios de distribución y pruebas de extremo a extremo",
        "Probar una sola frase conocida",
        "Evaluar únicamente respuestas exitosas",
        "Eliminar logs"
      ],
      "correct": 0,
      "explain": "Una suite diversa encuentra fallas que no aparecen en ejemplos felices y permite medir regresiones de manera repetible.",
      "difficulty": "Avanzado"
    }
  ]
};
