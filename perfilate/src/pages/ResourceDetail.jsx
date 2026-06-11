import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useApp } from "../state/store";
import { ROUTES, DIMENSIONS } from "../data/mockData";

// Estrellas 1-5. Si recibe onChange es interactiva; si no, es de solo lectura.
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
            style={{
              fontSize: size, lineHeight: 1,
              color: on ? "var(--accent)" : "var(--line)",
              cursor: readOnly ? "default" : "pointer",
            }}
          >
            ★
          </span>
        );
      })}
    </div>
  );
}

const dimLabel = (key) => DIMENSIONS.find((d) => d.key === key)?.short ?? key;

export default function ResourceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { role, catalog, saved, toggleSaved, ratings, rateResource } = useApp();

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

  const route = ROUTES.find((r) => r.id === res.routeId);
  const routeResources = res.routeId ? catalog.filter((r) => r.routeId === res.routeId) : [];
  const step = routeResources.findIndex((r) => r.id === res.id) + 1;
  const total = routeResources.length;

  const origin = res.origin;
  const hasOrigin = origin && (origin.provider || origin.kind || origin.partOf);
  const hasRating = res.rating && res.rating.count > 0;

  const submit = () => {
    if (!score) return;
    rateResource(res.id, score, comment.trim());
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
            {res.duration && <span className="tag tag-muted">⏱ {res.duration}</span>}
          </div>
          <h1 style={{ fontSize: "2.4rem" }}>{res.name}</h1>
          {route ? (
            <button
              onClick={() => navigate(`/ruta/${route.id}`)}
              style={{ width: "fit-content", fontSize: "0.9rem", color: "var(--primary)", fontWeight: 600 }}
            >
              Parte de la ruta: {route.name} →
            </button>
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

            {route && total > 0 && (
              <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", background: "var(--primary-wash)", borderRadius: "var(--radius-sm)" }}>
                <span className="mono" style={{ fontSize: "0.8rem", color: "var(--primary-deep)" }}>Paso {step} de {total}</span>
                <span style={{ fontSize: "0.85rem", color: "var(--ink-soft)" }}>en {route.name}</span>
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
          <a className="btn btn-primary" href={res.link} target="_blank" rel="noreferrer" style={{ width: "fit-content" }}>
            Ir al curso ↗
          </a>
        ) : (
          <span style={{ fontSize: "0.9rem", color: "var(--muted-soft)" }}>Sin enlace cargado.</span>
        )}
        <span className="mono" style={{ fontSize: "0.72rem", color: "var(--muted-soft)" }}>Enlace de ejemplo · maqueta de demostracion</span>
      </section>

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
