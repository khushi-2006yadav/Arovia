export function normalizeSnapshot(snapshot) {
  return snapshot || { trends: {}, activeDiseases: [] };
}

export function snapshotTrends(snapshot) {
  const trends = snapshot?.trends || {};
  return Object.entries(trends)
    .map(([name, stamps]) => ({
      name,
      data: (Array.isArray(stamps) ? stamps : [])
        .filter((s) => s && s.value !== null && s.value !== undefined)
        .sort((a, b) => String(a.date || "").localeCompare(String(b.date || "")))
        .map((s) => ({ value: Number(s.value), date: s.date || "" })),
    }))
    .filter((x) => x.data.length > 0);
}

export function parseReferenceRange(referenceRange) {
  if (!referenceRange) return null;
  const text = String(referenceRange).trim();
  const nums = text.match(/-?\d+(?:\.\d+)?/g)?.map(Number) || [];
  if (nums.length >= 2) return { low: nums[0], high: nums[1] };
  if (nums.length === 1 && text.includes("<")) return { low: null, high: nums[0] };
  if (nums.length === 1 && text.includes(">")) return { low: nums[0], high: null };
  return null;
}

export function valueStatus(value, referenceRange) {
  const range = parseReferenceRange(referenceRange);
  if (!range || value === null || value === undefined) return "unknown";
  if (range.low !== null && value < range.low) return "low";
  if (range.high !== null && value > range.high) return "high";
  return "normal";
}

export function formatDate(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
}

export function medicationItems(records) {
  const map = new Map();
  const now = new Date();

  (Array.isArray(records) ? records : []).forEach((record) => {
    (record.medications || []).forEach((med, index) => {
      const medicine = med.medicine || {};
      const name = medicine.medicineName || `Medicine ${index + 1}`;
      const key = name.toLowerCase();
      const start = record.recordDate ? new Date(`${record.recordDate}T00:00:00`) : null;
      const end = start && Number.isFinite(Number(med.duration))
        ? new Date(start.getTime() + Number(med.duration) * 86400000)
        : null;
      const item = {
        id: `${record.id || record.recordDate || "record"}-${key}`,
        name,
        genericName: medicine.activeSalts || "Composition not provided",
        uses: medicine.uses || "Unknown",
        sideEffects: medicine.sideEffects || "Unknown",
        dosage: med.dosage || "—",
        frequency: med.frequency || "—",
        route: med.route || "—",
        duration: med.duration ?? 0,
        instructions: med.instructions || "—",
        confidence: med.confidence,
        startDate: record.recordDate,
        endDate: end?.toISOString(),
        status: end && end < now ? "discontinued" : "active",
        recordId: record.id,
      };
      const previous = map.get(key);
      if (!previous || String(previous.startDate || "") < String(item.startDate || "")) {
        map.set(key, item);
      }
    });
  });

  return [...map.values()].sort((a, b) => String(b.startDate || "").localeCompare(String(a.startDate || "")));
}

export function latestTests(records) {
  const byName = new Map();
  (Array.isArray(records) ? records : []).forEach((record) => {
    (record.testResults || []).forEach((test) => {
      const key = String(test.testName || "").toLowerCase();
      if (!key) return;
      const current = byName.get(key);
      const candidate = { ...test, recordDate: record.recordDate, recordId: record.id };
      if (!current || String(current.recordDate || "") < String(candidate.recordDate || "")) {
        byName.set(key, candidate);
      }
    });
  });
  return [...byName.values()];
}
