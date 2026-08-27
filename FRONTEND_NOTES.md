# Arovia Frontend — Integration Notes

This documents exactly what the frontend does today, so whoever picks up the
backend knows what's real and what's a placeholder.

## Wired to the real backend (UserController / RecordController)

- `POST /api/signup` — `src/api/auth.js` → `signup()`
- `POST /api/signin` — `src/api/auth.js` → `signin()` (stores the returned `jwt`)
- `POST /api/oauth-signin` — `src/api/auth.js` → `oauthSignin()`
- `POST /api/oauth-signup` — `src/api/auth.js` → `oauthSignup()`
- `POST /api/record/{userId}/addRecords` — `src/api/records.js` → `addRecord()`
- `GET /api/record/fetchRecord/{recordId}` — `src/api/records.js` → `fetchRecord()`

All authenticated requests attach `Authorization: Bearer <jwt>` (see
`src/api/client.js`). A 401/403 response clears the session and redirects to
`/login`. GET-style reads are cached client-side for a few minutes
(`cacheKey`/`cacheTtl` in `client.js`) to avoid refetching the same record
repeatedly.

## No "list my records" endpoint exists yet

`RecordController` only exposes add-by-id and fetch-by-id, so `records.js`
keeps a small per-user index of known record ids in `localStorage`
(`arovia_record_index_<userId>`) and re-fetches each one from the backend
(through the cache) to build the Records/Timeline/Dashboard views. **Nothing
except ids is stored offline.** Once a real
`GET /api/record/{userId}` (or similar) endpoint exists, swap `listRecords()`
in `src/api/records.js` to call it directly and this indexing goes away.

## Medicines — targets a documented-but-unimplemented endpoint

`MedicineController` currently has one commented-out line:
`POST /api/medication/fetchMedicine/{medicineName}`. `src/api/medications.js`
calls exactly that contract first; if it 404s/fails, it falls back to a small
bundled reference table so the UI still works. Once the endpoint is live, the
frontend needs no changes — just return a JSON body shaped like the
`Medicine` entity (`medicineName`, `activeSalts`, `uses`, `sideEffects`) plus
optionally a `typicalPricePerStrip` field to power the generic-alternative
comparison card.

Medicine **status** (active/discontinued) and self-reported **side effects**
are tracked client-side in `localStorage`
(`arovia_medicine_overrides_<userId>`) since there's no
`Medication`/`MedicationHistory` API yet. `src/api/medications.js` documents
the exact shape if/when that gets built.

## AI insights — targets speculative endpoints, always has a fallback

`AiController` is an empty stub. `src/api/ai.js` calls
`POST /api/ai/summarize-record/{recordId}` and gracefully falls back to a
simple, transparent client-side heuristic (flags the worst out-of-range test,
or lists prescribed medicines) if that call fails. Trends
(`buildTrends`) and suggestions (`buildSuggestions`) are computed entirely on
the client from the records already fetched — no backend call needed, but an
`/api/ai/trends` endpoint could replace them later without changing the UI.

Anywhere the app is showing a fallback instead of a live AI/medicine result,
it renders a small "PREVIEW" badge so it's never presented as more
authoritative than it is.

## Profile updates

`UserController` has no "update profile" endpoint. The Profile page's edit
form currently saves changes to the local cached user object only, and tells
the user as much via a toast. Wire it to a real `PUT /api/user/{userId}`
once available (see `updateUser()` in `src/context/AuthContext.jsx` and
`Profile.jsx`).

## Auth / caching summary

- JWT stored in `localStorage` (`arovia_token`); user profile snapshot in
  `arovia_user`.
- `src/api/client.js` is the single fetch wrapper: attaches the token,
  normalizes errors (`ApiError`), and implements the in-memory TTL cache
  (`cacheKey`/`cacheTtl`, invalidated on writes via `invalidateCache()`).
- `src/context/AuthContext.jsx` exposes `user`, `isAuthenticated`, `login`,
  `logout`, `updateUser` to the whole app; `ProtectedRoute.jsx` guards every
  `/dashboard`, `/records`, `/medicines`, `/insights`, `/timeline`,
  `/profile` route.

## Environment variables

See `.env.example`:
- `VITE_API_BASE_URL` — defaults to `http://localhost:8080`.
- `VITE_GOOGLE_CLIENT_ID` — enables the real "Continue with Google" button
  via Google Identity Services; left blank it shows a friendly disabled
  state instead of failing silently.

## Heads-up for the backend team

`SecurityConfig` currently only `permitAll()`s `/api/signup/**` and
`/api/signin/**` (plus swagger/oauth2/login). `/api/oauth-signin` and
`/api/oauth-signup` don't match either pattern, so as written those two
endpoints will require an already-authenticated request — which is
impossible for a user who's trying to log in for the first time. The
frontend calls them exactly as specced (`POST` with a JSON body, no auth
header) in `src/api/auth.js`; they'll need adding to the `permitAll()` list
for Google sign-in to work end-to-end.

