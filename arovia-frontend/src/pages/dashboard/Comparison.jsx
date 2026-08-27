import {
  Droplet,
  Zap,
  HeartPulse,
  Scale,
  Flame,
  Users,
  UserRound,
} from "lucide-react";
import { healthTrends, healthyPerson } from "../../data/mockData";

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

function Comparison() {
  return (
    <>
      <div className="dash-page-head">
        <h1>Comparison to Healthy Person</h1>
        <p>See how your reports compare against healthy reference ranges.</p>
      </div>

      <div className="cmp-list">
        {factors.map((f) => {
          const meta = factorMeta[f];
          const Icon = meta.icon;
          const series = healthTrends[f];
          const healthy = healthyPerson[f];
          const latest = series.data[series.data.length - 1];
          const [rangeLow, rangeHigh] = series.normalRange;

          let status = "normal";
          if (latest.value < rangeLow) status = "low";
          else if (latest.value > rangeHigh) status = "high";

          // Position both values on a shared scale for the bar visual
          const min = Math.min(rangeLow, healthy.value, latest.value) * 0.85;
          const max = Math.max(rangeHigh, healthy.value, latest.value) * 1.15;
          const span = max - min || 1;
          const toPct = (v) => ((v - min) / span) * 100;

          return (
            <div className={`cmp-card tint-${meta.tint}`} key={f}>
              <div className="cmp-card-head">
                <div
                  className="cmp-factor-icon"
                  style={{ background: meta.color }}
                >
                  <Icon size={16} strokeWidth={2.2} color="#fff" />
                </div>
                <div>
                  <div className="cmp-factor-name">{f}</div>
                  <div className="cmp-factor-unit">{series.unit}</div>
                </div>
                <div className={`cmp-status-pill ${status}`}>
                  {status === "normal"
                    ? "Within range"
                    : status === "low"
                      ? "Below range"
                      : "Above range"}
                </div>
              </div>

              <div className="cmp-columns">
                <div className="cmp-col">
                  <div className="cmp-col-label">
                    <Users size={13} strokeWidth={2} /> Healthy Reference
                  </div>
                  <div className="cmp-col-value neutral">
                    {healthy.value} <span>{series.unit}</span>
                  </div>
                  <div className="cmp-col-note">{healthy.note}</div>
                </div>

                <div className="cmp-divider" />

                <div className="cmp-col">
                  <div className="cmp-col-label">
                    <UserRound size={13} strokeWidth={2} /> You
                  </div>
                  <div className={`cmp-col-value ${status}`}>
                    {latest.value} <span>{series.unit}</span>
                  </div>
                  <div className="cmp-col-note">{latest.date}</div>
                </div>
              </div>

              <div className="cmp-bar-wrap">
                <div className="cmp-bar-track">
                  <div
                    className="cmp-bar-range"
                    style={{
                      left: `${toPct(rangeLow)}%`,
                      width: `${toPct(rangeHigh) - toPct(rangeLow)}%`,
                    }}
                  />
                  <div
                    className="cmp-bar-marker healthy"
                    style={{ left: `${toPct(healthy.value)}%` }}
                    title={`Healthy reference: ${healthy.value}`}
                  />
                  <div
                    className={`cmp-bar-marker you ${status}`}
                    style={{ left: `${toPct(latest.value)}%` }}
                    title={`You: ${latest.value}`}
                  />
                </div>
                <div className="cmp-bar-legend">
                  <span>
                    <i className="dot healthy" /> Healthy reference
                  </span>
                  <span>
                    <i className="dot you" /> Your latest reading
                  </span>
                  <span>
                    <i className="dot range" /> Normal range
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default Comparison;
