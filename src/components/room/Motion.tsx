"use client";

import { LazyMotion, domAnimation } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Framer Motion's lighter build, for the whole site: animations, exits and
 * gestures, without layout projection or drag, which nothing here uses.
 * Every animated element is an m.* inside this. `strict` makes a stray
 * motion.* an error, because one would load the full build again, and with
 * it a projection node on every animated element, each reading the layout
 * as the page hydrates.
 */
export function Motion({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      {children}
    </LazyMotion>
  );
}
