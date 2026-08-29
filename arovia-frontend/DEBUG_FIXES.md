# Arovia Frontend Debug Fixes

This version contains frontend-only fixes after comparing the frontend API integration against the supplied Arovia API PDF and the backend source.

## Fixed

1. **Timeline upload failure state**
   - A failed `/api/ai/uploadRecord` request previously changed the UI to `step = "upload"`, but no `upload` UI state existed.
   - The UI now returns to the existing `idle` state, clears the selected file/input, and keeps the error visible so the user can retry.

2. **Google OAuth completion**
   - Added `/oauth-success` route.
   - The page reads the `token` supplied by the backend OAuth success redirect and calls the documented `POST /api/oauth-signin` endpoint.
   - The returned user is stored and the app navigates to `/dashboard`.

3. **Google OAuth initiation**
   - The Login button now starts the backend-configured Google OAuth flow through Spring Security's `/oauth2/authorization/google` entry point.
   - The API base is configurable through `VITE_API_BASE_URL`; no hard-coded `localhost:8080` remains in the OAuth button.

## Deliberately not changed

- API paths remain the ones shown in the supplied PDF.
- `/api/ai/uploadRecord` request handling was not invented because the PDF does not document a request-body schema for that endpoint.
- `/api/ai/fetchHealthSuggestion` was not changed to an invented schema; the existing frontend sends the backend `HealthSnapshot` as JSON.
- `/api/medication/{userId}/addSubstitute` remains the PDF-shaped JSON `{ substituteName, medicine }`; the backend currently has a request-body binding defect that must be fixed server-side.
- The nearest-pharmacy flow was not changed into an undocumented API contract; the backend currently returns a redirect while the PDF documents the endpoint as GET with a required `location` query parameter.

## Verification

A dependency installation/build could not be completed in the execution environment because the package installation timed out. The source changes were inspected directly; no backend files were modified.
