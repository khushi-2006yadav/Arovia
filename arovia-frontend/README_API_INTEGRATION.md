# Arovia frontend API integration

This frontend is wired to the endpoints shown in `Arovia_Apis.pdf` and uses the backend response objects as the source of truth.

## Runtime

1. Start the Arovia Spring Boot backend on `http://localhost:8080`.
2. Start MongoDB and Redis as required by the backend `application.properties`.
3. Copy `.env.example` to `.env` if the API is not on `http://localhost:8080`.
4. Run `npm install` and `npm run dev`.

## API flow

- Login: `POST /api/signin` → stores `UserResponseDto.jwt` and user profile in session storage.
- Signup: `POST /api/signup` → redirects to login after a successful 200 response.
- Dashboard startup: `GET /api/snapshot/fetchSnapshot/{userId}` and `GET /api/record/fetchRecords/{userId}`.
- Timeline upload: `POST /api/ai/uploadRecord` → returned JSON is reviewed → `POST /api/record/{userId}/addRecords`.
- Saving a record invalidates records/snapshot/AI-suggestion caches because the backend updates health trends and medication state while saving a record.
- Suggestions: `POST /api/ai/fetchHealthSuggestion` using the current `HealthSnapshot`.
- Medicine substitute: `POST /api/medication/{userId}/addSubstitute` with the PDF's `{ substituteName, medicine }` body.
- Nearest pharmacy: `GET /api/medication/nearest-pharmacy?location=...`.
- Cure disease: `POST /api/snapshot/cured/{userId}` is available through the API client for future UI use.

## Caching

Sensitive API data is kept in tab-scoped `sessionStorage` with short TTLs plus an in-memory cache and in-flight request de-duplication. Medical GETs are not put into long-lived localStorage. Writes invalidate affected cached data.

## Important source limitations

The supplied API PDF does not define a request schema for the AI endpoints, so the frontend does not invent one. The upload endpoint receives the selected file as the raw request body, and its response must be JSON representing the medical-record shape before it can be saved.

The supplied backend also has no authenticated profile-update endpoint, no medication-list endpoint, and no endpoint for reporting medication side effects/status changes. The frontend therefore derives medication cards from `MedicalRecord.medications` and does not claim unsupported profile/side-effect/status writes are persisted.
