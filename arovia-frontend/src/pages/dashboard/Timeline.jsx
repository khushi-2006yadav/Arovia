import { FlaskConical, Stethoscope, AlertTriangle, HeartPulse } from "lucide-react";
import { timelineFull } from "../../data/mockData";

const iconFor = (title) => {
  if (title.toLowerCase().includes("blood")) return FlaskConical;
  if (title.toLowerCase().includes("consult")) return Stethoscope;
  if (title.toLowerCase().includes("ecg")) return HeartPulse;
  return AlertTriangle;
};

function Timeline() {
  return (
    <>
      <div className="dash-page-head">
        <h1>Health Timeline</h1>
        <p>Your medical journey at a glance.</p>
      </div>

      <div className="timeline-full-card">
        {timelineFull.map((item) => {
          const Icon = iconFor(item.title);
          return (
            <div className="timeline-item" key={item.id}>
              <div className={`timeline-dot ${item.tagType}`}>
                <Icon size={16} strokeWidth={2} />
              </div>
              <div>
                <div className="timeline-date">{item.date}</div>
                <div className="timeline-title">{item.title}</div>
                <div className="timeline-detail">{item.detail}</div>
                <span className={`tag ${item.tagType}`}>{item.tag}</span>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default Timeline;
