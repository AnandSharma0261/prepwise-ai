# PrepWise AI

A web app for practicing job interviews. You pick a role, the AI throws tailored questions at you, you answer them by typing or by speaking, and at the end it scores you and tells you what to work on.

The idea was simple — most interview prep sites just hand out the same 100 generic questions to everyone. But real interviews are specific to the role and the tech stack you're walking into. So this one generates the questions on the fly using Google Gemini, based on whatever profile you give it.

## What it does

1. Sign up and log in.
2. Click "New interview". Fill in a short form — the role (e.g. "Senior React Engineer"), your level (junior / mid / senior), the kind of interview (technical, behavioral, or mixed), and a few technologies you want to be tested on.
3. Pick how many questions you want, 3 to 15.
4. The app sends that profile to Gemini and gets back a list of questions tailored to it.
5. Take the interview. Each question shows up one at a time. You can type your answer or use the mic — the browser handles transcription via the Web Speech API.
6. When you're done, hit submit. Gemini reads through your transcript and returns a full evaluation: total score, a breakdown across communication, technical knowledge, problem solving, role fit, and confidence, plus three things you did well and three things to fix.
7. Everything gets saved, so you can come back later and review past attempts on the dashboard.

## What's it built with

- **Next.js 16** with the App Router and TypeScript. Turbopack for dev.
- **MongoDB Atlas** for storage, with Mongoose schemas.
- **NextAuth v5** for auth — email + password with bcrypt hashing and JWT sessions.
- **Google Gemini** (`gemini-flash-latest`) for both generating questions and grading answers. Uses Gemini's structured output mode so the JSON comes back well-formed even for long responses.
- **Tailwind CSS v4** for styling. Some Radix primitives wrapped in shadcn-style components for buttons, dropdowns, selects, etc.
- **Framer Motion** for the animations across the app.
- **Three.js** with React Three Fiber for the 3D scene on the landing page (the floating orb with the orbiting rings).
- **Zod** + **react-hook-form** to keep forms type-safe.
- **Recharts** for the progress chart.
- **Sonner** for toast notifications.
- **next-themes** for the dark / light toggle.
- The browser's built-in **Web Speech API** for voice mode — no third-party service, no extra cost.

## Running it locally

You'll need Node 20 or later.

Clone the repo and install:

```bash
git clone <your-repo-url>
cd prepwise-ai
npm install
```

Copy `.env.example` to `.env.local` and fill in the values:

```env
MONGODB_URI=your-mongo-atlas-connection-string
AUTH_SECRET=run-openssl-rand-base64-32-to-generate
AUTH_TRUST_HOST=true
NEXTAUTH_URL=http://localhost:3000
GEMINI_API_KEY=get-one-from-aistudio-google-com
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

A few notes on getting those values:

- **MongoDB**: Sign up at cloud.mongodb.com, create a free M0 cluster, add a database user, allow access from anywhere (0.0.0.0/0) in network access, and copy the connection string. Make sure to put your actual password in instead of `<db_password>`, and add `/prepwise` before the `?` so it uses the right database.
- **Gemini**: Go to aistudio.google.com/apikey, sign in, click "Create API key". The free tier is more than enough for testing.
- **AUTH_SECRET**: Just run `openssl rand -base64 32` in your terminal and paste whatever it spits out.

Then start the dev server:

```bash
npm run dev
```

Open http://localhost:3000.

## How it's organised

```
src/
  app/
    (auth)/         sign-in, sign-up pages (public)
    (root)/         dashboard, interview pages, profile (protected)
    api/            backend routes (interviews, feedback, register, auth)
  components/
    ui/             button, input, card, etc.
    shared/         nav, footer, theme toggle, auth form
    landing/        hero, features, testimonials, CTA
    interview/      create form, interview room, feedback view
    dashboard/      stats cards, chart, interview cards
    three/          the 3D scene
  lib/
    db.ts           Mongo connection (with caching across hot reloads)
    gemini.ts       wrapper around the Gemini SDK with retries and JSON schema
    data.ts         server-only data fetchers used by SSR pages
    validations/    Zod schemas for forms and API payloads
  models/           Mongoose models for User, Interview, Feedback
  hooks/            useSpeechRecognition, useSpeechSynthesis
  auth.ts           NextAuth setup
  proxy.ts          route protection — this is what was middleware.ts before Next 16 renamed it
```

## Deploying

Vercel works without any extra config. Push the repo to GitHub, import the project on Vercel, paste the same env vars from `.env.local` into the project settings, and deploy. Once you have the production URL, update `NEXTAUTH_URL` and `NEXT_PUBLIC_APP_URL` in Vercel to point to it and redeploy.

## A few things worth knowing

- **Voice mode is flaky on macOS browsers.** The Web Speech API talks to Google's speech servers in the background, and sometimes those requests just fail with a "network" error. The app catches this and quietly drops you into text mode so the interview can continue. Voice works fine on Windows Chrome / Edge in my testing.
- **Gemini retries automatically.** Transient `fetch failed`, `503`, or rate-limit errors get retried up to 3 times with exponential backoff before bubbling up. Saves you from "click submit, see error, click submit again".
- **JSON output is forced via schema.** For both question generation and feedback evaluation, the Gemini call is configured with a `responseSchema`, so even very long feedback responses parse cleanly.
- **Text mode is the default.** Voice is cool but unreliable across browsers, so the interview room starts in text. You can toggle to voice from the top right of the interview screen.

## Made by

Anand Sharma — [github.com/AnandSharma0261](https://github.com/AnandSharma0261) · [linkedin.com/in/anand-sharma-63b294213](https://www.linkedin.com/in/anand-sharma-63b294213/)
