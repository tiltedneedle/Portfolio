import type { Guide as GuideT } from "@/content/types";
import type { GuideNote } from "@/content/clients/types";
import { ForYou } from "@/components/portal/ForYou";
import { chapter, pageNumber } from "@/content/chapters";
import { readingMinutes } from "@/content/system";
import { Blocks } from "@/components/portal/blocks";
import { GuideRail } from "@/components/portal/GuideRail";
import { TrainingFilm } from "@/components/portal/TrainingFilm";
import { NextCut } from "@/components/portal/NextCut";
import { Rich } from "@/components/portal/Rich";
import { ReadingProgress } from "@/components/portal/ReadingProgress";
import { ReadToggle } from "@/components/portal/ReadToggle";

/**
 * A guide page: the slate (chapter, number, title, kicker, intro), the
 * training film, then the numbered sections beside a rail that follows the
 * reader down the page, and the rule the page closes on.
 */
export function Guide({ guide, notes = [], who = "" }: { guide: GuideT; notes?: GuideNote[]; who?: string }) {
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
      <header className="mx-auto max-w-[1600px] px-6 pb-14 pt-28 md:px-14 md:pt-36">
        <p className="mono">
          {ch.n} &mdash; {ch.title} <span className="text-[color:var(--ink-mid)]">/</span> {n}
        </p>
        <h1 className="display mt-6 max-w-[12ch] text-[clamp(52px,8.5vw,140px)]">{guide.title}</h1>
        <p className="em-serif mt-6 max-w-[34ch] text-[clamp(22px,2.6vw,34px)] leading-[1.25] text-[color:var(--ink-soft)]">{guide.kicker}</p>

        <div className="mt-12 grid gap-10 md:grid-cols-[1fr_minmax(0,60ch)] md:gap-16">
          <div className="mono flex flex-col gap-2 md:pt-2">
            {numbered > 0 && <span>{numbered} principles</span>}
            <span>{minutes} min read</span>
            {guide.film && <span>Training film</span>}
          </div>
          <div className="flex flex-col gap-5">
            {guide.intro.map((p) => (
              <p key={p} className="text-[19px] leading-[1.6] text-[color:var(--ink)] md:text-[21px]">
                <Rich text={p} />
              </p>
            ))}
          </div>
        </div>

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
        <GuideRail items={railItems} minutes={minutes} />

        <div>
          {guide.sections.map((s, i) => (
            <section
              key={s.title}
              id={sectionId(i)}
              className="grid scroll-mt-28 gap-x-8 border-t border-[color:var(--rule)] py-12 md:grid-cols-[96px_1fr] md:py-16"
            >
              <div className="mb-4 md:mb-0">
                {s.n ? (
                  <span className="numeral text-[56px] md:text-[72px]">{s.n}</span>
                ) : (
                  <span aria-hidden="true" className="mono text-[color:var(--ink-mid)]">
                    &mdash;
                  </span>
                )}
              </div>
              <div className="min-w-0">
                <h2 className="display mb-8 max-w-[16ch] text-[clamp(30px,3.6vw,52px)]">{s.title}</h2>
                <Blocks blocks={s.blocks} />
                {notesAt(i).length > 0 && (
                  <div className="mt-9">
                    <ForYou who={who} notes={notesAt(i)} />
                  </div>
                )}
              </div>
            </section>
          ))}
        </div>
      </div>

      <section className="border-t border-[color:var(--rule)] bg-black py-24 md:py-32">
        <div className="mx-auto max-w-[1600px] px-6 md:px-14">
          <p className="mono">The rule</p>
          <div className="mt-8 md:ml-[96px] md:max-w-[52ch]">
            <RuleBlocks guide={guide} />
          </div>
        </div>
      </section>

      <ReadToggle k={guide.chapter + "/" + guide.slug} />
      <NextCut chapter={guide.chapter} slug={guide.slug} />
    </article>
  );
}

/** The rule is set larger than the body: paragraphs become statements. */
function RuleBlocks({ guide }: { guide: GuideT }) {
  return (
    <div className="flex flex-col gap-8">
      {guide.rule.map((b, i) =>
        b.kind === "p" ? (
          <p key={i} className="em-serif text-[clamp(26px,3.4vw,44px)] leading-[1.2] text-[color:var(--ink)]">
            <Rich text={b.text} />
          </p>
        ) : (
          <Blocks key={i} blocks={[b]} />
        )
      )}
    </div>
  );
}
