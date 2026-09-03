"use client";

import { motion, useReducedMotion } from "framer-motion";

// The reference closes on a slow serif-italic crawl over dark. Decorative,
// hidden from assistive tech, frozen under reduced motion. Our own words.
const WORDS = "hook. shoot. cut. post. repeat. ";

export function WordStrip() {
  const reduced = useReducedMotion();
  const scroll = reduced
    ? {}
    : {
        animate: { x: ["0%", "-100%"] },
        transition: { duration: 26, ease: "linear" as const, repeat: Infinity },
      };
  const run = WORDS.repeat(4);

  return (
    <div
      aria-hidden="true"
      className="bg-[color:var(--slab-deep)] border-y border-white/10 py-5 overflow-hidden"
    >
      <div className="flex overflow-hidden whitespace-nowrap">
        <motion.span
          className="em-serif shrink-0 text-[32px] md:text-[44px] text-white/90"
          {...scroll}
        >
          {run}
        </motion.span>
        <motion.span
          className="em-serif shrink-0 text-[32px] md:text-[44px] text-white/90"
          {...scroll}
        >
          {run}
        </motion.span>
      </div>
    </div>
  );
}
