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
- **A client is shown only what they have.** `src/lib/rooms.ts`:
  `writtenPages(sys)` is the personalised pages the studio has written,
  `liveChapters(sys)` the rooms to show, `livePaths()` every path they
  answer to. The nav, the footer, the home strip (renumbered 01 upwards),
  the palette, the call sheet's Film and Say cells, the five steps' links,
  the home readout and `neighbours()` at the foot of every guide all take
  from it. The pages stay routed so the design can be previewed by URL;
  nothing links to them. Examples never count as written.
- **The for-you / for-everyone split is the studio's, not the client's.**
  It decides what gets written per client and what is written once; it is
  never printed on a card, a panel or a room. `personalised` on a chapter
  and on a home access item is a build-time flag only.
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

- [x] Wave 75 (2026-09-30): speed, continued: what blocks a slow phone.
      Measured on an emulated slow phone (4x CPU), three loads a page, the
      previous commit against this one, counting only tasks that are mostly
      script (rendering here is software raster and swamps everything else):
      home, script blocking 5,435ms to 2,704ms and its longest script task
      3,982ms to 1,855ms; a guide (create/hooks), 3,699ms to 1,839ms and
      2,191ms to 569ms. The runs' ranges do not overlap.
      - Every block that comes on below the fold (Reveal, Odometer, TypeOn,
        RecentList) decided with a getBoundingClientRect as it mounted and
        then wrote a class: forty-odd forced layouts on a guide, 780ms of
        its load. lib/below-fold does the measuring with shared
        IntersectionObservers, first sight with no margin (so the entry's
        root is the screen) and release with the block's margin; nothing
        in it reads the layout, not even window.innerHeight.
      - On a phone window.innerHeight, window.scrollY and
        document.fonts.ready (once the fonts are in) each lay the page out
        on the spot, measured at 53 to 93ms apiece on a dirtied page. The
        rail, the caption track, the access strip, the hero dust and the
        guide rail's playhead now take their first measure from a
        ResizeObserver, whose calls come after the browser's own layout; a
        late font asks the observer to look again (a loadingdone listener)
        instead of reading fonts.ready. The nav, the Top mark, the training
        film and the guide rail read scrollY a frame later, not as the
        page hydrates. The hero's scroll fade reads the screen's height
        once, when a scroll first needs it.
      - Two loops read and wrote in turn, a layout per item: the rail's
        depth pass (433ms on the home page) and the title's letter tilt.
        Each now measures everything, then writes.
      - Framer Motion runs as LazyMotion with domAnimation (room/Motion,
        m.* everywhere, strict). The full build gave every animated
        element a layout-projection node, each reading the layout as it
        mounted, for the one element that used it: the nav's room cue,
        now a single CSS-placed line (translate and width, eased as
        before; it draws in once, slides between rooms, is set down in
        place under reduced motion, and reads nothing on a phone, where
        the bar is not shown). Its observer is made once, before the
        page's own, so it measures before any of theirs writes.
      - The first Intl call on a page loads the locale's data: 410 to
        470ms on the throttled phone, in the middle of hydration. The
        odometer groups its digits itself (lib/digits, tested against
        Intl), the week's months are a table (lib/week, "Sept" as en-GB
        prints it; the server's ICU and a browser's could disagree), and
        the studio clocks start only once shown and the page is idle
        (they are hidden on phones and never start there).
      - tailwind-merge is gone: only the nav used cn(), and none of its
        seven calls had two classes to merge. lib/utils went with it.
      Verified: the cue under each room (home, create, analyse after a
      client-side navigation), drawn on load and sliding 355 to 558px;
      palette open and close under LazyMotion; reveals, odometer, clocks,
      rail, caption track and dust canvas; overflow at seven widths,
      collisions, the phone audit (unchanged: the profile guide's 8px
      phone mock); smoke, a11y, vitest (148) and the brief guard.
      Correction to wave 74: its "style work fell 45% and layer work 30%"
      came from a trace that took the busiest renderer to be the page's,
      and tracing records every tab: the Playwright session's own page can
      out-work the page under test. Those two figures are not reliable. The
      wordmark change stands on what it removed (38 infinite animations,
      idle 94% of the time); the traces now find the page by the renderer
      that parsed its HTML.

- [x] Wave 74 (2026-09-30): the home page looped, then phones and speed.
      "Now do the same for the home page too", then "work on
      responsiveness, mobile view, and website speed optimization".
      Home page:
      - The hero keeps the 1600px measure: at 1895 it started at 56px under
        a nav that now starts at 200. Its spacing and the name's size give
        way to a short screen (svh), so "Start here" is in the first frame
        from 360x740 up; at 1440x900, 1280x800 and 1366x768 it had fallen
        16 to 130px below it. The backdrop band still runs the full width.
      - The access strip is a shuttle from lg only. At 768 its cards, sized
        from the screen's height, ran off the right edge beside the title,
        and the pinned section asked for 5000px of scroll; stacked, the
        cards keep the 56px margin from md, under reduced motion too, and a
        shuttle card is capped by the width as well as the height.
      - The reel's arrows are 40px targets; its labels 11px.
      Phones, every page, 320 and 360 wide with touch:
      - Guide titles are capped so the longest word fits the screen
        (lib/display-fit, longestWordEm): "Discoverability" ran 14px wide at
        320, and a phone then zooms the whole page out to fit it.
      - .hit: an unseen 6px above and below small links, on a touch screen;
        the guide's cue toggle is the whole top row of its box.
      - Small text to 11px: clip handles, audit numbers, calendar days,
        timecodes, the donut's caption. The retention curve has a phone
        drawing (its labels rendered at 4px across a 280px column); the
        competitor map and the camera diagram set their labels larger on a
        phone; the camera diagram is held to 520px on a wide screen, where
        it drew 858px across with 25px labels.
      Speed:
      - The slate was served to everyone and taken down only when the
        scripts ran, so on a slow phone a returning visitor saw black for
        the whole load, with the titles held behind it. An inline script
        beside it now takes it down before the first paint: the home page's
        first paint on an emulated slow phone went from 7.0s to 2.1s.
      - Training-film posters are preloaded only at the top of a guide, not
        below the fold on the home page.
      - The lamps breathe by opacity on a layer of their own instead of
        repainting a box-shadow every frame; the grain layer is 1.2 screens,
        not 4.
      - The wordmark's stitch is struck by script every seven seconds: 38
        infinite animations, idle 94% of the time, had kept its letters on
        layers of their own on every page. On a throttled phone trace, style
        work fell 45% and layer work 30%.
      Measured and left: 247kB of script on the home page (React 72kB,
      Next 84kB, framer-motion about 50kB). LazyMotion would save 10-15kB
      with the layout feature the nav's cue needs; not worth the churn.
      This browser renders in software and barely makes frames, so paint
      timings from it swing between runs; the changes above are the ones
      that hold whatever the device.
      Verified: phone audit (overflow, targets, text) clean at 320 and 360
      on both clients, bar the profile guide's miniature phone mock (8px,
      an illustration); collisions, overflow at seven widths, the evenness
      audits; smoke, a11y, vitest (139) and the brief guard.

- [x] Wave 73 (2026-09-30): the navbar, looped the same way.
      "Now do the same for the navbar if applicable." Measured at eleven
      widths on both clients, with every panel opened and the menu open.
      Found and fixed:
      - The room you are in was never marked on a fresh load: the server
        renders these pages at their rewritten path, so it lit nothing, and
        React keeps the server's class through hydration. "Here" is now
        read in the browser only (as the footer and the reel do), and the
        room carries aria-current and a tally line along the foot of the
        bar. Going to another room, the line slides along the bar to it.
      - Lighting a room (the hover grammar: the italic drop and the grow)
        reflowed the row, so the rooms left of the pointer moved about 65px
        out from under it. Each name is now set twice in one grid cell, mono
        and italic, as wide as the wider, and the faces cross-fade: nothing
        moves (0px, measured at every width).
      - On a wide screen the bar ran edge to edge while the page kept its
        1600px measure (the mark at 56px, the page at 200px at 1895): the
        bar's contents now keep the measure.
      - The inline rooms needed about 660px beside the mark: at 900 the
        template's padlocked names broke in two and the mark touched the
        first room (0px apart). The rooms go inline from lg, the menu below;
        the mark and rooms can never touch (gap-8), and the client's name
        joins the mark from lg if short, xl if long.
      - Panels hung 3px into the bar; they now hang from its foot, the cue
        running straight into the open panel's edge.
      - The room names' capitals sat 1.6px under the wordmark's (by cap
        height); lined up.
      - The menu (below lg): the floating Contents and Top buttons showed
        through it and could be tabbed to under it; the page behind was
        tabbable; Escape dropped focus. Now the page, footer and skip link
        are inert while it is open, the floating buttons stand down, and
        Escape hands focus back to the Menu button (or, from a panel, to its
        room, without reopening it). On a tablet it is two columns; each
        room's pages start where its name does (they had sat 5px off); and
        the red lamp means one thing everywhere, you are here (it had also
        marked the personalised rooms).
      - The Top button, faded out at the top of a page, was still in the tab
        order: out of it until it shows.
      The a11y run now opens a room's panel from the keyboard and the menu on
      a phone, runs axe on each, and checks Escape.
      Verified: nav audit (alignment, gaps, wraps, cap heights, hover shift,
      panels, cue) at 390-1895 on both clients; keyboard walk of the menu
      and panels; the cue sampled mid-slide; collisions and overflow site
      wide; smoke, a11y, vitest (137) and the brief guard.

- [x] Wave 72 (2026-09-30): evenness, and the footer looped until it held.
      "Isn't this a bit uneven?" (the home objective in eleven ragged
      lines), "look for more uneven sections like this on all pages", and
      "loop on footer multiple times to improve it completely".
      Evenness:
      - The objective's measure sat on its wrapper, in the body's ch: it is
        on the line itself now (the ch of 40px italic, not of 17px sans).
      - A guide's header puts its contents where the two columns come out
        nearest in height (under the facts, under them in two columns, or
        as a strip below both), estimated from the content at build.
      - Section headings capped at 22ch; an unwritten scripts page has a
        blank stack slated "In production" instead of an empty right half.
      - Serif lines: the before/after answer, a fan's root, a flow's
        question, a question list and a quoted line are statements
        (balanced); every other serif line is pretty (the text-wrap-style
        longhand, so a nowrap above it still holds). Search-term chips
        balance.
      - The home title fits the client's name to its measure
        (lib/display-fit.ts: a width table measured from the face, within
        2% of the render, on the wide side): full size when it fits,
        smaller until it does, wrapping (balanced) only below 0.62em.
        Wrapped, "x Company / Name" dropped a word; held to one line on a
        wide screen, a 34-character name lost 1053px to the line's mask.
      - Audits, run from .playwright-mcp (not committed): column balance,
        narrow large type, orphan cards, empty-sided headers, widows (one
        word under 45% of the longest line), ragged card bottoms, near-miss
        left edges, sideways overflow, and every control hit-tested where
        it sits. All clean on both clients (1895/1440/390; overflow at
        seven widths from 390 to 1895).
      Footer, five loops:
      1. The credits summed to 13 of 12 columns, so the team fell under
         the sign-off: 5 + 3 + 3 now. They roll up a column at a time; the
         studio's name spans the foot at every width (19.4cqw) and settles
         as they come on.
      2. The timeline started 56px left of the credits on a wide screen
         (its padding sat outside the 1600px measure); its readout moved
         into the header row.
      3. At the end of a page the floating Contents and Top buttons sat on
         the copyright: room under the last line.
      4. On a phone the timeline keeps no line for a hover title a touch
         screen never shows (rooms 36px apart, the footer 186px shorter),
         the readout and the copyright break between phrases, and the
         system list is two short columns. The room you are in is lit in
         the list as it is in the nav: aria-current and a lamp, held still.
      5. Two faults found by measuring, not looking. The name's text, at
         leading 0.8, runs a fifth of its size below its own line,
         invisibly, over the copyright, and its box (container-type) is a
         stacking context, so it took the pointer there: the last line is
         lifted over it. And loop 2's fixed 216px floor under every
         timeline room had flattened the duration scale and, from 1024 to
         1279 wide, pushed the last room off the page, where the body's
         overflow-x: hidden hid it. The rooms are grid columns now, sharing
         the width by minutes but never narrower than their name
         (minmax(min-content, Nfr)), a short room's minutes wrapping under
         its name, the strips held on one line by subgrid rows. At 1440,
         Create is 3.6 times Audit again, as 36 minutes is to 10.
      6. Tablet widths, looked at last: twelve columns and their gutters
         left the team 132px at 768, narrower than its own email address
         (23px past the measure), and "Leave the room" broke from its
         arrow. Below lg the sign-off runs across the top and the other
         two share the row under it (304px each at 768).
      Collisions: an audit of every line of every text node, as the glyphs
      fall and clipped where an ancestor clips, found three. The top nav
      from 768 to about 880px (two room names broke in two and the
      squeezed wordmark ran over "01 Home"): the rooms go inline from
      900px, the menu below. The ideation pillars beside the rail at 1024
      (four 99px columns, "Entertainment" 84px into "Personal"): cards go
      across by their own width now, two from 448px, four from 896px,
      and a title that ever outgrows its column hyphenates. And the
      structure strip's timecodes where a part is a twelfth of it
      ("00:0003"): two staggered rows from sm.
      Verified: every audit above on both clients (collisions at
      390/768/820/1024/1440); smoke and a11y on both servers, vitest (137)
      and the brief guard.

- [x] Wave 71 (2026-09-29): the other pages get the same hand.
      "Now do the same for the other pages too", after wave 70. Each of the
      new motions went only where it means something on that page:
      - The projector's beam and its dust (HeroDust, now filling whatever
        positioned container it is put in) on the door ("Private
        screening"), every room's header and the 404 ("the projector still
        running, with no reel on it"). The door's rows are film stock too.
      - Every guide's closing rule is a caption track: consecutive
        paragraphs read as one track, the line running on from one into the
        next, and the brief's *emphasis* set as Rich sets it (upright in the
        italic). CaptionTrack now takes lines, not one text.
      - Departure boards: the scripts page's first month (thirty days,
        each flap dropping in turn at a quicker step, --flap-step 0.045s)
        and the competitor report's board of accounts.
      - Headings not yet written type what they will cover (TypeOn): the
        promise types itself while the reader looks.
      - Monitors power on: a guide's clip rails and a script's storyboard.
      - Depth on every rail (Rail.tsx): a card's numeral moves against it
        as the rail is scrolled.
      Verified: dust drawing on the door, a room and the 404 (no overflow);
      the packaging rule read across both paragraphs with its emphasis; the
      month, the board and the storyboard sampled mid-flight; a heading
      typed to the end; rail offsets from +36 to -23px; smoke, a11y and the
      brief guard on both servers.

- [x] Wave 70 (2026-09-29): the room the reel runs in.
      The user asked a third time for a more creative home page, motion
      especially. Four new kinds of motion, each tied to what its section
      says, none a repeat of an earlier wave:
      1. The projector's beam and its dust (HeroDust.tsx, .hero-beam): a
         faint shaft across the hero at 144deg (at most 6.5% ink, breathing
         slowly) and ninety motes drifting in the room's air, lit inside the
         beam (the canvas uses the gradient's own geometry). A pointer through
         the beam scatters the dust, which settles back in about a second:
         measured, 98 lit pixels within 90px of a spot before the pointer
         came, none while it rested there. Drawn only while the hero is on
         screen and the tab in front; no canvas at all under reduced motion.
      2. The call sheet is a departure board (ThisWeek.tsx, .flap): each
         cell's flap drops from its top edge in turn and knocks past flat
         (an overshooting bezier) as the sheet comes on.
      3. "Still being written" writes itself (RecentList.tsx): each entry's
         date is stamped and its line typed out behind a tally caret, one
         after another. Entries waiting their turn fade whole (.row-held) --
         never hidden, so their links stay in the tab order -- and a screen
         reader gets each typed line whole. Only when the list is below the
         fold after hydration; never under reduced motion.
      4. Depth in the access strip (AccessStrip.tsx, .par-img, .par-num):
         as the strip shuttles, each card's frame and numeral move against
         the card. The frame's travel is clamped to 34px inside its 14% zoom
         so no edge ever shows.
      Verified: frames of the beam and dust, the flaps, the typing and the
      depth values; reduced motion (dust blank, beam still, nothing held or
      typing, no offsets); scripts off (all five entries shown); smoke and
      a11y on both servers.

- [x] Wave 69 (2026-09-29): the caption line, and films that follow you.
      At the user's word, on screenshots:
      - The caption track's line "follows fully": one tally line under the
        line being read, from its head to the read's exact point, restarting
        at the head of the next line when it wraps. The read moves at an
        even pace per letter (each word carries its share, --a and --w), so
        the line glides across words and spaces and the lighting keeps pace.
        It had been a bar per word handing over to the next (two short bars
        at once). Committed as e52f2ab.
      - Training films are medium: min(1040px, 76%) of the page on a wide
        screen (they had filled 1768px of a 1917px screen), full width on a
        phone; their type is sized by the player's own width (container
        units), so the title still reads when small.
      - Scroll past a film and it follows: it slides up to the top right
        under the nav, shrinking as it goes, and stops at a corner monitor
        (360px, or 46% of a phone), where it stays while the page is read;
        scrolling back to its place brings it home at full size. The x sends
        it home and stops it until the reader revisits its place. One player
        element changes position -- never a moved one -- so a playing film
        does not reload (verified: the same iframe across home and back).
        Guides' films always follow; the home's two follow only while
        playing, and starting one stops the other. Its place shows "In the
        corner, top right" while it is away.
      - Found on the way: the reveal wipe's opt-out keyed on the letterbox,
        which goes when a film plays, so a playing film's slot got its clip
        back and the clip swallowed the corner player and its controls. Now
        keyed on the player, which is always there. Also the slate line's
        display moved out of utilities so the corner can hide it.
      Verified at 1917 (the user's width), 1440 and a phone: the travel
      (1040, 707, 459, then 360 held), clicks landing on the corner's
      controls (elementFromPoint), close and re-arm, the home rules; smoke
      and a11y on both servers.

- [x] Wave 68 (2026-09-29): the home page as a reel on a projector.
      The user asked again for the home page to be "more creative", motion
      especially. Six additions, one idea:
      1. Film stock (Backdrop.tsx, .film-frame): the strip behind the name
         is film -- frames on a film base, backlit sprocket holes along both
         edges, four to a frame. The band's top fade is shortened (20% to 7%)
         so the upper row reads; the tops of the frames at full strength cost
         the name nothing, since 0.5 is the band's ceiling everywhere. The
         holes brush the tops of line one's capitals: measured, the name
         keeps about 10:1 over them. The strip threads in from the right on
         load (.band-in now translates as it fades up).
      2. TILTED's letters are needles (Tilt.tsx, .tilt-l): they swing past
         upright and settle as the title lands, then lean toward the pointer
         (to about 6 degrees, full when level with the word, none past
         900px). Fine pointers only, never under reduced motion; the word is
         read once by a screen reader (sr-only), the letters are hidden.
      3. The objective is a caption track (CaptionTrack.tsx, .cap-w): the
         scroll plays it -- words read so far lit, a tally bar under the word
         being read, the words ahead at 30%. One custom property drives it
         in CSS; unset (before hydration, reduced motion, print) it is all
         lit with no bar.
      4. Training films open like a picture in a cinema (.letterbox,
         .film-push): black bars draw back and the frame settles as the film
         comes on. Guides get it too (same component).
      5. The showreel is a wall of monitors: the cards power on one after
         another as the rail arrives (.reel-on, the room monitors' crt-on).
      6. The footer's words are on the jog shuttle too (WordStrip.tsx):
         crawl on their own, run with the scroll, back on an upward flick,
         and lean into it. Still under reduced motion by CSS (.word-run).
      Verified: frame sheets of the opening, the lean both ways, the caption
      at five scroll positions, the letterbox and the monitor wall; reduced
      motion (26 caption words lit, no bars, letters still, words still,
      nothing waiting); phone (no overflow); smoke and a11y on both servers.

- [x] Wave 67 (2026-09-29): the deck and the stack.
      A review of the demo's ideas and scripts pages found both headers
      half empty on the right, the complaint the home page had drawn. Each
      now holds what the page holds, dealt onto the desk as it opens:
      - Ideas (IdeasHand): the first written idea of each pillar as a hand
        of four cards, fanned about a pivot below them and dealt in one
        after another; reaching for the hand spreads it. The page already
        deals (DealOne, face down), so the header holds the deck.
      - Scripts (ScriptStack): the first written script as a page set like
        a script (slate line, location as the scene heading, title, who is
        on camera as the cue, the hook as dialogue, the script running on
        off the foot), on blank sheets for the others written. One link,
        named for the script it opens; reaching for it lifts the top page
        and fans the sheets under it. The under-sheets are blank because
        their words peeking out read as litter.
      Both are wide-screen only (xl, where the title leaves the room),
      aria-hidden decoration over what the page says in full (the stack's
      link carries its own name), absent when nothing is written, out of
      print, still under reduced motion, and held with the titles under the
      slate and the cut. Deal-ins use backwards fill only, so a landed card
      is its own style and the hover spread is a plain transition.
      Caught by the a11y suite: the first fan ran 27px past a 1440 screen
      and scrolled it sideways. Refitted (measured at 1280, 1440 and 1920,
      at rest and spread: every card ends 24px or more inside the screen,
      125px or more clear of the title) and both headers now clip sideways
      overflow as a net. Smoke and a11y pass on both servers.

- [x] Wave 66 (2026-09-29): every other page opens as a scene.
      The user asked for "the same for the other pages too". One grammar,
      shorter than the home's cold open, plus a signature moment where
      each page type has a natural one. All CSS or reveal-driven, all on
      top of a page that reads at rest.
      1. Scene titles (Scene.tsx + globals "scene titles"): the slate wipes
         on like a lower third (.scene-slate), the title rises word by word
         through clip-path masks (<Rise>), the line under it is pulled into
         focus word by word in a fixed ~0.7s however long (<Focus>), the
         readouts come up (.scene-up, delay()). On guides, rooms, audit
         reports, ideas, scripts, a script, the door, the 404 and both
         error pages. The mask is clip-path, not overflow: an overflow
         inline-block takes its baseline from its bottom edge and opened
         the leading of every wrapped title. Measured masks: serif
         descenders need 0.1em, accented capitals 0.2em; .rise gives 0.32
         and 0.45.
      2. Held for the frame in front: paused while the slate is up (only
         when scripts run) AND while a cut's black frame is up
         (body.is-cutting), so a page reached by a cut plays its titles as
         the frame lifts. Verified paused during, running after.
      3. Guide: the poster pushes in out of the dark (.scene-frame, on a
         wrapper so its own dimming is what it lands on); each numbered
         section is cued as it arrives (Reveal as="section", .cue): a tally
         playhead runs its rule and fades, the numeral rises, the heading
         surfaces word by word; the rail has a tally playhead that glides
         to the row being read (measured: same top and height as the
         row); the rule is a closing card: one lamp strikes over the black
         band and the statements pull into focus a paragraph at a time.
      4. NextCut: the next page's title rises in as the foot comes on, its
         film still sits in a small monitor (guides only; stillFor on the
         server) and runs on hover, a playhead sweeps the foot toward the
         cut (.cut-sweep/.cut-step/.cut-arrow). The arrow is held to the
         last word by a no-break space: alone on a line it read as a stray.
      5. Rooms: the preview monitor powers on like a CRT (a bright line,
         then the picture opening from it, .monitor-on); each row is cued
         as it arrives and runs the same hover sweep. Cued words fade as
         they rise, since the line under a row title is already showing.
      6. Audit: the desk powers on after the title; the average lands on
         odometer reels (Odometer `now`: a CSS spin from the same digit two
         turns back, pausable like the titles); each finding is cued and
         its score dial draws round from twelve o'clock.
      7. 404: the monitor shows colour bars and NO SIGNAL, powering on,
         now and then losing its vertical hold. The one place colour
         outside the tally belongs.
      8. Fixed on the way: under reduced motion the home tagline and lead
         were hidden for ~1s then popped in (the duration rule left the
         delay; they now take animation: none). Without scripts the slate
         never came down and covered the whole portal: @media (scripting:
         none) now hides it.
      Print shows unrevealed cues landed; keyboard focus lands them too.
      Verified: contact sheets of every sequence, reduced motion (all 54
      pieces landed at once, nothing waiting), scripts off, phone widths
      (no horizontal overflow), smoke and a11y on both servers.

- [x] Wave 65 (2026-09-29): the home page moves like an edit suite.
      The user asked for more creative design, "animations and motion
      specially". Six motions, each an action an edit makes, all running on
      top of a page that already reads at rest:
      1. Opening titles (CSS, globals "opening titles"): the name rises line
         by line through padded masks (.title-line), the x turns in, the
         tagline pulls into focus word by word (.burn: blur to sharp), VIRAL
         lands in ink then catches red like a tally (.burn-tally), the lead
         comes up, the work fades in behind. Held while the slate is up
         (:root:has(.slate-open) pauses them), so a first visit sees it after
         the slate. Proof: a six-frame contact sheet at 0.15 to 2.4s.
      2. Jog shuttle (HeroMotion Scrub): the strip drifts at the old CSS rate;
         scroll velocity (spring-smoothed) scrubs it, down forward, up back,
         and it leans into its travel. Only while on screen.
      3. Pull focus (Scrub + Lift): over the first screen of scroll the strip
         falls 120px behind and blurs to 9px; the name lifts 12% faster than
         the page. Measured at 540px: lift -64.8px, band +72px, blur 5.4px.
      4. The first three seconds (Showreel): hover or focus runs a tally
         playhead across the clip's foot for exactly 3s, a counter steps
         0:00 to 0:03 (registered integer @property), the still pushes in.
         The section's own instruction, made literal.
      5. Running order (Playheads RunningOrder): a playhead steps down the
         approach's beats lighting each; the ring turns on "Then repeat."
         Fixed an off-by-one (the playhead was the list's first child).
      6. The loop runs (Playheads LoopRunner): a light travels the five
         stations of "how to use the system", lighting each (data-station,
         .is-lit), then rides the dashed arc home on the SVG's own cubic.
      Reduced motion: every piece held still by CSS, never by a different
      tree (so no hydration mismatch); verified none moves, all beats lit.
      Verification note: this test browser barely produces frames; driving
      it with screenshots forces them (see reference_visual_verification).

- [x] Wave 64 (2026-09-29): the brief's missing image, and one note out.
      The user supplied the image the .md export had dropped from the end of
      Discoverability (its "![][image1]", after THE RULE): a bad/good
      Instagram profile comparison. Placed where the brief puts it, after the
      rule, at its own 975px measure (the 52ch rule column would have set its
      labels at 5px) and opening full size on tap (333px wide on a phone).
      public/guides/ had to be added to proxy.ts's static exclusions: every
      file in an unlisted folder is rewritten into a client tree and 404s.
      Smoke now fetches it on both servers. At the user's word, the unverified
      view-count note on Study your niche is gone (the three clip captions,
      1.8M / 1.3M / 1.3M, remain).

- [x] Wave 63 (2026-09-29): the twelve guide tabs say what the brief says.
      Asked to check the other tabs after the home page. Measured, not read:
      every sentence of each brief tab matched against every word its page
      renders (text dumped from the guide objects), nearest-line search for
      misses. Before: 83-99% word for word (1,592 of 1,774 sentences). Kinds
      of drift found and fixed:
      - kickers paraphrased or invented (Hooks "decide" for "determine";
        Film, Discoverability, Monthly invented) -> every kicker is now the
        tab's own opening line, lifted from the intro so it is said once;
      - lead-ins folded into labels ("Save interesting hooks." -> "Interesting
        hooks"; "The idea might be:" -> "The idea") -> the brief's lines;
      - "If you are X, show Y" sentences split into cut-down columns (Style of
        video, Core message, Edit, Discoverability) -> the full sentences,
        split at their comma; three dropped from Core message restored;
      - Packaging: commentary merged or dropped between its comparisons
        ("The second version creates a question... What is the reason?") ->
        the brief's order, examples in bold within its own sentences;
      - Publishing: "The objective is not to make a video, post it once and
        hope it performs." had become the kicker "Do not make a video..."; the
        platform fan's five invented per-platform notes -> the brief's three;
      - Analyse: wave 59's neutralised aviation examples reverted to the
        brief's (Gulfstream v Bombardier, Dassault Falcon, "The aircraft");
        the invented "Diagnose a video" flow removed (the brief's nine
        questions stay); Monthly process rebuilt from the brief alone.
      - Diagram captions that were ours (shot sizes, lens, cadence, retention,
        "cut between at least three of these") -> the brief's labels only.
      After: every sentence present; the only differences left are drawn by
      components (the rule label, step numbers, tab names vs H1s) and one
      image in Discoverability the .md export does not contain.
      **Guard:** src/content/system/brief.test.ts re-runs the match, one test
      per tab; skipped unless BRIEF_PATH points at the brief (it lives outside
      the repo). Proved by mutation: one word changed in Hooks fails it, with
      the sentence named.
      Kept and flagged, not the brief's: clip rails from the published library
      (real titles), "The examples here are from The Jet Business..." on eight
      guides, the Hooks flashcards (all twelve fronts now the brief's lines),
      and the view-count note on Study your niche (not verifiable from the
      repo: published.json has no views). **Profile optimisation has no tab
      in the .md** (only a planning note, lines 776-803): that page is ours
      end to end and needs the user's text.

- [x] Wave 62 (2026-09-28): the home page says what the brief says.
      **The user asked "is this being followed?" of the brief's Home Page
      tab, and it was not**: the structure was, but a writing pass (wave 53)
      had paraphrased nearly every line -- tagline, lead, welcome, objective,
      all seven card descriptions, all five how-to steps, the approach lines
      -- and had written its own style rules into copy.test.ts (steps capped
      at 16 words; the approach forbidden to say "the objective") which the
      brief's own copy breaks. All restored VERBATIM from "Step 1: Home Page"
      (Info Product Servicing.md, lines 934-1084); those two rules removed;
      a new test pins the brief's sentences, and smoke checks them as served.
      THE BRIEF IS CONTENT TO PUT ON THE SITE, NOT NOTES TO REWRITE.
      Layout followed the copy: the tagline is a display heading with VIRAL
      in --tally, as the brief colours it (the client's document outranks the
      "tally is state only" rule); Welcome reads intro then objective, the
      brief's order; the strip's heading is "What you have access to" (count
      moved to the label); the loop's is "How to use the system". Cards carry
      the brief's lists (eight Create steps two-up, the four pillars, "Open
      the script. Film it. Execute."), and their frame became an in-flow
      header that shrinks before the text does -- verified at ten sizes down
      to 1366x600 and 360px: no overflow, no text on a picture. Each room's
      frame is now chosen (`frame` in home.ts) from a contact sheet: Create
      and Publish had both opened on the same man in the same jet cabin.
      The hero band is now centred on the NAME (inside its box, frames sized
      in em), not the section, so it cannot reach the red word or the lead:
      measured at nine widths, VIRAL 4.54:1 and the lead 10.68:1 on clean
      ground everywhere, the name >= 3.96:1, the x >= 5.26:1.
      Showreel per the user: the figure smaller (7vw, 120px cap) and set
      beside "These are the top performers"; the three-fact row removed (the
      cards already carry each film's numbers). The modal's part rows now use
      the cards' words; my invented "takes" lines are gone.
      The brief calls the scripts card "20 PERSONALIZED FOR YOU SCRIPTS" on
      the Home Page tab and the page "20 Personalised Scripts" in STRUCTURE;
      the card follows the first, the nav the second.

- [x] Wave 61 (2026-09-28): the hero drift turned up, and the showreel
      opens on the studio's whole number.
      **Hero:** the stills ran at 3-22% across the name (0.45 under a 0.5
      scrim and a side ramp clear only at the dead centre). Now 0.5 through
      the band, which is the ceiling a contrast sum allows (--ink display
      type needs 3:1; a pure-white frame at 0.5 gives 3.21:1). The band fades
      by mask, not overlay (.hero-band): soft top, full middle, gone by its
      lower edge, so the kicker and lead are never over a frame at strength.
      Sides fade over the outer 18% (.hero-vignette). Type over footage gets
      a halo in its own em (.footage-type, screen only). MEASURED, not
      assumed: text hidden, drift frozen at 8 points, pixels sampled behind
      every line at 9 widths. Worst cases: name 3.65:1, kicker 6.42:1, lead
      8.35:1. The × fell to 1.96:1 on phones in --ink-mid and is now
      --ink-soft.
      **Showreel:** the user asked for the full 5B and "these are the top
      performers". The brief's words are "over 5 billion organic views", so
      it reads 5,000,000,000+ (STUDIO_VIEWS in reel.ts), counted in on
      per-digit reels (Odometer.tsx), then "These are the top performers."
      with three facts (the best 36.2M, the top nine 134.6M, even the ninth
      2.5M), a "Top nine" rail, and No. 1-9 on the cards, ranked by views at
      render so the rank can never contradict the numbers.
      **The odometer can never read wrong**, and that took two tries. First
      build wound the reels back to zero below the fold; a browser producing
      no frames left the figure at 0,000,000,000. Now each reel holds its
      digit three times: rest on the third copy, wound back to the first --
      the same digit -- and the spin is two full turns landing where it
      started. Release is a forced style flush, not requestAnimationFrame.
      Verified wound-back, printed, mid-scroll, landed, reduced motion and
      phone all read 5,000,000,000; the figure is sized from its measured
      width (6.16em) to fill the column at every width from 360 to 1920.

- [x] Wave 60 (2026-09-28): locked parts, the commission modal, and the
      hero backdrop that had gone blank.
      **Policy change, the user's call:** the four personalised parts are
      no longer hidden until written. Every part is shown from day one, and
      the unwritten ones are LOCKED: named, described, padlocked, with
      nothing of anyone's on them. The strip says "seven parts." for every
      client; the nav and footer run 01-06 without gaps. `allRooms()` in
      rooms.ts draws the shape (nav, footer, strip); `liveChapters()` still
      answers "what does this client have" (reel, palette, week, prev/next),
      so an empty page is never a clip, a search hit or a step.
      A locked part is a BUTTON with no href: the route into the empty room
      is not on the page or in the router payload (smoke asserts both).
      It raises `tn:locked` (src/lib/locked.ts); one `LockedModal` in the
      layout answers, mounted only while something is still locked.
      The user asked for a premium pop-up, NOT a separate page (a
      /personalised page was built and removed on their word). The modal is
      "the commission": clip-path wipe in, a --tally lamp wash struck from
      above (the only colour; worst case --ink-mid 4.53:1), the top edge
      drawing itself, a latching lock; three full-width bands (headline +
      the mailto plate level with it / the parts still to come as frames,
      the opened one carrying the playhead / what we need from you). Copy
      in src/content/system/personalised.ts. a11y opens it, runs axe, checks
      focus and Escape; a written client is checked for having no modal.
      Room cards now carry a poster frame in their top half and say what is
      inside ("seven guides · seven films").
      **The hero backdrop was 32 empty boxes drifting.** Still's placeholder
      guard read `naturalWidth <= 160`, but under `sizes` + a w-descriptor
      srcset the browser reports naturalWidth density-corrected to the
      LAYOUT width: a 256px still in a 150px well reports 150. Every still
      in the backdrop deleted itself. Now recognised by shape (YouTube's
      placeholder is the only 4:3 frame the site can receive). a11y fails on
      any empty `.well`, because axe, overflow and the console all passed
      while the hero was blank.
      The design Workflow's judges and synthesis died on the monthly spend
      limit; the four directions survived in its journal and were merged by
      hand (commission as the spine; the playhead and the struck lamp taken
      from the others).

- [x] Wave 59: the nine training films. The ids arrived, and the count
      settled a question the resume note had got wrong twice: nine, not
      eight and not six. Seven steps map onto the seven Create guides in
      the room's own order, and ideation — the second page, and the only
      one that had never declared a film — gained its block, which is why
      the site had looked as though it needed six. Intro and outro sit on
      the front page. Every id was checked for a real maxres frame before
      anything was wired (37 to 78 KB each, so none is YouTube's grey
      placeholder), and one film was played end to end: the still comes
      through the image optimiser and the button loads the
      privacy-enhanced player, which the CSP already allowed.
      One thing only real stills could show: these films open on a bright
      room, and the slate line and the title are ink laid straight on the
      frame. With the wells empty that never mattered. Two scrims now, so
      "TRAINING FILM / 04.04" sits at 12.6:1 instead of on a white wall,
      and the frame still reads.
- [x] Wave 58: a ten-lens audit of ground the two earlier reviews never
      touched (onboarding, performance, print, touch, untested modules,
      brief fidelity, search, dead code, CI, privacy). 61 findings, each put
      to two independent verifiers; 44 survived, ranked into 24. The first
      five are done, and two of the worst were mine from the day before.
      **The rails could not be scrolled.** Wave 47 gave every spine
      `snap-align-none` to stop the rail stuttering over nineteen narrow
      snap points. Under `scroll-snap-type: x mandatory` the browser must
      come to rest ON a snap position, so a rail whose later children have
      none simply stops at the last one. Measured at 390px: the scripts
      rail reached 720 of 1762, so sixteen of twenty scripts were
      unreachable, and a client with nothing written yet could not move it
      at all. Desktop was hit too (2464 of 2836 on ideas). The rail is
      `proximity` now, which still pulls a card flush when you stop near
      one. Measured before and after; `scripts/a11y.mjs` now fails any page
      where a rail cannot reach its end, and that check fails on the old
      CSS and passes on the new.
      **One client's search index could answer another's request.** Two
      independent halves. The index is fetched at `/search-index.json?v=`
      plus a build id that is the same for every client, under
      `Cache-Control: private, max-age=3600`, so a second client on the
      same browser within the hour gets the first one's 108 KB of audit
      findings, ideas and scripts from disk cache. And `indexCache` in
      Palette.tsx is a module singleton, which a Server Action redirect
      never tears down, so it survived signing out and back in as someone
      else. The URL now carries the slug, the response carries
      `Vary: Cookie`, and the cache remembers whose it is.
      **The scaffolder left a tree that could not build**, because wave 56
      added `CLIENT_SLUGS` and `npm run new-client` did not know about it:
      the registry's parity assert then threw at module load and took
      check, build and test with it. It updates both files now, validates
      every anchor before the first write, and the assert and its test
      check membership rather than order. Proved by scaffolding a client
      for real: 138 pages built, then reverted.
      **`/login?for=constructor` answered 500**, the same prototype-key bug
      as `?error` one line above, fixed the day before. `getClient` uses
      `Object.hasOwn` now, which covers every caller rather than that page,
      with tests and smoke assertions.
      **The demo door is behind `PORTAL_DEMO=1`.** Its code is printed in
      the README, this repository is public, and `accessHash` is an
      unsalted sha256, so rotating `PORTAL_SECRET` ends sessions but does
      not revoke a code: the moment the secret went live for a real client,
      the demo door would have opened to anyone who had read the README.
      Verified both ways — with the flag the code opens the portal,
      without it the door says it does not recognise it.
      **The approach block was rebuilt** after the user said it had too
      much empty space. It was a 40ch statement stranded in a 1600px column
      with the six beats below as a wall of display type. It is now a
      composition at its own 1200px measure: the statement and the way in
      on the left, the loop on the right as a numbered running order, five
      ruled rows and a sixth carrying the loop mark rather than a number,
      because "then repeat" is not a sixth step.
      **The two Analyse guides told every client to look at their
      aircraft.** Nine guides earn their aviation by declaring it in a
      header credit; these two carried none and still put aviation nouns in
      instruction text, so the monthly checklist asked a client in any
      field what their five strongest videos had in common: "the person on
      camera, the aircraft, the access". Thirteen strings are neutral now,
      and the hypotheticals stay hypothetical. Zero aviation words left in
      that room.
      **A printed audit read backwards.** The score chart paints each
      scored heading as a background colour and an unscored one as a dashed
      border. Browsers ship with background graphics off, so on paper every
      scored heading was blank and only the unscored ones marked. Measured:
      allowing backgrounds adds 26 paints to that page, which is the chart
      and the verdict lamps. `print-color-adjust: exact` is on the print
      body now, and the reading-progress bar gained `no-print` so the fix
      does not put a red line across page one. Honest limit: Playwright's
      `printBackground` flag overrides the CSS property, so the fix itself
      cannot be demonstrated through a PDF render here — what is measured
      is that the 26 paints exist and are background-only.
- [x] Wave 57: a second review, this time of the twelve design waves
      themselves, and the twelve defects it found. Most were mine, from
      today.
      The worst was accessibility: `.sub-index`, the letter that indexes a
      sub-section, was set in --ink-faint, which line 41 of globals.css
      says never to put on text because it fails AA. It is 2.6:1 on the
      stage, and axe measures contrast on text nodes rather than on
      generated content, so it shipped green through four passes. Now
      --ink-mid.
      Then two pages that the writing pass missed, and the miss was
      visible: the scripts page still ended "Film it. Execute." while its
      card on the front page now said "Post it.", and the ideas page still
      carried the exact sentence the pass had deleted from home. The rule
      could not see them because it only compared cards against chapter
      blurbs. Both page headers are content now, in pillars.ts, and
      copy.test.ts holds them to the same no-repeat rule. Checked by
      restoring the old wording and watching it fail.
      And a fault I reintroduced in the same range that fixed it: the new
      footer's `<h2>` was set as `.mono`, beside a `.mono` caption, which
      is exactly the "a heading reads as a label" fault `.subhead` exists
      to fix. It is a `.subhead` now.
      The rest: the cut to the next room said "Next / 04 - Create" above an
      88px CREATE, so `roomAfter` returns the number and the name apart;
      an `aside` reaches 27px inside a 26px sub-section, so it is capped
      like the other two block kinds; MasterTimeline's comment claimed
      nothing animates while shipping a breathing playhead lamp;
      TrainingFilm hand-built the player URL that lib/embed.ts calls "the
      one" helper; a spine repeated the pillar heading standing right
      beside it; "POS" and "In this guide" were each announced twice to a
      screen reader; and wave 45 left pageNumber's doc comment stranded
      above chapterOfPath.
      Last: the audit and content rooms passed no minutes to their
      overview, so two of the five rooms silently dropped the "To read"
      readout the other three show, while the footer's reel printed
      minutes for them anyway. They take their minutes from sequence()
      now, which is the same estimator, so all five rooms read their own
      length the same way.
      Not changed, on purpose: the reel's total appears in the footer on
      every page and the position appears in the hero on home, which reads
      as duplication on one page and is the audit's stated intent (the
      site opens on the slate and closes on the conform).
- [x] Wave 56: an error-handling review of the whole tree, and the seven
      real defects it found. Two were reachable from a URL.
      `/login?error=__proto__` took the door down with a 500: `messages` is
      a plain object, so the lookup returned Object.prototype, which is
      truthy and throws when React renders it. Anyone with a mistyped or
      hostile link could not reach the login form. And `safeNext()` blocked
      a leading "//" but not a leading backslash — in a special scheme a
      browser reads "\\" as "/", so `/\evil.example` resolved to
      https://evil.example/ and walked straight past the guard, into the
      form's hidden field and the action's redirect. Writing the test for
      that found a second hole in my own first fix: `/..//evil.example`
      parses on-origin but its pathname is `//evil.example`, protocol
      relative again the moment anything resolves it. safeNext now checks
      its own answer, not just the question, and the field is sanitised at
      render as well as in the action.
      Then five that were not exploitable but were wrong. A valid cookie
      for a client taken off the registry dead-ended in the site's own 404
      for every path, with no nav and no door, for up to thirty days; the
      proxy now treats an unknown slug as a bad cookie, and the edge's slug
      list is asserted equal to the registry's in both directions. The rate
      limiter trusted the leftmost X-Forwarded-For, which the caller
      supplies, so rotating it defeated the limit; it reads the rightmost
      now, or Vercel's own header. It also recorded every blocked attempt,
      so a flood cost more per request than the one before. There was no
      error boundary inside the portal, so one throw in one client
      component replaced the nav, the footer, the palette and every way
      out. The boundary went in at `(portal)/c/[client]/error.tsx` after
      measuring both placements: one segment higher it catches a layout
      fault but takes the nav and footer with it, which is what the root
      boundary is already for. Where it is now, a page fault renders inside
      the room's shell with the nav intact, so "take another room from the
      nav above" is true. Forced a real uncaught client render fault
      through it to check, rather than trusting that it compiled. And
      `lib/portal-auth.ts` was a dead second copy of the door, imported by
      nothing, exporting a `safeNext` without the /login guard and an
      unsalted `tokenFor` — exactly what auto-import reaches for. Deleted.
      The review also confirmed a lot: every localStorage access is already
      in try/catch, the only JSON.parse and fetch are guarded, all three
      clipboard callers feature-detect and fall back twice, and the
      half-written-client worry is solved structurally, because pillar()
      and scripts() pad every client to 4x25 and 20.
      One more thing, found by reading CI rather than the code: the gated
      a11y job had failed once on `page.goto(..., "networkidle")` timing
      out on home. Since the stills went through the image optimiser home
      issues fifteen requests, and "no traffic for 500ms" can simply never
      happen inside the timeout on a slow runner. It passed locally every
      time, which is the worst kind of check. a11y.mjs now waits for the
      document and then a fixed beat, with no networkidle anywhere.
- [x] Wave 55: the README catches up with twelve waves of design work,
      and one instruction in it that had gone false. It told the next
      person to freeze reveals with
      `[style*="opacity"]{opacity:1!important;transform:none!important}`,
      which matched nothing after the reveal became a clip-path wipe on a
      class. It now documents the real trap: this browser never advances a
      CSS transition, so finish the animations and read the end state. And
      the print trap beside it. The design-system section gains the display
      face's three registers, the serif italic's demotion to a signature,
      the slated scene change, the lamp rule, and the conform's server-only
      boundary.
- [x] Wave 54: the thing wave 53 flagged, plus a patch. The front page
      said "The objective" three times — once as an 11px label, twice at
      44px two sections later, in the agency-deck voice the writing pass
      had just removed everywhere else. The approach block now sets up the
      beats under it instead of restating the objective: "One video that
      works is luck. / The same six steps, every week, is why the next one
      works too." copy.test.ts holds the rule, both as a literal and as a
      shared-vocabulary check against the objective's own words.
      framer-motion 13.4.2 -> 13.4.4, a patch release, verified through the
      full suite because nine components import `motion`.
- [x] Wave 53: audit item 8, the writing pass, and with it all twelve
      items of the design audit. The site was written like a studio
      everywhere except its front page, where it reverted to agency-deck
      claims and then repeated each of them three or four times in one
      scroll. The hero's five-line lead is two sentences. The seven access
      cards say seven different things: the two audit cards now IMPORT the
      report intros from pillars.ts, so a card and the page it opens cannot
      drift; the Create card is seven imperatives, one per guide in the
      room's own order; the Publish card no longer opens with the Publish
      room's blurb word for word. The five loop steps went from 104 words
      re-listing those cards to 8-14 words each, and the rail is levelled by
      construction (mt-auto), so the three Open links sit on one baseline.
      Permanence was claimed in five places in one scroll; it is claimed in
      the hero strip and nowhere else.
      The rule is a test, not a discipline: copy.test.ts asserts the audit
      cards take their words from the reports, and that no sentence is
      shared between a card and a room's blurb, between two cards, or
      between a loop step and a card. Confirmed by restoring the old
      Publish card and watching it fail with the offender named.
      One real leak found by a smoke assertion that my own new tagline
      tripped: the front page was serialising counts ("0 of 100 written")
      for rooms this client has not got. Gated to the cards actually shown.

- [x] Wave 52: audit item 6, part B, and with it the last of the twelve.
      The access strip pinned a viewport and shuttled ~400vw sideways off
      vertical scroll for every reader, including one who asked for
      stillness — and since scripts/a11y.mjs builds its context with
      reducedMotion "reduce", that was the layout the suite had been
      auditing all along. It now becomes a stacked list: the section takes
      its natural height, the track is a column, the cards are full width,
      and the ruler and the "scroll to shuttle" instruction come off,
      because a ruler reading a position nothing moves through is a lie.
      Fixed in two halves: the range goes to 0 in state so the transform
      and the extra section height never exist, and the layout is undone in
      CSS with !important, because the layout is Tailwind's and Tailwind
      sits in a later layer. Doing it in CSS rather than from state also
      avoids a first-paint flash. Measured both ways at 1440: sticky ->
      static, row -> column, cards 428px -> 1384px, ruler and hint hidden,
      all three cards focusable with a visible ring and none clipped. An OS
      toggle with the page open reassembles it without a reload.
      A rail's arrows also stop scrolling smoothly under stillness.
- [x] Wave 51: audit item 6, parts A and C. The stated rule is that
      motion carries meaning and is off when it is asked to be, and the
      reveal was a generic fade-and-rise. A block is now laid down with a
      wipe: the cut the route change makes, at block scale, with nothing
      moving and nothing at partial alpha. The clip box overshoots by 40px
      on every side except the moving edge, so a tally glow, a hover ring
      or a focus outline is never shaved. Two blocks that stage their own
      entrance (the audit's three first moves, the positioning map's road)
      opt out through `:has()`, verified firing on both audit pages, and a
      block reached by Tab opts out through `:focus-within`, verified
      going from clipped to none on focus.
      And the lamp. Thirty of them pulsed, fifteen on one grid, at things
      that were not happening. `.lamp` is now a still dot and `.lamp-live`
      is the breath, on the eleven places where something is happening
      now: the Live readout, an error, the open door, the nav's new-work
      lamp, the section being read, the prompter while it runs, the
      monitor while you hover it, a script just copied, a film playing,
      the playhead on the reel. The nav's lamp breathes because it is an
      alert calling you; the same additions listed in Recently added go
      static, because that is the record you came to read.
      Verification note: this headless Chromium never advances a CSS
      transition — opacity, transform and clip-path all sit at their
      start value forever. Finish the animations first
      (`document.getAnimations().forEach(a => a.finish())`) and then read
      the end state: 5 revealed blocks at inset(-40px), 39 still waiting.
- [x] Wave 50: audit item 12, the last of the design audit's build list.
      A script page was a stack of paragraphs with one total at the top. It
      is now one row per beat, with the running time in the gutter, and a
      duration strip in the rail: constant height, each segment as tall as
      its seconds, so the six-second hook reads short even though it is set
      at 38px. `runningTimes()` computes from the cumulative word count and
      never sums rounded parts, so its last end is exactly
      `spokenSeconds()` of the whole and the gutter can never disagree with
      the rail — tested, including a twenty-beat case where summing
      rounded parts would drift. The estimate is stated once, as "150 wpm"
      under the total, rather than a tilde on twenty timecodes. Nothing
      animates and nothing is sticky in the beat column, so it is identical
      under reduced motion and on paper, where a timecoded script is what a
      call sheet looks like.
      Verification note worth keeping: Playwright's print emulation does
      not re-resolve var() consumers when @media print redefines a token,
      so every colour it reports under print is the screen colour. A clean
      page.pdf() render proves the print stylesheet is fine (black and
      greys, no cream). Layout under emulation is still trustworthy.
- [x] Wave 49: audit item 10. The type system had two holes. A
      sub-section rendered as `.mono`, which is the same typographic object
      as a list's caption, so on /create/editing section 07 the sub
      "Captions" and the list title "Captions should" read as the same
      thing. A sub is now its own level: display face at weight 500, 26px,
      with a lettered index drawn by CSS from data-a exactly as a numeral
      is from data-n. Nothing inside a sub may out-size its own heading, so
      the two block kinds that render display titles got component classes
      (`.step-title`, `.card-title`) whose sizes a `.sub-body` rule can cap
      — not a blanket rule on `.display`, because the diagrams use it for
      labels, which are not headings. Section h2 stays at 51.84px, the sub
      at 26px, capped step titles at 24px: no inversion at either width,
      and h1 -> h2 -> h3 is unchanged.
      The second hole: Big Shoulders is vendored variable 300-900 and used
      at exactly one weight. `.display-light` (320, slightly opened
      tracking) is the second voice, used in exactly three places, all of
      them large display type the page is pointing AT rather than naming
      itself: the next-room cut on a room overview and on a guide, and the
      access strip's card titles. Each has a 48px floor, because a 0.05em
      stem on this stage is grey blur, not light. Checked at 390 on a 1x
      display, which is the only place it could fail and the one place the
      script cannot see.
- [x] Wave 48: audit item 9. Nine of the thirteen universal guides draw
      their examples from one client's real work — aviation vocabulary
      runs from 96 references in video-style down to 11 in strategy — and
      none of them said so, which reads as a template nobody finished
      generalising rather than as a studio showing its working. Each of the
      nine now carries a credit in the header column that already holds the
      facts ("Examples from / The Jet Business / @thejetbusiness") and one
      sentence at the end of its intro naming it as a worked example, with
      the client's name dropping to the serif italic through the existing
      Rich renderer. Two list titles stop pretending now that the page
      frames them: "In aviation, this could be" is just "This could be".
      Ideation and study-your-niche are left alone: one stray reference
      each, nothing to frame, and labelling them would be false.
      The attribution is checked, not asserted: check-content.mjs fails the
      build unless the client is in published.json and the handle is in
      published.json or the reel. Confirmed by typoing the handle.
- [x] Wave 47: audit item 11. On the demo's shelves, sixteen identical
      empty script cards and eighteen identical empty idea cards said the
      system was unfinished. Now the first undelivered slot in each rail is
      still a full card carrying the promise — "In production.",
      "Written for Horizon Aviation." — and every one after it is a
      spine: a 64px column with its label standing up, no fill, no hover,
      no link. A pillar with nothing missing (the demo's authority, 25/25)
      is untouched. The count above the rail is unchanged, because a spine
      is still a slot and the promise has to stay countable. Sixteen
      keyboard stops that all led to "In production" are gone; those pages
      are still reachable from the foot of any script page and from the
      palette. The spines are not snap points either, or the rail would
      stutter over nineteen of them.
      One defect found by measuring rather than reading: the Tailwind
      `flex` utility I first put on the spine beat the print rule that
      hides an empty slot, so the spines would have printed. The centring
      moved into `.spine` itself, where the print rule's higher specificity
      wins. Checked in print emulation: 52 spines, all display:none.
- [x] Wave 46: audit item 7. Two leaks, both of them work that had been
      specified and then not wired through.
      The studio's publishing index — 634 entries, 250 KB — was in the
      client bundle, because EmbedModal is a client component and imported
      `embedUrl` from lib/published, whose first line imports the JSON. Two
      comments in the repo claimed the index never reached the browser
      while it did. `embedUrl` now lives data-free in lib/embed.ts, and
      lib/client-bundle.test.ts walks the import graph from every "use
      client" entry (ignoring `import type`, which SWC erases) and fails
      with the offending chain named. It failed before the fix and passes
      after. Client JS: 1,185 KB → 944 KB.
      The image optimiser was declared in next.config.ts and never invoked:
      Still.tsx was a raw `<img>` with an eslint-disable. It is next/image
      now, with `sizes` required, because a missing `sizes` silently falls
      back to 100vw and re-opens the bug. Home at 1440 fetched 2.18 MB of
      JPEG into wells as small as 64px; it now fetches 98 KB of AVIF, all
      of it through /_next/image. Guide's poster needed a wrapper for its
      md:w-[58%], since `fill` writes its own inline width; verified it
      still stops at 58% with the blur and opacity intact.
- [x] Wave 45: audit item 5. The site prints "Scene 01" on its opening
      clapperboard and numbers its rooms 01-06, then never slated scenes
      02-06. Now a cut has two lengths. Inside a room it is unchanged: 140ms
      of black, no label. Across rooms it is held to 260ms and struck with
      the scene it is cutting to — the clapper stripe, "SCENE 05", and
      PUBLISH in the display face — so the length says how far you
      travelled and the slate says where you landed. Drawn by CSS from data
      attributes on the frame, which is aria-hidden, so none of it is
      selectable, focusable or weighed as text. The label goes on before
      the frame does, or it would be a flicker rather than a slate.
      `chapterOfPath()` decides, segment-exact and tested: home's "/" is a
      prefix of everything and /contentious must never resolve to /content.
      The palette slates too, since it is the most common cross-room jump
      and would otherwise make the slate read as a bug. Verified by hand at
      full motion: no slate inside a room, no slate on browser back, and a
      cut that never lands is cleared, slate and all, by the safety timer.
- [x] Wave 44: audit item 4, the conform. The whole system is measured
      once, in lib/sequence.ts, and the measurement is used twice: as a
      position readout in the first frame and as a timeline at the foot of
      every page. Each page is a clip whose width is its reading time, so
      the strip is a true duration scale end to end and inside each room;
      read pages step up in luminance, and the playhead sits on the page
      you are on. One estimator and one denominator, so the two devices can
      never disagree: readingMinutes() now calls a shared minutesOf(), and
      a personalised page is measured by what is written in it rather than
      by its headings. sequence.ts is server-only — MasterTimeline and
      Readouts take `Clip` with `import type`, which is erased, so the
      thirteen guides stay out of the browser bundle (checked against the
      built chunks). hhmm() beside timecode(), both tested.
      The hero's running stopwatch is gone. It counted how long you had
      stared at the page, read "Live 00:00:00:00" to a screen reader, and
      was frozen at zero under reduced motion — which is the state the
      accessibility pass measures. It now reads POS 00:18 / 01:00.
      Two first-frame defects with it: an empty `<dl aria-label="Where the
      system stands">` no longer ships for a client with nothing written,
      and the access note clears the Contents chip at 1440.
      Two defects found by verifying rather than by reading: the playhead
      compared usePathname() during hydration, and since these pages are
      pre-rendered at /c/<slug>/... and served at the clean path, that was
      a mismatch on every page with a footer (React #418, 26 rows). The
      pathname is now read through a store with a null server snapshot, the
      shape PortalFooter already uses for the year. And the Analyse room,
      6 minutes of 60, was too narrow for its own label: it wrapped and
      pushed its strip out of line, so a group has a 172px floor and the
      side-by-side layout starts at lg rather than md.
- [x] Wave 43: audit item 3. The serif italic had stopped being a
      signature: on a room overview it set the lead, then every row's line,
      then the next-room blurb, so it was the body face. The two highest
      frequency uses drop to sans at a readable measure (52ch/48ch, 1.45
      leading) — on the Create room that is eight fewer italic paragraphs,
      14 serif spans down to 6. The survivors are set like display type: a
      new `.statement` puts `text-wrap: balance` on the twelve large serif
      statements, so a 44px italic can no longer drop one word onto its own
      line. `.measure` gains `text-wrap: pretty` for running prose, and
      `.em-serif .em-serif` inverts to upright sans, because a mark cannot
      be the same face as what surrounds it.
- [x] Wave 42: the first two items of the design audit. An unshot
      training film was eight 747px empty rectangles across the Create
      guides; it is now a slot on the timeline (title, state, frame marks,
      the playhead parked at zero) at 199px, hidden in print. And every
      control names where it goes: the front page's last link reads "Begin
      with Create, and study your niche" for a client with no audit yet
      (`firstRoom()`), the room pill reads "Start at 04.01" with the page
      title in its label, and the read toggle asks in the page's own words
      ("Got the rule?", "Got the notes?") — `ask` is required, so a new
      call site has to decide. 78 tests.
- [x] Wave 41: hardening. The next room was worked out three times in
      three files; it is now `roomAfter()` in lib/rooms.ts with tests (75),
      and the smoke suite holds the room furniture in place: the readout,
      the way in, the cut to the next room, no cut on the last room, and a
      guide’s contents.
- [x] Wave 40: a room has a way in and a way out. The hero carries a
      pill to the first page not yet read (“Start reading”, then “Pick up
      where you left off”, gone once everything is read), and the foot
      cuts to the next room, chosen from the rooms this client has, so the
      last room simply ends.
- [x] Wave 39: the door stands in front of the work. Two rows of the
      reel’s frames drift against each other behind the form, blurred to
      5px at 0.17 under a scrim and a vignette: depth without telling a
      stranger whose work it is, no names and nothing legible. The frames
      are the local stills only, because YouTube answers a dead id with a
      placeholder that Still then hides, which would leave holes in a
      drifting row.
- [x] Wave 38: a guide opens on its own frame. The still from its film
      sits behind the title, held right, defocused (blur 3px at 0.16) and
      faded into the stage: these stills carry burnt-in captions, and a
      sharp one reads as stray words behind the headline. The column that
      held only three mono lines now carries the contents, every numbered
      section as an anchor, desktop only (the rail in the margin does this
      once you are reading; this is the index before you start).
- [x] Wave 37: a room opens like a suite. ChapterOverview gained a
      readout (how many pages, how many minutes, how many read) and a
      monitor: a 3:4 plate holding every page’s still stacked and
      cross-dissolved, showing the first page not yet read and following
      the pointer or the keyboard down the list, with scanlines and a slow
      sweep across the glass (.scan, off under reduced motion, hidden in
      print). It is aria-hidden: the list already says everything. The
      component became a client one, so stills are resolved on the server
      (the published index must never reach the browser).
- [x] Wave 36: the template is a template again, and the studio's own
      vocabulary comes off the client's site. Two corrections from the user:
      (1) the personalised rooms were to be empty pages until a client is
      onboarded, so a page with nothing written is now nowhere on the site
      (src/lib/rooms.ts; nav, footer, home strip renumbered 01 upwards,
      palette, call sheet, five steps, recently added, and the foot of
      every guide all follow it; the routes stay so the design can be
      previewed by URL). The template's example ideas and script are gone:
      an open door now shows three parts, the demo still shows seven.
      (2) "For Company Name" and "Same for everyone" were the brief’s way
      of telling me what to write once and what to write per client, and I
      had printed them on the cards and in the nav panel. Removed, with
      the strip’s line rewritten. Also: the hero backdrop goes from 0.14
      to 0.45 so the clients’ films read behind the name. 71 tests.
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

**A. Decide before the first real client's content is written (only you can
   decide this).** The GitHub repository is PUBLIC. Both clients in it are
   fictional so nothing private is exposed today, but the documented
   onboarding writes a client's audit, hundred ideas and twenty scripts into
   `src/content/clients/<slug>/index.ts`, and committing that publishes
   them. Either make the repository private, or keep client content out of
   git and supply it at build time. Flagged 2026-09-28; the README now warns
   at the step itself. Related and already fixed: the demo door needed
   `PORTAL_DEMO=1` because its code is printed in the public README and the
   access hash is unsalted, so rotating PORTAL_SECRET does not revoke a code.


0. Performance option, not taken: framer-motion could load through
   `LazyMotion` + `m` (nine files import `motion`) to cut the largest
   client chunk; the site is private and static, so it was left. Take it
   only if a real client reports slow first loads.
1. Awaiting from the user (do not block): the first real client's content,
   images for `figure` blocks, and a real client logo to test `--logo`.
   The training films ARRIVED on 2026-09-28 and are in: nine of them, and
   the count was nine rather than eight because ideation was the one Create
   guide that had never declared a film. Seven steps across the seven
   Create guides in the room's order, plus home's intro and outro.
2. Majors available and not taken (`npm outdated`, re-checked 2026-09-27):
   typescript 7.0 and @types/node 26. Each is its own wave with the full
   loop, and typescript 7 is the Go rewrite, so it is a decision rather
   than a bump. framer-motion 13.4.4 (patch) was taken in wave 54.
   vitest 4.1.11 would clear the two moderate dev-only audit findings
   (@vitest/mocker path traversal, which covers 2.1.0 to 4.1.10 and has no
   patched 3.x), but `npm install -D vitest@4.1.11` still dies with
   "Cannot read properties of null (reading 'edgesOut')" on npm 10.9.2,
   with and without a verified cache. The suite uses no mocking at all, so
   the finding is not reachable here; it needs a working npm, not a
   workaround.
