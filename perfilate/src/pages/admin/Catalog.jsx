import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../state/store";
import { routesOfResource } from "../../data/mockData";

const TIPOS = ["Curso", "Materia", "Certificacion", "Posgrado"];
const NIVELES = ["Inicial", "Intermedio", "Avanzado"];

const control = {
  padding: "10px 14px", border: "1px solid var(--line)",
  borderRadius: "var(--radius-pill)", background: "var(--surface)", fontSize: "0.88rem",
};
const field = {
  padding: "10px 12px", border: "1px solid var(--line)",
  borderRadius: "var(--radius-sm)", background: "var(--surface)", fontSize: "0.9rem",
};
const COLS = "2fr 1fr 1fr 1.3fr auto";
const ESTADOS = ["activo", "desactualizado", "baja"];
const estadoStyle = {
  desactualizado: { background: "var(--accent-soft)", color: "var(--danger-strong)" },
  baja: { background: "var(--danger-soft)", color: "var(--danger-strong)" },
};
const miniSelect = { padding: "5px 8px", border: "1px solid var(--line)", borderRadius: "var(--radius-sm)", background: "var(--surface)", fontSize: "0.78rem", cursor: "pointer" };

export default function Catalog() {
  const navigate = useNavigate();
  const { catalog, addCatalogResources, updateCatalogResource, routes } = useApp();
  const routeNames = (id) => {
    const rs = routesOfResource(id, routes);
    return rs.length === 0 ? "—" : rs.length === 1 ? rs[0].name : `${rs[0].name} +${rs.length - 1}`;
  };

  const [q, setQ] = useState("");
  const [fTipo, setFTipo] = useState("");
  const [fNivel, setFNivel] = useState("");
  const [fRuta, setFRuta] = useState("");
  const [showBulk, setShowBulk] = useState(false);
  const [bulk, setBulk] = useState("");

  const filtered = catalog.filter((r) => {
    const mq = !q || r.name.toLowerCase().includes(q.toLowerCase());
    const mt = !fTipo || r.type === fTipo;
    const mn = !fNivel || r.level === fNivel;
    const mr = !fRuta || routesOfResource(r.id, routes).some((rt) => rt.id === fRuta);
    return mq && mt && mn && mr;
  });

  const importBulk = () => {
    const items = bulk.split("\n").map((l) => l.trim()).filter(Boolean).map((line) => {
      const [name, type, level] = line.split(/[;,]/).map((s) => (s ? s.trim() : ""));
      return {
        name: name || "Sin nombre",
        type: TIPOS.includes(type) ? type : "Curso",
        level: NIVELES.includes(level) ? level : "Inicial",
      };
    });
    if (items.length) addCatalogResources(items);
    setBulk(""); setShowBulk(false);
  };

  return (
    <div style={{ display: "grid", gap: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 16, flexWrap: "wrap" }}>
        <div style={{ display: "grid", gap: 6 }}>
          <span className="eyebrow">Catalogo</span>
          <h1 style={{ fontSize: "2.4rem" }}>Catalogo de recursos</h1>
          <p style={{ color: "var(--muted)" }}>Cargar, editar e importar recursos. (Demo: se reinicia al recargar.)</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn btn-ghost" onClick={() => setShowBulk((v) => !v)}>Importar en bulk</button>
          <button className="btn btn-primary" onClick={() => navigate("/admin/catalogo/nuevo")}>+ Cargar recurso</button>
        </div>
      </div>

      {/* Importar en bulk */}
      {showBulk && (
        <div className="card" style={{ padding: 24, display: "grid", gap: 12 }}>
          <strong style={{ fontSize: "1.05rem" }}>Importar en bulk</strong>
          <span style={{ fontSize: "0.85rem", color: "var(--muted)" }}>
            Un recurso por linea, formato <span className="mono">Nombre; Tipo; Nivel</span>. Ej: <span className="mono">Curso de Airflow; Curso; Intermedio</span>
          </span>
          <textarea
            value={bulk}
            onChange={(e) => setBulk(e.target.value)}
            rows={5}
            placeholder={"Curso de Airflow; Curso; Intermedio\nAlgebra lineal; Materia; Inicial"}
            style={{ ...field, resize: "vertical", fontFamily: "var(--font-mono)", fontSize: "0.85rem" }}
          />
          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn btn-primary" onClick={importBulk}>Importar</button>
            <button className="btn btn-ghost" onClick={() => setShowBulk(false)}>Cancelar</button>
          </div>
        </div>
      )}

      {/* Filtros */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar por nombre..." style={{ ...control, flex: 1, minWidth: 200 }} />
        <select value={fTipo} onChange={(e) => setFTipo(e.target.value)} style={{ ...control, cursor: "pointer" }}>
          <option value="">Todos los tipos</option>
          {TIPOS.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <select value={fNivel} onChange={(e) => setFNivel(e.target.value)} style={{ ...control, cursor: "pointer" }}>
          <option value="">Todos los niveles</option>
          {NIVELES.map((n) => <option key={n} value={n}>{n}</option>)}
        </select>
        <select value={fRuta} onChange={(e) => setFRuta(e.target.value)} style={{ ...control, cursor: "pointer" }}>
          <option value="">Todas las rutas</option>
          {routes.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
        </select>
      </div>

      <span className="mono" style={{ fontSize: "0.82rem", color: "var(--muted)" }}>
        {filtered.length} {filtered.length === 1 ? "recurso" : "recursos"}
      </span>

      {/* Tabla */}
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: COLS, gap: 12, padding: "14px 18px", background: "var(--bg)", borderBottom: "1px solid var(--line)" }}>
          {["Nombre", "Tipo", "Nivel", "Ruta", ""].map((h, i) => (
            <span key={i} className="mono" style={{ fontSize: "0.72rem", letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--muted)" }}>{h}</span>
          ))}
        </div>
        {filtered.map((r) => (
          <div
            key={r.id}
            style={{ display: "grid", gridTemplateColumns: COLS, gap: 12, padding: "14px 18px", borderTop: "1px solid var(--line)", alignItems: "center", cursor: "pointer" }}
            onClick={() => navigate(`/recurso/${r.id}`)}
            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <span style={{ fontSize: "0.92rem", fontWeight: 600, display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
              {r.name}
              {r.estado && r.estado !== "activo" && <span className="tag" style={{ ...estadoStyle[r.estado], fontSize: "0.62rem" }}>{r.estado}</span>}
            </span>
            <span><span className="tag tag-muted">{r.type}</span></span>
            <span style={{ fontSize: "0.88rem", color: "var(--muted)" }}>{r.level}</span>
            <span style={{ fontSize: "0.88rem", color: "var(--muted)" }}>{routeNames(r.id)}</span>
            <div style={{ display: "flex", gap: 8, alignItems: "center", justifyContent: "flex-end" }} onClick={(e) => e.stopPropagation()}>
              <select value={r.estado || "activo"} onChange={(e) => updateCatalogResource(r.id, { estado: e.target.value })} style={miniSelect}>
                {ESTADOS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <button className="btn btn-ghost" style={{ padding: "6px 14px", fontSize: "0.8rem" }} onClick={() => navigate(`/admin/catalogo/${r.id}/editar`)}>Editar</button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div style={{ padding: 32, textAlign: "center", color: "var(--muted)" }}>No hay recursos con esos filtros.</div>
        )}
      </div>
    </div>
  );
}
