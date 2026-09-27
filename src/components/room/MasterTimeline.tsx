"use client";

import { useState, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { CutLink } from "@/components/room/CutLink";
import { useClient } from "@/components/portal/ClientContext";
import { useRead } from "@/lib/read";
import { hhmm } from "@/lib/timecode";
import type { Clip } from "@/lib/sequence";

const noop = () => () => {};

/**
 * The conform: the whole system laid out as one reel, at the foot of every
 * page. Each page is a clip whose width is its reading time, so the strip is
 * a true duration scale end to end and within each room. Read pages are a
 * step up in luminance, and the playhead sits on the page you are on.
 *
 * The timecodes are set as text. That is deliberate and consistent with the
 * other readouts in the room (Slate, Readouts, TrainingFilm): the
 * `.numeral` / `data-n` rule draws the audit's *display* numerals from CSS,
 * and it does not govern readouts. Do not "fix" this later.
 *
 * Nothing here animates beyond the inherited colour transition. The device is
 * information; a reveal would make it decoration.
 */
export function MasterTimeline({ clips }: { clips: Clip[] }) {
  const me = useClient();
  const { read } = useRead(me.slug);
  const [hot, setHot] = useState<string | null>(null);

  // Where "here" is can only be known in the browser. These pages are
  // pre-rendered inside the client's own tree (/c/<slug>/create/hooks) and
  // the proxy serves them at the clean path (/create/hooks), so the server
  // and the browser genuinely disagree, and reading the pathname during
  // hydration is a mismatch on every page that has a footer. The server
  // renders no playhead; the browser places it on the first commit. (The
  // same shape PortalFooter uses for the year.)
  const path = usePathname();
  const here = useSyncExternalStore(noop, () => path, () => null);

  const totalMin = clips.reduce((n, c) => n + c.minutes, 0);
  const done = clips.filter((c) => read.has(c.readKey));
  const readMin = done.reduce((n, c) => n + c.minutes, 0);
  const left = totalMin - readMin;
  const hotTitle = clips.find((c) => c.href === hot)?.title ?? null;

  // One group per room, in the system's order.
  const groups: { chapterN: string; chapterTitle: string; minutes: number; clips: Clip[] }[] = [];
  for (const c of clips) {
    const last = groups[groups.length - 1];
    if (last && last.chapterN === c.chapterN) {
      last.clips.push(c);
      last.minutes += c.minutes;
    } else {
      groups.push({ chapterN: c.chapterN, chapterTitle: c.chapterTitle, minutes: c.minutes, clips: [c] });
    }
  }

  return (
    <section aria-labelledby="reel-h" className="border-t border-[color:var(--rule)] bg-[color:var(--stage)] px-6 pb-12 pt-14 md:px-14 md:pt-16">
      <div className="mx-auto max-w-[1600px]">
        <div className="mono flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2">
          <h2 id="reel-h" className="mono">
            The whole system, end to end
          </h2>
          <p className="text-[color:var(--ink-mid)]">Read on this device</p>
        </div>
        <p className="tc mt-5 text-[clamp(38px,7vw,92px)] leading-none">
          {hhmm(readMin)}
          <span className="text-[color:var(--ink-mid)]"> / {hhmm(totalMin)}</span>
        </p>

        {/* Side by side only where a room can be wide enough to read as a strip.
            Below that each room is its own full-width row, which is a truer
            picture than three squeezed columns. */}
        <ol className="mt-9 flex flex-col gap-7 lg:flex-row lg:items-start lg:gap-6">
          {groups.map((g) => (
            <li key={g.chapterN} style={{ flex: g.minutes + " 1 0" }} className="min-w-0 lg:min-w-[172px]">
              <p className="mono flex items-baseline justify-between gap-3 border-b border-[color:var(--rule-strong)] pb-2">
                <span>
                  {g.chapterN} &mdash; {g.chapterTitle}
                </span>
                <span className="text-[color:var(--ink-mid)]">{g.minutes} min</span>
              </p>
              <ol className="mt-2 flex gap-[2px]" onPointerLeave={() => setHot(null)}>
                {g.clips.map((c) => {
                  const on = c.href === here;
                  const isRead = read.has(c.readKey);
                  return (
                    <li key={c.href} style={{ flex: c.minutes + " 1 0" }} className="min-w-[30px]">
                      <CutLink
                        href={c.href}
                        prefetch={false}
                        data-cursor="Open"
                        aria-current={on ? "page" : undefined}
                        aria-label={c.n + " " + c.title + ", " + c.minutes + " min" + (isRead ? ", read" : "") + (on ? ", you are here" : "")}
                        onPointerEnter={() => setHot(c.href)}
                        onFocus={() => setHot(c.href)}
                        className={
                          "relative block h-11 border transition-colors duration-300 " +
                          (isRead ? "border-[color:var(--rule-strong)] bg-[rgba(242,239,233,0.16)] " : "border-[color:var(--rule)] bg-[color:var(--stage-2)] ") +
                          "hover:border-[color:var(--rule-strong)]"
                        }
                      >
                        {on && <span aria-hidden="true" className="absolute inset-y-0 left-0 w-[2px] bg-[color:var(--tally)] shadow-[0_0_8px_var(--tally-glow)]" />}
                        {on && <span className="lamp absolute -top-1 left-[5px]" aria-hidden="true" />}
                      </CutLink>
                    </li>
                  );
                })}
              </ol>
              <p aria-hidden="true" className="mono mt-2.5 min-h-[1.3em] truncate text-[color:var(--ink-soft)]">
                {g.clips.some((c) => c.href === hot) ? hotTitle : ""}
              </p>
            </li>
          ))}
        </ol>

        <p className="mono mt-9 border-t border-[color:var(--rule)] pt-4 text-[color:var(--ink-mid)]">
          {done.length} of {clips.length} pages <span className="text-[color:var(--ink-faint)]">&middot;</span> {left > 0 ? left + " min left" : "Read through"}
        </p>
      </div>
    </section>
  );
}
