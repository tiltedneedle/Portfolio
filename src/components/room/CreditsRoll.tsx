"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { films } from "@/lib/films";
import { EASE_OUT_EXPO } from "@/lib/design-tokens";

// The only brand assets are white PNGs, cut for a dark ground. Here they are
// finally on one.
const brands = [
  { name: "The Jet Business", src: "/logos/white/tjb.png", width: 1188, height: 916 },
  { name: "Aston Martin", src: "/logos/white/aston-martin.png", width: 3762, height: 1488 },
  { name: "Toyota", src: "/logos/white/toyota.png", width: 1099, height: 804 },
  { name: "Koenigsegg", src: "/logos/white/koenigsegg.png", width: 816, height: 874 },
  { name: "Jetex", src: "/logos/white/jetex.png", width: 436, height: 148 },
  { name: "Youmi Beauty", src: "/logos/white/youmi-beauty.png", width: 167, height: 56 },
  { name: "EuroEyes", src: "/logos/white/euroeyes.png", width: 178, height: 37 },
  { name: "Ohana Developments", src: "/logos/white/ohana.png", width: 116, height: 124 },
  { name: "Shafik Gabr Foundation", src: "/logos/white/shafik-gabr.png", width: 176, height: 91 },
];

/**
 * The credits. The people who were on screen, listed the way a crawl lists
 * them: name against film. Then the brands, as a plate of marks.
 */
export function CreditsRoll() {
  const reduced = useReducedMotion();
  const rise = {
    initial: { opacity: 0, y: reduced ? 0 : 16 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-60px" },
    transition: { duration: 0.6, ease: EASE_OUT_EXPO },
  };

  return (
    <section className="bg-black py-28 md:py-40">
      <div className="mx-auto max-w-[1600px] px-6 md:px-14">
        <motion.p {...rise} className="mono">
          03 &mdash; Credits
        </motion.p>

        <div className="mt-12 grid grid-cols-1 gap-x-16 gap-y-16 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <motion.p {...rise} className="mono mb-6 text-[color:var(--ink-faint)]">
              On screen
            </motion.p>
            <ul>
              {films.map((f, i) => (
                <motion.li
                  key={f.slug}
                  {...rise}
                  transition={{ ...rise.transition, delay: 0.04 * i }}
                  className="grid grid-cols-[auto_1fr_auto] items-baseline gap-x-6 border-t border-[color:var(--rule)] py-5"
                >
                  <span className="mono">{f.index < 10 ? "0" + f.index : f.index}</span>
                  <span className="display text-[clamp(28px,3.2vw,48px)] font-bold">{f.client}</span>
                  <span className="mono text-right max-sm:hidden">{f.title}</span>
                </motion.li>
              ))}
              <li className="border-t border-[color:var(--rule)]" />
            </ul>
          </div>

          <div className="lg:col-span-5">
            <motion.p {...rise} className="mono mb-6 text-[color:var(--ink-faint)]">
              With
            </motion.p>
            <motion.ul {...rise} className="grid grid-cols-3 border-l border-t border-[color:var(--rule)]">
              {brands.map((b) => (
                <li
                  key={b.name}
                  className="flex h-24 items-center justify-center border-b border-r border-[color:var(--rule)] px-5"
                >
                  <Image
                    src={b.src}
                    alt={b.name}
                    width={b.width}
                    height={b.height}
                    className="max-h-8 w-auto max-w-[110px] object-contain opacity-60 transition-opacity duration-300 hover:opacity-100"
                  />
                </li>
              ))}
            </motion.ul>
          </div>
        </div>
      </div>
    </section>
  );
}
