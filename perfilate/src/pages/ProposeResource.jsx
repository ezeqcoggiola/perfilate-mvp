import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../state/store";
import ResourceForm, { emptyResourceForm, buildResourcePayload } from "../components/ResourceForm";

const field = {
  padding: "12px 14px", border: "1px solid var(--line)",
  borderRadius: "var(--radius-sm)", background: "var(--surface)",
};

export default function ProposeResource() {
  const navigate = useNavigate();
  const { profile, addProposal, routes } = useApp();
  const [form, setForm] = useState(emptyResourceForm());
  const [routeId, setRouteId] = useState("");
  const [motivo, setMotivo] = useState("");
  const [sent, setSent] = useState(false);

  const submit = () => {
    if (!form.name.trim()) return;
    addProposal({ ...buildResourcePayload(form), routeId, motivo: motivo.trim(), by: profile.name || "Invitado" });
    setSent(true);
  };

  const proposeAnother = () => { setForm(emptyResourceForm()); setRouteId(""); setMotivo(""); setSent(false); };

  if (sent) {
    return (
      <div style={{ maxWidth: 560, margin: "0 auto", display: "grid", gap: 18, placeItems: "center", textAlign: "center", paddingTop: 20 }}>
        <span style={{ fontSize: "2.4rem" }}>✓</span>
        <h1 style={{ fontSize: "2rem" }}>¡Gracias por tu propuesta!</h1>
        <p style={{ color: "var(--muted)" }}>
          Qued&oacute; registrada y el equipo la va a revisar. Si la incorporan, va a aparecer en el catalogo.
        </p>
        <div style={{ display: "flex", gap: 12 }}>
          <button className="btn btn-primary" onClick={proposeAnother}>Proponer otro</button>
          <button className="btn btn-ghost" onClick={() => navigate("/app/rutas")}>Volver a explorar</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 760, margin: "0 auto", display: "grid", gap: 24 }}>
      <div style={{ display: "grid", gap: 6 }}>
        <span className="eyebrow">Proponer</span>
        <h1 style={{ fontSize: "2.4rem" }}>Proponer un recurso</h1>
        <p style={{ color: "var(--muted)" }}>
          ¿Conoc&eacute;s una formaci&oacute;n que falta? Cuanto m&aacute;s completes, mejor; <strong>solo el nombre es obligatorio</strong>.
        </p>
      </div>

      <ResourceForm form={form} setForm={setForm} />

      {/* Datos propios de la propuesta */}
      <section className="card" style={{ padding: 24, display: "grid", gap: 16 }}>
        <strong style={{ fontSize: "1.05rem" }}>Sobre tu propuesta</strong>
        <div style={{ display: "grid", gap: 6 }}>
          <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--muted)" }}>Ruta sugerida (opcional)</label>
          <select value={routeId} onChange={(e) => setRouteId(e.target.value)} style={{ ...field, cursor: "pointer" }}>
            <option value="">Sin definir</option>
            {routes.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
          </select>
        </div>
        <div style={{ display: "grid", gap: 6 }}>
          <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--muted)" }}>¿Por qu&eacute; lo propon&eacute;s?</label>
          <textarea
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            rows={3}
            placeholder="Conta por que te parece relevante para esta plataforma (opcional)"
            style={{ ...field, resize: "vertical" }}
          />
        </div>
      </section>

      <div style={{ display: "flex", gap: 12 }}>
        <button className="btn btn-primary" style={{ opacity: form.name.trim() ? 1 : 0.5 }} onClick={submit}>Enviar propuesta</button>
        <button className="btn btn-ghost" onClick={() => navigate(-1)}>Cancelar</button>
      </div>
    </div>
  );
}
