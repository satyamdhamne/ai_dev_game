# Spot the AI Bug 🐛

> AI writes your code. Can you catch its bugs?

A daily, Wordle-style game for developers. Every day, every player gets the same short "PR written by AI" containing exactly **one real bug**. Tap the buggy line (3 attempts, with 🔥 warm / ❄️ cold hints), then name the bug type for bonus points, and share your result.

**Stack:** Next.js 16 (App Router, Cache Components) · TypeScript · Tailwind CSS v4 · Shiki · Vercel Analytics · Vitest. No database: puzzles live in `data/puzzles.json`, player state lives in `localStorage`.

## Setup

```bash
npm install
cp .env.example .env.local   # optional, see "Environment variables"
npm run dev                  # http://localhost:3000
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Dev server |
| `npm run build` / `npm start` | Production build / serve |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | Vitest unit tests (day math incl. IST edge cases, game logic, stats, share text, diff, puzzle validation) |
| `npm run validate-puzzles` | Validates `data/puzzles.json` |
| `npm run check` | All of the above except build |

To reset your own progress while testing, clear the `sab:*` keys in localStorage (DevTools → Application → Local Storage).

## How the daily puzzle works

- `LAUNCH_DATE` in [`lib/config.ts`](lib/config.ts) is Day 1 (an IST calendar date).
- Day N = days since `LAUNCH_DATE` + 1, computed in **Asia/Kolkata (UTC+05:30)**, rolling over at midnight IST (18:30 UTC), regardless of where the player or server is.
- Today's puzzle = `puzzles[(N - 1) % puzzles.length]`, so the list loops when it runs out.
- The page shell is prerendered; the puzzle itself is resolved per request (`connection()` + a `"use cache"` highlighter keyed by day), so a deploy never freezes "today".
- The result screen shows a countdown to the next puzzle and reloads the page at rollover.

## Adding puzzles

Append an object to `data/puzzles.json`:

```jsonc
{
  "id": 31,                         // next integer; also used as the "Day N" slot
  "title": "Paginate user results",
  "language": "python",             // python | javascript | typescript | go | sql | java
  "difficulty": "easy",             // easy | medium | hard
  "prContext": "1-2 sentence fake PR description.",
  "code": "...",                    // 10-25 lines, \n-separated
  "bugLine": 19,                    // 1-indexed line with the bug
  "bugType": "Off-by-one",          // see BUG_TYPES in lib/types.ts
  "explanation": "2-4 sentences: what breaks and when.",
  "fixedCode": "...",               // see below
  "whyAiDoesThis": "1-2 sentences (shown blurred as Pro content)."
}
```

**`fixedCode`** can be either:
- the **full corrected snippet** (recommended: the result screen renders a proper diff against `code`), or
- just the **replacement for the bug line** (one or more lines). Anything shorter than half the snippet is treated this way.

Then run `npm run validate-puzzles`. It checks for unique ids, valid enums and non-empty fields, that `bugLine` is in range and not blank, and **that the fix actually changes `bugLine`**, which catches an off-by-one in `bugLine` itself.

Puzzle rules: exactly one bug, real and reproducible, on a single identifiable line; everything else must be correct; it should look like clean AI output; no trick questions, style nitpicks, or bugs that need hidden context (state any needed context in a comment or in `prContext`). Each of the 30 launch puzzles was executed (Python, Node, Go with `-race`, Java, Postgres 16) to confirm the bug reproduces and the fix resolves it.

Indent Go with tabs (gofmt) and everything else with spaces.

> Heads-up: puzzles are bundled with the page, so a determined player can read today's answer in DevTools. That's fine for a daily game; don't put anything secret in `puzzles.json`.

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_WAITLIST_URL` | for the waitlist | The form POSTs here as `multipart/form-data` with `email` (and `source`) and `Accept: application/json`. Works with Formspree (`https://formspree.io/f/xxxx`) and similar. If the endpoint doesn't send CORS headers (e.g. Google Forms `.../formResponse`), it retries as an opaque `no-cors` POST. If unset, the form shows a "not configured" error. |
| `NEXT_PUBLIC_WAITLIST_EMAIL_FIELD` | no | Field name for the email (default `email`). For Google Forms, use the `entry.123…` id. |
| `NEXT_PUBLIC_SITE_URL` | no | Canonical URL for metadata/OG tags (default `https://spottheaibug.com`). |

`NEXT_PUBLIC_*` values are inlined at build time, so redeploy after changing them.

## Analytics

`@vercel/analytics` is mounted in the root layout. Custom events (see [`lib/analytics.ts`](lib/analytics.ts)):

`puzzle_started`, `line_guessed` (attempt, result), `puzzle_solved` / `puzzle_failed` (attempts, seconds), `share_clicked` (native vs clipboard), `waitlist_submitted` (source).

Locally the analytics script 404s; that's expected. It's served by Vercel in production. Custom events require Web Analytics to be enabled on the Vercel project.

## Deploy to Vercel

1. Push this repo to GitHub.
2. In Vercel: **Add New → Project**, import the repo. The framework is auto-detected (Next.js); no config needed.
3. Add `NEXT_PUBLIC_WAITLIST_URL` (and optionally the other env vars) under **Settings → Environment Variables**.
4. Deploy. Then enable **Analytics** in the project dashboard to start receiving page views and custom events.
5. Point your domain (e.g. `spottheaibug.com`) at the project under **Settings → Domains**.

Before launch: set `LAUNCH_DATE` in `lib/config.ts` to launch day, and replace `AUTHOR_NAME` / `AUTHOR_X_URL` there for the footer.

## Project structure

```
app/
  layout.tsx            metadata, theme script (no flash), header/footer shell, Analytics
  page.tsx              today's game (static shell + per-request puzzle)
  how-to-play/          rules page (also shown as a modal on first visit)
  archive/              past titles, locked behind "Pro — coming soon" + waitlist
  opengraph-image.tsx   generated OG image (next/og)
  icon.svg              favicon
components/             Game, CodeBlock, BugTypePicker, ResultScreen, DiffView, StatsModal, …
lib/
  config.ts             LAUNCH_DATE, attempts, site/author constants
  day.ts                IST day math + rollover
  game.ts               pure game reducer (guesses, warm/cold, phases, timer)
  stats.ts share.ts     streaks/distribution, share text
  daily.ts highlight.ts server-side Shiki highlighting + fix diff (cached per day)
  store.ts storage.ts   localStorage-backed stores (useSyncExternalStore, hydration-safe)
  validatePuzzles.ts    shared by the CLI script and tests
data/puzzles.json       the puzzles
scripts/validate-puzzles.ts
tests/                  Vitest
```
