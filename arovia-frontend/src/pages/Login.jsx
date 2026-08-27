import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  Eye,
  HeartPulse,
  Folder,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import logo from "../assets/logo1.png";
import "./login.css";

function Login() {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // No backend yet — any input logs you straight into the dashboard.
    navigate("/dashboard");
  };

  return (
    <div className="login-page">
      <header className="login-topbar">
        <div className="login-brand">
          <div className="login-brand-name">AROVIA</div>
          <div className="login-brand-tag">Understand. Track. Care.</div>
        </div>
        <div className="login-topbar-right">
          <span>Don't have an account?</span>
          <button className="login-create-btn">Create Account</button>
        </div>
      </header>

      <div className="login-body">
        {/* Left card */}
        <div className="login-card">
          <div className="login-card-top">
            <img src={logo} alt="Arovia logo" className="login-card-logo" />
            <span className="login-welcome-pill">WELCOME TO AROVIA</span>
          </div>

          <h2 className="login-title">Welcome Back</h2>
          <p className="login-subtitle">
            Sign in to access your health records.
          </p>

          <form onSubmit={handleLogin}>
            <label className="login-label">Email Address</label>
            <div className="login-input-wrap">
              <span className="login-input-icon">
                <Mail size={14} strokeWidth={2} />
              </span>
              <input
                type="email"
                placeholder="you@example.com"
                className="login-input"
              />
            </div>

            <label className="login-label">Password</label>
            <div className="login-input-wrap">
              <span className="login-input-icon">
                <Lock size={14} strokeWidth={2} />
              </span>
              <input
                type="password"
                placeholder="••••••••"
                className="login-input"
              />
              <span className="login-eye-icon">
                <Eye size={14} strokeWidth={2} />
              </span>
            </div>

            <div className="login-forgot">Forgot Password?</div>

            <button type="submit" className="login-submit-btn">
              Login <span>→</span>
            </button>
          </form>

          <div className="login-divider">
            <span></span>
            <p>or</p>
            <span></span>
          </div>

          <button
            className="login-google-btn"
            onClick={() => navigate("/dashboard")}
          >
            <span className="login-google-icon">G</span>
            Continue with Google
          </button>

          <div className="login-signup-text">
            Don't have an account? <Link to="#">Sign up</Link>
          </div>
        </div>

        {/* Right dark panel */}
        <div className="login-side-panel">
          <div className="login-side-dots"></div>
          <div className="login-side-circle-1"></div>
          <div className="login-side-circle-2"></div>
          <div className="login-side-plus">+</div>

          <div className="login-side-content">
            <div className="login-side-icon">
              <HeartPulse size={22} strokeWidth={2.2} />
            </div>
            <div className="login-side-brand">AROVIA</div>
            <div className="login-side-tag">Understand. Track. Care.</div>

            <h3 className="login-side-heading">
              Your health journey,
              <br />
              <span>organized.</span>
            </h3>
            <div className="login-side-underline"></div>

            <p className="login-side-text">
              Keep your medical records together, understand your reports, and
              explore health information with confidence.
            </p>

            <div className="login-feature-row">
              <div className="login-feature">
                <div className="login-feature-icon teal">
                  <Folder size={13} strokeWidth={2.2} />
                </div>
                <div className="login-feature-title">Organized Records</div>
                <div className="login-feature-sub">
                  All your medical documents in one secure place.
                </div>
              </div>
              <div className="login-feature">
                <div className="login-feature-icon green">
                  <Sparkles size={13} strokeWidth={2.2} />
                </div>
                <div className="login-feature-title">AI-Assisted Insights</div>
                <div className="login-feature-sub">
                  Get simple explanations and helpful insights from complex
                  reports.
                </div>
              </div>
              <div className="login-feature">
                <div className="login-feature-icon indigo">
                  <ShieldCheck size={13} strokeWidth={2.2} />
                </div>
                <div className="login-feature-title">User Controlled</div>
                <div className="login-feature-sub">
                  Your data stays private and under your control.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
