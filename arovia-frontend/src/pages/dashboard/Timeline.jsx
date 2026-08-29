import { useRef, useState } from "react";
import { Plus, FileText, X, Loader2, CheckCircle2, ChevronDown, ChevronUp, Stethoscope, FlaskConical, Pill, Calendar, ShieldCheck, Download, GitBranch } from "lucide-react";
import { api } from "../../api";
import { useArovia } from "../../context";
import { formatDate } from "../../data/healthUtils";

const typeMeta = { LAB_REPORT: { label: "Lab Report", icon: FlaskConical }, PRESCRIPTION: { label: "Prescription", icon: Pill } };

function parseAiResponse(value) {
  if (value && typeof value === "object") return value;
  if (typeof value === "string" && value.trim()) {
    try { return JSON.parse(value); } catch { return null; }
  }
  return null;
}

function Timeline() {
  const { user, records, addRecord } = useArovia();
  const [step, setStep] = useState("idle");
  const [file, setFile] = useState(null);
  const [extracted, setExtracted] = useState(null);
  const [expanded, setExpanded] = useState(null);
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  function exportTimelinePdf() {
    if (!records.length) {
      setError("There are no saved records to export yet.");
      return;
    }
    window.print();
  }

  function reset() {
    setStep("idle");
    setFile(null);
    setExtracted(null);
    setError("");
    if (inputRef.current) inputRef.current.value = "";
  }

  async function analyze(selected) {
    setFile(selected); setError(""); setStep("analyzing");
    try {
      const result = await api.uploadRecord(selected);
      const parsed = parseAiResponse(result);
      if (!parsed) throw new Error("The AI upload endpoint did not return a JSON medical record.");
      const record = { ...parsed, medications: Array.isArray(parsed.medications) ? parsed.medications : [], diagnoses: parsed.diagnoses || [], testResults: parsed.testResults || [] };
      setExtracted(record); setStep("review");
    } catch (err) {
      setError(err.message || "Unable to analyze the record.");
      setStep("idle");
      setFile(null);
      setExtracted(null);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function save() {
    if (!extracted) return;
    setError(""); setStep("saving");
    try { await addRecord(extracted); reset(); } catch (err) { setError(err.message || "Unable to save the record."); setStep("review"); }
  }

  return <div className="page-animate timeline-page"><div className="dash-page-head-row timeline-head-row"><div className="dash-page-head"><h1>Report Timeline</h1><p>Upload a report → let the backend AI extract it → review → save to your medical timeline.</p></div><button className="rp-export-btn" onClick={exportTimelinePdf} disabled={!records.length}><Download size={15}/> Export Timeline PDF</button></div>
    <div className="rp-flow-strip" aria-label="Report timeline flow"><div className="rp-flow-step"><span>1</span><strong>Report</strong><small>Prescription / lab</small></div><GitBranch size={16} className="rp-flow-arrow"/><div className="rp-flow-step"><span>2</span><strong>AI extraction</strong><small>Backend response</small></div><GitBranch size={16} className="rp-flow-arrow"/><div className="rp-flow-step"><span>3</span><strong>Review</strong><small>Confirm details</small></div><GitBranch size={16} className="rp-flow-arrow"/><div className="rp-flow-step"><span>4</span><strong>Save</strong><small>Records + snapshot</small></div></div>
    {error && <div className="login-error">{error}</div>}
    {step === "idle" && <button className="rp-add-report-bar" onClick={() => inputRef.current?.click()}><span className="rp-add-report-icon"><Plus size={18}/></span><span className="rp-add-report-text"><span className="rp-add-report-title">Add Report</span><span className="rp-add-report-sub">Send a prescription or lab report to /api/ai/uploadRecord</span></span></button>}
    <input ref={inputRef} type="file" accept="image/*,.pdf" hidden onChange={e => e.target.files?.[0] && analyze(e.target.files[0])}/>

    {step === "analyzing" && <div className="rp-upload-card"><Loader2 className="spin" size={24}/><h3>Analyzing {file?.name}</h3><p>Waiting for the backend AI extraction response.</p></div>}
    {step === "review" && extracted && <div className="rp-review-card"><div className="rp-review-head"><div><h3>Review AI extraction</h3><p>{file?.name}</p></div><button className="rp-secondary-btn" onClick={reset}><X size={15}/> Discard</button></div><Review record={extracted}/><div className="rp-flow-actions"><button className="rp-secondary-btn" onClick={reset}>Discard</button><button className="rp-primary-btn" onClick={save}><CheckCircle2 size={15}/> Save to Timeline</button></div></div>}
    {step === "saving" && <div className="rp-upload-card"><Loader2 className="spin" size={24}/><h3>Saving record</h3><p>Updating records, medication data and health snapshot.</p></div>}

    {step === "idle" && <div className="rp-record-list">{records.length ? records.map(r => <RecordCard key={r.id} record={r} open={expanded===r.id} onToggle={() => setExpanded(expanded===r.id ? null : r.id)}/>) : <div className="empty-state"><Calendar size={28}/><h3>No reports yet</h3><p>Add your first report to start the timeline.</p></div>}</div>}
    <div className="timeline-print-sheet" aria-hidden="true"><div className="timeline-print-header"><div><h1>Arovia — Report Timeline</h1><p>{records.length} saved record{records.length === 1 ? "" : "s"} · Exported {new Date().toLocaleDateString()}</p></div><div className="timeline-print-user">{user?.name || "User"}</div></div>{records.map(r => <PrintRecord key={`print-${r.id}`} record={r}/>)}</div>
    <div className="ai-disclaimer-card"><ShieldCheck size={16}/><div><strong>Data flow:</strong> saved records are returned by GET /api/record/fetchRecords/{"{userId}"}; adding a record also updates the backend health snapshot according to the supplied service implementation.</div></div>
  </div>;
}

function Review({ record }) { return <div className="rp-review-detail"><div className="rp-review-block"><div className="rp-review-label">Record</div><p>{record.recordType || "—"} · {record.title || "Untitled"} · {formatDate(record.recordDate)}</p></div>{record.doctor && <div className="rp-review-block"><div className="rp-review-label">Doctor</div><p><Stethoscope size={12}/> {record.doctor.name} · {record.doctor.specialization || ""}</p></div>}<div className="rp-review-block"><div className="rp-review-label">Diagnoses</div><p>{record.diagnoses?.length ? record.diagnoses.map(d => d.name).join(", ") : "None"}</p></div><div className="rp-review-block"><div className="rp-review-label">Tests</div>{record.testResults?.length ? record.testResults.map((t,i)=><p key={i}>{t.testName}: {t.value} {t.unit || ""} · {t.status || ""}</p>) : <p>None</p>}</div><div className="rp-review-block"><div className="rp-review-label">Medications</div>{record.medications?.length ? record.medications.map((m,i)=><p key={i}><Pill size={12}/> {m.medicineName || m.medicine?.medicineName}: {m.dosage}, {m.frequency}, {m.duration} days</p>) : <p>None</p>}</div>{record.observations && <div className="rp-review-block"><div className="rp-review-label">Observations</div><p>{record.observations}</p></div>}</div> }

function RecordCard({ record, open, onToggle }) { const meta = typeMeta[record.recordType] || { label: record.recordType || "Record", icon: FileText }; const Icon=meta.icon; return <div className="rp-record-card"><div className="rp-record-top" onClick={onToggle}><div className="rp-record-date"><span className="rp-record-month">{record.recordDate ? new Date(record.recordDate).toLocaleString(undefined,{month:"short"}).toUpperCase() : "—"}</span><span className="rp-record-day">{record.recordDate ? new Date(record.recordDate).getDate() : "–"}</span></div><div className="rp-record-icon"><Icon size={16}/></div><div className="rp-record-body"><div className="rp-record-heading"><span className="rp-record-name">{record.title || "Untitled record"}</span><span className="tag neutral">{meta.label}</span></div><div className="rp-record-doctor">{record.doctor?.name || "Doctor not recorded"}</div></div><button className="rp-expand-btn">{open ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}</button></div>{open && <Review record={record}/>}</div>; }
export default Timeline;

function PrintRecord({ record }) {
  const meta = typeMeta[record.recordType] || { label: record.recordType || "Record" };
  return <section className="timeline-print-record">
    <div className="timeline-print-record-head"><div><h2>{record.title || "Untitled record"}</h2><p>{meta.label} · {formatDate(record.recordDate)}</p></div><div>{record.doctor?.name || "Doctor not recorded"}</div></div>
    {record.diagnoses?.length > 0 && <div><strong>Diagnoses</strong><p>{record.diagnoses.map(d => d?.name || d).join(", ")}</p></div>}
    {record.testResults?.length > 0 && <div><strong>Tests</strong>{record.testResults.map((t,i)=><p key={i}>{t.testName}: {t.value ?? "—"} {t.unit || ""} · {t.status || ""}{t.referenceRange ? ` · Ref: ${t.referenceRange}` : ""}</p>)}</div>}
    {record.medications?.length > 0 && <div><strong>Medications</strong>{record.medications.map((m,i)=><p key={i}>{m.medicineName || m.medicine?.medicineName || "Medicine"} · {m.dosage || "—"} · {m.frequency || "—"} · {m.duration ?? "—"} days</p>)}</div>}
    {record.observations && <div><strong>Observations</strong><p>{record.observations}</p></div>}
    {record.additionalDetails && <div><strong>Additional details</strong><p>{record.additionalDetails}</p></div>}
  </section>;
}
