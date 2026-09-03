"use client";

import { motion, useReducedMotion } from "framer-motion";
import { EASE_OUT_EXPO } from "@/lib/design-tokens";

const stats = [
  { value: "2B+", label: "organic views" },
  { value: "$250M+", label: "revenue generated" },
  { value: "11+", label: "flagship clients" },
];

/**
 * Directly after the reel the reference drops into a dark slab carrying one
 * plain white sentence about who it works with. Ours carries the positioning
 * line, then the three numbers on a rule.
 */
export function StatementSlab() {
  const reduced = useReducedMotion();
  const rise = {
    initial: { opacity: 0, y: reduced ? 0 : 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-80px" },
    transition: { duration: 0.9, ease: EASE_OUT_EXPO },
  };

  return (
    <section className="bg-[color:var(--slab)] text-white py-28 md:py-40">
      <div className="mx-auto max-w-[1600px] px-6 md:px-[60px]">
        <motion.p
          {...rise}
          className="font-normal lowercase leading-[1.25] text-[30px] sm:text-[38px] md:text-[46px] lg:text-[50px] max-w-[26ch]"
        >
          we make short-form for founders, brands and creators who need to be
          seen &mdash; thousands of published videos, decoded into one
          repeatable <span className="em-serif">formula</span>.
        </motion.p>

        <motion.div
          {...rise}
          className="mt-20 md:mt-28 grid grid-cols-1 sm:grid-cols-3 border-t border-white/15"
        >
          {stats.map((s) => (
            <div
              key={s.label}
              className="py-7 sm:py-9 flex items-baseline gap-4 sm:block border-b sm:border-b-0 border-white/15 last:border-b-0"
            >
              <span className="block text-[40px] md:text-[50px] font-light leading-none">{s.value}</span>
              <span className="em-serif mt-2 block text-[15px] text-white/60">{s.label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
