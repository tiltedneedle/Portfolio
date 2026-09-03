"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { timecode } from "@/lib/films";

/**
 * The slate. Once per device the site opens on a clapperboard: production,
 * reel, scene, take, and a timecode that is actually running. Two seconds,
 * then one black frame, then the cold open is simply there.
 *
 * Rendered by the server so there is never a flash of the page beneath it;
 * a layout effect removes it before first paint for anyone who has seen it,
 * and for anyone who prefers reduced motion. Escape, click or SKIP cut early.
 */
const KEY = "tn-slate-seen";
const RUN_MS = 2200;
const BLACK_MS = 160;

type Phase = "slate" | "black" | "done";

export function Slate() {
  const [phase, setPhase] = useState<Phase>("slate");
  const tc = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    let seen = false;
    try {
      seen = Boolean(localStorage.getItem(KEY));
    } catch {
      seen = false;
    }
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Deliberately synchronous: this must land before first paint.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (seen || reduced) setPhase("done");
  }, []);

  useEffect(() => {
    if (phase !== "slate") return;
    document.body.style.overflow = "hidden";
    const start = performance.now();
    let raf = 0;
    const tick = () => {
      if (tc.current) tc.current.textContent = timecode((performance.now() - start) / 1000);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const t = setTimeout(() => setPhase("black"), RUN_MS);
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPhase("black");
    };
    window.addEventListener("keydown", key);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t);
      window.removeEventListener("keydown", key);
      document.body.style.overflow = "";
    };
  }, [phase]);

  useEffect(() => {
    if (phase !== "black") return;
    try {
      localStorage.setItem(KEY, "1");
    } catch {
      // private mode: the slate simply plays again next time
    }
    const t = setTimeout(() => setPhase("done"), BLACK_MS);
    return () => clearTimeout(t);
  }, [phase]);

  if (phase === "done") return null;

  return (
    <div
      className="fixed inset-0 z-[9996] bg-black text-[color:var(--ink)]"
      onClick={() => setPhase("black")}
      aria-hidden={phase === "black"}
    >
      {phase === "slate" && (
        <div className="flex h-full w-full items-center justify-center px-6">
          <div className="w-full max-w-[760px]">
            {/* the clapper stripe */}
            <div
              aria-hidden="true"
              className="h-4 w-full"
              style={{
                background:
                  "repeating-linear-gradient(-45deg, var(--ink) 0 22px, transparent 22px 44px)",
              }}
            />

            <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-3 border-y border-[color:var(--rule-strong)] py-4 mono-lg text-[color:var(--ink-soft)]">
              <div>
                <span className="text-[color:var(--ink-mid)]">Prod.</span> Tilted Needle
              </div>
              <div className="text-right">
                <span className="text-[color:var(--ink-mid)]">Reel</span> 2026
              </div>
              <div>
                <span className="text-[color:var(--ink-mid)]">Scene</span> 01
              </div>
              <div className="text-right">
                <span className="text-[color:var(--ink-mid)]">Take</span> 01
              </div>
            </div>

            <p className="display mt-8 text-[clamp(72px,16vw,220px)] leading-[0.86]">
              Tilted
              <br />
              Needle
            </p>

            <div className="mt-8 flex items-center justify-between border-t border-[color:var(--rule-strong)] pt-4">
              <p className="mono-lg text-[color:var(--ink-soft)]">
                <span className="text-[color:var(--ink-mid)]">TC</span>{" "}
                <span ref={tc} className="tc">
                  00:00:00:00
                </span>
              </p>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setPhase("black");
                }}
                className="slate-link"
              >
                Skip &rarr;
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
