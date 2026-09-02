"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { EASE_OUT_EXPO } from "@/lib/design-tokens";

const stats = [
  { value: "2B+", label: "organic views" },
  { value: "$250M+", label: "revenue generated" },
  { value: "11+", label: "flagship clients" },
];

const SHOWREEL = "https://cdn.pixabay.com/video/2019/02/19/21536-318978190_small.mp4";

// Live studio clocks. Rendered empty on the server and on the client's first
// paint so hydration matches, then filled by effect and kept fresh.
function StudioClocks() {
  const [now, setNow] = useState<{ ldn: string; dxb: string } | null>(null);

  useEffect(() => {
    const fmt = (tz: string) =>
      new Intl.DateTimeFormat("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: tz,
      }).format(new Date());
    const tick = () => setNow({ ldn: fmt("Europe/London"), dxb: fmt("Asia/Dubai") });
    tick();
    const t = setInterval(tick, 30_000);
    return () => clearInterval(t);
  }, []);

  return (
    <span className="eyebrow tabular-nums" aria-label="Studio local times">
      {now ? "ldn " + now.ldn + " — dxb " + now.dxb : " "}
    </span>
  );
}

// One line of the statement, revealed from behind a mask. The mask carries a
// hair of bottom padding (pulled back with a negative margin) so descenders
// aren't clipped by the overflow once the line settles.
function MaskedLine({
  children,
  delay,
  reduced,
}: {
  children: React.ReactNode;
  delay: number;
  reduced: boolean;
}) {
  return (
    <span className="block overflow-hidden pb-[0.12em] -mb-[0.12em]">
      <motion.span
        className="block"
        initial={{ y: reduced ? 0 : "110%" }}
        animate={{ y: 0 }}
        transition={{ duration: 0.9, delay, ease: EASE_OUT_EXPO }}
      >
        {children}
      </motion.span>
    </span>
  );
}

export function Statement() {
  const reduced = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);

  // Ambient loop, not content: no controls, muted, and it stays paused for
  // visitors who asked for reduced motion.
  useEffect(() => {
    const v = videoRef.current;
    if (!v || reduced) return;
    v.play().catch(() => {});
    return () => v.pause();
  }, [reduced]);

  const rise = (delay: number) => ({
    initial: { opacity: 0, y: reduced ? 0 : 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, delay, ease: EASE_OUT_EXPO },
  });

  return (
    <section className="relative bg-[var(--paper)] pt-32 md:pt-40 pb-16 md:pb-24">
      <div className="mx-auto max-w-[1600px] px-6 md:px-[60px]">
        <motion.div {...rise(0)} className="mb-8 flex items-baseline justify-between gap-6">
          <p className="eyebrow">
            Social-first content studio &mdash; London &middot; Dubai &middot; Global
          </p>
          <span className="hidden sm:block">
            <StudioClocks />
          </span>
        </motion.div>

        <h1 className="font-thin text-[color:var(--ink)] leading-[1.14] text-[13vw] sm:text-[64px] md:text-[84px] lg:text-[104px]">
          <MaskedLine delay={0.05} reduced={!!reduced}>
            Built to make brands
          </MaskedLine>
          <MaskedLine delay={0.16} reduced={!!reduced}>
            go <span className="em-serif">viral</span>.
          </MaskedLine>
        </h1>

        <motion.div
          {...rise(0.3)}
          className="mt-10 md:mt-14 flex flex-wrap items-end justify-between gap-8"
        >
          <p className="text-[17px] md:text-[21px] text-[color:var(--ink-mid)] max-w-[44ch] leading-relaxed">
            Short-form specialists with a full growth stack. Thousands of videos
            published, decoded and compounded into a repeatable formula.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/book-demo"
              className="pill pill-solid px-7 py-3 text-[15px] inline-flex items-center"
            >
              Book a demo
            </Link>
            <a href="#work" className="underline-draw text-[15px] text-[color:var(--ink)]">
              see the work <span aria-hidden="true">&#8600;</span>
            </a>
          </div>
        </motion.div>
      </div>

      <motion.div {...rise(0.42)} className="mx-auto max-w-[1600px] px-6 md:px-[60px] mt-14 md:mt-20">
        <div className="plate aspect-[21/9] w-full">
          <video
            ref={videoRef}
            src={SHOWREEL}
            muted
            loop
            playsInline
            preload="metadata"
            className="h-full w-full object-cover"
            aria-label="Showreel: fast cuts of social-first content production"
          />
        </div>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 border-t border-[color:var(--rule)]">
          {stats.map((s) => (
            <div
              key={s.label}
              className="py-7 sm:py-9 flex items-baseline gap-4 sm:block border-b sm:border-b-0 border-[color:var(--rule)] last:border-b-0"
            >
              <span className="block text-[40px] md:text-[50px] font-thin text-[color:var(--ink)] leading-none">
                {s.value}
              </span>
              <span className="eyebrow-serif mt-2 block">{s.label}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
