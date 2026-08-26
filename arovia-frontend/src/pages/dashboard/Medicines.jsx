import { useState } from "react";
import {
  Clock,
  ChevronDown,
  ChevronUp,
  Sparkles,
  RefreshCcw,
  CircleCheck,
} from "lucide-react";
import { medicines as initialMedicines } from "../../data/mockData";

function Medicines() {
  // Local copy of the mock data so the page can react to actions
  // (tagging a side effect, switching to a generic, discontinuing a
  // medicine) — this is all in-memory until a backend exists to persist it.
  const [meds, setMeds] = useState(initialMedicines);
  const [filter, setFilter] = useState("active"); // "active" | "discontinued"
  const [expandedId, setExpandedId] = useState(null);

  const activeCount = meds.filter((m) => m.status === "active").length;
  const discontinuedCount = meds.filter(
    (m) => m.status === "discontinued",
  ).length;
  const visibleMeds = meds.filter((m) => m.status === filter);

  function toggleExpand(id) {
    setExpandedId((cur) => (cur === id ? null : id));
  }

  // "tag side-effects to any medicine if faced"
  function toggleSideEffect(id, effect) {
    setMeds((prev) =>
      prev.map((m) => {
        if (m.id !== id) return m;
        const already = m.reportedSideEffects.includes(effect);
        return {
          ...m,
          reportedSideEffects: already
            ? m.reportedSideEffects.filter((e) => e !== effect)
            : [...m.reportedSideEffects, effect],
        };
      }),
    );
  }

  // "option to update the medicine if taking substitute"
  function switchToGeneric(id) {
    setMeds((prev) =>
      prev.map((m) => (m.id === id ? { ...m, switchedToGeneric: true } : m)),
    );
  }

  // Active/Discontinued toggle
  function toggleStatus(id) {
    setMeds((prev) =>
      prev.map((m) =>
        m.id === id
          ? { ...m, status: m.status === "active" ? "discontinued" : "active" }
          : m,
      ),
    );
  }

  // Total potential savings across active meds that have a substitute
  // available and haven't switched yet — shown as a running incentive.
  const totalSavings = meds
    .filter(
      (m) => m.status === "active" && m.substitute && !m.switchedToGeneric,
    )
    .reduce(
      (sum, m) => sum + (m.substitute.brandPrice - m.substitute.genericPrice),
      0,
    );

  return (
    <>
      <div className="dash-page-head">
        <h1>Medication</h1>
        <p>
          Everything you're prescribed — dosage, uses, side-effects, and generic
          options.
        </p>
      </div>

      <div className="med-filter-tabs">
        <button
          className={`med-filter-tab${filter === "active" ? " active" : ""}`}
          onClick={() => setFilter("active")}
        >
          Active <span className="count">({activeCount})</span>
        </button>
        <button
          className={`med-filter-tab${filter === "discontinued" ? " active" : ""}`}
          onClick={() => setFilter("discontinued")}
        >
          Discontinued <span className="count">({discontinuedCount})</span>
        </button>
      </div>

      {totalSavings > 0 && filter === "active" && (
        <div className="med-savings-summary">
          <Sparkles size={18} strokeWidth={2} />
          <div>
            You could save <strong>₹{totalSavings}</strong> by switching to
            available generic alternatives below.
          </div>
        </div>
      )}

      <div className="medicine-list">
        {visibleMeds.length === 0 && (
          <div className="placeholder-card">
            <p>No {filter} medicines right now.</p>
          </div>
        )}

        {visibleMeds.map((m) => {
          const isOpen = expandedId === m.id;
          const displayName =
            m.switchedToGeneric && m.substitute ? m.substitute.name : m.name;

          return (
            <div
              className={`med-card${m.status === "discontinued" ? " discontinued" : ""}`}
              key={m.id}
            >
              <div className="med-card-top" onClick={() => toggleExpand(m.id)}>
                <div>
                  <div className="med-card-heading">
                    <span className="name">{displayName}</span>
                    <span className={`badge ${m.tagType}`}>
                      {m.tagType === "new" ? "NEW" : "CONTINUED"}
                    </span>
                    <span className={`badge status-${m.status}`}>
                      {m.status === "active" ? "ACTIVE" : "DISCONTINUED"}
                    </span>
                    {m.switchedToGeneric && (
                      <span className="badge continued">ON GENERIC</span>
                    )}
                  </div>
                  <div className="generic-name">{m.genericName}</div>
                  <div className="dose">{m.dose}</div>
                  <div className="freq">
                    <Clock size={13} strokeWidth={2} /> {m.frequency}
                  </div>
                  {m.status === "active" && (
                    <div className="med-remaining">
                      <strong>{m.remainingDays} days</strong> of supply
                      remaining
                    </div>
                  )}
                </div>
                <button className="med-expand-btn" aria-label="Toggle details">
                  {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
              </div>

              {isOpen && (
                <div className="med-detail">
                  <div className="med-detail-label">Uses</div>
                  <div className="chip-row">
                    {m.uses.map((u) => (
                      <span className="chip" key={u}>
                        {u}
                      </span>
                    ))}
                  </div>

                  <div className="med-detail-label">Side Effects</div>
                  <p className="med-detail-hint">
                    Tap any side-effect you've actually experienced — it gets
                    noted against this medicine.
                  </p>
                  <div className="chip-row">
                    {m.sideEffects.map((se) => {
                      const reported = m.reportedSideEffects.includes(se);
                      return (
                        <button
                          key={se}
                          className={`chip side-effect${reported ? " reported" : ""}`}
                          onClick={() => toggleSideEffect(m.id, se)}
                        >
                          {se}
                          {reported && (
                            <CircleCheck
                              size={13}
                              className="mark"
                              style={{
                                display: "inline",
                                verticalAlign: "-2px",
                              }}
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {m.substitute && (
                    <div className="substitute-box">
                      <div className="info">
                        <strong>{m.substitute.name}</strong>
                        Same composition, potentially ₹
                        {m.substitute.brandPrice -
                          m.substitute.genericPrice}{" "}
                        cheaper per {m.substitute.unit}.
                      </div>
                      <button
                        className={`substitute-switch-btn${m.switchedToGeneric ? " done" : ""}`}
                        onClick={() =>
                          !m.switchedToGeneric && switchToGeneric(m.id)
                        }
                        disabled={m.switchedToGeneric}
                      >
                        {m.switchedToGeneric ? (
                          "Switched ✓"
                        ) : (
                          <>
                            <RefreshCcw
                              size={13}
                              style={{
                                display: "inline",
                                verticalAlign: "-2px",
                                marginRight: 6,
                              }}
                            />
                            Switch to generic
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  <div className="med-actions">
                    <button
                      className="med-action-btn danger"
                      onClick={() => toggleStatus(m.id)}
                    >
                      {m.status === "active"
                        ? "Mark as Discontinued"
                        : "Reactivate this medicine"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="ai-disclaimer-card">
        <Sparkles
          size={16}
          strokeWidth={2}
          style={{ flexShrink: 0, marginTop: 1 }}
        />
        <div>
          <strong>AI summary & disclaimer:</strong> Uses, side-effects and
          generic suggestions shown here are for general information only —
          they're not a substitute for advice from your doctor or pharmacist.
          Always confirm before switching a medicine or stopping a course.
        </div>
      </div>
    </>
  );
}

export default Medicines;
