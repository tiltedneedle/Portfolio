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
  `npm run new-client -- <slug> "<Name>" --code "<code>"` scaffolds a client.
- Each client's own door is `/login?for=<slug>` (name and mark on the
  slate; the code still opens it).
- Every client's pages are pre-rendered at `/c/<slug>/...`. `src/proxy.ts`
  verifies the signed session cookie (`tn-room`, HMAC under PORTAL_SECRET)
  and rewrites clean URLs into that client's tree; `/c/...` direct hits are
  bounced to clean paths. No PORTAL_SECRET means an open door showing only
  the template. Login is one field: the code identifies the client
  (constant-time compare over every client's hash; 12 tries / 10 min per IP).
  A readable `tn-in` cookie lets the static footer show "Leave the room".
- Scripts: `npm run access -- <slug> <code>` (hash for a client file),
  `npm run check` (validates every client and guide, warns on clip and
  poster ids missing from published.json), `npm run smoke` (every route,
  the door, and a string from each new feature).
- Diagrams are block kinds (`src/components/portal/diagrams.tsx`, plus
  `Flashcards.tsx` and `Typewriter.tsx` for the two that need a browser).
  Adding one: a type in `src/content/types.ts`, a case in `blocks.tsx`, a
  rule in `scripts/check-content.mjs`, a line in README.
- `DealOne` deals a random written card; the ideas page deals an idea,
  the scripts page deals a script with an "Open" cut to it.
- Security headers with a narrow CSP in `next.config.ts` (no nonces: the
  pages are static). New hosts must be added there.
- Unit tests (`npm test`, vitest) cover the pure parts: the session token
  and access hash (`src/lib/session.test.ts`), spoken length
  (`src/lib/words.test.ts`) and the palette index. Components are verified
  in the browser. Node 23 on this desktop can print a libuv assertion at
  exit; read the test summary, not the exit code.
- The palette opens on ⌘K, `/`, the desktop button, or a `tn:palette`
  window event (the phone menu sends it). Dialogs (palette, prompter,
  lightbox) share `useFocusTrap`.
- Reveals (`Reveal.tsx`) never hide anything in the HTML: after hydration
  only blocks below the fold get `reveal-wait`, and an observer adds
  `reveal-in`. Reduced motion skips it; print forces everything visible.
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
- **Stills not in published.json fall back to YouTube's `oardefault.jpg`**;
  every id currently used was checked and exists there (2026-09-24).

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
- [x] Wave 4 (`834b70d`): live counts on the home strip; axe pass (faint
      ink off text, rails keyboard-scrollable); Next 16.3.6; js-yaml fix.
- [x] Wave 5 (`04fa64d`): print keeps reveal-waiting blocks visible;
      `npm run new-client`; poster warning in the validator; README.
- [x] Wave 6: "Film one today" on the scripts page (DealOne generalised
      with an `href` per card, verified: the dealt card's Open cuts to
      the script); smoke covers the prompter, the deal, the flashcards,
      the retention curve, the cadence strip and the home film slots.
      Hydration under reduced motion fixed: the typewriter and the
      flashcards no longer paint differently on the client (React #418
      on the discoverability page); console verified clean on six pages
      in both motion settings. On a script page, `[` and `]` page through
      the scripts themselves.

- [x] Wave 7: unit tests added; the palette-index test found that the
      index on disk was still the first draft (home split into three hash
      entries, no room overviews, ideas without pillar sections) because
      the rewrite had been in a shell command that never ran. Rewritten
      and verified in the browser. Palette section picks now land: the
      jump under the black frame is instant (the smooth default was being
      cancelled by the overlay's reset to the top), Next is told about the
      page-wide smooth scrolling (data-scroll-behavior), and a same-page
      pick frees the overflow the open palette had locked. Then two more
      causes found by logging every scroll call: the overlay's reset to the
      top raced with the section jump on hash navigations (it now skips
      when there is a hash), and smooth scrolls started while the palette
      closes are dropped by the browser (same-page jumps are instant, after
      the palette has gone). Cuts within a scene, not glides.

- [x] Wave 9, the personalised pages: findings are designed objects
      (verdict lamp, score dial, keep / holding back / would change
      columns, labelled lists, evidence stills, a place in the first three
      moves); the report header scans every heading in a row of lamps and
      averages the scores; the competitor report carries a board of
      accounts and a positioning map. Demo written in full (13 + 8); the
      template still shows slates. Validator knows every new field.
- [x] Wave 8: each client has their own door, `/login?for=<slug>` (the
      brief's unique URL per client): the slate carries their name and
      mark, errors keep the link, the scaffolder prints it, smoke checks it.
      The code is still the credential. Palette section searches also match
      on the room name.

## In flight

- [ ] Nothing mid-change. All verified and committed. Pick from Next.

## Next

0. A dev-mode console pass (`next dev`) for attribute-level hydration
   warnings that production hides. The preview tool reads the ops app's
   tracked `.claude/launch.json`, which has no entry for this repo; add one
   only if the user is happy to have that file changed, or run it from
   this repo's own launch config in a session opened on this repo.
1. Audit report: a "what to do first" summary block type when the client's
   findings are written (needs the first real client to shape it; do not
   invent findings).
2. A `.numeral` watermark is still flagged by axe as low-contrast text; it
   is decorative and aria-hidden. Consider rendering numerals as SVG if a
   clean axe report is ever required.
3. Awaiting from the user (do not block): nine training-video ids for the
   Create guides plus intro/outro, first real client content, images for
   `figure` blocks, a real client logo to test `--logo`.
