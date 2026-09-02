"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { EASE_OUT_EXPO } from "@/lib/design-tokens";

const stats = [
  { value: "2B+", label: "organic views" },
  { value: "$250M+", label: "revenue generated" },
  { value: "11+", label: "flagship clients" },
];

const SHOWREEL = "https://cdn.pixabay.com/video/2019/02/19/21536-318978190_small.mp4";

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
        <motion.p {...rise(0)} className="eyebrow mb-8">
          Social-first content studio &mdash; London &middot; Dubai &middot; Global
        </motion.p>

        <motion.h1
          {...rise(0.08)}
          className="font-thin text-[color:var(--ink)] leading-[1.14] text-[13vw] sm:text-[64px] md:text-[84px] lg:text-[104px] max-w-[16ch]"
        >
          Built to make brands go <span className="em-serif">viral</span>.
        </motion.h1>

        <motion.div
          {...rise(0.16)}
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

      <motion.div {...rise(0.24)} className="mx-auto max-w-[1600px] px-6 md:px-[60px] mt-14 md:mt-20">
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
