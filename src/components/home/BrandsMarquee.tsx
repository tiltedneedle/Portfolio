"use client";

import { motion } from "framer-motion";

const brands = [
  { name: "The Jet Business", src: "/logos/white/tjb.png" },
  { name: "Aston Martin", src: "/logos/white/aston-martin.png" },
  { name: "Toyota", src: "/logos/white/toyota.png" },
  { name: "Koenigsegg", src: "/logos/white/koenigsegg.png" },
  { name: "Jetex", src: "/logos/white/jetex.png" },
  { name: "Youmi Beauty", src: "/logos/white/youmi-beauty.png" },
  { name: "EuroEyes", src: "/logos/white/euroeyes.png" },
  { name: "Ohana Developments", src: "/logos/white/ohana.png" },
  { name: "Shafik Gabr Foundation", src: "/logos/white/shafik-gabr.png" },
];

function BrandLogo({ brand }: { brand: { name: string; src: string } }) {
  return (
    <div className="flex items-center justify-center h-14 md:h-16 px-8 md:px-12">
      {/* Plain <img>: the marquee duplicates every logo and next/image's
          optimizer adds no value for small transparent PNGs in motion. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={brand.src}
        alt={brand.name}
        loading="lazy"
        className="max-h-9 md:max-h-11 w-auto max-w-[150px] md:max-w-[190px] object-contain opacity-70 transition-opacity duration-300 hover:opacity-100"
      />
    </div>
  );
}

export function BrandsMarquee() {
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
            animate={{ x: ["0%", "-100%"] }}
            transition={{ duration: 30, ease: "linear", repeat: Infinity }}
          >
            {brands.map((brand, i) => (
              <BrandLogo key={`brand-1-${i}`} brand={brand} />
            ))}
          </motion.div>
          <motion.div
            className="flex shrink-0"
            animate={{ x: ["0%", "-100%"] }}
            transition={{ duration: 30, ease: "linear", repeat: Infinity }}
            aria-hidden="true"
          >
            {brands.map((brand, i) => (
              <BrandLogo key={`brand-2-${i}`} brand={brand} />
            ))}
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </section>
  );
}
