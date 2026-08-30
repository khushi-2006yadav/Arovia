import { Users, UserRound } from "lucide-react";
import { useArovia } from "../../context";
import { latestTests, parseReferenceRange, valueStatus } from "../../data/healthUtils";

function Comparison() {
  const { records } = useArovia();
  const tests = latestTests(records);
  return <>
    <div className="dash-page-head"><h1>Comparison to Healthy Person</h1><p>Compare your latest recorded results with the reference range supplied by the report.</p></div>
    <div className="cmp-list">
      {!tests.length ? <div className="empty-state"><h3>No test results yet</h3><p>Save a lab report to see comparisons.</p></div> : tests.map((t) => {
        const status = String(t.status || valueStatus(t.value, t.referenceRange) || "unknown").toLowerCase();
        const range = parseReferenceRange(t.referenceRange);
        return <div className="cmp-card tint-blue" key={`${t.testName}-${t.recordId}`}>
          <div className="cmp-card-head"><div><div className="cmp-factor-name">{t.testName}</div><div className="cmp-factor-unit">{t.unit || ""}</div></div><div className={`cmp-status-pill ${status}`}>{status === "normal" ? "Within range" : status === "low" ? "Below range" : status === "high" ? "Above range" : status}</div></div>
          <div className="cmp-columns"><div className="cmp-col"><div className="cmp-col-label"><Users size={13}/> Backend reference</div><div className="cmp-col-value neutral">{t.referenceRange || "Not provided"}</div><div className="cmp-col-note">From the saved test result</div></div><div className="cmp-divider"/><div className="cmp-col"><div className="cmp-col-label"><UserRound size={13}/> You</div><div className={`cmp-col-value ${status}`}>{t.value ?? "—"} <span>{t.unit || ""}</span></div><div className="cmp-col-note">{t.recordDate || "—"}</div></div></div>
          <div className="cmp-bar-wrap"><div className="cmp-bar-track"><div className="cmp-bar-range" style={range ? { left: "10%", width: "80%" } : { left: "0", width: "100%" }}/><div className={`cmp-bar-marker you ${status}`} style={{ left: range ? `${Math.max(2, Math.min(98, 50 + ((t.value - ((range.low ?? t.value) + (range.high ?? t.value)) / 2) / Math.max(Math.abs((range.high ?? t.value) - (range.low ?? t.value)), 1)) * 35))}%` : "50%" }} /></div><div className="cmp-bar-legend"><span><i className="dot you"/> Your latest reading</span><span><i className="dot range"/> Reference range</span></div></div>
        </div>;
      })}
    </div>
    <div className="ai-disclaimer-card"><Users size={16}/><div><strong>Reference note:</strong> The supplied API does not return a separate “healthy person” value. Arovia therefore uses the reference range embedded in each backend TestResult instead of inventing a comparison value.</div></div>
  </>;
}
export default Comparison;
