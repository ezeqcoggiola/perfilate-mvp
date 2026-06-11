import { useNavigate } from "react-router-dom";
import { Logo } from "../components/Layout";
import { DIMENSIONS } from "../data/mockData";

export default function Login() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: "100%", display: "flex", flexDirection: "column" }}>
      <header className="container" style={{ height: 72, display: "flex", alignItems: "center" }}>
        <Logo large />
      </header>

      <div className="container" style={{ flex: 1, display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 56, alignItems: "center", paddingBottom: 60 }}>
        {/* Hero */}
        <div style={{ display: "grid", gap: 24, maxWidth: 520 }}>
          <span className="eyebrow">Orientacion en datos</span>
          <h1 style={{ fontSize: "3.4rem", lineHeight: 1.05 }}>
            Encontra tu ruta en el<span style={{ color: "var(--primary)" }}> mundo de los datos</span>.
          </h1>
          <p style={{ fontSize: "1.1rem", color: "var(--muted)" }}>
            Perfilate compara tu perfil con rutas de especializacion y te muestra
            cuales encajan mejor con vos, y por que.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button className="btn btn-primary" onClick={() => navigate("/registro")}>Crear cuenta</button>
            <button className="btn btn-ghost" onClick={() => navigate("/ingresar")}>Ya tengo cuenta</button>
          </div>
          <p className="mono" style={{ fontSize: "0.74rem", color: "var(--muted-soft)" }}>
            Maqueta de demostracion · ningun dato se guarda
          </p>
        </div>

        {/* Demo visual del concepto: el perfil como vector */}
        <div className="card" style={{ padding: 28, display: "grid", gap: 18, boxShadow: "var(--shadow-lg)" }}>
          <span className="eyebrow">Asi te leemos</span>
          <p style={{ fontSize: "0.9rem", color: "var(--muted)" }}>
            Tu perfil es una combinacion de cinco dimensiones. Cada ruta tiene la suya.
            La afinidad sale de compararlas.
          </p>
          <div style={{ display: "grid", gap: 12 }}>
            {DIMENSIONS.map((d, i) => {
              const demo = [70, 65, 40, 55, 50][i];
              return (
                <div key={d.key} style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: 12, alignItems: "center" }}>
                  <span style={{ fontSize: "0.8rem", color: "var(--ink-soft)" }}>{d.short}</span>
                  <div style={{ height: 8, background: "var(--bg)", borderRadius: 99 }}>
                    <div style={{ height: "100%", width: `${demo}%`, background: "linear-gradient(90deg, var(--primary), var(--accent))", borderRadius: 99 }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
