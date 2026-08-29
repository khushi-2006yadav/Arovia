import { Link } from "react-router-dom";
import logo from "../assets/logo1.png";
import previewOverview from "../assets/screenshots/screenshot-overview.png";
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
} from "lucide-react";

function Home() {
  return (
    <>
      <div className="topbar">
        <div className="item">
          <Lock size={12} strokeWidth={2} /> Secure Medical Records
        </div>
        <div className="item">
          <Sparkles size={12} strokeWidth={2} /> AI-Assisted Health Insights
        </div>
        <div className="item">
          <Phone size={12} strokeWidth={2} /> Support: +91 62017 83336
        </div>
      </div>

      <nav className="navbar">
        <div className="brand">
          <div className="logo-icon">
            <img src={logo} alt="Arovia logo" className="logo-img" />
          </div>
          <div className="brand-text">
            <div className="name">AROVIA</div>
            <div className="tagline">Understand. Track. Care.</div>
          </div>
        </div>
        <div className="nav-links">
          <a href="#">HOME</a>
          <a href="#">FEATURES</a>
          <a href="#">ABOUT</a>
        </div>
        <div className="nav-actions">
          <Link to="/login" className="btn-login">
            LOGIN
          </Link>
          <Link to="/signup" className="btn-primary">Get Started</Link>
        </div>
      </nav>

      <section className="hero">
        <div>
          <div className="eyebrow">
            A SMARTER WAY TO
            <br />
            MANAGE YOUR HEALTH
          </div>
          <h1>
            Your Health.
            <br />
            <span className="accent">One Secure Place.</span>
          </h1>
          <div className="subtext">
            <p>
              <strong>Understand</strong> your medical reports.
            </p>
            <p>
              <strong>Track</strong> your health journey.
            </p>
            <p>
              <strong>Care</strong> for your health with confidence.
            </p>
          </div>
          <Link to="/signup" className="btn-cta">GET STARTED →</Link>
        </div>

        <div className="preview-card">
          <img
            src={previewOverview}
            alt="Arovia dashboard overview showing health snapshot, quick actions, and profile details"
            className="preview-screenshot"
          />
        </div>
      </section>

      <div className="trustbar">
        <div className="trustbar-inner">
          <div className="item">
            <FileText size={14} strokeWidth={2} /> Organized Records
          </div>
          <div className="item">
            <Sparkles size={14} strokeWidth={2} /> AI-Assisted
          </div>
          <div className="item">
            <CircleCheck size={14} strokeWidth={2} /> Human Verified
          </div>
        </div>
      </div>

      {/* ---------- Why Arovia ---------- */}
      <section className="why-section">
        <div className="why-top">
          <div>
            <div className="section-label">Why Arovia</div>
            <h2 className="section-heading">
              Medical information shouldn't be difficult to understand.
            </h2>
          </div>
          <p className="section-text">
            AROVIA brings your medical records, AI-powered insights and
            affordable medicine information together, so you can make informed
            decisions about your health.
          </p>
        </div>

        <div className="feature-grid">
          <div className="feature-card">
            <div className="feature-icon blue">
              <Download size={20} strokeWidth={2} />
            </div>
            <h4 className="underline-blue">One Health Record</h4>
            <p>
              Keep prescriptions, lab reports and medical documents organized in
              one place.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon purple">
              <Brain size={20} strokeWidth={2} />
            </div>
            <h4 className="underline-purple">Understand your reports</h4>
            <p>
              AI helps simplify complex medical information into
              easy-to-understand insights.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon green">
              <Pill size={20} strokeWidth={2} />
            </div>
            <h4 className="underline-green">Discover Affordable Options</h4>
            <p>
              Explore potential generic alternatives using trusted medicine
              information.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon navy">
              <ShieldCheck size={20} strokeWidth={2} />
            </div>
            <h4 className="underline-navy">You stay in Control</h4>
            <p>
              Review, edit and manage your health information with full control
              over your data.
            </p>
          </div>
        </div>
      </section>

      {/* ---------- Health Timeline ---------- */}
      <section className="timeline-section">
        <div className="split-section">
          <div>
            <div className="section-label">Your Health Timeline</div>
            <h2 className="section-heading">
              All your medical records.
              <br />
              In one timeline.
            </h2>
            <p className="section-text" style={{ marginTop: "18px" }}>
              AROVIA organizes your medical history so you can see reports,
              consultations and prescriptions over time instead of searching
              through individual documents.
            </p>
            <Link to="/login" className="link-btn">Explore Timeline →</Link>
          </div>

          <div className="timeline-card">
            <div className="timeline-card-head">
              <h4>Health History</h4>
              <span>View Calendar</span>
            </div>
            <div className="timeline-sub">
              Your medical journey at a glance.
            </div>

            <div className="timeline-item">
              <div className="timeline-dot normal">
                <FlaskConical size={13} strokeWidth={2} />
              </div>
              <div className="timeline-body">
                <div className="timeline-date">JAN 2026 · 08 · Wed</div>
                <div className="timeline-title">Blood Test</div>
                <div className="timeline-sub-detail">Hemoglobin: 11.2 g/dL</div>
                <div className="timeline-meta">
                  <span className="timeline-tag normal">Normal</span>
                  <span className="timeline-action">View Report ›</span>
                </div>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-dot neutral">
                <Stethoscope size={13} strokeWidth={2} />
              </div>
              <div className="timeline-body">
                <div className="timeline-date">MAR 2026 · 12 · Thu</div>
                <div className="timeline-title">Doctor Consultation</div>
                <div className="timeline-sub-detail">Prescription added</div>
                <div className="timeline-meta">
                  <span className="timeline-tag neutral">
                    General Physician
                  </span>
                  <span className="timeline-action">View Details ›</span>
                </div>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-dot normal">
                <FlaskConical size={13} strokeWidth={2} />
              </div>
              <div className="timeline-body">
                <div className="timeline-date">JUN 2026 · 18 · Wed</div>
                <div className="timeline-title">Blood Test</div>
                <div className="timeline-sub-detail">Hemoglobin: 10.8 g/dL</div>
                <div className="timeline-meta">
                  <span className="timeline-tag flagged-mild">
                    Slightly Low
                  </span>
                  <span className="timeline-action">View Report ›</span>
                </div>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-dot flagged">
                <AlertTriangle size={13} strokeWidth={2} />
              </div>
              <div className="timeline-body">
                <div className="timeline-date">AUG 2026 · 21 · Fri</div>
                <div className="timeline-title">Blood Test</div>
                <div className="timeline-sub-detail">Hemoglobin: 10.2 g/dL</div>
                <div className="timeline-meta">
                  <span className="timeline-tag flagged">Change detected</span>
                  <span className="timeline-action">View Report ›</span>
                </div>
              </div>
            </div>

            <div className="timeline-more">Show more ⌄</div>
          </div>
        </div>
      </section>

      {/* ---------- AI Health Insights ---------- */}
      <section className="ai-section">
        <div className="split-section">
          <div className="ai-card ai-card-screenshot">
            <img
              src={previewSuggestions}
              alt="Arovia AI Suggestions panel showing personalized, AI-generated health recommendations"
              className="preview-screenshot"
            />
          </div>

          <div>
            <div className="section-label">AI Health Insights</div>
            <h2 className="section-heading">
              Complex Reports.
              <br />
              <span className="accent">Simple Explanations.</span>
            </h2>
            <p className="section-text" style={{ marginTop: "18px" }}>
              AROVIA helps turn complex medical reports into simple,
              understandable insights, so you can better understand what your
              results may mean.
            </p>
            <Link to="/login" className="link-btn">Understand my Report →</Link>
          </div>
        </div>
      </section>

      {/* ---------- CTA ---------- */}
      <section className="cta-section">
        <div className="section-label">Ready to take control?</div>
        <h2 className="section-heading">Understand. Track. Care.</h2>
        <p className="section-text">
          One place for your medical records, insights and medicine information.
        </p>
        <Link to="/signup" className="cta-btn">Create your Free Account →</Link>
      </section>

      {/* ---------- Footer ---------- */}
      <footer className="footer">
        <div className="footer-top">
          <div>
            <div className="footer-brand">
              <img
                src={logo}
                alt="Arovia logo"
                style={{ width: 26, height: 26 }}
              />
              <div>
                <div className="name">AROVIA</div>
                <div className="tagline">Understand. Track. Care.</div>
              </div>
            </div>
            <p className="footer-desc">
              A digital health platform designed to make medical information
              easier to manage and understand.
            </p>
            <div className="footer-social">
              <span>f</span>
              <span>𝕏</span>
              <span>ig</span>
              <span>in</span>
            </div>
          </div>

          <div className="footer-col">
            <h5>Product</h5>
            <a href="#">Medical Records</a>
            <a href="#">Health Insights</a>
            <a href="#">Medicine Options</a>
            <a href="#">Health Timeline</a>
          </div>

          <div className="footer-col">
            <h5>Resources</h5>
            <a href="#">About Arovia</a>
            <a href="#">Features</a>
            <a href="#">FAQ</a>
            <a href="#">Contact</a>
          </div>

          <div className="footer-col">
            <h5>Legal</h5>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Medical Disclaimer</a>
          </div>

          <div className="footer-col">
            <h5>Support</h5>
            <a href="#">+91 62017 83336</a>
            <a href="#">support@arovia.health</a>
            <a href="#">Help Centre</a>
          </div>
        </div>

        <div className="footer-bottom">© 2026 AROVIA. All Rights Reserved.</div>
      </footer>
    </>
  );
}

export default Home;
