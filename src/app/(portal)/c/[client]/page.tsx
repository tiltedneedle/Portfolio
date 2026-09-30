import { Fragment, Suspense, type CSSProperties, type ReactNode } from "react";
import { Slate } from "@/components/room/Slate";
import { ReelPosition, StudioClocks } from "@/components/room/Readouts";
import { CutLink } from "@/components/room/CutLink";
import { Backdrop } from "@/components/portal/Backdrop";
import { Lift } from "@/components/portal/HeroMotion";
import { Tilt } from "@/components/portal/Tilt";
import { CaptionTrack } from "@/components/portal/CaptionTrack";
import { HeroDust } from "@/components/portal/HeroDust";
import { RunningOrder } from "@/components/portal/Playheads";
import { ClientMark } from "@/components/portal/ClientMark";
import { AccessStrip } from "@/components/portal/AccessStrip";
import { Loop } from "@/components/portal/Loop";
import { TrainingFilm } from "@/components/portal/TrainingFilm";
import { Showreel } from "@/components/portal/Showreel";
import { ThisWeek } from "@/components/portal/ThisWeek";
import { RecentChanges } from "@/components/portal/RecentChanges";
import { FilmedCount } from "@/components/portal/FilmedMark";
import { PinnedCount } from "@/components/portal/PinIdea";
import { guides } from "@/content/system";
import { stillFor } from "@/lib/published";
import { personalised } from "@/content/system/personalised";
import { numberWord } from "@/lib/words";
import { chapter, pageHref } from "@/content/chapters";
import { pillars } from "@/content/system/pillars";
import { firstMoves } from "@/content/clients/types";
import { home } from "@/content/system/home";
import { requireClient } from "@/content/clients/registry";
import { firstRoom, liveChapters, livePaths, writtenPages } from "@/lib/rooms";
import { sequence } from "@/lib/sequence";
import { titleFit } from "@/lib/display-fit";

// The home page, in running order: the slate (once), the welcome, the
// objective, what you have access to, how to use the system, the approach.
export default async function Home({ params }: { params: Promise<{ client: string }> }) {
  const { client } = await params;
  const sys = requireClient(client);
  const { identity } = sys;
  const fit = titleFit(identity.name);
  // The personalised pages the studio has written for this client. Everything
  // else stays off the website until it exists.
  const written = writtenPages(sys);
  const paths = livePaths(liveChapters(sys));
  // The reel this client has, for the position readout in the first frame.
  const clips = sequence(sys);
  // The last line of the front page sends them into a room they actually have.
  const first = firstRoom(sys);
  const pad = (i: number) => String(i).padStart(2, "0");
  // The strip's cards, renumbered so they always read 01 upwards.
  // The frame a room opens on: the first page in it that has one. Resolved
  // here because stillFor() reads the publishing index, which is server only.
  const roomStill = (href: string) => {
    const id = href.replace("/", "");
    const g = guides.find((x) => x.chapter === id && x.poster);
    return g?.poster ? stillFor(g.poster) : undefined;
  };
  // What is actually inside a room, said on the card itself. Without this the
  // strip shows three doors and no indication that seven guides and seven
  // films sit behind the first of them.
  const roomMeta = (href: string) => {
    const inRoom = guides.filter((g) => g.chapter === href.replace("/", ""));
    if (!inRoom.length) return undefined;
    const films = inRoom.filter((g) => g.film?.youtubeId).length;
    const say = (k: number, noun: string) => numberWord(k) + " " + noun + (k === 1 ? "" : "s");
    return [say(inRoom.length, "guide"), films ? say(films, "film") : null].filter(Boolean).join(" · ");
  };
  // Which of the four a locked card opens the modal on.
  const lockAnchor = (href: string) => personalised.parts.find((x) => x.href === href)?.anchor;
  // Every part, every time. A personalised part the studio has not written
  // for this client is locked rather than hidden: the client sees the whole
  // shape of the system and one way to ask for the rest. Nothing of anyone
  // else's is on a locked card -- no counts, no headings, no ideas, not even
  // a frame -- because there is nothing of theirs yet to show.
  const access = home.access.map((it, i) => {
    const locked = it.personalised && !written.has(it.href);
    return {
      n: pad(i + 1),
      title: it.title,
      // A locked part carries no path at all, so the route into the room the
      // client has not got is not on the page -- not as a link, and not in
      // the router payload either, which a string on a prop would put there.
      href: locked ? undefined : it.href,
      text: it.text,
      list: it.list,
      after: it.after,
      locked: locked || undefined,
      anchor: locked ? lockAnchor(it.href) : undefined,
      still: it.personalised ? undefined : it.frame ? stillFor(it.frame) : roomStill(it.href),
      meta: it.personalised ? undefined : roomMeta(it.href),
    };
  });
  // What each personalised room holds so far, for the strip's cards.
  const writtenIn = (r: { sections: { body?: string[]; score?: number }[] }) => {
    const written = r.sections.filter((s) => s.body?.length);
    const scored = written.filter((s) => typeof s.score === "number");
    const avg = scored.length ? Math.round((scored.reduce((a, s) => a + (s.score ?? 0), 0) / scored.length) * 10) / 10 : null;
    return written.length + " of " + r.sections.length + " written" + (avg !== null ? " \u00B7 " + avg + "/10" : "");
  };
  const ideas = Object.values(sys.ideas).flat();
  const counts = {
    "/audit/content-diagnostic": writtenIn(sys.contentDiagnostic),
    "/audit/competitor-intelligence": writtenIn(sys.competitorIntelligence),
    "/content/ideas": (
      <>
        {ideas.filter((i) => i.text).length} of {ideas.length} written
        <PinnedCount keys={pillars.flatMap((p) => sys.ideas[p.id].map((idea, i) => (idea.text && !idea.example ? p.id + ":" + (i + 1) : "")).filter(Boolean))} prefix={" \u00B7 "} className="text-[color:var(--ink-mid)]" />
      </>
    ),
    "/content/scripts": (
      <>
        {sys.scripts.filter((s) => s.body?.length).length} of {sys.scripts.length} written
        <FilmedCount ns={sys.scripts.filter((s) => s.body?.length).map((s) => s.n)} prefix={" \u00B7 "} className="text-[color:var(--ink-mid)]" />
      </>
    ),
  };
  // A card this client has not got takes its count with it. Otherwise the
  // browser is still sent "0 of 100 written" for a room that is nowhere on
  // the site, which is the same leak the rooms themselves were fixed for.
  const shown = new Set(access.map((it) => it.href).filter(Boolean));
  const liveCounts = Object.fromEntries(Object.entries(counts).filter(([href]) => shown.has(href)));
  // The universal rooms count what has been read on this device instead.
  const readKeys = Object.fromEntries(
    (["create", "publish", "analyse"] as const).map((id) => ["/" + id, guides.filter((g) => g.chapter === id).map((g) => g.chapter + "/" + g.slug)])
  );
  // The readout under the lead: where this system stands, in one line.
  const diag = sys.contentDiagnostic.sections.filter((s) => s.body?.length);
  const scored = diag.filter((s) => typeof s.score === "number");
  const entries: ({ k: string; v: ReactNode } | null)[] = [
    scored.length ? { k: "Audit", v: Math.round((scored.reduce((a, s) => a + (s.score ?? 0), 0) / scored.length) * 10) / 10 + " / 10" } : diag.length ? { k: "Audit", v: diag.length + " of " + sys.contentDiagnostic.sections.length } : null,
    firstMoves(sys.contentDiagnostic)[0] ? { k: "First move", v: firstMoves(sys.contentDiagnostic)[0].title } : null,
    written.has("/content/ideas") ? { k: "Ideas", v: String(ideas.filter((i) => i.text).length) } : null,
    written.has("/content/scripts")
      ? {
      k: "Scripts",
      v: (
        <>
          {sys.scripts.filter((s) => s.body?.length).length}
          <FilmedCount ns={sys.scripts.filter((s) => s.body?.length).map((s) => s.n)} prefix={" · "} className="text-[color:var(--ink-mid)]" />
        </>
      ),
    }
      : null,
    sys.notes ? { k: "Notes", v: String(Object.values(sys.notes).flat().length) } : null,
  ];
  const readout = entries.filter((x): x is { k: string; v: ReactNode } => !!x);
  // The call sheet draws from what is written.
  const weekIdeas = pillars.flatMap((p) => sys.ideas[p.id].map((idea, i) => ({ pillar: p.title, n: i + 1, text: idea.text, k: p.id + ":" + (i + 1) })).filter((x) => x.text));
  const weekScripts = sys.scripts.filter((s) => s.body?.length).map((s) => ({ n: s.n, title: s.title }));
  const weekGuides = guides.map((g) => ({
    href: pageHref(g.chapter, g.slug),
    title: g.title,
    chapter: chapter(g.chapter).title,
    sections: g.sections.map((s, i) => ({ id: "s-" + String(i + 1).padStart(2, "0"), n: s.n, title: s.title })),
  }));

  return (
    <>
      <Slate />

      {/* The title block is anchored under the top row, and the bar is held
          to the foot by its own margin: nothing is centred. A slow phone
          paints the hero while it is still being parsed, and a centred title,
          growing as its lines arrived and pushed down by the bar arriving
          after it, jumped 550px up the screen -- a layout shift of 0.56 on
          every slow load. Anchored, what has been painted stays put. Where
          the title fills the screen, as it is sized to, there was little
          space to centre in anyway (5px at 1440x900). */}
      <section id="welcome" className="relative flex min-h-[100svh] flex-col overflow-hidden bg-[color:var(--stage)] scroll-mt-0">
        {/* The air of the room: a projector's beam across the hero and the
            dust drifting in it, which a hand through the beam scatters. */}
        <HeroDust />
        {/* The frame spans the screen; what is in it keeps the page's 1600px
            measure, under the nav's mark and over every section below. */}
        <div className="mono relative mx-auto flex w-full max-w-[1600px] items-center justify-between px-6 pt-[72px] md:px-14 md:pt-20">
          <p className="flex items-center gap-2">
            <span className="lamp lamp-live" aria-hidden="true" />
            <span>Live</span>
            <ReelPosition clips={clips} className="ml-2" />
          </p>
          <StudioClocks className="max-md:hidden" />
        </div>

        {/* The title card is meant to be one screen: the screen as a browser
            shows it, less its toolbars (100svh). Its spacing, the lockup and,
            on the shortest laptops, the name give way to a short one, so the
            way in ("Start here") is in the first frame in an iPhone's Safari
            (393x659), a 1366x768 laptop's Chrome (1366x657) and a 13"
            MacBook's Safari (1280x689). Fitted to whole screens (1440x900,
            1280x800) it had missed all three, by 23 to 51px. On a tall
            screen nothing changes: the name keeps 16svh above 700px, the
            lockup is 64px above 914px, and the room under the readout is the
            bar's own margin wherever there is room to spare. An iPhone SE's
            Safari (375x553) is still some 50px short, and scrolls to it. */}
        {/* On a tablet stood upright the title fills much less of the screen
            (223px spare at 768x1024, nearly 500 on a 12.9" iPad), so it is
            let down by half of what is spare, reckoned from the screen alone:
            anything reckoned from the title's own height would move it as its
            lines arrive. */}
        <div className="relative mx-auto w-full max-w-[1600px] px-6 pb-[clamp(16px,3svh,40px)] pt-[clamp(20px,5svh,64px)] md:px-14 md:pb-[clamp(20px,3svh,48px)] md:pt-[clamp(24px,5svh,80px)] md:portrait:pt-[calc(clamp(24px,5svh,80px)_+_max(0px,(100svh_-_800px)/2))]">
          <ClientMark size={64} fluid="clamp(44px, 7svh, 64px)" />
          {/* The name sets the size for itself and for the work drifting
              behind it: the band is centred on this box and its frames are
              sized in em, so it sits behind the name at every width and never
              reaches the tagline below. */}
          <div className="relative mt-[clamp(16px,4svh,40px)] text-[clamp(56px,min(10vw,16svh,32svh_-_112px),168px)]">
            {/* The band runs the full width of the screen, whatever the measure. */}
            <Backdrop className="band-in inset-x-[calc(50%_-_50vw)] top-1/2 -translate-y-1/2" />
            {/* Each line rises through its own mask (.title-line), the second
                a beat after the first: the opening titles. */}
            <Lift>
            {/* A size container, so the client's line can fit itself to the
                title's measure (.title-fit). */}
            <h1 className="display footage-type @container relative max-w-[15ch] leading-[0.86]">
              <span className="title-line">
                {/* TILTED's letters are needles: they settle as the line
                    lands, then lean toward the pointer (Tilt.tsx). */}
                <span style={{ "--i": 0 } as CSSProperties}>
                  <Tilt text="Tilted" /> Needle
                </span>
              </span>
              {/* The client's line is fitted, not wrapped: a name that fits is
                  set full size, a longer one a little smaller until it does,
                  and only past the floor does it wrap. Held to one line it had
                  run past the mask on a wide screen; wrapped, a short last word
                  dropped onto a line alone. */}
              <span className="title-line">
                <span className="title-fit" style={{ "--i": 1, "--line-em": fit.line, "--word-em": fit.word } as CSSProperties}>
                  {/* --ink-soft, not --ink-mid: the × sits over the drift at
                      full strength, and measured against real frames --ink-mid
                      fell to 1.96:1 on a phone. */}
                  <span className="em-serif title-x text-[0.7em] text-[color:var(--ink-soft)]">&times;</span> {identity.name}
                </span>
              </span>
            </h1>
            </Lift>
          </div>
          {/* The brief's tagline, as the brief sets it: a heading under the
              name, VIRAL in red. The system keeps --tally for state; the
              client's own document asks for the red, and the client wins. */}
          {/* Word by word, each pulled into focus; the brief's red word
              lands in ink and then catches, like a tally lamp. */}
          {/* On a phone it is one line, set a little smaller on a narrow one
              rather than broken: the line is 14.33em long in this face, and
              the measure is the screen less 48px. At 375px its last two
              words had dropped to a second line, and the card grew 24px. */}
          <p className="display footage-type mt-[clamp(16px,3.5svh,32px)] text-[length:min(24px,calc((100vw_-_48px)/14.5))] leading-[1] text-[color:var(--ink)] md:text-[clamp(24px,min(2.8vw,4.6svh),44px)]">
            {home.kicker.split(" ").map((w, i) => (
              <Fragment key={i}>
                {i > 0 && " "}
                <span className={w === home.accent ? "burn burn-tally text-[color:var(--tally)]" : "burn"} style={{ "--i": i } as CSSProperties}>
                  {w}
                </span>
              </Fragment>
            ))}
          </p>
          <p className="footage-type title-lead mt-[clamp(12px,2.6svh,24px)] max-w-[48ch] text-[19px] leading-[1.5] text-[color:var(--ink-soft)] md:text-[22px]">{home.lead(identity.name)}</p>
          {/* A client with nothing marked and nothing written has nothing to
              read out, and an empty labelled list is a promise the page does
              not keep. */}
          {readout.length > 0 && (
            <dl className="mono mt-[clamp(16px,3.5svh,32px)] flex flex-wrap gap-x-8 gap-y-2" aria-label="Where the system stands">
              {readout.map((r) => (
                <div key={r.k} className="flex gap-2">
                  <dt className="text-[color:var(--ink-mid)]">{r.k}</dt>
                  <dd className="text-[color:var(--ink)]">{r.v}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>

        {/* The rule runs the width of the screen; the line on it keeps the
            measure. The floating Contents button stands down while it is on
            screen (data-hero-bar, Palette.tsx): it sat on the note. */}
        {/* On a phone the note and the way in share the bar's first line, as
            they do on a wide screen: stacked, "Start here" came under two
            lines of note, 45px further down the screen. */}
        <div data-hero-bar="" className="relative mt-auto border-t border-[color:var(--rule)]">
          <div className="mono mx-auto flex max-w-[1600px] items-baseline justify-between gap-6 px-6 py-6 md:items-center md:px-14 md:pb-[clamp(24px,5.5svh,80px)]">
            <p className="min-w-0 text-[color:var(--ink-soft)]">{home.access_note}</p>
            <a href="#objective" className="slate-link shrink-0 text-[13px] text-[color:var(--ink)]" data-cursor="Cut">
              Start here &darr;
            </a>
          </div>
        </div>
      </section>

      {/* Below the hero, each section hydrates on its own, after the hero
          and at low priority: React leaves a server-rendered Suspense
          boundary for later and works through it in slices it can
          interrupt. Hydrated in one piece, the page held a slow phone's main
          thread for two seconds. Nothing here waits on data. The sections
          are sent after the hero, in order, and set in place as the page
          is read; the hero fills the first screen, so none of them is ever
          seen arriving. Without scripts, globals.css shows them where they
          were sent (scripting: none). */}
      <Suspense>
        <section id="objective" className="scroll-mt-16 border-t border-[color:var(--rule)] bg-[color:var(--stage-2)] py-24 md:py-36">
          {/* The brief's order, read left to right: what the portal gives you,
              then the objective. (It used to open on the objective, in words
              the brief never used.) */}
          <div className="mx-auto grid max-w-[1600px] gap-12 px-6 md:grid-cols-2 md:gap-20 md:px-14">
            <div>
              <p className="mono">01 &mdash; Welcome</p>
              <div className="mt-10 flex flex-col gap-6">
                {home.intro.map((p) => (
                  <p key={p} className="max-w-[40ch] text-[20px] leading-[1.55] text-[color:var(--ink-soft)] md:text-[24px] [text-wrap:pretty]">
                    {p}
                  </p>
                ))}
              </div>
            </div>
            <div className="md:border-l md:border-[color:var(--rule)] md:pl-20 md:pt-[calc(1.5rem+2.5rem)]">
              <p className="mono text-[color:var(--ink-mid)]">{home.objective.label}</p>
              {/* Read as a caption track: each word lights as the scroll
                  reaches it, a tally bar under the word being read. */}
              {/* The measure goes on the line, where the type is: a ch on the
                  wrapper is a body-text ch, and at that width the statement
                  broke into eleven ragged lines of two words. */}
              <CaptionTrack
                lines={[home.objective.text]}
                className="mt-4"
                lineClassName="em-serif statement max-w-[30ch] text-[clamp(26px,2.6vw,40px)] leading-[1.2] text-[color:var(--ink)]"
              />
            </div>
          </div>
          <div className="mx-auto mt-16 max-w-[1600px] px-6 md:mt-24 md:px-14">
            <TrainingFilm film={home.films.intro} number="Intro" dock="playing" />
          </div>
        </section>
      </Suspense>

      <Suspense>
        <Showreel />
      </Suspense>

      <Suspense>
        <AccessStrip items={access} counts={liveCounts} readKeys={readKeys} />
      </Suspense>

      <Suspense>
        <ThisWeek ideas={weekIdeas} scripts={weekScripts} guides={weekGuides} />
      </Suspense>

      <Suspense>
        <RecentChanges slug={identity.slug} mine={sys.changes} paths={paths} />
      </Suspense>

      <Suspense>
        <section id="how" className="scroll-mt-16 border-t border-[color:var(--rule)] bg-[color:var(--stage)] py-24 md:py-36">
          <div className="mx-auto max-w-[1600px] px-6 md:px-14">
            <p className="mono">03 &mdash; Five steps, on a loop</p>
            {/* The brief's heading. */}
            <h2 className="display mt-6 max-w-[14ch] text-[clamp(52px,7vw,120px)]">
              How to use the <span className="em-serif">system.</span>
            </h2>
            <div className="mt-16 md:mt-24">
              <Loop paths={paths} />
            </div>
            <div className="mt-20 md:mt-28">
              <TrainingFilm film={home.films.outro} number="Outro" dock="playing" />
            </div>
          </div>
        </section>
      </Suspense>

      {/* The statement and the loop stand side by side. Set one under the
          other they left two thirds of a wide screen empty, and the beats
          ran as a wall of display type with no order in it. As a running
          order they read as what they are: five steps, then go again. */}
      <Suspense>
        <section className="border-t border-[color:var(--rule)] bg-black py-20 md:py-28">
          {/* A narrower measure than the rest of the page on purpose. This block
              is a statement and a running order, not a data surface: stretched
              to 1600px the two halves sat on opposite edges of a wide screen
              with a void between them. Composed at 1200 they read as one
              object, and the margins either side are even. */}
          <div className="mx-auto grid max-w-[1200px] gap-x-14 gap-y-12 px-6 md:grid-cols-[minmax(0,34ch)_minmax(0,1fr)] md:items-stretch md:px-14">
            <div className="flex flex-col">
              <p className="mono">{home.approach.title}</p>
              <div className="mt-8 flex flex-col gap-6">
                {home.approach.lines.map((l) => (
                  <p key={l} className="em-serif statement text-[clamp(26px,2.6vw,40px)] leading-[1.2] text-[color:var(--ink)]">
                    {l}
                  </p>
                ))}
              </div>
              {/* mt-auto: the way in sits on the foot of the running order
                  beside it, rather than leaving a band of nothing under the
                  statement. */}
              <div className="mt-10 border-t border-[color:var(--rule)] pt-6 md:mt-auto">
                <CutLink href={first.href} className="slate-link text-[13px]" data-cursor="Cut">
                  Begin with {home.begin[first.id]} &#8599;
                </CutLink>
              </div>
            </div>

            {/* The running order plays: a playhead steps down the beats and
                lights each in turn (Playheads.tsx). At rest, all of them lit. */}
            <RunningOrder beats={home.approach.beats} />
          </div>
        </section>
      </Suspense>
    </>
  );
}
