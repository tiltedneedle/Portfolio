"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { belowFold } from "@/lib/below-fold";
import { groupDigits } from "@/lib/digits";

/**
 * A number that arrives the way a counter settles: every digit on its own
 * reel, each reel spinning two full turns and landing, left to right.
 *
 * It can never read wrong. Each reel carries its digit three times over; at
 * rest it shows the last copy, and a figure still below the fold is wound
 * back only to the FIRST copy -- the same digit, two turns earlier. So the
 * wound-back figure reads exactly what the landed one does, and if the spin
 * never runs (no script, a background tab, a browser producing no frames, a
 * link preview or a screenshot tool), the number is still right. An earlier
 * build wound the reels back to zero, and a throttled browser left the
 * studio's five billion reading 0,000,000,000.
 *
 * `now` is for a figure in a page's opening titles, which is on screen
 * from the start: it lands as the page opens instead of when it is scrolled
 * to, by a CSS animation from the same wound-back copy (the scene titles
 * block in globals.css), so it waits out the slate and the cut like the
 * titles around it.
 *
 * Reduced motion never winds it back. Decorative: the reels are aria-hidden,
 * because a screen reader would read "0 1 2 3 4 5 6 7 8 9" thirty times. The
 * caller says the number in words.
 */
const TURNS = 3;
// A reel is one line of text a digit deep, not thirty elements: on the home
// page thirty spans a digit were a fifth of everything the page hydrated.
const REEL = Array.from({ length: TURNS * 10 }, (_, i) => i % 10).join("\n");

export function Odometer({ value, className = "", now = false }: { value: number; className?: string; now?: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  // Grouped the same on the server and in the browser, and without Intl,
  // whose first use on a page loads the locale's data (lib/digits).
  const figure = groupDigits(value);

  useEffect(() => {
    const el = ref.current;
    if (!el || now) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Without an observer to let the reels go, belowFold never winds them
    // back.
    return belowFold(el, "0px 0px -15% 0px", {
      hold: () => el.classList.add("odo-wait"),
      release: () => {
        // Force the wound-back state to be computed, then let go, in the same
        // turn, not two animation frames later: a browser producing no frames
        // would otherwise hold the reels wound back indefinitely.
        void el.getBoundingClientRect();
        el.classList.remove("odo-wait");
      },
    });
  }, [now]);

  let reel = 0;
  return (
    <span ref={ref} aria-hidden="true" className={"odo " + (now ? "odo-now " : "") + className}>
      {[...figure].map((ch, i) => {
        if (!/\d/.test(ch)) {
          return (
            <span key={i} className="odo-sep">
              {ch}
            </span>
          );
        }
        const at = reel++;
        // At rest on the last copy of the digit; wound back to the first.
        const d = Number(ch);
        const style = { "--odo-d": d, "--odo-land": (TURNS - 1) * 10 + d, "--odo-i": at } as CSSProperties;
        return (
          <span key={i} className="odo-col">
            <span className="odo-reel" style={style}>
              {REEL}
            </span>
          </span>
        );
      })}
    </span>
  );
}
