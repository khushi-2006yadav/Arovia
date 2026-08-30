import { useMemo, useState } from "react";
import { TrendingUp, TrendingDown, Minus, Droplet, Zap, HeartPulse, Scale, Flame, Search, ChevronDown } from "lucide-react";
import { useArovia } from "../../context";
import { latestTests, snapshotTrends, valueStatus } from "../../data/healthUtils";

const icons = [Droplet, Zap, HeartPulse, Scale, Flame];

function HealthAnalysis() {
  const { snapshot, records } = useArovia();
  const trends = snapshotTrends(snapshot);
  const tests = latestTests(records);
  const [factor, setFactor] = useState(trends[0]?.name || "");
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const selected = trends.find(t => t.name === factor) || trends[0];
  const currentTest = tests.find(t => t.testName === selected?.name);
  const data = selected?.data || [];
  const latest = data[data.length - 1];
  const previous = data[data.length - 2];
  const status = currentTest?.status?.toLowerCase() || valueStatus(latest?.value, currentTest?.referenceRange);
  const delta = latest && previous ? latest.value - previous.value : 0;
  const Trend = delta > 0 ? TrendingUp : delta < 0 ? TrendingDown : Minus;
  const FilterIcon = icons[Math.max(0, trends.findIndex(t => t.name === selected?.name)) % icons.length];

  const filtered = trends.filter(t => t.name.toLowerCase().includes(search.toLowerCase()));
  const chart = useMemo(() => {
    if (!data.length) return null;
    const values = data.map(d => d.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const pad = Math.max((max - min) * 0.2, 1);
    const lo = min - pad, hi = max + pad, w = 560, h = 180;
    const step = data.length === 1 ? w : w / (data.length - 1);
    const toY = v => h - ((v - lo) / (hi - lo || 1)) * h;
    const points = data.map((d, i) => ({ ...d, x: data.length === 1 ? w / 2 : i * step, y: toY(d.value) }));
    return { w, h, points, line: points.map(p => `${p.x},${p.y}`).join(" "), area: `0,${h} ${points.map(p => `${p.x},${p.y}`).join(" ")} ${w},${h}` };
  }, [data]);

  return <>
    <div className="dash-page-head"><h1>Health Analysis</h1><p>Trends come from the backend HealthSnapshot and your saved test results.</p></div>
    {!trends.length ? <div className="empty-state"><h3>No health trends yet</h3><p>Add a report with test results to populate this section.</p></div> : <>
      <div className="ha-dropdown-container">
        <button className="ha-dropdown-toggle" onClick={() => setOpen(v => !v)}><span><FilterIcon size={16}/> {selected?.name}</span><ChevronDown size={16}/></button>
        {open && <div className="ha-dropdown-menu"><div className="ha-dropdown-search"><Search size={14}/><input autoFocus placeholder="Search parameters..." value={search} onChange={e => setSearch(e.target.value)} /></div>{filtered.map((t, i) => { const I = icons[i % icons.length]; return <button className={`ha-dropdown-item ${t.name === selected?.name ? "selected" : ""}`} key={t.name} onClick={() => { setFactor(t.name); setOpen(false); setSearch(""); }}><I size={14}/>{t.name}</button>; })}</div>}
      </div>
      <div className="ha-panel">
        <div className="ha-summary-row">
          <div className="ha-summary-card tint-blue"><div className="ha-summary-label">Latest reading</div><div className="ha-summary-value">{latest?.value ?? "—"} <span>{currentTest?.unit || ""}</span></div><div className="ha-summary-sub">{latest?.date || "—"}</div></div>
          <div className="ha-summary-card"><div className="ha-summary-label">Reference range</div><div className="ha-summary-value small">{currentTest?.referenceRange || "Not provided"}</div><div className={`ha-status-pill ${status}`}>{status === "normal" ? "Within range" : status === "low" ? "Low" : status === "high" ? "High" : status === "critical" ? "Critical" : "Not available"}</div></div>
          <div className="ha-summary-card"><div className="ha-summary-label">Change since last reading</div><div className="ha-summary-value trend"><Trend size={18}/>{Math.abs(delta).toFixed(2)} <span>{currentTest?.unit || ""}</span></div><div className="ha-summary-sub">vs {previous?.date || "—"}</div></div>
        </div>
        <div className="ha-chart-card"><div className="ha-chart-head"><h3>{selected?.name} over time</h3><div className={`ha-chart-badge ${status}`}>{status || "unknown"}</div></div>
          <div className="ha-chart-wrap">{chart && <svg viewBox={`0 0 ${chart.w} ${chart.h}`} width="100%" height="200"><defs><linearGradient id="aroviaTrendFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#2f7fe0" stopOpacity=".22"/><stop offset="100%" stopColor="#2f7fe0" stopOpacity="0"/></linearGradient></defs><polygon points={chart.area} fill="url(#aroviaTrendFill)"/><polyline points={chart.line} fill="none" stroke="#2f7fe0" strokeWidth="2.5"/>{chart.points.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r="4" fill="#fff" stroke="#2f7fe0" strokeWidth="2.5"/> )}</svg>}
            <div className="ha-chart-dates">{data.map(d => <span key={d.date}>{d.date}</span>)}</div>
          </div>
          <div className="ha-chart-legend"><span><i className="dot point"/> Backend snapshot trend</span><span>Reference: {currentTest?.referenceRange || "not provided"}</span></div>
        </div>
      </div>
    </>}
  </>;
}

export default HealthAnalysis;
