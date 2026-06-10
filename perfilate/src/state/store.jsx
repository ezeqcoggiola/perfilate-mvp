import { createContext, useContext, useState } from "react";
import { SAMPLE_PROFILE, rankRoutes } from "../data/mockData";

// Estado global de la maqueta. OJO: todo vive en memoria. Si recargas
// la pagina, vuelve a cero. Es a proposito: la demo no persiste nada.
const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [role, setRole] = useState(null); // null | "user" | "admin"
  const [profile, setProfile] = useState(SAMPLE_PROFILE);
  const [saved, setSaved] = useState([]); // ids de rutas/recursos guardados
  const [dismissed, setDismissed] = useState([]); // rutas marcadas "no me interesa"

  const login = (asRole) => setRole(asRole);
  const logout = () => {
    setRole(null);
    setSaved([]);
    setDismissed([]);
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

  const recommendations = rankRoutes(profile.weights).filter(
    (r) => !dismissed.includes(r.route.id)
  );

  const value = {
    role, login, logout,
    profile, updateWeights, updateProfile,
    saved, toggleSaved,
    dismissed, dismissRoute,
    recommendations,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp debe usarse dentro de <AppProvider>");
  return ctx;
}
