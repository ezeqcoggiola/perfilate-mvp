import { useNavigate } from "react-router-dom";
import { AffinityRing } from "./AffinityMeter";
import { useApp } from "../state/store";
import { buildReason } from "../data/mockData";

// Card de una ruta. Si recibe `score`, muestra el anillo de afinidad
// y la justificacion generada.
export default function RouteCard({ route, score, showReason = false }) {
  const navigate = useNavigate();
  const { saved, toggleSaved, profile, catalog } = useApp();
  const isSaved = saved.includes(route.id);
  const resourceCount = catalog.filter((r) => r.routeId === route.id).length;

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
