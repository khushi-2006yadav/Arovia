import { useState } from "react";
import {
  Sparkles,
  RefreshCcw,
  Utensils,
  Moon,
  Activity,
  Droplets,
  Footprints,
} from "lucide-react";
import { currentUser } from "../../data/mockData";

// Placeholder suggestion sets — stand-in for real AI-generated output
// until the backend suggestion endpoint is wired up.
const suggestionSets = [
  [
    {
      icon: Droplets,
      color: "#0ea5e9",
      title: "Hemoglobin is trending low",
      text: "Your last two readings sit slightly below the normal range. Consider iron-rich foods like spinach, lentils, and lean red meat, and mention this trend at your next check-up.",
    },
    {
      icon: Utensils,
      color: "#d97706",
      title: "Fasting sugar creeping up",
      text: "Your fasting glucose has risen over the last two months. Cutting back on refined carbs in the evening and adding a short post-dinner walk can help bring it back down.",
    },
    {
      icon: Activity,
      color: "#7c3aed",
      title: "Blood pressure is borderline",
      text: "Systolic readings are close to the upper edge of normal. Reducing sodium intake and tracking your BP twice a week would help catch any further rise early.",
    },
    {
      icon: Moon,
      color: "#6366f1",
      title: "Consistency matters more than perfection",
      text: "Small, steady changes — regular sleep, hydration, and light daily movement — tend to move these numbers more reliably than short bursts of intense effort.",
    },
  ],
  [
    {
      icon: Footprints,
      color: "#16a34a",
      title: "Add short walks after meals",
      text: "A 10–15 minute walk after your largest meal can meaningfully blunt post-meal blood sugar spikes over time.",
    },
    {
      icon: Droplets,
      color: "#0ea5e9",
      title: "Stay ahead of hydration",
      text: "Mild, chronic under-hydration can subtly affect blood pressure readings. Aim for consistent water intake through the day rather than large amounts at once.",
    },
    {
      icon: Utensils,
      color: "#d97706",
      title: "Iron absorption tip",
      text: "Pairing iron-rich foods with vitamin C (like citrus or bell peppers) can improve absorption — useful given your recent hemoglobin trend.",
    },
    {
      icon: Moon,
      color: "#6366f1",
      title: "Sleep and cholesterol are linked",
      text: "Poor sleep consistency has been associated with higher LDL cholesterol. If your sleep schedule has been irregular lately, that's worth addressing too.",
    },
  ],
];

function Suggestions() {
  const [setIndex, setSetIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const suggestions = suggestionSets[setIndex];

  function regenerate() {
    setLoading(true);
    setTimeout(() => {
      setSetIndex((i) => (i + 1) % suggestionSets.length);
      setLoading(false);
    }, 600);
  }

  return (
    <>
      <div className="dash-page-head">
        <h1>Suggestions</h1>
        <p>Personalized suggestions based on your health data.</p>
      </div>

      <div className="sg-ai-card">
        <div className="sg-ai-head">
          <div className="sg-ai-title">
            <Sparkles size={17} strokeWidth={2.2} />
            Arovia AI Suggestions
            <span className="sg-ai-badge">AI-Generated</span>
          </div>
          <button
            className="sg-regenerate-btn"
            onClick={regenerate}
            disabled={loading}
          >
            <RefreshCcw
              size={13}
              strokeWidth={2}
              className={loading ? "spin" : ""}
            />
            {loading ? "Thinking..." : "Regenerate"}
          </button>
        </div>

        <p className="sg-ai-intro">
          Based on {currentUser.name}'s recent reports and trends, here's what
          Arovia AI suggests focusing on this month:
        </p>

        <div className="sg-list">
          {suggestions.map(({ icon: Icon, color, title, text }) => (
            <div className="sg-item" key={title}>
              <div className="sg-item-icon" style={{ background: color }}>
                <Icon size={16} strokeWidth={2.2} color="#fff" />
              </div>
              <div>
                <div className="sg-item-title">{title}</div>
                <p className="sg-item-text">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="ai-disclaimer-card">
        <Sparkles
          size={16}
          strokeWidth={2}
          style={{ flexShrink: 0, marginTop: 1 }}
        />
        <div>
          <strong>AI summary & disclaimer:</strong> These suggestions are
          generated from your recorded health data for general information only
          — they're not medical advice. Always confirm any lifestyle or
          treatment change with your doctor.
        </div>
      </div>
    </>
  );
}

export default Suggestions;
