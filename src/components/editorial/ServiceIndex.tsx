"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { SectionTag } from "@/components/editorial/SectionTag";
import { servicesList } from "@/lib/services-data";
import { EASE_OUT_EXPO } from "@/lib/design-tokens";

// Last word of each title carries the serif italic — emphasis by a change of
// voice, never by weight.
function EditorialTitle({ title }: { title: string }) {
  const words = title.split(" ");
  const last = words.pop();
  return (
    <span>
      {words.join(" ")} <span className="em-serif">{last}</span>
    </span>
  );
}

export function ServiceIndex() {
  const reduced = useReducedMotion();

  return (
    <section id="services" className="relative bg-[var(--paper)] py-20 md:py-28 scroll-mt-16">
      <div className="mx-auto max-w-[1600px] px-6 md:px-[60px]">
        <SectionTag>what we do</SectionTag>

        <div className="mt-10 md:mt-14">
          {servicesList.map((service, i) => (
            <motion.div
              key={service.slug}
              initial={{ opacity: 0, y: reduced ? 0 : 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: 0.05 * i, ease: EASE_OUT_EXPO }}
            >
              <Link
                href={"/services/" + service.slug}
                className="group grid grid-cols-[auto_1fr_auto] items-baseline gap-x-6 md:gap-x-12 border-t border-[color:var(--rule)] py-7 md:py-10 transition-colors duration-500 hover:bg-white"
              >
                <span className="text-[13px] text-[color:var(--ink-mid)] tabular-nums pl-1">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>
                  <span className="block text-[32px] md:text-[50px] font-thin leading-[1.15] text-[color:var(--ink)]">
                    <EditorialTitle title={service.shortTitle} />
                  </span>
                  <span className="mt-2 hidden md:block text-[15px] text-[color:var(--ink-mid)] max-w-[64ch]">
                    {service.tagline}
                  </span>
                </span>
                <span
                  aria-hidden="true"
                  className="text-[21px] text-[color:var(--ink-mid)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1 group-hover:translate-y-1 group-hover:text-[color:var(--ink)] pr-1"
                >
                  &#8600;
                </span>
              </Link>
            </motion.div>
          ))}
          <div className="border-t border-[color:var(--rule)]" />
        </div>
      </div>
    </section>
  );
}
