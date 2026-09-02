"use client";

import { motion, useReducedMotion } from "framer-motion";

// A slow lowercase word crawl closes the page before the dark contact slab —
// purely decorative, hidden from assistive tech, frozen under reduced motion.
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
      className="bg-[var(--paper)] border-y border-[color:var(--rule)] py-5 overflow-hidden"
    >
      <div className="flex overflow-hidden whitespace-nowrap">
        <motion.span
          className="shrink-0 text-[21px] md:text-[25px] font-thin lowercase text-[color:var(--ink)]"
          {...scroll}
        >
          {run}
        </motion.span>
        <motion.span
          className="shrink-0 text-[21px] md:text-[25px] font-thin lowercase text-[color:var(--ink)]"
          {...scroll}
        >
          {run}
        </motion.span>
      </div>
    </div>
  );
}
