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
- Remote stills go through `Still.tsx`, which hides itself on error or
  on YouTube's tiny placeholder, so the slate underneath shows.
- Scripts: `npm run access -- <slug> <code>` (hash for a client file),
  `npm run check` (validates every client and guide, warns on clip and
  poster ids missing from published.json), `npm run smoke` (every route,
  the door, and a string from each new feature), `npm run a11y -- <base>
  --code <code>` (Playwright + axe over every route at two widths, with
  overflow and console checks; also a CI step after the gated smoke).
- Diagrams are block kinds (`src/components/portal/diagrams.tsx`, plus
  `Flashcards.tsx` and `Typewriter.tsx` for the two that need a browser).
  Adding one: a type in `src/content/types.ts`, a case in `blocks.tsx`, a
  rule in `scripts/check-content.mjs`, a line in README.
- `DealOne` deals a random written card; the ideas page deals an idea,
  the scripts page deals a script with an "Open" cut to it.
- Security headers with a narrow CSP in `next.config.ts` (no nonces: the
  pages are static). New hosts must be added there.
- Unit tests (`npm test`, vitest; 62 across 11 files) cover the pure
  parts: the session token and access hash, the proxy's path maps, spoken
  length, the week, inline marks, the palette index, the search index
  (guides and the client's own words), the content helpers, merged
  changes, the ask link and the month's slot order (`lib/month.ts`).
  Components are verified in the browser. Node 23 on this desktop can
  print a libuv assertion at exit; read the test summary, not the exit
  code.
- The palette opens on ⌘K, `/`, the desktop button, or a `tn:palette`
  window event (the phone menu sends it). From three letters it searches
  the words: `src/lib/search-index.ts` builds the index, the route handler
  at `c/[client]/search-index.json` serves it per client, behind the door.
  The index covers the guides (with the client's notes folded in), the two
  reports by heading plus the board and the map, and every written
  script; its URL carries `NEXT_PUBLIC_BUILD` so a deploy is never read
  from the hour-long private cache. Dialogs (palette, prompter, lightbox)
  share `useFocusTrap`; a dialog must blur its field before an exit
  animation, or keys land in it.
- Marks a reader leaves on a device live in `src/lib/read.ts`, one
  localStorage key per kind and client, read through useSyncExternalStore:
  `read` (pages, "chapter/slug"), `filmed` (script numbers) and `pinned`
  (ideas, "pillar:n", in pin order). They drive the nav's read dots, the
  scripts rail, the first month (`lib/month.ts`: scripts, then pins, then
  the hundred round-robin), the call sheet, the shortlist and the home
  strip. Beside them: `tn-pos:<slug>:<key>` (last section read, from
  `GuideRail`), `tn-last:<slug>` (the guide left mid-way, for the call
  sheet's pick-up), `tn-seen:<slug>` (the day home's list was last seen,
  stamped on leaving home; the list marks additions since it and the nav
  lamp lights for anything strictly newer) and `tn-recent:<slug>` (the
  palette's recent picks).
- After a cut, `CutOverlay` focuses `main` (tabIndex -1) once the frame
  lifts, never for a hash target.
- Reveals (`Reveal.tsx`) never hide anything in the HTML: after hydration
  only blocks below the fold get `reveal-wait`, and an observer adds
  `reveal-in`. Reduced motion skips it; print forces everything visible.
- **Faint ink (`--ink-faint`) is decorative only**: numerals, rules, the
  off lamp, the quote mark. It fails AA on every stage tone, so text uses
  `--ink-mid` at the quietest. Numerals are drawn by CSS from `data-n`
  (`.numeral::before`) so they are never text an audit weighs; where a
  section's number matters it is also there as sr-only text. Tally red is
  for state (lamps, bars, the road), never small text. The axe pass is
  what enforces this.
- Motion with meaning, all CSS: the audit desk powers up on load
  (`.desk-*`), the map's road draws itself and the three moves land in
  beats once in view (`.journey-*`, `.beat`, keyed off `Reveal`), a mark
  set by hand pops. All of it is off under reduced motion and in print.

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
- **vitest stays on 3.x.** npm 10.9.2 crashes ("Cannot read properties of
  null (reading 'edgesOut')") building the ideal tree for vitest 4 or 5,
  even from a clean `npm ci`; the remaining audit item is dev-only and
  moderate. Retry after an npm upgrade, not before.
- **Stills not in published.json fall back to YouTube's `oardefault.jpg`**;
  every id currently used was checked and exists there (2026-09-24).

- **No segment-level not-found inside the client tree.** Tried in wave
  15: with dynamicParams on, an unknown script number rendered on demand
  and threw notFound(), but Next still served the site's 404 (a path
  outside generateStaticParams is a routed 404 whatever the page throws;
  the room's boundary only appeared in the RSC payload). The layout keeps
  dynamicParams = false, which is the same result for free.

- Dev-mode pass (2026-09-24, `next dev` on every room, the palette and
  the prompter): no hydration warnings. Two dev-only findings fixed: the
  CSP now allows `'unsafe-eval'` in development only (React's dev tooling
  evals), and the wordmark says its height is `auto` so next/image stops
  warning. Run it again after any change to a component that reads the
  browser (`PORTAL_SECRET=x npx next dev -p 3402`, then log in).
- The palette's index URL carries `NEXT_PUBLIC_BUILD` (stamped in
  `next.config.ts`): the route answers with an hour's private cache, and
  without the stamp a browser kept serving the previous deploy's index for
  that hour, so a client's new audit or script could not be found by its
  words until the cache lapsed.

- `AGENTS.md` and `CLAUDE.md` at the repo root are written by `next dev`
  (Next 16's agent rules block, pointing at `node_modules/next/dist/docs`).
  They are kept committed; `agentRules: false` in next.config would stop
  them, but the pointer is useful to any agent opening this repo.

- **The design system lives in `@layer components`.** Tailwind v4 puts
  utilities in a cascade layer, and unlayered CSS beats any layer
  regardless of specificity or order. A class defined outside a layer
  therefore silently overrides every utility on the same element. New
  rules go inside the layer block in globals.css; only print and
  reduced-motion overrides may use `!important`.

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

- [x] Wave 35: the ninth film found. TikTok's own status for Laser Eye
      Clinic London's 7276573223955729696 is 10249 "content classification
      unavailable": the film exists (posted 2023-09-08, 116s, 16,505,902
      plays, 1.21M likes) but a surgery close-up is kept from logged-out
      viewers and from every embed, oEmbed and the profile's first page
      alike, and no search engine indexes it. A public metadata API
      (tikwm.com) still answers with its stats and an HD copy; the still is
      a 1080x1920 frame taken in the browser at one second (Playwright's
      bundled ffmpeg has no mp4 demuxer or h264 decoder). The reel gains
      `restricted: true`: such a card shows the still and the count and
      opens on TikTok in a new tab instead of the lightbox, and the
      validator refuses it as a clip. Nine films, 134.6 million views.
- [x] Wave 34: the showreel. The user sent nine client videos with their
      views; eight are in `src/content/system/reel.ts` (TikTok x5,
      Instagram x3, 118 million views), stills cached under public/clips
      (TikTok's oEmbed gives a 1080-wide cover; Instagram's Open Graph
      still, fetched with a facebookexternalhit user agent, is 360x640).
      Home shows the reel after the welcome with the views as numerals;
      the hero backdrop drifts through the stills first; two openings join
      the hooks guide's clip rail; the lightbox plays TikTok's embed/v2
      and Instagram's /embed/ in boxes sized for their chrome (CSP
      frame-src widened; the proxy leaves /clips/ alone, which it did not
      at first, so every still was a 404 behind the door). The validator
      refuses a reel entry without a still; the smoke asserts the reel and
      a still. Laser Eye Clinic London (16M) is left out: TikTok answers
      "video currently unavailable" for it here, its oEmbed is empty and
      its page is a login wall.
- [x] Wave 33: belt and braces: the validator refuses a "recently added"
      link (system or client) that does not land on a page; the smoke
      suite asserts the security headers next.config.ts promises (CSP,
      noindex, HSTS, nosniff, frame options) on a page and a route handler;
      the a11y pass also covers the door, the named door and the 404
      (ignoring the browser's log of a not-found page's own status).
- [x] Wave 32: a lamp beside the mark in the nav when something has been
      added since this device last saw the home list (strictly newer than
      the seen day, so it goes dark once home has been seen); "Pin the
      ones you like" on the ideas page until something is pinned;
      X-Robots-Tag noindex on every response; the Next list tidied.
- [x] Wave 31: the prompter draws a progress line along the foot of its
      HUD (painted by the roll loop and a native scroll listener, since
      the scroller only exists while it is open); the guide rail remembers
      the guide left mid-way (`tn-last:<slug>` = "chapter/slug\nsection")
      and the call sheet's Read cell offers to pick it up at that section
      until the guide is marked read; the three first moves land in beats
      once their section is in view (Reveal + `.beat`, off under reduced
      motion and in print).
- [x] Wave 30: after a cut, focus starts at the top of the new scene:
      `main` is focusable (tabIndex -1, no outline) and CutOverlay focuses
      it once the frame lifts, never for a hash target, so a keyboard or
      screen-reader user is never left where focus was on the old page. A
      script's slate names the idea it came from ("From Personal 01"),
      linking to the pillar.
- [x] Wave 29: framer-motion 12 to 13.4 (the 13.0 breaks are gesture
      callback arguments, exitBeforeEnter, AnimateSharedLayout and the
      is-prop-valid dependency; none in use; cuts, palette, scroll strip
      and prompter checked). The accessibility pass is now a script and a
      CI step: `npm run a11y -- <base> --code <code>` opens Playwright's
      Chromium with motion reduced, logs in, takes every route the index
      knows plus the fixed pages through axe (WCAG 2.2 AA + best practice,
      no filter) at desktop and phone width, fails on any violation,
      horizontal overflow or console error, then checks the palette open.
      Its first run found the cascade bug below (a mock profile's Follow
      button read grey on cream).
- [x] Wave 29, the cascade: every design-system class in globals.css now
      sits in `@layer components`. Unlayered author CSS beats every
      Tailwind utility whatever the order, so `mono text-[color:var(--ink)]`
      had rendered ink-mid and `slate-link text-[13px]` 11px, silently, in
      thirty places. Before/after screenshots of every room compared;
      only the intended colours and sizes changed.
- [x] Wave 28: the shortlist: ideas pin on this device (`usePinned`, a
      third mark kind; keys "pillar:n", kept in pin order), Pin sits beside
      Copy on every idea card, the ideas page opens with the shortlist
      (unpin, ask for a script), the first month's idea days and the call
      sheet's Film cell take from it first, the home strip counts pins.
      The month's slot order is `monthSlots()` in lib/month.ts, tested
      (62 tests): scripts, then pins in order, then the hundred round-robin,
      skipping ideas that became scripts. FirstMonth became a client
      component to read the pins.
- [x] Wave 27: the phone pass (390px, every room, axe with WCAG 2.2 AA):
      the audit's score strip shares the width instead of pushing the page
      to 668px (a grid item needs min-w-0 or it grows with its contents),
      a long client name wraps in the welcome, the script card's header
      holds on a narrow card, slate links get a taller hit area on coarse
      pointers; numerals are drawn by CSS from `data-n` (`.numeral::before`)
      so a faint watermark is never text an audit weighs, with sr-only
      numbers where a section's number matters; axe is clean everywhere
      with no filter. The first month prints ("Print the month"; the deal
      card stays off paper).
- [x] Wave 26: motion with meaning: the map's road draws itself once the
      map is in view (an SVG mask sweeps the dashed line, then the ring
      and its label), the audit desk powers up on the cut (lamps in
      sequence, bars rising, then the average), a mark set by hand pops;
      all three are CSS keyed off Reveal or page load, off under reduced
      motion and in print. The typed word stands out in search snippets;
      the home strip counts filmed scripts; the validator checks the
      contact is an address or a link; mergeChanges and askHref live in
      lib with tests (58 tests).
- [x] Wave 25: the scripts room is a production board: a script can be
      marked filmed on this device (`useFilmed` beside `useRead` in
      lib/read.ts), and the rail, the first month, the call sheet (which
      now prefers an unfilmed script) and the home readout follow; a
      client's own `changes` fold into Recently added as "For you"; every
      idea card can ask the studio for it as a script (a mailto carrying
      the idea, or the contact link when the contact is not an address).
- [x] Wave 24: search reaches the client's own words (the two reports by
      heading, plus the board and the map, and every written script, with
      the palette's index URL stamped by build so a deploy is never read
      from an old cache); home marks what was added since this device's
      last visit; unit tests for the content helpers (53 tests); the
      dev-mode console pass (clean; dev-only CSP eval and wordmark fixes).
- [x] Wave 23: the positioning map draws the journey (a dashed line from
      you, today, to a `target` ring labelled with what follows the comma
      in its name, on the open side); CopyIdea collapsed onto CopyText; the palette is a
      real combobox (the field keeps focus, `aria-activedescendant` moves,
      options are not buttons); two notes on one guide are two landmarks
      with distinct names; axe clean on every new piece.
- [x] Wave 22: anchors sit beside the headings, not inside them (a button
      inside an h2 pollutes the heading's accessible name); "Copy all as a
      list" on the ideas page (the written hundred, by pillar, numbered);
      README rows brought up to date.
- [x] Wave 21: the audit header draws the shape of the account (one bar
      per scored heading under the lamp scan, tally where weak); every
      section heading in guides and reports carries a copy-link anchor on
      hover ("Link copied"); the call sheet's Read cell is drawn from the
      guides not yet read on this device, and moves on once one is marked.
- [x] Wave 20: the palette lists recent picks first (per client, per
      device, five); nav panels say "n of 7 read"; the rail writes the
      resume position only when the section changes (it wrote on every
      scroll frame: 6 writes across a 16-section page now, not hundreds);
      the palette cursor follows only a pointer that actually moves, so a
      list appearing under a parked mouse no longer steals Enter from the
      top result.
- [x] Wave 19: full-text search (from three letters the palette finds any
      sentence in the guides, with a snippet; the index is built per client
      at /search-index.json, pre-rendered and served behind the door, the
      client's notes folded in); resume at the last section read on this
      device; "Recently added" on home from content/system/changes.ts
      (validated: dated, newest first). Fixed: a key pressed in the
      palette's exit beat went into the dying field (the focus trap hands
      focus back to body, which cannot take it), so a quick Esc then / did
      nothing; the palette now blurs before it closes. 44 tests.
- [x] Wave 18: the guide rail says how many minutes are left (from the
      scroll position; the last screen counts as read); the home backdrop
      stills go through Still as well (4 of 33 were placeholders and now
      step aside); the template's example ideas are marked in the month
      grid. GitHub Actions confirmed green on the last three pushes (about
      55 seconds a run).
- [x] Wave 17: "Your first month" on the scripts page: one every other
      day, the client's scripts first, then ideas from their hundred that
      have not become scripts, interleaved across the pillars so the bank
      holds a mixture; posting days link out; even days hidden on a phone.
      React 19.2.4 → 19.3.0 (in Next's peer range), pinned; console
      clean across five pages.
- [x] Wave 16: proxy path maps in lib/room-paths.ts, tested; global keys
      stay quiet while the prompter or the lightbox is open (verified: `]`
      no longer cuts away from under the prompter); GitHub Actions runs
      tests, check, lint, build and both smoke suites on every push (Node
      22, .nvmrc); lucide-react (unused) removed, eslint-config-next
      matched to Next, type packages updated; the whole repo lints clean.
      38 tests.
- [x] Wave 15: the prompter counts in (3, 2, 1) from the top before it
      rolls, and only from the top (resume is immediate; Space during the
      count cancels it); a link-preview image, the slate of a private
      screening, served for every path so no client name ever appears in
      a preview; rail cards show shots and the location. The room-level
      404 was tried and removed (see Decisions).
- [x] Wave 14 (hardening + one design piece): week arithmetic in
      lib/week.ts on UTC day numbers, tested at the ISO edges and across a
      clock change; remote stills step aside when they fail or when
      YouTube answers with its 120-pixel grey placeholder (a 404 that
      still decodes, so onLoad checks the size); a wrong access code costs
      400ms on every instance; the footer year reads through
      useSyncExternalStore (lint is clean); the inline-mark scanner is
      tested by rendering to static markup; a script's shot list is a
      storyboard of 9:16 frames. 34 tests.
- [x] Wave 13: the palette finds the client's own ideas and scripts by
      their words (hidden entries, listed only once something is typed);
      a readout under the home lead (audit score, first move, ideas,
      scripts, notes); competitor handles link to the accounts; chapter
      overviews say how many notes there are for this client.
- [x] Wave 12: notes from the studio inside the universal guides, for
      this client only (`notes` keyed "chapter/slug", after the intro or
      under a numbered section, rendered as "For Horizon" with the lamp);
      scripts carry a location, who is on camera and a shot list (a slate
      strip under the title, the list after the words, both in the copied
      text); idea cards point to the script they became (`from`); the
      audit has a print control. Demo: three scripts and seven notes.
- [x] Wave 11: the pillar mix ring on the ideas page (four tones of
      ink; says when one pillar carries more than half), Copy on every
      written idea card, a print sheet for the ideas (rails become
      three-column grids on paper; the fixed buttons stay off the page),
      the audit score on the home strip card ("13 of 13 written · 4.7/10"),
      and a "?" sheet of keys.
- [x] Wave 10: read marks (per device, localStorage under the client
      slug; a toggle at the foot of every guide and report; shown in the
      nav panels, on the room overviews and as "n of 7 read" on the home
      strip) and the weekly call sheet on home (one idea, one script, one
      guide, one thing to do, rotated by ISO week in the browser; the
      month-end week says to run the monthly process). Verified end to
      end: mark, reload, overview, nav, strip, unmark.
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

0. Performance option, not taken: framer-motion could load through
   `LazyMotion` + `m` (nine files import `motion`) to cut the largest
   client chunk; the site is private and static, so it was left. Take it
   only if a real client reports slow first loads.
1. Awaiting from the user (do not block): nine training-video ids for the
   Create guides plus intro/outro (the nine client videos that arrived are
   the showreel, not these), first real client content, images for
   `figure` blocks, a real client logo to test `--logo`.
2. Majors available and not taken (`npm outdated`, 2026-09-24): typescript
   7.0 and @types/node 26. Each is its own wave with the full loop.
   framer-motion 13 was taken in wave 29. vitest 4/5 stays blocked by the
   npm 10.9.2 crash; its two moderate dev-only audit findings
   (@vitest/mocker) go with it.
