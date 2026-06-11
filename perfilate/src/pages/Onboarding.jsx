import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../state/store";
import { Logo } from "../components/Layout";
import { DIMENSIONS, SKILLS, SITUACIONES, AREAS_SUGERIDAS, METAS, PERFILES_OBJETIVO } from "../data/mockData";

const inputStyle = {
  padding: "12px 14px", border: "1px solid var(--line)",
  borderRadius: "var(--radius-sm)", background: "var(--surface)",
};

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
  const [situacion, setSituacion] = useState("");
  const [areaOrigen, setAreaOrigen] = useState("");
  const [meta, setMeta] = useState("");
  const [perfilObjetivo, setPerfilObjetivo] = useState("");
  const [skills, setSkills] = useState([]);
  const [weights, setWeights] = useState({ prog: 50, stats: 50, infra: 50, comm: 50, research: 50 });

  const setW = (key, val) => setWeights((w) => ({ ...w, [key]: Number(val) }));
  const toggleSkill = (id) =>
    setSkills((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const finish = () => {
    updateProfile({
      name: name || "Invitado",
      headline: "Perfil cargado manualmente",
      situacion,
      areaOrigen,
      meta,
      perfilObjetivo,
      skills,
    });
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
                Cont&aacute;nos un poco de vos. Tus intereses definen tus rutas; lo dem&aacute;s nos da contexto.
              </p>
            </div>

            {/* Sobre vos */}
            <div className="card" style={{ padding: 24, display: "grid", gap: 18 }}>
              <span style={{ fontWeight: 600 }}>Sobre vos</span>

              <div style={{ display: "grid", gap: 6 }}>
                <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--muted)" }}>Tu nombre</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Como queres que te llamemos"
                  style={inputStyle}
                />
              </div>

              <div style={{ display: "grid", gap: 6 }}>
                <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--muted)" }}>Situaci&oacute;n actual</label>
                <select value={situacion} onChange={(e) => setSituacion(e.target.value)} style={{ ...inputStyle, cursor: "pointer" }}>
                  <option value="" disabled>Eleg&iacute; una opci&oacute;n</option>
                  {SITUACIONES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div style={{ display: "grid", gap: 6 }}>
                <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--muted)" }}>Carrera o &aacute;rea de origen</label>
                <input
                  list="areas-origen"
                  value={areaOrigen}
                  onChange={(e) => setAreaOrigen(e.target.value)}
                  placeholder="Ej: Ciencia de Datos, Ingenieria, Matematica"
                  style={inputStyle}
                />
                <datalist id="areas-origen">
                  {AREAS_SUGERIDAS.map((a) => <option key={a} value={a} />)}
                </datalist>
              </div>
            </div>

            {/* Tu objetivo */}
            <div className="card" style={{ padding: 24, display: "grid", gap: 18 }}>
              <span style={{ fontWeight: 600 }}>Tu objetivo</span>
              <div style={{ display: "grid", gap: 6 }}>
                <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--muted)" }}>¿Cu&aacute;l es tu meta?</label>
                <select value={meta} onChange={(e) => setMeta(e.target.value)} style={{ ...inputStyle, cursor: "pointer" }}>
                  <option value="" disabled>Eleg&iacute; una opci&oacute;n</option>
                  {METAS.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div style={{ display: "grid", gap: 6 }}>
                <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--muted)" }}>¿A qu&eacute; perfil apunt&aacute;s?</label>
                <select value={perfilObjetivo} onChange={(e) => setPerfilObjetivo(e.target.value)} style={{ ...inputStyle, cursor: "pointer" }}>
                  <option value="" disabled>Eleg&iacute; una opci&oacute;n</option>
                  {PERFILES_OBJETIVO.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            </div>

            {/* Conocimientos o habilidades */}
            <div className="card" style={{ padding: 24, display: "grid", gap: 20 }}>
              <div style={{ display: "grid", gap: 4 }}>
                <span style={{ fontWeight: 600 }}>Conocimientos o habilidades</span>
                <span style={{ fontSize: "0.85rem", color: "var(--muted)" }}>Toc&aacute; los que ya manej&aacute;s. Pod&eacute;s elegir varios.</span>
              </div>
              {SKILLS.map((group) => (
                <div key={group.category} style={{ display: "grid", gap: 10 }}>
                  <span className="mono" style={{ fontSize: "0.72rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted-soft)" }}>
                    {group.category}
                  </span>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {group.items.map((sk) => {
                      const on = skills.includes(sk.id);
                      return (
                        <button
                          key={sk.id}
                          type="button"
                          onClick={() => toggleSkill(sk.id)}
                          className={on ? "tag" : "tag tag-muted"}
                          style={on
                            ? { cursor: "pointer", background: "var(--primary)", color: "#fff", border: "1px solid var(--primary)" }
                            : { cursor: "pointer" }}
                        >
                          {sk.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Intereses en datos (alimentan la recomendacion) */}
            <div className="card" style={{ padding: 24, display: "grid", gap: 20 }}>
              <div style={{ display: "grid", gap: 4 }}>
                <span style={{ fontWeight: 600 }}>Intereses en datos</span>
                <span style={{ fontSize: "0.85rem", color: "var(--muted)" }}>
                  Esto marca hacia d&oacute;nde quer&eacute;s crecer, no lo que ya sab&eacute;s.
                </span>
              </div>
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
