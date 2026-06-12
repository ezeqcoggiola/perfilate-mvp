import { useNavigate } from "react-router-dom";
import { useApp } from "../../state/store";
import { ADMIN_ACTIVITY } from "../../data/adminMock";

const SECTIONS = [
  { to: "/admin/catalogo", title: "Catalogo de recursos", desc: "Cargar, editar e importar recursos." },
  { to: "/admin/propuestas", title: "Propuestas de usuarios", desc: "Revisar y aprobar sugerencias." },
  { to: "/admin/rutas", title: "Armado de rutas", desc: "Crear rutas y asociar recursos." },
  { to: "/admin/moderacion", title: "Moderacion", desc: "Comentarios y encuestas." },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const { catalog, proposals, routes, comments } = useApp();

  const pending = proposals.filter((p) => p.status === "pendiente").length;
  const refMonth = comments.reduce((m, c) => (c.date > m ? c.date : m), "").slice(0, 7);
  const commentsThisMonth = comments.filter((c) => c.date.slice(0, 7) === refMonth).length;

  const kpis = [
    { label: "Recursos en catalogo", value: catalog.length },
    { label: "Rutas activas", value: routes.length },
    { label: "Propuestas pendientes", value: pending, accent: pending > 0 },
    { label: "Comentarios este mes", value: commentsThisMonth },
  ];

  return (
    <div style={{ display: "grid", gap: 32 }}>
      <div style={{ display: "grid", gap: 6 }}>
        <span className="eyebrow">Panel de administracion</span>
        <h1 style={{ fontSize: "2.4rem" }}>Resumen</h1>
        <p style={{ color: "var(--muted)" }}>El estado del catalogo y la actividad de la plataforma.</p>
      </div>

      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
        {kpis.map((k) => (
          <div key={k.label} className="card" style={{ padding: 22, display: "grid", gap: 6 }}>
            <span className="mono" style={{ fontSize: "2rem", fontWeight: 700, color: k.accent ? "var(--accent)" : "var(--ink)" }}>{k.value}</span>
            <span style={{ fontSize: "0.85rem", color: "var(--muted)" }}>{k.label}</span>
          </div>
        ))}
      </div>

      {/* Accesos a secciones */}
      <section style={{ display: "grid", gap: 16 }}>
        <h3 style={{ fontSize: "1.2rem" }}>Secciones</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16 }}>
          {SECTIONS.map((s) => (
            <button
              key={s.to}
              className="card"
              onClick={() => navigate(s.to)}
              style={{ textAlign: "left", padding: 20, display: "grid", gap: 6, cursor: "pointer" }}
              onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "var(--shadow-md)")}
              onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "var(--shadow-sm)")}
            >
              <strong style={{ fontSize: "1.02rem" }}>{s.title}</strong>
              <span style={{ fontSize: "0.86rem", color: "var(--muted)" }}>{s.desc}</span>
              <span style={{ fontSize: "0.85rem", color: "var(--primary)", fontWeight: 600, marginTop: 4 }}>Abrir →</span>
            </button>
          ))}
        </div>
      </section>

      {/* Actividad reciente */}
      <section style={{ display: "grid", gap: 16 }}>
        <h3 style={{ fontSize: "1.2rem" }}>Actividad reciente</h3>
        <div className="card" style={{ padding: 8 }}>
          {ADMIN_ACTIVITY.map((a, i) => (
            <div
              key={a.id}
              style={{
                display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16,
                padding: "14px 16px", borderTop: i === 0 ? "none" : "1px solid var(--line)",
              }}
            >
              <span style={{ fontSize: "0.92rem" }}>{a.text}</span>
              <span className="mono" style={{ fontSize: "0.74rem", color: "var(--muted-soft)", whiteSpace: "nowrap" }}>{a.when}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
