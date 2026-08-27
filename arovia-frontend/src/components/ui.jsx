export function Spinner({ label = "Loading…" }) {
  return (
    <div className="ar-spinner-wrap">
      <div className="ar-spinner" />
      {label && <span>{label}</span>}
    </div>
  );
}

export function EmptyState({ icon, title, subtitle, action }) {
  return (
    <div className="ar-empty">
      {icon && <div className="ar-empty-icon">{icon}</div>}
      <div className="ar-empty-title">{title}</div>
      {subtitle && <div className="ar-empty-sub">{subtitle}</div>}
      {action}
    </div>
  );
}

const STATUS_STYLES = {
  LOW: "status-low",
  HIGH: "status-high",
  CRITICAL: "status-critical",
  NORMAL: "status-normal",
  UNKNOWN: "status-unknown",
  ACTIVE: "status-normal",
  CONTINUED: "status-normal",
  NEW: "status-info",
  DISCONTINUED: "status-unknown",
};

export function StatusBadge({ status }) {
  if (!status) return null;
  const cls = STATUS_STYLES[status] || "status-unknown";
  return <span className={`status-badge ${cls}`}>{status.replace("_", " ")}</span>;
}

export function ErrorBanner({ message, onRetry }) {
  if (!message) return null;
  return (
    <div className="ar-error-banner">
      <span>⚠️ {message}</span>
      {onRetry && (
        <button type="button" onClick={onRetry}>
          Retry
        </button>
      )}
    </div>
  );
}
