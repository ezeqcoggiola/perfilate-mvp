import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useApp } from "../state/store";
import { Logo } from "../components/Layout";

const FIELDS = [
  { k: "email", label: "Email", type: "email", placeholder: "vos@email.com" },
  { k: "pass", label: "Contraseña", type: "password", placeholder: "••••••••" },
];

export default function SignIn() {
  const navigate = useNavigate();
  const { login } = useApp();
  const [form, setForm] = useState({ email: "", pass: "" });
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  // Maqueta: no valida nada. El usuario ya "tiene" perfil (el de ejemplo).
  const enterUser = (e) => {
    e.preventDefault();
    login("user");
    navigate("/app");
  };
  const enterAdmin = () => {
    login("admin");
    navigate("/admin");
  };

  return (
    <div style={{ minHeight: "100%", display: "flex", flexDirection: "column" }}>
      <header className="container" style={{ height: 72, display: "flex", alignItems: "center" }}>
        <Logo large onClick={() => navigate("/")} />
      </header>

      <div className="container" style={{ flex: 1, display: "grid", placeItems: "center", paddingBottom: 60 }}>
        <div style={{ width: "100%", maxWidth: 420, display: "grid", gap: 24 }}>
          <div style={{ display: "grid", gap: 8, textAlign: "center" }}>
            <span className="eyebrow">Iniciar sesion</span>
            <h1 style={{ fontSize: "2.2rem" }}>Hola de nuevo</h1>
            <p style={{ color: "var(--muted)" }}>Ingres&aacute; para ver tus rutas recomendadas.</p>
          </div>

          <form onSubmit={enterUser} className="card" style={{ padding: 28, display: "grid", gap: 16 }}>
            {FIELDS.map((f) => (
              <div key={f.k} style={{ display: "grid", gap: 6 }}>
                <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--muted)" }}>{f.label}</label>
                <input
                  type={f.type}
                  value={form[f.k]}
                  onChange={(e) => set(f.k, e.target.value)}
                  placeholder={f.placeholder}
                  style={{ padding: "12px 14px", border: "1px solid var(--line)", borderRadius: "var(--radius-sm)", background: "var(--surface)" }}
                />
              </div>
            ))}
            <button type="submit" className="btn btn-primary" style={{ marginTop: 4 }}>Ingresar</button>

            <div style={{ display: "flex", alignItems: "center", gap: 12, color: "var(--muted-soft)" }}>
              <span style={{ flex: 1, height: 1, background: "var(--line)" }} />
              <span className="mono" style={{ fontSize: "0.7rem" }}>o</span>
              <span style={{ flex: 1, height: 1, background: "var(--line)" }} />
            </div>

            <button type="button" className="btn btn-ghost" onClick={enterAdmin}>Entrar como admin</button>
          </form>

          <p style={{ textAlign: "center", fontSize: "0.9rem", color: "var(--muted)" }}>
            ¿No ten&eacute;s cuenta? <Link to="/registro" style={{ color: "var(--primary)", fontWeight: 600 }}>Cre&aacute; una</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
