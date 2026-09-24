import { Slate } from "@/components/room/Slate";
import { RunningTimecode, StudioClocks } from "@/components/room/Readouts";
import { CutLink } from "@/components/room/CutLink";
import { Backdrop } from "@/components/portal/Backdrop";
import { ClientMark } from "@/components/portal/ClientMark";
import { AccessStrip } from "@/components/portal/AccessStrip";
import { Loop } from "@/components/portal/Loop";
import { TrainingFilm } from "@/components/portal/TrainingFilm";
import { ThisWeek } from "@/components/portal/ThisWeek";
import { guides } from "@/content/system";
import { chapter, pageHref } from "@/content/chapters";
import { pillars } from "@/content/system/pillars";
import { home } from "@/content/system/home";
import { requireClient } from "@/content/clients/registry";

// The home page, in running order: the slate (once), the welcome, the
// objective, what you have access to, how to use the system, the approach.
export default async function Home({ params }: { params: Promise<{ client: string }> }) {
  const { client } = await params;
  const sys = requireClient(client);
  const { identity } = sys;
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
    "/content/ideas": ideas.filter((i) => i.text).length + " of " + ideas.length + " written",
    "/content/scripts": sys.scripts.filter((s) => s.body?.length).length + " of " + sys.scripts.length + " written",
  };
  // The universal rooms count what has been read on this device instead.
  const readKeys = Object.fromEntries(
    (["create", "publish", "analyse"] as const).map((id) => ["/" + id, guides.filter((g) => g.chapter === id).map((g) => g.chapter + "/" + g.slug)])
  );
  // The call sheet draws from what is written.
  const weekIdeas = pillars.flatMap((p) => sys.ideas[p.id].map((idea, i) => ({ pillar: p.title, n: i + 1, text: idea.text })).filter((x) => x.text));
  const weekScripts = sys.scripts.filter((s) => s.body?.length).map((s) => ({ n: s.n, title: s.title }));
  const weekGuides = guides.map((g) => ({ href: pageHref(g.chapter, g.slug), title: g.title, chapter: chapter(g.chapter).title }));

  return (
    <>
      <Slate />

      <section id="welcome" className="relative flex min-h-[100svh] flex-col justify-between overflow-hidden bg-[color:var(--stage)] scroll-mt-0">
        <Backdrop />

        <div className="mono relative flex items-center justify-between px-6 pt-20 md:px-14">
          <p className="flex items-center gap-2">
            <span className="lamp" aria-hidden="true" />
            <span>Live</span>
            <RunningTimecode className="ml-2 text-[color:var(--ink-soft)]" />
          </p>
          <StudioClocks className="max-md:hidden" />
        </div>

        <div className="relative px-6 py-16 md:px-14 md:py-20">
          <ClientMark size={64} />
          <h1 className="display mt-10 max-w-[15ch] text-[clamp(56px,10vw,168px)] leading-[0.86]">
            Tilted Needle
            <br />
            <span className="whitespace-nowrap">
              <span className="em-serif text-[0.7em] text-[color:var(--ink-mid)]">&times;</span> {identity.name}
            </span>
          </h1>
          <p className="mono mt-8 text-[color:var(--ink)]">{home.kicker}</p>
          <p className="mt-6 max-w-[46ch] text-[19px] leading-[1.5] text-[color:var(--ink-soft)] md:text-[23px]">{home.lead(identity.name)}</p>
        </div>

        <div className="mono relative flex flex-col gap-3 border-t border-[color:var(--rule)] px-6 py-6 md:flex-row md:items-center md:justify-between md:px-14">
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
            <p className="em-serif mt-4 max-w-[30ch] text-[clamp(24px,3vw,40px)] leading-[1.2] text-[color:var(--ink)]">{home.objective.text}</p>
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

      <AccessStrip counts={counts} readKeys={readKeys} />

      <ThisWeek ideas={weekIdeas} scripts={weekScripts} guides={weekGuides} />

      <section id="how" className="scroll-mt-16 border-t border-[color:var(--rule)] bg-[color:var(--stage)] py-24 md:py-36">
        <div className="mx-auto max-w-[1600px] px-6 md:px-14">
          <p className="mono">03 &mdash; How to use the system</p>
          <h2 className="display mt-6 max-w-[12ch] text-[clamp(52px,7vw,120px)]">
            Five steps, on a <span className="em-serif">loop.</span>
          </h2>
          <div className="mt-16 md:mt-24">
            <Loop />
          </div>
          <div className="mt-20 md:mt-28">
            <TrainingFilm film={home.films.outro} number="Outro" />
          </div>
        </div>
      </section>

      <section className="border-t border-[color:var(--rule)] bg-black py-24 md:py-36">
        <div className="mx-auto max-w-[1600px] px-6 md:px-14">
          <p className="mono">{home.approach.title}</p>
          <div className="mt-10 flex max-w-[40ch] flex-col gap-6">
            {home.approach.lines.map((l) => (
              <p key={l} className="em-serif text-[clamp(26px,3.4vw,44px)] leading-[1.2] text-[color:var(--ink)]">
                {l}
              </p>
            ))}
          </div>
          <ul className="mt-16 flex flex-wrap items-baseline gap-x-6 gap-y-3 md:mt-24">
            {home.approach.beats.map((b, i) => (
              <li key={b} className="flex items-baseline gap-6">
                <span className="display text-[clamp(32px,5vw,88px)] leading-none text-[color:var(--ink)]">{b}</span>
                {i < home.approach.beats.length - 1 && <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[color:var(--ink-faint)]" />}
              </li>
            ))}
          </ul>
          <div className="mt-16 border-t border-[color:var(--rule)] pt-6">
            <CutLink href="/audit" className="slate-link text-[13px]" data-cursor="Cut">
              Begin with your audit &#8599;
            </CutLink>
          </div>
        </div>
      </section>
    </>
  );
}
