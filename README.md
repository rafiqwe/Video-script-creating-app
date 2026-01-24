# Gemini Script Studio

Gemini Script Studio is a small Next.js app that turns a short idea into a structured script of **1–200 sentences** using the **Google Gemini API**.

You type a short description, choose how many sentences you want, and the app generates a script you can reuse for video narration, blog posts, or other content.

## Features

- Simple dashboard UI for sending ideas to Gemini
- Choose script length between 1 and 200 sentences
- Server-side validation of inputs
- Backend route that calls the Gemini `generateContent` API
- Ready to deploy as a standard Next.js 16 app

## Tech stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- Google Gemini API (Generative Language API)

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env.local` file in the project root:

```bash
GEMINI_API_KEY=your_google_generative_language_api_key_here
```

You can obtain an API key from the Google AI Studio / Generative Language API console.

### 3. Run the dev server

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser. The main dashboard lives at `/dashboard`.

## How the website works

- The **landing page** (`/`) explains the product and links to login / signup (UI only for now).
- The **dashboard** (`/dashboard`) lets you:
  - Enter a short idea
  - Choose how many sentences you want
  - Send the request to the backend
- The **backend** exposes a `POST /api/gemini` endpoint that:
  - Validates the idea and sentence count
  - Calls the Gemini `generateContent` API
  - Returns the generated script text to the client

See `docs/backend-endpoints.md` for detailed backend API documentation.
