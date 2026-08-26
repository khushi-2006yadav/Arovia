import { Lightbulb } from "lucide-react";

function Suggestions() {
  return (
    <>
      <div className="dash-page-head">
        <h1>Suggestions</h1>
        <p>Personalized suggestions based on your health data.</p>
      </div>

      <div className="placeholder-card">
        <Lightbulb size={28} strokeWidth={1.5} />
        <p>This page is coming soon — we'll build it out next.</p>
      </div>
    </>
  );
}

export default Suggestions;
