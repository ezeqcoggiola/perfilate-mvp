import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useApp } from "../../state/store";
import { DIMENSIONS, formatDuration } from "../../data/mockData";
import Modal from "../../components/Modal";

const dimLabel = (key) => DIMENSIONS.find((d) => d.key === key)?.short ?? key;
const STATUS_STYLE = {
  pendiente: { background: "var(--primary-wash)", color: "var(--primary-deep)" },
  aprobada: { background: "var(--ok-soft)", color: "var(--ok-strong)" },
  descartada: { background: "var(--bg)", color: "var(--muted)" },
};

export default function ProposalDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { proposals, setProposalStatus, routes } = useApp();

  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectComment, setRejectComment] = useState("");
  const [rejectSent, setRejectSent] = useState(false);

  const p = proposals.find((x) => x.id === id);
  if (!p) {
    return (
      <p>
        Propuesta no encontrada.{" "}
        <button className="btn btn-ghost" onClick={() => navigate("/admin/propuestas")}>Volver</button>
      </p>
    );
  }

  const route = routes.find((r) => r.id === p.routeId);
  const origin = p.origin;
  const hasOrigin = origin && (origin.provider || origin.kind || origin.partOf);
  const hasRelation = p.relation && (p.relation.description || p.relation.dims?.length || p.relation.topics?.length);
  const hasContents = p.contents?.some((t) => t.items?.length);

  const reconsider = () => setProposalStatus(p.id, "pendiente");
  const openReject = () => { setRejectComment(""); setRejectSent(false); setRejectOpen(true); };
  const sendReject = () => { setProposalStatus(p.id, "descartada"); setRejectSent(true); };
  const closeReject = () => { setRejectOpen(false); setRejectComment(""); setRejectSent(false); };

  return (
    <div style={{ display: "grid", gap: 28, maxWidth: 760 }}>
      <button className="btn btn-ghost" style={{ width: "fit-content", padding: "7px 16px", fontSize: "0.85rem" }} onClick={() => navigate("/admin/propuestas")}>
        ← Volver a propuestas
      </button>

      <header style={{ display: "grid", gap: 12 }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          <span className="tag tag-muted">{p.type}</span>
          <span className="tag tag-muted">{p.level}</span>
          {formatDuration(p.duration) && <span className="tag tag-muted">⏱ {formatDuration(p.duration)}</span>}
          <span className="tag" style={{ ...STATUS_STYLE[p.status], textTransform: "capitalize" }}>{p.status}</span>
        </div>
        <h1 style={{ fontSize: "2.2rem" }}>{p.name}</h1>
        <span style={{ fontSize: "0.9rem", color: "var(--muted)" }}>
          Ruta sugerida: <strong>{route ? route.name : "Sin definir"}</strong>
        </span>
        <span className="mono" style={{ fontSize: "0.74rem", color: "var(--muted-soft)" }}>propuesto por {p.by} · {p.date}</span>
      </header>

      {p.motivo && (
        <section className="card" style={{ padding: 24, display: "grid", gap: 8 }}>
          <h3 style={{ fontSize: "1.1rem" }}>Motivo de la propuesta</h3>
          <p style={{ color: "var(--ink-soft)", fontStyle: "italic" }}>“{p.motivo}”</p>
        </section>
      )}

      {p.description && (
        <section className="card" style={{ padding: 24, display: "grid", gap: 8 }}>
          <h3 style={{ fontSize: "1.1rem" }}>Descripci&oacute;n</h3>
          <p style={{ color: "var(--ink-soft)" }}>{p.description}</p>
        </section>
      )}

      {hasContents && (
        <section className="card" style={{ padding: 24, display: "grid", gap: 16 }}>
          <h3 style={{ fontSize: "1.1rem" }}>Contenidos</h3>
          {p.contents.filter((t) => t.items?.length).map((t) => (
            <div key={t.tema} style={{ display: "grid", gap: 8 }}>
              <strong style={{ fontSize: "0.95rem" }}>{t.tema || "Sin titulo"}</strong>
              <div style={{ display: "grid", gap: 6 }}>
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

      {hasRelation && (
        <section className="card" style={{ padding: 24, display: "grid", gap: 14 }}>
          <h3 style={{ fontSize: "1.1rem" }}>Relaci&oacute;n con la ruta</h3>
          {p.relation.description && <p style={{ color: "var(--ink-soft)", fontSize: "0.95rem" }}>{p.relation.description}</p>}
          {p.relation.dims?.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {p.relation.dims.map((k) => <span key={k} className="tag">{dimLabel(k)}</span>)}
            </div>
          )}
          {p.relation.topics?.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {p.relation.topics.map((t) => <span key={t} className="tag tag-muted">{t}</span>)}
            </div>
          )}
        </section>
      )}

      {hasOrigin && (
        <section className="card" style={{ padding: 24, display: "grid", gap: 8 }}>
          <h3 style={{ fontSize: "1.1rem" }}>Origen</h3>
          <div style={{ display: "grid", gap: 6, fontSize: "0.92rem" }}>
            {origin.provider && <div><span style={{ color: "var(--muted)" }}>Dictado por: </span><strong>{origin.provider}</strong></div>}
            {origin.kind && <div><span style={{ color: "var(--muted)" }}>Tipo: </span>{origin.kind}</div>}
            {origin.partOf && <div><span style={{ color: "var(--muted)" }}>Forma parte de: </span>{origin.partOf}</div>}
          </div>
        </section>
      )}

      {p.link && (
        <section className="card" style={{ padding: 24, display: "grid", gap: 12 }}>
          <h3 style={{ fontSize: "1.1rem" }}>Enlace</h3>
          <a className="btn btn-ghost" href={p.link} target="_blank" rel="noreferrer" style={{ width: "fit-content" }}>Ver enlace ↗</a>
        </section>
      )}

      {/* Acciones */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        {p.status === "pendiente" && (
          <>
            <button className="btn btn-primary" onClick={() => navigate(`/admin/catalogo/nuevo?propuesta=${p.id}`)}>Aprobar e incorporar</button>
            <button className="btn btn-ghost" onClick={openReject}>Descartar</button>
          </>
        )}
        {p.status === "aprobada" && <span style={{ alignSelf: "center", color: "var(--ok-strong)", fontWeight: 600 }}>✓ Ya incorporada al catalogo</span>}
        {p.status === "descartada" && <button className="btn btn-ghost" onClick={reconsider}>Reconsiderar</button>}
      </div>

      {rejectOpen && (
        <Modal title={rejectSent ? "Rechazo enviado" : "Rechazar propuesta"} onClose={closeReject}>
          {!rejectSent ? (
            <>
              <p style={{ fontSize: "0.9rem", color: "var(--muted)" }}>
                Conta por qu&eacute; se rechaza “{p.name}”. Se le enviar&aacute; el motivo a <strong>{p.by}</strong>.
              </p>
              <textarea
                value={rejectComment}
                onChange={(e) => setRejectComment(e.target.value)}
                rows={4}
                placeholder="Motivo del rechazo"
                style={{ padding: "12px 14px", border: "1px solid var(--line)", borderRadius: "var(--radius-sm)", background: "var(--surface)", resize: "vertical" }}
              />
              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                <button className="btn btn-ghost" onClick={closeReject}>Cancelar</button>
                <button className="btn" style={{ background: "var(--danger)", color: "#fff", opacity: rejectComment.trim() ? 1 : 0.5 }} onClick={sendReject}>
                  Enviar rechazo
                </button>
              </div>
            </>
          ) : (
            <>
              <p style={{ fontSize: "0.9rem", color: "var(--ink-soft)" }}>
                ✓ Se le enviar&iacute;a a <strong>{p.by}</strong> el siguiente motivo:
              </p>
              <p style={{ fontStyle: "italic", color: "var(--muted)", padding: "10px 12px", background: "var(--bg)", borderRadius: "var(--radius-sm)" }}>
                “{rejectComment}”
              </p>
              <span className="mono" style={{ fontSize: "0.72rem", color: "var(--muted-soft)" }}>Demo: el comentario no se guarda.</span>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button className="btn btn-primary" onClick={closeReject}>Cerrar</button>
              </div>
            </>
          )}
        </Modal>
      )}
    </div>
  );
}
