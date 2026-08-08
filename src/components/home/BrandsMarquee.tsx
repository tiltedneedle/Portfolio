"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

// Intrinsic dimensions are declared so the row reserves correct space before
// the images decode — without them the marquee reflows as each logo lands.
// The source PNGs are far larger than their display size (aston-martin ships
// at 3762x1488 for a ~110px slot), so these go through next/image rather than
// a bare <img>.
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

type Brand = (typeof brands)[number];

function BrandLogo({ brand, priority }: { brand: Brand; priority: boolean }) {
  return (
    <div className="flex items-center justify-center h-14 md:h-16 px-8 md:px-12">
      <Image
        src={brand.src}
        alt={brand.name}
        width={brand.width}
        height={brand.height}
        sizes="(max-width: 768px) 150px, 190px"
        priority={priority}
        className="max-h-9 md:max-h-11 w-auto max-w-[150px] md:max-w-[190px] object-contain opacity-70 transition-opacity duration-300 hover:opacity-100"
      />
    </div>
  );
}

export function BrandsMarquee() {
  const reduced = useReducedMotion();
  // An endless horizontal crawl is exactly what this preference is for.
  const scroll = reduced
    ? {}
    : { animate: { x: ["0%", "-100%"] }, transition: { duration: 30, ease: "linear" as const, repeat: Infinity } };

  return (
    <section className="relative bg-black py-12 md:py-16 overflow-hidden border-t border-white/[0.04]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="text-center mb-8"
      >
        <p className="text-[11px] text-[#86868b] uppercase tracking-[0.2em] font-medium">
          Trusted by world-class brands
        </p>
      </motion.div>

      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-24 md:w-40 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 md:w-40 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />

        <div className="flex overflow-hidden">
          <motion.div
            className="flex shrink-0"
            {...scroll}
          >
            {brands.map((brand, i) => (
              // The first few are visible immediately; the rest can wait.
              <BrandLogo key={`brand-1-${i}`} brand={brand} priority={i < 4} />
            ))}
          </motion.div>
          <motion.div
            className="flex shrink-0"
            {...scroll}
            aria-hidden="true"
          >
            {brands.map((brand, i) => (
              <BrandLogo key={`brand-2-${i}`} brand={brand} priority={false} />
            ))}
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </section>
  );
}
