import { DIMENSIONS, ORIGEN_TIPOS } from "../data/mockData";

// Form completo de un recurso, reutilizado por el alta/edicion del admin
// y por la propuesta del usuario (ahi todos los campos son opcionales salvo
// el nombre). Maneja el objeto `form` via `setForm`.

const TIPOS = ["Curso", "Materia", "Certificacion", "Posgrado"];
const NIVELES = ["Inicial", "Intermedio", "Avanzado"];

const field = {
  padding: "10px 12px", border: "1px solid var(--line)",
  borderRadius: "var(--radius-sm)", background: "var(--surface)", fontSize: "0.9rem",
};
const labelStyle = { fontSize: "0.78rem", fontWeight: 600, color: "var(--muted)" };
const chip = (on) => (on
  ? { cursor: "pointer", background: "var(--primary)", color: "#fff", border: "1px solid var(--primary)" }
  : { cursor: "pointer" });

export const emptyResourceForm = () => ({
  name: "", type: "Curso", level: "Inicial",
  duration: { mode: "horas", hours: "", weeks: "", hoursPerWeek: "" },
  link: "", description: "",
  contents: [{ tema: "", items: [""] }],
  relation: { description: "", dims: [], topics: [] },
  origin: { provider: "", kind: "", partOf: "" },
});

export const hydrateResourceForm = (r) => ({
  name: r.name ?? "", type: r.type ?? "Curso", level: r.level ?? "Inicial",
  duration: {
    mode: r.duration?.mode ?? "horas",
    hours: r.duration?.hours ?? "",
    weeks: r.duration?.weeks ?? "",
    hoursPerWeek: r.duration?.hoursPerWeek ?? "",
  },
  link: r.link ?? "", description: r.description ?? "",
  contents: r.contents?.length
    ? r.contents.map((t) => ({ tema: t.tema, items: t.items?.length ? [...t.items] : [""] }))
    : [{ tema: "", items: [""] }],
  relation: {
    description: r.relation?.description ?? "",
    dims: r.relation?.dims ? [...r.relation.dims] : [],
    topics: r.relation?.topics ? [...r.relation.topics] : [],
  },
  origin: { provider: r.origin?.provider ?? "", kind: r.origin?.kind ?? "", partOf: r.origin?.partOf ?? "" },
});

// Limpia el form y devuelve el objeto recurso a guardar.
export function buildResourcePayload(form) {
  const contents = form.contents
    .map((t) => ({ tema: t.tema.trim(), items: t.items.map((s) => s.trim()).filter(Boolean) }))
    .filter((t) => t.tema || t.items.length);
  const titles = contents.map((t) => t.tema).filter(Boolean);
  const origin = (form.origin.provider || form.origin.kind || form.origin.partOf) ? { ...form.origin } : null;
  const d = form.duration;
  const duration = d.mode === "semanas"
    ? { mode: "semanas", weeks: Number(d.weeks) || 0, hoursPerWeek: Number(d.hoursPerWeek) || 0 }
    : { mode: "horas", hours: Number(d.hours) || 0 };
  return {
    name: form.name.trim(),
    type: form.type,
    level: form.level,
    duration,
    link: form.link.trim(),
    description: form.description.trim(),
    contents,
    relation: { description: form.relation.description.trim(), dims: form.relation.dims, topics: form.relation.topics.filter((t) => titles.includes(t)) },
    origin,
  };
}

export default function ResourceForm({ form, setForm }) {
  const setField = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const updateContents = (fn) => setForm((f) => ({ ...f, contents: fn(f.contents) }));
  const setTema = (i, v) => updateContents((cs) => cs.map((t, idx) => (idx === i ? { ...t, tema: v } : t)));
  const addTema = () => updateContents((cs) => [...cs, { tema: "", items: [""] }]);
  const removeTema = (i) => updateContents((cs) => cs.filter((_, idx) => idx !== i));
  const setItem = (i, j, v) => updateContents((cs) => cs.map((t, idx) => (idx === i ? { ...t, items: t.items.map((it, jdx) => (jdx === j ? v : it)) } : t)));
  const addItem = (i) => updateContents((cs) => cs.map((t, idx) => (idx === i ? { ...t, items: [...t.items, ""] } : t)));
  const removeItem = (i, j) => updateContents((cs) => cs.map((t, idx) => (idx === i ? { ...t, items: t.items.filter((_, jdx) => jdx !== j) } : t)));

  const setRel = (k, v) => setForm((f) => ({ ...f, relation: { ...f.relation, [k]: v } }));
  const toggleDim = (key) => setForm((f) => ({
    ...f, relation: { ...f.relation, dims: f.relation.dims.includes(key) ? f.relation.dims.filter((x) => x !== key) : [...f.relation.dims, key] },
  }));
  const toggleTopic = (t) => setForm((f) => ({
    ...f, relation: { ...f.relation, topics: f.relation.topics.includes(t) ? f.relation.topics.filter((x) => x !== t) : [...f.relation.topics, t] },
  }));
  const setOrigin = (k, v) => setForm((f) => ({ ...f, origin: { ...f.origin, [k]: v } }));
  const setDur = (k, v) => setForm((f) => ({ ...f, duration: { ...f.duration, [k]: v } }));
  const setDurMode = (mode) => setForm((f) => ({ ...f, duration: { ...f.duration, mode } }));

  const temaTitles = form.contents.map((t) => t.tema.trim()).filter(Boolean);

  return (
    <>
      {/* Datos basicos */}
      <section className="card" style={{ padding: 24, display: "grid", gap: 16 }}>
        <strong style={{ fontSize: "1.05rem" }}>Datos basicos</strong>
        <div style={{ display: "grid", gap: 6 }}>
          <label style={labelStyle}>Nombre</label>
          <input value={form.name} onChange={(e) => setField("name", e.target.value)} placeholder="Nombre del recurso" style={field} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div style={{ display: "grid", gap: 6 }}>
            <label style={labelStyle}>Tipo</label>
            <select value={form.type} onChange={(e) => setField("type", e.target.value)} style={{ ...field, cursor: "pointer" }}>
              {TIPOS.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div style={{ display: "grid", gap: 6 }}>
            <label style={labelStyle}>Nivel</label>
            <select value={form.level} onChange={(e) => setField("level", e.target.value)} style={{ ...field, cursor: "pointer" }}>
              {NIVELES.map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
        </div>

        <div style={{ display: "grid", gap: 8 }}>
          <label style={labelStyle}>Duracion</label>
          <div style={{ display: "flex", gap: 8 }}>
            {[["horas", "Horas totales"], ["semanas", "Semanas"]].map(([m, lbl]) => (
              <button key={m} type="button" className={form.duration.mode === m ? "btn btn-primary" : "btn btn-ghost"} style={{ padding: "7px 14px", fontSize: "0.82rem" }} onClick={() => setDurMode(m)}>{lbl}</button>
            ))}
          </div>
          {form.duration.mode === "horas" ? (
            <input type="number" min="0" value={form.duration.hours} onChange={(e) => setDur("hours", e.target.value)} placeholder="Horas totales (a tu ritmo)" style={field} />
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <input type="number" min="0" value={form.duration.weeks} onChange={(e) => setDur("weeks", e.target.value)} placeholder="Semanas" style={field} />
              <input type="number" min="0" value={form.duration.hoursPerWeek} onChange={(e) => setDur("hoursPerWeek", e.target.value)} placeholder="Horas por semana" style={field} />
            </div>
          )}
        </div>
        <div style={{ display: "grid", gap: 6 }}>
          <label style={labelStyle}>Link al curso</label>
          <input value={form.link} onChange={(e) => setField("link", e.target.value)} placeholder="https://..." style={field} />
        </div>
      </section>

      {/* Descripcion */}
      <section className="card" style={{ padding: 24, display: "grid", gap: 10 }}>
        <strong style={{ fontSize: "1.05rem" }}>Descripcion</strong>
        <textarea value={form.description} onChange={(e) => setField("description", e.target.value)} rows={3} placeholder="De que trata el recurso" style={{ ...field, resize: "vertical" }} />
      </section>

      {/* Contenidos por temas */}
      <section className="card" style={{ padding: 24, display: "grid", gap: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <strong style={{ fontSize: "1.05rem" }}>Contenidos por temas</strong>
          <button className="btn btn-ghost" style={{ padding: "6px 14px", fontSize: "0.8rem" }} onClick={addTema}>+ Agregar tema</button>
        </div>
        {form.contents.map((t, i) => (
          <div key={i} style={{ display: "grid", gap: 10, padding: 16, border: "1px solid var(--line)", borderRadius: "var(--radius-sm)" }}>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input value={t.tema} onChange={(e) => setTema(i, e.target.value)} placeholder={`Tema ${i + 1}`} style={{ ...field, flex: 1, fontWeight: 600 }} />
              <button className="btn btn-ghost" style={{ padding: "6px 12px", fontSize: "0.8rem" }} onClick={() => removeTema(i)} disabled={form.contents.length === 1}>Quitar tema</button>
            </div>
            <div style={{ display: "grid", gap: 8, paddingLeft: 12 }}>
              {t.items.map((it, j) => (
                <div key={j} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <span style={{ color: "var(--muted-soft)" }}>•</span>
                  <input value={it} onChange={(e) => setItem(i, j, e.target.value)} placeholder="Contenido" style={{ ...field, flex: 1 }} />
                  <button className="btn btn-ghost" style={{ padding: "6px 10px", fontSize: "0.8rem" }} onClick={() => removeItem(i, j)} disabled={t.items.length === 1}>✕</button>
                </div>
              ))}
              <button className="btn btn-ghost" style={{ width: "fit-content", padding: "5px 12px", fontSize: "0.78rem" }} onClick={() => addItem(i)}>+ Agregar contenido</button>
            </div>
          </div>
        ))}
      </section>

      {/* Relacion con la ruta */}
      <section className="card" style={{ padding: 24, display: "grid", gap: 16 }}>
        <strong style={{ fontSize: "1.05rem" }}>Relacion con la ruta</strong>
        <div style={{ display: "grid", gap: 6 }}>
          <label style={labelStyle}>Descripcion de la relacion</label>
          <textarea value={form.relation.description} onChange={(e) => setRel("description", e.target.value)} rows={2} placeholder="Por que este recurso es parte de la ruta" style={{ ...field, resize: "vertical" }} />
        </div>
        <div style={{ display: "grid", gap: 8 }}>
          <label style={labelStyle}>Dimensiones mas relacionadas</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {DIMENSIONS.map((d) => {
              const on = form.relation.dims.includes(d.key);
              return (
                <button key={d.key} type="button" onClick={() => toggleDim(d.key)} className={on ? "tag" : "tag tag-muted"} style={chip(on)}>
                  {d.short}
                </button>
              );
            })}
          </div>
        </div>
        <div style={{ display: "grid", gap: 8 }}>
          <label style={labelStyle}>Temas clave para la ruta</label>
          {temaTitles.length === 0 ? (
            <span style={{ fontSize: "0.82rem", color: "var(--muted-soft)" }}>Carg&aacute; temas en Contenidos para poder destacarlos.</span>
          ) : (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {temaTitles.map((t) => {
                const on = form.relation.topics.includes(t);
                return (
                  <button key={t} type="button" onClick={() => toggleTopic(t)} className={on ? "tag" : "tag tag-muted"} style={chip(on)}>
                    {t}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Origen (opcional) */}
      <section className="card" style={{ padding: 24, display: "grid", gap: 16 }}>
        <div style={{ display: "grid", gap: 2 }}>
          <strong style={{ fontSize: "1.05rem" }}>Origen</strong>
          <span style={{ fontSize: "0.82rem", color: "var(--muted)" }}>Opcional: quien lo dicta. Lo que dejes vacio no se muestra.</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div style={{ display: "grid", gap: 6 }}>
            <label style={labelStyle}>Institucion / plataforma</label>
            <input value={form.origin.provider} onChange={(e) => setOrigin("provider", e.target.value)} placeholder="Ej: UNSAM, Coursera" style={field} />
          </div>
          <div style={{ display: "grid", gap: 6 }}>
            <label style={labelStyle}>Tipo de origen</label>
            <select value={form.origin.kind} onChange={(e) => setOrigin("kind", e.target.value)} style={{ ...field, cursor: "pointer" }}>
              <option value="">— sin especificar</option>
              {ORIGEN_TIPOS.map((k) => <option key={k} value={k}>{k}</option>)}
            </select>
          </div>
        </div>
        <div style={{ display: "grid", gap: 6 }}>
          <label style={labelStyle}>Forma parte de</label>
          <input value={form.origin.partOf} onChange={(e) => setOrigin("partOf", e.target.value)} placeholder="Ej: Lic. en Ciencia de Datos, una especializacion" style={field} />
        </div>
      </section>
    </>
  );
}
