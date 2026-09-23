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
never into the repo.

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

## Done

- [x] Content model, 13 universal guides, block renderer, home (slate,
      lockup, drifting backdrop, seven-card pinned strip, five-step loop),
      nav with panels, guide pages with rail and rule, audit reports, ideas
      rails, scripts rail + script page with copy, login, 404.
- [x] Multi-client architecture as above, verified end to end in the
      browser: wrong code, right code, own pages, direct /c/ bounce, leave,
      open mode. 84 static pages build clean.
- [x] Demo client with written audit sections, 25 authority ideas and 3
      scripts, so the finished state is visible.

## In flight

- [ ] Commit the multi-client architecture, then start the creative wave.

## Next (creative wave, in order)

1. Reveal motion on guide blocks (rows rise as they enter; reduced motion
   respected), reading-progress line on guides (tally red, timecode style).
2. Command palette (⌘K / "/"): every page and section, typeahead, cut on
   pick. Keyboard `[` `]` for previous/next page.
3. Teleprompter mode on script pages: full-screen, large type,
   auto-scroll with speed, mirror toggle. Print stylesheet for scripts.
4. "Deal me one" on the ideas page: a random idea, stateless.
5. Diagrams as blocks: retention curve (Analyse), monthly calendar strip
   and distribution board (Publish strategy), video-structure strip (Core
   message), shot-size contact sheet and lens diagram (Filming), idea
   multiplier branch (Ideation), hook flashcards (Hooks), diagnose-a-video
   decision flow (Analyse), search typewriter (Discoverability).
6. Chapter overviews with a poster per guide (first clip's still).
7. Intro and outro film slots on home.
8. Hardening: error.tsx / global-error.tsx in the room's style, clipboard
   fallback, CSP header, `figure` block for the user's images.
