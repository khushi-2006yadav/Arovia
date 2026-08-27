import { Link } from "react-router-dom";
import { FlaskConical, Stethoscope, AlertTriangle, Plus } from "lucide-react";
import { useRecords } from "../../hooks/useRecords";
import { Spinner, ErrorBanner, EmptyState, StatusBadge } from "../../components/ui";

function worstStatus(record) {
  const statuses = (record.testResults || []).map((t) => t.status).filter(Boolean);
  if (statuses.includes("CRITICAL")) return "CRITICAL";
  if (statuses.includes("HIGH")) return "HIGH";
  if (statuses.includes("LOW")) return "LOW";
  if (statuses.length) return "NORMAL";
  return null;
}

export default function Timeline() {
  const { records, loading, error, refresh } = useRecords();

  return (
    <div>
      <div className="page-head">
        <div>
          <div className="page-title">Health Timeline</div>
          <div className="page-sub">Your medical journey at a glance — reports and prescriptions over time.</div>
        </div>
        <Link to="/records/new" className="btn-teal">
          <Plus size={16} /> Add Record
        </Link>
      </div>

      <ErrorBanner message={error} onRetry={refresh} />

      <div className="ar-card">
        {loading ? (
          <Spinner label="Building your timeline…" />
        ) : records.length === 0 ? (
          <EmptyState icon="🕐" title="Your timeline is empty" subtitle="Records you add will appear here in chronological order." />
        ) : (
          <div className="v-timeline">
            {records.map((r) => {
              const status = worstStatus(r);
              const isPrescription = r.recordType === "PRESCRIPTION";
              return (
                <div className="v-timeline-item" key={r.id}>
                  <div
                    className={`v-timeline-dot ${
                      status === "CRITICAL" || status === "HIGH" || status === "LOW"
                        ? "flagged"
                        : isPrescription
                        ? "neutral"
                        : ""
                    }`}
                  >
                    {isPrescription ? <Stethoscope size={11} /> : status && status !== "NORMAL" ? (
                      <AlertTriangle size={11} />
                    ) : (
                      <FlaskConical size={11} />
                    )}
                  </div>
                  <div className="v-timeline-date">{r.recordDate}</div>
                  <div className="v-timeline-title">{r.title || r.recordType}</div>
                  <div className="v-timeline-meta">
                    {status && <StatusBadge status={status} />}
                    <Link to={`/records/${r.id}`} className="ar-card-link">
                      View Details ›
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
