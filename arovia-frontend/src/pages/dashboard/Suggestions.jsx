import { useState } from "react";
import { Sparkles, RefreshCcw } from "lucide-react";
import { api } from "../../api";
import { useArovia } from "../../context";

function Suggestions() {
  const { user, snapshot } = useArovia();
  const [suggestion, setSuggestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function generate(force = false) {
    if (!snapshot) { setError("Health snapshot is not available yet."); return; }
    setError(""); setLoading(true);
    try {
      const result = await api.fetchHealthSuggestion(snapshot, { force });
      setSuggestion(typeof result === "string" ? result : JSON.stringify(result, null, 2));
    } catch (err) { setError(err.message || "Unable to generate suggestions."); }
    finally { setLoading(false); }
  }

  return <>
    <div className="dash-page-head"><h1>Suggestions</h1><p>Personalized suggestions based on the HealthSnapshot returned by your backend.</p></div>
    <div className="sg-ai-card"><div className="sg-ai-head"><div className="sg-ai-title"><span className="sg-ai-icon"><Sparkles size={15}/></span>Arovia AI Suggestions<span className="sg-ai-badge">AI-Generated</span></div><button className="sg-regenerate-btn" onClick={() => generate(true)} disabled={loading}><RefreshCcw size={13} className={loading ? "spin" : ""}/>{loading ? "Thinking…" : "Regenerate"}</button></div>
      <p className="sg-ai-intro">Based on {user?.name || "your"}’s current health snapshot:</p>
      {!suggestion && !loading && <button className="login-submit-btn" style={{ maxWidth: 240 }} onClick={() => generate(false)}>Generate suggestions →</button>}
      {loading && <div className="sg-paragraph loading">The AI endpoint is analyzing the current snapshot…</div>}
      {suggestion && !loading && <pre className="sg-paragraph" style={{ whiteSpace: "pre-wrap", fontFamily: "inherit" }}>{suggestion}</pre>}
      {error && <div className="login-error">{error}</div>}
    </div>
    <div className="ai-disclaimer-card"><Sparkles size={16}/><div><strong>AI summary & disclaimer:</strong> The backend AI endpoint is the source of the suggestion. Treat its output as informational and confirm medical decisions with a qualified clinician.</div></div>
  </>;
}
export default Suggestions;
