# Tilted Needle × Client: the system

Next.js 16 (App Router) · React 19 · Tailwind v4 · Framer Motion

A private, premium site that delivers one client's complete viral content
system: their audit, their hundred ideas and twenty scripts, and the
universal Tilted Needle knowledge (create, publish, analyse). Built once,
duplicated per client. `PROGRESS.md` is the resume point for anyone picking
the work up. The marketing site this grew out of lives on the
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

If `next start` fails with `EADDRINUSE`, an older instance holds the port
and you would be looking at a stale build. Kill it first:

```powershell
Get-NetTCPConnection -LocalPort 3400 -State Listen | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }
```

## The six rooms

| Route | Personalised | What it is |
|---|---|---|
| `/` | name and logo only | Welcome, what you have access to (a pinned strip of seven cards), how to use the system (five steps on a loop), the approach |
| `/audit` then `/audit/content-diagnostic`, `/audit/competitor-intelligence` | yes | Two reports on fixed headings (13 and 8). Empty headings show a slate until written |
| `/content` then `/content/ideas`, `/content/scripts`, `/content/scripts/[n]` | yes | Four pillars of 25 idea cards on rails; 20 script cards on a rail; a script page with a copy button |
| `/create` then 7 guides | no | Study your niche, ideation, video style, hooks, core message, filming, editing |
| `/publish` then 4 guides | no | Publishing strategy, content packaging, discoverability, profile optimisation |
| `/analyse` then 2 guides | no | Understanding your analytics, the monthly process |
| `/login` | | The door (see below) |

The nav is the table of contents: hovering a room opens a panel listing
its pages; on a phone the whole contents fold into one screen.

## Setting up a new client

Everything personal lives in `src/content/client/`. For a new client:

1. **Duplicate** the repo (or branch it) so each client has their own URL.
2. Edit `src/content/client/client.ts`: name, short name, logo path, year,
   contact. Drop the logo into `public/client/`. Without a logo the site
   shows a monogram in a hairline square.
3. Fill `src/content/client/audit.ts` (paragraphs under each fixed heading),
   `ideas.ts` (25 strings per pillar) and `scripts.ts` (title, hook, body,
   call to action). Anything left empty renders as a slot that says so.
4. Set `PORTAL_PASSWORD` on the deployment. Without it the door is open,
   which is what you want for previewing the template.
5. Deploy. `robots.txt` disallows everything and every page is `noindex`.

Everything universal lives in `src/content/system/` and does not change per
client.

## Writing a guide

A guide is data (`src/content/types.ts`): a title, a kicker, an intro, an
optional training film, numbered sections made of blocks, and the rule it
closes on. Each block kind has one designed rendering in
`src/components/portal/blocks.tsx`:

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
- `clips`: example clips from the studio's published library, by YouTube id
- `profile`: the bad-profile / good-profile comparison

Inline: `**bold**` and `*emphasis*` (the serif italic).

### Training films

Each Create guide has a `film` slot. Add `youtubeId` when the film is
uploaded (unlisted on YouTube is fine); until then the well shows its slate
and says the film arrives with onboarding.

### Example clips

`src/lib/published.json` is the studio's own index of published work
(stills and links), exported read-only from the ops database with
`node scripts/published.mjs`. A `clips` block references entries by YouTube
id and plays them in a lightbox from the privacy-enhanced host.

## The door

`src/proxy.ts` redirects every request to `/login` unless the `tn-room`
cookie carries a SHA-256 digest of `PORTAL_PASSWORD`. The login page is a
server action that sets that cookie for 30 days. One password per client
system; no accounts, no database.

## The design system

`src/app/globals.css` holds it: one dark world, four faces (Big Shoulders
Display, Instrument Sans, Instrument Serif italic, JetBrains Mono, all
vendored, all SIL OFL), tally red used only for state. Rules: display type
is condensed and uppercase with one word dropped to the serif italic; labels
are mono; corners are square or pill; nothing floats. Route changes are
black-frame cuts; fine pointers get a playhead cursor.

## Verifying

Visual checks run through Playwright against `next start` on 3400, with
screenshots into a scratch directory. Freeze reveals with
`[style*="opacity"]{opacity:1!important}` for stills. The cut can be timed
by sampling `document.body.classList.contains("is-cutting")` around a click.
