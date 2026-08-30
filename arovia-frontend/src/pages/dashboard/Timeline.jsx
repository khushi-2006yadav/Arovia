import { useRef, useState } from "react";
import { Plus, FileText, X, Loader2, CheckCircle2, ChevronDown, ChevronUp, Stethoscope, FlaskConical, Pill, Calendar, ShieldCheck, Download, GitBranch, Trash2, Activity } from "lucide-react";
import { api } from "../../api";
import { useArovia } from "../../context";
import { formatDate } from "../../data/healthUtils";

const typeMeta = { LAB_REPORT: { label: "Lab Report", icon: FlaskConical }, PRESCRIPTION: { label: "Prescription", icon: Pill } };

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
      
      // 1. Unwrap the backend response structure { success, data }
      let payload = typeof result === "string" ? JSON.parse(result) : result;
      let recordData = payload.data ? payload.data : payload;

      if (!recordData || Object.keys(recordData).length === 0) {
        throw new Error("The AI upload endpoint did not return a valid medical record.");
      }

      // 2. Parse stringified JSON arrays/objects (like observations) into editable text
      let parsedObservations = recordData.observations || "";
      if (typeof parsedObservations === 'string' && parsedObservations.trim().startsWith('[')) {
        try {
          const obsArray = JSON.parse(parsedObservations);
          parsedObservations = obsArray.map(o => o.text || JSON.stringify(o)).join('\n');
        } catch (e) { /* keep as string if parsing fails */ }
      }

      let parsedDetails = recordData.additionalDetails || "";
      if (typeof parsedDetails === 'string' && parsedDetails.trim().startsWith('{')) {
        try {
          const detObj = JSON.parse(parsedDetails);
          parsedDetails = Object.entries(detObj).map(([k, v]) => `${k}: ${v}`).join('\n');
        } catch (e) { /* keep as string */ }
      }

      // 3. Construct the clean, editable record
      const record = { 
        ...recordData, 
        title: recordData.title || "",
        recordType: recordData.recordType || "LAB_REPORT",
        recordDate: recordData.recordDate || new Date().toISOString().split('T')[0],
        doctor: recordData.doctor || { name: "", specialization: "" },
        observations: parsedObservations,
        additionalDetails: parsedDetails,
        medications: Array.isArray(recordData.medications) ? recordData.medications : [], 
        diagnoses: Array.isArray(recordData.diagnoses) ? recordData.diagnoses : [], 
        testResults: Array.isArray(recordData.testResults) ? recordData.testResults : [] 
      };

      setExtracted(record); 
      setStep("review");
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
    try { 
      await addRecord(extracted); 
      reset(); 
    } catch (err) { 
      setError(err.message || "Unable to save the record."); 
      setStep("review"); 
    }
  }

  return (
    <div className="page-animate timeline-page">
      <div className="dash-page-head-row timeline-head-row">
        <div className="dash-page-head">
          <h1>Report Timeline</h1>
          <p>Upload a report → let the backend AI extract it → review → save to your medical timeline.</p>
        </div>
        <button className="rp-export-btn" onClick={exportTimelinePdf} disabled={!records.length}>
          <Download size={15}/> Export Timeline PDF
        </button>
      </div>
      
      <div className="rp-flow-strip" aria-label="Report timeline flow">
        <div className="rp-flow-step"><span>1</span><strong>Report</strong><small>Prescription / lab</small></div><GitBranch size={16} className="rp-flow-arrow"/>
        <div className="rp-flow-step"><span>2</span><strong>AI extraction</strong><small>Backend response</small></div><GitBranch size={16} className="rp-flow-arrow"/>
        <div className="rp-flow-step"><span>3</span><strong>Review</strong><small>Confirm details</small></div><GitBranch size={16} className="rp-flow-arrow"/>
        <div className="rp-flow-step"><span>4</span><strong>Save</strong><small>Records + snapshot</small></div>
      </div>
      
      {error && <div className="login-error">{error}</div>}
      
      <input ref={inputRef} type="file" accept="image/*,.pdf" hidden onChange={e => e.target.files?.[0] && analyze(e.target.files[0])}/>

      {step === "analyzing" && (
        <div className="rp-upload-card">
          <Loader2 className="spin" size={24}/>
          <h3>Analyzing {file?.name}</h3>
          <p>Waiting for the backend AI extraction response.</p>
        </div>
      )}
      
      {step === "review" && extracted && (
        <div className="rp-review-card">
          <div className="rp-review-head">
            <div>
              <h3>Review & Edit Extraction</h3>
              <p>{file?.name}</p>
            </div>
            <button className="rp-secondary-btn" onClick={reset}><X size={15}/> Discard</button>
          </div>
          
          <EditableReview record={extracted} onChange={setExtracted} />
          
          <div className="rp-flow-actions">
            <button className="rp-secondary-btn" onClick={reset}>Discard</button>
            <button className="rp-primary-btn" onClick={save}><CheckCircle2 size={15}/> Save to Timeline</button>
          </div>
        </div>
      )}
      
      {step === "saving" && (
        <div className="rp-upload-card">
          <Loader2 className="spin" size={24}/>
          <h3>Saving record</h3>
          <p>Updating records, medication data and health snapshot.</p>
        </div>
      )}

      {/* CONTINUOUS TIMELINE LAYOUT (Groups Add Button and Records together) */}
      {step === "idle" && (
        <div className="timeline-master-wrapper">
          
          {/* Timeline Node 1: Add Record Button */}
          <div className="timeline-node-container add-record-node">
            <div className="timeline-connector">
              <div className="timeline-line"></div>
              <div className="timeline-horizontal"></div>
              <div className="timeline-dot add-dot"></div>
            </div>
            <button className="rp-add-report-bar" style={{ width: '100%', margin: 0 }} onClick={() => inputRef.current?.click()}>
              <span className="rp-add-report-icon"><Plus size={18}/></span>
              <span className="rp-add-report-text">
                <span className="rp-add-report-title">Add Report</span>
                <span className="rp-add-report-sub">Send a prescription or lab report for extraction</span>
              </span>
            </button>
          </div>

          {/* Timeline Nodes: Records List */}
          <div className="rp-record-list" style={{ marginTop: 0 }}>
            {records.length ? (
              <div className="timeline-track-container">
                {records.map(r => (
                  <RecordCard key={r.id} record={r} open={expanded===r.id} onToggle={() => setExpanded(expanded===r.id ? null : r.id)}/>
                ))}
              </div>
            ) : (
              <div className="timeline-node-container empty-node">
                <div className="timeline-connector">
                  <div className="timeline-line" style={{ height: '40px', bottom: 'auto' }}></div>
                  <div className="timeline-horizontal"></div>
                  <div className="timeline-dot"></div>
                </div>
                <div className="empty-state" style={{ margin: 0, flex: 1 }}>
                  <Calendar size={28}/>
                  <h3>No reports yet</h3>
                  <p>Add your first report to start the timeline.</p>
                </div>
              </div>
            )}
          </div>

        </div>
      )}
      
      {/* Print / Hidden sections */}
      <div className="timeline-print-sheet" aria-hidden="true">
        <div className="timeline-print-header">
          <div><h1>Arovia — Report Timeline</h1><p>{records.length} saved records · Exported {new Date().toLocaleDateString()}</p></div>
          <div className="timeline-print-user">{user?.name || "User"}</div>
        </div>
        {records.map(r => <PrintRecord key={`print-${r.id}`} record={r}/>)}
      </div>
      <div className="ai-disclaimer-card">
        <ShieldCheck size={16}/>
        <div><strong>Disclaimer: </strong> Saved records are returned after ai analysis so please manually correct the mistakes made by ai to avoid data discripancy.</div>
      </div>
    </div>
  );
}

// ============================================================================
// EDITABLE REVIEW COMPONENT
// ============================================================================
function EditableReview({ record, onChange }) {
  const handleChange = (field, value) => onChange({ ...record, [field]: value });
  const handleNested = (field, subfield, value) => onChange({ ...record, [field]: { ...record[field], [subfield]: value } });
  
  const handleArrayItem = (arrayName, index, subfield, value) => {
    const newArr = [...(record[arrayName] || [])];
    newArr[index] = { ...newArr[index], [subfield]: value };
    handleChange(arrayName, newArr);
  };

  const removeArrayItem = (arrayName, index) => {
    handleChange(arrayName, record[arrayName].filter((_, i) => i !== index));
  };

  const addArrayItem = (arrayName, emptyItem) => {
    const currentArr = record[arrayName] || [];
    handleChange(arrayName, [...currentArr, emptyItem]);
  };

  return (
    <div className="rp-review-detail editable-review">
      
      {/* GENERAL INFO */}
      <div className="rp-review-block">
        <div className="rp-review-label">General Information</div>
        <div className="form-row">
          <input type="text" placeholder="Title" value={record.title || ""} onChange={e => handleChange('title', e.target.value)} />
          <select value={record.recordType || ""} onChange={e => handleChange('recordType', e.target.value)}>
            <option value="LAB_REPORT">Lab Report</option>
            <option value="PRESCRIPTION">Prescription</option>
          </select>
          <input type="date" value={record.recordDate || ""} onChange={e => handleChange('recordDate', e.target.value)} />
        </div>
      </div>

      {/* DOCTOR */}
      <div className="rp-review-block">
        <div className="rp-review-label">Doctor</div>
        <div className="form-row">
          <input type="text" placeholder="Doctor Name" value={record.doctor?.name || ""} onChange={e => handleNested('doctor', 'name', e.target.value)} />
          <input type="text" placeholder="Specialization" value={record.doctor?.specialization || ""} onChange={e => handleNested('doctor', 'specialization', e.target.value)} />
        </div>
      </div>

      {/* DIAGNOSES */}
      <div className="rp-review-block">
        <div className="rp-review-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Diagnoses</span>
          <button className="login-submit-btn" style={{ padding: '4px 10px', fontSize: '12px', width: 'auto' }} onClick={() => addArrayItem('diagnoses', { name: "", confidence: 100 })}>+ Add Diagnosis</button>
        </div>
        {record.diagnoses?.map((diag, i) => (
          <div key={i} className="form-row array-row">
            <input type="text" placeholder="Diagnosis Name" value={diag.name || ""} onChange={e => handleArrayItem('diagnoses', i, 'name', e.target.value)} style={{ flex: 2 }} />
            <input type="number" placeholder="Confidence (%)" value={diag.confidence || ""} onChange={e => handleArrayItem('diagnoses', i, 'confidence', parseFloat(e.target.value) || 0)} />
            <button className="rp-icon-btn" onClick={() => removeArrayItem('diagnoses', i)}><Trash2 size={14}/></button>
          </div>
        ))}
        {(!record.diagnoses || record.diagnoses.length === 0) && <p className="text-muted" style={{ fontSize: '13px' }}>No diagnoses found.</p>}
      </div>

      {/* TEST RESULTS */}
      <div className="rp-review-block">
        <div className="rp-review-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Test Results</span>
          <button className="login-submit-btn" style={{ padding: '4px 10px', fontSize: '12px', width: 'auto' }} onClick={() => addArrayItem('testResults', { category: "", testName: "", value: "", unit: "", referenceRange: "", status: "", ageGroup: "", method: "", timepoint: "" })}>+ Add Test</button>
        </div>
        {record.testResults?.map((test, i) => (
          <div key={i} className="array-item-container" style={{ background: '#f8fafc', padding: '10px', borderRadius: '8px', marginBottom: '10px', border: '1px solid #e2e8f0' }}>
            <div className="form-row array-row" style={{ marginBottom: '8px' }}>
              <input type="text" placeholder="Test Name" value={test.testName || ""} onChange={e => handleArrayItem('testResults', i, 'testName', e.target.value)} />
              <input type="text" placeholder="Category" value={test.category || ""} onChange={e => handleArrayItem('testResults', i, 'category', e.target.value)} />
              <input type="text" placeholder="Status (e.g. NORMAL, HIGH)" value={test.status || ""} onChange={e => handleArrayItem('testResults', i, 'status', e.target.value)} />
              <button className="rp-icon-btn" onClick={() => removeArrayItem('testResults', i)}><Trash2 size={14}/></button>
            </div>
            <div className="form-row array-row" style={{ marginBottom: '8px' }}>
              <input type="text" placeholder="Value (String)" value={test.value || ""} onChange={e => handleArrayItem('testResults', i, 'value', e.target.value)} />
              <input type="text" placeholder="Unit" value={test.unit || ""} onChange={e => handleArrayItem('testResults', i, 'unit', e.target.value)} />
              <input type="text" placeholder="Reference Range" value={test.referenceRange || ""} onChange={e => handleArrayItem('testResults', i, 'referenceRange', e.target.value)} />
            </div>
            <div className="form-row array-row">
              <input type="text" placeholder="Method" value={test.method || ""} onChange={e => handleArrayItem('testResults', i, 'method', e.target.value)} />
              <input type="number" step="0.1" placeholder="Age Group" value={test.ageGroup || ""} onChange={e => handleArrayItem('testResults', i, 'ageGroup', parseFloat(e.target.value) || "")} />
              <input type="date" placeholder="Timepoint" value={test.timepoint || ""} onChange={e => handleArrayItem('testResults', i, 'timepoint', e.target.value)} />
            </div>
          </div>
        ))}
        {(!record.testResults || record.testResults.length === 0) && <p className="text-muted" style={{ fontSize: '13px' }}>No test results found.</p>}
      </div>

      {/* MEDICATIONS */}
      <div className="rp-review-block">
        <div className="rp-review-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Medications</span>
          <button className="login-submit-btn" style={{ padding: '4px 10px', fontSize: '12px', width: 'auto' }} onClick={() => addArrayItem('medications', { medicineName: "", dosage: "", frequency: "", route: "", duration: "", instructions: "", confidence: 100 })}>+ Add Medicine</button>
        </div>
        {record.medications?.map((med, i) => (
          <div key={i} className="array-item-container" style={{ background: '#f8fafc', padding: '10px', borderRadius: '8px', marginBottom: '10px', border: '1px solid #e2e8f0' }}>
            <div className="form-row array-row" style={{ marginBottom: '8px' }}>
              <input type="text" placeholder="Medicine Name" value={med.medicineName || med.medicine?.name || ""} onChange={e => handleArrayItem('medications', i, 'medicineName', e.target.value)} />
              <input type="text" placeholder="Dosage" value={med.dosage || ""} onChange={e => handleArrayItem('medications', i, 'dosage', e.target.value)} />
              <input type="text" placeholder="Route (e.g. Oral)" value={med.route || ""} onChange={e => handleArrayItem('medications', i, 'route', e.target.value)} />
              <button className="rp-icon-btn" onClick={() => removeArrayItem('medications', i)}><Trash2 size={14}/></button>
            </div>
            <div className="form-row array-row">
              <input type="text" placeholder="Frequency" value={med.frequency || ""} onChange={e => handleArrayItem('medications', i, 'frequency', e.target.value)} />
              <input type="number" placeholder="Duration (Days)" value={med.duration || ""} onChange={e => handleArrayItem('medications', i, 'duration', parseInt(e.target.value) || 0)} />
              <input type="text" placeholder="Instructions" value={med.instructions || ""} onChange={e => handleArrayItem('medications', i, 'instructions', e.target.value)} />
            </div>
          </div>
        ))}
        {(!record.medications || record.medications.length === 0) && <p className="text-muted" style={{ fontSize: '13px' }}>No medications found.</p>}
      </div>

      {/* OBSERVATIONS & ADDITIONAL DETAILS */}
      <div className="rp-review-block">
        <div className="rp-review-label">Observations & Comments</div>
        <textarea rows={3} value={record.observations || ""} onChange={e => handleChange('observations', e.target.value)} placeholder="Extracted observations, comments, or notes..." />
      </div>

      <div className="rp-review-block">
        <div className="rp-review-label">Additional Details</div>
        <textarea rows={2} value={record.additionalDetails || ""} onChange={e => handleChange('additionalDetails', e.target.value)} placeholder="Metadata, registration numbers, extra context..." />
      </div>

    </div>
  );
}


// ============================================================================
// READ-ONLY REVIEW COMPONENT
// ============================================================================
function Review({ record }) { 
  return (
    <div className="record-detail-expanded">
      
      {/* INFO CARDS */}
      <div className="rd-grid-2">
        <div className="rd-info-box">
          <span className="rd-label"><FileText size={14}/> Record Info</span>
          <span className="rd-value">{record.title || "Untitled"}</span>
          <span className="rd-subtext">{record.recordType || "—"} · {formatDate(record.recordDate)}</span>
        </div>

        {record.doctor && record.doctor.name && (
          <div className="rd-info-box">
            <span className="rd-label"><Stethoscope size={14}/> Doctor</span>
            <span className="rd-value">Dr. {record.doctor.name}</span>
            {record.doctor.specialization && <span className="rd-subtext">{record.doctor.specialization}</span>}
          </div>
        )}
      </div>

      {/* DIAGNOSES */}
      <div className="rp-review-block">
        <div className="rp-review-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Diagnoses</span>
          <button className="login-submit-btn" style={{ padding: '4px 10px', fontSize: '12px', width: 'auto' }} onClick={() => addArrayItem('diagnoses', { name: "", confidence: 100 })}>+ Add Diagnosis</button>
        </div>
        {record.diagnoses?.map((diag, i) => (
          <div key={i} className="form-row array-row" style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
            
            {/* Name gets flex: 3 so it takes up most of the space */}
            <input 
              type="text" 
              placeholder="Diagnosis Name" 
              value={diag.name || ""} 
              onChange={e => handleArrayItem('diagnoses', i, 'name', e.target.value)} 
              style={{ flex: 3, minWidth: 0 }} 
            />

            <input 
              type="number" 
              placeholder="Confidence (%)" 
              value={diag.confidence || ""} 
              onChange={e => handleArrayItem('diagnoses', i, 'confidence', parseFloat(e.target.value) || 0)} 
              style={{ flex: 1, minWidth: '90px' }} 
            />
            
            <button className="rp-icon-btn" onClick={() => removeArrayItem('diagnoses', i)}>
              <Trash2 size={14}/>
            </button>
          </div>
        ))}
        {(!record.diagnoses || record.diagnoses.length === 0) && <p className="text-muted" style={{ fontSize: '13px' }}>No diagnoses found.</p>}
      </div>

      {/* TEST RESULTS */}
      {!!record.testResults?.length && (
        <div className="rd-section" style={{ marginTop: 16 }}>
          <div className="rd-section-title"><FlaskConical size={14}/> Test Results</div>
          <div className="rd-table-wrapper">
            <table className="rd-table">
              <thead>
                <tr>
                  <th>Test & Category</th>
                  <th>Result</th>
                  <th>Reference Range</th>
                  <th>Status</th>
                  <th>Method & Date</th>
                </tr>
              </thead>
              <tbody>
                {record.testResults.map((t, i) => (
                  <tr key={i}>
                    <td>
                      <div className="font-medium">{t.testName || "—"}</div>
                      {t.category && <div className="text-muted" style={{ fontSize: '0.85em' }}>{t.category}</div>}
                    </td>
                    <td>
                      <strong>{t.value || "—"}</strong> <span className="text-muted">{t.unit || ""}</span>
                    </td>
                    <td className="text-muted">{t.referenceRange || "—"}</td>
                    <td>
                      {t.status ? (
                        <span className={`rd-status ${t.status.toString().toLowerCase() === 'normal' ? 'normal' : 'alert'}`}>
                          {t.status}
                        </span>
                      ) : "—"}
                    </td>
                    <td className="text-muted" style={{ fontSize: '0.85em', lineHeight: '1.4' }}>
                      {t.method && <div><strong>Method:</strong> {t.method}</div>}
                      {t.timepoint && <div><strong>Date:</strong> {t.timepoint}</div>}
                      {t.ageGroup && <div><strong>Age Grp:</strong> {t.ageGroup}</div>}
                      {(!t.method && !t.timepoint && !t.ageGroup) && "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MEDICATIONS */}
      {!!record.medications?.length && (
        <div className="rd-section" style={{ marginTop: 16 }}>
          <div className="rd-section-title"><Pill size={14}/> Medications</div>
          <div className="rd-table-wrapper">
            <table className="rd-table">
              <thead>
                <tr>
                  <th>Medicine</th>
                  <th>Dosage & Route</th>
                  <th>Frequency & Duration</th>
                  <th>Instructions</th>
                </tr>
              </thead>
              <tbody>
                {record.medications.map((m, i) => (
                  <tr key={i}>
                    <td className="font-medium">
                      {m.medicine?.medicineName || "—"}
                    </td>
                    <td>
                      <div>{m.dosage || "—"}</div>
                      {m.route && <div className="text-muted" style={{ fontSize: '0.85em' }}>Route: {m.route}</div>}
                    </td>
                    <td>
                      <div>{m.frequency || "—"}</div>
                      {m.duration ? <div className="text-muted" style={{ fontSize: '0.85em' }}>{m.duration} days</div> : null}
                    </td>
                    <td className="text-muted" style={{ fontSize: '0.9em' }}>
                      {m.instructions || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* OBSERVATIONS & ADDITIONAL DETAILS */}
      {(record.observations || record.additionalDetails) && (
        <div className="rd-grid-2" style={{ marginTop: 16 }}>
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
      
    </div>
  ); 
}

// ============================================================================
// TIMELINE RECORD CARD (Fully structured for the branch graphic)
// ============================================================================
function RecordCard({ record, open, onToggle }) { 
  const meta = typeMeta[record.recordType] || { label: record.recordType || "Record", icon: FileText }; 
  const Icon = meta.icon; 
  return (
    <div className="timeline-node-container">
      {/* Connected graphics drawing `|---- ` */}
      <div className="timeline-connector">
        <div className="timeline-line"></div>
        <div className="timeline-horizontal"></div>
        <div className="timeline-dot"></div>
      </div>

      <div className="rp-record-card" style={{ flex: 1, margin: 0 }}>
        <div className="rp-record-top" onClick={onToggle}>
          <div className="rp-record-date">
            <span className="rp-record-month">{record.recordDate ? new Date(record.recordDate).toLocaleString(undefined,{month:"short"}).toUpperCase() : "—"}</span>
            <span className="rp-record-day">{record.recordDate ? new Date(record.recordDate).getDate() : "–"}</span>
          </div>
          <div className="rp-record-icon"><Icon size={16}/></div>
          <div className="rp-record-body">
            <div className="rp-record-heading">
              <span className="rp-record-name">{record.title || "Untitled record"}</span>
              <span className="tag neutral">{meta.label}</span>
            </div>
            <div className="rp-record-doctor">{record.doctor?.name || "Doctor not recorded"}</div>
          </div>
          <button className="rp-expand-btn">{open ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}</button>
        </div>
        
        {open && (
          <div style={{ padding: "0 16px 16px 16px", borderTop: "1px dashed #e2e8f0" }}>
            <Review record={record}/>
          </div>
        )}
      </div>
    </div>
  ); 
}


function PrintRecord({ record }) {
  const meta = typeMeta[record.recordType] || { label: record.recordType || "Record" };
  return (
    <section className="timeline-print-record">
      <div className="timeline-print-record-head">
        <div><h2>{record.title || "Untitled record"}</h2><p>{meta.label} · {formatDate(record.recordDate)}</p></div>
        <div>{record.doctor?.name || "Doctor not recorded"}</div>
      </div>
      {record.diagnoses?.length > 0 && <div><strong>Diagnoses</strong><p>{record.diagnoses.map(d => d?.name || d).join(", ")}</p></div>}
      {record.testResults?.length > 0 && <div><strong>Tests</strong>{record.testResults.map((t,i)=><p key={i}>{t.testName}: {t.value ?? "—"} {t.unit || ""} · {t.status || ""}{t.referenceRange ? ` · Ref: ${t.referenceRange}` : ""}</p>)}</div>}
      {record.medications?.length > 0 && <div><strong>Medications</strong>{record.medications.map((m,i)=><p key={i}>{m.medicineName || m.medicine?.medicineName || "Medicine"} · {m.dosage || "—"} · {m.frequency || "—"} · {m.duration ?? "—"} days</p>)}</div>}
      {record.observations && <div><strong>Observations</strong><p>{record.observations}</p></div>}
      {record.additionalDetails && <div><strong>Additional details</strong><p>{record.additionalDetails}</p></div>}
    </section>
  );
}

export default Timeline;