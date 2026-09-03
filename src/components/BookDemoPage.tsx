"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { EASE_OUT_EXPO } from "@/lib/design-tokens";

const readouts = [
  { value: "2B+", label: "Organic views" },
  { value: "$250M+", label: "Revenue generated" },
  { value: "11+", label: "Flagship clients" },
];

const expectations = [
  "A deep dive into your brand goals and challenges",
  "Custom strategy recommendations for your business",
  "Platform and channel analysis for your audience",
  "A clear pricing and timeline overview",
  "No obligation, just honest, expert advice",
];

const details = [
  { label: "Duration", value: "30 minutes" },
  { label: "Format", value: "Video call" },
  { label: "Cost", value: "Free" },
  { label: "Location", value: "Google Meet" },
];

// Calendly takes its colours from the URL, so the embed sits in the room
// instead of opening a white window in it.
const CALENDLY_BASE = "https://calendly.com/editor-novasma/30min";
const CALENDLY_URL =
  CALENDLY_BASE +
  "?hide_event_type_details=1&hide_gdpr_banner=1&background_color=141416&text_color=f2efe9&primary_color=e2422b";

/** Book a demo: the call sheet. */
export function BookDemoPage() {
  const reduced = useReducedMotion();
  const [schedulerLoaded, setSchedulerLoaded] = useState(false);
  const [schedulerFailed, setSchedulerFailed] = useState(false);

  // Calendly posts a message once its widget paints; use it to drop the
  // skeleton. If nothing arrives, surface the direct link instead of waiting.
  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.data?.event === "calendly.profile_page_viewed" || event.data?.event === "calendly.event_type_viewed") {
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
    <div className="bg-[color:var(--stage)]">
      <section className="pb-12 pt-32 md:pb-16 md:pt-40">
        <div className="mx-auto max-w-[1600px] px-6 md:px-14">
          <motion.p {...rise(0)} className="mono mb-8">
            Book a demo <span className="text-[color:var(--ink-faint)]">/</span> Free 30-minute strategy session
          </motion.p>
          <motion.h1 {...rise(0.08)} className="display max-w-[12ch] text-[clamp(56px,9.5vw,150px)]">
            Let&apos;s plan your <span className="em-serif">next cut.</span>
          </motion.h1>
          <motion.p {...rise(0.16)} className="mt-10 max-w-[48ch] text-[19px] leading-relaxed text-[color:var(--ink-soft)] md:text-[21px]">
            Book a call with the team. We map out a plan to scale your brand. No strings
            attached.
          </motion.p>

          <motion.div {...rise(0.24)} className="mt-12 grid max-w-[900px] grid-cols-1 border-t border-[color:var(--rule)] sm:grid-cols-3">
            {readouts.map((s) => (
              <div key={s.label} className="flex items-baseline gap-4 border-b border-[color:var(--rule)] py-6 last:border-b-0 sm:block sm:border-b-0">
                <span className="display tabular block text-[clamp(36px,4.5vw,64px)] leading-none">{s.value}</span>
                <span className="mono mt-3 block">{s.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="pb-24 md:pb-36">
        <div className="mx-auto max-w-[1600px] px-6 md:px-14">
          <div className="grid grid-cols-1 items-start gap-14 lg:grid-cols-[1fr_380px] lg:gap-20">
            <div className="relative order-2 lg:order-1" style={{ minHeight: "700px" }}>
              {!schedulerLoaded && (
                <div className="absolute inset-0 z-10 flex items-center justify-center rounded-[2px] border border-[color:var(--rule)] bg-[color:var(--stage-2)]">
                  {schedulerFailed ? (
                    <p className="px-8 text-center text-[15px] text-[color:var(--ink-mid)]">
                      The scheduler did not load.{" "}
                      <a href={CALENDLY_BASE} target="_blank" rel="noopener noreferrer" className="underline-draw text-[color:var(--ink)]">
                        Open it in a new tab <span aria-hidden="true">&#8599;</span>
                      </a>
                    </p>
                  ) : (
                    <div className="flex flex-col items-center gap-4">
                      <div className="skeleton h-2 w-40 rounded-full" />
                      <p className="mono">Loading scheduler</p>
                    </div>
                  )}
                </div>
              )}
              <div className="calendly-inline-widget" data-url={CALENDLY_URL} style={{ minWidth: "320px", height: "700px" }} />
            </div>

            <div className="order-1 lg:order-2">
              <p className="mono">What to expect</p>
              <div className="mt-6">
                {expectations.map((item) => (
                  <p key={item} className="border-t border-[color:var(--rule)] py-4 text-[15px] leading-relaxed text-[color:var(--ink-soft)]">
                    {item}
                  </p>
                ))}
                <div className="border-t border-[color:var(--rule)]" />
              </div>

              <div className="mt-14">
                <p className="mono">Call sheet</p>
                <div className="mt-6">
                  {details.map((d) => (
                    <div key={d.label} className="flex items-baseline justify-between border-t border-[color:var(--rule)] py-4">
                      <span className="mono">{d.label}</span>
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
