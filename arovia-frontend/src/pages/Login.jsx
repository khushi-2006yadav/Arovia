import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useArovia } from "../context";
import { api } from "../api";
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
  const location = useLocation();
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { signIn } = useArovia();

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signIn({ emailId, password });
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.message || "Unable to sign in.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <header className="login-topbar">
        <div className="login-brand">
          <div className="login-brand-name">AROVIA</div>
          <div className="login-brand-tag">Understand. Track. Care.</div>
        </div>
        <div className="login-topbar-right">
          <span>Don't have an account?</span>
          <Link to="/signup" className="login-create-btn">Create Account</Link>
        </div>
      </header>

      <div className="login-body">
        <div className="login-card">
          <div className="login-card-top">
            <img src={logo} alt="Arovia logo" className="login-card-logo" />
            <span className="login-welcome-pill">WELCOME TO AROVIA</span>
          </div>
          <h2 className="login-title">Welcome Back</h2>
          <p className="login-subtitle">Sign in to access your health records.</p>
          {location.state?.message && <div className="login-success">{location.state.message}</div>}
          {error && <div className="login-error">{error}</div>}

          <form onSubmit={handleLogin}>
            <label className="login-label">Email Address</label>
            <div className="login-input-wrap">
              <span className="login-input-icon"><Mail size={14} strokeWidth={2} /></span>
              <input type="email" required value={emailId} onChange={(e) => setEmailId(e.target.value)} placeholder="you@example.com" className="login-input" />
            </div>

            <label className="login-label">Password</label>
            <div className="login-input-wrap">
              <span className="login-input-icon"><Lock size={14} strokeWidth={2} /></span>
              <input type={showPassword ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="login-input" />
              <button type="button" className="login-eye-icon" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword(v => !v)}><Eye size={14} strokeWidth={2} /></button>
            </div>

            <div className="login-forgot">Forgot Password?</div>
            <button type="submit" className="login-submit-btn" disabled={loading}>{loading ? "Signing in…" : <>Login <span>→</span></>}</button>
          </form>

          <div className="login-divider"><span></span><p>or</p><span></span></div>
          <button className="login-google-btn" type="button" onClick={() => { window.location.assign(api.oauthAuthorizationUrl("google")); }}>
            <span className="login-google-icon">G</span> Continue with Google
          </button>
          <div className="login-signup-text">Don't have an account? <Link to="/signup">Sign up</Link></div>
        </div>

        <div className="login-side-panel">
          <div className="login-side-dots"></div><div className="login-side-circle-1"></div><div className="login-side-circle-2"></div><div className="login-side-plus">+</div>
          <div className="login-side-content">
            <div className="login-side-icon"><HeartPulse size={22} strokeWidth={2.2} /></div>
            <div className="login-side-brand">AROVIA</div><div className="login-side-tag">Understand. Track. Care.</div>
            <h3 className="login-side-heading">Your health journey,<br /><span>organized.</span></h3><div className="login-side-underline"></div>
            <p className="login-side-text">Keep your medical records together, understand your reports, and explore health information with confidence.</p>
            <div className="login-feature-row">
              <div className="login-feature"><div className="login-feature-icon teal"><Folder size={13} strokeWidth={2.2} /></div><div className="login-feature-title">Organized Records</div><div className="login-feature-sub">All your medical documents in one secure place.</div></div>
              <div className="login-feature"><div className="login-feature-icon green"><Sparkles size={13} strokeWidth={2.2} /></div><div className="login-feature-title">AI-Assisted Insights</div><div className="login-feature-sub">Get simple explanations and helpful insights from complex reports.</div></div>
              <div className="login-feature"><div className="login-feature-icon indigo"><ShieldCheck size={13} strokeWidth={2.2} /></div><div className="login-feature-title">User Controlled</div><div className="login-feature-sub">Your data stays private and under your control.</div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
