// Modal simple: overlay + backdrop. Sin librerias. Click afuera cierra.
export default function Modal({ title, onClose, children }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 50,
        background: "rgba(22, 20, 43, 0.45)",
        display: "grid", placeItems: "center", padding: 20,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="card"
        style={{ width: "100%", maxWidth: 460, padding: 24, display: "grid", gap: 16, boxShadow: "var(--shadow-lg)" }}
      >
        {title && <h3 style={{ fontSize: "1.2rem" }}>{title}</h3>}
        {children}
      </div>
    </div>
  );
}
