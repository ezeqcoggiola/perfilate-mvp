// Pantalla provisoria. Marca lo que todavia falta construir, para que
// la navegacion no quede rota mientras armamos el resto seccion por seccion.
export default function Placeholder({ title, note }) {
  return (
    <div style={{ display: "grid", gap: 14, maxWidth: 560 }}>
      <span className="eyebrow">En construccion</span>
      <h1 style={{ fontSize: "2.2rem" }}>{title}</h1>
      <p style={{ color: "var(--muted)" }}>
        {note || "Esta seccion todavia no esta maquetada. La armamos en la proxima iteracion."}
      </p>
      <div className="card" style={{ padding: 28, display: "grid", gap: 10, borderStyle: "dashed" }}>
        <span className="mono" style={{ fontSize: "0.78rem", color: "var(--muted-soft)" }}>// pendiente</span>
        <div style={{ height: 10, width: "70%", background: "var(--bg)", borderRadius: 99 }} />
        <div style={{ height: 10, width: "90%", background: "var(--bg)", borderRadius: 99 }} />
        <div style={{ height: 10, width: "50%", background: "var(--bg)", borderRadius: 99 }} />
      </div>
    </div>
  );
}
