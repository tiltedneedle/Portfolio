"use client";

import { useSyncExternalStore } from "react";
import { CutLink } from "@/components/room/CutLink";
import { WordStrip } from "@/components/editorial/WordStrip";
import { MasterTimeline } from "@/components/room/MasterTimeline";
import { ClientMark } from "@/components/portal/ClientMark";
import { useClient } from "@/components/portal/ClientContext";
import { chapters, type Chapter } from "@/content/chapters";
import { shortName } from "@/content/clients/types";
import { PRESENCE } from "@/lib/session";
import type { Clip } from "@/lib/sequence";
import { useCookieFlag } from "@/lib/use-cookie-flag";
import { leave } from "@/app/login/actions";

// Frozen at build time for the server render; the browser reads its own clock on hydration.
const BUILD_YEAR = new Date().getFullYear();
const noop = () => () => {};
const liveYear = () => new Date().getFullYear();
const builtYear = () => BUILD_YEAR;

const heading = "mono mb-5 block";
const link = "underline-draw w-fit text-[15px] text-[color:var(--ink-soft)] transition-colors duration-300 hover:text-[color:var(--ink)]";

/** The conform, then the tail leader: the reel, the crawl, the contents once more. */
export function PortalFooter({ rooms = chapters, clips }: { rooms?: Chapter[]; clips?: Clip[] }) {
  const who = useClient();
  // The pages are pre-rendered, so whether someone is logged in can only be
  // known in the browser: the door leaves a presence cookie beside the session.
  const inRoom = useCookieFlag(PRESENCE);
  const year = useSyncExternalStore(noop, liveYear, builtYear);

  return (
    <footer className="border-t border-[color:var(--rule)] bg-[color:var(--stage)] text-[color:var(--ink-soft)]">
      {clips && clips.length > 0 ? <MasterTimeline clips={clips} /> : null}
      <WordStrip words="research. create. publish. analyse. improve. repeat. " />
      <div className="mx-auto max-w-[1600px] px-6 py-16 md:px-14 md:py-20">
        <div className="grid grid-cols-1 gap-x-10 gap-y-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <ClientMark size={28} />
            <p className="mt-6 max-w-[36ch] text-[15px] leading-relaxed text-[color:var(--ink-mid)]">
              Built once, written for {shortName(who)}.
            </p>
            <p className="mono mt-6">
              Reel {who.since}
            </p>
          </div>

          <div className="md:col-span-4 md:col-start-7">
            <p className={heading}>The system</p>
            <nav className="flex flex-col gap-3" aria-label="Footer">
              {rooms.map((c) => (
                <CutLink key={c.id} href={c.href} className={link}>
                  <span className="mono mr-3 text-[color:var(--ink-mid)]">{c.n}</span>
                  {c.title}
                </CutLink>
              ))}
            </nav>
          </div>

          <div className="md:col-span-3">
            <p className={heading}>Your team</p>
            <div className="flex flex-col gap-3">
              <a href={"mailto:" + who.contact} className={link}>
                {who.contact}
              </a>
              <p className="text-[13px] leading-relaxed text-[color:var(--ink-mid)]">
                Any part of the system, or a cut you want a second pair of eyes on.
              </p>
              {inRoom && (
                <form action={leave} className="mt-4">
                  <button type="submit" className="slate-link" data-cursor="Cut">
                    Leave the room &rarr;
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        <div className="mono mt-16 flex flex-col justify-between gap-4 border-t border-[color:var(--rule)] pt-6 md:mt-20 md:flex-row md:items-baseline">
          <p>
            &copy; {year} Tilted Needle <span className="text-[color:var(--ink-mid)]">/</span> Private, for {who.name}
            {who.demo && <span className="text-[color:var(--ink-mid)]"> / Demo</span>}
          </p>
          <p className="text-[color:var(--ink-mid)]">Not for distribution</p>
        </div>
      </div>
    </footer>
  );
}
