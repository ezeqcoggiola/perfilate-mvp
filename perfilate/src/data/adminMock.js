// ============================================================
//  Perfilate — datos mock del panel admin
//  Todo fijo y en memoria. Nada se persiste.
// ============================================================
import { ROUTES } from "./mockData";

// Catalogo inicial: aplana los recursos de todas las rutas (sin routeId: la
// pertenencia recurso<->ruta vive en route.resourceIds, modelo N:N).
export const INITIAL_CATALOG = ROUTES.flatMap((route) => route.resources.map((res) => ({ ...res })));

// Propuestas de recursos enviadas por usuarios.
export const PROPOSALS = [
  {
    id: "p1", name: "dbt para transformaciones de datos", type: "Curso", level: "Intermedio", routeId: "engineer",
    link: "https://cursos.perfilate.demo/dbt", by: "m.lopez", date: "2026-06-09", status: "pendiente",
    motivo: "Muy usado en equipos de analytics engineering.",
    duration: { mode: "horas", hours: 30 },
    description: "Herramienta para transformar datos en el warehouse con SQL versionado, tests y documentacion.",
    contents: [
      { tema: "Modelos y materializaciones", items: ["Models y refs", "Materializaciones"] },
      { tema: "Calidad y docs", items: ["Tests de datos", "Documentacion del proyecto"] },
    ],
    relation: {
      description: "Encaja en la etapa de transformacion de los pipelines de la ruta Data Engineer.",
      dims: ["infra", "prog"],
      topics: ["Modelos y materializaciones"],
    },
    origin: { provider: "dbt Labs", kind: "Plataforma", partOf: "" },
  },
  { id: "p2", name: "Visualizacion avanzada con D3.js", type: "Curso", level: "Avanzado", routeId: "analista", link: "https://cursos.perfilate.demo/d3", by: "jperez", date: "2026-06-08", status: "pendiente", motivo: "Para dashboards a medida." },
  { id: "p3", name: "Estadistica bayesiana aplicada", type: "Materia", level: "Avanzado", routeId: "research", link: "", by: "a.garcia", date: "2026-06-07", status: "pendiente", motivo: "Complementa probabilidad y procesos." },
  { id: "p4", name: "Introduccion a Spark", type: "Curso", level: "Intermedio", routeId: "engineer", link: "https://cursos.perfilate.demo/spark", by: "rfernandez", date: "2026-06-05", status: "aprobada", motivo: "Procesamiento distribuido." },
  { id: "p5", name: "Etica en IA", type: "Curso", level: "Inicial", routeId: "research", link: "", by: "lsosa", date: "2026-06-04", status: "descartada", motivo: "Fuera de scope por ahora." },
];

// Comentarios de usuarios para moderar (US 11.5). status: visible | reportado | oculto.
export const COMMENTS = [
  { id: "c1", by: "jdoe", resourceId: "r1", resourceName: "SQL para analisis de datos", score: 5, text: "Excelente para arrancar, muy claro y practico.", date: "2026-06-10", status: "visible" },
  { id: "c2", by: "anon23", resourceId: "r9", resourceName: "MLOps y despliegue de modelos", score: 1, text: "Esto es una porqueria, no sirve para nada, perdida de tiempo total.", date: "2026-06-10", status: "reportado" },
  { id: "c3", by: "meli", resourceId: "r4", resourceName: "Storytelling con datos", score: 4, text: "Muy util para mejorar presentaciones.", date: "2026-06-09", status: "visible" },
  { id: "c4", by: "promo_bot", resourceId: "r3", resourceName: "Visualizacion con Power BI / Looker", score: 5, text: "Compra seguidores baratos en www.spam.example, oferta!", date: "2026-06-09", status: "reportado" },
  { id: "c5", by: "lucas", resourceId: "r13", resourceName: "Deep learning desde cero", score: 5, text: "Denso pero vale muchisimo la pena.", date: "2026-06-08", status: "visible" },
  { id: "c6", by: "sofia", resourceId: "r2", resourceName: "Estadistica descriptiva e inferencial", score: 3, text: "Buen contenido, aunque la cursada es exigente.", date: "2026-06-07", status: "visible" },
  { id: "c7", by: "marcos", resourceId: "r5", resourceName: "Modelado de datos y data warehousing", score: 4, text: "Muy completo, con buenos ejemplos practicos.", date: "2026-06-12", status: "visible" },
  { id: "c8", by: "valen", resourceId: "r1", resourceName: "SQL para analisis de datos", score: 5, text: "Lo recomiendo para cualquiera que arranca con datos.", date: "2026-06-05", status: "visible" },
  { id: "c9", by: "nico", resourceId: "r13", resourceName: "Deep learning desde cero", score: 2, text: "Va demasiado rapido para principiantes.", date: "2026-05-29", status: "visible" },
];

// Resultados de encuestas sobre recursos guardados (US 11.3/11.4). % suman 100.
export const SURVEYS = [
  { resourceId: "r1", resourceName: "SQL para analisis de datos", respuestas: 128, completado: 72, enProgreso: 20, abandonado: 8, utilidad: 4.6 },
  { resourceId: "r8", resourceName: "Aprendizaje automatico", respuestas: 96, completado: 55, enProgreso: 30, abandonado: 15, utilidad: 4.3 },
  { resourceId: "r9", resourceName: "MLOps y despliegue de modelos", respuestas: 41, completado: 48, enProgreso: 34, abandonado: 18, utilidad: 4.1 },
  { resourceId: "r14", resourceName: "Maestria en Inteligencia Artificial", respuestas: 12, completado: 33, enProgreso: 50, abandonado: 17, utilidad: 4.5 },
];

// Actividad reciente para el dashboard.
export const ADMIN_ACTIVITY = [
  { id: "a1", text: "Nueva propuesta: dbt para transformaciones de datos", when: "hace 2 horas" },
  { id: "a2", text: "Se aprobo el recurso: Introduccion a Spark", when: "ayer" },
  { id: "a3", text: "Nuevo comentario en MLOps y despliegue de modelos", when: "ayer" },
  { id: "a4", text: "Se actualizo la ruta: Data Engineer", when: "hace 3 dias" },
];
