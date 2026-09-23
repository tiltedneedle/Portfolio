"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { EASE_OUT_EXPO } from "@/lib/design-tokens";

/**
 * A block rises a few pixels as it enters the viewport, once. Small enough
 * to be felt rather than watched; under reduced motion it is simply there.
 */
export function Reveal({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -60px 0px" }}
      transition={{ duration: 0.6, delay, ease: EASE_OUT_EXPO }}
    >
      {children}
    </motion.div>
  );
}
