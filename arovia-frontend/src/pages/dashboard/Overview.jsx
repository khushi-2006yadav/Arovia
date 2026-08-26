import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { currentUser } from "../../data/mockData";

const options = [
  {
    id: "user-details",
    title: "User Details",
    desc: "View and manage your personal and medical profile information.",
    to: "/dashboard/user-details",
  },
  {
    id: "health-analysis",
    title: "Health Analysis",
    desc: "A breakdown of your latest health parameters and trends.",
    to: "/dashboard/health-analysis",
  },
  {
    id: "comparison",
    title: "Comparison to Healthy Person",
    desc: "See how your reports compare against healthy reference ranges.",
    to: "/dashboard/comparison",
  },
  {
    id: "suggestions",
    title: "Suggestions",
    desc: "Personalized suggestions based on your health data.",
    to: "/dashboard/suggestions",
  },
];

const badgeSvgs = {
  "user-details": (
    <svg viewBox="0 0 40 40" className="option-badge-svg badge-user">
      <circle cx="20" cy="14" r="7" className="badge-path badge-head" />
      <path
        d="M6 34c0-8 6-13 14-13s14 5 14 13"
        className="badge-path badge-body"
      />
    </svg>
  ),
  "health-analysis": (
    <svg viewBox="0 0 40 40" className="option-badge-svg badge-heart">
      <path
        d="M4 21 L12 21 L15 12 L20 30 L24 17 L27 21 L36 21"
        className="badge-path badge-pulse"
      />
    </svg>
  ),
  comparison: (
    <svg viewBox="0 0 40 40" className="option-badge-svg badge-bars">
      <rect x="6" y="22" width="6" height="12" className="badge-bar bar-1" />
      <rect x="17" y="14" width="6" height="20" className="badge-bar bar-2" />
      <rect x="28" y="6" width="6" height="28" className="badge-bar bar-3" />
    </svg>
  ),
  suggestions: (
    <svg viewBox="0 0 40 40" className="option-badge-svg badge-bulb">
      <circle cx="20" cy="16" r="9" className="badge-path badge-bulb-glow" />
      <path
        d="M16 30 L24 30 M17 34 L23 34"
        className="badge-path badge-bulb-base"
      />
      <path
        d="M20 3 V6 M32 8 L30 10 M37 20 H34 M8 20 H5 M10 10 L8 8"
        className="badge-path badge-rays"
      />
    </svg>
  ),
};

function Overview() {
  const navigate = useNavigate();

  return (
    <>
      <div className="dash-page-head">
        <h1>Good Morning, {currentUser.name}! 👋</h1>
        <p>Here's your health overview.</p>
      </div>

      <div className="dashboard-options-grid">
        {options.map(({ id, title, desc, to }) => (
          <div
            className="dashboard-option-card"
            key={id}
            onClick={() => navigate(to)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && navigate(to)}
          >
            <div className="dashboard-option-image-wrap">
              <div className="option-badge-large">{badgeSvgs[id]}</div>
            </div>

            <div className="dashboard-option-content">
              <div className="dashboard-option-title">{title}</div>
              <p className="dashboard-option-desc">{desc}</p>
              <span className="dashboard-option-link">
                Open <ArrowRight size={14} strokeWidth={2} />
              </span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default Overview;
