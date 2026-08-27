// Wraps RecordController.
//
// The backend currently exposes only:
//   POST /api/record/{userId}/addRecords  -> returns the new recordId
//   GET  /api/record/fetchRecord/{recordId} -> MedicalRecord
//
// There is no "list all records for a user" endpoint yet, so we keep a
// small per-user index of known record ids in localStorage. Every record
// added (or opened) through this app gets remembered here; the actual
// record data is always re-fetched from the backend (through the cache
// layer in client.js) so the index only ever stores ids, never medical
// data offline.
import { request, invalidateCache } from "./client";

const indexKey = (userId) => `arovia_record_index_${userId}`;

function readIndex(userId) {
  try {
    const raw = localStorage.getItem(indexKey(userId));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeIndex(userId, ids) {
  localStorage.setItem(indexKey(userId), JSON.stringify(ids));
}

function rememberRecord(userId, recordId) {
  const ids = readIndex(userId);
  if (!ids.includes(recordId)) {
    writeIndex(userId, [recordId, ...ids]);
  }
}

export function forgetRecord(userId, recordId) {
  writeIndex(
    userId,
    readIndex(userId).filter((id) => id !== recordId)
  );
  invalidateCache(`record:${recordId}`);
}

/** POST /api/record/{userId}/addRecords */
export async function addRecord(userId, medicalRecordDto) {
  const recordId = await request(`/api/record/${userId}/addRecords`, {
    method: "POST",
    body: medicalRecordDto,
  });
  rememberRecord(userId, recordId);
  invalidateCache("record:");
  return recordId;
}

/** GET /api/record/fetchRecord/{recordId}, cached for 5 minutes */
export async function fetchRecord(recordId, { skipCache = false } = {}) {
  return request(`/api/record/fetchRecord/${recordId}`, {
    cacheKey: `record:${recordId}`,
    cacheTtl: 5 * 60 * 1000,
    skipCache,
  });
}

/** Fetches every record known for this user (via the local id index). */
export async function listRecords(userId, { skipCache = false } = {}) {
  const ids = readIndex(userId);
  const settled = await Promise.allSettled(
    ids.map((id) => fetchRecord(id, { skipCache }))
  );
  const records = [];
  const missingIds = [];
  settled.forEach((result, i) => {
    if (result.status === "fulfilled" && result.value) {
      records.push(result.value);
    } else {
      missingIds.push(ids[i]);
    }
  });
  // Clean up ids that no longer resolve (e.g. deleted on the backend).
  if (missingIds.length) {
    writeIndex(
      userId,
      ids.filter((id) => !missingIds.includes(id))
    );
  }
  records.sort((a, b) => new Date(b.recordDate) - new Date(a.recordDate));
  return records;
}

export function recordCount(userId) {
  return readIndex(userId).length;
}
