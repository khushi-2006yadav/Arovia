import { useState } from "react";
import { Pencil, Save, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import HealthProfileFields from "../../components/HealthProfileFields";

function initials(name = "") {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function fmtDate(d) {
  if (!d) return "Not set";
  try {
    return new Date(d).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
  } catch {
    return d;
  }
}

export default function Profile() {
  const { user, updateUser } = useAuth();
  const toast = useToast();
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState({
    dob: user?.dob || "",
    bloodGroup: user?.bloodGroup || "",
    gender: user?.gender || "",
    weight: user?.weight ?? "",
    height: user?.height ?? "",
    location: user?.location || "",
    pastChronicDiseases: (user?.pastChronicDiseases || []).join(", "),
    familyDiseases: (user?.familyDiseases || []).join(", "),
  });

  function handleSave(e) {
    e.preventDefault();
    updateUser({
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
    setEditing(false);
    toast.success("Profile updated on this device. Backend sync coming soon.");
  }

  return (
    <div>
      <div className="page-head">
        <div>
          <div className="page-title">Profile</div>
          <div className="page-sub">Your account and health details.</div>
        </div>
        {!editing && (
          <button className="btn-outline" onClick={() => setEditing(true)}>
            <Pencil size={14} /> Edit Health Profile
          </button>
        )}
      </div>

      <div className="ar-card">
        <div className="profile-header">
          <div className="profile-avatar">{initials(user?.name)}</div>
          <div>
            <div className="profile-name">{user?.name}</div>
            <div className="profile-email">{user?.emailId}</div>
          </div>
        </div>

        {!editing ? (
          <div className="detail-grid">
            <div className="detail-item">
              <div className="d-label">Date of Birth</div>
              <div className="d-value">{fmtDate(user?.dob)}</div>
            </div>
            <div className="detail-item">
              <div className="d-label">Gender</div>
              <div className="d-value">{user?.gender || "Not set"}</div>
            </div>
            <div className="detail-item">
              <div className="d-label">Blood Group</div>
              <div className="d-value">{user?.bloodGroup?.replace("_", " ") || "Not set"}</div>
            </div>
            <div className="detail-item">
              <div className="d-label">Weight</div>
              <div className="d-value">{user?.weight ? `${user.weight} kg` : "Not set"}</div>
            </div>
            <div className="detail-item">
              <div className="d-label">Height</div>
              <div className="d-value">{user?.height ? `${user.height} cm` : "Not set"}</div>
            </div>
            <div className="detail-item">
              <div className="d-label">Location</div>
              <div className="d-value">{user?.location || "Not set"}</div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSave}>
            <HealthProfileFields profile={profile} setProfile={setProfile} />
            <div className="form-actions">
              <button type="button" className="btn-outline" onClick={() => setEditing(false)}>
                <X size={14} /> Cancel
              </button>
              <button type="submit" className="btn-teal">
                <Save size={14} /> Save Changes
              </button>
            </div>
          </form>
        )}
      </div>

      {!editing && (
        <div className="ar-card">
          <div className="ar-card-title" style={{ marginBottom: 10 }}>Chronic Conditions</div>
          {user?.pastChronicDiseases?.length ? (
            user.pastChronicDiseases.map((d) => (
              <span className="tag-pill" key={d}>{d}</span>
            ))
          ) : (
            <div style={{ fontSize: 12.5, color: "#94a3b8" }}>None recorded.</div>
          )}

          <div className="ar-card-title" style={{ margin: "18px 0 10px" }}>Family History</div>
          {user?.familyDiseases?.length ? (
            user.familyDiseases.map((d) => (
              <span className="tag-pill" key={d}>{d}</span>
            ))
          ) : (
            <div style={{ fontSize: 12.5, color: "#94a3b8" }}>None recorded.</div>
          )}
        </div>
      )}
    </div>
  );
}
