import { createContext, useContext, useState } from "react";
import { SAMPLE_PROFILE, rankRoutes } from "../data/mockData";
import { INITIAL_CATALOG, PROPOSALS } from "../data/adminMock";

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
      { id: `prop-${Date.now()}`, date: new Date().toISOString().slice(0, 10), status: "pendiente", ...p },
      ...ps,
    ]);
  const setProposalStatus = (id, status) =>
    setProposals((ps) => ps.map((p) => (p.id === id ? { ...p, status } : p)));

  const recommendations = rankRoutes(profile.weights).filter(
    (r) => !dismissed.includes(r.route.id)
  );

  const value = {
    role, login, logout,
    profile, updateWeights, updateProfile,
    saved, toggleSaved,
    dismissed, dismissRoute,
    ratings, rateResource,
    catalog, addCatalogResources, updateCatalogResource,
    proposals, addProposal, setProposalStatus,
    recommendations,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp debe usarse dentro de <AppProvider>");
  return ctx;
}
