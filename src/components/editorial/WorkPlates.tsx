"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { SectionTag } from "@/components/editorial/SectionTag";
import { VideoModal } from "@/components/VideoModal";
import { attachThrottledVideo } from "@/lib/video-slots";
import { caseStudies, type CaseStudy } from "@/lib/case-studies-data";
import type { ModalItem } from "@/lib/site-data";
import { EASE_OUT_EXPO } from "@/lib/design-tokens";

function Plate({
  study,
  index,
  wide,
  onOpen,
}: {
  study: CaseStudy;
  index: number;
  wide: boolean;
  onOpen: () => void;
}) {
  const reduced = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  // Videos are remote and can be slow, blocked or gone; the plate falls back to
  // the study's own name in the display face rather than an empty rectangle.
  const [playing, setPlaying] = useState(false);

  // Cursor-following "watch" badge. Springs give it a lag that reads as
  // weight; under reduced motion it sits centred instead of chasing.
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const bx = useSpring(mx, { stiffness: 260, damping: 28 });
  const by = useSpring(my, { stiffness: 260, damping: 28 });

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), {
      rootMargin: "200px",
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!inView || !study.videoUrl) return;
    const v = videoRef.current;
    if (!v) return;
    return attachThrottledVideo(v, study.videoUrl, 3000);
  }, [inView, study.videoUrl]);

  const metricLine =
    study.metrics
      .slice(0, 2)
      .map((m) => m.value + " " + m.label.toLowerCase())
      .join(" · ") +
    " · " +
    study.year;

  return (
    <motion.div
      ref={rootRef}
      initial={{ opacity: 0, y: reduced ? 0 : 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, ease: EASE_OUT_EXPO }}
      className={wide ? "md:col-span-7" : "md:col-span-5"}
    >
      <button
        type="button"
        onClick={onOpen}
        onMouseMove={
          reduced
            ? undefined
            : (e) => {
                const r = e.currentTarget.getBoundingClientRect();
                mx.set(e.clientX - r.left);
                my.set(e.clientY - r.top);
              }
        }
        className="group relative block w-full cursor-none text-left max-md:cursor-pointer"
        aria-label={"Open case study: " + study.title + ", " + study.client}
      >
        <div className={"plate relative w-full " + (wide ? "aspect-[16/10]" : "aspect-[4/3]")}>
          <div className="absolute inset-0 skeleton" aria-hidden="true" />
          <div
            aria-hidden="true"
            className={
              "absolute inset-0 flex items-end p-6 md:p-8 transition-opacity duration-700 " +
              (playing ? "opacity-0" : "opacity-100")
            }
          >
            <span className="em-serif text-[32px] md:text-[44px] leading-none text-[color:var(--ink)]/70">
              {study.title.toLowerCase()}
            </span>
          </div>
          <video
            ref={videoRef}
            muted
            loop
            playsInline
            preload="none"
            onPlaying={() => setPlaying(true)}
            className="relative h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.015]"
          />
          {reduced ? (
            <span
              aria-hidden="true"
              className="pill absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-5 py-2.5 text-[13px] font-medium text-[color:var(--ink)] opacity-0 transition-opacity duration-300 group-hover:opacity-100 max-md:hidden"
            >
              watch <span>&#8600;</span>
            </span>
          ) : (
            <motion.span
              aria-hidden="true"
              style={{ x: bx, y: by }}
              className="pill pointer-events-none absolute left-0 top-0 z-10 -translate-x-1/2 -translate-y-1/2 bg-white px-5 py-2.5 text-[13px] font-medium text-[color:var(--ink)] opacity-0 transition-opacity duration-300 group-hover:opacity-100 max-md:hidden"
            >
              watch <span>&#8600;</span>
            </motion.span>
          )}
        </div>
        <div className="mt-4 grid grid-cols-[auto_1fr_auto] items-baseline gap-x-5 border-b border-[color:var(--rule)] pb-5">
          <span className="text-[13px] text-[color:var(--ink-mid)] tabular-nums">
            {String(index + 1).padStart(2, "0")}
          </span>
          <div>
            <h3 className="text-[21px] md:text-[25px] font-light lowercase text-[color:var(--ink)]">
              {study.title}
            </h3>
            <p className="eyebrow-serif mt-1">{study.highlight.toLowerCase()}</p>
          </div>
          <p className="hidden sm:block shrink-0 text-[13px] text-[color:var(--ink-mid)]">
            {metricLine}
          </p>
        </div>
      </button>
    </motion.div>
  );
}

export function WorkPlates() {
  const [selected, setSelected] = useState<ModalItem | null>(null);
  const [open, setOpen] = useState(false);

  return (
    <section id="work" className="relative bg-[var(--paper)] py-20 md:py-28 scroll-mt-16">
      <div className="mx-auto max-w-[1600px] px-6 md:px-[60px]">
        <SectionTag>selected work</SectionTag>

        <div className="mt-10 md:mt-14 grid grid-cols-1 md:grid-cols-12 gap-x-10 gap-y-14 md:gap-y-20">
          {caseStudies.map((study, i) => (
            <Plate
              key={study.id}
              study={study}
              index={i}
              wide={i % 4 === 0 || i % 4 === 3}
              onOpen={() => {
                setSelected(study);
                setOpen(true);
              }}
            />
          ))}
        </div>

        <div className="mt-16 md:mt-20">
          <Link href="/portfolio" className="underline-draw text-[17px] text-[color:var(--ink)]">
            view the full library &mdash; 108 projects <span aria-hidden="true">&#8600;</span>
          </Link>
        </div>
      </div>

      <VideoModal item={selected} isOpen={open} onClose={() => setOpen(false)} />
    </section>
  );
}
