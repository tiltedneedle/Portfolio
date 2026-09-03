# Tilted Needle — The Editing Room

Next.js 16 (App Router, Turbopack) · React 19 · Tailwind v4 · Framer Motion

The studio's site, built as the room where a reel is assembled. One dark
visual world; the home page runs as a reel; the six films stand 9:16 on a
timeline the scroll shuttles; route changes are cuts. The treatment that led
here is in `PROGRESS.md`, which is also the resume point for anyone picking
the work up.

## Running

```bash
npm install
npm run dev
```

```bash
npm run build
npx next start -p 3400
```

If `next start` fails with `EADDRINUSE`, an older instance still holds the
port and you would be verifying a stale build. Kill it first:

```powershell
Get-NetTCPConnection -LocalPort 3400 -State Listen | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }
```

## Routes

| Route | Notes |
|---|---|
| `/` | The reel: slate (once per device), cold open, sequence, title card, credits, results, end slate |
| `/film/[slug]` | One film per page with real transport (play, scrub, sound) and a match cut to the next |
| `/services` | The studio: four capabilities as an index |
| `/services/[slug]` | Four detail pages, statically generated from `src/lib/services-data.ts` |
| `/portfolio` | The library: a pannable, zoomable contact sheet of 108 clips |
| `/careers` | Crew call: perks, expandable roles, application form |
| `/book-demo` | Calendly embed, coloured from the URL so it sits in the room |
| `/privacy`, `/terms` | Shared `LegalPage` component |
| `/api/contact` | Form handler (see below) |

`src/app/(site)/` is a route group and does not appear in URLs. `/portfolio`
sits outside it because it owns the full viewport and renders no footer.

## The system

`src/app/globals.css` holds everything. Four rules carry the look:

1. Display type is the condensed face (Big Shoulders Display), heavy,
   uppercase, tight leading. One word of a statement drops to the serif
   italic (Instrument Serif), lowercase: `Cut for the <em>scroll.</em>`
2. The only interface colour is the tally lamp, `--tally`, and it means
   **state** (playing, live, in flight, error). It never sits on a button.
3. Labels are mono (JetBrains Mono), 11px, uppercase, tracked: `.mono`.
   Numbers are tabular. Timecodes use `.tc`.
4. Corners are square (2px) or pill. Nothing between.

Tokens: `--stage` / `--stage-2` / `--stage-3` for the ground, `--ink` /
`--ink-soft` / `--ink-mid` for text, `--ink-faint` for decoration only (it
fails contrast below 24px), `--rule` / `--rule-strong` for hairlines. The
old paper-system names (`--paper`, `--slab`, …) are aliased so nothing
reads an undefined variable.

Fonts are vendored in `src/app/fonts/` (all SIL OFL). The site uses the
variable woff2 files; the `.woff` copies exist only for the OpenGraph image,
because Satori cannot read woff2 or variable fonts. Swapping a licensed face
in is a one-file change in `src/app/layout.tsx`.

## The room's parts (`src/components/room/`)

- **Slate** — the clapperboard intro. Server-rendered so nothing flashes
  beneath it; a layout effect removes it before first paint for anyone who
  has seen it (`localStorage` `tn-slate-seen`) or prefers reduced motion.
- **ColdOpen** — the statement over a muted film, with the room's readouts
  (running timecode, studio clocks) and three mono controls.
- **Sequence** — six 9:16 frames on a pinned strip. Vertical scroll drives
  the horizontal shuttle; the ruler underneath shows the playhead and a
  timecode. The frame under the playhead plays, hover plays any other,
  focus drives the scroll so keyboard users see what they land on. On
  phones the frames stack full-screen and play as they arrive. Every frame
  has a slate that stands until the video reports a frame; a failed source
  reads **Offline** and stops asking for a load slot.
- **TitleCard, CreditsRoll, ResultsSlate, EndSlate** — the studio, the
  clients, the results, contact.
- **FilmPage** — the film in its well with transport; the idea; the numbers.
- **CutLink / CutOverlay** (`src/lib/cut.ts`) — route changes drop a black
  frame, hold it 140ms after the new route commits, then lift. A safety
  timer lifts it after 2.5s regardless. Links prefetch on hover so the frame
  waits on the router, not the network. Reduced motion skips the cut.
- **Cursor** — on fine pointers the arrow becomes a ring that names the
  click (`data-cursor="Play|Open|Cut|Scrub|Pause"`). Touch and reduced
  motion keep the native cursor; so do iframes.
- **Readouts, TopMark** — small instruments.

## Data

- `src/lib/films.ts` — the six films, slugged and numbered, joined with
  `posters.json` (poster path + duration when extracted).
- `src/lib/case-studies-data.ts` — the case studies the films are built on.
- `src/lib/services-data.ts`, `site-data.ts`, `board-videos.ts`, `legal-data.ts`.

### Posters

`node scripts/posters.mjs` pulls one frame per film with ffmpeg and writes
`public/posters/<slug>.jpg` plus `src/lib/posters.json`. Run it whenever a
video URL changes. **As of 2026-09-03 every video URL is dead** — the
CloudFront distribution that served them was lost with the previous hosting
account and has no DNS record anywhere — so the frames show their slates
until the studio re-hosts the originals.

## Contact form

`POST /api/contact` sends via Resend when both env vars are set:

```
RESEND_API_KEY=...
CONTACT_FROM=noreply@yourdomain.com
CONTACT_TO=info@tiltedneedle.com   # optional, this is the default
```

With no transport configured the route answers `{ fallback: true, to, subject }`
and the client opens a prefilled `mailto:` link, and says "Almost there"
rather than claiming delivery. Per-IP rate limit (5/min, in memory), 16 KB
body cap, per-field caps, type checks, email validation, 8s upstream timeout.

## Verifying

Visual checks run through Playwright: `next start` on 3400, then drive the
page and screenshot into a scratch directory (never the repo). Inject
`.grain{animation:none}` and force `[style*="opacity"]` to 1 to freeze
reveals for a still. Check `document.body.classList.contains("is-cutting")`
around a click to time the cut. The custom cursor and slate are absent under
`emulateMedia({ reducedMotion: "reduce" })` by design.

## Motion and reduced motion

The `prefers-reduced-motion` block in `globals.css` stops CSS animations
only. Framer Motion ignores it, so every `motion.*` element guards itself
with `useReducedMotion()`: reveals set `initial={false}` or a zero offset,
and nothing is ever parked at `opacity: 0` waiting on an observer that a
reduced-motion user will not trigger. Fades are allowed; movement is not.
