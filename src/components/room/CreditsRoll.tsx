"use client";

import { motion, useReducedMotion } from "framer-motion";
import { films } from "@/lib/films";
import { EASE_OUT_EXPO } from "@/lib/design-tokens";

// The only brand assets are white PNGs, cut for a dark ground. Here they are
// finally on one. Heights are set explicitly and the width follows the
// image's own ratio: the Toyota mark is nearly square and the Jetex mark is
// a wide strip, and a fixed box would crop one or starve the other.
const brands = [
  { name: "The Jet Business", src: "/logos/white/tjb.png", h: 40 },
  { name: "Aston Martin", src: "/logos/white/aston-martin.png", h: 30 },
  { name: "Toyota", src: "/logos/white/toyota.png", h: 40 },
  { name: "Koenigsegg", src: "/logos/white/koenigsegg.png", h: 40 },
  { name: "Jetex", src: "/logos/white/jetex.png", h: 26 },
  { name: "Youmi Beauty", src: "/logos/white/youmi-beauty.png", h: 28 },
  { name: "EuroEyes", src: "/logos/white/euroeyes.png", h: 24 },
  { name: "Ohana Developments", src: "/logos/white/ohana.png", h: 40 },
  { name: "Shafik Gabr Foundation", src: "/logos/white/shafik-gabr.png", h: 36 },
];

function Row({ ariaHidden }: { ariaHidden?: boolean }) {
  return (
    <div className="flex shrink-0 items-center" aria-hidden={ariaHidden}>
      {brands.map((b) => (
        <div key={b.name} className="flex h-16 items-center justify-center px-8 md:h-20 md:px-12">
          {/* Plain img on purpose: every logo is duplicated for the loop and
              the optimizer adds nothing to small transparent PNGs. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={b.src}
            alt={ariaHidden ? "" : b.name}
            style={{ height: b.h, width: "auto" }}
            className="max-w-[170px] object-contain opacity-60 transition-opacity duration-300 hover:opacity-100"
            draggable={false}
          />
        </div>
      ))}
    </div>
  );
}

/**
 * The credits. The people who were on screen, listed the way a crawl lists
 * them: name against film. Then the brands, as a strip that keeps moving,
 * the way a credit roll does.
 */
export function CreditsRoll() {
  const reduced = useReducedMotion();
  const rise = {
    initial: { opacity: 0, y: reduced ? 0 : 16 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-60px" },
    transition: { duration: 0.6, ease: EASE_OUT_EXPO },
  };
  const scroll = reduced
    ? {}
    : {
        animate: { x: ["0%", "-100%"] },
        transition: { duration: 36, ease: "linear" as const, repeat: Infinity },
      };

  return (
    <section className="bg-black py-28 md:py-40">
      <div className="mx-auto max-w-[1600px] px-6 md:px-14">
        <motion.p {...rise} className="mono">
          03 &mdash; Credits
        </motion.p>

        <motion.p {...rise} className="mono mb-6 mt-12 text-[color:var(--ink-faint)]">
          On screen
        </motion.p>
        <ul className="max-w-[1100px]">
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

        <motion.p {...rise} className="mono mt-20 text-[color:var(--ink-faint)] md:mt-28">
          With
        </motion.p>
      </div>

      {/* the strip: full bleed, edges faded into the black, two rows for a seamless loop */}
      <div className="relative mt-6 overflow-hidden border-y border-[color:var(--rule)] py-4">
        <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-black to-transparent md:w-36" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-black to-transparent md:w-36" />
        <div className="flex overflow-hidden">
          <motion.div className="flex shrink-0" {...scroll}>
            <Row />
          </motion.div>
          <motion.div className="flex shrink-0" {...scroll}>
            <Row ariaHidden />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
