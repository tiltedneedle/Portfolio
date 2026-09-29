import { CutLink } from "@/components/room/CutLink";
import { chapter, neighbours, pageHref, pageNumber } from "@/content/chapters";
import type { ChapterId } from "@/content/types";
import { requireClient } from "@/content/clients/registry";
import { findGuide } from "@/content/system";
import { liveChapters } from "@/lib/rooms";
import { stillFor } from "@/lib/published";
import { Still } from "@/components/portal/Still";
import { Reveal } from "@/components/portal/Reveal";
import { Rise } from "@/components/portal/Scene";

/**
 * The foot of every page: the page before, quietly, and the page after as a
 * match cut, across chapter boundaries. Given the client, it steps over the
 * personalised rooms they do not have yet.
 *
 * The page after is shown as the scene it is: its title rises in as the
 * foot comes on, and where the page has a frame of its own it sits in a
 * suite monitor beside the title, running when you reach for it. Hovering
 * runs a playhead along the foot of the link, toward the cut.
 */
export function NextCut({ chapter: id, slug, client }: { chapter: ChapterId; slug: string; client?: string }) {
  const { prev, next } = neighbours(id, slug, client ? liveChapters(requireClient(client)) : undefined);
  const ch = chapter(id);
  // The published index is server-only, so the next page's frame is found here.
  const poster = next ? findGuide(next.chapter.id, next.page.slug)?.poster : undefined;
  const still = poster ? stillFor(poster) : undefined;
  return (
    <nav className="border-t border-[color:var(--rule)] bg-[color:var(--stage-2)]" aria-label="Next and previous">
      <div className="mx-auto grid max-w-[1600px] gap-8 px-6 py-14 md:grid-cols-[1fr_2fr] md:px-14 md:py-20">
        <div className="flex flex-col gap-6">
          {prev ? (
            <CutLink href={pageHref(prev.chapter.id, prev.page.slug)} className="group block" data-cursor="Cut">
              <p className="mono">&larr; Previous</p>
              <p className="mt-2 text-[17px] text-[color:var(--ink-soft)] transition-colors group-hover:text-[color:var(--ink)]">
                <span className="mono mr-2 text-[color:var(--ink-mid)]">{pageNumber(prev.chapter.id, prev.page.slug)}</span>
                {prev.page.title}
              </p>
            </CutLink>
          ) : (
            <span />
          )}
          <CutLink href={ch.href} className="slate-link" data-cursor="Cut">
            All of {ch.title.toLowerCase()}{" "}&uarr;
          </CutLink>
        </div>
        {next && (
          <Reveal>
            <CutLink href={pageHref(next.chapter.id, next.page.slug)} className="group relative flex items-end justify-between gap-8 pb-4" data-cursor="Cut">
              <div className="min-w-0">
                <p className="mono">
                  Next <span className="text-[color:var(--ink-mid)]">/</span> {next.chapter.n} &mdash; {next.chapter.title}
                </p>
                <p className="display display-light mt-3 text-[clamp(48px,5.5vw,88px)] transition-colors duration-300 group-hover:text-white">
                  {/* The arrow is held to the last word by a no-break space:
                      alone on a line of its own it read as a stray glyph. */}
                  <span className="cut-step">
                    <Rise text={next.page.title} cue />
                    &nbsp;
                    <span aria-hidden="true" className="cut-arrow text-[color:var(--ink-mid)] group-hover:text-[color:var(--ink)]">
                      &#8599;
                    </span>
                  </span>
                </p>
                <p className="mono mt-2">{pageNumber(next.chapter.id, next.page.slug)}</p>
              </div>
              {still && (
                <div aria-hidden="true" className="well hidden w-[112px] shrink-0 border border-[color:var(--rule-strong)] md:block lg:w-[136px]">
                  <span className="absolute inset-0 opacity-60 transition-opacity duration-500 group-hover:opacity-100">
                    <Still src={still} sizes="136px" className="first3-push object-cover" />
                  </span>
                  <span className="scan pointer-events-none absolute inset-0" />
                </div>
              )}
              <span aria-hidden="true" className="cut-sweep" />
            </CutLink>
          </Reveal>
        )}
      </div>
    </nav>
  );
}
