import { useNavigate } from "react-router-dom";
import { AffinityRing } from "./AffinityMeter";
import { useApp } from "../state/store";
import { buildReason, routeStats, TEMAS, resourcesOfRoute } from "../data/mockData";

// Card de una ruta. Si recibe `score`, muestra el anillo de afinidad y la
// justificacion. Con `showStats`, agrega dificultad/duracion/temas calculados.
export default function RouteCard({ route, score, showReason = false, showStats = false }) {
  const navigate = useNavigate();
  const { saved, toggleSaved, profile, catalog } = useApp();
  const isSaved = saved.includes(route.id);
  const resources = resourcesOfRoute(route, catalog).filter((r) => r.estado !== "baja");
  const resourceCount = resources.length;
  const stats = showStats ? routeStats(resources) : null;
  const temas = showStats ? (route.temas ?? []).map((id) => TEMAS.find((t) => t.id === id)?.name).filter(Boolean) : [];

  return (
    <article
      className="card"
      style={{ padding: 20, display: "grid", gap: 14, cursor: "pointer", transition: "box-shadow .2s, transform .12s" }}
      onClick={() => navigate(`/ruta/${route.id}`)}
      onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "var(--shadow-md)")}
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "var(--shadow-sm)")}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: 14, justifyContent: "space-between" }}>
        <div style={{ display: "grid", gap: 6 }}>
          <span className="tag" style={{ width: "fit-content", background: "var(--primary-wash)", color: "var(--primary-deep)" }}>
            {route.profile}
          </span>
          <h3 style={{ fontSize: "1.3rem" }}>{route.name}</h3>
        </div>
        {typeof score === "number" && <AffinityRing score={score} color={route.color} />}
      </div>

      <p style={{ color: "var(--muted)", fontSize: "0.92rem" }}>{route.summary}</p>

      {showStats && (
        <div style={{ display: "grid", gap: 8 }}>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            {stats.dificultad && <span className="mono" style={{ fontSize: "0.74rem", color: "var(--muted)" }}>Dificultad: {stats.dificultad}</span>}
            {stats.weeks > 0 && <span className="mono" style={{ fontSize: "0.74rem", color: "var(--muted)" }}>≈ {stats.weeks} sem</span>}
          </div>
          {temas.length > 0 && (
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {temas.map((t) => <span key={t} className="tag tag-muted" style={{ fontSize: "0.7rem" }}>{t}</span>)}
            </div>
          )}
        </div>
      )}

      {showReason && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", background: "var(--accent-soft)", borderRadius: "var(--radius-sm)" }}>
          <span style={{ fontSize: "1rem" }}>✶</span>
          <span style={{ fontSize: "0.85rem", color: "var(--ink-soft)" }}>{buildReason(profile.weights, route)}</span>
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 2 }}>
        <span className="mono" style={{ fontSize: "0.76rem", color: "var(--muted-soft)" }}>
          {resourceCount} recursos
        </span>
        <button
          className="btn btn-ghost"
          style={{ padding: "7px 14px", fontSize: "0.82rem" }}
          onClick={(e) => { e.stopPropagation(); toggleSaved(route.id); }}
        >
          {isSaved ? "♥ Guardada" : "♡ Guardar"}
        </button>
      </div>
    </article>
  );
}
