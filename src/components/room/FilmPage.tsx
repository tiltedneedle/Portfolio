"use client";

import { useEffect, useRef, useState } from "react";
import { CutLink } from "@/components/room/CutLink";
import { attachThrottledVideo } from "@/lib/video-slots";
import { pad2, timecode, type Film } from "@/lib/films";

/**
 * A film page is a suite with one clip loaded. The slate runs across the top
 * (number, client, year, categories), the film stands 9:16 in its well with
 * real transport controls, and beside it the idea and the numbers. The page
 * ends on a match cut to the next film.
 */
export function FilmPage({ film, next }: { film: Film; next: Film }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const tc = useRef<HTMLSpanElement>(null);
  const [playing, setPlaying] = useState(false);
  const [paused, setPaused] = useState(false);
  const [sound, setSound] = useState(false);
  const [dead, setDead] = useState(false);

  useEffect(() => {
    const v = videoRef.current;
    if (!v || !film.videoUrl) return;
    return attachThrottledVideo(v, film.videoUrl, 6000);
  }, [film.videoUrl]);

  useEffect(() => {
    const v = videoRef.current;
    if (v) v.muted = !sound;
  }, [sound]);

  const onTime = () => {
    const v = videoRef.current;
    if (!v || !v.duration) return;
    if (bar.current) bar.current.style.width = (v.currentTime / v.duration) * 100 + "%";
    if (tc.current) tc.current.textContent = timecode(v.currentTime);
  };

  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play().catch(() => {});
      setPaused(false);
    } else {
      v.pause();
      setPaused(true);
    }
  };

  const scrub = (e: React.MouseEvent<HTMLButtonElement>) => {
    const v = videoRef.current;
    if (!v || !v.duration) return;
    const r = e.currentTarget.getBoundingClientRect();
    v.currentTime = ((e.clientX - r.left) / r.width) * v.duration;
  };

  const live = playing && !paused;

  return (
    <article className="bg-[color:var(--stage)] pt-24 md:pt-28">
      {/* the slate */}
      <header className="mx-auto max-w-[1600px] px-6 md:px-14">
        <div className="grid grid-cols-2 gap-x-6 gap-y-2 border-y border-[color:var(--rule-strong)] py-4 mono md:grid-cols-4">
          <p>
            <span className="text-[color:var(--ink-faint)]">Film</span> {pad2(film.index)} / {pad2(6)}
          </p>
          <p>
            <span className="text-[color:var(--ink-faint)]">Client</span> {film.client}
          </p>
          <p>
            <span className="text-[color:var(--ink-faint)]">Year</span> {film.year}
          </p>
          <p>
            <span className="text-[color:var(--ink-faint)]">Format</span> {film.categories.join(" / ")}
          </p>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-x-16 gap-y-14 px-6 py-14 md:grid-cols-12 md:px-14 md:py-20">
        {/* the well */}
        <div className="md:col-span-5">
          <div className="md:sticky md:top-24">
            <div className="well mx-auto max-h-[82svh] w-auto max-w-full" style={{ height: "min(82svh, 900px)" }}>
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
                onError={() => setDead(true)}
                className={
                  "absolute inset-0 h-full w-full object-cover transition-opacity duration-700 " +
                  (playing ? "opacity-100" : "opacity-0")
                }
              />
              <div
                aria-hidden="true"
                className={
                  "absolute inset-0 flex flex-col justify-between p-6 transition-opacity duration-700 " +
                  (playing ? "opacity-0" : "opacity-100")
                }
              >
                <p className="mono">Film {pad2(film.index)}</p>
                <div>
                  <p className="display text-[clamp(40px,4vw,64px)] leading-[0.9] text-[color:var(--ink)]/85">{film.title}</p>
                  {dead && <p className="mono mt-4 text-[color:var(--tally)]">Source offline</p>}
                </div>
              </div>

              <button
                type="button"
                onClick={toggle}
                className="absolute inset-0 block h-full w-full"
                aria-label={live ? "Pause film" : "Play film"}
                data-cursor={live ? "Pause" : "Play"}
              />
            </div>

            {/* transport */}
            <div className="mt-4">
              <button
                type="button"
                onClick={scrub}
                className="block h-4 w-full"
                aria-label="Scrub"
                data-cursor="Scrub"
              >
                <span className="block h-px w-full bg-[color:var(--rule-strong)]">
                  <span ref={bar} className="block h-px w-0 bg-[color:var(--tally)]" />
                </span>
              </button>
              <div className="flex items-center justify-between mono">
                <span className="flex items-center gap-2">
                  <span className={live ? "lamp" : "lamp-off"} aria-hidden="true" />
                  {live ? "Playing" : paused ? "Paused" : "Cued"}
                  <span ref={tc} className="tc ml-2">
                    00:00:00:00
                  </span>
                  {film.duration ? <span className="text-[color:var(--ink-faint)]">/ {timecode(film.duration)}</span> : null}
                </span>
                <button type="button" onClick={() => setSound((s) => !s)} className="slate-link" aria-pressed={sound}>
                  Sound {sound ? "on" : "off"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* the read */}
        <div className="md:col-span-7">
          <h1 className="display text-[clamp(56px,8vw,140px)]">{film.title}</h1>
          <p className="em-serif mt-6 text-[clamp(24px,2.6vw,40px)] text-[color:var(--ink-soft)]">{film.highlight}</p>

          <div className="mt-14 border-t border-[color:var(--rule)] pt-8">
            <p className="mono">The idea</p>
            <p className="mt-4 max-w-[52ch] text-[19px] leading-relaxed text-[color:var(--ink-soft)] md:text-[21px]">{film.summary}</p>
          </div>

          <div className="mt-12 border-t border-[color:var(--rule)] pt-8">
            <p className="mono">The numbers</p>
            <dl className="mt-6 grid grid-cols-2 gap-8">
              {film.metrics.map((m) => (
                <div key={m.label}>
                  <dd className="display tabular text-[clamp(48px,6vw,104px)] leading-none">{m.value}</dd>
                  <dt className="mono mt-3">{m.label}</dt>
                </div>
              ))}
            </dl>
          </div>

          <div className="mt-12 border-t border-[color:var(--rule)] pt-8">
            <p className="mono">Format</p>
            <ul className="mt-4 flex flex-wrap gap-3">
              {film.categories.map((c) => (
                <li key={c} className="pill pill-outline px-4 py-1.5 text-[13px]">
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* the match cut */}
      <CutLink
        href={"/film/" + next.slug}
        className="group block border-t border-[color:var(--rule)] bg-[color:var(--stage-2)]"
        data-cursor="Cut"
      >
        <div className="mx-auto flex max-w-[1600px] items-end justify-between gap-8 px-6 py-16 md:px-14 md:py-24">
          <div>
            <p className="mono">Next film {pad2(next.index)}</p>
            <p className="display mt-4 text-[clamp(40px,7vw,120px)] transition-colors duration-300 group-hover:text-white">
              {next.title}
            </p>
            <p className="mono mt-4">{next.client}</p>
          </div>
          <span aria-hidden="true" className="display text-[clamp(40px,7vw,120px)] text-[color:var(--ink-faint)] transition-colors duration-300 group-hover:text-[color:var(--ink)]">
            &#8599;
          </span>
        </div>
      </CutLink>
    </article>
  );
}
