# Tilted Needle × Client: the system

Next.js 16 (App Router) · React 19 · Tailwind v4 · Framer Motion

A private site that delivers each client's complete viral content system:
their audit, their hundred ideas and twenty scripts, and the universal
Tilted Needle knowledge (create, publish, analyse). One deployment serves
every client; the access code identifies who is in the room, and every page
under the door is theirs. `PROGRESS.md` is the resume point for anyone
picking the work up. The marketing site this grew out of lives on the
`marketing-site` branch.

## Running

```bash
npm install
npm run dev
```

```bash
npm run build
npx next start -p 3400
```

Without `PORTAL_SECRET` the door is open and the site shows the `template`
client, which is the right thing for previewing. To test the door locally:

```bash
PORTAL_SECRET=any-long-random-string npx next start -p 3401
```

If `next start` fails with `EADDRINUSE`, an older instance holds the port
and you would be looking at a stale build. Kill it first:

```powershell
Get-NetTCPConnection -LocalPort 3400 -State Listen | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }
```

## The six rooms

| Route | Personalised | What it is |
|---|---|---|
| `/` | name and logo | Welcome and a readout, an intro film slot, what you have access to (a pinned strip of seven cards), the week's call sheet, what was recently added, how to use the system (five steps on a loop), an outro film slot, the approach |
| `/audit` then `/audit/content-diagnostic`, `/audit/competitor-intelligence` | yes | Two reports on fixed headings (13 and 8): a lamp scan and a score strip in the header, the three moves first, a verdict and a dial on every finding, the competitor board and the positioning map. Unwritten headings show a slate |
| `/content` then `/content/ideas`, `/content/scripts`, `/content/scripts/[n]` | yes | Four pillars of 25 idea cards on rails, the mix, copy-all and a "deal me one" card; 20 scripts on a rail, then the first month laid out (scripts first, ideas after, one every other day); a script page with the slate (location, who is on camera), copy, a full-screen prompter with a countdown, print, and the shot list as a storyboard; a script can be marked filmed on this device (the rail, the first month, the call sheet and the home readout follow), and every idea card can ask the studio for it as a script |
| `/create` then 7 guides | no | Study your niche, ideation, video style, hooks, core message, filming, editing |
| `/publish` then 4 guides | no | Publishing strategy, content packaging, discoverability, profile optimisation |
| `/analyse` then 2 guides | no | Understanding your analytics, the monthly process |
| `/login` | | The door |

The nav is the table of contents: hovering a room opens a panel listing its
pages; on a phone the whole contents fold into one screen. Every guide and
report can be marked as read at its foot; the mark lives on that device
only (localStorage) and shows in the nav, on the room's overview and as
"3 of 7 read" on the home strip. Home also carries a call sheet for the
week: one idea, one script, one guide and one thing to do, rotated by the
week of the year so the whole team sees the same sheet. `⌘K` (or `/`)
opens the palette, which lists recent picks first, jumps to any page or
section and, from three letters on, finds any sentence in the guides, in
the client's audit (by heading, plus the board and the map) and in their
scripts (the index is built per client at `/search-index.json`, behind
the door, with the client's notes folded in); `[` and `]` page through
the system in reading order. Home lists what was recently added and marks
what arrived since the device's last visit. Guides carry a
reading line along the top edge, say how many minutes are left, offer
to resume at the last section read on this device, and every section
heading carries a copy-link anchor on hover.

## Clients

Everything personal lives in `src/content/clients/<slug>/`, one folder per
client, listed in `src/content/clients/registry.ts`. Two ship with the
repo: `template` (what an open door shows; example ideas and one example
script) and `demo` (Horizon Aviation, fictional; the finished state, access
code `horizon-2026`).

To add a client, scaffold it:

```bash
npm run new-client -- horizon-aviation "Horizon Aviation" --short Horizon --code "three words 7" --logo /client/horizon.png
```

That creates `src/content/clients/<slug>/index.ts` with the identity, every
slot empty, the access hash computed from the code (the code itself is
never stored; give it to the client directly), and adds the client to
`registry.ts`. `--short` is the name the nav uses, `--logo` a file under
`public/` (without one the site shows a monogram); `--since` and
`--contact` are optional. To change the code later:

```bash
npm run access -- <slug> "<the new code>"
```

and paste the hash into `accessHash`. Then:

4. Write the two audit reports (paragraphs under each fixed heading; use the
   `report()` helper), 25 ideas per pillar (`pillar()` pads to 25) and 20
   scripts (`scripts()` fills the numbered slots). Anything left empty
   renders as a slot that says it is on its way. A finding can carry a
   verdict, a score, keep / limiting / change lists, evidence and a place
   in the first three moves; the competitor report can carry a board of
   accounts and a positioning map (`you: true` marks the client today,
   `target: true` where the first moves lead, drawn as a dashed line; name
   the target "Client, after the three moves" and the map labels the ring
   with the part after the comma). A script can carry a location, who is
   on camera, a shot list and the idea it came from. `notes` puts a
   studio note inside any universal guide for this client only, keyed
   "create/hooks", after the intro or under a numbered section (`at`).
   `changes` lists what the studio has added for this client (dated,
   newest first); home folds it into Recently added, marked "For you".
   The demo client shows every one of these.
5. Check and build:

   ```bash
   npm run check
   npm run build
   ```

   `check` compiles the content, then validates every client and guide:
   slugs, hashes, logos, heading sets, idea counts, script numbering, clip
   ids. It exits non-zero on problems.
6. Deploy. The pages for every client are pre-rendered at build time.

## The door

`src/proxy.ts` runs on every request. With `PORTAL_SECRET` set it verifies
the `tn-room` cookie (`slug.expiry.signature`, HMAC-SHA256 under the
secret, 30 days) and rewrites the clean URL into that client's pre-rendered
tree under `/c/<slug>/`. No cookie, or a bad one, redirects to `/login`
with the wanted page in `?next=`. Direct hits on `/c/...` are bounced to the
clean path, so no client tree is reachable by name.

The login page is one field. The server action hashes the code against
every client (`sha256("tn:" + slug + ":" + code)`, constant-time, no early
exit) and, on a match, sets the session cookie and a readable `tn-in`
presence cookie that the static footer uses to show "Leave the room".
Twelve attempts per ten minutes per IP. No accounts, no database.

Set `PORTAL_SECRET` on the deployment to any long random string. Rotating
it logs everyone out.

A shared link previews as the slate of a private screening
(`src/app/opengraph-image.tsx`), whatever the path: no client name ever
appears in a preview. A missing page (a script number that does not exist, an
unknown client) is a routed 404 served from the site's own page.

Each client has their own link to the door, `/login?for=<slug>`, which
puts their name and mark on the slate (the scaffolder prints it). The
code is still what opens it; the link on its own grants nothing.

## Writing a guide

A guide is data (`src/content/types.ts`): a title, a kicker, an intro, an
optional training film, a `poster` (the YouTube id whose still stands for
the guide on its chapter page), numbered sections made of blocks, and the
rule it closes on. Each block kind has one designed rendering in
`src/components/portal/blocks.tsx`; the diagrams live in `diagrams.tsx`.

Text:

- `p`, `lead`: paragraphs at a reading measure
- `list`: ruled rows with mono indices (`rule`), pills (`tag`), or one-word beats in the display face (`beat`)
- `questions`: serif italic rows
- `lines`: things said on camera (`spoken`), on-screen text as chips (`screen`), or lines to avoid (`dim`)
- `swaps`: instead-of / try pairs
- `pairs`: if-you-are-talking-about / show pairs
- `keyed`: a mono label and the lines under it
- `steps`: a timeline
- `cards`: a small grid (the four pillars)
- `split`: two columns (speed up / slow down)
- `checklist`: the call sheet
- `aside`: a pull quote, optionally labelled ("Action point")
- `sub`: a titled sub-section

Pictures:

- `clips`: example clips from the studio's published library, by YouTube id
- `profile`: the bad-profile / good-profile comparison
- `figure`: a still (`/path` under `public/`, or a URL) with alt text and a caption
- `retention`: where attention is lost, as a watch-time curve
- `cadence`: a month of days, every other one carrying a post
- `fan`: one to many (one idea, four angles; one video, five platforms)
- `structure`: the shape of a video as a strip with timecodes
- `shots`: shot sizes as a contact sheet
- `lens`: two angles of view from one camera
- `flashcards`: an opening line on the front, the hook on the back
- `flow`: a ladder of yes/no questions
- `typewriter`: a search box typing what people search for
- `cycle`: a ring of stations

Inline: `**bold**` and `*emphasis*` (the serif italic).

### Training films

Each Create guide has a `film` slot, and home has an intro and an outro.
Add `youtubeId` when the film is uploaded (unlisted on YouTube is fine);
until then the well shows its slate and says the film arrives with
onboarding.

### Example clips

`src/lib/published.json` is the studio's own index of published work
(stills and links), exported read-only from the ops database with
`node scripts/published.mjs`. `clips` blocks and guide posters reference
entries by YouTube id; anything not in the index falls back to YouTube's
own still, and `npm run check` warns about it.

## The design system

`src/app/globals.css` holds it: one dark world, four faces (Big Shoulders
Display, Instrument Sans, Instrument Serif italic, JetBrains Mono, all
vendored, all SIL OFL), tally red used only for state. Rules: display type
is condensed and uppercase with one word dropped to the serif italic; labels
are mono; corners are square or pill; nothing floats. Route changes are
black-frame cuts; fine pointers get a playhead cursor. Scripts print black
on white with the room left out.

Security headers, including a narrow content security policy, are in
`next.config.ts`. Anything that loads from a new host must be added there.

## Verifying

```bash
npm test
npm run check
npm run smoke -- http://localhost:3400
npm run smoke -- http://localhost:3401 --gated
```

`test` runs the unit tests for the pure parts: the session token and
access hash, the proxy's path maps, spoken length, the week, the inline
marks and the palette index. The same loop runs on every push in GitHub
Actions (`.github/workflows/verify.yml`), on Node 22 (`.nvmrc`).

`smoke` fetches every route and checks status codes, redirects, the door,
and a few strings. Visual checks run through Playwright against
`next start`, with screenshots into a scratch directory. Freeze reveals
with `[style*="opacity"]{opacity:1!important;transform:none!important}`
for stills, and wait for the home slate to finish before shooting home.
