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

// Las 4 rutas. Los vectores (0-100) son a mano, no salen de ningun
// analisis real. Los recursos son ejemplos incompletos, sin links reales.
export const ROUTES = [
  {
    id: "analista",
    name: "Analista de Datos",
    profile: "Data Analyst",
    color: "#5B4BE0",
    summary:
      "Convertis datos en decisiones. Fuerte en estadistica descriptiva, SQL y sobre todo en contar la historia que hay detras de los numeros.",
    weights: { prog: 40, stats: 70, infra: 20, comm: 90, research: 25 },
    resources: [
      { id: "r1", type: "Curso", name: "SQL para analisis de datos", level: "Inicial" },
      { id: "r2", type: "Materia", name: "Estadistica descriptiva e inferencial", level: "Inicial" },
      { id: "r3", type: "Curso", name: "Visualizacion con Power BI / Looker", level: "Intermedio" },
      { id: "r4", type: "Curso", name: "Storytelling con datos", level: "Intermedio" },
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
    resources: [
      { id: "r5", type: "Curso", name: "Modelado de datos y data warehousing", level: "Intermedio" },
      { id: "r6", type: "Curso", name: "ETL/ELT y orquestacion", level: "Intermedio" },
      { id: "r7", type: "Certificacion", name: "Fundamentos de cloud para datos", level: "Intermedio" },
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
    resources: [
      { id: "r8", type: "Materia", name: "Aprendizaje automatico", level: "Intermedio" },
      { id: "r9", type: "Curso", name: "MLOps y despliegue de modelos", level: "Avanzado" },
      { id: "r10", type: "Curso", name: "Ingenieria de features", level: "Intermedio" },
      { id: "r11", type: "Posgrado", name: "Especializacion en sistemas de ML", level: "Avanzado" },
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
    resources: [
      { id: "r12", type: "Materia", name: "Probabilidad y procesos estocasticos", level: "Avanzado" },
      { id: "r13", type: "Curso", name: "Deep learning desde cero", level: "Avanzado" },
      { id: "r14", type: "Posgrado", name: "Maestria en Inteligencia Artificial", level: "Avanzado" },
    ],
  },
];

// Perfil de ejemplo precargado (para cuando entras sin hacer onboarding).
export const SAMPLE_PROFILE = {
  name: "Ezequiel",
  headline: "Estudiante de Ciencia de Datos · UNSAM",
  weights: { prog: 70, stats: 65, infra: 40, comm: 55, research: 50 },
  interests: ["Python", "NLP", "Bases de datos", "Visualizacion"],
};

// ---------- El "motor" de mentira ----------
// Similitud coseno entre dos vectores de dimensiones (0-100).
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

// Devuelve las rutas ordenadas por afinidad con un perfil dado.
export function rankRoutes(profileWeights) {
  return ROUTES.map((route) => ({
    route,
    score: Math.round(cosineAffinity(profileWeights, route.weights) * 100),
  })).sort((x, y) => y.score - x.score);
}

// Arma una justificacion en texto a partir de las dimensiones donde
// el usuario y la ruta coinciden mas alto. 100% generado, 0% IA.
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
