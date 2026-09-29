"use client";

import { useSyncExternalStore, type CSSProperties } from "react";
import { usePathname } from "next/navigation";
import { CutLink } from "@/components/room/CutLink";
import { WordStrip } from "@/components/editorial/WordStrip";
import { MasterTimeline } from "@/components/room/MasterTimeline";
import { ClientMark } from "@/components/portal/ClientMark";
import { useClient } from "@/components/portal/ClientContext";
import { chapters } from "@/content/chapters";
import { Lock } from "@/components/portal/Lock";
import { Reveal } from "@/components/portal/Reveal";
import { Tilt } from "@/components/portal/Tilt";
import { type Room } from "@/lib/rooms";
import { openLocked } from "@/lib/locked";
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
const linkBase = "underline-draw w-fit text-[15px] transition-colors duration-300 hover:text-[color:var(--ink)]";
const link = linkBase + " text-[color:var(--ink-soft)]";

/**
 * The end of the reel: the conform (the whole system as one timeline), the
 * crawl, then the credits -- the sign-off, the system once more, the team --
 * and the studio's name across the foot of every page, its TILTED letters
 * swinging and settling as the credits come on and leaning toward the
 * pointer after (Tilt.tsx), the way the name does in the home page's hero.
 *
 * The credits are three columns that sum to the grid (5 + 3 + 3 of 12, with
 * one between): they had summed to 13, so the team dropped onto a second
 * row under the sign-off and left the right third of every footer empty.
 * Twelve columns only from lg: at 768 their eleven gutters left the team
 * 132px, narrower than its own email address, so on a tablet the sign-off
 * runs across the top and the other two share the row under it.
 *
 * The room you are in is lit in the list in ink and tally red, as it is in
 * the nav (the line under its name in the bar, the lamp in the menu); the
 * lamp is held still here, since the playhead in the timeline above is the
 * one that breathes. On a phone the list is two short columns, read down.
 */
export function PortalFooter({ rooms = chapters, clips }: { rooms?: Room[]; clips?: Clip[] }) {
  const who = useClient();
  // The pages are pre-rendered, so whether someone is logged in can only be
  // known in the browser: the door leaves a presence cookie beside the session.
  const inRoom = useCookieFlag(PRESENCE);
  const year = useSyncExternalStore(noop, liveYear, builtYear);
  // Where "here" is, the way MasterTimeline finds it: the server renders the
  // page at its rewritten path, so it lights nothing and the browser does.
  const path = usePathname();
  const here = useSyncExternalStore(noop, () => path, () => null);

  return (
    <footer className="border-t border-[color:var(--rule)] bg-[color:var(--stage)] text-[color:var(--ink-soft)]">
      {clips && clips.length > 0 ? <MasterTimeline clips={clips} /> : null}
      <WordStrip words="research. create. publish. analyse. improve. repeat. " />
      <div className="mx-auto max-w-[1600px] px-6 pt-16 md:px-14 md:pt-24">
        <Reveal className="grid grid-cols-1 gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-12">
          <div className="credit sm:col-span-2 lg:col-span-5" style={{ "--i": 0 } as CSSProperties}>
            <ClientMark size={28} />
            {/* The sign-off, set as the closing line it is. */}
            <p className="em-serif statement mt-8 max-w-[18ch] text-[clamp(30px,3vw,46px)] leading-[1.1] text-[color:var(--ink)]">
              Built once, written for {shortName(who)}.
            </p>
            <p className="mono mt-6">Reel {who.since}</p>
          </div>

          <div className="credit lg:col-span-3 lg:col-start-7" style={{ "--i": 1 } as CSSProperties}>
            <p className={heading}>The system</p>
            <nav
              className="grid grid-flow-col gap-x-6 gap-y-3 md:flex md:flex-col"
              style={{ gridTemplateRows: "repeat(" + Math.ceil(rooms.length / 2) + ", auto)" }}
              aria-label="Footer"
            >
              {rooms.map((c) => {
                const exact = here === c.href;
                const inside = exact || (here !== null && c.href !== "/" && here.startsWith(c.href + "/"));
                return c.locked ? (
                  <button key={c.id} type="button" onClick={() => openLocked(c.id)} aria-haspopup="dialog" className={link + " inline-flex items-center text-left"}>
                    <span className="mono mr-3 text-[color:var(--ink-mid)]">{c.n}</span>
                    {c.title}
                    <Lock className="ml-2 text-[color:var(--ink-mid)]" label="Locked" />
                  </button>
                ) : (
                  <CutLink
                    key={c.id}
                    href={c.href}
                    aria-current={exact ? "page" : inside ? "true" : undefined}
                    className={inside ? linkBase + " text-[color:var(--ink)]" : link}
                  >
                    <span className="mono mr-3 text-[color:var(--ink-mid)]">{c.n}</span>
                    {c.title}
                    {inside && <span aria-hidden="true" className="lamp absolute -right-4 top-1/2 -translate-y-1/2" />}
                  </CutLink>
                );
              })}
            </nav>
          </div>

          <div className="credit lg:col-span-3" style={{ "--i": 2 } as CSSProperties}>
            <p className={heading}>Your team</p>
            <div className="flex flex-col gap-3">
              <a href={"mailto:" + who.contact} className={link}>
                {who.contact}
              </a>
              <p className="max-w-[32ch] text-[13px] leading-relaxed text-[color:var(--ink-mid)]">
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
        </Reveal>

        {/* The studio's name across the foot, as the last title card: its
            letters settle as the credits come on (a reveal, so it is never
            spent below the fold) and lean toward the pointer after. Said
            already, in the nav and the line below, so it is decoration here. */}
        <Reveal className="foot-mark no-print mt-16 pb-1 pt-4 md:mt-24">
          <p aria-hidden="true" className="display select-none whitespace-nowrap text-center text-[clamp(40px,19.4cqw,340px)] leading-[0.8] text-[color:var(--ink)]">
            <Tilt text="Tilted" /> Needle
          </p>
        </Reveal>

        {/* Room under the last line for the floating Contents and Top
            buttons (fixed, 24px up, about 42px tall): at the end of the page
            they sat on the copyright. Lifted over the name above it: at
            leading 0.8 the name's text runs about a fifth of its size below
            its own line, invisibly, and its box is a stacking context
            (container-type), so it lay over this line and took the pointer. */}
        <div className="mono relative z-[1] flex flex-col justify-between gap-4 border-t border-[color:var(--rule)] pb-24 pt-6 md:flex-row md:items-baseline">
          <p>
            {/* On a phone the studio's line stands alone and the client's
                follows it whole: wrapped where it fell, it split the name. */}
            <span className="block sm:inline">&copy; {year} Tilted Needle</span>{" "}
            <span className="hidden text-[color:var(--ink-mid)] sm:inline">/</span> <span className="inline-block">Private, for {who.name}</span>
            {who.demo && <span className="text-[color:var(--ink-mid)]"> / Demo</span>}
          </p>
          <p className="text-[color:var(--ink-mid)]">Not for distribution</p>
        </div>
      </div>
    </footer>
  );
}
