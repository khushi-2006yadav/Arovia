const BLOOD_GROUPS = [
  "A_POSITIVE",
  "A_NEGATIVE",
  "B_POSITIVE",
  "B_NEGATIVE",
  "AB_POSITIVE",
  "AB_NEGATIVE",
  "O_POSITIVE",
  "O_NEGATIVE",
];

const GENDERS = ["MALE", "FEMALE", "OTHER"];

function label(v) {
  return v.replace("_", " ");
}

export default function HealthProfileFields({ profile, setProfile }) {
  function set(field, value) {
    setProfile((p) => ({ ...p, [field]: value }));
  }

  return (
    <>
      <div className="form-grid-2">
        <div>
          <label className="login-label">Date of Birth</label>
          <input
            type="date"
            className="login-input plain"
            value={profile.dob}
            onChange={(e) => set("dob", e.target.value)}
          />
        </div>
        <div>
          <label className="login-label">Gender</label>
          <select className="login-input plain" value={profile.gender} onChange={(e) => set("gender", e.target.value)}>
            <option value="">Select…</option>
            {GENDERS.map((g) => (
              <option key={g} value={g}>
                {label(g)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-grid-2">
        <div>
          <label className="login-label">Blood Group</label>
          <select
            className="login-input plain"
            value={profile.bloodGroup}
            onChange={(e) => set("bloodGroup", e.target.value)}
          >
            <option value="">Select…</option>
            {BLOOD_GROUPS.map((b) => (
              <option key={b} value={b}>
                {label(b)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="login-label">Location</label>
          <input
            className="login-input plain"
            placeholder="City, Country"
            value={profile.location}
            onChange={(e) => set("location", e.target.value)}
          />
        </div>
      </div>

      <div className="form-grid-2">
        <div>
          <label className="login-label">Weight (kg)</label>
          <input
            type="number"
            className="login-input plain"
            placeholder="e.g. 62"
            value={profile.weight}
            onChange={(e) => set("weight", e.target.value)}
          />
        </div>
        <div>
          <label className="login-label">Height (cm)</label>
          <input
            type="number"
            className="login-input plain"
            placeholder="e.g. 165"
            value={profile.height}
            onChange={(e) => set("height", e.target.value)}
          />
        </div>
      </div>

      <label className="login-label">Past Chronic Diseases (comma separated)</label>
      <input
        className="login-input plain"
        placeholder="e.g. Asthma, Hypertension"
        value={profile.pastChronicDiseases}
        onChange={(e) => set("pastChronicDiseases", e.target.value)}
      />

      <label className="login-label" style={{ marginTop: 14 }}>
        Family Diseases (comma separated)
      </label>
      <input
        className="login-input plain"
        placeholder="e.g. Diabetes, Heart Disease"
        value={profile.familyDiseases}
        onChange={(e) => set("familyDiseases", e.target.value)}
      />
    </>
  );
}
