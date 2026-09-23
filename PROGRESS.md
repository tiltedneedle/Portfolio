# PROGRESS

Working log for tilted-needle-site. If you are resuming after a cut-off:
read this first, then `git log --oneline -5`, then pick up at **In flight**.
Do not re-ask the user what to do. The user has asked for autonomous,
continuous work: implement, test, harden, research, improve, repeat.

Repo: `C:\Users\HP\Downloads\JOB2\tilted-needle-site` (remote `github-tn`,
`tiltedneedle/Portfolio`). Build with `npm run build`; serve with
`npx next start -p 3400` (kill any old listener on 3400 first). A gated
server for testing the door: `PORTAL_SECRET=x npx next start -p 3401`.
Verify with `npm run smoke -- http://localhost:3400` and
`npm run smoke -- http://localhost:3401 --gated`; content with `npm run
check`. Visual checks go through the Playwright MCP
(`browser_run_code_unsafe`), screenshots into the session scratchpad,
never into the repo. Shell gotchas on this machine: long heredocs with
apostrophes have failed to parse in the Bash tool; write files with the
Write tool (to the scratchpad, then `cp`) or with a small node script.

## What this is (2026-09-24)

**The client system**: a private site delivering one client's complete
viral content system. One deployment serves many clients: each has an
access code; the door identifies them; every page under it is theirs.
Brief: the user's "Info Product Servicing .md". Six rooms: Home, Your
audit, Your content (personalised), Create, Publish, Analyse (universal).

The marketing site this grew out of is on the `marketing-site` branch.

## Architecture (settled)

- Content is data: `src/content/system/` (universal guides as typed
  blocks), `src/content/clients/<slug>/` (identity, audit, ideas, scripts).
  `registry.ts` lists clients; `template` is what an open door shows; `demo`
  (Horizon Aviation, fictional, code `horizon-2026`) shows the finished state.
- Every client's pages are pre-rendered at `/c/<slug>/...`. `src/proxy.ts`
  verifies the signed session cookie (`tn-room`, HMAC under PORTAL_SECRET)
  and rewrites clean URLs into that client's tree; `/c/...` direct hits are
  bounced to clean paths. No PORTAL_SECRET means an open door showing only
  the template. Login is one field: the code identifies the client
  (constant-time compare over every client's hash; 12 tries / 10 min per IP).
  A readable `tn-in` cookie lets the static footer show "Leave the room".
- Scripts: `npm run access -- <slug> <code>` (hash for a client file),
  `npm run check` (validates every client and guide), `npm run smoke`.
- Diagrams are block kinds (`src/components/portal/diagrams.tsx`, plus
  `Flashcards.tsx` and `Typewriter.tsx` for the two that need a browser).
  Adding one: a type in `src/content/types.ts`, a case in `blocks.tsx`, a
  rule in `scripts/check-content.mjs`, a line in README.
- Security headers with a narrow CSP in `next.config.ts` (no nonces: the
  pages are static). New hosts must be added there.

## Done

- [x] Content model, 13 universal guides, block renderer, home (slate,
      lockup, drifting backdrop, seven-card pinned strip, five-step loop),
      nav with panels, guide pages with rail and rule, audit reports, ideas
      rails, scripts rail + script page with copy, login, 404.
- [x] Multi-client architecture as above, verified end to end in the
      browser. Demo client with written audit sections, ideas and scripts.
- [x] Creative wave 1 (2026-09-24): reveal motion on blocks; reading line
      on guides and reports; palette (⌘K, /, arrows, Enter, section
      anchors) and `[` `]` paging; prompter on script pages (roll, pace,
      size, mirror, rewind, timecode) and a print stylesheet; "deal me one"
      on the ideas page; posters on chapter overviews (studio stills);
      intro and outro film slots on home.
- [x] Diagram blocks: retention curve and diagnose-a-video ladder
      (Analyse), cadence strip and one-video-five-platforms fan (Publish
      strategy), structure strip (Core message), shot sheet and lens wedges
      (Filming), idea fan (Ideation), hook flashcards (Hooks), search
      typewriter (Discoverability), cycle ring (Monthly process). `figure`
      block for the user's images (validated against `public/`).
- [x] Hardening: `error.tsx` and `global-error.tsx` in the room's voice,
      clipboard fallback in CopyScript, CSP, home title no longer doubled
      ("X × Tilted Needle · Tilted Needle"). README rewritten for the
      multi-client flow.

## In flight

- [ ] Verify wave 1 + diagrams in the browser (screenshots of every new
      diagram at 1440 and 390), then commit and push.

## Next

1. Second look at the diagrams on a phone: the cadence grid at 10 columns,
   the flow ladder, the shot sheet at two columns.
2. Nav: mark the current page in the panel; palette entry in the mobile
   contents screen (the ⌘K button is desktop-only).
3. Guide rail: a "read" tick per section once scrolled past (session only).
4. Script page: estimated speaking time from the word count (150 wpm) in
   the mono strip, and the same in the prompter HUD.
5. Audit report: a "what to do first" summary block type when the client's
   findings are written (needs the first real client).
6. Research: view-transitions API for the cut (Next 16 supports the
   `ViewTransition` component behind a flag; check the bundled docs),
   `next/font` display strategy for the display face, and whether the
   `Reveal` wrapper should skip blocks above the fold.
7. Awaiting from the user (do not block): nine training-video ids for the
   Create guides plus intro/outro, first real client content, images for
   `figure` blocks.
