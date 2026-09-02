"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { SectionTag } from "@/components/editorial/SectionTag";
import { VideoModal } from "@/components/VideoModal";
import { attachThrottledVideo } from "@/lib/video-slots";
import { caseStudies, type CaseStudy } from "@/lib/case-studies-data";
import type { ModalItem } from "@/lib/site-data";
import { EASE_OUT_EXPO } from "@/lib/design-tokens";

function Plate({ study, wide, onOpen }: { study: CaseStudy; wide: boolean; onOpen: () => void }) {
  const reduced = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

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

  const metricLine = study.metrics
    .slice(0, 2)
    .map((m) => m.value + " " + m.label.toLowerCase())
    .join(" · ");

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
        className="group block w-full text-left"
        aria-label={"Open case study: " + study.title + ", " + study.client}
      >
        <div className={"plate w-full " + (wide ? "aspect-[16/10]" : "aspect-[4/3]")}>
          <div className="absolute inset-0 skeleton" aria-hidden="true" />
          <video
            ref={videoRef}
            muted
            loop
            playsInline
            preload="none"
            className="relative h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.015]"
          />
        </div>
        <div className="mt-4 flex items-baseline justify-between gap-6 border-b border-[color:var(--rule)] pb-5">
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
