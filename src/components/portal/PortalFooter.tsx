"use client";

import { useSyncExternalStore } from "react";
import { CutLink } from "@/components/room/CutLink";
import { WordStrip } from "@/components/editorial/WordStrip";
import { ClientMark } from "@/components/portal/ClientMark";
import { useClient } from "@/components/portal/ClientContext";
import { chapters } from "@/content/chapters";
import { shortName } from "@/content/clients/types";
import { PRESENCE } from "@/lib/session";
import { useCookieFlag } from "@/lib/use-cookie-flag";
import { leave } from "@/app/login/actions";

// Frozen at build time for the server render; the browser reads its own clock on hydration.
const BUILD_YEAR = new Date().getFullYear();
const noop = () => () => {};
const liveYear = () => new Date().getFullYear();
const builtYear = () => BUILD_YEAR;

const heading = "mono mb-5 block";
const link = "underline-draw w-fit text-[15px] text-[color:var(--ink-soft)] transition-colors duration-300 hover:text-[color:var(--ink)]";

/** The tail leader: the approach as a crawl, then the contents once more. */
export function PortalFooter() {
  const who = useClient();
  // The pages are pre-rendered, so whether someone is logged in can only be
  // known in the browser: the door leaves a presence cookie beside the session.
  const inRoom = useCookieFlag(PRESENCE);
  const year = useSyncExternalStore(noop, liveYear, builtYear);

  return (
    <footer className="border-t border-[color:var(--rule)] bg-[color:var(--stage)] text-[color:var(--ink-soft)]">
      <WordStrip words="research. create. publish. analyse. improve. repeat. " />
      <div className="mx-auto max-w-[1600px] px-6 py-16 md:px-14 md:py-20">
        <div className="grid grid-cols-1 gap-x-10 gap-y-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <ClientMark size={28} />
            <p className="mt-6 max-w-[36ch] text-[15px] leading-relaxed text-[color:var(--ink-mid)]">
              Your complete viral content system. Built once, personalised for {shortName(who)}, and yours to keep.
            </p>
            <p className="mono mt-6">
              Permanent access <span className="text-[color:var(--ink-mid)]">/</span> Reel {who.since}
            </p>
          </div>

          <div className="md:col-span-4 md:col-start-7">
            <p className={heading}>The system</p>
            <nav className="flex flex-col gap-3" aria-label="Footer">
              {chapters.map((c) => (
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
                Questions about any part of the system, or a video you want a second pair of eyes on: message your Tilted Needle team.
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
