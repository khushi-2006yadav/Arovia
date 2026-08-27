import { FolderOpen, Sparkles, ShieldCheck } from "lucide-react";

export default function AuthSidePanel() {
  return (
    <div className="login-side-panel">
      <div className="login-side-dots"></div>
      <div className="login-side-circle-1"></div>
      <div className="login-side-circle-2"></div>
      <div className="login-side-plus">+</div>

      <div className="login-side-content">
        <div className="login-side-icon">💙</div>
        <div className="login-side-brand">AROVIA</div>
        <div className="login-side-tag">Understand. Track. Care.</div>

        <h3 className="login-side-heading">
          Your health journey,
          <br />
          <span>organized.</span>
        </h3>
        <div className="login-side-underline"></div>

        <p className="login-side-text">
          Keep your medical records together, understand your reports, and explore health
          information with confidence.
        </p>

        <div className="login-feature-row">
          <div className="login-feature">
            <div className="login-feature-icon teal">
              <FolderOpen size={15} />
            </div>
            <div className="login-feature-title">Organized Records</div>
            <div className="login-feature-sub">All your medical documents in one secure place.</div>
          </div>
          <div className="login-feature">
            <div className="login-feature-icon green">
              <Sparkles size={15} />
            </div>
            <div className="login-feature-title">AI-Assisted Insights</div>
            <div className="login-feature-sub">
              Get simple explanations and helpful insights from complex reports.
            </div>
          </div>
          <div className="login-feature">
            <div className="login-feature-icon indigo">
              <ShieldCheck size={15} />
            </div>
            <div className="login-feature-title">User Controlled</div>
            <div className="login-feature-sub">Your data stays private and under your control.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
