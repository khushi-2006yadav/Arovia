import { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FileText,
  Pill,
  CheckCircle2,
  AlertTriangle,
  Upload,
  ScanLine,
  FlaskConical,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useRecords } from "../../hooks/useRecords";
import { Spinner, ErrorBanner, EmptyState } from "../../components/ui";
import { deriveMedicinesFromRecords } from "../../api/medications";
import { summarizeRecord } from "../../api/ai";

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good Morning";
  if (h < 17) return "Good Afternoon";
  return "Good Evening";
}

export default function Dashboard() {
  const { user } = useAuth();
  const { records, loading, error, refresh } = useRecords();
  const [aiPreview, setAiPreview] = useState(null);

  const medicines = useMemo(() => deriveMedicinesFromRecords(records, user.userId), [records, user.userId]);

  const stats = useMemo(() => {
    let normal = 0;
    let attention = 0;
    for (const r of records) {
      for (const t of r.testResults || []) {
        if (t.status === "NORMAL") normal += 1;
        else if (t.status) attention += 1;
      }
    }
    return {
      records: records.length,
      activeMeds: medicines.filter((m) => m.status !== "DISCONTINUED").length,
      normal,
      attention,
    };
  }, [records, medicines]);

  const latestRecord = records[0];

  useEffect(() => {
    let cancelled = false;
    if (latestRecord) {
      summarizeRecord(latestRecord).then((s) => {
        if (!cancelled) setAiPreview(s);
      });
    }
    return () => {
      cancelled = true;
    };
  }, [latestRecord]);

  const recentActivity = records.slice(0, 4);

  return (
    <div>
      <div className="page-head">
        <div>
          <div className="page-title">
            {greeting()}, {user?.name?.split(" ")[0] || "there"} 👋
          </div>
          <div className="page-sub">Here's your health overview.</div>
        </div>
        <Link to="/records/new" className="btn-teal">
          <Upload size={16} /> Add Record
        </Link>
      </div>

      <ErrorBanner message={error} onRetry={refresh} />

      {loading ? (
        <Spinner label="Loading your dashboard…" />
      ) : (
        <>
          <div className="stat-grid-real">
            <div className="stat-card-real">
              <div className="icon-box icon-blue"><FileText size={18} /></div>
              <div className="num">{stats.records}</div>
              <div className="label">Medical Records</div>
            </div>
            <div className="stat-card-real">
              <div className="icon-box icon-green"><Pill size={18} /></div>
              <div className="num">{stats.activeMeds}</div>
              <div className="label">Active Medicines</div>
            </div>
            <div className="stat-card-real">
              <div className="icon-box icon-purple"><CheckCircle2 size={18} /></div>
              <div className="num">{stats.normal}</div>
              <div className="label">Normal Parameters</div>
            </div>
            <div className="stat-card-real">
              <div className="icon-box icon-red"><AlertTriangle size={18} /></div>
              <div className="num">{stats.attention}</div>
              <div className="label">Need Attention</div>
            </div>
          </div>

          <div className="dash-grid">
            <div>
              <div className="ar-card">
                <div className="ar-card-head">
                  <div className="ar-card-title">Quick Actions</div>
                </div>
                <div className="quick-actions">
                  <Link to="/records/new" className="quick-action">
                    <div className="icon-box icon-blue"><Upload size={16} /></div>
                    <div className="qa-label">Upload Report</div>
                    <div className="qa-sub">Add your medical documents</div>
                  </Link>
                  <Link to="/records/new?mode=scan" className="quick-action">
                    <div className="icon-box" style={{ background: "#e0f2fe", color: "#0284c7" }}>
                      <ScanLine size={16} />
                    </div>
                    <div className="qa-label">Scan Prescription</div>
                    <div className="qa-sub">Digitize with AI (OCR)</div>
                  </Link>
                  <Link to="/medicines" className="quick-action">
                    <div className="icon-box icon-green"><FlaskConical size={16} /></div>
                    <div className="qa-label">Find Alternatives</div>
                    <div className="qa-sub">Explore generic options</div>
                  </Link>
                  <Link to="/insights" className="quick-action">
                    <div className="icon-box icon-purple"><Sparkles size={16} /></div>
                    <div className="qa-label">Get Insights</div>
                    <div className="qa-sub">Understand your reports</div>
                  </Link>
                </div>
              </div>

              <div className="ar-card">
                <div className="ar-card-head">
                  <div className="ar-card-title">Recent Activity</div>
                  <Link to="/records" className="ar-card-link">View All</Link>
                </div>
                {recentActivity.length === 0 ? (
                  <EmptyState
                    icon="📄"
                    title="No records yet"
                    subtitle="Add your first lab report or prescription to get started."
                    action={
                      <Link to="/records/new" className="btn-teal" style={{ marginTop: 10 }}>
                        <Upload size={15} /> Add Record
                      </Link>
                    }
                  />
                ) : (
                  recentActivity.map((r) => (
                    <Link to={`/records/${r.id}`} key={r.id} className="activity-row" style={{ textDecoration: "none" }}>
                      <div className="a-icon">
                        {r.recordType === "PRESCRIPTION" ? <Pill size={16} /> : <FileText size={16} />}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div className="a-title">{r.title || r.recordType}</div>
                        <div className="a-sub">{r.recordDate}</div>
                      </div>
                      <ChevronRight size={16} color="#94a3b8" />
                    </Link>
                  ))
                )}
              </div>
            </div>

            <div>
              <div className="ai-insight-box">
                <div className="ai-head">
                  <Sparkles size={15} /> Arovia AI Insight
                  {aiPreview?.source === "preview" && <span className="ai-preview-tag">PREVIEW</span>}
                </div>
                {aiPreview ? (
                  <>
                    <p style={{ fontWeight: 700, color: "#fff" }}>{aiPreview.headline}</p>
                    <p>{aiPreview.detail}</p>
                    {latestRecord && (
                      <Link to={`/records/${latestRecord.id}`} className="ai-cta">
                        View Full Insight <ChevronRight size={14} />
                      </Link>
                    )}
                  </>
                ) : (
                  <p>Add a lab report or prescription to unlock AI insights.</p>
                )}
              </div>

              <div className="ar-card" style={{ marginTop: 18 }}>
                <div className="ar-card-title" style={{ marginBottom: 10 }}>Your Health Data</div>
                <p style={{ fontSize: 12.5, color: "#64748b", lineHeight: 1.6 }}>
                  Your records are protected with JWT-authenticated access and only ever
                  fetched over your signed-in session.
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
