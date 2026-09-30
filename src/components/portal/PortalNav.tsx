"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import { CutLink } from "@/components/room/CutLink";
import { Wordmark } from "@/components/room/Wordmark";
import { chapters, pageHref, pageNumber } from "@/content/chapters";
import { type Room } from "@/lib/rooms";
import { openLocked } from "@/lib/locked";
import { Lock } from "@/components/portal/Lock";
import { useClient } from "@/components/portal/ClientContext";
import { shortName } from "@/content/clients/types";
import { clsx } from "clsx";
import { EASE_OUT_EXPO } from "@/lib/design-tokens";
import { useRead } from "@/lib/read";
import { seenKey } from "@/components/portal/RecentList";

/**
 * The nav is the system's table of contents: six numbered rooms, each with
 * a panel listing its pages. On a pointer the panel opens on hover and the
 * hover grammar from the studio site carries over (the hovered room grows;
 * it and everything left of it drop to the serif italic). On a keyboard the
 * panel opens on focus. Below lg the whole contents fold into one screen.
 *
 * The room you are in carries the tally line along the foot of the bar and
 * is announced as current, as it is lit in the footer's list. Going to
 * another room, the line slides along the bar to it, the way a playhead
 * moves, rather than going out in one place and coming on in another.
 */
const pad = (i: number) => String(i + 1).padStart(2, "0");

function Panel({ chapter: c, onPick, current, read }: { chapter: Room; onPick: () => void; current: string; read: Set<string> }) {
  return (
    <div className="panel w-[360px] p-2">
      <div className="mono flex items-baseline justify-between px-3 pb-2 pt-3">
        <span>
          {c.n} &mdash; {c.title}
        </span>
        {c.locked ? (
          <span className="inline-flex items-center gap-1.5 text-[color:var(--ink-mid)]">
            <Lock />
            Not yours yet
          </span>
        ) : (
          c.id !== "home" && (
            <span className="text-[color:var(--ink-mid)]">
              {c.pages.filter((p) => read.has(c.id + "/" + p.slug)).length} of {c.pages.length} read
            </span>
          )
        )}
      </div>
      <p className="px-3 pb-3 text-[13px] leading-snug text-[color:var(--ink-mid)]">{c.blurb}</p>
      {c.locked ? (
        <ul className="border-t border-[color:var(--rule)]">
          {c.pages.map((p) => (
            <li key={p.slug} className="flex items-baseline gap-3 border-b border-[color:var(--rule)] px-3 py-2.5 text-[15px] text-[color:var(--ink-mid)]">
              <span className="mono w-[5ch] shrink-0">{pageNumber(c.id, p.slug)}</span>
              {p.title}
            </li>
          ))}
          <li>
            <button
              type="button"
              onClick={() => {
                onPick();
                openLocked(c.id);
              }}
              className="flex w-full items-baseline gap-3 px-3 py-2.5 text-left text-[15px] text-[color:var(--ink)] transition-colors hover:bg-[color:var(--stage-3)]"
            >
              How this gets written &rarr;
            </button>
          </li>
        </ul>
      ) : (
      <ul className="border-t border-[color:var(--rule)]">
        {c.pages.map((p, j) => {
          const href = pageHref(c.id, p.slug);
          const here = href === current;
          return (
            <li key={p.slug}>
              <CutLink
                href={href}
                onClick={onPick}
                aria-current={here ? "page" : undefined}
                className={clsx(
                  "flex items-baseline gap-3 border-b border-[color:var(--rule)] px-3 py-2.5 text-[15px] transition-colors last:border-b-0 hover:bg-[color:var(--stage-3)] hover:text-[color:var(--ink)]",
                  here ? "text-[color:var(--ink)]" : "text-[color:var(--ink-soft)]"
                )}
              >
                <span className="mono w-[5ch] shrink-0 text-[color:var(--ink-mid)]">{c.id === "home" ? pad(j) : pageNumber(c.id, p.slug)}</span>
                {p.title}
                {here ? (
                  <span className="lamp lamp-live ml-auto shrink-0 self-center" aria-hidden="true" />
                ) : read.has(c.id + "/" + p.slug) ? (
                  <span className="ml-auto inline-block h-1.5 w-1.5 shrink-0 self-center rounded-full bg-[color:var(--ink)]" aria-label="Read" />
                ) : null}
              </CutLink>
            </li>
          );
        })}
      </ul>
      )}
    </div>
  );
}

/**
 * A room's name in the bar, set twice in one grid cell: as the mono label it
 * rests as, and in the serif italic it drops to when lit. The cell is as wide
 * as the wider of the two, so lighting a room changes its face and nothing
 * else: set in place, the narrower italic pulled every room left of the
 * pointer about 65px to the right, out from under it. The two cross-fade.
 */
function RoomLabel({ n, title }: { n: string; title: string }) {
  return (
    <span className="room-label">
      <span className="room-face">
        <span aria-hidden="true" className="mr-1.5 text-[color:var(--ink-mid)]">
          {n}
        </span>
        {title}
      </span>
      <span className="room-face room-face-lit" aria-hidden="true">
        <span className="mr-1.5 text-[color:var(--ink-mid)]">{n}</span>
        {title}
      </span>
    </span>
  );
}

const noop = () => () => {};

/**
 * A lamp beside the mark when something has been added since this device
 * last saw the home list. Strictly newer than that day: once home has been
 * seen today, today's additions are known, and the lamp goes dark.
 */
function NewLamp({ latest }: { latest?: string }) {
  const me = useClient();
  const seen = useSyncExternalStore(
    noop,
    () => {
      try {
        return localStorage.getItem(seenKey(me.slug)) ?? "";
      } catch {
        return "";
      }
    },
    () => ""
  );
  if (!latest || !seen || latest <= seen) return null;
  return (
    <span className="inline-flex items-center">
      <span className="lamp lamp-live" aria-hidden="true" />
      <span className="sr-only">New additions since your last visit</span>
    </span>
  );
}

export function PortalNav({ latest, rooms = chapters }: { latest?: string; rooms?: Room[] }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [panel, setPanel] = useState<string | null>(null);
  const [hot, setHot] = useState<number | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const menuButton = useRef<HTMLButtonElement | null>(null);
  // Set while Escape hands focus back to a room, so that focus does not
  // open the panel it has just closed.
  const returning = useRef(false);
  const pathname = usePathname();
  // Where "here" is can only be known in the browser: the server renders
  // these pages at their rewritten path (/c/<slug>/create/hooks), so it
  // lights nothing, and a room lit during hydration never showed -- React
  // keeps the server's class. The same shape as the footer and the reel.
  const here = useSyncExternalStore(noop, () => pathname, () => null);
  const reduced = useReducedMotion();
  const me = useClient();
  const who = shortName(me);
  const { read } = useRead(me.slug);

  useEffect(() => {
    let ticking = false;
    const update = () => {
      ticking = false;
      const y = window.scrollY;
      setScrolled((prev) => (prev === y > 24 ? prev : y > 24));
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    // A page restored part-way down is known a frame later, not as the page
    // hydrates: reading scrollY then forces a layout of the whole page.
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // The menu is the whole screen while it is open: the page behind it is
  // inert (so Tab cannot walk into what it covers) and the floating
  // buttons stand down. Escape closes it and hands focus back to its button.
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    document.body.classList.add("menu-open");
    const behind = [...document.querySelectorAll<HTMLElement>("main, footer, a.skip")];
    behind.forEach((el) => el.setAttribute("inert", ""));
    const key = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      menuButton.current?.focus();
    };
    window.addEventListener("keydown", key);
    return () => {
      document.body.style.overflow = "";
      document.body.classList.remove("menu-open");
      behind.forEach((el) => el.removeAttribute("inert"));
      window.removeEventListener("keydown", key);
    };
  }, [open]);

  useEffect(() => {
    if (!panel) return;
    const key = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      // Focus inside the closing panel goes back to its room, not to <body>.
      const room = (document.activeElement as HTMLElement | null)?.closest<HTMLElement>("[data-room]");
      const trigger = room?.querySelector<HTMLElement>(".room-link");
      if (trigger && document.activeElement !== trigger) {
        returning.current = true;
        trigger.focus();
        returning.current = false;
      }
      setPanel(null);
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [panel]);

  const show = (id: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setPanel(id);
  };
  const hide = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setPanel(null), 160);
  };
  const pick = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setPanel(null);
    setOpen(false);
  };

  // In a room, at its door (the page itself) or anywhere inside it.
  const where = (c: Room): "page" | "true" | undefined => {
    if (c.locked || here === null) return undefined;
    if (here === c.href) return "page";
    return c.href !== "/" && here.startsWith(c.href + "/") ? "true" : undefined;
  };

  // The cue under the current room: one line for the whole bar. It is placed
  // from the room's own box by a ResizeObserver, whose calls come after the
  // browser's layout and before the paint, so it is never seen out of place
  // and nothing is measured as the page hydrates; CSS slides it from room to
  // room (.room-cue). It draws itself in once, the first time there is a
  // room to stand under; after that it slides, and arriving from no room at
  // all it is set down in place. (It was a framer-motion shared layout,
  // which put every animated element on the site through layout
  // projection.)
  //
  // One observer for the life of the bar, told to look again when the room
  // changes (observing afresh always reports). Observers report in the
  // order they were made, and this one is made before the page's own, so it
  // measures before any of theirs has written a style; one made anew after
  // hydration reported last, and its read paid for everything they wrote.
  // Below lg the bar is not shown, and nothing is read.
  const bar = useRef<HTMLDivElement>(null);
  const cue = useRef<HTMLSpanElement>(null);
  const cueDrawn = useRef(false);
  const cueWatch = useRef<ResizeObserver | null>(null);
  const lit = rooms.findIndex((c) => where(c) !== undefined);
  const litNow = useRef(lit);
  useEffect(() => {
    const box = bar.current;
    const line = cue.current;
    if (!box || !line || typeof ResizeObserver === "undefined") return;
    let frame = 0;
    const ro = new ResizeObserver((entries) => {
      const shown = entries[entries.length - 1].contentRect.width > 0;
      const room = shown && litNow.current >= 0 ? box.querySelectorAll<HTMLElement>(":scope > [data-room]")[litNow.current] : undefined;
      const w = room ? room.offsetWidth : 0;
      if (!room || !w) {
        line.classList.remove("is-on", "is-sliding");
        return;
      }
      const was = line.classList.contains("is-on");
      line.style.setProperty("--cue-x", room.offsetLeft + "px");
      line.style.setProperty("--cue-w", w + "px");
      line.classList.add("is-on");
      if (reduced) return;
      if (!cueDrawn.current) {
        cueDrawn.current = true;
        line.classList.add("is-drawing");
      }
      if (!was) frame = requestAnimationFrame(() => line.classList.add("is-sliding"));
    });
    ro.observe(box);
    cueWatch.current = ro;
    return () => {
      ro.disconnect();
      cueWatch.current = null;
      cancelAnimationFrame(frame);
    };
  }, [reduced]);
  useEffect(() => {
    litNow.current = lit;
    const ro = cueWatch.current;
    const box = bar.current;
    if (!ro || !box) return;
    ro.unobserve(box);
    ro.observe(box);
  }, [lit]);

  return (
    <>
      <header
        data-nav=""
        className={clsx(
          "fixed inset-x-0 top-0 z-50 transition-colors duration-500",
          scrolled && !open ? "border-b border-[color:var(--rule)] bg-[rgba(11,11,12,0.82)] backdrop-blur-xl" : "border-b border-transparent bg-transparent"
        )}
      >
        {/* The bar spans the screen; what is on it keeps to the page's own
            1600px measure, padding inside it, so the mark and the last room
            stand over the page's edges on a wide screen too. The gap means
            the mark and the rooms can never touch. */}
        <nav className="mx-auto flex h-14 max-w-[1600px] items-center justify-between gap-8 px-6 md:h-16 md:px-14" aria-label="Primary">
          <CutLink href="/" className="inline-flex shrink-0 items-center gap-3" aria-label="Home" onClick={pick}>
            <Wordmark />
            <NewLamp latest={latest} />
            {/* The client's name joins the mark where the bar has room for
                it: a short name from lg, a longer one from xl. */}
            <span className={clsx("mono hidden whitespace-nowrap text-[color:var(--ink-mid)]", who.length <= 8 ? "lg:inline" : "xl:inline")}>
              <span className="text-[color:var(--ink-mid)]">&times;</span> {who}
            </span>
          </CutLink>

          {/* The rooms inline from lg: measured with a locked room's padlock,
              six names need about 660px, which a 900px screen does not have
              beside the mark (two names broke in two, and the mark ran into
              the first room). Below lg, the menu. Each room is the bar's full
              height, so its panel hangs from the foot of the bar. */}
          <div
            ref={bar}
            className="relative hidden items-stretch gap-7 self-stretch lg:flex"
            onPointerLeave={() => {
              setHot(null);
              hide();
            }}
          >
            {rooms.map((c, i) => {
              const current = where(c);
              return (
                <div
                  key={c.id}
                  data-room=""
                  className="relative flex items-center"
                  onPointerEnter={() => {
                    setHot(i);
                    show(c.id);
                  }}
                  onFocus={() => {
                    if (!returning.current) show(c.id);
                  }}
                  onBlur={(e) => {
                    if (!e.currentTarget.contains(e.relatedTarget as Node)) hide();
                  }}
                >
                  {c.locked ? (
                    <button
                      type="button"
                      onClick={() => {
                        pick();
                        openLocked(c.id);
                      }}
                      aria-haspopup="dialog"
                      className={clsx("slate-link room-link whitespace-nowrap", hot !== null && i <= hot && "is-lit", hot === i && "is-hot")}
                    >
                      <RoomLabel n={c.n} title={c.title} />
                      <Lock className="ml-1.5 text-[color:var(--ink-mid)]" label="Locked" />
                    </button>
                  ) : (
                    <CutLink
                      href={c.href}
                      onClick={pick}
                      aria-haspopup="true"
                      aria-expanded={panel === c.id}
                      aria-current={current}
                      className={clsx(
                        "slate-link room-link whitespace-nowrap",
                        current && "text-[color:var(--ink)]",
                        hot !== null && i <= hot && "is-lit",
                        hot === i && "is-hot"
                      )}
                    >
                      <RoomLabel n={c.n} title={c.title} />
                    </CutLink>
                  )}
                  <AnimatePresence>
                    {panel === c.id && (
                      <m.div
                        initial={reduced ? false : { opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 4 }}
                        transition={{ duration: 0.18, ease: EASE_OUT_EXPO }}
                        className={clsx("absolute top-full z-50 pt-px", i >= rooms.length - 3 ? "right-0" : "left-0")}
                      >
                        <Panel chapter={c} onPick={pick} current={pathname} read={read} />
                      </m.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
            <span ref={cue} aria-hidden="true" className="room-cue" />
          </div>

          <button
            ref={menuButton}
            type="button"
            className="slate-link shrink-0 text-[color:var(--ink)] lg:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="system-menu"
          >
            {open ? "Close" : "Menu"}
          </button>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <m.div
            id="system-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.25 }}
            className="fixed inset-0 z-[45] overflow-y-auto bg-[color:var(--stage)] lg:hidden"
          >
            <nav className="px-6 pb-16 pt-24 md:px-14" aria-label="Menu">
              <div className="mb-6 flex items-baseline justify-between gap-4">
                <p className="mono">
                  The system <span className="text-[color:var(--ink-mid)]">/</span> {who}
                </p>
                <button
                  type="button"
                  className="slate-link text-[12px] text-[color:var(--ink)]"
                  onClick={() => {
                    pick();
                    // The palette listens for this; the menu is closed first so the two never stack.
                    setTimeout(() => window.dispatchEvent(new Event("tn:palette")), 80);
                  }}
                >
                  Find anything &rarr;
                </button>
              </div>
              {/* One column on a phone; two on a tablet, read down each
                  column, so the six rooms do not run one long list down a
                  screen that is mostly empty to the right. Each room is a
                  two-column grid -- its number, then its name with its pages
                  under it -- so the pages start where the name does. */}
              <ol className="sm:columns-2 sm:gap-x-12">
                {rooms.map((c, i) => {
                  const current = where(c);
                  return (
                    <m.li
                      key={c.id}
                      initial={reduced ? false : { opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.04 * i, duration: 0.5, ease: EASE_OUT_EXPO }}
                      className="grid break-inside-avoid grid-cols-[auto_1fr] gap-x-4 border-t border-[color:var(--rule)] py-5"
                    >
                      {c.locked ? (
                        <button
                          type="button"
                          onClick={() => {
                            pick();
                            openLocked(c.id);
                          }}
                          aria-haspopup="dialog"
                          className="col-span-2 grid grid-cols-subgrid items-baseline text-left"
                        >
                          <span className="mono">{c.n}</span>
                          <span className="flex items-baseline gap-4">
                            <span className="display text-[40px] text-[color:var(--ink-soft)]">{c.title}</span>
                            <Lock className="ml-auto self-center text-[color:var(--ink-mid)]" label="Locked" />
                          </span>
                        </button>
                      ) : (
                        <CutLink href={c.href} onClick={pick} aria-current={current} className="col-span-2 grid grid-cols-subgrid items-baseline">
                          <span className="mono">{c.n}</span>
                          <span className="flex items-baseline gap-4">
                            <span className="display text-[40px] text-[color:var(--ink)]">{c.title}</span>
                            {/* The lamp means one thing everywhere: you are here. */}
                            {current && <span className="lamp ml-auto self-center" aria-hidden="true" />}
                          </span>
                        </CutLink>
                      )}
                      <ul className="col-start-2 mt-3 flex flex-col gap-2">
                        {c.locked
                          ? c.pages.map((p) => (
                              <li key={p.slug} className="flex items-baseline gap-3 text-[15px] text-[color:var(--ink-mid)]">
                                <span className="mono">{pageNumber(c.id, p.slug)}</span>
                                {p.title}
                              </li>
                            ))
                          : c.pages.map((p, j) => {
                              const href = pageHref(c.id, p.slug);
                              const on = href === pathname;
                              return (
                                <li key={p.slug}>
                                  <CutLink
                                    href={href}
                                    onClick={pick}
                                    aria-current={on ? "page" : undefined}
                                    className={clsx("flex items-baseline gap-3 text-[15px]", on ? "text-[color:var(--ink)]" : "text-[color:var(--ink-soft)]")}
                                  >
                                    <span className="mono text-[color:var(--ink-mid)]">{c.id === "home" ? pad(j) : pageNumber(c.id, p.slug)}</span>
                                    {p.title}
                                    {on ? (
                                      <span className="lamp lamp-live ml-2 shrink-0 self-center" aria-hidden="true" />
                                    ) : read.has(c.id + "/" + p.slug) ? (
                                      <span className="ml-2 inline-block h-1.5 w-1.5 shrink-0 self-center rounded-full bg-[color:var(--ink)]" aria-label="Read" />
                                    ) : null}
                                  </CutLink>
                                </li>
                              );
                            })}
                      </ul>
                    </m.li>
                  );
                })}
              </ol>
            </nav>
          </m.div>
        )}
      </AnimatePresence>
    </>
  );
}
