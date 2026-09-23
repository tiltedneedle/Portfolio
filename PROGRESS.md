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
never into the repo. Accessibility: axe-core is a dev dependency; inject
`node_modules/axe-core/axe.min.js` with `page.addScriptTag({ path })`
(inline scripts pass the CSP) and run `axe.run(document)`. Shell gotcha
on this machine: long file contents through the Bash tool (heredocs,
node -e) have failed to parse; write files with the Write tool (to the
scratchpad, then `cp`) or put edit logic in a scratch `.cjs` and run it.

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
- **Faint ink (`--ink-faint`) is decorative only**: numerals, rules, the
  off lamp, the quote mark. It fails AA on every stage tone, so text uses
  `--ink-mid` at the quietest. The axe pass is what enforces this.

## Decisions

- **Route changes stay black-frame cuts.** Next 16's `experimental.
  viewTransition` was read and not adopted: it animates continuity, and
  the room's grammar is a cut. Revisit only for a shared-element morph.
- **Spoken length is 150 words a minute** (`SPOKEN_WPM` in
  `src/lib/words.ts`), on the script page, the rail cards and the prompter.
- **Next is pinned to an exact version** (16.3.6 as of 2026-09-24, taken
  for the Windows unauthenticated RCE advisory and the sharp/postcss ones
  under it). Upgrade by editing the pin, `npm i`, then the full verify
  loop. The two remaining audit items are vitest (dev-only; the "fix" is a
  downgrade) and are ignored on purpose.

## Done

- [x] Content model, 13 universal guides, block renderer, home, nav with
      panels, guide pages with rail and rule, audit reports, ideas rails,
      scripts rail + script page, login, 404.
- [x] Multi-client architecture, verified end to end. Demo client.
- [x] Creative wave 1 (`d84bf8c`): reveals, reading line, palette, `[` `]`
      paging, prompter + print, deal me one, posters, home film slots,
      eleven diagram kinds, error pages, clipboard fallback, CSP, README.
- [x] Waves 2 and 3 (`b73bea0`): current page in nav panels and phone
      contents, phone palette entry, spoken lengths, rail read ticks,
      phone fixes for cadence/structure, panel alignment, at-rest reveals,
      focus traps.
- [x] Wave 4: home strip cards carry live counts ("4 of 13 written", "45
      of 100 written", "3 of 20 written"); axe pass on nine pages: the
      only violations were faint-ink contrast (79 text uses moved to mid
      ink) and the idea rails not being keyboard-scrollable (rails are now
      focusable and named); Next 16.2.12 → 16.3.6; `npm audit fix` for
      js-yaml.

## In flight

- [ ] Verify wave 4 (smoke, axe re-run, strip counts screenshot), then
      commit and push.

## Next

1. Audit report: a "what to do first" summary block type when the client's
   findings are written (needs the first real client to shape it; do not
   invent findings).
2. Ideas page: a per-card "Write it" that opens the ideation guide with the
   idea in the palette query (stateless).
3. A `.numeral` watermark is still flagged by axe as low-contrast text; it
   is decorative and aria-hidden. Consider rendering numerals as SVG or
   with `role="presentation"` if a clean axe report is ever required.
4. Awaiting from the user (do not block): nine training-video ids for the
   Create guides plus intro/outro, first real client content, images for
   `figure` blocks.
