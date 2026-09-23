import { CutLink } from "@/components/room/CutLink";
import { chapter, neighbours, pageHref, pageNumber } from "@/content/chapters";
import type { ChapterId } from "@/content/types";

/**
 * The foot of every page: the page before, quietly, and the page after as a
 * match cut, across chapter boundaries.
 */
export function NextCut({ chapter: id, slug }: { chapter: ChapterId; slug: string }) {
  const { prev, next } = neighbours(id, slug);
  const ch = chapter(id);
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
          <CutLink href={pageHref(next.chapter.id, next.page.slug)} className="group block" data-cursor="Cut">
            <p className="mono">
              Next <span className="text-[color:var(--ink-mid)]">/</span> {next.chapter.n} &mdash; {next.chapter.title}
            </p>
            <p className="display mt-3 text-[clamp(36px,5.5vw,88px)] transition-colors duration-300 group-hover:text-white">
              {next.page.title} <span aria-hidden="true" className="text-[color:var(--ink-mid)] transition-colors group-hover:text-[color:var(--ink)]">&#8599;</span>
            </p>
            <p className="mono mt-2">{pageNumber(next.chapter.id, next.page.slug)}</p>
          </CutLink>
        )}
      </div>
    </nav>
  );
}
