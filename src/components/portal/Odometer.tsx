"use client";

import { useEffect, useRef, type CSSProperties } from "react";

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
 * Reduced motion never winds it back. Decorative: the reels are aria-hidden,
 * because a screen reader would read "0 1 2 3 4 5 6 7 8 9" thirty times. The
 * caller says the number in words.
 */
const TURNS = 3;
const REEL = Array.from({ length: TURNS * 10 }, (_, i) => i % 10);

export function Odometer({ value, className = "" }: { value: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  // "en-US" pinned, so the server and the browser group the digits alike and
  // hydration never meets a figure it did not render.
  const figure = value.toLocaleString("en-US");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Nothing to let the reels go with: never wind them back. A figure that
    // cannot roll in must not be left reading zero.
    if (typeof IntersectionObserver === "undefined") return;
    // Already on screen, or above it: leave it be.
    if (el.getBoundingClientRect().top < window.innerHeight) return;
    el.classList.add("odo-wait");
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        // Force the wound-back state to be computed, then let go, in the same
        // turn, not two animation frames later: a browser producing no frames
        // would otherwise hold the reels wound back indefinitely.
        void el.getBoundingClientRect();
        el.classList.remove("odo-wait");
      },
      { rootMargin: "0px 0px -15% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  let reel = 0;
  return (
    <span ref={ref} aria-hidden="true" className={"odo " + className}>
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
              {REEL.map((d, k) => (
                <span key={k}>{d}</span>
              ))}
            </span>
          </span>
        );
      })}
    </span>
  );
}
