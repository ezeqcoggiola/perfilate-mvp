import { useParams, useNavigate } from "react-router-dom";
import { useApp } from "../state/store";
import { ROUTES, cosineAffinity } from "../data/mockData";
import { AffinityRing, DimensionBars } from "../components/AffinityMeter";

export default function RouteDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { profile, saved, toggleSaved } = useApp();
  const route = ROUTES.find((r) => r.id === id);

  if (!route) return <p>Ruta no encontrada. <button className="btn btn-ghost" onClick={() => navigate("/app")}>Volver</button></p>;

  const score = Math.round(cosineAffinity(profile.weights, route.weights) * 100);
  const isSaved = saved.includes(route.id);

  return (
    <div style={{ display: "grid", gap: 32 }}>
      <button className="btn btn-ghost" style={{ width: "fit-content", padding: "7px 16px", fontSize: "0.85rem" }} onClick={() => navigate(-1)}>
        ← Volver
      </button>

      <header style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 24, alignItems: "center" }}>
        <div style={{ display: "grid", gap: 12 }}>
          <span className="tag" style={{ width: "fit-content", background: "var(--primary-wash)", color: "var(--primary-deep)" }}>{route.profile}</span>
          <h1 style={{ fontSize: "2.6rem" }}>{route.name}</h1>
          <p style={{ color: "var(--muted)", maxWidth: 560 }}>{route.summary}</p>
          <button className="btn btn-primary" style={{ width: "fit-content", marginTop: 6 }} onClick={() => toggleSaved(route.id)}>
            {isSaved ? "♥ Ruta guardada" : "♡ Guardar ruta"}
          </button>
        </div>
        <div style={{ display: "grid", placeItems: "center", gap: 6 }}>
          <AffinityRing score={score} size={104} color={route.color} />
          <span className="mono" style={{ fontSize: "0.7rem", color: "var(--muted)" }}>afinidad</span>
        </div>
      </header>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <section className="card" style={{ padding: 24, display: "grid", gap: 16 }}>
          <h3 style={{ fontSize: "1.1rem" }}>Perfil de la ruta</h3>
          <DimensionBars weights={route.weights} color={route.color} />
        </section>
        <section className="card" style={{ padding: 24, display: "grid", gap: 16 }}>
          <h3 style={{ fontSize: "1.1rem" }}>Tu perfil</h3>
          <DimensionBars weights={profile.weights} color="var(--primary)" />
        </section>
      </div>

      <section style={{ display: "grid", gap: 16 }}>
        <h3 style={{ fontSize: "1.3rem" }}>Camino recomendado</h3>
        <div style={{ display: "grid", gap: 12 }}>
          {route.resources.map((res, i) => (
            <div key={res.id} className="card" style={{ padding: 18, display: "flex", alignItems: "center", gap: 16 }}>
              <span className="mono" style={{ fontSize: "1.1rem", color: "var(--muted-soft)", width: 28 }}>{String(i + 1).padStart(2, "0")}</span>
              <div style={{ display: "grid", gap: 4, flex: 1 }}>
                <strong style={{ fontSize: "1rem" }}>{res.name}</strong>
                <div style={{ display: "flex", gap: 8 }}>
                  <span className="tag tag-muted">{res.type}</span>
                  <span className="tag tag-muted">{res.level}</span>
                </div>
              </div>
              <button className="btn btn-ghost" style={{ padding: "7px 14px", fontSize: "0.82rem" }} onClick={() => toggleSaved(res.id)}>
                {saved.includes(res.id) ? "♥" : "♡"}
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
