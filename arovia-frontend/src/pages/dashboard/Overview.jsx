import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Sun,
  ArrowUp,
  Gauge,
  ShieldAlert,
  FileText,
  Pill,
  Clock,
  Settings as SettingsIcon,
} from "lucide-react";
import { useArovia } from "../../context";
import { medicationItems, snapshotTrends } from "../../data/healthUtils";
import UserDetails from "./UserDetails";
import HealthAnalysis from "./HealthAnalysis";
import Comparison from "./Comparison";
import Suggestions from "./Suggestions";

const sections = [
  {
    id: "user-details",
    label: "User Details",
    desc: "Profile & vitals",
    tint: "blue",
    Component: UserDetails,
  },
  {
    id: "health-analysis",
    label: "Health Analysis",
    desc: "Trends over time",
    tint: "coral",
    Component: HealthAnalysis,
  },
  {
    id: "comparison",
    label: "Comparison",
    desc: "Vs. healthy range",
    tint: "purple",
    Component: Comparison,
  },
  {
    id: "suggestions",
    label: "Suggestions",
    desc: "AI recommendations",
    tint: "amber",
    Component: Suggestions,
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
  const { user, snapshot, records } = useArovia();
  const sectionRefs = useRef({});
  const [activeId, setActiveId] = useState(sections[0].id);
  const activeIndex = Math.max(
    sections.findIndex((s) => s.id === activeId),
    0,
  );

  const scrollToSection = (id) => {
    sectionRefs.current[id]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const factorSeries = snapshotTrends(snapshot);
  const activeMedsCount = medicationItems(records).filter((m) => m.status === "active").length;
  const todayLabel = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

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
        <div className="ov-header-row">
          <div className="dash-page-head">
            <h1>
              Good Morning, {user?.name || "there"}!{" "}
              <Sun className="dash-heading-icon" size={32} strokeWidth={2.2} />
            </h1>
            <p>Here's your health overview.</p>
          </div>

          <div className="dash-today-card tint-blue">
            <div className="dash-today-date">{todayLabel}</div>
            <div className="dash-today-sub">
              Profile updated {user?.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : "—"}
            </div>
          </div>
        </div>

        <div className="action-grid ov-quick-actions">
          <Link to="/dashboard/timeline" className="action-card tint-blue">
            <div className="icon blue">
              <Clock size={16} strokeWidth={2.2} />
            </div>
            <div className="label">Report Timeline</div>
            <div className="sub">Your medical journey</div>
          </Link>
          <Link to="/dashboard/medicines" className="action-card tint-green">
            <div className="icon green">
              <Pill size={16} strokeWidth={2.2} />
            </div>
            <div className="label">Medicines</div>
            <div className="sub">Doses & refills</div>
          </Link>
          <Link to="/dashboard/records" className="action-card tint-purple">
            <div className="icon purple">
              <FileText size={16} strokeWidth={2.2} />
            </div>
            <div className="label">My Records</div>
            <div className="sub">Reports & scans</div>
          </Link>
          <Link to="/dashboard/settings" className="action-card tint-amber">
            <div className="icon amber">
              <SettingsIcon size={16} strokeWidth={2.2} />
            </div>
            <div className="label">Settings</div>
            <div className="sub">Profile & alerts</div>
          </Link>
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
        <div className="dash-bookmarks-title">On This Page</div>

        <div className="dash-bookmarks-rail">
          <div className="dash-bookmarks-rail-track" />
          <div
            className="dash-bookmarks-rail-fill"
            style={{
              height: `${
                (activeIndex / Math.max(sections.length - 1, 1)) * 100
              }%`,
            }}
          />
          <div className="dash-bookmarks-list">
            {sections.map(({ id, label, desc, tint }, i) => (
              <button
                key={id}
                className={
                  "dash-bookmark-item" +
                  ` tint-${tint}` +
                  (activeId === id ? " active" : "")
                }
                onClick={() => scrollToSection(id)}
              >
                <span className="dash-bookmark-badge">{badgeSvgs[id]}</span>
                <span className="dash-bookmark-text">
                  <span className="dash-bookmark-label">{label}</span>
                  <span className="dash-bookmark-desc">{desc}</span>
                </span>
                <span className="dash-bookmark-index">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="dash-bookmarks-divider" />

        <div className="dash-side-title">
          <Gauge size={13} strokeWidth={2.2} /> Quick Snapshot
        </div>
        <div className="dash-snapshot-grid">
          <div className="dash-snapshot-stat tint-green">
            <div className="num">
              {factorSeries.length}
            </div>
            <div className="label">Tracked metrics</div>
          </div>
          <div className="dash-snapshot-stat tint-blue">
            <div className="num">{activeMedsCount}</div>
            <div className="label">Active medicines</div>
          </div>
          <div className="dash-snapshot-stat tint-purple">
            <div className="num">{records.length}</div>
            <div className="label">Records on file</div>
          </div>
        </div>

        <div className="dash-side-links">
          <Link to="/dashboard/records" className="dash-side-link">
            <FileText size={13} strokeWidth={2.2} /> View records
          </Link>
          <Link to="/dashboard/medicines" className="dash-side-link">
            <Pill size={13} strokeWidth={2.2} /> View medicines
          </Link>
        </div>

        <div className="dash-bookmarks-divider" />

        <div className="dash-side-title">
          <ShieldAlert size={13} strokeWidth={2.2} /> Emergency Info
        </div>
        <div className="dash-side-emg">
          <div className="dash-side-emg-row">
            <span className="label">Blood Group</span>
            <span className="value">{user?.bloodGroup || "—"}</span>
          </div>
          <div className="dash-side-emg-row wrap">
            <span className="label">Allergies</span>
          </div>
          <div className="dash-side-emg-chips">
            {(user?.pastChronicDiseases || []).map((a) => (
              <span className="ud-chip red" key={a}>
                {a}
              </span>
            ))}
          </div>
        </div>

        {activeId !== sections[0].id && (
          <button
            className="dash-bookmarks-top"
            onClick={() => scrollToSection(sections[0].id)}
          >
            <ArrowUp size={13} strokeWidth={2.4} />
            Back to top
          </button>
        )}
      </aside>
    </div>
  );
}

export default Overview;
