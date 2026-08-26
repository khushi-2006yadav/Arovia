import { useState } from "react";
import {
  UserRound,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Droplet,
  Ruler,
  Weight,
  ShieldAlert,
  Pill,
  Stethoscope,
  Users,
  Pencil,
  Check,
  IdCard,
} from "lucide-react";
import { currentUser, emergencyInfo } from "../../data/mockData";

function UserDetails() {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ ...currentUser });

  const handleChange = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const fields = [
    { key: "name", label: "Full Name", icon: UserRound },
    { key: "email", label: "Email Address", icon: Mail },
    { key: "phone", label: "Phone Number", icon: Phone },
    { key: "dob", label: "Date of Birth", icon: Calendar },
    { key: "gender", label: "Gender", icon: UserRound },
    { key: "location", label: "Location", icon: MapPin },
  ];

  const vitals = [
    {
      label: "Blood Group",
      value: form.bloodGroup,
      icon: Droplet,
      color: "red",
    },
    { label: "Height", value: form.height, icon: Ruler, color: "blue" },
    { label: "Weight", value: form.weight, icon: Weight, color: "purple" },
  ];

  return (
    <>
      <div className="dash-page-head">
        <h1>User Details</h1>
        <p>Your personal and medical profile information.</p>
      </div>

      {/* Profile header card */}
      <div className="ud-profile-card">
        <div className="ud-avatar">
          {form.avatar ? (
            <img src={form.avatar} alt={form.name} />
          ) : (
            form.name.charAt(0)
          )}
        </div>
        <div className="ud-profile-info">
          <div className="ud-profile-name">{form.name}</div>
          <div className="ud-profile-meta">
            <span>
              <IdCard size={12} strokeWidth={2} /> {form.userId}
            </span>
            <span>Created {form.createdAt}</span>
            <span>Updated {form.updatedAt}</span>
          </div>
        </div>
        <button
          className={`ud-edit-btn ${editing ? "saving" : ""}`}
          onClick={() => setEditing((e) => !e)}
        >
          {editing ? (
            <>
              <Check size={15} strokeWidth={2} /> Save Changes
            </>
          ) : (
            <>
              <Pencil size={15} strokeWidth={2} /> Edit Profile
            </>
          )}
        </button>
      </div>

      <div className="ud-grid">
        {/* Personal info */}
        <div className="ud-card">
          <div className="ud-card-title">Personal Information</div>
          <div className="ud-field-list">
            {fields.map(({ key, label, icon: Icon }) => (
              <div className="ud-field" key={key}>
                <div className="ud-field-icon">
                  <Icon size={15} strokeWidth={2} />
                </div>
                <div className="ud-field-body">
                  <div className="ud-field-label">{label}</div>
                  {editing ? (
                    <input
                      className="ud-field-input"
                      value={form[key]}
                      onChange={handleChange(key)}
                    />
                  ) : (
                    <div className="ud-field-value">{form[key]}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Vitals + medical summary */}
        <div className="ud-side">
          <div className="ud-card">
            <div className="ud-card-title">Vitals</div>
            <div className="ud-vitals-grid">
              {vitals.map(({ label, value, icon: Icon, color }) => (
                <div className="ud-vital" key={label}>
                  <div className={`ud-vital-icon ${color}`}>
                    <Icon size={16} strokeWidth={2} />
                  </div>
                  <div className="ud-vital-value">{value}</div>
                  <div className="ud-vital-label">{label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="ud-card">
            <div className="ud-card-title">
              <ShieldAlert size={15} strokeWidth={2} /> Medical Summary
            </div>

            <div className="ud-med-block">
              <div className="ud-med-label">Allergies</div>
              <div className="ud-chip-row">
                {emergencyInfo.allergies.map((a) => (
                  <span className="ud-chip red" key={a}>
                    {a}
                  </span>
                ))}
              </div>
            </div>

            <div className="ud-med-block">
              <div className="ud-med-label">
                <Stethoscope size={13} strokeWidth={2} /> Past Chronic Diseases
              </div>
              <div className="ud-chip-row">
                {form.pastChronicDiseases.map((c) => (
                  <span className="ud-chip amber" key={c}>
                    {c}
                  </span>
                ))}
              </div>
            </div>

            <div className="ud-med-block">
              <div className="ud-med-label">
                <Users size={13} strokeWidth={2} /> Family Diseases
              </div>
              <div className="ud-chip-row">
                {form.familyDiseases.map((f) => (
                  <span className="ud-chip purple" key={f}>
                    {f}
                  </span>
                ))}
              </div>
            </div>

            <div className="ud-med-block">
              <div className="ud-med-label">
                <Pill size={13} strokeWidth={2} /> Current Medications
              </div>
              <div className="ud-chip-row">
                {emergencyInfo.medications.map((m) => (
                  <span className="ud-chip blue" key={m}>
                    {m}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default UserDetails;
