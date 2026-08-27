import { useMemo } from "react";
import { Link } from "react-router-dom";
import { TrendingUp, TrendingDown, Minus, Sparkles, Lightbulb } from "lucide-react";
import { useRecords } from "../../hooks/useRecords";
import { buildTrends, buildSuggestions } from "../../api/ai";
import { Spinner, ErrorBanner, EmptyState, StatusBadge } from "../../components/ui";
import Sparkline from "../../components/Sparkline";

export default function Insights() {
  const { records, loading, error, refresh } = useRecords();

  const trends = useMemo(() => buildTrends(records), [records]);
  const suggestions = useMemo(() => buildSuggestions(records), [records]);

  return (
    <div>
      <div className="page-head">
        <div>
          <div className="page-title">Health Insights</div>
          <div className="page-sub">Trends in your levels over time, and where they compare to normal ranges.</div>
        </div>
      </div>

      <ErrorBanner message={error} onRetry={refresh} />

      {loading ? (
        <Spinner label="Analyzing your records…" />
      ) : records.length === 0 ? (
        <EmptyState
          icon="✦"
          title="No insights yet"
          subtitle="Add a lab report and Arovia will start tracking trends across your test results."
          action={
            <Link to="/records/new" className="btn-teal" style={{ marginTop: 12 }}>
              Add Your First Report
            </Link>
          }
        />
      ) : (
        <div className="dash-grid">
          <div>
            <div className="ar-card">
              <div className="ar-card-title" style={{ marginBottom: 10 }}>
                <TrendingUp size={16} /> Trends in Levels
              </div>
              {trends.length === 0 ? (
                <EmptyState icon="📈" title="No numeric test values yet" subtitle="Trends appear once your lab reports include values over time." />
              ) : (
                trends.map((t) => {
                  const direction = t.delta > 0 ? "up" : t.delta < 0 ? "down" : "flat";
                  const DeltaIcon = direction === "up" ? TrendingUp : direction === "down" ? TrendingDown : Minus;
                  return (
                    <div key={t.testName} className="ar-card" style={{ border: "1px solid #eef2f7", boxShadow: "none", padding: 14, marginTop: 12 }}>
                      <div className="trend-head">
                        <span className="t-name">{t.testName}</span>
                        <span className={`t-delta ${direction}`}>
                          <DeltaIcon size={13} style={{ verticalAlign: -2 }} />{" "}
                          {t.delta === 0 ? "Stable" : `${t.delta > 0 ? "+" : ""}${t.delta.toFixed(1)} ${t.latest.unit || ""}`}
                        </span>
                      </div>
                      <Sparkline points={t.points} />
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#94a3b8", marginTop: 4 }}>
                        <span>Latest: {t.latest.value} {t.latest.unit} <StatusBadge status={t.latest.status} /></span>
                        <span>Reference: {t.latest.referenceRange || "—"}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div>
            <div className="ai-insight-box">
              <div className="ai-head">
                <Sparkles size={15} /> Comparison to Healthy Range
              </div>
              <p>
                Arovia AI compares your latest flagged results against typical reference ranges so you know
                what's worth discussing at your next appointment.
              </p>
            </div>

            <div className="ar-card">
              <div className="ar-card-title" style={{ marginBottom: 10 }}>
                <Lightbulb size={16} /> Suggestions
              </div>
              {suggestions.length === 0 ? (
                <EmptyState icon="✅" title="Everything's in range" subtitle="No flagged values across your records right now." />
              ) : (
                suggestions.slice(0, 8).map((s, i) => (
                  <div key={i} className="suggestion-row">
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 13, color: "#0b2a4a" }}>{s.testName}</div>
                      <div style={{ fontSize: 11.5, color: "#94a3b8" }}>
                        {s.value} {s.unit} · {s.recordDate}
                      </div>
                    </div>
                    <div style={{ marginLeft: "auto", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                      <StatusBadge status={s.status} />
                      <Link to={`/records/${s.recordId}`} className="ar-card-link" style={{ fontSize: 11 }}>
                        View Report ›
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
