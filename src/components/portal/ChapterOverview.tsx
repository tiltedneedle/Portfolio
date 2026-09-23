import type { ReactNode } from "react";
import { CutLink } from "@/components/room/CutLink";
import { chapter, pageHref, pageNumber } from "@/content/chapters";
import type { ChapterId } from "@/content/types";
import { shortName, type PublicIdentity } from "@/content/clients/types";

export type OverviewRow = {
  slug: string;
  title: string;
  line: string;
  meta?: string;
};

/**
 * A chapter's front page: the slate, then its pages as ruled rows, each a
 * cut to the page. Personalised chapters carry the lamp and the name.
 */
export function ChapterOverview({
  id,
  rows,
  lead,
  identity,
  children,
}: {
  id: ChapterId;
  rows: OverviewRow[];
  lead: string;
  identity?: PublicIdentity;
  children?: ReactNode;
}) {
  const c = chapter(id);
  return (
    <div className="bg-[color:var(--stage)]">
      <header className="mx-auto max-w-[1600px] px-6 pb-14 pt-28 md:px-14 md:pt-36">
        <p className="mono flex flex-wrap items-center gap-x-4">
          <span>
            {c.n} &mdash; {c.title}
          </span>
          {c.personalised && identity && (
            <span className="flex items-center gap-2 text-[color:var(--ink)]">
              <span className="lamp" aria-hidden="true" />
              Written for {shortName(identity)}
            </span>
          )}
        </p>
        <h1 className="display mt-6 max-w-[10ch] text-[clamp(64px,11vw,176px)]">{c.title}</h1>
        <p className="em-serif mt-8 max-w-[36ch] text-[clamp(22px,2.6vw,34px)] leading-[1.25] text-[color:var(--ink-soft)]">{lead}</p>
      </header>

      <div className="mx-auto max-w-[1600px] px-6 pb-24 md:px-14 md:pb-32">
        <ol className="border-b border-[color:var(--rule)]">
          {rows.map((r) => (
            <li key={r.slug} className="border-t border-[color:var(--rule)]">
              <CutLink
                href={pageHref(id, r.slug)}
                data-cursor="Open"
                className="group grid grid-cols-[6ch_1fr] items-baseline gap-x-6 py-7 md:grid-cols-[6ch_1fr_auto] md:gap-x-12 md:py-9"
              >
                <span className="mono">{pageNumber(id, r.slug)}</span>
                <span>
                  <span className="display block text-[clamp(32px,4.4vw,64px)] leading-[0.95] text-[color:var(--ink)] transition-colors group-hover:text-white">{r.title}</span>
                  <span className="em-serif mt-2 block max-w-[44ch] text-[17px] text-[color:var(--ink-soft)] md:text-[19px]">{r.line}</span>
                </span>
                <span className="mono col-start-2 mt-3 md:col-start-3 md:mt-0 md:text-right">
                  {r.meta}
                  <span aria-hidden="true" className="ml-3 text-[color:var(--ink-faint)] transition-colors group-hover:text-[color:var(--ink)]">
                    &#8599;
                  </span>
                </span>
              </CutLink>
            </li>
          ))}
        </ol>
        {children}
      </div>
    </div>
  );
}
