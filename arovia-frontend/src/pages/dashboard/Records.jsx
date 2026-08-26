import { FileText, Image, Stethoscope, Pill } from "lucide-react";
import { records } from "../../data/mockData";

const typeIcons = {
  "Lab Report": FileText,
  Imaging: Image,
  Consultation: Stethoscope,
  Prescription: Pill,
};

function Records() {
  return (
    <>
      <div className="dash-page-head">
        <h1>My Records</h1>
        <p>All your medical documents, organized in one place.</p>
      </div>

      <div className="records-list">
        {records.map((r) => {
          const Icon = typeIcons[r.type] || FileText;
          return (
            <div className="record-row" key={r.id}>
              <span className="icon">
                <Icon size={17} strokeWidth={2} />
              </span>
              <div className="info">
                <div className="title">{r.title}</div>
                <div className="meta">
                  {r.type} · {r.date}
                </div>
              </div>
              <span className={`tag ${r.tag}`}>
                {r.tag === "normal" && "Normal"}
                {r.tag === "mild" && "Slightly Low"}
                {r.tag === "flagged" && "Needs Attention"}
                {r.tag === "neutral" && "Note"}
              </span>
              <button className="view-btn">View</button>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default Records;
