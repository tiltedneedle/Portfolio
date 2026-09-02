"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { SectionTag } from "@/components/editorial/SectionTag";

// The only brand assets we have are white PNGs cut for the old dark ground.
// On paper they are inverted to ink in CSS rather than re-exported — one line,
// and the source of truth stays the single set of files in /logos/white.
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

function Row({ ariaHidden }: { ariaHidden?: boolean }) {
  return (
    <div className="flex shrink-0" aria-hidden={ariaHidden}>
      {brands.map((b) => (
        <div key={b.name} className="flex h-14 md:h-16 items-center justify-center px-8 md:px-12">
          <Image
            src={b.src}
            alt={ariaHidden ? "" : b.name}
            width={b.width}
            height={b.height}
            className="max-h-8 md:max-h-10 w-auto max-w-[140px] md:max-w-[170px] object-contain opacity-60 transition-opacity duration-300 hover:opacity-100 invert"
          />
        </div>
      ))}
    </div>
  );
}

export function LogoRule() {
  const reduced = useReducedMotion();
  const scroll = reduced
    ? {}
    : {
        animate: { x: ["0%", "-100%"] },
        transition: { duration: 32, ease: "linear" as const, repeat: Infinity },
      };

  return (
    <section className="relative bg-[var(--paper)] py-16 md:py-20">
      <div className="mx-auto max-w-[1600px] px-6 md:px-[60px]">
        <SectionTag>trusted by</SectionTag>
      </div>
      <div className="mt-8 border-y border-[color:var(--rule)] py-6 overflow-hidden relative">
        <div className="absolute left-0 top-0 bottom-0 w-20 md:w-36 bg-gradient-to-r from-[var(--paper)] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 md:w-36 bg-gradient-to-l from-[var(--paper)] to-transparent z-10 pointer-events-none" />
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
