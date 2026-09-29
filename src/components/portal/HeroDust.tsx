"use client";

import { useEffect, useRef } from "react";

/**
 * The air in the room the reel is running in: a shaft of light across the
 * space it is placed in, the way a projector's beam cuts across a dark
 * room, and dust drifting through it -- lit inside the beam, barely there
 * outside it. Move the pointer through it and the dust swirls away from it,
 * as it does when a hand is waved in a beam, then settles back into its
 * drift. On the home page's hero, the door, the rooms' headers and the 404.
 *
 * It fills its container (which must be positioned) and listens for the
 * pointer across all of it. Decoration only: aria-hidden, behind everything
 * in the container, and faint enough that type reads over it as it did
 * (the beam is at most 6.5% ink over the stage). The beam is CSS
 * (.hero-beam), so it is there with no script and under reduced motion;
 * the dust is a canvas drawn only while its container is on screen and the
 * tab is in front, and not at all for a reader who asked for stillness.
 */
const COUNT = 90;
const PUSH = 150; // px: how near the pointer has to come to move the dust
// The beam's geometry, shared with .hero-beam's gradient (144deg): a band
// through the middle of the hero running from the top right down to the
// left, brightest a little past centre.
const NX = Math.sin((144 * Math.PI) / 180);
const NY = -Math.cos((144 * Math.PI) / 180);

type Mote = { x: number; y: number; vx: number; vy: number; r: number; a: number; tw: number };

export function HeroDust() {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = canvas.current;
    // The container this is placed in: the root's parent.
    const zone = cv?.parentElement?.parentElement;
    if (!cv || !zone) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const size = () => {
      w = cv.clientWidth;
      h = cv.clientHeight;
      cv.width = Math.round(w * dpr);
      cv.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    size();

    // A fixed walk rather than Math.random: the same calm field every visit.
    let seed = 7;
    const rand = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };
    // Velocities in px a second: a slow rise, a little sideways wander.
    const motes: Mote[] = Array.from({ length: COUNT }, () => ({
      x: rand() * w,
      y: rand() * h,
      vx: (rand() - 0.5) * 8,
      vy: -3 - rand() * 7,
      r: 0.5 + rand() * 1.3,
      a: 0.25 + rand() * 0.55,
      tw: rand() * Math.PI * 2,
    }));

    // How lit a point is: 1 on the beam's brightest line, 0 outside it.
    const lit = (x: number, y: number) => {
      const len = w * Math.abs(NX) + h * Math.abs(NY);
      const d = (x - w / 2) * NX + (y - h / 2) * NY - 0.02 * len;
      return Math.max(0, 1 - Math.abs(d) / (0.15 * len));
    };

    let px = -9999;
    let py = -9999;
    const move = (e: PointerEvent) => {
      const r = cv.getBoundingClientRect();
      px = e.clientX - r.left;
      py = e.clientY - r.top;
    };
    const leave = () => {
      px = -9999;
      py = -9999;
    };
    zone.addEventListener("pointermove", move, { passive: true });
    zone.addEventListener("pointerleave", leave);

    let on = false;
    let raf = 0;
    let last = 0;
    const draw = (now: number) => {
      raf = 0;
      if (!on || document.hidden) return;
      const dt = Math.min(0.064, (now - last) / 1000);
      last = now;
      // How much of the push is left after this frame (it dies away in about a second).
      const keep = Math.exp(-dt / 0.9);
      ctx.clearRect(0, 0, w, h);
      for (const m of motes) {
        const dx = m.x - px;
        const dy = m.y - py;
        const dd = Math.hypot(dx, dy);
        if (dd < PUSH && dd > 0.5) {
          const f = (1 - dd / PUSH) * 1800 * dt;
          m.vx += (dx / dd) * f;
          m.vy += (dy / dd) * f;
        }
        // Back toward the drift: a slow rise and a little wander.
        m.vx = m.vx * keep + ((rand() - 0.5) * 6) * (1 - keep);
        m.vy = m.vy * keep + (-6 + (rand() - 0.5) * 4) * (1 - keep);
        m.x += m.vx * dt;
        m.y += m.vy * dt;
        if (m.y < -4) m.y = h + 4;
        else if (m.y > h + 4) m.y = -4;
        if (m.x < -4) m.x = w + 4;
        else if (m.x > w + 4) m.x = -4;
        m.tw += dt * 1.8;
        const l = lit(m.x, m.y);
        const alpha = m.a * (0.1 + l * 0.9) * (0.75 + 0.25 * Math.sin(m.tw));
        if (alpha < 0.02) continue;
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.r * (1 + l * 0.45), 0, Math.PI * 2);
        ctx.fillStyle = "rgba(242, 239, 233, " + alpha.toFixed(3) + ")";
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    const start = () => {
      if (raf || !on || document.hidden) return;
      last = performance.now();
      raf = requestAnimationFrame(draw);
    };

    const io = new IntersectionObserver((entries) => {
      on = entries.some((e) => e.isIntersecting);
      start();
    });
    io.observe(zone);
    const vis = () => start();
    document.addEventListener("visibilitychange", vis);
    const ro = new ResizeObserver(() => {
      size();
      for (const m of motes) {
        m.x = Math.min(m.x, w);
        m.y = Math.min(m.y, h);
      }
    });
    ro.observe(cv);

    return () => {
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", vis);
      zone.removeEventListener("pointermove", move);
      zone.removeEventListener("pointerleave", leave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <div className="hero-beam absolute inset-0" />
      <canvas ref={canvas} className="absolute inset-0 h-full w-full" />
    </div>
  );
}
