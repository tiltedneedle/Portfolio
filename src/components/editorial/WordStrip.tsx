"use client";

import { useRef } from "react";
import { m, useAnimationFrame, useInView, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform, useVelocity } from "framer-motion";

// The reference closes on a slow serif-italic crawl over dark. Decorative,
// hidden from assistive tech, frozen under reduced motion. Our own words.
const DEFAULT_WORDS = "hook. shoot. cut. post. repeat. ";

// The crawl's own pace: one run of the words every 26 seconds, in % a second.
const PACE = -100 / 26;
// Keep the runs inside (-100%, 0], where the second stands in for the first.
const wrap = (v: number) => {
  const r = v % 100;
  return r > 0 ? r - 100 : r;
};

/**
 * On a jog shuttle, like the strip behind the name on the home page: the
 * words crawl at their own pace and the scroll drives them -- down runs
 * them on, up runs them back -- leaning into their travel, then settling
 * back to the crawl when the wheel stops. Runs only while on screen, and
 * moves by motion values alone, so nothing re-renders per frame. Held
 * still under reduced motion by CSS (.word-run in globals.css), not by a
 * different tree, so the server's markup and the client's never differ.
 */
export function WordStrip({ words = DEFAULT_WORDS }: { words?: string }) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const onScreen = useInView(ref);
  const x = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smooth = useSpring(velocity, { damping: 50, stiffness: 400 });
  // Scroll speed as a multiple of the crawl. Unclamped: a hard flick runs
  // the words hard.
  const boost = useTransform(smooth, [-2400, 0, 2400], [-10, 0, 10], { clamp: false });
  const skewX = useTransform(smooth, [-2400, 0, 2400], [-7, 0, 7]);
  const xPercent = useTransform(x, (v) => v + "%");

  useAnimationFrame((_, delta) => {
    if (reduced || !onScreen) return;
    // A long gap (a background tab coming back) is not a reason to jump.
    const dt = Math.min(delta, 64) / 1000;
    x.set(wrap(x.get() + PACE * (1 + boost.get()) * dt));
  });

  const run = words.repeat(4);
  return (
    <div ref={ref} aria-hidden="true" className="overflow-hidden border-y border-white/10 bg-[color:var(--slab-deep)] py-5">
      <div className="flex overflow-hidden whitespace-nowrap">
        <m.span className="word-run em-serif shrink-0 text-[32px] text-white/90 md:text-[44px]" style={{ x: xPercent, skewX }}>
          {run}
        </m.span>
        <m.span className="word-run em-serif shrink-0 text-[32px] text-white/90 md:text-[44px]" style={{ x: xPercent, skewX }}>
          {run}
        </m.span>
      </div>
    </div>
  );
}
