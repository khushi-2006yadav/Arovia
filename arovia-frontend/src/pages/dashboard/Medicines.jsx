import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Pill, ChevronRight } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useRecords } from "../../hooks/useRecords";
import { deriveMedicinesFromRecords } from "../../api/medications";
import { Spinner, ErrorBanner, EmptyState } from "../../components/ui";

const TABS = [
  { key: "ACTIVE", label: "Active" },
  { key: "DISCONTINUED", label: "Discontinued" },
];

export default function Medicines() {
  const { user } = useAuth();
  const { records, loading, error, refresh } = useRecords();
  const [tab, setTab] = useState("ACTIVE");

  const medicines = useMemo(() => deriveMedicinesFromRecords(records, user.userId), [records, user.userId]);

  const filtered = medicines.filter((m) =>
    tab === "ACTIVE" ? m.status !== "DISCONTINUED" : m.status === "DISCONTINUED"
  );

  return (
    <div>
      <div className="page-head">
        <div>
          <div className="page-title">Medicines</div>
          <div className="page-sub">Everything you're prescribed or have used, tracked in one place.</div>
        </div>
      </div>

      <ErrorBanner message={error} onRetry={refresh} />

      <div className="filter-row">
        {TABS.map((t) => (
          <button key={t.key} className={`filter-chip ${tab === t.key ? "active" : ""}`} onClick={() => setTab(t.key)}>
            {t.label} ({medicines.filter((m) => (t.key === "ACTIVE" ? m.status !== "DISCONTINUED" : m.status === "DISCONTINUED")).length})
          </button>
        ))}
      </div>

      {loading ? (
        <Spinner label="Loading medicines…" />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon="💊"
          title={tab === "ACTIVE" ? "No active medicines" : "No discontinued medicines"}
          subtitle="Medicines mentioned in your prescriptions will show up here automatically."
        />
      ) : (
        <div className="medicine-grid">
          {filtered.map((m) => (
            <Link to={`/medicines/${encodeURIComponent(m.medicineName)}`} key={m.medicineName} className="medicine-tile">
              <div className="m-top">
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div className="icon-box icon-green" style={{ width: 32, height: 32 }}>
                    <Pill size={15} />
                  </div>
                  <div>
                    <div className="m-name">{m.medicineName}</div>
                    <div className="m-dose">{[m.dosage, m.frequency].filter(Boolean).join(" · ") || "Dosage not recorded"}</div>
                  </div>
                </div>
                <ChevronRight size={16} color="#94a3b8" />
              </div>
              <div className="m-meta">
                {m.uses || "Uses & active ingredient available on the detail page"}
              </div>
              {m.sideEffectReports?.length > 0 && (
                <div className="m-meta" style={{ color: "#b45309" }}>
                  {m.sideEffectReports.length} side-effect note(s) logged
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
