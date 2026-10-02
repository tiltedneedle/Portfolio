# Tilted Needle × Client: the system

Next.js 16 (App Router) · React 19 · Tailwind v4 · Framer Motion

A private site that delivers each client's complete viral content system:
their audit, their hundred ideas and twenty scripts, and the universal
Tilted Needle knowledge (create, publish, analyse). One deployment serves
every client; each person signs in with their Tilted Needle account, which
says which client they belong to, and every page under the door is theirs. `PROGRESS.md` is the resume point for anyone
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

With no accounts connected (`SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY`
unset) the door is open and the site shows the `template` client, which is
the right thing for previewing. To test the door locally, run the stand-in
for Supabase and point the portal at it:

```bash
npm run double
```

```bash
SUPABASE_URL=http://localhost:54321 SUPABASE_PUBLISHABLE_KEY=sb_publishable_double npx next start -p 3401
```

Then sign in as `client@horizon.test`, password `horizon-portal-2026` (the
demo's client). The double (`scripts/auth-double.mjs`) has an account for
every case the door handles, listed at its top; none of them exists
anywhere else, and it forgets everything when it stops. To try the real
thing, put the Tilted Needle app's two values in `.env.local` instead (see
The door).

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
| `/content` then `/content/ideas`, `/content/scripts`, `/content/scripts/[n]` | yes | Four pillars of 25 idea cards on rails, the mix, copy-all and a "deal me one" card; 20 scripts on a rail, then the first month laid out (scripts first, ideas after, one every other day); a script page with the slate (location, who is on camera), copy, a full-screen prompter with a countdown, print, and the shot list as a storyboard; a script can be marked filmed on this device (the rail, the first month, the call sheet and the home readout follow), and every idea card can ask the studio for it as a script; ideas pin to a shortlist on this device, which leads the first month and the call sheet |
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

> **Before the first real client: this repository is public.** Both clients
> that ship with it are fictional, so nothing private is exposed today. But
> the steps below put a client's audit, their hundred ideas and their twenty
> scripts into `src/content/clients/<slug>/index.ts`, and committing that
> publishes their material to anyone who looks. Decide first: make the
> repository private, or keep client content out of git and supply it at
> build time. Do not write a paying client's words into this tree until
> that is settled. Signing in does not change this: the login guards the
> site, not the repository.

Everything personal lives in `src/content/clients/<slug>/`, one folder per
client, listed in `src/content/clients/registry.ts`. Two ship with the
repo: `template` (what an open door shows; example ideas and one example
script) and `demo` (Horizon Aviation, fictional; the finished state, and no
real account can reach it: only the test double has one).

To add a client, first create them in the Tilted Needle app. Then
scaffold them here with their id from that app: Team admin's Clients tab
shows it, with a copy button, as soon as the client is chosen there (it is
the `id` of their row in that app's `clients` table):

```bash
npm run new-client -- horizon-aviation "Horizon Aviation" --short Horizon --ops-client <their id in the Tilted Needle app> --logo /client/horizon.png
```

That creates `src/content/clients/<slug>/index.ts` with the identity and
every slot empty, and adds the client to `registry.ts` and to `slugs.ts`,
where the proxy finds which portal an account belongs to. `--short` is the
name the nav uses, `--logo` a file under `public/` (without one the site
shows a monogram); `--since` and `--contact` are optional. Without
`--ops-client` nobody can sign in until the id is set, in the client's
`opsClientId` and in `OPS_CLIENT_IDS` in `slugs.ts` (the build checks the
two agree). Then:

4. Write the two audit reports (paragraphs under each fixed heading; use the
   `report()` helper), 25 ideas per pillar (`pillar()` pads to 25) and 20
   scripts (`scripts()` fills the numbered slots). A page with nothing
   written is not on the website at all: `src/lib/rooms.ts` decides which
   personalised pages a client has, and the nav, the home strip, the
   palette, the footer, the call sheet, the five steps and the foot of
   every guide all follow it. Within a written page, an empty slot renders
   as one that says it is on its way. Example content does not count as
   written; it is there to show the shape of a finished page. A finding can carry a
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
   slugs, Tilted Needle ids, logos, heading sets, idea counts, script
   numbering, clip ids. It exits non-zero on problems.
6. Deploy. The pages for every client are pre-rendered at build time.

## The door

People sign in with their Tilted Needle account: the same email and
password as the Tilted Needle app, because the portal uses that app's
Supabase project. Neither has a sign-up form; an account exists because
someone invited it from the app's Team admin. Who sees which portal is that
app's own record: a person whose active membership has the Client role,
for a client whose id is in `OPS_CLIENT_IDS` (`src/content/clients/slugs.ts`),
sees that client's system. Anyone else (staff, a client this portal does
not carry, a membership switched off) is told at the door that the account
has no portal here, and no session is kept.

`src/proxy.ts` runs on every request. It verifies the session's token by
its signature (`getClaims`, against the project's published keys, with no
round trip once they are cached), refreshes it as it nears its end, asks
the database which client the person belongs to (as that person: row
security shows anyone their own memberships only), and rewrites the clean
URL into that client's pre-rendered tree under `/c/<slug>/`. The answer is
remembered per server instance for a minute (fifteen seconds when there is
none), so taking a membership away takes up to a minute to reach the
portal. No session, or one that does not verify, redirects to `/login` with
the wanted page in `?next=`. Direct hits on `/c/...` are bounced to the
clean path, so no client tree is reachable by name.

The door's forms post to route handlers under `/auth/`: `sign-in`,
`sign-out`, `forgot` (emails a link to choose a new password), `confirm`
(where that link lands), `session` (takes the session an invitation
began) and `password`; `/auth/reset` is the page for the new password and
`/auth/accept` the page an invitation lands on. All of them refuse a form
posted from another site. Wrong
passwords are counted, twelve per ten minutes per address, under
Supabase's own limits; reset requests are counted the same way, since
each sends an email. Signing out ends this browser's session only:
Supabase's default ends every session, which here would sign the person
out of the Tilted Needle app as well.

A session's token lasts an hour and is renewed with a refresh token that
is spent once used. Only the proxy and the `/auth/` routes renew it,
because only they can keep the new one; a page cannot write cookies, so
the two pages that read the session (`/login`, `/auth/reset`) pass
through the proxy first, and a page's own client refuses to refresh at
all (`supabaseForPage`). Someone already signed in who opens the plain
door, which is the link clients are sent, goes straight on.

A reset link comes back to exactly `/auth/confirm` (Supabase matches the
address against its allowed list as a whole string) and works once, in
the browser that asked: it is half of a key pair whose other half is a
cookie. A request Supabase refuses (asking twice in a minute, an address
its mailer will not send to) is said on the page, and leaves the cookie
for the link already sent untouched.

An invitation is sent from the Tilted Needle app (Team admin, Clients)
and, with that app's `CLIENT_PORTAL_URL` set to this portal's address,
lands here, on `/auth/accept`. Supabase answers an invitation link with
the session it began in the address's fragment, which no server is ever
sent, so that page's one script reads it, clears it from the address and
the history, and posts it to `/auth/session`. The route checks it with
Supabase before keeping it, in the same httpOnly cookies as any sign-in,
and the person goes on to choose their password and then into their
portal. That script is the only thing here that handles a session in the
browser, and it keeps nothing. An invitation that has expired or been
used goes to the door, which offers a new link by email. Without
`CLIENT_PORTAL_URL` the link opens the Tilted Needle app's own page for
choosing a password instead, and the same email and password then sign in
here.

The session's cookies are httpOnly (the portal never talks to Supabase
from the browser, so nothing a page runs can read them), SameSite=Lax, and
Secure over https. A readable `tn-in` cookie tells the static footer to
show "Leave the room". The portal keeps no secret of its own:
`SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY` are public values, the same
ones the Tilted Needle app ships to every browser (there they are named
`NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`).

A Vercel production build refuses to go out without the door
(`next.config.ts`): with either value missing (the template, every guide in
it, to anyone), or with `SUPABASE_URL` anything but the https address of a
real project (the test double on localhost, say). The deploy fails where it
is seen and the last good one stays up. Preview deployments, CI and
`next start` are not affected.

The demo has no real account: its id in the Tilted Needle app is
fictional, so only the test double can sign in to it.

A shared link previews as the slate of a private screening
(`src/app/opengraph-image.tsx`), whatever the path: no client name ever
appears in a preview. A missing page (a script number that does not exist, an
unknown client) is a routed 404 served from the site's own page.

Each client has their own link to the door, `/login?for=<slug>`, which
puts their name and mark on the slate (the scaffolder prints it). The
account is still what opens it; the link on its own grants nothing.

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

`src/content/system/reel.ts` is the showreel: the studio's clients' own
TikTok and Instagram films with the views they took. Their stills are
cached under `public/clips/` because signed CDN stills expire (TikTok's
oEmbed gives a 1080-wide cover; Instagram's Open Graph still is 360×640
and that is all it gives). Home shows the reel after the welcome, the
hero's backdrop drifts through its stills first, and a `clips` block may
name a reel id. The films play in the platforms' own embedded players
(`tiktok.com/embed/v2/<id>`, since TikTok's newer player answers
"unavailable" for these films, and `instagram.com/reel/<code>/embed/`),
both allowed by the CSP; the stills are served from `public/clips/`,
which the proxy leaves alone. A film TikTok restricts by content
classification (no embed, no oEmbed, a login wall) is carried with
`restricted: true`: its card shows the still and the count and opens on
TikTok, and it may not be used as a clip. `npm run check` refuses a reel
entry without a still.

## The design system

`src/app/globals.css` holds it: one dark world, four faces (Big Shoulders
Display, Instrument Sans, Instrument Serif italic, JetBrains Mono, all
vendored, all SIL OFL), tally red used only for state. Rules: display type
is condensed and uppercase with one word dropped to the serif italic; labels
are mono; corners are square or pill; nothing floats.

The display face carries three registers. `.display` at 800 is how a page
names itself. `.display-light` at 320 is the second voice, for large type
the page is pointing at rather than naming: the cut to the next room, the
access strip's card titles. It has a 48px floor, because a thin stem below
that reads as grey blur on this stage. `.subhead` at 500/26px is a
sub-section, a level below a section heading and above a list caption;
nothing inside a `.sub-body` may out-size it. The serif italic is a
signature, not a second body face: `.statement` balances the dozen large
serif lines, `.measure` sets running prose, and `.em-serif` inside
`.em-serif` inverts to upright sans.

Route changes are black-frame cuts, and a cut that changes room is held
longer and slated with the room it is cutting to, the way the opening
clapper slates Scene 01 (`chapterOfPath()` decides). Fine pointers get a
playhead cursor.

Motion carries meaning or it is not there. A block below the fold is wiped
in from its top edge, not faded; two blocks that stage their own entrance
opt out through `:has()`. The lamp is a still dot by default and only
`.lamp lamp-live` breathes, at the eleven places where something is
happening now. The access strip becomes a stacked list under reduced
motion rather than a shuttle. All of it is CSS, all of it off under
reduced motion.

Scripts and the first month print black on white with the room left out.
The whole system is measured once, in `src/lib/sequence.ts`, and read
twice: as a position in the first frame and as a conformed timeline at the
foot of every page. That module is server-only — a client component may
take `Clip` from it with `import type`, never the function, and
`src/lib/client-bundle.test.ts` holds the same rule for the publishing
index.

Every class in `globals.css` sits in Tailwind's `components` layer, so a
utility on the same element wins (`mono text-[color:var(--ink)]` is ink);
new rules go inside that block.

Security headers, including a narrow content security policy, are in
`next.config.ts`. Anything that loads from a new host must be added there.

## Going live

Vercel builds `main` to Production on every push. Before a client is sent
a link:

1. **The repository.** Make it private, or keep client content out of git
   (see Clients). The login guards the site, not the repository.
2. **The door.** In the Vercel project, Settings, Environment Variables,
   Production: `SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY`, set to the
   Tilted Needle app's own values (its `NEXT_PUBLIC_SUPABASE_URL` and
   `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`). A production build refuses to
   go out without them, and says why in the build log.
3. **Supabase** (the Tilted Needle project, Authentication). Under URL
   Configuration, add `https://<the portal's domain>/auth/confirm` and
   `https://<the portal's domain>/auth/accept` to the Redirect URLs, or the
   portal's "forgot your password" links and its invitations land on the
   Tilted Needle app instead. In the Tilted Needle app's own environment
   (its Vercel project) set `CLIENT_PORTAL_URL` to
   `https://<the portal's domain>`, so a client's invitation opens here.
   Keep "Allow new users to sign up" off (the
   app needs that too). And before inviting clients: Supabase's built-in
   email reaches only the project team's own addresses, and slowly, so set
   a mail provider (SMTP) for invitations and reset links to reach anyone
   else.
4. **An address.** Add a domain to the project. Vercel's login (Deployment
   Protection) sits in front of the project's generated `*.vercel.app`
   addresses, so a client cannot reach the door through them. Put the
   domain on the GitHub repository too; the one there now is dead.
5. **The client.** Create them in the Tilted Needle app, scaffold them
   here with `--ops-client` (see Clients; Team admin's Clients tab shows
   the id) and deploy. Only then invite their people, from that tab, for
   that client: each gets a link that opens here, chooses a password, and
   is inside. Invited before the deploy, they would choose a password and
   be told the account has no portal yet. From then on the address to give
   them is `/login?for=<slug>`. That
   page shows their name to anyone who guesses the slug; if who the studio
   works with is confidential, use a slug that is not the client's name.
6. **After the deploy,** from outside: `/login` answers 200 with the
   Content-Security-Policy header; `/audit` without a session goes to
   `/login`; a wrong password is refused; the client's account opens their
   own pages and nobody else's; a staff account is told it has no portal.
7. **Worth switching on in Vercel:** a firewall rate limit on `POST
   /auth/sign-in` and `POST /auth/forgot` (the in-app count is per
   instance), an uptime check on `/login`, and error alerts or a reporting
   service; today a fault in production is visible only in Vercel's logs.

## Verifying

```bash
npm test
npm run check
npm run smoke -- http://localhost:3400
npm run links -- http://localhost:3400
npm run smoke -- http://localhost:3401 --gated
npm run door -- http://localhost:3401
npm run links -- http://localhost:3401 --gated
npm run a11y -- http://localhost:3401 --sign-in
npm run safari -- http://localhost:3401 --sign-in
```

The :3401 lines need the test double and the gated server running (see
Running). `test` runs the unit tests for the pure parts: which portal a
membership leads to and how long that is remembered, the redirects the
door allows, the proxy's path maps, spoken length, the week, the inline
marks and the palette index. The same loop runs on every push in GitHub
Actions (`.github/workflows/verify.yml`), on Node 22: `package.json`'s
engines field, which Vercel builds with and CI reads (`.nvmrc` says the
same, for nvm).

`smoke` fetches every route and checks status codes, redirects, the door,
and a few strings. `links` walks every page a reader can reach from the
front page and checks that each answers, that every #anchor lands on an id,
and that every image loads. `door` tries to get past the door with the
internal tree under other spellings, the image optimizer, sessions that
are forged, expired, signed with the wrong key or with none, accounts that
have no portal here, and forms posted from another site, then takes a
forgotten password and an invitation from the link to being inside; the
double's test-only routes mint the tokens and links it needs. `a11y` opens a real browser
(`npx playwright install chromium` once), opens an invitation link (reading it out of the address is the one
part of the door only a browser can do), signs in, and takes every route the palette's index knows
plus the fixed pages through axe at desktop and phone width (WCAG 2.2 AA
and best practice, no filter), failing on any violation, any horizontal
overflow or any console error; then the palette, open. CI runs it after
the gated smoke. `safari` walks every page a reader can reach in
Playwright's WebKit, the engine inside Safari (`npx playwright install
webkit` once), as an iPhone and as desktop Safari: each page answers and
comes alive with no console error, and is never wider than the screen,
as it opens or at any point while it is scrolled through, with every
animation caught as it starts and slowed so its widest moment is seen.
WebKit counts what an animation draws toward the page's width and
Chromium does not, so only this pass can see that fault (it found three).
It signs in through the door's own form, as a client on a phone would,
and follows them inside. CI runs it after `a11y`. Visual checks run through Playwright against
`next start`, with screenshots into a scratch directory.

Stop both servers before rebuilding. `next start` reads the build manifest
once, so a rebuild underneath it serves chunks that no longer exist, and the
accessibility pass then reports dozens of 500s on unrelated routes that look
exactly like a regression.

Two traps in that browser. It never advances a CSS transition at all, so
a correct reveal sits at its start value forever and looks like a broken
cascade; finish the animations first
(`document.getAnimations().forEach((a) => a.finish())`) and read the end
state, or freeze the reveal outright with
`.reveal-wait{clip-path:none!important}`. And print emulation does not
re-resolve `var()` consumers when `@media print` redefines a token, so
every colour it reports under print is the screen colour; check print with
a clean `page.pdf()` and read the fill operators out of the content
streams instead. Layout under print emulation is still trustworthy.

Wait for the home slate to finish before shooting home.
