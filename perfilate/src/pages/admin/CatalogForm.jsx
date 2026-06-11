import { useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useApp } from "../../state/store";
import ResourceForm, { emptyResourceForm, hydrateResourceForm, buildResourcePayload } from "../../components/ResourceForm";

export default function CatalogForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { catalog, addCatalogResources, updateCatalogResource, proposals, setProposalStatus } = useApp();
  const [searchParams] = useSearchParams();
  const propuestaId = searchParams.get("propuesta");

  const editing = Boolean(id);
  const existing = id ? catalog.find((r) => r.id === id) : null;
  const proposal = propuestaId ? proposals.find((p) => p.id === propuestaId) : null;
  const [form, setForm] = useState(() =>
    existing ? hydrateResourceForm(existing) : proposal ? hydrateResourceForm(proposal) : emptyResourceForm()
  );

  if (editing && !existing) {
    return (
      <p>
        Recurso no encontrado.{" "}
        <button className="btn btn-ghost" onClick={() => navigate("/admin/catalogo")}>Volver al catalogo</button>
      </p>
    );
  }

  const save = () => {
    if (!form.name.trim()) return;
    const payload = buildResourcePayload(form);
    if (editing) {
      updateCatalogResource(id, payload);
      navigate(`/recurso/${id}`);
    } else {
      const newId = `r-${Date.now()}`;
      addCatalogResources([{ id: newId, rating: { avg: 0, count: 0 }, ...payload }]);
      if (propuestaId) setProposalStatus(propuestaId, "aprobada");
      navigate(`/recurso/${newId}`);
    }
  };

  return (
    <div style={{ display: "grid", gap: 24, maxWidth: 760 }}>
      <button className="btn btn-ghost" style={{ width: "fit-content", padding: "7px 16px", fontSize: "0.85rem" }} onClick={() => navigate(-1)}>
        ← Volver
      </button>

      <div style={{ display: "grid", gap: 6 }}>
        <span className="eyebrow">Catalogo</span>
        <h1 style={{ fontSize: "2.2rem" }}>{editing ? "Editar recurso" : "Nuevo recurso"}</h1>
        {proposal ? (
          <p style={{ color: "var(--muted)" }}>Desde la propuesta de <strong>{proposal.by}</strong>. Revis&aacute; los campos y guard&aacute; para incorporarla al cat&aacute;logo.</p>
        ) : (
          <p style={{ color: "var(--muted)" }}>Complet&aacute; los campos del recurso. (Demo: no se persiste al recargar.)</p>
        )}
      </div>

      <ResourceForm form={form} setForm={setForm} />

      <div style={{ display: "flex", gap: 12 }}>
        <button className="btn btn-primary" style={{ opacity: form.name.trim() ? 1 : 0.5 }} onClick={save}>
          {editing ? "Guardar cambios" : "Crear recurso"}
        </button>
        <button className="btn btn-ghost" onClick={() => navigate(-1)}>Cancelar</button>
      </div>
    </div>
  );
}
