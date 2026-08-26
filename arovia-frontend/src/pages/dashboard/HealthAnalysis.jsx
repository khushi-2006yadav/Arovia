import { Activity } from "lucide-react";

function HealthAnalysis() {
  return (
    <>
      <div className="dash-page-head">
        <h1>Health Analysis</h1>
        <p>A breakdown of your latest health parameters and trends.</p>
      </div>

      <div className="placeholder-card">
        <Activity size={28} strokeWidth={1.5} />
        <p>This page is coming soon — we'll build it out next.</p>
      </div>
    </>
  );
}

export default HealthAnalysis;
