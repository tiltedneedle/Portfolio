"use client";

import { motion, useReducedMotion } from "framer-motion";
import { CutLink } from "@/components/room/CutLink";
import { films, pad2 } from "@/lib/films";
import { EASE_OUT_EXPO } from "@/lib/design-tokens";

/**
 * The results, as slate lines: number, who, what came true, when. Every row
 * cuts to its film. This is the studio's awards list; the awards are numbers.
 */
export function ResultsSlate() {
  const reduced = useReducedMotion();

  return (
    <section id="results" className="scroll-mt-16 bg-[color:var(--stage)] py-28 md:py-40">
      <div className="mx-auto max-w-[1600px] px-6 md:px-14">
        <p className="mono">04 &mdash; Results</p>
        <h2 className="display mt-8 text-[clamp(48px,7vw,120px)] md:mt-12">
          What came <span className="em-serif">true.</span>
        </h2>

        <ul className="mt-14 md:mt-20">
          {films.map((f, i) => (
            <motion.li
              key={f.slug}
              initial={{ opacity: 0, y: reduced ? 0 : 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: 0.04 * i, ease: EASE_OUT_EXPO }}
              className="border-t border-[color:var(--rule)]"
            >
              <CutLink
                href={"/film/" + f.slug}
                className="group grid grid-cols-[auto_1fr] items-baseline gap-x-6 gap-y-1 py-6 sm:grid-cols-[auto_1fr_auto_auto] sm:gap-x-10 md:py-7"
                data-cursor="Open"
              >
                <span className="mono">{pad2(f.index)}</span>
                <span className="text-[21px] text-[color:var(--ink)] md:text-[25px]">{f.client}</span>
                <span className="em-serif col-start-2 text-[19px] text-[color:var(--ink-soft)] sm:col-start-3 md:text-[23px]">
                  {f.highlight.toLowerCase()}
                </span>
                <span className="mono max-sm:hidden">{f.year}</span>
              </CutLink>
            </motion.li>
          ))}
          <li className="border-t border-[color:var(--rule)]" />
        </ul>
      </div>
    </section>
  );
}
