import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import { useArovia } from "../context";
import "./login.css";

function OAuthSuccess() {
  const navigate = useNavigate();
  const { setUser } = useArovia();
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function completeOAuthLogin() {
      const token = new URLSearchParams(window.location.search).get("token");

      if (!token) {
        if (!cancelled) {
          setError("Google sign-in did not return an authentication token.");
        }
        return;
      }

      try {
        const user = await api.oauthSignin(token);
        if (!cancelled) {
          if (!user.bloodGroup) {
            navigate("/complete-profile", { replace: true, state: { token } });
          } else {
            setUser(user);
            navigate("/dashboard", { replace: true });
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Unable to complete Google sign-in.");
        }
      }
    }

    completeOAuthLogin();
    return () => { cancelled = true; };
  }, [navigate, setUser]);

  return (
    <div className="login-page">
      <div className="login-body" style={{ gridTemplateColumns: "minmax(0, 1fr)" }}>
        <div className="login-card" style={{ maxWidth: 520, width: "100%", margin: "0 auto" }}>
          {!error ? (
            <>
              <h2 className="login-title">Signing you in…</h2>
              <p className="login-subtitle">Completing Google authentication securely.</p>
            </>
          ) : (
            <>
              <h2 className="login-title">Google sign-in failed</h2>
              <div className="login-error">{error}</div>
              <button className="login-submit-btn" type="button" onClick={() => navigate("/login", { replace: true })}>
                Back to login →
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default OAuthSuccess;
