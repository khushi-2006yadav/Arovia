import { useMemo, useState } from "react";
import { Clock, ChevronDown, ChevronUp, Sparkles, PackageOpen, MapPin, RefreshCcw } from "lucide-react";
import { api } from "../../api";
import { useArovia } from "../../context";
import { medicationItems } from "../../data/healthUtils";

function Medicines() {
  const { user, records } = useArovia();
  const meds = useMemo(() => medicationItems(records), [records]);
  const [filter, setFilter] = useState("active");
  
  // Track which card is expanded
  const [expanded, setExpanded] = useState(null);
  
  // New states for fetching and storing medicine details from the API
  const [fetchedDetails, setFetchedDetails] = useState({});
  const [loadingDetails, setLoadingDetails] = useState({});
  
  const [substitute, setSubstitute] = useState({});
  const [message, setMessage] = useState("");

  const visible = meds.filter(m => m.status === filter);

  // Updated function to handle expanding the card and fetching API data
  const handleExpand = async (m) => {
    const isExpanding = expanded !== m.id;
    setExpanded(isExpanding ? m.id : null);

    // Only fetch if we are expanding and haven't fetched this medicine's details yet
    if (isExpanding && !fetchedDetails[m.id]) {
      setLoadingDetails(prev => ({ ...prev, [m.id]: true }));
      try {
        const details = await api.findMedicine(m.name);
        setFetchedDetails(prev => ({ ...prev, [m.id]: details }));
      } catch (err) {
        console.error("Failed to fetch medicine details:", err);
      } finally {
        setLoadingDetails(prev => ({ ...prev, [m.id]: false }));
      }
    }
  };

  async function addSubstitute(m) {
    const name = substitute[m.id]?.trim();
    if (!name) { setMessage("Enter the substitute name first."); return; }
    try {
      // Use the fetched details if available, otherwise fallback to local data
      const details = fetchedDetails[m.id] || {};
      await api.addSubstitute(user.userId, name, { 
        medicineName: m.name, 
        activeSalts: details.activeSalts || m.genericName, 
        uses: details.uses || m.uses, 
        sideEffects: details.sideEffects || m.sideEffects 
      });
      setMessage(`Substitute “${name}” sent to the backend.`);
    } catch (err) { 
      setMessage(err.message || "Unable to add substitute."); 
    }
  }

  function pharmacy(e) {
  // 1. Add this to stop the page from reloading!
  if (e && e.preventDefault) {
    e.preventDefault(); 
  }

  try {
    const location = user.location || "";
    if (!location) {
      throw new Error("User location is not available.");
    }
    
    const query = `nearest Jan Aushadhi Kendra ${location}`;
    const googleUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    
    window.open(googleUrl, '_blank');
  } catch (err) {
    setMessage(err.message || "Unable to open nearby pharmacy search.");
  }
}

  return (
    <div className="page-animate">
      <div className="dash-page-head">
        <h1>Medication</h1>
        <p>Medication details are derived from the medications embedded in your saved MedicalRecord responses.</p>
      </div>
      
      <div className="med-filter-tabs">
        <button className={`med-filter-tab ${filter === "active" ? "active" : ""}`} onClick={() => setFilter("active")}>
          Active <span className="count">({meds.filter(m=>m.status === "active").length})</span>
        </button>
        <button className={`med-filter-tab ${filter === "discontinued" ? "active" : ""}`} onClick={() => setFilter("discontinued")}>
          Completed <span className="count">({meds.filter(m=>m.status === "discontinued").length})</span>
        </button>
        <button type="button" className="settings-save-btn" style={{marginLeft:"auto"}} onClick={pharmacy}>
          <MapPin size={13}/> Nearest pharmacy
        </button>
      </div>
      
      {message && <div className="login-success">{message}</div>}
      
      <div className="medicine-list">
        {!visible.length ? (
          <div className="empty-state">
            <PackageOpen size={32}/>
            <h3>No {filter} medicines</h3>
            <p>Medication entries appear after a prescription is saved to your records.</p>
          </div>
        ) : visible.map(m => { 
          const open = expanded === m.id; 
          const details = fetchedDetails[m.id]; // Get the API details if loaded
          
          return (
            <div className="med-card" key={m.id}>
              
              <div className="med-card-top" onClick={() => handleExpand(m)}>
                <div>
                  <div className="med-card-heading">
                    <span className="name">{m.name}</span>
                    <span className={`badge status-${m.status}`}>
                      {m.status === "active" ? "ACTIVE" : "COMPLETED"}
                    </span>
                  </div>
                  {/* Show fetched salts in header if available, else local */}
                  <div className="generic-name">{details?.activeSalts || m.genericName}</div>
                  <div className="dose">{m.dosage}</div>
                  <div className="freq"><Clock size={13}/> {m.frequency} · {m.route}</div>
                  {m.status === "active" && (
                    <div className="med-remaining">
                      <strong>{m.duration} days</strong> course from {m.startDate || "—"}
                    </div>
                  )}
                </div>
                <button className="med-expand-btn">
                  {open ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
                </button>
              </div>

              {open && (
                <div className="med-detail">
                  {loadingDetails[m.id] ? (
                    <div style={{ color: "#64748b", fontSize: "14px", padding: "10px 0", fontStyle: "italic" }}>
                      Fetching medicine details from database...
                    </div>
                  ) : (
                    <>
                      <div className="med-detail-label">Generic Name (Active Salts)</div>
                      <p>{details?.activeSalts || m.genericName || "Unknown"}</p>
                      <div className="med-detail-label">Uses</div>
                      <p>{details?.uses || m.uses || "Unknown"}</p>
                      <div className="med-detail-label">Side Effects</div>
                      <p>{details?.sideEffects || m.sideEffects || "Unknown"}</p>
                    </>
                  )}

                  <div className="med-detail-label">Instructions</div>
                  <p>{m.instructions || "None"}</p>

                  <div className="substitute-box">
                    <div className="info">
                      <strong>Add substitute</strong>
                      <div style={{fontSize:12}}>The API accepts a substitute name plus the Medicine object.</div>
                    </div>
                    <input 
                      className="login-input" 
                      placeholder="Substitute medicine name" 
                      value={substitute[m.id] || ""} 
                      onChange={e => setSubstitute(s => ({...s, [m.id]: e.target.value}))}
                    />
                    <button className="substitute-switch-btn" onClick={() => addSubstitute(m)}>
                      <RefreshCcw size={13}/> Send
                    </button>
                  </div>
                </div>
              )}
            </div>
          ); 
        })}
      </div>
      
      <div className="ai-disclaimer-card">
        <Sparkles size={16}/>
        <div><strong>Medication safety:</strong> The supplied API exposes substitute lookup/write and pharmacy redirect, but no endpoint for reporting side-effects or manually changing medication status. The frontend does not pretend those unsupported actions are persisted.</div>
      </div>
    </div>
  );
}

export default Medicines;