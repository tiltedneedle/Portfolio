"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { timecode } from "@/lib/timecode";
import { mmss } from "@/lib/words";
import { useFocusTrap } from "@/lib/use-focus-trap";

/**
 * The prompter. A script, full screen, in type large enough to read from
 * behind a phone on a tripod, scrolling at a walking pace past a reading
 * line. Space plays and pauses, the arrows change the pace, plus and minus
 * the size, M mirrors it for a glass rig, R rewinds, Escape closes.
 * Nothing is stored; every opening starts at the top.
 */
type Props = { title: string; hook?: string; body: string[]; cta?: string; spoken?: number };

export function Prompter({ title, hook, body, cta, spoken }: Props) {
  const [open, setOpen] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(36); // px per second
  const [size, setSize] = useState(44);
  const [mirror, setMirror] = useState(false);
  const scroller = useRef<HTMLDivElement>(null);
  const tc = useRef<HTMLSpanElement>(null);
  const elapsed = useRef(0);
  const box = useRef<HTMLDivElement>(null);
  useFocusTrap(open, box);

  // The scroll loop: position advances by speed × dt while playing.
  useEffect(() => {
    if (!open || !playing) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      const el = scroller.current;
      if (el) {
        el.scrollTop += speed * dt;
        elapsed.current += dt;
        if (tc.current) tc.current.textContent = timecode(elapsed.current);
        if (el.scrollTop + el.clientHeight >= el.scrollHeight - 1) setPlaying(false);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [open, playing, speed]);

  const rewind = useCallback(() => {
    if (scroller.current) scroller.current.scrollTop = 0;
    elapsed.current = 0;
    if (tc.current) tc.current.textContent = timecode(0);
    setPlaying(false);
  }, []);

  // Opening always starts from the top, in standby.
  const start = () => {
    elapsed.current = 0;
    setPlaying(false);
    setOpen(true);
  };

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    if (scroller.current) scroller.current.scrollTop = 0;
    if (tc.current) tc.current.textContent = timecode(0);
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      else if (e.key === " ") {
        e.preventDefault();
        setPlaying((p) => !p);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSpeed((s) => Math.min(160, s + 6));
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSpeed((s) => Math.max(6, s - 6));
      } else if (e.key === "+" || e.key === "=") setSize((s) => Math.min(96, s + 4));
      else if (e.key === "-" || e.key === "_") setSize((s) => Math.max(24, s - 4));
      else if (e.key.toLowerCase() === "m") setMirror((m) => !m);
      else if (e.key.toLowerCase() === "r") rewind();
    };
    window.addEventListener("keydown", key);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", key);
    };
  }, [open, rewind]);

  return (
    <>
      <button type="button" onClick={start} className="pill pill-outline px-6 py-3 text-[15px]" data-cursor="Play">
        Prompter &#9654;
      </button>

      {open && (
        <div ref={box} className="fixed inset-0 z-[95] flex flex-col bg-black text-[color:var(--ink)]" role="dialog" aria-modal="true" aria-label="Prompter">
          {/* HUD */}
          <div className="mono flex items-center justify-between border-b border-[color:var(--rule)] px-5 py-3 md:px-8">
            <span className="flex items-center gap-2">
              <span className={playing ? "lamp" : "lamp-off"} aria-hidden="true" />
              {playing ? "Rolling" : "Standby"}
              <span ref={tc} className="tc ml-3">
                00:00:00:00
              </span>
              {spoken ? <span className="ml-3 hidden text-[color:var(--ink-faint)] sm:inline">&asymp; {mmss(spoken)} spoken</span> : null}
            </span>
            <span className="hidden gap-5 md:flex">
              <span>
                {speed} <span className="text-[color:var(--ink-faint)]">px/s</span>
              </span>
              <span>
                {size} <span className="text-[color:var(--ink-faint)]">px</span>
              </span>
              <span className={mirror ? "text-[color:var(--ink)]" : "text-[color:var(--ink-faint)]"}>Mirror</span>
            </span>
            <button type="button" onClick={() => setOpen(false)} className="slate-link text-[color:var(--ink)]" data-cursor="Cut">
              Close
            </button>
          </div>

          {/* the reading line */}
          <div className="relative flex-1 overflow-hidden">
            <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-[38%] z-10 h-px bg-[color:var(--tally)] shadow-[0_0_10px_var(--tally-glow)]" />
            <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 z-[5] h-[30%] bg-gradient-to-b from-black to-transparent" />
            <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-[30%] bg-gradient-to-t from-black to-transparent" />
            <div
              ref={scroller}
              className="h-full overflow-y-auto px-6 md:px-14"
              style={{ transform: mirror ? "scaleX(-1)" : undefined, scrollbarWidth: "none" }}
            >
              <div className="mx-auto max-w-[26ch] pb-[70vh] pt-[38vh]" style={{ fontSize: size, lineHeight: 1.3 }}>
                <p className="mono mb-8" style={{ fontSize: 12 }}>
                  {title}
                </p>
                {hook && <p className="em-serif mb-[1.2em] text-[color:var(--ink)]">{hook}</p>}
                {body.map((p, i) => (
                  <p key={i} className="mb-[1em]">
                    {p}
                  </p>
                ))}
                {cta && <p className="mt-[1.4em] text-[color:var(--ink-soft)]">{cta}</p>}
              </div>
            </div>
          </div>

          {/* transport */}
          <div className="mono flex flex-wrap items-center justify-between gap-4 border-t border-[color:var(--rule)] px-5 py-3 md:px-8">
            <div className="flex items-center gap-4">
              <button type="button" onClick={() => setPlaying((p) => !p)} className="pill pill-solid px-5 py-2 text-[13px]">
                {playing ? "Pause" : "Roll"}
              </button>
              <button type="button" onClick={rewind} className="slate-link">
                Rewind
              </button>
              <button type="button" onClick={() => setSpeed((s) => Math.max(6, s - 6))} className="slate-link" aria-label="Slower">
                Slower
              </button>
              <button type="button" onClick={() => setSpeed((s) => Math.min(160, s + 6))} className="slate-link" aria-label="Faster">
                Faster
              </button>
              <button type="button" onClick={() => setSize((s) => Math.max(24, s - 4))} className="slate-link" aria-label="Smaller type">
                A&minus;
              </button>
              <button type="button" onClick={() => setSize((s) => Math.min(96, s + 4))} className="slate-link" aria-label="Larger type">
                A+
              </button>
              <button type="button" onClick={() => setMirror((m) => !m)} className="slate-link" aria-pressed={mirror}>
                Mirror
              </button>
            </div>
            <span className="hidden text-[color:var(--ink-faint)] lg:inline">Space roll &middot; &uarr;&darr; pace &middot; + &minus; size &middot; M mirror &middot; R rewind &middot; Esc close</span>
          </div>
        </div>
      )}
    </>
  );
}
