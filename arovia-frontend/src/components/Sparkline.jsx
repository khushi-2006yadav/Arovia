export default function Sparkline({ points, width = 260, height = 46, color = "#0d9488" }) {
  if (!points || points.length < 2) {
    return (
      <div style={{ fontSize: 11.5, color: "#94a3b8", padding: "8px 0" }}>
        Not enough data points yet to plot a trend.
      </div>
    );
  }

  const values = points.map((p) => p.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const stepX = width / (points.length - 1);

  const coords = points.map((p, i) => {
    const x = i * stepX;
    const y = height - ((p.value - min) / range) * (height - 8) - 4;
    return { x, y, status: p.status };
  });

  const linePoints = coords.map((c) => `${c.x},${c.y}`).join(" ");
  const areaPoints = `0,${height} ${linePoints} ${width},${height}`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} width="100%" height={height} className="sparkline-wrap">
      <polygon points={areaPoints} fill={color} opacity="0.12" />
      <polyline points={linePoints} fill="none" stroke={color} strokeWidth="2" />
      {coords.map((c, i) => (
        <circle
          key={i}
          cx={c.x}
          cy={c.y}
          r="2.6"
          fill={c.status && c.status !== "NORMAL" ? "#ef4444" : color}
        />
      ))}
    </svg>
  );
}
