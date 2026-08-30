import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserRound, Mail, Lock, Calendar, MapPin, ArrowLeft } from "lucide-react";
import { api } from "../api";
import "./login.css";

const initial = {
  name: "",
  emailId: "",
  password: "",
  dob: "",
  bloodGroup: "",
  gender: "",
  weight: "",
  height: "",
  location: "",
  pastChronicDiseases: "",
  familyDiseases: "",
};

function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initial);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.signup({
        name: form.name,
        emailId: form.emailId,
        password: form.password,
        dob: form.dob || null,
        bloodGroup: form.bloodGroup || null,
        gender: form.gender || null,
        weight: form.weight ? Number(form.weight) : null,
        height: form.height ? Number(form.height) : null,
        location: form.location || null,
        pastChronicDiseases: form.pastChronicDiseases.split(",").map((x) => x.trim()).filter(Boolean),
        familyDiseases: form.familyDiseases.split(",").map((x) => x.trim()).filter(Boolean),
      });
      navigate("/login", { state: { message: "Account created. Please sign in." } });
    } catch (err) {
      setError(err.message || "Unable to create account.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <header className="login-topbar">
        <Link to="/login" className="login-back-link"><ArrowLeft size={14} /> Back to login</Link>
        <div className="login-brand"><div className="login-brand-name">AROVIA</div><div className="login-brand-tag">Understand. Track. Care.</div></div>
      </header>
      <div className="login-body" style={{ gridTemplateColumns: "minmax(0, 1fr)" }}>
        <div className="login-card" style={{ maxWidth: 760, width: "100%", margin: "0 auto" }}>
          <h2 className="login-title">Create your Arovia account</h2>
          <p className="login-subtitle">These fields map directly to the backend SignupDto.</p>
          {error && <div className="login-error">{error}</div>}
          <form onSubmit={submit} className="signup-grid">
            <Field icon={UserRound} label="Full name" value={form.name} onChange={set("name")} required />
            <Field icon={Mail} label="Email" type="email" value={form.emailId} onChange={set("emailId")} required />
            <Field icon={Lock} label="Password" type="password" value={form.password} onChange={set("password")} required />
            <Field icon={Calendar} label="Date of birth" type="date" value={form.dob} onChange={set("dob")} />
            <label className="login-label">Blood group<select className="login-input" value={form.bloodGroup} onChange={set("bloodGroup")}><option value="">Select</option>{["A_POSITIVE","A_NEGATIVE","B_POSITIVE","B_NEGATIVE","AB_POSITIVE","AB_NEGATIVE","O_POSITIVE","O_NEGATIVE"].map(v => <option key={v}>{v}</option>)}</select></label>
            <label className="login-label">Gender<select className="login-input" value={form.gender} onChange={set("gender")}><option value="">Select</option><option>MALE</option><option>FEMALE</option><option>OTHER</option></select></label>
            <Field label="Weight (kg)" type="number" value={form.weight} onChange={set("weight")} />
            <Field label="Height (cm)" type="number" value={form.height} onChange={set("height")} />
            <Field icon={MapPin} label="Location" value={form.location} onChange={set("location")} />
            <Field label="Past chronic diseases" value={form.pastChronicDiseases} onChange={set("pastChronicDiseases")} placeholder="e.g. asthma, diabetes" />
            <Field label="Family diseases" value={form.familyDiseases} onChange={set("familyDiseases")} placeholder="comma separated" />
            <div className="signup-actions"><button className="login-submit-btn" type="submit" disabled={loading}>{loading ? "Creating…" : "Create account →"}</button></div>
          </form>
        </div>
      </div>
    </div>
  );
}

function Field({ icon: Icon, label, ...props }) {
  return <label className="login-label">{label}<div className="login-input-wrap">{Icon && <span className="login-input-icon"><Icon size={14} /></span>}<input className="login-input" {...props} /></div></label>;
}

export default Signup;
