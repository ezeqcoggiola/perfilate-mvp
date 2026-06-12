import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useApp } from "../state/store";
import { DIMENSIONS, formatDuration, routesOfResource, relativeDate } from "../data/mockData";

// Estrellas 1-5. Si recibe onChange es interactiva; si no, de solo lectura.
function Stars({ value, onChange, size = 26 }) {
  const [hover, setHover] = useState(0);
  const readOnly = !onChange;
  return (
    <div style={{ display: "flex", gap: 4 }} onMouseLeave={() => setHover(0)}>
      {[1, 2, 3, 4, 5].map((i) => {
        const on = (hover || value) >= i;
        return (
          <span
            key={i}
            role={readOnly ? undefined : "button"}
            onMouseEnter={readOnly ? undefined : () => setHover(i)}
            onClick={readOnly ? undefined : () => onChange(i)}
            style={{ fontSize: size, lineHeight: 1, color: on ? "var(--accent)" : "var(--line)", cursor: readOnly ? "default" : "pointer" }}
          >
            ★
          </span>
        );
      })}
    </div>
  );
}

const dimLabel = (key) => DIMENSIONS.find((d) => d.key === key)?.short ?? key;
const chip = (on) => (on
  ? { cursor: "pointer", background: "var(--primary)", color: "#fff", border: "1px solid var(--primary)" }
  : { cursor: "pointer" });

export default function ResourceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { role, profile, catalog, routes, saved, toggleSaved, ratings, rateResource, toggleResourceInRoute, comments, upsertUserComment } = useApp();

  const res = catalog.find((r) => r.id === id);
  const userRating = res ? ratings[res.id] : undefined;

  const [score, setScore] = useState(userRating?.score ?? 0);
  const [comment, setComment] = useState(userRating?.comment ?? "");
  const [sent, setSent] = useState(false);

  if (!res) {
    return (
      <p>
        Recurso no encontrado.{" "}
        <button className="btn btn-ghost" onClick={() => navigate("/app/rutas")}>Volver</button>
      </p>
    );
  }

  const myRoutes = routesOfResource(res.id, routes);
  const origin = res.origin;
  const hasOrigin = origin && (origin.provider || origin.kind || origin.partOf);
  const hasRating = res.rating && res.rating.count > 0;
  const durStr = formatDuration(res.duration);

  const resComments = comments.filter((c) => c.resourceId === res.id && c.status === "visible").sort((a, b) => b.date.localeCompare(a.date));
  const today = comments.reduce((m, c) => (c.date > m ? c.date : m), "");

  const submit = () => {
    if (!score) return;
    rateResource(res.id, score, comment.trim());
    if (comment.trim()) {
      upsertUserComment({ by: profile.name || "Invitado", resourceId: res.id, resourceName: res.name, score, text: comment.trim() });
    }
    setSent(true);
  };

  return (
    <div style={{ display: "grid", gap: 32 }}>
      <button className="btn btn-ghost" style={{ width: "fit-content", padding: "7px 16px", fontSize: "0.85rem" }} onClick={() => navigate(-1)}>
        ← Volver
      </button>

      <header style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 24, alignItems: "start" }}>
        <div style={{ display: "grid", gap: 12 }}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <span className="tag tag-muted">{res.type}</span>
            <span className="tag tag-muted">{res.level}</span>
            {durStr && <span className="tag tag-muted">⏱ {durStr}</span>}
          </div>
          <h1 style={{ fontSize: "2.4rem" }}>{res.name}</h1>

          {myRoutes.length > 0 ? (
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
              <span style={{ fontSize: "0.85rem", color: "var(--muted)" }}>Parte de:</span>
              {myRoutes.map((rt) => (
                <button key={rt.id} className="tag" style={{ cursor: "pointer", background: "var(--primary-wash)", color: "var(--primary-deep)" }} onClick={() => navigate(`/ruta/${rt.id}`)}>
                  {rt.name} · paso {rt.resourceIds.indexOf(res.id) + 1}/{rt.resourceIds.length}
                </button>
              ))}
            </div>
          ) : (
            <span style={{ fontSize: "0.9rem", color: "var(--muted-soft)" }}>Sin ruta asignada</span>
          )}

          <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
            <button className="btn btn-primary" style={{ width: "fit-content" }} onClick={() => toggleSaved(res.id)}>
              {saved.includes(res.id) ? "♥ Recurso guardado" : "♡ Guardar recurso"}
            </button>
            {role === "admin" && (
              <button className="btn btn-ghost" style={{ width: "fit-content" }} onClick={() => navigate(`/admin/catalogo/${res.id}/editar`)}>
                ✎ Editar recurso
              </button>
            )}
          </div>
        </div>

        {hasRating && (
          <div className="card" style={{ padding: 20, display: "grid", placeItems: "center", gap: 4, minWidth: 150 }}>
            <span className="eyebrow">Valoracion</span>
            <span className="mono" style={{ fontSize: "1.8rem", fontWeight: 700 }}>{res.rating.avg}</span>
            <Stars value={Math.round(res.rating.avg)} size={16} />
            <span style={{ fontSize: "0.78rem", color: "var(--muted)" }}>{res.rating.count} votos</span>
          </div>
        )}
      </header>

      {/* Admin: agregar/quitar de rutas */}
      {role === "admin" && (
        <section className="card" style={{ padding: 24, display: "grid", gap: 12, background: "var(--primary-wash)" }}>
          <div style={{ display: "grid", gap: 2 }}>
            <strong style={{ fontSize: "1.05rem" }}>Rutas del recurso (admin)</strong>
            <span style={{ fontSize: "0.85rem", color: "var(--muted)" }}>Toc&aacute; para agregar o quitar este recurso de cada ruta.</span>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {routes.map((rt) => {
              const inRoute = (rt.resourceIds ?? []).includes(res.id);
              return (
                <button key={rt.id} type="button" onClick={() => toggleResourceInRoute(rt.id, res.id)} className={inRoute ? "tag" : "tag tag-muted"} style={chip(inRoute)}>
                  {inRoute ? "✓ " : "+ "}{rt.name}
                </button>
              );
            })}
          </div>
        </section>
      )}

      {res.description && (
        <section className="card" style={{ padding: 24, display: "grid", gap: 10 }}>
          <h3 style={{ fontSize: "1.1rem" }}>Descripci&oacute;n</h3>
          <p style={{ color: "var(--ink-soft)" }}>{res.description}</p>
        </section>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, alignItems: "start" }}>
        {res.contents?.length > 0 && (
          <section className="card" style={{ padding: 24, display: "grid", gap: 18 }}>
            <h3 style={{ fontSize: "1.1rem" }}>Contenidos</h3>
            {res.contents.map((t) => (
              <div key={t.tema} style={{ display: "grid", gap: 10 }}>
                <strong style={{ fontSize: "0.95rem" }}>{t.tema}</strong>
                <div style={{ display: "grid", gap: 8 }}>
                  {t.items.map((it) => (
                    <div key={it} style={{ display: "flex", gap: 10, alignItems: "center" }}>
                      <span style={{ color: "var(--primary)" }}>✓</span>
                      <span style={{ fontSize: "0.9rem" }}>{it}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </section>
        )}

        {res.relation && (
          <section className="card" style={{ padding: 24, display: "grid", gap: 14 }}>
            <h3 style={{ fontSize: "1.1rem" }}>Relaci&oacute;n con la ruta</h3>
            {res.relation.description && <p style={{ color: "var(--ink-soft)", fontSize: "0.95rem" }}>{res.relation.description}</p>}
            {res.relation.dims?.length > 0 && (
              <div style={{ display: "grid", gap: 6 }}>
                <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--muted)" }}>Mas relacionado con</span>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {res.relation.dims.map((k) => <span key={k} className="tag">{dimLabel(k)}</span>)}
                </div>
              </div>
            )}
            {res.relation.topics?.length > 0 && (
              <div style={{ display: "grid", gap: 6 }}>
                <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--muted)" }}>Temas clave para la ruta</span>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {res.relation.topics.map((t) => <span key={t} className="tag tag-muted">{t}</span>)}
                </div>
              </div>
            )}
          </section>
        )}
      </div>

      {hasOrigin && (
        <section className="card" style={{ padding: 24, display: "grid", gap: 10 }}>
          <h3 style={{ fontSize: "1.1rem" }}>Origen</h3>
          <div style={{ display: "grid", gap: 6, fontSize: "0.92rem" }}>
            {origin.provider && <div><span style={{ color: "var(--muted)" }}>Dictado por: </span><strong>{origin.provider}</strong></div>}
            {origin.kind && <div><span style={{ color: "var(--muted)" }}>Tipo: </span>{origin.kind}</div>}
            {origin.partOf && <div><span style={{ color: "var(--muted)" }}>Forma parte de: </span>{origin.partOf}</div>}
          </div>
        </section>
      )}

      <section className="card" style={{ padding: 24, display: "grid", gap: 12 }}>
        <h3 style={{ fontSize: "1.1rem" }}>Acceso al curso</h3>
        {res.link ? (
          <a className="btn btn-primary" href={res.link} target="_blank" rel="noreferrer" style={{ width: "fit-content" }}>Ir al curso ↗</a>
        ) : (
          <span style={{ fontSize: "0.9rem", color: "var(--muted-soft)" }}>Sin enlace cargado.</span>
        )}
        <span className="mono" style={{ fontSize: "0.72rem", color: "var(--muted-soft)" }}>Enlace de ejemplo · maqueta de demostracion</span>
      </section>

      {/* Comentarios de la comunidad */}
      {resComments.length > 0 && (
        <section className="card" style={{ padding: 24, display: "grid", gap: 16 }}>
          <h3 style={{ fontSize: "1.1rem" }}>Comentarios <span className="mono" style={{ fontSize: "0.85rem", color: "var(--muted-soft)" }}>({resComments.length})</span></h3>
          <div style={{ display: "grid", gap: 14 }}>
            {resComments.map((c) => (
              <div key={c.id} style={{ display: "grid", gap: 6, borderTop: "1px solid var(--line)", paddingTop: 14 }}>
                <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                  <strong style={{ fontSize: "0.92rem" }}>{c.by}</strong>
                  <Stars value={c.score} size={14} />
                  <span className="mono" style={{ fontSize: "0.72rem", color: "var(--muted-soft)" }}>{relativeDate(c.date, today)}</span>
                </div>
                <p style={{ fontSize: "0.9rem", color: "var(--ink-soft)" }}>“{c.text}”</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Puntuacion del usuario */}
      <section className="card" style={{ padding: 24, display: "grid", gap: 14 }}>
        <h3 style={{ fontSize: "1.1rem" }}>Tu puntuaci&oacute;n</h3>
        <p style={{ fontSize: "0.9rem", color: "var(--muted)" }}>¿Te sirvi&oacute; este recurso? Dejanos tu valoraci&oacute;n.</p>
        <Stars value={score} onChange={(v) => { setScore(v); setSent(false); }} />
        <textarea
          value={comment}
          onChange={(e) => { setComment(e.target.value); setSent(false); }}
          placeholder="Dejá un comentario (opcional)"
          rows={3}
          style={{ padding: "12px 14px", border: "1px solid var(--line)", borderRadius: "var(--radius-sm)", background: "var(--surface)", resize: "vertical" }}
        />
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <button className="btn btn-primary" style={{ width: "fit-content", opacity: score ? 1 : 0.5 }} onClick={submit}>
            {userRating ? "Actualizar puntuacion" : "Enviar puntuacion"}
          </button>
          {sent && <span style={{ fontSize: "0.88rem", color: "var(--ok)" }}>¡Gracias! Guardamos tu puntuaci&oacute;n.</span>}
        </div>
      </section>
    </div>
  );
}
