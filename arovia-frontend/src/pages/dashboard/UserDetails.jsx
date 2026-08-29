
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
import { useArovia } from "../../context";

function UserDetails() {
  const { user } = useArovia();
  if (!user) return null;

  const fields = [
    { key: "name", label: "Full Name", icon: UserRound },
    { key: "emailId", label: "Email Address", icon: Mail },
    { key: "dob", label: "Date of Birth", icon: Calendar },
    { key: "gender", label: "Gender", icon: UserRound },
    { key: "location", label: "Location", icon: MapPin },
  ];
  const vitals = [
    { label: "Blood Group", value: user.bloodGroup || "—", icon: Droplet, color: "red" },
    { label: "Height", value: user.height ? `${user.height} cm` : "—", icon: Ruler, color: "blue" },
    { label: "Weight", value: user.weight ? `${user.weight} kg` : "—", icon: Weight, color: "purple" },
  ];

  return (
    <>
      <div className="dash-page-head"><h1>User Details</h1><p>Your personal and medical profile information.</p></div>
      <div className="ud-profile-card">
        <div className="ud-avatar">{user.avatar ? <img src={user.avatar} alt={user.name} /> : (user.name || "U").charAt(0)}</div>
        <div className="ud-profile-info"><div className="ud-profile-name">{user.name}</div><div className="ud-profile-meta"><span><IdCard size={12} /> {user.userId}</span><span>Created {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}</span><span>Updated {user.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : "—"}</span></div></div>
      </div>
      <div className="ud-info-container"><div className="ud-grid">
        <div className="ud-card"><div className="ud-card-title">Personal Information</div><div className="ud-field-list">
          {fields.map(({ key, label, icon: Icon }) => <div className="ud-field" key={key}><div className="ud-field-icon"><Icon size={15} /></div><div className="ud-field-body"><div className="ud-field-label">{label}</div><div className="ud-field-value">{user[key] || "—"}</div></div></div>)}
        </div></div>
        <div className="ud-side">
          <div className="ud-card"><div className="ud-card-title">Vitals</div><div className="ud-vitals-grid">{vitals.map(({ label, value, icon: Icon, color }) => <div className="ud-vital" key={label}><div className={`ud-vital-icon ${color}`}><Icon size={16} /></div><div className="ud-vital-value">{value}</div><div className="ud-vital-label">{label}</div></div>)}</div></div>
          <div className="ud-card"><div className="ud-card-title"><ShieldAlert size={15} /> Medical Summary</div>
            <InfoChips icon={Pill} label="Past Chronic Diseases" values={user.pastChronicDiseases} className="amber" />
            <InfoChips label="Family Diseases" values={user.familyDiseases} className="purple" />
          </div>
        </div>
      </div></div>
      <div className="ai-disclaimer-card"><ShieldAlert size={16} /><div><strong>Profile editing:</strong> The supplied API document exposes signup/signin and OAuth profile creation, but no authenticated profile-update endpoint. This page therefore does not fake a save operation.</div></div>
    </>
  );
}

function InfoChips({ icon: Icon, label, values = [], className }) {
  return <div className="ud-med-block"><div className="ud-med-label">{Icon && <Icon size={13} />} {label}</div><div className="ud-chip-row">{(values || []).length ? values.map(v => <span className={`ud-chip ${className}`} key={v}>{v}</span>) : <span className="ud-field-value">None recorded</span>}</div></div>;
}

export default UserDetails;
