import { useState } from "react";
import { FileText, Stethoscope, Pill, FolderOpen, ChevronDown, ChevronUp, FlaskConical, Activity, Sparkles, Loader2, X } from "lucide-react";
import { useArovia } from "../../context";
import { formatDate } from "../../data/healthUtils";
import { api } from "../../api"; // Added API import for the AI call

const icons = { LAB_REPORT: FileText, PRESCRIPTION: Pill };

function Records() {
  const { records, refreshRecords } = useArovia();
  const [expanded, setExpanded] = useState(null);
  const [loading, setLoading] = useState(false);

  async function refresh() { 
    setLoading(true); 
    try { await refreshRecords(true); } 
    finally { setLoading(false); } 
  }

  return (
    <div className="page-animate">
      <div className="dash-page-head">
        <h1>My Records</h1>
        <p>All medical records returned by the backend.</p>
      </div>
      
      <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:12 }}>
        <button className="settings-save-btn" onClick={refresh} disabled={loading}>
          {loading ? "Refreshing…" : "Refresh records"}
        </button>
      </div>
      
      <div className="records-list">
        {!records.length ? (
          <div className="empty-state">
            <div className="empty-state-icon"><FolderOpen size={32}/></div>
            <h3>No records found</h3>
            <p>Add a report from Report Timeline.</p>
          </div>
        ) : (
          records.map(r => { 
            const Icon = icons[r.recordType] || FileText; 
            const open = expanded === r.id; 
            return (
              <div className="record-row" key={r.id}>
                <div className="record-row-summary" onClick={() => setExpanded(open ? null : r.id)}>
                  <span className="icon"><Icon size={20}/></span>
                  <div className="info">
                    <div className="title">{r.title || "Untitled record"}</div>
                    <div className="meta">{r.recordType || "Record"} · {formatDate(r.recordDate)}</div>
                  </div>
                  <button className="view-btn">
                    {open ? <ChevronUp size={16}/> : <ChevronDown size={16}/>} 
                    <span style={{marginLeft: 4}}>View</span>
                  </button>
                </div>
                {open && <RecordDetail record={r}/>}
              </div>
            ); 
          })
        )}
      </div>
    </div>
  );
}

// ============================================================================
// IMPROVED RECORD DETAIL COMPONENT (Now with AI Analysis logic)
// ============================================================================
function RecordDetail({ record }) {
  // State for AI Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [loadingInsight, setLoadingInsight] = useState(false);
  const [insightData, setInsightData] = useState(null);
  const [insightError, setInsightError] = useState("");

  async function handleAiAnalysis() {
    setModalOpen(true);
    if (insightData) return; // If we already fetched it, just show the modal

    setLoadingInsight(true);
    setInsightError("");
    try {
      const res = await api.fetchRecordAnalysis(record.id);
      
      // Extract the specific 'aiAnalysis' string from the JSON object
const content = res?.aiAnalysis || (typeof res === 'string' ? res : "");
      setInsightData(content || "No analysis available for this record.");
    } catch (e) {
      setInsightError(e.message || "Failed to load AI analysis.");
    } finally {
      setLoadingInsight(false);
    }
  }

  return (
    <div className="record-detail-expanded">
      
      {/* Overview Section */}
      <div className="rd-grid-2">
        {record.doctor && record.doctor.name && (
          <div className="rd-info-box">
            <span className="rd-label"><Stethoscope size={14}/> Doctor</span>
            <span className="rd-value">Dr. {record.doctor.name}</span>
            {record.doctor.specialization && <span className="rd-subtext">{record.doctor.specialization}</span>}
          </div>
        )}
        
        {!!record.diagnoses?.length && (
          <div className="rd-info-box">
            <span className="rd-label"><Activity size={14}/> Diagnoses</span>
            <div className="rd-tags">
              {record.diagnoses.map((d, i) => (
                <span key={i} className="rd-tag">
                  {d.name || d} {d.confidence != null ? `(${Math.round(d.confidence*100)}%)` : ""}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Tests Section */}
      {!!record.testResults?.length && (
        <div className="rd-section">
          <div className="rd-section-title"><FlaskConical size={14}/> Test Results</div>
          <div className="rd-table-wrapper">
            <table className="rd-table">
              <thead>
                <tr>
                  <th>Test Name</th>
                  <th>Result</th>
                  <th>Reference Range</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {record.testResults.map((t, i) => (
                  <tr key={i}>
                    <td className="font-medium">{t.testName || "—"}</td>
                    <td><strong>{t.value || "—"}</strong> <span className="text-muted">{t.unit || ""}</span></td>
                    <td className="text-muted">{t.referenceRange || "—"}</td>
                    <td>
                      {t.status ? (
                        <span className={`rd-status ${t.status.toLowerCase() === 'normal' ? 'normal' : 'alert'}`}>
                          {t.status}
                        </span>
                      ) : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Medications Section */}
      {!!record.medications?.length && (
        <div className="rd-section">
          <div className="rd-section-title"><Pill size={14}/> Medications</div>
          <div className="rd-table-wrapper">
            <table className="rd-table">
              <thead>
                <tr>
                  <th>Medicine</th>
                  <th>Dosage</th>
                  <th>Frequency</th>
                  <th>Duration</th>
                </tr>
              </thead>
              <tbody>
                {record.medications.map((m, i) => (
                  <tr key={i}>
                    <td className="font-medium">{m.medicineName || m.medicine?.medicineName || "—"}</td>
                    <td>{m.dosage || "—"}</td>
                    <td>{m.frequency || "—"} {m.route ? `(${m.route})` : ""}</td>
                    <td>{m.duration ? `${m.duration} days` : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Text Notes Section */}
      {(record.observations || record.additionalDetails) && (
        <div className="rd-grid-2">
          {record.observations && (
            <div className="rd-text-block">
              <div className="rd-section-title">Observations & Notes</div>
              <p className="whitespace-pre-wrap">{record.observations}</p>
            </div>
          )}
          {record.additionalDetails && (
            <div className="rd-text-block">
              <div className="rd-section-title">Additional Details</div>
              <p className="whitespace-pre-wrap">{record.additionalDetails}</p>
            </div>
          )}
        </div>
      )}

      {/* --- NEW: AI Analysis Button --- */}
      <div className="ai-btn-container">
        <button className="ai-analyze-btn" onClick={handleAiAnalysis}>
          <Sparkles size={16} /> <span>Get AI Analysis</span>
        </button>
      </div>

      {/* --- NEW: AI Analysis Modal Overlay --- */}
      {modalOpen && (
        <div className="ai-modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="ai-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="ai-modal-header">
              <h3><Sparkles size={18} className="ai-icon-pulse"/> AI Analysis</h3>
              <button className="ai-modal-close" onClick={() => setModalOpen(false)}>
                <X size={20}/>
              </button>
            </div>
            
            <div className="ai-modal-body">
              {loadingInsight ? (
                <div className="ai-modal-loading">
                  <Loader2 className="spin" size={32} />
                  <p>Analyzing medical record...</p>
                </div>
              ) : insightError ? (
                <div className="login-error" style={{margin: 0}}>{insightError}</div>
              ) : (
                <div className="ai-response-text">
                  {/* Split by the equal signs and map into clean sections */}
                  {insightData.split(/={10,}/).map((section, index) => {
                    // Separate the first line (Heading) from the rest of the text
                    const lines = section.trim().split('\n');
                    const heading = lines[0];
                    const body = lines.slice(1).join('\n');

                    if (!section.trim()) return null;

                    return (
                      <div key={index} style={{ marginBottom: "24px" }}>
                        {/* Render the all-caps heading in bold */}
                        <h4 style={{ color: "#4f46e5", fontSize: "1rem", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                          {heading}
                        </h4>
                        {/* Render the rest of the text keeping the line breaks */}
                        <div style={{ whiteSpace: "pre-wrap", color: "#334155", lineHeight: "1.6" }}>
                          {body.trim()}
                        </div>
                        {/* Add a subtle UI divider instead of ==== */}
                        {index < insightData.split(/={10,}/).length - 1 && (
                          <hr style={{ border: "none", borderBottom: "1px solid #e2e8f0", marginTop: "24px" }} />
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
    </div>
  );
}

export default Records;