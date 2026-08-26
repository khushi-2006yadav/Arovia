import { useState, useMemo } from "react";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Droplet,
  Zap,
  HeartPulse,
  Scale,
  Flame,
} from "lucide-react";
import { healthTrends } from "../../data/mockData";

const factorMeta = {
  Hemoglobin: { icon: Droplet, color: "#e11d48", tint: "coral" },
  "Blood Sugar (Fasting)": { icon: Zap, color: "#d97706", tint: "amber" },
  "Blood Pressure (Systolic)": {
    icon: HeartPulse,
    color: "#7c3aed",
    tint: "purple",
  },
  BMI: { icon: Scale, color: "#0d9488", tint: "teal" },
  Cholesterol: { icon: Flame, color: "#db2777", tint: "pink" },
};

const factors = Object.keys(healthTrends);

function HealthAnalysis() {
  const [factor, setFactor] = useState(factors[0]);
  const series = healthTrends[factor];
  const meta = factorMeta[factor];
  const FactorIcon = meta.icon;

  const chart = useMemo(() => {
    const values = series.data.map((d) => d.value);
    const [rangeLow, rangeHigh] = series.normalRange;
    const min = Math.min(...values, rangeLow) - (rangeHigh - rangeLow) * 0.15;
    const max = Math.max(...values, rangeHigh) + (rangeHigh - rangeLow) * 0.15;
    const span = max - min || 1;

    const w = 560;
    const h = 180;
    const step = w / (series.data.length - 1);

    const toY = (v) => h - ((v - min) / span) * h;

    const points = series.data.map((d, i) => ({
      x: i * step,
      y: toY(d.value),
      ...d,
    }));

    const linePoints = points.map((p) => `${p.x},${p.y}`).join(" ");
    const areaPoints = `0,${h} ${linePoints} ${w},${h}`;

    const rangeTop = toY(rangeHigh);
    const rangeBottom = toY(rangeLow);

    return { points, linePoints, areaPoints, w, h, rangeTop, rangeBottom };
  }, [series]);

  const latest = series.data[series.data.length - 1];
  const previous = series.data[series.data.length - 2];
  const [rangeLow, rangeHigh] = series.normalRange;

  let status = "normal";
  if (latest.value < rangeLow) status = "low";
  else if (latest.value > rangeHigh) status = "high";

  const delta = previous ? latest.value - previous.value : 0;
  const TrendIcon = delta > 0 ? TrendingUp : delta < 0 ? TrendingDown : Minus;

  return (
    <>
      <div className="dash-page-head">
        <h1>Health Analysis</h1>
        <p>A breakdown of your latest health parameters and trends.</p>
      </div>

      <div className="ha-factor-tabs">
        {factors.map((f) => {
          const fm = factorMeta[f];
          const Icon = fm.icon;
          const active = f === factor;
          return (
            <button
              key={f}
              className={`ha-factor-tab${active ? " active" : ""}`}
              style={
                active
                  ? { background: fm.color, borderColor: fm.color }
                  : { "--tab-color": fm.color }
              }
              onClick={() => setFactor(f)}
            >
              <Icon size={14} strokeWidth={2.2} />
              {f}
            </button>
          );
        })}
      </div>

      <div className="ha-summary-row">
        <div className={`ha-summary-card tint-${meta.tint}`}>
          <div className="ha-summary-icon" style={{ background: meta.color }}>
            <FactorIcon size={16} strokeWidth={2.2} color="#fff" />
          </div>
          <div className="ha-summary-label">Latest reading</div>
          <div className="ha-summary-value" style={{ color: meta.color }}>
            {latest.value} <span>{series.unit}</span>
          </div>
          <div className="ha-summary-sub">{latest.date}</div>
        </div>

        <div className="ha-summary-card">
          <div className="ha-summary-label">Normal range</div>
          <div className="ha-summary-value small">
            {rangeLow} – {rangeHigh} <span>{series.unit}</span>
          </div>
          <div className={`ha-status-pill ${status}`}>
            {status === "normal"
              ? "Within range"
              : status === "low"
                ? "Below range"
                : "Above range"}
          </div>
        </div>

        <div className="ha-summary-card">
          <div className="ha-summary-label">Change since last reading</div>
          <div
            className={`ha-summary-value trend ${delta > 0 ? "up" : delta < 0 ? "down" : ""}`}
          >
            <TrendIcon size={18} strokeWidth={2.2} />
            {Math.abs(delta).toFixed(1)} <span>{series.unit}</span>
          </div>
          <div className="ha-summary-sub">vs {previous?.date}</div>
        </div>
      </div>

      <div className="ha-chart-card">
        <div className="ha-chart-head">
          <h3>
            <span
              className="ha-chart-dot"
              style={{ background: meta.color }}
            ></span>
            {factor} over time
          </h3>
          <div className={`ha-chart-badge ${status}`}>
            {status === "normal" ? "Normal" : status === "low" ? "Low" : "High"}
          </div>
        </div>

        <div className="ha-chart-wrap">
          <svg
            viewBox={`0 0 ${chart.w} ${chart.h}`}
            width="100%"
            height="200"
            style={{ overflow: "visible" }}
          >
            <defs>
              <linearGradient id="haChartFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={meta.color} stopOpacity="0.28" />
                <stop offset="100%" stopColor={meta.color} stopOpacity="0" />
              </linearGradient>
            </defs>

            <rect
              x="0"
              y={chart.rangeTop}
              width={chart.w}
              height={Math.max(chart.rangeBottom - chart.rangeTop, 0)}
              fill="#dcfce7"
              opacity="0.5"
            />

            <polygon points={chart.areaPoints} fill="url(#haChartFill)" />
            <polyline
              points={chart.linePoints}
              fill="none"
              stroke={meta.color}
              strokeWidth="2.5"
            />

            {chart.points.map((p, i) => {
              const outOfRange = p.value < rangeLow || p.value > rangeHigh;
              return (
                <circle
                  key={i}
                  cx={p.x}
                  cy={p.y}
                  r="4"
                  fill={outOfRange ? "#ef4444" : "#fff"}
                  stroke={outOfRange ? "#ef4444" : meta.color}
                  strokeWidth="2.5"
                />
              );
            })}
          </svg>

          <div className="ha-chart-dates">
            {series.data.map((d) => (
              <span key={d.date}>{d.date.replace(" 2026", "")}</span>
            ))}
          </div>
        </div>

        <div className="ha-chart-legend">
          <span>
            <i className="dot range"></i>Normal range band
          </span>
          <span>
            <i className="dot point" style={{ background: meta.color }}></i>
            Reading
          </span>
          <span>
            <i className="dot out"></i>Out of range
          </span>
        </div>
      </div>
    </>
  );
}

export default HealthAnalysis;
