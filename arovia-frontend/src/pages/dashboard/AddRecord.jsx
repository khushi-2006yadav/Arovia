import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Plus, Trash2, UploadCloud, ScanLine, ArrowRight } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { addRecord } from "../../api/records";
import { ApiError } from "../../api/client";

const TEST_STATUSES = ["LOW", "NORMAL", "HIGH", "CRITICAL", "UNKNOWN"];

const emptyDiagnosis = () => ({ name: "", confidence: "" });
const emptyTest = () => ({
  category: "",
  testName: "",
  value: "",
  unit: "",
  referenceRange: "",
  status: "NORMAL",
  ageGroup: "",
  method: "",
  timepoint: "",
});
const emptyMed = () => ({
  medicineName: "",
  dosage: "",
  frequency: "",
  route: "",
  duration: "",
  instructions: "",
  confidence: "",
});

export default function AddRecord() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [searchParams] = useSearchParams();
  const scanMode = searchParams.get("mode") === "scan";

  const [recordType, setRecordType] = useState("LAB_REPORT");
  const [recordDate, setRecordDate] = useState(new Date().toISOString().slice(0, 10));
  const [title, setTitle] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [doctorSpecialization, setDoctorSpecialization] = useState("");
  const [observations, setObservations] = useState("");
  const [additionalDetails, setAdditionalDetails] = useState("");
  const [diagnoses, setDiagnoses] = useState([]);
  const [testResults, setTestResults] = useState(recordType === "LAB_REPORT" ? [emptyTest()] : []);
  const [medications, setMedications] = useState(recordType === "PRESCRIPTION" ? [emptyMed()] : []);
  const [fileName, setFileName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function updateAt(list, setList, index, patch) {
    setList(list.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) {
      setError("Please give this record a title.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const dto = {
        recordType,
        recordDate,
        title: title.trim(),
        diagnoses: diagnoses
          .filter((d) => d.name.trim())
          .map((d) => ({ name: d.name.trim(), confidence: d.confidence ? Number(d.confidence) : null })),
        testResults: testResults
          .filter((t) => t.testName.trim())
          .map((t) => ({
            category: t.category || null,
            testName: t.testName.trim(),
            value: t.value !== "" ? Number(t.value) : null,
            unit: t.unit || null,
            referenceRange: t.referenceRange || null,
            status: t.status || null,
            ageGroup: t.ageGroup !== "" ? Number(t.ageGroup) : null,
            method: t.method || null,
            timepoint: t.timepoint || null,
          })),
        medications: medications
          .filter((m) => m.medicineName.trim())
          .map((m) => ({
            medicineName: m.medicineName.trim(),
            dosage: m.dosage || null,
            frequency: m.frequency || null,
            route: m.route || null,
            duration: m.duration !== "" ? Number(m.duration) : 0,
            instructions: m.instructions || null,
            confidence: m.confidence ? Number(m.confidence) : null,
          })),
        doctor: doctorName.trim()
          ? { name: doctorName.trim(), specialization: doctorSpecialization.trim() }
          : null,
        observations: observations || null,
        additionalDetails: additionalDetails || null,
      };

      const recordId = await addRecord(user.userId, dto);
      toast.success("Record added successfully.");
      navigate(`/records/${recordId}`);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "We couldn't save this record. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <div className="page-head">
        <div>
          <div className="page-title">{scanMode ? "Scan Prescription" : "Add Medical Record"}</div>
          <div className="page-sub">
            Enter details from a lab report or prescription. Fields you leave blank are simply omitted.
          </div>
        </div>
      </div>

      <form className="form-card" onSubmit={handleSubmit}>
        <div className="upload-drop">
          <ScanLine size={22} style={{ marginBottom: 8, color: "#0d9488" }} />
          <div>
            <strong>{scanMode ? "Scan or upload a photo of your prescription" : "Upload a report (optional)"}</strong>
            <div>Arovia will use OCR to pre-fill the fields below once document scanning is enabled.</div>
          </div>
          <input
            type="file"
            accept="image/*,.pdf"
            onChange={(e) => setFileName(e.target.files?.[0]?.name || "")}
          />
          {fileName && (
            <div className="upload-note">
              <UploadCloud size={12} style={{ verticalAlign: -2 }} /> Selected: {fileName} — OCR extraction isn't
              connected yet, so please confirm the details manually below.
            </div>
          )}
        </div>

        <div className="form-row cols-2">
          <div className="form-field">
            <label>Record Type</label>
            <select
              value={recordType}
              onChange={(e) => setRecordType(e.target.value)}
            >
              <option value="LAB_REPORT">Lab Report</option>
              <option value="PRESCRIPTION">Prescription</option>
            </select>
          </div>
          <div className="form-field">
            <label>Record Date</label>
            <input type="date" value={recordDate} onChange={(e) => setRecordDate(e.target.value)} />
          </div>
        </div>

        <div className="form-field">
          <label>Title</label>
          <input
            placeholder={recordType === "LAB_REPORT" ? "e.g. Complete Blood Count" : "e.g. General Physician Visit"}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="form-row cols-2">
          <div className="form-field">
            <label>Doctor Name</label>
            <input value={doctorName} onChange={(e) => setDoctorName(e.target.value)} placeholder="Dr. …" />
          </div>
          <div className="form-field">
            <label>Specialization</label>
            <input
              value={doctorSpecialization}
              onChange={(e) => setDoctorSpecialization(e.target.value)}
              placeholder="e.g. General Physician"
            />
          </div>
        </div>

        {/* Diagnoses */}
        <div className="form-section-title">
          Diagnoses
          <button type="button" className="btn-ghost" onClick={() => setDiagnoses([...diagnoses, emptyDiagnosis()])}>
            <Plus size={14} style={{ verticalAlign: -2 }} /> Add
          </button>
        </div>
        {diagnoses.map((d, i) => (
          <div className="dynamic-item" key={i}>
            <button type="button" className="dynamic-item-remove" onClick={() => setDiagnoses(diagnoses.filter((_, idx) => idx !== i))}>
              <Trash2 size={13} />
            </button>
            <div className="form-row cols-2">
              <div className="form-field">
                <label>Diagnosis Name</label>
                <input value={d.name} onChange={(e) => updateAt(diagnoses, setDiagnoses, i, { name: e.target.value })} />
              </div>
              <div className="form-field">
                <label>Confidence (0–1)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="1"
                  value={d.confidence}
                  onChange={(e) => updateAt(diagnoses, setDiagnoses, i, { confidence: e.target.value })}
                />
              </div>
            </div>
          </div>
        ))}

        {/* Test results */}
        <div className="form-section-title">
          Test Results
          <button type="button" className="btn-ghost" onClick={() => setTestResults([...testResults, emptyTest()])}>
            <Plus size={14} style={{ verticalAlign: -2 }} /> Add
          </button>
        </div>
        {testResults.map((t, i) => (
          <div className="dynamic-item" key={i}>
            <button
              type="button"
              className="dynamic-item-remove"
              onClick={() => setTestResults(testResults.filter((_, idx) => idx !== i))}
            >
              <Trash2 size={13} />
            </button>
            <div className="form-row">
              <div className="form-field">
                <label>Test Name</label>
                <input value={t.testName} onChange={(e) => updateAt(testResults, setTestResults, i, { testName: e.target.value })} />
              </div>
              <div className="form-field">
                <label>Category</label>
                <input value={t.category} onChange={(e) => updateAt(testResults, setTestResults, i, { category: e.target.value })} />
              </div>
              <div className="form-field">
                <label>Status</label>
                <select value={t.status} onChange={(e) => updateAt(testResults, setTestResults, i, { status: e.target.value })}>
                  {TEST_STATUSES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-field">
                <label>Value</label>
                <input type="number" step="any" value={t.value} onChange={(e) => updateAt(testResults, setTestResults, i, { value: e.target.value })} />
              </div>
              <div className="form-field">
                <label>Unit</label>
                <input value={t.unit} onChange={(e) => updateAt(testResults, setTestResults, i, { unit: e.target.value })} />
              </div>
              <div className="form-field">
                <label>Reference Range</label>
                <input placeholder="e.g. 12 - 16 g/dL" value={t.referenceRange} onChange={(e) => updateAt(testResults, setTestResults, i, { referenceRange: e.target.value })} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-field">
                <label>Method</label>
                <input value={t.method} onChange={(e) => updateAt(testResults, setTestResults, i, { method: e.target.value })} />
              </div>
              <div className="form-field">
                <label>Timepoint</label>
                <input value={t.timepoint} onChange={(e) => updateAt(testResults, setTestResults, i, { timepoint: e.target.value })} />
              </div>
              <div className="form-field">
                <label>Age Group</label>
                <input type="number" value={t.ageGroup} onChange={(e) => updateAt(testResults, setTestResults, i, { ageGroup: e.target.value })} />
              </div>
            </div>
          </div>
        ))}

        {/* Medications */}
        <div className="form-section-title">
          Medications
          <button type="button" className="btn-ghost" onClick={() => setMedications([...medications, emptyMed()])}>
            <Plus size={14} style={{ verticalAlign: -2 }} /> Add
          </button>
        </div>
        {medications.map((m, i) => (
          <div className="dynamic-item" key={i}>
            <button
              type="button"
              className="dynamic-item-remove"
              onClick={() => setMedications(medications.filter((_, idx) => idx !== i))}
            >
              <Trash2 size={13} />
            </button>
            <div className="form-row">
              <div className="form-field">
                <label>Medicine Name</label>
                <input value={m.medicineName} onChange={(e) => updateAt(medications, setMedications, i, { medicineName: e.target.value })} />
              </div>
              <div className="form-field">
                <label>Dosage</label>
                <input placeholder="e.g. 500mg" value={m.dosage} onChange={(e) => updateAt(medications, setMedications, i, { dosage: e.target.value })} />
              </div>
              <div className="form-field">
                <label>Frequency</label>
                <input placeholder="e.g. Twice daily" value={m.frequency} onChange={(e) => updateAt(medications, setMedications, i, { frequency: e.target.value })} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-field">
                <label>Route</label>
                <input placeholder="e.g. Oral" value={m.route} onChange={(e) => updateAt(medications, setMedications, i, { route: e.target.value })} />
              </div>
              <div className="form-field">
                <label>Duration (days)</label>
                <input type="number" value={m.duration} onChange={(e) => updateAt(medications, setMedications, i, { duration: e.target.value })} />
              </div>
              <div className="form-field">
                <label>Instructions</label>
                <input placeholder="e.g. After meals" value={m.instructions} onChange={(e) => updateAt(medications, setMedications, i, { instructions: e.target.value })} />
              </div>
            </div>
          </div>
        ))}

        <div className="form-section-title">Notes</div>
        <div className="form-field">
          <label>Observations</label>
          <textarea rows={3} value={observations} onChange={(e) => setObservations(e.target.value)} />
        </div>
        <div className="form-field">
          <label>Additional Details</label>
          <textarea rows={3} value={additionalDetails} onChange={(e) => setAdditionalDetails(e.target.value)} />
        </div>

        {error && <div className="login-error">{error}</div>}

        <div className="form-actions">
          <button type="button" className="btn-outline" onClick={() => navigate(-1)}>
            Cancel
          </button>
          <button type="submit" className="btn-teal" disabled={submitting}>
            {submitting ? "Saving…" : "Save Record"} {!submitting && <ArrowRight size={15} />}
          </button>
        </div>
      </form>
    </div>
  );
}
