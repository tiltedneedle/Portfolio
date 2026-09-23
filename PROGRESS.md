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
never into the repo. Shell gotcha on this machine: long file contents
through the Bash tool (heredocs, node -e) have failed to parse; write
files with the Write tool (to the scratchpad, then `cp`) or put edit
logic in a scratch `.cjs` and run it with node.

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
- The palette opens on ⌘K, `/`, the desktop button, or a `tn:palette`
  window event (the phone menu sends it). Dialogs (palette, prompter,
  lightbox) share `useFocusTrap`.
- Reveals (`Reveal.tsx`) never hide anything in the HTML: after hydration
  only blocks below the fold get `reveal-wait`, and an observer adds
  `reveal-in`. Reduced motion skips it entirely.

## Decisions

- **Route changes stay black-frame cuts.** Next 16's `experimental.
  viewTransition` (React `<ViewTransition>`) was read and not adopted: it
  animates continuity (morphs, slides, crossfades), and the room's grammar
  is the opposite, a cut. It is also behind an experimental flag. Revisit
  only if a shared-element morph is ever wanted (e.g. a script card into
  its page).
- **Spoken length is 150 words a minute**, stated on the script page, the
  scripts rail and the prompter HUD. Change `SPOKEN_WPM` in
  `src/lib/words.ts` if a client's presenter is measurably different.

## Done

- [x] Content model, 13 universal guides, block renderer, home (slate,
      lockup, drifting backdrop, seven-card pinned strip, five-step loop),
      nav with panels, guide pages with rail and rule, audit reports, ideas
      rails, scripts rail + script page with copy, login, 404.
- [x] Multi-client architecture as above, verified end to end in the
      browser. Demo client with written audit sections, ideas and scripts.
- [x] Creative wave 1 (commit `d84bf8c`): reveal motion on blocks; reading
      line on guides and reports; palette (⌘K, /, arrows, Enter, section
      anchors) and `[` `]` paging; prompter on script pages (roll, pace,
      size, mirror, rewind, timecode) and a print stylesheet; "deal me one"
      on the ideas page; posters on chapter overviews (studio stills);
      intro and outro film slots on home; eleven diagram block kinds;
      error pages; clipboard fallback; CSP; README for multi-client.
- [x] Waves 2 and 3: current page marked in nav panels and the phone
      contents; "Find anything" in the phone menu opens the palette;
      spoken length on script pages, rail cards and the prompter HUD; read
      ticks on the guide rail; cadence grid at six columns and structure
      strip timecodes thinned on a phone; nav panels for the last three
      rooms right-aligned (the Create panel used to overflow at 1440);
      reveals rebuilt so the first screen is served at rest; focus traps
      on the palette and the prompter, with focus returned on close.

## In flight

- [ ] Nothing mid-change. All verified and committed. Pick from Next.

## Next

1. Audit report: a "what to do first" summary block type when the client's
   findings are written (needs the first real client to shape it; do not
   invent findings).
2. Ideas page: the pillar sections as the palette's "Your content" entries
   already exist; consider a per-card "Open as script brief" that jumps to
   the ideation guide with the idea in the palette query (stateless).
3. Home strip: each of the seven cards could carry its live count (13
   headings / 4 written, 45 ideas, 3 scripts) from the client data.
4. Lighthouse / axe pass on the gated server (needs Chrome available to
   the CLI; the Playwright MCP browser can run axe-core from a CDN if the
   CSP is relaxed on a dev server only).
5. Awaiting from the user (do not block): nine training-video ids for the
   Create guides plus intro/outro, first real client content, images for
   `figure` blocks.
