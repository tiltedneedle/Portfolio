"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { VideoModal } from "@/components/VideoModal";
import { RunningTimecode, StudioClocks } from "@/components/room/Readouts";
import { attachThrottledVideo } from "@/lib/video-slots";
import { films } from "@/lib/films";
import { EASE_OUT_EXPO } from "@/lib/design-tokens";
import type { ModalItem } from "@/lib/site-data";

/**
 * The cold open. No slate, no title: a film is already running behind the
 * statement, muted, dimmed to the point where the type reads. The statement is
 * the studio's claim, set in the condensed face with one word dropped to the
 * serif italic. Three controls, all mono: view work, play reel, sound.
 */

// The reel behind "play reel". A placeholder clip until the studio's own
// showreel exists; the films themselves are the real work, one section down.
const SHOWREEL = "https://cdn.pixabay.com/video/2019/02/19/21536-318978190_small.mp4";

const reelItem: ModalItem = {
  id: "showreel",
  title: "Showreel",
  client: "Tilted Needle",
  year: "2026",
  categories: ["Reel"],
  metrics: [
    { label: "Views", value: "2B+" },
    { label: "Revenue", value: "$250M+" },
  ],
  summary: "A cut of the work: short-form for founders, brands and creators.",
  videoUrl: SHOWREEL,
};

function Masked({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const reduced = useReducedMotion();
  return (
    <span className="block overflow-hidden pb-[0.06em]">
      <motion.span
        className="block"
        initial={reduced ? false : { y: "108%" }}
        animate={{ y: 0 }}
        transition={{ duration: 1.1, delay, ease: EASE_OUT_EXPO }}
      >
        {children}
      </motion.span>
    </span>
  );
}

export function ColdOpen() {
  const bg = films[0];
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [sound, setSound] = useState(false);
  const [reelOpen, setReelOpen] = useState(false);

  useEffect(() => {
    const v = videoRef.current;
    if (!v || !bg.videoUrl) return;
    return attachThrottledVideo(v, bg.videoUrl, 4000);
  }, [bg.videoUrl]);

  useEffect(() => {
    const v = videoRef.current;
    if (v) v.muted = !sound;
  }, [sound]);

  return (
    <section className="relative h-[100svh] min-h-[640px] overflow-hidden bg-[color:var(--stage)]">
      {/* the film behind everything */}
      <div aria-hidden="true" className="absolute inset-0">
        {bg.poster && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={bg.poster} alt="" className="absolute inset-0 h-full w-full object-cover opacity-50" />
        )}
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          preload="none"
          onPlaying={() => setPlaying(true)}
          className={
            "absolute inset-0 h-full w-full object-cover transition-opacity duration-[1400ms] " +
            (playing ? "opacity-55" : "opacity-0")
          }
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(11,11,12,0.92)] via-[rgba(11,11,12,0.35)] to-[rgba(11,11,12,0.55)]" />
      </div>

      {/* HUD: the room's instruments */}
      <div className="absolute inset-x-0 top-20 flex items-center justify-between px-6 md:px-14 mono">
        <p className="flex items-center gap-2">
          <span className={playing ? "lamp" : "lamp-off"} aria-hidden="true" />
          <span>{playing ? "Rec" : "Standby"}</span>
          <RunningTimecode className="ml-2 text-[color:var(--ink-soft)]" />
        </p>
        <StudioClocks className="max-md:hidden" />
      </div>

      {/* the statement */}
      <div className="absolute inset-x-0 bottom-0 px-6 pb-10 md:px-14 md:pb-14">
        <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="display text-[clamp(64px,12.5vw,208px)]">
              <Masked>Cut for the</Masked>
              <Masked delay={0.12}>
                <span className="em-serif">scroll.</span>
              </Masked>
            </h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.7 }}
              className="mt-6 max-w-[42ch] text-[17px] leading-relaxed text-[color:var(--ink-soft)]"
            >
              A short-form studio in London and Dubai. Six films below, two billion views
              between them, and $250M+ in revenue for the people on screen.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.9 }}
            className="flex flex-wrap items-center gap-x-8 gap-y-3 mono-lg"
          >
            <a href="#work" className="slate-link text-[13px]" data-cursor="Cut">
              View work &darr;
            </a>
            <button
              type="button"
              onClick={() => setReelOpen(true)}
              className="slate-link text-[13px]"
              data-cursor="Play"
            >
              Play reel &#9654;
            </button>
            <button
              type="button"
              onClick={() => setSound((s) => !s)}
              className="slate-link flex items-center gap-2 text-[13px]"
              aria-pressed={sound}
            >
              <span className={sound ? "lamp" : "lamp-off"} aria-hidden="true" />
              Sound {sound ? "on" : "off"}
            </button>
          </motion.div>
        </div>
      </div>

      <VideoModal item={reelOpen ? reelItem : null} isOpen={reelOpen} onClose={() => setReelOpen(false)} />
    </section>
  );
}
