import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";
import logo from "../assets/logo1.png";
import "./login.css";
import { signin } from "../api/auth";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { ApiError } from "../api/client";
import GoogleAuthButton from "../components/GoogleAuthButton";
import AuthSidePanel from "../components/AuthSidePanel";

function Login() {
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();

  const redirectTo = location.state?.from || "/dashboard";

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!emailId || !password) {
      setError("Please enter both your email and password.");
      return;
    }
    setLoading(true);
    try {
      const data = await signin({ emailId, password });
      login(data);
      toast.success(`Welcome back, ${data.name?.split(" ")[0] || "there"}!`);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.type === "network"
            ? err.message
            : "We couldn't sign you in. Please check your email and password."
          : "Something went wrong. Please try again.";
      setError(message);
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
          <Link to="/signup" className="login-create-btn">
            Create Account
          </Link>
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
          <p className="login-subtitle">Sign in to access your health records.</p>

          <form onSubmit={handleSubmit}>
            <label className="login-label">Email Address</label>
            <div className="login-input-wrap">
              <span className="login-input-icon">
                <Mail size={15} />
              </span>
              <input
                type="email"
                placeholder="you@example.com"
                className="login-input"
                value={emailId}
                onChange={(e) => setEmailId(e.target.value)}
                autoComplete="email"
              />
            </div>

            <label className="login-label">Password</label>
            <div className="login-input-wrap">
              <span className="login-input-icon">
                <Lock size={15} />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="login-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              <span className="login-eye-icon" onClick={() => setShowPassword((v) => !v)}>
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </span>
            </div>

            {error && <div className="login-error">{error}</div>}

            <div className="login-forgot">Forgot Password?</div>

            <button className="login-submit-btn" type="submit" disabled={loading}>
              {loading ? "Signing in…" : "Login"} {!loading && <ArrowRight size={16} />}
            </button>
          </form>

          <div className="login-divider">
            <span></span>
            <p>or</p>
            <span></span>
          </div>

          <GoogleAuthButton mode="signin" />

          <div className="login-signup-text">
            Don't have an account? <Link to="/signup">Sign up</Link>
          </div>
        </div>

        <AuthSidePanel />
      </div>
    </div>
  );
}

export default Login;
