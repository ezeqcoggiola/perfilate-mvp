import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../state/store";
import { SURVEYS } from "../../data/adminMock";
import { relativeDate, HOY } from "../../data/mockData";
import Modal from "../../components/Modal";

const STATUS = {
  visible: { label: "Visible", bg: "var(--ok-soft)", fg: "var(--ok-strong)" },
  reportado: { label: "Reportado", bg: "var(--accent-soft)", fg: "var(--danger-strong)" },
  oculto: { label: "Oculto", bg: "var(--bg)", fg: "var(--muted)" },
};
const FILTROS = [
  { key: "todos", label: "Todos" },
  { key: "reportado", label: "Reportados" },
  { key: "visible", label: "Visibles" },
  { key: "oculto", label: "Ocultos" },
];
const control = {
  padding: "9px 12px", border: "1px solid var(--line)",
  borderRadius: "var(--radius-pill)", background: "var(--surface)", fontSize: "0.85rem",
};
const stars = (n) => "★★★★★".slice(0, n) + "☆☆☆☆☆".slice(0, 5 - n);

export default function Moderacion() {
  const navigate = useNavigate();
  const { comments, setCommentStatus, deleteComment, suspendUser, catalog } = useApp();

  const [tab, setTab] = useState("comentarios");
  const [estado, setEstado] = useState("todos");
  const [q, setQ] = useState("");
  const [fUser, setFUser] = useState("");
  const [califMin, setCalifMin] = useState(1);
  const [califMax, setCalifMax] = useState(5);
  const [fDesde, setFDesde] = useState("");
  const [fHasta, setFHasta] = useState("");

  const [modal, setModal] = useState(null); // { type, comment }
  const [reason, setReason] = useState("");
  const [sent, setSent] = useState(false);

  const usuarios = [...new Set(comments.map((c) => c.by))];
  const today = HOY;
  const reportados = comments.filter((c) => c.status === "reportado").length;

  const list = comments
    .filter((c) => estado === "todos" || c.status === estado)
    .filter((c) => !q || c.text.toLowerCase().includes(q.toLowerCase()))
    .filter((c) => !fUser || c.by === fUser)
    .filter((c) => c.score >= califMin && c.score <= califMax)
    .filter((c) => (!fDesde || c.date >= fDesde) && (!fHasta || c.date <= fHasta))
    .sort((a, b) => b.date.localeCompare(a.date));

  const clear = () => { setQ(""); setFUser(""); setCalifMin(1); setCalifMax(5); setFDesde(""); setFHasta(""); setEstado("todos"); };

  const rated = catalog.filter((r) => r.rating && r.rating.count > 0).sort((a, b) => b.rating.avg - a.rating.avg).slice(0, 8);

  const openModal = (type, comment) => { setModal({ type, comment }); setReason(""); setSent(false); };
  const closeModal = () => { setModal(null); setReason(""); setSent(false); };
  const confirmModal = () => {
    if (modal.type === "delete") deleteComment(modal.comment.id);
    else suspendUser(modal.comment.by);
    setSent(true);
  };

  return (
    <div style={{ display: "grid", gap: 24 }}>
      <div style={{ display: "grid", gap: 6 }}>
        <span className="eyebrow">Moderacion</span>
        <h1 style={{ fontSize: "2.4rem" }}>Moderacion y feedback</h1>
        <p style={{ color: "var(--muted)" }}>Revisa el historial de comentarios y los resultados de encuestas y calificaciones.</p>
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        {[["comentarios", `Comentarios${reportados ? ` (${reportados})` : ""}`], ["resultados", "Encuestas y calificaciones"]].map(([key, label]) => (
          <button key={key} className={tab === key ? "btn btn-primary" : "btn btn-ghost"} style={{ padding: "9px 20px", fontSize: "0.9rem" }} onClick={() => setTab(key)}>
            {label}
          </button>
        ))}
      </div>

      {/* ----- Comentarios (US 11.5) ----- */}
      {tab === "comentarios" && (
        <div style={{ display: "grid", gap: 16 }}>
          {/* Busqueda + filtros */}
          <div style={{ display: "grid", gap: 10 }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar en los comentarios..." style={{ ...control, flex: 1, minWidth: 200 }} />
              <select value={fUser} onChange={(e) => setFUser(e.target.value)} style={{ ...control, cursor: "pointer" }}>
                <option value="">Todos los usuarios</option>
                {usuarios.map((u) => <option key={u} value={u}>{u}</option>)}
              </select>
              <button className="btn btn-ghost" style={{ padding: "9px 16px", fontSize: "0.85rem" }} onClick={clear}>Limpiar</button>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 14, alignItems: "center" }}>
              <span style={{ fontSize: "0.8rem", color: "var(--muted)" }}>Calificacion:</span>
              <select value={califMin} onChange={(e) => setCalifMin(Number(e.target.value))} style={{ ...control, cursor: "pointer" }}>
                {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>desde {n}★</option>)}
              </select>
              <select value={califMax} onChange={(e) => setCalifMax(Number(e.target.value))} style={{ ...control, cursor: "pointer" }}>
                {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>hasta {n}★</option>)}
              </select>
              <span style={{ fontSize: "0.8rem", color: "var(--muted)", marginLeft: 6 }}>Fecha:</span>
              <input type="date" value={fDesde} onChange={(e) => setFDesde(e.target.value)} style={control} />
              <span style={{ color: "var(--muted-soft)" }}>—</span>
              <input type="date" value={fHasta} onChange={(e) => setFHasta(e.target.value)} style={control} />
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {FILTROS.map((f) => (
                <button key={f.key} className={estado === f.key ? "tag" : "tag tag-muted"} style={estado === f.key ? { cursor: "pointer", background: "var(--primary)", color: "#fff", border: "1px solid var(--primary)" } : { cursor: "pointer" }} onClick={() => setEstado(f.key)}>
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <span className="mono" style={{ fontSize: "0.8rem", color: "var(--muted)" }}>{list.length} {list.length === 1 ? "comentario" : "comentarios"}</span>

          {list.length === 0 && (
            <div className="card" style={{ padding: 40, textAlign: "center", color: "var(--muted)" }}>No hay comentarios con esos filtros.</div>
          )}

          <div style={{ display: "grid", gap: 12 }}>
            {list.map((c) => (
              <div key={c.id} className="card" style={{ padding: 18, display: "grid", gap: 10, borderColor: c.status === "reportado" ? "var(--danger-line)" : "var(--line)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, flexWrap: "wrap" }}>
                  <div style={{ display: "grid", gap: 4 }}>
                    <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                      <strong style={{ fontSize: "0.95rem" }}>{c.by}</strong>
                      <span style={{ color: "var(--accent)", fontSize: "0.85rem", letterSpacing: 1 }}>{stars(c.score)}</span>
                      <span className="mono" style={{ fontSize: "0.72rem", color: "var(--muted-soft)" }}>{relativeDate(c.date, today)}</span>
                    </div>
                    <span onClick={() => navigate(`/recurso/${c.resourceId}`)} style={{ fontSize: "0.8rem", color: "var(--primary)", fontWeight: 600, cursor: "pointer" }}>
                      {c.resourceName} →
                    </span>
                  </div>
                  <span className="tag" style={{ background: STATUS[c.status].bg, color: STATUS[c.status].fg }}>{STATUS[c.status].label}</span>
                </div>

                <p style={{ fontSize: "0.92rem", color: "var(--ink-soft)" }}>“{c.text}”</p>

                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "flex-end" }}>
                  {c.status === "oculto" ? (
                    <button className="btn btn-ghost" style={{ padding: "6px 14px", fontSize: "0.8rem" }} onClick={() => setCommentStatus(c.id, "visible")}>Mostrar</button>
                  ) : (
                    <>
                      {c.status === "reportado" && (
                        <button className="btn btn-ghost" style={{ padding: "6px 14px", fontSize: "0.8rem" }} onClick={() => setCommentStatus(c.id, "visible")}>Aprobar</button>
                      )}
                      <button className="btn btn-ghost" style={{ padding: "6px 14px", fontSize: "0.8rem" }} onClick={() => setCommentStatus(c.id, "oculto")}>Ocultar</button>
                    </>
                  )}
                  <button className="btn btn-ghost" style={{ padding: "6px 14px", fontSize: "0.8rem" }} onClick={() => openModal("suspend", c)}>Suspender usuario</button>
                  <button className="btn btn-ghost" style={{ padding: "6px 14px", fontSize: "0.8rem", color: "var(--danger-strong)", borderColor: "var(--danger-line)" }} onClick={() => openModal("delete", c)}>Borrar</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ----- Encuestas y calificaciones (US 11.4) ----- */}
      {tab === "resultados" && (
        <div style={{ display: "grid", gap: 28 }}>
          <section style={{ display: "grid", gap: 16 }}>
            <h3 style={{ fontSize: "1.2rem" }}>Calificaciones por recurso</h3>
            <div className="card" style={{ padding: 24, display: "grid", gap: 16 }}>
              {rated.map((r) => (
                <div key={r.id} style={{ display: "grid", gridTemplateColumns: "1fr 120px", gap: 14, alignItems: "center" }}>
                  <div style={{ display: "grid", gap: 6 }}>
                    <span style={{ fontSize: "0.9rem" }}>{r.name}</span>
                    <div style={{ height: 8, background: "var(--bg)", borderRadius: 99, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${(r.rating.avg / 5) * 100}%`, background: "var(--primary)", borderRadius: 99 }} />
                    </div>
                  </div>
                  <span className="mono" style={{ fontSize: "0.8rem", color: "var(--muted)", textAlign: "right" }}>{r.rating.avg} ★ · {r.rating.count}</span>
                </div>
              ))}
            </div>
          </section>

          <section style={{ display: "grid", gap: 16 }}>
            <h3 style={{ fontSize: "1.2rem" }}>Encuestas sobre recursos guardados</h3>
            <div style={{ display: "grid", gap: 12 }}>
              {SURVEYS.map((s) => (
                <div key={s.resourceId} className="card" style={{ padding: 18, display: "grid", gap: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12, flexWrap: "wrap" }}>
                    <strong style={{ fontSize: "0.95rem" }}>{s.resourceName}</strong>
                    <span className="mono" style={{ fontSize: "0.74rem", color: "var(--muted)" }}>{s.respuestas} respuestas · utilidad {s.utilidad} ★</span>
                  </div>
                  <div style={{ display: "flex", height: 12, borderRadius: 99, overflow: "hidden" }}>
                    <div style={{ width: `${s.completado}%`, background: "var(--ok)" }} />
                    <div style={{ width: `${s.enProgreso}%`, background: "var(--primary)" }} />
                    <div style={{ width: `${s.abandonado}%`, background: "var(--muted-soft)" }} />
                  </div>
                  <div style={{ display: "flex", gap: 16, flexWrap: "wrap", fontSize: "0.78rem", color: "var(--muted)" }}>
                    <span><span style={{ color: "var(--ok)" }}>■</span> Completado {s.completado}%</span>
                    <span><span style={{ color: "var(--primary)" }}>■</span> En progreso {s.enProgreso}%</span>
                    <span><span style={{ color: "var(--muted-soft)" }}>■</span> Abandonado {s.abandonado}%</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* Popup borrar / suspender */}
      {modal && (
        <Modal
          title={sent ? (modal.type === "delete" ? "Comentario borrado" : "Usuario suspendido") : (modal.type === "delete" ? "Borrar comentario" : "Suspender usuario")}
          onClose={closeModal}
        >
          {!sent ? (
            <>
              <p style={{ fontSize: "0.9rem", color: "var(--muted)" }}>
                {modal.type === "delete"
                  ? <>Conta el motivo para borrar el comentario de <strong>{modal.comment.by}</strong>.</>
                  : <>Conta el motivo para suspender a <strong>{modal.comment.by}</strong>. Se ocultaran todos sus comentarios.</>}
              </p>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={4}
                placeholder="Motivo"
                style={{ padding: "12px 14px", border: "1px solid var(--line)", borderRadius: "var(--radius-sm)", background: "var(--surface)", resize: "vertical" }}
              />
              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                <button className="btn btn-ghost" onClick={closeModal}>Cancelar</button>
                <button className="btn" style={{ background: "var(--danger)", color: "#fff", opacity: reason.trim() ? 1 : 0.5 }} onClick={confirmModal}>
                  {modal.type === "delete" ? "Borrar" : "Suspender"}
                </button>
              </div>
            </>
          ) : (
            <>
              <p style={{ fontSize: "0.92rem", color: "var(--ink-soft)" }}>
                {modal.type === "delete"
                  ? "✓ Comentario borrado."
                  : <>✓ Se suspendi&oacute; a <strong>{modal.comment.by}</strong> y se ocultaron sus comentarios.</>}
              </p>
              <span className="mono" style={{ fontSize: "0.72rem", color: "var(--muted-soft)" }}>Demo: el motivo no se guarda.</span>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button className="btn btn-primary" onClick={closeModal}>Cerrar</button>
              </div>
            </>
          )}
        </Modal>
      )}
    </div>
  );
}
