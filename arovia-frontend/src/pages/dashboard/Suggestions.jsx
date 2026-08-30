import { useState } from "react";
import { Sparkles, RefreshCcw } from "lucide-react";
import { api } from "../../api";
import { useArovia } from "../../context";

// Helper function to format the plain text AI response into nice HTML
function formatAiResponse(text) {
  if (!text) return null;
  
  return text.split('\n').map((line, index) => {
    const str = line.trim();
    if (!str) return <div key={index} style={{ height: '12px' }} />; // Empty lines for spacing

    // Convert ==== and ---- into nice dividers
    if (str.includes('======') || str.includes('------')) {
      return <hr key={index} style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '24px 0' }} />;
    }

    // Convert ALL CAPS lines into section headers
    if (str === str.toUpperCase() && /[A-Z]/.test(str)) {
      return <h3 key={index} style={{ fontSize: '1.15rem', fontWeight: 700, color: '#1e293b', marginTop: '8px', marginBottom: '12px' }}>{str}</h3>;
    }

    // Bold numbered list headers (e.g., "1. Measured Body Mass Index (BMI)")
    if (/^\d+\.\s/.test(str)) {
      return <div key={index} style={{ fontWeight: 600, color: '#0f172a', marginTop: '16px', marginBottom: '8px' }}>{str}</div>;
    }

    // Bold labels before colons (e.g., "Evidence:", "Why it matters:")
    const colonIndex = str.indexOf(':');
    if (colonIndex !== -1 && colonIndex < 40) {
      return (
        <div key={index} style={{ marginBottom: '6px', lineHeight: '1.5' }}>
          <strong style={{ color: '#334155' }}>{str.slice(0, colonIndex + 1)}</strong>{str.slice(colonIndex + 1)}
        </div>
      );
    }

    // Standard paragraphs
    return <p key={index} style={{ margin: '0 0 6px 0', lineHeight: '1.6', color: '#475569' }}>{str}</p>;
  });
}

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
      
      // Extract just the summary if it exists, otherwise fallback to the old logic
      if (result && result.summary) {
        setSuggestion(result.summary);
      } else {
        setSuggestion(typeof result === "string" ? result : JSON.stringify(result, null, 2));
      }
      
    } catch (err) { 
      setError(err.message || "Unable to generate suggestions."); 
    } finally { 
      setLoading(false); 
    }
  }

  return (
    <>
      <div className="dash-page-head">
        <h1>Suggestions</h1>
        <p>Personalized suggestions based on the HealthSnapshot returned by your backend.</p>
      </div>
      
      <div className="sg-ai-card">
        <div className="sg-ai-head">
          <div className="sg-ai-title">
            <span className="sg-ai-icon"><Sparkles size={15}/></span>
            Arovia AI Suggestions
            <span className="sg-ai-badge">AI-Generated</span>
          </div>
          <button className="sg-regenerate-btn" onClick={() => generate(true)} disabled={loading}>
            <RefreshCcw size={13} className={loading ? "spin" : ""}/>
            {loading ? "Thinking…" : "Regenerate"}
          </button>
        </div>
        
        <p className="sg-ai-intro">Based on {user?.name || "your"}’s current health snapshot:</p>
        
        {!suggestion && !loading && (
          <button className="login-submit-btn" style={{ maxWidth: 240 }} onClick={() => generate(false)}>
            Generate suggestions →
          </button>
        )}
        
        {loading && <div className="sg-paragraph loading">The AI endpoint is analyzing the current snapshot…</div>}
        
        {/* Render formatted text instead of <pre> block */}
        {suggestion && !loading && (
          // Remove the inline padding override, or only apply it to top/bottom
          <div className="sg-paragraph" style={{ paddingTop: '10px', paddingBottom: '10px' }}>
            {formatAiResponse(suggestion)}
          </div>
        )}
        
        {error && <div className="login-error">{error}</div>}
      </div>
      
      <div className="ai-disclaimer-card">
        <Sparkles size={16}/>
        <div><strong>AI summary & disclaimer:</strong> The backend AI endpoint is the source of the suggestion. Treat its output as informational and confirm medical decisions with a qualified clinician.</div>
      </div>
    </>
  );
}

export default Suggestions;