import { useState } from "react";
import { currentUser } from "../../data/mockData";

function Settings() {
  const [form, setForm] = useState({
    name: currentUser.name,
    email: currentUser.email,
    phone: currentUser.phone,
  });
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    insights: true,
  });
  const [saved, setSaved] = useState(false);

  const handleChange = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setSaved(false);
  };

  const handleToggle = (field) => () => {
    setNotifications((n) => ({ ...n, [field]: !n[field] }));
    setSaved(false);
  };

  const handleSave = (e) => {
    e.preventDefault();
    // No backend yet — this just simulates a save.
    setSaved(true);
  };

  return (
    <>
      <div className="dash-page-head">
        <h1>Settings</h1>
        <p>Manage your profile and notification preferences.</p>
      </div>

      <form className="settings-card" onSubmit={handleSave}>
        <div className="settings-row">
          <label>Full Name</label>
          <input type="text" value={form.name} onChange={handleChange("name")} />
        </div>
        <div className="settings-row">
          <label>Email Address</label>
          <input type="email" value={form.email} onChange={handleChange("email")} />
        </div>
        <div className="settings-row">
          <label>Phone Number</label>
          <input type="tel" value={form.phone} onChange={handleChange("phone")} />
        </div>

        <div style={{ marginTop: 8, marginBottom: 4, fontSize: 13, fontWeight: 700, color: "#0b2a4a" }}>
          Notifications
        </div>

        <div className="settings-toggle-row">
          <div>
            <div className="label">Email notifications</div>
            <div className="sub">Report updates and reminders</div>
          </div>
          <label className="toggle">
            <input type="checkbox" checked={notifications.email} onChange={handleToggle("email")} />
            <span className="toggle-track" />
          </label>
        </div>
        <div className="settings-toggle-row">
          <div>
            <div className="label">SMS notifications</div>
            <div className="sub">Urgent alerts only</div>
          </div>
          <label className="toggle">
            <input type="checkbox" checked={notifications.sms} onChange={handleToggle("sms")} />
            <span className="toggle-track" />
          </label>
        </div>
        <div className="settings-toggle-row">
          <div>
            <div className="label">AI insight alerts</div>
            <div className="sub">When a new insight is ready</div>
          </div>
          <label className="toggle">
            <input type="checkbox" checked={notifications.insights} onChange={handleToggle("insights")} />
            <span className="toggle-track" />
          </label>
        </div>

        <button className="settings-save-btn" type="submit">
          Save Changes
        </button>
        {saved && (
          <span style={{ marginLeft: 12, fontSize: 12, color: "#16a34a", fontWeight: 600 }}>
            Saved!
          </span>
        )}
      </form>
    </>
  );
}

export default Settings;
