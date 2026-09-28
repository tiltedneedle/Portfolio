import type { ReactNode } from "react";
import { Slate } from "@/components/room/Slate";
import { ReelPosition, StudioClocks } from "@/components/room/Readouts";
import { CutLink } from "@/components/room/CutLink";
import { Backdrop } from "@/components/portal/Backdrop";
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
import { chapter, pageHref } from "@/content/chapters";
import { pillars } from "@/content/system/pillars";
import { firstMoves } from "@/content/clients/types";
import { home } from "@/content/system/home";
import { requireClient } from "@/content/clients/registry";
import { firstRoom, liveChapters, livePaths, writtenPages } from "@/lib/rooms";
import { sequence } from "@/lib/sequence";

// The home page, in running order: the slate (once), the welcome, the
// objective, what you have access to, how to use the system, the approach.
export default async function Home({ params }: { params: Promise<{ client: string }> }) {
  const { client } = await params;
  const sys = requireClient(client);
  const { identity } = sys;
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
  const access = home.access
    .filter((it) => !it.personalised || written.has(it.href))
    .map((it, i) => ({ n: pad(i + 1), title: it.title, href: it.href, text: it.text }));
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
  const shown = new Set(access.map((it) => it.href));
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

      <section id="welcome" className="relative flex min-h-[100svh] flex-col justify-between overflow-hidden bg-[color:var(--stage)] scroll-mt-0">
        <Backdrop />

        <div className="mono relative flex items-center justify-between px-6 pt-20 md:px-14">
          <p className="flex items-center gap-2">
            <span className="lamp lamp-live" aria-hidden="true" />
            <span>Live</span>
            <ReelPosition clips={clips} className="ml-2" />
          </p>
          <StudioClocks className="max-md:hidden" />
        </div>

        <div className="relative px-6 py-16 md:px-14 md:py-20">
          <ClientMark size={64} />
          <h1 className="display mt-10 max-w-[15ch] text-[clamp(56px,10vw,168px)] leading-[0.86]">
            Tilted Needle
            <br />
            <span className="md:whitespace-nowrap">
              <span className="em-serif text-[0.7em] text-[color:var(--ink-mid)]">&times;</span> {identity.name}
            </span>
          </h1>
          <p className="mono mt-8 text-[color:var(--ink)]">{home.kicker}</p>
          <p className="mt-6 max-w-[46ch] text-[19px] leading-[1.5] text-[color:var(--ink-soft)] md:text-[23px]">{home.lead(identity.name)}</p>
          {/* A client with nothing marked and nothing written has nothing to
              read out, and an empty labelled list is a promise the page does
              not keep. */}
          {readout.length > 0 && (
            <dl className="mono mt-8 flex flex-wrap gap-x-8 gap-y-2" aria-label="Where the system stands">
              {readout.map((r) => (
                <div key={r.k} className="flex gap-2">
                  <dt className="text-[color:var(--ink-mid)]">{r.k}</dt>
                  <dd className="text-[color:var(--ink)]">{r.v}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>

        <div className="mono relative flex flex-col gap-3 border-t border-[color:var(--rule)] px-6 py-6 md:flex-row md:items-center md:justify-between md:px-14 md:pb-20">
          <p className="text-[color:var(--ink-soft)]">{home.access_note}</p>
          <a href="#objective" className="slate-link text-[13px] text-[color:var(--ink)]" data-cursor="Cut">
            Start here &darr;
          </a>
        </div>
      </section>

      <section id="objective" className="scroll-mt-16 border-t border-[color:var(--rule)] bg-[color:var(--stage-2)] py-24 md:py-36">
        <div className="mx-auto grid max-w-[1600px] gap-12 px-6 md:grid-cols-[1fr_minmax(0,60ch)] md:gap-20 md:px-14">
          <div>
            <p className="mono">01 &mdash; Welcome</p>
            <p className="mono mt-10 text-[color:var(--ink-mid)]">{home.objective.label}</p>
            <p className="em-serif statement mt-4 max-w-[30ch] text-[clamp(24px,3vw,40px)] leading-[1.2] text-[color:var(--ink)]">{home.objective.text}</p>
          </div>
          <div className="flex flex-col gap-6 md:pt-12">
            {home.intro.map((p) => (
              <p key={p} className="text-[19px] leading-[1.6] text-[color:var(--ink-soft)] md:text-[21px]">
                {p}
              </p>
            ))}
          </div>
        </div>
        <div className="mx-auto mt-16 max-w-[1600px] px-6 md:mt-24 md:px-14">
          <TrainingFilm film={home.films.intro} number="Intro" />
        </div>
      </section>

      <Showreel />

      <AccessStrip items={access} counts={liveCounts} readKeys={readKeys} />

      <ThisWeek ideas={weekIdeas} scripts={weekScripts} guides={weekGuides} />

      <RecentChanges slug={identity.slug} mine={sys.changes} paths={paths} />

      <section id="how" className="scroll-mt-16 border-t border-[color:var(--rule)] bg-[color:var(--stage)] py-24 md:py-36">
        <div className="mx-auto max-w-[1600px] px-6 md:px-14">
          <p className="mono">03 &mdash; How to use the system</p>
          <h2 className="display mt-6 max-w-[12ch] text-[clamp(52px,7vw,120px)]">
            Five steps, on a <span className="em-serif">loop.</span>
          </h2>
          <div className="mt-16 md:mt-24">
            <Loop paths={paths} />
          </div>
          <div className="mt-20 md:mt-28">
            <TrainingFilm film={home.films.outro} number="Outro" />
          </div>
        </div>
      </section>

      {/* The statement and the loop stand side by side. Set one under the
          other they left two thirds of a wide screen empty, and the beats
          ran as a wall of display type with no order in it. As a running
          order they read as what they are: five steps, then go again. */}
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

          <ol className="md:pt-1">
            {home.approach.beats.map((b, i) => {
              // The last beat is not a sixth step, it is the instruction to
              // run the five again, so it carries the loop mark, not a number.
              const loops = i === home.approach.beats.length - 1;
              return (
                <li
                  key={b}
                  className="grid grid-cols-[3.5ch_1fr] items-baseline gap-x-5 border-t border-[color:var(--rule)] py-3 last:border-b last:border-[color:var(--rule)] md:gap-x-8 md:py-4"
                >
                  <span aria-hidden="true" className={"mono " + (loops ? "text-[color:var(--ink-mid)]" : "text-[color:var(--ink-mid)]")}>
                    {loops ? "↻" : String(i + 1).padStart(2, "0")}
                  </span>
                  <span className={"display leading-[0.95] " + (loops ? "text-[clamp(28px,3.8vw,52px)] text-[color:var(--ink-soft)]" : "text-[clamp(32px,4.6vw,64px)] text-[color:var(--ink)]")}>{b}</span>
                </li>
              );
            })}
          </ol>
        </div>
      </section>
    </>
  );
}
