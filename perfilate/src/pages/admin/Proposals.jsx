import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../state/store";
import Modal from "../../components/Modal";

const TABS = [
  { key: "pendiente", label: "Pendientes" },
  { key: "aprobada", label: "Aprobadas" },
  { key: "descartada", label: "Descartadas" },
];

const STATUS_STYLE = {
  pendiente: { background: "var(--primary-wash)", color: "var(--primary-deep)" },
  aprobada: { background: "var(--ok-soft)", color: "var(--ok-strong)" },
  descartada: { background: "var(--bg)", color: "var(--muted)" },
};

export default function Proposals() {
  const navigate = useNavigate();
  const { proposals, setProposalStatus, routes } = useApp();
  const [tab, setTab] = useState("pendiente");

  // Popup de rechazo (el comentario no se guarda; es solo demostrativo).
  const [rejecting, setRejecting] = useState(null);
  const [rejectComment, setRejectComment] = useState("");
  const [rejectSent, setRejectSent] = useState(false);
  const openReject = (p) => { setRejecting(p); setRejectComment(""); setRejectSent(false); };
  const closeReject = () => { setRejecting(null); setRejectComment(""); setRejectSent(false); };
  const sendReject = () => { setProposalStatus(rejecting.id, "descartada"); setRejectSent(true); };

  const counts = TABS.reduce((acc, t) => ({ ...acc, [t.key]: proposals.filter((p) => p.status === t.key).length }), {});
  const list = proposals.filter((p) => p.status === tab);

  return (
    <div style={{ display: "grid", gap: 24 }}>
      <div style={{ display: "grid", gap: 6 }}>
        <span className="eyebrow">Propuestas</span>
        <h1 style={{ fontSize: "2.4rem" }}>Propuestas de usuarios</h1>
        <p style={{ color: "var(--muted)" }}>Recursos sugeridos por la comunidad. Revisalos e incorporalos al catalogo o descartalos.</p>
      </div>

      {/* Tabs por estado */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {TABS.map((t) => (
          <button
            key={t.key}
            className={tab === t.key ? "btn btn-primary" : "btn btn-ghost"}
            style={{ padding: "9px 18px", fontSize: "0.9rem" }}
            onClick={() => setTab(t.key)}
          >
            {t.label} <span className="mono" style={{ opacity: 0.7 }}>{counts[t.key]}</span>
          </button>
        ))}
      </div>

      {list.length === 0 && (
        <div className="card" style={{ padding: 40, textAlign: "center", color: "var(--muted)" }}>
          No hay propuestas {tab === "pendiente" ? "pendientes" : tab === "aprobada" ? "aprobadas" : "descartadas"}.
        </div>
      )}

      <div style={{ display: "grid", gap: 14 }}>
        {list.map((p) => {
          const route = routes.find((r) => r.id === p.routeId);
          const temaCount = p.contents?.filter((t) => t.items?.length).length ?? 0;
          const extras = [];
          if (p.description) extras.push("descripcion");
          if (temaCount) extras.push(`${temaCount} ${temaCount === 1 ? "tema" : "temas"}`);
          if (p.relation && (p.relation.description || p.relation.dims?.length || p.relation.topics?.length)) extras.push("relacion");
          if (p.origin && (p.origin.provider || p.origin.kind || p.origin.partOf)) extras.push("origen");
          if (p.duration && (p.duration.hours || p.duration.weeks)) extras.push("duracion");
          if (p.link) extras.push("link");
          return (
            <div key={p.id} className="card" style={{ padding: 20, display: "grid", gap: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
                <div style={{ display: "grid", gap: 8 }}>
                  <strong style={{ fontSize: "1.1rem" }}>{p.name}</strong>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                    <span className="tag tag-muted">{p.type}</span>
                    <span className="tag tag-muted">{p.level}</span>
                    <span style={{ fontSize: "0.82rem", color: "var(--muted)" }}>
                      ruta sugerida: <strong>{route ? route.name : "Sin definir"}</strong>
                    </span>
                  </div>
                </div>
                <span className="tag" style={{ ...STATUS_STYLE[p.status], textTransform: "capitalize" }}>{p.status}</span>
              </div>

              {p.motivo && <p style={{ fontSize: "0.9rem", color: "var(--ink-soft)", fontStyle: "italic" }}>“{p.motivo}”</p>}

              {extras.length > 0 && (
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                  <span style={{ fontSize: "0.78rem", color: "var(--muted)" }}>incluye:</span>
                  {extras.map((x) => <span key={x} className="tag tag-muted">{x}</span>)}
                </div>
              )}

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                <span className="mono" style={{ fontSize: "0.74rem", color: "var(--muted-soft)" }}>
                  propuesto por {p.by} · {p.date}
                </span>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <button className="btn btn-ghost" style={{ padding: "7px 14px", fontSize: "0.82rem" }} onClick={() => navigate(`/admin/propuestas/${p.id}`)}>
                    Ver detalle
                  </button>
                  {p.status === "pendiente" && (
                    <>
                      <button className="btn btn-ghost" style={{ padding: "7px 14px", fontSize: "0.82rem" }} onClick={() => openReject(p)}>
                        Descartar
                      </button>
                      <button className="btn btn-primary" style={{ padding: "7px 16px", fontSize: "0.82rem" }} onClick={() => navigate(`/admin/catalogo/nuevo?propuesta=${p.id}`)}>
                        Aprobar e incorporar
                      </button>
                    </>
                  )}
                  {p.status === "aprobada" && (
                    <span style={{ alignSelf: "center", fontSize: "0.82rem", color: "var(--ok-strong)" }}>✓ Ya en el catalogo</span>
                  )}
                  {p.status === "descartada" && (
                    <button className="btn btn-ghost" style={{ padding: "7px 14px", fontSize: "0.82rem" }} onClick={() => setProposalStatus(p.id, "pendiente")}>
                      Reconsiderar
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {rejecting && (
        <Modal title={rejectSent ? "Rechazo enviado" : "Rechazar propuesta"} onClose={closeReject}>
          {!rejectSent ? (
            <>
              <p style={{ fontSize: "0.9rem", color: "var(--muted)" }}>
                Conta por qu&eacute; se rechaza “{rejecting.name}”. Se le enviar&aacute; el motivo a <strong>{rejecting.by}</strong>.
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
                ✓ Se le enviar&iacute;a a <strong>{rejecting.by}</strong> el siguiente motivo:
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
