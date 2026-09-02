"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { SectionTag } from "@/components/editorial/SectionTag";
import { servicesList, type Service } from "@/lib/services-data";
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

function StepRows({ steps }: { steps: Service["process"] }) {
  const reduced = useReducedMotion();
  return (
    <div className="mt-10 md:mt-14">
      {steps.map((step, i) => (
        <motion.div
          key={step.step}
          initial={{ opacity: 0, y: reduced ? 0 : 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, delay: 0.03 * i, ease: EASE_OUT_EXPO }}
          className="grid grid-cols-[auto_1fr] md:grid-cols-[auto_minmax(0,420px)_1fr] items-baseline gap-x-6 md:gap-x-12 gap-y-2 border-t border-[color:var(--rule)] py-6 md:py-8"
        >
          <span className="text-[13px] text-[color:var(--ink-mid)] tabular-nums pl-1">
            {String(step.step).padStart(2, "0")}
          </span>
          <h3 className="text-[21px] md:text-[25px] font-light text-[color:var(--ink)]">
            {step.title}
          </h3>
          <p className="col-start-2 md:col-start-3 text-[15px] leading-relaxed text-[color:var(--ink-mid)] max-w-[68ch]">
            {step.description}
          </p>
        </motion.div>
      ))}
      <div className="border-t border-[color:var(--rule)]" />
    </div>
  );
}

export function ServiceDetailPage({ service }: { service: Service }) {
  const reduced = useReducedMotion();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const index = servicesList.findIndex((s) => s.slug === service.slug) + 1;

  const rise = (delay: number) => ({
    initial: { opacity: 0, y: reduced ? 0 : 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, delay, ease: EASE_OUT_EXPO },
  });

  return (
    <div className="bg-[var(--paper)]">
      <section className="pt-32 md:pt-40 pb-16 md:pb-20">
        <div className="mx-auto max-w-[1600px] px-6 md:px-[60px]">
          <motion.p {...rise(0)} className="eyebrow mb-8">
            service {String(index).padStart(2, "0")} &mdash; {service.shortTitle}
          </motion.p>
          <motion.h1
            {...rise(0.08)}
            className="font-thin text-[color:var(--ink)] leading-[1.14] text-[11vw] sm:text-[56px] md:text-[72px] lg:text-[88px] max-w-[18ch]"
          >
            <LastWordSerif text={service.title} />
          </motion.h1>
          <motion.div
            {...rise(0.16)}
            className="mt-10 flex flex-wrap items-end justify-between gap-8"
          >
            <p className="text-[17px] md:text-[21px] text-[color:var(--ink-mid)] max-w-[52ch] leading-relaxed">
              {service.description}
            </p>
            <div className="flex items-center gap-6 shrink-0">
              <Link href="/book-demo" className="pill pill-solid px-7 py-3 text-[15px]">
                Book a demo
              </Link>
              <a href="#process" className="underline-draw text-[15px] text-[color:var(--ink)]">
                how we work <span aria-hidden="true">&#8600;</span>
              </a>
            </div>
          </motion.div>
        </div>

        <motion.div {...rise(0.24)} className="mx-auto max-w-[1600px] px-6 md:px-[60px] mt-14">
          <div className="plate relative aspect-[21/9] w-full">
            <Image
              src={service.imageUrl}
              alt=""
              fill
              sizes="100vw"
              priority
              className="object-cover"
            />
          </div>
          <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 border-t border-[color:var(--rule)]">
            {service.stats.map((s) => (
              <div
                key={s.label}
                className="py-7 sm:py-9 flex items-baseline gap-4 sm:block border-b sm:border-b-0 border-[color:var(--rule)] last:border-b-0"
              >
                <span className="block text-[40px] md:text-[50px] font-thin text-[color:var(--ink)] leading-none">
                  {s.value}
                </span>
                <span className="eyebrow-serif mt-2 block">{s.label.toLowerCase()}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-[1600px] px-6 md:px-[60px]">
          <SectionTag>what&apos;s included</SectionTag>
          <div className="mt-10 md:mt-14 grid grid-cols-1 md:grid-cols-2 gap-x-16">
            {service.features.map((feature, i) => (
              <motion.p
                key={feature}
                initial={{ opacity: 0, y: reduced ? 0 : 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.45, delay: 0.02 * i, ease: EASE_OUT_EXPO }}
                className="border-t border-[color:var(--rule)] py-5 md:py-6 text-[17px] md:text-[20px] font-light text-[color:var(--ink)]"
              >
                {feature}
              </motion.p>
            ))}
          </div>
          <div className="border-t border-[color:var(--rule)]" />
        </div>
      </section>

      <section id="process" className="py-16 md:py-24 scroll-mt-16">
        <div className="mx-auto max-w-[1600px] px-6 md:px-[60px]">
          <SectionTag>the process</SectionTag>
          <StepRows steps={service.process} />

          {service.secondaryProcess && (
            <div className="mt-16 md:mt-24">
              <p className="eyebrow-serif">{service.secondaryProcess.subtitle.toLowerCase()}</p>
              <h3 className="mt-3 text-[25px] md:text-[32px] font-extralight text-[color:var(--ink)]">
                <LastWordSerif text={service.secondaryProcess.title} />
              </h3>
              <StepRows steps={service.secondaryProcess.steps} />
            </div>
          )}
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-[1600px] px-6 md:px-[60px]">
          <SectionTag>why tilted needle</SectionTag>
          <div className="mt-10 md:mt-14 grid grid-cols-1 md:grid-cols-2 gap-x-16">
            {service.benefits.map((benefit, i) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: reduced ? 0 : 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: 0.04 * i, ease: EASE_OUT_EXPO }}
                className="border-t border-[color:var(--rule)] py-8 md:py-10"
              >
                <h3 className="text-[21px] md:text-[25px] font-light text-[color:var(--ink)]">
                  {benefit.title}
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed text-[color:var(--ink-mid)] max-w-[58ch]">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </div>
          <div className="border-t border-[color:var(--rule)]" />
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-[1600px] px-6 md:px-[60px]">
          <SectionTag>faq</SectionTag>
          <div className="mt-10 md:mt-14 max-w-[900px]">
            {service.faq.map((item, i) => (
              <div key={item.question} className="border-t border-[color:var(--rule)]">
                <h3>
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    aria-expanded={openFaq === i}
                    aria-controls={"faq-panel-" + i}
                    id={"faq-trigger-" + i}
                    className="group flex w-full items-baseline justify-between gap-6 py-6 text-left text-[17px] md:text-[20px] font-light text-[color:var(--ink)]"
                  >
                    {item.question}
                    <span
                      aria-hidden="true"
                      className="shrink-0 text-[color:var(--ink-mid)] transition-transform duration-300"
                      style={{ transform: openFaq === i ? "rotate(45deg)" : "none" }}
                    >
                      +
                    </span>
                  </button>
                </h3>
                <motion.div
                  id={"faq-panel-" + i}
                  role="region"
                  aria-labelledby={"faq-trigger-" + i}
                  initial={false}
                  animate={{ height: openFaq === i ? "auto" : 0, opacity: openFaq === i ? 1 : 0 }}
                  transition={{ duration: 0.3, ease: EASE_OUT_EXPO }}
                  className="overflow-hidden"
                >
                  <p className="pb-7 text-[15px] leading-relaxed text-[color:var(--ink-mid)] max-w-[62ch]">
                    {item.answer}
                  </p>
                </motion.div>
              </div>
            ))}
            <div className="border-t border-[color:var(--rule)]" />
          </div>
        </div>
      </section>

      <section className="py-20 md:py-32">
        <div className="mx-auto max-w-[1600px] px-6 md:px-[60px]">
          <h2 className="font-thin text-[color:var(--ink)] leading-[1.15] text-[9vw] sm:text-[44px] md:text-[64px] max-w-[16ch]">
            Ready to make your brand go <span className="em-serif">viral</span>?
          </h2>
          <div className="mt-10 flex items-center gap-6">
            <Link href="/book-demo" className="pill pill-solid px-7 py-3 text-[15px]">
              Book a demo
            </Link>
            <Link href="/services" className="underline-draw text-[15px] text-[color:var(--ink)]">
              all services <span aria-hidden="true">&#8600;</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
