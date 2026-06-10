import { useNavigate } from "react-router-dom";
import { useApp } from "../state/store";
import RouteCard from "../components/RouteCard";
import { AffinityRing } from "../components/AffinityMeter";
import { buildReason } from "../data/mockData";

export default function Home() {
  const navigate = useNavigate();
  const { profile, recommendations, dismissRoute } = useApp();

  const [top, ...rest] = recommendations;

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
            <span className="tag" style={{ width: "fit-content", background: "var(--accent)", color: "#fff" }}>
              Tu mejor match
            </span>
            <h2 style={{ fontSize: "2rem" }}>{top.route.name}</h2>
            <p style={{ color: "var(--ink-soft)", maxWidth: 460 }}>{top.route.summary}</p>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: "1rem" }}>✶</span>
              <span style={{ fontSize: "0.9rem", color: "var(--ink-soft)" }}>{buildReason(profile.weights, top.route)}</span>
            </div>
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

      {/* Resto */}
      {rest.length > 0 && (
        <section style={{ display: "grid", gap: 18 }}>
          <h3 style={{ fontSize: "1.2rem" }}>Otras rutas que encajan</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 18 }}>
            {rest.map(({ route, score }) => (
              <RouteCard key={route.id} route={route} score={score} showReason />
            ))}
          </div>
        </section>
      )}

      {recommendations.length === 0 && (
        <div className="card" style={{ padding: 40, textAlign: "center", color: "var(--muted)" }}>
          Descartaste todas las rutas. Reinici&aacute; tu sesi&oacute;n para volver a verlas.
        </div>
      )}
    </div>
  );
}
