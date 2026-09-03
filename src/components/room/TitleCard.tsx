"use client";

import { motion, useReducedMotion } from "framer-motion";
import { CutLink } from "@/components/room/CutLink";
import { EASE_OUT_EXPO } from "@/lib/design-tokens";

const readouts = [
  { value: "2B+", label: "Organic views" },
  { value: "$250M+", label: "Revenue generated" },
  { value: "11+", label: "Flagship clients" },
];

/**
 * The title card. The studio, said once, in the condensed face, followed by
 * the three numbers set as readouts: the proof is measurable, so it is shown
 * the way a meter shows it.
 */
export function TitleCard() {
  const reduced = useReducedMotion();
  const rise = {
    initial: { opacity: 0, y: reduced ? 0 : 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-80px" },
    transition: { duration: 0.9, ease: EASE_OUT_EXPO },
  };

  return (
    <section className="bg-[color:var(--stage-2)] py-28 md:py-40">
      <div className="mx-auto max-w-[1600px] px-6 md:px-14">
        <motion.p {...rise} className="mono">
          02 &mdash; The studio
        </motion.p>

        <motion.h2 {...rise} className="display mt-8 max-w-[12ch] text-[clamp(56px,9vw,150px)] md:mt-12">
          A formula, not a <span className="em-serif">fluke.</span>
        </motion.h2>

        <motion.p {...rise} className="mt-10 max-w-[52ch] text-[19px] leading-relaxed text-[color:var(--ink-soft)] md:text-[21px]">
          We make short-form for founders, brands and creators who need to be seen.
          Thousands of published videos, decoded into one repeatable method: a hook
          that stops the thumb, a story that holds it, and a cut that earns the
          second watch.
        </motion.p>

        <motion.div {...rise} className="mt-20 grid grid-cols-1 border-t border-[color:var(--rule)] sm:grid-cols-3 md:mt-28">
          {readouts.map((r) => (
            <div
              key={r.label}
              className="flex items-baseline justify-between gap-4 border-b border-[color:var(--rule)] py-7 sm:block sm:border-b-0 sm:py-9 sm:pr-8"
            >
              <span className="display tabular block text-[clamp(56px,7vw,120px)] leading-none">{r.value}</span>
              <span className="mono mt-3 block">{r.label}</span>
            </div>
          ))}
        </motion.div>

        <motion.div {...rise} className="mt-14 border-t border-[color:var(--rule)] pt-6">
          <CutLink href="/services" className="slate-link text-[13px]" data-cursor="Cut">
            What the studio does &#8599;
          </CutLink>
        </motion.div>
      </div>
    </section>
  );
}
