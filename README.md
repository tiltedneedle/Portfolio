# Tilted Needle — marketing site

Next.js 16 (App Router, Turbopack) · React 19 · Tailwind v4 · Framer Motion · lucide-react

This is a reconstruction of the deployed site at
`main.d1t3mjrfrjbzy.amplifyapp.com`, rebuilt after the original codebase was lost.

## Running

```bash
npm install
npm run dev
```

```bash
npm run build && npm run start
```

## Routes

| Route | Notes |
|---|---|
| `/` | Hero, brands marquee, services tabs, process timeline, case studies, portfolio grid, contact form |
| `/services` | Overview of the four capabilities |
| `/services/[slug]` | Four detail pages, statically generated from `src/lib/services-data.ts` |
| `/portfolio` | Pannable / zoomable canvas board of 108 videos |
| `/careers` | Perks, expandable roles, application form |
| `/book-demo` | Calendly embed |
| `/privacy`, `/terms` | Shared `LegalPage` component |
| `/api/contact` | Form handler (see below) |

`/` and the marketing pages share `src/app/(site)/layout.tsx` (nav + footer).
`/portfolio` sits outside that group because it renders no footer and owns the
full viewport.

## Layout note

`src/app/(site)/` is a route group, so it does **not** appear in URLs —
`src/app/(site)/careers/page.tsx` serves `/careers`.

## Contact form

`POST /api/contact` sends via Resend when both env vars are set:

```
RESEND_API_KEY=...
CONTACT_FROM=noreply@yourdomain.com
CONTACT_TO=info@tiltedneedle.com   # optional, this is the default
```

With no transport configured the route responds `{ fallback: true, to, subject }`
and the client opens a prefilled `mailto:` link, so enquiries are never
silently dropped. Both the contact form and the careers application post here.

## Data

All copy and structured content lives in `src/lib/`:

- `services-data.ts` — the four services: features, benefits, process steps, FAQ, stats
- `case-studies-data.ts` — the six home-page case studies (`cs-1`…`cs-6`)
- `site-data.ts` — 30 portfolio items plus the headline stats
- `board-videos.ts` — the 108 clips on the `/portfolio` canvas
- `legal-data.ts` — privacy and terms sections

Case studies and portfolio items are deliberately separate datasets — they
overlap in subject but carry different titles, metrics and video URLs (e.g.
Rastah is "E-commerce Scale" as a case study and "E-commerce Explosion" in the
portfolio grid).

## Things that look odd but are intentional

- **The portfolio board's layout is deterministic.** `buildBoard()` in
  `PortfolioBoard.tsx` shuffles the clips with a fixed-seed Lehmer generator
  (seed 42) so the server and client produce the same arrangement. Swapping in
  `Math.random()` would cause a hydration mismatch.
- **Hero particle offsets are a hardcoded array**, for the same reason.
- **Videos load through a slot limiter** (`src/lib/video-slots.ts`, max 4
  concurrent). The grids autoplay many clips at once; without the cap they
  saturate the connection and none of them start promptly.
- **The brands marquee uses a plain `<img>`**, not `next/image` — every logo is
  duplicated for the seamless loop and the optimizer adds nothing for small
  transparent PNGs.

## Deliberate fixes vs the original deployment

Two bugs in the live site were corrected rather than reproduced:

- **Social links.** The footer pointed at bare `https://tiktok.com`,
  `https://linkedin.com` and `https://youtube.com`. They now point at the real
  profiles (`@tiltedneedle` on TikTok and YouTube, `company/tilted-needle` on
  LinkedIn).
- **OG image.** Metadata referenced `https://tiltedneedle.com/og-image.jpg`,
  which 404s. It's now generated at build time by
  `src/app/opengraph-image.tsx` (`next/og`, 1200×630 PNG), so `og:image` and
  `twitter:image` resolve. Don't re-add `openGraph.images` to
  `src/app/layout.tsx` — explicit metadata overrides the file convention and
  would reintroduce the broken URL.

Beyond those, the following were added or corrected. None of them change how a
single pixel renders — Tailwind's preflight resets margins/padding on every
element and makes headings inherit `font-size`/`font-weight`, so the heading-level
and `div`→`main` changes are visually inert.

- **Per-page meta descriptions.** `/services`, `/careers`, `/book-demo`,
  `/privacy` and `/terms` were inheriting the root description. The live site has
  distinct ones; they're now restored verbatim.
- **`sitemap.xml` and `robots.txt`** (`src/app/sitemap.ts`, `src/app/robots.ts`).
  Live serves neither. 11 URLs, `/api/` disallowed.
- **JSON-LD** (`src/lib/structured-data.ts`) — Organization + WebSite, injected
  from the root layout. Only facts the site itself states.
- **Accessibility.** `/portfolio` gained a `<main>` landmark, an `<h1>`, and
  `aria-label`s on its 34 previously-nameless video buttons; `/book-demo` had an
  `h1→h3` heading skip corrected to `h2`.
- **API hardening** (`src/app/api/contact/route.ts`) — per-IP rate limit
  (5/min), 16 KB body cap, per-field length caps, type checking and email
  validation. The rate limiter is in-memory, so behind multiple instances it
  should be swapped for a shared store.

- **Contrast.** Dim text was `#6e6e73` — 4.14:1 on black and 3.32:1 on cards,
  below the WCAG AA floor of 4.5:1 for small text. Now `#86868b` (4.65:1 against
  the lightest background it sits on). Two uses were deliberately **not**
  changed: the `/portfolio` lightbox caption sits on white, where `#6e6e73`
  already scores 5.07:1 and lightening it would have dropped it to 3.77:1; and
  the `--muted-dark` scrollbar token, which is non-text UI held to 3:1.
- **Canonical URLs** on every route, a branded **404** (`src/app/not-found.tsx`,
  `noindex`), a **web manifest**, and **security headers** in `next.config.ts`
  (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`,
  `Permissions-Policy`, HSTS). No CSP — the Calendly embed and remote media
  hosts would require one broad enough to be misleading.
- **Keyboard and focus.** Both lightboxes trap Tab, restore focus to the
  trigger, and expose `role="dialog"`; the portfolio lightbox previously had no
  Escape handler. The portfolio canvas was pointer-only and now supports arrow
  keys to pan, `+`/`-` to zoom and `0` to fit.

Everything else is a faithful reproduction.

## Motion and the reduced-motion preference

The `@media (prefers-reduced-motion: reduce)` block in `globals.css` only stops
**CSS** animations. Framer Motion animates through inline styles and ignores it
completely, so every animating component must call `useReducedMotion()` itself.
Four didn't, which meant a user with the preference set still got the infinite
logo marquee, two perpetual arrow bounces, the hero scroll indicator, and the
portfolio board's four-second fly-in. All are now gated.

If you add a `motion.*` element, guard it:

```tsx
const reduced = useReducedMotion();
<motion.div animate={reduced ? {} : { y: [0, 10, 0] }} … />
```

Loading spinners are the deliberate exception — they convey state, so they keep
spinning.

## Performance notes

Payload problems inherited from the original, all fixed:

- **Neither webfont was ever used.** The original loaded Inter *and* Cormorant
  Garamond, wired both up as CSS variables — and referenced neither. The actual
  stack is `-apple-system, BlinkMacSystemFont, "SF Pro Display", …`. Measured on
  the built page: of 527 text-bearing elements, **zero** resolved to Inter, and
  a width probe confirmed the rendered text does not match forced-Inter. Both
  are gone. The site now ships **no `@font-face`, no woff2, and no font
  preload** — and renders identically, because it always was rendering in
  system fonts. `h1` measures 752×174 @88px before and after.
- **The brand logos were wildly oversized.** `aston-martin.png` is 3762×1488
  (111 KB) for a slot that is at most 190×44. All nine now go through
  `next/image` with intrinsic dimensions and a `sizes` hint: **245 KB → 75 KB
  of AVIF, 69% smaller**, and declaring the dimensions stops the marquee row
  reflowing as each logo decodes.
- **The service hero shipped an unoptimised JPEG.** It is the LCP element on the
  four service pages: **21 KB → 3 KB AVIF**.

Together that is roughly **290 KB off every page load**, plus one fewer
render-blocking preload.

Because nothing is fetched from Google at build time, the build is also fully
offline-capable — `next/font/google` failed once during development with
"Error while requesting resource", which would break CI on a flaky network.

Videos are the remaining weight and are all remote (CloudFront, Pexels,
Pixabay). They stay lazy: `preload="none"`, attached only when a card nears the
viewport, and capped at four concurrent loads by `src/lib/video-slots.ts`. A
`.skeleton` shimmer sits behind each one — an unloaded `<video>` paints
nothing, so the skeleton shows through and is covered the instant the first
frame arrives, with no readiness state to track.

## Assets

`public/` holds the brand logos (`white-logo.png`, `black-logo.png`,
`logos/white/*`) and the favicon. Everything else — case study and portfolio
video, plus section imagery — is referenced remotely from CloudFront, Pexels,
Pixabay and Unsplash, matching the original. Remote image hosts are allowlisted
in `next.config.ts`.

There are no font files. Type renders in the platform UI stack declared in
`globals.css` — see the fonts note under Performance before adding one back.

## Design system

`src/app/globals.css` defines the tokens; components consume them. Two rules:

1. **Accents come from Apple's system palette only** — blue `#2997ff`, indigo
   `#5e5ce6`, green `#30d158`, orange `#ff9f0a`, pink `#ff375f`, purple
   `#af52de`, cyan `#64d2ff`, red `#ff453a`. The original mixed these with
   Flat-UI hues (`#ff6b6b`, `#00cec9`, `#a29bfe`…) on the service cards, which
   read as two unrelated brands. Those four gradients were remapped.
2. **Surfaces step in perceptible increments** — `--surface-0` through
   `--surface-5`. The original carried pairs like `#1c1c1e` / `#1d1d1f`
   (1/255 apart) and `#2c2c2e` / `#2d2d2d` that were accidental, not designed.

Distinct hex values went from 46 to 33; the remainder are the text ramp and the
separate light scale the `/portfolio` board needs.

### Section rhythm

`src/lib/design-tokens.ts` holds the vertical rhythm, because it had split in
two. `CaseStudyCards` and `PortfolioLibrary` ran `py-16 md:py-20 lg:py-24`
while `ServicesShowcase`, `ProcessTimeline` and `ContactForm` stopped at
`md:py-20` — so above 1024px three sections breathed 80px and two breathed
96px. All five now use `SECTION_Y`, and the home page reads:

```
hero        0      full-bleed, min-h-screen
marquee     64px   SECTION_Y_TIGHT — reads as a break, not a section
sections    96px   SECTION_Y — services, process, results, portfolio, contact
footer      96px
```

Inner pages run a more generous `SECTION_Y_INNER` (`py-28 md:py-40`).
`/book-demo` is deliberately outside both: its sections use asymmetric
`pt`/`pb` because hero → stats → scheduler flow as one continuous column, and
symmetric padding would double the gaps between them.

### Reveal distances

Also in `design-tokens.ts`, and split into two scales on purpose:

```
REVEAL   sm 20  md 30  lg 40    scroll reveals — whileInView
SHIFT    sm 8   md 16           UI state changes — dropdowns, panels, status
```

These are genuinely different families. A dropdown that travels as far as a
section reveal feels sluggish, so collapsing them into one scale would be
wrong. Eight ad-hoc values (6, 8, 10, 15, 16, 20, 30, 40) became five, by
sorting each usage into the family it belonged to rather than rounding to the
nearest number.

### Type scale

Sizes are authored as arbitrary px, because the design needs 15/17/19 and
Tailwind's named steps don't provide them. Mixing the two conventions is what
produced 22 sizes with 1px-apart neighbours (14/15, 16/17, 18/19, 21/22, and a
one-off 44). Consolidated to 16:

```
11   micro labels, eyebrows        24 28 32   sub-headings
12   small labels, legal           48 56 64 72 88   display
13   captions, helper text
15   body small, form controls
17   body
19   body large
20 22  lead paragraphs
```

`text-2xl`…`text-7xl` still appear, but only inside responsive ramps like
`text-4xl md:text-5xl lg:text-[64px]`. Don't reintroduce a bare `text-sm`,
`text-base` or `text-lg` — each duplicated a step the codebase already
expressed in px.

The h1 sizes do differ by page (88 on marketing pages, 72 on book-demo, 64 on
legal, 56 on service detail). That is a deliberate hierarchy, not drift.

### Elevation

Shadows are stacked — a tight contact shadow plus a wide ambient one, plus a
hairline ring so cards stay defined against near-black. `--elev-1` … `--elev-4`,
with `--elev-light-*` for the light board.

Every card lifts via Framer Motion's `whileHover`, so the CSS classes animate
**shadow only** — a CSS `transform` would fight `whileHover` for the same
property. Use `.elevate-static` / `.elevate-static-lg` on cards, `.shadow-tween`
where the shadow value comes from React state (without it the shadow snaps
instead of easing), and `.sheen` for the specular sweep on feature cards.

Motion durations in components are left as authored — they encode deliberate
choreography and stagger, and collapsing them onto a scale would flatten it.
CSS-side transitions use `--dur-fast` … `--dur-slower`.

## Styling

`src/app/globals.css` carries the design system: colour and easing tokens, 19
custom keyframes, the `.apple-*` / `.ios-*` / `.glass-*` utility classes, and a
`prefers-reduced-motion` block. Components read the easing curves as
`[0.16, 1, 0.3, 1]` inline for Framer Motion and as `var(--ease-out-expo)` in
CSS — the same curve either way.
