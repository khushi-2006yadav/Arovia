import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Stethoscope, Sparkles, Pill, FlaskConical } from "lucide-react";
import { fetchRecord } from "../../api/records";
import { summarizeRecord } from "../../api/ai";
import { Spinner, ErrorBanner, StatusBadge } from "../../components/ui";
import { ApiError } from "../../api/client";

function referenceProgress(test) {
  // Parses "12 - 16" style ranges to place the value on a 0-100% bar.
  const match = (test.referenceRange || "").match(/([\d.]+)\s*[-–]\s*([\d.]+)/);
  if (!match || test.value == null) return null;
  const low = Number(match[1]);
  const high = Number(match[2]);
  if (Number.isNaN(low) || Number.isNaN(high) || high <= low) return null;
  const span = high - low;
  const padded = span * 0.4;
  const min = low - padded;
  const max = high + padded;
  const pct = Math.min(100, Math.max(0, ((test.value - min) / (max - min)) * 100));
  const lowPct = ((low - min) / (max - min)) * 100;
  const highPct = ((high - min) / (max - min)) * 100;
  return { pct, lowPct, highPct, low, high };
}

export default function RecordDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [summary, setSummary] = useState(null);

  async function load(skipCache = false) {
    setLoading(true);
    setError("");
    try {
      const data = await fetchRecord(id, { skipCache });
      setRecord(data);
      const s = await summarizeRecord(data);
      setSummary(s);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn't load this record.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) return <Spinner label="Loading record…" />;
  if (error) return <ErrorBanner message={error} onRetry={() => load(true)} />;
  if (!record) return null;

  const isPrescription = record.recordType === "PRESCRIPTION";

  return (
    <div>
      <button className="btn-ghost" onClick={() => navigate(-1)} style={{ marginBottom: 14, display: "flex", alignItems: "center", gap: 6 }}>
        <ArrowLeft size={15} /> Back
      </button>

      <div className="page-head">
        <div>
          <div className="page-title">{record.title || record.recordType}</div>
          <div className="page-sub">
            {record.recordDate}
            {record.doctor?.name && (
              <>
                {" "}
                · <Stethoscope size={13} style={{ verticalAlign: -2 }} /> Dr. {record.doctor.name}
                {record.doctor.specialization ? ` (${record.doctor.specialization})` : ""}
              </>
            )}
          </div>
        </div>
        <span className="status-badge status-info">{isPrescription ? "Prescription" : "Lab Report"}</span>
      </div>

      {summary && (
        <div className="ai-insight-box" style={{ marginBottom: 20 }}>
          <div className="ai-head">
            <Sparkles size={15} /> AI Summary
            {summary.source === "preview" && <span className="ai-preview-tag">PREVIEW</span>}
          </div>
          <p style={{ fontWeight: 700, color: "#fff" }}>{summary.headline}</p>
          <p>{summary.detail}</p>
        </div>
      )}

      {record.diagnoses?.length > 0 && (
        <div className="ar-card">
          <div className="ar-card-title" style={{ marginBottom: 12 }}>Diagnoses</div>
          {record.diagnoses.map((d, i) => (
            <div key={i} className="suggestion-row">
              <span style={{ fontWeight: 700, color: "#0b2a4a" }}>{d.name}</span>
              {d.confidence != null && (
                <span style={{ marginLeft: "auto", fontSize: 12, color: "#64748b" }}>
                  {Math.round(d.confidence * 100)}% confidence
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {record.testResults?.length > 0 && (
        <div className="ar-card">
          <div className="ar-card-title" style={{ marginBottom: 14 }}>
            <FlaskConical size={16} /> Test Results
          </div>
          {record.testResults.map((t, i) => {
            const prog = referenceProgress(t);
            return (
              <div key={i} style={{ marginBottom: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <div>
                    <div style={{ fontSize: 13.5, fontWeight: 700, color: "#0b2a4a" }}>{t.testName}</div>
                    {t.category && <div style={{ fontSize: 11.5, color: "#94a3b8" }}>{t.category}</div>}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontFamily: "Poppins, sans-serif", fontWeight: 800, fontSize: 16, color: "#0b2a4a" }}>
                      {t.value ?? "—"} {t.unit || ""}
                    </span>
                    <StatusBadge status={t.status} />
                  </div>
                </div>
                {prog ? (
                  <div style={{ position: "relative", height: 8, background: "#e2e8f0", borderRadius: 999 }}>
                    <div
                      style={{
                        position: "absolute",
                        left: `${prog.lowPct}%`,
                        width: `${Math.max(0, prog.highPct - prog.lowPct)}%`,
                        height: "100%",
                        background: "#bbf7d0",
                        borderRadius: 999,
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        left: `calc(${prog.pct}% - 5px)`,
                        top: -3,
                        width: 14,
                        height: 14,
                        borderRadius: "50%",
                        background: "#0d9488",
                        border: "2px solid #fff",
                        boxShadow: "0 0 0 1px #0d9488",
                      }}
                    />
                  </div>
                ) : null}
                <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 4 }}>
                  Reference Range: {t.referenceRange || "not provided"}
                  {t.method ? ` · ${t.method}` : ""}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {record.medications?.length > 0 && (
        <div className="ar-card">
          <div className="ar-card-title" style={{ marginBottom: 12 }}>
            <Pill size={16} /> Medications
          </div>
          {record.medications.map((m, i) => {
            const name = m.medicineName || m.medicine?.medicineName;
            return (
              <div key={i} className="suggestion-row" style={{ alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontWeight: 700, color: "#0b2a4a", fontSize: 13.5 }}>{name}</div>
                  <div style={{ fontSize: 12, color: "#64748b" }}>
                    {[m.dosage, m.frequency, m.route].filter(Boolean).join(" · ")}
                    {m.duration ? ` · ${m.duration} day(s)` : ""}
                  </div>
                  {m.instructions && (
                    <div style={{ fontSize: 11.5, color: "#94a3b8", marginTop: 2 }}>{m.instructions}</div>
                  )}
                </div>
                {name && (
                  <Link to={`/medicines/${encodeURIComponent(name)}`} className="ar-card-link" style={{ marginLeft: "auto" }}>
                    View Medicine ›
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      )}

      {(record.observations || record.additionalDetails) && (
        <div className="ar-card">
          {record.observations && (
            <>
              <div className="ar-card-title" style={{ marginBottom: 8 }}>Observations</div>
              <p style={{ fontSize: 13, color: "#334155", lineHeight: 1.6, marginBottom: record.additionalDetails ? 16 : 0 }}>
                {record.observations}
              </p>
            </>
          )}
          {record.additionalDetails && (
            <>
              <div className="ar-card-title" style={{ marginBottom: 8 }}>Additional Details</div>
              <p style={{ fontSize: 13, color: "#334155", lineHeight: 1.6 }}>{record.additionalDetails}</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
