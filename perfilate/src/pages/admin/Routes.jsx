import { useNavigate } from "react-router-dom";
import { useApp } from "../../state/store";
import { routeStats, resourcesOfRoute, TEMAS } from "../../data/mockData";

export default function Routes() {
  const navigate = useNavigate();
  const { routes, catalog } = useApp();

  return (
    <div style={{ display: "grid", gap: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 16, flexWrap: "wrap" }}>
        <div style={{ display: "grid", gap: 6 }}>
          <span className="eyebrow">Rutas</span>
          <h1 style={{ fontSize: "2.4rem" }}>Armado de rutas</h1>
          <p style={{ color: "var(--muted)" }}>Crea y edita rutas, y asocia recursos en orden.</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate("/admin/rutas/nueva")}>+ Crear ruta</button>
      </div>

      <div style={{ display: "grid", gap: 14 }}>
        {routes.map((r) => {
          const stats = routeStats(resourcesOfRoute(r, catalog));
          const temas = (r.temas ?? []).map((id) => TEMAS.find((t) => t.id === id)?.name).filter(Boolean);
          return (
            <div key={r.id} className="card" style={{ padding: 20, display: "grid", gap: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, flexWrap: "wrap" }}>
                <div style={{ display: "grid", gap: 6 }}>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <span style={{ width: 14, height: 14, borderRadius: 4, background: r.color, display: "inline-block" }} />
                    <strong style={{ fontSize: "1.1rem" }}>{r.name}</strong>
                  </div>
                  <span className="mono" style={{ fontSize: "0.74rem", color: "var(--muted)" }}>
                    {r.profile} · {(r.resourceIds ?? []).length} recursos · {stats.dificultad ?? "—"} · ≈ {stats.weeks} sem
                  </span>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button className="btn btn-ghost" style={{ padding: "7px 14px", fontSize: "0.82rem" }} onClick={() => navigate(`/ruta/${r.id}`)}>Ver</button>
                  <button className="btn btn-primary" style={{ padding: "7px 16px", fontSize: "0.82rem" }} onClick={() => navigate(`/admin/rutas/${r.id}/editar`)}>Editar</button>
                </div>
              </div>
              {temas.length > 0 && (
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {temas.map((t) => <span key={t} className="tag tag-muted">{t}</span>)}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
