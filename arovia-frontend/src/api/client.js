// Central HTTP client for the Arovia frontend.
//
// Responsibilities:
//  - attach the JWT (Bearer token) to authenticated requests
//  - normalize errors into ApiError so the UI can show useful messages
//  - provide a lightweight TTL cache for GET-style reads so the same
//    record / medicine isn't re-fetched on every render or route change
//  - centralize what happens on 401/403 (clear session + notify app)

export const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const TOKEN_KEY = "arovia_token";
const USER_KEY = "arovia_user";

export class ApiError extends Error {
  constructor(message, { status = 0, type = "api", details = null } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.type = type; // "network" | "unauthorized" | "not_found" | "api"
    this.details = details;
  }
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

let unauthorizedHandler = null;
export function setUnauthorizedHandler(fn) {
  unauthorizedHandler = fn;
}

// ---------------- Cache ----------------
// Simple in-memory cache: key -> { data, expiresAt }
const cacheStore = new Map();

export function invalidateCache(prefix = "") {
  if (!prefix) {
    cacheStore.clear();
    return;
  }
  for (const key of cacheStore.keys()) {
    if (key.startsWith(prefix)) cacheStore.delete(key);
  }
}

function getCached(key) {
  const hit = cacheStore.get(key);
  if (!hit) return undefined;
  if (hit.expiresAt < Date.now()) {
    cacheStore.delete(key);
    return undefined;
  }
  return hit.data;
}

function setCached(key, data, ttlMs) {
  if (!key || !ttlMs) return;
  cacheStore.set(key, { data, expiresAt: Date.now() + ttlMs });
}

// ---------------- Request ----------------
/**
 * @param {string} path e.g. "/api/signin"
 * @param {object} opts
 * @param {"GET"|"POST"|"PUT"|"DELETE"|"PATCH"} [opts.method]
 * @param {object} [opts.body]
 * @param {boolean} [opts.auth] attach Authorization header (default true)
 * @param {string} [opts.cacheKey] cache under this key
 * @param {number} [opts.cacheTtl] ms to keep cached value
 * @param {boolean} [opts.skipCache] force a network hit, refreshing the cache
 */
export async function request(path, opts = {}) {
  const {
    method = "GET",
    body,
    auth = true,
    cacheKey,
    cacheTtl = 0,
    skipCache = false,
    signal,
  } = opts;

  if (cacheKey && cacheTtl > 0 && !skipCache) {
    const cached = getCached(cacheKey);
    if (cached !== undefined) return cached;
  }

  const headers = { "Content-Type": "application/json" };
  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  let res;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal,
    });
  } catch {
    throw new ApiError(
      "Couldn't reach the Arovia server. Check that the backend is running and try again.",
      { type: "network" }
    );
  }

  if (res.status === 401 || res.status === 403) {
    clearSession();
    if (unauthorizedHandler) unauthorizedHandler();
    throw new ApiError("Your session has expired. Please log in again.", {
      status: res.status,
      type: "unauthorized",
    });
  }

  const raw = await res.text();
  let data = null;
  if (raw) {
    try {
      data = JSON.parse(raw);
    } catch {
      data = raw;
    }
  }

  if (!res.ok) {
    const message =
      (data && typeof data === "object" && (data.message || data.error)) ||
      (typeof data === "string" && data) ||
      `Request failed (${res.status})`;
    throw new ApiError(message, {
      status: res.status,
      type: res.status === 404 ? "not_found" : "api",
      details: data,
    });
  }

  if (cacheKey && cacheTtl > 0) setCached(cacheKey, data, cacheTtl);
  return data;
}

export { USER_KEY };
