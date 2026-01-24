# Backend endpoints

This document describes the backend API exposed by the Gemini Script Studio Next.js app.

All routes are implemented as App Router API routes under `src/app/api`.

## Base URL

During local development, the app usually runs at:

- `http://localhost:3000` (or another port, e.g. `3001`, if 3000 is busy)

All paths below are relative to that base URL.

---

## POST /api/gemini

Generate a script from a short idea using the Google Gemini API.

- **Method:** `POST`
- **Path:** `/api/gemini`
- **Auth:** none (intended for local/demo use)
- **Content-Type:** `application/json`

### Request body

```json
{
  "idea": "Short YouTube video explaining how to stay focused while studying.",
  "amount": 40
}
```

Fields:

- `idea` (string, required)
  - At least 5 characters.
- `amount` (integer, required)
  - Number of sentences you want in the generated script.
  - Minimum: `1`
  - Maximum: `200`

If validation fails, the route responds with HTTP `400` and a JSON body containing validation errors.

### Successful response (200)

```json
{
  "ok": true,
  "script": "You are a scriptwriter helping a creator record a clear, friendly YouTube video..."
}
```

Fields:

- `ok`: `true` on success.
- `script`: The concatenated text returned from Gemini, typically containing the requested number of sentences.

### Validation error response (400)

```json
{
  "ok": false,
  "errors": {
    "idea": ["Idea should be at least 5 characters"],
    "amount": ["Amount must be at least 1 sentence"]
  }
}
```

### Missing API key (500)

If `GEMINI_API_KEY` is not configured on the server, you will receive:

```json
{
  "ok": false,
  "message": "GEMINI_API_KEY is not set on the server."
}
```

with HTTP status `500`.

### Upstream Gemini failure (502)

If the request to the Gemini API fails (for example, invalid key, quota exceeded, or model issues), the route returns:

```json
{
  "ok": false,
  "message": "Gemini API request failed",
  "status": 502,
  "details": "...raw error body from Gemini (only in development)..."
}
```

- HTTP status: `502 Bad Gateway`.
- In `development` mode, the `details` field contains the raw response body from the Gemini API for easier debugging.

### Unexpected errors (500)

If any other unexpected error happens in the route handler, the response is:

```json
{
  "ok": false,
  "message": "Something went wrong while generating the script."
}
```

with HTTP status `500`.

---

## Environment variables

The backend depends on the following environment variable:

- `GEMINI_API_KEY`: Google Generative Language API key used to call the Gemini `generateContent` endpoint.

Set this in `.env.local` for local development.
