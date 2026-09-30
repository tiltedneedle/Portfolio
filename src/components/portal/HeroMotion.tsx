"use client";

import { useRef, type ReactNode } from "react";
import { m, useAnimationFrame, useInView, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform, useVelocity } from "framer-motion";

/**
 * The hero, as an edit suite would move it.
 *
 * Scrub: the film strip behind the name is on a jog shuttle. It drifts on its
 * own at the speed the CSS drift always had; scrolling scrubs it. Scroll
 * velocity feeds the speed (down runs the reel forward, up runs it back) and
 * the strip leans into its own travel, then settles back to the drift when
 * the wheel stops. As the hero leaves the screen the strip also falls behind
 * and drops out of focus while the name stays sharp: the pull focus that
 * hands the page to what follows.
 *
 * Lift: the name leaves a little faster than the page, so the two layers
 * separate as you go.
 *
 * Motion values only, never React state, so nothing re-renders per frame.
 * The strip runs only while it is on screen. The markup is identical on the
 * server and the client; a reader who asked for stillness is held still by
 * CSS (the reduced-motion block in globals.css), not by a different tree,
 * so hydration never meets a mismatch.
 */

// The old CSS drift: half of the doubled row every 160 seconds, in % per second.
const DRIFT = -50 / 160;
// Keep the row inside (-50%, 0], where the second copy stands in for the first.
const wrap = (v: number) => {
  const r = v % 50;
  return r > 0 ? r - 50 : r;
};

// The screen's height, read when the scroll first needs it and forgotten
// on a resize. On a phone, reading window.innerHeight lays the whole page
// out on the spot, and this is asked for on every frame of scrolling.
let screenH = 0;
function screenHeight() {
  if (typeof window === "undefined") return 900;
  if (!screenH) {
    screenH = window.innerHeight;
    window.addEventListener("resize", () => (screenH = 0), { once: true });
  }
  return screenH;
}

export function Scrub({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const onScreen = useInView(ref);
  const x = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smooth = useSpring(velocity, { damping: 50, stiffness: 400 });
  // Scroll speed (px/s) as a multiple of the drift. Unclamped: a hard flick
  // should run the reel hard, which is the point of a jog shuttle.
  const boost = useTransform(smooth, [-2400, 0, 2400], [-24, 0, 24], { clamp: false });
  // It leans into its own travel, and never so far that the stills distort.
  const skewX = useTransform(smooth, [-2400, 0, 2400], [-5, 0, 5]);
  // Over the first screen of scroll the strip falls behind and goes soft.
  // At the top it is 0 whatever the screen's height, so the height is not
  // read as the page hydrates.
  const out = useTransform(scrollY, (v) => (v <= 0 ? 0 : Math.min(1, v / screenHeight())));
  const y = useTransform(out, [0, 1], [0, 120]);
  const filter = useTransform(out, [0, 1], ["blur(0px)", "blur(9px)"]);
  const opacity = useTransform(out, [0, 1], [1, 0.35]);
  const xPercent = useTransform(x, (v) => v + "%");

  useAnimationFrame((_, delta) => {
    if (reduced || !onScreen) return;
    // A long gap (a background tab coming back) is not a reason to jump.
    const dt = Math.min(delta, 64) / 1000;
    x.set(wrap(x.get() + DRIFT * (1 + boost.get()) * dt));
  });

  return (
    <m.div className="hero-band" style={{ y, filter, opacity }}>
      <m.div ref={ref} className="flex w-max opacity-50" style={{ x: xPercent, skewX }}>
        {children}
      </m.div>
    </m.div>
  );
}

export function Lift({ children }: { children: ReactNode }) {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, (v) => -Math.min(Math.max(v, 0), 1200) * 0.12);
  return (
    <m.div className="lift relative" style={{ y }}>
      {children}
    </m.div>
  );
}
