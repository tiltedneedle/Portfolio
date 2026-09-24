"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { CutLink } from "@/components/room/CutLink";
import { Wordmark } from "@/components/room/Wordmark";
import { chapters, pageHref, pageNumber, type Chapter } from "@/content/chapters";
import { useClient } from "@/components/portal/ClientContext";
import { shortName } from "@/content/clients/types";
import { cn } from "@/lib/utils";
import { EASE_OUT_EXPO } from "@/lib/design-tokens";
import { useRead } from "@/lib/read";
import { seenKey } from "@/components/portal/RecentList";

/**
 * The nav is the system's table of contents: six numbered rooms, each with
 * a panel listing its pages. On a pointer the panel opens on hover and the
 * hover grammar from the studio site carries over (the hovered room grows;
 * it and everything left of it drop to the serif italic). On a keyboard the
 * panel opens on focus. On a phone the whole contents fold into one screen.
 */
const pad = (i: number) => String(i + 1).padStart(2, "0");

function Panel({ chapter: c, onPick, who, current, read }: { chapter: Chapter; onPick: () => void; who: string; current: string; read: Set<string> }) {
  return (
    <div className="panel w-[360px] p-2">
      <div className="mono flex items-baseline justify-between px-3 pb-2 pt-3">
        <span>
          {c.n} &mdash; {c.title}
        </span>
        {c.personalised && (
          <span className="flex items-center gap-2 text-[color:var(--ink)]">
            <span className="lamp" aria-hidden="true" />
            For {who}
          </span>
        )}
        {!c.personalised && c.id !== "home" && (
          <span className="text-[color:var(--ink-mid)]">
            {c.pages.filter((p) => read.has(c.id + "/" + p.slug)).length} of {c.pages.length} read
          </span>
        )}
      </div>
      <p className="px-3 pb-3 text-[13px] leading-snug text-[color:var(--ink-mid)]">{c.blurb}</p>
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
                className={cn(
                  "flex items-baseline gap-3 border-b border-[color:var(--rule)] px-3 py-2.5 text-[15px] transition-colors last:border-b-0 hover:bg-[color:var(--stage-3)] hover:text-[color:var(--ink)]",
                  here ? "text-[color:var(--ink)]" : "text-[color:var(--ink-soft)]"
                )}
              >
                <span className="mono w-[5ch] shrink-0 text-[color:var(--ink-mid)]">{c.id === "home" ? pad(j) : pageNumber(c.id, p.slug)}</span>
                {p.title}
                {here ? (
                  <span className="lamp ml-auto shrink-0 self-center" aria-hidden="true" />
                ) : read.has(c.id + "/" + p.slug) ? (
                  <span className="ml-auto inline-block h-1.5 w-1.5 shrink-0 self-center rounded-full bg-[color:var(--ink)]" aria-label="Read" />
                ) : null}
              </CutLink>
            </li>
          );
        })}
      </ul>
    </div>
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
      <span className="lamp" aria-hidden="true" />
      <span className="sr-only">New additions since your last visit</span>
    </span>
  );
}

export function PortalNav({ latest }: { latest?: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [panel, setPanel] = useState<string | null>(null);
  const [hot, setHot] = useState<number | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pathname = usePathname();
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
    update();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", key);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", key);
    };
  }, [open]);

  useEffect(() => {
    if (!panel) return;
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPanel(null);
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

  const isActive = (c: Chapter) => (c.id === "home" ? pathname === "/" : pathname.startsWith(c.href));

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-colors duration-500",
          scrolled && !open ? "border-b border-[color:var(--rule)] bg-[rgba(11,11,12,0.82)] backdrop-blur-xl" : "border-b border-transparent bg-transparent"
        )}
      >
        <nav className="flex h-14 items-center justify-between px-6 md:h-16 md:px-14" aria-label="Primary">
          <CutLink href="/" className="inline-flex items-center gap-3" aria-label="Home" onClick={pick}>
            <Wordmark />
            <NewLamp latest={latest} />
            <span className="mono hidden text-[color:var(--ink-mid)] lg:inline">
              <span className="text-[color:var(--ink-mid)]">&times;</span> {who}
            </span>
          </CutLink>

          <div
            className="hidden items-center gap-7 md:flex"
            onPointerLeave={() => {
              setHot(null);
              hide();
            }}
          >
            {chapters.map((c, i) => (
              <div
                key={c.id}
                className="relative"
                onPointerEnter={() => {
                  setHot(i);
                  show(c.id);
                }}
                onFocus={() => show(c.id)}
                onBlur={(e) => {
                  if (!e.currentTarget.contains(e.relatedTarget as Node)) hide();
                }}
              >
                <CutLink
                  href={c.href}
                  onClick={pick}
                  aria-haspopup="true"
                  aria-expanded={panel === c.id}
                  className={cn(
                    "slate-link room-link",
                    isActive(c) && "text-[color:var(--ink)]",
                    hot !== null && i <= hot && "is-lit",
                    hot === i && "is-hot"
                  )}
                >
                  <span aria-hidden="true" className="mr-1.5 text-[color:var(--ink-mid)]">
                    {c.n}
                  </span>
                  {c.title}
                </CutLink>
                <AnimatePresence>
                  {panel === c.id && (
                    <motion.div
                      initial={reduced ? false : { opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 4 }}
                      transition={{ duration: 0.18, ease: EASE_OUT_EXPO }}
                      className={cn("absolute top-full z-50 pt-4", i >= chapters.length - 3 ? "right-0" : "left-0")}
                    >
                      <Panel chapter={c} onPick={pick} who={who} current={pathname} read={read} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          <button
            type="button"
            className="slate-link text-[color:var(--ink)] md:hidden"
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
          <motion.div
            id="system-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.25 }}
            className="fixed inset-0 z-40 overflow-y-auto bg-[color:var(--stage)] md:hidden"
          >
            <nav className="px-6 pb-16 pt-24" aria-label="Menu">
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
              <ol className="flex flex-col">
                {chapters.map((c, i) => (
                  <motion.li
                    key={c.id}
                    initial={reduced ? false : { opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.04 * i, duration: 0.5, ease: EASE_OUT_EXPO }}
                    className="border-t border-[color:var(--rule)] py-5"
                  >
                    <CutLink href={c.href} onClick={pick} className="flex items-baseline gap-4">
                      <span className="mono">{c.n}</span>
                      <span className="display text-[40px] text-[color:var(--ink)]">{c.title}</span>
                      {c.personalised && <span className="lamp ml-auto" aria-hidden="true" />}
                    </CutLink>
                    <ul className="mt-3 flex flex-col gap-2 pl-[calc(2ch+16px)]">
                      {c.pages.map((p, j) => {
                        const href = pageHref(c.id, p.slug);
                        const here = href === pathname;
                        return (
                          <li key={p.slug}>
                            <CutLink
                              href={href}
                              onClick={pick}
                              aria-current={here ? "page" : undefined}
                              className={cn("flex items-baseline gap-3 text-[15px]", here ? "text-[color:var(--ink)]" : "text-[color:var(--ink-soft)]")}
                            >
                              <span className="mono text-[color:var(--ink-mid)]">{c.id === "home" ? pad(j) : pageNumber(c.id, p.slug)}</span>
                              {p.title}
                              {here ? (
                                <span className="lamp ml-2 shrink-0 self-center" aria-hidden="true" />
                              ) : read.has(c.id + "/" + p.slug) ? (
                                <span className="ml-2 inline-block h-1.5 w-1.5 shrink-0 self-center rounded-full bg-[color:var(--ink)]" aria-label="Read" />
                              ) : null}
                            </CutLink>
                          </li>
                        );
                      })}
                    </ul>
                  </motion.li>
                ))}
              </ol>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
