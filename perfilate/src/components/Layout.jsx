import { NavLink, useNavigate, Outlet } from "react-router-dom";
import { useApp } from "../state/store";

const userLinks = [
  { to: "/app", label: "Inicio", end: true },
  { to: "/app/rutas", label: "Rutas" },
  { to: "/app/guardados", label: "Guardados" },
  { to: "/app/proponer", label: "Proponer" },
  { to: "/app/perfil", label: "Perfil" },
];

const adminLinks = [
  { to: "/admin", label: "Panel", end: true },
  { to: "/admin/catalogo", label: "Catalogo" },
  { to: "/admin/propuestas", label: "Propuestas" },
  { to: "/admin/rutas", label: "Rutas" },
  { to: "/admin/moderacion", label: "Moderacion" },
];

export default function Layout({ admin }) {
  const { role, logout } = useApp();
  const navigate = useNavigate();
  // Si no se fuerza por prop (detalles compartidos /ruta y /recurso), la nav
  // sigue al rol: el admin no pierde su barra al abrir una ruta o recurso.
  const isAdmin = admin ?? (role === "admin");
  const links = isAdmin ? adminLinks : userLinks;

  return (
    <div style={{ minHeight: "100%", display: "flex", flexDirection: "column" }}>
      <header
        style={{
          position: "sticky", top: 0, zIndex: 10,
          background: "rgba(255,255,255,0.85)", backdropFilter: "blur(10px)",
          borderBottom: "1px solid var(--line)",
        }}
      >
        <div className="container" style={{ height: 64, display: "flex", alignItems: "center", gap: 28 }}>
          <Logo onClick={() => navigate(isAdmin ? "/admin" : "/app")} admin={isAdmin} />
          <nav style={{ display: "flex", gap: 4, flex: 1 }}>
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                style={({ isActive }) => ({
                  padding: "8px 14px",
                  borderRadius: "var(--radius-pill)",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  color: isActive ? "var(--primary-deep)" : "var(--muted)",
                  background: isActive ? "var(--primary-wash)" : "transparent",
                })}
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
          <span className="tag-muted tag" style={{ textTransform: "capitalize" }}>{role}</span>
          <button className="btn btn-ghost" style={{ padding: "8px 16px", fontSize: "0.85rem" }} onClick={() => { logout(); navigate("/"); }}>
            Salir
          </button>
        </div>
      </header>

      <main style={{ flex: 1, padding: "40px 0 80px" }}>
        <div className="container">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export function Logo({ onClick, admin = false, large = false }) {
  return (
    <div onClick={onClick} style={{ display: "flex", alignItems: "center", gap: 9, cursor: onClick ? "pointer" : "default" }}>
      <span
        style={{
          width: large ? 34 : 28, height: large ? 34 : 28, borderRadius: 9,
          background: "linear-gradient(135deg, var(--primary), var(--accent))",
          display: "grid", placeItems: "center", color: "#fff",
          fontFamily: "var(--font-display)", fontWeight: 700, fontSize: large ? "1.1rem" : "0.95rem",
        }}
      >
        P
      </span>
      <span style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: large ? "1.4rem" : "1.15rem" }}>
        Perfilate{admin && <span style={{ color: "var(--muted-soft)", fontWeight: 400 }}> · admin</span>}
      </span>
    </div>
  );
}
