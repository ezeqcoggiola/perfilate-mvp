import { useNavigate } from "react-router-dom";
import { useApp } from "../state/store";
import { ROUTES, cosineAffinity } from "../data/mockData";
import RouteCard from "../components/RouteCard";

export default function Saved() {
  const navigate = useNavigate();
  const { saved, toggleSaved, profile, catalog } = useApp();

  // saved mezcla ids de rutas y de recursos. Los separamos contra los datos.
  const savedRoutes = ROUTES.filter((r) => saved.includes(r.id));
  const savedResources = catalog
    .filter((res) => saved.includes(res.id))
    .map((res) => ({ res, route: ROUTES.find((r) => r.id === res.routeId) }));

  const isEmpty = savedRoutes.length === 0 && savedResources.length === 0;

  return (
    <div style={{ display: "grid", gap: 40 }}>
      <div style={{ display: "grid", gap: 6 }}>
        <span className="eyebrow">Tu coleccion</span>
        <h1 style={{ fontSize: "2.4rem" }}>Guardados</h1>
        <p style={{ color: "var(--muted)" }}>Las rutas y recursos que marcaste con coraz&oacute;n.</p>
      </div>

      {isEmpty && (
        <div className="card" style={{ padding: 48, textAlign: "center", display: "grid", gap: 16, placeItems: "center" }}>
          <span style={{ fontSize: "2rem" }}>♡</span>
          <p style={{ color: "var(--muted)", maxWidth: 360 }}>
            Todav&iacute;a no guardaste nada. Explor&aacute; tus rutas y guard&aacute; las que te interesen.
          </p>
          <button className="btn btn-primary" onClick={() => navigate("/app")}>Ver mis rutas</button>
        </div>
      )}

      {/* Rutas guardadas */}
      {savedRoutes.length > 0 && (
        <section style={{ display: "grid", gap: 18 }}>
          <h3 style={{ fontSize: "1.2rem" }}>Rutas guardadas <span className="mono" style={{ fontSize: "0.9rem", color: "var(--muted-soft)" }}>({savedRoutes.length})</span></h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 18 }}>
            {savedRoutes.map((route) => (
              <RouteCard
                key={route.id}
                route={route}
                score={Math.round(cosineAffinity(profile.weights, route.weights) * 100)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Recursos guardados */}
      {savedResources.length > 0 && (
        <section style={{ display: "grid", gap: 16 }}>
          <h3 style={{ fontSize: "1.2rem" }}>Recursos guardados <span className="mono" style={{ fontSize: "0.9rem", color: "var(--muted-soft)" }}>({savedResources.length})</span></h3>
          <div style={{ display: "grid", gap: 12 }}>
            {savedResources.map(({ res, route }) => (
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
                  ♥ Quitar
                </button>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
