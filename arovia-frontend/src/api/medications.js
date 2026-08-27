// MedicineController on the backend is currently a stub (it only has a
// commented-out `POST /api/medication/fetchMedicine/{medicineName}`).
// This module calls that exact contract first so the app "just works"
// the moment the backend team fills it in, and falls back to a small
// bundled reference table otherwise, so the UI is always usable.
import { request } from "./client";

// ---- Bundled fallback reference data (used only if the backend call fails) ----
const FALLBACK_MEDICINES = {
  paracetamol: {
    medicineName: "Paracetamol",
    activeSalts: "Paracetamol (Acetaminophen)",
    uses: "Fever, mild to moderate pain relief",
    sideEffects: "Nausea, rash (rare); avoid exceeding recommended dose",
    genericOf: null,
    typicalPricePerStrip: 35,
  },
  crocin: {
    medicineName: "Crocin",
    activeSalts: "Paracetamol (Acetaminophen)",
    uses: "Fever, mild to moderate pain relief",
    sideEffects: "Nausea, rash (rare); avoid exceeding recommended dose",
    genericOf: "paracetamol",
    typicalPricePerStrip: 120,
  },
  azithromycin: {
    medicineName: "Azithromycin",
    activeSalts: "Azithromycin",
    uses: "Bacterial infections (respiratory, skin, ear)",
    sideEffects: "Diarrhea, nausea, abdominal pain",
    genericOf: null,
    typicalPricePerStrip: 65,
  },
  metformin: {
    medicineName: "Metformin",
    activeSalts: "Metformin Hydrochloride",
    uses: "Type 2 diabetes — blood sugar control",
    sideEffects: "GI upset, vitamin B12 deficiency (long term use)",
    genericOf: null,
    typicalPricePerStrip: 40,
  },
  atorvastatin: {
    medicineName: "Atorvastatin",
    activeSalts: "Atorvastatin Calcium",
    uses: "Lowering cholesterol / cardiovascular risk reduction",
    sideEffects: "Muscle pain, liver enzyme changes (rare)",
    genericOf: null,
    typicalPricePerStrip: 55,
  },
};

function normalizeKey(name = "") {
  return name.trim().toLowerCase();
}

/** Looks up a medicine by name — real backend first, bundled data as fallback. */
export async function getMedicineInfo(medicineName) {
  try {
    const data = await request(
      `/api/medication/fetchMedicine/${encodeURIComponent(medicineName)}`,
      { method: "POST", cacheKey: `medicine:${medicineName}`, cacheTtl: 30 * 60 * 1000 }
    );
    if (data) return { ...data, source: "live" };
  } catch {
    // fall through to bundled data
  }
  const fallback = FALLBACK_MEDICINES[normalizeKey(medicineName)];
  if (fallback) return { ...fallback, source: "preview" };
  return {
    medicineName,
    activeSalts: "Not available yet",
    uses: "Details for this medicine aren't available yet.",
    sideEffects: "Not available yet",
    genericOf: null,
    typicalPricePerStrip: null,
    source: "unknown",
  };
}

/** Finds cheaper alternatives that share the same active salt. */
export async function findAlternatives(medicineName) {
  const info = await getMedicineInfo(medicineName);
  const saltKey = normalizeKey(info.activeSalts || "");
  const alternatives = Object.values(FALLBACK_MEDICINES).filter(
    (m) =>
      normalizeKey(m.medicineName) !== normalizeKey(medicineName) &&
      normalizeKey(m.activeSalts) === saltKey &&
      saltKey
  );
  return { info, alternatives };
}

// ---------------- Local status & side-effect tracking ----------------
// Until the backend's Medication/MedicationHistory endpoints exist, we
// track per-user medicine status (ACTIVE/DISCONTINUED) and any
// self-reported side effects locally, keyed by medicine name.
const overridesKey = (userId) => `arovia_medicine_overrides_${userId}`;

export function getMedicineOverrides(userId) {
  try {
    return JSON.parse(localStorage.getItem(overridesKey(userId))) || {};
  } catch {
    return {};
  }
}

function saveOverrides(userId, overrides) {
  localStorage.setItem(overridesKey(userId), JSON.stringify(overrides));
}

export function setMedicineStatus(userId, medicineName, status) {
  const overrides = getMedicineOverrides(userId);
  const key = normalizeKey(medicineName);
  overrides[key] = { ...(overrides[key] || {}), status };
  saveOverrides(userId, overrides);
  return overrides[key];
}

export function addSideEffectReport(userId, medicineName, note) {
  const overrides = getMedicineOverrides(userId);
  const key = normalizeKey(medicineName);
  const existing = overrides[key] || {};
  const reports = existing.sideEffectReports || [];
  reports.push({ note, reportedAt: new Date().toISOString() });
  overrides[key] = { ...existing, sideEffectReports: reports };
  saveOverrides(userId, overrides);
  return overrides[key];
}

/**
 * Flattens every medication mentioned across a user's records into a
 * de-duplicated list of "medicines" with local status/side-effect
 * overrides applied on top, and the record(s) they came from.
 */
export function deriveMedicinesFromRecords(records, userId) {
  const overrides = getMedicineOverrides(userId);
  const byName = new Map();

  for (const record of records) {
    const meds = record.medications || [];
    for (const med of meds) {
      const rawName = med.medicineName || med.medicine?.medicineName;
      if (!rawName) continue;
      const key = normalizeKey(rawName);
      const existing = byName.get(key);
      const entry = existing || {
        medicineName: rawName,
        dosage: med.dosage,
        frequency: med.frequency,
        route: med.route,
        duration: med.duration,
        instructions: med.instructions,
        uses: med.medicine?.uses,
        sideEffects: med.medicine?.sideEffects,
        activeSalts: med.medicine?.activeSalts,
        status: overrides[key]?.status || "ACTIVE",
        sideEffectReports: overrides[key]?.sideEffectReports || [],
        sources: [],
      };
      entry.sources.push({
        recordId: record.id,
        recordDate: record.recordDate,
        title: record.title,
      });
      byName.set(key, entry);
    }
  }

  return Array.from(byName.values()).sort((a, b) =>
    a.medicineName.localeCompare(b.medicineName)
  );
}
