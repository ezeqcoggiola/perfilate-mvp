// ============================================================
//  Perfilate — datos de mentira (mock)
//  Nada de esto viene de una base de datos. Es todo fijo y vive
//  en memoria. El "recomendador" es similitud coseno entre el
//  vector de pesos del usuario y el vector de cada ruta.
// ============================================================

// Las 5 dimensiones sobre las que se describe un perfil y una ruta.
export const DIMENSIONS = [
  { key: "prog", label: "Programacion y desarrollo", short: "Programacion" },
  { key: "stats", label: "Estadistica y matematica", short: "Estadistica" },
  { key: "infra", label: "Infraestructura y datos a escala", short: "Infraestructura" },
  { key: "comm", label: "Comunicacion y visualizacion", short: "Comunicacion" },
  { key: "research", label: "Investigacion e IA", short: "Investigacion" },
];

// Temas de ruta: vocabulario controlado para etiquetar y filtrar rutas.
// (Distinto de las 5 dimensiones y de los "temas" de contenido de un recurso.)
export const TEMAS = [
  { id: 1, name: "Programacion" },
  { id: 2, name: "Estadistica y matematica" },
  { id: 3, name: "Bases de datos y SQL" },
  { id: 4, name: "Visualizacion y BI" },
  { id: 5, name: "Cloud e infraestructura" },
  { id: 6, name: "Machine Learning" },
  { id: 7, name: "Deep Learning e IA" },
  { id: 8, name: "MLOps y produccion" },
  { id: 9, name: "Investigacion" },
  { id: 10, name: "Analitica de negocio" },
  { id: 11, name: "Bioinformatica y genomica" },
  { id: 12, name: "Ciencias de la salud y epidemiologia" },
  { id: 13, name: "Computacion cientifica" },
];

// Las rutas. Los vectores (0-100) son a mano. Los recursos son el contenido
// inicial del catalogo (de aca se siembra el store admin).
// Formato de recurso:
//   duration: { mode:"horas", hours } | { mode:"semanas", weeks, hoursPerWeek }
//   contents: [{ tema, items: [] }]
//   relation: { description, dims:[keys], topics:[titulos de tema] }
//   origin:   { provider, kind, partOf } | null
export const ROUTES = [
  {
    id: "analista",
    name: "Analista de Datos",
    profile: "Data Analyst",
    color: "#5B4BE0",
    summary:
      "Convertis datos en decisiones. Fuerte en estadistica descriptiva, SQL y sobre todo en contar la historia que hay detras de los numeros.",
    weights: { prog: 40, stats: 70, infra: 20, comm: 90, research: 25 },
    temas: [2, 3, 4, 10],
    resources: [
      {
        id: "r1", type: "Curso", name: "SQL para analisis de datos", level: "Inicial",
        duration: { mode: "horas", hours: 30 },
        description: "Aprendes a consultar bases de datos relacionales con SQL: filtrar, agrupar, unir tablas y responder preguntas de negocio con datos.",
        contents: [
          { tema: "Fundamentos de SQL", items: ["SELECT, WHERE y ORDER BY", "Tipos de datos y operadores"] },
          { tema: "Combinar tablas", items: ["INNER y LEFT JOIN", "Relaciones entre tablas"] },
          { tema: "Resumir datos", items: ["Agregaciones y GROUP BY", "Subconsultas y CTEs"] },
        ],
        relation: { description: "Es la herramienta base para extraer y preparar los datos que despues vas a analizar y comunicar.", dims: ["prog", "comm"], topics: ["Combinar tablas", "Resumir datos"] },
        origin: { provider: "DataCamp", kind: "Plataforma", partOf: "" },
        link: "https://cursos.perfilate.demo/sql-analisis",
        rating: { avg: 4.7, count: 214 },
      },
      {
        id: "r2", type: "Materia", name: "Estadistica descriptiva e inferencial", level: "Inicial",
        duration: { mode: "semanas", weeks: 16, hoursPerWeek: 4 },
        description: "Fundamentos de estadistica para describir datos y sacar conclusiones: medidas, distribuciones, pruebas de hipotesis e intervalos.",
        contents: [
          { tema: "Estadistica descriptiva", items: ["Medidas de tendencia y dispersion", "Distribuciones"] },
          { tema: "Inferencia", items: ["Pruebas de hipotesis", "Intervalos de confianza"] },
        ],
        relation: { description: "Da el marco para interpretar correctamente los numeros antes de comunicarlos.", dims: ["stats", "comm"], topics: ["Inferencia"] },
        origin: { provider: "UNSAM", kind: "Universidad", partOf: "Lic. en Ciencia de Datos" },
        link: "https://cursos.perfilate.demo/estadistica",
        rating: { avg: 4.4, count: 156 },
      },
      {
        id: "r3", type: "Curso", name: "Visualizacion con Power BI / Looker", level: "Intermedio",
        duration: { mode: "horas", hours: 25 },
        description: "Construis tableros claros y accionables con herramientas de BI, conectando fuentes de datos y disenando metricas.",
        contents: [
          { tema: "Conexion y modelado", items: ["Conexion a fuentes de datos", "Modelado y metricas"] },
          { tema: "Tableros", items: ["Diseno de tableros", "Publicacion y permisos"] },
        ],
        relation: { description: "Convierte tu analisis en tableros que otros pueden explorar.", dims: ["comm", "prog"], topics: ["Tableros"] },
        origin: { provider: "Microsoft Learn", kind: "Plataforma", partOf: "" },
        link: "https://cursos.perfilate.demo/bi",
        rating: { avg: 4.5, count: 132 },
      },
      {
        id: "r4", type: "Curso", name: "Storytelling con datos", level: "Intermedio",
        duration: { mode: "horas", hours: 20 },
        description: "Aprendes a contar la historia detras de los numeros: elegir el grafico correcto, ordenar el mensaje y persuadir con datos.",
        contents: [
          { tema: "Elegir el grafico", items: ["Eleccion de visualizaciones", "Foco visual"] },
          { tema: "Narrativa", items: ["Narrativa y audiencia", "Presentaciones efectivas"] },
        ],
        relation: { description: "Cierra la ruta Analista: comunicar para que el analisis genere decisiones.", dims: ["comm"], topics: ["Narrativa"] },
        origin: null,
        link: "https://cursos.perfilate.demo/storytelling",
        rating: { avg: 4.8, count: 98 },
      },
    ],
  },
  {
    id: "engineer",
    name: "Data Engineer",
    profile: "Data Engineer",
    color: "#2BA9C9",
    summary:
      "Construis las canerias por donde fluyen los datos. Pipelines, modelado, cloud y sistemas que aguantan volumen.",
    weights: { prog: 80, stats: 35, infra: 95, comm: 30, research: 20 },
    temas: [1, 3, 5, 8],
    resources: [
      {
        id: "r5", type: "Curso", name: "Modelado de datos y data warehousing", level: "Intermedio",
        duration: { mode: "horas", hours: 35 },
        description: "Disenas esquemas para almacenar datos a escala: modelos dimensionales, normalizacion y data warehouses.",
        contents: [
          { tema: "Modelado dimensional", items: ["Modelo estrella y copo de nieve", "Hechos y dimensiones"] },
          { tema: "Almacenamiento", items: ["Normalizacion vs desnormalizacion", "Data warehouse vs data lake"] },
        ],
        relation: { description: "Define la estructura sobre la que corren los pipelines de la ruta.", dims: ["infra", "prog"], topics: ["Modelado dimensional"] },
        origin: { provider: "Coursera", kind: "Plataforma", partOf: "Data Engineering Specialization" },
        link: "https://cursos.perfilate.demo/data-warehousing",
        rating: { avg: 4.3, count: 87 },
      },
      {
        id: "r6", type: "Curso", name: "ETL/ELT y orquestacion", level: "Intermedio",
        duration: { mode: "horas", hours: 40 },
        description: "Armas pipelines que mueven y transforman datos de forma confiable, y los orquestas para que corran solos.",
        contents: [
          { tema: "Pipelines", items: ["Extraccion e ingesta", "Transformaciones y calidad"] },
          { tema: "Orquestacion", items: ["Orquestacion con DAGs", "Monitoreo y reintentos"] },
        ],
        relation: { description: "Es el trabajo diario del Data Engineer: mover y transformar datos de forma confiable.", dims: ["infra", "prog"], topics: ["Pipelines", "Orquestacion"] },
        origin: { provider: "Udemy", kind: "Plataforma", partOf: "" },
        link: "https://cursos.perfilate.demo/etl",
        rating: { avg: 4.6, count: 110 },
      },
      {
        id: "r7", type: "Certificacion", name: "Fundamentos de cloud para datos", level: "Intermedio",
        duration: { mode: "horas", hours: 40 },
        description: "Conoces los servicios de nube para datos: almacenamiento, computo y bases administradas, con foco en costos y escala.",
        contents: [
          { tema: "Servicios base", items: ["Almacenamiento de objetos", "Bases administradas"] },
          { tema: "Operacion", items: ["Computo elastico", "Costos y seguridad basica"] },
        ],
        relation: { description: "Provee el entorno donde se ejecutan los pipelines a escala.", dims: ["infra"], topics: ["Servicios base"] },
        origin: { provider: "AWS", kind: "Certificacion", partOf: "" },
        link: "https://cursos.perfilate.demo/cloud-datos",
        rating: { avg: 4.2, count: 76 },
      },
    ],
  },
  {
    id: "mle",
    name: "Machine Learning Engineer",
    profile: "ML Engineer",
    color: "#7C5CFF",
    summary:
      "Llevas modelos del notebook a produccion. Mezcla de programacion solida, estadistica y algo de infraestructura.",
    weights: { prog: 90, stats: 75, infra: 60, comm: 35, research: 60 },
    temas: [1, 2, 6, 8],
    resources: [
      {
        id: "r8", type: "Materia", name: "Aprendizaje automatico", level: "Intermedio",
        duration: { mode: "semanas", weeks: 16, hoursPerWeek: 5 },
        description: "Introduccion a los modelos de machine learning: regresion, clasificacion, evaluacion y como evitar el sobreajuste.",
        contents: [
          { tema: "Aprendizaje supervisado", items: ["Regresion y clasificacion", "Metricas de evaluacion"] },
          { tema: "Generalizacion", items: ["Validacion cruzada", "Sesgo y varianza"] },
        ],
        relation: { description: "Es la base teorica que la ruta despues lleva a produccion.", dims: ["prog", "stats", "research"], topics: ["Aprendizaje supervisado"] },
        origin: { provider: "UNSAM", kind: "Universidad", partOf: "Lic. en Ciencia de Datos" },
        link: "https://cursos.perfilate.demo/machine-learning",
        rating: { avg: 4.5, count: 189 },
      },
      {
        id: "r9", type: "Curso", name: "MLOps y despliegue de modelos", level: "Avanzado",
        duration: { mode: "horas", hours: 50 },
        description: "Llevas modelos del notebook a produccion: empaquetado, servido, versionado y monitoreo del rendimiento.",
        contents: [
          { tema: "Servir modelos", items: ["Empaquetado y APIs", "CI/CD para ML"] },
          { tema: "Operacion", items: ["Versionado de datos y modelos", "Monitoreo y reentrenamiento"] },
        ],
        relation: { description: "Define a la ruta ML Engineer: que el modelo funcione fuera del experimento.", dims: ["prog", "infra"], topics: ["Servir modelos", "Operacion"] },
        origin: { provider: "Coursera", kind: "Plataforma", partOf: "MLOps Specialization" },
        link: "https://cursos.perfilate.demo/mlops",
        rating: { avg: 4.7, count: 64 },
      },
      {
        id: "r10", type: "Curso", name: "Ingenieria de features", level: "Intermedio",
        duration: { mode: "horas", hours: 25 },
        description: "Transformas datos crudos en variables utiles para los modelos: limpieza, codificacion y creacion de features.",
        contents: [
          { tema: "Preparacion", items: ["Limpieza y nulos", "Codificacion de variables"] },
          { tema: "Transformacion", items: ["Escalado y normalizacion", "Creacion de features"] },
        ],
        relation: { description: "Mejora la calidad de los modelos antes de entrenarlos.", dims: ["prog", "stats"], topics: ["Transformacion"] },
        origin: null,
        link: "https://cursos.perfilate.demo/feature-engineering",
        rating: { avg: 4.4, count: 71 },
      },
      {
        id: "r11", type: "Posgrado", name: "Especializacion en sistemas de ML", level: "Avanzado",
        duration: { mode: "semanas", weeks: 32, hoursPerWeek: 8 },
        description: "Programa avanzado sobre el diseno de sistemas de machine learning completos, de los datos al servicio en produccion.",
        contents: [
          { tema: "Arquitectura", items: ["Arquitectura de sistemas de ML", "Pipelines de datos para ML"] },
          { tema: "Produccion", items: ["Escalabilidad y latencia", "Casos de produccion"] },
        ],
        relation: { description: "Es el paso de profundizacion para roles senior de la ruta.", dims: ["prog", "infra", "research"], topics: ["Arquitectura"] },
        origin: { provider: "Instituto Tecnologico", kind: "Universidad", partOf: "Posgrado en IA" },
        link: "https://posgrados.perfilate.demo/sistemas-ml",
        rating: { avg: 4.6, count: 28 },
      },
    ],
  },
  {
    id: "research",
    name: "Investigador/a en IA",
    profile: "AI Researcher",
    color: "#FF6B57",
    summary:
      "Empujas la frontera. Fuerte en estadistica y matematica, lectura de papers y experimentacion con modelos nuevos.",
    weights: { prog: 70, stats: 90, infra: 30, comm: 40, research: 95 },
    temas: [2, 6, 7, 9, 13],
    resources: [
      {
        id: "r12", type: "Materia", name: "Probabilidad y procesos estocasticos", level: "Avanzado",
        duration: { mode: "semanas", weeks: 16, hoursPerWeek: 5 },
        description: "Fundamentos probabilisticos que sostienen los modelos modernos de IA: variables aleatorias, cadenas de Markov y procesos.",
        contents: [
          { tema: "Probabilidad", items: ["Variables aleatorias", "Esperanza y varianza"] },
          { tema: "Procesos", items: ["Cadenas de Markov", "Procesos estocasticos"] },
        ],
        relation: { description: "Da la base matematica para leer y crear modelos de IA.", dims: ["stats", "research"], topics: ["Procesos"] },
        origin: { provider: "UNSAM", kind: "Universidad", partOf: "Lic. en Matematica" },
        link: "https://cursos.perfilate.demo/probabilidad",
        rating: { avg: 4.3, count: 54 },
      },
      {
        id: "r13", type: "Curso", name: "Deep learning desde cero", level: "Avanzado",
        duration: { mode: "horas", hours: 60 },
        description: "Construis redes neuronales desde los fundamentos: backpropagation, arquitecturas y entrenamiento de modelos profundos.",
        contents: [
          { tema: "Fundamentos", items: ["Perceptron y backpropagation", "Regularizacion y optimizacion"] },
          { tema: "Arquitecturas", items: ["Redes convolucionales", "Redes recurrentes y atencion"] },
        ],
        relation: { description: "Nucleo tecnico para experimentar con modelos nuevos.", dims: ["research", "prog", "stats"], topics: ["Arquitecturas"] },
        origin: { provider: "fast.ai", kind: "Plataforma", partOf: "" },
        link: "https://cursos.perfilate.demo/deep-learning",
        rating: { avg: 4.8, count: 142 },
      },
      {
        id: "r14", type: "Posgrado", name: "Maestria en Inteligencia Artificial", level: "Avanzado",
        duration: { mode: "semanas", weeks: 64, hoursPerWeek: 10 },
        description: "Programa academico completo en IA: teoria, investigacion y aplicacion, con foco en publicar y empujar la frontera.",
        contents: [
          { tema: "Formacion avanzada", items: ["Aprendizaje profundo avanzado", "Metodologia de investigacion"] },
          { tema: "Investigacion", items: ["Lectura y escritura de papers", "Tesis o proyecto final"] },
        ],
        relation: { description: "Culminacion de la ruta hacia un perfil de investigacion.", dims: ["research", "stats"], topics: ["Investigacion"] },
        origin: { provider: "Universidad de Buenos Aires", kind: "Universidad", partOf: "Maestria en IA" },
        link: "https://posgrados.perfilate.demo/maestria-ia",
        rating: { avg: 4.7, count: 19 },
      },
    ],
  },
  {
    id: "bioinfo",
    name: "Bioinformatico/a",
    profile: "Bioinformatics",
    color: "#3FA66A",
    summary:
      "Analizas datos biologicos a gran escala —genomas, secuencias, proteinas— cruzando programacion, estadistica y biologia para responder preguntas de la vida.",
    weights: { prog: 75, stats: 85, infra: 45, comm: 35, research: 80 },
    temas: [11, 2, 1, 6, 9, 13],
    resources: [
      {
        id: "r15", type: "Curso", name: "Introduccion a la bioinformatica", level: "Inicial",
        duration: { mode: "horas", hours: 30 },
        description: "Primer contacto con el analisis de datos biologicos: bases de datos biologicas, formatos de secuencias y herramientas del area.",
        contents: [
          { tema: "Fundamentos", items: ["Bases de datos biologicas", "Formatos de secuencias"] },
          { tema: "Herramientas", items: ["Alineamiento basico", "Busqueda con BLAST"] },
        ],
        relation: { description: "Punto de entrada a la ruta: el vocabulario y las herramientas base de la bioinformatica.", dims: ["prog", "research"], topics: ["Fundamentos"] },
        origin: { provider: "EMBL-EBI", kind: "Plataforma", partOf: "" },
        link: "https://cursos.perfilate.demo/intro-bioinformatica",
        rating: { avg: 4.5, count: 64 },
      },
      {
        id: "r16", type: "Materia", name: "Analisis de secuencias y genomica", level: "Intermedio",
        duration: { mode: "semanas", weeks: 16, hoursPerWeek: 4 },
        description: "Metodos para analizar secuencias de ADN/ARN y genomas completos, del alineamiento al llamado de variantes.",
        contents: [
          { tema: "Secuencias", items: ["Alineamiento de secuencias", "Ensamblado de genomas"] },
          { tema: "Variantes", items: ["Llamado de variantes", "Anotacion funcional"] },
        ],
        relation: { description: "Nucleo de la ruta: el trabajo concreto con datos genomicos.", dims: ["stats", "research", "prog"], topics: ["Secuencias"] },
        origin: { provider: "UNSAM", kind: "Universidad", partOf: "Lic. en Biotecnologia" },
        link: "https://cursos.perfilate.demo/genomica",
        rating: { avg: 4.4, count: 38 },
      },
      {
        id: "r17", type: "Materia", name: "Bioestadistica", level: "Intermedio",
        duration: { mode: "semanas", weeks: 16, hoursPerWeek: 4 },
        description: "Estadistica aplicada a datos biologicos y experimentales, con foco en datos omicos.",
        contents: [
          { tema: "Inferencia", items: ["Pruebas de hipotesis", "Modelos lineales"] },
          { tema: "Datos omicos", items: ["Correccion por comparaciones multiples", "Analisis de expresion"] },
        ],
        relation: { description: "Da el rigor estadistico para no sacar conclusiones falsas de los datos biologicos.", dims: ["stats", "research"], topics: ["Inferencia"] },
        origin: { provider: "UNSAM", kind: "Universidad", partOf: "Lic. en Ciencia de Datos" },
        link: "https://cursos.perfilate.demo/bioestadistica",
        rating: { avg: 4.3, count: 41 },
      },
      {
        id: "r18", type: "Curso", name: "Machine learning aplicado a biologia", level: "Avanzado",
        duration: { mode: "horas", hours: 45 },
        description: "Modelos de ML para problemas biologicos: clasificacion de secuencias, reduccion de dimensionalidad y prediccion de estructura.",
        contents: [
          { tema: "Modelos", items: ["Clasificacion de secuencias", "Reduccion de dimensionalidad"] },
          { tema: "Aplicaciones", items: ["Prediccion de estructura", "Analisis de single-cell"] },
        ],
        relation: { description: "Lleva la ruta a la frontera: aprender patrones de datos biologicos complejos.", dims: ["prog", "research", "stats"], topics: ["Modelos"] },
        origin: { provider: "Coursera", kind: "Plataforma", partOf: "" },
        link: "https://cursos.perfilate.demo/ml-biologia",
        rating: { avg: 4.6, count: 52 },
      },
    ],
  },
  {
    id: "health",
    name: "Cientifico/a de Datos en Salud",
    profile: "Health Data Scientist",
    color: "#D6597A",
    summary:
      "Usas datos clinicos y epidemiologicos para mejorar decisiones en salud: bioestadistica, analisis de poblaciones y modelos de prevencion y diagnostico.",
    weights: { prog: 55, stats: 90, infra: 40, comm: 70, research: 70 },
    temas: [12, 2, 4, 6, 9],
    resources: [
      {
        id: "r19", type: "Materia", name: "Fundamentos de epidemiologia", level: "Inicial",
        duration: { mode: "semanas", weeks: 16, hoursPerWeek: 3 },
        description: "Como se estudian la salud y la enfermedad en poblaciones: medidas, disenos de estudio y causalidad.",
        contents: [
          { tema: "Medidas", items: ["Incidencia y prevalencia", "Riesgo relativo y odds ratio"] },
          { tema: "Disenos", items: ["Cohortes y casos-control", "Sesgos y confusion"] },
        ],
        relation: { description: "Marco conceptual de la ruta: pensar la salud a nivel poblacional.", dims: ["stats", "research"], topics: ["Medidas"] },
        origin: { provider: "UNSAM", kind: "Universidad", partOf: "Salud Colectiva" },
        link: "https://cursos.perfilate.demo/epidemiologia",
        rating: { avg: 4.4, count: 47 },
      },
      {
        id: "r20", type: "Materia", name: "Bioestadistica aplicada a la salud", level: "Intermedio",
        duration: { mode: "semanas", weeks: 16, hoursPerWeek: 4 },
        description: "Metodos estadisticos para datos de salud: regresion, modelos de supervivencia y datos longitudinales.",
        contents: [
          { tema: "Regresion", items: ["Regresion logistica", "Modelos de supervivencia"] },
          { tema: "Longitudinal", items: ["Datos repetidos", "Modelos mixtos"] },
        ],
        relation: { description: "El corazon cuantitativo de la ruta: analizar datos clinicos correctamente.", dims: ["stats", "research"], topics: ["Regresion"] },
        origin: { provider: "Coursera", kind: "Plataforma", partOf: "Biostatistics Specialization" },
        link: "https://cursos.perfilate.demo/bioestadistica-salud",
        rating: { avg: 4.5, count: 39 },
      },
      {
        id: "r21", type: "Curso", name: "Analisis de datos clinicos con R/Python", level: "Intermedio",
        duration: { mode: "horas", hours: 35 },
        description: "Manejo y analisis de datos clinicos reales con R o Python, de la limpieza al reporte reproducible.",
        contents: [
          { tema: "Datos clinicos", items: ["Limpieza de historias clinicas", "Datos faltantes"] },
          { tema: "Reportes", items: ["Visualizacion clinica", "Reportes reproducibles"] },
        ],
        relation: { description: "La parte practica: tocar datos clinicos de verdad y comunicarlos.", dims: ["prog", "comm"], topics: ["Reportes"] },
        origin: { provider: "DataCamp", kind: "Plataforma", partOf: "" },
        link: "https://cursos.perfilate.demo/datos-clinicos",
        rating: { avg: 4.3, count: 33 },
      },
      {
        id: "r22", type: "Curso", name: "Modelos predictivos en salud", level: "Avanzado",
        duration: { mode: "horas", hours: 40 },
        description: "Construccion y validacion de modelos para prediccion de riesgo y diagnostico, con foco en interpretabilidad y equidad.",
        contents: [
          { tema: "Modelado", items: ["Modelos de riesgo", "Validacion y calibracion"] },
          { tema: "Cuidados", items: ["Interpretabilidad", "Equidad y sesgos"] },
        ],
        relation: { description: "Lleva la ruta a la accion: modelos que apoyan decisiones clinicas.", dims: ["stats", "research", "prog"], topics: ["Modelado"] },
        origin: { provider: "edX", kind: "Plataforma", partOf: "" },
        link: "https://cursos.perfilate.demo/modelos-salud",
        rating: { avg: 4.5, count: 29 },
      },
    ],
  },
];

// ---------- Catalogos para el onboarding manual ----------
// Todo esto es CONTEXTO del perfil: no entra al calculo de afinidad
// (solo los pesos de DIMENSIONS lo hacen). Sin acentos, como el resto.

export const SITUACIONES = [
  "Estudiante",
  "Por terminar mis estudios",
  "Graduado/a",
  "Profesional en ejercicio",
];

export const AREAS_SUGERIDAS = [
  "Ciencia de Datos",
  "Ingenieria",
  "Matematica",
  "Sistemas",
  "Economia",
  "Fisica",
  "Biologia",
  "Medicina",
];

// Objetivo del usuario (contexto del perfil, no afecta la afinidad).
export const METAS = [
  "Conseguir mi primer empleo en datos",
  "Cambiar de carrera hacia datos",
  "Especializarme en un rol especifico",
  "Crecer en mi rol actual (subir de nivel)",
  "Orientarme a investigacion / academia",
  "Todavia estoy explorando",
];

export const PERFILES_OBJETIVO = [
  "Analista de Datos",
  "Data Engineer",
  "Machine Learning Engineer",
  "Investigador/a en IA",
  "Bioinformatico/a",
  "Cientifico/a de Datos en Salud",
  "Aun no lo se",
];

// Tipos de origen para un recurso (quien lo dicta).
export const ORIGEN_TIPOS = ["Universidad", "Plataforma", "Editorial", "Certificacion", "Otro"];

// Rangos para filtrar rutas por duracion total (en semanas).
export const DURACION_FILTROS = [
  { key: "corta", label: "Corta (hasta 20 sem)" },
  { key: "media", label: "Media (21 a 40 sem)" },
  { key: "larga", label: "Larga (mas de 40 sem)" },
];

// Habilidades agrupadas por categoria. El perfil guarda los ids seleccionados.
export const SKILLS = [
  {
    category: "Lenguajes y bases",
    items: [
      { id: "python", label: "Python" },
      { id: "sql", label: "SQL" },
    ],
  },
  {
    category: "Estadistica y matematica",
    items: [
      { id: "stats", label: "Estadistica" },
      { id: "prob", label: "Probabilidad" },
    ],
  },
  {
    category: "Visualizacion y comunicacion",
    items: [
      { id: "viz", label: "Visualizacion / BI (Power BI, Looker)" },
      { id: "storytelling", label: "Storytelling con datos" },
    ],
  },
  {
    category: "Datos a escala",
    items: [
      { id: "datamodel", label: "Modelado de datos / Data warehousing" },
      { id: "etl", label: "ETL y orquestacion" },
      { id: "cloud", label: "Cloud para datos" },
    ],
  },
  {
    category: "Machine learning e IA",
    items: [
      { id: "ml", label: "Machine learning" },
      { id: "features", label: "Ingenieria de features" },
      { id: "deeplearning", label: "Deep learning" },
      { id: "nlp", label: "NLP" },
      { id: "mlops", label: "MLOps / despliegue" },
    ],
  },
];

// Perfil de ejemplo precargado (para cuando entras sin hacer onboarding).
export const SAMPLE_PROFILE = {
  name: "Ezequiel",
  headline: "Estudiante de Ciencia de Datos · UNSAM",
  weights: { prog: 70, stats: 65, infra: 40, comm: 55, research: 50 },
  interests: ["Python", "NLP", "Bases de datos", "Visualizacion"],
  situacion: "Estudiante",
  areaOrigen: "Ciencia de Datos",
  meta: "Conseguir mi primer empleo en datos",
  perfilObjetivo: "Analista de Datos",
  skills: ["python", "sql", "stats", "viz", "nlp"],
};

// ---------- El "motor" de mentira ----------
export function cosineAffinity(a, b) {
  let dot = 0, na = 0, nb = 0;
  for (const { key } of DIMENSIONS) {
    const x = a[key] ?? 0;
    const y = b[key] ?? 0;
    dot += x * y;
    na += x * x;
    nb += y * y;
  }
  if (na === 0 || nb === 0) return 0;
  return dot / (Math.sqrt(na) * Math.sqrt(nb)); // 0..1
}

export function rankRoutes(profileWeights, routes = ROUTES) {
  return routes.map((route) => ({
    route,
    score: Math.round(cosineAffinity(profileWeights, route.weights) * 100),
  })).sort((x, y) => y.score - x.score);
}

export function buildReason(profileWeights, route) {
  const matches = DIMENSIONS.map((d) => ({
    label: d.short.toLowerCase(),
    pull: (profileWeights[d.key] ?? 0) * (route.weights[d.key] ?? 0),
  }))
    .sort((a, b) => b.pull - a.pull)
    .slice(0, 2)
    .map((m) => m.label);
  return `Coincide con tu interes en ${matches[0]} y ${matches[1]}.`;
}

// ---------- Duracion y stats de ruta ----------
// Ritmo de referencia para convertir cursos "a tu ritmo" (horas) en semanas.
export const RITMO_SEMANAL = 6;

// Texto legible de la duracion de un recurso.
export function formatDuration(d) {
  if (!d) return "";
  if (d.mode === "semanas") {
    if (!d.weeks) return "";
    return d.hoursPerWeek ? `${d.weeks} semanas · ${d.hoursPerWeek} h/sem` : `${d.weeks} semanas`;
  }
  if (d.mode === "horas") return d.hours ? `${d.hours} h (a tu ritmo)` : "";
  return "";
}

// Semanas de calendario que aporta un recurso (cursos por horas -> ritmo ref).
export function resourceWeeks(res) {
  const d = res.duration;
  if (!d) return 0;
  if (d.mode === "semanas") return d.weeks || 0;
  return d.hours ? d.hours / RITMO_SEMANAL : 0;
}

export function resourceHours(res) {
  const d = res.duration;
  if (!d) return 0;
  if (d.mode === "semanas") return (d.weeks || 0) * (d.hoursPerWeek || 0);
  return d.hours || 0;
}

// Stats calculados de una ruta a partir de sus recursos (del catalogo).
export function routeStats(resources) {
  const weeks = Math.round(resources.reduce((a, r) => a + resourceWeeks(r), 0));
  const hours = Math.round(resources.reduce((a, r) => a + resourceHours(r), 0));
  // dificultad = nivel mas frecuente; en empate, el mas avanzado.
  const order = ["Inicial", "Intermedio", "Avanzado"];
  const counts = {};
  resources.forEach((r) => { if (r.level) counts[r.level] = (counts[r.level] || 0) + 1; });
  let dificultad = null, best = 0;
  order.forEach((lvl) => { const c = counts[lvl] || 0; if (c >= best && c > 0) { best = c; dificultad = lvl; } });
  return { weeks, hours, dificultad };
}

// Bucket de duracion (en semanas) para filtrar.
export function duracionBucket(weeks) {
  if (weeks <= 20) return "corta";
  if (weeks <= 40) return "media";
  return "larga";
}

// ---------- Rutas editables (store) y asociacion N:N ----------
// El camino de cada ruta se guarda como resourceIds ordenado. Un recurso
// puede estar en varias rutas. Las rutas iniciales salen de ROUTES.
export const INITIAL_ROUTES = ROUTES.map(({ resources, ...route }) => ({
  ...route,
  resourceIds: resources.map((r) => r.id),
}));

// Fecha de referencia de la demo ("hoy"). Todo lo que genera fechas (comentarios,
// propuestas) y todo lo que las interpreta ("este mes", "hace N dias") usa esta
// constante, asi la maqueta es estable sin importar la fecha real del navegador.
export const HOY = "2026-06-12";

// Fecha relativa ("hoy", "ayer", "hace N dias") respecto a un dia de referencia.
export function relativeDate(date, today) {
  if (!date) return "";
  if (!today || date === today) return date === today ? "hoy" : date;
  const diff = Math.round((new Date(today) - new Date(date)) / 86400000);
  if (diff === 0) return "hoy";
  if (diff === 1) return "ayer";
  if (diff > 0 && diff < 30) return `hace ${diff} dias`;
  return date;
}

// Rutas a las que pertenece un recurso (membership N:N).
export function routesOfResource(resourceId, routes) {
  return routes.filter((rt) => (rt.resourceIds ?? []).includes(resourceId));
}

// Recursos (ordenados) de una ruta, resueltos contra el catalogo.
export function resourcesOfRoute(route, catalog) {
  return (route?.resourceIds ?? []).map((id) => catalog.find((r) => r.id === id)).filter(Boolean);
}
