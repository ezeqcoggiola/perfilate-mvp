import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../state/store";
import { DIMENSIONS, SAMPLE_PROFILE, SITUACIONES, AREAS_SUGERIDAS, SKILLS, METAS, PERFILES_OBJETIVO } from "../data/mockData";
import { AffinityRing, DimensionBars } from "../components/AffinityMeter";

const inputStyle = {
  padding: "12px 14px", border: "1px solid var(--line)",
  borderRadius: "var(--radius-sm)", background: "var(--surface)",
};
const labelStyle = { fontSize: "0.82rem", fontWeight: 600, color: "var(--muted)" };
const chip = (on) => (on
  ? { cursor: "pointer", background: "var(--primary)", color: "#fff", border: "1px solid var(--primary)" }
  : { cursor: "pointer" });

export default function Profile() {
  const navigate = useNavigate();
  const { profile, recommendations, updateWeights, updateProfile, logout } = useApp();
  const top = recommendations[0];
  const [confirmDelete, setConfirmDelete] = useState(false);

  const deleteAccount = () => { logout(); navigate("/"); };

  const setW = (key, val) => updateWeights({ ...profile.weights, [key]: Number(val) });
  const reset = () => updateWeights(SAMPLE_PROFILE.weights);

  const skills = profile.skills ?? [];
  const toggleSkill = (id) =>
    updateProfile({ skills: skills.includes(id) ? skills.filter((x) => x !== id) : [...skills, id] });

  return (
    <div style={{ display: "grid", gap: 32 }}>
      <div style={{ display: "grid", gap: 6 }}>
        <span className="eyebrow">Tu perfil</span>
        <h1 style={{ fontSize: "2.4rem" }}>{profile.name}</h1>
        <p style={{ color: "var(--muted)" }}>{profile.headline}</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, alignItems: "start" }}>
        {/* Izquierda: editar */}
        <div style={{ display: "grid", gap: 24 }}>
          <section className="card" style={{ padding: 24, display: "grid", gap: 18 }}>
            <strong style={{ fontSize: "1.05rem" }}>Sobre vos</strong>

            <div style={{ display: "grid", gap: 6 }}>
              <label style={labelStyle}>Tu nombre</label>
              <input
                value={profile.name}
                onChange={(e) => updateProfile({ name: e.target.value })}
                placeholder="Como queres que te llamemos"
                style={inputStyle}
              />
            </div>

            <div style={{ display: "grid", gap: 6 }}>
              <label style={labelStyle}>Situaci&oacute;n actual</label>
              <select value={profile.situacion ?? ""} onChange={(e) => updateProfile({ situacion: e.target.value })} style={{ ...inputStyle, cursor: "pointer" }}>
                <option value="" disabled>Eleg&iacute; una opci&oacute;n</option>
                {SITUACIONES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div style={{ display: "grid", gap: 6 }}>
              <label style={labelStyle}>Carrera o &aacute;rea de origen</label>
              <input
                list="areas-perfil"
                value={profile.areaOrigen ?? ""}
                onChange={(e) => updateProfile({ areaOrigen: e.target.value })}
                placeholder="Ej: Ciencia de Datos, Ingenieria"
                style={inputStyle}
              />
              <datalist id="areas-perfil">
                {AREAS_SUGERIDAS.map((a) => <option key={a} value={a} />)}
              </datalist>
            </div>

            <div style={{ display: "grid", gap: 6 }}>
              <label style={labelStyle}>Tu meta</label>
              <select value={profile.meta ?? ""} onChange={(e) => updateProfile({ meta: e.target.value })} style={{ ...inputStyle, cursor: "pointer" }}>
                <option value="" disabled>Eleg&iacute; una opci&oacute;n</option>
                {METAS.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>

            <div style={{ display: "grid", gap: 6 }}>
              <label style={labelStyle}>Perfil objetivo</label>
              <select value={profile.perfilObjetivo ?? ""} onChange={(e) => updateProfile({ perfilObjetivo: e.target.value })} style={{ ...inputStyle, cursor: "pointer" }}>
                <option value="" disabled>Eleg&iacute; una opci&oacute;n</option>
                {PERFILES_OBJETIVO.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </section>

          <section className="card" style={{ padding: 24, display: "grid", gap: 22 }}>
            <div style={{ display: "grid", gap: 4 }}>
              <strong style={{ fontSize: "1.05rem" }}>Ajust&aacute; tus dimensiones</strong>
              <span style={{ fontSize: "0.85rem", color: "var(--muted)" }}>
                Mov&eacute; los controles: tus rutas se recalculan al instante.
              </span>
            </div>
            <div style={{ display: "grid", gap: 20 }}>
              {DIMENSIONS.map((d) => (
                <div key={d.key} style={{ display: "grid", gap: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <span style={{ fontSize: "0.92rem" }}>{d.label}</span>
                    <span className="mono" style={{ fontSize: "0.82rem", color: "var(--primary)" }}>{profile.weights[d.key]}</span>
                  </div>
                  <input
                    type="range" min="0" max="100" value={profile.weights[d.key]}
                    onChange={(e) => setW(d.key, e.target.value)}
                    style={{ width: "100%", accentColor: "var(--primary)" }}
                  />
                </div>
              ))}
            </div>
            <button className="btn btn-ghost" style={{ width: "fit-content" }} onClick={reset}>
              Restablecer al perfil de ejemplo
            </button>
          </section>
        </div>

        {/* Derecha: match en vivo */}
        <section style={{ display: "grid", gap: 24 }}>
          {top && (
            <div
              className="card"
              style={{
                padding: 28, display: "grid", placeItems: "center", gap: 14, textAlign: "center",
                boxShadow: "var(--shadow-lg)", background: "linear-gradient(135deg, #fff, var(--primary-wash))",
              }}
            >
              <span className="eyebrow">Tu mejor match ahora</span>
              <AffinityRing score={top.score} size={120} color={top.route.color} />
              <div style={{ display: "grid", gap: 4 }}>
                <strong style={{ fontSize: "1.15rem" }}>{top.route.name}</strong>
                <span style={{ fontSize: "0.82rem", color: "var(--muted)" }}>Se actualiza al mover los controles</span>
              </div>
              <button className="btn btn-primary" style={{ width: "fit-content", marginTop: 4 }} onClick={() => navigate(`/ruta/${top.route.id}`)}>
                Ver la ruta
              </button>
            </div>
          )}

          <div className="card" style={{ padding: 24, display: "grid", gap: 16 }}>
            <h3 style={{ fontSize: "1.1rem" }}>Tu perfil en barras</h3>
            <DimensionBars weights={profile.weights} color="var(--primary)" />
          </div>
        </section>
      </div>

      {/* Habilidades (lo que se carga en el onboarding) */}
      <section className="card" style={{ padding: 24, display: "grid", gap: 18 }}>
        <div style={{ display: "grid", gap: 4 }}>
          <strong style={{ fontSize: "1.05rem" }}>Tus habilidades</strong>
          <span style={{ fontSize: "0.85rem", color: "var(--muted)" }}>Toc&aacute; para marcar lo que ya manej&aacute;s. Es contexto: no cambia tus rutas.</span>
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
                  <button key={sk.id} type="button" onClick={() => toggleSkill(sk.id)} className={on ? "tag" : "tag tag-muted"} style={chip(on)}>
                    {sk.label}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </section>

      {/* Eliminar cuenta (US 1.3) */}
      <section className="card" style={{ padding: 24, display: "grid", gap: 12, borderColor: confirmDelete ? "#E7B0B0" : "var(--line)" }}>
        <strong style={{ fontSize: "1.05rem" }}>Eliminar cuenta</strong>
        {!confirmDelete ? (
          <>
            <span style={{ fontSize: "0.88rem", color: "var(--muted)" }}>
              Se borran tu perfil, tus guardados y tus puntuaciones. Esta acci&oacute;n no se puede deshacer.
            </span>
            <button
              className="btn btn-ghost"
              style={{ width: "fit-content", color: "#C0392B", borderColor: "#E7B0B0" }}
              onClick={() => setConfirmDelete(true)}
            >
              Eliminar mi cuenta
            </button>
          </>
        ) : (
          <>
            <span style={{ fontSize: "0.95rem", color: "var(--ink)" }}>
              ¿Seguro que quer&eacute;s eliminar tu cuenta? Vas a perder tu perfil, tus guardados y tus puntuaciones, y no se puede deshacer.
            </span>
            <div style={{ display: "flex", gap: 10 }}>
              <button className="btn" style={{ background: "#D64545", color: "#fff" }} onClick={deleteAccount}>
                S&iacute;, eliminar cuenta
              </button>
              <button className="btn btn-ghost" onClick={() => setConfirmDelete(false)}>Cancelar</button>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
