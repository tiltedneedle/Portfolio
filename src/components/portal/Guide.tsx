import type { Guide as GuideT } from "@/content/types";
import type { GuideNote } from "@/content/clients/types";
import { ForYou } from "@/components/portal/ForYou";
import { Resume } from "@/components/portal/Resume";
import { Anchor } from "@/components/portal/Anchor";
import { chapter, pageNumber } from "@/content/chapters";
import { readingMinutes } from "@/content/system";
import { Blocks } from "@/components/portal/blocks";
import { GuideRail } from "@/components/portal/GuideRail";
import { TrainingFilm } from "@/components/portal/TrainingFilm";
import { Still } from "@/components/portal/Still";
import { stillFor } from "@/lib/published";
import { NextCut } from "@/components/portal/NextCut";
import { Rich } from "@/components/portal/Rich";
import { ReadingProgress } from "@/components/portal/ReadingProgress";
import { ReadToggle } from "@/components/portal/ReadToggle";
import { Reveal } from "@/components/portal/Reveal";
import { Focus, Rise, delay } from "@/components/portal/Scene";
import { CaptionTrack } from "@/components/portal/CaptionTrack";

/**
 * A guide page: the slate (chapter, number, title, kicker, intro), the
 * training film, then the numbered sections beside a rail that follows the
 * reader down the page, and the rule the page closes on.
 */
export function Guide({ guide, notes = [], who = "", client }: { guide: GuideT; notes?: GuideNote[]; who?: string; client?: string }) {
  const introNotes = notes.filter((n) => !n.at);
  const notesAt = (i: number) => notes.filter((n) => n.at === i + 1);
  const ch = chapter(guide.chapter);
  const n = pageNumber(guide.chapter, guide.slug);
  const numbered = guide.sections.filter((s) => s.n).length;
  const minutes = readingMinutes(guide);
  const sectionId = (i: number) => "s-" + String(i + 1).padStart(2, "0");
  const railItems = guide.sections.map((s, i) => ({ id: sectionId(i), n: s.n, title: s.title }));

  return (
    <article className="bg-[color:var(--stage)]">
      <ReadingProgress />
      <header className="relative mx-auto max-w-[1600px] px-6 pb-14 pt-28 md:px-14 md:pt-36">
        {guide.poster && (
          // The page opens on its own frame: the still from its film, held to
          // the right, defocused and faded into the stage. Soft on purpose:
          // these stills carry burnt-in captions, and a sharp one reads as
          // stray words behind the headline rather than as a frame.
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[420px] overflow-hidden md:h-[520px]">
            {/* The width lives on a wrapper, not on the image: `fill` writes its own
                inline width and would take the poster full-bleed on desktop. Transform,
                opacity and filter are untouched by it, so they stay put. */}
            <div className="scene-frame absolute right-0 top-0 h-full w-full md:w-[58%]">
              <Still src={stillFor(guide.poster)} sizes="(min-width:768px) 58vw, 100vw" className="scale-105 object-cover opacity-[0.16] blur-[3px]" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-[color:var(--stage)] via-[rgba(11,11,12,0.82)] to-[rgba(11,11,12,0.45)]" />
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-[color:var(--stage)]" />
          </div>
        )}
        <p className="mono scene-slate relative">
          {ch.n} &mdash; {ch.title} <span className="text-[color:var(--ink-mid)]">/</span> {n}
        </p>
        <h1 className="display relative mt-6 max-w-[12ch] text-[clamp(52px,8.5vw,140px)]">
          <Rise text={guide.title} />
        </h1>
        <p className="em-serif statement relative mt-6 max-w-[34ch] text-[clamp(22px,2.6vw,34px)] leading-[1.25] text-[color:var(--ink-soft)]">
          <Focus text={guide.kicker} />
        </p>

        <div className="relative mt-12 grid gap-10 md:grid-cols-[1fr_minmax(0,60ch)] md:gap-16">
          <div className="scene-up md:pt-2" style={delay(0.75)}>
            <p className="mono flex flex-col gap-2">
              {numbered > 0 && <span>{numbered} principles</span>}
              <span>{minutes} min read</span>
              {guide.film && <span>Training film</span>}
            </p>
            {guide.example && (
              // Nine of the thirteen guides are built on one client's real work.
              // Said once, here, a page reads as a studio showing its working;
              // unsaid, it reads as a template nobody finished generalising.
              <div className="mt-10 border-t border-[color:var(--rule)] pt-3">
                <p className="mono text-[color:var(--ink-mid)]">Examples from</p>
                <p className="mt-1 text-[15px] leading-snug text-[color:var(--ink)]">{guide.example.client}</p>
                <p className="mono mt-1 text-[color:var(--ink-mid)]">@{guide.example.handle}</p>
              </div>
            )}
            {railItems.length > 1 && (
              // The shape of the page before you commit to it. The rail in the
              // margin does this once you are reading; this is the contents.
              <nav aria-labelledby="in-this-guide" className="mt-10 hidden border-t border-[color:var(--rule)] md:block">
                {/* Labelled BY the visible heading, not with a copy of it. */}
                <p id="in-this-guide" className="mono py-3 text-[color:var(--ink-mid)]">
                  In this guide
                </p>
                <ol className="flex flex-col border-t border-[color:var(--rule)]">
                  {railItems.map((it) => (
                    <li key={it.id} className="border-b border-[color:var(--rule)] last:border-b-0">
                      <a href={"#" + it.id} className="flex items-baseline gap-3 py-2 text-[15px] leading-snug text-[color:var(--ink-soft)] transition-colors hover:text-[color:var(--ink)]">
                        <span className="mono w-[3ch] shrink-0 text-[color:var(--ink-mid)]">{it.n ?? "\u2014"}</span>
                        <span className="min-w-0 flex-1">{it.title}</span>
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            )}
          </div>
          <div className="scene-up flex flex-col gap-5" style={delay(0.62)}>
            {guide.intro.map((p) => (
              <p key={p} className="text-[19px] leading-[1.6] text-[color:var(--ink)] md:text-[21px]">
                <Rich text={p} />
              </p>
            ))}
          </div>
        </div>

        <Resume k={guide.chapter + "/" + guide.slug} items={railItems} />

        {introNotes.length > 0 && (
          <div className="mt-12 md:ml-[calc(100%-60ch)] md:max-w-[60ch]">
            <ForYou who={who} notes={introNotes} />
          </div>
        )}

        {guide.opener && (
          // Comparisons and clip rails need the full width; text stays in the reading column.
          <div className={"mt-12 " + (guide.opener.some((b) => b.kind === "profile" || b.kind === "clips") ? "md:mt-20" : "md:ml-[calc(100%-60ch)] md:max-w-[60ch]")}>
            <Blocks blocks={guide.opener} />
          </div>
        )}
      </header>

      {guide.film && (
        <div className="mx-auto max-w-[1600px] px-6 md:px-14">
          <TrainingFilm film={guide.film} number={n} />
        </div>
      )}

      <div className="mx-auto max-w-[1600px] px-6 pb-24 pt-16 md:px-14 md:pt-24 lg:grid lg:grid-cols-[220px_1fr] lg:gap-x-16">
        <GuideRail items={railItems} minutes={minutes} k={guide.chapter + "/" + guide.slug} />

        <div>
          {guide.sections.map((s, i) => (
            <Reveal
              as="section"
              key={s.title}
              id={sectionId(i)}
              className="cue group/section grid scroll-mt-28 gap-x-8 border-t border-[color:var(--rule)] py-12 md:grid-cols-[96px_1fr] md:py-16"
            >
              <div className="mb-4 md:mb-0">
                {s.n ? (
                  <>
                    <span className="numeral cue-num text-[56px] md:text-[72px]" data-n={s.n} aria-hidden="true" />
                    <span className="sr-only">Section {s.n}</span>
                  </>
                ) : (
                  <span aria-hidden="true" className="mono text-[color:var(--ink-mid)]">
                    &mdash;
                  </span>
                )}
              </div>
              <div className="min-w-0">
                <div className="mb-8 flex flex-wrap items-baseline gap-x-3">
                  <h2 className="display max-w-[16ch] text-[clamp(30px,3.6vw,52px)]">
                    <Rise text={s.title} cue />
                  </h2>
                  <Anchor id={sectionId(i)} label={s.title} />
                </div>
                <Blocks blocks={s.blocks} />
                {notesAt(i).length > 0 && (
                  <div className="mt-9">
                    <ForYou who={who} notes={notesAt(i)} under={s.title} />
                  </div>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      <Reveal as="section" id="rule" className="relative scroll-mt-28 border-t border-[color:var(--rule)] bg-black py-24 md:py-32">
        {/* One lamp over the statement, struck as the band comes on. */}
        <div aria-hidden="true" className="rule-wash pointer-events-none absolute inset-0" />
        <div className="relative mx-auto max-w-[1600px] px-6 md:px-14">
          <p className="mono flex items-center gap-2.5">
            <span aria-hidden="true" className="lamp rule-lamp" />
            The rule
          </p>
          <div className="mt-8 md:ml-[96px] md:max-w-[52ch]">
            <RuleBlocks blocks={guide.rule.filter((r) => r.kind !== "figure")} />
          </div>
          {/* A picture the brief sets after its rule gets a measure of its
              own. The statement column is 52 characters wide, about 440px,
              and at that size the labels inside an infographic (the bad and
              good profile after Discoverability's rule) come out at 5px. */}
          {guide.rule.some((r) => r.kind === "figure") && (
            // 975px: the brief's image is 975 wide, and a raster set wider than
            // itself goes soft exactly where its small labels are.
            <div className="mt-16 md:ml-[96px] md:max-w-[975px]">
              <Blocks blocks={guide.rule.filter((r) => r.kind === "figure")} />
            </div>
          )}
        </div>
      </Reveal>

      <ReadToggle k={guide.chapter + "/" + guide.slug} ask="Got the rule?" />
      <NextCut chapter={guide.chapter} slug={guide.slug} client={client} />
    </article>
  );
}

/**
 * The rule is set larger than the body: paragraphs become statements, and
 * the statements are read as a caption track (CaptionTrack.tsx) -- the
 * scroll plays them, one tally line following the read through every
 * paragraph in turn. Anything else the rule holds (a swap, a figure) stands
 * between the runs of statements as it always did.
 */
function RuleBlocks({ blocks }: { blocks: GuideT["rule"] }) {
  // Consecutive paragraphs read as one track.
  const runs: (string[] | GuideT["rule"][number])[] = [];
  for (const b of blocks) {
    const last = runs[runs.length - 1];
    if (b.kind === "p") {
      if (Array.isArray(last)) last.push(b.text);
      else runs.push([b.text]);
    } else runs.push(b);
  }
  return (
    <div className="flex flex-col gap-8">
      {runs.map((r, i) =>
        Array.isArray(r) ? (
          <CaptionTrack
            key={i}
            lines={r}
            className="flex flex-col gap-8"
            lineClassName="em-serif statement text-[clamp(26px,3.4vw,44px)] leading-[1.2] text-[color:var(--ink)]"
          />
        ) : (
          <Blocks key={i} blocks={[r]} />
        )
      )}
    </div>
  );
}
