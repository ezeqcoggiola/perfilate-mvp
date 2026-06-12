import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../state/store";
import { TEMAS, DURACION_FILTROS, cosineAffinity, routeStats, duracionBucket, routesOfResource, resourcesOfRoute } from "../data/mockData";
import RouteCard from "../components/RouteCard";

const control = {
  padding: "10px 14px", border: "1px solid var(--line)",
  borderRadius: "var(--radius-pill)", background: "var(--surface)", fontSize: "0.88rem",
};
const chip = (on) => (on
  ? { cursor: "pointer", background: "var(--primary)", color: "#fff", border: "1px solid var(--primary)" }
  : { cursor: "pointer" });

const NIVEL_ORDER = ["Inicial", "Intermedio", "Avanzado"];

export default function Explore() {
  const navigate = useNavigate();
  const { profile, saved, toggleSaved, catalog, routes } = useApp();

  const [mode, setMode] = useState("rutas"); // rutas | recursos
  const [q, setQ] = useState("");
  const [dificultad, setDificultad] = useState("");
  const [duracion, setDuracion] = useState("");
  const [temas, setTemas] = useState([]);
  const [tipo, setTipo] = useState("");
  const [nivel, setNivel] = useState("");
  const [ruta, setRuta] = useState("");

  const norm = (s) => s.toLowerCase();
  const toggleTema = (id) => setTemas((ts) => (ts.includes(id) ? ts.filter((x) => x !== id) : [...ts, id]));

  // ----- Catalogo de rutas (con stats calculados del catalogo) -----
  const routeResults = routes.filter((route) => {
    const stats = routeStats(resourcesOfRoute(route, catalog));
    const matchQ = !q || norm(`${route.name} ${route.profile} ${route.summary}`).includes(norm(q));
    const matchDif = !dificultad || stats.dificultad === dificultad;
    const matchDur = !duracion || duracionBucket(stats.weeks) === duracion;
    const matchTemas = temas.length === 0 || temas.some((id) => (route.temas ?? []).includes(id));
    return matchQ && matchDif && matchDur && matchTemas;
  });

  // ----- Catalogo de recursos -----
  const allResources = catalog.filter((r) => r.estado !== "baja").map((res) => ({ res, rts: routesOfResource(res.id, routes) }));
  const tipos = [...new Set(allResources.map(({ res }) => res.type))];
  const niveles = NIVEL_ORDER.filter((n) => allResources.some(({ res }) => res.level === n));
  const resourceResults = allResources.filter(({ res, rts }) => {
    const matchQ = !q || norm(res.name).includes(norm(q));
    const matchTipo = !tipo || res.type === tipo;
    const matchNivel = !nivel || res.level === nivel;
    const matchRuta = !ruta || rts.some((rt) => rt.id === ruta);
    return matchQ && matchTipo && matchNivel && matchRuta;
  });

  const clear = () => { setQ(""); setDificultad(""); setDuracion(""); setTemas([]); setTipo(""); setNivel(""); setRuta(""); };
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

      <div style={{ display: "grid", gap: 12 }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={mode === "rutas" ? "Buscar rutas..." : "Buscar recursos..."}
            style={{ ...control, flex: 1, minWidth: 220 }}
          />

          {mode === "rutas" && (
            <>
              <select value={dificultad} onChange={(e) => setDificultad(e.target.value)} style={{ ...control, cursor: "pointer" }}>
                <option value="">Todas las dificultades</option>
                {NIVEL_ORDER.map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
              <select value={duracion} onChange={(e) => setDuracion(e.target.value)} style={{ ...control, cursor: "pointer" }}>
                <option value="">Cualquier duracion</option>
                {DURACION_FILTROS.map((d) => <option key={d.key} value={d.key}>{d.label}</option>)}
              </select>
            </>
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
                {routes.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
              </select>
            </>
          )}

          <button className="btn btn-ghost" style={{ padding: "9px 16px", fontSize: "0.85rem" }} onClick={clear}>Limpiar</button>
        </div>

        {mode === "rutas" && (
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
            <span style={{ fontSize: "0.82rem", color: "var(--muted)" }}>Temas:</span>
            {TEMAS.map((t) => {
              const on = temas.includes(t.id);
              return (
                <button key={t.id} type="button" onClick={() => toggleTema(t.id)} className={on ? "tag" : "tag tag-muted"} style={chip(on)}>
                  {t.name}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <span className="mono" style={{ fontSize: "0.82rem", color: "var(--muted)" }}>
        {count} {mode === "rutas" ? (count === 1 ? "ruta" : "rutas") : (count === 1 ? "recurso" : "recursos")}
      </span>

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
              showStats
            />
          ))}
        </div>
      )}

      {mode === "recursos" && resourceResults.length > 0 && (
        <div style={{ display: "grid", gap: 12 }}>
          {resourceResults.map(({ res, rts }) => {
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
                    {res.estado === "desactualizado" && <span className="tag" style={{ background: "var(--accent-soft)", color: "var(--danger-strong)" }}>desactualizado</span>}
                  </div>
                  {rts.length > 0 ? (
                    <span style={{ fontSize: "0.82rem", color: "var(--muted)" }}>
                      {rts.length === 1 ? "de la ruta " : "en "}
                      <span
                        onClick={(e) => { e.stopPropagation(); navigate(`/ruta/${rts[0].id}`); }}
                        style={{ color: "var(--primary)", fontWeight: 600, cursor: "pointer" }}
                      >
                        {rts[0].name} →
                      </span>
                      {rts.length > 1 && <span style={{ color: "var(--muted-soft)" }}> +{rts.length - 1}</span>}
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
