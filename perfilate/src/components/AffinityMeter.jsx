import { DIMENSIONS } from "../data/mockData";

// Anillo de afinidad (SVG). El % es el corazon visual de Perfilate.
export function AffinityRing({ score, size = 64, color = "var(--accent)" }) {
  const stroke = 6;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (score / 100) * c;
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--line)" strokeWidth={stroke} />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke={color} strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.6s cubic-bezier(.2,.8,.2,1)" }}
        />
      </svg>
      <div
        style={{
          position: "absolute", inset: 0, display: "grid", placeItems: "center",
          fontFamily: "var(--font-mono)", fontWeight: 700,
          fontSize: size > 56 ? "0.95rem" : "0.78rem", color: "var(--ink)",
        }}
      >
        {score}<span style={{ fontSize: "0.6em" }}>%</span>
      </div>
    </div>
  );
}

// Barras horizontales por dimension (para detalle y perfil).
export function DimensionBars({ weights, color = "var(--primary)" }) {
  return (
    <div style={{ display: "grid", gap: 10 }}>
      {DIMENSIONS.map((d) => (
        <div key={d.key} style={{ display: "grid", gridTemplateColumns: "130px 1fr 34px", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: "0.82rem", color: "var(--muted)" }}>{d.short}</span>
          <div style={{ height: 8, background: "var(--bg)", borderRadius: 99, overflow: "hidden" }}>
            <div
              style={{
                height: "100%", width: `${weights[d.key] ?? 0}%`,
                background: color, borderRadius: 99,
                transition: "width 0.5s ease",
              }}
            />
          </div>
          <span className="mono" style={{ fontSize: "0.76rem", color: "var(--muted)", textAlign: "right" }}>
            {weights[d.key] ?? 0}
          </span>
        </div>
      ))}
    </div>
  );
}
