"use client";

import { motion, useReducedMotion } from "framer-motion";
import { SectionTag } from "@/components/editorial/SectionTag";
import { EASE_OUT_EXPO } from "@/lib/design-tokens";

const socials = [
  { label: "instagram", href: "https://www.instagram.com/tiltedneedle/?hl=en" },
  { label: "tiktok", href: "https://www.tiktok.com/@tiltedneedle" },
  { label: "linkedin", href: "https://www.linkedin.com/company/tilted-needle" },
  { label: "youtube", href: "https://www.youtube.com/@tiltedneedle" },
];

/** The reference gives its social links a whole section, set huge. */
export function Socials() {
  const reduced = useReducedMotion();
  return (
    <section className="bg-[var(--paper)] py-28 md:py-40">
      <div className="mx-auto max-w-[1600px] px-6 md:px-[60px]">
        <SectionTag>follow the work</SectionTag>
        <div className="mt-10 md:mt-14 flex flex-wrap gap-x-12 gap-y-4">
          {socials.map((s, i) => (
            <motion.a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: reduced ? 0 : 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: 0.05 * i, ease: EASE_OUT_EXPO }}
              className="group inline-flex items-baseline gap-2 border-b border-[color:var(--rule-strong)] pb-1 text-[36px] sm:text-[44px] md:text-[56px] font-normal lowercase text-[color:var(--ink)] transition-colors duration-300 hover:border-[color:var(--ink)]"
            >
              {s.label}
              <span aria-hidden="true" className="text-[0.8em] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1 group-hover:-translate-y-1">
                &#8599;
              </span>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
