import { useEffect, useRef, useState } from "react";
import { Sun } from "lucide-react";
import { currentUser } from "../../data/mockData";
import UserDetails from "./UserDetails";
import HealthAnalysis from "./HealthAnalysis";
import Comparison from "./Comparison";
import Suggestions from "./Suggestions";

const sections = [
  { id: "user-details", label: "User Details", Component: UserDetails },
  {
    id: "health-analysis",
    label: "Health Analysis",
    Component: HealthAnalysis,
  },
  { id: "comparison", label: "Comparison", Component: Comparison },
  { id: "suggestions", label: "Suggestions", Component: Suggestions },
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
  const sectionRefs = useRef({});
  const [activeId, setActiveId] = useState(sections[0].id);

  const scrollToSection = (id) => {
    sectionRefs.current[id]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  // Scroll-spy: highlight whichever bookmark matches the section currently in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible.length > 0) {
          setActiveId(visible[0].target.dataset.sectionId);
        }
      },
      { rootMargin: "-120px 0px -55% 0px", threshold: [0.1, 0.25, 0.5, 0.75] },
    );

    sections.forEach(({ id }) => {
      const el = sectionRefs.current[id];
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="dash-scroll-shell">
      <div className="dash-scroll-main">
        <div className="dash-page-head">
          <h1>
            Good Morning, {currentUser.name}!{" "}
            <Sun className="dash-heading-icon" size={32} strokeWidth={2.2} />
          </h1>
          <p>Here's your health overview.</p>
        </div>

        {sections.map(({ id, Component }) => (
          <section
            key={id}
            id={id}
            data-section-id={id}
            ref={(el) => (sectionRefs.current[id] = el)}
            className="dash-scroll-section"
          >
            <Component />
          </section>
        ))}
      </div>

      <aside className="dash-bookmarks">
        <div className="dash-bookmarks-title">Bookmarks</div>
        <div className="dash-bookmarks-list">
          {sections.map(({ id, label }) => (
            <button
              key={id}
              className={
                "dash-bookmark-item" + (activeId === id ? " active" : "")
              }
              onClick={() => scrollToSection(id)}
            >
              <span className="dash-bookmark-badge">{badgeSvgs[id]}</span>
              <span>{label}</span>
            </button>
          ))}
        </div>
      </aside>
    </div>
  );
}

export default Overview;
