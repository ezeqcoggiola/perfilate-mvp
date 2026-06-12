import { createContext, useContext, useState } from "react";
import { SAMPLE_PROFILE, rankRoutes, INITIAL_ROUTES, HOY } from "../data/mockData";
import { INITIAL_CATALOG, PROPOSALS, COMMENTS } from "../data/adminMock";

// Estado global de la maqueta. OJO: todo vive en memoria. Si recargas
// la pagina, vuelve a cero. Es a proposito: la demo no persiste nada.
const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [role, setRole] = useState(null); // null | "user" | "admin"
  // profile: { name, headline, weights, interests, situacion, areaOrigen, skills }.
  // updateProfile mergea cualquier campo; solo weights alimenta la afinidad.
  const [profile, setProfile] = useState(SAMPLE_PROFILE);
  const [saved, setSaved] = useState([]); // ids de rutas/recursos guardados
  const [dismissed, setDismissed] = useState([]); // rutas marcadas "no me interesa"
  const [ratings, setRatings] = useState({}); // { [resourceId]: { score, comment } }
  const [catalog, setCatalog] = useState(INITIAL_CATALOG); // catalogo admin (editable en sesion)
  const [proposals, setProposals] = useState(PROPOSALS); // propuestas de usuarios (en sesion)
  const [routes, setRoutes] = useState(INITIAL_ROUTES); // rutas editables (camino = resourceIds N:N)
  const [comments, setComments] = useState(COMMENTS); // comentarios para moderar (en sesion)

  const login = (asRole) => setRole(asRole);
  const logout = () => {
    // Datos de plataforma (catalog, proposals) sobreviven al logout: solo se
    // reinician al recargar la pagina. Se resetea lo propio del usuario.
    setRole(null);
    setSaved([]);
    setDismissed([]);
    setRatings({});
    setProfile(SAMPLE_PROFILE);
  };

  const updateWeights = (weights) =>
    setProfile((p) => ({ ...p, weights }));

  const updateProfile = (patch) =>
    setProfile((p) => ({ ...p, ...patch }));

  const toggleSaved = (id) =>
    setSaved((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const dismissRoute = (id) =>
    setDismissed((d) => (d.includes(id) ? d : [...d, id]));
  const restoreRoute = (id) => setDismissed((d) => d.filter((x) => x !== id));
  const restoreAllDismissed = () => setDismissed([]);

  // Puntuacion del usuario a un recurso (en memoria, no afecta la afinidad).
  const rateResource = (id, score, comment = "") =>
    setRatings((r) => ({ ...r, [id]: { score, comment } }));

  // Catalogo admin (en memoria). Acepta uno o varios recursos.
  const addCatalogResources = (items) =>
    setCatalog((c) => [
      ...items.map((it, i) => ({ ...it, id: it.id || `r-${Date.now()}-${i}` })),
      ...c,
    ]);
  const updateCatalogResource = (id, patch) =>
    setCatalog((c) => c.map((x) => (x.id === id ? { ...x, ...patch } : x)));

  // Propuestas de recursos (en memoria).
  const addProposal = (p) =>
    setProposals((ps) => [
      { id: `prop-${Date.now()}`, date: HOY, status: "pendiente", ...p },
      ...ps,
    ]);
  const setProposalStatus = (id, status) =>
    setProposals((ps) => ps.map((p) => (p.id === id ? { ...p, status } : p)));

  // Rutas (en memoria). El camino se guarda como resourceIds ordenado (N:N).
  const addRoute = (route) =>
    setRoutes((rs) => [{ id: `route-${Date.now()}`, resourceIds: [], temas: [], ...route }, ...rs]);
  const updateRoute = (id, patch) =>
    setRoutes((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  const deleteRoute = (id) => setRoutes((rs) => rs.filter((r) => r.id !== id));
  const addResourceToRoute = (routeId, resourceId) =>
    setRoutes((rs) => rs.map((r) => (r.id === routeId && !(r.resourceIds ?? []).includes(resourceId)
      ? { ...r, resourceIds: [...(r.resourceIds ?? []), resourceId] } : r)));
  const removeResourceFromRoute = (routeId, resourceId) =>
    setRoutes((rs) => rs.map((r) => (r.id === routeId
      ? { ...r, resourceIds: (r.resourceIds ?? []).filter((x) => x !== resourceId) } : r)));
  const toggleResourceInRoute = (routeId, resourceId) =>
    setRoutes((rs) => rs.map((r) => {
      if (r.id !== routeId) return r;
      const has = (r.resourceIds ?? []).includes(resourceId);
      return { ...r, resourceIds: has ? r.resourceIds.filter((x) => x !== resourceId) : [...(r.resourceIds ?? []), resourceId] };
    }));
  const moveResourceInRoute = (routeId, index, dir) =>
    setRoutes((rs) => rs.map((r) => {
      if (r.id !== routeId) return r;
      const ids = [...(r.resourceIds ?? [])];
      const j = index + dir;
      if (j < 0 || j >= ids.length) return r;
      [ids[index], ids[j]] = [ids[j], ids[index]];
      return { ...r, resourceIds: ids };
    }));

  // Comentarios (en memoria). El comentario del usuario en un recurso entra
  // a la coleccion (upsert por usuario+recurso) y puede moderarse.
  const setCommentStatus = (id, status) =>
    setComments((cs) => cs.map((c) => (c.id === id ? { ...c, status } : c)));
  const deleteComment = (id) =>
    setComments((cs) => cs.filter((c) => c.id !== id));
  const suspendUser = (by) =>
    setComments((cs) => cs.map((c) => (c.by === by ? { ...c, status: "oculto" } : c)));
  const upsertUserComment = ({ by, resourceId, resourceName, score, text }) =>
    setComments((cs) => {
      const today = HOY;
      const idx = cs.findIndex((c) => c.by === by && c.resourceId === resourceId);
      if (idx >= 0) {
        const next = [...cs];
        next[idx] = { ...next[idx], score, text, date: today, status: "visible" };
        return next;
      }
      return [{ id: `cm-${Date.now()}`, by, resourceId, resourceName, score, text, date: today, status: "visible" }, ...cs];
    });

  const recommendations = rankRoutes(profile.weights, routes).filter(
    (r) => !dismissed.includes(r.route.id)
  );

  const value = {
    role, login, logout,
    profile, updateWeights, updateProfile,
    saved, toggleSaved,
    dismissed, dismissRoute, restoreRoute, restoreAllDismissed,
    ratings, rateResource,
    catalog, addCatalogResources, updateCatalogResource,
    proposals, addProposal, setProposalStatus,
    routes, addRoute, updateRoute, deleteRoute,
    addResourceToRoute, removeResourceFromRoute, toggleResourceInRoute, moveResourceInRoute,
    comments, setCommentStatus, deleteComment, suspendUser, upsertUserComment,
    recommendations,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp debe usarse dentro de <AppProvider>");
  return ctx;
}
