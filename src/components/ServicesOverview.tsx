"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { SectionTag } from "@/components/editorial/SectionTag";
import { servicesList } from "@/lib/services-data";
import { EASE_OUT_EXPO } from "@/lib/design-tokens";

function LastWordSerif({ text }: { text: string }) {
  const words = text.split(" ");
  const last = words.pop();
  return (
    <span>
      {words.join(" ")} <span className="em-serif">{last}</span>
    </span>
  );
}

export function ServicesOverview() {
  const reduced = useReducedMotion();

  const rise = (delay: number) => ({
    initial: { opacity: 0, y: reduced ? 0 : 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, delay, ease: EASE_OUT_EXPO },
  });

  return (
    <div className="bg-[var(--paper)]">
      <section className="pt-32 md:pt-40 pb-16 md:pb-24">
        <div className="mx-auto max-w-[1600px] px-6 md:px-[60px]">
          <motion.p {...rise(0)} className="eyebrow mb-8">
            services
          </motion.p>
          <motion.h1
            {...rise(0.08)}
            className="font-thin text-[color:var(--ink)] leading-[1.14] text-[11vw] sm:text-[56px] md:text-[72px] lg:text-[88px] max-w-[16ch]"
          >
            Four capabilities, one <span className="em-serif">growth</span> engine.
          </motion.h1>
          <motion.p
            {...rise(0.16)}
            className="mt-10 text-[17px] md:text-[21px] text-[color:var(--ink-mid)] max-w-[52ch] leading-relaxed"
          >
            Content creation, influencer marketing, paid &amp; performance, and app
            &amp; web development &mdash; run as one integrated system, not four
            separate vendors.
          </motion.p>
        </div>
      </section>

      <section className="pb-20 md:pb-28">
        <div className="mx-auto max-w-[1600px] px-6 md:px-[60px]">
          <SectionTag>the index</SectionTag>
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
                  className="group block border-t border-[color:var(--rule)] py-10 md:py-14 transition-colors duration-500 hover:bg-white"
                >
                  <div className="grid grid-cols-[auto_1fr_auto] items-baseline gap-x-6 md:gap-x-12">
                    <span className="text-[13px] text-[color:var(--ink-mid)] tabular-nums pl-1">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h2 className="text-[32px] md:text-[50px] font-thin leading-[1.15] text-[color:var(--ink)]">
                        <LastWordSerif text={service.shortTitle} />
                      </h2>
                      <p className="mt-3 text-[15px] md:text-[17px] text-[color:var(--ink-mid)] max-w-[64ch]">
                        {service.tagline}
                      </p>
                      <p className="mt-4 hidden md:block text-[13px] text-[color:var(--ink-mid)]">
                        {service.features.slice(0, 4).join(" · ").toLowerCase()}
                      </p>
                    </div>
                    <span
                      aria-hidden="true"
                      className="text-[21px] text-[color:var(--ink-mid)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1 group-hover:translate-y-1 group-hover:text-[color:var(--ink)] pr-1"
                    >
                      &#8600;
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
            <div className="border-t border-[color:var(--rule)]" />
          </div>
        </div>
      </section>

      <section className="pb-24 md:pb-36">
        <div className="mx-auto max-w-[1600px] px-6 md:px-[60px]">
          <h2 className="font-thin text-[color:var(--ink)] leading-[1.15] text-[9vw] sm:text-[44px] md:text-[64px] max-w-[16ch]">
            Not sure where to <span className="em-serif">start</span>?
          </h2>
          <div className="mt-10 flex items-center gap-6">
            <Link href="/book-demo" className="pill pill-solid px-7 py-3 text-[15px]">
              Book a demo
            </Link>
            <Link href="/#work" className="underline-draw text-[15px] text-[color:var(--ink)]">
              see the work <span aria-hidden="true">&#8600;</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
