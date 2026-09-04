"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { CutLink } from "@/components/room/CutLink";
import { attachThrottledVideo } from "@/lib/video-slots";
import { films, pad2, timecode, type Film } from "@/lib/films";
import picksData from "@/lib/published-picks.json";

/**
 * The sequence. Six films racked on a timeline, each 9:16, standing in the
 * dark like clips in a bin. On desktop the section pins and vertical scroll
 * shuttles the strip sideways: the scroll IS the playhead, and the ruler
 * underneath reads where you are. The film under the playhead plays; hover
 * plays any other. On a phone each film fills the screen, one after another,
 * and plays as it arrives.
 *
 * Every frame has a slate (number, client, title) that stands until the video
 * reports a frame, so a slow or missing film never reads as a black hole.
 */

const NOMINAL_SECONDS = 15; // per film, when the real duration is unknown

// How many clips the library holds, written at export time so the home page
// does not carry the index itself.
const LIBRARY_COUNT = Number((picksData as Record<string, unknown>)["__count"] ?? 0);

function Frame({
  film,
  live,
  mobile,
  onHover,
  onFocus,
}: {
  film: Film;
  live: boolean;
  mobile: boolean;
  onHover: (on: boolean) => void;
  onFocus: () => void;
}) {
  const root = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const tc = useRef<HTMLSpanElement>(null);
  const [inView, setInView] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [dead, setDead] = useState(false);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), {
      threshold: mobile ? 0.55 : 0.2,
    });
    io.observe(el);
    return () => io.disconnect();
  }, [mobile]);

  const shouldPlay = inView && (mobile || live) && !dead;

  useEffect(() => {
    const v = videoRef.current;
    if (!v || !shouldPlay || !film.videoUrl) return;
    const release = attachThrottledVideo(v, film.videoUrl, 4000);
    return () => {
      release();
      setPlaying(false);
    };
  }, [shouldPlay, film.videoUrl]);

  const onTime = () => {
    const v = videoRef.current;
    if (!v || !v.duration) return;
    if (bar.current) bar.current.style.width = (v.currentTime / v.duration) * 100 + "%";
    if (tc.current) tc.current.textContent = timecode(v.currentTime);
  };

  return (
    <div
      ref={root}
      className="relative h-[100svh] w-full shrink-0 overflow-hidden bg-[color:var(--stage-2)] md:h-[72svh] md:w-auto md:aspect-[9/16]"
      onPointerEnter={() => onHover(true)}
      onPointerLeave={() => onHover(false)}
    >
      <CutLink
        href={"/film/" + film.slug}
        className="group absolute inset-0 block"
        aria-label={"Open film " + pad2(film.index) + ": " + film.title + ", " + film.client}
        data-cursor="Open"
        onFocus={onFocus}
      >
        {film.poster && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={film.poster} alt="" className="absolute inset-0 h-full w-full object-cover" />
        )}
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          preload="none"
          onPlaying={() => setPlaying(true)}
          onTimeUpdate={onTime}
          // A source that fails stays on its slate and stops asking for a slot.
          onError={() => setDead(true)}
          className={
            "absolute inset-0 h-full w-full object-cover transition-opacity duration-700 " +
            (playing ? "opacity-100" : "opacity-0")
          }
        />

        {/* the slate: stands until a frame arrives. A real still is its own
            slate (the cut's caption is already in the picture), so the title
            only stands on frames that have nothing else. */}
        <div
          aria-hidden="true"
          className={
            "absolute inset-0 flex items-center justify-center p-5 pb-32 transition-opacity duration-700 " +
            (playing || film.poster ? "opacity-0" : "opacity-100")
          }
        >
          <p className="display text-center text-[clamp(40px,4.4vw,72px)] leading-[0.9] text-[color:var(--ink)]/70">
            {film.title}
          </p>
        </div>

        {/* scrim for the caption */}
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-[rgba(0,0,0,0.75)] to-transparent" />

        {/* readouts */}
        <div className="absolute inset-x-0 top-0 flex items-center justify-between p-5 mono">
          <span className="flex items-center gap-2">
            <span className={playing ? "lamp" : "lamp-off"} />
            {playing ? "Playing" : dead ? "Offline" : "Cued"}
          </span>
          <span ref={tc} className="tc text-[11px]">
            00:00:00:00
          </span>
        </div>

        <div className="absolute inset-x-0 bottom-0 p-5">
          <p className="mono">
            {pad2(film.index)} <span className="text-[color:var(--ink-faint)]">/</span> {film.client}
          </p>
          <p className="mt-1 text-[17px] text-[color:var(--ink)]">{film.title}</p>
          <p className="em-serif mt-1 text-[17px] text-[color:var(--ink-soft)]">{film.highlight}</p>
          <span aria-hidden="true" className="mt-4 block h-px w-full bg-[color:var(--rule-strong)]">
            <span ref={bar} className="block h-px w-0 bg-[color:var(--tally)]" />
          </span>
        </div>
      </CutLink>
    </div>
  );
}

export function Sequence() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const tcOut = useRef<HTMLSpanElement>(null);
  const [range, setRange] = useState(0);
  const [mobile, setMobile] = useState(false);
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);

  const n = films.length;
  const total = films.reduce((s, f) => s + (f.duration ?? NOMINAL_SECONDS), 0);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const measure = () => {
      const isMobile = !window.matchMedia("(min-width: 768px)").matches;
      setMobile(isMobile);
      setRange(isMobile ? 0 : Math.max(0, el.scrollWidth - window.innerWidth));
    };
    measure();
    // The strip is sized by its type; a late-arriving display face changes
    // its width, so measure again once every font has settled.
    let live = true;
    document.fonts?.ready.then(() => {
      if (live) measure();
    });
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    window.addEventListener("orientationchange", measure);
    return () => {
      live = false;
      ro.disconnect();
      window.removeEventListener("resize", measure);
      window.removeEventListener("orientationchange", measure);
    };
  }, []);

  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -range]);
  const playhead = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    if (tcOut.current) tcOut.current.textContent = timecode(p * total);
    const i = Math.min(n - 1, Math.max(0, Math.round(p * (n - 1))));
    setActive((prev) => (prev === i ? prev : i));
  });

  const current = films[hovered ?? active];

  // Keyboard: the strip is translated, not scrolled, so a focused frame can
  // sit off-screen to the right. Drive the scroll (and so the shuttle) to the
  // position that brings it under the playhead.
  const focusFilm = (i: number) => {
    const el = section.current;
    if (!el || mobile || range === 0) return;
    // After the browser's own focus scroll, not before it: an instant jump
    // here cancels that (smooth) scroll instead of being overridden by it.
    requestAnimationFrame(() => {
      const top = el.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: top + (range * i) / (n - 1), behavior: "auto" });
    });
  };

  return (
    <section
      id="work"
      ref={section}
      className="relative bg-[color:var(--stage)]"
      style={{ height: range > 0 ? "calc(100svh + " + range + "px)" : undefined }}
    >
      {/* overflow-clip, not hidden: a hidden box still scrolls when a child is
          focused, which would offset the strip under the transform. Clip cannot. */}
      <div className="md:sticky md:top-0 md:flex md:h-[100svh] md:flex-col md:justify-center md:overflow-clip">
        <motion.div
          ref={track}
          style={mobile ? undefined : { x }}
          className="flex flex-col md:w-max md:flex-row md:items-center md:gap-6 md:px-[8vw]"
        >
          {/* the bin label */}
          <div className="w-full shrink-0 px-6 py-20 md:w-[32vw] md:py-0">
            <p className="mono">01 &mdash; Selected work</p>
            <h2 className="display mt-4 text-[clamp(56px,7vw,120px)]">
              Six <span className="em-serif">films.</span>
            </h2>
            <p className="mt-6 max-w-[34ch] text-[17px] leading-relaxed text-[color:var(--ink-soft)]">
              Shot for the phone, cut for the scroll. Every one is a person, a claim and a
              number that came true.
            </p>
            <p className="mono mt-8 max-md:hidden">Scroll to shuttle &middot; hover to play &middot; click to open</p>
          </div>

          {films.map((f, i) => (
            <Frame
              key={f.slug}
              film={f}
              mobile={mobile}
              live={hovered === null ? active === i : hovered === i}
              onHover={(on) => setHovered(on ? i : (h) => (h === i ? null : h))}
              onFocus={() => focusFilm(i)}
            />
          ))}

          {/* the end card */}
          <div className="w-full shrink-0 px-6 py-20 md:w-[30vw] md:py-0">
            <p className="mono">End of selection</p>
            <CutLink href="/portfolio" className="display mt-4 block text-[clamp(48px,5.5vw,96px)] underline-draw w-fit" data-cursor="Cut">
              The library &#8599;
            </CutLink>
            <p className="mono mt-4">{LIBRARY_COUNT} clips, on the board</p>
          </div>
        </motion.div>

        {/* the ruler */}
        <div className="mx-[8vw] mt-8 max-md:hidden">
          <div className="relative h-6 border-t border-[color:var(--rule-strong)]">
            {films.map((f, i) => (
              <span
                key={f.slug}
                aria-hidden="true"
                className="absolute top-0 mono text-[10px]"
                style={{ left: (i / (n - 1)) * 100 + "%", transform: "translateX(-50%)" }}
              >
                <span className="block h-2 w-px bg-[color:var(--rule-strong)] mx-auto" />
                <span className="mt-1 block">{pad2(i + 1)}</span>
              </span>
            ))}
            <motion.span
              aria-hidden="true"
              style={{ left: playhead }}
              className="absolute -top-px h-4 w-[2px] -translate-x-1/2 bg-[color:var(--tally)] shadow-[0_0_8px_var(--tally-glow)]"
            />
          </div>
          <div className="mt-3 flex items-center justify-between mono">
            <span>
              TC <span ref={tcOut} className="tc">00:00:00:00</span>
            </span>
            <span>
              Film {pad2(current.index)} / {pad2(n)} <span className="text-[color:var(--ink-faint)]">/</span>{" "}
              <span className="text-[color:var(--ink-soft)]">{current.title}</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
