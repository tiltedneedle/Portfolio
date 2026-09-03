# PROGRESS

Working log for the Editing Room rebuild of tilted-needle-site. If you are
resuming after a cut-off: read this first, then `git log --oneline -5`, then
pick up at **In flight**. Do not re-ask the user what to do.

Repo: `C:\Users\HP\Downloads\JOB2\tilted-needle-site` (remote `github-tn`,
`tiltedneedle/Portfolio`, branch `main`). Build with `npm run build`; serve
with `npx next start -p 3400` (kill any old listener on 3400 first, or the
start fails with EADDRINUSE and you verify a stale build). Visual checks go
through the Playwright MCP (`browser_run_code_unsafe`), screenshots into the
session scratchpad, never into the repo.

## The concept (approved 2026-09-03, "do whatever seems right")

"The Editing Room, cut vertical." Dark single-world system, four open faces
(Big Shoulders Display / Instrument Sans / Instrument Serif italic / JetBrains
Mono), one interface colour (tally red, state only). Home runs as a reel:
slate (once per device) > cold open > sequence of six 9:16 films on a pinned
timeline > title card > credits > results > end slate > footer. Film pages at
`/film/[slug]`. Route changes are black-frame cuts. Custom cursor on fine
pointers. Treatment artifact: claude.ai/code/artifact/ca459411-f319-45d6-98e7-d1199eafa767

Decisions made on the user's behalf: statement "Cut for the scroll.", open
faces vendored (swap to licensed = one file, `src/app/layout.tsx`), tally
accent, mint editorial system retired.

## Done

- [x] Design system: `src/app/globals.css` (tokens, faces, `.display`, `.mono`,
      `.tc`, `.lamp`, cut frame, cursor, grain on screen blend at 0.085).
- [x] Fonts vendored: `src/app/fonts/*.woff2` (4 faces, all SIL OFL).
- [x] Cut transitions: `src/lib/cut.ts`, `room/CutOverlay.tsx`, `room/CutLink.tsx`.
- [x] Cursor: `room/Cursor.tsx` (`data-cursor="Play|Open|Cut|Scrub|Pause"`).
- [x] Film model: `src/lib/films.ts` (+ `posters.json`, `scripts/posters.mjs`).
- [x] Home beats: `room/Slate`, `ColdOpen`, `Sequence`, `TitleCard`,
      `CreditsRoll`, `ResultsSlate`, `EndSlate`; `room/Readouts` (timecode, clocks).
- [x] Film pages: `app/(site)/film/[slug]/page.tsx` + `room/FilmPage.tsx`
      (transport: play/pause, scrub, sound; match cut to next film). Sitemap updated.
- [x] Nav and footer rewritten as slates; `room/TopMark` replaces BackToTop.
- [x] Nine dead mint components removed. tsc clean, eslint 0 errors, build clean.
- [x] Visual pass 1 (desktop 1440, mobile 390): all beats render; slate/caption
      overlap in frames fixed; grain softened.

- [x] Visual pass 2: inner pages (studio, service, careers, book-demo, legal,
      404) and the library rewritten into the room. Commit `3627051`, pushed.
- [x] Hardening round 1: Sequence re-measures after `document.fonts.ready` and
      on orientation change; a failed source marks its frame Offline and stops
      asking for a slot; CutLink no longer cuts to the page already showing
      (the pathname never changed, so the frame stayed black until the safety
      timer); nav numbers are aria-hidden; the film well derives width from
      its height budget so it is always 9:16; the ruler readout lost its
      `aria-live` (it changed on every scroll tick).
- [x] Manifest and JSON-LD carry the new description and stage colour.

- [x] OG image is the slate, in the site's faces. Satori reads TTF/OTF/WOFF
      only; Google serves static WOFF to an ancient user agent, so
      `src/app/fonts/*.woff` are vendored copies for the renderer alone.
- [x] Separator spacing fixed (careers eyebrow, library card).

- [x] Reduced-motion audit passed: slate skipped, native cursor, sequence
      still shuttles, hero lines land at rest, nothing parked at opacity 0.
- [x] Heading order: service detail and careers section labels are now h2.
      Slate labels moved off `--ink-faint` (contrast).
- [x] Cut measured: black on click, route commit ~470ms later, lift 140ms
      after. CutLink now prefetches on pointerenter so the hold is shorter.
- [x] Contact route: 8s timeout on the Resend call (was unbounded).

- [x] Round two committed (`6d0fb2a`). Heading order verified on every page.
- [x] Mobile pass 2 on inner pages: no horizontal overflow, h1 at 56px on
      390px, film well fills the width at 9:16, library pinch-and-drag card.
- [x] Bundle: ~1.16 MB of client JS across all route chunks, largest chunk
      224 KB (React + framer). Deps: clsx, framer-motion, lucide-react,
      tailwind-merge only.

- [x] Keyboard access to the pinned strip: focusing a frame drives the scroll
      so it lands under the playhead (verified: frame 05 at x 524-888, y 84,
      scrollY 2530). Two traps found on the way: an `overflow: hidden` box
      still scrolls when a child is focused (now `overflow: clip`), and this
      headless browser only advances smooth scrolls when it paints, so scroll
      checks must force frames with screenshots or set
      `html{scroll-behavior:auto}` first.
- [x] Cursor hands back to the native pointer over iframes (Calendly).
- [x] README rewritten for the room system.
- [x] Project memory updated (`project_marketing_site_replica.md`).

## In flight

- (nothing; Cut 1 is complete and pushed)

## Next

- [ ] Posters: run `node scripts/posters.mjs` once videos are re-hosted, then
      `git add public/posters src/lib/posters.json` and rebuild.
- [ ] When the studio has a real showreel, replace `SHOWREEL` in
      `room/ColdOpen.tsx` (currently a Pixabay placeholder).
- [ ] Cut 2 (from the treatment): library as a true contact sheet with the
      room's data model, sound design, keyboard shuttle (J/K/L), mobile media.
- [ ] Cut 3: raw-vs-final, BTS, credits, CMS. Needs content that does not exist.

## Blockers (need the user)

- **All 144 video URLs are dead.** `d6lso8oygmnu9.cloudfront.net` has no DNS
  record at any resolver, including AWS's authoritative server; the old
  Amplify host is gone too; nothing in the Wayback Machine. The films, the
  30 portfolio items and the 109 board clips all point there. Every frame
  falls back to its slate (designed for this), but the site has no moving
  picture until the studio re-hosts the originals. Recommended: Cloudflare R2
  or Supabase Storage, then update `case-studies-data.ts`, `site-data.ts`,
  `board-videos.ts`, run `scripts/posters.mjs`, rebuild.
- The "play reel" clip is still a Pixabay placeholder (no studio showreel exists).
