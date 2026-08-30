const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:8080").replace(/\/$/, "");

const CACHE_PREFIX = "arovia:cache:";
const cache = new Map();
const inflight = new Map();

const TTL = {
  snapshot: 5 * 60 * 1000,
  records: 2 * 60 * 1000,
  suggestions: 10 * 60 * 1000,
  user: 30 * 60 * 1000,
};


function authToken() {
  return sessionStorage.getItem("arovia:jwt") || "";
}

function storageKey(key) {
  return `${CACHE_PREFIX}${key}`;
}

function readPersistent(key) {
  try {
    const raw = sessionStorage.getItem(storageKey(key));
    if (!raw) return null;
    const value = JSON.parse(raw);
    if (!value || value.expiresAt <= Date.now()) {
      sessionStorage.removeItem(storageKey(key));
      return null;
    }
    return value.data;
  } catch {
    return null;
  }
}

function writePersistent(key, data, ttl) {
  const entry = { data, expiresAt: Date.now() + ttl };
  cache.set(key, entry);
  try {
    sessionStorage.setItem(storageKey(key), JSON.stringify(entry));
  } catch {
   
  }
}

export function clearCache(prefix = "") {
  for (const key of [...cache.keys()]) {
    if (!prefix || key.startsWith(prefix)) cache.delete(key);
  }
  try {
    const keys = Object.keys(sessionStorage);
    keys.forEach((key) => {
      if (key.startsWith(CACHE_PREFIX + prefix)) sessionStorage.removeItem(key);
    });
  } catch {
// storage failure ignore krna hai
  }
}

export function getStoredUser() {
  try {
    return JSON.parse(sessionStorage.getItem("arovia:user") || "null");
  } catch {
    return null;
  }
}

export function setStoredUser(user) {
  if (!user) {
    sessionStorage.removeItem("arovia:user");
    sessionStorage.removeItem("arovia:jwt");
    clearCache();
    return;
  }
  sessionStorage.setItem("arovia:user", JSON.stringify(user));
  if (user.jwt) sessionStorage.setItem("arovia:jwt", user.jwt);
  writePersistent("user", user, TTL.user);
}

export function logout() {
  setStoredUser(null);
}

async function request(path, options = {}) {
  const headers = new Headers(options.headers || {});
  const token = authToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const isFormData = options.body instanceof FormData;
  if (!isFormData && options.body !== undefined && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
    credentials: "include",
  });

  if (response.status === 401) {
    logout();
    window.dispatchEvent(new CustomEvent("arovia:unauthorized"));
  }

  const text = await response.text();
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!response.ok) {
    const message =
      (data && typeof data === "object" && (data.message || data.error)) ||
      (typeof data === "string" && data) ||
      `Request failed (${response.status})`;
    const error = new Error(message);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

async function cached(key, ttl, loader, { force = false } = {}) {
  if (!force) {
    const memory = cache.get(key);
    if (memory && memory.expiresAt > Date.now()) return memory.data;
    const persisted = readPersistent(key);
    if (persisted !== null) return persisted;
  }

  if (inflight.has(key)) return inflight.get(key);

  const promise = loader()
    .then((data) => {
      writePersistent(key, data, ttl);
      return data;
    })
    .finally(() => inflight.delete(key));

  inflight.set(key, promise);
  return promise;
}

export const api = {
  baseUrl: API_BASE_URL,

  oauthAuthorizationUrl(provider = "google") {
    return `${API_BASE_URL}/oauth2/authorization/${encodeURIComponent(provider)}`;
  },

  async signin(payload) {
    const user = await request("/api/signin", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    setStoredUser(user);
    return user;
  },

  async signup(payload) {
    return request("/api/signup", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async oauthSignin(token) {
    const user = await request("/api/oauth-signin", {
      method: "POST",
      body: JSON.stringify({ token }),
    });
    setStoredUser(user);
    return user;
  },

  async oauthSignup(payload) {
    const user = await request("/api/oauth-signup", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    setStoredUser(user);
    return user;
  },
  
  async fetchRecordAnalysis(recordId, options = {}) {
    return cached(
      `insight:${recordId}`,
      TTL.insights,
      () => request(`/api/ai/fetchRecordAnalysis/${encodeURIComponent(recordId)}`), // adjust prefix if not under /api/ai
      options,
    );
  },

  async fetchSnapshot(userId, options) {
    return cached(
      `snapshot:${userId}`,
      TTL.snapshot,
      () => request(`/api/snapshot/fetchSnapshot/${encodeURIComponent(userId)}`),
      options,
    );
  },

  async cureDisease(userId, diseaseName) {
    const result = await request(`/api/snapshot/cured/${encodeURIComponent(userId)}`, {
      method: "POST",
      body: JSON.stringify(diseaseName),
    });
    clearCache(`snapshot:${userId}`);
    clearCache("suggestions:");
    return result;
  },

  async fetchRecords(userId, options) {
    return cached(
      `records:${userId}`,
      TTL.records,
      () => request(`/api/record/fetchRecords/${encodeURIComponent(userId)}`),
      options,
    );
  },

  async fetchRecord(recordId, options) {
    return cached(
      `record:${recordId}`,
      TTL.records,
      () => request(`/api/record/fetchRecord/${encodeURIComponent(recordId)}`),
      options,
    );
  },

  async addRecord(userId, medicalRecord) {
    const id = await request(`/api/record/${encodeURIComponent(userId)}/addRecords`, {
      method: "POST",
      body: JSON.stringify(medicalRecord),
    });
    clearCache(`records:${userId}`);
    clearCache(`snapshot:${userId}`);
    clearCache("suggestions:");
    return id;
  },

  async uploadRecord(file) {
    const formData = new FormData();
    
    formData.append("file", file);

    return request("/api/ai/uploadRecord", {
      method: "POST",
      
      body: formData,
    });
},

  async fetchHealthSuggestion(snapshot, options = {}) {
  const userId = snapshot?.userId || "anonymous";
  
  return cached(
    `suggestions:${userId}`,
    TTL.suggestions,
    () =>
      request(`/api/ai/fetchHealthSuggestion/${userId}`, {
        method: "GET", 
      }),
    options,
  );
},
async findMedicine(medicineName, options = {}) {
    return cached(
      `medicine:${medicineName.toLowerCase()}`,
      24 * 60 * 60 * 1000, // Cache for 24 hours since medicine details rarely change
      () => request(`/api/medication/findMedicine/${encodeURIComponent(medicineName)}`, {
        method: "GET",
      }),
      options,
    );
  },

  async addSubstitute(userId, substituteName, medicine) {
    const result = await request(`/api/medication/${encodeURIComponent(userId)}/addSubstitute`, {
      method: "POST",
      body: JSON.stringify({ substituteName, medicine }),
    });
    clearCache(`records:${userId}`);
    return result;
  },

  async nearestPharmacy(location) {
    const url = `${API_BASE_URL}/api/medication/nearest-pharmacy?location=${encodeURIComponent(location)}`;
    const response = await fetch(url, {
      method: "GET",
      headers: authToken() ? { Authorization: `Bearer ${authToken()}` } : undefined,
      redirect: "manual",
    });
    if (response.type === "opaqueredirect" || response.status === 302 || response.status === 0) {
      window.location.assign(url);
      return;
    }
    if (!response.ok) throw new Error(`Unable to find nearby pharmacy (${response.status})`);
    const target = response.headers.get("Location");
    if (target) window.location.assign(target);
  },
};
