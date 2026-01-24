# Architecture

This document gives a high-level overview of the Gemini Script Studio project structure and how the main pieces fit together.

## Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** MongoDB (via Mongoose)
- **Auth:** JWT tokens stored in HTTP-only cookies
- **AI:** Google Gemini API (Generative Language API)

---

## Folder structure (key parts)

- `src/app/`
  - `layout.tsx` – Root layout, global shell.
  - `globals.css` – Global styles (Tailwind, base styles).
  - `page.tsx` – Landing page (marketing-style home page).
  - `login/page.tsx` – Login form page (UI only, calls `/api/auth/login`).
  - `signup/page.tsx` – Signup form page (UI only, calls `/api/auth/signup`).
  - `dashboard/page.tsx` – Main app dashboard and Gemini script generator UI.
  - `api/`
    - `auth/login/route.ts` – Login endpoint.
    - `auth/signup/route.ts` – Signup endpoint.
    - `gemini/route.ts` – Gemini script generation endpoint.

- `src/lib/`
  - `mongodb.ts` – Mongoose connection helper with simple global connection caching.
  - `models/User.ts` – User Mongoose model.
  - `auth.ts` – JWT helper for signing authentication tokens.

- `public/` – Static assets (icons, images used by the UI).

- `docs/` – Project documentation:
  - `backend-endpoints.md` – Gemini script generation endpoint.
  - `auth-endpoints.md` – Signup and login endpoints, JWT, cookies.
  - `architecture.md` – This file.

---

## Request flow: generating a script

1. User opens `/dashboard`.
2. Fills in the idea and selects the number of sentences.
3. Frontend sends `POST /api/gemini` with `{ idea, amount }`.
4. `src/app/api/gemini/route.ts` validates the payload with `zod`.
5. If valid, it builds a prompt and calls the Gemini `generateContent` endpoint using `fetch`.
6. On success, it extracts the generated text from the Gemini response and returns it to the client.
7. The dashboard renders the resulting `script` inside a `<pre>` block for easy copying.

---

## Request flow: signup/login

**Signup:**

1. Frontend sends `POST /api/auth/signup` with `{ name, email, password }`.
2. Route validates payload, connects to Mongo via `connectToDatabase()`.
3. Checks for existing user with the same email.
4. Hashes the password with `bcrypt` and stores a new `User` document.
5. Signs a JWT with `signAuthToken({ userId, email })`.
6. Sets `token` HTTP-only cookie and returns a JSON response.

**Login:**

1. Frontend sends `POST /api/auth/login` with `{ email, password }`.
2. Route validates payload and connects to Mongo.
3. Finds user by email and compares password hash with `bcrypt.compare`.
4. If valid, signs a JWT and sets the same `token` cookie.
5. Returns basic user info and the token.

Currently, the dashboard does not strictly require auth to call `/api/gemini`—the auth flows are a basic scaffold you can extend.

---

## Environment configuration

Key environment variables (in `.env.local`):

- `GEMINI_API_KEY` – Google Generative Language API key.
- `MONGODB_URI` – MongoDB connection string.
- `JWT_SECRET` – Secret used to sign auth JWT tokens.

Without these, the corresponding backend pieces will throw and fail fast on startup or first request.
