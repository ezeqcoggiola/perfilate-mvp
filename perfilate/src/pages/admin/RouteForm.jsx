import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useApp } from "../../state/store";
import { DIMENSIONS, TEMAS, routeStats, resourcesOfRoute, formatDuration } from "../../data/mockData";

const field = {
  padding: "10px 12px", border: "1px solid var(--line)",
  borderRadius: "var(--radius-sm)", background: "var(--surface)", fontSize: "0.9rem",
};
const labelStyle = { fontSize: "0.78rem", fontWeight: 600, color: "var(--muted)" };
const chip = (on) => (on
  ? { cursor: "pointer", background: "var(--primary)", color: "#fff", border: "1px solid var(--primary)" }
  : { cursor: "pointer" });
const COLORS = ["#5B4BE0", "#2BA9C9", "#7C5CFF", "#FF6B57", "#3FA66A", "#D6597A", "#E0A030", "#3E7BD6"];
const DEFAULT_W = { prog: 50, stats: 50, infra: 50, comm: 50, research: 50 };

const emptyRoute = () => ({ name: "", profile: "", summary: "", color: COLORS[0], weights: { ...DEFAULT_W }, temas: [], resourceIds: [] });
const hydrateRoute = (r) => ({
  name: r.name ?? "", profile: r.profile ?? "", summary: r.summary ?? "", color: r.color ?? COLORS[0],
  weights: { ...DEFAULT_W, ...(r.weights || {}) },
  temas: [...(r.temas ?? [])],
  resourceIds: [...(r.resourceIds ?? [])],
});

export default function RouteForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { routes, catalog, addRoute, updateRoute } = useApp();

  const editing = Boolean(id);
  const existing = id ? routes.find((r) => r.id === id) : null;
  const [form, setForm] = useState(() => (existing ? hydrateRoute(existing) : emptyRoute()));
  const [pickQ, setPickQ] = useState("");

  if (editing && !existing) {
    return (
      <p>
        Ruta no encontrada.{" "}
        <button className="btn btn-ghost" onClick={() => navigate("/admin/rutas")}>Volver</button>
      </p>
    );
  }

  const setField = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const setW = (k, v) => setForm((f) => ({ ...f, weights: { ...f.weights, [k]: Number(v) } }));
  const toggleTema = (tid) => setForm((f) => ({ ...f, temas: f.temas.includes(tid) ? f.temas.filter((x) => x !== tid) : [...f.temas, tid] }));
  const addRes = (rid) => setForm((f) => (f.resourceIds.includes(rid) ? f : { ...f, resourceIds: [...f.resourceIds, rid] }));
  const removeRes = (rid) => setForm((f) => ({ ...f, resourceIds: f.resourceIds.filter((x) => x !== rid) }));
  const moveRes = (i, dir) => setForm((f) => {
    const ids = [...f.resourceIds];
    const j = i + dir;
    if (j < 0 || j >= ids.length) return f;
    [ids[i], ids[j]] = [ids[j], ids[i]];
    return { ...f, resourceIds: ids };
  });

  const camino = resourcesOfRoute(form, catalog);
  const stats = routeStats(camino);
  const pickResults = catalog
    .filter((r) => !form.resourceIds.includes(r.id) && (!pickQ || r.name.toLowerCase().includes(pickQ.toLowerCase())))
    .slice(0, 8);

  const save = () => {
    if (!form.name.trim()) return;
    if (editing) { updateRoute(id, form); navigate(`/ruta/${id}`); }
    else { const newId = `route-${Date.now()}`; addRoute({ id: newId, ...form }); navigate(`/ruta/${newId}`); }
  };

  return (
    <div style={{ display: "grid", gap: 24, maxWidth: 760 }}>
      <button className="btn btn-ghost" style={{ width: "fit-content", padding: "7px 16px", fontSize: "0.85rem" }} onClick={() => navigate(-1)}>
        ← Volver
      </button>

      <div style={{ display: "grid", gap: 6 }}>
        <span className="eyebrow">Rutas</span>
        <h1 style={{ fontSize: "2.2rem" }}>{editing ? "Editar ruta" : "Nueva ruta"}</h1>
        <p style={{ color: "var(--muted)" }}>Dificultad y duraci&oacute;n se calculan de los recursos. (Demo: resetea al recargar.)</p>
      </div>

      {/* Datos */}
      <section className="card" style={{ padding: 24, display: "grid", gap: 16 }}>
        <strong style={{ fontSize: "1.05rem" }}>Datos de la ruta</strong>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div style={{ display: "grid", gap: 6 }}>
            <label style={labelStyle}>Nombre</label>
            <input value={form.name} onChange={(e) => setField("name", e.target.value)} placeholder="Ej: Analista de Datos" style={field} />
          </div>
          <div style={{ display: "grid", gap: 6 }}>
            <label style={labelStyle}>Perfil profesional</label>
            <input value={form.profile} onChange={(e) => setField("profile", e.target.value)} placeholder="Ej: Data Analyst" style={field} />
          </div>
        </div>
        <div style={{ display: "grid", gap: 6 }}>
          <label style={labelStyle}>Resumen</label>
          <textarea value={form.summary} onChange={(e) => setField("summary", e.target.value)} rows={3} placeholder="De que trata la ruta" style={{ ...field, resize: "vertical" }} />
        </div>
        <div style={{ display: "grid", gap: 6 }}>
          <label style={labelStyle}>Color</label>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setField("color", c)}
                style={{ width: 28, height: 28, borderRadius: 8, background: c, cursor: "pointer", border: form.color === c ? "3px solid var(--ink)" : "1px solid var(--line)" }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Pesos por dimension */}
      <section className="card" style={{ padding: 24, display: "grid", gap: 16 }}>
        <div style={{ display: "grid", gap: 2 }}>
          <strong style={{ fontSize: "1.05rem" }}>Perfil de la ruta (pesos)</strong>
          <span style={{ fontSize: "0.82rem", color: "var(--muted)" }}>Definen la afinidad con el perfil del usuario.</span>
        </div>
        {DIMENSIONS.map((d) => (
          <div key={d.key} style={{ display: "grid", gap: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span style={{ fontSize: "0.92rem" }}>{d.label}</span>
              <span className="mono" style={{ fontSize: "0.82rem", color: "var(--primary)" }}>{form.weights[d.key]}</span>
            </div>
            <input type="range" min="0" max="100" value={form.weights[d.key]} onChange={(e) => setW(d.key, e.target.value)} style={{ width: "100%", accentColor: "var(--primary)" }} />
          </div>
        ))}
      </section>

      {/* Temas */}
      <section className="card" style={{ padding: 24, display: "grid", gap: 12 }}>
        <strong style={{ fontSize: "1.05rem" }}>Temas</strong>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {TEMAS.map((t) => {
            const on = form.temas.includes(t.id);
            return (
              <button key={t.id} type="button" onClick={() => toggleTema(t.id)} className={on ? "tag" : "tag tag-muted"} style={chip(on)}>
                {t.name}
              </button>
            );
          })}
        </div>
      </section>

      {/* Camino: recursos asociados */}
      <section className="card" style={{ padding: 24, display: "grid", gap: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: 8 }}>
          <strong style={{ fontSize: "1.05rem" }}>Camino de la ruta</strong>
          <span className="mono" style={{ fontSize: "0.74rem", color: "var(--muted)" }}>
            {stats.dificultad ?? "—"} · ≈ {stats.weeks} sem · {camino.length} recursos
          </span>
        </div>

        {camino.length === 0 && <span style={{ fontSize: "0.85rem", color: "var(--muted-soft)" }}>Todavia no hay recursos en el camino.</span>}

        <div style={{ display: "grid", gap: 8 }}>
          {camino.map((res, i) => (
            <div key={res.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", border: "1px solid var(--line)", borderRadius: "var(--radius-sm)" }}>
              <span className="mono" style={{ fontSize: "0.8rem", color: "var(--muted-soft)", width: 22 }}>{String(i + 1).padStart(2, "0")}</span>
              <div style={{ flex: 1, display: "grid", gap: 2 }}>
                <strong style={{ fontSize: "0.92rem" }}>{res.name}</strong>
                <span style={{ fontSize: "0.76rem", color: "var(--muted)" }}>{res.type} · {res.level} · {formatDuration(res.duration)}</span>
              </div>
              <button className="btn btn-ghost" style={{ padding: "5px 10px", fontSize: "0.8rem" }} onClick={() => moveRes(i, -1)} disabled={i === 0}>↑</button>
              <button className="btn btn-ghost" style={{ padding: "5px 10px", fontSize: "0.8rem" }} onClick={() => moveRes(i, 1)} disabled={i === camino.length - 1}>↓</button>
              <button className="btn btn-ghost" style={{ padding: "5px 10px", fontSize: "0.8rem" }} onClick={() => removeRes(res.id)}>Quitar</button>
            </div>
          ))}
        </div>

        {/* Agregar recurso del catalogo */}
        <div style={{ display: "grid", gap: 8 }}>
          <label style={labelStyle}>Agregar recurso del catalogo</label>
          <input value={pickQ} onChange={(e) => setPickQ(e.target.value)} placeholder="Buscar recurso..." style={field} />
          {pickQ && (
            <div style={{ display: "grid", gap: 6 }}>
              {pickResults.length === 0 && <span style={{ fontSize: "0.82rem", color: "var(--muted-soft)" }}>Sin resultados.</span>}
              {pickResults.map((r) => (
                <div key={r.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "8px 12px", border: "1px solid var(--line)", borderRadius: "var(--radius-sm)" }}>
                  <span style={{ fontSize: "0.88rem" }}>{r.name} <span style={{ color: "var(--muted-soft)" }}>· {r.type}</span></span>
                  <button className="btn btn-ghost" style={{ padding: "5px 12px", fontSize: "0.8rem" }} onClick={() => { addRes(r.id); setPickQ(""); }}>+ Agregar</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <div style={{ display: "flex", gap: 12 }}>
        <button className="btn btn-primary" style={{ opacity: form.name.trim() ? 1 : 0.5 }} onClick={save}>
          {editing ? "Guardar cambios" : "Crear ruta"}
        </button>
        <button className="btn btn-ghost" onClick={() => navigate(-1)}>Cancelar</button>
      </div>
    </div>
  );
}
