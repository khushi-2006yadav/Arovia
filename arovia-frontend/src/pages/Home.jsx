import { Link } from "react-router-dom";
import logo from "../assets/logo1.png";
import {
  Download,
  Brain,
  Pill,
  ShieldCheck,
  FlaskConical,
  Stethoscope,
  AlertTriangle,
} from "lucide-react";

function Home() {
  return (
    <>
      <div className="topbar">
        <div className="item">🔒 Secure Medical Records</div>
        <div className="item">✦ AI-Assisted Health Insights</div>
        <div className="item">📞 Support: +91 62017 83336</div>
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
          <button className="btn-primary">Get Started</button>
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
          <button className="btn-cta">GET STARTED →</button>
        </div>

        <div className="preview-card">
          <div className="preview-inner">
            {/* Sidebar */}
            <div className="side-panel">
              <div className="side-brand">
                <img src={logo} alt="Arovia logo" className="side-logo-img" />
                <div>
                  <div className="name">AROVIA</div>
                  <div className="tag">Understand. Track. Care.</div>
                </div>
              </div>
              <div className="side-item active">🏠 Dashboard</div>
              <div className="side-item">📋 My Records</div>
              <div className="side-item">💊 Medicines</div>
              <div className="side-item">📈 Insights</div>
              <div className="side-item">🕐 Health Timeline</div>
              <div className="side-item">💳 Emergency Card</div>
              <div className="side-item">⚙️ Settings</div>
            </div>

            {/* Center */}
            <div className="center-col">
              <div className="search-bar">
                🔍 Search reports, medicines, or insights...
              </div>

              <div className="greeting">
                <div className="title">Good Morning, Nandani! 👋</div>
                <div className="sub">Here's your health overview.</div>
              </div>

              <div className="stat-grid">
                <div className="stat-card blue">
                  <div className="stat-icon blue">📄</div>
                  <div className="num c-blue">12</div>
                  <div className="label">Medical Records</div>
                </div>
                <div className="stat-card green">
                  <div className="stat-icon green">💊</div>
                  <div className="num c-green">4</div>
                  <div className="label">Active Medicines</div>
                </div>
                <div className="stat-card purple">
                  <div className="stat-icon purple">💜</div>
                  <div className="num c-purple">8</div>
                  <div className="label">Normal Parameters</div>
                </div>
                <div className="stat-card red">
                  <div className="stat-icon red">⚠️</div>
                  <div className="num c-red">2</div>
                  <div className="label">Need Attention</div>
                </div>
              </div>

              <div className="chart-card">
                <div className="chart-head">
                  <div className="chart-title">Health Trends</div>
                  <div className="chart-select">Hemoglobin ▾</div>
                </div>
                <div className="chart-sub">
                  Track your important health parameters over time.
                </div>
                <svg
                  viewBox="0 0 260 60"
                  width="100%"
                  height="50"
                  style={{ overflow: "visible" }}
                >
                  <defs>
                    <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="0%"
                        stopColor="#38bdf8"
                        stopOpacity="0.35"
                      />
                      <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <polygon
                    points="0,20 35,10 70,22 105,6 140,18 175,10 210,20 245,4 245,60 0,60"
                    fill="url(#chartFill)"
                  />
                  <polyline
                    points="0,20 35,10 70,22 105,6 140,18 175,10 210,20 245,4"
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="1.5"
                  />
                  <circle cx="0" cy="20" r="2" fill="#38bdf8" />
                  <circle cx="35" cy="10" r="2" fill="#38bdf8" />
                  <circle cx="70" cy="22" r="2" fill="#38bdf8" />
                  <circle cx="105" cy="6" r="2" fill="#38bdf8" />
                  <circle cx="140" cy="18" r="2" fill="#38bdf8" />
                  <circle cx="175" cy="10" r="2" fill="#38bdf8" />
                  <circle cx="210" cy="20" r="2" fill="#38bdf8" />
                  <circle cx="245" cy="4" r="2" fill="#38bdf8" />
                </svg>
                <div className="chart-months">
                  <span>Jan</span>
                  <span>Feb</span>
                  <span>Mar</span>
                  <span>Apr</span>
                  <span>May</span>
                  <span>Jun</span>
                  <span>Jul</span>
                  <span>Aug</span>
                </div>
              </div>

              <div className="action-grid">
                <div className="action-card">
                  <div className="icon blue">⬆️</div>
                  <div className="label">Upload Report</div>
                  <div className="sub">Add your medical documents</div>
                </div>
                <div className="action-card">
                  <div className="icon cyan">🔍</div>
                  <div className="label">Scan Prescription</div>
                  <div className="sub">Digitize with AI</div>
                </div>
                <div className="action-card">
                  <div className="icon green">🧪</div>
                  <div className="label">Find Alternatives</div>
                  <div className="sub">Explore generic options</div>
                </div>
                <div className="action-card">
                  <div className="icon purple">📊</div>
                  <div className="label">Get Insights</div>
                  <div className="sub">Understand your reports</div>
                </div>
              </div>
            </div>

            {/* Right */}
            <div className="right-col">
              <div className="topline">
                🔔
                <div className="user-chip">
                  <span className="avatar-dot"></span> Nandani ▾
                </div>
              </div>

              <div className="activity-card">
                <div className="activity-head">
                  Recent Activity <span>View All</span>
                </div>
                <div className="activity-item">
                  <span className="icon">📄</span>
                  <div>
                    <div className="title">Blood Test Report</div>
                    <div className="sub">Added • 2 days ago</div>
                  </div>
                </div>
                <div className="activity-item">
                  <span className="icon">💊</span>
                  <div>
                    <div className="title">Medicine Added</div>
                    <div className="sub">Crocin 500 mg • 3 days ago</div>
                  </div>
                </div>
                <div className="activity-item">
                  <span className="icon">🩺</span>
                  <div>
                    <div className="title">Doctor Consultation</div>
                    <div className="sub">Notes added • 5 days ago</div>
                  </div>
                </div>
                <div className="activity-item">
                  <span className="icon">📄</span>
                  <div>
                    <div className="title">X-Ray Report</div>
                    <div className="sub">Added • 1 week ago</div>
                  </div>
                </div>
              </div>

              <div className="insight-card">
                <div className="insight-head">✦ Arovia AI Insight</div>
                <p className="insight-text">
                  Your last hemoglobin level is slightly below the normal range.
                  Consider discussing this with your healthcare professional.
                </p>
                <button className="insight-btn">View Full Insight →</button>
              </div>

              <div className="secure-card">
                🛡️
                <div>
                  <div className="title">Your Health Data</div>
                  <div className="sub">Protected & Encrypted</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="trustbar">
        <div className="trustbar-inner">
          <div className="item">📄 Organized Records</div>
          <div className="item">✦ AI-Assisted</div>
          <div className="item">✓ Human Verified</div>
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
            <button className="link-btn">Explore Timeline →</button>
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
          <div className="ai-card">
            <div className="ai-card-head">
              <div>
                <div className="name">✦ AROVIA AI</div>
                <div className="sub">Lab Report Analysis</div>
              </div>
              <div className="ai-badge">⚡ AI-Powered Insight</div>
            </div>

            <div className="ai-metric-label">Hemoglobin</div>
            <div className="ai-metric-value">10.2 g/dL</div>
            <div className="ai-range">
              <div className="ai-range-fill"></div>
              <div className="ai-range-marker"></div>
            </div>
            <div className="ai-range-labels">
              <span>12</span>
              <span>Reference Range: 12 – 16 g/dL</span>
              <span>16</span>
            </div>

            <div className="ai-flag">🔻 Below reference range</div>

            <div className="ai-explain-title">What does this mean?</div>
            <p className="ai-explain-text">
              Your hemoglobin level is below the reference range shown on your
              report. There can be several reasons for a result like this, so it
              should be discussed with a healthcare professional.
            </p>
            <div className="ai-source">
              📄 Source: Complete Blood Count Report
            </div>

            <div className="ai-bottom-row">
              <div className="ai-confidence-box">
                <div className="ai-confidence-label">
                  <span>AI Confidence</span>
                  <span>85%</span>
                </div>
                <div className="ai-confidence-bar">
                  <div className="ai-confidence-fill"></div>
                </div>
                <div className="ai-confidence-note">
                  ✓ Information extracted successfully
                </div>
              </div>

              <div className="ai-warning">
                <span>⚠️</span>
                <div>
                  <div className="ai-warning-title">Medicine name unclear</div>
                  <div className="ai-warning-text">
                    AI couldn't confidently identify this medicine.
                  </div>
                  <div className="ai-warning-link">
                    Review & Enter Manually →
                  </div>
                </div>
              </div>
            </div>
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
            <button className="link-btn">Understand my Report →</button>
          </div>
        </div>
      </section>

      {/* ---------- Affordable Medicines ---------- */}
      <section className="medicine-section">
        <div className="split-section">
          <div>
            <div className="section-label">Affordable Medicines</div>
            <h2 className="section-heading">
              Healthcare shouldn't be
              <br />
              <span className="accent">unnecessarily expensive.</span>
            </h2>
            <p className="section-text" style={{ marginTop: "18px" }}>
              AROVIA can identify the active ingredient in a prescribed medicine
              and help users explore potential generic alternatives using
              trusted medicine information.
            </p>
          </div>

          <div className="medicine-right">
            <div className="medicine-card">
              <div className="medicine-card-head">⚖️ Medicine Options</div>
              <div className="medicine-card-sub">
                Compare prescribed and potential generic options
              </div>

              <div className="medicine-compare-grid">
                <div className="medicine-option">
                  <span className="medicine-pill brand">
                    PRESCRIBED MEDICINE
                  </span>
                  <div className="medicine-name">Brand X</div>
                  <div className="medicine-dose">500 mg Tablet</div>
                  <div className="medicine-ingredient-row">
                    🧪 Active Ingredient
                  </div>
                  <div className="medicine-ingredient-value">Paracetamol</div>
                  <div className="medicine-price-row">
                    <span className="medicine-price">₹120</span>
                    <span className="medicine-price-unit">per strip</span>
                    <span className="medicine-tablet-count">💊 10 tablets</span>
                  </div>
                </div>
                <div className="medicine-vs">vs</div>
                <div className="medicine-option">
                  <span className="medicine-pill generic">
                    POTENTIAL GENERIC OPTION
                  </span>
                  <div className="medicine-name">Generic X</div>
                  <div className="medicine-dose">500 mg Tablet</div>
                  <div className="medicine-ingredient-row">
                    🧪 Active Ingredient
                  </div>
                  <div className="medicine-ingredient-value">Paracetamol</div>
                  <div className="medicine-price-row">
                    <span className="medicine-price">₹35</span>
                    <span className="medicine-price-unit">per strip</span>
                    <span className="medicine-tablet-count">💊 10 tablets</span>
                  </div>
                </div>
              </div>

              <div className="medicine-savings">
                🪙
                <div>
                  <div className="amount">Potential saving: ₹85</div>
                  <div className="pct">(71%)</div>
                </div>
              </div>
              <div className="medicine-disclaimer">
                🛡️ Generic alternatives are informational and should be
                confirmed with a doctor or pharmacist before substitution.
              </div>
            </div>

            <div className="note-card">
              <div className="note-card-title">✅ Please note</div>
              <div className="note-card-text">
                Generic alternatives are informational and should be confirmed
                with a doctor or pharmacist before substitution.
              </div>
            </div>
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
        <button className="cta-btn">Create your Free Account →</button>
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
              <span>📷</span>
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
