import { useState } from "react";
import { useLocation,useNavigate } from "react-router-dom";
import { Calendar,MapPin } from "lucide-react";
import {api} from "../api";
import { useArovia } from "../context";
import "./login.css";


const initial={
  dob:"",
  bloodGroup:"",
  gender:"",
  weight:"",
  height:"",
  location:"",
  pastChronicDiseases:"",
  familyDiseases:"",
};

function CompleteProfile(){
  const navigate=useNavigate();
  const location=useLocation();
  const {setUser}=useArovia();

  const token=location.state?.token;

  const[form,setForm]=useState(initial);
  const [error,setError]=useState("");
  const [loading,setLoading]=useState(false);

  const set=(key)=>(e)=>setForm((f)=>({...f,[key]:e.target.value}));

  if(!token){
    navigate("/login",{replace:true});
    return null;
  }

  async function submit(e){
    e.preventDefault();
    setError("");
    setLoading(true);
    try{
      const user=await api.oauthSignup({
        token, 
        dob:form.dob||null,
        bloodGroup:form.bloodGroup || null,
        gender:form.gender||null,
        weight:form.weight ? Number(form.weight):null,
        height:form.height?Number(form.height):null,
        location:form.location||null,
        pastChronicDiseases: form.pastChronicDiseases.split(",").map((x) => x.trim()).filter(Boolean),
        familyDiseases: form.familyDiseases.split(",").map((x) => x.trim()).filter(Boolean),
      });
      setUser(user);
      navigate("/dashboard",{replace:true});
    } catch(err){
      setError(err.message || "Unable to save your profile.");
    }finally {
      setLoading(false);
    }
  }

  return(
    <div className="login-page">
      <div className="login-body" style={{ gridTemplateColumns: "minmax(0, 1fr)" }}>
        <div className="login-card" style={{ maxWidth: 760, width: "100%", margin: "0 auto" }}>
          <h2 className="login-title">Complete your profile</h2>
          <p className="login-subtitle">
            You're signed in with Google. Add a few health details so Arovia can track your snapshot correctly.
          </p>
          {error && <div className="login-error">{error}</div>}
          <form onSubmit={submit} className="signup-grid">
            <Field icon={Calendar} label="Date of birth" type="date" value={form.dob} onChange={set("dob")} />
            <label className="login-label">
              Blood group
              <select className="login-input" value={form.bloodGroup} onChange={set("bloodGroup")}>
                <option value="">Select</option>
                {["A_POSITIVE", "A_NEGATIVE", "B_POSITIVE", "B_NEGATIVE", "AB_POSITIVE", "AB_NEGATIVE", "O_POSITIVE", "O_NEGATIVE"].map((v) => (
                  <option key={v}>{v}</option>
                ))}
              </select>
            </label>
            <label className="login-label">
              Gender
              <select className="login-input" value={form.gender} onChange={set("gender")}>
                <option value="">Select</option>
                <option>MALE</option>
                <option>FEMALE</option>
                <option>OTHER</option>
              </select>
            </label>
            <Field label="Weight (kg)" type="number" value={form.weight} onChange={set("weight")} />
            <Field label="Height (cm)" type="number" value={form.height} onChange={set("height")} />
            <Field icon={MapPin} label="Location" value={form.location} onChange={set("location")} />
            <Field
              label="Past chronic diseases"
              value={form.pastChronicDiseases}
              onChange={set("pastChronicDiseases")}
              placeholder="e.g. asthma, diabetes"
            />
            <Field
              label="Family diseases"
              value={form.familyDiseases}
              onChange={set("familyDiseases")}
              placeholder="comma separated"
            />
            <div className="signup-actions">
              <button className="login-submit-btn" type="submit" disabled={loading}>
                {loading ? "Saving…" : "Save and continue →"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function Field({ icon: Icon, label, ...props }) {
  return (
    <label className="login-label">
      {label}
      <div className="login-input-wrap">
        {Icon && <span className="login-input-icon"><Icon size={14} /></span>}
        <input className="login-input" {...props} />
      </div>
    </label>
  );
}

export default CompleteProfile;
