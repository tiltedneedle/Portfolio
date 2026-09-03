"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { CutLink } from "@/components/room/CutLink";
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
    <div className="mt-8 md:mt-10">
      {steps.map((step, i) => (
        <motion.div
          key={step.step}
          initial={{ opacity: 0, y: reduced ? 0 : 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, delay: 0.03 * i, ease: EASE_OUT_EXPO }}
          className="grid grid-cols-[auto_1fr] items-baseline gap-x-6 gap-y-2 border-t border-[color:var(--rule)] py-6 md:grid-cols-[auto_minmax(0,420px)_1fr] md:gap-x-12 md:py-8"
        >
          <span className="mono pl-1">{String(step.step).padStart(2, "0")}</span>
          <h3 className="text-[21px] text-[color:var(--ink)] md:text-[25px]">{step.title}</h3>
          <p className="col-start-2 max-w-[68ch] text-[15px] leading-relaxed text-[color:var(--ink-mid)] md:col-start-3">
            {step.description}
          </p>
        </motion.div>
      ))}
      <div className="border-t border-[color:var(--rule)]" />
    </div>
  );
}

/** One capability, as a film page reads: slate, the picture, the numbers, the process. */
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
    <div className="bg-[color:var(--stage)]">
      <section className="pb-16 pt-32 md:pb-20 md:pt-40">
        <div className="mx-auto max-w-[1600px] px-6 md:px-14">
          <motion.p {...rise(0)} className="mono mb-8">
            Service {String(index).padStart(2, "0")} <span className="text-[color:var(--ink-faint)]">/</span> {service.shortTitle}
          </motion.p>
          <motion.h1 {...rise(0.08)} className="display max-w-[14ch] text-[clamp(56px,9.5vw,150px)]">
            <LastWordSerif text={service.title} />
          </motion.h1>
          <motion.div {...rise(0.16)} className="mt-10 flex flex-wrap items-end justify-between gap-8">
            <p className="max-w-[52ch] text-[19px] leading-relaxed text-[color:var(--ink-soft)] md:text-[21px]">{service.description}</p>
            <div className="flex shrink-0 items-center gap-8">
              <CutLink href="/book-demo" className="pill pill-solid px-7 py-3 text-[15px]">
                Book a demo
              </CutLink>
              <a href="#process" className="slate-link text-[13px]">
                How we work &darr;
              </a>
            </div>
          </motion.div>
        </div>

        <motion.div {...rise(0.24)} className="mx-auto mt-14 max-w-[1600px] px-6 md:px-14">
          <div className="plate relative aspect-[21/9] w-full">
            <Image src={service.imageUrl} alt="" fill sizes="100vw" priority className="object-cover" />
          </div>
          <div className="mt-2 grid grid-cols-1 border-t border-[color:var(--rule)] sm:grid-cols-3">
            {service.stats.map((s) => (
              <div
                key={s.label}
                className="flex items-baseline gap-4 border-b border-[color:var(--rule)] py-7 last:border-b-0 sm:block sm:border-b-0 sm:py-9"
              >
                <span className="display tabular block text-[clamp(40px,5vw,80px)] leading-none">{s.value}</span>
                <span className="mono mt-3 block">{s.label}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-[1600px] px-6 md:px-14">
          <h2 className="mono">What is included</h2>
          <div className="mt-8 grid grid-cols-1 gap-x-16 md:mt-10 md:grid-cols-2">
            {service.features.map((feature, i) => (
              <motion.p
                key={feature}
                initial={{ opacity: 0, y: reduced ? 0 : 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.45, delay: 0.02 * i, ease: EASE_OUT_EXPO }}
                className="border-t border-[color:var(--rule)] py-5 text-[17px] text-[color:var(--ink)] md:py-6 md:text-[20px]"
              >
                {feature}
              </motion.p>
            ))}
          </div>
          <div className="border-t border-[color:var(--rule)]" />
        </div>
      </section>

      <section id="process" className="scroll-mt-16 py-16 md:py-24">
        <div className="mx-auto max-w-[1600px] px-6 md:px-14">
          <h2 className="mono">The process</h2>
          <StepRows steps={service.process} />

          {service.secondaryProcess && (
            <div className="mt-16 md:mt-24">
              <p className="mono">{service.secondaryProcess.subtitle}</p>
              <h3 className="display mt-3 text-[clamp(28px,3.5vw,56px)]">
                <LastWordSerif text={service.secondaryProcess.title} />
              </h3>
              <StepRows steps={service.secondaryProcess.steps} />
            </div>
          )}
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-[1600px] px-6 md:px-14">
          <h2 className="mono">Why Tilted Needle</h2>
          <div className="mt-8 grid grid-cols-1 gap-x-16 md:mt-10 md:grid-cols-2">
            {service.benefits.map((benefit, i) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: reduced ? 0 : 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: 0.04 * i, ease: EASE_OUT_EXPO }}
                className="border-t border-[color:var(--rule)] py-8 md:py-10"
              >
                <h3 className="text-[21px] text-[color:var(--ink)] md:text-[25px]">{benefit.title}</h3>
                <p className="mt-3 max-w-[58ch] text-[15px] leading-relaxed text-[color:var(--ink-mid)]">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
          <div className="border-t border-[color:var(--rule)]" />
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-[1600px] px-6 md:px-14">
          <h2 className="mono">FAQ</h2>
          <div className="mt-8 max-w-[900px] md:mt-10">
            {service.faq.map((item, i) => (
              <div key={item.question} className="border-t border-[color:var(--rule)]">
                <h3>
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    aria-expanded={openFaq === i}
                    aria-controls={"faq-panel-" + i}
                    id={"faq-trigger-" + i}
                    className="group flex w-full items-baseline justify-between gap-6 py-6 text-left text-[17px] text-[color:var(--ink)] md:text-[20px]"
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
                  <p className="max-w-[62ch] pb-7 text-[15px] leading-relaxed text-[color:var(--ink-mid)]">{item.answer}</p>
                </motion.div>
              </div>
            ))}
            <div className="border-t border-[color:var(--rule)]" />
          </div>
        </div>
      </section>

      <section className="py-20 md:py-32">
        <div className="mx-auto max-w-[1600px] px-6 md:px-14">
          <h2 className="display max-w-[14ch] text-[clamp(44px,7vw,110px)]">
            Ready to go <span className="em-serif">viral?</span>
          </h2>
          <div className="mt-10 flex items-center gap-8">
            <CutLink href="/book-demo" className="pill pill-solid px-7 py-3 text-[15px]">
              Book a demo
            </CutLink>
            <CutLink href="/services" className="slate-link text-[13px]">
              All services &#8599;
            </CutLink>
          </div>
        </div>
      </section>
    </div>
  );
}
