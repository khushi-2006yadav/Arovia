import { useState } from "react";
import { FileText, Stethoscope, Pill, FolderOpen, ChevronDown, ChevronUp } from "lucide-react";
import { useArovia } from "../../context";
import { formatDate } from "../../data/healthUtils";

const icons = { LAB_REPORT: FileText, PRESCRIPTION: Pill };

function Records() {
  const { records, refreshRecords } = useArovia();
  const [expanded, setExpanded] = useState(null);
  const [loading, setLoading] = useState(false);

  async function refresh() { setLoading(true); try { await refreshRecords(true); } finally { setLoading(false); } }

  return <div className="page-animate"><div className="dash-page-head"><h1>My Records</h1><p>All medical records returned by the backend.</p></div>
    <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:12 }}><button className="settings-save-btn" onClick={refresh} disabled={loading}>{loading ? "Refreshing…" : "Refresh records"}</button></div>
    <div className="records-list">{!records.length ? <div className="empty-state"><div className="empty-state-icon"><FolderOpen size={32}/></div><h3>No records found</h3><p>Add a report from Report Timeline.</p></div> : records.map(r => { const Icon = icons[r.recordType] || FileText; const open = expanded === r.id; return <div className="record-row" key={r.id}><span className="icon"><Icon size={20}/></span><div className="info"><div className="title">{r.title || "Untitled record"}</div><div className="meta">{r.recordType || "Record"} · {formatDate(r.recordDate)}</div></div><button className="view-btn" onClick={() => setExpanded(open ? null : r.id)}>{open ? <ChevronUp size={14}/> : <ChevronDown size={14}/>} View</button>{open && <RecordDetail record={r}/>}</div>; })}</div>
  </div>;
}

function RecordDetail({ record }) {
  return <div className="record-detail" style={{ gridColumn:"1 / -1", marginTop:10, paddingTop:10, borderTop:"1px solid #e2e8f0" }}>
    {record.doctor && <p><strong>Doctor:</strong> {record.doctor.name} {record.doctor.specialization ? `· ${record.doctor.specialization}` : ""}</p>}
    {!!record.diagnoses?.length && <p><strong>Diagnoses:</strong> {record.diagnoses.map(d => `${d.name}${d.confidence != null ? ` (${Math.round(d.confidence*100)}%)` : ""}`).join(", ")}</p>}
    {!!record.testResults?.length && <div><strong>Tests</strong>{record.testResults.map((t,i) => <div key={i} style={{fontSize:12, marginTop:4}}>{t.testName}: {t.value} {t.unit || ""} · {t.status || ""} · ref {t.referenceRange || "—"}</div>)}</div>}
    {!!record.medications?.length && <div style={{marginTop:8}}><strong>Medications</strong>{record.medications.map((m,i) => <div key={i} style={{fontSize:12, marginTop:4}}><Pill size={11}/> {m.medicine?.medicineName}: {m.dosage}, {m.frequency}, {m.route}, {m.duration} days</div>)}</div>}
    {record.observations && <p style={{marginTop:8}}><strong>Observations:</strong> {record.observations}</p>}
    {record.additionalDetails && <p><strong>Additional details:</strong> {record.additionalDetails}</p>}
  </div>;
}
export default Records;
