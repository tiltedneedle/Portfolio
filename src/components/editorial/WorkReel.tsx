"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { VideoModal } from "@/components/VideoModal";
import { attachThrottledVideo } from "@/lib/video-slots";
import { caseStudies, type CaseStudy } from "@/lib/case-studies-data";
import type { ModalItem } from "@/lib/site-data";

/**
 * Work the way the reference shows it: edge to edge, near viewport-tall,
 * captions set in white over the picture, rows flush against each other.
 * Nothing sits in a card. Some rows are two-up.
 */
function Frame({ study, tall, onOpen }: { study: CaseStudy; tall: boolean; onOpen: () => void }) {
  const reduced = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [playing, setPlaying] = useState(false);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const bx = useSpring(mx, { stiffness: 260, damping: 28 });
  const by = useSpring(my, { stiffness: 260, damping: 28 });

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin: "300px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!inView || !study.videoUrl) return;
    const v = videoRef.current;
    if (!v) return;
    return attachThrottledVideo(v, study.videoUrl, 3000);
  }, [inView, study.videoUrl]);

  return (
    <div ref={rootRef} className={"relative w-full bg-[color:var(--slab-deep)] " + (tall ? "h-[80svh] md:h-[92svh]" : "h-[60svh] md:h-[72svh]")}>
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
        className="group absolute inset-0 block h-full w-full cursor-none text-left max-md:cursor-pointer"
        aria-label={"Open case study: " + study.title + ", " + study.client}
      >
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          preload="none"
          onPlaying={() => setPlaying(true)}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.02]"
        />

        {/* Until the video reports playing, the title stands in — never a void. */}
        <div
          aria-hidden="true"
          className={"absolute inset-0 flex items-center justify-center transition-opacity duration-700 " + (playing ? "opacity-0" : "opacity-100")}
        >
          <span className="em-serif text-[40px] md:text-[72px] text-white/60 lowercase">{study.title}</span>
        </div>

        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 to-transparent" />

        <p className="em-serif absolute right-6 top-5 md:right-[60px] text-[17px] text-white/90 lowercase">
          {study.highlight}
        </p>

        <div className="absolute bottom-6 left-6 md:left-[60px] md:bottom-8">
          <h3 className="text-[25px] md:text-[32px] font-normal lowercase text-white leading-tight">{study.title}</h3>
          <p className="mt-1 text-[15px] text-white/80 lowercase">
            {study.client} <span className="mx-1">//</span> <span className="em-serif">{study.categories[0]}</span>
          </p>
        </div>

        {reduced ? (
          <span aria-hidden="true" className="pill absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-5 py-2.5 text-[13px] font-medium text-black opacity-0 transition-opacity duration-300 group-hover:opacity-100 max-md:hidden">
            watch <span>&#8600;</span>
          </span>
        ) : (
          <motion.span
            aria-hidden="true"
            style={{ x: bx, y: by }}
            className="pill pointer-events-none absolute left-0 top-0 z-10 -translate-x-1/2 -translate-y-1/2 bg-white px-5 py-2.5 text-[13px] font-medium text-black opacity-0 transition-opacity duration-300 group-hover:opacity-100 max-md:hidden"
          >
            watch <span>&#8600;</span>
          </motion.span>
        )}
      </button>
    </div>
  );
}

// Row layout: full, two-up, full, two-up.
const ROWS: number[][] = [[0], [1, 2], [3], [4, 5]];

export function WorkReel() {
  const [selected, setSelected] = useState<ModalItem | null>(null);
  const [open, setOpen] = useState(false);
  const openStudy = (s: CaseStudy) => {
    setSelected(s);
    setOpen(true);
  };

  return (
    <section id="work" className="relative bg-[color:var(--slab-deep)] scroll-mt-0">
      {/* The reference runs its work with no visible heading; screen readers still get one. */}
      <h2 className="sr-only">Selected work</h2>
      {ROWS.map((row, r) => (
        <div key={r} className={row.length === 2 ? "grid grid-cols-1 md:grid-cols-2" : "grid grid-cols-1"}>
          {row.map((i) => {
            const study = caseStudies[i];
            return study ? (
              <Frame key={study.id} study={study} tall={row.length === 1} onOpen={() => openStudy(study)} />
            ) : null;
          })}
        </div>
      ))}

      <div className="bg-[var(--paper)]">
        <div className="mx-auto max-w-[1600px] px-6 md:px-[60px] py-14 md:py-20">
          <Link href="/portfolio" className="underline-draw text-[21px] md:text-[25px] lowercase text-[color:var(--ink)]">
            view the full library &mdash; 108 projects <span aria-hidden="true">&#8599;</span>
          </Link>
        </div>
      </div>

      <VideoModal item={selected} isOpen={open} onClose={() => setOpen(false)} />
    </section>
  );
}
