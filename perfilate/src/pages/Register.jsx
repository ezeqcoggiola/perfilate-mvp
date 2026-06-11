import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useApp } from "../state/store";
import { Logo } from "../components/Layout";

const FIELDS = [
  { k: "name", label: "Nombre", type: "text", placeholder: "Como queres que te llamemos" },
  { k: "email", label: "Email", type: "email", placeholder: "vos@email.com" },
  { k: "pass", label: "Contraseña", type: "password", placeholder: "••••••••" },
  { k: "pass2", label: "Repetir contraseña", type: "password", placeholder: "••••••••" },
];

export default function Register() {
  const navigate = useNavigate();
  const { login, updateProfile } = useApp();
  const [form, setForm] = useState({ name: "", email: "", pass: "", pass2: "" });
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  // Maqueta: no valida nada ni guarda. Solo entra y arranca el onboarding.
  const submit = (e) => {
    e.preventDefault();
    login("user");
    updateProfile({ name: form.name || "Invitado" });
    navigate("/onboarding");
  };

  return (
    <div style={{ minHeight: "100%", display: "flex", flexDirection: "column" }}>
      <header className="container" style={{ height: 72, display: "flex", alignItems: "center" }}>
        <Logo large onClick={() => navigate("/")} />
      </header>

      <div className="container" style={{ flex: 1, display: "grid", placeItems: "center", paddingBottom: 60 }}>
        <div style={{ width: "100%", maxWidth: 420, display: "grid", gap: 24 }}>
          <div style={{ display: "grid", gap: 8, textAlign: "center" }}>
            <span className="eyebrow">Crear cuenta</span>
            <h1 style={{ fontSize: "2.2rem" }}>Sum&aacute;te a Perfilate</h1>
            <p style={{ color: "var(--muted)" }}>Cre&aacute; tu cuenta y arm&aacute; tu perfil en dos pasos.</p>
          </div>

          <form onSubmit={submit} className="card" style={{ padding: 28, display: "grid", gap: 16 }}>
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
            <button type="submit" className="btn btn-primary" style={{ marginTop: 4 }}>Crear cuenta</button>
            <p className="mono" style={{ fontSize: "0.72rem", color: "var(--muted-soft)", textAlign: "center" }}>
              Maqueta de demostracion · ningun dato se guarda
            </p>
          </form>

          <p style={{ textAlign: "center", fontSize: "0.9rem", color: "var(--muted)" }}>
            ¿Ya ten&eacute;s cuenta? <Link to="/ingresar" style={{ color: "var(--primary)", fontWeight: 600 }}>Ingres&aacute;</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
