import { useState } from "react";
import { Link } from "react-router-dom";
import "./home.css";

import logo from "../assets/logo1.png";
import previewOverview from "../assets/screenshots/screenshot-overview.png";
import previewUserDetails from "../assets/screenshots/screenshot-user-details.png";
import previewHealthAnalysis from "../assets/screenshots/screenshot-health-analysis-card.png";
import previewComparison from "../assets/screenshots/screenshot-comparison.png";
import previewSuggestions from "../assets/screenshots/screenshot-suggestions.png";

import {
  Download,
  Brain,
  Pill,
  ShieldCheck,
  FlaskConical,
  Stethoscope,
  AlertTriangle,
  Lock,
  Sparkles,
  Phone,
  CircleCheck,
  FileText,
  TrendingUp,
} from "lucide-react";

const TOUR_TABS = [
  {
    num: "01",
    title: "User Details",
    sub: "Profile & vitals",
    img: previewUserDetails,
    alt: "Arovia user profile card with blood group and allergy details",
  },
  {
    num: "02",
    title: "Health Analysis",
    sub: "Trends over time",
    img: previewHealthAnalysis,
    alt: "Arovia health analysis chart tracking blood pressure over eight months",
  },
  {
    num: "03",
    title: "Comparison",
    sub: "Vs. healthy range",
    img: previewComparison,
    alt: "Arovia comparison view showing hemoglobin and blood sugar against healthy reference ranges",
  },
  {
    num: "04",
    title: "Suggestions",
    sub: "AI recommendations",
    img: previewSuggestions,
    alt: "Arovia AI suggestions panel with personalized health recommendations",
  },
];

function Home() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="lp-root">
      <div className="lp-topbar">
        <div className="lp-topbar-item">
          <Lock size={12} strokeWidth={2} /> Secure Medical Records
        </div>
        <div className="lp-topbar-item">
          <Sparkles size={12} strokeWidth={2} /> AI-Assisted Health Insights
        </div>
        <div className="lp-topbar-item">
          <Phone size={12} strokeWidth={2} /> Support: +91 62017 83336
        </div>
      </div>

      <nav className="lp-navbar">
        <Link to="/" className="lp-brand">
          <img src={logo} alt="Arovia logo" className="lp-logo-img" />
          <div>
            <div className="lp-brand-name">AROVIA</div>
            <div className="lp-brand-tag">Understand. Track. Care.</div>
          </div>
        </Link>
        <div className="lp-nav-links">
          <a href="#top">Home</a>
          <a href="#features">Features</a>
          <a href="#tour">Product Tour</a>
        </div>
        <div className="lp-nav-actions">
          <Link to="/login" className="lp-btn-ghost">
            Log in
          </Link>
          <Link to="/signup" className="lp-btn-primary">
            Get Started
          </Link>
        </div>
      </nav>

      {/* ---------- Hero ---------- */}
      <section className="lp-hero" id="top">
        <div className="lp-animate">
          <span className="lp-eyebrow">
            A smarter way to manage your health
          </span>
          <h1>
            Your health.
            <br />
            <span className="lp-accent">One secure place.</span>
          </h1>
          <p className="lp-hero-sub">
            AROVIA turns scattered prescriptions, lab reports and consultations
            into one organized record — with AI that helps you understand what
            your numbers actually mean.
          </p>
          <span className="lp-pulse" />
          <div className="lp-hero-actions">
            <Link to="/signup" className="lp-btn-cta">
              Get Started →
            </Link>
            <span className="lp-hero-note">Free to start · No credit card</span>
          </div>
        </div>

        <div
          className="lp-hero-visual lp-animate"
          style={{ animationDelay: "0.1s" }}
        >
          <div className="lp-hero-frame">
            <img
              src={previewOverview}
              alt="Arovia dashboard overview showing health snapshot, quick actions, and profile details"
            />
          </div>
          <div className="lp-hero-chip lp-hero-chip-1">
            <span className="lp-dot" /> 4/5 metrics in range
          </div>
          <div className="lp-hero-chip lp-hero-chip-2">
            <TrendingUp size={14} strokeWidth={2.4} /> Hemoglobin trending up
          </div>
        </div>
      </section>

      <div className="lp-trustbar">
        <div className="lp-trustbar-inner">
          <div className="lp-item">
            <FileText size={14} strokeWidth={2} /> Organized Records
          </div>
          <div className="lp-item">
            <Sparkles size={14} strokeWidth={2} /> AI-Assisted
          </div>
          <div className="lp-item">
            <CircleCheck size={14} strokeWidth={2} /> Human Verified
          </div>
        </div>
      </div>

      {/* ---------- Why Arovia ---------- */}
      <section className="lp-section" id="features">
        <div className="lp-why-top">
          <div>
            <div className="lp-section-label">Why Arovia</div>
            <h2 className="lp-section-heading">
              Medical information shouldn't be difficult to understand.
            </h2>
            <span className="lp-pulse" />
          </div>
          <p className="lp-section-text">
            AROVIA brings your medical records, AI-powered insights and
            affordable medicine information together, so you can make informed
            decisions about your health.
          </p>
        </div>

        <div className="lp-feature-grid">
          <div className="lp-feature-card">
            <div className="lp-feature-icon blue">
              <Download size={20} strokeWidth={2} />
            </div>
            <h4>One Health Record</h4>
            <p>
              Keep prescriptions, lab reports and medical documents organized in
              one place.
            </p>
          </div>
          <div className="lp-feature-card">
            <div className="lp-feature-icon plum">
              <Brain size={20} strokeWidth={2} />
            </div>
            <h4>Understand your reports</h4>
            <p>
              AI helps simplify complex medical information into
              easy-to-understand insights.
            </p>
          </div>
          <div className="lp-feature-card">
            <div className="lp-feature-icon gold">
              <Pill size={20} strokeWidth={2} />
            </div>
            <h4>Discover affordable options</h4>
            <p>
              Explore potential generic alternatives using trusted medicine
              information.
            </p>
          </div>
          <div className="lp-feature-card">
            <div className="lp-feature-icon sky">
              <ShieldCheck size={20} strokeWidth={2} />
            </div>
            <h4>You stay in control</h4>
            <p>
              Review, edit and manage your health information with full control
              over your data.
            </p>
          </div>
        </div>
      </section>

      {/* ---------- Product tour, mirrors the dashboard's own numbered nav ---------- */}
      <section className="lp-tour" id="tour">
        <div className="lp-section">
          <div className="lp-tour-inner">
            <div>
              <div className="lp-section-label">See it in action</div>
              <h2 className="lp-section-heading">
                Four views into your health,
                <br />
                right where the dashboard has them.
              </h2>
              <p className="lp-section-text" style={{ marginTop: 14 }}>
                These are the same four sections you'll see the moment you log
                in — pick one to preview it.
              </p>

              <div className="lp-tour-tabs">
                {TOUR_TABS.map((tab, i) => (
                  <button
                    key={tab.num}
                    className={`lp-tour-tab${i === activeTab ? " active" : ""}`}
                    onClick={() => setActiveTab(i)}
                  >
                    <span className="lp-tour-num">{tab.num}</span>
                    <span>
                      <span className="lp-tour-tab-title">{tab.title}</span>
                      <div className="lp-tour-tab-sub">{tab.sub}</div>
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="lp-tour-visual">
              <img
                src={TOUR_TABS[activeTab].img}
                alt={TOUR_TABS[activeTab].alt}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Health Timeline ---------- */}
      <section className="lp-section">
        <div className="lp-split">
          <div>
            <div className="lp-section-label">Your Health Timeline</div>
            <h2 className="lp-section-heading">
              All your medical records.
              <br />
              In one timeline.
            </h2>
            <span className="lp-pulse" />
            <p className="lp-section-text" style={{ marginTop: 18 }}>
              AROVIA organizes your medical history so you can see reports,
              consultations and prescriptions over time instead of searching
              through individual documents.
            </p>
            <Link to="/login" className="lp-link-btn">
              Explore Timeline →
            </Link>
          </div>

          <div className="lp-timeline-card">
            <div className="lp-timeline-head">
              <h4>Health History</h4>
              <span>View Calendar</span>
            </div>
            <div className="lp-timeline-sub">
              Your medical journey at a glance.
            </div>

            <div className="lp-t-item">
              <div className="lp-t-dot normal">
                <FlaskConical size={14} strokeWidth={2} />
              </div>
              <div>
                <div className="lp-t-date">JAN 2026 · 08 · WED</div>
                <div className="lp-t-title">Blood Test</div>
                <div className="lp-t-detail">Hemoglobin: 11.2 g/dL</div>
                <span className="lp-t-tag normal">Normal</span>
              </div>
            </div>

            <div className="lp-t-item">
              <div className="lp-t-dot neutral">
                <Stethoscope size={14} strokeWidth={2} />
              </div>
              <div>
                <div className="lp-t-date">MAR 2026 · 12 · THU</div>
                <div className="lp-t-title">Doctor Consultation</div>
                <div className="lp-t-detail">Prescription added</div>
                <span className="lp-t-tag neutral">General Physician</span>
              </div>
            </div>

            <div className="lp-t-item">
              <div className="lp-t-dot flagged">
                <AlertTriangle size={14} strokeWidth={2} />
              </div>
              <div>
                <div className="lp-t-date">AUG 2026 · 21 · FRI</div>
                <div className="lp-t-title">Blood Test</div>
                <div className="lp-t-detail">Hemoglobin: 10.2 g/dL</div>
                <span className="lp-t-tag flagged">Change detected</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- CTA ---------- */}
      <section className="lp-cta-section">
        <div className="lp-section-label">Ready to take control?</div>
        <h2 className="lp-section-heading">Understand. Track. Care.</h2>
        <span className="lp-pulse lp-pulse-light" />
        <p className="lp-section-text">
          One place for your medical records, insights and medicine information.
        </p>
        <Link to="/signup" className="lp-cta-btn">
          Create your Free Account →
        </Link>
      </section>

      {/* ---------- Footer ---------- */}
      <footer className="lp-footer">
        <div className="lp-footer-top">
          <div>
            <div className="lp-footer-brand">
              <img
                src={logo}
                alt="Arovia logo"
                style={{ width: 26, height: 26 }}
              />
              <div>
                <div className="lp-brand-name">AROVIA</div>
                <div className="lp-brand-tag">Understand. Track. Care.</div>
              </div>
            </div>
            <p className="lp-footer-desc">
              A digital health platform designed to make medical information
              easier to manage and understand.
            </p>
            <div className="lp-footer-social">
              <span>f</span>
              <span>𝕏</span>
              <span>ig</span>
              <span>in</span>
            </div>
          </div>

          <div className="lp-footer-col">
            <h5>Product</h5>
            <a href="#features">Medical Records</a>
            <a href="#tour">Health Insights</a>
            <a href="#tour">Medicine Options</a>
            <a href="#">Health Timeline</a>
          </div>

          <div className="lp-footer-col">
            <h5>Resources</h5>
            <a href="#">About Arovia</a>
            <a href="#features">Features</a>
            <a href="#">FAQ</a>
            <a href="#">Contact</a>
          </div>

          <div className="lp-footer-col">
            <h5>Support</h5>
            <a href="tel:+916201783336">+91 62017 83336</a>
            <a href="mailto:support@arovia.health">support@arovia.health</a>
            <a href="#">Help Centre</a>
          </div>
        </div>

        <div className="lp-footer-bottom">
          © 2026 AROVIA. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
}

export default Home;
