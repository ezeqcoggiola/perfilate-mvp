import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../state/store";
import RouteCard from "../components/RouteCard";
import { AffinityRing } from "../components/AffinityMeter";
import { buildReason, routeStats, resourcesOfRoute, TEMAS } from "../data/mockData";

const ESCALAS = [
  { key: "acotada", label: "Acotada", n: 3 },
  { key: "equilibrada", label: "Equilibrada", n: 5 },
  { key: "amplia", label: "Amplia", n: Infinity },
];

export default function Home() {
  const navigate = useNavigate();
  const { profile, recommendations, dismissRoute, catalog, routes, dismissed, restoreRoute, restoreAllDismissed } = useApp();
  const [escala, setEscala] = useState("equilibrada");

  const [top, ...rest] = recommendations;
  const limit = ESCALAS.find((e) => e.key === escala).n;
  const shownRest = rest.slice(0, Math.max(0, limit - 1)); // -1 por la destacada
  const hiddenCount = rest.length - shownRest.length;

  const dismissedRoutes = routes.filter((r) => dismissed.includes(r.id));

  const topStats = top ? routeStats(resourcesOfRoute(top.route, catalog).filter((r) => r.estado !== "baja")) : null;
  const topTemas = top ? (top.route.temas ?? []).map((id) => TEMAS.find((t) => t.id === id)?.name).filter(Boolean) : [];

  return (
    <div style={{ display: "grid", gap: 40 }}>
      <div style={{ display: "grid", gap: 6 }}>
        <span className="eyebrow">Hola, {profile.name}</span>
        <h1 style={{ fontSize: "2.4rem" }}>Tus rutas recomendadas</h1>
        <p style={{ color: "var(--muted)" }}>Ordenadas por afinidad con tu perfil. Pod&eacute;s ajustar todo desde tu perfil.</p>
      </div>

      {/* Destacada */}
      {top && (
        <section
          className="card"
          style={{
            padding: 32, display: "grid", gridTemplateColumns: "1fr auto", gap: 28,
            alignItems: "center", boxShadow: "var(--shadow-lg)",
            background: "linear-gradient(135deg, #fff, var(--primary-wash))",
          }}
        >
          <div style={{ display: "grid", gap: 14 }}>
            <span className="tag" style={{ width: "fit-content", background: "var(--accent)", color: "#fff" }}>Tu mejor match</span>
            <h2 style={{ fontSize: "2rem" }}>{top.route.name}</h2>
            <p style={{ color: "var(--ink-soft)", maxWidth: 460 }}>{top.route.summary}</p>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: "1rem" }}>✶</span>
              <span style={{ fontSize: "0.9rem", color: "var(--ink-soft)" }}>{buildReason(profile.weights, top.route)}</span>
            </div>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              {topStats?.dificultad && <span className="mono" style={{ fontSize: "0.74rem", color: "var(--muted)" }}>Dificultad: {topStats.dificultad}</span>}
              {topStats?.weeks > 0 && <span className="mono" style={{ fontSize: "0.74rem", color: "var(--muted)" }}>≈ {topStats.weeks} sem</span>}
            </div>
            {topTemas.length > 0 && (
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {topTemas.map((t) => <span key={t} className="tag tag-muted" style={{ fontSize: "0.7rem" }}>{t}</span>)}
              </div>
            )}
            <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
              <button className="btn btn-primary" onClick={() => navigate(`/ruta/${top.route.id}`)}>Ver la ruta</button>
              <button className="btn btn-ghost" onClick={() => dismissRoute(top.route.id)}>No me interesa</button>
            </div>
          </div>
          <div style={{ display: "grid", placeItems: "center", gap: 8 }}>
            <AffinityRing score={top.score} size={120} color={top.route.color} />
            <span className="mono" style={{ fontSize: "0.72rem", color: "var(--muted)" }}>afinidad</span>
          </div>
        </section>
      )}

      {/* Resto + control de escala */}
      {rest.length > 0 && (
        <section style={{ display: "grid", gap: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
            <h3 style={{ fontSize: "1.2rem" }}>Otras rutas que encajan</h3>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: "0.8rem", color: "var(--muted)" }}>Recomendacion:</span>
              <div style={{ display: "flex", gap: 6 }}>
                {ESCALAS.map((e) => (
                  <button
                    key={e.key}
                    className={escala === e.key ? "tag" : "tag tag-muted"}
                    style={escala === e.key ? { cursor: "pointer", background: "var(--primary)", color: "#fff", border: "1px solid var(--primary)" } : { cursor: "pointer" }}
                    onClick={() => setEscala(e.key)}
                  >
                    {e.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 18 }}>
            {shownRest.map(({ route, score }) => (
              <RouteCard key={route.id} route={route} score={score} showReason showStats />
            ))}
          </div>
          {hiddenCount > 0 && (
            <button className="btn btn-ghost" style={{ width: "fit-content" }} onClick={() => setEscala("amplia")}>
              Ver {hiddenCount} {hiddenCount === 1 ? "ruta mas" : "rutas mas"}
            </button>
          )}
        </section>
      )}

      {/* Empty state: descartó todo */}
      {recommendations.length === 0 && (
        <div className="card" style={{ padding: 40, textAlign: "center", display: "grid", gap: 14, placeItems: "center", color: "var(--muted)" }}>
          <span>Descartaste todas las rutas.</span>
          <button className="btn btn-primary" onClick={restoreAllDismissed}>Volver a verlas</button>
        </div>
      )}

      {/* Rutas descartadas (restaurar) */}
      {recommendations.length > 0 && dismissedRoutes.length > 0 && (
        <section style={{ display: "grid", gap: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <h3 style={{ fontSize: "1.05rem", color: "var(--muted)" }}>Rutas que descartaste ({dismissedRoutes.length})</h3>
            <button className="btn btn-ghost" style={{ padding: "6px 14px", fontSize: "0.82rem" }} onClick={restoreAllDismissed}>Restaurar todas</button>
          </div>
          <div style={{ display: "grid", gap: 8 }}>
            {dismissedRoutes.map((r) => (
              <div key={r.id} className="card" style={{ padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: "0.92rem", color: "var(--muted)" }}>{r.name}</span>
                <button className="btn btn-ghost" style={{ padding: "6px 14px", fontSize: "0.82rem" }} onClick={() => restoreRoute(r.id)}>Restaurar</button>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
