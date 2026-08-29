import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./home.css";

gsap.registerPlugin(ScrollTrigger);

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

const FEATURE_CARDS = [
  {
    icon: <Download size={20} strokeWidth={2} />,
    color: "blue",
    title: "One Health Record",
    text: "Keep prescriptions, lab reports and medical documents organized in one place.",
  },
  {
    icon: <Brain size={20} strokeWidth={2} />,
    color: "plum",
    title: "Understand your reports",
    text: "AI helps simplify complex medical information into easy-to-understand insights.",
  },
  {
    icon: <Pill size={20} strokeWidth={2} />,
    color: "gold",
    title: "Discover affordable options",
    text: "Explore potential generic alternatives using trusted medicine information.",
  },
  {
    icon: <ShieldCheck size={20} strokeWidth={2} />,
    color: "sky",
    title: "You stay in control",
    text: "Review, edit and manage your health information with full control over your data.",
  },
];

function Home() {
  const [activeTab, setActiveTab] = useState(0);
  const rootRef = useRef(null);
  const marqueTween = useRef(null);
  const featureTween = useRef(null);
  const featureTrackRef = useRef(null);
  const featureLoopRef = useRef(null);
  const tourTabsRef = useRef(null);
  const tourVisualRef = useRef(null);
  const tourImgRef = useRef(null);
  const isFirstRender = useRef(true);

  // Refs for the new guitar string effect
  const stringRef = useRef(null);
  const pathRef = useRef(null);

  // --- Guitar String Interactive Handlers ---
  const handleMouseMove = (e) => {
    if (!stringRef.current || !pathRef.current) return;

    const rect = stringRef.current.getBoundingClientRect();
    // Map mouse coordinates to match the SVG's 1000x200 viewBox
    const x = ((e.clientX - rect.left) / rect.width) * 1000;
    const y = ((e.clientY - rect.top) / rect.height) * 200;

    const newPath = `M 10 100 Q ${x} ${y} 990 100`;

    gsap.to(pathRef.current, {
      attr: { d: newPath },
      duration: 0.3,
      ease: "power3.out",
    });
  };

  const handleMouseLeave = () => {
    if (!pathRef.current) return;

    const finalPath = "M 10 100 Q 500 100 990 100";

    gsap.to(pathRef.current, {
      attr: { d: finalPath },
      duration: 1.5,
      ease: "elastic.out(1, 0.2)",
    });
  };

  // 1. Main Initial Load & Scroll Animations
  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(".lp-nav-item", {
        y: -60,
        opacity: 0,
        duration: 0.5,
        stagger: 0.3,
        clearProps: "all",
      })
        .from(
          ".lp-hero-item",
          {
            x: 1000,
            opacity: 0,
            duration: 0.7,
            stagger: 0.15,
            clearProps: "all",
          },
          "-=0.3",
        )
        .from(
          ".lp-hero-visual",
          {
            x: -1000,
            opacity: 0,
            duration: 0.8,
            clearProps: "all",
          },
          "-=0.5",
        );

      // --- Why Arovia Section ---
      gsap.from(".lp-why-left", {
        x: -1000,
        opacity: 0,
        duration: 1.5,
        ease: "power3.out",
        clearProps: "all",
        scrollTrigger: {
          trigger: "#features",
          start: "top 30%",
        },
      });

      gsap.from(".lp-why-right", {
        x: 1000,
        opacity: 0,
        duration: 1.5,
        ease: "power3.out",
        clearProps: "all",
        scrollTrigger: {
          trigger: "#features",
          start: "top 30%",
        },
      });

      // --- Product Tour Section ---
      gsap.from(".lp-tour-reveal", {
        y: 30,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: "power3.out",
        clearProps: "all",
        scrollTrigger: {
          trigger: "#tour",
          start: "top 30%",
        },
      });

      const tourTabEls = gsap.utils.toArray(".lp-tour-tab");
      if (tourTabEls.length) {
        const tabsTl = gsap.timeline({
          delay: 0.2, // Fast start
          scrollTrigger: {
            trigger: "#tour",
            start: "top 30%",
          },
          onStart: () => {
            if (tourTabsRef.current)
              tourTabsRef.current.style.pointerEvents = "none";
          },
          onComplete: () => {
            if (tourTabsRef.current)
              tourTabsRef.current.style.pointerEvents = "auto";
          },
        });

        if (tourVisualRef.current && tourImgRef.current) {
          tabsTl.fromTo(
            [tourVisualRef.current, tourImgRef.current],
            { opacity: 0, x: 60 },
            {
              opacity: 1,
              x: 0,
              duration: 0.5, // Snappy image slide
              ease: "power3.out",
              clearProps: "all",
              immediateRender: true,
            },
            0,
          );
        }

        tourTabEls.forEach((tabEl, i) => {
          tabsTl
            .call(() => setActiveTab(i), [], i === 0 ? 0 : "+=0.8") // Faster sequence
            .fromTo(
              tabEl,
              { y: 24, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 0.5, // Faster button slide
                ease: "power3.out",
                clearProps: "all",
              },
              "<",
            );
        });
      }

      // --- Health Timeline Section ---
      gsap.from(".lp-timeline-left", {
        x: 1000, // Slides in from the left
        opacity: 0,
        duration: 1.5,
        ease: "power3.out",
        clearProps: "all",
        scrollTrigger: {
          trigger: "#timeline",
          start: "top 30%",
        },
      });

      gsap.from(".lp-timeline-right", {
        x: -1000, // Slides in from the right
        opacity: 0,
        duration: 1.5,
        ease: "power3.out",
        clearProps: "all",
        scrollTrigger: {
          trigger: "#timeline",
          start: "top 30%",
        },
      });

      // --- CTA Pop-Out Section ---
      gsap.from(".lp-cta-item", {
        y: 30,
        scale: 0.85,
        opacity: 0,
        duration: 0.7,
        stagger: 0.1,
        ease: "back.out(1.5)", // The "back" ease creates the popping/bouncing effect
        clearProps: "all",
        scrollTrigger: {
          trigger: ".lp-cta-section",
          start: "top 30%", // Starts a bit earlier so it ensures triggering before footer
        },
      });
    },
    { scope: rootRef },
  );

  // 2. Dedicated Active Tab Animation (Manual clicks)
  useGSAP(
    () => {
      if (isFirstRender.current) {
        isFirstRender.current = false;
        return;
      }

      if (!tourImgRef.current || !tourVisualRef.current) return;

      gsap.killTweensOf([tourVisualRef.current, tourImgRef.current]);

      gsap.fromTo(
        [tourVisualRef.current, tourImgRef.current],
        { opacity: 0, x: 60 },
        {
          opacity: 1,
          x: 0,
          duration: 0.4, // Very responsive on click
          ease: "power3.out",
          clearProps: "all",
        },
      );
    },
    { dependencies: [activeTab], scope: rootRef },
  );

  // 3. Continuous Marquees Setup
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      marqueTween.current = gsap.to(".lp-marque", {
        xPercent: -20,
        repeat: -1,
        duration: 6,
        ease: "none",
      });

      const trackEl = featureTrackRef.current;
      const loopEl = featureLoopRef.current;

      if (trackEl && loopEl) {
        const trackRect = trackEl.getBoundingClientRect();
        const loopRect = loopEl.getBoundingClientRect();
        const loopShift = loopRect.left - trackRect.left;

        featureTween.current = gsap.to(".lp-feature-track", {
          x: loopShift > 0 ? -loopShift : -600,
          repeat: -1,
          duration: 10,
          ease: "none",
        });
      }
    });

    return () => {
      cancelAnimationFrame(raf);
      marqueTween.current?.kill();
      featureTween.current?.kill();
    };
  }, []);

  // 4. ScrollTrigger Refresh
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    const t = setTimeout(refresh, 500);
    return () => {
      window.removeEventListener("load", refresh);
      clearTimeout(t);
    };
  }, []);

  // 5. Scroll Direction Reversal
  useEffect(() => {
    const handleWheel = (e) => {
      const direction = e.deltaY > 0 ? 1 : -1;

      marqueTween.current?.timeScale(direction);
      featureTween.current?.timeScale(direction);

      gsap.to(".lp-marque-icon", {
        rotate: direction > 0 ? 180 : 0,
      });
    };

    window.addEventListener("wheel", handleWheel);
    return () => window.removeEventListener("wheel", handleWheel);
  }, []);

  return (
    <div className="lp-root" ref={rootRef}>
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
        <Link to="/" className="lp-brand lp-nav-item">
          <img src={logo} alt="Arovia logo" className="lp-logo-img" />
          <div>
            <div className="lp-brand-name">AROVIA</div>
            <div className="lp-brand-tag">Understand. Track. Care.</div>
          </div>
        </Link>
        <div className="lp-nav-links">
          <a href="#top" className="lp-nav-item">
            Home
          </a>
          <a href="#features" className="lp-nav-item">
            Features
          </a>
          <a href="#tour" className="lp-nav-item">
            Product Tour
          </a>
        </div>
        <div className="lp-nav-actions">
          <Link to="/login" className="lp-btn-ghost lp-nav-item">
            Log in
          </Link>
          <Link to="/signup" className="lp-btn-primary lp-nav-item">
            Get Started
          </Link>
        </div>
      </nav>

      {/* ---------- Hero ---------- */}
      <section className="lp-hero" id="top">
        <div>
          <span className="lp-eyebrow lp-hero-item">
            A smarter way to manage your health
          </span>
          <h1 className="lp-hero-item">
            Your health.
            <br />
            <span className="lp-accent">One secure place.</span>
          </h1>
          <p className="lp-hero-sub lp-hero-item">
            AROVIA turns scattered prescriptions, lab reports and consultations
            into one organized record — with AI that helps you understand what
            your numbers actually mean.
          </p>
          <span className="lp-pulse lp-hero-item" />
          <div className="lp-hero-actions lp-hero-item">
            <Link to="/signup" className="lp-btn-cta">
              Get Started →
            </Link>
            <span className="lp-hero-note">Free to start · No credit card</span>
          </div>
        </div>

        <div className="lp-hero-visual">
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
        <div className="lp-trustbar-viewport">
          <div className="lp-marque">
            <div className="lp-marque-set">
              <div className="lp-item">
                <FileText
                  size={14}
                  strokeWidth={2}
                  className="lp-marque-icon"
                />{" "}
                Organized Records
              </div>
              <div className="lp-item">
                <Sparkles
                  size={14}
                  strokeWidth={2}
                  className="lp-marque-icon"
                />{" "}
                AI-Assisted
              </div>
              <div className="lp-item">
                <CircleCheck
                  size={14}
                  strokeWidth={2}
                  className="lp-marque-icon"
                />{" "}
                Human Verified
              </div>
            </div>
            <div className="lp-marque-set" aria-hidden="true">
              <div className="lp-item">
                <FileText
                  size={14}
                  strokeWidth={2}
                  className="lp-marque-icon"
                />{" "}
                Organized Records
              </div>
              <div className="lp-item">
                <Sparkles
                  size={14}
                  strokeWidth={2}
                  className="lp-marque-icon"
                />{" "}
                AI-Assisted
              </div>
              <div className="lp-item">
                <CircleCheck
                  size={14}
                  strokeWidth={2}
                  className="lp-marque-icon"
                />{" "}
                Human Verified
              </div>
            </div>
            <div className="lp-marque-set" aria-hidden="true">
              <div className="lp-item">
                <FileText
                  size={14}
                  strokeWidth={2}
                  className="lp-marque-icon"
                />{" "}
                Organized Records
              </div>
              <div className="lp-item">
                <Sparkles
                  size={14}
                  strokeWidth={2}
                  className="lp-marque-icon"
                />{" "}
                AI-Assisted
              </div>
              <div className="lp-item">
                <CircleCheck
                  size={14}
                  strokeWidth={2}
                  className="lp-marque-icon"
                />{" "}
                Human Verified
              </div>
            </div>
            <div className="lp-marque-set" aria-hidden="true">
              <div className="lp-item">
                <FileText
                  size={14}
                  strokeWidth={2}
                  className="lp-marque-icon"
                />{" "}
                Organized Records
              </div>
              <div className="lp-item">
                <Sparkles
                  size={14}
                  strokeWidth={2}
                  className="lp-marque-icon"
                />{" "}
                AI-Assisted
              </div>
              <div className="lp-item">
                <CircleCheck
                  size={14}
                  strokeWidth={2}
                  className="lp-marque-icon"
                />{" "}
                Human Verified
              </div>
            </div>
            <div className="lp-marque-set" aria-hidden="true">
              <div className="lp-item">
                <FileText
                  size={14}
                  strokeWidth={2}
                  className="lp-marque-icon"
                />{" "}
                Organized Records
              </div>
              <div className="lp-item">
                <Sparkles
                  size={14}
                  strokeWidth={2}
                  className="lp-marque-icon"
                />{" "}
                AI-Assisted
              </div>
              <div className="lp-item">
                <CircleCheck
                  size={14}
                  strokeWidth={2}
                  className="lp-marque-icon"
                />{" "}
                Human Verified
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ---------- Why Arovia ---------- */}
      <section className="lp-section" id="features">
        <div className="lp-why-top">
          <div className="lp-why-left">
            <div className="lp-section-label">Why Arovia</div>
            <h2 className="lp-section-heading">
              Medical information shouldn't be difficult to understand.
            </h2>
            <span className="lp-pulse" />
          </div>
          <p className="lp-section-text lp-why-right">
            AROVIA brings your medical records, AI-powered insights and
            affordable medicine information together, so you can make informed
            decisions about your health.
          </p>
        </div>

        <div className="lp-feature-viewport">
          <div className="lp-feature-track" ref={featureTrackRef}>
            {[0, 1, 2].map((setIdx) =>
              FEATURE_CARDS.map((f, i) => (
                <div
                  className="lp-feature-card"
                  key={`${setIdx}-${i}`}
                  aria-hidden={setIdx > 0}
                  ref={setIdx === 1 && i === 0 ? featureLoopRef : null}
                >
                  <div className={`lp-feature-icon ${f.color}`}>{f.icon}</div>
                  <h4>{f.title}</h4>
                  <p>{f.text}</p>
                </div>
              )),
            )}
          </div>
        </div>
      </section>

      {/* ---------- Product tour, mirrors the dashboard's own numbered nav ---------- */}
      <section className="lp-tour" id="tour">
        <div className="lp-section">
          <div className="lp-tour-inner">
            <div>
              <div className="lp-section-label lp-tour-reveal">
                See it in action
              </div>
              <h2 className="lp-section-heading lp-tour-reveal">
                Four views into your health,
                <br />
                right where the dashboard has them.
              </h2>
              <p
                className="lp-section-text lp-tour-reveal"
                style={{ marginTop: 14 }}
              >
                These are the same four sections you'll see the moment you log
                in — pick one to preview it.
              </p>

              <div className="lp-tour-tabs" ref={tourTabsRef}>
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

            <div className="lp-tour-visual" ref={tourVisualRef}>
              <img
                ref={tourImgRef}
                src={TOUR_TABS[activeTab].img}
                alt={TOUR_TABS[activeTab].alt}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Health Timeline ---------- */}
      <section className="lp-section" id="timeline">
        <div className="lp-split">
          <div className="lp-timeline-left">
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

          <div className="lp-timeline-card lp-timeline-right">
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
        <div className="lp-section-label lp-cta-item">
          Ready to take control?
        </div>
        <h2 className="lp-section-heading lp-cta-item">
          Understand. Track. Care.
        </h2>
        <span className="lp-pulse lp-pulse-light lp-cta-item" />

        {/* ---------- Interactive Guitar String Divider ---------- */}
        <div
          className="lp-string-container lp-cta-item"
          ref={stringRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <svg
            viewBox="0 0 1000 200"
            preserveAspectRatio="none"
            className="lp-string-svg"
          >
            <path
              ref={pathRef}
              d="M 10 100 Q 500 100 990 100"
              stroke="#2f7fe0" /* Uses your brand blue */
              strokeWidth="2"
              fill="transparent"
            />
          </svg>
        </div>

        <p className="lp-section-text lp-cta-item">
          One place for your medical records, insights and medicine information.
        </p>
        <Link to="/signup" className="lp-cta-btn lp-cta-item">
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
