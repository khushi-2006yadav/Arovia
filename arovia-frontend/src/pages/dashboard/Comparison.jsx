import { Users } from "lucide-react";

function Comparison() {
  return (
    <>
      <div className="dash-page-head">
        <h1>Comparison to Healthy Person</h1>
        <p>See how your reports compare against healthy reference ranges.</p>
      </div>

      <div className="placeholder-card">
        <Users size={28} strokeWidth={1.5} />
        <p>This page is coming soon — we'll build it out next.</p>
      </div>
    </>
  );
}

export default Comparison;
