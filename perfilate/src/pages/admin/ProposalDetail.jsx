import { useParams, useNavigate } from "react-router-dom";
import { useApp } from "../../state/store";
import { ROUTES, DIMENSIONS } from "../../data/mockData";

const dimLabel = (key) => DIMENSIONS.find((d) => d.key === key)?.short ?? key;
const STATUS_STYLE = {
  pendiente: { background: "var(--primary-wash)", color: "var(--primary-deep)" },
  aprobada: { background: "#E2F6EC", color: "#1E8E5A" },
  descartada: { background: "var(--bg)", color: "var(--muted)" },
};

export default function ProposalDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { proposals, setProposalStatus } = useApp();

  const p = proposals.find((x) => x.id === id);
  if (!p) {
    return (
      <p>
        Propuesta no encontrada.{" "}
        <button className="btn btn-ghost" onClick={() => navigate("/admin/propuestas")}>Volver</button>
      </p>
    );
  }

  const route = ROUTES.find((r) => r.id === p.routeId);
  const origin = p.origin;
  const hasOrigin = origin && (origin.provider || origin.kind || origin.partOf);
  const hasRelation = p.relation && (p.relation.description || p.relation.dims?.length || p.relation.topics?.length);
  const hasContents = p.contents?.some((t) => t.items?.length);

  const discard = () => { setProposalStatus(p.id, "descartada"); navigate("/admin/propuestas"); };
  const reconsider = () => setProposalStatus(p.id, "pendiente");

  return (
    <div style={{ display: "grid", gap: 28, maxWidth: 760 }}>
      <button className="btn btn-ghost" style={{ width: "fit-content", padding: "7px 16px", fontSize: "0.85rem" }} onClick={() => navigate("/admin/propuestas")}>
        ← Volver a propuestas
      </button>

      <header style={{ display: "grid", gap: 12 }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          <span className="tag tag-muted">{p.type}</span>
          <span className="tag tag-muted">{p.level}</span>
          {p.duration && <span className="tag tag-muted">⏱ {p.duration}</span>}
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
            <button className="btn btn-ghost" onClick={discard}>Descartar</button>
          </>
        )}
        {p.status === "aprobada" && <span style={{ alignSelf: "center", color: "#1E8E5A", fontWeight: 600 }}>✓ Ya incorporada al catalogo</span>}
        {p.status === "descartada" && <button className="btn btn-ghost" onClick={reconsider}>Reconsiderar</button>}
      </div>
    </div>
  );
}
