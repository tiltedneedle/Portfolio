"use client";

import { motion, useReducedMotion } from "framer-motion";
import { SectionTag } from "@/components/editorial/SectionTag";
import { EASE_OUT_EXPO } from "@/lib/design-tokens";

/**
 * The reference follows its hero with a single large mixed-type paragraph —
 * grotesque with serif-italic phrases woven through — before any imagery.
 * Copy here is the site's own positioning, recomposed; the numbers live on
 * the hero's stats rule, not repeated in prose.
 */
export function About() {
  const reduced = useReducedMotion();

  return (
    <section className="relative bg-[var(--paper)] py-20 md:py-28">
      <div className="mx-auto max-w-[1600px] px-6 md:px-[60px]">
        <SectionTag>what is tilted needle</SectionTag>
        <motion.p
          initial={{ opacity: 0, y: reduced ? 0 : 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: EASE_OUT_EXPO }}
          className="mt-10 md:mt-14 max-w-[26ch] sm:max-w-[30ch] lg:max-w-[34ch] text-[25px] sm:text-[32px] md:text-[40px] lg:text-[50px] font-extralight leading-[1.4] text-[color:var(--ink)]"
        >
          A social-first content <span className="em-serif">studio</span> in
          London and Dubai. Thousands of published videos, decoded into a
          repeatable <span className="em-serif">formula</span>{" "}&mdash; content,
          influencer, paid and product run as one{" "}
          <span className="em-serif">system</span> built to compound attention
          into revenue.
        </motion.p>
      </div>
    </section>
  );
}
