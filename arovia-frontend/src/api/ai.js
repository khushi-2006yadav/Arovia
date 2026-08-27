// AiController is currently an empty stub on the backend. These helpers
// call the endpoints the app *expects* to exist (so nothing needs to
// change here once they're implemented) and otherwise fall back to a
// simple, clearly-labeled heuristic computed on the client from the
// user's own test results — never invented data.
import { request } from "./client";

const STATUS_WEIGHT = { CRITICAL: 3, HIGH: 2, LOW: 2, UNKNOWN: 1, NORMAL: 0 };

function heuristicRecordSummary(record) {
  const flagged = (record.testResults || []).filter(
    (t) => t.status && t.status !== "NORMAL"
  );
  const meds = record.medications || [];

  if (record.recordType === "PRESCRIPTION") {
    const names = meds.map((m) => m.medicineName || m.medicine?.medicineName).filter(Boolean);
    return {
      headline: names.length
        ? `${names.length} medicine${names.length > 1 ? "s" : ""} prescribed`
        : "Prescription recorded",
      detail: names.length
        ? `Includes ${names.join(", ")}. Review dosage and instructions below, and confirm anything unclear with your doctor or pharmacist.`
        : "No medications were captured for this prescription yet.",
      confidence: null,
      source: "preview",
    };
  }

  if (!flagged.length) {
    return {
      headline: "All captured values are within the normal reference range.",
      detail: "Nothing in this report needs immediate attention based on the reference ranges provided.",
      confidence: null,
      source: "preview",
    };
  }

  const worst = [...flagged].sort(
    (a, b) => (STATUS_WEIGHT[b.status] || 0) - (STATUS_WEIGHT[a.status] || 0)
  )[0];

  return {
    headline: `${worst.testName} is ${worst.status?.toLowerCase()} (${worst.value ?? "—"} ${worst.unit || ""}).`.trim(),
    detail: `Reference range: ${worst.referenceRange || "not provided"}. ${flagged.length > 1 ? `${flagged.length - 1} other value(s) are also outside range. ` : ""}This is an automated summary, not a diagnosis — please discuss these results with a healthcare professional.`,
    confidence: null,
    source: "preview",
  };
}

/** Best-effort AI summary for a single record; falls back to a heuristic. */
export async function summarizeRecord(record) {
  try {
    const data = await request(`/api/ai/summarize-record/${record.id}`, {
      method: "POST",
      cacheKey: `ai-summary:${record.id}`,
      cacheTtl: 30 * 60 * 1000,
    });
    if (data) return { ...data, source: "live" };
  } catch {
    // fall through
  }
  return heuristicRecordSummary(record);
}

/**
 * Builds a per-test trend (value over time) from every record that
 * contains that test, so "Trends in levels" can be charted without any
 * backend support.
 */
export function buildTrends(records) {
  const byTest = new Map();
  for (const record of records) {
    for (const t of record.testResults || []) {
      if (t.value == null) continue;
      const key = t.testName;
      const list = byTest.get(key) || [];
      list.push({
        date: record.recordDate,
        value: t.value,
        unit: t.unit,
        status: t.status,
        referenceRange: t.referenceRange,
      });
      byTest.set(key, list);
    }
  }
  const trends = [];
  for (const [testName, points] of byTest.entries()) {
    points.sort((a, b) => new Date(a.date) - new Date(b.date));
    if (points.length < 1) continue;
    const latest = points[points.length - 1];
    const first = points[0];
    const delta = points.length > 1 ? latest.value - first.value : 0;
    trends.push({ testName, points, latest, delta });
  }
  return trends.sort((a, b) => a.testName.localeCompare(b.testName));
}

/** High-level suggestions comparing latest flagged values to normal ranges. */
export function buildSuggestions(records) {
  const suggestions = [];
  for (const record of records) {
    for (const t of record.testResults || []) {
      if (t.status && t.status !== "NORMAL") {
        suggestions.push({
          testName: t.testName,
          status: t.status,
          value: t.value,
          unit: t.unit,
          referenceRange: t.referenceRange,
          recordId: record.id,
          recordDate: record.recordDate,
          recordTitle: record.title,
        });
      }
    }
  }
  return suggestions.sort((a, b) => new Date(b.recordDate) - new Date(a.recordDate));
}
