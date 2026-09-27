"use client";

import { useState, type ReactNode } from "react";
import { CutLink } from "@/components/room/CutLink";
import { chapter, pageHref, pageNumber } from "@/content/chapters";
import type { ChapterId } from "@/content/types";
import { shortName, type PublicIdentity } from "@/content/clients/types";
import { ReadMark } from "@/components/portal/ReadMark";
import { Still } from "@/components/portal/Still";
import { useClient } from "@/components/portal/ClientContext";
import { useRead } from "@/lib/read";
import { numberWord } from "@/lib/words";

export type OverviewRow = {
  slug: string;
  title: string;
  line: string;
  meta?: string;
  /**
   * A still for the monitor and the row's frame, resolved on the server:
   * the published index is far too big to ship to the browser.
   */
  still?: string;
  /** Minutes to read, for the room's readout. */
  minutes?: number;
  /** The page's read key ("create/hooks"); shows the mark once read on this device. */
  readKey?: string;
};

/**
 * A room's front page: the slate and a readout of what is in here, a suite
 * monitor showing one page at a time, and the pages as ruled rows, each a
 * cut to the page.
 *
 * The monitor is the room's own preview: it holds the first page you have
 * not read, and follows the pointer or the keyboard down the list. Every
 * still is stacked in the glass and cross-dissolved, so switching is a
 * dissolve rather than a load. It is decoration over information the list
 * already carries, so it is hidden from a screen reader.
 */
export function ChapterOverview({
  id,
  rows,
  lead,
  identity,
  countLabel = "pages",
  next,
  children,
}: {
  id: ChapterId;
  rows: OverviewRow[];
  lead: string;
  identity?: PublicIdentity;
  /** What the room holds, for the readout: "guides", "reports". */
  countLabel?: string;
  /** The room after this one, for the cut at the foot. */
  next?: { href: string; n: string; title: string; blurb: string };
  children?: ReactNode;
}) {
  const c = chapter(id);
  const me = useClient();
  const { read } = useRead(me.slug);
  const [hot, setHot] = useState<number | null>(null);

  const glass = rows.some((r) => r.still);
  const minutes = rows.reduce((s, r) => s + (r.minutes ?? 0), 0);
  const marked = rows.filter((r) => r.readKey);
  const readCount = marked.filter((r) => read.has(r.readKey!)).length;
  // Left where you stopped: the first page not yet read on this device.
  const firstUnread = rows.findIndex((r) => r.readKey && !read.has(r.readKey));
  const shownIndex = hot ?? (firstUnread >= 0 ? firstUnread : 0);
  const shown = rows[shownIndex];
  // A way in that names the page it opens, rather than "start reading".
  const at = firstUnread >= 0 ? rows[firstUnread] : null;
  const verb = readCount === 0 ? "Start at " : "Resume at ";

  return (
    <div className="bg-[color:var(--stage)]">
      <header className="mx-auto max-w-[1600px] px-6 pb-14 pt-28 md:px-14 md:pt-36">
        <div className="grid gap-12 md:grid-cols-[1fr_auto] md:items-end md:gap-20">
          <div className="min-w-0">
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
            <p className="em-serif statement mt-8 max-w-[36ch] text-[clamp(22px,2.6vw,34px)] leading-[1.25] text-[color:var(--ink-soft)]">{lead}</p>
            <dl className="mono mt-8 flex flex-wrap gap-x-8 gap-y-2" aria-label={"What is in " + c.title}>
              <div className="flex gap-2">
                <dt className="text-[color:var(--ink-mid)]">{countLabel}</dt>
                <dd className="text-[color:var(--ink)]">{numberWord(rows.length)}</dd>
              </div>
              {minutes > 0 && (
                <div className="flex gap-2">
                  <dt className="text-[color:var(--ink-mid)]">To read</dt>
                  <dd className="text-[color:var(--ink)]">{minutes} min</dd>
                </div>
              )}
              {marked.length > 0 && (
                <div className="flex gap-2">
                  <dt className="text-[color:var(--ink-mid)]">Read</dt>
                  <dd className={readCount === marked.length ? "text-[color:var(--ink)]" : "text-[color:var(--ink-soft)]"}>
                    {readCount} of {marked.length}
                  </dd>
                </div>
              )}
            </dl>
            {at && marked.length > 0 && (
              <CutLink
                href={pageHref(id, at.slug)}
                aria-label={verb + pageNumber(id, at.slug) + " \u2014 " + at.title}
                className="pill pill-solid mt-9 inline-block px-7 py-3 text-[15px]"
                data-cursor="Open"
              >
                {verb}
                {pageNumber(id, at.slug)} &rarr;
              </CutLink>
            )}
          </div>

          {glass && shown && (
            <div aria-hidden="true" className="hidden w-[280px] shrink-0 md:block">
              <p className="mono flex items-center justify-between">
                <span className="flex items-center gap-2 text-[color:var(--ink)]">
                  <span className={hot === null ? "lamp-off" : "lamp"} />
                  Preview
                </span>
                <span className="text-[color:var(--ink-mid)]">{pageNumber(id, shown.slug)}</span>
              </p>
              <div className="relative mt-3 aspect-[3/4] overflow-hidden border border-[color:var(--rule-strong)] bg-[color:var(--stage-2)]">
                {rows.map((r, i) =>
                  r.still ? (
                    <Still
                      key={r.slug}
                      src={r.still}
                      className={"absolute inset-0 h-full w-full object-cover transition-opacity duration-500 " + (i === shownIndex ? "opacity-100" : "opacity-0")}
                    />
                  ) : null
                )}
                <span className="scan pointer-events-none absolute inset-0" />
              </div>
              <p className="mono mt-3 truncate text-[color:var(--ink-soft)]">{shown.title}</p>
            </div>
          )}
        </div>
      </header>

      <div className="mx-auto max-w-[1600px] px-6 pb-24 md:px-14 md:pb-32">
        <ol className="border-b border-[color:var(--rule)]" onPointerLeave={() => setHot(null)}>
          {rows.map((r, i) => (
            <li key={r.slug} className="border-t border-[color:var(--rule)]">
              <CutLink
                href={pageHref(id, r.slug)}
                data-cursor="Open"
                onPointerEnter={() => setHot(i)}
                onFocus={() => setHot(i)}
                className="group grid grid-cols-[6ch_1fr] items-baseline gap-x-6 py-7 md:grid-cols-[6ch_auto_1fr_auto] md:items-center md:gap-x-10 md:py-8"
              >
                <span className={"mono transition-colors " + (i === shownIndex ? "text-[color:var(--ink)]" : "")}>{pageNumber(id, r.slug)}</span>
                {r.still ? (
                  <span className="well hidden w-[64px] border border-[color:var(--rule)] transition-colors group-hover:border-[color:var(--rule-strong)] md:block">
                    <Still src={r.still} className="absolute inset-0 h-full w-full object-cover opacity-80 transition-opacity group-hover:opacity-100" />
                  </span>
                ) : (
                  <span className="hidden md:block" />
                )}
                <span>
                  <span className="display block text-[clamp(32px,4.4vw,64px)] leading-[0.95] text-[color:var(--ink)] transition-colors group-hover:text-white">{r.title}</span>
                  <span className="mt-2 block max-w-[52ch] text-[16px] leading-[1.45] text-[color:var(--ink-soft)] md:text-[17px]">{r.line}</span>
                </span>
                <span className="mono col-start-2 mt-3 md:col-start-3 md:mt-0 md:text-right">
                  {r.readKey && <ReadMark k={r.readKey} />}
                  {r.meta}
                  <span aria-hidden="true" className="ml-3 text-[color:var(--ink-mid)] transition-colors group-hover:text-[color:var(--ink)]">
                    &#8599;
                  </span>
                </span>
              </CutLink>
            </li>
          ))}
        </ol>
        {children}
      </div>

      {next && (
        <nav className="border-t border-[color:var(--rule)] bg-[color:var(--stage-2)]" aria-label="The next room">
          <CutLink href={next.href} className="group block" data-cursor="Cut">
            <div className="mx-auto max-w-[1600px] px-6 py-14 md:px-14 md:py-20">
              <p className="mono">
                Next <span className="text-[color:var(--ink-mid)]">/</span> {next.n}
              </p>
              <p className="display mt-3 text-[clamp(36px,5.5vw,88px)] transition-colors duration-300 group-hover:text-white">
                {next.title} <span aria-hidden="true" className="text-[color:var(--ink-mid)] transition-colors group-hover:text-[color:var(--ink)]">&#8599;</span>
              </p>
              <p className="mt-3 max-w-[48ch] text-[17px] leading-[1.45] text-[color:var(--ink-soft)]">{next.blurb}</p>
            </div>
          </CutLink>
        </nav>
      )}
    </div>
  );
}
