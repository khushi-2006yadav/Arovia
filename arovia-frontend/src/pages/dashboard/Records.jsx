import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FileText, Pill, ChevronRight, Plus, Stethoscope } from "lucide-react";
import { useRecords } from "../../hooks/useRecords";
import { Spinner, ErrorBanner, EmptyState } from "../../components/ui";

const FILTERS = [
  { key: "ALL", label: "All Records" },
  { key: "LAB_REPORT", label: "Lab Reports" },
  { key: "PRESCRIPTION", label: "Prescriptions" },
];

export default function Records() {
  const { records, loading, error, refresh } = useRecords();
  const [filter, setFilter] = useState("ALL");

  const filtered = useMemo(
    () => (filter === "ALL" ? records : records.filter((r) => r.recordType === filter)),
    [records, filter]
  );

  return (
    <div>
      <div className="page-head">
        <div>
          <div className="page-title">My Records</div>
          <div className="page-sub">Every lab report and prescription, in one place.</div>
        </div>
        <Link to="/records/new" className="btn-teal">
          <Plus size={16} /> Add Record
        </Link>
      </div>

      <ErrorBanner message={error} onRetry={refresh} />

      <div className="filter-row">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            className={`filter-chip ${filter === f.key ? "active" : ""}`}
            onClick={() => setFilter(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <Spinner label="Loading your records…" />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon="📄"
          title="No records here yet"
          subtitle="Add a lab report or prescription to start building your health timeline."
          action={
            <Link to="/records/new" className="btn-teal" style={{ marginTop: 12 }}>
              <Plus size={15} /> Add Record
            </Link>
          }
        />
      ) : (
        <div className="record-list">
          {filtered.map((r) => {
            const flaggedCount = (r.testResults || []).filter((t) => t.status && t.status !== "NORMAL").length;
            return (
              <Link to={`/records/${r.id}`} key={r.id} className="record-row">
                <div
                  className="r-icon"
                  style={{
                    background: r.recordType === "PRESCRIPTION" ? "#dcfce7" : "#dbeafe",
                    color: r.recordType === "PRESCRIPTION" ? "#16a34a" : "#2563eb",
                  }}
                >
                  {r.recordType === "PRESCRIPTION" ? <Pill size={18} /> : <FileText size={18} />}
                </div>
                <div className="r-body">
                  <div className="r-title">{r.title || r.recordType}</div>
                  <div className="r-sub">
                    {r.recordDate}
                    {r.doctor?.name && (
                      <>
                        {" "}
                        · <Stethoscope size={11} style={{ verticalAlign: -1 }} /> Dr. {r.doctor.name}
                      </>
                    )}
                    {flaggedCount > 0 && <> · {flaggedCount} value(s) flagged</>}
                  </div>
                </div>
                <ChevronRight className="r-chevron" size={18} />
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
