import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import logo from "../assets/logo1.png";
import "./login.css";
import { oauthSignup } from "../api/auth";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { ApiError } from "../api/client";
import AuthSidePanel from "../components/AuthSidePanel";
import HealthProfileFields from "../components/HealthProfileFields";

export default function SignupComplete() {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const toast = useToast();

  const googleToken = location.state?.googleToken;
  const [profile, setProfile] = useState({
    dob: "",
    bloodGroup: "",
    gender: "",
    weight: "",
    height: "",
    location: "",
    pastChronicDiseases: "",
    familyDiseases: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!googleToken) {
    return <Navigate to="/signup" replace />;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await oauthSignup({
        token: googleToken,
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
      });
      login(data);
      toast.success("You're all set!");
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "We couldn't finish setting up your account.");
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
      </header>

      <div className="login-body">
        <div className="login-card">
          <div className="login-card-top">
            <img src={logo} alt="Arovia logo" className="login-card-logo" />
            <span className="login-welcome-pill">ALMOST THERE</span>
          </div>
          <h2 className="login-title">Complete Your Profile</h2>
          <p className="login-subtitle">A few optional details to personalize your health insights.</p>

          <form onSubmit={handleSubmit}>
            <HealthProfileFields profile={profile} setProfile={setProfile} />
            {error && <div className="login-error">{error}</div>}
            <button className="login-submit-btn" type="submit" disabled={loading} style={{ marginTop: 20 }}>
              {loading ? "Saving…" : "Finish Setup"} {!loading && <ArrowRight size={16} />}
            </button>
          </form>
        </div>

        <AuthSidePanel />
      </div>
    </div>
  );
}
