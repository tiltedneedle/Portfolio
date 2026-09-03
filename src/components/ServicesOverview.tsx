"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { CutLink } from "@/components/room/CutLink";
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

/** The studio. Four capabilities as an index of slates. */
export function ServicesOverview() {
  const reduced = useReducedMotion();

  const rise = (delay: number) => ({
    initial: { opacity: 0, y: reduced ? 0 : 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, delay, ease: EASE_OUT_EXPO },
  });

  return (
    <div className="bg-[color:var(--stage)]">
      <section className="pb-16 pt-32 md:pb-24 md:pt-40">
        <div className="mx-auto max-w-[1600px] px-6 md:px-14">
          <motion.p {...rise(0)} className="mono mb-8">
            02 &mdash; The studio
          </motion.p>
          <motion.h1 {...rise(0.08)} className="display max-w-[12ch] text-[clamp(56px,9.5vw,150px)]">
            Four capabilities, one <span className="em-serif">engine.</span>
          </motion.h1>
          <motion.p {...rise(0.16)} className="mt-10 max-w-[52ch] text-[19px] leading-relaxed text-[color:var(--ink-soft)] md:text-[21px]">
            Content creation, influencer marketing, paid and performance, and app and web
            development, run as one integrated system rather than four separate vendors.
          </motion.p>
        </div>
      </section>

      <section className="pb-20 md:pb-28">
        <div className="mx-auto max-w-[1600px] px-6 md:px-14">
          <p className="mono">The index</p>
          <div className="mt-8 md:mt-10">
            {servicesList.map((service, i) => (
              <motion.div
                key={service.slug}
                initial={{ opacity: 0, y: reduced ? 0 : 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.6, delay: 0.05 * i, ease: EASE_OUT_EXPO }}
              >
                <CutLink
                  href={"/services/" + service.slug}
                  className="group block border-t border-[color:var(--rule)] py-10 transition-colors duration-500 hover:bg-[color:var(--stage-2)] md:py-14"
                  data-cursor="Open"
                >
                  <div className="grid grid-cols-[auto_1fr_auto] items-baseline gap-x-6 md:gap-x-12">
                    <span className="mono pl-1">{String(i + 1).padStart(2, "0")}</span>
                    <div>
                      <h2 className="display text-[clamp(32px,4.5vw,72px)]">
                        <LastWordSerif text={service.shortTitle} />
                      </h2>
                      <p className="mt-3 max-w-[64ch] text-[15px] text-[color:var(--ink-soft)] md:text-[17px]">{service.tagline}</p>
                      <p className="mono mt-4 hidden md:block">{service.features.slice(0, 4).join(" / ")}</p>
                    </div>
                    <span
                      aria-hidden="true"
                      className="pr-1 text-[21px] text-[color:var(--ink-mid)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1 group-hover:text-[color:var(--ink)]"
                    >
                      &#8599;
                    </span>
                  </div>
                </CutLink>
              </motion.div>
            ))}
            <div className="border-t border-[color:var(--rule)]" />
          </div>
        </div>
      </section>

      <section className="pb-24 md:pb-36">
        <div className="mx-auto max-w-[1600px] px-6 md:px-14">
          <h2 className="display max-w-[14ch] text-[clamp(44px,7vw,110px)]">
            Not sure where to <span className="em-serif">start?</span>
          </h2>
          <div className="mt-10 flex items-center gap-8">
            <CutLink href="/book-demo" className="pill pill-solid px-7 py-3 text-[15px]">
              Book a demo
            </CutLink>
            <Link href="/#work" className="slate-link text-[13px]">
              See the work &#8599;
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
