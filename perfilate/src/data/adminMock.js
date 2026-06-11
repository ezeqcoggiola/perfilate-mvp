// ============================================================
//  Perfilate — datos mock del panel admin
//  Todo fijo y en memoria. Nada se persiste.
// ============================================================
import { ROUTES } from "./mockData";

// Catalogo inicial: aplana los recursos de las rutas con su ruta asociada.
// Es la UNICA fuente de recursos en runtime (el detalle, el camino de la
// ruta, Explorar y Guardados leen de aca). El admin agrega/edita en sesion.
export const INITIAL_CATALOG = ROUTES.flatMap((route) =>
  route.resources.map((res) => ({
    ...res,
    routeId: route.id,
    routeName: route.name,
  }))
);

// Propuestas de recursos enviadas por usuarios.
export const PROPOSALS = [
  {
    id: "p1", name: "dbt para transformaciones de datos", type: "Curso", level: "Intermedio", routeId: "engineer",
    link: "https://cursos.perfilate.demo/dbt", by: "m.lopez", date: "2026-06-09", status: "pendiente",
    motivo: "Muy usado en equipos de analytics engineering.",
    duration: "5 semanas",
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

// Actividad reciente para el dashboard.
export const ADMIN_ACTIVITY = [
  { id: "a1", text: "Nueva propuesta: dbt para transformaciones de datos", when: "hace 2 horas" },
  { id: "a2", text: "Se aprobo el recurso: Introduccion a Spark", when: "ayer" },
  { id: "a3", text: "Nuevo comentario en MLOps y despliegue de modelos", when: "ayer" },
  { id: "a4", text: "Se actualizo la ruta: Data Engineer", when: "hace 3 dias" },
];
