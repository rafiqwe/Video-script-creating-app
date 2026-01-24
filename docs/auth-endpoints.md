# Auth endpoints

This document describes the authentication-related backend routes and how they work.

All routes are implemented as App Router API routes under `src/app/api/auth`.

## Environment variables

Authentication depends on the following environment variables:

- `MONGODB_URI`: connection string for your MongoDB database.
- `JWT_SECRET`: secret used to sign JWT tokens. Keep this value private and strong.

Set both in `.env.local` for local development.

Example:

```bash
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>/gemini-nextjs-prompts
JWT_SECRET=super_long_random_string_here
```

---

## Data model

Users are stored in the `users` collection using the `User` Mongoose model (`src/lib/models/User.ts`):

- `name` (string, required, min length 2)
- `email` (string, required, unique, lowercased)
- `passwordHash` (string, required, bcrypt hash of the password)
- `createdAt` (Date, default now)

---

## JWT tokens

JWT helper: `src/lib/auth.ts`

- `signAuthToken(payload)`
  - Signs a token with fields:
    - `userId`: MongoDB ObjectId string
    - `email`: user email
  - Signed with `JWT_SECRET` and expires in `7d`.

Tokens are:

- Returned in the JSON response body as `token`.
- Also set as a `token` **HTTP-only cookie** for browser-based clients.

Cookie settings:

- `httpOnly: true`
- `secure: process.env.NODE_ENV === "production"`
- `sameSite: "lax"`
- `path: "/"`

---

## POST /api/auth/signup

Create a new user account.

- **Method:** `POST`
- **Path:** `/api/auth/signup`
- **Auth:** none (public endpoint)
- **Content-Type:** `application/json`

### Request body

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "my-strong-password"
}
```

Validation rules (`zod` schema):

- `name`: string, min length 2.
- `email`: must be a valid email address.
- `password`: string, min length 6.

### Behavior

1. Parse and validate body against `signupSchema`.
2. Connect to MongoDB using `connectToDatabase()`.
3. Check if a user with the same `email` already exists.
4. If exists: return `409 Conflict` with message.
5. Hash password using `bcrypt.hash(password, 10)`.
6. Create a new `User` with `name`, `email`, `passwordHash`.
7. Generate a JWT using `signAuthToken({ userId, email })`.
8. Set the `token` cookie (HTTP-only) and return a JSON response.

### Success response (201)

```json
{
  "ok": true,
  "message": "Account created successfully.",
  "token": "<jwt-token>"
}
```

- HTTP status: `201 Created`.

### Validation error response (400)

```json
{
  "ok": false,
  "errors": {
    "email": ["Invalid email address"],
    "password": ["Password must be at least 6 characters"]
  }
}
```

### Conflict response (409)

```json
{
  "ok": false,
  "message": "A user with this email already exists."
}
```

### Unexpected error (500)

```json
{
  "ok": false,
  "message": "Something went wrong. Please try again."
}
```

---

## POST /api/auth/login

Authenticate an existing user and issue a JWT.

- **Method:** `POST`
- **Path:** `/api/auth/login`
- **Auth:** none (public endpoint)
- **Content-Type:** `application/json`

### Request body

```json
{
  "email": "jane@example.com",
  "password": "my-strong-password"
}
```

Validation rules (`zod` schema):

- `email`: must be a valid email address.
- `password`: must be present (non-empty string).

### Behavior

1. Parse and validate body against `loginSchema`.
2. Connect to MongoDB using `connectToDatabase()`.
3. Look up user by `email`.
4. If no user found: return `401 Unauthorized` with generic message.
5. Compare password using `bcrypt.compare(password, user.passwordHash)`.
6. If password mismatch: return `401 Unauthorized` with the same generic message.
7. Generate JWT with `signAuthToken({ userId, email })`.
8. Set `token` cookie (HTTP-only) and return JSON with basic user info.

### Success response (200)

```json
{
  "ok": true,
  "message": "Login successful.",
  "user": {
    "id": "<user-id>",
    "name": "Jane Doe",
    "email": "jane@example.com"
  },
  "token": "<jwt-token>"
}
```

### Invalid credentials response (401)

```json
{
  "ok": false,
  "message": "Invalid email or password."
}
```

### Validation error response (400)

```json
{
  "ok": false,
  "errors": {
    "email": ["Invalid email address"],
    "password": ["Password is required"]
  }
}
```

### Unexpected error (500)

```json
{
  "ok": false,
  "message": "Something went wrong. Please try again."
}
```
