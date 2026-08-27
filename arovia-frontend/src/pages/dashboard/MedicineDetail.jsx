import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Pill, ShieldAlert, Coins, ShieldCheck } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useRecords } from "../../hooks/useRecords";
import { useToast } from "../../context/ToastContext";
import {
  deriveMedicinesFromRecords,
  findAlternatives,
  setMedicineStatus,
  addSideEffectReport,
} from "../../api/medications";
import { Spinner } from "../../components/ui";

export default function MedicineDetail() {
  const { name } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { records, loading: recordsLoading } = useRecords();
  const toast = useToast();

  const [alt, setAlt] = useState(null);
  const [altLoading, setAltLoading] = useState(true);
  const [sideEffectNote, setSideEffectNote] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const medicines = useMemo(
    () => deriveMedicinesFromRecords(records, user.userId),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [records, user.userId, refreshKey]
  );
  const medicine = medicines.find((m) => m.medicineName.toLowerCase() === name.toLowerCase());

  useEffect(() => {
    let cancelled = false;
    setAltLoading(true);
    findAlternatives(name).then((data) => {
      if (!cancelled) {
        setAlt(data);
        setAltLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [name]);

  function toggleStatus() {
    if (!medicine) return;
    const next = medicine.status === "DISCONTINUED" ? "ACTIVE" : "DISCONTINUED";
    setMedicineStatus(user.userId, name, next);
    toast.success(next === "DISCONTINUED" ? "Marked as discontinued." : "Marked as active.");
    setRefreshKey((k) => k + 1);
  }

  function submitSideEffect(e) {
    e.preventDefault();
    if (!sideEffectNote.trim()) return;
    addSideEffectReport(user.userId, name, sideEffectNote.trim());
    setSideEffectNote("");
    toast.success("Side effect noted.");
    setRefreshKey((k) => k + 1);
  }

  if (recordsLoading) return <Spinner label="Loading medicine…" />;

  const info = alt?.info;
  const savingPct =
    info?.typicalPricePerStrip && alt?.alternatives?.[0]?.typicalPricePerStrip
      ? Math.round(
          ((info.typicalPricePerStrip - alt.alternatives[0].typicalPricePerStrip) / info.typicalPricePerStrip) * 100
        )
      : null;

  return (
    <div>
      <button className="btn-ghost" onClick={() => navigate(-1)} style={{ marginBottom: 14, display: "flex", alignItems: "center", gap: 6 }}>
        <ArrowLeft size={15} /> Back
      </button>

      <div className="page-head">
        <div>
          <div className="page-title">{name}</div>
          <div className="page-sub">
            {medicine ? [medicine.dosage, medicine.frequency, medicine.route].filter(Boolean).join(" · ") : "Reference information"}
          </div>
        </div>
        {medicine && (
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span className={`status-badge ${medicine.status === "DISCONTINUED" ? "status-unknown" : "status-normal"}`}>
              {medicine.status}
            </span>
            <button className="btn-outline" onClick={toggleStatus}>
              {medicine.status === "DISCONTINUED" ? "Mark as Active" : "Mark as Discontinued"}
            </button>
          </div>
        )}
      </div>

      <div className="ar-card">
        <div className="ar-card-title" style={{ marginBottom: 12 }}>
          <Pill size={16} /> Medicine Information
        </div>
        {altLoading ? (
          <Spinner label="Fetching medicine details…" />
        ) : (
          <div className="detail-grid">
            <div className="detail-item">
              <div className="d-label">Active Salts / Composition</div>
              <div className="d-value">{info?.activeSalts || medicine?.activeSalts || "Not available"}</div>
            </div>
            <div className="detail-item">
              <div className="d-label">Uses</div>
              <div className="d-value">{info?.uses || medicine?.uses || "Not available"}</div>
            </div>
            <div className="detail-item">
              <div className="d-label">Side Effects</div>
              <div className="d-value">{info?.sideEffects || medicine?.sideEffects || "Not available"}</div>
            </div>
          </div>
        )}
        {info?.source === "preview" && (
          <div className="upload-note" style={{ marginTop: 12 }}>
            Reference data shown here is preview/bundled data — live lookups will take over automatically
            once the medicine database endpoint is connected.
          </div>
        )}
      </div>

      {medicine?.sources?.length > 0 && (
        <div className="ar-card">
          <div className="ar-card-title" style={{ marginBottom: 10 }}>Prescribed In</div>
          {medicine.sources.map((s, i) => (
            <div key={i} className="suggestion-row">
              <span style={{ fontWeight: 700, color: "#0b2a4a" }}>{s.title}</span>
              <span style={{ marginLeft: "auto", fontSize: 12, color: "#64748b" }}>{s.recordDate}</span>
            </div>
          ))}
        </div>
      )}

      {!altLoading && alt?.alternatives?.length > 0 && (
        <div className="ar-card">
          <div className="ar-card-title" style={{ marginBottom: 6 }}>
            <Coins size={16} /> Potential Generic Alternatives
          </div>
          <p style={{ fontSize: 12.5, color: "#64748b", marginBottom: 6 }}>
            Options sharing the same active ingredient — always confirm any substitution with your doctor or pharmacist.
          </p>
          <div className="compare-grid">
            <div className="compare-col">
              <span className="compare-pill brand">CURRENT MEDICINE</span>
              <div style={{ fontWeight: 800, fontSize: 15, color: "#0b2a4a" }}>{name}</div>
              <div style={{ fontSize: 12, color: "#64748b", margin: "6px 0" }}>{info?.activeSalts}</div>
              {info?.typicalPricePerStrip && (
                <div style={{ fontFamily: "Poppins, sans-serif", fontWeight: 800, fontSize: 18, color: "#0b2a4a" }}>
                  ₹{info.typicalPricePerStrip} <span style={{ fontSize: 11, fontWeight: 500, color: "#94a3b8" }}>per strip</span>
                </div>
              )}
            </div>
            <div className="compare-vs">vs</div>
            <div className="compare-col">
              <span className="compare-pill generic">GENERIC OPTION</span>
              <div style={{ fontWeight: 800, fontSize: 15, color: "#0b2a4a" }}>{alt.alternatives[0].medicineName}</div>
              <div style={{ fontSize: 12, color: "#64748b", margin: "6px 0" }}>{alt.alternatives[0].activeSalts}</div>
              {alt.alternatives[0].typicalPricePerStrip && (
                <div style={{ fontFamily: "Poppins, sans-serif", fontWeight: 800, fontSize: 18, color: "#0b2a4a" }}>
                  ₹{alt.alternatives[0].typicalPricePerStrip} <span style={{ fontSize: 11, fontWeight: 500, color: "#94a3b8" }}>per strip</span>
                </div>
              )}
            </div>
          </div>
          {savingPct != null && savingPct > 0 && (
            <div style={{ fontSize: 13, fontWeight: 700, color: "#15803d", marginBottom: 10 }}>
              Potential saving: ~{savingPct}%
            </div>
          )}
          <div className="upload-note">
            <ShieldCheck size={12} style={{ verticalAlign: -2 }} /> Generic alternatives are informational only.
            If you decide to switch, use the "Mark as Discontinued" toggle above and add the new medicine as
            a record so your timeline stays accurate.
          </div>
        </div>
      )}

      <div className="ar-card">
        <div className="ar-card-title" style={{ marginBottom: 6 }}>
          <ShieldAlert size={16} /> Tag a Side Effect
        </div>
        <p style={{ fontSize: 12.5, color: "#64748b", marginBottom: 10 }}>
          Faced something unexpected while taking this medicine? Note it here so it's easy to bring up with
          your doctor.
        </p>
        <form onSubmit={submitSideEffect} style={{ display: "flex", gap: 10 }}>
          <input
            className="login-input plain"
            style={{ flex: 1, marginBottom: 0 }}
            placeholder="e.g. Mild nausea after taking it in the morning"
            value={sideEffectNote}
            onChange={(e) => setSideEffectNote(e.target.value)}
          />
          <button className="btn-teal" type="submit">Save</button>
        </form>
        {medicine?.sideEffectReports?.length > 0 && (
          <div style={{ marginTop: 14 }}>
            {medicine.sideEffectReports.map((r, i) => (
              <div key={i} className="suggestion-row">
                <span style={{ fontSize: 13, color: "#334155" }}>{r.note}</span>
                <span style={{ marginLeft: "auto", fontSize: 11, color: "#94a3b8" }}>
                  {new Date(r.reportedAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
