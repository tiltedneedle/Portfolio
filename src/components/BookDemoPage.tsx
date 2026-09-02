"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { SectionTag } from "@/components/editorial/SectionTag";
import { EASE_OUT_EXPO } from "@/lib/design-tokens";

const stats = [
  { value: "2B+", label: "organic views" },
  { value: "$250M+", label: "revenue generated" },
  { value: "11+", label: "flagship clients" },
];

const expectations = [
  "Deep dive into your brand goals and challenges",
  "Custom strategy recommendations for your business",
  "Platform and channel analysis for your audience",
  "Clear pricing and timeline overview",
  "No obligation, just honest, expert advice",
];

const details = [
  { label: "duration", value: "30 minutes" },
  { label: "format", value: "Video call" },
  { label: "cost", value: "Free" },
  { label: "location", value: "Google Meet" },
];

export function BookDemoPage() {
  const reduced = useReducedMotion();
  const [schedulerLoaded, setSchedulerLoaded] = useState(false);
  const [schedulerFailed, setSchedulerFailed] = useState(false);

  // Calendly posts a message once its widget paints — use it to drop the
  // skeleton. If nothing arrives, surface the direct link instead of spinning
  // forever.
  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (
        event.data?.event === "calendly.profile_page_viewed" ||
        event.data?.event === "calendly.event_type_viewed"
      ) {
        setSchedulerLoaded(true);
      }
    };
    window.addEventListener("message", onMessage);
    const bail = setTimeout(() => setSchedulerFailed(true), 12000);
    return () => {
      window.removeEventListener("message", onMessage);
      clearTimeout(bail);
    };
  }, []);

  const rise = (delay: number) => ({
    initial: { opacity: 0, y: reduced ? 0 : 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, delay, ease: EASE_OUT_EXPO },
  });

  return (
    <div className="bg-[var(--paper)]">
      <section className="pt-32 md:pt-40 pb-12 md:pb-16">
        <div className="mx-auto max-w-[1600px] px-6 md:px-[60px]">
          <motion.p {...rise(0)} className="eyebrow mb-8">
            book a demo &mdash; free 30-minute strategy session
          </motion.p>
          <motion.h1
            {...rise(0.08)}
            className="font-thin text-[color:var(--ink)] leading-[1.14] text-[11vw] sm:text-[56px] md:text-[72px] lg:text-[88px] max-w-[16ch]"
          >
            Let&apos;s build your growth <span className="em-serif">strategy</span>.
          </motion.h1>
          <motion.p
            {...rise(0.16)}
            className="mt-10 text-[17px] md:text-[21px] text-[color:var(--ink-mid)] max-w-[48ch] leading-relaxed"
          >
            Book a call with our team. We&apos;ll map out a custom plan to scale
            your brand. No strings attached.
          </motion.p>

          <motion.div
            {...rise(0.24)}
            className="mt-12 grid grid-cols-1 sm:grid-cols-3 border-t border-[color:var(--rule)] max-w-[900px]"
          >
            {stats.map((s) => (
              <div
                key={s.label}
                className="py-6 flex items-baseline gap-4 sm:block border-b sm:border-b-0 border-[color:var(--rule)] last:border-b-0"
              >
                <span className="block text-[32px] md:text-[40px] font-thin text-[color:var(--ink)] leading-none">
                  {s.value}
                </span>
                <span className="eyebrow-serif mt-2 block">{s.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="pb-24 md:pb-36">
        <div className="mx-auto max-w-[1600px] px-6 md:px-[60px]">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-14 lg:gap-20 items-start">
            <div className="relative order-2 lg:order-1" style={{ minHeight: "700px" }}>
              {!schedulerLoaded && (
                <div className="absolute inset-0 z-10 flex items-center justify-center border border-[color:var(--rule)] rounded-[2px] bg-white">
                  {schedulerFailed ? (
                    <p className="px-8 text-center text-[15px] text-[color:var(--ink-mid)]">
                      The scheduler didn&apos;t load.{" "}
                      <a
                        href="https://calendly.com/editor-novasma/30min"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline-draw text-[color:var(--ink)]"
                      >
                        Open it in a new tab <span aria-hidden="true">&#8600;</span>
                      </a>
                    </p>
                  ) : (
                    <div className="flex flex-col items-center gap-4">
                      <div className="skeleton h-2 w-40 rounded-full" />
                      <p className="text-[13px] text-[color:var(--ink-mid)]">
                        Loading scheduler&hellip;
                      </p>
                    </div>
                  )}
                </div>
              )}
              <div
                className="calendly-inline-widget"
                data-url="https://calendly.com/editor-novasma/30min?hide_event_type_details=1&hide_gdpr_banner=1"
                style={{ minWidth: "320px", height: "700px" }}
              />
            </div>

            <div className="order-1 lg:order-2">
              <SectionTag>what to expect</SectionTag>
              <div className="mt-8">
                {expectations.map((item) => (
                  <p
                    key={item}
                    className="border-t border-[color:var(--rule)] py-4 text-[15px] text-[color:var(--ink-soft)] leading-relaxed"
                  >
                    {item}
                  </p>
                ))}
                <div className="border-t border-[color:var(--rule)]" />
              </div>

              <div className="mt-14">
                <SectionTag>call details</SectionTag>
                <div className="mt-8">
                  {details.map((d) => (
                    <div
                      key={d.label}
                      className="flex items-baseline justify-between border-t border-[color:var(--rule)] py-4"
                    >
                      <span className="eyebrow-serif">{d.label}</span>
                      <span className="text-[15px] text-[color:var(--ink)]">{d.value}</span>
                    </div>
                  ))}
                  <div className="border-t border-[color:var(--rule)]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
