Estoy trabajando en "Perfilate", un proyecto de la facultad (Ingeniería de Software).
Es una MAQUETA NAVEGABLE NO FUNCIONAL: el objetivo es mostrar cómo se vería la
plataforma, no construirla de verdad. Te paso aparte el User Story Mapping con el
scope completo (5 temas, 11 épicas), lo encontras en el repo en mvp/Actividad_UserStoryMapping_G3.pdf

REGLAS DURAS (no las rompas):
- NO hay backend, NO hay base de datos, NO hay motor de recomendación real.
- NO usar localStorage ni persistencia: todo el estado vive en memoria (React state /
  Context) y se reinicia al recargar. Es a propósito.
- NO agregar librerías nuevas salvo que te lo pida. Stack fijo: Vite + React 18 +
  react-router-dom. Estilos con inline styles + variables CSS (no Tailwind, no CSS-in-JS).
- Mantené EXACTAMENTE el branding y las convenciones que ya existen en el repo.

ESTADO ACTUAL DEL REPO (ya hecho, no lo rehagas):
- src/data/mockData.js: datos fijos. Define DIMENSIONS (5 dimensiones: prog, stats,
  infra, comm, research), ROUTES (4 rutas con su vector de pesos 0-100 y recursos
  mock), SAMPLE_PROFILE, y el "motor" fake: cosineAffinity(), rankRoutes(),
  buildReason(). La afinidad es similitud coseno entre el vector del perfil y el de
  cada ruta → porcentaje.
- src/state/store.jsx: Context global (rol user/admin, perfil, guardados, descartados,
  recomendaciones). Hooks: useApp().
- src/components/: Layout (topbar de navegación, sirve para área usuario y admin),
  RouteCard, AffinityMeter (AffinityRing = anillo SVG de %, DimensionBars = barras
  por dimensión). El anillo de afinidad es el elemento "signature" del diseño.
- src/pages/: Login (landing), Onboarding (elegir método + carga manual con sliders
  de peso), Home (mejor match destacado + resto ordenado por afinidad), RouteDetail,
  Placeholder (pantalla provisoria "En construcción").
- src/App.jsx: ruteo. /, /onboarding, /ruta/:id, /app (+ rutas, guardados, perfil),
  /admin (+ catalogo, propuestas, rutas, moderacion). Las que faltan apuntan a
  Placeholder.

BRANDING (respetalo, está en src/index.css como tokens):
- Colores: --ink #16142B, --primary #5B4BE0, --primary-deep #3A2EA8,
  --accent #FF6B57 (coral, marca afinidad/match), --bg #F5F4FB, --muted #6E6A8F,
  --line #E6E3F2.
- Tipos: Fraunces (títulos), Inter (cuerpo), Space Mono (números/datos).
- Formas: radius 16px, pills 999px, cards con borde --line y sombra suave.
- Clases utilitarias ya definidas: .container, .eyebrow, .btn (.btn-primary/.btn-ghost/
  .btn-accent), .card, .tag, .tag-muted, .mono.
- En los datos mock evité acentos a propósito; en el JSX de la UI los acentos van bien.

LO QUE FALTA (lo que quiero que armes, en este orden salvo que te diga otra cosa):
1. Perfil editable (/app/perfil): ver y editar las 5 dimensiones con sliders;
   al cambiarlas, las recomendaciones se recalculan (ya hay updateWeights en el store).
2. Guardados (/app/guardados): listar las rutas y recursos guardados (saved en el store).
3. Explorar rutas (/app/rutas): listado completo + búsqueda por texto + filtros por
   tipo/área/nivel, filtrando sobre el array mock en memoria.
4. Panel admin completo (todo tema 2 + feedback admin): dashboard, catálogo de recursos
   (cargar/editar/bulk fake), propuestas de usuarios, armado de rutas, moderación.
   Todo visual, sin lógica real; los formularios no persisten.

Antes de escribir código de una pantalla nueva, mirá cómo están hechas Home.jsx y
RouteDetail.jsx y seguí ese mismo patrón de estilos y estructura. Empecemos por la #1
(perfil editable). Mostrame el plan antes de implementar.