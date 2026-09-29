"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { TrainingFilm as Film } from "@/content/types";
import { Still } from "@/components/portal/Still";
import { embedUrl } from "@/lib/embed";
import { Reveal } from "@/components/portal/Reveal";

/** Starting one film stops any other on the page: one picture at a time. */
const PLAY = "tn:film-play";

const MINI = 360; // px wide, at most, once pinned to the corner
const EDGE = 20; // px from the screen's right edge when pinned
const GAP = 12; // px under the nav bar
const RUN = 420; // px of scroll over which it travels into the corner

/**
 * The training film for a guide. With a YouTube id it is a 16:9 picture of
 * medium size -- about three quarters of the page on a wide screen, never
 * past 1040px -- showing the film's own frame and playing on click from the
 * privacy-enhanced host.
 *
 * Scroll past it and it comes with you: it slides up to the top right,
 * under the nav, shrinking as it goes, and stops shrinking at the size of a
 * corner monitor (360px wide, or under half a phone's width), where it
 * stays for the rest of the page so the film can be watched while the page
 * is read. Scrolling back to its place brings it home at full size; the x
 * on the corner monitor sends it home and stops the film until the reader
 * returns to it. A guide's film always follows (dock="always"); the home
 * page's two follow only while playing (dock="playing"), so an unwatched
 * intro does not trail the reader down the page. The player is one element
 * whose position changes -- never a moved one -- so a playing film does not
 * reload as it travels.
 *
 * Without an id it is not an empty 16:9 box. A suite represents a film
 * nobody has shot as a slot on the timeline with the playhead parked at
 * zero: the title, the state, and a strip of frame marks with nothing on
 * them. The page reads finished, and the slot is waiting rather than
 * broken.
 *
 * A shot film opens the way a picture opens in a cinema: as it comes on,
 * the black bars at its top and foot draw back and the frame settles from a
 * slight push-in (.letterbox, .film-push; reveal-driven, so it is served
 * open and a reader who asked for stillness never sees the bars).
 */
export function TrainingFilm({ film, number, dock = "always" }: { film: Film; number: string; dock?: "always" | "playing" }) {
  const [playing, setPlaying] = useState(false);
  const me = useId();
  const player = useRef<HTMLDivElement>(null);
  const closed = useRef(false);
  const id = film.youtubeId;

  // One film at a time.
  useEffect(() => {
    const other = (e: Event) => {
      if ((e as CustomEvent<string>).detail !== me) setPlaying(false);
    };
    window.addEventListener(PLAY, other);
    return () => window.removeEventListener(PLAY, other);
  }, [me]);

  const play = () => {
    window.dispatchEvent(new CustomEvent(PLAY, { detail: me }));
    setPlaying(true);
  };

  // Following the reader: the player's box, interpolated from its place on
  // the page to the corner monitor by how far its place has scrolled above
  // the nav bar.
  useEffect(() => {
    const el = player.current;
    const slot = el?.parentElement;
    if (!el || !slot || !id) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    const home = () => {
      el.classList.remove("is-docked", "is-mini");
      el.style.removeProperty("position");
      el.style.removeProperty("left");
      el.style.removeProperty("top");
      el.style.removeProperty("width");
      el.style.removeProperty("height");
    };
    const place = () => {
      frame = 0;
      const r = slot.getBoundingClientRect();
      const nav = document.querySelector<HTMLElement>("[data-nav]")?.getBoundingClientRect().bottom ?? 0;
      const pin = Math.max(0, nav) + GAP;
      const past = pin - r.top;
      // Back at its place: home, and free to follow again next time.
      if (past <= 0) {
        closed.current = false;
        return home();
      }
      if (closed.current || (dock === "playing" && !playing)) return home();
      const vw = document.documentElement.clientWidth;
      const mini = Math.min(MINI, vw * 0.46, r.width);
      // Under reduced motion it goes straight to the corner: no travel.
      const d = reduced ? 1 : Math.min(1, past / Math.min(RUN, r.height * 0.8));
      const e = 1 - (1 - d) * (1 - d); // quick off the mark, settling into the corner
      const w = r.width + (mini - r.width) * e;
      el.style.position = "fixed";
      el.style.left = r.left + (vw - EDGE - mini - r.left) * e + "px";
      el.style.top = pin + "px";
      el.style.width = w + "px";
      el.style.height = (w * 9) / 16 + "px";
      el.classList.add("is-docked");
      el.classList.toggle("is-mini", d >= 1);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(place);
    };
    place();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
      home();
    };
  }, [id, dock, playing]);

  const sendHome = () => {
    closed.current = true;
    setPlaying(false);
    const el = player.current;
    if (el) {
      el.classList.remove("is-docked", "is-mini");
      el.style.removeProperty("position");
      el.style.removeProperty("left");
      el.style.removeProperty("top");
      el.style.removeProperty("width");
      el.style.removeProperty("height");
    }
  };

  if (!id)
    return (
      <figure className="no-print relative w-full overflow-hidden border border-[color:var(--rule)] bg-[color:var(--stage-2)] px-5 py-5 md:px-6 md:py-6 lg:max-w-[min(1040px,76%)]">
        <p className="mono flex items-center justify-between gap-4">
          <span className="flex items-center gap-2">
            <span className="lamp-off" aria-hidden="true" />
            Training film <span className="text-[color:var(--ink-mid)]">/</span> {number}
          </span>
          <span className="text-[color:var(--ink-mid)]">Not yet shot</span>
        </p>
        <div className="mt-8 flex flex-wrap items-baseline gap-x-6 gap-y-2 md:mt-10">
          <p className="display text-[clamp(28px,3.4vw,52px)] leading-[0.95] text-[color:var(--ink)]">{film.title}</p>
          <p className="mono text-[color:var(--ink-mid)]">Arrives with your onboarding</p>
        </div>
        <div aria-hidden="true" className="film-track mt-7 md:mt-9" />
      </figure>
    );

  return (
    <Reveal
      as="figure"
      className="relative aspect-video w-full overflow-hidden border border-[color:var(--rule)] bg-[color:var(--stage-2)] lg:max-w-[min(1040px,76%)]"
    >
      {/* What its place shows while the film is up in the corner. */}
      <p aria-hidden="true" className="mono absolute inset-0 flex items-center justify-center gap-2 text-[color:var(--ink-mid)]">
        <span className="lamp-off" />
        In the corner, top right &#8599;
      </p>
      <div ref={player} className="film-player absolute inset-0 overflow-hidden bg-[color:var(--stage-2)]">
        {playing ? (
          <iframe
            src={embedUrl(id)}
            title={"Training film: " + film.title}
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        ) : (
          <>
            <span className="film-push absolute inset-0">
              <Still src={"https://i.ytimg.com/vi/" + id + "/maxresdefault.jpg"} eager sizes="(min-width:1024px) 1040px, 100vw" className="object-cover opacity-70" />
            </span>
            {/* The slate line and the title are ink on whatever frame YouTube
                chose, and these films open on a bright room. Two scrims, so the
                type is legible on a light frame and the frame still reads. */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-2/5 bg-gradient-to-b from-[rgba(0,0,0,0.75)] via-[rgba(0,0,0,0.35)] to-transparent" />
            <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-[rgba(0,0,0,0.85)] via-[rgba(0,0,0,0.4)] to-transparent" />
            <div className="film-slate mono absolute inset-x-0 top-0">
              <span className="flex items-center gap-2">
                <span className="lamp" aria-hidden="true" />
                Training film <span className="text-[color:var(--ink-mid)]">/</span> {number}
              </span>
              {film.minutes ? <span className="tc text-[11px]">{String(film.minutes).padStart(2, "0")}:00</span> : null}
            </div>
            <div className="film-title absolute inset-x-0 bottom-0">
              <p className="display leading-[0.9] text-[color:var(--ink)]">{film.title}</p>
            </div>
            <button
              type="button"
              onClick={play}
              className="absolute inset-0 flex items-center justify-center"
              aria-label={"Play the training film: " + film.title}
              data-cursor="Play"
            >
              <span className="pill pill-outline px-6 py-3 text-[13px] backdrop-blur-md">Play &#9654;</span>
            </button>
            <span aria-hidden="true" className="letterbox letterbox-top" />
            <span aria-hidden="true" className="letterbox letterbox-foot" />
          </>
        )}
        <button type="button" onClick={sendHome} className="film-close" aria-label={"Close the corner player: " + film.title}>
          &times;
        </button>
      </div>
    </Reveal>
  );
}
