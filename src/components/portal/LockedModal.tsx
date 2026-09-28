"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { EASE_OUT_EXPO } from "@/lib/design-tokens";
import { useFocusTrap } from "@/lib/use-focus-trap";
import { Lock } from "@/components/portal/Lock";
import { LOCKED_EVENT, type LockedDetail } from "@/lib/locked";
import { numberWord } from "@/lib/words";

/**
 * What a locked part opens: the commission.
 *
 * Not a paywall and not a page. A sheet laid on the desk under a struck
 * lamp -- the four parts the studio writes for one business, the one the
 * reader asked about marked with the playhead, and the brightest thing in
 * the room being the address they write to. The whole modal exists to make
 * that one line the obvious next move.
 *
 * The lamp is the only colour: --tally, the system's single accent, washed
 * in from above and gone by 38% of the sheet, so it never sits behind
 * running text. Worst case measured: --ink-mid on the washed ground is
 * 4.53:1, --ink is 13.6:1.
 *
 * Opened by an event rather than a prop, the way the palette is: the nav,
 * the footer and the home strip all need to reach it and none of them owns
 * it. See @/lib/locked.
 */
export type LockedPart = { n: string; anchor: string; title: string; text: string; takes: string };

// Spelled out so Tailwind generates them: one column per part still to come.
const COLS: Record<number, string> = { 1: "md:grid-cols-1", 2: "md:grid-cols-2", 3: "md:grid-cols-3", 4: "md:grid-cols-4" };

type Props = {
  parts: LockedPart[];
  needs: { title: string; items: string[] };
  ask: { title: string; text: string; time: string };
  contact: string;
  lead: string;
  kicker: string;
};

export function LockedModal({ parts, needs, ask, contact, lead, kicker }: Props) {
  const [open, setOpen] = useState(false);
  const [asked, setAsked] = useState<string | null>(null);
  const box = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  useFocusTrap(open, box, asked);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    const onOpen = (e: Event) => {
      const detail = (e as CustomEvent<LockedDetail>).detail;
      setAsked(detail?.anchor ?? null);
      setOpen(true);
    };
    window.addEventListener(LOCKED_EVENT, onOpen);
    return () => window.removeEventListener(LOCKED_EVENT, onOpen);
  }, []);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const key = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      // Captured and stopped, so the palette and the nav panel underneath
      // never see the same keystroke and close themselves as well.
      e.stopPropagation();
      close();
    };
    window.addEventListener("keydown", key, true);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", key, true);
    };
  }, [open, close]);

  // The nav and the footer send a room ("audit", "content"); a card on the
  // strip sends a part ("ideas"). Either way, one row carries the playhead.
  const marked = (p: LockedPart) => asked === p.anchor || (asked === "audit" && p.anchor === "audit") || (asked === "content" && p.anchor === "ideas");
  // Only the parts still to be written are listed, so the headline counts them.
  const word = numberWord(parts.length);
  const howMany = word.charAt(0).toUpperCase() + word.slice(1) + (parts.length === 1 ? " part" : " parts");

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="locked"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduced ? 0 : 0.22 }}
          className="fixed inset-0 z-[95] flex items-end justify-center bg-[rgba(6,6,7,0.84)] backdrop-blur-md md:items-center md:p-6"
          onClick={close}
        >
          <motion.div
            ref={box}
            role="dialog"
            aria-modal="true"
            aria-labelledby="locked-title"
            tabIndex={-1}
            onClick={(e) => e.stopPropagation()}
            initial={reduced ? false : { clipPath: "inset(0 0 100% 0)", y: 14 }}
            animate={{ clipPath: "inset(0 0 0% 0)", y: 0 }}
            // Under reduced motion the exit is a cut. Without its own
            // transition it inherits the 0.62s entrance below, and a reader
            // who asked for no motion watched the sheet fade for half a second.
            exit={reduced ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, y: 10, transition: { duration: 0.2, ease: "easeIn" } }}
            transition={{ duration: 0.62, ease: EASE_OUT_EXPO }}
            className="relative flex max-h-[94svh] w-full max-w-[1120px] flex-col overflow-y-auto overscroll-contain border border-[color:var(--rule-strong)] bg-[color:var(--stage-2)] outline-none"
          >
            {/* The lamp strikes: one wash of the system's only colour, from
                above, gone before any running text starts. Then the rule
                along the top edge draws itself, the way a timeline does. */}
            <span aria-hidden="true" className="lamp-wash pointer-events-none absolute inset-x-0 top-0 h-[38%]" />
            <span aria-hidden="true" className="tally-rule pointer-events-none absolute inset-x-0 top-0 h-px bg-[color:var(--tally)]" />

            <div className="relative flex items-center justify-between gap-6 px-6 pt-6 md:px-12 md:pt-10">
              <p className="mono flex items-center gap-2 text-[color:var(--ink)]">
                <span className="locked-lock inline-flex text-[color:var(--tally)]">
                  <Lock />
                </span>
                {kicker}
              </p>
              <button type="button" onClick={close} className="slate-link shrink-0 text-[color:var(--ink)]" data-cursor="Close">
                Close <span className="ml-1 text-[color:var(--ink-mid)] max-md:hidden">esc</span>
              </button>
            </div>

            <div className="relative px-6 pb-10 pt-8 md:px-12 md:pb-12 md:pt-10">
              {/* Band one: what this is, and the one thing to do about it,
                  side by side -- so the address is level with the headline
                  instead of at the foot of a column, and nothing floats. */}
              <div className="grid gap-10 md:grid-cols-12 md:items-end md:gap-x-14">
                <div className="md:col-span-7">
                  <h2 id="locked-title" className="display text-[clamp(44px,5.4vw,80px)] leading-[0.9] text-[color:var(--ink)]">
                    {howMany}, written for <span className="em-serif">you.</span>
                  </h2>
                  <p className="statement em-serif mt-6 max-w-[36ch] text-[clamp(19px,1.9vw,25px)] leading-[1.22] text-[color:var(--ink-soft)]">{lead}</p>
                </div>

                <motion.div
                  initial={reduced ? false : { opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: reduced ? 0 : 0.34, duration: 0.6, ease: EASE_OUT_EXPO }}
                  className="md:col-span-5"
                >
                  <a href={"mailto:" + contact} className="ask-plate group relative block border border-[color:var(--rule-strong)] bg-[color:var(--stage-3)] p-6 md:p-7" data-cursor="Write">
                    <span className="mono flex items-center justify-between gap-4 text-[color:var(--ink-mid)]">
                      {ask.title}
                      <span className="flex items-center gap-2 text-[color:var(--ink)]">
                        <span className="lamp lamp-live" aria-hidden="true" />
                        Your team
                      </span>
                    </span>
                    <span className="display display-light mt-5 flex flex-wrap items-baseline gap-x-3 break-all text-[clamp(26px,2.5vw,34px)] leading-none text-[color:var(--ink)]">
                      {contact}
                      <span aria-hidden="true" className="mono text-[16px] transition-transform duration-500 group-hover:translate-x-2">
                        &rarr;
                      </span>
                    </span>
                    <span className="mt-5 block text-[14px] leading-relaxed text-[color:var(--ink-soft)]">{ask.text}</span>
                  </a>
                  <p className="mt-4 text-[13px] leading-relaxed text-[color:var(--ink-mid)]">{ask.time}</p>
                </motion.div>
              </div>

              {/* Band two: the parts still to come, as frames on one strip.
                  The one they opened carries the playhead along its top edge. */}
              <ol className={"mt-12 grid border-t border-[color:var(--rule)] md:mt-14 " + COLS[Math.min(parts.length, 4)]}>
                {parts.map((p, i) => {
                  const here = marked(p);
                  return (
                    <motion.li
                      key={p.anchor}
                      initial={reduced ? false : { opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: reduced ? 0 : 0.2 + i * 0.07, duration: 0.55, ease: EASE_OUT_EXPO }}
                      className={
                        "relative flex flex-col gap-3 border-b border-[color:var(--rule)] px-4 py-5 md:border-b-0 md:border-l md:px-5 md:py-6 md:first:border-l-0 " +
                        (here ? "bg-[color:var(--stage-3)]" : "")
                      }
                    >
                      {here && <span aria-hidden="true" className="absolute inset-x-0 top-[-1px] h-[2px] bg-[color:var(--tally)] shadow-[0_0_12px_var(--tally-glow)]" />}
                      <span className="mono flex items-center justify-between gap-3 text-[color:var(--ink-mid)]">
                        {p.n}
                        <Lock label="Locked" />
                      </span>
                      <span className={"subhead " + (here ? "text-[color:var(--ink)]" : "text-[color:var(--ink-soft)]")}>{p.title}</span>
                      <p className="text-[14px] leading-relaxed text-[color:var(--ink-mid)]">{here ? p.text : p.takes}</p>
                    </motion.li>
                  );
                })}
              </ol>

              {/* Band three: what the studio needs before it can start. */}
              <div className="mt-10 grid gap-6 border-t border-[color:var(--rule)] pt-8 md:mt-0 md:grid-cols-12 md:gap-x-14">
                <p className="mono text-[color:var(--ink-mid)] md:col-span-3">{needs.title}</p>
                <ul className="grid gap-x-10 gap-y-3.5 sm:grid-cols-2 md:col-span-9">
                  {needs.items.map((item, i) => (
                    <motion.li
                      key={item}
                      initial={reduced ? false : { opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: reduced ? 0 : 0.5 + i * 0.05, duration: 0.5, ease: EASE_OUT_EXPO }}
                      className="flex items-start gap-3.5 text-[15px] leading-relaxed text-[color:var(--ink-soft)] [text-wrap:pretty]"
                    >
                      <span className="box" aria-hidden="true" />
                      {item}
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
