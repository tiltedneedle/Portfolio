"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { VideoModal } from "@/components/VideoModal";
import type { ModalItem } from "@/lib/site-data";
import { EASE_OUT_EXPO } from "@/lib/design-tokens";

const SHOWREEL = "https://cdn.pixabay.com/video/2019/02/19/21536-318978190_small.mp4";

const showreelItem: ModalItem = {
  id: "showreel",
  title: "Showreel",
  client: "Tilted Needle",
  year: "2026",
  categories: ["Showreel"],
  metrics: [
    { label: "Organic views", value: "2B+" },
    { label: "Revenue generated", value: "$250M+" },
  ],
  summary:
    "Short-form specialists with a full growth stack. Thousands of videos published, decoded and compounded into a repeatable formula.",
  videoUrl: SHOWREEL,
};

// Live studio clocks. Empty on the server and first client paint so hydration
// matches, then filled by effect.
function StudioClocks() {
  const [now, setNow] = useState<{ ldn: string; dxb: string } | null>(null);
  useEffect(() => {
    const fmt = (tz: string) =>
      new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: tz }).format(new Date());
    const tick = () => setNow({ ldn: fmt("Europe/London"), dxb: fmt("Asia/Dubai") });
    tick();
    const t = setInterval(tick, 30_000);
    return () => clearInterval(t);
  }, []);
  return (
    <span className="text-[15px] lowercase text-[color:var(--ink-mid)] tabular-nums" aria-label="Studio local times">
      {now ? "ldn " + now.ldn + " · dxb " + now.dxb : " "}
    </span>
  );
}

function MaskedLine({ children, delay, reduced }: { children: React.ReactNode; delay: number; reduced: boolean }) {
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

/**
 * The reference opens on a full-viewport, near-empty pale ground: a modest
 * lowercase statement sitting mid-left, a down arrow, nothing else. Then the
 * showreel, edge to edge. This does the same with our own line.
 */
export function Statement() {
  const reduced = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const v = videoRef.current;
    if (!v || reduced) return;
    v.play().catch(() => {});
    return () => v.pause();
  }, [reduced]);

  return (
    <>
      <section className="relative bg-[var(--paper)] min-h-[100svh] flex flex-col">
        <div className="mx-auto w-full max-w-[1600px] px-6 md:px-[60px] pt-28 md:pt-32 flex items-baseline justify-between gap-6">
          <p className="text-[15px] lowercase text-[color:var(--ink-mid)]">
            social-first content studio &mdash; london &middot; dubai
          </p>
          <span className="hidden sm:block">
            <StudioClocks />
          </span>
        </div>

        <div className="mx-auto w-full max-w-[1600px] px-6 md:px-[60px] flex-1 flex items-center">
          <h1 className="font-normal lowercase text-[color:var(--ink)] leading-[1.22] text-[34px] sm:text-[42px] md:text-[50px] lg:text-[56px] max-w-[22ch]">
            <MaskedLine delay={0.05} reduced={!!reduced}>
              built to make brands
            </MaskedLine>
            <MaskedLine delay={0.16} reduced={!!reduced}>
              go <span className="em-serif">viral</span>.
            </MaskedLine>
          </h1>
        </div>

        <div className="mx-auto w-full max-w-[1600px] px-6 md:px-[60px] pb-12 md:pb-16">
          <motion.a
            href="#reel"
            aria-label="Scroll to the showreel"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="inline-block text-[40px] leading-none text-[color:var(--ink)] font-light"
          >
            &#8595;
          </motion.a>
        </div>
      </section>

      <section id="reel" className="relative w-full bg-[color:var(--slab-deep)] scroll-mt-0">
        <div className="relative h-[70svh] md:h-[86svh] w-full overflow-hidden">
          <video
            ref={videoRef}
            src={SHOWREEL}
            muted
            loop
            playsInline
            preload="metadata"
            className="absolute inset-0 h-full w-full object-cover"
            aria-hidden="true"
          />
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Play the showreel"
            className="group absolute inset-0 flex items-center justify-center"
          >
            <span className="flex h-20 w-20 items-center justify-center rounded-full bg-black/70 text-white backdrop-blur-sm transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110">
              <span aria-hidden="true" className="ml-1 text-[22px]">&#9654;</span>
            </span>
          </button>
          <p className="pointer-events-none absolute bottom-6 left-6 md:left-[60px] text-[15px] lowercase text-white/85">
            showreel <span className="em-serif">2026</span>
          </p>
        </div>
      </section>

      <VideoModal item={showreelItem} isOpen={open} onClose={() => setOpen(false)} />
    </>
  );
}
