import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../state/store";
import { Logo } from "../components/Layout";
import { DIMENSIONS } from "../data/mockData";

const METHODS = [
  { key: "manual", title: "Carga manual", desc: "Indicas tus intereses con controles simples.", ready: true },
  { key: "cv", title: "Subir CV", desc: "El sistema extrae tus datos del archivo.", ready: false },
  { key: "siu", title: "Conectar SIU UNSAM", desc: "Importa tus materias cursadas.", ready: false },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const { updateProfile, updateWeights } = useApp();
  const [step, setStep] = useState("method"); // method | manual
  const [name, setName] = useState("");
  const [weights, setWeights] = useState({ prog: 50, stats: 50, infra: 50, comm: 50, research: 50 });

  const setW = (key, val) => setWeights((w) => ({ ...w, [key]: Number(val) }));

  const finish = () => {
    updateProfile({ name: name || "Invitado", headline: "Perfil cargado manualmente" });
    updateWeights(weights);
    navigate("/app");
  };

  return (
    <div style={{ minHeight: "100%" }}>
      <header className="container" style={{ height: 72, display: "flex", alignItems: "center" }}>
        <Logo large onClick={() => navigate("/")} />
      </header>

      <div className="container" style={{ maxWidth: 720, paddingTop: 20, paddingBottom: 80 }}>
        {step === "method" && (
          <div style={{ display: "grid", gap: 24 }}>
            <div style={{ display: "grid", gap: 8 }}>
              <span className="eyebrow">Paso 1 de 2 · Onboarding</span>
              <h1 style={{ fontSize: "2.4rem" }}>¿Como queres armar tu perfil?</h1>
              <p style={{ color: "var(--muted)" }}>Eleg&iacute; la forma que te resulte mas comoda.</p>
            </div>
            <div style={{ display: "grid", gap: 14 }}>
              {METHODS.map((m) => (
                <button
                  key={m.key}
                  className="card"
                  disabled={!m.ready}
                  onClick={() => m.ready && setStep("manual")}
                  style={{
                    textAlign: "left", padding: 20, display: "flex", justifyContent: "space-between",
                    alignItems: "center", gap: 16, opacity: m.ready ? 1 : 0.55,
                    cursor: m.ready ? "pointer" : "not-allowed",
                  }}
                >
                  <div style={{ display: "grid", gap: 4 }}>
                    <strong style={{ fontSize: "1.05rem" }}>{m.title}</strong>
                    <span style={{ fontSize: "0.88rem", color: "var(--muted)" }}>{m.desc}</span>
                  </div>
                  {m.ready
                    ? <span className="btn btn-primary" style={{ padding: "8px 16px", fontSize: "0.85rem" }}>Elegir</span>
                    : <span className="tag tag-muted">Proximamente</span>}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === "manual" && (
          <div style={{ display: "grid", gap: 28 }}>
            <div style={{ display: "grid", gap: 8 }}>
              <span className="eyebrow">Paso 2 de 2 · Carga manual</span>
              <h1 style={{ fontSize: "2.4rem" }}>Conta&shy;nos sobre vos</h1>
              <p style={{ color: "var(--muted)" }}>
                Mov&eacute; los controles seg&uacute;n cu&aacute;nto te interesa cada area. Con eso calculamos tus rutas.
              </p>
            </div>

            <div className="card" style={{ padding: 22, display: "grid", gap: 8 }}>
              <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--muted)" }}>Tu nombre</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Como queres que te llamemos"
                style={{ padding: "12px 14px", border: "1px solid var(--line)", borderRadius: "var(--radius-sm)", background: "var(--surface)" }}
              />
            </div>

            <div className="card" style={{ padding: 24, display: "grid", gap: 22 }}>
              <span style={{ fontWeight: 600 }}>¿Cuanto te tira cada area?</span>
              {DIMENSIONS.map((d) => (
                <div key={d.key} style={{ display: "grid", gap: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <span style={{ fontSize: "0.92rem" }}>{d.label}</span>
                    <span className="mono" style={{ fontSize: "0.82rem", color: "var(--primary)" }}>{weights[d.key]}</span>
                  </div>
                  <input
                    type="range" min="0" max="100" value={weights[d.key]}
                    onChange={(e) => setW(d.key, e.target.value)}
                    style={{ width: "100%", accentColor: "var(--primary)" }}
                  />
                </div>
              ))}
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
              <button className="btn btn-ghost" onClick={() => setStep("method")}>Volver</button>
              <button className="btn btn-primary" onClick={finish}>Ver mis rutas</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
