import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { oauthSignin } from "../api/auth";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const SCRIPT_SRC = "https://accounts.google.com/gsi/client";

function loadGoogleScript() {
  return new Promise((resolve, reject) => {
    if (window.google?.accounts?.id) return resolve();
    const existing = document.querySelector(`script[src="${SCRIPT_SRC}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", reject);
      return;
    }
    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

/** Renders a "Continue with Google" button that drives the real oauth-signin flow. */
export default function GoogleAuthButton({ mode = "signin" }) {
  const buttonHostRef = useRef(null);
  const [ready, setReady] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    if (!CLIENT_ID) return;
    let cancelled = false;

    loadGoogleScript()
      .then(() => {
        if (cancelled) return;
        window.google.accounts.id.initialize({
          client_id: CLIENT_ID,
          callback: handleCredential,
        });
        if (buttonHostRef.current) {
          window.google.accounts.id.renderButton(buttonHostRef.current, {
            theme: "outline",
            size: "large",
            width: 320,
            text: mode === "signup" ? "signup_with" : "signin_with",
          });
        }
        setReady(true);
      })
      .catch(() => setReady(false));

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleCredential(response) {
    const idToken = response?.credential;
    if (!idToken) return;
    try {
      const data = await oauthSignin(idToken);
      login(data);
      toast.success(`Welcome, ${data.name?.split(" ")[0] || "there"}!`);
      navigate("/dashboard", { replace: true });
    } catch {
      // No account for this Google identity yet — send them to finish signup.
      toast.info("Let's finish setting up your Arovia profile.");
      navigate("/signup/complete", { state: { googleToken: idToken } });
    }
  }

  function handleFallbackClick() {
    toast.info(
      "Google sign-in isn't configured for this environment yet. Set VITE_GOOGLE_CLIENT_ID to enable it."
    );
  }

  if (!CLIENT_ID) {
    return (
      <button type="button" className="login-google-btn" onClick={handleFallbackClick}>
        <span className="login-google-icon">G</span>
        Continue with Google
      </button>
    );
  }

  return (
    <div className="google-btn-host" ref={buttonHostRef}>
      {!ready && (
        <button type="button" className="login-google-btn" disabled>
          <span className="login-google-icon">G</span>
          Loading Google Sign-In…
        </button>
      )}
    </div>
  );
}
