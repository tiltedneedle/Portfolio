# PROGRESS

Working log for tilted-needle-site. If you are resuming after a cut-off:
read this first, then `git log --oneline -5`, then pick up at **In flight**.
Do not re-ask the user what to do.

Repo: `C:\Users\HP\Downloads\JOB2\tilted-needle-site` (remote `github-tn`,
`tiltedneedle/Portfolio`). Build with `npm run build`; serve with
`npx next start -p 3400` (kill any old listener on 3400 first). Visual checks
go through the Playwright MCP (`browser_run_code_unsafe`), screenshots into
the session scratchpad, never into the repo.

## What this is now (2026-09-24)

**The client system**: a private site delivering one client's complete
viral content system, built once as a template and duplicated per client.
Brief: the user's "Info Product Servicing .md". Six rooms: Home, Your audit,
Your content (personalised), Create, Publish, Analyse (universal). See
README.md for the structure and how to set up a client.

The marketing site this grew out of is preserved on the `marketing-site`
branch (last commit `f58bf69`). `main` is the system.

## Done

- [x] Content model (`src/content/types.ts`): guides as typed blocks.
- [x] All 13 universal guides authored from the brief, faithfully, with
      every list, example and checklist typed for its own block; example
      clips from the studio's published library woven into Create and
      Publish. Profile optimisation and the monthly process were written
      from the brief's outline (it had no prose for them).
- [x] Client files with slots: identity, audit (13 + 8 fixed headings),
      100 ideas (3 examples per pillar), 20 scripts (1 finished example).
- [x] Home: slate, hero with the lockup and a drifting backdrop of the
      studio's stills, objective, the seven-card pinned strip, the five-step
      loop, the approach. Nav with hover panels per room; mobile contents.
- [x] Guide page: slate header, training film well, numbered sections with
      a following rail, the rule, prev/next cut.
- [x] Audit report, ideas pillars (rails), scripts rail, script page with
      copy button, chapter overviews, login (proxy + cookie + server action).
- [x] Build clean (48 static pages), no console errors, no horizontal
      overflow at 1440 or 390, cut transition and copy button verified.

## In flight

- (nothing)

## Next

- [ ] Training films: add `youtubeId` to each Create guide's `film` once the
      nine videos are uploaded (Intro and Outro have no slot yet; add to home
      if wanted).
- [ ] First real client: fill `src/content/client/*`, add the logo, set
      `PORTAL_PASSWORD`, deploy to their URL.
- [ ] If the studio wants a reusable idea bank across clients, add
      `src/content/system/idea-bank.ts` and let `ideas.ts` pull from it.
- [ ] A `figure` block (image + caption) is a small addition to the guide
      model if the user's promised images need a home beyond `clips`.
