import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useArovia } from "../../context";
import { clearCache } from "../../api";

function Settings() {
  const { user, refreshAll, signOut } = useArovia();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function refresh() { setLoading(true); setMessage(""); try { clearCache(); await refreshAll(); setMessage("Backend data refreshed and cache cleared."); } catch (err) { setMessage(err.message || "Refresh failed."); } finally { setLoading(false); } }
  function logout() { signOut(); navigate("/login", { replace: true }); }

  return <><div className="dash-page-head"><h1>Settings</h1><p>Session, cache and account controls.</p></div><div className="settings-card">
    <div className="settings-row"><label>Signed-in account</label><input value={user?.emailId || ""} readOnly /></div>
    <div className="settings-row"><label>User ID</label><input value={user?.userId || ""} readOnly /></div>
    <div className="settings-row"><label>API base URL</label><input value={import.meta.env.VITE_API_BASE_URL || "http://localhost:8080"} readOnly /></div>
    <button className="settings-save-btn" onClick={refresh} disabled={loading}>{loading ? "Refreshing…" : "Refresh backend data"}</button>
    <button className="settings-save-btn" style={{marginLeft:8}} onClick={logout}>Log out</button>
    {message && <span style={{ marginLeft: 12, fontSize: 12, color: "#166534", fontWeight: 600 }}>{message}</span>}
  </div><div className="ai-disclaimer-card"><strong>Why there is no profile Save button:</strong>&nbsp; the supplied API document has signup/signin/OAuth profile creation, but no authenticated profile-update endpoint. The frontend avoids sending an unsupported request.</div></>;
}
export default Settings;
