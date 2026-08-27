import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, ArrowLeft } from "lucide-react";
import logo from "../assets/logo1.png";
import "./login.css";
import { signup } from "../api/auth";
import { useToast } from "../context/ToastContext";
import { ApiError } from "../api/client";
import AuthSidePanel from "../components/AuthSidePanel";
import GoogleAuthButton from "../components/GoogleAuthButton";
import HealthProfileFields from "../components/HealthProfileFields";

const EMPTY_PROFILE = {
  dob: "",
  bloodGroup: "",
  gender: "",
  weight: "",
  height: "",
  location: "",
  pastChronicDiseases: "",
  familyDiseases: "",
};

function Signup() {
  const [step, setStep] = useState(1);
  const [basics, setBasics] = useState({ name: "", emailId: "", password: "", confirm: "" });
  const [profile, setProfile] = useState(EMPTY_PROFILE);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const toast = useToast();

  function validateBasics() {
    if (!basics.name.trim()) return "Please enter your name.";
    if (!basics.emailId.trim()) return "Please enter your email address.";
    if (basics.password.length < 6) return "Password should be at least 6 characters.";
    if (basics.password !== basics.confirm) return "Passwords don't match.";
    return "";
  }

  function handleNext(e) {
    e.preventDefault();
    const message = validateBasics();
    if (message) {
      setError(message);
      return;
    }
    setError("");
    setStep(2);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const payload = {
        name: basics.name.trim(),
        emailId: basics.emailId.trim(),
        password: basics.password,
        dob: profile.dob || null,
        bloodGroup: profile.bloodGroup || null,
        gender: profile.gender || null,
        weight: profile.weight ? Number(profile.weight) : null,
        height: profile.height ? Number(profile.height) : null,
        location: profile.location || null,
        pastChronicDiseases: profile.pastChronicDiseases
          ? profile.pastChronicDiseases.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
        familyDiseases: profile.familyDiseases
          ? profile.familyDiseases.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
      };
      await signup(payload);
      toast.success("Account created! Please sign in to continue.");
      navigate("/login", { replace: true });
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : "We couldn't create your account. Please try again.";
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
          <span>Already have an account?</span>
          <Link to="/login" className="login-create-btn">
            Log In
          </Link>
        </div>
      </header>

      <div className="login-body">
        <div className="login-card">
          <div className="login-card-top">
            <img src={logo} alt="Arovia logo" className="login-card-logo" />
            <span className="login-welcome-pill">JOIN AROVIA</span>
          </div>

          <h2 className="login-title">Create Your Account</h2>
          <p className="login-subtitle">
            {step === 1
              ? "Let's start with the basics."
              : "Optional — helps personalize your insights. You can skip and add this later."}
          </p>

          <div className="signup-steps">
            <span className={step >= 1 ? "on" : ""}>1. Account</span>
            <span className={step >= 2 ? "on" : ""}>2. Health Profile</span>
          </div>

          {step === 1 && (
            <form onSubmit={handleNext}>
              <label className="login-label">Full Name</label>
              <div className="login-input-wrap">
                <span className="login-input-icon">
                  <User size={15} />
                </span>
                <input
                  className="login-input"
                  placeholder="Jane Doe"
                  value={basics.name}
                  onChange={(e) => setBasics({ ...basics, name: e.target.value })}
                />
              </div>

              <label className="login-label">Email Address</label>
              <div className="login-input-wrap">
                <span className="login-input-icon">
                  <Mail size={15} />
                </span>
                <input
                  type="email"
                  className="login-input"
                  placeholder="you@example.com"
                  value={basics.emailId}
                  onChange={(e) => setBasics({ ...basics, emailId: e.target.value })}
                />
              </div>

              <label className="login-label">Password</label>
              <div className="login-input-wrap">
                <span className="login-input-icon">
                  <Lock size={15} />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  className="login-input"
                  placeholder="At least 6 characters"
                  value={basics.password}
                  onChange={(e) => setBasics({ ...basics, password: e.target.value })}
                />
                <span className="login-eye-icon" onClick={() => setShowPassword((v) => !v)}>
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </span>
              </div>

              <label className="login-label">Confirm Password</label>
              <div className="login-input-wrap">
                <span className="login-input-icon">
                  <Lock size={15} />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  className="login-input"
                  placeholder="Re-enter your password"
                  value={basics.confirm}
                  onChange={(e) => setBasics({ ...basics, confirm: e.target.value })}
                />
              </div>

              {error && <div className="login-error">{error}</div>}

              <button className="login-submit-btn" type="submit">
                Continue <ArrowRight size={16} />
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleSubmit}>
              <HealthProfileFields profile={profile} setProfile={setProfile} />

              {error && <div className="login-error">{error}</div>}

              <div className="signup-step-actions">
                <button type="button" className="login-google-btn" onClick={() => setStep(1)}>
                  <ArrowLeft size={15} /> Back
                </button>
                <button className="login-submit-btn" type="submit" disabled={loading}>
                  {loading ? "Creating account…" : "Create Account"}{" "}
                  {!loading && <ArrowRight size={16} />}
                </button>
              </div>
            </form>
          )}

          {step === 1 && (
            <>
              <div className="login-divider">
                <span></span>
                <p>or</p>
                <span></span>
              </div>
              <GoogleAuthButton mode="signup" />
            </>
          )}

          <div className="login-signup-text">
            Already have an account? <Link to="/login">Log in</Link>
          </div>
        </div>

        <AuthSidePanel />
      </div>
    </div>
  );
}

export default Signup;
