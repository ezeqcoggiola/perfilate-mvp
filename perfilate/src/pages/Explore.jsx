import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../state/store";
import { ROUTES, DIMENSIONS, cosineAffinity } from "../data/mockData";
import RouteCard from "../components/RouteCard";

const control = {
  padding: "10px 14px", border: "1px solid var(--line)",
  borderRadius: "var(--radius-pill)", background: "var(--surface)", fontSize: "0.88rem",
};

// Dimension dominante de una ruta (la de mayor peso).
const dominantDim = (route) =>
  DIMENSIONS.reduce((best, d) => ((route.weights[d.key] ?? 0) > (route.weights[best.key] ?? 0) ? d : best), DIMENSIONS[0]);

const NIVEL_ORDER = ["Inicial", "Intermedio", "Avanzado"];

export default function Explore() {
  const navigate = useNavigate();
  const { profile, saved, toggleSaved, catalog } = useApp();

  const [mode, setMode] = useState("rutas"); // rutas | recursos
  const [q, setQ] = useState("");
  const [area, setArea] = useState("");      // filtro de rutas
  const [tipo, setTipo] = useState("");      // filtros de recursos
  const [nivel, setNivel] = useState("");
  const [ruta, setRuta] = useState("");

  const norm = (s) => s.toLowerCase();

  // ----- Catalogo de rutas -----
  const routeResults = ROUTES.filter((r) => {
    const matchQ = !q || norm(`${r.name} ${r.profile} ${r.summary}`).includes(norm(q));
    const matchArea = !area || dominantDim(r).key === area;
    return matchQ && matchArea;
  });

  // ----- Catalogo de recursos (fuente: store) -----
  const allResources = catalog.map((res) => ({ res, route: ROUTES.find((r) => r.id === res.routeId) }));
  const tipos = [...new Set(allResources.map(({ res }) => res.type))];
  const niveles = NIVEL_ORDER.filter((n) => allResources.some(({ res }) => res.level === n));
  const resourceResults = allResources.filter(({ res, route }) => {
    const matchQ = !q || norm(res.name).includes(norm(q));
    const matchTipo = !tipo || res.type === tipo;
    const matchNivel = !nivel || res.level === nivel;
    const matchRuta = !ruta || route?.id === ruta;
    return matchQ && matchTipo && matchNivel && matchRuta;
  });

  const clear = () => { setQ(""); setArea(""); setTipo(""); setNivel(""); setRuta(""); };
  const count = mode === "rutas" ? routeResults.length : resourceResults.length;

  return (
    <div style={{ display: "grid", gap: 28 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 16, flexWrap: "wrap" }}>
        <div style={{ display: "grid", gap: 6 }}>
          <span className="eyebrow">Explorar</span>
          <h1 style={{ fontSize: "2.4rem" }}>El cat&aacute;logo completo</h1>
          <p style={{ color: "var(--muted)" }}>Record&eacute; rutas y recursos, m&aacute;s all&aacute; de tus recomendadas.</p>
        </div>
        <button className="btn btn-ghost" onClick={() => navigate("/app/proponer")}>+ Proponer recurso</button>
      </div>

      {/* Toggle de catalogo */}
      <div style={{ display: "flex", gap: 8 }}>
        {[["rutas", "Rutas"], ["recursos", "Recursos"]].map(([key, label]) => (
          <button
            key={key}
            className={mode === key ? "btn btn-primary" : "btn btn-ghost"}
            style={{ padding: "9px 20px", fontSize: "0.9rem" }}
            onClick={() => { setMode(key); clear(); }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Controles: busqueda + filtros segun el modo */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={mode === "rutas" ? "Buscar rutas..." : "Buscar recursos..."}
          style={{ ...control, flex: 1, minWidth: 220 }}
        />

        {mode === "rutas" && (
          <select value={area} onChange={(e) => setArea(e.target.value)} style={{ ...control, cursor: "pointer" }}>
            <option value="">Todas las &aacute;reas</option>
            {DIMENSIONS.map((d) => <option key={d.key} value={d.key}>{d.short}</option>)}
          </select>
        )}

        {mode === "recursos" && (
          <>
            <select value={tipo} onChange={(e) => setTipo(e.target.value)} style={{ ...control, cursor: "pointer" }}>
              <option value="">Todos los tipos</option>
              {tipos.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            <select value={nivel} onChange={(e) => setNivel(e.target.value)} style={{ ...control, cursor: "pointer" }}>
              <option value="">Todos los niveles</option>
              {niveles.map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
            <select value={ruta} onChange={(e) => setRuta(e.target.value)} style={{ ...control, cursor: "pointer" }}>
              <option value="">Todas las rutas</option>
              {ROUTES.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
          </>
        )}

        <button className="btn btn-ghost" style={{ padding: "9px 16px", fontSize: "0.85rem" }} onClick={clear}>Limpiar</button>
      </div>

      <span className="mono" style={{ fontSize: "0.82rem", color: "var(--muted)" }}>
        {count} {mode === "rutas" ? (count === 1 ? "ruta" : "rutas") : (count === 1 ? "recurso" : "recursos")}
      </span>

      {/* Resultados */}
      {count === 0 && (
        <div className="card" style={{ padding: 40, textAlign: "center", color: "var(--muted)" }}>
          No encontramos nada con esos filtros. Prob&aacute; con otra b&uacute;squeda.
        </div>
      )}

      {mode === "rutas" && routeResults.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 18 }}>
          {routeResults.map((route) => (
            <RouteCard
              key={route.id}
              route={route}
              score={Math.round(cosineAffinity(profile.weights, route.weights) * 100)}
            />
          ))}
        </div>
      )}

      {mode === "recursos" && resourceResults.length > 0 && (
        <div style={{ display: "grid", gap: 12 }}>
          {resourceResults.map(({ res, route }) => {
            const isSaved = saved.includes(res.id);
            return (
              <div
                key={res.id}
                className="card"
                style={{ padding: 18, display: "flex", alignItems: "center", gap: 16, cursor: "pointer" }}
                onClick={() => navigate(`/recurso/${res.id}`)}
                onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "var(--shadow-md)")}
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "var(--shadow-sm)")}
              >
                <div style={{ display: "grid", gap: 6, flex: 1 }}>
                  <strong style={{ fontSize: "1rem" }}>{res.name}</strong>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <span className="tag tag-muted">{res.type}</span>
                    <span className="tag tag-muted">{res.level}</span>
                  </div>
                  {route ? (
                    <span style={{ fontSize: "0.82rem", color: "var(--muted)" }}>
                      de la ruta{" "}
                      <span
                        onClick={(e) => { e.stopPropagation(); navigate(`/ruta/${route.id}`); }}
                        style={{ color: "var(--primary)", fontWeight: 600, cursor: "pointer" }}
                      >
                        {route.name} →
                      </span>
                    </span>
                  ) : (
                    <span style={{ fontSize: "0.82rem", color: "var(--muted-soft)" }}>Sin ruta asignada</span>
                  )}
                </div>
                <button
                  className="btn btn-ghost"
                  style={{ padding: "7px 14px", fontSize: "0.82rem" }}
                  onClick={(e) => { e.stopPropagation(); toggleSaved(res.id); }}
                >
                  {isSaved ? "♥ Guardado" : "♡ Guardar"}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
