"use client";

import { motion, useReducedMotion } from "framer-motion";
import { SectionTag } from "@/components/editorial/SectionTag";
import { caseStudies } from "@/lib/case-studies-data";
import { EASE_OUT_EXPO } from "@/lib/design-tokens";

/**
 * The reference lists its awards as spare, ruled rows grouped by year. Our
 * equivalent of awards is client outcomes, so the same furniture carries the
 * headline result of every engagement.
 */
export function ResultsIndex() {
  const reduced = useReducedMotion();

  return (
    <section id="results" className="relative bg-[var(--paper)] py-20 md:py-28 scroll-mt-16">
      <div className="mx-auto max-w-[1600px] px-6 md:px-[60px]">
        <SectionTag>results</SectionTag>

        <div className="mt-10 md:mt-14">
          {caseStudies.map((study, i) => (
            <motion.div
              key={study.id}
              initial={{ opacity: 0, y: reduced ? 0 : 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: 0.04 * i, ease: EASE_OUT_EXPO }}
              className="grid grid-cols-1 sm:grid-cols-[1fr_auto_auto] items-baseline gap-x-10 gap-y-1 border-t border-[color:var(--rule)] py-6 md:py-7"
            >
              <p className="text-[21px] md:text-[25px] font-light text-[color:var(--ink)]">
                {study.client}
              </p>
              <p className="em-serif text-[17px] md:text-[20px] text-[color:var(--ink-soft)]">
                {study.highlight.toLowerCase()}
              </p>
              <p className="hidden sm:block text-[13px] text-[color:var(--ink-mid)] tabular-nums">
                {study.year}
              </p>
            </motion.div>
          ))}
          <div className="border-t border-[color:var(--rule)]" />
        </div>
      </div>
    </section>
  );
}
