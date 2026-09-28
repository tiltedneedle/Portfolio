"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { CutLink } from "@/components/room/CutLink";
import { ReadCount } from "@/components/portal/ReadMark";
import { Still } from "@/components/portal/Still";
import { Lock } from "@/components/portal/Lock";
import { openLocked } from "@/lib/locked";
import { numberWord } from "@/lib/words";

/**
 * What you have access to: the parts of the system racked on a strip.
 * On desktop the section pins and vertical scroll shuttles the strip
 * sideways, with a ruler underneath reading where you are. On a phone the
 * cards stack. Lifted from the studio site's film sequence, which is the
 * move the client liked most.
 *
 * Every part of the system is on the strip from the first day, so a client
 * can see the whole shape of what they have. The four parts the studio
 * writes for one business are shown LOCKED until they are written: the name
 * and what will be in it, and nothing of anyone's. A locked card is a
 * button, not a link -- there is no page behind it -- and it opens the
 * modal that explains how the part gets written.
 */
/**
 * `still` is the frame this part opens on, where the part is one the studio
 * has filmed. The personalised parts are documents and carry none.
 * `locked` means this client has nothing in it yet; `anchor` is which of
 * the four the modal should open on. `list` and `after` carry the brief's
 * own lists (the eight Create steps, the four pillars) and a line it sets
 * below one.
 */
export type AccessItem = {
  n: string;
  title: string;
  href?: string;
  text: string;
  list?: string[];
  after?: string;
  still?: string;
  meta?: string;
  locked?: boolean;
  anchor?: string;
};

/** A list of short lines sets in two columns; one long line keeps it to one. */
const twoUp = (list: string[]) => list.length >= 4 && list.every((l) => l.length <= 24);

/** `counts` is what each personalised card has so far, keyed by href ("4 of 13 written"). */
export function AccessStrip({ items, counts = {}, readKeys = {} }: { items: AccessItem[]; counts?: Record<string, ReactNode>; readKeys?: Record<string, string[]> }) {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [range, setRange] = useState(0);
  const [mobile, setMobile] = useState(false);
  const [active, setActive] = useState(0);
  const n = items.length;
  // One card is not a scale: the ruler and the shuttle divide by at least one.
  const span = Math.max(1, n - 1);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const measure = () => {
      const isMobile = !window.matchMedia("(min-width: 768px)").matches;
      // A reader who asked for stillness is not shuttled 400vw sideways off
      // their vertical scroll. With no range the section has no extra
      // height, the track does not transform, and focusCard no-ops.
      const still = mq.matches;
      setMobile(isMobile);
      setRange(isMobile || still ? 0 : Math.max(0, el.scrollWidth - window.innerWidth));
    };
    measure();
    let live = true;
    // A font that never loads must not leave an unhandled rejection behind.
    document.fonts?.ready
      .then(() => {
        if (live) measure();
      })
      .catch(() => {});
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    mq.addEventListener("change", measure);
    return () => {
      live = false;
      ro.disconnect();
      window.removeEventListener("resize", measure);
      mq.removeEventListener("change", measure);
    };
  }, []);

  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -range]);
  const playhead = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const i = Math.min(span, Math.max(0, Math.round(p * span)));
    setActive((prev) => (prev === i ? prev : i));
  });

  const focusCard = (i: number) => {
    const el = section.current;
    if (!el || mobile || range === 0) return;
    requestAnimationFrame(() => {
      const top = el.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: top + (range * i) / span, behavior: "auto" });
    });
  };

  if (n === 0) return null;
  const here = items[Math.min(active, n - 1)];

  return (
    <section
      id="access"
      ref={section}
      className="shuttle relative scroll-mt-16 bg-[color:var(--stage)]"
      style={{ height: range > 0 ? "calc(100svh + " + range + "px)" : undefined }}
    >
      <div className="shuttle-pin md:sticky md:top-0 md:flex md:h-[100svh] md:flex-col md:justify-center md:overflow-clip">
        <motion.div
          ref={track}
          style={mobile ? undefined : { x }}
          className="shuttle-track flex flex-col md:w-max md:flex-row md:items-stretch md:gap-5 md:px-[8vw]"
        >
          <div className="w-full shrink-0 px-6 py-20 md:flex md:w-[34vw] md:flex-col md:justify-center md:py-0 md:pr-14">
            <p className="mono">
              02 &mdash; {numberWord(n)} {n === 1 ? "part" : "parts"}
            </p>
            {/* The brief's own heading, "WHAT YOU HAVE ACCESS TO". The count
                that used to be the headline is the label above it now. */}
            <h2 className="display mt-4 text-[clamp(48px,5.4vw,96px)] leading-[0.9]">
              What you have <span className="em-serif">access to.</span>
            </h2>
            <p className="shuttle-hint mono mt-8 max-md:hidden">Scroll to shuttle &middot; click to open</p>
          </div>

          {items.map((it, i) => {
            const shell =
              "shuttle-card group relative flex min-h-[380px] w-full flex-col overflow-hidden border bg-[color:var(--stage-2)] p-6 text-left transition-colors duration-500 md:h-[74svh] md:w-[calc(74svh*0.8)] md:p-8 " +
              (active === i && !mobile && range > 0 ? "border-[color:var(--rule-strong)]" : "border-[color:var(--rule)] hover:border-[color:var(--rule-strong)]");
            const face = (
              <>
                {/* A part the studio filmed opens on its own frame: a header
                    across the top of the card, in the flow, so the words are
                    always laid out below it and never on it. (It used to sit
                    behind the top half, which was safe while the cards said
                    one short line; with the brief's full descriptions the
                    text would have run up over the picture on a laptop.) A
                    part that is a document has no frame, and keeps the
                    numeral instead.
                    The frame gives way before the words do: 21svh where there
                    is room, but never so tall that it leaves the card less
                    than 400px for its text. At 1366x650 the Create card, with
                    all eight of the brief's steps, ran 26px off its own foot. */}
                {it.still && !it.locked ? (
                  <span aria-hidden="true" className="pointer-events-none relative -mx-6 -mt-6 mb-6 block h-[168px] shrink-0 overflow-hidden md:-mx-8 md:-mt-8 md:mb-7 md:h-[max(40px,min(21svh,calc(74svh_-_400px)))]">
                    {/* A wide slice of a 9:16 still, taken at 22% of its height.
                        The very top is ceiling and sky once the frame is this
                        short (the slice is a fifth of the picture); the middle
                        is where the burnt-in captions run. A fifth of the way
                        down is where a vertical video keeps its face. */}
                    <Still src={it.still} sizes="(min-width:768px) 600px, 100vw" className="object-cover object-[center_22%] opacity-70" />
                    <span className="absolute inset-0 bg-gradient-to-b from-[rgba(11,11,12,0.6)] via-[rgba(11,11,12,0.1)] to-[color:var(--stage-2)]" />
                    {/* The slate rides on the frame, so it takes full ink:
                        --ink-mid has no contrast headroom over a picture. */}
                    <span className="mono absolute inset-x-6 top-6 flex items-baseline justify-between gap-4 text-[color:var(--ink)] md:inset-x-8 md:top-8">
                      <span>{it.n}</span>
                      {it.meta && <span>{it.meta}</span>}
                    </span>
                  </span>
                ) : (
                  <>
                    <span aria-hidden="true" className="numeral pointer-events-none absolute -right-2 top-1/2 -translate-y-1/2 text-[200px] opacity-50 md:text-[240px]" data-n={it.n} />
                    <span className="mono relative flex items-baseline justify-between gap-4">
                      <span>{it.n}</span>
                      {it.locked ? (
                        <span className="inline-flex items-center gap-1.5 text-[color:var(--ink-mid)]">
                          <Lock />
                          Not yours yet
                        </span>
                      ) : (
                        it.meta && <span className="text-[color:var(--ink-mid)]">{it.meta}</span>
                      )}
                    </span>
                  </>
                )}
                <span className="relative mt-auto block pt-6">
                  <span className={"display display-light block text-[clamp(40px,3.2vw,52px)] leading-[0.92] " + (it.locked ? "text-[color:var(--ink-soft)] transition-colors duration-500 group-hover:text-[color:var(--ink)]" : "text-[color:var(--ink)]")}>{it.title}</span>
                  <span className="mt-4 block text-[15px] leading-relaxed text-[color:var(--ink-mid)] [text-wrap:pretty]">{it.text}</span>
                  {it.list && (
                    <span className={"mt-3 grid gap-x-5 gap-y-1 text-[14px] leading-snug text-[color:var(--ink-soft)] " + (twoUp(it.list) ? "grid-cols-2" : "grid-cols-1")}>
                      {it.list.map((l) => (
                        <span key={l} className="flex items-baseline gap-2">
                          <span aria-hidden="true" className="text-[color:var(--ink-faint)]">&mdash;</span>
                          {l}
                        </span>
                      ))}
                    </span>
                  )}
                  {it.after && <span className="mt-3 block text-[15px] leading-relaxed text-[color:var(--ink-mid)]">{it.after}</span>}
                  <span className="mono mt-6 flex items-baseline justify-between gap-4 text-[color:var(--ink-soft)] transition-colors group-hover:text-[color:var(--ink)]">
                    <span>
                      {it.locked ? "Ask for it" : "Open"} <span aria-hidden="true">&#8599;</span>
                    </span>
                    {!it.href ? null : readKeys[it.href] ? <ReadCount keys={readKeys[it.href]} /> : counts[it.href] && <span className="text-[color:var(--ink-mid)]">{counts[it.href]}</span>}
                  </span>
                </span>
              </>
            );
            return (
              <div key={it.n} className="shuttle-cell w-full shrink-0 px-6 py-3 md:w-auto md:px-0 md:py-0">
                {it.href ? (
                  <CutLink href={it.href} onFocus={() => focusCard(i)} data-cursor="Open" className={shell}>
                    {face}
                  </CutLink>
                ) : (
                  <button type="button" onFocus={() => focusCard(i)} onClick={() => openLocked(it.anchor)} aria-haspopup="dialog" data-cursor="Ask" className={shell}>
                    {face}
                  </button>
                )}
              </div>
            );
          })}
        </motion.div>

        <div className="shuttle-ruler mx-[8vw] mt-8 max-md:hidden">
          <div className="relative h-6 border-t border-[color:var(--rule-strong)]">
            {items.map((it, i) => (
              <span
                key={it.n}
                aria-hidden="true"
                className="absolute top-0 mono text-[10px]"
                style={{ left: (i / span) * 100 + "%", transform: "translateX(-50%)" }}
              >
                <span className="mx-auto block h-2 w-px bg-[color:var(--rule-strong)]" />
                <span className="mt-1 block">{it.n}</span>
              </span>
            ))}
            <motion.span
              aria-hidden="true"
              style={{ left: playhead }}
              className="absolute -top-px h-4 w-[2px] -translate-x-1/2 bg-[color:var(--tally)] shadow-[0_0_8px_var(--tally-glow)]"
            />
          </div>
          <div className="mono mt-3 flex items-center justify-between">
            <span>
              Part {here.n} / {String(n).padStart(2, "0")}
            </span>
            <span className="text-[color:var(--ink-soft)]">{here.title}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
